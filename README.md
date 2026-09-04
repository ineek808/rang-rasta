# RangRasta — Jaipur Travel Guide

A full-stack RangRasta app: a React (via CDN, no build step) frontend served by a
small Node/Express backend that owns all the data and logic — real places, festivals,
a rule-based AI Tour Planner, and a working SOS/contact flow.

## Features

- **23 places** across historical sites, temples, museums, bazaars, food, cinema,
  arts and parks/nature, each with hours, entry fee, and best-time-to-visit info.
- **AI Tour Planner** — days slider, ₹1,500–₹40,000+ budget slider, pace selector
  (Relaxed/Balanced/Packed), multi-select interest chips, and a "Travelling With"
  field, all wired into a rule-based itinerary generator on the backend.
- **A working "More" tab** — History of Jaipur, Ticket Bookings, Travel & Hotel
  Bookings, and Contact Us all open real panels backed by their own API endpoints.
- **Generated card art** — every place/festival gets a unique gradient + icon
  (deterministic per id), so nothing reuses another place's picture, and no stock
  photography or paid placements.

Data is stored in a simple JSON file (`data/db.json`, created automatically on first
run, and gitignored) — no external database setup required.

## Project structure

```
rangrasta/
  server.js              Express app: API routes + serves the frontend
  server.test.js         Jest/Supertest test suite
  package.json
  .env.example           Template for local environment variables
  data/
    places.js            23 places
    festivals.js         Festivals & events
    calendar.js          City calendar data (month-by-month weather/tips)
    history.js           Basic facts about Jaipur (founding, planning, UNESCO status)
    travel.js            Getting there, getting around, hotel-tier info
    contact.js           Emergency numbers, tourist helpline, office info
    db.json              Auto-created at runtime: users, saved itineraries,
                          SOS alerts, contact-form messages (gitignored)
  public/
    index.html            The frontend (calls the API, no mock data)
```

## Running it

You'll need [Node.js](https://nodejs.org) 16 or later installed.

```bash
git clone https://github.com/ineek808/rang-rasta.git
cd rang-rasta
npm install
cp .env.example .env
npm start
```

Then open **http://localhost:3000** in your browser — one server, one port, serving
both the site and its API.

### Environment variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable         | Default                 | Purpose                                   |
|-------------------|--------------------------|--------------------------------------------|
| `PORT`            | `3000`                   | Port the server listens on                |
| `ALLOWED_ORIGIN`   | `http://localhost:3000`  | Only this origin is allowed by CORS       |

`.env` is gitignored and never committed — only `.env.example` (no real values) is.

## Running tests

```bash
npm test
```
Runs the Jest/Supertest suite in `server.test.js` against the Express app directly
(no live server needed). Covers the core routes: places, festivals, signup
validation, and itinerary generation.

## API reference

- `GET /api/places?type=historical&search=fort&interest=Photography&minRating=4.5`
- `GET /api/places/:id`
- `GET /api/festivals`
- `GET /api/calendar`
- `GET /api/history` — quick facts + basic history sections
- `GET /api/travel` — getting there / getting around / hotel tiers
- `GET /api/contact` — emergency numbers, tourist helpline, office info
- `POST /api/contact/message` — `{ name, email, message }`, rate-limited, stored server-side
- `POST /api/auth/signup` — `{ name, touristType, language }` → `{ user }` (includes a `token`)
- `GET /api/auth/me` — requires `Authorization: Bearer <token>`
- `POST /api/planner/generate` — `{ days, budget (₹), pace, interests[], companions }` → `{ itinerary }`
- `POST /api/planner/save` — requires auth
- `GET /api/planner/mine` — requires auth, returns the logged-in user's saved plans
- `POST /api/sos` — `{ location? }` → rate-limited, logs and returns an alert confirmation

## Security notes

- **CORS** is restricted to `ALLOWED_ORIGIN` (see `.env`), not open to all origins.
- **Rate limiting** (5 requests/minute per IP) is applied to `/api/sos` and
  `/api/contact/message` to prevent abuse.
- **Auth is intentionally lightweight** (no passwords), matching the original app's
  design — anyone can "sign up" with just a name. Add real authentication (hashed
  passwords, or a provider like OAuth) before this ever handles anything sensitive.

## Notes / next steps if you keep building this

- The itinerary generator is rule-based (matches interests + budget, then ranks by
  rating). It's a good foundation to swap in a real LLM call later — the API shape
  (`POST /api/planner/generate`) won't need to change on the frontend side.
- `data/db.json` is plain-text JSON for simplicity. For production, swap it for
  SQLite/Postgres — the `readDB`/`writeDB` functions in `server.js` are the only
  place that would need to change.
- Card art is generated (CSS gradient + icon) instead of stock photography. Swap
  `CardArt` in `public/index.html` for real photos later if you have licensed
  images per place.
- Test coverage is a starting skeleton (5 tests on core routes) — add more as you
  add routes or logic.

## License

MIT — see [LICENSE](./LICENSE).
