# RangRasta — Jaipur Travel Guide

A full-stack RangRasta app: a React (via CDN, no build step) frontend served by a
small Node/Express backend that owns all the data and logic. This revision removes
the storytelling/"immersive audio" gimmicks and paid-ad placements in favor of
practical info (hours, entry fees, directions), a wider set of places, and a
properly working "More" section.

## What's in this revision

- **No repeated images** — every place/festival card renders a unique, generated
  gradient + icon (deterministic per id), so nothing reuses another place's picture.
- **No paid ads** — the old `sponsored` flag/"Ad" badge is gone entirely.
- **23 places** across historical sites, temples, museums, bazaars, food, cinema,
  arts and parks/nature (up from 10), each with real hours/entry fee/best-time info.
- **Basic info instead of storytelling** — place details show Overview / Hours /
  Entry Fee / Best Time / a real "Get Directions" link (Google Maps), not narrated
  audio chapters or 3D animations.
- **Smarter AI Tour Planner** — days slider, a ₹1,500–₹40,000+ budget slider, a
  pace selector (Relaxed/Balanced/Packed), multi-select interest chips, and a
  "Travelling With" field, all wired into the itinerary generator on the backend.
- **A working "More" tab** — History of Jaipur, Ticket Bookings, Travel & Hotel
  Bookings, and Contact Us all open real panels backed by their own API endpoints,
  instead of `alert()` placeholders.

Data is stored in a simple JSON file (`data/db.json`, created automatically on first
run) — no external database setup required.

## Project structure

```
rangrasta/
  server.js              Express app: API routes + serves the frontend
  package.json
  data/
    places.js            23 places (was PLACES in the frontend)
    festivals.js         Festivals & events
    calendar.js          City calendar data (month-by-month weather/tips)
    history.js           Basic facts about Jaipur (founding, planning, UNESCO status)
    travel.js            Getting there, getting around, hotel-tier info
    contact.js           Emergency numbers, tourist helpline, office info
    db.json              Auto-created at runtime: users, saved itineraries,
                          SOS alerts, contact-form messages
  public/
    index.html           The frontend (calls the API, no mock data)
```

## Running it

You'll need [Node.js](https://nodejs.org) 16 or later installed.

```bash
cd rangrasta
npm install
npm start
```

Then open **http://localhost:3000** in your browser — one server, one port, serving
both the site and its API.

To run on a different port: `PORT=8080 npm start`.

## API reference

- `GET /api/places?type=historical&search=fort&interest=Photography&minRating=4.5`
- `GET /api/places/:id`
- `GET /api/festivals`
- `GET /api/calendar`
- `GET /api/history` — quick facts + basic history sections
- `GET /api/travel` — getting there / getting around / hotel tiers
- `GET /api/contact` — emergency numbers, tourist helpline, office info
- `POST /api/contact/message` — `{ name, email, message }`, stored server-side
- `POST /api/auth/signup` — `{ name, touristType, language }` → `{ user }` (includes a `token`)
- `GET /api/auth/me` — requires `Authorization: Bearer <token>`
- `POST /api/planner/generate` — `{ days, budget (₹), pace, interests[], companions }` → `{ itinerary }`
- `POST /api/planner/save` — requires auth
- `GET /api/planner/mine` — requires auth, returns the logged-in user's saved plans
- `POST /api/sos` — `{ location? }` → logs and returns an alert confirmation

## Notes / next steps if you keep building this

- Auth is intentionally lightweight (no passwords), matching the original app's
  design — anyone can "sign up" with just a name. Add real authentication before
  this ever handles anything sensitive.
- The itinerary generator is rule-based (matches interests + budget, then ranks by
  rating). It's a good foundation to swap in a real LLM call later — the API shape
  (`POST /api/planner/generate`) won't need to change on the frontend side.
- `data/db.json` is plain-text JSON for simplicity. For production, swap it for
  SQLite/Postgres — the `readDB`/`writeDB` functions in `server.js` are the only
  place that would need to change.
- Card art is generated (CSS gradient + icon) instead of stock photography, which
  is what guarantees no two places ever show the same picture. Swap `CardArt` in
  `public/index.html` for real photos later if you have licensed images per place.
