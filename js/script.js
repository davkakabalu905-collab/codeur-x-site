/* ===================================
   CODEUR X - Main JavaScript
   =================================== */

'use strict';

// ===================================
// PAGE LOADER
// ===================================
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1500);
  }
});

// ===================================
// NAVBAR
// ===================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

// Scroll effect
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Scroll to top visibility
  const scrollTop = document.getElementById('scrollTop');
  if (scrollTop) {
    if (window.scrollY > 400) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }
  }
});

// Hamburger toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });
}

if (navOverlay) {
  navOverlay.addEventListener('click', closeNav);
}

function closeNav() {
  if (hamburger) hamburger.classList.remove('active');
  if (navMenu) navMenu.classList.remove('open');
  if (navOverlay) navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Active nav link
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
setActiveNav();

// ===================================
// SCROLL REVEAL
// ===================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, observerOptions);

function initScrollReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    scrollObserver.observe(el);
  });
}

// ===================================
// ANIMATED COUNTER
// ===================================
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);

  const update = () => {
    start = Math.min(start + step, target);
    element.textContent = Math.floor(start) + (element.dataset.suffix || '');
    if (start < target) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target + (element.dataset.suffix || '');
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
  document.querySelectorAll('.stat-count').forEach(el => {
    counterObserver.observe(el);
  });
}

// ===================================
// SKILL BARS ANIMATION
// ===================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const width = bar.dataset.width;
        setTimeout(() => { bar.style.width = width; }, 200);
      });
    }
  });
}, { threshold: 0.3 });

function initSkillBars() {
  document.querySelectorAll('.skills-section').forEach(el => {
    skillObserver.observe(el);
  });
}

// ===================================
// PARTICLES BACKGROUND
// ===================================
function createParticles(container, count = 30) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.width = (Math.random() * 3 + 1) + 'px';
    p.style.height = p.style.width;
    p.style.opacity = Math.random() * 0.4 + 0.1;
    container.appendChild(p);
  }
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

// Close modal on overlay click
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

    // Get data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    btn.disabled = true;

    // Prepare WhatsApp Message
    const waMessage = `🚀 *Nouveau Message - CODEUR X*\n\n*Nom:* ${data.name}\n*Email:* ${data.email}\n*Sujet:* ${data.subject}\n*Message:* ${data.message}`;
    const waUrl = `https://wa.me/243970037759?text=${encodeURIComponent(waMessage)}`;

    // Update WhatsApp button in popup
    const waConfirmBtn = document.getElementById('waConfirmBtn');
    if (waConfirmBtn) {
      waConfirmBtn.href = waUrl;
    }

    // Since we use target="hidden_iframe", the form submits without refreshing the page.
    // We just wait a bit for the submission to process and then show the success UI.
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;

      // Show success popup
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
// SUBJECT OPTIONS SELECTION
// ===================================
function initSubjectOptions() {
  const options = document.querySelectorAll('.subject-opt');
  const hiddenInput = document.getElementById('subject');

  if (!options.length || !hiddenInput) return;

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      // Remove selected class from all
      options.forEach(o => o.classList.remove('selected'));
      // Add to current
      opt.classList.add('selected');
      // Update hidden input
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
// TYPED EFFECT
// ===================================
function typeText(element, texts, speed = 80) {
  if (!element) return;

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
      setTimeout(type, 2000);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    const delay = isDeleting ? speed / 2 : speed;
    setTimeout(type, delay);
  };

  type();
}

// ===================================
// SMOOTH SCROLL LINKS
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
// TILT EFFECT ON CARDS
// ===================================
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

// ===================================
// NAVBAR HIDE ON SCROLL DOWN
// ===================================
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (navbar && currentScrollY > 100) {
    if (currentScrollY > lastScrollY + 5) {
      // scrolling down - keep visible for UX
    } else if (currentScrollY < lastScrollY - 5) {
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

  // Particles in hero sections
  const particleContainer = document.querySelector('.particles-bg');
  if (particleContainer) {
    createParticles(particleContainer, 40);
  }

  // Typed text
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const texts = typedEl.dataset.texts ? typedEl.dataset.texts.split('|') : [];
    if (texts.length > 0) {
      typeText(typedEl, texts);
    }
  }
});
