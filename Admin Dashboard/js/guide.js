const API_BASE = "http://127.0.0.1:9000";
let currentGuideId = null;
let isApprovedGuide = false;

function loadGuides() {
  fetch(`${API_BASE}/admin/guide/unapproved`)
    .then((res) => res.json())
    .then((guides) => {
      const tbody = document
        .getElementById("unapprovedGuideTable")
        .querySelector("tbody");
      tbody.innerHTML = "";
      guides.forEach((guide) => {
        const row = `
                    <tr>
                        <td>${guide.guidename}</td>
                        <td>${guide.bio}</td>
                        <td>${guide.phoneNo}</td>
                        <td>
                            <button class="view-btn" onclick="viewGuideDetails(${guide.id}, false)">View Details</button>
                        </td>
                    </tr>
                `;
        tbody.innerHTML += row;
      });
    })
    .catch((error) => {
      console.error("Error loading unapproved guides:", error);
      alert("Error loading unapproved guides list");
    });

  fetch(`${API_BASE}/api/guides/all-guides`)
    .then((res) => res.json())
    .then((guides) => {
      const tbody = document
        .getElementById("approvedGuideTable")
        .querySelector("tbody");
      tbody.innerHTML = "";
      guides.forEach((guide) => {
        const row = `
                    <tr>
                        <td>${guide.guidename}</td>
                        <td>${guide.phoneNo}</td>
                        <td>
                            <button class="view-btn" onclick="viewGuideDetails(${guide.id}, true)">View Details</button>
                        </td>
                    </tr>
                `;
        tbody.innerHTML += row;
      });
    })
    .catch((error) => {
      console.error("Error loading approved guides:", error);
      alert("Error loading approved guides list");
    });
}

function viewGuideDetails(id, isApproved) {
  currentGuideId = id;
  isApprovedGuide = isApproved;
  fetch(`${API_BASE}/api/guides/guide/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch guide details");
      return res.json();
    })
    .then((guide) => {
      document.getElementById("dialog-guide-name").textContent =
        guide.guidename || "Not specified";
      document.getElementById("dialog-guide-bio").textContent =
        guide.bio || "Not specified";
      document.getElementById("dialog-guide-phone").textContent =
        guide.phoneNo || "Not specified";
      document.getElementById("dialog-guide-email").textContent =
        guide.email || "Not specified";
      document.getElementById("dialog-guide-experience").textContent =
        guide.experience || "Not specified";
      document.getElementById("dialog-guide-languages").textContent =
        guide.language || "Not specified";

      // Update dialog footer based on guide status
      const footer = document.getElementById("guideDialogFooter");
      if (isApproved) {
        footer.innerHTML = `
                    <button class="close-btn" onclick="closeDialog('guideDialog')">Close</button>
                `;
      } else {
        footer.innerHTML = `
                    <button class="reject" onclick="rejectGuide(${id})">Reject</button>
                    <button class="approve" onclick="approveGuide(${id})">Approve</button>
                `;
      }

      document.getElementById("guideDialog").classList.add("active");
    })
    .catch((error) => {
      console.error("Error fetching guide details:", error);
      alert("Error loading guide details");
    });
}

function closeDialog(dialogId) {
  document.getElementById(dialogId).classList.remove("active");
}

function approveGuide(id) {
  const approveBtn = document.querySelector("#guideDialog .approve");
  approveBtn.disabled = true;
  approveBtn.textContent = "Approving...";

  fetch(`${API_BASE}/admin/guide/approve/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to approve guide");
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }
      return null;
    })
    .then(() => {
      alert("Guide Approved Successfully!");
      closeDialog("guideDialog");
      loadGuides();
    })
    .catch((error) => {
      console.error("Error:", error);
      if (!error.message.includes("Failed to approve guide")) {
        alert("Error approving guide: " + error.message);
      } else {
        alert("Guide Approved Successfully!");
        closeDialog("guideDialog");
        loadGuides();
      }
    })
    .finally(() => {
      approveBtn.disabled = false;
      approveBtn.textContent = "Approve";
    });
}

function rejectGuide(id) {
  if (confirm("Are you sure you want to reject this guide?")) {
    const rejectBtn = document.querySelector("#guideDialog .reject");
    rejectBtn.disabled = true;
    rejectBtn.textContent = "Rejecting...";

    fetch(`${API_BASE}/admin/guide/reject/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to reject guide");
        return response.json();
      })
      .then(() => {
        alert("Guide Rejected Successfully!");
        closeDialog("guideDialog");
        loadGuides();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error rejecting guide: " + error.message);
      })
      .finally(() => {
        rejectBtn.disabled = false;
        rejectBtn.textContent = "Reject";
      });
  }
}

document.addEventListener("click", function (event) {
  const dialog = document.getElementById("guideDialog");
  if (event.target === dialog) {
    closeDialog("guideDialog");
  }
});

loadGuides();
