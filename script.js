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

    // ==================== 3. BINDER FOLDER TABS ====================
    const binderTabs = document.querySelectorAll('.binder-tab');
    const folderCards = document.querySelectorAll('.folder-card');

    binderTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const folderIndex = tab.getAttribute('data-folder');
            const targetCard = document.getElementById(`projectCard${folderIndex}`);

            binderTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (targetCard) {
                const navWrapper = document.querySelector('.navbar-wrapper');
                const offset = (navWrapper ? navWrapper.offsetHeight : 60) + 20;
                const cardTop = targetCard.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: cardTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sync active binder tab on scroll past cards
    const folderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cardId = entry.target.id;
                const index = cardId.replace('projectCard', '');
                binderTabs.forEach(tab => {
                    if (tab.getAttribute('data-folder') === index) {
                        binderTabs.forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-25% 0px -50% 0px',
        threshold: 0.1
    });

    folderCards.forEach(card => folderObserver.observe(card));

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
