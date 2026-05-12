/**
 * Heat Transfer Simulator
 * Visualizes Conduction, Convection, and Radiation.
 */
window.heatTransfer = {
    canvas: null,
    ctx: null,
    animationId: null,
    mode: 'conduction',
    
    // Conduction rod data
    rodNodes: [],
    numNodes: 40,
    sourceTemp: 800,
    ambientTemp: 300,
    
    // Convection particles
    particles: [],
    
    init() {
        this.canvas = document.getElementById('ht-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth || 600;
        this.canvas.height = container.clientHeight || 400;
        
        this.initRod();
        this.bindControls();
        this.animate();
    },
    
    stop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    },
    
    initRod() {
        this.rodNodes = [];
        for (let i = 0; i < this.numNodes; i++) {
            this.rodNodes.push({
                temp: this.ambientTemp
            });
        }
        this.particles = [];
    },
    
    bindControls() {
        const modeBtns = document.querySelectorAll('.ht-mode-btn');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.mode = btn.dataset.mode;
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.initRod();
            });
        });
        
        const sourceSlider = document.getElementById('ht-source-temp');
        if (sourceSlider) {
            sourceSlider.addEventListener('input', (e) => {
                this.sourceTemp = parseFloat(e.target.value);
                const val = document.getElementById('ht-source-val');
                if (val) val.textContent = this.sourceTemp + ' K';
            });
        }
    },
    
    animate() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, W, H);
        
        if (this.mode === 'conduction') {
            this.updateConduction();
            this.drawConduction();
        } else if (this.mode === 'convection') {
            this.updateConvection();
            this.drawConvection();
        } else if (this.mode === 'radiation') {
            this.updateRadiation();
            this.drawRadiation();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    updateConduction() {
        const k = 0.05; // Thermal conductivity
        this.rodNodes[0].temp = this.sourceTemp;
        
        // Simple 1D heat equation (Explicit Finite Difference)
        const nextTemps = [...this.rodNodes.map(n => n.temp)];
        for (let i = 1; i < this.numNodes - 1; i++) {
            nextTemps[i] = this.rodNodes[i].temp + k * (this.rodNodes[i-1].temp + this.rodNodes[i+1].temp - 2 * this.rodNodes[i].temp);
        }
        // Convection at the end
        nextTemps[this.numNodes-1] = this.rodNodes[this.numNodes-1].temp + k * (this.rodNodes[this.numNodes-2].temp - this.rodNodes[this.numNodes-1].temp);
        
        for (let i = 1; i < this.numNodes; i++) {
            this.rodNodes[i].temp = nextTemps[i];
        }
    },
    
    drawConduction() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const nodeW = W * 0.8 / this.numNodes;
        const startX = W * 0.1;
        const centerY = H * 0.5;
        
        ctx.font = 'bold 16px Inter';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText("Fourier's Law: q = -k âˆ‡T", W/2, 40);
        
        // Draw Source
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(startX - 20, centerY - 40, 20, 80);
        ctx.fillText("Heat Source", startX - 10, centerY - 50);
        
        this.rodNodes.forEach((n, i) => {
            let hue = 240 - ((n.temp - 300) / 500) * 240;
            hue = Math.max(0, Math.min(240, hue));
            ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
            ctx.fillRect(startX + i * nodeW, centerY - 20, nodeW + 1, 40);
            
            if (i % 10 === 0) {
                ctx.fillStyle = '#94a3b8';
                ctx.font = '10px Inter';
                ctx.fillText(Math.round(n.temp) + 'K', startX + i * nodeW, centerY + 40);
            }
        });
        
        // Heat gradient label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Temperature Gradient (dT/dx)', W/2, centerY + 80);
    },
    
    updateConvection() {
        // Simple particle system for convection
        if (this.particles.length < 50 && Math.random() < 0.2) {
            this.particles.push({
                x: this.canvas.width * 0.2,
                y: this.canvas.height * 0.7,
                vx: 2 + Math.random() * 2,
                vy: -Math.random() * 1,
                temp: this.sourceTemp,
                life: 1.0
            });
        }
        
        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.temp -= 2;
            p.life -= 0.005;
            if (p.life <= 0 || p.x > this.canvas.width) {
                this.particles.splice(i, 1);
            }
        });
    },
    
    drawConvection() {
        const ctx = this.ctx;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText("Convection: Newton's Law of Cooling", this.canvas.width/2, 40);
        
        // Draw hot surface
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(this.canvas.width * 0.1, this.canvas.height * 0.7, this.canvas.width * 0.2, 10);
        
        this.particles.forEach(p => {
            let hue = 240 - ((p.temp - 300) / 500) * 240;
            hue = Math.max(0, Math.min(240, hue));
            ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    },
    
    updateRadiation() {
        // Visualizing photons
        if (this.particles.length < 100 && Math.random() < 0.3) {
            const angle = (Math.random() - 0.5) * Math.PI;
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: Math.cos(angle) * 5,
                vy: Math.sin(angle) * 5,
                life: 1.0
            });
        }
        this.particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.01;
            if (p.life <= 0) this.particles.splice(i, 1);
        });
    },
    
    drawRadiation() {
        const ctx = this.ctx;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText("Radiation: Stefan-Boltzmann Law", this.canvas.width/2, 40);
        ctx.fillText("E = ÏƒTâ´", this.canvas.width/2, 65);
        
        // Draw hot sphere
        const grad = ctx.createRadialGradient(this.canvas.width/2, this.canvas.height/2, 5, this.canvas.width/2, this.canvas.height/2, 40);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.5, '#f59e0b');
        grad.addColorStop(1, 'rgba(245,158,11,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.canvas.width/2, this.canvas.height/2, 40, 0, Math.PI * 2);
        ctx.fill();
        
        this.particles.forEach(p => {
            ctx.strokeStyle = `rgba(251,191,36,${p.life})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
            ctx.stroke();
        });
    }
};
