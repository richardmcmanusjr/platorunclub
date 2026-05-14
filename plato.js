// Plato Run Club - Interactive Elements

// Loading Screen Management
let hasScrolledDown = false;
let hasScrolledUp = false;
let maxScrollY = 0;
let lastScrollY = 0;

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;

    // Hide loading screen when all conditions are met
    function checkAndHideLoadingScreen() {
        if (hasScrolledDown && hasScrolledUp) {
            loadingScreen.classList.add('hidden');
        }
    }

    // Track scroll position
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Check if user has scrolled down
        if (currentScrollY > 100 && !hasScrolledDown) {
            hasScrolledDown = true;
            maxScrollY = currentScrollY;
        } else if (currentScrollY > maxScrollY) {
            maxScrollY = currentScrollY;
        }

        // Check if user has scrolled back up after scrolling down
        if (hasScrolledDown && currentScrollY < maxScrollY - 50 && !hasScrolledUp) {
            hasScrolledUp = true;
            checkAndHideLoadingScreen();
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    // Also hide after a maximum time (fallback - 5 seconds)
    const loadingTimeout = setTimeout(() => {
        if (!hasScrolledDown || !hasScrolledUp) {
            hasScrolledDown = true;
            hasScrolledUp = true;
            checkAndHideLoadingScreen();
        }
    }, 5000);
}

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    initLoadingScreen();
});

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
            'PlatoBlur2.png',
            'Garmin.png',
            'Myeongseop.png',
            'Richard.jpg',
            'Richard2.png',
            'RichardNanolab.png',
            'Chacko.png',
            'Bench.png',
            'BerkeleyHalfGroup.png',
            'Oakland.jpeg',
            'wafer.png',
            'pumps.png',
            'grit.png',
            'grit2.png',
        ],
        videos: [
            'RunClub.mov'
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

function initFadeInObserver() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;
    
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
    const isMobile = window.innerWidth <= 768;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const targetPosition = target.offsetTop - offset;

                // Use instant scroll on slow mobile devices, smooth on others
                const behavior = isMobile && window.devicePixelRatio > 2 ? 'auto' : 'smooth';
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: behavior
                });
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
    // More robust mobile detection
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 
                     window.innerWidth <= 768;
    
    console.log('Mobile definition scroll - isMobile:', isMobile, 'viewport:', window.innerWidth);
    
    if (!isMobile) return;

    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroText = document.querySelector('.hero-text');
    const heroLogo = document.querySelector('.hero-logo');
    
    if (!hero || !heroContent || !heroText || !heroLogo) {
        console.log('Hero elements not found');
        return;
    }

    console.log('Initializing mobile scroll animation');
    console.log('Hero height:', hero.offsetHeight);

    const heroHeight = hero.offsetHeight;
    
    window.addEventListener('scroll', function () {
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
        
        console.log('Scroll - scrolled:', Math.round(scrolled), 'scrollProgress:', scrollProgress.toFixed(2));
    }, { passive: true });
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
        3: { hour: 17, minute: 0 },
        5: { hour: 17, minute: 0 },
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

    const isMobile = window.matchMedia('(max-width: 768px)').matches || 
                     window.innerWidth <= 768;
    
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
    const phase123MaxWheel = 3000;
    let centerTranslation = 0;
    let translationCalculated = false;

    // Phase 3 (Z trail)
    let phase3Progress = 0;              // wheel-driven target 0..1
    let smoothedPhase3Progress = 0;      // spring-smoothed 0..1
    let phase3Velocity = 0;
    let lastStampedPhase3Progress = -1;
    let phase3FullyCompleted = false;
    const phase3ReleaseThreshold = 0.88;
    
    // Springy scroll after phase 3
    let targetScrollY = 0;
    let currentScrollY = 0;
    let scrollVelocity = 0;
    let isInSpringScroll = false;
    let lastWheelVelocity = 0;
    
    // Phases 1 & 2 smoothing
    let animationProgress = 0;           // wheel-driven target 0..1
    let smoothedAnimationProgress = 0;   // spring-smoothed 0..1
    let animationVelocity = 0;
    let lastAnimationProgress = 0;       // track last progress for momentum

    // Spring tuning
    const phase3Stiffness = 0.06;
    const phase3Damping = 0.82;
    const maxPhase3Speed = 0.012;
    
    const scrollStiffness = 0.08;
    const scrollDamping = 0.85;
    
    const phase12Stiffness = 0.9;
    const phase12Damping = 0.2;
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

    function updateDOMForPhase3() {
        const heroLogo = document.querySelector('.hero-logo');
        if (!heroLogo) return;

        // Always maintain visibility during phase 3
        // Ensure it's not hidden by any CSS
        heroLogo.style.visibility = 'visible';
        heroLogo.style.opacity = '1';
        heroLogo.style.display = 'block';

        // Update scale during phase 3
        if (phase3Progress > 0 || smoothedPhase3Progress > 0) {
            heroLogo.style.transform = `scale(${1.2 + smoothedPhase3Progress * 0.15})`;
        } else if (smoothedAnimationProgress > 0.5) {
            // During transition from phase 2 to 3, keep scale from phase 2
            // to prevent flickering or disappearance
            const phase2Progress = Math.max(0, (smoothedAnimationProgress - 0.25) / 0.25);
            heroLogo.style.transform = `scale(${1 + phase2Progress * 0.2})`;
        }
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
            Math.abs(animationVelocity) < 0.00001 &&
            Math.abs(animationProgress - smoothedAnimationProgress) < 0.00001
        ) {
            animationVelocity = 0;
            smoothedAnimationProgress = animationProgress;
        }

        // Add momentum carryover - let animation coast slightly when wheel stops
        if (animationProgress === lastAnimationProgress && Math.abs(animationVelocity) > 0.0001) {
            // Wheel input stopped, but we have momentum - let it coast
            const momentumDeceleration = 0.92;
            animationVelocity *= momentumDeceleration;
            smoothedAnimationProgress += animationVelocity;
            smoothedAnimationProgress = Math.max(0, Math.min(1, smoothedAnimationProgress));
        }
        lastAnimationProgress = animationProgress;

        // Update DOM for phases 1 & 2 with smoothed progress
        // Skip on mobile - mobile uses scroll-based vertical animation instead
        if (smoothedAnimationProgress < 1 && !isMobile) {
            const heroContent = document.querySelector('.hero-content');
            const heroText = document.querySelector('.hero-text');
            const heroLogo = document.querySelector('.hero-logo');

            if (heroContent && heroText && heroLogo) {
                if (smoothedAnimationProgress < 0.25) {
                    const moveAmount = smoothedAnimationProgress / 0.25;
                    heroContent.style.transform = `translateX(${moveAmount * centerTranslation}%)`;
                    heroLogo.style.transform = 'scale(1)';
                    heroText.style.opacity = '1';
                    heroText.style.transform = 'translateX(0)';
                } else if (smoothedAnimationProgress < 0.5) {
                    const phase2Progress = (smoothedAnimationProgress - 0.25) / 0.25;
                    heroContent.style.transform = `translateX(${centerTranslation}%)`;
                    heroLogo.style.transform = `scale(${1 + phase2Progress * 0.2})`;
                    heroText.style.transform = `translateX(${-phase2Progress * 60}vw)`;
                    heroText.style.opacity = `${Math.max(0, 1 - phase2Progress * 1.5)}`;
                }
            }
        }

        // Spring-smoothed phase 3 progress
        const force = (phase3Progress - smoothedPhase3Progress) * phase3Stiffness;
        phase3Velocity = (phase3Velocity + force) * phase3Damping;
        phase3Velocity = Math.max(-maxPhase3Speed, Math.min(maxPhase3Speed, phase3Velocity));

        smoothedPhase3Progress += phase3Velocity;
        smoothedPhase3Progress = Math.max(0, Math.min(1, smoothedPhase3Progress));

        if (
            Math.abs(phase3Velocity) < 0.00001 &&
            Math.abs(phase3Progress - smoothedPhase3Progress) < 0.00001
        ) {
            phase3Velocity = 0;
            smoothedPhase3Progress = phase3Progress;
        }

        // Only mark phase 3 complete when the actual spring-smoothed motion is done
        phase3FullyCompleted = smoothedPhase3Progress >= 0.999 && Math.abs(phase3Velocity) < 0.001;

        // Handle springy scroll after phase 3 release threshold
        if (smoothedPhase3Progress >= phase3ReleaseThreshold && !isInSpringScroll && lastWheelVelocity !== 0) {
            isInSpringScroll = true;
            currentScrollY = window.scrollY;
            scrollVelocity = lastWheelVelocity * 10;
            // Stop all animation progress to prevent jitter
            animationProgress = 1;
            wheelAccumulator = phase123MaxWheel;
            phase3Progress = 1;
        }
        
        if (isInSpringScroll) {
            // Apply damping to create spring-like momentum decay
            scrollVelocity *= scrollDamping;
            currentScrollY += scrollVelocity;
            window.scrollTo(0, currentScrollY);
            
            // Stop spring scroll when velocity settles
            if (Math.abs(scrollVelocity) < 0.1) {
                isInSpringScroll = false;
                scrollVelocity = 0;
                lastWheelVelocity = 0;
            }
        }

        let phase3FrameStamped = false;
        if (phase3Progress > 0 || smoothedPhase3Progress > 0) {
            const basePhase3 = easeInOutSine(smoothedPhase3Progress);
            const baseLast = lastStampedPhase3Progress < 0 ? 0 : easeInOutSine(lastStampedPhase3Progress);

            const easedPhase3 = addCornerSlowdown(basePhase3);
            const easedLast = addCornerSlowdown(baseLast);

            if (smoothedPhase3Progress !== lastStampedPhase3Progress || lastStampedPhase3Progress < 0) {
                // Fill in newly traveled distance (both forward and reverse)
                stampZTrail(easedLast, easedPhase3);
                lastStampedPhase3Progress = smoothedPhase3Progress;
            }

            updateDOMForPhase3();
        } else if (smoothedAnimationProgress >= 0.5) {
            // Keep logo visible during entire transition phase 2->3 and back
            // This ensures smooth visibility throughout all animation states
            updateDOMForPhase3();
        }

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
        if (!revealReady) {
            e.preventDefault();
            return;
        }
        // Skip wheel event handling on mobile - use scroll-based animation instead
        if (isMobile) return;

        const nearTop = window.scrollY <= 100;
        if (!nearTop) return;

        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;

        // Let springy scroll take over once phase 3 is nearly finished
        const allowPageScroll =
            scrollingDown &&
            smoothedPhase3Progress >= phase3ReleaseThreshold;

        if (allowPageScroll) {
            return;
        }

        e.preventDefault();

        if (scrollingDown) {
            if (wheelAccumulator < phase123MaxWheel) {
                wheelAccumulator = Math.min(phase123MaxWheel, wheelAccumulator + e.deltaY);
                lastWheelVelocity = e.deltaY * 0.3;
            }
        } else if (scrollingUp) {
            if (wheelAccumulator > 0) {
                wheelAccumulator = Math.max(0, wheelAccumulator + e.deltaY);
                lastWheelVelocity = e.deltaY * 0.3;
            }
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

        // Handle phase 3 progress and remaining DOM updates
        if (animationProgress < 0.5) {
            phase3Progress = 0;
            smoothedPhase3Progress = 0;
            phase3Velocity = 0;
            lastStampedPhase3Progress = -1;
            phase3FullyCompleted = false;
        } else if (animationProgress < 1) {
            const rawPhase3 = (animationProgress - 0.5) / (1 - 0.5);
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

            heroContent.style.transform = `translateX(${centerTranslation}%)`;
            const heroText = document.querySelector('.hero-text');
            if (heroText) {
                heroText.style.transform = 'translateX(-60vw)';
                heroText.style.opacity = '0';
            }
        } else {
            phase3Progress = 1;

            heroContent.style.transform = `translateX(${centerTranslation}%)`;
            const heroText = document.querySelector('.hero-text');
            if (heroText) {
                heroText.style.transform = 'translateX(-60vw)';
                heroText.style.opacity = '0';
            }
        }
    }, { passive: false });

    revealImg.addEventListener('load', () => {
        revealReady = true;
        resizeCanvas();
        if (!isAnimating) {
            isAnimating = true;
            drawFrame();
        }
    });

    if (revealImg.complete) {
        revealReady = true;
        resizeCanvas();
        if (!isAnimating) {
            isAnimating = true;
            drawFrame();
        }
    }

    window.addEventListener('resize', resizeCanvas);
}

