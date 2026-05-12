/**
 * Maxwell-Boltzmann Distribution - 3D Particle Box + Histogram
 */
// Helper function to get theme-aware text color
window.getCanvasTextColor = function(lightColor = '#000000', darkColor = '#ffffff') {
    return document.body.getAttribute('data-theme') === 'light' ? lightColor : darkColor;
};

window.maxwell = {
    canvas: null, ctx: null, animationId: null,
    particles: [], temp: 300, rotY: 0,

    init() {
        this.stop();
        this.canvas = document.getElementById('maxwell-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const c = document.getElementById('maxwell-canvas-container');
        const resize = () => {
            this.canvas.width  = c ? (c.clientWidth  || 900) : 900;
            this.canvas.height = c ? (c.clientHeight || 520) : 520;
        };
        resize();
        window.addEventListener('resize', resize);
        this.bindControls(); this.resetParticles(); this.animate();
    },

    stop() { if (this.animationId) cancelAnimationFrame(this.animationId); },

    bindControls() {
        const s = document.getElementById('maxwell-temp-slider');
        if (!s) return;
        const ns = s.cloneNode(true);
        s.parentNode.replaceChild(ns, s);
        ns.addEventListener('input', (e) => {
            this.temp = parseInt(e.target.value);
            document.getElementById('maxwell-temp-val').textContent = `${this.temp} K`;
            const mult = Math.sqrt(this.temp / 300);
            this.particles.forEach(p => {
                const spd = Math.sqrt(p.vx*p.vx+p.vy*p.vy+p.vz*p.vz) || 1;
                const target = this.getMBSpeed() * mult;
                const ratio = target / spd;
                p.vx *= ratio; p.vy *= ratio; p.vz *= ratio;
            });
            if (Math.random() > 0.8 && window.app) window.app.addXP(2);
        });
    },

    getMBSpeed() {
        // Box-Muller
        let u=0, v=0;
        while(u===0) u=Math.random(); while(v===0) v=Math.random();
        const n = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
        return Math.max(0.3, (n/10+0.5) * Math.sqrt(this.temp) / 5);
    },

    resetParticles() {
        this.particles = [];
        for (let i=0;i<120;i++) {
            const spd = this.getMBSpeed();
            const theta = Math.random()*Math.PI*2, phi = Math.random()*Math.PI;
            this.particles.push({
                x: (Math.random()-0.5)*160, y: (Math.random()-0.5)*160, z: (Math.random()-0.5)*160,
                vx: Math.sin(phi)*Math.cos(theta)*spd,
                vy: Math.sin(phi)*Math.sin(theta)*spd,
                vz: Math.cos(phi)*spd
            });
        }
    },

    project(x, y, z, cx, cy) {
        // Isometric projection
        const rx = x*Math.cos(this.rotY) + z*Math.sin(this.rotY);
        const rz = -x*Math.sin(this.rotY) + z*Math.cos(this.rotY);
        const sx = cx + (rx - rz) * Math.cos(Math.PI/6);
        const sy = cy + (rx + rz) * Math.sin(Math.PI/6) - y;
        return { sx, sy, depth: rz };
    },

    animate() {
        const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
        ctx.fillStyle = '#020617'; 
        ctx.fillRect(0,0,W,H);
        this.rotY += 0.008; // Slowly auto-rotate

        const boxW = 160, half = boxW/2;
        const cx = W*0.32, cy = H*0.5;
        const splitX = W*0.52;

        // Update particles
        const speedMult = Math.sqrt(this.temp/300);
        let speeds = [];
        this.particles.forEach(p => {
            p.x += p.vx * speedMult; p.y += p.vy * speedMult; p.z += p.vz * speedMult;
            if (p.x < -half) { p.x=-half; p.vx*=-1; }
            if (p.x > half)  { p.x=half;  p.vx*=-1; }
            if (p.y < -half) { p.y=-half; p.vy*=-1; }
            if (p.y > half)  { p.y=half;  p.vy*=-1; }
            if (p.z < -half) { p.z=-half; p.vz*=-1; }
            if (p.z > half)  { p.z=half;  p.vz*=-1; }
            speeds.push(Math.sqrt(p.vx*p.vx+p.vy*p.vy+p.vz*p.vz));
        });

        // Draw box edges
        const corners = [
            [-half,-half,-half],[half,-half,-half],[half,half,-half],[-half,half,-half],
            [-half,-half,half],[half,-half,half],[half,half,half],[-half,half,half]
        ];
        const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        ctx.strokeStyle = 'rgba(148,163,184,0.15)'; 
        ctx.lineWidth = 1;
        edges.forEach(([a,b]) => {
            const pa = this.project(...corners[a], cx, cy);
            const pb = this.project(...corners[b], cx, cy);
            ctx.beginPath(); ctx.moveTo(pa.sx,pa.sy); ctx.lineTo(pb.sx,pb.sy); ctx.stroke();
        });

        // Sort particles by depth
        const sorted = this.particles.map((p,i) => ({...p, spd:speeds[i], proj: this.project(p.x,p.y,p.z,cx,cy)}))
                                     .sort((a,b) => a.proj.depth - b.proj.depth);

        // Draw particles
        sorted.forEach(p => {
            const hue = 240 - Math.min(240, p.spd * 20 * (300/this.temp));
            const radius = 3 + (p.spd / 5);
            ctx.beginPath(); ctx.arc(p.proj.sx, p.proj.sy, Math.min(7, radius), 0, Math.PI*2);
            ctx.fillStyle = `hsl(${hue},100%,60%)`;
            ctx.shadowBlur = 4; 
            ctx.shadowColor = `hsl(${hue},100%,60%)`;
            ctx.fill(); ctx.shadowBlur = 0;
        });

        // Temperature label on box
        ctx.fillStyle = 'rgba(148,163,184,0.7)'; 
        ctx.font='12px Inter'; ctx.textAlign='center';
        ctx.fillText(`T = ${this.temp} K`, cx, H-20);
        ctx.fillText('3D Particle Box (Rotate: Automatic)', cx, H-6);

        // Divider
        ctx.strokeStyle = 'rgba(148,163,184,0.2)'; 
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(splitX,20); ctx.lineTo(splitX,H-20); ctx.stroke();

        // Histogram on right
        this.drawHistogram(speeds, splitX+15, W-15, H, ctx);

        this.animationId = requestAnimationFrame(() => this.animate());
    },

    drawHistogram(speeds, startX, endX, H, ctx) {
        const bins = new Array(24).fill(0);
        const maxSpd = 15;
        speeds.forEach(s => { const i = Math.min(bins.length-1, Math.floor((s/maxSpd)*bins.length)); if(i>=0) bins[i]++; });
        const bw = (endX-startX)/bins.length;
        const maxCount = Math.max(...bins, 1);
        const chartH = H - 80;

        // Axes
        ctx.strokeStyle = 'rgba(148,163,184,0.5)'; 
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(startX,30); ctx.lineTo(startX,H-40); ctx.lineTo(endX,H-40); ctx.stroke();

        // Bars
        bins.forEach((count,i) => {
            const bh = (count/maxCount)*chartH;
            const hue = 240 - (i/bins.length)*240;
            const grad = ctx.createLinearGradient(0,H-40-bh,0,H-40);
            grad.addColorStop(0,`hsla(${hue},100%,65%,0.9)`);
            grad.addColorStop(1,`hsla(${hue},100%,40%,0.6)`);
            ctx.fillStyle=grad;
            ctx.fillRect(startX+i*bw+1, H-40-bh, bw-2, bh);
        });

        // MB curve overlay - completely corrected formula for scaling
        ctx.strokeStyle = '#fbbf24'; 
        ctx.lineWidth=2.5; ctx.beginPath();
        const Tscale = this.temp/300;
        
        // Find max theoretical value to normalize the curve
        let peakVal = 0;
        for(let i=0;i<100;i++) {
            const v = (i/100)*maxSpd;
            const f = v*v*Math.exp(-v*v/(2*Tscale));
            if(f > peakVal) peakVal = f;
        }

        for(let i=0;i<bins.length;i++) {
            const v = (i/bins.length)*maxSpd;
            // MB distribution ~ v^2 * e^(-mv^2 / 2kT)
            const f = v*v*Math.exp(-v*v/(2*Tscale));
            // Normalize against peak, and scale to 90% of chart height
            const normalizedF = (f / peakVal) * 0.9;
            const y = H-40 - normalizedF*chartH;
            const x = startX + i*bw + bw/2;
            i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.stroke();

        // Labels
        ctx.fillStyle = 'rgba(148,163,184,0.7)'; 
        ctx.font='11px Inter'; ctx.textAlign='center';
        ctx.fillText('Speed →', (startX+endX)/2, H-18);
        ctx.fillStyle = '#fbbf24'; 
        ctx.font='11px Inter';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 2;
        ctx.fillText('── MB Curve', (startX+endX)/2, H-5);
        ctx.fillStyle = getCanvasTextColor(); 
        ctx.font='bold 14px Inter';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 3;
        ctx.fillText('Maxwell-Boltzmann Distribution', (startX+endX)/2, 20);
        ctx.shadowBlur = 0;
    }
};
