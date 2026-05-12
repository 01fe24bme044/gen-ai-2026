// Advanced: Quantum Thermodynamics — Quantum Heat Engine & Landauer Principle
window.advQuantum = {
    canvas: null, ctx: null, animationId: null,
    T: 300, omega: 1e12,   // oscillator frequency (THz)
    mode: 'engine',        // 'engine' | 'landauer'
    qubits: [],            // for Landauer erasure viz
    cycle: 0, t: 0,
    erasureProgress: 0, erasing: false,
    history: [],

    init() {
        this.canvas = document.getElementById('quantum-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('quantum-container');
        this.canvas.width = c.clientWidth;
        this.canvas.height = c.clientHeight;
        this.t = 0; this.cycle = 0; this.history = [];
        this.spawnQubits();
        this.bindControls();
        this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    // Planck's law: mean photon number
    nBE() {
        const hbar = 1.054e-34, kB = 1.38e-23;
        return 1 / (Math.exp(hbar * this.omega / (kB * this.T)) - 1);
    },

    // Quantum harmonic oscillator ground state energy
    ZPE() {
        const hbar = 1.054e-34;
        return 0.5 * hbar * this.omega * 1e15; // scaled for display (fJ)
    },

    // Von Neumann entropy
    vonNeumann() {
        const n = this.nBE();
        if (n < 1e-6) return 0;
        const kB = 1.38e-23;
        return kB * ((n + 1) * Math.log(n + 1) - n * Math.log(n)) * 1e23;
    },

    // Landauer limit: min energy to erase 1 bit
    landauerLimit() {
        return 1.38e-23 * this.T * Math.log(2) * 1e21; // in zepto-joules
    },

    spawnQubits() {
        this.qubits = [];
        for (let i = 0; i < 8; i++) {
            this.qubits.push({
                state: Math.random() > 0.5 ? 1 : 0,  // 0 or 1
                blochTheta: Math.random() * Math.PI,  // Bloch sphere polar angle
                blochPhi: Math.random() * 2 * Math.PI,
                erased: false,
                heat: 0   // heat generated during erasure
            });
        }
    },

    bindControls() {
        const tSlider = document.getElementById('quantum-T');
        if (tSlider) tSlider.oninput = e => {
            this.T = parseFloat(e.target.value);
            document.getElementById('quantum-T-val').textContent = this.T + ' K';
            this.updateReadouts();
        };
        const oSlider = document.getElementById('quantum-omega');
        if (oSlider) oSlider.oninput = e => {
            this.omega = parseFloat(e.target.value) * 1e12;
            document.getElementById('quantum-omega-val').textContent = (this.omega / 1e12).toFixed(1) + ' THz';
            this.updateReadouts();
        };
        const eraseBtn = document.getElementById('quantum-erase');
        if (eraseBtn) eraseBtn.onclick = () => {
            this.erasing = true; this.erasureProgress = 0;
            this.qubits.forEach(q => { q.erased = false; q.heat = 0; });
        };
        const resetBtn = document.getElementById('quantum-reset');
        if (resetBtn) resetBtn.onclick = () => {
            this.spawnQubits(); this.erasing = false; this.erasureProgress = 0; this.history = [];
        };
        ['engine','landauer'].forEach(m => {
            const btn = document.getElementById(`quantum-mode-${m}`);
            if (btn) btn.onclick = () => { this.mode = m; };
        });
        this.updateReadouts();
    },

    updateReadouts() {
        const nEl = document.getElementById('quantum-nBE');
        if (nEl) nEl.textContent = this.nBE().toFixed(4);
        const vEl = document.getElementById('quantum-vN');
        if (vEl) vEl.textContent = this.vonNeumann().toFixed(3) + ' kB';
        const lEl = document.getElementById('quantum-landauer');
        if (lEl) lEl.textContent = this.landauerLimit().toFixed(3) + ' zJ';
    },

    animate() {
        this.t += 0.04;
        if (this.erasing && this.erasureProgress < 1) {
            this.erasureProgress = Math.min(1, this.erasureProgress + 0.015);
        }
        this.updateReadouts();
        this.drawScene();
        this.animationId = requestAnimationFrame(() => this.animate());
    },

    drawScene() {
        const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
        const isLight = window.app && window.app.theme === 'light';
        ctx.clearRect(0, 0, w, h);

        const halfW = w / 2;

        // ── LEFT: Quantum Oscillator Energy Levels ──
        const levels = 6;
        const levelSpacing = (h - 80) / (levels + 1);
        const lx = halfW * 0.15, rxx = halfW * 0.85;
        const baseY = h - 30;
        const hbar = 1.054e-34;
        const E0 = 0.5 * hbar * this.omega;

        ctx.fillStyle = isLight ? '#334155' : '#cbd5e1';
        ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
        ctx.fillText('Quantum Energy Levels', halfW / 2, 18);

        for (let n = 0; n < levels; n++) {
            const y = baseY - (n + 0.5) * levelSpacing;
            const En_display = (n + 0.5).toFixed(1);  // in ℏω units

            // Occupation probability
            const kB = 1.38e-23, beta = 1 / (kB * this.T);
            const Z = Array.from({length: 12}, (_, k) => Math.exp(-beta * (k + 0.5) * hbar * this.omega)).reduce((a, b) => a + b, 0);
            const prob = Math.exp(-beta * (n + 0.5) * hbar * this.omega) / Z;

            // Color by occupation
            const hue = 240 - prob * 200;
            ctx.strokeStyle = `hsl(${hue},80%,55%)`;
            ctx.lineWidth = 2.5 + prob * 5;
            ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(rxx, y); ctx.stroke();

            // Label
            ctx.fillStyle = `hsl(${hue},80%,55%)`; ctx.font = '11px Inter'; ctx.textAlign = 'right';
            ctx.fillText(`n=${n}  E=(${En_display})ℏω`, lx - 4, y + 4);

            // Population bar
            const barMaxW = halfW * 0.35;
            ctx.fillStyle = `hsla(${hue},80%,55%,0.3)`;
            ctx.fillRect(rxx + 5, y - 5, prob * barMaxW, 10);
            ctx.strokeStyle = `hsl(${hue},80%,55%)`; ctx.lineWidth = 1;
            ctx.strokeRect(rxx + 5, y - 5, barMaxW, 10);
            ctx.fillStyle = `hsl(${hue},80%,55%)`; ctx.font = '10px Inter'; ctx.textAlign = 'left';
            ctx.fillText((prob * 100).toFixed(1) + '%', rxx + 8 + prob * barMaxW, y + 4);

            // Oscillating probability cloud
            if (n === 0) {
                const waveX = halfW * 0.5;
                const A = 14 * prob;
                ctx.beginPath(); ctx.strokeStyle = `hsla(${hue},80%,65%,0.5)`; ctx.lineWidth = 1.5;
                for (let xi = -30; xi <= 30; xi++) {
                    const psi2 = Math.exp(-xi * xi / 80) * Math.cos(xi * 0.3 + this.t) ** 2;
                    const px = waveX + xi * 1.2;
                    const py = y - psi2 * A;
                    if (xi === -30) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
        }

        // ZPE label
        ctx.fillStyle = '#a855f7'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'left';
        ctx.fillText(`ZPE = ½ℏω  (T=${this.T}K)`, lx, h - 6);

        // ── RIGHT: Landauer Erasure ──
        ctx.fillStyle = isLight ? '#334155' : '#cbd5e1'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
        ctx.fillText("Landauer's Erasure Principle", halfW + (w - halfW) / 2, 18);
        ctx.fillStyle = isLight ? '#475569' : '#94a3b8'; ctx.font = '10px Inter';
        ctx.fillText("Erasing 1 bit releases ≥ kBT·ln(2) heat", halfW + (w - halfW) / 2, 33);

        // Draw qubits as Bloch-sphere-inspired circles
        const qPerRow = 4, qSpacingX = (w - halfW - 30) / qPerRow;
        const qSpacingY = 90;
        this.qubits.forEach((q, i) => {
            const col = i % qPerRow, row = Math.floor(i / qPerRow);
            const qx = halfW + 20 + col * qSpacingX + qSpacingX / 2;
            const qy = 60 + row * qSpacingY;

            // Erasure progress for this qubit
            const myProgress = Math.max(0, Math.min(1, this.erasureProgress * 8 - i));
            const erased = myProgress >= 1;

            // Bloch sphere (simplified)
            const r = 24;
            ctx.beginPath(); ctx.arc(qx, qy, r, 0, Math.PI * 2);
            ctx.fillStyle = erased ? 'rgba(16,185,129,0.15)' : `rgba(168,85,247,0.15)`;
            ctx.fill();
            ctx.strokeStyle = erased ? '#10b981' : '#a855f7'; ctx.lineWidth = 2;
            ctx.stroke();

            // Equator line
            ctx.beginPath(); ctx.ellipse(qx, qy, r, r * 0.3, 0, 0, Math.PI * 2);
            ctx.strokeStyle = (erased ? '#10b981' : '#a855f7') + '55'; ctx.lineWidth = 1; ctx.stroke();

            // State vector arrow
            const theta = erased ? 0 : q.blochTheta + (this.erasing ? myProgress * Math.PI : 0);
            const vx2 = Math.sin(theta) * r * 0.8;
            const vy2 = -Math.cos(theta) * r * 0.8;
            ctx.strokeStyle = erased ? '#10b981' : '#a855f7'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(qx + vx2, qy + vy2); ctx.stroke();

            // Arrowhead
            const ang = Math.atan2(vy2, vx2);
            ctx.beginPath();
            ctx.moveTo(qx + vx2, qy + vy2);
            ctx.lineTo(qx + vx2 - 6 * Math.cos(ang - 0.4), qy + vy2 - 6 * Math.sin(ang - 0.4));
            ctx.lineTo(qx + vx2 - 6 * Math.cos(ang + 0.4), qy + vy2 - 6 * Math.sin(ang + 0.4));
            ctx.closePath(); ctx.fill();

            // Label
            ctx.fillStyle = erased ? '#10b981' : (isLight ? '#334155' : '#cbd5e1');
            ctx.font = 'bold 10px Inter'; ctx.textAlign = 'center';
            ctx.fillText(erased ? '|0⟩ ✓' : `|${q.state}⟩`, qx, qy + r + 14);

            // Heat released badge
            if (erased) {
                const heat = this.landauerLimit().toFixed(1);
                ctx.fillStyle = '#ef4444'; ctx.font = '9px Inter';
                ctx.fillText(`+${heat} zJ`, qx, qy + r + 26);
            }
        });

        // Total heat released
        const erasedCount = Math.floor(this.erasureProgress * this.qubits.length);
        const totalHeat = erasedCount * this.landauerLimit();
        ctx.fillStyle = '#ef4444'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
        ctx.fillText(`Heat released = ${totalHeat.toFixed(2)} zJ`, halfW + (w - halfW) / 2, h - 16);
        ctx.fillStyle = isLight ? '#475569' : '#94a3b8'; ctx.font = '10px Inter';
        ctx.fillText(`Landauer limit = kBT·ln2 = ${this.landauerLimit().toFixed(2)} zJ/bit`, halfW + (w - halfW) / 2, h - 4);
    }
};
