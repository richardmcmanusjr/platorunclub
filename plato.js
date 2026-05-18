// Plato Run Club - Interactive Elements

// Loading Screen Management
//
// Stays up only while the browser is still fetching the page's resources
// (stylesheets, images, fonts). Hides as soon as `window.load` fires, with
// a short minimum so it doesn't flash on a warm cache, and a hard cap so a
// hung resource can't trap the user behind the splash.
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;

    const MIN_DISPLAY_MS = 350;
    const MAX_DISPLAY_MS = 8000;
    const startedAt = performance.now();

    let hidden = false;
    const hide = () => {
        if (hidden) return;
        hidden = true;
        const elapsed = performance.now() - startedAt;
        const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
        setTimeout(() => loadingScreen.classList.add('hidden'), wait);
    };

    if (document.readyState === 'complete') {
        hide();
    } else {
        window.addEventListener('load', hide, { once: true });
    }

    // Safety: never strand the user behind the splash if something hangs.
    setTimeout(hide, MAX_DISPLAY_MS);
}


// Initialize the splash as early as possible — running it inside DOMContentLoaded
// (where the rest of the page setup lives) means the load event has already
// fired in many cached navigations.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingScreen);
} else {
    initLoadingScreen();
}

function waitForStylesheets() {
    return new Promise((resolve) => {
        const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

        if (links.length === 0) {
            resolve();
            return;
        }

        let loadedCount = 0;

        links.forEach(link => {
            if (link.sheet) {
                loadedCount++;
            } else {
                link.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === links.length) resolve();
                });
                link.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount === links.length) resolve();
                });
            }
        });

        if (loadedCount === links.length) {
            resolve();
            return;
        }

        setTimeout(resolve, 3000);
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    await waitForStylesheets();

    const extraMedia = {
        images: [
            'PLATO.png',
            'grit.png',
            'grit2.png',
            'PlatoBlur2.png',
            'gallery/Garmin.png',
            'gallery/Myeongseop.png',
            'gallery/Richard.jpg',
            'gallery/Richard2.png',
            'gallery/Chacko.png',
            'gallery/ChackoandMyeongseop.png',
            'gallery/BerkeleyHalfGroup.png',
            'Oakland.jpeg',
            'gallery/Oakland.jpeg',
            'gallery/PRC_1.png',
            'gallery/PRC2.png',
            'gallery/PRC3.png',
            'gallery/PRC4.png',
            'gallery/PRC_8.png',
            'gallery/PRC11.png',
            'gallery/PRC13.png',
            'gallery/PRC14.png',
            'gallery/PRC15.png',
            'wafer.png',
        ],
        videos: [
        ]
    };

    function collectMediaSources() {
        const imageSources = new Set();
        const videoSources = new Set();

        document.querySelectorAll('img').forEach(img => {
            const src = img.currentSrc || img.getAttribute('src');
            if (src) imageSources.add(src);
        });

        document.querySelectorAll('video').forEach(video => {
            const directSrc = video.currentSrc || video.getAttribute('src');
            if (directSrc) videoSources.add(directSrc);

            video.querySelectorAll('source').forEach(source => {
                const src = source.getAttribute('src');
                if (src) videoSources.add(src);
            });
        });

        extraMedia.images.forEach(src => imageSources.add(src));
        extraMedia.videos.forEach(src => videoSources.add(src));

        return {
            images: Array.from(imageSources),
            videos: Array.from(videoSources)
        };
    }

    function preloadMedia() {
        const { images, videos } = collectMediaSources();

        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        videos.forEach(src => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.muted = true;
            video.playsInline = true;

            const extension = (src.split('?')[0].split('#')[0].split('.').pop() || '').toLowerCase();
            let mimeType = '';
            if (extension === 'mp4') mimeType = 'video/mp4';
            if (extension === 'webm') mimeType = 'video/webm';
            if (extension === 'mov') mimeType = 'video/quicktime';

            if (mimeType) {
                const source = document.createElement('source');
                source.src = src;
                source.type = mimeType;
                video.appendChild(source);
            } else {
                video.src = src;
            }

            video.load();
        });
    }

    preloadMedia();
    initializeNextRunCountdown();
    initMobileMenu();
    initFadeInObserver();
    initEmailForm();
    initSmoothScroll();
    initHeroOpacity();
    initMobileDefinitionScroll();
    initRevealPainting();
    initEventModal();
    initGalleryAnimations();
});



