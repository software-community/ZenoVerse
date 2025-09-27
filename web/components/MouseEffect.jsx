'use client';

import { useEffect } from 'react';

export default function MouseEffect() {
  useEffect(() => {
    class RocketCursor {
      constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.mouseHistory = [];
        this.maxHistory = 25;
        this.isMoving = false;
        this.mouseStopTimer = null;
        
        this.init();
    }
    
    init() {
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Add required CSS
        this.addStyles();
        
        // Create cursor element
        this.createCursor();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.updateCursor();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .rocket-cursor {
                position: fixed;
                width: 12px;
                height: 12px;
                background: radial-gradient(circle, #ffffff 0%, #87ceeb 30%, #4169e1 60%, transparent 100%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: screen;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 15px rgba(65, 105, 225, 0.6);
            }
            
            .rocket-flame {
                position: fixed;
                pointer-events: none;
                z-index: 9997;
                mix-blend-mode: screen;
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            }
            
            .rocket-spark {
                position: fixed;
                width: 2px;
                height: 2px;
                background: #5dade2;
                pointer-events: none;
                z-index: 9996;
                mix-blend-mode: screen;
            }
            
            .rocket-stream {
                position: fixed;
                pointer-events: none;
                z-index: 9998;
                mix-blend-mode: screen;
            }
            
            @keyframes rocketExhaust {
                0% {
                    opacity: 0.9;
                    transform: scaleX(1) scaleY(1);
                }
                100% {
                    opacity: 0;
                    transform: scaleX(3) scaleY(0.3);
                }
            }
            
            @keyframes rocketSpark {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(0);
                }
            }
            
            @keyframes rocketStream {
                0% {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.1) rotate(180deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'rocket-cursor';
        document.body.appendChild(this.cursor);
    }
    
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isMoving = true;
            
            // Add to mouse history
            this.mouseHistory.unshift({ 
                x: this.mouseX, 
                y: this.mouseY, 
                time: Date.now() 
            });
            if (this.mouseHistory.length > this.maxHistory) {
                this.mouseHistory.pop();
            }
            
            this.createRocketExhaust();
        });
        
        // Stop creating particles when mouse stops
        document.addEventListener('mousemove', () => {
            clearTimeout(this.mouseStopTimer);
            this.mouseStopTimer = setTimeout(() => {
                this.isMoving = false;
            }, 50);
        });
        
        // Handle mouse enter/leave
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });
    }
    
    updateCursor() {
        this.cursorX += (this.mouseX - this.cursorX) * 0.15;
        this.cursorY += (this.mouseY - this.cursorY) * 0.15;
        this.cursor.style.left = this.cursorX + 'px';
        this.cursor.style.top = this.cursorY + 'px';
        requestAnimationFrame(() => this.updateCursor());
    }
    
    createRocketExhaust() {
        if (this.mouseHistory.length < 3) return;
        
        const current = this.mouseHistory[0];
        const previous = this.mouseHistory[2];
        const dx = current.x - previous.x;
        const dy = current.y - previous.y;
        const speed = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        if (speed < 2) return; // Only create exhaust when moving
        
        // Create main flame particles
        for (let i = 0; i < Math.min(3, Math.floor(speed / 5)); i++) {
            const flame = document.createElement('div');
            flame.className = 'rocket-flame';
            
            const size = Math.random() * 6 + 3;
            const distance = Math.random() * 80 + 40;
            const spread = (Math.random() - 0.5) * 0.4;
            
            // Position behind the cursor in opposite direction of movement
            const flameX = current.x - Math.cos(angle + spread) * distance;
            const flameY = current.y - Math.sin(angle + spread) * distance;
            
            flame.style.width = size + 'px';
            flame.style.height = size * 2 + 'px';
            flame.style.left = flameX + 'px';
            flame.style.top = flameY + 'px';
            
            // Light blue flame colors
            const intensity = Math.min(1, speed / 20);
            const colors = [
                `rgba(255, 255, 255, ${0.8 * intensity})`,
                `rgba(135, 206, 235, ${0.6 * intensity})`, // Sky blue
                `rgba(100, 149, 237, ${0.5 * intensity})`, // Cornflower blue
                `rgba(65, 105, 225, ${0.3 * intensity})`, // Royal blue
                'transparent'
            ];
            
            flame.style.background = `radial-gradient(ellipse, ${colors.join(', ')})`;
            flame.style.transform = `rotate(${angle}rad)`;
            flame.style.animation = `rocketExhaust ${Math.random() * 0.4 + 0.3}s ease-out forwards`;
            
            document.body.appendChild(flame);
            
            setTimeout(() => {
                if (flame.parentNode) {
                    flame.parentNode.removeChild(flame);
                }
            }, 700);
        }
        
        // Create sparks
        if (speed > 5) {
            for (let i = 0; i < Math.min(4, Math.floor(speed / 6)); i++) {
                const spark = document.createElement('div');
                spark.className = 'rocket-spark';
                
                const sparkDistance = Math.random() * 100 + 60;
                const sparkSpread = (Math.random() - 0.5) * 0.6;
                const sparkX = current.x - Math.cos(angle + sparkSpread) * sparkDistance;
                const sparkY = current.y - Math.sin(angle + sparkSpread) * sparkDistance;
                
                spark.style.left = sparkX + 'px';
                spark.style.top = sparkY + 'px';
                spark.style.width = (Math.random() * 2 + 1) + 'px';
                spark.style.height = spark.style.width;
                spark.style.background = Math.random() > 0.5 ? '#5dade2' : '#87ceeb';
                spark.style.boxShadow = `0 0 4px ${spark.style.background}`;
                spark.style.animation = `rocketSpark ${Math.random() * 0.6 + 0.4}s ease-out forwards`;
                
                document.body.appendChild(spark);
                
                setTimeout(() => {
                    if (spark.parentNode) {
                        spark.parentNode.removeChild(spark);
                    }
                }, 1000);
            }
        }
        
        // Create exhaust stream for very fast movement
        if (speed > 10) {
            const stream = document.createElement('div');
            stream.className = 'rocket-stream';
            
            const streamLength = Math.min(speed * 5, 200);
            const streamX = current.x - Math.cos(angle) * streamLength / 2;
            const streamY = current.y - Math.sin(angle) * streamLength / 2;
            
            stream.style.width = streamLength + 'px';
            stream.style.height = '3px';
            stream.style.left = streamX + 'px';
            stream.style.top = streamY + 'px';
            stream.style.background = `linear-gradient(90deg, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(135, 206, 235, 0.7) 20%, 
                rgba(100, 149, 237, 0.5) 50%, 
                rgba(65, 105, 225, 0.3) 80%, 
                transparent 100%)`;
            stream.style.transform = `rotate(${angle}rad)`;
            stream.style.borderRadius = '50%';
            stream.style.animation = 'rocketStream 0.6s ease-out forwards';
            
            document.body.appendChild(stream);
            
            setTimeout(() => {
                if (stream.parentNode) {
                    stream.parentNode.removeChild(stream);
                }
            }, 600);
        }
    }
    
    // Method to destroy the cursor (cleanup)
    destroy() {
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        document.body.style.cursor = '';
        
        // Remove all rocket particles
        const particles = document.querySelectorAll('.rocket-flame, .rocket-spark, .rocket-stream');
        particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
    }
}

    const cursor = new RocketCursor();
    
    // Cleanup function
    return () => {
      if (cursor) {
        cursor.destroy();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return null;
}