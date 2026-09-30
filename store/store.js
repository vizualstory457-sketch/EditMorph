/**
 * DIBENDU DAS — DIGITAL PRODUCT STORE
 * Client-Side Architecture & Product Data Store
 */

(function () {
    'use strict';

    // Helper to resolve asset paths across dev server and file:// protocol
    function resolveAsset(path) {
        if (!path) return '';
        if (window.location.protocol === 'file:' && path.startsWith('/')) {
            return (window.location.pathname.includes('/store/') ? '..' : '.') + path;
        }
        return path;
    }

    // ==================== 0. DAILY RESET OFFER TIMER (6-10 HOURS) ====================
    // Offer timer resets based on the user's local calendar day.
    // Each calendar day selects a random duration between 6h and 10h (with random HH:MM:SS).
    // State is persisted in localStorage so refreshes, tab switching, and browser restarts retain the countdown.
    // When the timer reaches 00:00:00, a new daily cycle (6-10h) is immediately initialized.
    const DAILY_OFFER_CONFIG = {
        MIN_HOURS: 6,
        MAX_HOURS: 10,
        PROMO_PRICE_INR: 99,
        REGULAR_PRICE_INR: 899,
        PROMO_PAYMENT_URL: 'https://rzp.io/rzp/textmorphpro',
        STORAGE_KEY_DATE: 'tmp_daily_offer_date',
        STORAGE_KEY_END: 'tmp_daily_offer_end'
    };

    // ==================== 0.01 INTERNATIONAL PURCHASE CONFIG ====================
    // For customers outside India: Gumroad checkout + WhatsApp License Key delivery + Discord Community.
    const INTERNATIONAL_PURCHASE_CONFIG = {
        GUMROAD_PRODUCT_URL: 'https://dibendudas.gumroad.com/l/TextMorphPro',
        WHATSAPP_NUMBER: '918100501454',
        DISCORD_INVITE_URL: 'https://discord.com/invite/kHQFmAJaSU',
        getWhatsAppUrl() {
            const num = this.WHATSAPP_NUMBER ? this.WHATSAPP_NUMBER.replace(/\D/g, '') : '918100501454';
            return `https://wa.me/${num}`;
        }
    };

    // ==================== 0.1 DEVELOPMENT DEMO NOTIFICATION FLAG ====================
    // Disabled for production. In production, notifications strictly use verified real purchases from the backend.
    const DEMO_PURCHASE_NOTIFICATIONS = false;

    const DEMO_INDIAN_NAMES = [
        'Aarav', 'Arjun', 'Aditya', 'Rahul', 'Rohan',
        'Karan', 'Akash', 'Rohit', 'Ankit', 'Vivek',
        'Abhishek', 'Aman', 'Yash', 'Raj', 'Saurabh',
        'Varun', 'Nikhil', 'Harsh', 'Pranav'
    ];

    // ==================== 0.2 PERSISTENT DAILY OFFER SERVICE ====================
    const OfferService = {
        timerInterval: null,
        expiresAt: null,
        isInitialized: false,

        getLocalDateKey() {
            const now = new Date();
            const y = now.getFullYear();
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const d = String(now.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        },

        generateRandomDurationMs() {
            const minSecs = DAILY_OFFER_CONFIG.MIN_HOURS * 3600; // 21,600s
            const maxSecs = DAILY_OFFER_CONFIG.MAX_HOURS * 3600; // 36,000s
            const randomSecs = Math.floor(Math.random() * (maxSecs - minSecs + 1)) + minSecs;
            return randomSecs * 1000;
        },

        startNewCycle() {
            const today = this.getLocalDateKey();
            const durationMs = this.generateRandomDurationMs();
            const newEnd = Date.now() + durationMs;
            this.expiresAt = newEnd;
            try {
                localStorage.setItem(DAILY_OFFER_CONFIG.STORAGE_KEY_DATE, today);
                localStorage.setItem(DAILY_OFFER_CONFIG.STORAGE_KEY_END, String(newEnd));
            } catch (e) {}
            return newEnd;
        },

        init() {
            const today = this.getLocalDateKey();
            let savedDate = null;
            let savedEnd = null;

            try {
                savedDate = localStorage.getItem(DAILY_OFFER_CONFIG.STORAGE_KEY_DATE);
                savedEnd = parseInt(localStorage.getItem(DAILY_OFFER_CONFIG.STORAGE_KEY_END), 10);
            } catch (e) {}

            // Check if saved state belongs to the current calendar day and is still in the future
            if (savedDate === today && savedEnd && !isNaN(savedEnd) && savedEnd > Date.now()) {
                this.expiresAt = savedEnd;
            } else {
                // First visit of the day or expired: generate new randomized 6-10h cycle
                this.startNewCycle();
            }

            // Sync across multiple open browser tabs in real-time
            window.addEventListener('storage', (e) => {
                if (e.key === DAILY_OFFER_CONFIG.STORAGE_KEY_END || e.key === DAILY_OFFER_CONFIG.STORAGE_KEY_DATE) {
                    try {
                        const syncedEnd = parseInt(localStorage.getItem(DAILY_OFFER_CONFIG.STORAGE_KEY_END), 10);
                        if (syncedEnd && !isNaN(syncedEnd) && syncedEnd > Date.now()) {
                            this.expiresAt = syncedEnd;
                            this.updateBanner();
                        }
                    } catch (err) {}
                }
            });

            this.isInitialized = true;
            this.initCountdownUI();
        },

        getRemainingTime() {
            const today = this.getLocalDateKey();
            let savedDate = null;
            try {
                savedDate = localStorage.getItem(DAILY_OFFER_CONFIG.STORAGE_KEY_DATE);
            } catch (e) {}

            // Check if calendar day transitioned or countdown reached 00:00:00
            if (savedDate !== today || !this.expiresAt || this.expiresAt <= Date.now()) {
                this.startNewCycle();
            }

            const remaining = Math.max(0, this.expiresAt - Date.now());
            const totalSecs = Math.floor(remaining / 1000);
            const hours = Math.floor(totalSecs / 3600);
            const mins = Math.floor((totalSecs % 3600) / 60);
            const secs = totalSecs % 60;

            const pad = (n) => String(n).padStart(2, '0');
            return {
                totalMs: remaining,
                hours,
                mins,
                secs,
                formatted: `${pad(hours)} : ${pad(mins)} : ${pad(secs)}`
            };
        },

        lastFormattedTime: null,
        updateBanner() {
            const rem = this.getRemainingTime();
            const topClockEl = document.getElementById('topCountdownClock');
            if (topClockEl && this.lastFormattedTime !== rem.formatted) {
                this.lastFormattedTime = rem.formatted;
                topClockEl.textContent = `Ends in ${rem.formatted}`;
            }

            if (CurrencyService.cachedData) {
                CurrencyService.updateAllPriceTargets(CurrencyService.cachedData);
            } else {
                const priceNowEl = document.querySelector('.sale-price, .tm-price-now.price-val-target');
                const priceWasEl = document.querySelector('.original-price, .tm-price-was.price-regular-target');
                const priceSaveEl = document.querySelector('.discount-badge, .tm-price-discount.price-save-target');

                if (priceNowEl && priceNowEl.textContent !== `₹${DAILY_OFFER_CONFIG.PROMO_PRICE_INR}`) {
                    priceNowEl.textContent = `₹${DAILY_OFFER_CONFIG.PROMO_PRICE_INR}`;
                }
                if (priceWasEl && priceWasEl.textContent !== `₹${DAILY_OFFER_CONFIG.REGULAR_PRICE_INR}`) {
                    priceWasEl.textContent = `₹${DAILY_OFFER_CONFIG.REGULAR_PRICE_INR}`;
                    priceWasEl.style.display = '';
                }
                if (priceSaveEl && priceSaveEl.textContent !== 'SAVE 89%') {
                    priceSaveEl.textContent = 'SAVE 89%';
                    priceSaveEl.style.display = '';
                }
                document.querySelectorAll('.price-india-val').forEach(el => {
                    if (el.textContent !== `₹${DAILY_OFFER_CONFIG.PROMO_PRICE_INR}`) {
                        el.textContent = `₹${DAILY_OFFER_CONFIG.PROMO_PRICE_INR}`;
                    }
                });
                document.querySelectorAll('.price-intl-val').forEach(el => {
                    if (el.textContent !== '$2') {
                        el.textContent = '$2';
                    }
                });
            }
        },

        initCountdownUI() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }

            this.updateBanner();
            this.timerInterval = setInterval(() => {
                this.updateBanner();
            }, 1000);
        }
    };

    // ==================== 0.3 PURCHASE NOTIFICATION SERVICE ====================
    const PurchaseNotificationService = {
        pollIntervalMs: 25000,
        demoIntervalMs: 30000,
        timerId: null,
        toastEl: null,
        lastDemoIndex: -1,

        isLocalDev() {
            const host = window.location.hostname;
            return host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.endsWith('.local');
        },

        isDemoEnabled() {
            return DEMO_PURCHASE_NOTIFICATIONS && this.isLocalDev();
        },

        init() {
            this.createToastElement();

            if (this.isDemoEnabled()) {
                // Development Demo Mode: show first toast after 3s, then recurring every ~30s
                setTimeout(() => this.triggerDemoNotification(), 3000);
                if (!this.timerId) {
                    this.timerId = setInterval(() => this.triggerDemoNotification(), this.demoIntervalMs);
                }
            } else {
                // Production Mode: Only poll verified real purchases
                this.checkForNewPurchases();
                if (!this.timerId) {
                    this.timerId = setInterval(() => this.checkForNewPurchases(), this.pollIntervalMs);
                }
            }
        },

        createToastElement() {
            if (document.getElementById('tmPurchaseToast')) {
                this.toastEl = document.getElementById('tmPurchaseToast');
                return;
            }
            const toast = document.createElement('div');
            toast.id = 'tmPurchaseToast';
            toast.className = 'tm-purchase-toast';
            toast.innerHTML = `
                <div class="tm-toast-icon">✓</div>
                <div class="tm-toast-content">
                    <div class="tm-toast-title" id="tmToastTitle"><strong>A creator in India</strong> just purchased</div>
                    <div class="tm-toast-meta" id="tmToastMeta">TextMorph Pro 2.0 &bull; India</div>
                </div>
            `;
            document.body.appendChild(toast);
            this.toastEl = toast;
        },

        triggerDemoNotification() {
            if (!this.isDemoEnabled()) return;

            // Pick a random Indian name distinct from the last one
            let nextIndex = Math.floor(Math.random() * DEMO_INDIAN_NAMES.length);
            if (nextIndex === this.lastDemoIndex) {
                nextIndex = (nextIndex + 1) % DEMO_INDIAN_NAMES.length;
            }
            this.lastDemoIndex = nextIndex;
            const name = DEMO_INDIAN_NAMES[nextIndex];

            this.showToast({
                displayName: name,
                location: 'India',
                productName: 'TextMorph Pro 2.0',
                isDemo: true
            });
        },

        async checkForNewPurchases() {
            try {
                const res = await fetch('/api/purchases');
                if (!res.ok) return;
                const data = await res.json();
                if (!data || !Array.isArray(data.purchases) || data.purchases.length === 0) return;

                let seen = [];
                try {
                    seen = JSON.parse(sessionStorage.getItem('tmp_seen_purchases') || '[]');
                } catch (e) {}

                // Filter for real purchases not yet displayed in this session
                const unseen = data.purchases.filter(p => !seen.includes(p.id));
                if (unseen.length === 0) return;

                const latest = unseen[0];
                seen.push(latest.id);
                try {
                    sessionStorage.setItem('tmp_seen_purchases', JSON.stringify(seen));
                } catch (e) {}

                this.showToast(latest);
            } catch (err) {
                // Ignore network errors
            }
        },

        showToast(purchase) {
            if (!this.toastEl) this.createToastElement();
            const titleEl = document.getElementById('tmToastTitle');
            const metaEl = document.getElementById('tmToastMeta');

            const rawName = (purchase.displayName || '').trim();
            const location = purchase.location || 'India';
            const product = purchase.productName || 'TextMorph Pro 2.0';

            const name = (!rawName || rawName.toLowerCase() === 'someone' || rawName.toLowerCase() === 'customer')
                ? 'A creator in India'
                : rawName;

            if (titleEl) {
                titleEl.innerHTML = `<strong>${this.escapeHtml(name)}</strong> just purchased`;
            }
            if (metaEl) {
                metaEl.innerHTML = `${this.escapeHtml(product)} &bull; ${this.escapeHtml(location)}`;
            }

            this.toastEl.classList.add('visible');

            setTimeout(() => {
                if (this.toastEl) {
                    this.toastEl.classList.remove('visible');
                }
            }, 6000);
        },

        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
    };

    // ==================== 1. REUSABLE PRODUCT DATA STORE ====================
    const PRODUCTS = [
        {
            id: 'textmorph-pro',
            slug: 'textmorph-pro',
            name: 'TextMorph Pro 2.0',
            category: 'plugins',
            categoryLabel: 'After Effects Plugin',
            software: ['After Effects'],
            softwareBadge: 'Ae 2023–2026',
            price: 99,
            salePrice: 899,
            rating: 4.9,
            reviewsCount: '539+',
            badge: 'Best Seller',
            badgeClass: 'badge-bestseller',
            thumbnail: '/images/store/textmorph-pro.jpg',
            gallery: [
                {
                    type: 'video',
                    title: 'Watch Intro',
                    videoUrl: 'https://www.youtube.com/embed/AuKz7l4qT5A',
                    image: '/images/store/textmorph-pro.jpg'
                },
                {
                    type: 'image',
                    title: 'Apex Toolkit',
                    image: '/images/store/textmorph-home.png'
                },
                {
                    type: 'image',
                    title: 'Script & SRT',
                    image: '/images/store/textmorph-script-srt.png'
                },
                {
                    type: 'image',
                    title: '19 Text Animations',
                    image: '/images/store/textmorph-animation.png'
                },
                {
                    type: 'image',
                    title: '10 Text Effects',
                    image: '/images/store/textmorph-effects.png'
                },
                {
                    type: 'image',
                    title: 'Magic Reveal',
                    image: '/images/store/textmorph-magic-reveal.png'
                },
                {
                    type: 'image',
                    title: 'Icon Presets',
                    image: '/images/store/textmorph-icon-presets.png'
                }
            ],
            features: [
                {
                    id: 'apex-toolkit',
                    number: '01',
                    title: 'Apex Toolkit',
                    badge: 'Workflow Suite',
                    image: '/images/store/textmorph-home.png',
                    explanation: 'Your professional After Effects workflow toolkit for faster layer management, alignment, graph control, editing, and motion-design workflows.',
                    functions: [
                        'Anchor & Align',
                        'Value Graph / Speed Graph',
                        'Quick Cut',
                        'Pro Editor Tools',
                        'Null Object',
                        'Adjustment Layer',
                        'Solid Layer',
                        'Gradient Lock',
                        'Font Replacer',
                        'Precomp / Decomp',
                        'Multi Comp',
                        'Expressions'
                    ],
                    benefit: 'Speed up repetitive After Effects workflow tasks from one powerful interface.'
                },
                {
                    id: 'script-srt',
                    number: '02',
                    title: 'Script & SRT / Caption Studio',
                    badge: 'Caption Studio',
                    image: '/images/store/textmorph-script-srt.png',
                    explanation: 'Transcribe speech, import and export SRT subtitles, and align captions directly with your After Effects composition.',
                    functions: [
                        'AI Speech-to-Text Transcription',
                        'Auto-Detect Language',
                        'SRT Import',
                        'SRT Export',
                        'Caption Studio',
                        'Composition Alignment',
                        'Caption Settings'
                    ],
                    benefit: 'Create and manage captions without leaving your After Effects workflow.'
                },
                {
                    id: 'text-animation',
                    number: '03',
                    title: '19 Text Animations',
                    badge: 'Motion Animators',
                    image: '/images/store/textmorph-animation.png',
                    explanation: 'Apply professional text animations instantly instead of manually creating complex text animator keyframes.',
                    functions: [
                        '1by1',
                        '3D Flip In',
                        'Apple Bouncing',
                        'Blur In',
                        'Bounce Text',
                        'Character Cascade',
                        'Character Down',
                        'Character Right',
                        'Right to Left'
                    ],
                    extraNote: 'Adjust animation duration directly from the interface.',
                    benefit: 'Create polished typography animations much faster.'
                },
                {
                    id: 'text-effects',
                    number: '04',
                    title: '10 Text Effects',
                    badge: 'Typography Styles',
                    image: '/images/store/textmorph-effects.png',
                    explanation: 'Apply premium ready-made text effects instantly instead of manually building complex typography effects.',
                    functions: [
                        'Reveal Glow',
                        'Text Break',
                        'TMP DJ Orange',
                        'TMP DJ Purple',
                        'TMP DJ White',
                        'TMP TF Blue',
                        'TMP TF Devin',
                        'TMP TF Shadow',
                        'TMP TF Shadow 2',
                        'TMP TF Yellow'
                    ],
                    benefit: 'Create styled typography effects in seconds.'
                },
                {
                    id: 'magic-reveal',
                    number: '05',
                    title: 'Magic Reveal',
                    badge: 'Reveal Engine',
                    image: '/images/store/textmorph-magic-reveal.png',
                    explanation: 'Create customizable text-reveal animations with controls for reveal color, direction, duration, glow, blur, and feather.',
                    functions: [
                        'Reveal Color',
                        'Direction',
                        'Duration',
                        'Glow Size',
                        'Glow Blur',
                        'Reveal Feather',
                        'Advanced Settings'
                    ],
                    benefit: 'Create polished text-reveal animations with adjustable controls from one interface.'
                },
                {
                    id: 'icon-presets',
                    number: '06',
                    title: 'Icon Presets',
                    badge: 'Glowing Icons',
                    image: '/images/store/textmorph-icon-presets.png',
                    explanation: 'Apply ready-made glowing icon styles instantly to create polished motion graphics without manually building the effect.',
                    functions: [
                        'Break Anything',
                        'TMP IC Blue',
                        'TMP IC Green',
                        'TMP IC Orange',
                        'TMP IC Purple',
                        'TMP ICF Premium'
                    ],
                    benefit: 'Create glowing icon animations quickly using ready-made presets.'
                }
            ],
            featured: true,
            headline: 'Kinetic Typography & Workflow Suite for After Effects',
            description: 'TextMorph Pro 2.0 is an all-in-one After Effects toolkit designed to speed up motion design, typography, captioning, and editing workflows with powerful ready-to-use tools.',
            benefits: [
                '6 Integrated Production Modules in One Product (Apex Toolkit, Script & SRT / Caption Studio, Text Animation, Text Effects, Magic Reveal, Icon Presets)',
                'Zero Manual Keyframes Required for High-Impact Typography',
                'Native AI Speech-to-Text Transcription & SRT Ingestion',
                'Adjust Animation Duration & Easing Directly from the Interface',
                'Ready-Made Glowing Icon Presets & Stylized Text Effects'
            ],
            included: [
                'Full TextMorph Pro 2.0 After Effects Plugin (.zxp / .jsxbin)',
                'Apex Toolkit: Anchor/Align, Graph Control, Layer Tools & Cutters',
                'Script & SRT / Caption Studio with Speech-to-Text AI',
                '19 Premium Text Animation Presets & Duration Slider',
                '10 Stylized Typography Text Effects (Reveal Glow, Text Break, Shadows)',
                'Customizable Magic Reveal Engine with Feather, Glow & Direction Controls',
                '6 Glowing Motion Icon Presets',
                'Complete 16:9 Step-by-Step Walkthrough Video Tutorial',
                'Commercial Client License (Lifetime)',
                'Free Future Version Updates'
            ],
            compatibility: 'After Effects 2023–2026 on Windows + macOS.',
            requirements: 'No third-party plugins required. Uses native After Effects expressions and shape vector pipelines.',
            faqs: [
                {
                    q: 'What is TextMorph Pro 2.0?',
                    a: 'TextMorph Pro 2.0 is an After Effects toolkit for typography, text animation, effects, captions, and motion-design workflows.'
                },
                {
                    q: 'Which versions of After Effects are supported?',
                    a: 'TextMorph Pro 2.0 supports After Effects 2023–2026 on both Windows and macOS.'
                },
                {
                    q: 'Does TextMorph Pro 2.0 work on both Windows and macOS?',
                    a: 'Yes. TextMorph Pro 2.0 is designed for both Windows and macOS.'
                },
                {
                    q: 'What is included in TextMorph Pro 2.0?',
                    a: 'TextMorph Pro 2.0 includes Apex Toolkit, Script & SRT, 19 Text Animations, 10 Text Effects, Magic Reveal, and Icon Presets.'
                },
                {
                    q: 'How many text animations are included?',
                    a: 'TextMorph Pro 2.0 includes 19 ready-to-use text animation presets.'
                },
                {
                    q: 'How do I receive the plugin after purchasing?',
                    a: 'Indian customers purchase through Razorpay and follow the existing download/license delivery flow. International customers purchase through Gumroad and receive the plugin download through Gumroad.'
                },
                {
                    q: 'How do international customers get their license key?',
                    a: 'After purchasing through Gumroad, send the Gmail address used for the purchase to our WhatsApp number. We will verify the purchase and provide the TextMorph Pro license key.'
                },
                {
                    q: 'What payment method should I use?',
                    a: 'Customers in India should use Razorpay. Customers outside India should purchase TextMorph Pro 2.0 through Gumroad.'
                },
                {
                    q: 'Will I receive future TextMorph Pro updates?',
                    a: 'Yes. TextMorph Pro updates and version announcements are shared with customers through the available update channels, including the TextMorph Pro Discord community.'
                },
                {
                    q: 'Where can I get help with TextMorph Pro 2.0?',
                    a: 'For license-related help, international customers can contact us through WhatsApp. For TextMorph Pro updates and community announcements, join the Discord community.'
                }
            ]
        }
    ];

    // ==================== 1.1 CURRENCY & LOCALIZATION SERVICE ====================
    const CurrencyService = {
        baseInrPrice: 99,
        baseInrRegular: 899,
        cachedData: null,

        // Standard fallback exchange rates against 1 INR
        fallbackRates: {
            INR: { rate: 1, symbol: '₹', code: 'INR' },
            USD: { rate: 0.0118, symbol: '$', code: 'USD' },
            EUR: { rate: 0.0108, symbol: '€', code: 'EUR' },
            GBP: { rate: 0.0092, symbol: '£', code: 'GBP' },
            CAD: { rate: 0.0162, symbol: 'CA$', code: 'CAD' },
            AUD: { rate: 0.0182, symbol: 'AU$', code: 'AUD' },
            AED: { rate: 0.0433, symbol: 'AED ', code: 'AED' },
            SGD: { rate: 0.0155, symbol: 'SG$', code: 'SGD' },
            JPY: { rate: 1.78, symbol: '¥', code: 'JPY' },
            NZD: { rate: 0.0195, symbol: 'NZ$', code: 'NZD' }
        },

        countryToCurrency: {
            IN: 'INR',
            US: 'USD',
            GB: 'GBP',
            CA: 'CAD',
            AU: 'AUD',
            DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR', IE: 'EUR', PT: 'EUR',
            AE: 'AED',
            SG: 'SGD',
            JP: 'JPY',
            NZ: 'NZD'
        },

        async getLocalizedPrice() {
            if (this.cachedData) return this.cachedData;

            try {
                const stored = sessionStorage.getItem('tmp_currency_data');
                if (stored) {
                    this.cachedData = JSON.parse(stored);
                    return this.cachedData;
                }
            } catch (e) {}

            let country = null;
            let currency = 'INR';

            // 1. Check Indian Timezone Heuristic
            try {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
                if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz === 'Asia/Colombo') {
                    country = 'IN';
                    currency = 'INR';
                }
            } catch (e) {}

            // 2. If not detected as India, attempt IP Geolocation with short timeout
            if (!country) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 1800);
                    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.country_code) {
                            country = data.country_code.toUpperCase();
                            currency = data.currency || this.countryToCurrency[country] || 'USD';
                        }
                    }
                } catch (e) {
                    // Fallback timezone heuristics
                    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
                    if (tz.includes('europe') || tz.includes('london')) {
                        currency = tz.includes('london') ? 'GBP' : 'EUR';
                    } else if (tz.includes('america') || tz.includes('us')) {
                        currency = 'USD';
                    } else if (tz.includes('australia')) {
                        currency = 'AUD';
                    } else if (tz.includes('asia/dubai')) {
                        currency = 'AED';
                    } else {
                        currency = 'INR';
                    }
                }
            }

            // Always enforce exact ₹99 for India
            if (country === 'IN' || currency === 'INR') {
                this.cachedData = {
                    country: 'IN',
                    currency: 'INR',
                    symbol: '₹',
                    priceText: '₹99',
                    regularText: '₹899',
                    savingsText: 'SAVE 89%'
                };
                try { sessionStorage.setItem('tmp_currency_data', JSON.stringify(this.cachedData)); } catch(e) {}
                return this.cachedData;
            }

            // For foreign visitors: fetch live rate or fallback
            let rate = this.fallbackRates[currency]?.rate;
            let symbol = this.fallbackRates[currency]?.symbol || '$';

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1800);
                const rateRes = await fetch('https://open.er-api.com/v6/latest/INR', { signal: controller.signal });
                clearTimeout(timeoutId);
                if (rateRes.ok) {
                    const rateJson = await rateRes.json();
                    if (rateJson && rateJson.rates && rateJson.rates[currency]) {
                        rate = rateJson.rates[currency];
                    }
                }
            } catch (e) {}

            if (!rate && this.fallbackRates[currency]) {
                rate = this.fallbackRates[currency].rate;
            } else if (!rate) {
                currency = 'USD';
                rate = this.fallbackRates.USD.rate;
                symbol = '$';
            }

            const rawPrice = this.baseInrPrice * rate;
            const rawRegular = this.baseInrRegular * rate;
            const roundedPrice = (currency === 'JPY') ? Math.round(rawPrice) : rawPrice.toFixed(2);
            const roundedRegular = (currency === 'JPY') ? Math.round(rawRegular) : rawRegular.toFixed(2);
            const savings = (currency === 'JPY') ? Math.round(rawRegular - rawPrice) : (rawRegular - rawPrice).toFixed(2);

            this.cachedData = {
                country: country || 'US',
                currency: currency,
                symbol: symbol,
                priceText: `${symbol}${roundedPrice}`,
                regularText: `${symbol}${roundedRegular}`,
                savingsText: 'SAVE 89%',
                converted: true
            };

            try { sessionStorage.setItem('tmp_currency_data', JSON.stringify(this.cachedData)); } catch(e) {}
            return this.cachedData;
        },

        updateAllPriceTargets(data) {
            if (!data) return;
            document.querySelectorAll('.price-val-target').forEach(el => {
                el.textContent = data.priceText;
            });
            document.querySelectorAll('.price-regular-target').forEach(el => {
                el.textContent = data.regularText;
            });
            document.querySelectorAll('.price-save-target').forEach(el => {
                el.textContent = data.savingsText;
            });

            const isIndia = (data.country === 'IN' || data.currency === 'INR');
            const intlPriceText = '$2';

            document.querySelectorAll('.price-india-val').forEach(el => {
                el.textContent = '₹99';
            });
            document.querySelectorAll('.price-intl-val').forEach(el => {
                el.textContent = intlPriceText;
            });

            // Primary highlighting based on detected region (both remain accessible)
            document.querySelectorAll('.tm-btn-india').forEach(btn => {
                if (isIndia) {
                    btn.classList.add('tm-btn-primary-highlight');
                    btn.classList.remove('tm-btn-secondary-highlight');
                } else {
                    btn.classList.remove('tm-btn-primary-highlight');
                    btn.classList.add('tm-btn-secondary-highlight');
                }
            });

            document.querySelectorAll('.tm-btn-intl').forEach(btn => {
                if (!isIndia) {
                    btn.classList.add('tm-btn-primary-highlight');
                    btn.classList.remove('tm-btn-secondary-highlight');
                } else {
                    btn.classList.remove('tm-btn-primary-highlight');
                    btn.classList.add('tm-btn-secondary-highlight');
                }
            });
        }
    };

    // ==================== 2. APPLICATION STATE ====================
    const state = {
        activeCategory: 'all',
        searchQuery: '',
        selectedSoftware: [],
        sortBy: 'featured',
        activeProductSlug: null,
        wishlist: JSON.parse(localStorage.getItem('dibendu_store_wishlist') || '[]'),
        cart: JSON.parse(localStorage.getItem('dibendu_store_cart') || '[]')
    };

    // ==================== 3. DOM ELEMENTS ====================
    const catalogSection = document.getElementById('catalogSection');
    const productDetailView = document.getElementById('productDetailView');
    const heroBanner = document.getElementById('heroBanner');
    const promosGrid = document.getElementById('promosGrid');
    const productsGrid = document.getElementById('productsGrid');
    const catalogTitle = document.getElementById('catalogTitle');
    const catalogCountBadge = document.getElementById('catalogCountBadge');
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    const sortSelect = document.getElementById('sortSelect');
    const catButtons = document.querySelectorAll('.cat-item-btn');
    const mobileCatPills = document.querySelectorAll('.mobile-cat-pill');
    const softwareCheckboxes = document.querySelectorAll('.platform-chip input');
    
    // Topbar & badges
    const wishlistBadge = document.getElementById('wishlistBadge');
    const cartBadge = document.getElementById('cartBadge');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');

    // Checkout modal
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
    const checkoutItemTitle = document.getElementById('checkoutItemTitle');
    const checkoutItemPrice = document.getElementById('checkoutItemPrice');
    const checkoutConfirmBtn = document.getElementById('checkoutConfirmBtn');

    // ==================== 4. RENDERING FUNCTIONS ====================

    // Update wishlist counter badge
    function updateWishlistBadge() {
        if (wishlistBadge) {
            wishlistBadge.textContent = state.wishlist.length;
            wishlistBadge.style.display = state.wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    // Update cart badge & drawer
    function updateCartUI() {
        if (cartBadge) {
            const count = state.cart.reduce((sum, item) => sum + (item.qty || 1), 0);
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'flex' : 'none';
        }

        if (cartItemsList) {
            if (state.cart.length === 0) {
                cartItemsList.innerHTML = `
                    <div style="text-align: center; padding: 40px 10px; color: var(--store-text-muted);">
                        <div style="font-size: 2rem; margin-bottom: 8px;">🛍️</div>
                        <p style="font-weight: 700;">Your cart is empty.</p>
                        <p style="font-size: 0.78rem;">Explore products and add your favorite tools.</p>
                    </div>
                `;
            } else {
                cartItemsList.innerHTML = state.cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.thumbnail}" alt="${item.name}" class="cart-item-thumb">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price}</div>
                        </div>
                        <button class="btn-remove-item" data-remove-id="${item.id}" title="Remove">✕</button>
                    </div>
                `).join('');

                // Attach remove handlers
                cartItemsList.querySelectorAll('.btn-remove-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const removeId = btn.getAttribute('data-remove-id');
                        removeFromCart(removeId);
                    });
                });
            }
        }

        if (cartSubtotal) {
            const total = state.cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
            cartSubtotal.textContent = `$${total}`;
        }

        localStorage.setItem('dibendu_store_cart', JSON.stringify(state.cart));
    }

    function addToCart(product) {
        const existing = state.cart.find(i => i.id === product.id);
        if (existing) {
            existing.qty = (existing.qty || 1) + 1;
        } else {
            state.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                thumbnail: product.thumbnail,
                qty: 1
            });
        }
        updateCartUI();
        openCartDrawer();
    }

    function removeFromCart(productId) {
        state.cart = state.cart.filter(i => i.id !== productId);
        updateCartUI();
    }

    function openCartDrawer() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
        }
    }

    function closeCartDrawer() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
        }
    }

    // Toggle Wishlist
    function toggleWishlist(productId) {
        const idx = state.wishlist.indexOf(productId);
        if (idx === -1) {
            state.wishlist.push(productId);
        } else {
            state.wishlist.splice(idx, 1);
        }
        localStorage.setItem('dibendu_store_wishlist', JSON.stringify(state.wishlist));
        updateWishlistBadge();
        renderProducts();
    }

    // Filter & Sort Products
    function getFilteredProducts() {
        return PRODUCTS.filter(p => {
            // Category check
            if (state.activeCategory !== 'all' && p.category !== state.activeCategory) {
                return false;
            }

            // Search query check
            if (state.searchQuery.trim() !== '') {
                const q = state.searchQuery.toLowerCase();
                const matchName = p.name.toLowerCase().includes(q);
                const matchDesc = p.description.toLowerCase().includes(q);
                const matchCat = p.categoryLabel.toLowerCase().includes(q);
                const matchSoft = p.software.some(s => s.toLowerCase().includes(q));
                if (!matchName && !matchDesc && !matchCat && !matchSoft) {
                    return false;
                }
            }

            // Software platforms check
            if (state.selectedSoftware.length > 0) {
                const hasSoftware = p.software.some(s => state.selectedSoftware.includes(s));
                if (!hasSoftware && !p.software.includes('All Editors')) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => {
            if (state.sortBy === 'price-asc') return a.price - b.price;
            if (state.sortBy === 'price-desc') return b.price - a.price;
            if (state.sortBy === 'rating') return b.rating - a.rating;
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        });
    }

    // Render Product Cards Grid
    function renderProducts() {
        if (!productsGrid) return;

        const filtered = getFilteredProducts();

        // Update counts & title
        if (catalogCountBadge) {
            catalogCountBadge.textContent = `${filtered.length} products`;
        }
        if (catalogTitle) {
            const catMap = {
                'all': 'Explore Products',
                'plugins': 'Plugins',
                'presets': 'Presets',
                'templates': 'Templates',
                'motion-graphics': 'Motion Graphics',
                'creative-assets': 'Creative Assets',
                'freebies': 'Free Creator Assets'
            };
            catalogTitle.textContent = state.searchQuery 
                ? `Results for "${state.searchQuery}"` 
                : (catMap[state.activeCategory] || 'Explore Products');
        }

        if (filtered.length === 0) {
            productsGrid.innerHTML = `
                <div class="store-empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3 class="empty-title">No products found</h3>
                    <p class="empty-desc">No digital assets match your current search and filter criteria. Try clearing search or selecting a different category.</p>
                    <button class="btn-reset-filters" id="btnResetFilters">View All Products</button>
                </div>
            `;
            const resetBtn = document.getElementById('btnResetFilters');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    state.activeCategory = 'all';
                    state.searchQuery = '';
                    state.selectedSoftware = [];
                    if (searchInput) searchInput.value = '';
                    if (searchClearBtn) searchClearBtn.style.display = 'none';
                    updateActiveNav();
                    renderProducts();
                });
            }
            return;
        }

        productsGrid.innerHTML = filtered.map(p => {
            const isWish = state.wishlist.includes(p.id);
            const isFree = p.price === 0;
            const isTextMorph = p.id === 'textmorph-pro';
            const priceHtml = isTextMorph
                ? `<div class="price-row tm-card-price-row"><span class="sale-price price-current price-val-target">₹99</span><span class="original-price price-was price-regular-target">₹899</span><span class="discount-badge tm-price-discount price-save-target">SAVE 89%</span></div>`
                : (isFree 
                    ? `<span class="price-free">FREE</span>` 
                    : `<span class="price-current">$${p.price}</span>${p.salePrice ? `<span class="price-was">$${p.salePrice}</span>` : ''}`);

            return `
                <div class="product-card" data-slug="${p.slug}">
                    <div class="card-image-box">
                        ${p.badge ? `<span class="card-badge ${p.badgeClass}">${p.badge}</span>` : ''}
                        <button type="button" class="btn-card-wishlist ${isWish ? 'active' : ''}" data-wishlist-id="${p.id}" title="Add to Wishlist" aria-label="Add to wishlist">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="${isWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        </button>
                        <img src="${resolveAsset(p.thumbnail)}" alt="${p.name}" class="product-card-img" loading="lazy">
                    </div>
                    <div class="card-content-box">
                        <div class="card-category-row">
                            <span>${p.categoryLabel}</span>
                            <span class="card-software-tag">${p.softwareBadge}</span>
                        </div>
                        <h3 class="card-title">${p.name}</h3>
                        <p class="card-short-desc">${p.headline}</p>
                        <div class="card-rating-row">
                            <span>★</span>
                            <span>${p.rating.toFixed(1)}</span>
                            <span class="rating-count">(${p.id === 'textmorph-pro' ? '539+ Users' : p.reviewsCount})</span>
                        </div>
                        <div class="card-footer-row">
                            <div class="card-price-group">
                                ${priceHtml}
                            </div>
                            <button type="button" class="btn-card-action" data-card-slug="${p.slug}">
                                View Product →
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Apply localized prices if detected
        CurrencyService.getLocalizedPrice().then(data => {
            CurrencyService.updateAllPriceTargets(data);
        });

        // Attach Card Click and Wishlist Events
        productsGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // If clicked wishlist, toggle without opening card
                if (e.target.closest('.btn-card-wishlist')) {
                    e.stopPropagation();
                    const wishId = e.target.closest('.btn-card-wishlist').getAttribute('data-wishlist-id');
                    toggleWishlist(wishId);
                    return;
                }
                const slug = card.getAttribute('data-slug');
                openProductDetail(slug, true);
            });
        });
    }

    // Update active state in category sidebars & pills
    function updateActiveNav() {
        catButtons.forEach(btn => {
            const cat = btn.getAttribute('data-cat');
            if (cat === state.activeCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        mobileCatPills.forEach(pill => {
            const cat = pill.getAttribute('data-cat');
            if (cat === state.activeCategory) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    }

    // ==================== 5. PRODUCT DETAIL VIEW ====================
    function openProductDetail(slug, updateHistory = true) {
        const product = PRODUCTS.find(p => p.slug === slug);
        if (!product) return;

        state.activeProductSlug = slug;

        // Hide Catalog, Show Detail View
        if (heroBanner) heroBanner.style.display = 'none';
        if (promosGrid) promosGrid.style.display = 'none';
        if (catalogSection) catalogSection.style.display = 'none';
        if (productDetailView) productDetailView.style.display = 'flex';

        // Update URL State
        if (updateHistory) {
            const newUrl = `/store?product=${product.slug}`;
            window.history.pushState({ productSlug: product.slug }, '', newUrl);
        }

        // Render Detail View
        renderDetailView(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

        // ==================== 5.1 TEXTMORPH PRO 2.0 FULL-WIDTH LANDING ====================
    function renderTextMorphLanding(product) {
        if (!productDetailView) return;

        productDetailView.innerHTML = `
            <div class="product-landing-fullwidth" id="textmorphLanding">
                <!-- Nav Bar -->
                <div class="landing-nav-bar">
                    <div class="detail-breadcrumbs">
                        Store / <span class="crumb-cat">After Effects Plugins</span> / <span>${product.name}</span>
                    </div>
                </div>

                <!-- 1. UNIFIED PRODUCT SHOWCASE (SINGLE SECTION) -->
                <section class="tm-unified-showcase" id="tmShowcaseSection">
                    <div class="tm-unified-radial-glow"></div>

                    <!-- Header Block -->
                    <div class="tm-unified-header">
                        <div class="tm-unified-eyebrow-row">
                            <span class="tm-eyebrow-badge">
                                <span class="tm-eyebrow-dot"></span>
                                TEXTMORPH PRO 2.0
                            </span>
                            <span class="tm-badge-bestseller">Best Seller</span>
                        </div>
                        <h1 class="tm-unified-title">${product.name}</h1>
                        <p class="tm-unified-tagline">${product.headline}</p>
                    </div>

                    <!-- Main Grid: Left Stage (9:16 Video / Images) & Right Info Card -->
                    <div class="tm-unified-main-grid">
                        <!-- LEFT: Media Stage (Intro Video / Screenshot) -->
                        <div class="tm-stage-wrapper">
                            <!-- 9:16 Video Container (Starts Active) -->
                            <div class="tm-video-frame" id="stageVideoWrap">
                                <iframe 
                                    src="https://www.youtube.com/embed/AuKz7l4qT5A" 
                                    title="TextMorph Pro 2.0 — Watch Intro" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowfullscreen>
                                </iframe>
                                <div class="tm-video-active-pill">
                                    <span class="tm-pulse-dot"></span> 9:16 INTRO REEL
                                </div>
                            </div>

                            <!-- Screenshot Frame (For Images) -->
                            <div class="tm-image-frame" id="stageImgWrap" style="display: none;">
                                <img src="" alt="TextMorph Pro Preview" class="tm-stage-image" id="stageMainImg">
                            </div>
                        </div>

                        <!-- RIGHT: Concise Product Info & Purchase -->
                        <div class="tm-info-card">
                            <div class="tm-info-top">
                                <!-- Social proof -->
                                <div class="tm-rating-block">
                                    <div class="tm-stars-row">
                                        <span class="tm-stars">★★★★★</span>
                                        <span class="tm-rating-score">4.9 / 5.0</span>
                                    </div>
                                    <span class="tm-trust-count">Trusted by 539+ editors</span>
                                </div>

                                <!-- Compatibility -->
                                <div class="tm-compat-block">
                                    <span class="tm-compat-pill">💾 After Effects 2023–2026</span>
                                    <span class="tm-compat-pill">💻 Windows + macOS</span>
                                    <span class="tm-compat-pill">⚡ Instant Digital Download</span>
                                    <span class="tm-compat-pill">🛡️ Commercial License</span>
                                </div>
                            </div>

                            <!-- Pricing & Buy CTA -->
                            <div class="tm-pricing-block">
                                <div class="price-row tm-price-row" id="tmPriceRow">
                                    <span class="sale-price tm-price-now price-val-target">₹99</span>
                                    <span class="original-price tm-price-was price-regular-target">₹899</span>
                                    <span class="discount-badge tm-price-discount price-save-target">SAVE 89%</span>
                                </div>

                                <!-- Dual Purchase Options (India + International) -->
                                <div class="tm-dual-buy-grid" id="tmDualBuyGrid">
                                    <a href="https://rzp.io/rzp/textmorphpro" target="_blank" rel="noopener noreferrer" class="tm-buy-btn tm-btn-india tm-btn-primary-highlight" id="btnLandingHeroBuyIndia">
                                        <span class="tm-btn-text">🇮🇳 BUY IN INDIA — <span class="price-india-val">₹99</span></span>
                                        <span class="tm-btn-arrow">→</span>
                                    </a>
                                    <a href="${INTERNATIONAL_PURCHASE_CONFIG.GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener noreferrer" class="tm-buy-btn tm-btn-intl" id="btnLandingHeroBuyIntl">
                                        <span class="tm-btn-text">🌎 BUY INTERNATIONAL — <span class="price-intl-val">$2</span></span>
                                        <span class="tm-btn-arrow">→</span>
                                    </a>
                                </div>

                                <div class="tm-guarantee-note">
                                    <span>🛡️</span> 14-Day Money-Back Guarantee &nbsp;•&nbsp; Clean Commercial License &nbsp;•&nbsp; Free Future Updates
                                </div>

                                <!-- Discord Community Updates -->
                                <div class="tm-discord-card">
                                    <div class="tm-discord-info">
                                        <div class="tm-discord-header">
                                            <svg class="tm-discord-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                                            <span>DISCORD COMMUNITY</span>
                                        </div>
                                        <p class="tm-discord-desc">Get TextMorph Pro updates &amp; version announcements.</p>
                                    </div>
                                    <a href="${INTERNATIONAL_PURCHASE_CONFIG.DISCORD_INVITE_URL}" target="_blank" rel="noopener noreferrer" class="tm-discord-btn" id="btnDiscordHero">
                                        <span>JOIN DISCORD</span>
                                        <span class="tm-btn-arrow">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Below: 7 Media Thumbnails Rail -->
                    <div class="tm-thumbs-track-wrap">
                        <div class="tm-thumbs-grid" id="landingThumbnailsGrid">
                            <!-- 01: Watch Intro (VIDEO) -->
                            <button type="button" class="tm-thumb-card active" data-type="video" data-idx="0" title="01 — Watch Intro">
                                <div class="tm-thumb-media">
                                    <img src="${resolveAsset('/images/store/textmorph-pro.jpg')}" alt="01 Watch Intro" class="tm-thumb-img">
                                    <div class="tm-thumb-video-badge">
                                        <span class="tm-play-glyph">▶</span>
                                        <span>VIDEO</span>
                                    </div>
                                </div>
                                <div class="tm-thumb-meta">
                                    <span class="tm-thumb-num">01</span>
                                    <span class="tm-thumb-name">WATCH INTRO</span>
                                </div>
                            </button>

                            <!-- 02: Apex Toolkit -->
                            <button type="button" class="tm-thumb-card" data-type="image" data-src="${resolveAsset('/images/store/textmorph-home.png')}" data-idx="1" title="02 — Apex Toolkit">
                                <div class="tm-thumb-media">
                                    <img src="${resolveAsset('/images/store/textmorph-home.png')}" alt="02 Apex Toolkit" class="tm-thumb-img">
                                </div>
                                <div class="tm-thumb-meta">
                                    <span class="tm-thumb-num">02</span>
                                    <span class="tm-thumb-name">APEX TOOLKIT</span>
                                </div>
                            </button>

                            <!-- 03: Script & SRT -->
                            <button type="button" class="tm-thumb-card" data-type="image" data-src="${resolveAsset('/images/store/textmorph-script-srt.png')}" data-idx="2" title="03 — Script & SRT">
                                <div class="tm-thumb-media">
                                    <img src="${resolveAsset('/images/store/textmorph-script-srt.png')}" alt="03 Script & SRT" class="tm-thumb-img">
                                </div>
                                <div class="tm-thumb-meta">
                                    <span class="tm-thumb-num">03</span>
                                    <span class="tm-thumb-name">SCRIPT &amp; SRT</span>
                                </div>
                            </button>

                            <!-- 04: 19 Text Animations -->
                            <button type="button" class="tm-thumb-card" data-type="image" data-src="${resolveAsset('/images/store/textmorph-animation.png')}" data-idx="3" title="04 — 19 Text Animations">
                                <div class="tm-thumb-media">
                                    <img src="${resolveAsset('/images/store/textmorph-animation.png')}" alt="04 19 Text Animations" class="tm-thumb-img">
                                </div>
                                <div class="tm-thumb-meta">
                                    <span class="tm-thumb-num">04</span>
                                    <span class="tm-thumb-name">19 ANIMATIONS</span>
                                </div>
                            </button>

                            <!-- 05: 10 Text Effects -->
                            <button type="button" class="tm-thumb-card" data-type="image" data-src="${resolveAsset('/images/store/textmorph-effects.png')}" data-idx="4" title="05 — 10 Text Effects">
                                <div class="tm-thumb-media">
                                    <img src="${resolveAsset('/images/store/textmorph-effects.png')}" alt="05 10 Text Effects" class="tm-thumb-img">
                                </div>
                                <div class="tm-thumb-meta">
                                    <span class="tm-thumb-num">05</span>
                                    <span class="tm-thumb-name">10 EFFECTS</span>
                                </div>
                            </button>

                            <!-- 06: Magic Reveal -->
                            <button type="button" class="tm-thumb-card" data-type="image" data-src="${resolveAsset('/images/store/textmorph-magic-reveal.png')}" data-idx="5" title="06 — Magic Reveal">
                                <div class="tm-thumb-media">
                                    <img src="${resolveAsset('/images/store/textmorph-magic-reveal.png')}" alt="06 Magic Reveal" class="tm-thumb-img">
                                </div>
                                <div class="tm-thumb-meta">
                                    <span class="tm-thumb-num">06</span>
                                    <span class="tm-thumb-name">MAGIC REVEAL</span>
                                </div>
                            </button>

                            <!-- 07: Icon Presets -->
                            <button type="button" class="tm-thumb-card" data-type="image" data-src="${resolveAsset('/images/store/textmorph-icon-presets.png')}" data-idx="6" title="07 — Icon Presets">
                                <div class="tm-thumb-media">
                                    <img src="${resolveAsset('/images/store/textmorph-icon-presets.png')}" alt="07 Icon Presets" class="tm-thumb-img">
                                </div>
                                <div class="tm-thumb-meta">
                                    <span class="tm-thumb-num">07</span>
                                    <span class="tm-thumb-name">ICON PRESETS</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- 2. BUILT-IN MODULES (FULL WIDTH ALTERNATING SECTIONS) -->
                <section class="landing-features-section">
                    <div style="margin-bottom: 24px;">
                        <span class="landing-section-kicker">INSIDE THE TOOLKIT</span>
                        <h2 class="landing-section-title">Inside TextMorph Pro 2.0 — 6 Built-in Modules</h2>
                        <p class="landing-section-subtitle">Speed up repetitive After Effects motion design, typography, captioning, and editing workflows with dedicated built-in tools.</p>
                    </div>

                    <div class="landing-features-list">
                        <!-- 01: Apex Toolkit (Image Left, Text Right) -->
                        <div class="landing-feature-row" id="feat-apex-toolkit">
                            <div class="feature-img-column" title="Click to view in gallery">
                                <img src="${resolveAsset('/images/store/textmorph-home.png')}" alt="Apex Toolkit" class="landing-feature-clickable-img" data-thumb-idx="1">
                            </div>
                            <div class="feature-info-column">
                                <div class="feature-module-header">
                                    <span class="feature-module-num">01</span>
                                    <span class="feature-module-badge">Workflow Suite</span>
                                </div>
                                <h3 class="feature-module-title">Apex Toolkit</h3>
                                <p class="feature-module-desc">"Your professional After Effects workflow toolkit for faster layer management, alignment, graph control, editing, and motion-design workflows."</p>
                                
                                <div class="feature-tools-label">Main Tools &amp; Functions:</div>
                                <div class="feature-tools-tags">
                                    <span class="feature-tool-tag">• Anchor &amp; Align</span>
                                    <span class="feature-tool-tag">• Value Graph / Speed Graph</span>
                                    <span class="feature-tool-tag">• Quick Cut</span>
                                    <span class="feature-tool-tag">• Pro Editor Tools</span>
                                    <span class="feature-tool-tag">• Null Object</span>
                                    <span class="feature-tool-tag">• Adjustment Layer</span>
                                    <span class="feature-tool-tag">• Solid Layer</span>
                                    <span class="feature-tool-tag">• Gradient Lock</span>
                                    <span class="feature-tool-tag">• Font Replacer</span>
                                    <span class="feature-tool-tag">• Precomp / Decomp</span>
                                    <span class="feature-tool-tag">• Multi Comp</span>
                                    <span class="feature-tool-tag">• Expressions</span>
                                </div>

                                <div class="feature-benefit-box">
                                    <strong>Main Benefit:</strong> "Speed up repetitive After Effects workflow tasks from one powerful interface."
                                </div>
                            </div>
                        </div>

                        <!-- 02: Script & SRT / Caption Studio (Text Left, Image Right) -->
                        <div class="landing-feature-row reverse" id="feat-script-srt">
                            <div class="feature-img-column" title="Click to view in gallery">
                                <img src="${resolveAsset('/images/store/textmorph-script-srt.png')}" alt="Script & SRT / Caption Studio" class="landing-feature-clickable-img" data-thumb-idx="2">
                            </div>
                            <div class="feature-info-column">
                                <div class="feature-module-header">
                                    <span class="feature-module-num">02</span>
                                    <span class="feature-module-badge">Caption Studio</span>
                                </div>
                                <h3 class="feature-module-title">Script &amp; SRT / Caption Studio</h3>
                                <p class="feature-module-desc">"Transcribe speech, import and export SRT subtitles, and align captions directly with your After Effects composition."</p>
                                
                                <div class="feature-tools-label">Main Functions &amp; Controls:</div>
                                <div class="feature-tools-tags">
                                    <span class="feature-tool-tag">• AI Speech-to-Text Transcription</span>
                                    <span class="feature-tool-tag">• Auto-Detect Language</span>
                                    <span class="feature-tool-tag">• SRT Import</span>
                                    <span class="feature-tool-tag">• SRT Export</span>
                                    <span class="feature-tool-tag">• Caption Studio</span>
                                    <span class="feature-tool-tag">• Composition Alignment</span>
                                    <span class="feature-tool-tag">• Caption Settings</span>
                                </div>

                                <div class="feature-benefit-box">
                                    <strong>Main Benefit:</strong> "Create and manage captions without leaving your After Effects workflow."
                                </div>
                            </div>
                        </div>

                        <!-- 03: 19 Text Animations (Image Left, Text Right) -->
                        <div class="landing-feature-row" id="feat-text-animation">
                            <div class="feature-img-column" title="Click to view in gallery">
                                <img src="${resolveAsset('/images/store/textmorph-animation.png')}" alt="19 Text Animations" class="landing-feature-clickable-img" data-thumb-idx="3">
                            </div>
                            <div class="feature-info-column">
                                <div class="feature-module-header">
                                    <span class="feature-module-num">03</span>
                                    <span class="feature-module-badge">Motion Animators</span>
                                </div>
                                <h3 class="feature-module-title">19 Text Animations</h3>
                                <p class="feature-module-desc">"Apply professional text animations instantly instead of manually creating complex text animator keyframes."</p>
                                
                                <div class="feature-tools-label">Examples Visible in Panel:</div>
                                <div class="feature-tools-tags">
                                    <span class="feature-tool-tag">• 1by1</span>
                                    <span class="feature-tool-tag">• 3D Flip In</span>
                                    <span class="feature-tool-tag">• Apple Bouncing</span>
                                    <span class="feature-tool-tag">• Blur In</span>
                                    <span class="feature-tool-tag">• Bounce Text</span>
                                    <span class="feature-tool-tag">• Character Cascade</span>
                                    <span class="feature-tool-tag">• Character Down</span>
                                    <span class="feature-tool-tag">• Character Right</span>
                                    <span class="feature-tool-tag">• Right to Left</span>
                                </div>

                                <div style="font-size: 0.8rem; font-weight: 600; color: #34d399; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); padding: 6px 12px; border-radius: 6px; display: inline-block;">
                                    ℹ️ Adjust animation duration directly from the interface.
                                </div>

                                <div class="feature-benefit-box">
                                    <strong>Main Benefit:</strong> "Create polished typography animations much faster."
                                </div>
                            </div>
                        </div>

                        <!-- 04: 10 Text Effects (Text Left, Image Right) -->
                        <div class="landing-feature-row reverse" id="feat-text-effects">
                            <div class="feature-img-column" title="Click to view in gallery">
                                <img src="${resolveAsset('/images/store/textmorph-effects.png')}" alt="10 Text Effects" class="landing-feature-clickable-img" data-thumb-idx="4">
                            </div>
                            <div class="feature-info-column">
                                <div class="feature-module-header">
                                    <span class="feature-module-num">04</span>
                                    <span class="feature-module-badge">Typography Styles</span>
                                </div>
                                <h3 class="feature-module-title">10 Text Effects</h3>
                                <p class="feature-module-desc">"Apply premium ready-made text effects instantly instead of manually building complex typography effects."</p>
                                
                                <div class="feature-tools-label">Ready-Made Effects:</div>
                                <div class="feature-tools-tags">
                                    <span class="feature-tool-tag">• Reveal Glow</span>
                                    <span class="feature-tool-tag">• Text Break</span>
                                    <span class="feature-tool-tag">• TMP DJ Orange</span>
                                    <span class="feature-tool-tag">• TMP DJ Purple</span>
                                    <span class="feature-tool-tag">• TMP DJ White</span>
                                    <span class="feature-tool-tag">• TMP TF Blue</span>
                                    <span class="feature-tool-tag">• TMP TF Devin</span>
                                    <span class="feature-tool-tag">• TMP TF Shadow</span>
                                    <span class="feature-tool-tag">• TMP TF Shadow 2</span>
                                    <span class="feature-tool-tag">• TMP TF Yellow</span>
                                </div>

                                <div class="feature-benefit-box">
                                    <strong>Main Benefit:</strong> "Create styled typography effects in seconds."
                                </div>
                            </div>
                        </div>

                        <!-- 05: Magic Reveal (Image Left, Text Right) -->
                        <div class="landing-feature-row" id="feat-magic-reveal">
                            <div class="feature-img-column" title="Click to view in gallery">
                                <img src="${resolveAsset('/images/store/textmorph-magic-reveal.png')}" alt="Magic Reveal" class="landing-feature-clickable-img" data-thumb-idx="5">
                            </div>
                            <div class="feature-info-column">
                                <div class="feature-module-header">
                                    <span class="feature-module-num">05</span>
                                    <span class="feature-module-badge">Reveal Engine</span>
                                </div>
                                <h3 class="feature-module-title">Magic Reveal</h3>
                                <p class="feature-module-desc">"Create customizable text-reveal animations with controls for reveal color, direction, duration, glow, blur, and feather."</p>
                                
                                <div class="feature-tools-label">Main Controls:</div>
                                <div class="feature-tools-tags">
                                    <span class="feature-tool-tag">• Reveal Color</span>
                                    <span class="feature-tool-tag">• Direction</span>
                                    <span class="feature-tool-tag">• Duration</span>
                                    <span class="feature-tool-tag">• Glow Size</span>
                                    <span class="feature-tool-tag">• Glow Blur</span>
                                    <span class="feature-tool-tag">• Reveal Feather</span>
                                    <span class="feature-tool-tag">• Advanced Settings</span>
                                </div>

                                <div class="feature-benefit-box">
                                    <strong>Main Benefit:</strong> "Create polished text-reveal animations with adjustable controls from one interface."
                                </div>
                            </div>
                        </div>

                        <!-- 06: Icon Presets (Text Left, Image Right) -->
                        <div class="landing-feature-row reverse" id="feat-icon-presets">
                            <div class="feature-img-column" title="Click to view in gallery">
                                <img src="${resolveAsset('/images/store/textmorph-icon-presets.png')}" alt="Icon Presets" class="landing-feature-clickable-img" data-thumb-idx="6">
                            </div>
                            <div class="feature-info-column">
                                <div class="feature-module-header">
                                    <span class="feature-module-num">06</span>
                                    <span class="feature-module-badge">Glowing Icons</span>
                                </div>
                                <h3 class="feature-module-title">Icon Presets</h3>
                                <p class="feature-module-desc">"Apply ready-made glowing icon styles instantly to create polished motion graphics without manually building the effect."</p>
                                
                                <div class="feature-tools-label">Presets Included:</div>
                                <div class="feature-tools-tags">
                                    <span class="feature-tool-tag">• Break Anything</span>
                                    <span class="feature-tool-tag">• TMP IC Blue</span>
                                    <span class="feature-tool-tag">• TMP IC Green</span>
                                    <span class="feature-tool-tag">• TMP IC Orange</span>
                                    <span class="feature-tool-tag">• TMP IC Purple</span>
                                    <span class="feature-tool-tag">• TMP ICF Premium</span>
                                </div>

                                <div class="feature-benefit-box">
                                    <strong>Main Benefit:</strong> "Create glowing icon animations quickly using ready-made presets."
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 3. FULL TUTORIAL VIDEO (DEDICATED 16:9 SECTION) -->
                <section class="landing-tutorial-card">
                    <span class="landing-section-kicker" style="color: #10b981;">MASTER THE SUITE</span>
                    <h2 class="landing-section-title" style="color: #ffffff;">TextMorph Pro 2.0 — Full Tutorial</h2>
                    <p class="landing-section-subtitle" style="color: #94a3b8;">
                        Watch the complete walkthrough to learn how to use the TextMorph Pro 2.0 tools inside After Effects.
                    </p>

                    <div class="tutorial-video-container">
                        <iframe 
                            src="https://www.youtube.com/embed/3v8oMst-BRQ" 
                            title="TextMorph Pro 2.0 — Full Tutorial" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </section>

                <!-- 4. FAQS ACCORDION SECTION -->
                <section class="landing-faq-section" id="tmFaqSection">
                    <div class="landing-faq-header">
                        <span class="landing-section-kicker" style="color: #10b981;">FREQUENTLY ASKED QUESTIONS</span>
                        <h2 class="landing-section-title" style="color: #ffffff;">Frequently Asked Questions</h2>
                    </div>
                    <div class="faq-accordion tm-faq-accordion">
                        ${(product.faqs || []).map((faq, i) => `
                            <div class="faq-item tm-faq-item ${i === 0 ? 'open' : ''}">
                                <button type="button" class="faq-question-btn tm-faq-question-btn" aria-expanded="${i === 0 ? 'true' : 'false'}">
                                    <span class="tm-faq-q-text">${faq.q}</span>
                                    <span class="tm-faq-plus">+</span>
                                </button>
                                <div class="faq-answer tm-faq-answer">
                                    <p class="tm-faq-answer-text">${faq.a}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            </div>
        `;

        const stageVideoWrap = document.getElementById('stageVideoWrap');
        const stageImgWrap = document.getElementById('stageImgWrap');
        const stageMainImg = document.getElementById('stageMainImg');
        const thumbs = productDetailView.querySelectorAll('.tm-thumb-card');

        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const type = thumb.getAttribute('data-type');
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                if (type === 'video') {
                    if (stageVideoWrap) stageVideoWrap.style.display = 'flex';
                    if (stageImgWrap) stageImgWrap.style.display = 'none';
                } else {
                    const src = thumb.getAttribute('data-src');
                    if (stageMainImg && src) {
                        stageMainImg.src = src;
                        stageMainImg.alt = thumb.getAttribute('title') || 'TextMorph Pro 2.0';
                    }
                    if (stageVideoWrap) stageVideoWrap.style.display = 'none';
                    if (stageImgWrap) stageImgWrap.style.display = 'flex';
                }
            });
        });

        // Feature Clickable Images Switch Showcase
        productDetailView.querySelectorAll('.landing-feature-clickable-img').forEach(img => {
            img.addEventListener('click', () => {
                const thumbIdx = img.getAttribute('data-thumb-idx');
                const targetThumb = productDetailView.querySelector(`.tm-thumb-card[data-idx="${thumbIdx}"]`);
                if (targetThumb) {
                    targetThumb.click();
                    const stage = document.getElementById('tmShowcaseSection');
                    if (stage) {
                        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        // FAQ Accordion Toggle (Single-Open Accordion)
        const faqItems = productDetailView.querySelectorAll('.tm-faq-item, .faq-item');
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    const isOpen = item.classList.contains('open');
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('open');
                        const otherBtn = otherItem.querySelector('.faq-question-btn');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    });
                    if (!isOpen) {
                        item.classList.add('open');
                        btn.setAttribute('aria-expanded', 'true');
                    }
                });
            }
        });

        // Apply localized prices & country-specific purchase flow
        CurrencyService.getLocalizedPrice().then(data => {
            CurrencyService.updateAllPriceTargets(data);
        });

        // Initialize Persistent Per-Visitor Offer Countdown UI
        OfferService.initCountdownUI();
    }

    function renderDetailView(product) {
        if (!productDetailView) return;

        // For TextMorph Pro 2.0, render full-width landing page
        if (product.id === 'textmorph-pro') {
            renderTextMorphLanding(product);
            return;
        }

        const isFree = product.price === 0;
        const priceDisplay = isFree ? 'FREE' : `$${product.price}`;

        productDetailView.innerHTML = `
            <div class="detail-nav-bar">
                <button type="button" class="btn-detail-back" id="btnBackToCatalog">
                    ← Back to Products
                </button>
                <div class="detail-breadcrumbs">
                    Store / <a href="/store?category=${product.category}" class="crumb-cat">${product.categoryLabel}</a> / <span>${product.name}</span>
                </div>
            </div>

            <div class="detail-main-grid">
                <!-- Left Image Gallery -->
                <div class="detail-gallery-box">
                    <div class="detail-main-img-wrap">
                        <img src="${resolveAsset(product.thumbnail)}" alt="${product.name}" class="detail-main-img" id="detailMainImg">
                    </div>
                    ${product.gallery && product.gallery.length > 0 ? `
                        <div class="detail-thumbnails-row">
                            ${product.gallery.map((g, idx) => `
                                <button type="button" class="detail-thumb-btn ${idx === 0 ? 'active' : ''}" data-img="${resolveAsset(g.image)}" data-idx="${idx}" title="${g.title}">
                                    <img src="${resolveAsset(g.image)}" alt="${g.title}" class="detail-thumb-img">
                                    <span class="detail-thumb-label">${g.title}</span>
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="detail-compatibility-badges">
                        <span class="compat-badge">💾 ${product.id === 'textmorph-pro' ? 'After Effects 2023–2026' : product.softwareBadge}</span>
                        ${product.id === 'textmorph-pro' ? `<span class="compat-badge">💻 Windows + macOS</span>` : ''}
                        <span class="compat-badge">⚡ Instant Digital Download</span>
                        <span class="compat-badge">🛡️ Commercial License</span>
                    </div>
                </div>

                <!-- Right Information Column -->
                <div class="detail-info-col">
                    <div class="detail-badge-row">
                        <span class="detail-category-pill">${product.categoryLabel}</span>
                        ${product.badge ? `<span class="card-badge ${product.badgeClass}" style="position:static;">${product.badge}</span>` : ''}
                    </div>

                    <h1 class="detail-title">${product.name}</h1>
                    <p style="font-size: 1.05rem; font-weight: 600; color: #ea580c;">${product.headline}</p>

                    <div class="detail-rating-row">
                        <span>★★★★★</span>
                        <span>${product.rating.toFixed(1)} / 5.0</span>
                        <span style="color: var(--store-text-muted);">• ${product.id === 'textmorph-pro' ? 'Trusted by 539+ editors' : `(${product.reviewsCount} verified reviews)`}</span>
                    </div>

                    <p style="font-size: 0.92rem; line-height: 1.5; color: var(--store-text-muted);">${product.description}</p>

                    <!-- Pricing & CTA Card -->
                    <div class="detail-pricing-box">
                        <div>
                            <div class="detail-price-main"><span class="price-val-target">${priceDisplay}</span></div>
                            ${product.salePrice ? `<div style="font-size: 0.8rem; color: var(--store-text-subtle);">Regular price: <span class="price-regular-target" style="text-decoration: line-through;">$${product.salePrice}</span> (<span class="price-save-target">SAVE 89%</span>)</div>` : ''}
                        </div>
                        <div class="detail-cta-row">
                            ${product.id === 'textmorph-pro' ? `
                                <div class="tm-dual-buy-grid" style="width: 100%;">
                                    <a href="https://rzp.io/rzp/textmorphpro" target="_blank" rel="noopener noreferrer" class="tm-buy-btn tm-btn-india tm-btn-primary-highlight">
                                        <span class="tm-btn-text">🇮🇳 BUY IN INDIA — <span class="price-india-val">₹99</span></span>
                                        <span class="tm-btn-arrow">→</span>
                                    </a>
                                    <a href="${INTERNATIONAL_PURCHASE_CONFIG.GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener noreferrer" class="tm-buy-btn tm-btn-intl">
                                        <span class="tm-btn-text">🌎 BUY INTERNATIONAL — <span class="price-intl-val">$2</span></span>
                                        <span class="tm-btn-arrow">→</span>
                                    </a>
                                </div>
                            ` : `
                                <button type="button" class="btn-detail-buy" id="btnDetailCheckout">
                                    ${isFree ? 'DOWNLOAD FREE' : `BUY NOW — $${product.price}`} →
                                </button>
                                ${!isFree ? `<button type="button" class="btn-detail-add-cart" id="btnDetailAddCart">Add to Cart</button>` : ''}
                            `}
                        </div>
                    </div>

                    <div class="detail-guarantee-note">
                        <span>🛡️</span> 14-Day Money-Back Guarantee • Clean commercial license • Free future updates
                    </div>

                    <!-- Discord Community Updates -->
                    <div class="tm-discord-card" style="margin-bottom: 24px;">
                        <div class="tm-discord-info">
                            <div class="tm-discord-header">
                                <svg class="tm-discord-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                                <span>DISCORD COMMUNITY</span>
                            </div>
                            <p class="tm-discord-desc">Get TextMorph Pro updates &amp; version announcements.</p>
                        </div>
                        <a href="${INTERNATIONAL_PURCHASE_CONFIG.DISCORD_INVITE_URL}" target="_blank" rel="noopener noreferrer" class="tm-discord-btn">
                            <span>JOIN DISCORD</span>
                            <span class="tm-btn-arrow">→</span>
                        </a>
                    </div>

                    <!-- 1. INTRO VIDEO (9:16 VERTICAL) — FIRST -->
                    ${product.id === 'textmorph-pro' ? `
                        <div class="detail-section-block detail-intro-video-section">
                            <span class="detail-video-kicker">MEET THE SUITE</span>
                            <h3 class="section-block-title" style="margin-top: 4px;">Meet TextMorph Pro 2.0</h3>
                            <p style="font-size: 0.88rem; color: var(--store-text-muted); margin-bottom: 14px; line-height: 1.5;">
                                See what TextMorph Pro can do and how it can speed up your After Effects workflow.
                            </p>
                            <div class="video-container-9-16-wrapper">
                                <div class="video-container-9-16">
                                    <iframe 
                                        src="https://www.youtube.com/embed/AuKz7l4qT5A" 
                                        title="Meet TextMorph Pro 2.0" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                        allowfullscreen
                                        loading="lazy">
                                    </iframe>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- 2. FEATURE MODULES BREAKDOWN (6 BUILT-IN MODULES) -->
                    ${product.features && product.features.length > 0 ? `
                        <div class="detail-section-block">
                            <h3 class="section-block-title">Inside ${product.name} — 6 Built-in Modules</h3>
                            <p style="font-size: 0.84rem; color: var(--store-text-muted); margin-bottom: 16px;">
                                Explore each production module included directly inside the TextMorph Pro 2.0 After Effects panel:
                            </p>
                            <div class="features-module-list">
                                ${product.features.map(feat => `
                                    <div class="feature-module-card" id="feat-${feat.id}">
                                        <div class="feature-img-frame" title="Click to view full preview">
                                            <img src="${resolveAsset(feat.image)}" alt="${feat.title} - TextMorph Pro 2.0" class="feature-card-screenshot" data-full="${resolveAsset(feat.image)}">
                                        </div>
                                        <div class="feature-content-col">
                                            <div class="feature-header-line">
                                                <h4 class="feature-title">${feat.title}</h4>
                                                <span class="feature-badge-pill">${feat.badge}</span>
                                            </div>
                                            <p class="feature-explanation">"${feat.explanation}"</p>
                                            
                                            <div class="feature-functions-label">Main Functions &amp; Controls:</div>
                                            <div class="feature-tags-cloud">
                                                ${feat.functions.map(fn => `
                                                    <span class="feature-function-tag">• ${fn}</span>
                                                `).join('')}
                                            </div>

                                            ${feat.extraNote ? `
                                                <div class="feature-extra-note">
                                                    ℹ️ ${feat.extraNote}
                                                </div>
                                            ` : ''}

                                            <div class="feature-benefit-callout">
                                                <strong>Main Benefit:</strong> "${feat.benefit}"
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- 3. FULL TUTORIAL (16:9 HORIZONTAL) — AFTER FEATURES -->
                    ${product.id === 'textmorph-pro' ? `
                        <div class="detail-section-block detail-video-section">
                            <span class="detail-video-kicker">LEARN TEXTMORPH PRO 2.0</span>
                            <h3 class="section-block-title" style="margin-top: 4px;">TextMorph Pro 2.0 — Full Tutorial</h3>
                            <p style="font-size: 0.88rem; color: var(--store-text-muted); margin-bottom: 14px; line-height: 1.5;">
                                Watch the complete walkthrough to learn how to use the TextMorph Pro 2.0 tools inside After Effects.
                            </p>
                            
                            <div class="video-container-16-9">
                                <iframe 
                                    src="https://www.youtube.com/embed/3v8oMst-BRQ" 
                                    title="TextMorph Pro 2.0 — Full Tutorial" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowfullscreen
                                    loading="lazy">
                                </iframe>
                            </div>

                            <!-- 4. FINAL BUY NOW CTA -->
                            <div class="detail-pricing-box post-video-cta" style="margin-top: 24px;">
                                <div>
                                    <div class="detail-price-main"><span class="price-val-target">${priceDisplay}</span></div>
                                    ${product.salePrice ? `<div style="font-size: 0.8rem; color: var(--store-text-subtle);">Regular price: <span class="price-regular-target" style="text-decoration: line-through;">$${product.salePrice}</span> (<span class="price-save-target">SAVE 89%</span>)</div>` : ''}
                                </div>
                                <div class="detail-cta-row" style="width: 100%;">
                                    <div class="tm-dual-buy-grid" style="width: 100%;">
                                        <a href="https://rzp.io/rzp/textmorphpro" target="_blank" rel="noopener noreferrer" class="tm-buy-btn tm-btn-india tm-btn-primary-highlight">
                                            <span class="tm-btn-text">🇮🇳 BUY IN INDIA — <span class="price-india-val">₹99</span></span>
                                            <span class="tm-btn-arrow">→</span>
                                        </a>
                                        <a href="${INTERNATIONAL_PURCHASE_CONFIG.GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener noreferrer" class="tm-buy-btn tm-btn-intl">
                                            <span class="tm-btn-text">🌎 BUY INTERNATIONAL — <span class="price-intl-val">$2</span></span>
                                            <span class="tm-btn-arrow">→</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- What's Included -->
                    <div class="detail-section-block">
                        <h3 class="section-block-title">What's Included</h3>
                        <ul class="detail-included-list">
                            ${(product.included || []).map(item => `
                                <li><span class="check-green">✓</span> ${item}</li>
                            `).join('')}
                        </ul>
                    </div>

                    <!-- Key Benefits -->
                    <div class="detail-section-block">
                        <h3 class="section-block-title">Key Workflow Benefits</h3>
                        <ul class="detail-included-list">
                            ${(product.benefits || []).map(b => `
                                <li><span style="color: var(--store-primary); font-weight: 900;">⚡</span> ${b}</li>
                            `).join('')}
                        </ul>
                    </div>

                    <!-- Compatibility & Requirements -->
                    <div class="detail-section-block">
                        <h3 class="section-block-title">Compatibility &amp; System Requirements</h3>
                        <p style="font-size: 0.85rem; color: #334155; margin-bottom: 6px;"><strong>Software:</strong> ${product.compatibility}</p>
                        ${product.requirements ? `<p style="font-size: 0.85rem; color: #334155;"><strong>Requirements:</strong> ${product.requirements}</p>` : ''}
                    </div>

                    <!-- FAQs Accordion -->
                    ${product.faqs && product.faqs.length > 0 ? `
                        <div class="detail-section-block">
                            <h3 class="section-block-title">Frequently Asked Questions</h3>
                            <div class="faq-accordion">
                                ${product.faqs.map((faq, i) => `
                                    <div class="faq-item ${i === 0 ? 'open' : ''}">
                                        <button type="button" class="faq-question-btn">
                                            <span>${faq.q}</span>
                                            <span class="faq-icon-arrow">▼</span>
                                        </button>
                                        <div class="faq-answer">${faq.a}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                </div>
            </div>
        `;

        // Attach Back Button Handler
        const backBtn = document.getElementById('btnBackToCatalog');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                closeProductDetail(true);
            });
        }

        // Attach Crumb Category link
        const crumbCat = productDetailView.querySelector('.crumb-cat');
        if (crumbCat) {
            crumbCat.addEventListener('click', (e) => {
                e.preventDefault();
                state.activeCategory = product.category;
                updateActiveNav();
                closeProductDetail(true);
            });
        }

        // Attach Checkout button
        const buyBtn = document.getElementById('btnDetailCheckout');
        if (buyBtn && buyBtn.tagName === 'BUTTON') {
            buyBtn.addEventListener('click', () => {
                openCheckoutModal(product);
            });
        }

        // Attach Add to Cart button
        const addCartBtn = document.getElementById('btnDetailAddCart');
        if (addCartBtn) {
            addCartBtn.addEventListener('click', () => {
                addToCart(product);
            });
        }

        // Attach Accordion Toggle
        productDetailView.querySelectorAll('.faq-question-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                item.classList.toggle('open');
            });
        });

        // Attach Gallery Thumbnail Switcher Handlers
        const detailMainImg = document.getElementById('detailMainImg');
        const thumbButtons = productDetailView.querySelectorAll('.detail-thumb-btn');
        thumbButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetImg = btn.getAttribute('data-img');
                if (detailMainImg && targetImg) {
                    detailMainImg.src = targetImg;
                }
                thumbButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Clicking a screenshot in feature card switches top preview and highlights thumb
        productDetailView.querySelectorAll('.feature-card-screenshot').forEach(img => {
            img.addEventListener('click', () => {
                const fullSrc = img.getAttribute('data-full');
                if (detailMainImg && fullSrc) {
                    detailMainImg.src = fullSrc;
                    thumbButtons.forEach(b => {
                        if (b.getAttribute('data-img') === fullSrc) {
                            b.classList.add('active');
                        } else {
                            b.classList.remove('active');
                        }
                    });
                    const galleryWrap = productDetailView.querySelector('.detail-gallery-box');
                    if (galleryWrap) {
                        galleryWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            });
        });

        // Apply localized prices & country-specific purchase flow
        CurrencyService.getLocalizedPrice().then(data => {
            CurrencyService.updateAllPriceTargets(data);
        });
    }

    function closeProductDetail(updateHistory = true) {
        state.activeProductSlug = 'textmorph-pro';
        if (heroBanner) heroBanner.style.display = 'none';
        if (promosGrid) promosGrid.style.display = 'none';
        if (catalogSection) catalogSection.style.display = 'none';
        if (productDetailView) productDetailView.style.display = 'flex';
        renderTextMorphLanding(PRODUCTS[0]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ==================== 6. CHECKOUT ARCHITECTURE MODAL ====================
    function openCheckoutModal(product) {
        if (!checkoutModal) return;

        if (checkoutItemTitle) checkoutItemTitle.textContent = product.name;
        if (checkoutItemPrice) {
            checkoutItemPrice.textContent = product.price === 0 ? 'FREE' : `$${product.price}`;
        }

        checkoutModal.classList.add('active');
    }

    function closeCheckoutModal() {
        if (checkoutModal) {
            checkoutModal.classList.remove('active');
        }
    }

    // ==================== 7. EVENT LISTENERS & INITIALIZATION ====================

    // Category button clicks (sidebar)
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            state.activeCategory = btn.getAttribute('data-cat') || 'all';
            updateActiveNav();
            if (state.activeProductSlug) {
                openProductDetail('textmorph-pro', false);
            }
            const url = state.activeCategory !== 'all' ? `/store?category=${state.activeCategory}` : '/store';
            window.history.pushState({ category: state.activeCategory }, '', url);
            renderProducts();
        });
    });

    // Mobile category pills
    mobileCatPills.forEach(pill => {
        pill.addEventListener('click', () => {
            state.activeCategory = pill.getAttribute('data-cat') || 'all';
            updateActiveNav();
            if (state.activeProductSlug) {
                closeProductDetail(false);
            }
            renderProducts();
        });
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            if (searchClearBtn) {
                searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
            }
            if (state.activeProductSlug) {
                closeProductDetail(false);
            }
            renderProducts();
        });
    }

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            state.searchQuery = '';
            searchClearBtn.style.display = 'none';
            renderProducts();
        });
    }

    // Keyboard shortcut '/' to search
    window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }
        if (e.key === 'Escape') {
            closeCartDrawer();
            closeCheckoutModal();
        }
    });

    // Sorting
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderProducts();
        });
    }

    // Software Platform Filter
    softwareCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            state.selectedSoftware = Array.from(softwareCheckboxes)
                .filter(c => c.checked)
                .map(c => c.value);
            renderProducts();
        });
    });

    // Cart Drawer triggers
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', openCartDrawer);
    }
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartDrawer);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartDrawer);
    }

    // Checkout modal triggers
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
    }
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) closeCheckoutModal();
        });
    }
    if (checkoutConfirmBtn) {
        checkoutConfirmBtn.addEventListener('click', () => {
            alert('Payment Gateway Architecture Notice:\n\nThis digital store architecture is configured and ready for live payment gateway connection (Stripe Checkout / Lemon Squeezy / Gumroad / Razorpay).\n\nWhen live API credentials or payment webhook endpoints are configured, transactions will securely fulfill instant digital download keys.');
            closeCheckoutModal();
        });
    }

    // Hero buttons
    const heroViewBtn = document.getElementById('heroViewBtn');
    if (heroViewBtn) {
        heroViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openProductDetail('textmorph-pro', true);
        });
    }

    // Handle Browser Back/Forward buttons (History API)
    window.addEventListener('popstate', (e) => {
        parseUrlRoute();
    });

    // Parse URL on Initial Load
    function parseUrlRoute() {
        const path = window.location.pathname;
        const params = new URLSearchParams(window.location.search);

        // Check product in query ?product=slug
        const productParam = params.get('product');
        if (productParam) {
            openProductDetail(productParam, false);
            return;
        }

        // Check path /store/[slug]
        const segments = path.split('/').filter(Boolean);
        if (segments.length >= 2 && segments[0] === 'store') {
            const potentialSlug = segments[1].replace('.html', '');
            if (PRODUCTS.some(p => p.slug === potentialSlug)) {
                openProductDetail(potentialSlug, false);
                return;
            }
        }

        // Category in query ?category=plugins
        const catParam = params.get('category');
        if (catParam) {
            state.activeCategory = catParam;
            updateActiveNav();
        }

        // Search in query ?search=after+effects
        const searchParam = params.get('search');
        if (searchParam && searchInput) {
            searchInput.value = searchParam;
            state.searchQuery = searchParam;
        }

        closeProductDetail(false);
    }

    // Initial setup
    updateWishlistBadge();
    updateCartUI();
    updateActiveNav();
    parseUrlRoute();
    renderProducts();
    OfferService.init();
    PurchaseNotificationService.init();

})();
