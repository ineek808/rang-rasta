const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const PLACES = require('./data/places');
const FESTIVALS = require('./data/festivals');
const CALENDAR_DATA = require('./data/calendar');
const HISTORY = require('./data/history');
const TRAVEL = require('./data/travel');
const CONTACT = require('./data/contact');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// Tiny file-based "database" (no external DB needed for this project).
// Stores signed-up users, saved itineraries, SOS alerts, and contact
// messages in a JSON file so nothing is lost between server restarts.
// ---------------------------------------------------------------------------
function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        return { users: [], itineraries: [], sosAlerts: [], contactMessages: [] };
    }
    try {
        const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        db.users = db.users || [];
        db.itineraries = db.itineraries || [];
        db.sosAlerts = db.sosAlerts || [];
        db.contactMessages = db.contactMessages || [];
        return db;
    } catch (err) {
        console.error('Failed to read db.json, starting fresh:', err.message);
        return { users: [], itineraries: [], sosAlerts: [], contactMessages: [] };
    }
}

function writeDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function findUserByToken(token) {
    if (!token) return null;
    const db = readDB();
    return db.users.find(u => u.token === token) || null;
}

// Attaches req.user if a valid Bearer token is supplied. Auth is optional
// for most routes and required only for saving itineraries / SOS history.
function attachUser(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    req.user = findUserByToken(token);
    next();
}
app.use(attachUser);

function requireUser(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Login required' });
    next();
}

// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------
app.post('/api/auth/signup', (req, res) => {
    const { name, touristType, language } = req.body || {};
    if (!name || !String(name).trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const db = readDB();
    const user = {
        id: crypto.randomUUID(),
        name: String(name).trim(),
        touristType: touristType === 'international' ? 'international' : 'domestic',
        language: ['english', 'hindi', 'french', 'spanish'].includes(language) ? language : 'english',
        token: crypto.randomBytes(24).toString('hex'),
        createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);

    res.json({ user });
});

app.get('/api/auth/me', requireUser, (req, res) => {
    res.json({ user: req.user });
});

// ---------------------------------------------------------------------------
// PLACES
// Supports: type filter, "near_me" (<5km), free-text search, min rating,
// and an "interest" filter used by both Explore and the AI planner.
// ---------------------------------------------------------------------------
app.get('/api/places', (req, res) => {
    const { type, search, interest, minRating } = req.query;
    let results = [...PLACES];

    if (type && type !== 'all') {
        if (type === 'near_me') {
            results = results.filter(p => p.distance < 5.0);
        } else {
            results = results.filter(p => p.type === type);
        }
    }

    if (interest) {
        results = results.filter(p => (p.interests || []).includes(interest));
    }

    if (minRating) {
        const min = parseFloat(minRating);
        if (!Number.isNaN(min)) results = results.filter(p => p.rating >= min);
    }

    if (search) {
        const q = String(search).toLowerCase();
        results = results.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q)) ||
            p.type.toLowerCase().includes(q)
        );
    }

    if (['near_me', 'market', 'eat'].includes(type)) {
        results.sort((a, b) => a.distance - b.distance);
    }

    res.json({ places: results });
});

app.get('/api/places/:id', (req, res) => {
    const place = PLACES.find(p => p.id === Number(req.params.id));
    if (!place) return res.status(404).json({ error: 'Place not found' });
    res.json({ place });
});

// ---------------------------------------------------------------------------
// FESTIVALS & CALENDAR
// ---------------------------------------------------------------------------
app.get('/api/festivals', (req, res) => {
    res.json({ festivals: FESTIVALS });
});

app.get('/api/calendar', (req, res) => {
    res.json({ calendar: CALENDAR_DATA });
});

// ---------------------------------------------------------------------------
// HISTORY / TRAVEL / CONTACT (static reference info for the "More" tab)
// ---------------------------------------------------------------------------
app.get('/api/history', (req, res) => {
    res.json(HISTORY);
});

app.get('/api/travel', (req, res) => {
    res.json(TRAVEL);
});

app.get('/api/contact', (req, res) => {
    res.json(CONTACT);
});

app.post('/api/contact/message', (req, res) => {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email and message are all required' });
    }
    const db = readDB();
    const entry = {
        id: crypto.randomUUID(),
        name: String(name).trim(),
        email: String(email).trim(),
        message: String(message).trim(),
        submittedAt: new Date().toISOString()
    };
    db.contactMessages.push(entry);
    writeDB(db);
    res.json({ message: 'Thanks — your message has been received. Our team will get back to you shortly.' });
});

// ---------------------------------------------------------------------------
// AI TOUR PLANNER
// Builds a real plan from the places data, respecting days, a rupee budget,
// pace (stops per day), chosen interests, and who the traveler is with.
// ---------------------------------------------------------------------------
const PRICE_RANK = { '$': 1, '$$': 2, '$$$': 3 };
const PACE_STOPS = { relaxed: 3, balanced: 4, packed: 5 };
const TIME_SLOTS = ['08:30 AM', '11:00 AM', '01:30 PM', '04:00 PM', '06:30 PM'];

function budgetCeiling(budgetINR) {
    const n = parseInt(budgetINR, 10) || 8000;
    if (n <= 3000) return '$';
    if (n <= 15000) return '$$';
    return '$$$';
}

