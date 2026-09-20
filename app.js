document.getElementById("year").textContent = new Date().getFullYear();

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  try {
    const res = await fetch("/api/gallery");
    const files = await res.json();
    if (!files.length) return;
    gallery.innerHTML = files.map((f, i) =>
      `<img src="${f.url}" alt="Lucrare ECOCENTER SERV ${i+1}" loading="lazy">`
    ).join("");
  } catch (e) {}
}
loadGallery();

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav nav");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    nav.style.display = nav.style.display === "flex" ? "" : "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "70px";
    nav.style.right = "14px";
    nav.style.background = "#fff";
    nav.style.padding = "20px";
    nav.style.borderRadius = "16px";
    nav.style.boxShadow = "0 15px 40px rgba(0,0,0,.12)";
  });
}

/* =========================
   NAVBAR SHRINK ON SCROLL
========================= */

const navWrapper = document.querySelector(".nav-wrapper");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navWrapper.classList.add("scrolled");
  } else {
    navWrapper.classList.remove("scrolled");
  }
});