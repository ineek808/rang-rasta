// Plain factual info about Jaipur, served via /api/history.
// Deliberately kept to short, basic facts — no narrative/storytelling copy.

const HISTORY = {
    quickFacts: [
        { label: "Founded", value: "1727 CE" },
        { label: "Founder", value: "Maharaja Sawai Jai Singh II" },
        { label: "Planner", value: "Vidyadhar Bhattacharya" },
        { label: "Dynasty", value: "Kachwaha Rajput" },
        { label: "State", value: "Rajasthan, India" },
        { label: "Nickname", value: "The Pink City" },
        { label: "UNESCO Status", value: "World Heritage City (2019)" },
        { label: "Elevation", value: "~431 m above sea level" }
    ],
    sections: [
        {
            title: "Founding",
            body: "Jaipur was founded in 1727 by Maharaja Sawai Jai Singh II, ruler of Amer, as his capital moved down from the hillside fort of Amer to the plains below."
        },
        {
            title: "City Planning",
            body: "The city was designed by architect Vidyadhar Bhattacharya on principles of Vastu Shastra and early town-planning treatises, laid out in a grid of nine rectangular blocks representing the nine divisions of the universe."
        },
        {
            title: "Why 'Pink City'",
            body: "In 1876, the city was painted terracotta pink to welcome the Prince of Wales (later King Edward VII). The color has been maintained since, giving Jaipur its nickname."
        },
        {
            title: "UNESCO World Heritage",
            body: "The walled city of Jaipur was inscribed as a UNESCO World Heritage Site in 2019, recognized for its urban planning and architecture that blend indigenous Rajasthani, Mughal, and modern European influences."
        },
        {
            title: "Present Day",
            body: "Jaipur is the capital of Rajasthan and part of the Golden Triangle tourist circuit with Delhi and Agra, known for its forts, palaces, bazaars and gemstone trade."
        }
    ]
};

module.exports = HISTORY;
