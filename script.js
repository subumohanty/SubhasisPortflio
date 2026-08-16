/* ============================================
   SUBHASIS MOHANTY — Portfolio Interactions
   Stars · Scroll Reveals · Side Navigation
   ============================================ */

(function () {
  'use strict';

  // ── Page Loader ──
  window.addEventListener('load', () => {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      setTimeout(() => loader.classList.add('loaded'), 600);
    }
  });


  // ============================================
  // STAR CANVAS — Twinkling Night Sky
  // ============================================
  const canvas = document.getElementById('star-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    let animId;
    const STAR_COUNT = 200;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function createStars() {
      stars = [];
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 1.5 + 0.3,
          baseOpacity: Math.random() * 0.5 + 0.3,
          opacity: 0,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    function createShootingStar() {
      if (Math.random() > 0.002) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.4,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 4,
        opacity: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    }

    function drawStars(time) {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Draw static twinkling stars
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        star.opacity = star.baseOpacity + twinkle * 0.25;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${Math.max(0.05, star.opacity)})`;
        ctx.fill();

        // Subtle glow for brighter stars
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 255, 218, ${star.opacity * 0.08})`;
          ctx.fill();
        }
      });

      // Draw shooting stars
      createShootingStar();
      shootingStars = shootingStars.filter(ss => {
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity = 1 - (ss.life / ss.maxLife);

        if (ss.opacity <= 0) return false;

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        gradient.addColorStop(0, `rgba(100, 255, 218, 0)`);
        gradient.addColorStop(1, `rgba(100, 255, 218, ${ss.opacity * 0.7})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 255, 240, ${ss.opacity})`;
        ctx.fill();

        return true;
      });
    }

    function animate(time) {
      drawStars(time);
      animId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    createStars();
    animate(0);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        createStars();
      }, 200);
    });
  }


  // ============================================
  // SCROLL REVEAL — IntersectionObserver
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }


  // ============================================
  // SIDE NAVIGATION — Scroll Spy + Toggle
  // ============================================
  const sideNav = document.querySelector('.side-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navDots = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('section[id]');

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      if (sideNav) sideNav.classList.toggle('mobile-open');
    });
  }

  // Smooth scroll on dot click
  navDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = dot.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav
        if (navToggle) navToggle.classList.remove('active');
        if (sideNav) sideNav.classList.remove('mobile-open');
      }
    });
  });

  // Scroll spy — highlight active section
  if ('IntersectionObserver' in window && sections.length > 0) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navDots.forEach(dot => {
              dot.classList.toggle('active', dot.getAttribute('data-target') === id);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(section => spyObserver.observe(section));
  }

  // Hide side nav at top of page
  if (sideNav) {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => {
          sideNav.classList.toggle('hidden', entry.isIntersecting);
        },
        { threshold: 0.5 }
      );
      heroObserver.observe(heroSection);
    }
  }


  // ============================================
  // CORNER RADIAL MENU
  // ============================================
  const cornerMenuContainer = document.getElementById('corner-menu');
  const cornerMenuTrigger = document.getElementById('corner-menu-trigger');
  const cornerMenuClose = document.getElementById('corner-menu-close');
  const cornerMenuItems = document.querySelectorAll('.corner-menu-item');
  const scrollDownBtn = document.getElementById('scroll-down-btn');

  if (cornerMenuTrigger && cornerMenuContainer) {
    cornerMenuTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      cornerMenuContainer.classList.add('active');
    });
  }

  if (cornerMenuClose && cornerMenuContainer) {
    cornerMenuClose.addEventListener('click', (e) => {
      e.stopPropagation();
      cornerMenuContainer.classList.remove('active');
    });
  }

  cornerMenuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (cornerMenuContainer) {
        cornerMenuContainer.classList.remove('active');
      }
    });
  });

  // Close corner menu when clicking outside
  document.addEventListener('click', (e) => {
    if (cornerMenuContainer && cornerMenuContainer.classList.contains('active')) {
      if (!cornerMenuContainer.contains(e.target)) {
        cornerMenuContainer.classList.remove('active');
      }
    }
  });

  // Scroll Down Button Click
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ============================================
  // CURSOR GLOW EFFECT (desktop only)
  // ============================================
  if (window.matchMedia('(min-width: 769px)').matches) {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // ============================================
  // FOOTER CHARACTER — EMOJI THROWING
  // ============================================
  const emojiContainer = document.getElementById('emoji-particles');
  if (emojiContainer) {
    const emojis = ['🌸', '🎉', '🧡', '❤️', '✨', '🚀', '💻', '⚡', '🔥', '💡', '☕', '🎨'];
    
    function throwEmoji() {
      const el = document.createElement('span');
      el.className = 'emoji-particle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      
      // Random trajectory — fly high above hands
      const txPeak = (Math.random() - 0.5) * 140;
      const tyPeak = -(Math.random() * 60 + 40);
      const txEnd = txPeak + (Math.random() - 0.5) * 60;
      const tyEnd = tyPeak - (Math.random() * 50 + 30);
      
      el.style.setProperty('--tx', txPeak + 'px');
      el.style.setProperty('--ty-peak', tyPeak + 'px');
      el.style.setProperty('--tx-end', txEnd + 'px');
      el.style.setProperty('--ty-end', tyEnd + 'px');
      
      emojiContainer.appendChild(el);
      
      // Remove after animation
      setTimeout(() => el.remove(), 2000);
    }
    
    // Throw emojis on interval
    setInterval(throwEmoji, 1200);
    // Also throw on click
    document.getElementById('footer-character')?.addEventListener('click', () => {
      for (let i = 0; i < 5; i++) {
        setTimeout(throwEmoji, i * 100);
      }
    });
  }

})();

