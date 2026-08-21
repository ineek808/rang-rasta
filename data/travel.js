// Getting-to/around-Jaipur and hotel-category info, served via /api/travel.
// Informational only — no sponsored properties or paid placements.

const TRAVEL = {
    gettingThere: [
        { mode: "Air", icon: "plane", info: "Jaipur International Airport (JAI) is about 13 km from the city center, with direct flights from most major Indian cities and a few international routes.", link: "https://www.aai.aero/en/airports/jaipur" },
        { mode: "Rail", icon: "train", info: "Jaipur Junction is well connected to Delhi, Agra, Mumbai and Udaipur, including fast trains on the Golden Triangle route.", link: "https://www.irctc.co.in" },
        { mode: "Road", icon: "bus", info: "Regular RSRTC (Rajasthan Roadways) and private buses connect Jaipur with Delhi (~5–6 hrs) and other Rajasthan cities via NH48.", link: "https://www.rsrtc.rajasthan.gov.in" }
    ],
    localTransport: [
        { mode: "Auto-rickshaw", icon: "auto", info: "Widely available; agree on a fare or insist on the meter before starting your ride." },
        { mode: "App-based Cabs", icon: "cab", info: "Ride-hailing apps operate across the city and are a convenient, fixed-price option." },
        { mode: "City Bus (JCTSL)", icon: "bus", info: "Low-cost city buses cover most major routes; look for the Jaipur City Transport Services Ltd. livery." },
        { mode: "Jaipur Metro", icon: "metro", info: "A single operational line runs from Mansarovar to Chandpole, useful for the walled city and central areas." },
        { mode: "Rented Scooter/Bike", icon: "auto", info: "Self-drive rentals are available for travelers comfortable with Indian traffic conditions." }
    ],
    hotelCategories: [
        { tier: "Budget", range: "₹800 – ₹2,500 / night", info: "Hostels and simple guesthouses, often in the old city near the bazaars — good for backpackers and solo travelers." },
        { tier: "Mid-range", range: "₹2,500 – ₹7,000 / night", info: "Comfortable 3-star hotels and boutique heritage haveli stays with modern amenities." },
        { tier: "Luxury", range: "₹7,000+ / night", info: "5-star hotels and palace properties, some inside restored royal residences, offering full-service stays." }
    ],
    officialLinks: [
        { label: "Rajasthan Tourism (official)", url: "https://www.tourism.rajasthan.gov.in" },
        { label: "Incredible India (Govt. of India)", url: "https://www.incredibleindia.gov.in" }
    ]
};

module.exports = TRAVEL;
