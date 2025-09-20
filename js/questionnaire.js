function saveProfile(updates) {
  const profile = JSON.parse(localStorage.getItem("bookstoreProfile")) || {};
  Object.assign(profile, updates);
  localStorage.setItem("bookstoreProfile", JSON.stringify(profile));
}

// ---- Step 1 ----
document.getElementById("formStep1").addEventListener("submit", e => {
  e.preventDefault();
  saveProfile({
    storeName: document.getElementById("storeName").value,
    storeType: document.getElementById("storeType").value,
    location: document.getElementById("location").value
  });
  document.getElementById("step1").classList.remove("active");
  document.getElementById("step2").classList.add("active");
});
document.getElementById("backToStep1").addEventListener("click", () => {
  document.getElementById("step2").classList.remove("active");
  document.getElementById("step1").classList.add("active");
});

// ---- Step 2 ----
document.getElementById("formStep2").addEventListener("submit", e => {
  e.preventDefault();
  saveProfile({
    storeSize: document.querySelector("input[name='storeSize']:checked").value,
    yearsInBusiness: document.getElementById("years").value,
    primaryProducts: document.getElementById("products").value
  });
  document.getElementById("step2").classList.remove("active");
  document.getElementById("step3").classList.add("active");
});
document.getElementById("backToStep2").addEventListener("click", () => {
  document.getElementById("step3").classList.remove("active");
  document.getElementById("step2").classList.add("active");
});

// ---- Step 3 ----
document.getElementById("formStep3").addEventListener("submit", e => {
  e.preventDefault();
  saveProfile({
    audience: document.getElementById("audience").value,
    goals: document.getElementById("goals").value,
    challenges: document.getElementById("challenges").value
  });
  document.getElementById("step3").classList.remove("active");
  document.getElementById("step4").classList.add("active");
});
document.getElementById("backToStep3").addEventListener("click", () => {
  document.getElementById("step4").classList.remove("active");
  document.getElementById("step3").classList.add("active");
});

// ---- Step 4 ----
document.getElementById("formStep4").addEventListener("submit", e => {
  e.preventDefault();
  const channels = Array.from(document.querySelectorAll(".checkbox-group input:checked"))
    .map(cb => cb.value);

  saveProfile({
    budget: document.querySelector("input[name='budget']:checked").value,
    marketingChannels: channels
  });

  // ✅ Go to Data.html after completion
  window.location.href = "history.html";
});
