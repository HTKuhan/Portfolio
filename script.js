/* =============================================
   SOJA TOLISOA Hanitse — Portfolio JavaScript
   ============================================= */

// ==============================
// 1. ANIMATED CANVAS BACKGROUND
// ==============================
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], mouseX = 0, mouseY = 0;
  const NODE_COUNT = 70;
  const MAX_DIST = 140;
  const COLORS = ['45,212,191', '16,185,129', '6,182,212'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Update nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${nodes[i].color}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      // Mouse interaction
      const mdx = nodes[i].x - mouseX;
      const mdy = nodes[i].y - mouseY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < 150) {
        const alpha = (1 - mDist / 150) * 0.35;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(45,212,191, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.color}, 0.55)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createNodes(); });
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  resize();
  createNodes();
  draw();
})();

// ==============================
// 2. NAVBAR SCROLL EFFECT
// ==============================
(function () {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = sec.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Active nav link style
  const style = document.createElement('style');
  style.textContent = '.nav-link.active { color: var(--teal) !important; background: var(--teal-dim) !important; }';
  document.head.appendChild(style);
})();

// ==============================
// 3. HAMBURGER MENU
// ==============================
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ==============================
// 4. AOS (Animate On Scroll)
// ==============================
(function () {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ==============================
// 5. ANIMATED COUNTERS
// ==============================
(function () {
  function animateCounter(el, target) {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statCards = document.querySelectorAll('.stat-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target.querySelector('.counter');
        const target = parseInt(entry.target.dataset.target);
        animateCounter(el, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => observer.observe(card));
})();

// ==============================
// 6. SKILL BAR ANIMATION
// ==============================
(function () {
  const fills = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.dataset.width;
        setTimeout(() => {
          entry.target.style.width = width + '%';
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();

// ==============================
// 7. TIMELINE TABS
// ==============================
(function () {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const items = document.querySelectorAll('.timeline-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.classList.remove('hidden');
          // re-trigger animation
          item.style.opacity = '0';
          item.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

// ==============================
// 8. RECRUITER MATCH WIDGET
// ==============================
(function () {
  const checkboxes = document.querySelectorAll('.match-opt input[type="checkbox"]');
  const bar = document.getElementById('match-bar');
  const scoreEl = document.getElementById('match-score');

  const messages = {
    0: "Sélectionnez des besoins ci-dessus",
    20: "🙂 Compatibilité partielle — Regardons ça de plus près !",
    40: "😊 Bon potentiel — Je peux être utile !",
    60: "🌟 Bonne compatibilité — Je suis votre candidate !",
    80: "🔥 Très forte compatibilité — Contactez-moi vite !",
    100: "🚀 Compatibilité parfaite — Je suis LA personne qu'il vous faut !"
  };

  function updateMatch() {
    let total = 0;
    checkboxes.forEach(cb => { if (cb.checked) total += parseInt(cb.value); });
    bar.style.width = total + '%';
    const key = Object.keys(messages).reverse().find(k => total >= parseInt(k)) || 0;
    scoreEl.textContent = `${total}% — ${messages[key]}`;

    // Color feedback
    if (total >= 80) { bar.style.background = 'linear-gradient(90deg, #10b981, #34d399)'; }
    else if (total >= 60) { bar.style.background = 'linear-gradient(90deg, #2dd4bf, #10b981)'; }
    else if (total >= 40) { bar.style.background = 'linear-gradient(90deg, #06b6d4, #2dd4bf)'; }
    else { bar.style.background = 'linear-gradient(90deg, #64748b, #94a3b8)'; }
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateMatch));
})();

// ==============================
// 9. TOAST NOTIFICATIONS
// ==============================
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function copyToClipboard(text, message) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast('✅ ' + message)).catch(() => fallbackCopy(text, message));
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.focus(); el.select();
  try {
    document.execCommand('copy');
    showToast('✅ ' + message);
  } catch (e) {
    showToast('❌ Impossible de copier');
  }
  document.body.removeChild(el);
}

// ==============================
// 10. CONTACT FORM
// ==============================
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const name = document.getElementById('sender-name').value;
  const email = document.getElementById('sender-email').value;
  const message = document.getElementById('sender-message').value;

  // Construct mailto link
  const subject = encodeURIComponent(`Message de ${name} via Portfolio`);
  const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  const mailtoLink = `mailto:hsoja097@gmail.com?subject=${subject}&body=${body}`;

  btn.textContent = '✅ Message préparé !';
  btn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
  setTimeout(() => {
    window.location.href = mailtoLink;
  }, 400);
  setTimeout(() => {
    btn.innerHTML = '<span>Envoyer le message</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    btn.style.background = '';
    e.target.reset();
    showToast('📧 Votre client email s\'est ouvert !');
  }, 2500);
}

// ==============================
// 11. SMOOTH SCROLL FOR NAV LINKS
// ==============================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ==============================
// 12. HERO IMAGE PARALLAX
// ==============================
(function () {
  const heroImg = document.getElementById('hero-img');
  if (!heroImg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroImg.style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });
})();

// ==============================
// 13. TIMELINE ITEM TRANSITIONS (CSS)
// ==============================
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .timeline-item {
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .timeline-item.hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
})();

// ==============================
// 14. PAGE LOAD ANIMATION
// ==============================
(function () {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  window.addEventListener('load', () => {
    setTimeout(() => { document.body.style.opacity = '1'; }, 50);
  });
})();
