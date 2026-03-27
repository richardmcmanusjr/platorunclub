// Plato Run Club - Interactive Elements

document.addEventListener('DOMContentLoaded', function() {
    // Media preloader (images + videos) - background only
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
            if (src) {
                imageSources.add(src);
            }
        });

        document.querySelectorAll('video').forEach(video => {
            const directSrc = video.currentSrc || video.getAttribute('src');
            if (directSrc) {
                videoSources.add(directSrc);
            }
            video.querySelectorAll('source').forEach(source => {
                const src = source.getAttribute('src');
                if (src) {
                    videoSources.add(src);
                }
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

    // Handle Instagram embed animations
    function animateInstagramPosts() {
        const blockquotes = document.querySelectorAll('.instagram-feed-grid blockquote');
        blockquotes.forEach((blockquote) => {
            blockquote.classList.add('loaded');
        });
    }
    
    // Wait for Instagram embed script to process
    if (window.instgrm) {
        window.instgrm.Embeds.process().then(() => {
            animateInstagramPosts();
        }).catch(() => {
            // Fallback if promise fails
            setTimeout(animateInstagramPosts, 500);
        });
    }
    
    // Also try after a short delay in case Instagram script hasn't loaded yet
    setTimeout(() => {
        if (window.instgrm) {
            window.instgrm.Embeds.process().then(() => {
                animateInstagramPosts();
            }).catch(() => {
                animateInstagramPosts();
            });
        } else {
            animateInstagramPosts();
        }
    }, 100);
    
    // Fallback: trigger animation after a reasonable delay
    setTimeout(animateInstagramPosts, 1000);

    // Initialize Next Run Countdown from Strava
    initializeNextRunCountdown();

    // Mobile menu toggle
    const hamburger = document.getElementById('menuButton');
    const navLinks = document.getElementById('navLinks');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                // Optionally stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });

    // Form submission handler
    const emailForm = document.querySelector('.email-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simple validation
            if (email && email.includes('@')) {
                // Simulate submission
                const button = this.querySelector('button');
                const originalText = button.textContent;
                button.textContent = 'Thanks! See you on Wednesday 🏃';
                button.disabled = true;
                
                // Reset after 3 seconds
                setTimeout(() => {
                    this.reset();
                    button.textContent = originalText;
                    button.disabled = false;
                }, 3000);
            }
        });
    }

    // Smooth scroll offset for fixed navbar
    const offset = 80; // Height of navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Stagger animation delays
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    const slideInElements = document.querySelectorAll('.slide-in-left');
    slideInElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    // Optional: Add scroll progress indicator on hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const heroBottom = hero.offsetHeight;
            const scrolled = window.scrollY;
            const progress = Math.min(scrolled / (heroBottom - window.innerHeight), 1);
            
            // You can use this for visual effects if desired
            hero.style.opacity = 1 - (progress * 0.1);
        });
    }
});

