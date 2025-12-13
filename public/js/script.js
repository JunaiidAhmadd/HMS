// =====================================================
// GLOBAL CONFIG
// =====================================================
const API_URL = "http://localhost:5000/api";

// Token helper
function getToken() {
  return localStorage.getItem("adminToken") || "";
}


// =====================================================
// USER SIDE — Load branches dropdown
// =====================================================
async function loadBranches() {
  const selects = document.querySelectorAll(".branch-select");
  if (!selects.length) return;

  const res = await fetch(`${API_URL}/branches`);
  const branches = await res.json();

  selects.forEach(select => {
    select.innerHTML = `<option value="">Select Branch</option>`;
    branches.forEach(b => {
      select.innerHTML += `<option value="${b._id}">${b.name}</option>`;
    });
  });
}
loadBranches();


// =====================================================
// USER — Reservation Submit
// =====================================================
const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {
  reservationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(reservationForm));

    const res = await fetch(`${API_URL}/reservations/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      new bootstrap.Modal(document.getElementById("successModal")).show();
      reservationForm.reset();
    } else {
      alert(data.message);
    }
  });
}


// =====================================================
// ADMIN — Login
// =====================================================
const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      email: adminLoginForm.email.value,
      password: adminLoginForm.password.value,
    };

    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin/dashboard";
    } else {
      alert(data.message);
    }
  });
}


// =====================================================
// ADMIN — Branch List
// =====================================================
async function loadBranchesAdmin() {
  const table = document.getElementById("branchesTableBody");
  if (!table) return;

  const res = await fetch(`${API_URL}/branches`);
  const branches = await res.json();

  table.innerHTML = "";
  branches.forEach(b => {
    table.innerHTML += `
      <tr>
        <td>${b.name}</td>
        <td>${b.address}</td>
        <td>${b.facilities.join(", ")}</td>
        <td>
          <button onclick="deleteBranch('${b._id}')" class="btn btn-danger btn-sm">Delete</button>
        </td>
      </tr>`;
  });
}
loadBranchesAdmin();

async function deleteBranch(id) {
  if (!confirm("Delete this branch?")) return;

  await fetch(`${API_URL}/branches/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  loadBranchesAdmin();
}


// =====================================================
// ADMIN — Rooms
// =====================================================
async function loadRooms() {
  const table = document.getElementById("roomsTableBody");
  if (!table) return;

  const res = await fetch(`${API_URL}/rooms`);
  const rooms = await res.json();

  table.innerHTML = "";
  rooms.forEach(r => {
    table.innerHTML += `
      <tr>
        <td>${r.branch?.name}</td>
        <td>${r.roomType}</td>
        <td>${r.capacity}</td>
        <td>${r.facilities.join(", ")}</td>
        <td>PKR ${r.price}</td>
        <td><button onclick="deleteRoom('${r._id}')" class="btn btn-danger btn-sm">Delete</button></td>
      </tr>`;
  });
}
loadRooms();

async function deleteRoom(id) {
  if (!confirm("Delete?")) return;
  await fetch(`${API_URL}/rooms/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  loadRooms();
}


// =====================================================
// ADMIN — Reservations
// =====================================================
async function loadReservations() {
  const table = document.getElementById("reservationsTableBody");
  if (!table) return;

  const res = await fetch(`${API_URL}/reservations`);
  const reservations = await res.json();

  table.innerHTML = "";

  reservations.forEach(r => {
    table.innerHTML += `
      <tr>
        <td>${r.fullName}</td>
        <td>${r.roomType}</td>
        <td>${r.status}</td>
        <td>
          <button onclick="updateStatus('${r._id}', 'Approved')" class="btn btn-success btn-sm">Approve</button>
          <button onclick="updateStatus('${r._id}', 'Rejected')" class="btn btn-danger btn-sm">Reject</button>
        </td>
      </tr>`;
  });
}
loadReservations();

async function updateStatus(id, status) {
  await fetch(`${API_URL}/reservations/status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ status })
  });
  loadReservations();
}
