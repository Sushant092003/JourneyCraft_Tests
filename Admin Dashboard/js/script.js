const navLinks = document.querySelectorAll(".sidebar ul li");
const pages = document.querySelectorAll(".page");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    pages.forEach((page) => {
      page.classList.remove("active");
      if (page.id === link.dataset.page) {
        page.classList.add("active");
      }
    });
  });
});

const guides = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Pending" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Pending" },
];
const restaurants = [
  { id: 1, name: "Pizza Town", owner: "Joe", status: "Pending" },
  { id: 2, name: "Curry Spot", owner: "Priya", status: "Pending" },
];

const API_BASE_URL = "http://localhost:8080";

function loadGuides() {
  const guidesList = document.getElementById("guidesList");
  guidesList.innerHTML = "";
  guides.forEach((guide) => {
    guidesList.innerHTML += `
      <tr>
        <td>${guide.name}</td>
        <td>${guide.email}</td>
        <td>${guide.status}</td>
        <td>
          <button class="approve" onclick="approveGuide(${guide.id})">Approve</button>
          <button class="reject" onclick="rejectGuide(${guide.id})">Reject</button>
        </td>
      </tr>
    `;
  });
}

function loadRestaurants() {
  const restaurantsList = document.getElementById("restaurantsList");
  restaurantsList.innerHTML = "";
  restaurants.forEach((restaurant) => {
    restaurantsList.innerHTML += `
      <tr id="restaurant-row-${restaurant.id}">
        <td>${restaurant.name}</td>
        <td>${restaurant.owner}</td>
        <td id="restaurant-status-${restaurant.id}">${restaurant.status}</td>
        <td>
          <button class="approve" onclick="approveRestaurant(${restaurant.id}, this)">Approve</button>
          <button class="reject" onclick="rejectRestaurant(${restaurant.id}, this)">Reject</button>
        </td>
      </tr>
    `;
  });
}

function approveGuide(id, btn) {
  btn.disable = true;
  btn.innerText = "Approving...";

  fetch(`${API_BASE_URL}/admin/guide/approve/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to approve guide.");
      return response.json();
    })
    .then((data) => {
      document.getElementById(`guide-status-${id}`).innerText = "Approved";
    })
    .catch((err) => {
      alert(err.message);
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerText = "Approve";
    });
}
function rejectGuide(id) {
  console.log(`Rejected guide with id: ${id}`);
}
function approveRestaurant(id, btn) {
  btn.disabled = true;
  btn.innerText = "Approving...";

  fetch(`${API_BASE_URL}/admin/restaurant/approve/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to approve restaurant.");
      return response.json();
    })
    .then((data) => {
      document.getElementById(`restaurant-status-${id}`).innerText = "Approved";
    })
    .catch((err) => {
      alert(err.message);
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerText = "Approve";
    });
}
function rejectRestaurant(id) {
  console.log(`Rejected restaurant with id: ${id}`);
}

document.getElementById("totalGuides").innerText = guides.length;
document.getElementById("totalRestaurants").innerText = restaurants.length;
document.getElementById("activeGuides").innerText = 1;
document.getElementById("openRestaurants").innerText = 1;

const ctxLine = document.getElementById("statsChart").getContext("2d");
const ctxPie = document.getElementById("guidesPieChart").getContext("2d");
const ctxBar = document.getElementById("restaurantsBarChart").getContext("2d");

new Chart(ctxLine, {
  type: "line",
  data: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Guides",
        data: [3, 5, 2, 8],
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46,204,113,0.2)",
        fill: true,
      },
      {
        label: "Restaurants",
        data: [2, 3, 4, 6],
        borderColor: "#3498db",
        backgroundColor: "rgba(52,152,219,0.2)",
        fill: true,
      },
    ],
  },
});

new Chart(ctxPie, {
  type: "pie",
  data: {
    labels: ["Active Guides", "Inactive Guides"],
    datasets: [
      {
        data: [1, 2],
        backgroundColor: ["#2ecc71", "#e74c3c"],
      },
    ],
  },
});

new Chart(ctxBar, {
  type: "bar",
  data: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Restaurants Opened",
        data: [1, 2, 1, 3],
        backgroundColor: "#9b59b6",
      },
    ],
  },
});

loadGuides();
loadRestaurants();
