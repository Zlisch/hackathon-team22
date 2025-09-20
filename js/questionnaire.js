function saveProfile(updates) {
  const profile = JSON.parse(localStorage.getItem("bookstoreProfile")) || {};
  Object.assign(profile, updates);
  localStorage.setItem("bookstoreProfile", JSON.stringify(profile));
}

async function getAndSendDataToSaveAsCSV() {
    // 1. Get the data string from localStorage using its key
    const storedDataString = localStorage.getItem('bookstoreProfile');

    // 2. Check if data actually exists
    if (!storedDataString) {
        console.error('Local storage item not found.');
        return;
    }

    // 3. Parse the JSON string back into a JavaScript object
    const storedDataObject = JSON.parse(storedDataString);

    // 4. Format the data for our API.
    // The API expects a 'rows' key containing an ARRAY of objects.
    // Since we have just one object, we'll put it inside an array.
    const dataToSend = {
        filename: "store_profile.csv",
        rows: [storedDataObject] // <--- Key step: Wrap the object in an array
    };

    try {
        const apiUrl = 'http://127.0.0.1:5000/save-csv';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Server response:', result);

    } catch (error) {
        console.error('Failed to send data:', error);
    }
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
document.getElementById("formStep4").addEventListener("submit", async e => {
  e.preventDefault();
  const channels = Array.from(document.querySelectorAll(".checkbox-group input:checked"))
    .map(cb => cb.value);

  saveProfile({
    budget: document.querySelector("input[name='budget']:checked").value,
    marketingChannels: channels
  });

  await getAndSendDataToSaveAsCSV(); // waits until fetch finishes

  window.location.href = "profile.html";
});
