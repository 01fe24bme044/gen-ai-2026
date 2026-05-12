window.piston = {
    canvas: null,
    ctx: null,
    animationId: null,
    
    // State
    crankAngle: 0,
    isIgniting: false,
    workDone: 0,
    
    init() {
        this.canvas = document.getElementById('piston-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        const container = document.getElementById('piston-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // Add manual crank UI if it doesn't exist
        if (!document.getElementById('manual-crank-wrapper')) {
            const panel = document.querySelector('[data-view="piston"] .controls-panel') || document.querySelector('.controls-panel');
            if (panel) {
                // Clear old buttons
                panel.innerHTML = `
                    <h3>3D Engine Manual Simulation</h3>
                    <div class="control-group" id="manual-crank-wrapper" style="margin-top:2rem;">
                        <label>Manual Crank (Degrees) <span id="crank-val">0</span>°</label>
                        <input type="range" id="crank-slider" min="0" max="720" value="0" style="width:100%;">
                    </div>
                    <div class="glass" style="margin-top: 1rem; padding: 1rem; border-radius: 8px;">
                        <p style="margin:0; font-size: 0.9rem; color: var(--text-muted);">
                            Drag the slider to rotate the crankshaft. Notice the spark ignition during the power stroke (between 360° and 540°).
                        </p>
                    </div>
                `;
            }
        }
        
        this.bindControls();
        this.animate();
    },
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    bindControls() {
        const slider = document.getElementById('crank-slider');
        if(!slider) return;
        
        const newSlider = slider.cloneNode(true);
        slider.parentNode.replaceChild(newSlider, slider);
        
        newSlider.addEventListener('input', (e) => {
            this.crankAngle = parseInt(e.target.value);
            document.getElementById('crank-val').textContent = this.crankAngle;
            
            // Spark ignition check (power stroke start ~ 360 to 380 deg)
            const cycleAngle = this.crankAngle % 720;
            if (cycleAngle > 350 && cycleAngle < 390) {
                this.isIgniting = true;
            } else {
                this.isIgniting = false;
            }
        });
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        
        // Isometric 3D parameters
        const cx = cw / 2;
        const cy = ch / 2 - 20;
        
        // Calculate piston position based on crank angle
        const crankRadius = 40;
        const rodLength = 100;
        const rad = this.crankAngle * (Math.PI / 180);
        
        const crankX = Math.sin(rad) * crankRadius;
        const crankY = Math.cos(rad) * crankRadius;
        
        // Piston Y math (simple slider-crank)
        const pistonYOffset = crankY + Math.sqrt(rodLength*rodLength - crankX*crankX);
        const pistonY = cy - pistonYOffset + 80;
        
        // Draw Cylinder (Isometric/3D view)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        
        // Cylinder back half
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy - 80, 60, 20, 0, Math.PI, 0); // top back
        this.ctx.stroke();
        
        // Draw Gas inside cylinder (color changes during ignition)
        if (this.isIgniting) {
            this.ctx.fillStyle = 'rgba(239, 68, 68, 0.6)'; // Red spark
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = 'red';
        } else {
            const cycleAngle = this.crankAngle % 720;
            if (cycleAngle < 180) this.ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; // Intake (Blue)
            else if (cycleAngle < 360) this.ctx.fillStyle = 'rgba(16, 185, 129, 0.3)'; // Compress (Green)
            else if (cycleAngle < 540) this.ctx.fillStyle = 'rgba(245, 158, 11, 0.3)'; // Power (Orange)
            else this.ctx.fillStyle = 'rgba(100, 116, 139, 0.3)'; // Exhaust (Gray)
            this.ctx.shadowBlur = 0;
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 60, cy - 80);
        this.ctx.lineTo(cx - 60, pistonY);
        this.ctx.ellipse(cx, pistonY, 60, 20, 0, Math.PI, 0);
        this.ctx.lineTo(cx + 60, cy - 80);
        this.ctx.ellipse(cx, cy - 80, 60, 20, 0, 0, Math.PI);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Draw Spark Plug
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fillRect(cx - 5, cy - 100, 10, 20);
        if (this.isIgniting) {
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.beginPath();
            this.ctx.arc(cx, cy - 80, 8, 0, Math.PI*2);
            this.ctx.fill();
        }
        
        // Draw Piston (3D)
        this.ctx.fillStyle = '#475569';
        this.ctx.strokeStyle = '#94a3b8';
        this.ctx.beginPath();
        this.ctx.ellipse(cx, pistonY, 60, 20, 0, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#334155';
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 60, pistonY);
        this.ctx.lineTo(cx - 60, pistonY + 30);
        this.ctx.ellipse(cx, pistonY + 30, 60, 20, 0, Math.PI, 0);
        this.ctx.lineTo(cx + 60, pistonY);
        this.ctx.ellipse(cx, pistonY, 60, 20, 0, 0, Math.PI);
        this.ctx.fill();
        
        // Connecting Rod
        this.ctx.strokeStyle = '#64748b';
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, pistonY + 15);
        this.ctx.lineTo(cx + crankX, cy + 120 + crankY);
        this.ctx.stroke();
        
        // Crankshaft Circle
        this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy + 120, crankRadius, crankRadius * 0.4, 0, 0, Math.PI*2);
        this.ctx.stroke();
        
        // Crank Point
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.beginPath();
        this.ctx.ellipse(cx + crankX, cy + 120 + crankY, 8, 4, 0, 0, Math.PI*2);
        this.ctx.fill();
        
        // Cylinder front half
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 60, cy - 80);
        this.ctx.lineTo(cx - 60, cy + 80);
        this.ctx.ellipse(cx, cy + 80, 60, 20, 0, Math.PI, 0);
        this.ctx.lineTo(cx + 60, cy - 80);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy - 80, 60, 20, 0, 0, Math.PI); // top front
        this.ctx.stroke();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