function initMobileMenu() {
    const hamburger = document.getElementById('menuButton');
    const navLinks = document.getElementById('navLinks');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

function isMobileViewport() {
    return window.matchMedia('(max-width: 768px)').matches || window.innerWidth <= 768;
}

function initFadeInObserver() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = isMobileViewport();
    
    // Adjust root margin for mobile to trigger animations earlier
    const rootMargin = isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px';
    const delayMultiplier = isMobile ? 0.05 : 0.1;
    
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger fade-in using CSS transition
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('fade-in-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: rootMargin
    });

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.slide-in-left').forEach((el, index) => {
        el.style.animationDelay = `${index * delayMultiplier}s`;
    });
}

function initEmailForm() {
    const emailForm = document.querySelector('.email-form');
    if (!emailForm) return;

    emailForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;

        if (email && email.includes('@')) {
            const button = this.querySelector('button');
            const originalText = button.textContent;
            button.textContent = 'Thanks! See you on Wednesday 🏃';
            button.disabled = true;

            setTimeout(() => {
                this.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 3000);
        }
    });
}

function initSmoothScroll() {
    const offset = 80;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !document.querySelector(href)) return;

            e.preventDefault();
            const target = document.querySelector(href);

            const scrollToTarget = () => {
                // offsetTop is recomputed AFTER any hero animation has played,
                // in case the hero plays + something reflows beneath it.
                const top = target.offsetTop - offset;
                const isMobile = isMobileViewport();
                const behavior = isMobile && window.devicePixelRatio > 2 ? 'auto' : 'smooth';
                window.scrollTo({ top, behavior });
            };

            const heroEl = document.querySelector('.hero');
            const heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : 0;
            const startsAtTop = window.scrollY < 100;
            const targetBelowHero = target.offsetTop >= heroBottom - 10;
            const targetIsHero = target === heroEl || target.offsetTop <= 100;
            const isHomeLink = href === '#home';

            if (!isMobileViewport() && isHomeLink && typeof window.platoReverseHero === 'function') {
                // Logo / top-of-page link: rewind the reveal and scroll up
                // in parallel so the hero is in its initial state on arrival.
                window.platoReverseHero();
                scrollToTarget();
            } else if (!isMobileViewport() && targetIsHero && typeof window.platoReverseHero === 'function') {
                window.platoReverseHero();
                scrollToTarget();
            } else if (!isMobileViewport() && startsAtTop && targetBelowHero && typeof window.platoPlayHero === 'function') {
                window.platoPlayHero(scrollToTarget);
            } else {
                scrollToTarget();
            }
        });
    });
}

function initHeroOpacity() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function () {
        const scrolled = window.scrollY;
        if (scrolled <= 100) {
            const heroBottom = hero.offsetHeight;
            const progress = Math.min(scrolled / (heroBottom - window.innerHeight), 1);
            hero.style.opacity = 1 - (progress * 0.1);
        }
    });
}

function initMobileDefinitionScroll() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroText = document.querySelector('.hero-text');
    const heroLogo = document.querySelector('.hero-logo');
    
    if (!hero || !heroContent || !heroText || !heroLogo) {
        console.log('Hero elements not found');
        return;
    }

    let isMobileActive = false;
    let heroHeight = hero.offsetHeight;
    let mobileSyncFrame = null;

    const clearMobileTransforms = () => {
        heroContent.style.transform = '';
        heroText.style.opacity = '';
        heroLogo.style.transform = '';
    };

    const updateMobileHero = () => {
        if (!isMobileActive) return;

        const scrolled = window.scrollY;

        // Clamp scrolled to hero height
        const scrollProgress = Math.min(scrolled / heroHeight, 1);
        
        // Move content up as user scrolls
        const moveAmount = scrollProgress * heroHeight;
        heroContent.style.transform = `translateY(-${moveAmount}px)`;
        
        // Fade out definition as user scrolls
        heroText.style.opacity = Math.max(0, 1 - scrollProgress * 1.5);
        
        // Scale up logo as user scrolls
        heroLogo.style.transform = `scale(${1 + scrollProgress * 0.2})`;
    };

    const syncMobileHeroMode = () => {
        mobileSyncFrame = null;
        const shouldBeMobile = isMobileViewport();

        if (shouldBeMobile === isMobileActive) {
            if (isMobileActive) {
                heroHeight = hero.offsetHeight;
                updateMobileHero();
            }
            return;
        }

        isMobileActive = shouldBeMobile;

        if (isMobileActive) {
            heroHeight = hero.offsetHeight;
            updateMobileHero();
        } else {
            clearMobileTransforms();
        }
    };

    const scheduleMobileHeroSync = () => {
        if (mobileSyncFrame !== null) return;

        mobileSyncFrame = requestAnimationFrame(syncMobileHeroMode);
    };

    window.addEventListener('scroll', updateMobileHero, { passive: true });
    window.addEventListener('resize', scheduleMobileHeroSync, { passive: true });
    window.matchMedia('(max-width: 768px)').addEventListener('change', scheduleMobileHeroSync);

    syncMobileHeroMode();
}

