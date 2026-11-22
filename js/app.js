/**
 * EDITMORPH — Premium Real Estate Video Editing Agency
 * Main Application Script
 */
document.addEventListener('DOMContentLoaded', () => {
  const C = window.EDITMORPH;
  if (!C) return console.error('EDITMORPH config not found');

  initHeroVideo();
  initNav();
  renderProblems();
  renderServices();
  renderPortfolio();
  renderOffer();
  renderProcess();
  renderWhyUs();
  renderTestimonials();
  renderPricing();
  renderFAQ();
  initModals();
  initScrollReveal();
});

/* ── HERO YOUTUBE BACKGROUND VIDEO ────────────────── */
let heroYtPlayer = null;

function initHeroVideo() {
  if (window.YT && window.YT.Player && !heroYtPlayer) {
    setupHeroPlayer();
  }
}

window.onYouTubeIframeAPIReady = function() {
  setupHeroPlayer();
};

function setupHeroPlayer() {
  const iframe = document.getElementById('hero-bg-iframe');
  if (iframe && window.YT && window.YT.Player && !heroYtPlayer) {
    try {
      heroYtPlayer = new window.YT.Player('hero-bg-iframe', {
        events: {
          onReady: function(e) {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: function(e) {
            if (e.data === window.YT.PlayerState.ENDED) {
              e.target.seekTo(0);
              e.target.playVideo();
            }
          }
        }
      });
    } catch (err) {
      console.warn('YouTube hero background player init:', err);
    }
  }
}

/* ── NAVIGATION ───────────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-menu');
  const links = document.querySelectorAll('.mobile-menu a, .nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (toggle && drawer) {
    toggle.addEventListener('click', () => drawer.classList.toggle('open'));
    links.forEach(l => l.addEventListener('click', () => drawer.classList.remove('open')));
  }
}

/* ── PROBLEMS ─────────────────────────────────────── */
function renderProblems() {
  const el = document.getElementById('problems-grid');
  if (!el) return;

  const icons = [
    // 01: No Time to Edit (Stopwatch with action blades)
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="13" r="8"/>
      <path d="M12 9v4l2.5 2.5"/>
      <path d="M5 3L2 6"/>
      <path d="M19 3l3 3"/>
      <path d="M12 2v3"/>
    </svg>`,
    // 02: Inconsistent Content (Calendar with fluctuating waveform)
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <path d="M7 16l3-3 3 3 4-4"/>
      <circle cx="17" cy="12" r="1" fill="currentColor"/>
    </svg>`,
    // 03: Unprofessional Presentation (Video camera / 4K frame)
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M23 7l-7 5 7 5V7z"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      <circle cx="8" cy="12" r="2.5"/>
      <line x1="5" y1="8" x2="6" y2="8"/>
    </svg>`,
    // 04: No Content System (Connected system modules)
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="2" width="8" height="8" rx="2"/>
      <rect x="14" y="2" width="8" height="8" rx="2"/>
      <rect x="14" y="14" width="8" height="8" rx="2"/>
      <rect x="2" y="14" width="8" height="8" rx="2"/>
      <path d="M6 10v4"/>
      <path d="M18 10v4"/>
      <path d="M10 6h4"/>
      <path d="M10 18h4"/>
    </svg>`
  ];

  const tags = ["TIME SINK", "ALGORITHM PENALTY", "BRAND RISK", "NO WORKFLOW"];

  el.innerHTML = window.EDITMORPH.problems.map((p, i) => `
    <div class="problem-card reveal">
      <div class="problem-card-icon">
        ${icons[i] || icons[0]}
      </div>
      <div class="problem-card-body">
        <div class="problem-card-meta">
          <span class="problem-num">${p.num}</span>
          <span class="problem-tag">${tags[i] || "CHALLENGE"}</span>
        </div>
        <h3 class="problem-title">${p.title}</h3>
        <p class="problem-desc">${p.desc}</p>
      </div>
    </div>`).join('');
}

/* ── SERVICES ─────────────────────────────────────── */
function renderServices() {
  const el = document.getElementById('services-grid');
  if (!el) return;

  const serviceData = {
    reels: { img: 'assets/images/service-reels.jpg', tag: 'VERTICAL 9:16' },
    film: { img: 'assets/images/service-film.jpg', tag: 'CINEMATIC 4K' },
    drone: { img: 'assets/images/service-drone.jpg', tag: 'AERIAL HDR' },
    walkthrough: { img: 'assets/images/service-walkthrough.jpg', tag: 'SMOOTH GIMBAL' },
    branding: { img: 'assets/images/service-branding.jpg', tag: 'AUTHORITY BUILDER' },
    social: { img: 'assets/images/service-social.jpg', tag: 'DAILY CONTENT' }
  };

  el.innerHTML = window.EDITMORPH.services.map(s => {
    const meta = serviceData[s.icon] || serviceData.reels;
    return `
    <div class="service-card reveal">
      <div class="service-thumb">
        <img src="${meta.img}" alt="${s.title}" loading="lazy">
        <div class="service-thumb-badge">${meta.tag}</div>
      </div>
      <div class="service-body">
        <h3 class="service-title">${s.title}</h3>
        <p class="service-desc">${s.desc}</p>
      </div>
    </div>`;
  }).join('');
}

/* ── PORTFOLIO ────────────────────────────────────── */
function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  const filters = document.querySelectorAll('.portfolio-filter-btn');
  if (!grid) return;

  const projectImages = {
    p1: 'assets/images/portfolio-p1.jpg',
    p2: 'assets/images/portfolio-p2.jpg',
    p3: 'assets/images/portfolio-p3.jpg',
    p4: 'assets/images/portfolio-p4.jpg',
    p5: 'assets/images/portfolio-p5.jpg',
    p6: 'assets/images/portfolio-p6.jpg'
  };

  function display(filter) {
    const items = window.EDITMORPH.portfolio.filter(p => filter === 'all' || p.filter === filter);
    grid.innerHTML = items.map((p, i) => {
      const img = projectImages[p.id] || `assets/images/portfolio-p${(i % 6) + 1}.jpg`;
      return `
      <div class="portfolio-item reveal" data-id="${p.id}">
        <div class="portfolio-item-bg">
          <img src="${img}" alt="${p.title}" class="portfolio-img" loading="lazy">
        </div>
        <div class="portfolio-overlay">
          <div class="portfolio-play">
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <span class="portfolio-cat">${p.category}</span>
          <span class="portfolio-title">${p.title}</span>
        </div>
      </div>`;
    }).join('');

    grid.querySelectorAll('.portfolio-item').forEach(item => {
      item.addEventListener('click', () => openVideoModal(item.dataset.id));
    });
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      display(btn.dataset.filter);
    });
  });

  display('all');
}