// Parallax effect for geometric shapes (optional advanced effect)
document.addEventListener('mousemove', function(e) {
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

// Performance: Reduce parallax on low-end devices
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    document.querySelectorAll('.geometric-shape').forEach(shape => {
        shape.style.animation = 'none';
    });
}

// Strava Next Run Countdown
async function initializeNextRunCountdown() {
    const countdownElement = document.getElementById('countdownText');
    if (!countdownElement) return;

    try {
        // Fallback: Use default run schedule (Tuesday & Thursday at 6:30 AM, Wednesday at 5:30 PM)
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
    // Default schedule: Tuesdays & Thursdays at 6:30 AM, Wednesdays at 5:30 PM
    const now = new Date();
    
    // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
    const scheduledDays = {
        3: { hour: 17, minute: 00 },   // Wednesday (5:30 PM)
        5: { hour: 17, minute: 00 },    // Friday (5:30 PM)
    };

    // Check the next 8 days for a scheduled run
    for (let i = 0; i < 8; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() + i);
        const dayOfWeek = checkDate.getDay();
        
        if (scheduledDays[dayOfWeek]) {
            const nextRun = new Date(checkDate);
            nextRun.setHours(scheduledDays[dayOfWeek].hour, scheduledDays[dayOfWeek].minute, 0, 0);
            
            // Only return if it's in the future
            if (nextRun > now) {
                return nextRun;
            }
        }
    }

    return null;
}

function extractNextRunDate(doc) {
    // Try to find event information in common Strava page elements
    // This is a simplified extraction - may need adjustment based on actual Strava HTML structure
    
    const eventElements = doc.querySelectorAll('[data-test-id="event"], .event, [class*="event"]');
    
    for (let el of eventElements) {
        const text = el.textContent;
        const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (dateMatch) {
            const [, date, hour, minute, ampm] = dateMatch;
            try {
                let date24Hour = parseInt(hour);
                if (ampm && ampm.toUpperCase() === 'PM' && date24Hour !== 12) {
                    date24Hour += 12;
                } else if (ampm && ampm.toUpperCase() === 'AM' && date24Hour === 12) {
                    date24Hour = 0;
                }
                const eventDate = new Date(date);
                eventDate.setHours(date24Hour, parseInt(minute), 0, 0);
                if (eventDate > new Date()) {
                    return eventDate;
                }
            } catch (e) {
                console.error('Date parse error:', e);
            }
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
            if (countdownNumbers) {
                countdownNumbers.textContent = 'NOW';
            }
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
            if (countdownNumbers) {
                countdownNumbers.innerHTML = countdownContent;
            }
        }
    }

    // Update immediately
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

// Reveal painting effect
function initRevealPainting() {
    const wrapper = document.getElementById('revealWrapper');
    const canvas = document.getElementById('revealCanvas');
    const ctx = canvas.getContext('2d');

    const revealImg = new Image();
    revealImg.src = 'Oakland.jpeg';

    let w = 0;
    let h = 0;
    let dpr = window.devicePixelRatio || 1;

    let lastX = null;
    let lastY = null;
    let targetX = null;
    let targetY = null;
    let brushPoints = [];
    let isAnimating = false;
    const damping = 0.15; // Lower value = more damping/delay

    function resizeCanvas() {
        const rect = wrapper.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        dpr = window.devicePixelRatio || 1;

        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function addBrushStroke(x, y) {
        targetX = x;
        targetY = y;
        
        if (lastX === null || lastY === null) {
            lastX = x;
            lastY = y;
            return;
        }
    }

    function updateBrushPosition() {
        if (targetX === null || targetY === null || lastX === null || lastY === null) {
            return;
        }

        // Apply damping to smoothly move towards target
        lastX += (targetX - lastX) * damping;
        lastY += (targetY - lastY) * damping;

        // Only add stroke if we've moved enough
        const dx = lastX - (lastX - (targetX - lastX) / damping);
        const dy = lastY - (lastY - (targetY - lastY) / damping);
        const dist = Math.hypot(dx, dy);
        
        if (dist < 1) return;

        brushPoints.push({
            x: lastX,
            y: lastY,
            r: 120 + Math.random() * 20,
            a: 1
        });
    }

    function drawFrame() {
        ctx.clearRect(0, 0, w, h);

        // Update brush position with damping
        updateBrushPosition();

        brushPoints = brushPoints
            .map(p => ({ ...p, a: p.a - 0.015 }))
            .filter(p => p.a > 0);

        if (revealImg.complete && w > 0 && h > 0) {
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

            ctx.save();
            
            // Draw the image only in areas where we've painted
            for (const p of brushPoints) {
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                g.addColorStop(0, `rgba(0,0,0,${0.95 * p.a})`);
                g.addColorStop(0.6, `rgba(0,0,0,${0.55 * p.a})`);
                g.addColorStop(1, `rgba(0,0,0,0)`);
                ctx.globalAlpha = 1;
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
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addBrushStroke(x, y);
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

    window.addEventListener('resize', resizeCanvas);

    revealImg.addEventListener('load', () => {
        resizeCanvas();
        if (!isAnimating) {
            isAnimating = true;
            drawFrame();
        }
    });

    // Ensure animation starts even if image is cached
    if (revealImg.complete) {
        resizeCanvas();
        isAnimating = true;
        drawFrame();
    }
}

// Initialize reveal painting when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRevealPainting);
} else {
    initRevealPainting();
}
