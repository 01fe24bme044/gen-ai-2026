/**
 * Master Level: Antigravity Thermodynamic Propulsion Framework
 * Doctoral-level theoretical physics & advanced propulsion research
 * Implementation of GENERIC, EIT, and Relativistic Coupling
 */
window.antigravSim = {
    canvas: null, ctx: null, animationId: null,
    t: 0, mode: 'exergy', particles: [],
    gridPoints: [],
    
    init() {
        this.canvas = document.getElementById('antigrav-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Resize observer for the big container
        const con = document.getElementById('antigrav-container');
        const resize = () => {
            this.canvas.width = con.clientWidth;
            this.canvas.height = con.clientHeight;
            this._initGrid();
        };
        window.addEventListener('resize', resize);
        resize();

        this._initParticles();
        this._bindEvents();
        this.animate();
    },

    stop() { 
        if (this.animationId) cancelAnimationFrame(this.animationId); 
    },

    _initGrid() {
        this.gridPoints = [];
        const spacing = 40;
        for (let x = 0; x <= this.canvas.width; x += spacing) {
            for (let y = 0; y <= this.canvas.height; y += spacing) {
                this.gridPoints.push({ ox: x, oy: y, x, y });
            }
        }
    },

    _initParticles() {
        this.particles = [];
        for (let i = 0; i < 300; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 10 + Math.random() * 400;
            this.particles.push({
                angle, radius,
                speed: (0.001 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
                energy: Math.random(),
                phase: Math.random() * Math.PI * 2,
                type: Math.floor(Math.random() * 5), // 0=vacuum, 1=plasma, 2=photon, 3=phonon, 4=dark-exergy
            });
        }
    },

    _bindEvents() {
        document.querySelectorAll('.ag-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.mode = btn.dataset.mode;
                document.querySelectorAll('.ag-mode-btn').forEach(b => b.style.opacity = '0.6');
                btn.style.opacity = '1';
            });
        });

        const eSlider = document.getElementById('ag-energy-slider');
        const sSlider = document.getElementById('ag-entropy-slider');
        
        if (eSlider) {
            eSlider.addEventListener('input', e => {
                const el = document.getElementById('ag-energy-val');
                if (el) el.textContent = parseFloat(e.target.value).toFixed(2);
            });
        }
        if (sSlider) {
            sSlider.addEventListener('input', e => {
                const el = document.getElementById('ag-entropy-val');
                if (el) el.textContent = parseFloat(e.target.value).toFixed(2);
            });
        }
    },

    animate() {
        const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
        this.t += 0.016;
        const cx = W / 2, cy = H / 2;
        
        const energyScale = parseFloat(document.getElementById('ag-energy-slider')?.value || 1.0);
        const entropyRate = parseFloat(document.getElementById('ag-entropy-slider')?.value || 0.5);

        // Clear with deep space gradient
        const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H));
        bgGrad.addColorStop(0, '#020617');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Update and draw grid (Spacetime Curvature)
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let p of this.gridPoints) {
            const dx = p.ox - cx;
            const dy = p.oy - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Relativistic Metric Distortion
            const warp = (energyScale * 4000) / (dist + 100);
            p.x = p.ox - (dx / (dist + 1)) * warp;
            p.y = p.oy - (dy / (dist + 1)) * warp;

            if (dist < 400) {
                ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - dist/400)})`;
                ctx.strokeRect(p.x - 1, p.y - 1, 2, 2);
            }
        }

        // Draw mode-specific overlays
        this._drawModeOverlay(ctx, cx, cy, energyScale, entropyRate);

        // Draw Quasiparticles (Vacuum Fluctuations)
        this.particles.forEach(p => {
            p.angle += p.speed * (1 + energyScale * 0.5);
            p.phase += 0.04;
            
            // Non-linear orbital dynamics
            let r = p.radius * (1 + Math.sin(p.phase * 0.5) * 0.05 * entropyRate);
            
            // Gravity well pull
            const well = (energyScale * 2000) / (r + 100);
            r = Math.max(20, r - well);

            const x = cx + Math.cos(p.angle) * r;
            const y = cy + Math.sin(p.angle) * r;

            const colors = ['#fbbf24', '#ef4444', '#fff', '#3b82f6', '#a855f7'];
            ctx.fillStyle = colors[p.type];
            ctx.globalAlpha = 0.4 + p.energy * 0.6;
            
            const sz = (1.5 + p.energy * 3) * (r < 100 ? 1.5 : 1);
            ctx.beginPath();
            ctx.arc(x, y, sz, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Central Singular Core (Thermodynamic Invariant)
        const coreR = 35 + Math.sin(this.t * 3) * 5 * energyScale;
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2);
        coreGrad.addColorStop(0, '#fff');
        coreGrad.addColorStop(0.2, '#a855f7');
        coreGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');
        coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR * 2, 0, Math.PI * 2);
        ctx.fill();

        this.animationId = requestAnimationFrame(() => this.animate());
    },

    _drawModeOverlay(ctx, cx, cy, energy, entropy) {
        if (this.mode === 'exergy') {
            // Exergy Flux - Flowing Golden Spirals
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                const startAngle = i * (Math.PI / 4) + this.t;
                for (let r = 20; r < 300 * energy; r += 5) {
                    const ang = startAngle + r * 0.01;
                    const x = cx + Math.cos(ang) * r;
                    const y = cy + Math.sin(ang) * r;
                    r === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        } else if (this.mode === 'onsager') {
            // Onsager Reciprocal Coupling - Vector Field
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
            for (let i = 0; i < 20; i++) {
                const a = (i / 20) * Math.PI * 2 + this.t * 0.2;
                const r1 = 100;
                const r2 = 200;
                const x1 = cx + Math.cos(a) * r1;
                const y1 = cy + Math.sin(a) * r1;
                const x2 = cx + Math.cos(a + 0.5) * r2;
                const y2 = cy + Math.sin(a + 0.5) * r2;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                
                // Flux arrows
                ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
                ctx.beginPath();
                ctx.arc(x2, y2, 3, 0, Math.PI*2);
                ctx.fill();
            }
        } else if (this.mode === 'fluctuation') {
            // Fluctuation-Dissipation Waves
            ctx.lineWidth = 2;
            for (let r = 50; r < 400; r += 50) {
                const alpha = Math.max(0, 0.5 - (r / 500)) * (1 - entropy * 0.5);
                ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
                ctx.beginPath();
                for (let a = 0; a < Math.PI * 2; a += 0.1) {
                    const wave = Math.sin(a * 10 + this.t * 5) * 10 * entropy;
                    const x = cx + Math.cos(a) * (r + wave);
                    const y = cy + Math.sin(a) * (r + wave);
                    a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }
        } else if (this.mode === 'geodesic') {
            // Thermodynamic Length / Geodesic paths
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 3;
            ctx.beginPath();
            const steps = 100;
            for (let i = 0; i <= steps; i++) {
                const progress = i / steps;
                const r = 50 + progress * 250;
                const a = this.t + progress * Math.PI * (2 - energy * 0.5);
                const x = cx + Math.cos(a) * r;
                const y = cy + Math.sin(a) * r;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
        } else if (this.mode === 'generic') {
            // GENERIC Reversible-Irreversible Flow
            // Reversible (L-bracket) = Blue circles, Irreversible (M-bracket) = Purple radial bursts
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.beginPath();
            ctx.arc(cx, cy, 150 * energy, 0, Math.PI*2);
            ctx.stroke();
            
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
            for (let a = 0; a < Math.PI*2; a += Math.PI/6) {
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                const r = 150 + Math.sin(this.t * 4 + a) * 50;
                ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
                ctx.stroke();
            }
        }
    }
};
