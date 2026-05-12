// Advanced: Classical Thermodynamics
window.advClassical = {
    canvas: null, ctx: null, animationId: null,
    process: 'isothermal',
    progress: 0, running: false,
    V1: 1.0, V2: 3.0, T: 400, P1: 5, gamma: 1.4,
    history: [],

    init() {
        this.canvas = document.getElementById('adv-classical-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('adv-classical-container');
        this.canvas.width = c.clientWidth; this.canvas.height = c.clientHeight;
        this.history = []; this.progress = 0; this.running = false;
        this.bindControls(); this.drawStatic();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    bindControls() {
        ['isothermal','isobaric','isochoric','adiabatic'].forEach(proc => {
            const btn = document.getElementById(`classical-${proc}`);
            if (!btn) return;
            btn.onclick = () => { this.process = proc; this.history = []; this.progress = 0; this.running = false; this.updateInfo(); };
        });
        const runBtn = document.getElementById('classical-run');
        if (runBtn) runBtn.onclick = () => { this.running = true; this.history = []; this.progress = 0; this.animate(); };
        const resetBtn = document.getElementById('classical-reset');
        if (resetBtn) resetBtn.onclick = () => { this.running = false; this.stop(); this.history = []; this.progress = 0; this.drawStatic(); };

        const tSlider = document.getElementById('classical-temp');
        if (tSlider) tSlider.oninput = e => { this.T = parseInt(e.target.value); document.getElementById('classical-temp-val').textContent = this.T + ' K'; };
        this.updateInfo();
    },

    getP(V) {
        const R = 8.314, n = 1;
        switch(this.process) {
            case 'isothermal': return (n * R * this.T) / V;
            case 'isobaric':   return this.P1;
            case 'isochoric':  return (V === this.V1) ? this.P1 * (this.T / 300) : this.P1;
            case 'adiabatic':  return this.P1 * Math.pow(this.V1 / V, this.gamma);
        }
        return 1;
    },

    calcWork() {
        const R = 8.314, n = 1;
        switch(this.process) {
            case 'isothermal': return n * R * this.T * Math.log(this.V2 / this.V1);
            case 'isobaric':   return this.P1 * (this.V2 - this.V1) * 1000;
            case 'isochoric':  return 0;
            case 'adiabatic':  return (this.P1 * this.V1 * 1000 - this.getP(this.V2) * this.V2 * 1000) / (this.gamma - 1);
        }
    },

    updateInfo() {
        const W = this.calcWork();
        const Wel = document.getElementById('classical-work'); if (Wel) Wel.textContent = W.toFixed(0) + ' J';
        const procColors = { isothermal: '#3b82f6', isobaric: '#10b981', isochoric: '#f59e0b', adiabatic: '#ef4444' };
        const Iel = document.getElementById('classical-proc-label');
        if (Iel) { Iel.textContent = this.process.toUpperCase(); Iel.style.color = procColors[this.process] || '#fff'; }
    },

    animate() {
        if (!this.running) return;
        this.progress = Math.min(1, this.progress + 0.008);
        this.drawScene(this.progress);
        if (this.progress < 1) this.animationId = requestAnimationFrame(() => this.animate());
        else { this.running = false; window.app && window.app.addXP(5); }
    },

    drawStatic() { this.drawScene(0); },

    drawScene(prog) {
        const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
        const isLight = window.app && window.app.theme === 'light';
        ctx.clearRect(0, 0, w, h);

        const pad = 55, gW = w - pad * 2, gH = h - pad * 2;
        const pMax = 45, vMin = 0.5, vMax = 4;

        // Grid
        ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const x = pad + (i / 5) * gW, y = pad + (i / 5) * gH;
            ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, pad + gH); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + gW, y); ctx.stroke();
        }
        // Axes
        ctx.strokeStyle = isLight ? '#64748b' : '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, pad + gH); ctx.lineTo(pad + gW, pad + gH); ctx.stroke();
        // Labels
        ctx.fillStyle = isLight ? '#334155' : '#cbd5e1'; ctx.font = 'bold 13px Inter';
        ctx.textAlign = 'center'; ctx.fillText('Volume (L)', pad + gW / 2, h - 8);
        ctx.save(); ctx.translate(14, pad + gH / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillText('Pressure (kPa)', 0, 0); ctx.restore();

        const toX = V => pad + ((V - vMin) / (vMax - vMin)) * gW;
        const toY = P => pad + gH - ((P - 0) / pMax) * gH;

        // Draw reference curves (all 4) faded
        const allProcs = ['isothermal','isobaric','isochoric','adiabatic'];
        const allColors = { isothermal: '#3b82f680', isobaric: '#10b98140', isochoric: '#f59e0b40', adiabatic: '#ef444440' };
        allProcs.forEach(proc => {
            const origProc = this.process;
            this.process = proc;
            const steps = 80;
            ctx.beginPath(); ctx.strokeStyle = allColors[proc]; ctx.lineWidth = 1.5;
            for (let i = 0; i <= steps; i++) {
                const V = this.V1 + (this.V2 - this.V1) * (i / steps);
                const P = this.getP(V) / 1000;
                const x = toX(V), y = toY(P);
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
            this.process = origProc;
        });

        // Draw active curve animated
        const procColors = { isothermal: '#3b82f6', isobaric: '#10b981', isochoric: '#f59e0b', adiabatic: '#ef4444' };
        const color = procColors[this.process] || '#fff';
        const steps = 120;
        ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 3;
        ctx.shadowColor = color; ctx.shadowBlur = 8;
        const endIdx = Math.floor(prog * steps);
        let lastX, lastY;
        for (let i = 0; i <= endIdx; i++) {
            const V = this.V1 + (this.V2 - this.V1) * (i / steps);
            const P = this.getP(V) / 1000;
            const x = toX(V), y = toY(P);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            lastX = x; lastY = y;
        }
        ctx.stroke(); ctx.shadowBlur = 0;

        // Moving dot
        if (prog > 0 && lastX !== undefined) {
            ctx.beginPath(); ctx.arc(lastX, lastY, 7, 0, Math.PI * 2);
            ctx.fillStyle = color; ctx.fill();
        }

        // Start & end points
        const P1kPa = this.getP(this.V1) / 1000, P2kPa = this.getP(this.V2) / 1000;
        [[this.V1, P1kPa, '1'], [this.V2, P2kPa, '2']].forEach(([V, P, lbl]) => {
            ctx.beginPath(); ctx.arc(toX(V), toY(P), 8, 0, Math.PI * 2);
            ctx.fillStyle = isLight ? '#1e293b' : '#f8fafc'; ctx.fill();
            ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = isLight ? '#1e293b' : '#f8fafc'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
            ctx.fillText(lbl, toX(V), toY(P) - 14);
        });
        this.updateInfo();
    }
};
