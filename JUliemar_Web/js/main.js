const menu = document.getElementById("nav-menu");
const menuToggle = document.getElementById("nav-toggle");
const menuClose = document.getElementById("nav-close");

function setMenuOpen(isOpen) {
  if (!menu || !menuToggle) return;

  menu.classList.toggle("show-menu", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

menuToggle?.addEventListener("click", () => {
  setMenuOpen(!menu?.classList.contains("show-menu"));
});

menuClose?.addEventListener("click", () => setMenuOpen(false));

menu?.querySelectorAll(".nav__link").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

const carouselTrack = document.querySelector(".carousel-track");
const carouselDots = document.querySelector(".carousel-dots");
const carouselCards = carouselTrack
  ? Array.from(carouselTrack.querySelectorAll(".project-card"))
  : [];

if (carouselTrack && carouselDots && carouselCards.length) {
  let activeCard = 0;

  const setActiveCard = (index) => {
    activeCard = (index + carouselCards.length) % carouselCards.length;
    carouselCards[activeCard].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });

    carouselDots.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeCard);
      dot.setAttribute("aria-current", String(dotIndex === activeCard));
    });
  };

  carouselCards.forEach((card, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show project ${index + 1}`);
    dot.addEventListener("click", () => setActiveCard(index));
    carouselDots.append(dot);
  });

  carouselDots.firstElementChild?.classList.add("is-active");
  carouselDots.firstElementChild?.setAttribute("aria-current", "true");

  document.querySelector(".carousel-btn.prev")?.addEventListener("click", () => {
    setActiveCard(activeCard - 1);
  });

  document.querySelector(".carousel-btn.next")?.addEventListener("click", () => {
    setActiveCard(activeCard + 1);
  });

  let scrollFrame = 0;
  carouselTrack.addEventListener("scroll", () => {
    if (window.innerWidth > 760) return;

    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const trackStart = carouselTrack.getBoundingClientRect().left;
      const closestCard = carouselCards.reduce((closest, card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - trackStart);
        return distance < closest.distance ? { index, distance } : closest;
      }, { index: 0, distance: Number.POSITIVE_INFINITY });

      activeCard = closestCard.index;
      carouselDots.querySelectorAll(".carousel-dot").forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeCard);
        dot.setAttribute("aria-current", String(index === activeCard));
      });
    });
  });
}

const skillItems = document.querySelectorAll(".skill-item[data-percent]");
const animateSkills = () => {
  skillItems.forEach((item) => {
    const percent = Number(item.dataset.percent);
    if (Number.isFinite(percent)) {
      item.style.setProperty("--skill-progress", `${Math.min(100, Math.max(0, percent))}%`);
    }
  });
};

if ("IntersectionObserver" in window) {
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      animateSkills();
      observer.disconnect();
    }
  });

  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  } else {
    animateSkills();
  }
} else {
  animateSkills();
}

const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast");
let toastTimeout;

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!toast) return;

  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);

  contactForm.reset();
});