document.getElementById("open-invitation").addEventListener("click", () => {
  document.body.classList.add("entered");
  window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
  });
});

const weddingDate = new Date("2026-12-06T12:24:00+05:30");
const parts = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function updateCountdown() {
  const remaining = Math.max(0, weddingDate.getTime() - Date.now());
  const total = Math.floor(remaining / 1000);
  parts.days.textContent = String(Math.floor(total / 86400)).padStart(3, "0");
  parts.hours.textContent = String(Math.floor((total % 86400) / 3600)).padStart(2, "0");
  parts.minutes.textContent = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  parts.seconds.textContent = String(total % 60).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

const canvas = document.getElementById("scratch-canvas");
const context = canvas.getContext("2d");
let scratching = false;

function paintScratchSurface() {
  const bounds = canvas.getBoundingClientRect();
  const scaleX = canvas.width / bounds.width;
  const scaleY = canvas.height / bounds.height;
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#c0c9b9");
  gradient.addColorStop(0.5, "#e3e7da");
  gradient.addColorStop(1, "#9fae99");
  context.globalCompositeOperation = "source-over";
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(255,255,255,.72)";
  context.font = "600 24px Montserrat";
  context.textAlign = "center";
  context.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2 + 8);
  canvas.dataset.scaleX = scaleX;
  canvas.dataset.scaleY = scaleY;
}

function scratch(event) {
  if (!scratching) return;
  const rect = canvas.getBoundingClientRect();
  const point = event.touches?.[0] || event;
  const x = (point.clientX - rect.left) * (canvas.width / rect.width);
  const y = (point.clientY - rect.top) * (canvas.height / rect.height);
  context.globalCompositeOperation = "destination-out";
  context.beginPath();
  context.arc(x, y, 34, 0, Math.PI * 2);
  context.fill();
}

paintScratchSurface();
canvas.addEventListener("pointerdown", (event) => { scratching = true; canvas.setPointerCapture(event.pointerId); scratch(event); });
canvas.addEventListener("pointermove", scratch);
canvas.addEventListener("pointerup", () => { scratching = false; });
canvas.addEventListener("pointercancel", () => { scratching = false; });

const toast = document.getElementById("toast");
document.getElementById("share-button").addEventListener("click", async () => {
  const data = {
    title: "Sanjeev & Lakshmi – Wedding Invitation",
    text: "Join us on December 6, 2026 at 12:24 PM.",
    url: window.location.href,
  };
  if (navigator.share) {
    try { await navigator.share(data); return; } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  try { await navigator.clipboard.writeText(window.location.href); } catch {
    const input = document.createElement("textarea");
    input.value = window.location.href;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
});
