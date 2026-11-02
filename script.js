/* =========================================================
   MAHAK KAHAR PORTFOLIO — script.js
   ========================================================= */

'use strict';

// ── NAVBAR SCROLL ─────────────────────────────────────────
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

// ── ACTIVE NAV LINK (Intersection Observer) ────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

// ── HAMBURGER MENU ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu on nav link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── SCROLL REVEAL ─────────────────────────────────────────
// Select every element that carries the reveal class — covers all sections
const revealElements = document.querySelectorAll('.reveal');

// Add reveal class programmatically
revealElements.forEach((el, i) => {
  el.classList.add('reveal');
  // Stagger siblings within the same parent
  const siblings = el.parentElement ? el.parentElement.children : [];
  const siblingIndex = Array.from(siblings).indexOf(el);
  if (siblingIndex === 1) el.classList.add('reveal-delay-1');
  if (siblingIndex === 2) el.classList.add('reveal-delay-2');
  if (siblingIndex === 3) el.classList.add('reveal-delay-3');
  if (siblingIndex === 4) el.classList.add('reveal-delay-4');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── CONTACT FORM ──────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('form-submit');
  const success = document.getElementById('form-success');

  btn.disabled = true;
  btn.textContent = 'Sending…';

  // Simulate async send (replace with actual API / EmailJS integration)
  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.innerHTML = `Send Message <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
    success.style.display = 'block';
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  }, 1200);
}

// Expose to global scope for onsubmit handler
window.handleFormSubmit = handleFormSubmit;

// ── ANIMATED NUMBER COUNTER ───────────────────────────────
function animateCounter(el, target, suffix = '', duration = 1500) {
  const isFloat = target % 1 !== 0;
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = startVal + eased * target;
    el.textContent = isFloat ? current.toFixed(2) + suffix : Math.floor(current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Observe .stat-num elements (the number counters in the About section)
const statValues = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      // Guard: don't re-animate
      if (el.dataset.animated) return;
      el.dataset.animated = '1';
      const text = el.textContent.trim();
      const num = parseFloat(text);
      const suffix = text.slice(num.toString().length); // e.g. '+'
      if (!isNaN(num)) animateCounter(el, num, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statValues.forEach(el => counterObserver.observe(el));

// ── CURSOR GLOW EFFECT (desktop only) ────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 280px; height: 280px; border-radius: 50%;
    background: radial-gradient(circle, rgba(104, 123, 134, 0.08) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.left = mouseX + 'px';
    glow.style.top = mouseY + 'px';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}

// ── TYPING EFFECT for hero role ───────────────────────────
const roleTexts = [
  'Frontend Developer',
  'React.js Enthusiast',
  'Full-Stack Developer',
  'Problem Solver',
];

// The typed text goes into <span id="typed-role"> inside .hero-role
const typedSpan = document.getElementById('typed-role');

if (typedSpan) {
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function typeRole() {
    const current = roleTexts[roleIdx];

    if (!deleting) {
      typedSpan.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeRole, 1800);
        return;
      }
    } else {
      typedSpan.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roleTexts.length;
        setTimeout(typeRole, 300);
        return;
      }
    }
    setTimeout(typeRole, deleting ? 55 : 90);
  }

  // Start with first role already typed, begin deleting after a pause
  typedSpan.textContent = roleTexts[0];
  charIdx = roleTexts[0].length;
  deleting = true;
  setTimeout(typeRole, 2000);
}
