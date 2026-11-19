document.addEventListener('DOMContentLoaded', () => {
    const CHECKOUT_URL = 'https://promptaiweb.gumroad.com/l/100promptsmk?_gl=1*djr0xe*_ga*MTIyMTY1NjMzMi4xNzkwMTE4MDA3*_ga_6LJN6D94N6*czE3OTUxMTYzMDYkbzY1JGcxJHQxNzk1MTE2MzE5JGo0NyRsMCRoMA..';

    const glowEl = document.getElementById('ambientGlow');
    const scrollBar = document.getElementById('scrollProgress');
    const backdropWord = document.getElementById('giantBackdrop');
    const coreStage = document.getElementById('aiCoreStage');
    const heroSection = document.getElementById('hero');
    const pricingSection = document.getElementById('pricing');

    // Point all product access links to Gumroad + preserve any incoming UTM parameters
    const extraParams = window.location.search ? window.location.search.slice(1) : '';
    const finalCheckoutUrl = extraParams ? `${CHECKOUT_URL}&${extraParams}` : CHECKOUT_URL;

    document.querySelectorAll('.checkout-link').forEach((link) => {
        link.setAttribute('href', finalCheckoutUrl);
    });

    // 1. Mobile floating CTA bar pointing directly to checkout
    const mobileBar = document.createElement('div');
    mobileBar.className = 'mobile-sticky';
    mobileBar.innerHTML = `
        <div>
            <small>One-Time Payment</small>
            <strong>$17</strong>
        </div>
        <a href="${finalCheckoutUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">Get Access — $17</a>
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

    // 3. 5-Category Marketing Prompt Preview Switcher + Copy button
    const promptSamples = {
        hooks: {
            badge: 'CATEGORY 01 / AD & VIDEO HOOKS',
            title: 'Scroll-Stopping First 3 Seconds Hook Generator',
            deliverable: 'Concrete Deliverable: 10 tested short-form & paid ad hooks ready to record or launch.',
            code: `Act as a direct-response performance marketer. Create 10 scroll-stopping opening hooks (under 12 words each) for [PRODUCT/OFFER] targeting [TARGET AUDIENCE] who struggle with [MAIN PAIN POINT].

Use these 4 angles:
- Contrarian truth that challenges a common belief
- Specific result without [COMMON OBJECTION]
- Pattern interrupt based on a costly mistake
- Curiosity gap tied to [DESIRED OUTCOME]

For each hook, output: 1) Spoken Hook, 2) On-Screen Text, and 3) Visual Cue for the first 3 seconds.`
        },
        emails: {
            badge: 'CATEGORY 02 / EMAIL CAMPAIGNS',
            title: 'High-Click Conversion Email Sequence Builder',
            deliverable: 'Concrete Deliverable: 5-email sequence with subject lines, preview text, body copy & CTAs.',
            code: `Act as an email conversion copywriter. Write a 5-email sequence promoting [OFFER NAME] ($17) to [AUDIENCE SEGMENT].

Structure across the 5 emails:
1) Problem & agitation story
2) Specific mechanism / how the system works
3) Case example & overcoming [TOP OBJECTION]
4) Before/after contrast in daily workflow
5) Direct reminder & risk-reversal call to action

Include 3 subject line options + preview text for each email.`
        },
        creatives: {
            badge: 'CATEGORY 03 / AD CREATIVES',
            title: 'Multi-Format Paid Ad Creative Matrix',
            deliverable: 'Concrete Deliverable: Ready-to-brief ad concepts with headlines, primary text & visual direction.',
            code: `Act as a paid media creative strategist. Generate 4 distinct ad creative concepts for [PRODUCT/OFFER] aimed at [PLATFORM: Meta / TikTok / YouTube].

For each concept, provide:
- Creative Format (UGC demo, split-screen comparison, kinetic typography, founder POV)
- Primary Text (short & long versions)
- Headline & CTA Button
- Visual Shot List & Frame-by-Frame Action`
        },
        funnels: {
            badge: 'CATEGORY 04 / SALES FUNNELS',
            title: 'End-to-End Funnel Architecture & Copy Prompt',
            deliverable: 'Concrete Deliverable: Landing hero, value stack, objection blocks & post-click follow-up flow.',
            code: `Act as a conversion funnel architect. Design a direct-response funnel for [PRODUCT/OFFER] priced at [PRICE].

