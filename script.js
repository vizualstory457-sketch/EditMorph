/* ==========================================================================
   DIBENDU DAS — PORTFOLIO INTERACTIONS
   - Navbar sticky & active tab tracking
   - Mobile menu toggle
   - Binder folder tab switching & scroll sync
   - Smooth anchor scrolling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== 1. MOBILE MENU ====================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // ==================== 2. NAVBAR SCROLL OBSERVER ====================
    const navPills = document.querySelectorAll('.nav-pill');
    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                navPills.forEach(pill => {
                    if (pill.getAttribute('data-section') === currentId) {
                        navPills.forEach(p => p.classList.remove('active'));
                        pill.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(sec => sectionObserver.observe(sec));

    // ==================== 3. EDITORIAL SCRAPBOOK CAROUSEL (3 CLIENT CATEGORIES) ====================
    /**
     * PORTFOLIO DATA (CLIENT / NICHE CATEGORIES)
     * All videos are high-retention SHORT-FORM CONTENT / REELS / YOUTUBE SHORTS.
     * Exactly 3 client/niche categories:
     * 1. PERSONAL BRAND & BUSINESS
     * 2. AI & COACHES
     * 3. REAL ESTATE
     * 
     * To replace/add videos, edit the respective category's `videos` array below.
     */
    const PORTFOLIO_DATA = {
        "personal-brand": {
            id: "personal-brand",
            number: "01",
            name: "PERSONAL BRAND & BUSINESS",
            pillLabel: "01 — PERSONAL BRAND & BUSINESS",
            subtitle: "Talking-head content built for personal brands and businesses.",
            themeClass: "category-personal",
            accentColor: "#141414",
            accentBg: "#f5f4ef",
            accentWashi: "rgba(30, 30, 30, 0.85)",
            videos: [
                {
                    id: "01",
                    number: "PROJECT 01",
                    title: "Retention Edit 01",
                    subtitle: "Personal Brand / Business",
                    clientNiche: "PERSONAL BRAND",
                    nicheShort: "PERSONAL BRAND",
                    tag: "SHORT-FORM",
                    category: "TALKING HEAD",
                    date: "MAR 2, 2026",
                    description: "Talking-head short-form edit engineered to turn casual viewers into followers and buyers.",
                    videoUrl: "https://youtube.com/shorts/AuKz7l4qT5A",
                    videoId: "AuKz7l4qT5A",
                    thumbnail: "https://img.youtube.com/vi/AuKz7l4qT5A/maxresdefault.jpg",
                    accentColor: "#141414",
                    accentBg: "#f5f4ef",
                    accentWashi: "rgba(30, 30, 30, 0.85)",
                    noteText: "✦ 84% avg. watch time",
                    tiltDeg: -0.6
                },
                {
                    id: "02",
                    number: "PROJECT 02",
                    title: "Hook & Pacing Edit",
                    subtitle: "Personal Brand / Business",
                    clientNiche: "EXPERT AUTHORITY",
                    nicheShort: "PERSONAL BRAND",
                    tag: "SHORT-FORM",
                    category: "HOOK & PACING",
                    date: "FEB 18, 2026",
                    description: "Psychology-driven hook and rapid retention pacing with zero dead air.",
                    videoUrl: "https://www.youtube.com/shorts/_UCS9Feah-4",
                    videoId: "_UCS9Feah-4",
                    thumbnail: "https://img.youtube.com/vi/_UCS9Feah-4/maxresdefault.jpg",
                    accentColor: "#fab005",
                    accentBg: "#fff9db",
                    accentWashi: "rgba(250, 176, 5, 0.85)",
                    noteText: "⚡ hooked in 0.8s",
                    tiltDeg: 0.7
                },
                {
                    id: "03",
                    number: "PROJECT 03",
                    title: "Storytelling & Rhythm",
                    subtitle: "Personal Brand / Business",
                    clientNiche: "FOUNDER STORY",
                    nicheShort: "PERSONAL BRAND",
                    tag: "SHORT-FORM",
                    category: "NARRATIVE EDIT",
                    date: "JAN 30, 2026",
                    description: "Immersive storytelling and visual pacing that resets attention every few seconds.",
                    videoUrl: "https://www.youtube.com/shorts/g4YGTfwBy58",
                    videoId: "g4YGTfwBy58",
                    thumbnail: "https://img.youtube.com/vi/g4YGTfwBy58/maxresdefault.jpg",
                    accentColor: "#2f9e44",
                    accentBg: "#ebfbee",
                    accentWashi: "rgba(47, 158, 68, 0.85)",
                    noteText: "🎬 immersive narrative flow",
                    tiltDeg: -0.5
                },
                {
                    id: "04",
                    number: "PROJECT 04",
                    title: "High-Ticket Conversion Cut",
                    subtitle: "Personal Brand / Business",
                    clientNiche: "CONSULTING BRAND",
                    nicheShort: "PERSONAL BRAND",
                    tag: "SHORT-FORM",
                    category: "CONVERSIONS",
                    date: "JAN 15, 2026",
                    description: "Repurposed high-authority content built to generate inbound leads and sales.",
                    videoUrl: "https://www.youtube.com/shorts/cOm7ed43IuI",
                    videoId: "cOm7ed43IuI",
                    thumbnail: "https://img.youtube.com/vi/cOm7ed43IuI/maxresdefault.jpg",
                    accentColor: "#1971c2",
                    accentBg: "#e7f5ff",
                    accentWashi: "rgba(25, 113, 194, 0.85)",
                    noteText: "📈 engineered for high CTR",
                    tiltDeg: 0.8
                },
                {
                    id: "05",
                    number: "PROJECT 05",
                    title: "Pattern Interrupt Precision",
                    subtitle: "Personal Brand / Business",
                    clientNiche: "PODCAST REPURPOSE",
                    nicheShort: "PERSONAL BRAND",
                    tag: "SHORT-FORM",
                    category: "PATTERN INTERRUPT",
                    date: "DEC 28, 2025",
                    description: "Dynamic pattern interrupts, sound design, and text animation engineered for high watch time.",
                    videoUrl: "https://www.youtube.com/shorts/bMrSniqziH4",
                    videoId: "bMrSniqziH4",
                    thumbnail: "https://img.youtube.com/vi/bMrSniqziH4/maxresdefault.jpg",
                    accentColor: "#e8590c",
                    accentBg: "#fff4e6",
                    accentWashi: "rgba(232, 89, 12, 0.85)",
                    noteText: "🔥 attention-reset cuts",
                    tiltDeg: -0.4
                }
            ]
        },
        "ai-coaches": {
            id: "ai-coaches",
            number: "02",
            name: "AI & COACHES",
            pillLabel: "02 — AI & COACHES",
            subtitle: "High-retention short-form content for AI creators and coaches.",
            themeClass: "category-ai",
            accentColor: "#2563eb",
            accentBg: "#eff6ff",
            accentWashi: "rgba(37, 99, 235, 0.85)",
            videos: [
                {
                    id: "01",
                    number: "PROJECT 01",
                    title: "AI Tool Workflow Breakdown",
                    subtitle: "AI & Coaches",
                    clientNiche: "AI CREATOR & SAAS",
                    nicheShort: "AI & SAAS",
                    tag: "SHORT-FORM",
                    category: "AI BREAKDOWN",
                    date: "MAR 4, 2026",
                    description: "High-retention breakdown distilling complex AI tools into rapid visual hooks and sound design.",
                    videoUrl: "https://www.youtube.com/shorts/_UCS9Feah-4",
                    videoId: "_UCS9Feah-4",
                    thumbnail: "https://img.youtube.com/vi/_UCS9Feah-4/maxresdefault.jpg",
                    accentColor: "#2563eb",
                    accentBg: "#eff6ff",
                    accentWashi: "rgba(37, 99, 235, 0.85)",
                    noteText: "⚡ 92% hook retention rate",
                    tiltDeg: -0.6
                },
                {
                    id: "02",
                    number: "PROJECT 02",
                    title: "Coach Authority Masterclass",
                    subtitle: "AI & Coaches",
                    clientNiche: "ONLINE EDUCATOR",
                    nicheShort: "COACHING",
                    tag: "SHORT-FORM",
                    category: "COACHING REEL",
                    date: "FEB 22, 2026",
                    description: "Authority-driven talking head edit engineered to deliver upfront value and drive program inquiries.",
                    videoUrl: "https://youtube.com/shorts/AuKz7l4qT5A",
                    videoId: "AuKz7l4qT5A",
                    thumbnail: "https://img.youtube.com/vi/AuKz7l4qT5A/maxresdefault.jpg",
                    accentColor: "#0284c7",
                    accentBg: "#f0f9ff",
                    accentWashi: "rgba(2, 132, 199, 0.85)",
                    noteText: "✦ 2.4x inbound DM leads",
                    tiltDeg: 0.7
                },
                {
                    id: "03",
                    number: "PROJECT 03",
                    title: "Tech Explainer & Kinetic Motion",
                    subtitle: "AI & Coaches",
                    clientNiche: "AI BUSINESS",
                    nicheShort: "AI BUSINESS",
                    tag: "SHORT-FORM",
                    category: "TECH EXPLAINER",
                    date: "FEB 10, 2026",
                    description: "Fast-paced breakdown with kinetic motion graphics and synchronized SFX to hold viewer focus.",
                    videoUrl: "https://www.youtube.com/shorts/bMrSniqziH4",
                    videoId: "bMrSniqziH4",
                    thumbnail: "https://img.youtube.com/vi/bMrSniqziH4/maxresdefault.jpg",
                    accentColor: "#4f46e5",
                    accentBg: "#eef2ff",
                    accentWashi: "rgba(79, 70, 229, 0.85)",
                    noteText: "🧠 visual pacing engineering",
                    tiltDeg: -0.5
                },
                {
                    id: "04",
                    number: "PROJECT 04",
                    title: "Consultant Framework Spotlight",
                    subtitle: "AI & Coaches",
                    clientNiche: "CONSULTING EXPERT",
                    nicheShort: "CONSULTING",
                    tag: "SHORT-FORM",
                    category: "FRAMEWORK EDIT",
                    date: "JAN 25, 2026",
                    description: "Converting dense frameworks into dynamic visual retention reels that drive inbound discovery calls.",
                    videoUrl: "https://www.youtube.com/shorts/g4YGTfwBy58",
                    videoId: "g4YGTfwBy58",
                    thumbnail: "https://img.youtube.com/vi/g4YGTfwBy58/maxresdefault.jpg",
                    accentColor: "#0d9488",
                    accentBg: "#f0fdfa",
                    accentWashi: "rgba(13, 148, 136, 0.85)",
                    noteText: "📈 80%+ full video completion",
                    tiltDeg: 0.8
                },
                {
                    id: "05",
                    number: "PROJECT 05",
                    title: "AI Prompting Hack Reel",
                    subtitle: "AI & Coaches",
                    clientNiche: "AI EDUCATOR",
                    nicheShort: "AI CREATOR",
                    tag: "SHORT-FORM",
                    category: "VIRAL TUTORIAL",
                    date: "JAN 12, 2026",
                    description: "Screen-share hybrid reel combining live software demo with pattern interrupts to maximize saves and shares.",
                    videoUrl: "https://www.youtube.com/shorts/cOm7ed43IuI",
                    videoId: "cOm7ed43IuI",
                    thumbnail: "https://img.youtube.com/vi/cOm7ed43IuI/maxresdefault.jpg",
                    accentColor: "#7c3aed",
                    accentBg: "#f5f3ff",
                    accentWashi: "rgba(124, 58, 237, 0.85)",
                    noteText: "🔥 15K+ bookmark rate",
                    tiltDeg: -0.4
                }
            ]
        },
        "real-estate": {
            id: "real-estate",
            number: "03",
            name: "REAL ESTATE",
            pillLabel: "03 — REAL ESTATE",
            subtitle: "Short-form content designed for real estate brands and creators.",
            themeClass: "category-realestate",
            accentColor: "#b45309",
            accentBg: "#fffbeb",
            accentWashi: "rgba(180, 83, 9, 0.85)",
            videos: [
                {
                    id: "01",
                    number: "PROJECT 01",
                    title: "Luxury Property Walkthrough",
                    subtitle: "Real Estate",
                    clientNiche: "LUXURY REALTOR",
                    nicheShort: "REAL ESTATE",
                    tag: "SHORT-FORM",
                    category: "PROPERTY TOUR",
                    date: "MAR 1, 2026",
                    description: "Rhythm-driven luxury property reel blending speed ramps, sound design, and agent commentary.",
                    videoUrl: "https://www.youtube.com/shorts/g4YGTfwBy58",
                    videoId: "g4YGTfwBy58",
                    thumbnail: "https://img.youtube.com/vi/g4YGTfwBy58/maxresdefault.jpg",
                    accentColor: "#b45309",
                    accentBg: "#fffbeb",
                    accentWashi: "rgba(180, 83, 9, 0.85)",
                    noteText: "🏡 cinematic luxury pacing",
                    tiltDeg: -0.6
                },
                {
                    id: "02",
                    number: "PROJECT 02",
                    title: "Realtor Personal Brand Spotlight",
                    subtitle: "Real Estate",
                    clientNiche: "PROPERTY CREATOR",
                    nicheShort: "REAL ESTATE",
                    tag: "SHORT-FORM",
                    category: "AGENT BRANDING",
                    date: "FEB 15, 2026",
                    description: "Local market authority reel establishing trust through storytelling and rapid B-roll cuts.",
                    videoUrl: "https://youtube.com/shorts/AuKz7l4qT5A",
                    videoId: "AuKz7l4qT5A",
                    thumbnail: "https://img.youtube.com/vi/AuKz7l4qT5A/maxresdefault.jpg",
                    accentColor: "#c2410c",
                    accentBg: "#fff7ed",
                    accentWashi: "rgba(194, 65, 12, 0.85)",
                    noteText: "✦ trust-building hook",
                    tiltDeg: 0.7
                },
                {
                    id: "03",
                    number: "PROJECT 03",
                    title: "Architectural Tour & Pacing",
                    subtitle: "Real Estate",
                    clientNiche: "PROPERTY BUSINESS",
                    nicheShort: "REAL ESTATE",
                    tag: "SHORT-FORM",
                    category: "ARCHITECTURAL EDIT",
                    date: "FEB 02, 2026",
                    description: "Architectural highlight reel featuring speed transitions, micro-captions, and ambient soundscapes.",
                    videoUrl: "https://www.youtube.com/shorts/_UCS9Feah-4",
                    videoId: "_UCS9Feah-4",
                    thumbnail: "https://img.youtube.com/vi/_UCS9Feah-4/maxresdefault.jpg",
                    accentColor: "#047857",
                    accentBg: "#ecfdf5",
                    accentWashi: "rgba(4, 120, 87, 0.85)",
                    noteText: "⚡ 1.8M organic views",
                    tiltDeg: -0.5
                },
                {
                    id: "04",
                    number: "PROJECT 04",
                    title: "Listing Showcase & Buyer Hook",
                    subtitle: "Real Estate",
                    clientNiche: "REAL ESTATE AGENT",
                    nicheShort: "REAL ESTATE",
                    tag: "SHORT-FORM",
                    category: "LISTING HOOK",
                    date: "JAN 20, 2026",
                    description: "High-hook reel designed to stop scrolling buyers and convert impressions into direct inquiry DMs.",
                    videoUrl: "https://www.youtube.com/shorts/bMrSniqziH4",
                    videoId: "bMrSniqziH4",
                    thumbnail: "https://img.youtube.com/vi/bMrSniqziH4/maxresdefault.jpg",
                    accentColor: "#9a3412",
                    accentBg: "#fff7ed",
                    accentWashi: "rgba(154, 52, 18, 0.85)",
                    noteText: "🎯 high-intent buyer inquiries",
                    tiltDeg: 0.8
                },
                {
                    id: "05",
                    number: "PROJECT 05",
                    title: "Market Insight & Agent Trust",
                    subtitle: "Real Estate",
                    clientNiche: "REAL ESTATE BRAND",
                    nicheShort: "REAL ESTATE",
                    tag: "SHORT-FORM",
                    category: "MARKET BREAKDOWN",
                    date: "JAN 05, 2026",
                    description: "Market update talking head cut with visual data graphics and zero dead air.",
                    videoUrl: "https://www.youtube.com/shorts/cOm7ed43IuI",
                    videoId: "cOm7ed43IuI",
                    thumbnail: "https://img.youtube.com/vi/cOm7ed43IuI/maxresdefault.jpg",
                    accentColor: "#854d0e",
                    accentBg: "#fefce8",
                    accentWashi: "rgba(133, 77, 14, 0.85)",
                    noteText: "📈 86% retention through data",
                    tiltDeg: -0.4
                }
            ]
        }
    };

    // Elements
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselViewport = document.getElementById('carouselViewport');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const projectIndicator = document.getElementById('indicatorText');
    const carouselPagination = document.getElementById('carouselPagination');
    const workboardContainer = document.getElementById('workboardContainer');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const categoryPillLabel = document.getElementById('categoryPillLabel');
    const categoryMissionText = document.getElementById('categoryMissionText');

    if (carouselTrack) {
        let currentCategoryKey = 'personal-brand';
        let currentIndex = 0;

        // Stop any currently playing videos
        const stopPlayingVideos = () => {
            const mediaBoxes = carouselTrack.querySelectorAll('.video-media-box');
            mediaBoxes.forEach(box => {
                const embedSlot = box.querySelector('.video-embed-slot');
                if (embedSlot && embedSlot.querySelector('iframe')) {
                    embedSlot.innerHTML = '';
                    box.classList.remove('is-playing');
                }
            });
        };

        // Render slides for the active category
        const renderCategorySlides = (categoryKey) => {
            const catData = PORTFOLIO_DATA[categoryKey] || PORTFOLIO_DATA['personal-brand'];
            const videos = catData.videos;

            carouselTrack.innerHTML = videos.map((proj, idx) => `
                <div class="carousel-slide ${idx === 0 ? 'active-slide' : ''}" 
                     data-index="${idx}"
                     style="--slide-accent: ${proj.accentColor}; --slide-accent-bg: ${proj.accentBg}; --slide-washi: ${proj.accentWashi}; --card-tilt: ${proj.tiltDeg}deg;">
                    <div class="project-board-card">
                        
                        <!-- Physical Taped Video Frame (Vertical 9:16) -->
                        <div class="video-pin-frame">
                            <!-- Realistic Scrapbook Masking Tape: Top-Left -->
                            <div class="masking-tape tape-top-left" aria-hidden="true"></div>
                            
                            <!-- Realistic Scrapbook Masking Tape: Top-Right -->
                            <div class="masking-tape tape-top-right" aria-hidden="true"></div>
                            
                            <!-- Accent Washi Tape Strip with Project Theme -->
                            <div class="accent-washi-strip" aria-hidden="true"></div>

                            <!-- 9:16 Vertical Video Container -->
                            <div class="video-media-box" id="mediaBox-${categoryKey}-${idx}" data-video-id="${proj.videoId}">
                                <div class="video-poster">
                                    <img src="${proj.thumbnail}" 
                                         alt="${proj.title} thumbnail" 
                                         class="poster-img"
                                         loading="${idx === 0 ? 'eager' : 'lazy'}"
                                         onerror="this.src='https://img.youtube.com/vi/${proj.videoId}/hqdefault.jpg'">
                                    <div class="poster-overlay">
                                        <button class="play-trigger-btn" type="button" aria-label="Play ${proj.title}">
                                            <span class="play-triangle">▶</span>
                                            <span class="play-text">WATCH SHORT</span>
                                        </button>
                                    </div>
                                    <div class="format-badge">9:16 SHORTS</div>
                                </div>
                                <div class="video-embed-slot"></div>
                            </div>

                            <!-- Realistic Scrapbook Masking Tape: Bottom Corner Detail -->
                            <div class="masking-tape tape-bottom-right" aria-hidden="true"></div>
                        </div>

                        <!-- Pinned Editorial Project Notes Card -->
                        <div class="project-info-card">
                            
                            <!-- Editorial Meta Badges Row -->
                            <div class="info-tags-row">
                                <span class="project-num-badge">${proj.number}</span>
                                <span class="project-tag-badge">${proj.nicheShort || 'SHORT-FORM'}</span>
                                <span class="project-client-badge">RETENTION EDIT</span>
                            </div>

                            <!-- Project Title with Hand-drawn Doodle Underline -->
                            <div class="project-title-wrapper">
                                <h3 class="project-title">${proj.title}</h3>
                                <svg class="project-doodle-underline" width="130" height="9" viewBox="0 0 130 9" fill="none">
                                    <path d="M2 6C35 2 95 2 128 7M15 8C45 6 85 6 115 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                                </svg>
                            </div>

                            <!-- Subtitle / Niche Tag -->
                            <div class="project-niche-subline">
                                <span class="niche-bullet">◆</span> ${proj.subtitle}
                            </div>

                            <!-- Concise Description -->
                            <p class="project-description">
                                ${proj.description}
                            </p>

                            <!-- Editor's Scrapbook Sticky Note -->
                            <div class="editor-note-strip">
                                <span class="pin-glyph">📌</span>
                                <span class="editor-note-text">${proj.noteText}</span>
                            </div>

                            <!-- Action Link Button -->
                            <div class="project-actions-row">
                                <a href="${proj.videoUrl}" target="_blank" rel="noopener" class="btn-project-cta" aria-label="View ${proj.title} on YouTube">
                                    <span class="btn-tab-accent"></span>
                                    <span class="btn-text">WATCH SHORT <span class="arrow-ne">↗</span></span>
                                </a>
                                <span class="direct-link-subtext">Direct YouTube Link</span>
                            </div>

                        </div>

                    </div>
                </div>
            `).join('');

            // Render pagination pills
            if (carouselPagination) {
                carouselPagination.innerHTML = videos.map((proj, idx) => `
                    <button class="pagination-dot ${idx === 0 ? 'active' : ''}" 
                            type="button"
                            data-index="${idx}" 
                            aria-label="Go to ${proj.number}"
                            style="--dot-accent: ${proj.accentColor};">
                        <span class="dot-num">${proj.id}</span>
                    </button>
                `).join('');
            }

            // Attach play triggers
            const mediaBoxes = carouselTrack.querySelectorAll('.video-media-box');
            mediaBoxes.forEach((box) => {
                const playBtn = box.querySelector('.play-trigger-btn');
                const poster = box.querySelector('.video-poster');
                const embedSlot = box.querySelector('.video-embed-slot');
                const videoId = box.getAttribute('data-video-id');

                const playVideo = () => {
                    if (!embedSlot || embedSlot.querySelector('iframe')) return;
                    embedSlot.innerHTML = `
                        <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1" 
                                title="YouTube Shorts player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen 
                                class="short-iframe"></iframe>
                    `;
                    box.classList.add('is-playing');
                };

                if (playBtn) playBtn.addEventListener('click', playVideo);
                if (poster) poster.addEventListener('click', (e) => {
                    if (e.target !== playBtn && !playBtn.contains(e.target)) {
                        playVideo();
                    }
                });
            });
        };

        // Update carousel slide position
        const updateCarousel = (newIndex) => {
            stopPlayingVideos();
            const catData = PORTFOLIO_DATA[currentCategoryKey];
            const videos = catData.videos;
            const totalVideos = videos.length;

            currentIndex = (newIndex + totalVideos) % totalVideos;

            // Slide track
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Active slide class
            const slides = carouselTrack.querySelectorAll('.carousel-slide');
            slides.forEach((s, idx) => {
                s.classList.toggle('active-slide', idx === currentIndex);
            });

            // Update Counter
            if (projectIndicator) {
                const numStr = String(currentIndex + 1).padStart(2, '0');
                const totalStr = String(totalVideos).padStart(2, '0');
                projectIndicator.textContent = `${numStr} / ${totalStr}`;
            }

            // Update Pagination
            if (carouselPagination) {
                const dots = carouselPagination.querySelectorAll('.pagination-dot');
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === currentIndex);
                });
            }

            // Apply active project accent color to container for dynamic details
            const activeProj = videos[currentIndex];
            if (workboardContainer && activeProj) {
                workboardContainer.style.setProperty('--current-accent', activeProj.accentColor);
                workboardContainer.style.setProperty('--current-accent-bg', activeProj.accentBg);
            }
        };

        // Switch Category
        const switchCategory = (categoryKey) => {
            if (categoryKey === currentCategoryKey && carouselTrack.children.length > 0) return;
            if (!PORTFOLIO_DATA[categoryKey]) return;

            stopPlayingVideos();

            // Subtle animate out
            if (carouselViewport) {
                carouselViewport.classList.add('category-switching');
            }

            setTimeout(() => {
                currentCategoryKey = categoryKey;
                currentIndex = 0;
                const catData = PORTFOLIO_DATA[categoryKey];

                // Update category tabs active state
                categoryTabs.forEach(tab => {
                    const isTarget = tab.getAttribute('data-category') === categoryKey;
                    tab.classList.toggle('active', isTarget);
                    tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
                });

                // Update descriptor strip
                if (categoryPillLabel) {
                    categoryPillLabel.textContent = catData.pillLabel;
                }
                if (categoryMissionText) {
                    categoryMissionText.textContent = catData.subtitle;
                }

                // Update workboard theme class
                if (workboardContainer) {
                    workboardContainer.classList.remove('category-personal', 'category-ai', 'category-realestate');
                    workboardContainer.classList.add(catData.themeClass);
                    workboardContainer.style.setProperty('--category-accent', catData.accentColor);
                    workboardContainer.style.setProperty('--current-accent', catData.accentColor);
                    workboardContainer.style.setProperty('--current-accent-bg', catData.accentBg);
                }

                // Render slides
                renderCategorySlides(categoryKey);

                // Reset carousel position
                updateCarousel(0);

                // Subtle animate in
                if (carouselViewport) {
                    carouselViewport.classList.remove('category-switching');
                }
            }, 160);
        };

        // Category Tab Click Listeners
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const cat = tab.getAttribute('data-category');
                if (cat) switchCategory(cat);
            });
        });

        // Arrow listeners
        if (carouselPrev) {
            carouselPrev.addEventListener('click', () => {
                updateCarousel(currentIndex - 1);
            });
        }

        if (carouselNext) {
            carouselNext.addEventListener('click', () => {
                updateCarousel(currentIndex + 1);
            });
        }

        // Pagination dot clicks
        if (carouselPagination) {
            carouselPagination.addEventListener('click', (e) => {
                const btn = e.target.closest('.pagination-dot');
                if (btn) {
                    const idx = parseInt(btn.getAttribute('data-index'), 10);
                    if (!isNaN(idx)) updateCarousel(idx);
                }
            });
        }

        // Touch Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 45;

        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const diff = touchEndX - touchStartX;
            if (Math.abs(diff) > swipeThreshold) {
                if (diff < 0) {
                    updateCarousel(currentIndex + 1);
                } else {
                    updateCarousel(currentIndex - 1);
                }
            }
        };

        // Keyboard navigation
        const workSection = document.getElementById('work');
        if (workSection) {
            window.addEventListener('keydown', (e) => {
                const rect = workSection.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                if (!inView) return;

                if (e.key === 'ArrowLeft') {
                    updateCarousel(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    updateCarousel(currentIndex + 1);
                }
            });
        }

        // Initialize with default category
        switchCategory('personal-brand');
    }

    // ==================== 4. SMOOTH SCROLLING ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navWrapper = document.querySelector('.navbar-wrapper');
                const offset = (navWrapper ? navWrapper.offsetHeight : 60) + 16;
                const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: topPos,
                    behavior: 'smooth'
                });
            }
        });
    });

});
