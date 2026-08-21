// Festival data for RangRasta, served via /api/festivals.
// `icon` drives a unique generated card image on the frontend (no stock photos to repeat).

const FESTIVALS = [
    { name: "Makar Sankranti (Kite Festival)", month: "January 14", icon: "kite", desc: "The sky fills with colorful kites from dawn to dusk, with rooftop kite-flying competitions across the city." },
    { name: "Elephant Festival", month: "March", icon: "elephant", desc: "Held around Holi, featuring decorated elephants, a tug-of-war and elephant polo at the Sawai Man Singh Stadium grounds." },
    { name: "Holi", month: "March", icon: "colors", desc: "Festival of colors marking the arrival of spring, celebrated with colored powders, water and music." },
    { name: "Gangaur Festival", month: "March/April", icon: "procession", desc: "An 18-day festival honoring Goddess Gauri, with women in traditional dress leading processions through the old city." },
    { name: "Teej Festival", month: "July/August", icon: "swing", desc: "Marks the onset of monsoon; women dress in green and swing on decorated swings hung from trees." },
    { name: "Jaipur Literature Festival", month: "January", icon: "book", desc: "One of the world's largest free literary festivals, held at Hotel Clarks Amer with authors from around the globe." }
];

module.exports = FESTIVALS;
