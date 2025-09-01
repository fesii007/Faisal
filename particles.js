class EnhancedParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.connections = [];
        this.cardAttractions = new Map(); // Track card attractions
        this.mouse = { x: 0, y: 0, moved: false };
        this.canvas = null;
        this.ctx = null;
        
        this.config = {
            particleCount: window.innerWidth < 768 ? 80 : 150,
            maxDistance: 180,
            mouseRadius: 300,
            mouseForce: 0.8,
            cardAttractionRadius: 200,
            cardAttractionForce: 1.2,
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
            waveFrequency: 0.02,
            cardHighlightColors: {
                service: '#00FFFF',
                portfolio: '#8B00FF', 
                skill: '#32CD32',
                testimonial: '#FFD700',
                contact: '#FF1493'
            }
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
        this.canvas.style.zIndex = '-1';
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
            trailHistory: [],
            cardAttracted: false,
            cardAttractionForce: 0,
            cardAttractionAngle: 0,
            glowIntensity: 1,
            spinSpeed: (Math.random() - 0.5) * 0.02
        };
    }
    
    // Card interaction methods
    addCardAttraction(cardElement) {
        const rect = cardElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const attraction = {
            x: rect.left + rect.width / 2,
            y: rect.top + scrollTop + rect.height / 2,
            width: rect.width,
            height: rect.height,
            element: cardElement,
            strength: this.config.cardAttractionForce,
            type: this.getCardType(cardElement)
        };
        
        this.cardAttractions.set(cardElement, attraction);
        
        // Add special particle burst effect
        this.createCardBurst(attraction);
    }
    
    removeCardAttraction(cardElement) {
        this.cardAttractions.delete(cardElement);
    }
    
    getCardType(cardElement) {
        if (cardElement.closest('.service-card')) return 'service';
        if (cardElement.closest('.portfolio-card')) return 'portfolio';
        if (cardElement.closest('.skill-card')) return 'skill';
        if (cardElement.closest('.testimonial-card')) return 'testimonial';
        if (cardElement.closest('.contact-form, .contact-info')) return 'contact';
        return 'default';
    }
    
    createCardBurst(attraction) {
        // Create additional particles around the card
        const burstCount = 15;
        for (let i = 0; i < burstCount; i++) {
            const angle = (Math.PI * 2 * i) / burstCount;
            const distance = 50 + Math.random() * 100;
            
            const burstParticle = this.createParticle();
            burstParticle.x = attraction.x + Math.cos(angle) * distance;
            burstParticle.y = attraction.y + Math.sin(angle) * distance;
            burstParticle.vx = Math.cos(angle) * 2;
            burstParticle.vy = Math.sin(angle) * 2;
            burstParticle.life = 0;
            burstParticle.maxLife = 50;
            burstParticle.color = this.config.cardHighlightColors[attraction.type] || '#00FFFF';
            burstParticle.size *= 1.5;
            burstParticle.glowIntensity = 2;
            
            this.particles.push(burstParticle);
        }
    }
    
    updateParticles() {
        const time = Date.now() * 0.001;
        
        this.particles.forEach((particle, index) => {
            // Store original velocity if not set
            if (particle.originalVx === 0 && particle.originalVy === 0) {
                particle.originalVx = particle.vx;
                particle.originalVy = particle.vy;
            }
            
            // Reset card attraction state
            particle.cardAttracted = false;
            particle.cardAttractionForce = 0;
            
            // Check card attractions
            this.cardAttractions.forEach(attraction => {
                const dx = attraction.x - particle.x;
                const dy = attraction.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.cardAttractionRadius) {
                    particle.cardAttracted = true;
                    const force = (this.config.cardAttractionRadius - distance) / this.config.cardAttractionRadius;
                    particle.cardAttractionForce = force * attraction.strength;
                    particle.cardAttractionAngle = Math.atan2(dy, dx);
                    
                    // Add orbital motion around cards
                    const orbitalAngle = particle.cardAttractionAngle + Math.PI * 0.5;
                    particle.vx += Math.cos(orbitalAngle) * force * 0.8;
                    particle.vy += Math.sin(orbitalAngle) * force * 0.8;
                    
                    // Color shift based on card type
                    const cardColor = this.config.cardHighlightColors[attraction.type];
                    if (cardColor && force > 0.5) {
                        particle.color = cardColor;
                        particle.glowIntensity = 1 + force;
                    }
                }
            });
            
            // Add wave motion
            const waveX = Math.sin(time * this.config.waveFrequency + particle.waveOffset) * this.config.waveAmplitude;
            const waveY = Math.cos(time * this.config.waveFrequency * 0.7 + particle.waveOffset) * this.config.waveAmplitude;
            
            // Update position with wave motion and card attractions
            if (particle.cardAttracted) {
                // Attracted to card - move towards it with orbital motion
                particle.x += particle.vx * 0.7 + Math.cos(particle.cardAttractionAngle) * particle.cardAttractionForce;
                particle.y += particle.vy * 0.7 + Math.sin(particle.cardAttractionAngle) * particle.cardAttractionForce;
            } else {
                // Normal movement
                particle.x += particle.vx + waveX * 0.1;
                particle.y += particle.vy + waveY * 0.1;
            }
            
            // Spinning motion for attracted particles
            if (particle.cardAttracted) {
                particle.pulsePhase += particle.spinSpeed * particle.cardAttractionForce * 5;
            } else {
                particle.pulsePhase += 0.05;
            }
            
            // Enhanced pulsing effect
            const pulse = Math.sin(particle.pulsePhase) * 0.3 + 0.7;
            particle.currentSize = particle.size * pulse * particle.glowIntensity;
            particle.currentOpacity = particle.opacity * pulse;
            
            // Trail effect - enhanced for attracted particles
            particle.trailHistory.push({ x: particle.x, y: particle.y, opacity: particle.currentOpacity });
            const trailLength = particle.cardAttracted ? 12 : 8;
            if (particle.trailHistory.length > trailLength) {
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
            
            // Mouse interaction (enhanced)
            if (this.mouse.moved) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.mouseRadius) {
                    const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    
                    // Enhanced mouse attraction with card consideration
                    let mouseForce = this.config.mouseForce;
                    if (particle.cardAttracted) {
                        mouseForce *= 0.3; // Reduce mouse influence when attracted to cards
                    }
                    
                    const attractionForce = mouseForce * force;
                    particle.vx += Math.cos(angle) * attractionForce * 0.1;
                    particle.vy += Math.sin(angle) * attractionForce * 0.1;
                    
                    // Orbital motion around mouse
                    const orbitalAngle = angle + Math.PI * 0.5;
                    particle.vx += Math.cos(orbitalAngle) * force * 0.5;
                    particle.vy += Math.sin(orbitalAngle) * force * 0.5;
                    
                    // Enhanced glow near mouse
                    particle.nearMouse = force;
                    particle.glowIntensity = Math.max(particle.glowIntensity, 1 + force);
                } else {
                    particle.nearMouse = 0;
                    // Gradually return to original velocity if not card attracted
                    if (!particle.cardAttracted) {
                        particle.vx += (particle.originalVx - particle.vx) * 0.02;
                        particle.vy += (particle.originalVy - particle.vy) * 0.02;
                    }
                }
            } else {
                particle.nearMouse = 0;
                // Return to normal behavior
                if (!particle.cardAttracted) {
                    particle.vx += (particle.originalVx - particle.vx) * 0.01;
                    particle.vy += (particle.originalVy - particle.vy) * 0.01;
                }
            }
            
            // Velocity damping
            particle.vx *= 0.995;
            particle.vy *= 0.995;
            
            // Reset glow intensity gradually
            particle.glowIntensity = Math.max(1, particle.glowIntensity * 0.98);
            
            // Regenerate particle if it's too old
            if (particle.life > particle.maxLife) {
                this.particles[index] = this.createParticle();
            }
        });
        
        // Remove excess particles created by card bursts
        if (this.particles.length > this.config.particleCount * 1.5) {
            this.particles = this.particles.slice(0, this.config.particleCount * 1.2);
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            // Enhanced trail drawing
            if (particle.trailHistory.length > 1) {
                this.ctx.save();
                this.ctx.strokeStyle = particle.color;
                this.ctx.lineWidth = particle.cardAttracted ? 2 : 1;
                
                this.ctx.beginPath();
                particle.trailHistory.forEach((point, index) => {
                    const alpha = (index / particle.trailHistory.length) * particle.currentOpacity * 0.5;
                    this.ctx.globalAlpha = alpha;
                    
                    if (index === 0) {
                        this.ctx.moveTo(point.x, point.y);
                    } else {
                        this.ctx.lineTo(point.x, point.y);
                    }
                });
                this.ctx.stroke();
                this.ctx.restore();
            }
            
            // Enhanced main particle drawing
            this.ctx.save();
            this.ctx.globalAlpha = particle.currentOpacity;
            this.ctx.fillStyle = particle.color;
            
            // Enhanced glow effect based on states
            let glowSize = particle.currentSize * 1.5;
            if (particle.nearMouse) {
                glowSize *= (1 + particle.nearMouse);
            }
            if (particle.cardAttracted) {
                glowSize *= (1 + particle.cardAttractionForce * 0.5);
            }
            
            this.ctx.shadowBlur = glowSize * particle.glowIntensity;
            this.ctx.shadowColor = particle.color;
            
            // Draw outer glow with enhanced intensity
            this.ctx.globalAlpha = particle.currentOpacity * 0.4 * particle.glowIntensity;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw middle glow
            this.ctx.globalAlpha = particle.currentOpacity * 0.6;
            this.ctx.shadowBlur = particle.currentSize * 3;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.currentSize * 1.2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw main particle
            this.ctx.globalAlpha = particle.currentOpacity;
            this.ctx.shadowBlur = particle.currentSize * 2;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.currentSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw core highlight with enhanced brightness
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.shadowBlur = 0;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.currentSize * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Additional sparkle effect for highly attracted particles
            if (particle.cardAttracted && particle.cardAttractionForce > 0.7) {
                this.ctx.globalAlpha = 0.8;
                this.ctx.fillStyle = particle.color;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = particle.color;
                
                // Draw sparkle points
                for (let i = 0; i < 4; i++) {
                    const angle = (Math.PI * 2 * i) / 4 + particle.pulsePhase;
                    const sparkleX = particle.x + Math.cos(angle) * particle.currentSize * 2;
                    const sparkleY = particle.y + Math.sin(angle) * particle.currentSize * 2;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(sparkleX, sparkleY, 1, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
            
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
            let opacity = (1 - connection.distance / this.config.maxDistance) * this.config.connectionOpacity;
            let lineWidth = 1;
            let strokeStyle = '#00FFFF';
            
            // Enhanced connections for card-attracted particles
            if (connection.p1.cardAttracted || connection.p2.cardAttracted) {
                opacity *= 1.5;
                lineWidth = 2;
                
                // Use the color of the attracted particle
                if (connection.p1.cardAttracted) {
                    strokeStyle = connection.p1.color;
                }
                if (connection.p2.cardAttracted) {
                    strokeStyle = connection.p2.color;
                }
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = Math.min(opacity, 0.8);
            this.ctx.strokeStyle = strokeStyle;
            this.ctx.lineWidth = lineWidth;
            this.ctx.shadowBlur = lineWidth * 3;
            this.ctx.shadowColor = strokeStyle;
            
            this.ctx.beginPath();
            this.ctx.moveTo(connection.p1.x, connection.p1.y);
            this.ctx.lineTo(connection.p2.x, connection.p2.y);
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }
    
    // Enhanced card connection lines
    drawCardConnections() {
        this.cardAttractions.forEach(attraction => {
            const cardParticles = this.particles.filter(p => {
                const dx = attraction.x - p.x;
                const dy = attraction.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < this.config.cardAttractionRadius * 0.7;
            });
            
            // Draw connections between card and nearby particles
            cardParticles.forEach(particle => {
                this.ctx.save();
                this.ctx.globalAlpha = 0.3 * particle.cardAttractionForce;
                this.ctx.strokeStyle = this.config.cardHighlightColors[attraction.type] || '#00FFFF';
                this.ctx.lineWidth = 1;
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = this.config.cardHighlightColors[attraction.type] || '#00FFFF';
                
                this.ctx.beginPath();
                this.ctx.moveTo(attraction.x, attraction.y);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.stroke();
                
                this.ctx.restore();
            });
        });
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    animate() {
        this.clear();
        this.updateParticles();
        this.drawConnections();
        this.drawCardConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        // Enhanced mouse movement tracking
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY + window.scrollY;
            this.mouse.moved = true;
            
            // Clear mouse moved flag after a delay
            clearTimeout(this.mouseTimer);
            this.mouseTimer = setTimeout(() => {
                this.mouse.moved = false;
            }, 100);
        });
        
        // Mouse leave
        window.addEventListener('mouseleave', () => {
            this.mouse.moved = false;
        });
        
        // Enhanced resize handler
        window.addEventListener('resize', () => {
            this.updateCanvasSize();
            
            // Adjust particle count and settings based on screen size
            const newCount = window.innerWidth < 768 ? 50 : window.innerWidth < 1200 ? 100 : 150;
            if (newCount !== this.config.particleCount) {
                this.config.particleCount = newCount;
                // Don't recreate all particles, just adjust the count
                if (this.particles.length > newCount) {
                    this.particles = this.particles.slice(0, newCount);
                } else {
                    while (this.particles.length < newCount) {
                        this.particles.push(this.createParticle());
                    }
                }
            }
            
            // Update card attractions positions
            this.cardAttractions.forEach((attraction, cardElement) => {
                const rect = cardElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                attraction.x = rect.left + rect.width / 2;
                attraction.y = rect.top + scrollTop + rect.height / 2;
                attraction.width = rect.width;
                attraction.height = rect.height;
            });
        });
        
        // Scroll handler with card position updates
        window.addEventListener('scroll', () => {
            this.updateCanvasSize();
            
            // Update card attraction positions on scroll
            this.cardAttractions.forEach((attraction, cardElement) => {
                const rect = cardElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                attraction.x = rect.left + rect.width / 2;
                attraction.y = rect.top + scrollTop + rect.height / 2;
            });
        });
        
        // Performance optimization for mobile
        if (window.innerWidth < 768) {
            this.config.maxDistance = 120;
            this.config.mouseRadius = 150;
            this.config.cardAttractionRadius = 120;
        }
        
        // Visibility change handler for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Reduce particle count when tab is not visible
                this.config.particleCount = Math.floor(this.config.particleCount * 0.3);
            } else {
                // Restore particle count when tab becomes visible
                this.config.particleCount = window.innerWidth < 768 ? 80 : 150;
                while (this.particles.length < this.config.particleCount) {
                    this.particles.push(this.createParticle());
                }
            }
        });
    }
    
    // Public method to update card attractions
    updateCardAttractions() {
        this.cardAttractions.forEach((attraction, cardElement) => {
            if (!document.body.contains(cardElement)) {
                this.cardAttractions.delete(cardElement);
                return;
            }
            
            const rect = cardElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            attraction.x = rect.left + rect.width / 2;
            attraction.y = rect.top + scrollTop + rect.height / 2;
            attraction.width = rect.width;
            attraction.height = rect.height;
        });
    }
    
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.cardAttractions.clear();
        clearTimeout(this.mouseTimer);
    }
}

// Initialize enhanced particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('particle-canvas');
    if (container) {
        const particleSystem = new EnhancedParticleSystem(container);
        
        // Store reference globally for access from other scripts
        window.particleSystem = particleSystem;
        
        // Periodic cleanup and optimization
        setInterval(() => {
            particleSystem.updateCardAttractions();
        }, 1000);
        
        // Handle page unload
        window.addEventListener('beforeunload', () => {
            particleSystem.destroy();
        });
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedParticleSystem;
}
