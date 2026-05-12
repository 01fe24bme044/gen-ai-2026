// Advanced: Maxwell Relations — The Thermodynamic Square
window.advMaxwell = {
    canvas: null, ctx: null, animationId: null,
    highlighted: null,  // which corner/side is active
    T: 300, P: 101.325, V: 0.0224, S: 50,
    pulseT: 0,

    relations: [
        { label: '(∂T/∂V)_S = −(∂P/∂S)_V', corners: ['T','V','S'], color: '#ef4444', from: 'U', desc: 'From Internal Energy' },
        { label: '(∂T/∂P)_S = (∂V/∂S)_P',  corners: ['T','P','S'], color: '#f59e0b', from: 'H', desc: 'From Enthalpy' },
        { label: '(∂P/∂T)_V = (∂S/∂V)_T',  corners: ['P','T','V'], color: '#3b82f6', from: 'F', desc: 'From Helmholtz' },
        { label: '(∂V/∂T)_P = −(∂S/∂P)_T', corners: ['V','T','P'], color: '#10b981', from: 'G', desc: 'From Gibbs' }
    ],

    init() {
        this.canvas = document.getElementById('maxwell-rel-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('maxwell-rel-container');
        this.canvas.width = c.clientWidth;
        this.canvas.height = c.clientHeight;
        this.highlighted = null;
        this.pulseT = 0;
        this.bindControls();
        this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    bindControls() {
        this.relations.forEach((rel, i) => {
            const btn = document.getElementById(`maxwell-rel-${i}`);
            if (!btn) return;
            btn.onclick = () => {
                this.highlighted = this.highlighted === i ? null : i;
                document.getElementById('maxwell-rel-info').textContent = rel.label + '  (' + rel.desc + ')';
                window.app && window.app.addXP(3);
            };
        });
        const tSlider = document.getElementById('maxwell-T-slider');
        if (tSlider) tSlider.oninput = e => {
            this.T = parseFloat(e.target.value);
            document.getElementById('maxwell-T-val').textContent = this.T + ' K';
        };
    },

    animate() {
        this.pulseT += 0.04;
        this.drawScene();
        this.animationId = requestAnimationFrame(() => this.animate());
    },

    drawScene() {
        const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
        const isLight = window.app && window.app.theme === 'light';
        ctx.clearRect(0, 0, w, h);

        const cx = w * 0.38, cy = h / 2;
        const size = Math.min(w * 0.28, h * 0.42);

        // Corner positions: T=top, S=right, V=bottom, P=left  (Thermodynamic Square layout)
        const corners = {
            T: { x: cx,        y: cy - size, label: 'T', color: '#ef4444' },
            S: { x: cx + size, y: cy,        label: 'S', color: '#10b981' },
            V: { x: cx,        y: cy + size, label: 'V', color: '#3b82f6' },
            P: { x: cx - size, y: cy,        label: 'P', color: '#f59e0b' }
        };

        // Potential labels at sides
        const sides = [
            { x: cx + size * 0.55, y: cy - size * 0.55, label: 'H', color: '#f59e0b' },
            { x: cx + size * 0.55, y: cy + size * 0.55, label: 'G', color: '#10b981' },
            { x: cx - size * 0.55, y: cy - size * 0.55, label: 'U', color: '#ef4444' },
            { x: cx - size * 0.55, y: cy + size * 0.55, label: 'F', color: '#3b82f6' }
        ];

        // Draw square edges
        const cArr = [corners.T, corners.S, corners.V, corners.P];
        ctx.beginPath();
        ctx.moveTo(cArr[0].x, cArr[0].y);
        cArr.forEach(c => ctx.lineTo(c.x, c.y));
        ctx.closePath();
        ctx.strokeStyle = isLight ? 'rgba(71,85,105,0.5)' : 'rgba(148,163,184,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw diagonals
        ctx.beginPath(); ctx.moveTo(corners.T.x, corners.T.y); ctx.lineTo(corners.V.x, corners.V.y);
        ctx.moveTo(corners.S.x, corners.S.y); ctx.lineTo(corners.P.x, corners.P.y);
        ctx.strokeStyle = isLight ? 'rgba(71,85,105,0.25)' : 'rgba(148,163,184,0.15)';
        ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);

        // Highlight active relation edges
        if (this.highlighted !== null) {
            const rel = this.relations[this.highlighted];
            const pulse = 0.5 + 0.5 * Math.sin(this.pulseT * 3);
            ctx.strokeStyle = rel.color;
            ctx.lineWidth = 4 + pulse * 2;
            ctx.shadowColor = rel.color; ctx.shadowBlur = 14 * pulse;
            ctx.beginPath();
            ctx.moveTo(corners[rel.corners[0]].x, corners[rel.corners[0]].y);
            ctx.lineTo(corners[rel.corners[1]].x, corners[rel.corners[1]].y);
            ctx.lineTo(corners[rel.corners[2]].x, corners[rel.corners[2]].y);
            ctx.stroke(); ctx.shadowBlur = 0;
        }

        // Draw corner nodes
        Object.values(corners).forEach(c => {
            const pulse = 0.5 + 0.5 * Math.sin(this.pulseT + c.x);
            ctx.beginPath(); ctx.arc(c.x, c.y, 20 + pulse * 3, 0, Math.PI * 2);
            ctx.fillStyle = c.color + '33'; ctx.fill();
            ctx.strokeStyle = c.color; ctx.lineWidth = 2.5; ctx.stroke();
            ctx.fillStyle = c.color; ctx.font = 'bold 18px Outfit'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(c.label, c.x, c.y);
        });

        // Draw potential labels at sides
        sides.forEach(s => {
            ctx.fillStyle = s.color + 'cc'; ctx.font = 'bold 14px Outfit'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.shadowColor = s.color; ctx.shadowBlur = 6;
            ctx.fillText(s.label, s.x, s.y); ctx.shadowBlur = 0;
        });

        // Title
        ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc'; ctx.font = 'bold 15px Inter'; ctx.textAlign = 'center';
        ctx.fillText('The Thermodynamic Square', cx, 24);

        // Right panel: current numeric values
        const rx = w * 0.74;
        const vals = [
            { lbl: 'T', val: this.T.toFixed(0) + ' K', color: '#ef4444' },
            { lbl: 'P', val: this.P.toFixed(1) + ' kPa', color: '#f59e0b' },
            { lbl: 'V', val: this.V.toFixed(4) + ' m³', color: '#3b82f6' },
            { lbl: 'S', val: this.S.toFixed(1) + ' J/K', color: '#10b981' }
        ];
        vals.forEach((v, i) => {
            const vy = h * 0.25 + i * 50;
            ctx.beginPath(); ctx.arc(rx, vy, 18, 0, Math.PI * 2);
            ctx.fillStyle = v.color + '22'; ctx.fill();
            ctx.strokeStyle = v.color; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = v.color; ctx.font = 'bold 14px Outfit'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(v.lbl, rx, vy);
            ctx.fillStyle = isLight ? '#334155' : '#cbd5e1'; ctx.font = '12px Inter'; ctx.textAlign = 'left';
            ctx.fillText(v.val, rx + 26, vy + 1);
        });

        ctx.fillStyle = isLight ? '#64748b' : '#94a3b8'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
        ctx.fillText('Live State Variables', rx, h * 0.22);
    }
};
