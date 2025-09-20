document.addEventListener("DOMContentLoaded", () => {
  const profile = JSON.parse(localStorage.getItem("bookstoreProfile")) || {};

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
});