function initGalleryAnimations() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (galleryImages.length === 0) return;

    // Responsive multipliers based on viewport width
    const isMobile = window.innerWidth <= 768;
    const multiplier = isMobile ? 0.5 : 1.5;
    
    // Stop parallax effect after scrolling to this point
    const maxScrollForParallax = 1200;

    // Scroll animation multipliers for parallax effect (speed and direction)
    const getScrollMultiplier = (index) => {
        const multipliers = [
            { x: -0.2 * multiplier, y: 0.08 * multiplier },    // Image 1 - left & down
            { x: 0.25 * multiplier, y: -0.06 * multiplier },   // Image 2 - right & up
            { x: 0, y: 0.1 * multiplier },                      // Image 3 - down
            { x: -0.15 * multiplier, y: -0.08 * multiplier },  // Image 4 - left & up
            { x: 0.2 * multiplier, y: 0.06 * multiplier }      // Image 5 - right & down
        ];
        return multipliers[index % multipliers.length];
    };

    // Scroll-based continuous animation - images slide around as you scroll
    let scrollAnimationFrameId = null;

    const updateParallax = () => {
        const scrollY = window.scrollY;
        
        // Stop parallax animation after a certain scroll point
        if (scrollY > maxScrollForParallax) {
            scrollAnimationFrameId = null;
            return;
        }

        galleryImages.forEach((img, index) => {
            const multiplier = getScrollMultiplier(index);
            
            // Calculate movement based on scroll position using transform3d
            const moveX = scrollY * multiplier.x;
            const moveY = scrollY * multiplier.y;

            // Use transform: translate3d for better performance
            img.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });

        scrollAnimationFrameId = null;
    };

    // Initial parallax update on load so images don't snap when first scrolling
    updateParallax();

    // Throttle scroll events with RAF
    window.addEventListener('scroll', () => {
        if (scrollAnimationFrameId === null) {
            scrollAnimationFrameId = requestAnimationFrame(updateParallax);
        }
    }, { passive: true });
}

function initEventModal() {
    const eventCards = document.querySelectorAll('.event-card');
    const eventModal = document.getElementById('eventModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.modal-overlay');
    const joinButton = document.getElementById('joinButton');

    if (!eventModal || !modalClose || !modalOverlay) return;

    eventCards.forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            eventModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (joinButton) {
        joinButton.addEventListener('click', function (e) {
            e.preventDefault();
            eventModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

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