document.addEventListener('mousemove', function (e) {
    const shapes = document.querySelectorAll('.geometric-shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    document.querySelectorAll('.geometric-shape').forEach(shape => {
        shape.style.animation = 'none';
    });
}

async function initializeNextRunCountdown() {
    const countdownElement = document.getElementById('countdownText');
    if (!countdownElement) return;

    try {
        const nextRun = getNextScheduledRun();
        if (nextRun) {
            startCountdown(nextRun, countdownElement);
        } else {
            countdownElement.innerHTML = '<strong>Next run coming soon →</strong>';
        }
    } catch (error) {
        console.log('Countdown error:', error);
        countdownElement.innerHTML = '<strong>Next run coming soon →</strong>';
    }
}

function getNextScheduledRun() {
    const now = new Date();

    const scheduledDays = {
        3: { hour: 18, minute: 0 },
        5: { hour: 18, minute: 0 },
    };

    for (let i = 0; i < 8; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() + i);
        const dayOfWeek = checkDate.getDay();

        if (scheduledDays[dayOfWeek]) {
            const nextRun = new Date(checkDate);
            nextRun.setHours(scheduledDays[dayOfWeek].hour, scheduledDays[dayOfWeek].minute, 0, 0);
            if (nextRun > now) return nextRun;
        }
    }

    return null;
}

