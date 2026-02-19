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
        // Try to fetch club data from Strava
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const stravaUrl = 'https://www.strava.com/clubs/platorunclub';
        
        const response = await fetch(proxyUrl + stravaUrl, { timeout: 5000 });
        const html = await response.text();

        // Parse the HTML to find events
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Look for event dates in the page
        const nextRunDate = extractNextRunDate(doc);
        
        if (nextRunDate) {
            startCountdown(nextRunDate, countdownElement);
            return;
        }
    } catch (error) {
        console.log('Strava fetch error:', error);
    }

    // Fallback: Use default run schedule (Tuesday & Thursday at 6:30 AM, Wednesday at 5:30 PM)
    const nextRun = getNextScheduledRun();
    if (nextRun) {
        startCountdown(nextRun, countdownElement);
    } else {
        countdownElement.innerHTML = '<strong>Next run coming soon →</strong>';
    }
}

function getNextScheduledRun() {
    // Default schedule: Tuesdays & Thursdays at 6:30 AM, Wednesdays at 5:30 PM
    const now = new Date();
    
    // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
    const scheduledDays = {
        0: { hour: 9, minute: 00 },    // Sunday (6:30 AM)
        3: { hour: 17, minute: 30 },   // Wednesday (5:30 PM)
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

