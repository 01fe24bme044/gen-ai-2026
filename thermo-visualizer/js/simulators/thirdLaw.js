/**
 * Third Law of Thermodynamics - 3D Crystal Lattice Simulator
 * Visualizes the approach to Absolute Zero with a rotating 3D crystal.
 */
window.thirdLaw = {
    canvas: null,
    ctx: null,
    animationId: null,
    temp: 300,
    targetTemp: 300,
    atoms: [],
    rotY: 0,
    rotX: 0.3,
    
    init() {
        this.canvas = document.getElementById('thirdlaw-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth || 600;
        this.canvas.height = container.clientHeight || 400;
        this.initCrystal();
        this.bindControls();
        this.animate();
    },
    
    stop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    },
    
    initCrystal() {
        this.atoms = [];
        const size = 4;
        const spacing = 40;
        for (let x = -size/2; x < size/2; x++) {
            for (let y = -size/2; y < size/2; y++) {
                for (let z = -size/2; z < size/2; z++) {
                    this.atoms.push({
                        bx: x * spacing, by: y * spacing, bz: z * spacing,
                        x: x * spacing, y: y * spacing, z: z * spacing,
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }
        }
    },
    
    bindControls() {
        const slider = document.getElementById('thirdlaw-temp');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.targetTemp = parseFloat(e.target.value);
                const val = document.getElementById('thirdlaw-temp-val');
                if (val) val.textContent = Math.round(this.targetTemp);
            });
        }
    },
    
    project(x, y, z, cx, cy) {
        const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
        const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;
        let y1 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;
        const scale = 300 / (300 + z2);
        return { px: cx + x1 * scale, py: cy + y1 * scale, depth: z2, scale: scale };
    },
    
    animate() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const cx = W / 2, cy = H / 2;
        
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, W, H);
        
        this.temp += (this.targetTemp - this.temp) * 0.08;
        this.rotY += 0.008;
        
        // Update labels
        const entropyEl = document.getElementById('thirdlaw-entropy');
        const stateEl = document.getElementById('thirdlaw-state');
        if (entropyEl) {
            if (this.temp < 1) { entropyEl.textContent = 'S → 0 (Perfect Crystal)'; entropyEl.style.color = '#10b981'; }
            else if (this.temp < 50) { entropyEl.textContent = 'Low'; entropyEl.style.color = '#3b82f6'; }
            else { entropyEl.textContent = 'High'; entropyEl.style.color = '#ef4444'; }
        }
        if (stateEl) {
            if (this.temp < 0.5) stateEl.textContent = 'Perfect Crystalline Lattice';
            else if (this.temp < 10) stateEl.textContent = 'Near Zero-Point Fluctuations';
            else if (this.temp < 100) stateEl.textContent = 'Moderate Vibrations';
            else stateEl.textContent = 'Violent Thermal Agitation';
        }
        
        const amplitude = (this.temp / 300) * 20;
        const speed = (this.temp / 300) * 0.4;
        const time = Date.now() * 0.01;
        
        // Vibrate atoms
        this.atoms.forEach(a => {
            if (this.temp > 0.01) {
                a.x = a.bx + Math.sin(time * speed + a.phase) * amplitude;
                a.y = a.by + Math.cos(time * speed * 1.3 + a.phase) * amplitude;
                a.z = a.bz + Math.sin(time * speed * 0.7 + a.phase * 1.5) * amplitude;
            } else {
                a.x = a.bx; a.y = a.by; a.z = a.bz;
            }
        });
        
        // Project all atoms
        const projected = this.atoms.map((a, i) => {
            const p = this.project(a.x, a.y, a.z, cx, cy);
            return { ...p, idx: i, atom: a };
        });
        
        // Sort by depth (far first)
        projected.sort((a, b) => b.depth - a.depth);
        
        // Draw bonds first (between close neighbors)
        if (this.temp < 200) {
            const bondAlpha = Math.max(0, 0.5 * (1 - this.temp / 200));
            ctx.strokeStyle = `rgba(100,200,255,${bondAlpha})`;
            ctx.lineWidth = 1;
            for (let i = 0; i < this.atoms.length; i++) {
                for (let j = i + 1; j < this.atoms.length; j++) {
                    const a = this.atoms[i], b = this.atoms[j];
                    const dx = a.bx-b.bx, dy = a.by-b.by, dz = a.bz-b.bz;
                    const dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
                    if (dist < 42) {
                        const pa = this.project(a.x, a.y, a.z, cx, cy);
                        const pb = this.project(b.x, b.y, b.z, cx, cy);
                        ctx.beginPath();
                        ctx.moveTo(pa.px, pa.py);
                        ctx.lineTo(pb.px, pb.py);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Draw atoms
        projected.forEach(p => {
            const hue = 240 - (this.temp / 300) * 240;
            const radius = Math.max(3, 7 * p.scale);
            const alpha = Math.max(0.3, Math.min(1, p.scale));
            
            ctx.beginPath();
            ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
            
            const grad = ctx.createRadialGradient(p.px - 1, p.py - 1, 0, p.px, p.py, radius);
            grad.addColorStop(0, `hsla(${hue}, 85%, 70%, ${alpha})`);
            grad.addColorStop(1, `hsla(${hue}, 80%, 40%, ${alpha * 0.6})`);
            ctx.fillStyle = grad;
            ctx.fill();
            
            if (this.temp > 100) {
                ctx.save();
                ctx.shadowBlur = amplitude * 0.5;
                ctx.shadowColor = `hsl(${hue}, 80%, 50%)`;
                ctx.beginPath();
                ctx.arc(p.px, p.py, radius * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue}, 85%, 70%, 0.3)`;
                ctx.fill();
                ctx.restore();
            }
        });
        
        // Title
        ctx.fillStyle = 'rgba(148,163,184,0.6)';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('3D CRYSTAL LATTICE', cx, H - 15);
        
        // Temperature bar
        const barW = 8, barH = H * 0.5, barX = W - 30, barY = (H - barH) / 2;
        ctx.fillStyle = 'rgba(30,41,59,0.8)';
        ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);
        const tempRatio = this.temp / 300;
        const fillH = tempRatio * barH;
        const barGrad = ctx.createLinearGradient(0, barY + barH, 0, barY);
        barGrad.addColorStop(0, '#3b82f6');
        barGrad.addColorStop(0.5, '#f59e0b');
        barGrad.addColorStop(1, '#ef4444');
        ctx.fillStyle = barGrad;
        ctx.fillRect(barX, barY + barH - fillH, barW, fillH);
        ctx.fillStyle = '#fff';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(this.temp) + 'K', barX + barW/2, barY - 8);
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};
