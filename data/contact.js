// Contact and emergency info, served via /api/contact.

const CONTACT = {
    touristHelpline: "1800-11-1363 (24x7, Govt. of India Tourist Helpline)",
    touristPolice: "0141-2571714 (Jaipur Tourist Police)",
    emergencyNumbers: [
        { label: "All-in-one Emergency", number: "112" },
        { label: "Police", number: "100" },
        { label: "Ambulance", number: "102" },
        { label: "Fire", number: "101" },
        { label: "Women's Helpline", number: "1091" }
    ],
    office: {
        name: "Rajasthan Tourism Reception Centre",
        address: "Paryatan Bhawan, Government Hostel Campus, M.I. Road, Jaipur, Rajasthan 302001",
        hours: "10:00 AM – 5:00 PM (Mon–Sat)"
    },
    email: "info.rtdc@rajasthan.gov.in"
};

module.exports = CONTACT;
