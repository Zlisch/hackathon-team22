Papa.parse("http://localhost:5000/data/data.csv", {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data.filter(row => row.ItemName && row.Orders && row.Revenue);

    // Convert numeric values properly
    data.forEach(row => {
      row.Orders = parseInt(row.Orders);
      row.Revenue = parseFloat(row.Revenue);
    });

    // ---- Metrics ----
    const totalItems = data.reduce((sum, row) => sum + row.Orders, 0);
    const totalRevenue = data.reduce((sum, row) => sum + row.Revenue, 0);
    const uniqueProducts = new Set(data.map(row => row.ItemName)).size;
    const avgItemValue = totalRevenue / totalItems || 0;

    document.getElementById("totalItems").textContent = totalItems;
    document.getElementById("totalRevenue").textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById("uniqueProducts").textContent = uniqueProducts;
    document.getElementById("avgItemValue").textContent = `$${avgItemValue.toFixed(2)}`;

    // ---- Bar Chart: Top Selling Items by Orders ----
    const ordersByItem = {};
    data.forEach(row => {
      if (ordersByItem[row.ItemName]) {
        ordersByItem[row.ItemName] += row.Orders;
      } else {
        ordersByItem[row.ItemName] = row.Orders;
      }
    });
    const sorted = Object.entries(ordersByItem)
    .sort((a, b) => b[1] - a[1]) // sort by total orders
    .slice(0, 10); // top 10 items

    const barLabels = sorted.map(([itemName]) => itemName);
    const barData = sorted.map(([_, totalOrders]) => totalOrders);
    new Chart(document.getElementById("barChart"), {
    type: 'bar',
    data: {
      labels: barLabels,
      datasets: [{
        label: 'Orders',
        data: barData,
        backgroundColor: 'rgba(106, 137, 247, 0.7)'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });





    // ---- Pie Chart: Revenue Share by Item ----
   // Aggregate revenue by item name
  const revenueByItem = {};

  data.forEach(row => {
    if (revenueByItem[row.ItemName]) {
      revenueByItem[row.ItemName] += row.Revenue;
    } else {
      revenueByItem[row.ItemName] = row.Revenue;
    }
  });

const pieLabels = Object.keys(revenueByItem);
const pieData = Object.values(revenueByItem);


    new Chart(document.getElementById("pieChart"), {
      type: 'pie',
      data: {
        labels: pieLabels,
        datasets: [{
          data: pieData,
          backgroundColor: [
            "#FF9F40", "#FF6384", "#36A2EB", "#4BC0C0", "#9966FF",
            "#FFCD56", "#2ecc71", "#e67e22", "#9b59b6"
          ]
        }]
      }
    });
  }
});

// Back button → go to Questionnaire.html
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "questionnaire.html";
});
