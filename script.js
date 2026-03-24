/* ============================
   ANIMAÇÃO DE PARTÍCULAS
============================ */
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";
canvas.style.opacity = "0.25";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 3 + 1,
  speedX: (Math.random() - 0.5) * 0.5,
  speedY: (Math.random() - 0.5) * 0.5,
  glow: Math.random() * 15 + 5
}));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "#00aaff";
    ctx.shadowBlur = p.glow;
    ctx.shadowColor = "#00aaff";
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================
   MENU MOBILE
============================ */
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  if (menu) {
    menu.classList.toggle("show-menu");
  }
}

/* ============================
   MODO CLARO / ESCURO
============================ */
const toggleBtn = document.getElementById("theme-toggle");

if (toggleBtn) {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    toggleBtn.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    toggleBtn.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

/* ============================
   ANIMAÇÃO DE ENTRADA SUAVE (Intersection Observer)
============================ */
const elements = document.querySelectorAll(".section, .neon-card, .tech-card, .equip-card, .dashboard-box");

if (elements.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
}

/* ============================
   EFEITO DE BRILHO NO TÍTULO
============================ */
const title = document.querySelector(".glow-title");

if (title) {
  setInterval(() => {
    title.style.textShadow = "0 0 10px #00aaff, 0 0 20px #00aaff, 0 0 40px #00aaff";
    setTimeout(() => {
      title.style.textShadow = "0 0 5px #00aaff, 0 0 10px #00aaff";
    }, 500);
  }, 2000);
}

/* ============================
   LÓGICA DE PESQUISA UNIVERSAL
============================ */
const inputBusca = document.querySelector('.filtro-input');

if (inputBusca) {
  inputBusca.addEventListener('keyup', function() {
    const termo = inputBusca.value.toLowerCase();
    
    // Filtro para Tabelas
    const linhas = document.querySelectorAll('.report-table tbody tr');
    linhas.forEach(linha => {
      const texto = linha.innerText.toLowerCase();
      linha.style.display = texto.includes(termo) ? '' : 'none';
    });

    // Filtro para Cards
    const cards = document.querySelectorAll('.neon-card');
    cards.forEach(card => {
      const nome = card.querySelector('h3')?.innerText.toLowerCase() || "";
      card.style.display = nome.includes(termo) ? '' : 'none';
    });
  });
}
