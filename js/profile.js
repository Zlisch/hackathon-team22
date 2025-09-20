document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/get_store_profile")
        .then(res => res.json())
        .then(profile => {
            const mappings = {
                storeName: "storeName",
                storeType: "storeType",
                location: "location",
                storeSize: "storeSize",
                primaryProducts: "primaryProducts",
                yearsInBusiness: "yearsInBusiness",
                goals: "goals",
                challenges: "challenges",
                audience: "audience",
                budget: "budget",
                marketingChannels: "marketingChannels"
            };

            Object.keys(mappings).forEach(key => {
                let el = document.getElementById(mappings[key]);
                if (el && profile[key]) {
                    if (Array.isArray(profile[key])) {
                        el.textContent = profile[key].join(", ");
                    } else {
                        el.textContent = profile[key];
                    }
                }
            });
        })
        .catch(err => console.error("Error loading profile:", err));
});
