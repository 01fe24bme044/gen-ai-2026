// Advanced: Thermodynamic Potentials (U, H, F, G) with interactive sliders
window.thermoPotentials = {
    canvas: null, ctx: null, animationId: null,
    T: 300, S: 50, P: 100, V: 0.5,
    n: 1, R: 8.314,

    init() {
        this.canvas = document.getElementById('potentials-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('potentials-container');
        this.canvas.width = c.clientWidth; this.canvas.height = c.clientHeight;
        this.bindControls(); this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    get U() { return this.n * this.R * this.T * 1.5; },
    get H() { return this.U + this.P * this.V; },
    get F() { return this.U - this.T * this.S; },
    get G() { return this.H - this.T * this.S; },

    bindControls() {
        [['potentials-T', 'T', 'potentials-T-val', ''] , ['potentials-S', 'S', 'potentials-S-val', ''], ['potentials-P', 'P', 'potentials-P-val', ''], ['potentials-V', 'V', 'potentials-V-val', '']].forEach(([id, prop, valId, unit]) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.oninput = e => { this[prop] = parseFloat(e.target.value); const vEl = document.getElementById(valId); if (vEl) vEl.textContent = this[prop]; };
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

        const potentials = [
            { label: 'U (Internal Energy)', value: this.U, color: '#ef4444', formula: 'U = nCvT', desc: 'Total kinetic + potential energy of molecules' },
            { label: 'H (Enthalpy)', value: this.H, color: '#f59e0b', formula: 'H = U + PV', desc: 'Energy available at constant pressure' },
            { label: 'F (Helmholtz)', value: this.F, color: '#3b82f6', formula: 'F = U - TS', desc: 'Work obtainable at constant T and V' },
            { label: 'G (Gibbs)', value: this.G, color: '#10b981', formula: 'G = H - TS', desc: 'Spontaneity driver: ΔG < 0 → spontaneous' }
        ];

        const cardW = w / 2 - 20, cardH = h / 2 - 20;
        const positions = [[10, 10], [w/2 + 10, 10], [10, h/2 + 10], [w/2 + 10, h/2 + 10]];

        potentials.forEach((pot, i) => {
            const [cx, cy] = positions[i];
            const t = Date.now() / 1000;

            // Card background
            ctx.fillStyle = isLight ? `${pot.color}18` : `${pot.color}20`;
            ctx.strokeStyle = pot.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(cx, cy, cardW, cardH, 10) : ctx.rect(cx, cy, cardW, cardH);
            ctx.fill(); ctx.stroke();

            // Value bar
            const maxVal = 15000;
            const barW = (cardW - 40);
            const filled = Math.max(0, Math.min(barW, (this[pot.label[0]] / maxVal) * barW));
            ctx.fillStyle = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
            ctx.fillRect(cx + 20, cy + cardH - 24, barW, 10);
            const barGrad = ctx.createLinearGradient(cx + 20, 0, cx + 20 + filled, 0);
            barGrad.addColorStop(0, pot.color + '99');
            barGrad.addColorStop(1, pot.color);
            ctx.fillStyle = barGrad;
            ctx.fillRect(cx + 20, cy + cardH - 24, filled, 10);

            // Text
            ctx.fillStyle = pot.color;
            ctx.font = 'bold 13px Inter'; ctx.textAlign = 'left';
            ctx.fillText(pot.label, cx + 12, cy + 22);

            ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
            ctx.font = 'bold 22px Outfit';
            ctx.fillText((this[pot.label[0]] / 1000).toFixed(2) + ' kJ', cx + 12, cy + 58);

            ctx.fillStyle = pot.color;
            ctx.font = '11px Inter';
            ctx.fillText(pot.formula, cx + 12, cy + 76);

            ctx.fillStyle = isLight ? '#475569' : '#94a3b8';
            ctx.font = '10.5px Inter';
            // Wrap description
            const words = pot.desc.split(' ');
            let line = '', lineY = cy + 96;
            words.forEach(word => {
                const test = line + word + ' ';
                if (ctx.measureText(test).width > cardW - 24) {
                    ctx.fillText(line, cx + 12, lineY); line = word + ' '; lineY += 14;
                } else { line = test; }
            });
            ctx.fillText(line, cx + 12, lineY);

            // Pulsing glow dot
            const pulse = (Math.sin(t * 2 + i) + 1) / 2;
            ctx.beginPath(); ctx.arc(cx + cardW - 18, cy + 18, 5 + pulse * 3, 0, Math.PI * 2);
            ctx.fillStyle = `${pot.color}${Math.round(80 + pulse * 120).toString(16)}`;
            ctx.fill();
        });
    }
};
