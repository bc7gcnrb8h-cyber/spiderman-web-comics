// Toggle story details
function toggleStory() {
    const storyText = document.querySelector('.hero-panel p');
    const btn = document.querySelector('.btn-primary');
    
    if (storyText.style.display === 'none') {
        storyText.style.display = 'block';
        btn.textContent = 'Read Less';
    } else {
        storyText.style.display = 'none';
        btn.textContent = 'Read More';
    }
}

// Handle newsletter subscription
function handleSubscribe(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Show success message
    const form = event.target;
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = '✓ Subscribed!';
    btn.style.backgroundColor = '#00aa00';
    
    // Reset after 2 seconds
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        form.reset();
    }, 2000);
    
    console.log('Subscribed with email:', email);
}

// Add smooth scrolling for navigation links
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

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all comic cards and characters
document.querySelectorAll('.comic-card, .character-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add CSS animation for slide in
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Add click effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Dynamically add interactivity to comic issues
document.querySelectorAll('.comic-issue').forEach((issue, index) => {
    issue.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(2deg)';
    });
    
    issue.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
    
    // Add click event to "Read Issue" button
    const readBtn = this.querySelector('.btn-secondary');
    if (readBtn) {
        readBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`Issue #${247 - index}: Coming Soon! This interactive comic will be available soon.`);
        });
    }
});

// Add hover effects to character cards
document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.filter = 'brightness(1.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.filter = 'brightness(1)';
    });
});

// Log page load
console.log('🕷️ Welcome to the Spider-Man Comics Page! 🕷️');
console.log('Your Friendly Neighborhood Comic Book Website is ready!');
