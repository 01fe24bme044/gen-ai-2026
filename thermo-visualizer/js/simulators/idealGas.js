window.idealGas = {
    canvas: null,
    ctx: null,
    animationId: null,
    particles: [],
    
    // Physics parameters
    temp: 300,
    volume: 100, // percentage
    numParticles: 100,
    
    init() {
        this.canvas = document.getElementById('gas-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        const container = document.getElementById('gas-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        this.bindControls();
        this.initParticles();
        this.animate();
    },
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    bindControls() {
        const tempSlider = document.getElementById('temp-slider');
        const volSlider = document.getElementById('vol-slider');
        const nSlider = document.getElementById('particles-slider');
        
        const newTemp = tempSlider.cloneNode(true);
        tempSlider.parentNode.replaceChild(newTemp, tempSlider);
        const newVol = volSlider.cloneNode(true);
        volSlider.parentNode.replaceChild(newVol, volSlider);
        const newN = nSlider.cloneNode(true);
        nSlider.parentNode.replaceChild(newN, nSlider);
        
        newTemp.addEventListener('input', (e) => {
            this.temp = parseInt(e.target.value);
            document.getElementById('temp-val').textContent = `${this.temp} K`;
            this.updatePressure();
        });
        
        newVol.addEventListener('input', (e) => {
            this.volume = parseInt(e.target.value);
            document.getElementById('vol-val').textContent = `${this.volume}%`;
            this.updatePressure();
        });
        
        newN.addEventListener('input', (e) => {
            const num = parseInt(e.target.value);
            document.getElementById('particles-val').textContent = num;
            
            if (num > this.numParticles) {
                for(let i=0; i<num - this.numParticles; i++) {
                    this.particles.push(this.createParticle());
                }
            } else {
                this.particles.splice(0, this.numParticles - num);
            }
            this.numParticles = num;
            this.updatePressure();
        });
        
        this.updatePressure();
    },
    
    createParticle() {
        return {
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            z: Math.random() * 200 - 100,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            vz: (Math.random() - 0.5) * 5
        };
    },
    
    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push(this.createParticle());
        }
    },
    
    updatePressure() {
        const P = (this.numParticles * this.temp) / (this.volume * 300); 
        const pVal = document.getElementById('pressure-val');
        if (pVal) {
            pVal.textContent = `${P.toFixed(2)} atm`;
        }
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const cx = cw / 2;
        const cy = ch / 2;
        
        // 3D Box boundaries
        const boxWidth = 200;
        const boxHeight = 200;
        const currentDepth = (this.volume / 100) * 200; // Piston moves in Z
        
        // Speed multiplier
        const speedMult = Math.sqrt(this.temp / 300);
        
        // Update particles
        this.particles.forEach(p => {
            p.x += p.vx * speedMult;
            p.y += p.vy * speedMult;
            p.z += p.vz * speedMult;
            
            // Bounce
            if (p.x < -boxWidth/2) { p.x = -boxWidth/2; p.vx *= -1; }
            if (p.x > boxWidth/2) { p.x = boxWidth/2; p.vx *= -1; }
            if (p.y < -boxHeight/2) { p.y = -boxHeight/2; p.vy *= -1; }
            if (p.y > boxHeight/2) { p.y = boxHeight/2; p.vy *= -1; }
            if (p.z < -currentDepth/2) { p.z = -currentDepth/2; p.vz *= -1; }
            if (p.z > currentDepth/2) { p.z = currentDepth/2; p.vz *= -1; }
        });
        
        // Simple isometric projection
        const project = (x, y, z) => {
            const isoX = cx + (x - z) * Math.cos(Math.PI/6);
            const isoY = cy + (x + z) * Math.sin(Math.PI/6) - y;
            return { x: isoX, y: isoY, scale: 200 / (200 + z + currentDepth/2) };
        };
        
        // Draw Box Lines (Back)
        this.ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        this.ctx.lineWidth = 1;
        
        const w = boxWidth/2;
        const h = boxHeight/2;
        const d = currentDepth/2;
        
        const p1 = project(-w, -h, -d);
        const p2 = project(w, -h, -d);
        const p3 = project(w, h, -d);
        const p4 = project(-w, h, -d);
        
        const p5 = project(-w, -h, d);
        const p6 = project(w, -h, d);
        const p7 = project(w, h, d);
        const p8 = project(-w, h, d);
        
        // Back face
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y); this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineTo(p3.x, p3.y); this.ctx.lineTo(p4.x, p4.y);
        this.ctx.closePath(); this.ctx.stroke();
        
        // Connecting lines
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y); this.ctx.lineTo(p5.x, p5.y);
        this.ctx.moveTo(p2.x, p2.y); this.ctx.lineTo(p6.x, p6.y);
        this.ctx.moveTo(p3.x, p3.y); this.ctx.lineTo(p7.x, p7.y);
        this.ctx.moveTo(p4.x, p4.y); this.ctx.lineTo(p8.x, p8.y);
        this.ctx.stroke();
        
        // Sort particles by depth (Z) for 3D effect
        this.particles.sort((a, b) => b.z - a.z);
        
        // Draw Particles
        this.particles.forEach(p => {
            const proj = project(p.x, p.y, p.z);
            this.ctx.beginPath();
            this.ctx.arc(proj.x, proj.y, 4 * proj.scale, 0, Math.PI*2);
            
            // Color based on temperature
            const r = Math.min(255, this.temp / 2);
            const b = Math.max(0, 255 - this.temp / 2);
            this.ctx.fillStyle = `rgb(${r}, 100, ${b})`;
            
            this.ctx.fill();
        });
        
        // Draw Box Lines (Front)
        this.ctx.strokeStyle = 'rgba(255,255,255,0.4)'; // brighter front
        this.ctx.beginPath();
        this.ctx.moveTo(p5.x, p5.y); this.ctx.lineTo(p6.x, p6.y);
        this.ctx.lineTo(p7.x, p7.y); this.ctx.lineTo(p8.x, p8.y);
        this.ctx.closePath(); this.ctx.stroke();
        
        // Piston visual (Front face)
        this.ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        this.ctx.fill();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
