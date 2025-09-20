document.getElementById("barcodeUpload").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        const dataUrl = reader.result;

        // Show preview
        const img = document.createElement("img");
        img.src = dataUrl;
        img.style.maxWidth = "300px";
        document.getElementById("preview").innerHTML = "";
        document.getElementById("preview").appendChild(img);

        // Decode using Quagga
        Quagga.decodeSingle({
            src: dataUrl,
            numOfWorkers: 0, // sync mode
            inputStream: { size: 800 },
            decoder: {
                readers: ["code_128_reader"] // Code128 support
            }
        }, function(result) {
            if(result && result.codeResult) {
                const raw = result.codeResult.code;
                console.log("Barcode result:", raw);

                // Expecting format: ItemName,Orders,Revenue
                const parts = raw.split(",");
                if(parts.length === 3) {
                    document.getElementById("item").value = parts[0].trim();
                    document.getElementById("orders").value = parts[1].trim();
                    document.getElementById("revenue").value = parts[2].trim();
                    document.getElementById("editSection").style.display = "block";
                } else {
                    alert("Invalid format in barcode. Expected: Item,Orders,Revenue");
                }
            } else {
                alert("No barcode detected.");
            }
        });
    };
    reader.readAsDataURL(file);
});

// Add to CSV backend
document.getElementById("confirmBtn").addEventListener("click", function() {
    const payload = {
        item: document.getElementById("item").value,
        orders: parseInt(document.getElementById("orders").value),
        revenue: parseInt(document.getElementById("revenue").value)
    };

    fetch("http://127.0.0.1:5000/add-to-csv", { // your Flask upload.py
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        alert("Data saved: " + JSON.stringify(data));
    })
    .catch(err => {
        console.error(err);
        alert("Failed to save.");
    });
});
