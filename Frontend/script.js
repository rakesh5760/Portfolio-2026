// ---------- Utility selectors ----------
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// ---------- Initializers ----------
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

// ---------- Scroll Progress Bar ----------
const scrollProgress = $('#scrollProgress');
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  scrollProgress.style.width = `${scrolled}%`;
});

// ---------- Typing effect ----------
const typingTarget = $('#typingText');
const words = ['startup-grade web apps.', 'data-driven dashboards.', 'automation workflows.'];
let wordIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const currentWord = words[wordIndex];
  if (!deleting) {
    charIndex++;
    typingTarget.textContent = currentWord.slice(0, charIndex);
    if (charIndex === currentWord.length) { deleting = true; return setTimeout(typeLoop, 1500); }
  } else {
    charIndex--;
    typingTarget.textContent = currentWord.slice(0, charIndex);
    if (charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; }
  }
  setTimeout(typeLoop, deleting ? 50 : 100);
}
typeLoop();

// ---------- Intersection Observer (Reveal + Meter) ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      if (entry.target.classList.contains('skill-card')) {
        const level = entry.target.getAttribute('data-level') || 0;
        const bar = $('span', $('.meter', entry.target));
        if (bar) bar.style.width = `${level}%`;
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
$$('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Active nav highlight ----------
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$('[data-nav]').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
$$('main section[id]').forEach(section => navObserver.observe(section));

// ---------- Project filtering ----------
$('#projectFilters').addEventListener('click', (e) => {
  const target = e.target.closest('.filter-btn');
  if (!target) return;
  const selected = target.getAttribute('data-filter');
  $$('.filter-btn', $('#projectFilters')).forEach(btn => btn.classList.remove('active'));
  target.classList.add('active');

  $$('.project-card').forEach(card => {
    const show = selected === 'all' || card.getAttribute('data-category').includes(selected);
    card.style.display = show ? '' : 'none';
    if (show) card.animate([{ opacity: 0, transform: 'scale(0.95)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 300 });
  });
});

// ---------- Modal System ----------
const modalOverlay = $('#modalOverlay');
const modalBody = $('#modalBody');
const modalClose = $('#modalClose');

const projectData = {
  'solana': {
    title: 'Solana Transaction Analyzer',
    tags: ['Python', 'Streamlit', 'Helius API'],
    description: 'A deep-dive analytics dashboard that pulls real-time data from the Solana blockchain. It provides wallet behavior insights, transaction volume heatmaps, and whale tracking alerts.',
    links: { github: '#', demo: '#' }
  },
  'superstore': {
    title: 'Superstore US Sales Dashboard',
    tags: ['Power BI', 'Data Modeling', 'DAX'],
    description: 'Comprehensive business intelligence report covering logistics, profitability, and customer segmentation. Features interactive slicers and trend forecasting using DAX measures.',
    links: { demo: '#' }
  },
  'excel': {
    title: 'Excel Data Cleaning Automations',
    tags: ['Python', 'Pandas', 'Openpyxl'],
    description: 'A suite of scripts designed to handle messy enterprise-level Excel datasets. Automates deduplication, format normalization, and cross-sheet validation, reducing processing time by 90%.',
    links: { github: '#' }
  },
  'syncly': {
    title: 'Syncly (Full-Stack Contact Management System)',
    tags: ['Python', 'FastAPI', 'React', 'MySQL', 'Google APIs', 'XML', 'Excel'],
    description: 'Developed a full-stack contact management system using FastAPI and React to manage and organize large datasets. Implemented automated data ingestion via XML uploads and integrated Google People API for contact and calendar synchronization. Designed logic for duplicate detection and structured data handling to improve data consistency. Utilized MySQL and Excel for scalable data storage and retrieval.',
    links: { github: '#' }
  }
};

$$('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const pid = card.getAttribute('data-project-id');
    const data = projectData[pid];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="modal-body-content">
        <h2>${data.title}</h2>
        <div class="badge-row">
          ${data.tags.map(t => `<span class="badge">${t}</span>`).join('')}
        </div>
        <p>${data.description}</p>
        <div class="modal-links">
          ${data.links.github ? `<a href="${data.links.github}" class="btn btn-primary">GitHub Code</a>` : ''}
          ${data.links.demo ? `<a href="${data.links.demo}" class="btn btn-ghost">Live Demo</a>` : ''}
        </div>
      </div>
    `;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

modalClose.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) modalClose.click();
});

// ---------- Resume Drawer Logic ----------
const resumeDrawer = $('#resumeDrawer');
const openResumeBtn = $('#openResume');
const closeResumeBtn = $('#closeResume');
const drawerOverlay = $('#drawerOverlay');

const toggleResume = (open) => {
  resumeDrawer.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
  resumeDrawer.setAttribute('aria-hidden', String(!open));
};

openResumeBtn.addEventListener('click', () => toggleResume(true));
closeResumeBtn.addEventListener('click', () => toggleResume(false));
drawerOverlay.addEventListener('click', () => toggleResume(false));

// ---------- Form Validation & Submission ----------
const contactForm = $('#contactForm');
const formNote = $('#formNote');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('button', contactForm);
  btn.disabled = true;
  btn.textContent = 'Launching...';
  formNote.textContent = 'Syncing with orbital servers...';

  try {
    const response = await fetch('https://portfolio-2026-1-dwwe.onrender.com/contact', {
      method: 'POST',
      body: new FormData(contactForm)
    });
    const res = await response.json();
    if (response.ok && res.success) {
      formNote.textContent = '✅ Message transmitted successfully!';
      contactForm.reset();
    } else {
      const errorMsg = res.error || 'Server error. Please try again later.';
      formNote.textContent = `❌ ${errorMsg}`;
      console.error('Form submission failed:', res);
    }
  } catch (err) {
    formNote.textContent = '❌ Connection failed. Check your internet or backend status.';
    console.error('Fetch error:', err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message';
  }
});
