fetch("http://127.0.0.1:9000/admin/counts")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("total-guides").textContent = data.totalGuides;
    document.getElementById("total-restaurants").textContent =
      data.totalRestaurants;
    document.getElementById("active-guides").textContent = data.activeGuides;
    document.getElementById("pending-guides").textContent = data.pendingGuides;

    createCharts(data);
  })
  .catch((error) => console.error("Error fetching dashboard data:", error));

function createCharts(data) {
  new Chart(document.getElementById("guidePieChart"), {
    type: "pie",
    data: {
      labels: ["Active Guides", "Pending Guides"],
      datasets: [
        {
          data: [data.activeGuides, data.pendingGuides],
          backgroundColor: ["#28a745", "#ffc107"],
        },
      ],
    },
  });

  new Chart(document.getElementById("registrationLineChart"), {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "New Registrations",
          data: [5, 10, 8, 15, 12, 18],
          fill: true,
          borderColor: "#007bff",
          backgroundColor: "rgba(0,123,255,0.2)",
          tension: 0.4,
        },
      ],
    },
  });

  new Chart(document.getElementById("guideChart"), {
    type: "bar",
    data: {
      labels: ["Guides"],
      datasets: [
        {
          label: "Active",
          data: [data.activeGuides],
          backgroundColor: "#28a745",
        },
        {
          label: "Pending",
          data: [data.pendingGuides],
          backgroundColor: "#ffc107",
        },
      ],
    },
  });

  new Chart(document.getElementById("restaurantChart"), {
    type: "bar",
    data: {
      labels: ["Restaurants"],
      datasets: [
        {
          label: "Total",
          data: [data.totalRestaurants],
          backgroundColor: "#17a2b8",
        },
      ],
    },
  });
}
