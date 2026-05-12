document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const body = document.body;

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('active');
    
    // Toggle menu icon state (X or hamburger)
    const spans = hamburger.querySelectorAll('span');
    if (!isExpanded) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      body.style.overflow = 'hidden'; // Prevent scroll when menu is open
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
      body.style.overflow = 'auto';
    }
  });

  // Close mobile menu when clicking a link
  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
      body.style.overflow = 'auto';
    });
  });

  // --- Reveal Animations on Scroll ---
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Set initial state for animatable elements
  const animElements = document.querySelectorAll('.feature-card, .step-card, .pricing-card, .section-title, .hero-dashboard');
  animElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = navbar.offsetHeight;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- Counter Animation for Stats (Optional Polish) ---
  const stats = document.querySelectorAll('.stat-num');
  stats.forEach(stat => {
    const target = parseInt(stat.innerText.replace(/[^\d]/g, ''));
    if (!isNaN(target)) {
      let count = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const updateCount = () => {
        if (count < target) {
          count += increment;
          stat.innerHTML = Math.ceil(count) + (stat.innerHTML.includes('%') ? '<span>%</span>' : (stat.innerHTML.includes('h') ? 'h' : ''));
          requestAnimationFrame(updateCount);
        } else {
          stat.innerHTML = target + (stat.innerHTML.includes('%') ? '<span>%</span>' : (stat.innerHTML.includes('h') ? 'h' : ''));
        }
      };
      
      // Trigger when dashboard is visible
      const dashboard = document.getElementById('hero-dashboard');
      const statObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          updateCount();
          statObserver.unobserve(dashboard);
        }
      });
      statObserver.observe(dashboard);
    }
  });
});
