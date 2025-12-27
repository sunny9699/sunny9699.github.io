// Enhanced Harry Potter Magical Portfolio with Theme Switcher
// Lumos (Light) & Nox (Dark) Theme Toggle

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // MAGICAL THEME SWITCHER (LUMOS/NOX)
    // =============================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeText = themeToggle.querySelector('.theme-text');
    const root = document.documentElement;
    
    // Check for saved theme preference or default to 'nox' (dark)
    const currentTheme = localStorage.getItem('theme') || 'nox';
    if (currentTheme === 'lumos') {
        root.classList.add('lumos');
        updateThemeButton('lumos');
    }
    
    themeToggle.addEventListener('click', function() {
        // Create magical sparkle effect
        createThemeSparkles(this);
        
        // Toggle theme
        if (root.classList.contains('lumos')) {
            // Switch to Nox (dark)
            root.classList.remove('lumos');
            localStorage.setItem('theme', 'nox');
            updateThemeButton('nox');
        } else {
            // Switch to Lumos (light)
            root.classList.add('lumos');
            localStorage.setItem('theme', 'lumos');
            updateThemeButton('lumos');
        }
    });
    
    function updateThemeButton(theme) {
        if (theme === 'lumos') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Lumos';
            themeToggle.title = 'Cast Nox (Dark Mode)';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Nox';
            themeToggle.title = 'Cast Lumos (Light Mode)';
        }
    }
    
    function createThemeSparkles(button) {
        const rect = button.getBoundingClientRect();
        const sparkles = ['✨', '⚡', '✦', '🌟'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.position = 'fixed';
                sparkle.style.left = (rect.left + rect.width / 2) + 'px';
                sparkle.style.top = (rect.top + rect.height / 2) + 'px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '99999';
                sparkle.style.fontSize = '24px';
                sparkle.style.animation = 'magicBurst 1s ease-out forwards';
                
                // Random direction
                const angle = (Math.PI * 2 * i) / 8;
                const distance = 50 + Math.random() * 30;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                sparkle.style.setProperty('--tx', tx + 'px');
                sparkle.style.setProperty('--ty', ty + 'px');
                
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 50);
        }
    }
    
    // Add magic burst animation
    if (!document.getElementById('magic-burst-style')) {
        const style = document.createElement('style');
        style.id = 'magic-burst-style';
        style.textContent = `
            @keyframes magicBurst {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(0) rotate(0deg);
                }
                50% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // =============================================
    // OPTIMIZED SMOOTH SCROLL
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const target = document.querySelector(targetId);
            if (!target) return;
            
            const navHeight = 100;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            smoothScrollTo(targetPosition, 1000);
        });
    });
    
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function easeInOutQuart(t) {
            return t < 0.5 
                ? 8 * t * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 4) / 2;
        }
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = easeInOutQuart(progress);
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // =============================================
    // SCROLL REVEAL WITH STAGGER
    // =============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('spell-card') || 
                    entry.target.classList.contains('house-card')) {
                    createMagicSparkle(entry.target);
                }
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const revealElements = document.querySelectorAll(
        '.timeline-item, .spell-card, .wanted-poster, .owl-card, .house-card'
    );
    
    revealElements.forEach((el, index) => {
        if ('IntersectionObserver' in window) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            const container = el.parentElement;
            const siblingsWithClass = Array.from(container.children).filter(child => 
                child.classList.contains(el.classList[0])
            );
            const indexInGroup = siblingsWithClass.indexOf(el);
            el.style.transitionDelay = `${indexInGroup * 0.1}s`;
            
            revealObserver.observe(el);
        } else {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
    
    setTimeout(() => {
        revealElements.forEach(el => {
            if (el.style.opacity === '0') {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }, 2000);
    
    function createMagicSparkle(element) {
        const rect = element.getBoundingClientRect();
        const sparkles = ['✨', '⚡', '✦'];
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.position = 'fixed';
                sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '9999';
                sparkle.style.fontSize = '20px';
                sparkle.style.animation = 'sparkleDisappear 0.8s ease-out forwards';
                
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 800);
            }, i * 100);
        }
    }
    
    if (!document.getElementById('sparkle-style')) {
        const sparkleStyle = document.createElement('style');
        sparkleStyle.id = 'sparkle-style';
        sparkleStyle.textContent = `
            @keyframes sparkleDisappear {
                0% {
                    opacity: 1;
                    transform: scale(0) rotate(0deg);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.5) rotate(180deg);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(sparkleStyle);
    }
    
    // =============================================
    // OPTIMIZED MAGICAL PARTICLES
    // =============================================
    const particlesContainer = document.getElementById('particles');
    let lastParticleTime = 0;
    const particleInterval = 500;
    
    function createMagicalParticle() {
        const now = Date.now();
        if (now - lastParticleTime < particleInterval) return;
        lastParticleTime = now;
        
        const particle = document.createElement('div');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.6), transparent)';
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.opacity = Math.random() * 0.4 + 0.3;
        particle.style.animation = `particleFloat ${Math.random() * 15 + 15}s linear infinite`;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 30000);
    }
    
    setInterval(createMagicalParticle, particleInterval);
    
    if (!document.getElementById('particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 0.6;
                }
                90% {
                    opacity: 0.6;
                }
                100% {
                    transform: translate(${Math.random() * 100 - 50}px, -120vh) scale(0.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // =============================================
    // MOBILE MENU TOGGLE
    // =============================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // =============================================
    // CONSOLE EASTER EGG
    // =============================================
    // console.log('%c⚡ Mischief Managed! ⚡', 'font-size: 24px; color: #d4af37; font-weight: bold; text-shadow: 0 0 10px #d4af37;');
    // console.log('%cWelcome to the Magical Portfolio of Sunny Panchal', 'font-size: 14px; color: #faf6ed;');
    // console.log('%cCast "Lumos" or "Nox" to switch themes!', 'font-size: 12px; color: #d4af37; font-style: italic;');
});
