/**
 * Combustion Chamber - 3D Isometric Engine with Particle System
 */
window.combustion = {
    canvas: null, ctx: null, animationId: null,
    particles: [], ignited: false, energy: 0, temp: 300, time: 0,
    crankAngle: 0, exhaustPuffs: [],

    init() {
        this.canvas = document.getElementById('combustion-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('combustion-canvas-container');
        this.canvas.width = c.clientWidth; this.canvas.height = c.clientHeight;
        this.bindControls(); this.resetSim(); this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    bindControls() {
        ['ignite-btn','stop-comb-btn','reset-comb-btn'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const ne = el.cloneNode(true);
            el.parentNode.replaceChild(ne, el);
            ne.addEventListener('click', () => {
                if (id === 'ignite-btn' && !this.ignited && this.time < 200) {
                    this.ignited = true;
                    ne.style.display = 'none';
                    const s = document.getElementById('stop-comb-btn'); if(s) s.style.display='block';
                    if (window.app) window.app.addXP(15);
                } else if (id === 'stop-comb-btn') {
                    this.ignited = false;
                    ne.style.display='none';
                    const i = document.getElementById('ignite-btn'); if(i) i.style.display='block';
                } else if (id === 'reset-comb-btn') {
                    this.resetSim();
                    const i = document.getElementById('ignite-btn'); if(i) i.style.display='block';
                    const s = document.getElementById('stop-comb-btn'); if(s) s.style.display='none';
                }
            });
        });
    },

    resetSim() {
        this.ignited=false; this.energy=0; this.temp=300; this.time=0;
        this.crankAngle=0; this.particles=[]; this.exhaustPuffs=[];
        if (!this.canvas) return;
        
        const W = this.canvas.width;
        const H = this.canvas.height;
        const cx = W * 0.42;
        const cy = H * 0.5;
        const cylW = 80;
        const cylTop = cy - 130;
        const cylX = cx - cylW / 2;

        // Fuel molecules (gray) - spawn inside cylinder
        for (let i=0; i<15; i++) {
            this.particles.push({
                x: cylX + 10 + Math.random() * (cylW - 20),
                y: cylTop + 20 + Math.random() * 40,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                type: 'fuel',
                r: 5
            });
        }
        // O2 molecules (blue)
        for (let i=0; i<25; i++) {
            this.particles.push({
                x: cylX + 10 + Math.random() * (cylW - 20),
                y: cylTop + 20 + Math.random() * 60,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                type: 'o2',
                r: 4
            });
        }
        this.updateStats();
    },

    updateStats() {
        const eEl = document.getElementById('comb-energy');
        const tEl = document.getElementById('comb-temp');
        if (eEl) eEl.textContent = `${this.energy.toFixed(1)} MJ/kg`;
        if (tEl) tEl.textContent = `${this.temp.toFixed(0)} K`;
    },

    animate() {
        const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
        ctx.fillStyle = 'rgba(2,6,23,0.85)'; ctx.fillRect(0,0,W,H);

        const cx = W*0.42, cy = H*0.5;
        const crankR = 38, rodLen = 85;

        if (this.ignited && this.time < 200) {
            this.time++;
            this.crankAngle += 6;
            this.energy += 0.25;
            this.temp += 10;
            this.updateStats();
            // Spawn exhaust puffs
            if (Math.random() < 0.4) this.exhaustPuffs.push({x:cx+80, y:cy-120+Math.random()*20, r:6, a:0.8, vx:1.5+Math.random(), vy:-0.5-Math.random()});
        }
        if (!this.ignited && this.crankAngle > 0) this.crankAngle += 1;

        const rad = this.crankAngle * Math.PI/180;
        const ckX = Math.sin(rad)*crankR, ckY = Math.cos(rad)*crankR;
        const pistonY = cy - (ckY + Math.sqrt(rodLen*rodLen - ckX*ckX)) + 20;

        const cylW = 80, cylTop = cy-130, cylBot = cy+10, cylX = cx-cylW/2;
        const depth = 16;

        // Cylinder back
        ctx.fillStyle = 'rgba(30,41,59,0.9)'; ctx.fillRect(cylX+depth,cylTop-depth,cylW,cylBot-cylTop);
        // Cylinder side
        ctx.fillStyle='rgba(51,65,85,0.7)';
        ctx.beginPath(); ctx.moveTo(cylX+cylW,cylTop); ctx.lineTo(cylX+cylW+depth,cylTop-depth); ctx.lineTo(cylX+cylW+depth,cylBot-depth); ctx.lineTo(cylX+cylW,cylBot); ctx.closePath(); ctx.fill();
        // Top
        ctx.fillStyle='rgba(71,85,105,0.8)';
        ctx.beginPath(); ctx.moveTo(cylX,cylTop); ctx.lineTo(cylX+depth,cylTop-depth); ctx.lineTo(cylX+cylW+depth,cylTop-depth); ctx.lineTo(cylX+cylW,cylTop); ctx.closePath(); ctx.fill();

        // Gas fill
        const gasTop = pistonY + 22;
        if (this.ignited) {
            const gGrad = ctx.createLinearGradient(cylX,gasTop,cylX,cylTop);
            const tNorm = Math.min(this.time/200,1);
            gGrad.addColorStop(0, `rgba(239,68,68,${0.4+tNorm*0.5})`);
            gGrad.addColorStop(0.5, `rgba(251,146,60,${0.5+tNorm*0.4})`);
            gGrad.addColorStop(1, `rgba(252,211,77,${0.6+tNorm*0.3})`);
            ctx.fillStyle=gGrad;
            ctx.fillRect(cylX+2, cylTop, cylW-4, gasTop-cylTop);
            // Shockwave glow
            ctx.shadowBlur = 30 * (this.time/200); ctx.shadowColor='#fbbf24';
        } else {
            ctx.fillStyle='rgba(59,130,246,0.2)';
            ctx.fillRect(cylX+2,cylTop,cylW-4,gasTop-cylTop);
            ctx.shadowBlur=0;
        }
        ctx.shadowBlur=0;

        // Fuel+O2 particles
        this.particles.forEach(p => {
            p.x += p.vx * (this.ignited ? 3 : 1);
            p.y += p.vy * (this.ignited ? 3 : 1);
            if(p.x < cylX+5 || p.x > cylX+cylW-5) p.vx *= -1;
            if(p.y < cylTop+5 || p.y > gasTop) p.vy *= -1;
            if (this.ignited) {
                const r=Math.min(255,80+this.time*8), g=Math.max(0,180-this.time*5);
                ctx.fillStyle=`rgb(${r},${g},0)`;
            } else {
                ctx.fillStyle = p.type==='fuel' ? '#94a3b8' : '#38bdf8';
            }
            ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        });

        // Piston 3D
        ctx.fillStyle='#475569'; ctx.fillRect(cylX+2,pistonY,cylW-4,22);
        ctx.fillStyle='#64748b';
        ctx.beginPath(); ctx.moveTo(cylX+2,pistonY); ctx.lineTo(cylX+2+depth,pistonY-depth); ctx.lineTo(cylX+cylW-4+depth,pistonY-depth); ctx.lineTo(cylX+cylW-4,pistonY); ctx.closePath(); ctx.fill();

        // Connecting rod
        ctx.strokeStyle='#94a3b8'; ctx.lineWidth=7; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(cx,pistonY+20); ctx.lineTo(cx+ckX,cy+25+ckY); ctx.stroke();

        // Crankshaft
        ctx.strokeStyle='rgba(148,163,184,0.4)'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.ellipse(cx,cy+25,crankR,crankR*0.4,0,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle='#cbd5e1'; ctx.beginPath(); ctx.ellipse(cx+ckX,cy+25+ckY,7,4,0,0,Math.PI*2); ctx.fill();

        // Front cylinder outline
        ctx.strokeStyle='rgba(148,163,184,0.6)'; ctx.lineWidth=2; ctx.strokeRect(cylX,cylTop,cylW,cylBot-cylTop);

        // Spark plug + flash
        ctx.fillStyle='#94a3b8'; ctx.fillRect(cx-4,cylTop-16,8,18);
        if (this.ignited && Math.sin(this.crankAngle*0.5)>0.7) {
            ctx.save(); ctx.shadowBlur=25; ctx.shadowColor='#fbbf24';
            ctx.fillStyle='#fbbf24'; ctx.beginPath(); ctx.arc(cx,cylTop-16,8,0,Math.PI*2); ctx.fill();
            ctx.restore();
        }

        // Exhaust port (right side)
        ctx.fillStyle='#334155'; ctx.fillRect(cylX+cylW, cy-120, 40, 20);
        ctx.strokeStyle='#94a3b8'; ctx.lineWidth=1; ctx.strokeRect(cylX+cylW,cy-120,40,20);
        // Exhaust puffs
        this.exhaustPuffs.forEach((p,i) => {
            p.x+=p.vx; p.y+=p.vy; p.r+=0.5; p.a-=0.02;
            ctx.fillStyle=`rgba(100,116,139,${Math.max(0,p.a)})`; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        });
        this.exhaustPuffs = this.exhaustPuffs.filter(p=>p.a>0);

        // Stats overlay
        const panel_x = W*0.7, panel_y = H*0.15;
        ctx.fillStyle='rgba(15,23,42,0.85)'; ctx.beginPath(); ctx.roundRect(panel_x,panel_y,W*0.26,110,8); ctx.fill();
        ctx.strokeStyle='rgba(239,68,68,0.4)'; ctx.lineWidth=1; ctx.stroke();
        ctx.fillStyle='#f8fafc'; ctx.font='bold 12px Inter'; ctx.textAlign='left';
        ctx.fillText('Combustion Data', panel_x+10, panel_y+20);
        ctx.fillStyle='#fca5a5'; ctx.font='11px Inter';
        ctx.fillText(`Temp: ${this.temp.toFixed(0)} K`, panel_x+10, panel_y+42);
        ctx.fillText(`Energy: ${this.energy.toFixed(1)} MJ/kg`, panel_x+10, panel_y+60);
        ctx.fillText(`Crank: ${(this.crankAngle%360).toFixed(0)}°`, panel_x+10, panel_y+78);
        ctx.fillStyle = this.ignited ? '#4ade80' : '#ef4444';
        ctx.fillText(this.ignited ? '● IGNITED' : '◼ STANDBY', panel_x+10, panel_y+98);

        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
