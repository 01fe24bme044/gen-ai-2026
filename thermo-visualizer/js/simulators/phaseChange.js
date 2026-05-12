window.phaseChange = {
    canvas: null,
    ctx: null,
    animationId: null,
    
    temp: 273.16,
    pres: 0.006,
    phase: 'triple', // solid, liquid, gas, triple
    particles: [],
    
    init() {
        this.canvas = document.getElementById('phase-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        const container = document.getElementById('phase-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        this.bindControls();
        this.resetParticles();
        this.updatePhase();
        this.animate();
    },
    
    stop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    },
    
    bindControls() {
        const tSlider = document.getElementById('phase-temp-slider');
        const pSlider = document.getElementById('phase-pres-slider');
        
        if (tSlider) {
            const nT = tSlider.cloneNode(true);
            tSlider.parentNode.replaceChild(nT, tSlider);
        }
        if (pSlider) {
            const nP = pSlider.cloneNode(true);
            pSlider.parentNode.replaceChild(nP, pSlider);
        }
        
        const newTSlider = document.getElementById('phase-temp-slider');
        const newPSlider = document.getElementById('phase-pres-slider');
        
        const changeHandler = () => {
            this.temp = parseFloat(newTSlider.value);
            this.pres = parseFloat(newPSlider.value);
            
            document.getElementById('phase-temp-val').textContent = `${this.temp} K`;
            document.getElementById('phase-pres-val').textContent = `${this.pres} atm`;
            
            this.updatePhase();
        };
        
        if (newTSlider) newTSlider.addEventListener('input', changeHandler);
        if (newPSlider) newPSlider.addEventListener('input', changeHandler);
    },
    
    updatePhase() {
        // Simplified P-T Diagram logic for water
        // Triple point: 273.16 K, 0.006 atm
        
        const tDist = Math.abs(this.temp - 273.16);
        const pDist = Math.abs(this.pres - 0.006);
        
        let newPhase = '';
        let phaseColor = '';
        
        if (tDist < 5 && pDist < 0.1) {
            newPhase = 'Triple Point (Equilibrium)';
            this.phase = 'triple';
            phaseColor = '#fbbf24';
            if(Math.random() > 0.9) window.app.addXP(20); 
        } else if (this.pres < 0.006) {
            // Below triple pressure
            if (this.temp < 273.16) {
                newPhase = 'Solid (Ice)';
                this.phase = 'solid';
                phaseColor = '#93c5fd';
            } else {
                newPhase = 'Gas (Water Vapor)';
                this.phase = 'gas';
                phaseColor = '#cbd5e1';
            }
        } else {
            // Above triple pressure
            if (this.temp < 273) {
                newPhase = 'Solid (Ice)';
                this.phase = 'solid';
                phaseColor = '#93c5fd';
            } else if (this.temp > 373 && this.pres <= 1) { // roughly
                newPhase = 'Gas (Steam)';
                this.phase = 'gas';
                phaseColor = '#cbd5e1';
            } else {
                newPhase = 'Liquid (Water)';
                this.phase = 'liquid';
                phaseColor = '#3b82f6';
            }
        }
        
        const stateVal = document.getElementById('phase-state-val');
        if (stateVal) {
            stateVal.textContent = newPhase;
            stateVal.style.color = phaseColor;
        }
    },
    
    resetParticles() {
        this.particles = [];
        for(let i=0; i<80; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: 0,
                vy: 0,
                baseX: (i%10) * 30 + 100, // Lattice target X
                baseY: Math.floor(i/10) * 30 + 100 // Lattice target Y
            });
        }
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        this.ctx.fillStyle = this.phase === 'solid' ? '#93c5fd' : (this.phase === 'liquid' ? '#3b82f6' : '#cbd5e1');
        if (this.phase === 'triple') this.ctx.fillStyle = '#fbbf24';
        
        this.particles.forEach(p => {
            if (this.phase === 'solid') {
                // Return to lattice vibrating
                p.x += (p.baseX - p.x) * 0.1 + (Math.random()-0.5)*2;
                p.y += (p.baseY - p.y) * 0.1 + (Math.random()-0.5)*2;
            } else if (this.phase === 'liquid') {
                // Stay near bottom, flow around
                if (p.y < h - 150) p.vy += 0.5; // gravity
                p.vx += (Math.random()-0.5);
                p.vy += (Math.random()-0.5);
                p.vx *= 0.9; p.vy *= 0.9; // friction
            } else if (this.phase === 'gas') {
                // Fly everywhere fast
                p.vx += (Math.random()-0.5)*4;
                p.vy += (Math.random()-0.5)*4;
                // Bounce
                if(p.x<0||p.x>w) p.vx*=-1;
                if(p.y<0||p.y>h) p.vy*=-1;
            } else if (this.phase === 'triple') {
                // Mix of behaviors
                p.vx += (Math.random()-0.5)*1.5;
                p.vy += (Math.random()-0.5)*1.5;
                if (p.x < 0 || p.x > w) p.x = w/2;
                if (p.y < 0 || p.y > h) p.y = h/2;
            }
            
            p.x += p.vx || 0;
            p.y += p.vy || 0;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 6, 0, Math.PI*2);
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
