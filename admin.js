const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const uploadForm = document.getElementById("uploadForm");
const photos = document.getElementById("photos");
const uploadStatus = document.getElementById("uploadStatus");
const adminGallery = document.getElementById("adminGallery");

async function checkSession() {
  const r = await fetch("/api/me");
  const data = await r.json();
  setView(data.isAdmin);
  if (data.isAdmin) loadAdminGallery();
}
function setView(logged) {
  loginBox.classList.toggle("hidden", logged);
  dashboard.classList.toggle("hidden", !logged);
}
loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  loginError.textContent = "";
  const r = await fetch("/api/login", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({password:document.getElementById("password").value})
  });
  const data = await r.json();
  if (!r.ok) return loginError.textContent = data.error || "Autentificare eșuată.";
  setView(true); loadAdminGallery();
});
document.getElementById("logout").addEventListener("click", async () => {
  await fetch("/api/logout",{method:"POST"});
  setView(false);
  document.getElementById("password").value="";
});

async function loadAdminGallery() {
  const r = await fetch("/api/gallery");
  const files = await r.json();
  adminGallery.innerHTML = files.length ? files.map(f => `
    <div class="admin-item">
      <img src="${f.url}" alt="Lucrare">
      <button class="delete-btn" title="Șterge" onclick="deletePhoto('${encodeURIComponent(f.name)}')">×</button>
    </div>`).join("") :
    `<p style="grid-column:1/-1;color:#777">Nu există fotografii încă.</p>`;
}

uploadForm.addEventListener("submit", async e => {
  e.preventDefault();
  if (!photos.files.length) return;
  uploadStatus.textContent = "Se încarcă...";
  const formData = new FormData();
  [...photos.files].forEach(f => formData.append("photos", f));
  const r = await fetch("/api/upload",{method:"POST",body:formData});
  const data = await r.json();
  uploadStatus.textContent = r.ok ? `Încărcate ${data.files.length} fotografii.` : (data.error || "Eroare.");
  if (r.ok) { photos.value=""; loadAdminGallery(); }
});

async function deletePhoto(name) {
  if (!confirm("Ștergi această fotografie?")) return;
  await fetch(`/api/gallery/${name}`,{method:"DELETE"});
  loadAdminGallery();
}
checkSession();
