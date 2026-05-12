// Advanced: Non-Equilibrium Thermodynamics — Entropy Production & Dissipative Structures
window.advNonEq = {
    canvas: null, ctx: null, animationId: null,
    Thot: 600, Tcold: 300,
    sigmaTot: 0, t: 0,
    fluxParticles: [],
    mode: 'flux',  // 'flux' | 'entropy'
    history: [],

    init() {
        this.canvas = document.getElementById('noneq-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('noneq-container');
        this.canvas.width = c.clientWidth;
        this.canvas.height = c.clientHeight;
        this.sigmaTot = 0; this.t = 0; this.history = [];
        this.spawnFlux();
        this.bindControls();
        this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    spawnFlux() {
        this.fluxParticles = [];
        for (let i = 0; i < 40; i++) {
            this.fluxParticles.push({
                x: 0, y: 20 + Math.random() * (this.canvas.height - 40),
                vx: 1.5 + Math.random() * 2,
                progress: Math.random(),
                energy: this.Thot / 1000 + Math.random() * 0.3
            });
        }
    },

    entropyProduction() {
        // σ = J_Q (1/Tc - 1/Th) in simplified form
        const JQ = (this.Thot - this.Tcold) * 0.5;  // heat flux proportional to ΔT
        return JQ * (1 / this.Tcold - 1 / this.Thot);
    },

    bindControls() {
        const thSlider = document.getElementById('noneq-Th');
        if (thSlider) thSlider.oninput = e => {
            this.Thot = parseFloat(e.target.value);
            document.getElementById('noneq-Th-val').textContent = this.Thot + ' K';
        };
        const tcSlider = document.getElementById('noneq-Tc');
        if (tcSlider) tcSlider.oninput = e => {
            this.Tcold = parseFloat(e.target.value);
            document.getElementById('noneq-Tc-val').textContent = this.Tcold + ' K';
        };
        const resetBtn = document.getElementById('noneq-reset');
        if (resetBtn) resetBtn.onclick = () => { this.sigmaTot = 0; this.t = 0; this.history = []; };
    },

    animate() {
        this.t++;
        const sigma = this.entropyProduction();
        this.sigmaTot += sigma * 0.01;
        if (this.t % 4 === 0) {
            this.history.push(this.sigmaTot);
            if (this.history.length > 200) this.history.shift();
        }
        const sigEl = document.getElementById('noneq-sigma');
        if (sigEl) sigEl.textContent = this.sigmaTot.toFixed(3) + ' J/K';
        this.drawScene(sigma);
        this.animationId = requestAnimationFrame(() => this.animate());
    },

    drawScene(sigma) {
        const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
        const isLight = window.app && window.app.theme === 'light';
        ctx.clearRect(0, 0, w, h);

        const halfW = w / 2;

        // ── LEFT: Heat Flux Animation ──
        const hotColor = `hsl(${Math.max(0, 30 - (this.Thot / 800) * 30)},100%,55%)`;
        const coldColor = `hsl(${200 + (this.Tcold / 600) * 20},80%,55%)`;

        // Reservoirs
        const resH = h - 20;
        const resW = halfW * 0.22;

        // Hot reservoir
        const hotGrad = ctx.createLinearGradient(10, 0, 10 + resW, 0);
        hotGrad.addColorStop(0, '#ef444488'); hotGrad.addColorStop(1, '#f9731688');
        ctx.fillStyle = hotGrad;
        ctx.fillRect(10, 10, resW, resH);
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, resW, resH);
        ctx.fillStyle = '#ef4444'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
        ctx.fillText('HOT', 10 + resW / 2, h / 2 - 8);
        ctx.fillText(`T_H=${this.Thot}K`, 10 + resW / 2, h / 2 + 8);

        // Cold reservoir
        const coldGrad = ctx.createLinearGradient(halfW - 10 - resW, 0, halfW - 10, 0);
        coldGrad.addColorStop(0, '#3b82f688'); coldGrad.addColorStop(1, '#06b6d488');
        ctx.fillStyle = coldGrad;
        ctx.fillRect(halfW - 10 - resW, 10, resW, resH);
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
        ctx.strokeRect(halfW - 10 - resW, 10, resW, resH);
        ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
        ctx.fillText('COLD', halfW - 10 - resW / 2, h / 2 - 8);
        ctx.fillText(`T_C=${this.Tcold}K`, halfW - 10 - resW / 2, h / 2 + 8);

        // System box in middle
        const sysX = 10 + resW + 8, sysW = halfW - 2 * (resW + 18);
        ctx.fillStyle = isLight ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.15)';
        ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2;
        ctx.fillRect(sysX, 10, sysW, resH);
        ctx.strokeRect(sysX, 10, sysW, resH);
        ctx.fillStyle = '#a855f7'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
        ctx.fillText('SYSTEM', sysX + sysW / 2, h / 2 - 8);
        ctx.fillText('σ_irr > 0', sysX + sysW / 2, h / 2 + 8);

        // Flux particles
        const fluxScale = (this.Thot - this.Tcold) / 400;
        this.fluxParticles.forEach(p => {
            p.progress = (p.progress + 0.008 * fluxScale) % 1;
            const px = (10 + resW) + p.progress * (halfW - 20 - 2 * resW);
            const py = p.y;
            let hue = 240 - p.progress * 240;
            const speed = Math.abs(p.vx);
            ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${hue},90%,60%)`; ctx.fill();
            ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue},90%,60%,0.25)`; ctx.fill();
        });

        // Entropy production label
        ctx.fillStyle = '#a855f7'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
        ctx.fillText(`σ = ${sigma.toFixed(4)} W/K`, halfW / 2, h - 6);

        // ── RIGHT: Cumulative Entropy Production Plot ──
        const rx = halfW + 8, rw = w - halfW - 16;
        const pad = 36, gH = h - pad * 2;

        // Background
        ctx.fillStyle = isLight ? 'rgba(168,85,247,0.05)' : 'rgba(168,85,247,0.08)';
        ctx.fillRect(rx, pad, rw, gH);

        // Grid
        ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            ctx.beginPath(); ctx.moveTo(rx, pad + (i / 4) * gH); ctx.lineTo(rx + rw, pad + (i / 4) * gH); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = isLight ? '#64748b' : '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(rx, pad); ctx.lineTo(rx, pad + gH); ctx.lineTo(rx + rw, pad + gH); ctx.stroke();

        ctx.fillStyle = isLight ? '#334155' : '#cbd5e1'; ctx.font = '11px Inter'; ctx.textAlign = 'center';
        ctx.fillText('Cumulative Entropy Production (S_irr)', rx + rw / 2, h - 6);
        ctx.save(); ctx.translate(rx - 14, pad + gH / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillText('S (J/K)', 0, 0); ctx.restore();

        // Plot
        if (this.history.length > 2) {
            const maxS = Math.max(...this.history, 0.001);
            ctx.beginPath(); ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2.5;
            ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 6;
            this.history.forEach((s, i) => {
                const x = rx + (i / 200) * rw;
                const y = pad + gH - (s / maxS) * gH;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            });
            ctx.stroke(); ctx.shadowBlur = 0;

            // Shade area under curve
            ctx.beginPath(); ctx.moveTo(rx, pad + gH);
            this.history.forEach((s, i) => {
                const x = rx + (i / 200) * rw;
                const y = pad + gH - (s / maxS) * gH;
                ctx.lineTo(x, y);
            });
            ctx.lineTo(rx + (this.history.length / 200) * rw, pad + gH);
            ctx.closePath();
            ctx.fillStyle = 'rgba(168,85,247,0.12)'; ctx.fill();
        }

        ctx.fillStyle = '#a855f7'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
        ctx.fillText('2nd Law: ΔS_irr ≥ 0 always!', rx + rw / 2, pad - 8);
    }
};
