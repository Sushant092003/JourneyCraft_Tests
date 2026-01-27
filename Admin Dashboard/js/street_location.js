const form = document.getElementById("streetLocationForm");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const link = document.getElementById("link").value;

  const payload = {
    name: name,
    link: link,
  };

  try {
    const response = await fetch(
      "http://127.0.0.1:9000/api/location/street-location",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to save location");
    }

    const data = await response.json();

    statusMsg.className = "success";
    statusMsg.innerText =
      "Location saved successfully! Lat: " + data.lat + " Lng: " + data.lng;

    form.reset();
  } catch (err) {
    statusMsg.className = "error";
    statusMsg.innerText = "Error: " + err.message;
  }
});
