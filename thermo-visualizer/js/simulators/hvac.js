/**
 * HVAC & Refrigerator – Full 3D Isometric Visualization
 */
window.hvac = {
    canvas: null, ctx: null, animationId: null,
    flowPhase: 0, targetTemp: 4,
    W: 0, H: 0,

    init() {
        this.canvas = document.getElementById('hvac-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const resize = () => {
            const con = document.getElementById('hvac-canvas-container');
            this.canvas.width  = this.W = (con ? con.clientWidth  : 0) || 900;
            this.canvas.height = this.H = (con ? con.clientHeight : 0) || 560;
        };
        resize();
        window.addEventListener('resize', resize);
        this.bindControls();
        this.updateStats();
        this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    bindControls() {
        const sl = document.getElementById('hvac-temp-slider');
        if (!sl) return;
        const ne = sl.cloneNode(true);
        sl.parentNode.replaceChild(ne, sl);
        ne.addEventListener('input', e => {
            this.targetTemp = parseFloat(e.target.value);
            this.updateStats();
        });
    },

    updateStats() {
        const el = document.getElementById('hvac-temp-val');
        if (el) el.textContent = `${this.targetTemp}°C`;
        const deltaT = 35 - this.targetTemp;
        const power  = 80 + deltaT * 8;
        const Tc = this.targetTemp + 273.15;
        const Th = 308.15; // 35°C ambient
        const cop_ideal = Tc / (Th - Tc);
        const cop = Math.min(cop_ideal * 0.6, 6).toFixed(2);
        const pw = document.getElementById('hvac-power-val');
        const cv = document.getElementById('hvac-cop-val');
        if (pw) pw.textContent = `${Math.round(power)} W`;
        if (cv) cv.textContent  = cop;
    },

    /* ─── iso helpers ─── */
    iso(x, y, z) {
        const scale = Math.min(this.W, this.H) / 540;
        const cx = this.W / 2, cy = this.H * 0.52;
        const sx = (x - z) * Math.cos(Math.PI / 6);
        const sy = (x + z) * Math.sin(Math.PI / 6) - y;
        return { x: cx + sx * scale * 28, y: cy + sy * scale * 28 };
    },

    box(x, y, z, w, h, d, colors) {
        const c = this.ctx;
        const [cTop, cFront, cSide] = colors;
        const p = (a, b, c2, d2) => [this.iso(a,b,c2), this.iso(d2[0],d2[1],d2[2])];

        const tl = this.iso(x,     y+h, z);
        const tr = this.iso(x+w,   y+h, z);
        const br = this.iso(x+w,   y+h, z+d);
        const bl = this.iso(x,     y+h, z+d);

        const fl = this.iso(x,     y,   z+d);
        const fr = this.iso(x+w,   y,   z+d);

        const sl2 = this.iso(x+w,  y,   z);

        // Top face
        c.beginPath(); c.moveTo(tl.x,tl.y); c.lineTo(tr.x,tr.y);
        c.lineTo(br.x,br.y); c.lineTo(bl.x,bl.y); c.closePath();
        c.fillStyle = cTop; c.fill();
        c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 1; c.stroke();

        // Front face (z+d)
        c.beginPath(); c.moveTo(bl.x,bl.y); c.lineTo(br.x,br.y);
        c.lineTo(fr.x,fr.y); c.lineTo(fl.x,fl.y); c.closePath();
        c.fillStyle = cFront; c.fill(); c.stroke();

        // Right face (x+w)
        c.beginPath(); c.moveTo(br.x,br.y); c.lineTo(tr.x,tr.y);
        c.lineTo(sl2.x,sl2.y); c.lineTo(fr.x,fr.y); c.closePath();
        c.fillStyle = cSide; c.fill(); c.stroke();
    },

    label(x, y, z, text, col) {
        const p = this.iso(x, y, z);
        const c = this.ctx;
        c.fillStyle   = col || '#fff';
        c.font        = 'bold 11px Inter';
        c.textAlign   = 'center';
        c.fillText(text, p.x, p.y);
    },

    pipe(pts, color, width) {
        const c = this.ctx;
        c.beginPath();
        pts.forEach((p, i) => {
            const ip = this.iso(p[0], p[1], p[2]);
            i === 0 ? c.moveTo(ip.x, ip.y) : c.lineTo(ip.x, ip.y);
        });
        c.strokeStyle = color; c.lineWidth = width || 8;
        c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke();
    },

    dot(x, y, z, r, col) {
        const c = this.ctx, p = this.iso(x, y, z);
        c.beginPath(); c.arc(p.x, p.y, r, 0, Math.PI*2);
        c.fillStyle = col; c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 1.5; c.stroke();
    },

    animate() {
        const c = this.ctx, W = this.W, H = this.H;
        c.clearRect(0, 0, W, H);

        // Dark gradient background
        const bg = c.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#0f172a');
        bg.addColorStop(1, '#020617');
        c.fillStyle = bg; c.fillRect(0, 0, W, H);

        const speed = 0.012 + (35 - this.targetTemp) * 0.001;
        this.flowPhase = (this.flowPhase + speed) % 1;
        const f = this.flowPhase;

        /* ── Refrigerator Cabinet ── */
        this.box(-3, 0, -3, 6, 9, 6,
            ['#1e3a5f','#1e3a8a','#1e40af']);  // blue steel

        // Door (front offset)
        this.box(-2.8, 0.1, 3, 5.6, 8.8, 0.3,
            ['#1d4ed8','#2563eb','#3b82f6']);

        // Door handle
        this.box(-0.15, 4, 3.31, 0.3, 2, 0.2,
            ['#94a3b8','#cbd5e1','#94a3b8']);

        /* ── Evaporator (cold coil inside) ── */
        this.box(-2.3, 7, -2.2, 4.6, 1.5, 0.8,
            ['rgba(56,189,248,0.9)','rgba(14,165,233,0.9)','rgba(2,132,199,0.9)']);
        this.label(0, 8.5, -1.8, 'EVAPORATOR', '#7dd3fc');

        /* ── Condenser (hot coil, back/bottom) ── */
        this.box(-2.5, -0.5, -3.5, 5, 1.2, 0.9,
            ['rgba(239,68,68,0.9)','rgba(220,38,38,0.9)','rgba(185,28,28,0.9)']);
        this.label(0, 0.3, -4.0, 'CONDENSER', '#fca5a5');

        /* ── Compressor ── */
        this.box(1.8, -0.5, -1.5, 2, 2.5, 2,
            ['rgba(168,85,247,0.9)','rgba(139,92,246,0.9)','rgba(109,40,217,0.9)']);
        this.label(2.8, 2.0, -0.5, 'COMPRESSOR', '#d8b4fe');

        /* ── Expansion Valve ── */
        this.box(-3.2, 5.5, -1, 1, 0.8, 0.8,
            ['rgba(251,191,36,0.9)','rgba(245,158,11,0.9)','rgba(217,119,6,0.9)']);
        this.label(-2.7, 6.9, -0.6, 'EXP. VALVE', '#fde68a');

        /* ── Refrigerant piping ── */
        // Hot gas: compressor → condenser (red)
        this.pipe([[2.8,2,-0.5],[2.8,0.5,-2.5],[0,0.5,-3.5]], '#ef4444', 5);
        // Liquid: condenser → expansion valve (orange)
        this.pipe([[0,0.3,-3.5],[-2.7,0.3,-2],[-2.7,5.5,-0.6]], '#f97316', 5);
        // Cold vapor: expansion valve → evaporator (cyan)
        this.pipe([[-2.7,6.3,-0.6],[-2.7,7.5,-1.8],[0,7.5,-1.8]], '#38bdf8', 5);
        // Suction: evaporator → compressor (blue)
        this.pipe([[0,7.5,-1.8],[2.8,7.5,-1],[2.8,2.5,-0.5]], '#3b82f6', 5);

        /* ── Animated refrigerant dot ── */
        // Segment lengths (approximate path fractions)
        const seg = [
            { t0:0.00, t1:0.25, pts:[[2.8,2,-0.5],[2.8,0.5,-2.5],[0,0.5,-3.5]],  col:'#fbbf24' },
            { t0:0.25, t1:0.50, pts:[[0,0.3,-3.5],[-2.7,0.3,-2],[-2.7,5.5,-0.6]], col:'#f97316' },
            { t0:0.50, t1:0.65, pts:[[-2.7,6.3,-0.6],[-2.7,7.5,-1.8],[0,7.5,-1.8]],col:'#a5f3fc' },
            { t0:0.65, t1:1.00, pts:[[0,7.5,-1.8],[2.8,7.5,-1],[2.8,2.5,-0.5]],  col:'#60a5fa' }
        ];

        seg.forEach(s => {
            if (f >= s.t0 && f < s.t1) {
                const local = (f - s.t0) / (s.t1 - s.t0);
                const p = s.pts;
                const idx = Math.min(Math.floor(local * (p.length-1)), p.length-2);
                const lt  = (local * (p.length-1)) - idx;
                const x = p[idx][0] + (p[idx+1][0]-p[idx][0]) * lt;
                const y = p[idx][1] + (p[idx+1][1]-p[idx][1]) * lt;
                const z = p[idx][2] + (p[idx+1][2]-p[idx][2]) * lt;
                this.dot(x, y, z, 7, s.col);
            }
        });

        /* ── Compressor rotation disc ── */
        const compP = this.iso(2.8, 1.25, -0.5);
        const angle = this.flowPhase * Math.PI * 2;
        c.save(); c.translate(compP.x, compP.y);
        for (let i = 0; i < 6; i++) {
            const a = angle + i * Math.PI/3;
            c.strokeStyle = `rgba(216,180,254,0.8)`; c.lineWidth = 2;
            c.beginPath(); c.moveTo(0,0);
            c.lineTo(Math.cos(a)*14, Math.sin(a)*14); c.stroke();
        }
        c.restore();

        /* ── Heat arrows condenser ── */
        for (let i = -1; i <= 1; i++) {
            const base = this.iso(i*1.5, 0.8, -3.6);
            const top  = this.iso(i*1.5, -0.6 - (f*0.5), -3.6);
            c.strokeStyle = `rgba(239,68,68,${0.4+f*0.4})`;
            c.lineWidth = 2;
            c.beginPath(); c.moveTo(base.x, base.y); c.lineTo(top.x, top.y); c.stroke();
            // arrowhead
            c.fillStyle = `rgba(239,68,68,${0.5+f*0.4})`;
            c.beginPath(); c.moveTo(top.x, top.y);
            c.lineTo(top.x-4, top.y+6); c.lineTo(top.x+4, top.y+6); c.closePath(); c.fill();
        }

        /* ── Cold arrows evaporator ── */
        for (let i = -1; i <= 1; i++) {
            const base = this.iso(i*1.5, 7.0, -1.8);
            const tip  = this.iso(i*1.5, 7.0 + 0.5 + f*0.3, -1.8);
            c.strokeStyle = `rgba(56,189,248,${0.4+f*0.3})`;
            c.lineWidth = 2;
            c.beginPath(); c.moveTo(base.x, base.y); c.lineTo(tip.x, tip.y); c.stroke();
        }

        /* ── Title & legend overlay ── */
        c.fillStyle = 'rgba(2,6,23,0.55)';
        c.beginPath(); c.roundRect(12, 12, 210, 80, 8); c.fill();
        c.fillStyle = '#38bdf8'; c.font = 'bold 13px Inter';
        c.textAlign = 'left';
        c.fillText('3D Vapor-Compression Cycle', 22, 32);
        c.fillStyle = '#94a3b8'; c.font = '10px Inter';
        c.fillText('● Red  = Hot high-pressure gas', 22, 50);
        c.fillText('● Cyan = Cold low-pressure vapor', 22, 64);
        c.fillText('● Blue = Liquid refrigerant', 22, 78);

        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
