/**
 * DIBENDU DAS — DIGITAL PRODUCT STORE
 * Client-Side Architecture & Product Data Store
 */

(function () {
    'use strict';

    // ==================== 1. REUSABLE PRODUCT DATA STORE ====================
    const PRODUCTS = [
        {
            id: 'textmorph-pro',
            slug: 'textmorph-pro',
            name: 'TextMorph Pro',
            category: 'plugins',
            categoryLabel: 'After Effects Plugin',
            software: ['After Effects'],
            softwareBadge: 'Ae 2020–2026',
            price: 49,
            salePrice: 79,
            rating: 4.9,
            reviewsCount: 54,
            badge: 'Best Seller',
            badgeClass: 'badge-bestseller',
            thumbnail: '../images/store/textmorph-pro.jpg',
            featured: true,
            headline: 'Kinetic Typography & Text Animation Plugin for After Effects',
            description: 'Stop wasting hours manually keyframing text. TextMorph Pro brings 120+ retention-focused kinetic typography presets, customizable overshoot curves, and 1-click in/out animations designed specifically for high-retention short-form video editors.',
            benefits: [
                '120+ Kinetic Typography Presets',
                'Zero Keyframes Required',
                'Live Real-time Preview Panel',
                'Multi-Language Unicode Support'
            ],
            included: [
                '120+ Kinetic Text Presets (.ffx)',
                'Custom AE Script UI Panel (.jsxbin)',
                'Step-by-Step 4K Video Tutorial (45 mins)',
                'Commercial Client License (Lifetime)',
                'Free Future Version Updates'
            ],
            compatibility: 'Adobe After Effects 2020 through 2026 on macOS (Intel & Apple Silicon) and Windows 10/11.',
            requirements: 'No third-party plugins required. Uses native After Effects shape engine.',
            faqs: [
                {
                    q: 'Can I use this for paid client reels and commercial projects?',
                    a: 'Yes! Every purchase comes with a full Commercial Client License permitting unlimited commercial and personal video projects.'
                },
                {
                    q: 'Do I need extra plugins like Element 3D or Trapcode?',
                    a: 'None at all. TextMorph Pro operates 100% natively using standard After Effects expression and shape vector pipelines.'
                },
                {
                    q: 'How do I receive updates when new presets are added?',
                    a: 'All customers receive instant download notification emails and lifetime access to future preset releases.'
                }
            ]
        },
        {
            id: 'retention-cut-presets',
            slug: 'retention-cut-presets',
            name: 'Retention Cut Presets',
            category: 'presets',
            categoryLabel: 'Premiere Pro Presets',
            software: ['Premiere Pro'],
            softwareBadge: 'Pr 2021+',
            price: 39,
            salePrice: 59,
            rating: 4.9,
            reviewsCount: 39,
            badge: 'Popular',
            badgeClass: 'badge-popular',
            thumbnail: '../images/store/retention-presets.jpg',
            featured: false,
            headline: 'Pacing, Dead-Air Trimmer & Fast Cut Presets for Premiere Pro',
            description: 'Engineered around viewer psychology to hold attention across the critical 3-second drop-off window. Includes punch-in zooms, dynamic whip transitions, rhythm cuts, and silence elimination markers.',
            benefits: [
                'Psychology-backed pacing cuts',
                'Smooth optical flow zoom bursts',
                '1-click drag and drop onto timeline',
                'Compatible with 4K and 1080p footage'
            ],
            included: [
                '45 Custom Premiere Pro Effect Presets (.prfpset)',
                'Pacing Marker Timeline Project (.prproj)',
                'Keyboard Shortcut Rapid Editing Cheat Sheet',
                'Installation & Quick-Start Video Guide'
            ],
            compatibility: 'Adobe Premiere Pro 2021 through 2026 (macOS & Windows).',
            requirements: 'Standard Premiere Pro install with GPU acceleration recommended.',
            faqs: [
                {
                    q: 'Are these drag-and-drop presets?',
                    a: 'Yes, simply import the .prfpset file into your Premiere Pro Effects window and drag onto any adjustment layer or clip.'
                },
                {
                    q: 'Does it work with 9:16 vertical reels as well as 16:9?',
                    a: 'Yes, presets automatically adapt to whatever sequence aspect ratio you have configured in Premiere.'
                }
            ]
        },
        {
            id: 'creator-sound-vault',
            slug: 'creator-sound-vault',
            name: 'Creator Sound Vault',
            category: 'creative-assets',
            categoryLabel: 'Sound Design Asset',
            software: ['All Editors'],
            softwareBadge: 'Universal WAV',
            price: 29,
            salePrice: 49,
            rating: 4.8,
            reviewsCount: 27,
            badge: 'New',
            badgeClass: 'badge-new',
            thumbnail: '../images/store/sound-vault.jpg',
            featured: false,
            headline: '350+ Retention Sound Effects, Whooshes & Impact Hits',
            description: 'Sound design is 50% of retention. Mastered 24-bit WAV library designed specifically for talking-head reels, YouTube shorts, and commercials. Whooshes, risers, bass drops, tech clicks, pop hits, and subtle UI notifications.',
            benefits: [
                'Mastered at -14 LUFS for modern social platforms',
                'Organized by pacing function & emotion',
                '100% Royalty-Free commercial clearance',
                'Instant drag-and-drop into any NLE'
            ],
            included: [
                '350+ High-Definition 24-bit/48kHz WAV Files',
                '8 Categorized Subfolders (Whooshes, Risers, Hits, UI, Transitions)',
                'Metadata-tagged for Soundly, Soundminer & Finder',
                'Commercial Royalty-Free License Agreement'
            ],
            compatibility: 'Universal — Works in Premiere Pro, DaVinci Resolve, Final Cut Pro, CapCut, Audition, Reaper, Logic, etc.',
            requirements: 'Any audio or video editor that accepts WAV/MP3 files.',
            faqs: [
                {
                    q: 'Will my YouTube videos get copyright claims?',
                    a: 'Never. These sound effects were custom recorded and synthesized by Dibendu and are 100% copyright-safe and royalty-free.'
                }
            ]
        },
        {
            id: 'viral-reels-templates',
            slug: 'viral-reels-templates',
            name: 'Viral Reels Template Kit',
            category: 'templates',
            categoryLabel: 'Premiere & AE MOGRT',
            software: ['Premiere Pro', 'After Effects'],
            softwareBadge: 'MOGRT + AE',
            price: 34,
            salePrice: 59,
            rating: 4.9,
            reviewsCount: 42,
            badge: 'Hot',
            badgeClass: 'badge-hot',
            thumbnail: '../images/store/reels-templates.jpg',
            featured: false,
            headline: '25 Modern 9:16 Editorial Reel Templates & Layouts',
            description: 'Modern editorial layouts designed to repurpose podcasts, talking-head videos, and client clips into engaging vertical videos. Includes split-screens, quote cards, progress bars, and minimal subtitle badges.',
            benefits: [
                '25 Responsive 9:16 vertical layouts',
                'Customizable colors, fonts & borders in Essential Graphics',
                'Podcast split-screen auto-framing',
                'Minimalist documentary aesthetics'
            ],
            included: [
                '25 Motion Graphics Template Files (.mogrt)',
                '25 After Effects Project Files (.aep)',
                'Figma Layout & Typography Components',
                'Installation & Customization Video Walkthrough'
            ],
            compatibility: 'Adobe Premiere Pro 2022+ & After Effects 2022+ (macOS & Windows).',
            requirements: 'No third-party plugins required.',
            faqs: [
                {
                    q: 'Can I edit the text directly in Premiere Pro without opening After Effects?',
                    a: 'Yes, all parameters (text, fonts, colors, border radiuses) can be adjusted straight inside the Premiere Pro Essential Graphics panel.'
                }
            ]
        },
        {
            id: 'kinetic-captions-pack',
            slug: 'kinetic-captions-pack',
            name: 'Kinetic Captions & Subtitles',
            category: 'presets',
            categoryLabel: 'Subtitle Presets',
            software: ['Premiere Pro'],
            softwareBadge: 'Pr Auto-Cap',
            price: 24,
            salePrice: 39,
            rating: 4.8,
            reviewsCount: 31,
            badge: 'Trending',
            badgeClass: 'badge-popular',
            thumbnail: '../images/store/textmorph-pro.jpg',
            headline: 'Modern Creator Caption Styles, Text Animations & Color Presets',
            description: 'The exact caption styles used by top 1% content creators. Features active word color pop, bounce easing, box highlights, and multi-line kinetic typography.',
            benefits: [
                'Compatible with Premiere built-in Auto-Captions',
                'Word-by-word active highlight pop',
                '10 High-converting creator color themes',
                'Zero rendering lag'
            ],
            included: [
                '20 Premiere Pro Subtitle Track Styles',
                '10 Animated Headline MOGRT Overlays',
                'Curated Creator Google Fonts Bundle',
                'Video Guide for 1-Click Application'
            ],
            compatibility: 'Adobe Premiere Pro 2023 through 2026.',
            requirements: 'Works with Premiere Pro native caption transcription tools.',
            faqs: [
                {
                    q: 'Does this work with auto-generated captions?',
                    a: 'Yes! You can auto-transcribe in Premiere Pro and apply these styles with one click to the entire subtitle track.'
                }
            ]
        },
        {
            id: 'pattern-interrupts-fx',
            slug: 'pattern-interrupts-fx',
            name: 'Pattern Interrupts & Glitch FX',
            category: 'motion-graphics',
            categoryLabel: 'Motion Graphics Assets',
            software: ['All Editors'],
            softwareBadge: '4K ProRes 4444',
            price: 29,
            salePrice: 45,
            rating: 4.7,
            reviewsCount: 19,
            badge: 'New',
            badgeClass: 'badge-new',
            thumbnail: '../images/store/retention-presets.jpg',
            headline: '40 Visual Disruptors, Quick Flashes & Retention Resets',
            description: 'Keep viewers glued past 15 seconds. Subtle RGB split glitches, tape rewinds, strobe hits, frame blinks, and paper tear transitions.',
            benefits: [
                'Pre-keyed alpha channel ProRes 4444 files',
                'Subtle, non-distracting visual pacing resets',
                'Syncs perfectly with audio sound design whooshes',
                'Drag and drop over any video layer'
            ],
            included: [
                '40 Alpha Channel Video Overlays (4K 60FPS ProRes 4444)',
                'Sync Audio FX for every transition',
                'Premiere Pro Timeline drag-and-drop presets',
                'Commercial Clearance License'
            ],
            compatibility: 'Universal — Works in Premiere, After Effects, DaVinci Resolve, Final Cut, CapCut.',
            requirements: 'Supports any editor that handles ProRes 4444 or blending modes.'
        },
        {
            id: 'clean-editorial-titles',
            slug: 'clean-editorial-titles',
            name: 'Clean Editorial Titles',
            category: 'templates',
            categoryLabel: 'Typography Templates',
            software: ['Premiere Pro'],
            softwareBadge: 'Pr MOGRT',
            price: 25,
            salePrice: 40,
            rating: 4.9,
            reviewsCount: 23,
            badge: 'Minimal',
            badgeClass: 'badge-popular',
            thumbnail: '../images/store/reels-templates.jpg',
            headline: 'Minimalist Editorial Typography & Studio Lower Thirds',
            description: 'Sophisticated, high-end editorial titles for documentary style reels, founder stories, and premium brand edits. Minimalist aesthetic, smooth bezier motion.',
            benefits: [
                'Clean Swiss & brutalist typography layouts',
                'Responsive auto-resizing text boxes',
                'Smooth organic in/out motion easing',
                'No plugins needed'
            ],
            included: [
                '18 Minimal Title Templates (.mogrt)',
                '12 Lower Third Overlays',
                'Typography Styling Guide',
                'Tutorial on matching client brand aesthetics'
            ],
            compatibility: 'Premiere Pro 2022+ (macOS & Windows).'
        },
        {
            id: 'free-creator-starter-kit',
            slug: 'free-creator-starter-kit',
            name: 'Free Creator Starter Kit',
            category: 'freebies',
            categoryLabel: 'Starter Asset Pack',
            software: ['All Editors'],
            softwareBadge: 'Free Download',
            price: 0,
            salePrice: 0,
            rating: 5.0,
            reviewsCount: 112,
            badge: 'Free',
            badgeClass: 'badge-free',
            thumbnail: '../images/store/sound-vault.jpg',
            headline: 'Essential Starter Presets, SFX & Video Editing Cheatsheet',
            description: 'Everything you need to test Dibendu\'s editing system. 5 Retention zoom presets, 20 essential creator sound effects, 2 kinetic title templates, and the Video Retention Psychology Guide.',
            benefits: [
                '100% Free instant download',
                'Taste test of the full product ecosystem',
                'Includes Video Retention Psychology PDF',
                'Commercial license included'
            ],
            included: [
                '5 Premiere Pro Retention Zoom Presets',
                '20 Essential WAV Sound Effects',
                '2 Kinetic Typography MOGRTs',
                'PDF Guide: Psychology of Video Retention',
                'Free Commercial License'
            ],
            compatibility: 'Universal across Premiere Pro and standard video editors.'
        }
    ];

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
            const priceHtml = isFree 
                ? `<span class="price-free">FREE</span>` 
                : `<span class="price-current">$${p.price}</span>${p.salePrice ? `<span class="price-was">$${p.salePrice}</span>` : ''}`;

            return `
                <div class="product-card" data-slug="${p.slug}">
                    <div class="card-image-box">
                        ${p.badge ? `<span class="card-badge ${p.badgeClass}">${p.badge}</span>` : ''}
                        <button type="button" class="btn-card-wishlist ${isWish ? 'active' : ''}" data-wishlist-id="${p.id}" title="Add to Wishlist" aria-label="Add to wishlist">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="${isWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        </button>
                        <img src="${p.thumbnail}" alt="${p.name}" class="product-card-img" loading="lazy">
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
                            <span class="rating-count">(${p.reviewsCount})</span>
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

    function renderDetailView(product) {
        if (!productDetailView) return;

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
                        <img src="${product.thumbnail}" alt="${product.name}" class="detail-main-img">
                    </div>
                    <div class="detail-compatibility-badges">
                        <span class="compat-badge">💾 ${product.softwareBadge}</span>
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
                        <span style="color: var(--store-text-muted);">(${product.reviewsCount} verified reviews)</span>
                    </div>

                    <p style="font-size: 0.92rem; line-height: 1.5; color: var(--store-text-muted);">${product.description}</p>

                    <!-- Pricing & CTA Card -->
                    <div class="detail-pricing-box">
                        <div>
                            <div class="detail-price-main">${priceDisplay}</div>
                            ${product.salePrice ? `<div style="font-size: 0.8rem; color: var(--store-text-subtle);">Regular price: <span style="text-decoration: line-through;">$${product.salePrice}</span> (Save $${product.salePrice - product.price})</div>` : ''}
                        </div>
                        <div class="detail-cta-row">
                            <button type="button" class="btn-detail-buy" id="btnDetailCheckout">
                                ${isFree ? 'DOWNLOAD FREE' : `BUY NOW — $${product.price}`} →
                            </button>
                            ${!isFree ? `<button type="button" class="btn-detail-add-cart" id="btnDetailAddCart">Add to Cart</button>` : ''}
                        </div>
                    </div>

                    <div class="detail-guarantee-note">
                        <span>🛡️</span> 14-Day Money-Back Guarantee • Clean commercial license • Free future updates
                    </div>

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
        if (buyBtn) {
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
    }

    function closeProductDetail(updateHistory = true) {
        state.activeProductSlug = null;
        if (productDetailView) productDetailView.style.display = 'none';
        if (heroBanner) heroBanner.style.display = 'grid';
        if (promosGrid) promosGrid.style.display = 'grid';
        if (catalogSection) catalogSection.style.display = 'flex';

        if (updateHistory) {
            const url = state.activeCategory !== 'all' 
                ? `/store?category=${state.activeCategory}` 
                : '/store';
            window.history.pushState({}, '', url);
        }

        renderProducts();
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
                closeProductDetail(false);
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

})();