function generateItineraryPlan({ days: rawDays, budget: rawBudget, pace: rawPace, interests, companions }) {
    const days = Math.min(Math.max(parseInt(rawDays, 10) || 1, 1), 7);
    const ceiling = budgetCeiling(rawBudget);
    const pace = PACE_STOPS[rawPace] ? rawPace : 'balanced';
    const stopsPerDay = PACE_STOPS[pace];
    const chosenInterests = Array.isArray(interests) && interests.length ? interests : null;

    const withinBudget = p => PRICE_RANK[p.price] <= PRICE_RANK[ceiling];
    const matchesInterest = p => !chosenInterests || (p.interests || []).some(i => chosenInterests.includes(i));

    // Preference-ranked pools: interest + budget matches first, then a
    // budget-only fallback so short trips never come back empty.
    const rankPool = (predicate) => {
        const preferred = PLACES.filter(p => predicate(p) && matchesInterest(p) && withinBudget(p)).sort((a, b) => b.rating - a.rating);
        const fallback = PLACES.filter(p => predicate(p) && withinBudget(p)).sort((a, b) => b.rating - a.rating);
        const seen = new Set();
        return [...preferred, ...fallback].filter(p => (seen.has(p.id) ? false : (seen.add(p.id), true)));
    };

    const sights = rankPool(p => ['historical', 'museum', 'temple', 'nature'].includes(p.type));
    const eats = rankPool(p => p.type === 'eat');
    const markets = rankPool(p => p.type === 'market');
    const evenings = rankPool(p => ['arts', 'cinema'].includes(p.type));

    const usedSights = new Set();
    const itinerary = {};

    for (let d = 0; d < days; d++) {
        const dayPlan = [];
        let slot = 0;

        // Fill most of the day with sights (heritage/temples/nature), rotating
        // through markets once the interest-matched sights run low.
        const sightSlots = Math.max(stopsPerDay - 2, 1);
        for (let s = 0; s < sightSlots && slot < stopsPerDay - 1; s++) {
            let pick = sights.find(p => !usedSights.has(p.id));
            if (!pick && markets.length) pick = markets[(d + s) % markets.length];
            if (!pick) break;
            usedSights.add(pick.id);
            dayPlan.push({
                time: TIME_SLOTS[slot] || TIME_SLOTS[TIME_SLOTS.length - 1],
                activity: pick.type === 'market' ? `Shopping at ${pick.name}` : `Visit ${pick.name}`,
                desc: pick.desc,
                placeId: pick.id
            });
            slot++;
        }

        // Lunch
        if (eats.length) {
            const lunch = eats[d % eats.length];
            dayPlan.push({ time: TIME_SLOTS[slot] || TIME_SLOTS[TIME_SLOTS.length - 1], activity: `Lunch at ${lunch.name}`, desc: lunch.desc, placeId: lunch.id });
            slot++;
        }

        // Evening: arts/cinema for "Nightlife" & "Art & crafts" interests, otherwise a market or another sight
        const eveningPick = evenings.length ? evenings[d % evenings.length] : (markets.length ? markets[d % markets.length] : null);
        if (eveningPick) {
            dayPlan.push({ time: TIME_SLOTS[TIME_SLOTS.length - 1], activity: eveningPick.name, desc: eveningPick.desc, placeId: eveningPick.id });
        }

        itinerary[`day${d + 1}`] = dayPlan;
    }

    return { itinerary, days, budgetINR: parseInt(rawBudget, 10) || 8000, pace, interests: chosenInterests || [], companions: companions || 'solo' };
}

app.post('/api/planner/generate', (req, res) => {
    const { days, budget, pace, interests, companions } = req.body || {};
    // Small delay so the loading state still feels real.
    setTimeout(() => {
        const result = generateItineraryPlan({ days, budget, pace, interests, companions });
        res.json(result);
    }, 500);
});

app.post('/api/planner/save', requireUser, (req, res) => {
    const { itinerary, days, budgetINR, pace, interests, companions } = req.body || {};
    if (!itinerary) return res.status(400).json({ error: 'Itinerary is required' });

    const db = readDB();
    const saved = {
        id: crypto.randomUUID(),
        userId: req.user.id,
        itinerary,
        days: days || Object.keys(itinerary).length,
        budgetINR: budgetINR || 8000,
        pace: pace || 'balanced',
        interests: interests || [],
        companions: companions || 'solo',
        savedAt: new Date().toISOString()
    };
    db.itineraries.push(saved);
    writeDB(db);

    res.json({ saved });
});

app.get('/api/planner/mine', requireUser, (req, res) => {
    const db = readDB();
    const mine = db.itineraries.filter(it => it.userId === req.user.id);
    res.json({ itineraries: mine });
});

// ---------------------------------------------------------------------------
// SOS
// ---------------------------------------------------------------------------
app.post('/api/sos', (req, res) => {
    const db = readDB();
    const alert = {
        id: crypto.randomUUID(),
        userId: req.user ? req.user.id : null,
        userName: req.user ? req.user.name : 'Guest',
        triggeredAt: new Date().toISOString(),
        location: (req.body && req.body.location) || 'Unknown (location sharing simulated)'
    };
    db.sosAlerts.push(alert);
    writeDB(db);

    res.json({ message: 'SOS alert sent to emergency services. Stay where you are if it is safe to do so.', alert });
});

// ---------------------------------------------------------------------------
// SPA fallback — anything not matched above serves the frontend so client
// side routing (if any is added later) still works.
// ---------------------------------------------------------------------------
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`RangRasta server running at http://localhost:${PORT}`);
});