Map out:
1) Entry point / lead or tripwire angle
2) Landing page hero headline, subheadline & primary CTA
3) 3 core deliverable pillars tied to measurable outcomes
4) Risk-reversal guarantee & FAQ objections
5) Next-step upsell or retention touchpoint`
        },
        offers: {
            badge: 'CATEGORY 05 / OFFERS & ANGLES',
            title: 'Irresistible Offer Positioning & Angle Refiner',
            deliverable: 'Concrete Deliverable: Sharper value proposition, comparison points & high-clarity positioning.',
            code: `Act as an offer strategist. Sharpen the positioning for [PRODUCT/OFFER] so it stands out against [STATUS QUO / ALTERNATIVE].

Output:
- One-sentence specific outcome promise
- Top 5 buyer objections and how to neutralize them upfront
- Side-by-side comparison points (Old Way vs. System Way)
- High-clarity value bullets focused on speed and simplicity`
        }
    };

    const catTabs = document.querySelectorAll('.cat-tab');
    const sandboxBadge = document.getElementById('sandboxBadge');
    const sandboxTitle = document.getElementById('sandboxTitle');
    const sandboxDeliverable = document.getElementById('sandboxDeliverable');
    const promptCode = document.getElementById('promptCode');
    const copyPromptBtn = document.getElementById('copyPromptBtn');

    catTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            catTabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            const key = tab.getAttribute('data-cat');
            const item = key ? promptSamples[key] : null;
            if (item) {
                if (sandboxBadge) sandboxBadge.textContent = item.badge;
                if (sandboxTitle) sandboxTitle.textContent = item.title;
                if (sandboxDeliverable) sandboxDeliverable.textContent = item.deliverable;
                if (promptCode) promptCode.textContent = item.code;
                if (copyPromptBtn) {
                    copyPromptBtn.textContent = 'Copy Prompt';
                    copyPromptBtn.classList.remove('copied');
                }
            }
        });
    });

    if (copyPromptBtn && promptCode) {
        copyPromptBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(promptCode.textContent || '');
                copyPromptBtn.textContent = '✓ Copied';
                copyPromptBtn.classList.add('copied');
                setTimeout(() => {
                    copyPromptBtn.textContent = 'Copy Prompt';
                    copyPromptBtn.classList.remove('copied');
                }, 1800);
            } catch {
                copyPromptBtn.textContent = 'Select & Copy';
            }
        });
    }

    // 4. Dynamic ambient glow per section
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

    // 5. Animated counter for "100+" prompts stat
    const setupCounter = document.getElementById('setupCounter');
    if (setupCounter) {
        const target = Number(setupCounter.getAttribute('data-target') || 100);
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

    // 6. Reveal-up cards + animated progress bars
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

    // 7. Interactive Deliverable Mode Switcher
    const modePills = document.querySelectorAll('.mode-pill');
    const modeBigNumber = document.getElementById('modeBigNumber');
    const modeDesc = document.getElementById('modeDesc');
    const modeBadge = document.getElementById('modeBadge');
    const monitorHeadline = document.getElementById('monitorHeadline');
    const monitorCaption = document.getElementById('monitorCaption');

    const modeMap = {
        ads: {
            badge: 'HOOKS & ADS',
            headline: 'HOOKS, EMAILS, ADS & FUNNELS',
            caption: 'Structured prompts for real marketing deliverables'
        },
        funnels: {
            badge: 'EMAILS & FUNNELS',
            headline: 'FULL FUNNEL & EMAIL COPY',
            caption: 'Sequences, angles, and conversion steps connected'
        },
        value: {
            badge: '$17 ONE-TIME',
            headline: '$17 FULL ACCESS • 5 TRACKS',
            caption: 'No recurring subscription • 7-day money-back guarantee'
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

    // 8. FAQ Accordion
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

    // 9. Legal Modals (Terms of Use & Privacy Policy)
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
