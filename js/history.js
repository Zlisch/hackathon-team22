Papa.parse("data/data.csv", {
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
    const sorted = [...data].sort((a, b) => b.Orders - a.Orders).slice(0, 10);
    const barLabels = sorted.map(r => r.ItemName);
    const barData = sorted.map(r => r.Orders);

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
    const pieLabels = data.map(row => row.ItemName);
    const pieData = data.map(row => row.Revenue);

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
