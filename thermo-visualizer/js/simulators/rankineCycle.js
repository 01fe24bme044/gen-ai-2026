/**
 * Rankine Cycle - Full 3D Isometric Power Plant
 */
// Helper function to get theme-aware text color
window.getCanvasTextColor = function(lightColor = '#000000', darkColor = '#ffffff') {
    return document.body.getAttribute('data-theme') === 'light' ? lightColor : darkColor;
};

window.rankineCycle = {
    canvas: null, ctx: null, animationId: null,
    active: false, flowPhase: 0, turbineAngle: 0,

    init() {
        this.canvas = document.getElementById('rankine-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('rankine-canvas-container');
        this.canvas.width = c.clientWidth; this.canvas.height = c.clientHeight;
        this.bindControls(); this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    bindControls() {
        const btn = document.getElementById('start-plant-btn');
        if (!btn) return;
        const nb = btn.cloneNode(true);
        btn.parentNode.replaceChild(nb, btn);
        nb.addEventListener('click', () => {
            this.active = !this.active;
            nb.textContent = this.active ? '⛔ Shutdown Plant' : '▶ Start Power Plant';
            nb.style.background = this.active ? '#ef4444' : 'var(--accent)';
            const st = document.getElementById('plant-state');
            if (st) { st.textContent = this.active ? 'Operating ⚡' : 'Offline'; st.style.color = this.active ? '#4ade80' : 'var(--text-muted)'; }
            if (this.active && window.app) window.app.addXP(20);
        });
    },

    draw3DBox(ctx, x, y, w, h, depth, faceColor, topColor, sideColor, label, labelColor) {
        // Back
        ctx.fillStyle = sideColor; ctx.fillRect(x+depth, y-depth, w, h);
        // Top face
        ctx.fillStyle = topColor;
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+depth,y-depth); ctx.lineTo(x+w+depth,y-depth); ctx.lineTo(x+w,y); ctx.closePath(); ctx.fill();
        // Right face
        ctx.fillStyle = sideColor;
        ctx.beginPath(); ctx.moveTo(x+w,y); ctx.lineTo(x+w+depth,y-depth); ctx.lineTo(x+w+depth,y+h-depth); ctx.lineTo(x+w,y+h); ctx.closePath(); ctx.fill();
        // Front face
        ctx.fillStyle = faceColor; ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.strokeRect(x,y,w,h);
        // Label with 3D shadow effect
        if (label) { 
            ctx.fillStyle = labelColor||getCanvasTextColor(); 
            ctx.font = 'bold 12px Inter'; 
            ctx.textAlign = 'center'; 
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 3;
            ctx.fillText(label, x+w/2, y+h/2+4); 
            ctx.shadowBlur = 0;
        }
    },

    animate() {
        const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, W, H);
        if (this.active) { this.flowPhase += 0.03; this.turbineAngle += 8; }

        const cx = W/2, cy = H/2;
        const d = 14; // isometric depth

        // Component positions
        const boiler   = {x: cx-200, y: cy-70, w:80, h:80};
        const turbine  = {x: cx+20,  y: cy-90, w:80, h:80};
        const cond     = {x: cx+20,  y: cy+30, w:80, h:60};
        const pump     = {x: cx-200, y: cy+30, w:60, h:60};

        // === PIPES ===
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 12; ctx.lineCap = 'round';
        // Boiler -> Turbine (hot steam - top)
        ctx.beginPath(); ctx.moveTo(boiler.x+boiler.w, boiler.y+20); ctx.lineTo(turbine.x, turbine.y+20); ctx.stroke();
        // Turbine -> Condenser (right, down)
        ctx.beginPath(); ctx.moveTo(turbine.x+turbine.w/2, turbine.y+turbine.h); ctx.lineTo(cond.x+cond.w/2, cond.y); ctx.stroke();
        // Condenser -> Pump (bottom)
        ctx.beginPath(); ctx.moveTo(cond.x, cond.y+cond.h/2); ctx.lineTo(pump.x+pump.w, pump.y+pump.h/2); ctx.stroke();
        // Pump -> Boiler (left, up)
        ctx.beginPath(); ctx.moveTo(pump.x+pump.w/2, pump.y); ctx.lineTo(boiler.x+boiler.w/2, boiler.y+boiler.h); ctx.stroke();

        // Flow particles on pipes
        if (this.active) {
            const t = this.flowPhase;
            // Steam (hot, red) boiler -> turbine
            const sx = boiler.x+boiler.w + ((t*60)%(turbine.x - boiler.x-boiler.w));
            ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(sx, boiler.y+20, 7, 0, Math.PI*2); ctx.fill();
            // Water (cold, blue) condenser -> pump
            const wx = cond.x - ((t*60)%(cond.x - pump.x-pump.w));
            ctx.fillStyle='#3b82f6'; ctx.beginPath(); ctx.arc(wx, cond.y+cond.h/2, 5, 0, Math.PI*2); ctx.fill();
        }

        // === BOILER 3D ===
        const bActive = this.active;
        this.draw3DBox(ctx, boiler.x, boiler.y, boiler.w, boiler.h, d,
            bActive ? 'rgba(239,68,68,0.85)' : 'rgba(30,41,59,0.9)',
            bActive ? 'rgba(180,40,40,0.7)' : 'rgba(51,65,85,0.7)',
            bActive ? 'rgba(120,20,20,0.7)' : 'rgba(30,41,59,0.7)',
            'BOILER', bActive ? '#fca5a5' : 'white');
        if (bActive) {
            // Flame
            for (let i=0;i<3;i++) {
                const fx = boiler.x+20+i*20, fy = boiler.y+boiler.h+5;
                const fl = 8 + Math.sin(this.flowPhase*3+i)*4;
                ctx.fillStyle = `rgba(251,146,60,${0.7-i*0.1})`;
                ctx.beginPath(); ctx.ellipse(fx,fy+fl,8,fl,0,0,Math.PI*2); ctx.fill();
            }
        }

        // === TURBINE 3D ===
        this.draw3DBox(ctx, turbine.x, turbine.y, turbine.w, turbine.h, d,
            'rgba(139,92,246,0.85)', 'rgba(100,60,200,0.7)', 'rgba(80,40,180,0.7)', '', 'white');
        // Spinning turbine blades
        ctx.save(); ctx.translate(turbine.x+turbine.w/2, turbine.y+turbine.h/2);
        ctx.rotate(this.turbineAngle * Math.PI/180);
        for(let i=0;i<6;i++) {
            ctx.rotate(Math.PI/3);
            ctx.fillStyle = `rgba(168,85,247,${this.active ? 0.9 : 0.4})`;
            ctx.fillRect(-4,-28,8,28);
        }
        ctx.restore();
        ctx.fillStyle='#a78bfa'; ctx.beginPath(); ctx.arc(turbine.x+turbine.w/2,turbine.y+turbine.h/2,8,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=getCanvasTextColor(); ctx.font='bold 12px Inter'; ctx.textAlign='center';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 3;
        ctx.fillText('TURBINE', turbine.x+turbine.w/2, turbine.y+turbine.h+16);
        ctx.shadowBlur = 0;

        // === CONDENSER 3D ===
        this.draw3DBox(ctx, cond.x, cond.y, cond.w, cond.h, d,
            this.active ? 'rgba(59,130,246,0.8)' : 'rgba(30,41,59,0.9)',
            this.active ? 'rgba(30,80,150,0.7)' : 'rgba(51,65,85,0.7)',
            this.active ? 'rgba(20,60,120,0.7)' : 'rgba(30,41,59,0.7)',
            'CONDENSER', this.active ? '#93c5fd' : 'white');

        // === PUMP 3D ===
        this.draw3DBox(ctx, pump.x, pump.y, pump.w, pump.h, d,
            'rgba(71,85,105,0.85)', 'rgba(51,65,85,0.7)', 'rgba(30,41,59,0.7)',
            'PUMP', 'white');
        // Pump gear
        ctx.save(); ctx.translate(pump.x+pump.w/2, pump.y+pump.h/2);
        ctx.rotate(this.turbineAngle * 0.3 * Math.PI/180);
        for(let i=0;i<8;i++) {
            ctx.rotate(Math.PI/4);
            ctx.fillStyle = 'rgba(148,163,184,0.7)';
            ctx.fillRect(-2,-15,4,15);
        }
        ctx.restore();

        // === Generator output ===
        if (this.active) {
            ctx.fillStyle = 'rgba(74,222,128,0.15)'; ctx.beginPath();
            ctx.roundRect(turbine.x+turbine.w+d+10, turbine.y+10, 70, 50, 6); ctx.fill();
            ctx.strokeStyle = '#4ade80'; ctx.lineWidth=1; ctx.stroke();
            ctx.fillStyle='#4ade80'; ctx.font='bold 12px Inter'; ctx.textAlign='center';
            ctx.fillText('⚡ OUTPUT', turbine.x+turbine.w+d+45, turbine.y+35);
            // Lightning bolt flicker
            if(Math.sin(this.flowPhase*5) > 0.5) {
                ctx.fillStyle='#fbbf24'; ctx.font='20px Arial';
                ctx.fillText('⚡', turbine.x+turbine.w+d+45, turbine.y+60);
            }
        }

        // Title
        ctx.fillStyle = 'rgba(148,163,184,0.7)'; ctx.font='12px Inter'; ctx.textAlign='center';
        ctx.fillText('Rankine Cycle — Steam Power Plant', cx, H-15);

        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
