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
