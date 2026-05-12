window.fundamentals = {
    canvas: null,
    ctx: null,
    graphCanvas: null,
    graphCtx: null,
    sysCanvas: null,
    sysCtx: null,
    animationId: null,
    
    // State
    tempA: 400,
    tempB: 300,
    tempC: 350,
    wallAB: 'adiabatic',
    wallBC: 'adiabatic',
    wallAC: 'adiabatic',
    
    // Heat particles
    particles: [],
    
    // History for graph
    historyA: [],
    historyB: [],
    historyC: [],
    time: 0,
    
    // System Simulator State
    sysLidOpen: true,
    sysConducting: true,
    sysHeating: false,
    sysParticles: [],
    sysHeatTimer: 0,
    
    init() {
        this.canvas = document.getElementById('zeroth-canvas');
        this.graphCanvas = document.getElementById('zeroth-graph-canvas');
        if (!this.canvas || !this.graphCanvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.graphCtx = this.graphCanvas.getContext('2d');
        
        const container = document.getElementById('zeroth-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        const graphContainer = document.getElementById('zeroth-graph-container');
        if (graphContainer) {
            this.graphCanvas.width = graphContainer.clientWidth;
            this.graphCanvas.height = graphContainer.clientHeight;
        }
        
        this.sysCanvas = document.getElementById('system-canvas');
        if (this.sysCanvas) {
            this.sysCtx = this.sysCanvas.getContext('2d');
            const sysContainer = document.getElementById('system-canvas-container');
            this.sysCanvas.width = sysContainer.clientWidth;
            this.sysCanvas.height = sysContainer.clientHeight;
            this.initSysParticles();
        }
        
        this.resetState();
        this.bindControls();
        this.animate();
    },
    
    resetState() {
        const sliderA = document.getElementById('slider-temp-a');
        const sliderB = document.getElementById('slider-temp-b');
        const sliderC = document.getElementById('slider-temp-c');
        
        this.tempA = sliderA ? parseInt(sliderA.value) : 400;
        this.tempB = sliderB ? parseInt(sliderB.value) : 300;
        this.tempC = sliderC ? parseInt(sliderC.value) : 350;
        
        this.historyA = [];
        this.historyB = [];
        this.historyC = [];
        this.time = 0;
        this.particles = [];
        
        this.updateSliders();
    },

    initSysParticles() {
        this.sysParticles = [];
        if(!this.sysCanvas) return;
        for(let i = 0; i < 30; i++) {
            this.sysParticles.push({
                x: this.sysCanvas.width / 2 + (Math.random() - 0.5) * 100,
                y: this.sysCanvas.height / 2 + (Math.random() - 0.5) * 100,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                temp: 300
            });
        }
    },

    updateSliders() {
        const valA = document.getElementById('temp-a-val');
        const valB = document.getElementById('temp-b-val');
        const valC = document.getElementById('temp-c-val');
        if(valA) valA.textContent = Math.round(this.tempA);
        if(valB) valB.textContent = Math.round(this.tempB);
        if(valC) valC.textContent = Math.round(this.tempC);
    },
    
    stop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    },
    
    bindControls() {
        // Wall toggles
        ['AB', 'BC', 'AC'].forEach(wall => {
            const btn = document.getElementById(`toggle-wall-${wall}`);
            if (btn) {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', () => {
                    this['wall' + wall] = this['wall' + wall] === 'adiabatic' ? 'diathermic' : 'adiabatic';
                    newBtn.textContent = `Wall ${wall}: ${this['wall' + wall] === 'adiabatic' ? 'Adiabatic' : 'Diathermic'}`;
                    newBtn.style.background = this['wall' + wall] === 'adiabatic' ? 'var(--bg-dark)' : 'var(--primary)';
                    window.app.addXP(2);
                });
            }
        });
        
        // Sliders
        ['a', 'b', 'c'].forEach(block => {
            const slider = document.getElementById(`slider-temp-${block}`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    this[`temp${block.toUpperCase()}`] = parseInt(e.target.value);
                    this.updateSliders();
                    // Clear history to restart graph from this point if dragged
                    this.historyA = [];
                    this.historyB = [];
                    this.historyC = [];
                    this.time = 0;
                });
            }
        });
        
        // Reset button
        const resetBtn = document.getElementById('reset-zeroth-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetState();
            });
        }
        
        // System Simulator Controls
        const lidBtn = document.getElementById('toggle-sys-lid');
        if (lidBtn) {
            lidBtn.addEventListener('click', () => {
                this.sysLidOpen = !this.sysLidOpen;
                lidBtn.textContent = `Lid: ${this.sysLidOpen ? 'OPEN' : 'CLOSED'}`;
                this.updateSysState();
            });
        }
        const insBtn = document.getElementById('toggle-sys-insulation');
        if (insBtn) {
            insBtn.addEventListener('click', () => {
                this.sysConducting = !this.sysConducting;
                insBtn.textContent = `Walls: ${this.sysConducting ? 'CONDUCTING' : 'INSULATED'}`;
                this.updateSysState();
            });
        }
        const heatBtn = document.getElementById('sys-add-heat');
        if (heatBtn) {
            heatBtn.addEventListener('click', () => {
                this.sysHeating = !this.sysHeating;
                if (this.sysHeating) {
                    heatBtn.textContent = 'Stop Heating';
                    heatBtn.style.background = '#b91c1c';
                } else {
                    heatBtn.textContent = 'Apply Heat';
                    heatBtn.style.background = '#ef4444';
                }
            });
        }
        const massBtn = document.getElementById('sys-add-mass');
        if (massBtn) {
            massBtn.addEventListener('click', () => {
                if (!this.sysLidOpen) return; // Can't add if closed
                for(let i=0; i<5; i++) {
                    this.sysParticles.push({
                        x: this.sysCanvas.width / 2 + (Math.random() - 0.5) * 50,
                        y: 50, // drop from top
                        vx: (Math.random() - 0.5) * 2,
                        vy: Math.random() * 2 + 2,
                        temp: 300
                    });
                }
            });
        }
        
        // Mini game
        document.querySelectorAll('.sys-game-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                const feedback = document.getElementById('sys-game-feedback');
                if (type === 'isolated') {
                    feedback.textContent = 'Correct! A perfect thermos prevents both mass and heat transfer.';
                    feedback.style.color = '#4ade80';
                    window.app.addXP(10);
                } else {
                    feedback.textContent = 'Incorrect. Remember, it does not allow mass or heat to enter/leave.';
                    feedback.style.color = '#ef4444';
                }
            });
        });
    },
    
    updateSysState() {
        const val = document.getElementById('sys-type-val');
        if (!val) return;
        
        if (this.sysLidOpen && this.sysConducting) {
            val.textContent = "OPEN SYSTEM";
            val.style.color = "#3b82f6"; // Blue
        } else if (!this.sysLidOpen && this.sysConducting) {
            val.textContent = "CLOSED SYSTEM";
            val.style.color = "#f59e0b"; // Yellow
        } else if (!this.sysLidOpen && !this.sysConducting) {
            val.textContent = "ISOLATED SYSTEM";
            val.style.color = "#10b981"; // Green
        } else if (this.sysLidOpen && !this.sysConducting) {
             val.textContent = "OPEN (INSULATED) SYSTEM";
             val.style.color = "#a855f7"; // Purple
        }
    },
    
    animate() {
        if(this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.graphCtx) this.graphCtx.clearRect(0, 0, this.graphCanvas.width, this.graphCanvas.height);
        if(this.sysCtx) this.animateSystem();
        
        // Heat transfer logic
        const k = 0.005; // Heat transfer rate
        let transferAB = 0, transferBC = 0, transferAC = 0;
        
        if (this.wallAB === 'diathermic') {
            transferAB = (this.tempA - this.tempB) * k;
            this.tempA -= transferAB;
            this.tempB += transferAB;
        }
        if (this.wallBC === 'diathermic') {
            transferBC = (this.tempB - this.tempC) * k;
            this.tempB -= transferBC;
            this.tempC += transferBC;
        }
        if (this.wallAC === 'diathermic') {
            transferAC = (this.tempA - this.tempC) * k;
            this.tempA -= transferAC;
            this.tempC += transferAC;
        }
        
        // Update history
        if (this.time % 2 === 0) { // Record every 2 frames
            this.historyA.push(this.tempA);
            this.historyB.push(this.tempB);
            this.historyC.push(this.tempC);
            if (this.historyA.length > 200) {
                this.historyA.shift();
                this.historyB.shift();
                this.historyC.shift();
            }
        }
        this.time++;
        
        this.updateSliders();
        
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        // Define block centers
        const posA = { x: cx, y: cy - 70 };
        const posB = { x: cx - 80, y: cy + 50 };
        const posC = { x: cx + 80, y: cy + 50 };
        
        // Spawn heat particles
        const spawnParticles = (p1, p2, transfer) => {
            if (Math.abs(transfer) > 0.05 && Math.random() < Math.abs(transfer) * 2) {
                const isForward = transfer > 0;
                const start = isForward ? p1 : p2;
                const end = isForward ? p2 : p1;
                
                // Add random offset so they don't all travel on the exact same line
                const offset = (Math.random() - 0.5) * 40;
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const normal = { x: -dy, y: dx };
                const len = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
                normal.x = (normal.x / len) * offset;
                normal.y = (normal.y / len) * offset;
                
                this.particles.push({
                    x: start.x + normal.x,
                    y: start.y + normal.y,
                    targetX: end.x + normal.x,
                    targetY: end.y + normal.y,
                    progress: 0,
                    speed: 0.02 + Math.random() * 0.02,
                    color: isForward ? '#ef4444' : '#3b82f6' // color represents origin roughly
                });
            }
        };
        
        if (this.wallAB === 'diathermic') spawnParticles(posA, posB, transferAB);
        if (this.wallBC === 'diathermic') spawnParticles(posB, posC, transferBC);
        if (this.wallAC === 'diathermic') spawnParticles(posA, posC, transferAC);
        
        // Draw Walls
        const drawWall = (p1, p2, state) => {
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.lineWidth = 12;
            
            if (state === 'diathermic') {
                // Conductive wall (copper-like)
                const grad = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                grad.addColorStop(0, '#b45309');
                grad.addColorStop(0.5, '#f59e0b');
                grad.addColorStop(1, '#b45309');
                this.ctx.strokeStyle = grad;
                this.ctx.setLineDash([]);
                this.ctx.stroke();
                
                // Draw inner glow
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.lineWidth = 4;
                this.ctx.strokeStyle = 'rgba(252, 211, 77, 0.8)';
                this.ctx.stroke();
            } else {
                // Insulating wall (crosshatch/dashed)
                this.ctx.strokeStyle = window.app && window.app.theme === 'light' ? '#94a3b8' : '#334155';
                this.ctx.setLineDash([8, 8]);
                this.ctx.lineCap = 'round';
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        };
        
        drawWall(posA, posB, this.wallAB);
        drawWall(posB, posC, this.wallBC);
        drawWall(posA, posC, this.wallAC);
        
        // Draw Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.progress += p.speed;
            
            if (p.progress >= 1) {
                this.particles.splice(i, 1);
                continue;
            }
            
            const currX = p.x + (p.targetX - p.x) * p.progress;
            const currY = p.y + (p.targetY - p.y) * p.progress;
            
            this.ctx.beginPath();
            this.ctx.arc(currX, currY, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = window.app && window.app.theme === 'light' ? '#1e293b' : '#f8fafc'; // core
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(currX, currY, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = 0.5 * (1 - p.progress); // fade out slightly
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        }
        
        // Draw Blocks
        const drawBlock = (x, y, temp, label) => {
            // Temperature coloring: 100K = deep blue, 350K = yellow, 600K = red
            let hue = 240 - ((temp - 100) / 500) * 240;
            hue = Math.max(0, Math.min(240, hue));
            
            const color = `hsl(${hue}, 80%, 50%)`;
            const glowColor = `hsla(${hue}, 80%, 50%, 0.4)`;
            
            // Draw glow
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = 15;
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x - 40, y - 40, 80, 80);
            
            this.ctx.shadowBlur = 0; // reset shadow
            
            this.ctx.strokeStyle = window.app && window.app.theme === 'light' ? '#1e293b' : '#f8fafc';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x - 40, y - 40, 80, 80);
            
            // Inner gradient to look 3D/glassy
            const grad = this.ctx.createLinearGradient(x-40, y-40, x+40, y+40);
            grad.addColorStop(0, 'rgba(255,255,255,0.3)');
            grad.addColorStop(1, 'rgba(0,0,0,0.3)');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(x-40, y-40, 80, 80);
            
            // Text
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 24px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(label, x, y - 10);
            
            this.ctx.font = 'bold 14px Inter';
            this.ctx.fillText(`${Math.round(temp)}K`, x, y + 15);
        };
        
        drawBlock(posA.x, posA.y, this.tempA, 'A');
        drawBlock(posB.x, posB.y, this.tempB, 'B');
        drawBlock(posC.x, posC.y, this.tempC, 'C');
        
        this.drawGraph();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    animateSystem() {
        const ctx = this.sysCtx;
        const w = this.sysCanvas.width;
        const h = this.sysCanvas.height;

        ctx.clearRect(0, 0, w, h);

        // Theme-aware colors
        const isLight    = window.app && window.app.theme === 'light';
        const glassStroke    = isLight ? 'rgba(51,65,85,0.9)'   : 'rgba(255,255,255,0.75)';
        const glassHighlight = isLight ? 'rgba(0,0,0,0.1)'      : 'rgba(255,255,255,0.35)';
        const insulColor     = isLight ? '#64748b'              : '#334155';
        const insulInner     = isLight ? '#94a3b8'              : '#475569';
        const burnerColor    = isLight ? '#64748b'              : '#334155';
        const mutedText      = isLight ? '#475569'              : '#94a3b8';

        // Beaker dimensions
        const boxW = 170;
        const boxH = 220;
        const boxX = w / 2 - boxW / 2;
        const boxY = h / 2 - boxH / 2 + 20;

        // System type flags
        const isOpen     = this.sysLidOpen && this.sysConducting;
        const isClosed   = !this.sysLidOpen && this.sysConducting;
        const isIsolated = !this.sysLidOpen && !this.sysConducting;
        const isOpenIns  = this.sysLidOpen && !this.sysConducting;

        // ---- HEAT PHYSICS ----
        if (this.sysHeating) {
            this.sysHeatTimer++;
            if (this.sysConducting) {
                this.sysParticles.forEach(p => {
                    if (p.y > boxY && p.y < boxY + boxH && p.x > boxX && p.x < boxX + boxW) {
                        p.temp = Math.min(850, p.temp + 4);
                        p.vx *= 1.018; p.vy *= 1.018;
                        if (Math.abs(p.vx) > 11) p.vx = Math.sign(p.vx) * 11;
                        if (Math.abs(p.vy) > 11) p.vy = Math.sign(p.vy) * 11;
                    }
                });
            }
        } else {
            this.sysHeatTimer = 0;
            this.sysParticles.forEach(p => {
                if (p.temp > 300) { p.temp = Math.max(300, p.temp - 0.8); p.vx *= 0.995; p.vy *= 0.995; }
            });
        }

        // ---- ENVIRONMENT MOLECULES (visible outside beaker to show surroundings) ----
        if (!this.envMolecules) {
            this.envMolecules = Array.from({length: 20}, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 1.3, vy: (Math.random() - 0.5) * 1.3,
                hue: 180 + Math.random() * 60, r: 3 + Math.random() * 2
            }));
        }
        this.envMolecules.forEach(m => {
            m.x += m.vx; m.y += m.vy;
            if (m.x < 0 || m.x > w) m.vx *= -1;
            if (m.y < 0 || m.y > h) m.vy *= -1;
            if (m.x > boxX - 5 && m.x < boxX + boxW + 5 && m.y > boxY - 5 && m.y < boxY + boxH + 15) return;
            ctx.save();
            ctx.globalAlpha = isLight ? 0.5 : 0.35;
            ctx.beginPath(); ctx.arc(m.x - 3, m.y, m.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${m.hue}, 55%, ${isLight ? 45 : 60}%)`;
            ctx.fill();
            ctx.beginPath(); ctx.arc(m.x + 3, m.y, m.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // ---- FIRE BURNER ----
        if (this.sysHeating && this.sysConducting) {
            const fireY = boxY + boxH + 5;
            ctx.fillStyle = burnerColor;
            ctx.fillRect(boxX + boxW/2 - 35, fireY + 20, 70, 10);
            ctx.fillRect(boxX + boxW/2 - 12, fireY + 30, 24, 22);
            const t = Date.now() / 80;
            for (let i = 0; i < 8; i++) {
                const fx = boxX + boxW/2 + Math.sin(t + i * 1.2) * 22;
                const fy = fireY + 5 + Math.sin(t * 1.5 + i) * 6;
                ctx.beginPath(); ctx.arc(fx, fy, 9 + Math.sin(t + i) * 5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${10 + i * 5}, 100%, 55%, 0.85)`; ctx.fill();
            }
            for (let i = 0; i < 6; i++) {
                const fx = boxX + boxW/2 + Math.sin(t * 1.3 + i * 0.9) * 12;
                const fy = fireY + 3 + Math.sin(t + i * 0.8) * 4;
                ctx.beginPath(); ctx.arc(fx, fy, 5 + Math.sin(t + i) * 3, 0, Math.PI * 2);
                ctx.fillStyle = 'hsla(45,100%,65%,0.9)'; ctx.fill();
            }
            // Heat arrows
            ctx.save();
            ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2.5;
            ctx.globalAlpha = 0.6 + 0.3 * Math.sin(Date.now() / 200);
            [boxX + 40, boxX + boxW/2, boxX + boxW - 40].forEach(ax => {
                const ay = boxY + boxH - 5;
                ctx.beginPath(); ctx.moveTo(ax, ay + 22); ctx.lineTo(ax, ay + 6); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(ax - 5, ay + 12); ctx.lineTo(ax, ay + 3); ctx.lineTo(ax + 5, ay + 12); ctx.stroke();
            });
            ctx.restore();
        }

        // ---- INSULATION SHELL ----
        if (!this.sysConducting) {
            const pad = 20;
            const insulGrad = ctx.createLinearGradient(boxX - pad, 0, boxX + boxW + pad, 0);
            insulGrad.addColorStop(0,   isLight ? 'rgba(148,163,184,0.55)' : 'rgba(30,41,59,0.75)');
            insulGrad.addColorStop(0.5, isLight ? 'rgba(203,213,225,0.45)' : 'rgba(51,65,85,0.55)');
            insulGrad.addColorStop(1,   isLight ? 'rgba(148,163,184,0.55)' : 'rgba(30,41,59,0.75)');
            ctx.fillStyle = insulGrad;
            ctx.beginPath();
            ctx.moveTo(boxX - pad, boxY - 8);
            ctx.lineTo(boxX - pad, boxY + boxH + pad);
            ctx.lineTo(boxX + boxW + pad, boxY + boxH + pad);
            ctx.lineTo(boxX + boxW + pad, boxY - 8);
            ctx.lineWidth = 18; ctx.strokeStyle = insulColor; ctx.lineJoin = 'round'; ctx.stroke();
            ctx.lineWidth = 7;  ctx.strokeStyle = insulInner; ctx.stroke();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = isLight ? 'rgba(100,116,139,0.45)' : 'rgba(71,85,105,0.5)';
            ctx.setLineDash([6, 12]); ctx.stroke(); ctx.setLineDash([]);
            ctx.save();
            ctx.fillStyle = mutedText; ctx.font = 'bold 10px Inter'; ctx.textAlign = 'center';
            ctx.fillText('INSULATED WALLS', w/2, boxY + boxH + pad + 14);
            ctx.restore();
        }

        // ---- BEAKER BODY ----
        const bFill = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
        bFill.addColorStop(0, isLight ? 'rgba(186,230,253,0.18)' : 'rgba(125,211,252,0.07)');
        bFill.addColorStop(1, isLight ? 'rgba(224,242,254,0.10)' : 'rgba(56,189,248,0.04)');
        ctx.fillStyle = bFill;
        ctx.fillRect(boxX, boxY, boxW, boxH);

        ctx.beginPath();
        ctx.moveTo(boxX - 15, boxY - 5);
        ctx.lineTo(boxX, boxY + 5);
        ctx.lineTo(boxX, boxY + boxH);
        ctx.quadraticCurveTo(boxX, boxY + boxH + 12, boxX + 12, boxY + boxH + 12);
        ctx.lineTo(boxX + boxW - 12, boxY + boxH + 12);
        ctx.quadraticCurveTo(boxX + boxW, boxY + boxH + 12, boxX + boxW, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + 5);
        ctx.lineTo(boxX + boxW + 15, boxY - 5);
        ctx.lineWidth = 5; ctx.strokeStyle = glassStroke;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(boxX + 12, boxY + 18); ctx.lineTo(boxX + 12, boxY + boxH - 12);
        ctx.lineWidth = 3.5; ctx.strokeStyle = glassHighlight; ctx.stroke();

        for (let i = 1; i <= 3; i++) {
            const ly = boxY + boxH - (i * boxH / 4);
            ctx.beginPath(); ctx.moveTo(boxX + 5, ly); ctx.lineTo(boxX + 22, ly);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = isLight ? 'rgba(100,116,139,0.5)' : 'rgba(148,163,184,0.25)';
            ctx.stroke();
        }

        // ---- LID ----
        if (!this.sysLidOpen) {
            const sGrad = ctx.createLinearGradient(boxX, 0, boxX + boxW, 0);
            sGrad.addColorStop(0, '#6b3c1a'); sGrad.addColorStop(0.25, '#c1865a');
            sGrad.addColorStop(0.5, '#a0522d'); sGrad.addColorStop(1, '#5c2e0e');
            ctx.fillStyle = sGrad;
            ctx.beginPath();
            ctx.moveTo(boxX - 8, boxY - 28); ctx.lineTo(boxX + boxW + 8, boxY - 28);
            ctx.lineTo(boxX + boxW - 4, boxY + 14); ctx.lineTo(boxX + 4, boxY + 14);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.5)';
            ctx.lineWidth = 1.5; ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(boxX + boxW * 0.25, boxY - 22); ctx.lineTo(boxX + boxW * 0.35, boxY + 8);
            ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineCap = 'round'; ctx.stroke();
            ctx.save();
            ctx.fillStyle = isClosed ? '#f59e0b' : '#10b981';
            ctx.font = 'bold 10px Inter'; ctx.textAlign = 'center';
            ctx.shadowColor = isClosed ? '#f59e0b' : '#10b981'; ctx.shadowBlur = 6;
            ctx.fillText(isClosed ? 'â— SEALED' : 'â—‰ ISOLATED', w/2, boxY - 36);
            ctx.restore();
        } else {
            const t = Date.now() / 400;
            const arrowY = boxY - 20 + Math.sin(t) * 5;
            ctx.save();
            ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2.5;
            ctx.globalAlpha = 0.7 + 0.2 * Math.sin(t);
            [[boxX + 30, arrowY], [boxX + boxW - 30, arrowY]].forEach(([ax, ay]) => {
                ctx.beginPath(); ctx.moveTo(ax, ay + 12); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(ax - 5, ay + 8); ctx.lineTo(ax, ay - 1); ctx.lineTo(ax + 5, ay + 8); ctx.stroke();
            });
            ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
            ctx.shadowColor = '#3b82f6'; ctx.shadowBlur = 6;
            ctx.fillText('OPEN', w/2, arrowY - 8);
            ctx.restore();
        }

        // ---- SYSTEM TYPE LABEL ----
        {
            const labels = {
                open:    { text: 'â‡„ OPEN SYSTEM',              color: '#3b82f6' },
                closed:  { text: 'âŠž CLOSED SYSTEM',            color: '#f59e0b' },
                isolated:{ text: 'â—‰ ISOLATED SYSTEM',          color: '#10b981' },
                openIns: { text: 'â¬š OPEN (INSULATED) SYSTEM',  color: '#a855f7' }
            };
            const key = isOpen ? 'open' : isClosed ? 'closed' : isIsolated ? 'isolated' : 'openIns';
            ctx.save();
            ctx.fillStyle = labels[key].color; ctx.font = 'bold 13px Inter'; ctx.textAlign = 'center';
            ctx.shadowColor = labels[key].color; ctx.shadowBlur = 10;
            ctx.fillText(labels[key].text, w/2, boxY - 55);
            ctx.restore();
        }

        // ---- PARTICLES ----
        const now = Date.now();
        for (let i = this.sysParticles.length - 1; i >= 0; i--) {
            const p = this.sysParticles[i];
            // Thermal jitter + reduced gravity so particles fill nicely
            p.vx += (Math.random() - 0.5) * (p.temp / 150);
            p.vy += (Math.random() - 0.5) * (p.temp / 150);
            p.vy += 0.05; // Light gravity
            
            p.x += p.vx; p.y += p.vy;
            
            // Damping to prevent infinite acceleration
            p.vx *= 0.98;
            p.vy *= 0.98;
            
            if (p.y > boxY + boxH - 6) p.vx *= 0.96;

            // Wall collisions with glow
            if (p.x < boxX + 10 && p.y > boxY) { p.x = boxX + 10; p.vx = Math.abs(p.vx) * 0.85; p.wallGlow = {x: p.x, y: p.y, t: now}; }
            if (p.x > boxX + boxW - 10 && p.y > boxY) { p.x = boxX + boxW - 10; p.vx = -Math.abs(p.vx) * 0.85; p.wallGlow = {x: p.x, y: p.y, t: now}; }
            if (p.y > boxY + boxH && p.x > boxX && p.x < boxX + boxW) { p.y = boxY + boxH; p.vy = -Math.abs(p.vy) * 0.8; }
            if (!this.sysLidOpen && p.y < boxY + 15 && p.x > boxX && p.x < boxX + boxW) { p.y = boxY + 15; p.vy = Math.abs(p.vy) * 0.8; p.wallGlow = {x: p.x, y: p.y, t: now}; }

            if (p.y > h + 60 || p.x < -60 || p.x > w + 60 || p.y < -60) { this.sysParticles.splice(i, 1); continue; }

            let hue = 240 - ((p.temp - 300) / 550) * 240;
            hue = Math.max(0, Math.min(240, hue));
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const angle = Math.atan2(p.vy, p.vx);
            const r = 5;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(angle);

            // Speed trail
            if (speed > 3) {
                const alpha = Math.min(0.5, (speed - 3) / 15);
                const tGrad = ctx.createLinearGradient(-r - 14, 0, 0, 0);
                tGrad.addColorStop(0, `hsla(${hue}, 85%, 55%, 0)`);
                tGrad.addColorStop(1, `hsla(${hue}, 85%, 55%, ${alpha})`);
                ctx.fillStyle = tGrad;
                ctx.beginPath(); ctx.ellipse(-r - 7, 0, 13, 3, 0, 0, Math.PI * 2); ctx.fill();
            }

            // Bond
            ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
            ctx.lineWidth = 2; ctx.strokeStyle = `hsla(${hue}, 70%, 65%, 0.7)`; ctx.stroke();

            // Atoms (3D gradient)
            const rGrad = ctx.createRadialGradient(-1.5, -1.5, 0, 0, 0, r);
            rGrad.addColorStop(0, '#ffffff');
            rGrad.addColorStop(0.3, `hsl(${hue}, 85%, 65%)`);
            rGrad.addColorStop(1,   `hsl(${hue}, 85%, 28%)`);
            ctx.fillStyle = rGrad;
            ctx.shadowColor = `hsla(${hue}, 85%, 55%, 0.6)`; ctx.shadowBlur = speed > 2 ? 7 : 2;
            ctx.beginPath(); ctx.arc(-4, 0, r, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(4,  0, r, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // Wall-hit glow ring
            if (p.wallGlow) {
                const age = (now - p.wallGlow.t) / 300;
                if (age < 1) {
                    ctx.save();
                    ctx.beginPath(); ctx.arc(p.wallGlow.x, p.wallGlow.y, 14 * age + 4, 0, Math.PI * 2);
                    ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${0.7 * (1 - age)})`; ctx.lineWidth = 2; ctx.stroke();
                    ctx.restore();
                } else { p.wallGlow = null; }
            }
        }

        // ---- ISOLATED: Freeze-pulse ring ----
        if (isIsolated) {
            const pulse = (Math.sin(Date.now() / 600) + 1) / 2;
            ctx.save();
            ctx.beginPath();
            ctx.rect(boxX - 5, boxY - 5, boxW + 10, boxH + 18);
            ctx.strokeStyle = `rgba(16,185,129,${0.3 + 0.4 * pulse})`;
            ctx.lineWidth = 3 + 2 * pulse; ctx.stroke();
            ctx.restore();
        }

        // ---- OPEN/OPENINS: Floating entry molecule dot ----
        if (isOpen || isOpenIns) {
            const t2 = ((Date.now() / 900) % 1);
            const ey = boxY + boxH * 0.3 + t2 * (boxH * 0.5);
            ctx.save();
            ctx.globalAlpha = 0.5 * (1 - t2);
            ctx.beginPath(); ctx.arc(boxX - 28, ey, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6'; ctx.fill();
            ctx.restore();
        }
    },
    
    drawGraph() {
        if (!this.graphCanvas || !this.graphCtx) return;
        const w = this.graphCanvas.width;
        const h = this.graphCanvas.height;
        const ctx = this.graphCtx;
        const isLight = window.app && window.app.theme === 'light';

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i=0; i<w; i+=50) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
        for(let j=0; j<h; j+=50) { ctx.moveTo(0, j); ctx.lineTo(w, j); }
        ctx.stroke();

        const padding = 40;
        ctx.strokeStyle = isLight ? '#64748b' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, h - padding);
        ctx.lineTo(w - padding, h - padding);
        ctx.stroke();

        ctx.fillStyle = isLight ? '#334155' : '#cbd5e1';
        ctx.font = '12px Inter';
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText('600K', padding - 5, padding);
        ctx.fillText('350K', padding - 5, h/2);
        ctx.fillText('100K', padding - 5, h - padding);
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('Time (Heat Transfer)', w/2, h - padding + 10);

        ctx.font = 'bold 14px Inter'; ctx.textAlign = 'center';
        ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
        ctx.fillText('Temperature Equilibrium over Time', w/2, 15);

        if (this.historyA.length < 2) return;

        const plotLine = (data, minTemp, maxTemp, color, label) => {
            ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 3;
            const stepX = (w - 2 * padding) / 200;
            for (let i = 0; i < data.length; i++) {
                const x = padding + i * stepX;
                const normalizedY = (data[i] - minTemp) / (maxTemp - minTemp);
                const y = (h - padding) - normalizedY * (h - 2 * padding);
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                if (i === data.length - 1) {
                    ctx.fillStyle = color; ctx.font = 'bold 12px Inter';
                    ctx.textAlign = 'left'; ctx.fillText(` ${label}`, x + 5, y);
                }
            }
            ctx.stroke();
        };

        plotLine(this.historyA, 100, 600, '#ef4444', 'A');
        plotLine(this.historyB, 100, 600, '#3b82f6', 'B');
        plotLine(this.historyC, 100, 600, '#10b981', 'C');
    }
};
