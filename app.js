const API = "https://event-management-backend-4x1j.onrender.com/api";

/* LOGIN */
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html"; // REAL PAGE CHANGE
  } else {
    authMessage.innerText = data.error;
  }
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

/* EVENTS */
async function loadEvents() {
  if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
    return;
  }

  const eventsDiv = document.getElementById("events");
  const res = await fetch(`${API}/events`);
  const events = await res.json();

  eventsDiv.innerHTML = "";

  if (events.length === 0) {
    eventsDiv.innerHTML = "<p>No events available.</p>";
    return;
  }

  events.forEach(e => {
    const div = document.createElement("div");
    div.className = "event";

    if (e.status === "completed") {
      div.style.opacity = "0.6";
    }

    div.innerHTML = `
      <h3>${e.title}</h3>
      <p>${e.description}</p>
      <p>${e.date} | ${e.location}</p>
      <p>Status: <strong>${e.status}</strong></p>

      ${
        e.status === "active"
          ? `<button onclick="completeEvent('${e._id}')">Mark as Completed</button>`
          : `<span style="color: green; font-weight: bold;">Completed</span>`
      }
    `;

    eventsDiv.appendChild(div);
  });
}


async function createNewEvent() {
  await fetch(`${API}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title.value,
      description: description.value,
      date: date.value,
      location: location.value,
      capacity: capacity.value
    })
  });
  loadEvents();
}

async function completeEvent(eventId) {
  await fetch(`${API}/events/${eventId}/complete`, {
    method: "PATCH"
  });

  loadEvents();
}


/* AUTO LOAD DASHBOARD DATA */
if (window.location.pathname.includes("dashboard")) {
  loadEvents();
}
