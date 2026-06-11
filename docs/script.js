const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector(".nav-toggle");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeToggleText = document.querySelector("[data-theme-toggle-text]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
let hasPlayedHellIntro = false;

document.body.dataset.theme = "garden";

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

const closeNav = () => {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

const syncThemeToggle = (theme) => {
  const isHell = theme === "hell";
  themeToggle.setAttribute("aria-pressed", String(isHell));
  themeToggle.setAttribute("aria-label", isHell ? "Switch to garden theme" : "Switch to hell theme");
  themeToggleText.textContent = isHell ? "Garden" : "Hell";
};

const playHellIntro = () => {
  if (hasPlayedHellIntro) return;

  hasPlayedHellIntro = true;
  document.body.classList.remove("is-hell-intro");
  document.body.classList.remove("has-hell-mark");

  requestAnimationFrame(() => {
    document.body.classList.add("is-hell-intro");
  });

  window.setTimeout(() => {
    document.body.classList.add("has-hell-mark");
  }, 560);

  window.setTimeout(() => {
    document.body.classList.remove("is-hell-intro");
  }, 7200);
};

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "hell" ? "garden" : "hell";
  document.body.dataset.theme = nextTheme;
  syncThemeToggle(nextTheme);
  closeNav();

  if (nextTheme === "hell") {
    playHellIntro();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-30% 0px -55% 0px",
    threshold: [0.1, 0.25, 0.5],
  }
);

sections.forEach((section) => observer.observe(section));
window.addEventListener("scroll", syncHeader, { passive: true });
syncThemeToggle(document.body.dataset.theme);
syncHeader();
