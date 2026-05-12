window.chemBeginner = {
    canvas: null,
    ctx: null,
    animationId: null,
    
    rxnType: 'exo',
    waterTemp: 298,
    targetTemp: 298,
    isReacting: false,
    reactants: [],
    bubbles: [],
    heatArrows: [],
    bgShift: 0,
    
    init() {
        this.canvas = document.getElementById('chem1-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        const container = document.getElementById('chem1-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        this.waterTemp = 298;
        this.targetTemp = 298;
        this.isReacting = false;
        this.reactants = [];
        this.bubbles = [];
        this.heatArrows = [];
        this.bgShift = 0;
        
        this.bindControls();
        this.animate();
    },
    
    stop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    },
    
    bindControls() {
        const exoBtn = document.getElementById('rxn-exo');
        const endoBtn = document.getElementById('rxn-endo');
        const startBtn = document.getElementById('rxn-start');
        
        if (exoBtn) {
            exoBtn.addEventListener('click', () => {
                this.rxnType = 'exo';
                exoBtn.style.background = 'var(--accent)';
                endoBtn.style.background = 'var(--bg-dark)';
                this.resetReaction();
            });
        }
        
        if (endoBtn) {
            endoBtn.addEventListener('click', () => {
                this.rxnType = 'endo';
                endoBtn.style.background = 'var(--accent)';
                exoBtn.style.background = 'var(--bg-dark)';
                this.resetReaction();
            });
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.isReacting) return;
                this.isReacting = true;
                
                // Spawn reactant drops
                for (let i = 0; i < 20; i++) {
                    this.reactants.push({
                        x: this.canvas.width / 2 + (Math.random() - 0.5) * 60,
                        y: 50 + (Math.random() * 50),
                        vy: 2 + Math.random() * 2,
                        dissolving: false,
                        life: 1.0
                    });
                }
                
                // Set target temp
                if (this.rxnType === 'exo') {
                    this.targetTemp = this.waterTemp + 50; // Heat up
                } else {
                    this.targetTemp = this.waterTemp - 50; // Cool down
                }
            });
        }
    },
    
    resetReaction() {
        this.isReacting = false;
        this.reactants = [];
        this.bubbles = [];
        this.heatArrows = [];
        this.targetTemp = 298;
        // Slowly drift back to room temp if not reacting
    },
    
    animate() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        this.ctx.clearRect(0, 0, w, h);
        
        // Temperature logic
        if (this.isReacting) {
            // Check if reactants are dissolving
            let dissolvingCount = 0;
            this.reactants.forEach(r => {
                if (r.dissolving) dissolvingCount++;
            });
            
            if (dissolvingCount > 0) {
                // Change temp towards target
                this.waterTemp += (this.targetTemp - this.waterTemp) * 0.01;
                this.bgShift += (1.0 - this.bgShift) * 0.05;
                
                // Spawn heat arrows
                if (Math.random() < 0.3) {
                    const boxW = 140;
                    const boxX = w / 2 - boxW / 2;
                    const isExo = this.rxnType === 'exo';
                    
                    // Exothermic: start at beaker, move out
                    // Endothermic: start out, move to beaker
                    const side = Math.random() < 0.5 ? -1 : 1;
                    const startX = isExo ? (w/2 + side * boxW/2) : (w/2 + side * (boxW/2 + 100));
                    const targetX = isExo ? (w/2 + side * (boxW/2 + 100)) : (w/2 + side * boxW/2);
                    
                    this.heatArrows.push({
                        x: startX,
                        y: h / 2 + (Math.random() - 0.5) * 100,
                        vx: (targetX - startX) * 0.02,
                        life: 1.0,
                        isExo: isExo
                    });
                }
            } else {
                this.bgShift += (0 - this.bgShift) * 0.05;
            }
        } else {
            // Drift back to 298 (room temp)
            this.waterTemp += (298 - this.waterTemp) * 0.005;
            this.bgShift += (0 - this.bgShift) * 0.05;
        }
        
        // Draw background shift
        if (this.bgShift > 0.01) {
            const shiftColor = this.rxnType === 'exo' ? `rgba(239, 68, 68, ${this.bgShift * 0.15})` : `rgba(59, 130, 246, ${this.bgShift * 0.15})`;
            this.ctx.fillStyle = shiftColor;
            this.ctx.fillRect(0, 0, w, h);
        }
        
        // Update UI
        const tempVal = document.getElementById('chem1-temp-val');
        if (tempVal) {
            tempVal.textContent = `${Math.round(this.waterTemp)} K`;
            if (this.waterTemp > 300) tempVal.style.color = '#ef4444'; // Red
            else if (this.waterTemp < 290) tempVal.style.color = '#3b82f6'; // Blue
            else tempVal.style.color = '#f8fafc'; // White
        }
        
        // Draw Beaker
        const boxW = 140;
        const boxH = 200;
        const boxX = w / 2 - boxW / 2;
        const boxY = h / 2 - boxH / 2 + 50;
        
        const waterLevel = boxY + 40;
        
        // Draw Water
        let hue = 240 - ((this.waterTemp - 248) / 100) * 240; // 248K is blue, 348K is red
        hue = Math.max(0, Math.min(240, hue));
        
        this.ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.6)`;
        this.ctx.fillRect(boxX, waterLevel, boxW, boxH - 40);
        
        // Add bubbles if reacting
        if (this.isReacting && Math.random() < 0.2) {
            this.bubbles.push({
                x: boxX + 10 + Math.random() * (boxW - 20),
                y: boxY + boxH - 10,
                vy: -2 - Math.random() * 2,
                radius: 2 + Math.random() * 3
            });
        }
        
        // Draw bubbles
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const b = this.bubbles[i];
            b.y += b.vy;
            b.x += Math.sin(b.y * 0.1) * 0.5; // Wiggle
            
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (b.y < waterLevel) {
                this.bubbles.splice(i, 1);
            }
        }
        
        // Draw Reactants
        for (let i = this.reactants.length - 1; i >= 0; i--) {
            const r = this.reactants[i];
            
            if (!r.dissolving) {
                r.y += r.vy;
                if (r.y > waterLevel + 50 + Math.random() * 50) {
                    r.dissolving = true;
                    // Flash effect on water entry
                    window.app.addXP(1);
                }
            } else {
                r.life -= 0.02;
                if (r.life <= 0) {
                    this.reactants.splice(i, 1);
                    continue;
                }
            }
            
            this.ctx.fillStyle = this.rxnType === 'exo' ? `rgba(245, 158, 11, ${r.life})` : `rgba(16, 185, 129, ${r.life})`;
            this.ctx.beginPath();
            this.ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw Beaker Glass
        this.ctx.beginPath();
        this.ctx.moveTo(boxX - 10, boxY - 10);
        this.ctx.lineTo(boxX, boxY);
        this.ctx.lineTo(boxX, boxY + boxH);
        this.ctx.lineTo(boxX + boxW, boxY + boxH);
        this.ctx.lineTo(boxX + boxW, boxY);
        this.ctx.lineTo(boxX + boxW + 10, boxY - 10);
        
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.stroke();
        
        // Draw Thermometer
        const thermX = boxX + boxW - 20;
        const thermY = boxY - 30;
        const thermH = 150;
        
        // Glass tube
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.fillRect(thermX - 4, thermY, 8, thermH);
        
        // Bulb
        this.ctx.beginPath();
        this.ctx.arc(thermX, thermY + thermH, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Mercury level
        const mercuryH = ((this.waterTemp - 200) / 200) * thermH; // Scale 200K - 400K
        const validMercH = Math.max(0, Math.min(thermH, mercuryH));
        
        this.ctx.fillStyle = '#ef4444'; // Red mercury
        this.ctx.beginPath();
        this.ctx.arc(thermX, thermY + thermH, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillRect(thermX - 2, thermY + thermH - validMercH, 4, validMercH);
        
        // Draw Heat Arrows
        this.ctx.lineWidth = 3;
        for (let i = this.heatArrows.length - 1; i >= 0; i--) {
            const arrow = this.heatArrows[i];
            arrow.x += arrow.vx;
            arrow.life -= 0.02;
            
            if (arrow.life <= 0) {
                this.heatArrows.splice(i, 1);
                continue;
            }
            
            this.ctx.strokeStyle = arrow.isExo ? `rgba(239, 68, 68, ${arrow.life})` : `rgba(59, 130, 246, ${arrow.life})`;
            
            this.ctx.beginPath();
            this.ctx.moveTo(arrow.x, arrow.y);
            this.ctx.lineTo(arrow.x - Math.sign(arrow.vx) * 20, arrow.y - 10);
            this.ctx.moveTo(arrow.x, arrow.y);
            this.ctx.lineTo(arrow.x - Math.sign(arrow.vx) * 20, arrow.y + 10);
            this.ctx.moveTo(arrow.x, arrow.y);
            this.ctx.lineTo(arrow.x - Math.sign(arrow.vx) * 40, arrow.y);
            this.ctx.stroke();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
