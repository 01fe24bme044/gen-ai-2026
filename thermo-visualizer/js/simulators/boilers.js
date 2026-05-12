/**
 * Steam Boilers — pseudo-3D drum + burner flame + saturation-aware steam
 */
window.boilers = {
    canvas: null,
    ctx: null,
    animationId: null,
    resizeObserver: null,
    pressure: 1.013,
    waterTemp: 300,
    heating: false,
    particles: [],
    flamePhase: 0,

    init() {
        this.canvas = document.getElementById('boiler-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const container = this.canvas.parentElement;
        if (container && typeof ResizeObserver !== 'undefined') {
            if (this.resizeObserver) this.resizeObserver.disconnect();
            this.resizeObserver = new ResizeObserver(() => this.resize());
            this.resizeObserver.observe(container);
        }

        this.resize();
        this.bindControls();
        this.animate();
    },

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    },

    resize() {
        if (!this.canvas) return;
        const container = this.canvas.parentElement;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this._dpr = dpr;
        const w = Math.max(280, container.clientWidth || 600);
        const ch = container.clientHeight;
        const h = Math.max(260, Math.min(480, ch > 140 ? ch : 420));

        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.canvas.width = Math.floor(w * dpr);
        this.canvas.height = Math.floor(h * dpr);

        const ctx = this.canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    bindControls() {
        const pSlider = document.getElementById('boiler-pressure');
        if (pSlider) {
            pSlider.addEventListener('input', (e) => {
                this.pressure = parseFloat(e.target.value);
                const val = document.getElementById('boiler-press-val');
                if (val) val.textContent = this.pressure.toFixed(2) + ' bar';
                this.updateSaturation();
            });
        }

        const heatBtn = document.getElementById('boiler-heat-btn');
        if (heatBtn) {
            heatBtn.addEventListener('click', () => {
                this.heating = !this.heating;
                heatBtn.textContent = this.heating ? 'Stop Burner' : 'Ignite Burner';
                heatBtn.style.background = this.heating ? '#ef4444' : '#3b82f6';
            });
        }
    },

    getSaturationTemp(p) {
        return 100 * Math.pow(p, 0.25) + 273.15;
    },

    updateSaturation() {
        const tsat = this.getSaturationTemp(this.pressure);
        const tsatEl = document.getElementById('boiler-tsat-val');
        if (tsatEl) tsatEl.textContent = Math.round(tsat) + ' K';
    },

    animate() {
        const ctx = this.ctx;
        const dpr = this._dpr || Math.min(window.devicePixelRatio || 1, 2);
        const W = this.canvas.width / dpr;
        const H = this.canvas.height / dpr;

        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, W, H);

        const tsat = this.getSaturationTemp(this.pressure);

        if (this.heating) {
            this.waterTemp += 0.55;
            if (this.waterTemp > tsat) this.waterTemp = tsat;
            this.flamePhase += 0.25;
        } else {
            this.waterTemp = Math.max(300, this.waterTemp - 0.22);
            this.flamePhase += 0.08;
        }

        const drum = {
            x: W * 0.14,
            y: H * 0.14,
            w: W * 0.62,
            h: H * 0.44,
            rx: W * 0.038
        };
        const cxBody = drum.x + drum.rx + (drum.w - drum.rx * 2) * 0.5;
        const cyBody = drum.y + drum.h * 0.5;

        const legsY = drum.y + drum.h + H * 0.02;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(drum.x + drum.w * 0.22, drum.y + drum.h);
        ctx.lineTo(drum.x + drum.w * 0.18, legsY + H * 0.06);
        ctx.moveTo(drum.x + drum.w * 0.78, drum.y + drum.h);
        ctx.lineTo(drum.x + drum.w * 0.82, legsY + H * 0.06);
        ctx.stroke();

        if (this.heating) {
            const fh = H * 0.14;
            const fx = cxBody;
            const fy = drum.y + drum.h + fh * 0.35;
            const flick = Math.sin(this.flamePhase) * 6 + Math.sin(this.flamePhase * 2.3) * 4;
            const grd = ctx.createRadialGradient(fx, fy + fh * 0.2, 4, fx + flick * 0.3, fy - fh * 0.5, fh * 1.4);
            grd.addColorStop(0, 'rgba(255, 220, 120, 0.95)');
            grd.addColorStop(0.35, 'rgba(255, 140, 40, 0.85)');
            grd.addColorStop(0.7, 'rgba(220, 50, 20, 0.45)');
            grd.addColorStop(1, 'rgba(220, 50, 20, 0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.moveTo(fx - fh * 0.35, fy);
            ctx.quadraticCurveTo(fx + flick * 0.6, fy - fh * 1.05, fx + fh * 0.38, fy);
            ctx.quadraticCurveTo(fx, fy + fh * 0.25, fx - fh * 0.35, fy);
            ctx.fill();
        }

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(drum.x + drum.rx * 0.35, cyBody, drum.rx * 0.85, drum.h * 0.49, 0, Math.PI * 0.5, Math.PI * 1.5);
        ctx.stroke();

        const shellGrad = ctx.createLinearGradient(drum.x + drum.rx, 0, drum.x + drum.w - drum.rx * 0.5, 0);
        shellGrad.addColorStop(0, '#334155');
        shellGrad.addColorStop(0.28, '#94a3b8');
        shellGrad.addColorStop(0.52, '#cbd5e1');
        shellGrad.addColorStop(0.72, '#64748b');
        shellGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = shellGrad;
        ctx.fillRect(drum.x + drum.rx * 0.35, drum.y, drum.w - drum.rx * 1.25, drum.h);

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.ellipse(drum.x + drum.w - drum.rx * 0.15, cyBody, drum.rx * 1.05, drum.h * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();

        const hl = ctx.createRadialGradient(
            drum.x + drum.w + drum.rx * 0.35, cyBody - drum.h * 0.18, 2,
            drum.x + drum.w - drum.rx * 0.4, cyBody, drum.rx * 3
        );
        hl.addColorStop(0, 'rgba(226,232,240,0.55)');
        hl.addColorStop(0.45, 'rgba(148,163,184,0.35)');
        hl.addColorStop(1, 'rgba(71,85,105,0)');
        ctx.fillStyle = hl;
        ctx.beginPath();
        ctx.ellipse(drum.x + drum.w - drum.rx * 0.15, cyBody, drum.rx * 1.05, drum.h * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.strokeRect(drum.x + drum.rx * 0.35, drum.y, drum.w - drum.rx * 1.25, drum.h);

        const pad = drum.rx + 10;
        const innerW = drum.w - pad * 2 - 8;
        const innerBottom = drum.y + drum.h - 10;
        const fillFrac = Math.min(1, Math.max(0.28, (this.waterTemp - 295) / (tsat - 295 + 80)));
        const waterTop = innerBottom - (drum.h - 28) * fillFrac;

        let hue = 205 - Math.min(165, ((this.waterTemp - 300) / Math.max(40, tsat - 300)) * 165);
        ctx.fillStyle = `hsla(${hue}, 72%, 48%, 0.82)`;
        ctx.fillRect(drum.x + pad, waterTop, innerW, innerBottom - waterTop);

        ctx.strokeStyle = 'rgba(248,250,252,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(drum.x + pad, waterTop + 4);
        for (let x = drum.x + pad; x < drum.x + pad + innerW; x += 18) {
            ctx.lineTo(x + 9, waterTop + 2 + Math.sin((x + Date.now() * 0.003) * 0.08) * 3);
        }
        ctx.stroke();

        if (this.waterTemp >= tsat - 1 && Math.random() < 0.34) {
            this.particles.push({
                x: drum.x + pad + Math.random() * innerW,
                y: innerBottom - 8,
                vy: -1.8 - Math.random() * 2,
                vx: (Math.random() - 0.5) * 0.9,
                life: 1
            });
        }

        for (let idx = this.particles.length - 1; idx >= 0; idx--) {
            const p = this.particles[idx];
            p.y += p.vy;
            p.x += p.vx + Math.sin(this.flamePhase + idx) * 0.35;
            p.life -= 0.009;
            ctx.fillStyle = `rgba(248,250,252, ${Math.max(0, p.life * 0.75)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3 + (1 - p.life) * 4, 0, Math.PI * 2);
            ctx.fill();
            if (p.life <= 0 || p.y < drum.y + 12) this.particles.splice(idx, 1);
        }

        ctx.fillStyle = 'rgba(248,250,252,0.88)';
        ctx.font = `${Math.max(11, W * 0.026)}px system-ui,sans-serif`;
        ctx.fillText('Steam drum (projection)', drum.x + drum.rx * 0.5, drum.y - H * 0.025);

        const tempEl = document.getElementById('boiler-temp-val');
        if (tempEl) tempEl.textContent = Math.round(this.waterTemp) + ' K';

        const stateEl = document.getElementById('boiler-state');
        if (stateEl) {
            if (this.waterTemp < tsat - 5) stateEl.textContent = 'Subcooled liquid';
            else if (this.waterTemp >= tsat - 1) stateEl.textContent = 'Saturated mixture / vaporisation';
            else stateEl.textContent = 'Near saturation';
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