function startCountdown(targetDate, element) {
    let initialized = false;

    function updateCountdown() {
        const now = new Date();
        const timeRemaining = targetDate - now;

        if (timeRemaining <= 0) {
            const countdownNumbers = element.querySelector('.countdown-numbers');
            if (countdownNumbers) countdownNumbers.textContent = 'NOW';
            return;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        let countdownContent = '';
        if (days > 0) {
            countdownContent = `<span class="countdown-item">${days}<span class="countdown-unit">day${days !== 1 ? 's' : ''}</span></span><span class="countdown-item">${hours}<span class="countdown-unit">hr${hours !== 1 ? 's' : ''}</span></span><span class="countdown-item">${minutes}<span class="countdown-unit">min${minutes !== 1 ? 's' : ''}</span></span><span class="countdown-item">${seconds}<span class="countdown-unit">sec${seconds !== 1 ? 's' : ''}</span></span>`;
        } else if (hours > 0) {
            countdownContent = `<span class="countdown-item">${hours}<span class="countdown-unit">hr${hours !== 1 ? 's' : ''}</span></span><span class="countdown-item">${minutes}<span class="countdown-unit">min${minutes !== 1 ? 's' : ''}</span></span><span class="countdown-item">${seconds}<span class="countdown-unit">sec${seconds !== 1 ? 's' : ''}</span></span>`;
        } else {
            countdownContent = `<span class="countdown-item">${minutes}<span class="countdown-unit">min${minutes !== 1 ? 's' : ''}</span></span><span class="countdown-item">${seconds}<span class="countdown-unit">sec${seconds !== 1 ? 's' : ''}</span></span>`;
        }

        if (!initialized) {
            element.innerHTML = `<a href="https://www.strava.com/clubs/platorunclub" target="_blank"><img class="next-run-label" src="Strava_text.png" alt="Next Run On Strava"><span class="countdown-numbers">${countdownContent}</span></a>`;
            initialized = true;
        } else {
            const countdownNumbers = element.querySelector('.countdown-numbers');
            if (countdownNumbers) countdownNumbers.innerHTML = countdownContent;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

let revealReady = false;

function initRevealPainting() {
    
    const wrapper = document.getElementById('revealWrapper');
    const canvas = document.getElementById('revealCanvas');
    if (!wrapper || !canvas) return;

    const isMobile = () => window.matchMedia('(max-width: 1024px)').matches || window.innerWidth <= 1024;
    
    const ctx = canvas.getContext('2d');
    const revealImg = new Image();
    revealImg.src = 'Oakland.jpeg';
    
    // Ensure the reveal image element stays hidden - only the canvas should show it
    const revealImgElement = document.getElementById('revealImg');
    if (revealImgElement) {
        revealImgElement.style.display = 'none';
        revealImgElement.style.visibility = 'hidden';
        revealImgElement.style.pointerEvents = 'none';
    }

    let w = 0;
    let h = 0;
    let dpr = window.devicePixelRatio || 1;

    let lastX = null;
    let lastY = null;
    let targetX = null;
    let targetY = null;
    let brushPoints = [];
    let isAnimating = false;

    let wheelAccumulator = 0;
    // Total wheel deltaY required to complete the whole hero reveal.
    // ~1800 feels like ~1 fast trackpad flick or a few mouse-wheel clicks.
    const phase123MaxWheel = 1800;
    let centerTranslation = 0;
    let translationCalculated = false;

    // Phase 3 (Z trail) — target & smoothed
    let phase3Progress = 0;
    let smoothedPhase3Progress = 0;
    let phase3Velocity = 0;
    let lastStampedPhase3Progress = -1;
    // Below this we hijack the wheel; at/above this we let the page scroll
    // naturally so the user can keep going into the gallery.
    const phase3ReleaseThreshold = 0.92;

    // Phases 1 & 2 — target & smoothed
    let animationProgress = 0;
    let smoothedAnimationProgress = 0;
    let animationVelocity = 0;

    // Spring tuning — stiffer than before so the painting tracks the wheel
    // instead of lagging behind by half a second.
    const phase3Stiffness = 0.14;
    const phase3Damping = 0.78;
    const maxPhase3Speed = 0.04;

    const phase12Stiffness = 0.9;
    const phase12Damping = 0.4;
    const maxPhase12Speed = 0.04;

    // Mouse hover painting damping
    const damping = 0.15;

    // Z path across the whole frame
    const zPathPoints = [
        { x: 0.00, y: 0.30 },
        { x: 1.00, y: 0.30 },
        { x: 0.00, y: 0.76 },
        { x: 1.00, y: 0.76 }
    ];

    function resizeCanvas() {
        const rect = wrapper.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        dpr = window.devicePixelRatio || 1;

        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function easeInOutSine(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    function smoothstep(edge0, edge1, x) {
        const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
        return t * t * (3 - 2 * t);
    }

    function addCornerSlowdown(t) {
        // Apply corner slowdown based on proximity to corner points
        // This creates smooth deceleration/acceleration without directional bias
        const c1 = 1 / 3;
        const c2 = 2 / 3;
        
        const d1 = Math.abs(t - c1);
        const d2 = Math.abs(t - c2);
        
        const cornerWidth = 0.15;
        const cornerInfluence1 = Math.max(0, 1 - d1 / cornerWidth);
        const cornerInfluence2 = Math.max(0, 1 - d2 / cornerWidth);
        
        // Use smoothstep for smoother falloff
        const influence1 = smoothstep(cornerWidth, 0, d1);
        const influence2 = smoothstep(cornerWidth, 0, d2);
        
        // Apply a scaling factor that slows down movement near corners
        let scale = 1.0;
        scale *= (1 - influence1 * 0.3);
        scale *= (1 - influence2 * 0.3);
        
        return t * scale;
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function getPointOnSegment(p0, p1, t) {
        return {
            x: lerp(p0.x, p1.x, t),
            y: lerp(p0.y, p1.y, t)
        };
    }

    function getPointOnZPath(t) {
        if (t <= 0) return zPathPoints[0];
        if (t >= 1) return zPathPoints[3];

        if (t < 1 / 3) {
            const localT = t / (1 / 3);
            return getPointOnSegment(zPathPoints[0], zPathPoints[1], localT);
        } else if (t < 2 / 3) {
            const localT = (t - 1 / 3) / (1 / 3);
            return getPointOnSegment(zPathPoints[1], zPathPoints[2], localT);
        } else {
            const localT = (t - 2 / 3) / (1 / 3);
            return getPointOnSegment(zPathPoints[2], zPathPoints[3], localT);
        }
    }

    function pushBrushPoint(x, y, r = 120, a = 1) {
        brushPoints.push({ x, y, r, a });
    }

    function addBrushStroke(x, y) {
        targetX = x;
        targetY = y;

        if (lastX === null || lastY === null) {
            lastX = x;
            lastY = y;
            pushBrushPoint(x, y, 120, 1);
        }
    }

    function updateBrushPosition() {
        if (targetX === null || targetY === null || lastX === null || lastY === null) return;

        lastX += (targetX - lastX) * damping;
        lastY += (targetY - lastY) * damping;

        const dx = targetX - lastX;
        const dy = targetY - lastY;
        const dist = Math.hypot(dx, dy);

        if (dist < 1) return;

        pushBrushPoint(lastX, lastY, 120 + Math.random() * 20, 1);
    }

    function stampZTrail(fromProgress, toProgress) {
        const start = Math.max(0, Math.min(fromProgress, toProgress));
        const end = Math.min(1, Math.max(fromProgress, toProgress));

        const segments = Math.max(1, Math.ceil((end - start) / 0.01));

        for (let s = 0; s <= segments; s++) {
            const t = start + (end - start) * (s / segments);
            const p = getPointOnZPath(t);

            pushBrushPoint(p.x * w, p.y * h, 110, 0.95);
            pushBrushPoint(p.x * w, p.y * h, 92, 0.65);
            pushBrushPoint(p.x * w, p.y * h, 74, 0.38);
        }

        const head = getPointOnZPath(toProgress);
        targetX = head.x * w;
        targetY = head.y * h;
    }

    function getImageDrawRect() {
        const imgAspect = revealImg.naturalWidth / revealImg.naturalHeight;
        const canvasAspect = w / h;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
            drawHeight = h;
            drawWidth = h * imgAspect;
            offsetX = -(drawWidth - w) / 2;
            offsetY = 0;
        } else {
            drawWidth = w;
            drawHeight = w / imgAspect;
            offsetX = 0;
            offsetY = -(drawHeight - h) / 2;
        }

        return { drawWidth, drawHeight, offsetX, offsetY };
    }

    // Single source of truth for hero element transforms.
    // Runs every frame so the logo can never end up in an undefined state
    // between phase boundaries (the cause of the "disappearing logo" bug).
    function applyHeroTransforms() {
        if (isMobile()) return;
        
        const heroContent = document.querySelector('.hero-content');
        const heroText = document.querySelector('.hero-text');
        const heroLogo = document.querySelector('.hero-logo');
        if (!heroContent || !heroLogo || !heroText) return;

        // Always keep the logo present — it is the visual anchor of the hero.
        heroLogo.style.visibility = 'visible';
        heroLogo.style.opacity = '1';

        const a = smoothedAnimationProgress;
        const p3 = smoothedPhase3Progress;

        // Phase 1 (0 → 0.25): hero-content slides to center the logo
        const phase1 = Math.min(1, a / 0.25);

        // Phase 2 (0.25 → 0.5): logo scales up, text slides out and fades
        const phase2 = Math.max(0, Math.min(1, (a - 0.25) / 0.25));

        // Scale grows in phase 2, then keeps growing slightly through phase 3.
        const scale = 1 + phase2 * 0.2 + p3 * 0.15;
    

        heroContent.style.transform = `translateX(${phase1 * centerTranslation}%)`;
        heroLogo.style.transform = `scale(${scale})`;
        heroText.style.transform = `translateX(${-phase2 * 60}vw)`;
        heroText.style.opacity = `${Math.max(0, 1 - phase2 * 1.5)}`;
    }

    function drawFrame() {
        ctx.clearRect(0, 0, w, h);

        updateBrushPosition();

        brushPoints = brushPoints
            .map(p => ({ ...p, a: p.a - 0.008 }))
            .filter(p => p.a > 0);

        // Spring-smoothed animation progress (phases 1 & 2)
        const force12 = (animationProgress - smoothedAnimationProgress) * phase12Stiffness;
        animationVelocity = (animationVelocity + force12) * phase12Damping;
        animationVelocity = Math.max(-maxPhase12Speed, Math.min(maxPhase12Speed, animationVelocity));

        smoothedAnimationProgress += animationVelocity;
        smoothedAnimationProgress = Math.max(0, Math.min(1, smoothedAnimationProgress));

        if (
            Math.abs(animationVelocity) < 0.0005 &&
            Math.abs(animationProgress - smoothedAnimationProgress) < 0.0005
        ) {
            animationVelocity = 0;
            smoothedAnimationProgress = animationProgress;
        }

        // Spring-smoothed phase 3 progress
        const force = (phase3Progress - smoothedPhase3Progress) * phase3Stiffness;
        phase3Velocity = (phase3Velocity + force) * phase3Damping;
        phase3Velocity = Math.max(-maxPhase3Speed, Math.min(maxPhase3Speed, phase3Velocity));

        smoothedPhase3Progress += phase3Velocity;
        smoothedPhase3Progress = Math.max(0, Math.min(1, smoothedPhase3Progress));

        if (
            Math.abs(phase3Velocity) < 0.0005 &&
            Math.abs(phase3Progress - smoothedPhase3Progress) < 0.0005
        ) {
            phase3Velocity = 0;
            smoothedPhase3Progress = phase3Progress;
        }

        if (phase3Progress > 0 || smoothedPhase3Progress > 0) {
            const basePhase3 = easeInOutSine(smoothedPhase3Progress);
            const baseLast = lastStampedPhase3Progress < 0 ? 0 : easeInOutSine(lastStampedPhase3Progress);

            const easedPhase3 = addCornerSlowdown(basePhase3);
            const easedLast = addCornerSlowdown(baseLast);

            if (smoothedPhase3Progress !== lastStampedPhase3Progress || lastStampedPhase3Progress < 0) {
                stampZTrail(easedLast, easedPhase3);
                lastStampedPhase3Progress = smoothedPhase3Progress;
            }
        }

        applyHeroTransforms();

        if (revealImg && revealImg.complete && w > 0 && h > 0) {
            const { drawWidth, drawHeight, offsetX, offsetY } = getImageDrawRect();

            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            ctx.globalCompositeOperation = 'source-over';

            // Build mask only from brush points
            for (const p of brushPoints) {
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                g.addColorStop(0, `rgba(0,0,0,${0.95 * p.a})`);
                g.addColorStop(0.6, `rgba(0,0,0,${0.55 * p.a})`);
                g.addColorStop(1, `rgba(0,0,0,0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-in';
            ctx.drawImage(revealImg, offsetX, offsetY, drawWidth, drawHeight);
            ctx.restore();
        }

        requestAnimationFrame(drawFrame);
    }

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        addBrushStroke(e.clientX - rect.left, e.clientY - rect.top);
    });

    wrapper.addEventListener('mouseenter', (e) => {
        const rect = wrapper.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    });

    wrapper.addEventListener('mouseleave', () => {
        lastX = null;
        lastY = null;
        targetX = null;
        targetY = null;
    });

    window.addEventListener('wheel', (e) => {

        // Skip wheel event handling on mobile - use scroll-based animation instead
        if (isMobile()) return;

        const nearTop = window.scrollY <= 100;
        if (!nearTop) return;

        const scrollingDown = e.deltaY > 0;

        // Once the reveal is essentially done, stop hijacking the wheel.
        // The event falls through to native page scroll so the user can
        // continue straight into the gallery at normal speed.
        if (scrollingDown && phase3Progress >= 1 && smoothedPhase3Progress >= phase3ReleaseThreshold) {
            return;
        }

        e.preventDefault();

        if (scrollingDown) {
            wheelAccumulator = Math.min(phase123MaxWheel, wheelAccumulator + e.deltaY);
        } else {
            wheelAccumulator = Math.max(0, wheelAccumulator + e.deltaY);
        }

        // Set target progress values - the drawFrame() loop will smooth these
        animationProgress = wheelAccumulator / phase123MaxWheel;

        const heroContent = document.querySelector('.hero-content');
        const heroLogo = document.querySelector('.hero-logo');

        if (!heroContent || !heroLogo) return;

        if (!translationCalculated) {
            const heroContentRect = heroContent.getBoundingClientRect();
            const heroLogoRect = heroLogo.getBoundingClientRect();
            const imageCurrentCenter = heroLogoRect.left + heroLogoRect.width / 2;
            const viewportCenter = window.innerWidth / 2;
            const pixelOffset = viewportCenter - imageCurrentCenter;
            centerTranslation = (pixelOffset / heroContentRect.width) * 100;
            translationCalculated = true;
            
        }

        // Update phase 3 progress target — applyHeroTransforms() in the
        // animation loop derives all transforms from this state.
        if (animationProgress < 0.5) {
            phase3Progress = 0;
            // Don't snap smoothedPhase3Progress to 0 — let the spring carry it
            // back so the reverse paint reads as a graceful retreat.
            lastStampedPhase3Progress = -1;
        } else {
            const rawPhase3 = (animationProgress - 0.5) / 0.5;
            const previousPhase3 = phase3Progress;
            phase3Progress = Math.max(0, Math.min(rawPhase3, 1));

            // Seed an initial visible brush point when phase 3 begins
            if (previousPhase3 === 0 && phase3Progress > 0) {
                const p = getPointOnZPath(0);
                pushBrushPoint(p.x * w, p.y * h, 110, 0.95);
                pushBrushPoint(p.x * w, p.y * h, 92, 0.65);
                pushBrushPoint(p.x * w, p.y * h, 74, 0.38);
                targetX = p.x * w;
                targetY = p.y * h;
                lastStampedPhase3Progress = 0;
            }
        }
    }, { passive: false });

    resizeCanvas();

    if (!isAnimating) {
        isAnimating = true;
        drawFrame();
    }

    revealImg.addEventListener('load', () => {
        revealReady = true;
        resizeCanvas();
    });

    if (revealImg.complete && revealImg.naturalWidth > 0) {
        revealReady = true;
        resizeCanvas();
    }

    window.addEventListener('resize', resizeCanvas);

    // How long the click-driven hero reveal takes, in milliseconds.
    // Bump this up to slow the Gallery-click animation down.
    const CLICK_PLAY_DURATION_MS = 1800;

    // Lets a click (e.g. the Gallery nav link) drive the hero reveal at a
    // controlled pace, then run `onComplete` when the reveal finishes.
    // Pass a number as the second arg to override the default duration.
    window.platoPlayHero = function (onComplete, durationMs) {
        const finish = () => { if (typeof onComplete === 'function') onComplete(); };

        if (isMobile()) { finish(); return; }

        const alreadyDone =
            smoothedAnimationProgress >= 0.99 &&
            smoothedPhase3Progress >= phase3ReleaseThreshold;
        if (alreadyDone) { finish(); return; }

        // Compute centerTranslation if the wheel handler hasn't yet.
        if (!translationCalculated) {
            const heroContent = document.querySelector('.hero-content');
            const heroLogo = document.querySelector('.hero-logo');
            if (heroContent && heroLogo) {
                const hcr = heroContent.getBoundingClientRect();
                const hlr = heroLogo.getBoundingClientRect();
                const pixelOffset = window.innerWidth / 2 - (hlr.left + hlr.width / 2);
                centerTranslation = (pixelOffset / hcr.width) * 100;
                translationCalculated = true;
            }
        }

        const total = Math.max(200, durationMs || CLICK_PLAY_DURATION_MS);
        const startProgress = animationProgress;
        const startTime = performance.now();
        let seeded = phase3Progress > 0;

        const step = (now) => {
            const t = Math.min(1, (now - startTime) / total);
            // easeInOutSine for a gentle accelerate/decelerate
            const eased = -(Math.cos(Math.PI * t) - 1) / 2;
            const next = startProgress + (1 - startProgress) * eased;

            wheelAccumulator = next * phase123MaxWheel;
            animationProgress = next;
            phase3Progress = next < 0.5 ? 0 : (next - 0.5) / 0.5;

            // Seed brush the first time phase 3 begins.
            if (!seeded && phase3Progress > 0 && w > 0 && h > 0) {
                const p = getPointOnZPath(0);
                pushBrushPoint(p.x * w, p.y * h, 110, 0.95);
                pushBrushPoint(p.x * w, p.y * h, 92, 0.65);
                pushBrushPoint(p.x * w, p.y * h, 74, 0.38);
                targetX = p.x * w;
                targetY = p.y * h;
                lastStampedPhase3Progress = 0;
                seeded = true;
            }

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                finish();
            }
        };
        requestAnimationFrame(step);
    };

    // Reverse counterpart to platoPlayHero: ramps progress back to 0 so the
    // hero returns to its initial state. Used when the user clicks the logo
    // to return to the top of the page.
    window.platoReverseHero = function (onComplete, durationMs) {
        const finish = () => { if (typeof onComplete === 'function') onComplete(); };

        if (isMobile()) { finish(); return; }

        if (animationProgress < 0.01) { finish(); return; }

        const total = Math.max(200, durationMs || CLICK_PLAY_DURATION_MS);
        const startProgress = animationProgress;
        const startTime = performance.now();

        const step = (now) => {
            const t = Math.min(1, (now - startTime) / total);
            const eased = -(Math.cos(Math.PI * t) - 1) / 2;
            const next = startProgress * (1 - eased);

            wheelAccumulator = next * phase123MaxWheel;
            animationProgress = next;
            phase3Progress = next < 0.5 ? 0 : (next - 0.5) / 0.5;
            if (next < 0.5) {
                lastStampedPhase3Progress = -1;
            }

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                finish();
            }
        };
        requestAnimationFrame(step);
    };
}

function initGalleryAnimations() {
    const items = document.querySelectorAll('.gallery-section .gallery-item');
    if (items.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Cycled per-index drift directions. Works for any number of items —
    // adding more rows just continues the cycle.
    const drifts = [
        { x: -0.15, y:  0.06 },
        { x:  0.18, y: -0.05 },
        { x:  0.00, y:  0.08 },
        { x: -0.12, y: -0.06 },
        { x:  0.16, y:  0.04 },
        { x: -0.08, y:  0.05 },
        { x:  0.10, y: -0.07 },
    ];
    // Anchor the parallax to the section so motion only happens while it's
    // near the viewport. This avoids large drifts on long pages.
    const section = document.getElementById('gallery-section');

    let rafId = null;

    const update = () => {
        rafId = null;

        const rect = section ? section.getBoundingClientRect() : null;
        const vh = window.innerHeight || 1;

        // Progress from the section entering the viewport to leaving it.
        // 0 when section sits one viewport below; 1 when one viewport above.
        let progress = 0;
        if (rect) {
            progress = 1 - (rect.top + rect.height / 2) / vh;
            progress = Math.max(-1, Math.min(1, progress));
        } else {
            progress = window.scrollY / vh;
        }

        // Pixel offset proportional to viewport height so motion scales nicely.
        const strength = isMobileViewport() ? 0.35 : 1.0;
        const base = progress * vh * 0.15 * strength;

        items.forEach((item, index) => {
            const d = drifts[index % drifts.length];
            const px = base * d.x;
            const py = base * d.y;
            item.style.setProperty('--px', `${px.toFixed(2)}px`);
            item.style.setProperty('--py', `${py.toFixed(2)}px`);
        });
    };

    update();

    window.addEventListener('scroll', () => {
        if (rafId === null) rafId = requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener('resize', () => {
        if (rafId === null) rafId = requestAnimationFrame(update);
    }, { passive: true });
}

function initEventModal() {
    const eventCards = document.querySelectorAll('.event-card');
    const eventModal = document.getElementById('eventModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.modal-overlay');
    // joinButton handled via normal anchor smooth-scroll; modal binds only to event cards
    const joinButton = document.getElementById('joinButton');

    if (!eventModal || !modalClose || !modalOverlay) return;

    eventCards.forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            eventModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // The hero "Join The Club" CTA now links to #join and uses the
    // site's smooth-scroll behavior. Keep modal opening bound only to
    // `.event-card` elements above.

    function closeModal() {
        eventModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && eventModal.classList.contains('active')) {
            closeModal();
        }
    });
}