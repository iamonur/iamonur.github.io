const SCROLL_THRESHOLD = 24;

function initNav() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links a");

  if (!header || !toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const updateScrolledState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
  };
  updateScrolledState();
  window.addEventListener("scroll", updateScrolledState, { passive: true });

  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length === 0) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function initReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (targets.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

function initFooterYear() {
  const el = document.querySelector("[data-current-year]");
  if (!el) return;
  el.textContent = String(new Date().getFullYear());
}

initNav();
initReveal();
initFooterYear();
