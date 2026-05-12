/**
 * Carnot Engine - Full 3D Isometric Visualization
 */
// Helper function to get theme-aware text color
window.getCanvasTextColor = function(lightColor = '#000000', darkColor = '#ffffff') {
    return document.body.getAttribute('data-theme') === 'light' ? lightColor : darkColor;
};

window.carnotEngine = {
    canvas: null, ctx: null, animationId: null,
    th: 1000, tc: 300, phase: 0,

    init() {
        this.canvas = document.getElementById('carnot-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('carnot-canvas-container');
        this.canvas.width = c.clientWidth; this.canvas.height = c.clientHeight;
        this.bindControls(); this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    bindControls() {
        ['th-slider','tc-slider'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const ne = el.cloneNode(true);
            el.parentNode.replaceChild(ne, el);
            ne.addEventListener('input', (e) => {
                if (id === 'th-slider') this.th = parseFloat(e.target.value);
                else this.tc = parseFloat(e.target.value);
                this.updateEfficiency();
            });
        });
        this.updateEfficiency();
    },

    updateEfficiency() {
        const eff = 1 - (this.tc / this.th);
        const el = document.getElementById('carnot-eff-val');
        if (el) el.textContent = `${(eff * 100).toFixed(1)}%`;
        if (Math.random() > 0.8 && window.app) window.app.addXP(5);
    },

    animate() {
        const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, W, H);
        this.phase += 0.025;

        const cx = W / 2, cy = H / 2;
        const depth = 22; // isometric depth

        // === HOT RESERVOIR (top, 3D) ===
        const hotH = 55, hotW = 180, hx = cx - hotW/2, hy = cy - 170;
        const hotAlpha = 0.4 + (this.th/1500) * 0.5;
        // Back face
        ctx.fillStyle = `rgba(180,30,30,${hotAlpha * 0.6})`;
        ctx.fillRect(hx+depth, hy-depth, hotW, hotH);
        // Top face
        ctx.fillStyle = `rgba(239,68,68,${hotAlpha * 0.5})`;
        ctx.beginPath(); ctx.moveTo(hx,hy); ctx.lineTo(hx+depth,hy-depth);
        ctx.lineTo(hx+hotW+depth,hy-depth); ctx.lineTo(hx+hotW,hy); ctx.closePath(); ctx.fill();
        // Front face
        const hotGrad = ctx.createLinearGradient(hx, hy, hx, hy+hotH);
        hotGrad.addColorStop(0, `rgba(239,68,68,${hotAlpha})`);
        hotGrad.addColorStop(1, `rgba(180,30,30,${hotAlpha})`);
        ctx.fillStyle = hotGrad; ctx.fillRect(hx, hy, hotW, hotH);
        ctx.strokeStyle = 'rgba(239,68,68,0.8)'; ctx.lineWidth = 1.5; ctx.strokeRect(hx,hy,hotW,hotH);
        // Label
        ctx.fillStyle = '#fca5a5'; ctx.font = 'bold 13px Inter'; ctx.textAlign = 'center';
        ctx.fillText(`🔥 Hot Reservoir  Th = ${this.th} K`, cx, hy + hotH/2 + 5);

        // === COLD RESERVOIR (bottom, 3D) ===
        const coldH = 55, coldW = 180, colx = cx - coldW/2, coly = cy + 115;
        const coldAlpha = 0.4 + ((1000-this.tc)/1000) * 0.5;
        ctx.fillStyle = `rgba(10,40,80,${coldAlpha * 0.6})`;
        ctx.fillRect(colx+depth, coly-depth, coldW, coldH);
        ctx.fillStyle = `rgba(30,80,160,${coldAlpha * 0.5})`;
        ctx.beginPath(); ctx.moveTo(colx,coly); ctx.lineTo(colx+depth,coly-depth);
        ctx.lineTo(colx+coldW+depth,coly-depth); ctx.lineTo(colx+coldW,coly); ctx.closePath(); ctx.fill();
        const coldGrad = ctx.createLinearGradient(colx,coly,colx,coly+coldH);
        coldGrad.addColorStop(0,`rgba(59,130,246,${coldAlpha})`);
        coldGrad.addColorStop(1,`rgba(30,60,150,${coldAlpha})`);
        ctx.fillStyle = coldGrad; ctx.fillRect(colx,coly,coldW,coldH);
        ctx.strokeStyle = 'rgba(59,130,246,0.8)'; ctx.lineWidth = 1.5; ctx.strokeRect(colx,coly,coldW,coldH);
        ctx.fillStyle = '#93c5fd'; ctx.font = 'bold 13px Inter'; ctx.textAlign = 'center';
        ctx.fillText(`❄️ Cold Reservoir  Tc = ${this.tc} K`, cx, coly + coldH/2 + 5);

        // === ENGINE CYLINDER (3D Isometric) ===
        const cylW = 90, cylTop = cy - 110, cylBot = cy + 115, cylX = cx - cylW/2;
        // Piston position based on phase
        const pistonY = cy - 20 + Math.sin(this.phase) * 55;

        // Determine cycle stage
        let stage = '', gasCol = 'rgba(239,68,68,0.4)';
        if (this.phase % (Math.PI*2) < Math.PI/2)      { stage = 'Isothermal Expansion'; gasCol = 'rgba(239,68,68,0.5)'; }
        else if (this.phase % (Math.PI*2) < Math.PI)   { stage = 'Adiabatic Expansion';  gasCol = 'rgba(168,85,247,0.5)'; }
        else if (this.phase % (Math.PI*2) < Math.PI*1.5){ stage = 'Isothermal Compression'; gasCol = 'rgba(59,130,246,0.5)'; }
        else                                             { stage = 'Adiabatic Compression'; gasCol = 'rgba(168,85,247,0.5)'; }

        // Right face of cylinder
        ctx.fillStyle = 'rgba(51,65,85,0.7)';
        ctx.beginPath(); ctx.moveTo(cylX+cylW,cylTop); ctx.lineTo(cylX+cylW+depth,cylTop-depth);
        ctx.lineTo(cylX+cylW+depth,cylBot-depth); ctx.lineTo(cylX+cylW,cylBot); ctx.closePath(); ctx.fill();
        // Top face
        ctx.fillStyle = 'rgba(71,85,105,0.8)';
        ctx.beginPath(); ctx.moveTo(cylX,cylTop); ctx.lineTo(cylX+depth,cylTop-depth);
        ctx.lineTo(cylX+cylW+depth,cylTop-depth); ctx.lineTo(cylX+cylW,cylTop); ctx.closePath(); ctx.fill();
        // Gas fill
        ctx.fillStyle = gasCol;
        ctx.fillRect(cylX+2, pistonY+20, cylW-4, cylBot - pistonY - 22);
        // Front face outline
        ctx.strokeStyle = 'rgba(148,163,184,0.6)'; ctx.lineWidth = 2;
        ctx.strokeRect(cylX, cylTop, cylW, cylBot-cylTop);
        // Piston 3D
        ctx.fillStyle = '#475569'; ctx.fillRect(cylX+2, pistonY, cylW-4, 20);
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.moveTo(cylX+2,pistonY); ctx.lineTo(cylX+2+depth,pistonY-depth);
        ctx.lineTo(cylX+cylW-4+depth,pistonY-depth); ctx.lineTo(cylX+cylW-4,pistonY); ctx.closePath(); ctx.fill();
        // Piston rod
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(cx, pistonY+20); ctx.lineTo(cx, coly-5); ctx.stroke();

        // Heat flow arrows
        if (this.phase % (Math.PI*2) < Math.PI) {
            // Heat flows down from hot source
            ctx.fillStyle = '#fca5a5'; ctx.font = '18px Arial';
            ctx.fillText('↓ Q_H', cx + 60, cy - 60 + Math.sin(this.phase*3)*5);
        } else {
            // Heat flows down to cold sink
            ctx.fillStyle = '#93c5fd'; ctx.font = '18px Arial';
            ctx.fillText('↓ Q_C', cx + 60, cy + 60 + Math.sin(this.phase*3)*5);
        }
        // Work arrow
        ctx.fillStyle = '#86efac'; ctx.font = '16px Arial';
        ctx.fillText('→ W', cx - 90, cy + Math.sin(this.phase)*10);

        // Stage label
        ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 14px Inter'; ctx.textAlign = 'center';
        ctx.fillText(stage, cx, cy + 185);

        // Efficiency bar
        const eff = 1 - this.tc/this.th;
        ctx.fillStyle = 'rgba(30,41,59,0.7)'; ctx.fillRect(cx - 90, cy+195, 180, 14);
        const barGrad = ctx.createLinearGradient(cx-90,0,cx+90,0);
        barGrad.addColorStop(0,'#10b981'); barGrad.addColorStop(1,'#3b82f6');
        ctx.fillStyle = barGrad; ctx.fillRect(cx - 90, cy+195, 180*eff, 14);
        ctx.fillStyle = getCanvasTextColor(); ctx.font = 'bold 12px Inter';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 2;
        ctx.fillText(`η = ${(eff*100).toFixed(1)}%`, cx, cy+207);
        ctx.shadowBlur = 0;

        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
