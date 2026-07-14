const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null };
let lastScrollY = window.scrollY;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

window.addEventListener('resize', resizeCanvas);

// Track mouse relative to the window
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    let currentScrollY = window.scrollY;
    let delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Shift particles up or down based on scroll
    for (let i = 0; i < particles.length; i++) {
        // Different layers move at different speeds for 3D depth
        let parallaxFactor = particles[i].size * 0.15; 
        particles[i].y -= delta * parallaxFactor;
        
        // Wrap around if they go way out of bounds vertically
        if (particles[i].y < -50) particles[i].y = canvas.height + 50;
        if (particles[i].y > canvas.height + 50) particles[i].y = -50;
    }
});


class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1.5;
        this.speedX = (Math.random() - 0.5) * 1.0;
        this.speedY = (Math.random() - 0.5) * 1.0;
        // Mostly accent yellow, sometimes subtle gray/white
        this.color = Math.random() > 0.7 ? '#f5d908' : '#888888';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges horizontally
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        
        // Vertical wrap or bounce
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

        // Mouse interaction (repel)
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            let interactionRadius = 200;
            if (distance < interactionRadius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (interactionRadius - distance) / interactionRadius;
                
                this.x -= forceDirectionX * force * 3;
                this.y -= forceDirectionY * force * 3;
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const numParticles = Math.floor((canvas.width * canvas.height) / 5000); 
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    // Clear the canvas completely for sharp particles, background is provided by the page
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw connections
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 160) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(180, 180, 180, ${0.35 * (1 - distance / 160)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

// Ensure layout is ready before initializing
setTimeout(() => {
    resizeCanvas();
    animate();
}, 200);
