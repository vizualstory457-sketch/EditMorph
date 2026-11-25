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
  renderPortfolio();
  renderProcess();
  renderFAQ();
  initModals();
  initScrollReveal();
  initTeamAccordion();
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

/* ── PORTFOLIO (VIMEO 9:16 VERTICAL REELS) ───────── */
function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  const wrapper = document.getElementById('vimeo-carousel-wrapper');
  const prevBtn = document.querySelector('.vimeo-prev-btn');
  const nextBtn = document.querySelector('.vimeo-next-btn');
  if (!grid) return;

  const items = window.EDITMORPH.portfolio || [];
  grid.innerHTML = items.map((p) => `
    <div class="vimeo-card reveal" data-id="${p.id}" data-vimeo="${p.vimeoUrl}" role="button" tabindex="0" aria-label="Play ${p.title}">
      <div class="vimeo-card-thumb-wrap">
        <img src="${p.thumb}" alt="${p.title}" class="vimeo-card-thumb" loading="lazy">
      </div>
      <div class="vimeo-play-btn" aria-hidden="true">
        <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
      <div class="vimeo-card-overlay">
        <div class="vimeo-card-meta">
          <h3 class="vimeo-card-title">${p.title}</h3>
        </div>
      </div>
    </div>`).join('');

  let hasDragged = false;

  grid.querySelectorAll('.vimeo-card').forEach(item => {
    const handleOpen = () => {
      if (hasDragged) return;
      openVimeoModal(item.dataset.id);
    };
    item.addEventListener('click', handleOpen);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVimeoModal(item.dataset.id);
      }
    });
  });

  if (wrapper && prevBtn && nextBtn) {
    const getScrollStep = () => {
      const card = grid.querySelector('.vimeo-card');
      return card ? card.offsetWidth + 24 : 300;
    };

    prevBtn.addEventListener('click', () => {
      wrapper.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      wrapper.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    // Desktop mouse drag-to-scroll support without blocking card clicks
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    wrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      hasDragged = false;
      startX = e.pageX - wrapper.offsetLeft;
      scrollLeft = wrapper.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      wrapper.classList.remove('is-dragging');
      setTimeout(() => {
        hasDragged = false;
      }, 60);
    });

    wrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - wrapper.offsetLeft;
      const dist = Math.abs(x - startX);
      if (dist > 8) {
        hasDragged = true;
        wrapper.classList.add('is-dragging');
        e.preventDefault();
        const walk = (x - startX) * 1.3;
        wrapper.scrollLeft = scrollLeft - walk;
      }
    });
  }
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

        <a href="https://calendly.com/dibendudas4577/30min" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-lg btn-block open-apply-modal">GET MY 15 REELS — $699</a>
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
  initMethodTabs();
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
      <a href="https://calendly.com/dibendudas4577/30min" target="_blank" rel="noopener noreferrer" class="btn ${p.featured ? 'btn-accent' : 'btn-outline'} btn-block open-apply-modal">${p.cta}</a>
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
  // Apply/Enquiry / Calendly Booking
  document.addEventListener('click', e => {
    const bookingBtn = e.target.closest('.open-apply-modal');
    if (bookingBtn) {
      e.preventDefault();
      const url = (window.EDITMORPH && window.EDITMORPH.brand && window.EDITMORPH.brand.bookingUrl) || 'https://calendly.com/dibendudas4577/30min';
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
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
  const videoId = (window.EDITMORPH && window.EDITMORPH.hero && window.EDITMORPH.hero.vslVideoId) || 'G8efi3QOOb8';
  if (!m || !iframe) return;

  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&playsinline=1&enablejsapi=1`;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openApplyModal() {
  const url = (window.EDITMORPH && window.EDITMORPH.brand && window.EDITMORPH.brand.bookingUrl) || 'https://calendly.com/dibendudas4577/30min';
  window.open(url, '_blank', 'noopener,noreferrer');
}

function openVimeoModal(projectId) {
  closeModals();
  const m = document.getElementById('vimeo-modal');
  const iframe = document.getElementById('vimeo-modal-iframe');
  const loader = document.getElementById('vimeo-player-loader');
  const p = (window.EDITMORPH.portfolio || []).find(x => String(x.id) === String(projectId) || String(x.vimeoId) === String(projectId));
  if (!m || !iframe || !p) return;

  const videoId = p.vimeoId || p.id;
  const titleEl = document.getElementById('vimeo-modal-title');
  if (titleEl) titleEl.textContent = p.title;

  const directLink = document.getElementById('vimeo-direct-link');
  if (directLink) {
    directLink.href = p.vimeoUrl || `https://vimeo.com/${videoId}`;
  }

  iframe.style.display = 'block';
  if (loader) loader.classList.remove('hidden');

  iframe.onload = () => {
    if (loader) loader.classList.add('hidden');
  };

  setTimeout(() => {
    if (loader) loader.classList.add('hidden');
  }, 4000);

  iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&autopause=0&controls=1&playsinline=1&title=0&byline=0&portrait=0&app_id=122963`;

  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openVideoModal(projectId) {
  closeModals();
  const m = document.getElementById('video-modal');
  const p = window.EDITMORPH.portfolio.find(x => x.id === projectId);
  if (!m || !p) return;

  document.getElementById('video-modal-title').textContent = p.title;
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
  const vimeoIframe = document.getElementById('vimeo-modal-iframe');
  if (vimeoIframe) {
    vimeoIframe.src = '';
  }
  const loader = document.getElementById('vimeo-player-loader');
  if (loader) {
    loader.classList.remove('hidden');
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


/* ── THE EDITMORPH METHOD INTERACTIVE TABS ────────── */
function initMethodTabs() {
  const tabs = document.querySelectorAll('.method-tab');
  const panels = document.querySelectorAll('.method-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      if (!targetId) return;

      tabs.forEach(t => {
        const isActive = t === tab;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach(p => {
        if (p.id === targetId) {
          p.classList.add('active');
          p.removeAttribute('hidden');
        } else {
          p.classList.remove('active');
          p.setAttribute('hidden', 'true');
        }
      });
    });

    tab.addEventListener('keydown', (e) => {
      const tabList = Array.from(tabs);
      const currentIndex = tabList.indexOf(tab);
      let nextIndex = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % tabList.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + tabList.length) % tabList.length;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        tabList[nextIndex].focus();
        tabList[nextIndex].click();
      }
    });
  });
}


/* ── WHO WE ARE INTERACTIVE EXPANDABLE TEAM ACCORDION ─ */
function initTeamAccordion() {
  const grid = document.querySelector('.team-grid');
  const cards = document.querySelectorAll('.team-card');
  if (!grid || !cards.length) return;

  cards.forEach(card => {
    // Click or tap to expand card
    card.addEventListener('click', (e) => {
      const isAlreadyExpanded = card.classList.contains('is-expanded');
      cards.forEach(c => {
        c.classList.remove('is-expanded');
        c.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyExpanded) {
        card.classList.add('is-expanded');
        card.setAttribute('aria-expanded', 'true');

        // On mobile/touch track, scroll expanded card into view
        if (window.innerWidth <= 768) {
          card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    });

    // Keyboard support: Enter or Space
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // When cursor leaves grid on desktop, clear is-expanded so CSS hover returns to balanced equal cards
  grid.addEventListener('mouseleave', () => {
    cards.forEach(c => {
      c.classList.remove('is-expanded');
      c.setAttribute('aria-expanded', 'false');
    });
  });

  // Click outside to collapse expanded card
  document.addEventListener('click', (e) => {
    if (!grid.contains(e.target)) {
      cards.forEach(c => {
        c.classList.remove('is-expanded');
        c.setAttribute('aria-expanded', 'false');
      });
    }
  });
}
