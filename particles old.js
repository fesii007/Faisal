class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0, moved: false };
        this.canvas = null;
        this.ctx = null;
        
        this.config = {
            particleCount: window.innerWidth < 768 ? 80 : 150,
            maxDistance: 180,
            mouseRadius: 300,
            mouseForce: 0.8,
            colors: [
                '#00FFFF', // Cyber cyan
                '#8B00FF', // Neon purple
                '#32CD32', // Lime green
                '#0080FF', // Electric blue
                '#FFD700', // Cyber gold
                '#FF4444', // Red
                '#FF1493', // Deep pink
                '#00FF41'  // Matrix green
            ],
            particleSize: { min: 1, max: 4 },
            speed: { min: 0.3, max: 1.2 },
            opacity: { min: 0.4, max: 0.9 },
            connectionOpacity: 0.25,
            waveAmplitude: 2,
            waveFrequency: 0.02
        };
        
        this.init();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.updateCanvasSize();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.container.appendChild(this.canvas);
    }
    
    updateCanvasSize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.documentElement.scrollHeight;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = document.documentElement.scrollHeight + 'px';
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * document.documentElement.scrollHeight,
            vx: (Math.random() - 0.5) * (this.config.speed.max - this.config.speed.min) + this.config.speed.min,
            vy: (Math.random() - 0.5) * (this.config.speed.max - this.config.speed.min) + this.config.speed.min,
            originalVx: 0,
            originalVy: 0,
            size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
            opacity: Math.random() * (this.config.opacity.max - this.config.opacity.min) + this.config.opacity.min,
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            life: Math.random() * 100,
            maxLife: 100 + Math.random() * 100,
            waveOffset: Math.random() * Math.PI * 2,
            pulsePhase: Math.random() * Math.PI * 2,
            trailHistory: []
        };
    }
    
    updateParticles() {
        const time = Date.now() * 0.001;
        
        this.particles.forEach((particle, index) => {
            // Store original velocity if not set
            if (particle.originalVx === 0 && particle.originalVy === 0) {
                particle.originalVx = particle.vx;
                particle.originalVy = particle.vy;
            }
            
            // Add wave motion
            const waveX = Math.sin(time * this.config.waveFrequency + particle.waveOffset) * this.config.waveAmplitude;
            const waveY = Math.cos(time * this.config.waveFrequency * 0.7 + particle.waveOffset) * this.config.waveAmplitude;
            
            // Update position with wave motion
            particle.x += particle.vx + waveX * 0.1;
            particle.y += particle.vy + waveY * 0.1;
            
            // Pulsing effect
            particle.pulsePhase += 0.05;
            const pulse = Math.sin(particle.pulsePhase) * 0.3 + 0.7;
            particle.currentSize = particle.size * pulse;
            particle.currentOpacity = particle.opacity * pulse;
            
            // Trail effect
            particle.trailHistory.push({ x: particle.x, y: particle.y });
            if (particle.trailHistory.length > 8) {
                particle.trailHistory.shift();
            }
            
            // Update life
            particle.life++;
            
            // Boundary collision with elastic bounce
            if (particle.x < 0 || particle.x > window.innerWidth) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
            }
            
            if (particle.y < 0 || particle.y > document.documentElement.scrollHeight) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(document.documentElement.scrollHeight, particle.y));
            }
            
            // Advanced mouse interaction
            if (this.mouse.moved) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.mouseRadius) {
                    const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    
                    // Attraction/repulsion effect
                    const attractionForce = this.config.mouseForce * force;
                    particle.vx += Math.cos(angle) * attractionForce * 0.1;
                    particle.vy += Math.sin(angle) * attractionForce * 0.1;
                    
                    // Orbital motion around mouse
                    const orbitalAngle = angle + Math.PI * 0.5;
                    particle.vx += Math.cos(orbitalAngle) * force * 0.5;
                    particle.vy += Math.sin(orbitalAngle) * force * 0.5;
                    
                    // Enhanced glow near mouse
                    particle.nearMouse = force;
                } else {
                    particle.nearMouse = 0;
                    // Gradually return to original velocity
                    particle.vx += (particle.originalVx - particle.vx) * 0.02;
                    particle.vy += (particle.originalVy - particle.vy) * 0.02;
                }
            } else {
                particle.nearMouse = 0;
                // Return to normal behavior
                particle.vx += (particle.originalVx - particle.vx) * 0.01;
                particle.vy += (particle.originalVy - particle.vy) * 0.01;
            }
            
            // Velocity damping
            particle.vx *= 0.995;
            particle.vy *= 0.995;
            
            // Regenerate particle if it's too old
            if (particle.life > particle.maxLife) {
                this.particles[index] = this.createParticle();
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            // Draw trail
            if (particle.trailHistory.length > 1) {
                this.ctx.save();
                this.ctx.strokeStyle = particle.color;
                this.ctx.lineWidth = 1;
                this.ctx.globalAlpha = particle.currentOpacity * 0.3;
                
                this.ctx.beginPath();
                this.ctx.moveTo(particle.trailHistory[0].x, particle.trailHistory[0].y);
                for (let i = 1; i < particle.trailHistory.length; i++) {
                    this.ctx.lineTo(particle.trailHistory[i].x, particle.trailHistory[i].y);
                }
                this.ctx.stroke();
                this.ctx.restore();
            }
            
            // Draw main particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.currentOpacity;
            this.ctx.fillStyle = particle.color;
            
            // Enhanced glow effect
            const glowSize = particle.nearMouse ? particle.currentSize * (2 + particle.nearMouse * 2) : particle.currentSize * 1.5;
            this.ctx.shadowBlur = glowSize;
            this.ctx.shadowColor = particle.color;
            
            // Draw outer glow
            this.ctx.globalAlpha = particle.currentOpacity * 0.3;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw main particle
            this.ctx.globalAlpha = particle.currentOpacity;
            this.ctx.shadowBlur = particle.currentSize * 2;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.currentSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw core highlight
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.shadowBlur = 0;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.currentSize * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        const connections = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.maxDistance) {
                    connections.push({
                        p1: this.particles[i],
                        p2: this.particles[j],
                        distance: distance
                    });
                }
            }
        }
        
        connections.forEach(connection => {
            const opacity = (1 - connection.distance / this.config.maxDistance) * this.config.connectionOpacity;
            
            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            this.ctx.strokeStyle = '#00FFFF';
            this.ctx.lineWidth = 1;
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = '#00FFFF';
            
            this.ctx.beginPath();
            this.ctx.moveTo(connection.p1.x, connection.p1.y);
            this.ctx.lineTo(connection.p2.x, connection.p2.y);
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    animate() {
        this.clear();
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        // Mouse movement
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY + window.scrollY;
            this.mouse.moved = true;
        });
        
        // Mouse leave
        window.addEventListener('mouseleave', () => {
            this.mouse.moved = false;
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.updateCanvasSize();
            
            // Adjust particle count based on screen size
            const newCount = window.innerWidth < 768 ? 50 : 100;
            if (newCount !== this.config.particleCount) {
                this.config.particleCount = newCount;
                this.createParticles();
            }
        });
        
        // Scroll handler
        window.addEventListener('scroll', () => {
            this.updateCanvasSize();
        });
        
        // Performance optimization for mobile
        if (window.innerWidth < 768) {
            this.config.maxDistance = 120;
            this.config.mouseRadius = 150;
        }
    }
    
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('particle-canvas');
    if (container) {
        const particleSystem = new ParticleSystem(container);
        
        // Store reference for cleanup
        window.particleSystem = particleSystem;
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.particleSystem) {
        window.particleSystem.destroy();
    }
});
