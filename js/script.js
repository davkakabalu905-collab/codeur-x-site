/* ===================================
   CODEUR X — Main JavaScript
   Dark & Light Tech Redesign — Vanilla JS
   =================================== */
'use strict';

// ===================================
// THEME MANAGEMENT (DARK / LIGHT)
// ===================================
(function initTheme() {
  function getPreferredTheme() {
    const saved = localStorage.getItem('cx-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  const initialTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  // Toggle button handler (delegated so works across all pages & dynamically)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#themeToggle, .theme-toggle');
    if (!btn) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('cx-theme', nextTheme);

    // Micro-interaction bounce
    btn.style.transform = 'scale(0.85)';
    setTimeout(() => { btn.style.transform = ''; }, 180);

    // Toast feedback
    if (typeof showToast === 'function') {
      showToast('success', nextTheme === 'light' ? 'Mode Clair' : 'Mode Sombre', 
        nextTheme === 'light' ? 'Thème clair activé' : 'Thème sombre activé');
    }
  });
})();

// ===================================
// PAGE LOADER (Instant load, no artificial delay)
// ===================================
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.add('hidden');
    loader.style.display = 'none';
  }
});

// ===================================
// HERO CANVAS — PARTICLES & GRID
// ===================================
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -1000, y: -1000 };
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 130;
  const MOUSE_INFLUENCE = 120;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Particle factory
  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // Draw subtle grid
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < W; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Update & draw particles
    particles.forEach((p, i) => {
      // Mouse attraction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_INFLUENCE) {
        const force = (MOUSE_INFLUENCE - dist) / MOUSE_INFLUENCE;
        p.vx += dx * force * 0.002;
        p.vy += dy * force * 0.002;
      }

      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? `rgba(12,139,137,${p.opacity * 1.3})` : `rgba(14,154,152,${p.opacity})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x;
        const ey = p.y - q.y;
        const edist = Math.sqrt(ex * ex + ey * ey);

        if (edist < CONNECTION_DIST) {
          const alpha = (1 - edist / CONNECTION_DIST) * (isLight ? 0.22 : 0.15);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = isLight ? `rgba(2,132,199,${alpha})` : `rgba(20,184,200,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

// ===================================
// NAVBAR
// ===================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  // Scroll-to-top visibility
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });
}

function closeNav() {
  if (hamburger) hamburger.classList.remove('active');
  if (navMenu)   navMenu.classList.remove('open');
  if (navOverlay) navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (navOverlay) navOverlay.addEventListener('click', closeNav);
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeNav));

// Active link
(function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ===================================
// SCROLL REVEAL
// ===================================
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

function initScrollReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    scrollObserver.observe(el);
  });
}

// ===================================
// ANIMATED COUNTER
// ===================================
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const suffix = el.dataset.suffix || '';

  const update = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + suffix;
    if (start < target) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      if (!el.dataset.animated) {
        el.dataset.animated = 'true';
        animateCounter(el, target);
      }
    }
  });
}, { threshold: 0.5 });

function initCounters() {
  document.querySelectorAll('.stat-count').forEach(el => counterObserver.observe(el));
}

// ===================================
// SKILL BARS
// ===================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width; }, 200);
      });
    }
  });
}, { threshold: 0.3 });

function initSkillBars() {
  document.querySelectorAll('.skills-section').forEach(el => skillObserver.observe(el));
}

// ===================================
// CLEAN TYPED TEXT (Smooth & Natural)
// ===================================
function typeText(element, texts, speed = 65) {
  if (!element || !texts.length) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const currentText = texts[textIndex];

    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(type, 2400);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 300);
      return;
    }

    const delay = isDeleting ? speed / 2 : speed;
    setTimeout(type, delay);
  };

  type();
}

// ===================================
// FILTER TABS
// ===================================
function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const parent = tab.closest('.filter-wrapper') || tab.parentElement;
      parent.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      const grid = document.querySelector(tab.dataset.target || '.filterable-grid');
      if (!grid) return;

      grid.querySelectorAll('[data-category]').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.classList.add('reveal');
          setTimeout(() => item.classList.add('revealed'), 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ===================================
// MODAL
// ===================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
    const modal = e.target.closest('.modal-overlay');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// ===================================
// TOAST NOTIFICATION
// ===================================
function showToast(type, title, message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.className = 'toast ' + type;
  toast.querySelector('.toast-text h5').textContent = title;
  toast.querySelector('.toast-text p').textContent = message;
  toast.querySelector('.toast-icon i').className = type === 'success' ? 'fas fa-check' : 'fas fa-times';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ===================================
// CONTACT FORM
// ===================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    btn.disabled = true;

    const waMessage = `🚀 *Nouveau Message - CODEUR X*\n\n*Nom:* ${data.name}\n*Email:* ${data.email}\n*Sujet:* ${data.subject}\n*Message:* ${data.message}`;
    const waUrl = `https://wa.me/243970037759?text=${encodeURIComponent(waMessage)}`;

    const waConfirmBtn = document.getElementById('waConfirmBtn');
    if (waConfirmBtn) waConfirmBtn.href = waUrl;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;

      const popup = document.getElementById('successPopup');
      if (popup) {
        popup.classList.add('show');
      } else {
        showToast('success', 'Message envoyé !', 'Nous vous répondrons dans les 24h.');
      }
      form.reset();
    }, 2000);
  });
}

// ===================================
// SUBJECT OPTIONS
// ===================================
function initSubjectOptions() {
  const options = document.querySelectorAll('.subject-opt');
  const hiddenInput = document.getElementById('subject');
  if (!options.length || !hiddenInput) return;

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      hiddenInput.value = opt.dataset.value;
    });
  });
}

// ===================================
// SCROLL TO TOP
// ===================================
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ===================================
// SMOOTH SCROLL
// ===================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===================================
// CARD HOVER EFFECT (Subtle & Natural)
// ===================================
function initTilt() {
  // Handled cleanly via CSS transforms for natural fluidity
}

// ===================================
// SPOTLIGHT EFFECT (Disabled - Clean & Matte)
// ===================================
function initSpotlight() {
  // Disabled: clean matte aesthetic without light halos
}

// ===================================
// SCROLL PROGRESS BAR
// ===================================
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    bar.style.width = progress + '%';
  });
}

// ===================================
// NAVBAR HIDE/SHOW ON SCROLL
// ===================================
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (navbar && currentScrollY > 100) {
    if (currentScrollY > lastScrollY + 10) {
      // scrolling down — hide
      navbar.style.transform = 'translateY(-100%)';
    } else if (currentScrollY < lastScrollY - 5) {
      // scrolling up — show
      navbar.style.transform = 'translateY(0)';
    }
  } else if (navbar) {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = currentScrollY;
});

// ===================================
// INIT ALL
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initSkillBars();
  initFilterTabs();
  initScrollTop();
  initContactForm();
  initSubjectOptions();
  initSmoothScroll();
  initTilt();
  initSpotlight();
  initScrollProgress();

  // Auto-update footer year
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('#footerYear, .footer-year').forEach(el => {
    el.textContent = currentYear;
  });

  // Typed text
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const texts = typedEl.dataset.texts ? typedEl.dataset.texts.split('|') : [];
    if (texts.length > 0) typeText(typedEl, texts);
  }
});