/* ── FLAGSHIP OFFER ───────────────────────────────── */
function renderOffer() {
  const el = document.getElementById('offer-content');
  if (!el) return;
  const o = window.EDITMORPH.flagshipOffer;

  el.innerHTML = `
    <div class="offer-grid">
      <div class="offer-left">
        <div class="eyebrow">${o.eyebrow}</div>
        <h2 class="section-title">${o.headline}</h2>
        <p class="section-subtitle">${o.description}</p>

        <div class="offer-price-row">
          <span class="offer-price">${o.price}</span>
          <span class="offer-period">${o.period}</span>
        </div>
        <div class="offer-per-unit">${o.perUnit}</div>

        <div class="offer-included-title">WHAT'S INCLUDED</div>
        <ul class="offer-included-list">
          ${o.included.map(item => `<li><span class="check-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>${item}</li>`).join('')}
        </ul>

        <button class="btn btn-accent btn-lg btn-block open-apply-modal">GET MY 15 REELS — $699</button>
        <p class="offer-supporting">Monthly subscription. No long-term contract.</p>

        <div class="guarantee-card">
          <div class="guarantee-title">THE EDITMORPH QUALITY GUARANTEE</div>
          <p class="guarantee-text">${o.guarantee}</p>
        </div>
      </div>

      <div class="offer-right">
        <div class="offer-bonuses">
          <div class="offer-bonuses-title">INCLUDED BONUSES</div>
          ${o.bonuses.map((b, i) => `
            <div class="bonus-item">
              <span class="bonus-label"><span class="bonus-num">${String(i + 1).padStart(2, '0')}</span>${b.title}</span>
              <span class="bonus-value">${b.value}</span>
            </div>`).join('')}
          <div class="bonus-total">
            <span class="bonus-total-label">Total Bonus Value</span>
            <span class="bonus-total-value">${o.totalBonusValue}</span>
          </div>
          <p class="bonus-disclaimer">*Estimated marketing values, not cash values. All bonuses are included with the Growth plan at no additional charge.</p>
        </div>
      </div>
    </div>`;
}

/* ── PROCESS ──────────────────────────────────────── */
function renderProcess() {
  const el = document.getElementById('process-grid');
  if (!el) return;

  const icons = [
    '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
    '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>'
  ];

  el.innerHTML = window.EDITMORPH.process.map((p, i) => `
    <div class="process-card reveal">
      <div class="process-step">STEP ${p.step}</div>
      <div class="process-icon">${icons[i]}</div>
      <h3 class="process-title">${p.title}</h3>
      <p class="process-desc">${p.desc}</p>
    </div>`).join('');
}

/* ── WHY US ───────────────────────────────────────── */
function renderWhyUs() {
  const el = document.getElementById('why-grid');
  if (!el) return;
  el.innerHTML = window.EDITMORPH.whyUs.map((w, i) => `
    <div class="why-card reveal">
      <div class="why-num">${String(i + 1).padStart(2, '0')}</div>
      <h3 class="why-title">${w.title}</h3>
      <p class="why-desc">${w.desc}</p>
    </div>`).join('');
}

/* ── TESTIMONIALS ─────────────────────────────────── */
function renderTestimonials() {
  const el = document.getElementById('testimonials-grid');
  if (!el) return;
  el.innerHTML = window.EDITMORPH.testimonials.map(t => `
    <div class="testimonial-card reveal">
      ${t.placeholder ? '<div class="testimonial-placeholder-badge">PLACEHOLDER — AWAITING REAL TESTIMONIAL</div>' : ''}
      <p class="testimonial-quote">"${t.quote}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.name.charAt(1) === 'C' ? '?' : '?'}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    </div>`).join('');
}

