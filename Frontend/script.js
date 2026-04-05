// ---------- Utility selectors ----------
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// ---------- Footer year ----------
$('#year').textContent = new Date().getFullYear();

// ---------- Mobile nav ----------
const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

$$('[data-nav]').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Typing effect ----------
const typingTarget = $('#typingText');
const words = ['startup-grade web apps.', 'data-driven dashboards.', 'automation workflows.'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const currentWord = words[wordIndex];

  if (!deleting) {
    charIndex += 1;
    typingTarget.textContent = currentWord.slice(0, charIndex);

    if (charIndex === currentWord.length) {
      deleting = true;
      return setTimeout(typeLoop, 1200);
    }
  } else {
    charIndex -= 1;
    typingTarget.textContent = currentWord.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  const speed = deleting ? 45 : 85;
  setTimeout(typeLoop, speed);
}

typeLoop();

// ---------- Scroll reveal + skill meter animation ----------
const revealEls = $$('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');

      // Animate skill progress when cards come into view.
      if (entry.target.classList.contains('skill-card')) {
        const level = entry.target.getAttribute('data-level') || 0;
        const bar = $('span', $('.meter', entry.target));
        bar.style.width = `${level}%`;
      }

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealEls.forEach((el) => revealObserver.observe(el));

// ---------- Active nav highlight on section change ----------
const sectionEls = $$('main section[id]');
const navAnchors = $$('[data-nav]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((link) => {
        const isMatch = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', isMatch);
      });
    });
  },
  {
    rootMargin: '-40% 0px -50% 0px',
    threshold: 0.02,
  }
);

sectionEls.forEach((section) => navObserver.observe(section));

// ---------- Project filtering ----------
const filterGroup = $('#projectFilters');
const projectCards = $$('.project-card');

filterGroup.addEventListener('click', (event) => {
  const target = event.target.closest('.filter-btn');
  if (!target) return;

  const selected = target.getAttribute('data-filter');

  $$('.filter-btn', filterGroup).forEach((btn) => btn.classList.remove('active'));
  target.classList.add('active');

  projectCards.forEach((card) => {
    const categories = card.getAttribute('data-category') || '';
    const show = selected === 'all' || categories.includes(selected);

    card.classList.toggle('hide', !show);
    card.style.display = show ? '' : 'none';

    if (show) {
      card.animate(
        [
          { opacity: 0, transform: 'translateY(10px) scale(0.98)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        { duration: 280, easing: 'ease-out' }
      );
    }
  });
});

// ---------- Contact form (demo interaction only) ----------
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitBtn = contactForm.querySelector("button");
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  formNote.textContent = "Sending message...";

  const formData = new FormData(contactForm);

  try {
    const response = await fetch("http://127.0.0.1:8000/contact", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (response.ok && result.success) {
      formNote.textContent = "✅ Message sent successfully!";
      contactForm.reset();
    } else {
      formNote.textContent = "❌ Failed to send message.";
      console.error("Backend error:", result);
    }

  } catch (error) {
    console.error("Connection error:", error);
    formNote.textContent = "❌ Server not reachable.";
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Send Message";
});
