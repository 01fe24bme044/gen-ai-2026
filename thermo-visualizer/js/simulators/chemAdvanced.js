window.chemAdvanced = {
    canvas: null,
    ctx: null,
    animationId: null,
    
    ballX: 0,
    currentG: 0,
    
    init() {
        this.canvas = document.getElementById('chem3-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const container = document.getElementById('chem3-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        this.bindControls();
        this.updateGibbs();
        this.ballX = 50; // Start at left (Reactants)
        this.animate();
    },
    
    stop() { 
        if(this.animationId) cancelAnimationFrame(this.animationId); 
    },
    
    bindControls() {
        const hSlider = document.getElementById('chem3-h-slider');
        const sSlider = document.getElementById('chem3-s-slider');
        const tSlider = document.getElementById('chem3-t-slider');
        
        [hSlider, sSlider, tSlider].forEach(slider => {
            if(slider) slider.addEventListener('input', () => this.updateGibbs());
        });
    },
    
    updateGibbs() {
        const h = parseFloat(document.getElementById('chem3-h-slider')?.value || -50);
        const s = parseFloat(document.getElementById('chem3-s-slider')?.value || 100) / 1000; // convert J to kJ
        const t = parseFloat(document.getElementById('chem3-t-slider')?.value || 300);
        
        document.getElementById('chem3-h-val').textContent = `${h} kJ/mol`;
        document.getElementById('chem3-s-val').textContent = `${s * 1000} J/mol·K`;
        document.getElementById('chem3-t-val').textContent = `${t} K`;
        
        const g = h - (t * s);
        const gVal = document.getElementById('chem3-g-val');
        const spont = document.getElementById('chem3-spont');
        
        if (gVal) gVal.textContent = `${g.toFixed(1)} kJ/mol`;
        if (spont) {
            if (g < 0) {
                spont.textContent = 'SPONTANEOUS';
                spont.style.color = '#4ade80';
            } else {
                spont.textContent = 'NON-SPONTANEOUS';
                spont.style.color = '#ef4444';
            }
        }
        this.currentG = g;
        
        // Reset ball if it changes sign drastically to let it re-roll
        if (this.currentG < 0 && this.ballX > 300) this.ballX = 50;
        if (this.currentG > 0 && this.ballX < 100) this.ballX = 350;
    },
    
    animate() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0,0,w,h);
        
        const baseline = h / 2 + 20;
        const endY = baseline + (this.currentG * 1.5); // scale G to pixels
        
        // Draw Energy Landscape
        this.ctx.beginPath();
        this.ctx.moveTo(50, baseline);
        // Curve to the end
        this.ctx.quadraticCurveTo(w/2, baseline - 50, w - 50, endY);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#94a3b8';
        this.ctx.stroke();
        
        // Labels
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Inter';
        this.ctx.fillText('Reactants', 50, baseline + 30);
        this.ctx.fillText('Products', w - 100, endY + 30);
        
        // Draw Gibbs value visual
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(w - 50, baseline);
        this.ctx.lineTo(w - 50, endY);
        this.ctx.strokeStyle = this.currentG < 0 ? '#4ade80' : '#ef4444';
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        this.ctx.fillStyle = this.currentG < 0 ? '#4ade80' : '#ef4444';
        this.ctx.fillText(`ΔG`, w - 30, (baseline + endY)/2);
        
        // Animate Ball
        if (this.currentG < 0) {
            // Roll right
            if (this.ballX < w - 50) this.ballX += 3;
        } else {
            // Roll left (falls back)
            if (this.ballX > 50) this.ballX -= 3;
        }
        
        // Calculate Y pos on curve (approximation using quadratic bezier)
        const t = (this.ballX - 50) / (w - 100);
        const ballY = Math.pow(1-t, 2)*baseline + 2*(1-t)*t*(baseline-50) + Math.pow(t, 2)*endY;
        
        this.ctx.beginPath();
        this.ctx.arc(this.ballX, ballY - 15, 15, 0, Math.PI*2);
        this.ctx.fillStyle = this.currentG < 0 ? '#4ade80' : '#ef4444';
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
