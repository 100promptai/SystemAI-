document.addEventListener('DOMContentLoaded', () => {
    const CHECKOUT_URL = 'https://promptaiweb.gumroad.com/l/100promptsmk?_gl=1*djr0xe*_ga*MTIyMTY1NjMzMi4xNzkwMTE4MDA3*_ga_6LJN6D94N6*czE3OTUxMTYzMDYkbzY1JGcxJHQxNzk1MTE2MzE5JGo0NyRsMCRoMA..';

    const glowEl = document.getElementById('ambientGlow');
    const scrollBar = document.getElementById('scrollProgress');
    const backdropWord = document.getElementById('giantBackdrop');
    const coreStage = document.getElementById('aiCoreStage');
    const heroSection = document.getElementById('hero');
    const pricingSection = document.getElementById('pricing');

    // Ensure all product access links point to Gumroad + preserve any incoming UTM parameters
    const extraParams = window.location.search ? window.location.search.slice(1) : '';
    document.querySelectorAll('.checkout-link').forEach((link) => {
        const finalUrl = extraParams ? `${CHECKOUT_URL}&${extraParams}` : CHECKOUT_URL;
        link.setAttribute('href', finalUrl);
    });

    // 1. Mobile floating CTA bar pointing directly to checkout
    const mobileBar = document.createElement('div');
    mobileBar.className = 'mobile-sticky';
    const mobileCheckoutUrl = extraParams ? `${CHECKOUT_URL}&${extraParams}` : CHECKOUT_URL;
    mobileBar.innerHTML = `
        <div>
            <small>One-Time Payment</small>
            <strong>$17</strong>
        </div>
        <a href="${mobileCheckoutUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">Get Access — $17</a>
    `;
    document.body.appendChild(mobileBar);

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

        if (scrollBar) {
            scrollBar.style.setProperty('--scroll-pct', `${pct}%`);
        }

        if (backdropWord) {
            const shiftY = Math.min(90, scrollTop * 0.16);
            backdropWord.style.transform = `translate3d(0, calc(-50% + ${shiftY}px), 0)`;
        }

        if (heroSection && pricingSection) {
            const passedHero = heroSection.getBoundingClientRect().bottom < 0;
            const nearPricing = pricingSection.getBoundingClientRect().top < window.innerHeight * 0.75;
            const showBar = passedHero && !nearPricing;
            mobileBar.style.opacity = showBar ? '1' : '0';
            mobileBar.style.pointerEvents = showBar ? 'auto' : 'none';
        }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Interactive 3D tilt on the AI Core showcase
    if (coreStage && window.matchMedia('(pointer: fine)').matches) {
        coreStage.addEventListener('mousemove', (e) => {
            const rect = coreStage.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;
            coreStage.style.transform = `rotateX(${(-ny * 24).toFixed(2)}deg) rotateY(${(nx * 24).toFixed(2)}deg)`;
        });

        coreStage.addEventListener('mouseleave', () => {
            coreStage.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    // 3. Dynamic ambient glow per section
    const sections = document.querySelectorAll('section[data-glow]');
    const glowObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && glowEl) {
                    const rgb = entry.target.getAttribute('data-glow');
                    if (rgb) glowEl.style.setProperty('--glow-rgb', rgb);
                }
            });
        },
        { threshold: 0.35 }
    );
    sections.forEach((sec) => glowObserver.observe(sec));

    // 4. Animated counter for "15m" setup stat
    const setupCounter = document.getElementById('setupCounter');
    if (setupCounter) {
        const target = Number(setupCounter.getAttribute('data-target') || 15);
        const suffix = setupCounter.getAttribute('data-suffix') || '';
        let counted = false;

        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !counted) {
                        counted = true;
                        const duration = 900;
                        const startTime = performance.now();

                        const tick = (now) => {
                            const progress = Math.min(1, (now - startTime) / duration);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            setupCounter.textContent = `${Math.round(eased * target)}${suffix}`;
                            if (progress < 1) requestAnimationFrame(tick);
                        };

                        requestAnimationFrame(tick);
                        counterObserver.unobserve(setupCounter);
                    }
                });
            },
            { threshold: 0.4 }
        );

        counterObserver.observe(setupCounter);
    }

    // 5. Reveal-up cards + animated progress bars
    const revealEls = document.querySelectorAll('.reveal-up');
    const meterBars = document.querySelectorAll('.meter-bar');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    const meterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    meterBars.forEach((bar) => {
                        const w = bar.getAttribute('data-width');
                        if (w) bar.style.width = w;
                    });
                    meterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );
    const modesSec = document.getElementById('modes');
    if (modesSec) meterObserver.observe(modesSec);

    // 6. Interactive Mode Switcher
    const modePills = document.querySelectorAll('.mode-pill');
    const modeBigNumber = document.getElementById('modeBigNumber');
    const modeDesc = document.getElementById('modeDesc');
    const modeBadge = document.getElementById('modeBadge');
    const monitorHeadline = document.getElementById('monitorHeadline');
    const monitorCaption = document.getElementById('monitorCaption');

    const modeMap = {
        speed: {
            badge: 'SPEED MODE',
            headline: '3X FASTER EXECUTION',
            caption: 'Modular workflows engineered for repeatable clarity'
        },
        scale: {
            badge: 'CREATION MODE',
            headline: '5X OUTPUT VELOCITY',
            caption: 'Move from raw notes to structured assets without friction'
        },
        value: {
            badge: '$17 ONE-TIME',
            headline: '$17 LIFETIME ACCESS',
            caption: 'No recurring subscription • Backed by a 7-day guarantee'
        }
    };

    modePills.forEach((pill) => {
        pill.addEventListener('click', () => {
            modePills.forEach((p) => p.classList.remove('active'));
            pill.classList.add('active');

            const mode = pill.getAttribute('data-mode');
            const big = pill.getAttribute('data-big');
            const desc = pill.getAttribute('data-desc');
            const glow = pill.getAttribute('data-glow');

            if (modeBigNumber && big) modeBigNumber.textContent = big;
            if (modeDesc && desc) modeDesc.textContent = desc;
            if (glowEl && glow) glowEl.style.setProperty('--glow-rgb', glow);

            if (mode && modeMap[mode]) {
                if (modeBadge) modeBadge.textContent = modeMap[mode].badge;
                if (monitorHeadline) monitorHeadline.textContent = modeMap[mode].headline;
                if (monitorCaption) monitorCaption.textContent = modeMap[mode].caption;
            }
        });
    });

    // 7. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach((other) => {
                other.classList.remove('open');
                other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 8. Legal Modals (Terms of Use & Privacy Policy)
    document.querySelectorAll('[data-modal]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = modalId ? document.getElementById(modalId) : null;
            if (modal) {
                modal.classList.add('open');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    document.querySelectorAll('[data-close-modal]').forEach((closer) => {
        closer.addEventListener('click', () => {
            const modal = closer.closest('.legal-modal');
            if (modal) {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.legal-modal.open').forEach((modal) => {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
            });
        }
    });
});
