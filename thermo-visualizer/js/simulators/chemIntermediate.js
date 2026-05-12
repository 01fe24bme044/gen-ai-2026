// Helper function to get theme-aware text color
window.getCanvasTextColor = function(lightColor = '#000000', darkColor = '#ffffff') {
    return document.body.getAttribute('data-theme') === 'light' ? lightColor : darkColor;
};

window.chemIntermediate = {
    canvas: null,
    ctx: null,
    animationId: null,
    
    n2: 20,
    h2: 60,
    nh3: 10,
    targetN2: 20,
    targetH2: 60,
    targetNh3: 10,
    
    pressure: 1.0,
    temp: 450,
    
    particles: [],
    
    init() {
        this.canvas = document.getElementById('chem2-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const container = document.getElementById('chem2-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        this.bindControls();
        this.initParticles();
        this.animate();
    },
    
    stop() { 
        if (this.animationId) cancelAnimationFrame(this.animationId); 
    },
    
    initParticles() {
        this.particles = [];
        const addP = (type, count) => {
            for(let i=0; i<count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random()-0.5)*2,
                    vy: (Math.random()-0.5)*2,
                    type: type
                });
            }
        };
        addP('n2', this.n2);
        addP('h2', this.h2);
        addP('nh3', this.nh3);
    },
    
    bindControls() {
        document.getElementById('eq-add-n2')?.addEventListener('click', () => {
            this.targetN2 += 20; // Stress
            this.targetH2 -= 30; // Shifts right
            this.targetNh3 += 20;
            this.updateFeedback("Added N₂! System shifts RIGHT to consume the excess N₂.");
            this.applyStress();
        });
        document.getElementById('eq-inc-pres')?.addEventListener('click', () => {
            this.pressure += 0.5;
            this.targetN2 -= 5;
            this.targetH2 -= 15;
            this.targetNh3 += 10;
            this.updateFeedback("Increased Pressure! System shifts RIGHT towards fewer moles of gas (4 moles ⇌ 2 moles).");
            this.applyStress();
        });
        document.getElementById('eq-inc-temp')?.addEventListener('click', () => {
            this.temp += 50;
            this.targetN2 += 10;
            this.targetH2 += 30;
            this.targetNh3 -= 20;
            this.updateFeedback("Increased Temperature! Since reaction is exothermic, system shifts LEFT to absorb heat.");
            this.applyStress();
        });
    },
    
    updateFeedback(text) {
        const el = document.getElementById('eq-feedback');
        if (el) {
            el.textContent = text;
            window.app.addXP(5);
        }
    },
    
    applyStress() {
        this.targetN2 = Math.max(0, this.targetN2);
        this.targetH2 = Math.max(0, this.targetH2);
        this.targetNh3 = Math.max(0, this.targetNh3);
    },
    
    animate() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0,0,w,h);
        
        // Approach targets gradually to simulate equilibrium shift
        if (this.n2 < this.targetN2 && Math.random() < 0.1) { this.n2++; this.particles.push({x:w/2, y:h/2, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, type:'n2'}); }
        else if (this.n2 > this.targetN2 && Math.random() < 0.1) { this.n2--; const idx = this.particles.findIndex(p=>p.type==='n2'); if(idx>-1) this.particles.splice(idx,1); }
        
        if (this.h2 < this.targetH2 && Math.random() < 0.1) { this.h2++; this.particles.push({x:w/2, y:h/2, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, type:'h2'}); }
        else if (this.h2 > this.targetH2 && Math.random() < 0.1) { this.h2--; const idx = this.particles.findIndex(p=>p.type==='h2'); if(idx>-1) this.particles.splice(idx,1); }
        
        if (this.nh3 < this.targetNh3 && Math.random() < 0.1) { this.nh3++; this.particles.push({x:w/2, y:h/2, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, type:'nh3'}); }
        else if (this.nh3 > this.targetNh3 && Math.random() < 0.1) { this.nh3--; const idx = this.particles.findIndex(p=>p.type==='nh3'); if(idx>-1) this.particles.splice(idx,1); }
        
        // Draw volume boundary based on pressure
        const boxSize = Math.max(150, 400 / this.pressure);
        const boxX = w/2 - boxSize/2;
        const boxY = h/2 - boxSize/2;
        
        this.ctx.strokeStyle = '#334155';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(boxX, boxY, boxSize, boxSize);
        
        this.particles.forEach(p => {
            p.x += p.vx * (this.temp / 450);
            p.y += p.vy * (this.temp / 450);
            
            if (p.x < boxX+5) { p.x = boxX+5; p.vx*=-1; }
            if (p.x > boxX+boxSize-5) { p.x = boxX+boxSize-5; p.vx*=-1; }
            if (p.y < boxY+5) { p.y = boxY+5; p.vy*=-1; }
            if (p.y > boxY+boxSize-5) { p.y = boxY+boxSize-5; p.vy*=-1; }
            
            this.ctx.beginPath();
            if (p.type === 'n2') {
                this.ctx.fillStyle = '#3b82f6'; // blue
                this.ctx.arc(p.x-4, p.y, 4, 0, Math.PI*2); this.ctx.fill();
                this.ctx.arc(p.x+4, p.y, 4, 0, Math.PI*2); this.ctx.fill();
            } else if (p.type === 'h2') {
                this.ctx.fillStyle = '#f8fafc'; // white
                this.ctx.shadowColor = 'rgba(0,0,0,0.2)';
                this.ctx.shadowBlur = 2;
                this.ctx.arc(p.x-2, p.y, 2, 0, Math.PI*2); this.ctx.fill();
                this.ctx.arc(p.x+2, p.y, 2, 0, Math.PI*2); this.ctx.fill();
                this.ctx.shadowBlur = 0;
            } else if (p.type === 'nh3') {
                this.ctx.fillStyle = '#10b981'; // green core
                this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
                this.ctx.shadowBlur = 3;
                this.ctx.arc(p.x, p.y, 6, 0, Math.PI*2); this.ctx.fill();
                this.ctx.fillStyle = getCanvasTextColor(); // theme-aware H's
                this.ctx.beginPath(); this.ctx.arc(p.x-5, p.y+4, 2, 0, Math.PI*2); this.ctx.fill();
                this.ctx.beginPath(); this.ctx.arc(p.x+5, p.y+4, 2, 0, Math.PI*2); this.ctx.fill();
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y-6, 2, 0, Math.PI*2); this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        });
        
        // Draw HUD with 3D effects
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        this.ctx.fillRect(10, 10, 140, 100);
        // Add 3D border effect
        this.ctx.strokeStyle = 'rgba(59,130,246,0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(8, 8, 144, 104);
        
        this.ctx.fillStyle = getCanvasTextColor();
        this.ctx.font = 'bold 15px Inter';
        this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
        this.ctx.shadowBlur = 2;
        this.ctx.fillText(`N₂  (Blue): ${this.n2}`, 20, 35);
        this.ctx.fillText(`H₂  (White): ${this.h2}`, 20, 60);
        this.ctx.shadowBlur = 0;
        this.ctx.fillText(`NH₃ (Green): ${this.nh3}`, 20, 85);
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
