window.secondLaw = {
    canvas: null,
    ctx: null,
    animationId: null,
    
    particles: [],
    mixed: false,
    entropy: 0,
    
    init() {
        this.canvas = document.getElementById('secondlaw-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        const container = document.getElementById('secondlaw-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        this.bindControls();
        this.resetSystem();
        this.animate();
    },
    
    stop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    },
    
    bindControls() {
        const mixBtn = document.getElementById('mix-btn');
        const resetBtn = document.getElementById('reset-entropy-btn');
        
        const newMix = mixBtn.cloneNode(true);
        mixBtn.parentNode.replaceChild(newMix, mixBtn);
        const newReset = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(newReset, resetBtn);
        
        newMix.addEventListener('click', () => {
            this.mixed = !this.mixed;
            newMix.textContent = this.mixed ? 'Insert Partition' : 'Remove Partition';
            if (this.mixed) window.app.addXP(5);
        });
        
        newReset.addEventListener('click', () => {
            this.resetSystem();
        });
    },
    
    resetSystem() {
        this.mixed = false;
        const mixBtn = document.getElementById('mix-btn');
        if (mixBtn) mixBtn.textContent = 'Remove Partition';
        this.entropy = 0;
        this.particles = [];
        const el = document.getElementById('entropy-val');
        if(el) el.textContent = '0 J/K';
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Hot particles left
        for(let i=0; i<50; i++) {
            this.particles.push({
                x: Math.random() * (w/2 - 20) + 10,
                y: Math.random() * (h - 20) + 10,
                vx: (Math.random()-0.5)*4,
                vy: (Math.random()-0.5)*4,
                type: 'hot',
                color: '#ef4444'
            });
        }
        
        // Cold particles right
        for(let i=0; i<50; i++) {
            this.particles.push({
                x: w/2 + Math.random() * (w/2 - 20) + 10,
                y: Math.random() * (h - 20) + 10,
                vx: (Math.random()-0.5)*1.5,
                vy: (Math.random()-0.5)*1.5,
                type: 'cold',
                color: '#3b82f6'
            });
        }
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Draw partition
        if (!this.mixed) {
            this.ctx.fillStyle = '#94a3b8';
            this.ctx.fillRect(w/2 - 5, 0, 10, h);
        } else {
            this.entropy += 0.1;
            if (this.entropy < 100) {
                const el = document.getElementById('entropy-val');
                if(el) el.textContent = `${this.entropy.toFixed(1)} J/K`;
            }
        }
        
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounds
            let minX = 0, maxX = w;
            if (!this.mixed) {
                if (p.x <= w/2) maxX = w/2 - 5;
                else minX = w/2 + 5;
            }
            
            if (p.x < minX) { p.x = minX; p.vx *= -1; }
            if (p.x > maxX) { p.x = maxX; p.vx *= -1; }
            if (p.y < 0) { p.y = 0; p.vy *= -1; }
            if (p.y > h) { p.y = h; p.vy *= -1; }
            
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
