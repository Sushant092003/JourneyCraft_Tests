const API_BASE = "http://127.0.0.1:9000";
let currentRestaurantId = null;
let isApprovedRestaurant = false;

function loadRestaurants() {
  fetch(`${API_BASE}/admin/restaurant/unapproved`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication token
    },
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Authentication required. Please login again.");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((restaurants) => {
      const tbody = document
        .getElementById("unapprovedRestaurantTable")
        .querySelector("tbody");
      tbody.innerHTML = "";
      if (restaurants && restaurants.length > 0) {
        restaurants.forEach((restaurant) => {
          const row = `
                    <tr>
                        <td>${restaurant.restoName || "N/A"}</td>
                        <td>${restaurant.fssaiLicense || "N/A"}</td>
                        <td>${restaurant.phoneNo || "N/A"}</td>
                        <td>
                            <button class="view-btn" onclick="viewRestaurantDetails(${restaurant.id}, false)">View Details</button>
                        </td>
                    </tr>
                `;
          tbody.innerHTML += row;
        });
      } else {
        tbody.innerHTML =
          '<tr><td colspan="4" class="no-data">No pending restaurants found</td></tr>';
      }
    })
    .catch((error) => {
      console.error("Error loading unapproved restaurants:", error);
      const tbody = document
        .getElementById("unapprovedRestaurantTable")
        .querySelector("tbody");
      tbody.innerHTML = `<tr><td colspan="4" class="error-message">${error.message}</td></tr>`;
    });

  // Load approved restaurants
  fetch(`${API_BASE}/api/restaurants/all-restaurants`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication token
    },
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Authentication required. Please login again.");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((restaurants) => {
      const tbody = document
        .getElementById("approvedRestaurantTable")
        .querySelector("tbody");
      tbody.innerHTML = "";
      if (restaurants && restaurants.length > 0) {
        restaurants.forEach((restaurant) => {
          const row = `
                    <tr>
                        <td>${restaurant.restoName || "N/A"}</td>
                        <td>${restaurant.phoneNo || "N/A"}</td>
                        <td>
                            <button class="view-btn" onclick="viewRestaurantDetails(${restaurant.id}, true)">View Details</button>
                        </td>
                    </tr>
                `;
          tbody.innerHTML += row;
        });
      } else {
        tbody.innerHTML =
          '<tr><td colspan="3" class="no-data">No approved restaurants found</td></tr>';
      }
    })
    .catch((error) => {
      console.error("Error loading approved restaurants:", error);
      const tbody = document
        .getElementById("approvedRestaurantTable")
        .querySelector("tbody");
      tbody.innerHTML = `<tr><td colspan="3" class="error-message">${error.message}</td></tr>`;
    });
}

function viewRestaurantDetails(id, isApproved) {
  currentRestaurantId = id;
  isApprovedRestaurant = isApproved;
  fetch(`${API_BASE}/api/restaurants/restaurant/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication token
    },
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Authentication required. Please login again.");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((restaurant) => {
      document.getElementById("dialog-restaurant-name").textContent =
        restaurant.restoName || "Not specified";
      document.getElementById("dialog-restaurant-license").textContent =
        restaurant.fssaiLicense || "Not specified";
      document.getElementById("dialog-restaurant-phone").textContent =
        restaurant.phoneNo || "Not specified";
      document.getElementById("dialog-restaurant-description").textContent =
        restaurant.description || "Not specified";
      document.getElementById("dialog-restaurant-address").textContent =
        restaurant.locationLink || "Not specified";
      document.getElementById("dialog-restaurant-cuisine").textContent =
        restaurant.foodType || "Not specified";

      const footer = document.getElementById("restaurantDialogFooter");
      if (isApproved) {
        footer.innerHTML = `
                <button class="close-btn" onclick="closeDialog('restaurantDialog')">Close</button>
            `;
      } else {
        footer.innerHTML = `
                <button class="reject" onclick="rejectRestaurant(${id})">Reject</button>
                <button class="approve" onclick="approveRestaurant(${id})">Approve</button>
            `;
      }

      document.getElementById("restaurantDialog").classList.add("active");
    })
    .catch((error) => {
      console.error("Error fetching restaurant details:", error);
      alert(error.message);
    });
}

function closeDialog(dialogId) {
  document.getElementById(dialogId).classList.remove("active");
}

function approveRestaurant(id) {
  const approveBtn = document.querySelector("#restaurantDialog .approve");
  approveBtn.disabled = true;
  approveBtn.textContent = "Approving...";

  fetch(`${API_BASE}/admin/restaurant/approve/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication token
    },
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Authentication required. Please login again.");
        }
        throw new Error("Failed to approve restaurant");
      }
      return response.json();
    })
    .then(() => {
      alert("Restaurant Approved Successfully!");
      closeDialog("restaurantDialog");
      loadRestaurants();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message);
    })
    .finally(() => {
      approveBtn.disabled = false;
      approveBtn.textContent = "Approve";
    });
}

function rejectRestaurant(id) {
  if (confirm("Are you sure you want to reject this restaurant?")) {
    const rejectBtn = document.querySelector("#restaurantDialog .reject");
    rejectBtn.disabled = true;
    rejectBtn.textContent = "Rejecting...";

    fetch(`${API_BASE}/admin/restaurant/reject/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication token
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Authentication required. Please login again.");
          }
          throw new Error("Failed to reject restaurant");
        }
        return response.json();
      })
      .then(() => {
        alert("Restaurant Rejected Successfully!");
        closeDialog("restaurantDialog");
        loadRestaurants();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
      })
      .finally(() => {
        rejectBtn.disabled = false;
        rejectBtn.textContent = "Reject";
      });
  }
}

document.addEventListener("click", function (event) {
  const dialog = document.getElementById("restaurantDialog");
  if (event.target === dialog) {
    closeDialog("restaurantDialog");
  }
});

loadRestaurants();
