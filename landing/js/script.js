document.addEventListener('DOMContentLoaded', () => {

  // ===================== NAVBAR SCROLL =====================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===================== MOBILE MENU =====================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close on nav link click
  document.querySelectorAll('.nav-menu li a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ===================== FAQ ACCORDION =====================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isActive = question.classList.contains('active');

      // Close all
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        q.nextElementSibling.style.maxHeight = null;
      });

      // If wasn't active, open it
      if (!isActive) {
        question.classList.add('active');
        const answer = question.nextElementSibling;
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ===================== CONTACT FORM VALIDATION =====================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('c-name').value.trim();
      const email = document.getElementById('c-email').value.trim();
      const message = document.getElementById('c-message').value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) { alert('Please enter your name.'); return; }
      if (!email || !emailRegex.test(email)) { alert('Please enter a valid email address.'); return; }
      if (!message) { alert('Please enter your message.'); return; }

      // Simulate submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        contactForm.reset();
        formSuccess.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        setTimeout(() => formSuccess.classList.add('hidden'), 6000);
      }, 1500);
    });
  }

  // ===================== SCROLL REVEAL ANIMATION =====================
  const revealElements = document.querySelectorAll(
    '.step-card, .service-card, .testimonial-card, .why-item, .faq-item, .trust-item'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 100 * (entry.target.dataset.delay || 0));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el, i) => {
    el.dataset.delay = i % 4;
    revealObserver.observe(el);
  });

  // ===================== HERO PARTICLES =====================
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: rgba(255,255,255,${Math.random() * 0.15 + 0.05});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 8 + 5}s ease-in-out infinite ${Math.random() * 5}s;
        pointer-events: none;
      `;
      particlesContainer.appendChild(particle);
    }
  }

});
