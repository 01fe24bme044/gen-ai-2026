// Advanced: Statistical Mechanics — Boltzmann, Microstates & Entropy
window.advStatMech = {
    canvas: null, ctx: null, animationId: null,
    T: 300, N: 60,
    particles: [],
    energyLevels: [0, 1, 2, 3, 4],  // ε units
    mode: 'ensemble',  // 'ensemble' | 'distribution'

    init() {
        this.canvas = document.getElementById('statmech-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('statmech-container');
        this.canvas.width = c.clientWidth;
        this.canvas.height = c.clientHeight;
        this.spawnParticles();
        this.bindControls();
        this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    spawnParticles() {
        this.particles = [];
        for (let i = 0; i < this.N; i++) {
            const energy = this.boltzmannSample();
            const speed = Math.sqrt(2 * energy * 1.5e-21 / 4.65e-26) * 0.0001;
            const angle = Math.random() * Math.PI * 2;
            this.particles.push({
                x: 30 + Math.random() * (this.canvas.width * 0.45 - 30),
                y: 20 + Math.random() * (this.canvas.height - 40),
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                energy: energy, r: 4
            });
        }
    },

    boltzmannSample() {
        // Inverse transform sampling of Boltzmann distribution (exponential approx)
        const kB = 1.38e-23, beta = 1 / (kB * this.T);
        return -Math.log(Math.random()) / (beta * 1e21);
    },

    boltzmannN(E) {
        const kB = 1.38e-23;
        return Math.exp(-E / (kB * this.T));
    },

    entropy() {
        // Shannon entropy S = -kB Σ Pi ln Pi
        const kB = 1.38e-23;
        const maxE = this.energyLevels.length;
        let Z = 0;
        this.energyLevels.forEach(e => { Z += Math.exp(-e / (kB * this.T * 1e23)); });
        let S = 0;
        this.energyLevels.forEach(e => {
            const p = Math.exp(-e / (kB * this.T * 1e23)) / Z;
            if (p > 0) S -= p * Math.log(p);
        });
        return S * kB * 1e24;
    },

    bindControls() {
        const tSlider = document.getElementById('statmech-T');
        if (tSlider) tSlider.oninput = e => {
            this.T = parseFloat(e.target.value);
            document.getElementById('statmech-T-val').textContent = this.T + ' K';
            this.spawnParticles();
        };
        const nSlider = document.getElementById('statmech-N');
        if (nSlider) nSlider.oninput = e => {
            this.N = parseInt(e.target.value);
            document.getElementById('statmech-N-val').textContent = this.N;
            this.spawnParticles();
        };
        ['ensemble','distribution'].forEach(m => {
            const btn = document.getElementById(`statmech-mode-${m}`);
            if (btn) btn.onclick = () => { this.mode = m; };
        });
    },

    animate() {
        this.drawScene();
        this.animationId = requestAnimationFrame(() => this.animate());
    },

    drawScene() {
        const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
        const isLight = window.app && window.app.theme === 'light';
        ctx.clearRect(0, 0, w, h);

        const panelW = w * 0.48;

        // ── LEFT: Particle Ensemble ──
        // Box
        ctx.strokeStyle = isLight ? 'rgba(71,85,105,0.6)' : 'rgba(148,163,184,0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, panelW - 20, h - 20);

        ctx.fillStyle = isLight ? '#f1f5f9' : '#0f172a';
        ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
        ctx.fillText(`Particle Ensemble  N=${this.N}`, panelW / 2, h - 4);

        // Move & draw particles
        this.particles.forEach(p => {
            p.x += p.vx * (this.T / 100);
            p.y += p.vy * (this.T / 100);
            if (p.x < 14 || p.x > panelW - 14) { p.vx *= -1; p.x = Math.max(14, Math.min(panelW - 14, p.x)); }
            if (p.y < 14 || p.y > h - 14) { p.vy *= -1; p.y = Math.max(14, Math.min(h - 14, p.y)); }

            // Randomize energy occasionally
            if (Math.random() < 0.003) { p.energy = this.boltzmannSample(); }

            let hue = 240 - (p.energy / 5) * 240;
            hue = Math.max(0, Math.min(240, hue));
            const rGrad = ctx.createRadialGradient(p.x - 1, p.y - 1, 0, p.x, p.y, p.r);
            rGrad.addColorStop(0, '#fff');
            rGrad.addColorStop(0.4, `hsl(${hue},85%,60%)`);
            rGrad.addColorStop(1, `hsl(${hue},85%,30%)`);
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = rGrad; ctx.fill();
        });

        // ── RIGHT: Boltzmann Distribution ──
        const rx = panelW + 10, rw = w - panelW - 20;
        const pad = 36, gH = h - pad * 2;
        const temps = [200, 300, 500, 800];
        const tColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

        // Draw faint reference curves
        temps.forEach((t, ti) => {
            const origT = this.T;
            this.T = t;
            ctx.beginPath(); ctx.strokeStyle = tColors[ti] + '55'; ctx.lineWidth = 1.5;
            for (let eIdx = 0; eIdx <= 100; eIdx++) {
                const E = eIdx / 20;
                const y = pad + gH - (this.boltzmannN(E * 2e-22) * gH * 0.9);
                const x = rx + pad + (E / 5) * (rw - pad);
                if (eIdx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
            this.T = origT;
        });

        // Active curve (thick + glow)
        ctx.beginPath(); ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 3;
        ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 8;
        for (let eIdx = 0; eIdx <= 100; eIdx++) {
            const E = eIdx / 20;
            const y = pad + gH - (this.boltzmannN(E * 2e-22) * gH * 0.9);
            const x = rx + pad + (E / 5) * (rw - pad);
            if (eIdx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.shadowBlur = 0;

        // Axes
        ctx.strokeStyle = isLight ? '#64748b' : '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rx + pad, pad); ctx.lineTo(rx + pad, pad + gH);
        ctx.lineTo(rx + rw, pad + gH); ctx.stroke();

        ctx.fillStyle = isLight ? '#334155' : '#cbd5e1'; ctx.font = '11px Inter';
        ctx.textAlign = 'center'; ctx.fillText('Energy (ε)', rx + pad + (rw - pad) / 2, h - 6);
        ctx.save(); ctx.translate(rx + 10, pad + gH / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillText('Probability', 0, 0); ctx.restore();
        ctx.font = 'bold 12px Inter';
        ctx.fillText(`T = ${this.T} K  (active)`, rx + pad + (rw - pad) / 2, 18);

        // Entropy readout
        const S = this.entropy();
        const Sel = document.getElementById('statmech-entropy');
        if (Sel) Sel.textContent = S.toFixed(3) + ' J/K';

        // Legend
        temps.forEach((t, ti) => {
            ctx.fillStyle = tColors[ti]; ctx.font = '10px Inter';
            ctx.fillRect(rx + rw - 65, 26 + ti * 14, 10, 8);
            ctx.fillStyle = isLight ? '#334155' : '#cbd5e1'; ctx.textAlign = 'left';
            ctx.fillText(`T=${t}K`, rx + rw - 51, 34 + ti * 14);
        });
    }
};
