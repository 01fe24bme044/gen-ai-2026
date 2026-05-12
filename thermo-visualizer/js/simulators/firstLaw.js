window.firstLaw = {
    canvas: null,
    ctx: null,
    animationId: null,
    
    // State
    pressure: 5,
    temp: 450,
    rotationSpeed: 0.1,
    angle: 0,
    
    init() {
        this.canvas = document.getElementById('firstlaw-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        const container = document.getElementById('firstlaw-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        this.bindControls();
        this.animate();
    },
    
    stop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    },
    
    bindControls() {
        const pSlider = document.getElementById('steam-p-slider');
        const tSlider = document.getElementById('steam-t-slider');
        
        const newP = pSlider.cloneNode(true);
        pSlider.parentNode.replaceChild(newP, pSlider);
        const newT = tSlider.cloneNode(true);
        tSlider.parentNode.replaceChild(newT, tSlider);
        
        newP.addEventListener('input', (e) => {
            this.pressure = parseFloat(e.target.value);
            this.updatePower();
        });
        
        newT.addEventListener('input', (e) => {
            this.temp = parseFloat(e.target.value);
            this.updatePower();
        });
        
        this.updatePower();
    },
    
    updatePower() {
        // Simplified power calculation based on P and T
        const power = (this.pressure * 10) * (this.temp / 300);
        document.getElementById('turbine-power-val').textContent = `${power.toFixed(1)} MW`;
        
        // Update visual rotation speed
        this.rotationSpeed = power * 0.005;
        
        if (Math.random() > 0.5) window.app.addXP(2);
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        this.angle += this.rotationSpeed;
        
        // Draw Turbine Casing
        this.ctx.strokeStyle = '#94a3b8';
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 100, cy - 80);
        this.ctx.lineTo(cx + 100, cy - 120);
        this.ctx.lineTo(cx + 100, cy + 120);
        this.ctx.lineTo(cx - 100, cy + 80);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Draw Steam entering
        this.ctx.fillStyle = `rgba(255, 150, 50, ${this.pressure/10})`;
        for(let i=0; i<10; i++) {
            const x = cx - 150 + (Date.now()*this.rotationSpeed*10 + i*20) % 50;
            const y = cy - 40 + Math.sin(i)*20;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI*2);
            this.ctx.fill();
        }
        
        // Draw Turbine Rotor
        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(this.angle);
        
        this.ctx.fillStyle = '#475569';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 30, 0, Math.PI*2);
        this.ctx.fill();
        
        // Blades
        this.ctx.fillStyle = '#64748b';
        for(let i=0; i<8; i++) {
            this.ctx.rotate(Math.PI / 4);
            this.ctx.fillRect(-5, 30, 10, 60);
        }
        
        this.ctx.restore();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
