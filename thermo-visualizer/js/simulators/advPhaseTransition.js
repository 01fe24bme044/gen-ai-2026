// Advanced: Phase Transitions — Landau Theory & Order Parameter
window.advPhase = {
    canvas: null, ctx: null, animationId: null,
    T: 350, Tc: 373,  // Critical temperature (water boiling)
    orderParam: 0,
    particles: [],
    mode: 'potential',  // 'potential' | 'molecules'
    t: 0,

    init() {
        this.canvas = document.getElementById('adv-phase-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('adv-phase-container');
        this.canvas.width = c.clientWidth;
        this.canvas.height = c.clientHeight;
        this.spawnMolecules();
        this.bindControls();
        this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    spawnMolecules() {
        this.particles = [];
        const w = this.canvas.width, h = this.canvas.height;
        const half = Math.min(w, h) * 0.45;
        for (let i = 0; i < 80; i++) {
            this.particles.push({
                x: w / 2 + (Math.random() - 0.5) * half * 2,
                y: h / 2 + (Math.random() - 0.5) * half * 2,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                phase: 'solid', r: 5
            });
        }
    },

    // Landau free energy: f = a(T-Tc)η² + bη⁴
    landau(eta, T) {
        const a = 0.5, b = 0.3;
        return a * (T - this.Tc) * eta * eta + b * eta * eta * eta * eta;
    },

    getPhase() {
        if (this.T < this.Tc * 0.85) return 'solid';
        if (this.T < this.Tc) return 'liquid';
        return 'gas';
    },

    bindControls() {
        const tSlider = document.getElementById('adv-phase-T');
        if (tSlider) tSlider.oninput = e => {
            this.T = parseFloat(e.target.value);
            document.getElementById('adv-phase-T-val').textContent = this.T.toFixed(0) + ' K';
            this.updatePhaseLabel();
        };
        const tcSlider = document.getElementById('adv-phase-Tc');
        if (tcSlider) tcSlider.oninput = e => {
            this.Tc = parseFloat(e.target.value);
            document.getElementById('adv-phase-Tc-val').textContent = this.Tc.toFixed(0) + ' K';
            this.updatePhaseLabel();
        };
        ['potential','molecules'].forEach(m => {
            const btn = document.getElementById(`adv-phase-mode-${m}`);
            if (btn) btn.onclick = () => { this.mode = m; };
        });
        this.updatePhaseLabel();
    },

    updatePhaseLabel() {
        const el = document.getElementById('adv-phase-state');
        if (!el) return;
        const phase = this.getPhase();
        const colors = { solid: '#3b82f6', liquid: '#10b981', gas: '#ef4444' };
        el.textContent = phase.toUpperCase();
        el.style.color = colors[phase];
    },

    animate() {
        this.t++;
        this.updateParticles();
        this.drawScene();
        this.animationId = requestAnimationFrame(() => this.animate());
    },

    updateParticles() {
        const w = this.canvas.width / 2, h = this.canvas.height;
        const phase = this.getPhase();
        const speedMult = phase === 'gas' ? 3.5 : phase === 'liquid' ? 1.2 : 0.2;
        const attract = phase === 'solid' ? 0.08 : phase === 'liquid' ? 0.01 : 0;
        const cx = this.canvas.width * 0.75, cy = h / 2;

        this.particles.forEach((p, i) => {
            // Spring toward lattice site for solid, free for gas
            if (phase === 'solid') {
                const lx = cx + ((i % 10) - 4.5) * 16;
                const ly = cy + (Math.floor(i / 10) - 4) * 16;
                p.vx += (lx - p.x) * 0.04 + (Math.random() - 0.5) * 0.4;
                p.vy += (ly - p.y) * 0.04 + (Math.random() - 0.5) * 0.4;
            } else {
                p.vx += (Math.random() - 0.5) * speedMult * 0.5;
                p.vy += (Math.random() - 0.5) * speedMult * 0.5;
                // attract toward center for liquid
                p.vx += (cx - p.x) * attract;
                p.vy += (cy - p.y) * attract;
            }
            // Damping
            const damp = phase === 'gas' ? 0.99 : 0.85;
            p.vx *= damp; p.vy *= damp;
            p.x += p.vx; p.y += p.vy;

            // Boundary
            const margin = 20;
            const minX = this.canvas.width / 2 + margin, maxX = this.canvas.width - margin;
            const minY = margin, maxY = this.canvas.height - margin;
            if (p.x < minX) { p.x = minX; p.vx *= -0.7; }
            if (p.x > maxX) { p.x = maxX; p.vx *= -0.7; }
            if (p.y < minY) { p.y = minY; p.vy *= -0.7; }
            if (p.y > maxY) { p.y = maxY; p.vy *= -0.7; }
        });
    },

    drawScene() {
        const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
        const isLight = window.app && window.app.theme === 'light';
        ctx.clearRect(0, 0, w, h);

        const halfW = w / 2;

        // ── LEFT: Landau Free Energy Potential ──
        const gPad = 40, gW = halfW - gPad - 10, gH = h - gPad * 2;
        const etaMin = -2, etaMax = 2, fMin = -2, fMax = 5;

        // Axes
        ctx.strokeStyle = isLight ? '#64748b' : '#94a3b8'; ctx.lineWidth = 2;
        const x0 = gPad, y0 = gPad + gH / 2;
        ctx.beginPath(); ctx.moveTo(x0, gPad); ctx.lineTo(x0, gPad + gH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + gW, y0); ctx.stroke();

        ctx.fillStyle = isLight ? '#334155' : '#cbd5e1'; ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('f (Free Energy)', x0 + gW / 2, gPad - 10);
        ctx.fillText('η (Order Parameter)', x0 + gW / 2, h - 8);
        ctx.fillText('← disordered | ordered →', x0 + gW / 2, gPad + gH + 18);

        const toX = eta => x0 + ((eta - etaMin) / (etaMax - etaMin)) * gW;
        const toY = f => y0 - (f / fMax) * (gH / 2);

        // Draw potential for different T values (faded)
        [[300, '#3b82f6'], [this.Tc, '#f59e0b'], [450, '#ef4444']].forEach(([t, col]) => {
            ctx.beginPath(); ctx.strokeStyle = col + '55'; ctx.lineWidth = 1.5;
            for (let i = 0; i <= 100; i++) {
                const eta = etaMin + (etaMax - etaMin) * i / 100;
                const f = this.landau(eta, t);
                const px = toX(eta), py = toY(f);
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        });

        // Active curve (thick + glow)
        const activeColor = this.T < this.Tc ? '#10b981' : '#ef4444';
        ctx.beginPath(); ctx.strokeStyle = activeColor; ctx.lineWidth = 3;
        ctx.shadowColor = activeColor; ctx.shadowBlur = 8;
        for (let i = 0; i <= 100; i++) {
            const eta = etaMin + (etaMax - etaMin) * i / 100;
            const f = this.landau(eta, this.T);
            const px = toX(eta), py = toY(f);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke(); ctx.shadowBlur = 0;

        // Mark minima
        const findMinima = () => {
            const a = 0.5, b = 0.3, eps = this.T - this.Tc;
            if (eps >= 0) return [0];
            const eta0 = Math.sqrt(-a * eps / (2 * b));
            return [-eta0, eta0];
        };
        findMinima().forEach(eta => {
            const f = this.landau(eta, this.T);
            ctx.beginPath(); ctx.arc(toX(eta), toY(f), 6, 0, Math.PI * 2);
            ctx.fillStyle = activeColor; ctx.fill();
        });

        // Label T, Tc
        ctx.fillStyle = isLight ? '#334155' : '#cbd5e1'; ctx.font = '11px Inter'; ctx.textAlign = 'left';
        ctx.fillText(`T = ${this.T.toFixed(0)} K`, x0 + 4, gPad + 16);
        ctx.fillText(`Tc = ${this.Tc.toFixed(0)} K`, x0 + 4, gPad + 30);

        // ── RIGHT: Molecule Animation ──
        // Container box
        ctx.strokeStyle = isLight ? 'rgba(71,85,105,0.5)' : 'rgba(148,163,184,0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(halfW + 5, 5, w - halfW - 10, h - 10);

        const phase = this.getPhase();
        const phaseColors = { solid: '#3b82f6', liquid: '#10b981', gas: '#ef4444' };
        const pColor = phaseColors[phase];

        // Phase label inside right panel
        ctx.fillStyle = pColor + '22';
        ctx.fillRect(halfW + 6, 6, w - halfW - 12, h - 12);
        ctx.fillStyle = pColor; ctx.font = 'bold 14px Outfit'; ctx.textAlign = 'center';
        ctx.fillText(phase.toUpperCase(), halfW + (w - halfW) / 2, 28);

        // Draw molecules
        this.particles.forEach(p => {
            const hue = phase === 'solid' ? 210 : phase === 'liquid' ? 155 : 5;
            const rGrad = ctx.createRadialGradient(p.x - 1, p.y - 1, 0, p.x, p.y, p.r);
            rGrad.addColorStop(0, '#fff');
            rGrad.addColorStop(0.5, `hsl(${hue},80%,60%)`);
            rGrad.addColorStop(1,   `hsl(${hue},80%,30%)`);
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = rGrad; ctx.fill();
        });

        // Intermolecular bond lines (only solid/liquid)
        if (phase !== 'gas') {
            const dist = phase === 'solid' ? 22 : 30;
            ctx.strokeStyle = pColor + '33'; ctx.lineWidth = 1;
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    if (Math.sqrt(dx*dx+dy*dy) < dist) {
                        ctx.beginPath();
                        ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }
};