/* ── PRICING ──────────────────────────────────────── */
function renderPricing() {
  const el = document.getElementById('pricing-grid');
  if (!el) return;

  el.innerHTML = window.EDITMORPH.pricing.map(p => `
    <div class="pricing-card ${p.featured ? 'featured' : ''} reveal">
      <div>
        <div class="pricing-badge">${p.badge}</div>
        <h3 class="pricing-name">${p.name}</h3>
        <p class="pricing-desc">${p.desc}</p>
        <div class="pricing-price-row">
          <span class="pricing-amount">${p.price}</span>
          <span class="pricing-period">${p.period}</span>
        </div>
        <ul class="pricing-features">
          ${p.features.map(f => `<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>${f}</span></li>`).join('')}
        </ul>
      </div>
      <button class="btn ${p.featured ? 'btn-accent' : 'btn-outline'} btn-block open-apply-modal">${p.cta}</button>
    </div>`).join('');
}

/* ── FAQ ──────────────────────────────────────────── */
function renderFAQ() {
  const el = document.getElementById('faq-grid');
  if (!el) return;
  el.innerHTML = window.EDITMORPH.faq.map((f, i) => `
    <div class="faq-item ${i === 0 ? 'active' : ''}">
      <button class="faq-question" type="button">
        <span>${f.q}</span>
        <span class="faq-toggle"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><p>${f.a}</p></div>
    </div>`).join('');

  el.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      el.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });
}

/* ── MODALS ───────────────────────────────────────── */
function initModals() {
  // Apply/Enquiry Modal
  document.addEventListener('click', e => {
    if (e.target.closest('.open-apply-modal')) {
      e.preventDefault();
      openApplyModal();
    } else if (e.target.closest('.open-vsl-modal')) {
      e.preventDefault();
      openVslModal();
    }
  });

  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m || e.target.closest('.modal-close')) closeModals();
    });
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

  // Form submission
  const form = document.getElementById('apply-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Submitting...';
      btn.disabled = true;

      // Simulate submission (replace with real endpoint from config)
      const endpoint = window.EDITMORPH.formEndpoint;
      if (endpoint) {
        const data = new FormData(form);
        fetch(endpoint, { method: 'POST', body: data })
          .then(r => { if (!r.ok) throw new Error(); showSuccess(); })
          .catch(() => { btn.textContent = 'Submission failed — try again'; btn.disabled = false; });
      } else {
        setTimeout(showSuccess, 600);
      }

      function showSuccess() {
        form.style.display = 'none';
        document.getElementById('apply-success').classList.add('show');
      }
    });
  }
}

function openVslModal() {
  closeModals();
  const m = document.getElementById('vsl-modal');
  const iframe = document.getElementById('vsl-modal-iframe');
  const videoId = (window.EDITMORPH && window.EDITMORPH.hero && window.EDITMORPH.hero.youtubeVideoId) || 'G8efi3QOOb8';
  if (!m || !iframe) return;

  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&playsinline=1&enablejsapi=1`;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openApplyModal() {
  closeModals();
  const m = document.getElementById('apply-modal');
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function openVideoModal(projectId) {
  closeModals();
  const m = document.getElementById('video-modal');
  const p = window.EDITMORPH.portfolio.find(x => x.id === projectId);
  if (!m || !p) return;

  document.getElementById('video-modal-title').textContent = p.title;
  document.getElementById('video-modal-cat').textContent = p.category;
  const vid = document.getElementById('portfolio-modal-video');
  if (vid) {
    vid.currentTime = 0;
    vid.play().catch(() => {});
  }
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  const vslIframe = document.getElementById('vsl-modal-iframe');
  if (vslIframe) {
    vslIframe.src = '';
  }
  const vid = document.getElementById('portfolio-modal-video');
  if (vid) {
    vid.pause();
  }
  document.body.style.overflow = '';
}

/* ── SCROLL REVEAL ────────────────────────────────── */
function initScrollReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Observe after dynamic rendering
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, 100);
}
