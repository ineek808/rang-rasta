# Rang Rasta :)

*Experience True Jaipur*

A web app for people visiting Jaipur for the first time. It puts the things a tourist
usually has to hunt for across five different sites into one place.

Live demo: https://rang-rasta-dmdv.onrender.com

(It runs on a free server that goes to sleep when nobody's using it, so the first load
can take up to a minute. After that it's quick.)

![Home page](screenshots/landing_page.png)

## why i made this

Finding basic information about Jaipur shouldn't take five different websites. I
built Rang Rasta to put it all in one place, and to learn how a full app fits
together while I was at it, from the Express backend to the React frontend.

## what it does

- lists 23 places (forts, temples, museums, bazaars, food spots, parks and more) with
  hours, entry fees and the best time to visit
- has a festival and event list, plus a month-by-month city calendar
- gives a short history of Jaipur
- has a tour planner: pick the number of days, your budget, your pace and your interests,
  and it builds an itinerary for you
- lets you save your itineraries once you've logged in
- covers ticket bookings and travel and hotel guidance
- has an SOS button, helpline numbers and tourist police info
- has a contact form for the tourism office
- asks at login whether you're a domestic or international traveller, and which language you prefer

## built with

- React (loaded through a CDN, so there's no build step) for the frontend
- Node.js and Express for the backend
- a JSON file for storage
- Jest and Supertest for tests

One server handles both the website and the API.

## design notes

The colours come from Jaipur's Pink City look. I kept the SOS option easy to reach
because it's the one feature nobody should have to search for. Every place gets its own
generated card art (a gradient and an icon) instead of stock photos, so nothing
reuses another place's picture.

## how the planner works

The tour planner is rule-based, not real AI. It filters places by your interests and
budget, then ranks them by rating. I built it this way so the API would stay the same
if I swap in a real language model later.

## what's not finished

- login has no passwords. Anyone can sign up with just a name. It's fine for a demo
  but not for anything sensitive.
- data is stored in a plain JSON file, and on the free server it resets whenever the app
  restarts or redeploys.
- the language you pick at login isn't used to translate the site yet.

## next on my list

- make the language switch really work (English and Hindi first)
- add a map with all the attractions pinned
- move from the JSON file to a real database (SQLite or Postgres)
- add proper login with hashed passwords

## run it yourself

You need Node.js 16 or later.

```bash
git clone https://github.com/ineek808/rang-rasta.git
cd rang-rasta
npm install
cp .env.example .env
npm start
```

Then open http://localhost:3000. That's all, since one server does everything.

### environment variables

| Variable         | Default                 | What it does                          |
|------------------|-------------------------|---------------------------------------|
| `PORT`           | `3000`                  | port the server listens on            |
| `ALLOWED_ORIGIN` | `http://localhost:3000` | the only origin CORS lets through     |

`.env` is gitignored. Only `.env.example` is committed.

## tests

```bash
npm test
```

Runs the tests in `server.test.js` against the Express app directly, with no live server
needed. They cover the core routes: places, festivals, signup validation and itinerary
generation.

## API

- `GET /api/places` (filters: `type`, `search`, `interest`, `minRating`)
- `GET /api/places/:id`
- `GET /api/festivals`
- `GET /api/calendar`
- `GET /api/history`
- `GET /api/travel`
- `GET /api/contact`
- `POST /api/contact/message` (rate limited)
- `POST /api/auth/signup`
- `GET /api/auth/me` (needs a token)
- `POST /api/planner/generate`
- `POST /api/planner/save` (needs a token)
- `GET /api/planner/mine` (needs a token)
- `POST /api/sos` (rate limited)

## a note on safety

CORS is limited to one allowed origin, and the SOS and contact endpoints are rate limited
to 5 requests a minute per IP so they can't be spammed.

## project structure

```
server.js          Express app: API routes, and it serves the frontend
server.test.js     tests
.env.example       template for environment variables
data/              places, festivals, calendar, history, travel, contact info
                   (db.json is created at runtime and gitignored)
public/index.html  the frontend
```

## license

MIT. See [LICENSE](./LICENSE).

~ made in Jaipur's colours, with a lot of tea :)
