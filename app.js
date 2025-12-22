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
  const res = await fetch(`${API}/events`);
  const events = await res.json();

  eventsDiv.innerHTML = "";
  events.forEach(e => {
    const div = document.createElement("div");
    div.className = "event";

    div.innerHTML = `
      <h3>${e.title}</h3>
      <p>${e.description}</p>
      <p>${e.date} | ${e.location}</p>
      <p>Status: <strong>${e.status}</strong></p>
      <button onclick="completeEvent('${e._id}')">
        Mark as Completed
      </button>
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

async function completeEvent(id) {
  await fetch(`${API}/events/${id}/complete`, {
    method: "PUT"
  });
  loadEvents();
  loadCompletedEvents();
}

const completedDiv = document.getElementById("completedEvents");

async function loadCompletedEvents() {
  const res = await fetch(`${API}/events/completed`);
  const events = await res.json();

  completedDiv.innerHTML = "";
  events.forEach(e => {
    const div = document.createElement("div");
    div.className = "event completed";

    div.innerHTML = `
      <h3>${e.title}</h3>
      <p>${e.description}</p>
      <p>Status: <strong>${e.status}</strong></p>
    `;

    completedDiv.appendChild(div);
  });
}


if (window.location.pathname.includes("dashboard")) {
  loadEvents();
  loadCompletedEvents();
}

