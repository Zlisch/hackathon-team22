document.getElementById("questionnaireForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const profile = {
    storeName: document.getElementById("storeName").value,
    storeType: document.getElementById("storeType").value,
    location: document.getElementById("location").value
  };

  // Save to localStorage (simulating database)
  localStorage.setItem("bookstoreProfile", JSON.stringify(profile));

  // Navigate to profile page (or next step)
  window.location.href = "Profile.html";
});

document.getElementById("backBtn").addEventListener("click", () => {
  history.back();
});
