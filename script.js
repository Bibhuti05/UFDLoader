// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Terminal typing animation
const terminalCommand = document.querySelector('.terminal-prompt .command');
const originalText = terminalCommand.textContent;
let charIndex = 0;

function typeCommand() {
    if (charIndex < originalText.length) {
        terminalCommand.textContent = originalText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeCommand, 50);
    } else {
        // Add cursor blink effect
        terminalCommand.style.borderRight = '2px solid #00ff41';
        setTimeout(() => {
            terminalCommand.style.borderRight = 'none';
            setTimeout(() => {
                terminalCommand.style.borderRight = '2px solid #00ff41';
            }, 500);
        }, 500);
    }
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(typeCommand, 1000);
});

// Progress bar animation
const progressFill = document.querySelector('.progress-fill');
let progress = 0;

function animateProgress() {
    if (progress < 75) {
        progress += Math.random() * 2;
        if (progress > 75) progress = 75;
        progressFill.style.width = progress + '%';
        
        // Update download info
        const speed = (8.5 + Math.random() * 2).toFixed(1);
        const downloadInfo = document.querySelector('.download-info span:first-child');
        downloadInfo.textContent = `Speed: ${speed} MB/s`;
        
        setTimeout(animateProgress, 200);
    }
}

// Start progress animation when terminal window is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgress();
            observer.unobserve(entry.target);
        }
    });
});

const terminalWindow = document.querySelector('.terminal-window');
if (terminalWindow) {
    observer.observe(terminalWindow);
}

// Download button functionality
const downloadButtons = document.querySelectorAll('.download-btn');

downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
        const platform = this.dataset.platform;
        let downloadUrl = '';
        let fileName = '';

        // Map platform to download URLs (local files for now)
        switch(platform) {
            case 'linux':
                downloadUrl = './downloads/ufdloader-linux';
                fileName = 'ufdloader-linux';
                break;
            case 'mac-intel':
                downloadUrl = './downloads/ufdloader-mac';
                fileName = 'ufdloader-mac';
                break;
            case 'mac-arm':
                downloadUrl = './downloads/ufdloader-mac';
                fileName = 'ufdloader-mac-arm64';
                break;
            case 'windows':
                downloadUrl = './downloads/ufdloader-windows.exe';
                fileName = 'ufdloader-windows.exe';
                break;
        }

        // Show loading state
        const originalContent = this.innerHTML;
        this.innerHTML = '<div class="loading"></div> Downloading...';
        this.disabled = true;

        // Simulate download (in real implementation, this would trigger actual download)
        setTimeout(() => {
            // Create download link
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Reset button
            this.innerHTML = originalContent;
            this.disabled = false;

            // Show success message
            showNotification(`Download started for ${fileName}!`);
        }, 1500);
    });
});

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(45deg, #00ff41, #00cc33);
                color: #000;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
                z-index: 10000;
                animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
                box-shadow: 0 10px 30px rgba(0, 255, 65, 0.3);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Scroll animations for sections
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .workflow-step, .screenshot-card, .download-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.feature-card, .workflow-step, .screenshot-card, .download-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('resize', animateOnScroll);

// Initial check for elements already in view
animateOnScroll();

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual) {
        const rate = scrolled * -0.5;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effect to cards
const cards = document.querySelectorAll('.feature-card, .screenshot-card, .download-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Terminal cursor blink effect
function addCursorBlink() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        .terminal-cursor {
            animation: blink 1s infinite;
        }
    `;
    document.head.appendChild(style);
}

addCursorBlink();

// Performance optimization - debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handlers
const debouncedScrollHandler = debounce(() => {
    animateOnScroll();
    
    // Parallax effect
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        const rate = scrolled * -0.5;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - close mobile menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        } else {
            // Swipe right - open mobile menu
            navMenu.classList.add('active');
            hamburger.classList.add('active');
        }
    }
}

// Add loading states for better UX
window.addEventListener('load', () => {
    // Hide loading spinner if present
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Add loaded class to body for animations
    document.body.classList.add('loaded');
});

// Console welcome message
console.log('%c🚀 UFDLoader - Ultra Fast Downloader', 'color: #00ff41; font-size: 20px; font-weight: bold;');
console.log('%cExperience terminal-based download acceleration!', 'color: #00ff41; font-size: 14px;');