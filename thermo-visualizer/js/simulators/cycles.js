/**
 * Thermodynamic Cycles Simulator - Otto, Diesel, Brayton
 * Full 3D isometric animated engine with P-V diagram
 */
// Helper function to get theme-aware text color
window.getCanvasTextColor = function(lightColor = '#000000', darkColor = '#ffffff') {
    return document.body.getAttribute('data-theme') === 'light' ? lightColor : darkColor;
};

window.cyclesSim = {
    canvas: null,
    ctx: null,
    animationId: null,
    cycle: 'otto',
    crankAngle: 0,
    autoRun: true,
    sparkActive: false,

    // Cycle state labels
    strokes: {
        otto: ['Intake', 'Compression', 'Power (Spark!)', 'Exhaust'],
        diesel: ['Intake', 'Compression', 'Combustion', 'Exhaust'],
        brayton: ['Compression', 'Combustion', 'Expansion', 'Exhaust']
    },

    realLife: {
        otto: '<strong>Otto Cycle:</strong> Found in all 4-stroke petrol engines (cars, bikes). Uses a spark plug to ignite compressed fuel-air mixture.',
        diesel: '<strong>Diesel Cycle:</strong> Used in diesel trucks, trains. Compression alone heats the air enough to ignite the injected diesel fuel.',
        brayton: '<strong>Brayton Cycle:</strong> Powers jet aircraft and gas turbines. Continuous combustion at high pressure drives the turbine blades.'
    },

    init() {
        this.canvas = document.getElementById('cycles-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth || 500;
        this.canvas.height = container.clientHeight || 420;

        this.crankAngle = 0;
        this.bindControls();
        this.animate();
    },

    stop() {
        this.autoRun = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },

    bindControls() {
        const sel = document.getElementById('cycle-select');
        if (!sel) return;
        const newSel = sel.cloneNode(true);
        sel.parentNode.replaceChild(newSel, sel);
        newSel.addEventListener('change', (e) => {
            this.cycle = e.target.value;
            const rl = document.getElementById('cycle-real-life');
            if (rl) rl.innerHTML = this.realLife[this.cycle];
        });
        this.autoRun = true;
    },

    getStroke() {
        // 4 strokes, each 180 degrees = 720 total
        const norm = ((this.crankAngle % 720) + 720) % 720;
        return Math.floor(norm / 180);
    },

    animate() {
        if (!this.ctx) return;
        this.crankAngle += 2;
        this.crankAngle %= 720;

        const strokeIdx = this.getStroke();
        const strokes = this.strokes[this.cycle];
        const strokeName = strokes[strokeIdx];

        // Check for spark
        this.sparkActive = (strokeIdx === 2 && this.crankAngle % 720 >= 360 && this.crankAngle % 720 <= 380);

        // Update UI
        const procEl = document.getElementById('cycle-process');
        if (procEl) procEl.textContent = strokeName;

        const volEl = document.getElementById('cycle-vol');
        const pressEl = document.getElementById('cycle-press');
        if (volEl && pressEl) {
            const volStates = ['High', 'Decreasing', 'Low', 'Increasing'];
            const pressStates = ['Atmospheric', 'Rising', 'Peak', 'Falling'];
            volEl.textContent = volStates[strokeIdx];
            pressEl.textContent = pressStates[strokeIdx];
        }

        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    },

    draw() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        // Background
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, W, H);

        const strokeIdx = this.getStroke();
        const norm = ((this.crankAngle % 720) + 720) % 720;

        // === 3D ISOMETRIC ENGINE DRAWING ===
        const cx = W * 0.38;
        const cy = H * 0.5;

        // Crankshaft kinematics
        const crankR = 45;
        const rodLen = 110;
        const rad = (norm / 2) * (Math.PI / 180); // 0-360 for one rotation
        const crankX = Math.sin(rad) * crankR;
        const crankY = Math.cos(rad) * crankR;
        const pistonYOffset = crankY + Math.sqrt(rodLen * rodLen - crankX * crankX);
        const pistonTop = cy - pistonYOffset + 30;

        // Cylinder dimensions
        const cylW = 80;
        const cylH = 200;
        const cylX = cx - cylW / 2;
        const cylTop = cy - 150;
        const cylBot = cy + 60;

        // Gas color based on stroke
        const gasColors = [
            `rgba(59,130,246,0.25)`,    // Intake - blue
            `rgba(16,185,129,0.35)`,    // Compression - green
            this.sparkActive ? `rgba(255,50,50,0.85)` : `rgba(239,68,68,0.6)`, // Power - red/orange
            `rgba(100,116,139,0.25)`   // Exhaust - gray
        ];
        const gasCol = gasColors[strokeIdx];

        // --- BACK CYLINDER FACE (isometric effect) ---
        const depth = 18;

        // Cylinder back shadow
        ctx.fillStyle = 'rgba(30,41,59,0.9)';
        ctx.beginPath();
        ctx.moveTo(cylX + depth, cylTop - depth);
        ctx.lineTo(cylX + cylW + depth, cylTop - depth);
        ctx.lineTo(cylX + cylW + depth, cylBot - depth);
        ctx.lineTo(cylX + depth, cylBot - depth);
        ctx.closePath();
        ctx.fill();

        // Cylinder walls (side)
        ctx.fillStyle = 'rgba(71,85,105,0.7)';
        // Right wall
        ctx.beginPath();
        ctx.moveTo(cylX + cylW, cylTop);
        ctx.lineTo(cylX + cylW + depth, cylTop - depth);
        ctx.lineTo(cylX + cylW + depth, cylBot - depth);
        ctx.lineTo(cylX + cylW, cylBot);
        ctx.closePath();
        ctx.fill();
        // Top wall
        ctx.fillStyle = 'rgba(51,65,85,0.85)';
        ctx.beginPath();
        ctx.moveTo(cylX, cylTop);
        ctx.lineTo(cylX + depth, cylTop - depth);
        ctx.lineTo(cylX + cylW + depth, cylTop - depth);
        ctx.lineTo(cylX + cylW, cylTop);
        ctx.closePath();
        ctx.fill();

        // Gas inside cylinder
        const gasTop = pistonTop + 25;
        const gasH = cylTop - gasTop;
        if (gasH < 0) {
            ctx.fillStyle = gasCol;
            ctx.fillRect(cylX + 2, cylTop, cylW - 4, -gasH);
        } else {
            ctx.fillStyle = gasCol;
            ctx.fillRect(cylX + 2, gasTop, cylW - 4, cylTop - gasTop);
        }

        // SPARK PLUG FLASH
        if (this.sparkActive) {
            ctx.save();
            ctx.shadowBlur = 40;
            ctx.shadowColor = '#fbbf24';
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            // Lightning bolt
            const sx = cx;
            const sy = cylTop + 5;
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - 8, sy + 12);
            ctx.lineTo(sx - 3, sy + 12);
            ctx.lineTo(sx - 10, sy + 26);
            ctx.lineTo(sx + 5, sy + 14);
            ctx.lineTo(sx, sy + 14);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // === PISTON (3D) ===
        // Piston depth shadow
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cylX + depth + 2, pistonTop - depth, cylW - 4, 28);

        // Piston top face
        ctx.fillStyle = '#475569';
        ctx.fillRect(cylX + 2, pistonTop, cylW - 4, 26);

        // Piston top edge (3D)
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(cylX + 2, pistonTop);
        ctx.lineTo(cylX + 2 + depth, pistonTop - depth);
        ctx.lineTo(cylX + cylW - 4 + depth, pistonTop - depth);
        ctx.lineTo(cylX + cylW - 4, pistonTop);
        ctx.closePath();
        ctx.fill();

        // Connecting rod
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx, pistonTop + 25);
        ctx.lineTo(cx + crankX, cy + 30 + crankY);
        ctx.stroke();

        // Crankshaft circle
        ctx.strokeStyle = 'rgba(148,163,184,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 30, crankR, crankR * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Crank pin (3D blob)
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.ellipse(cx + crankX, cy + 30 + crankY, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Front Cylinder Frame
        ctx.strokeStyle = 'rgba(148,163,184,0.6)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(cylX, cylTop, cylW, cylBot - cylTop);

        // Spark plug housing (top center)
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx - 5, cylTop - 18, 10, 20);
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(cx, cylTop - 18, 6, 0, Math.PI * 2);
        ctx.fill();

        // Valve indicator dots (left = intake, right = exhaust)
        const intakeOpen = strokeIdx === 0;
        const exhaustOpen = strokeIdx === 3;
        ctx.fillStyle = intakeOpen ? '#10b981' : '#ef4444';
        ctx.beginPath();
        ctx.arc(cylX - 14, cylTop + 20, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = exhaustOpen ? '#10b981' : '#ef4444';
        ctx.beginPath();
        ctx.arc(cylX + cylW + 14, cylTop + 20, 7, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.fillStyle = 'rgba(148,163,184,0.8)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('IN', cylX - 14, cylTop + 38);
        ctx.fillText('EX', cylX + cylW + 14, cylTop + 38);

        // === P-V DIAGRAM (mini) ===
        this.drawPVDiagram(W * 0.68, H * 0.15, W * 0.28, H * 0.55, norm, strokeIdx);

        // Stroke label
        const strokes = this.strokes[this.cycle];
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.cycle.toUpperCase()} CYCLE`, W * 0.68, H * 0.76);
        ctx.fillStyle = '#8b5cf6';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(strokes[strokeIdx], W * 0.68, H * 0.81);
    },

    drawPVDiagram(x, y, w, h, norm, strokeIdx) {
        const ctx = this.ctx;

        // Background panel
        ctx.fillStyle = 'rgba(15,23,42,0.9)';
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();
        ctx.strokeStyle = 'rgba(139,92,246,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Axes
        ctx.strokeStyle = 'rgba(148,163,184,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 25, y + 10);
        ctx.lineTo(x + 25, y + h - 25);
        ctx.lineTo(x + w - 10, y + h - 25);
        ctx.stroke();

        // Axis labels
        ctx.fillStyle = 'rgba(148,163,184,0.7)';
        ctx.font = '9px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('P', x + 15, y + h / 2);
        ctx.fillText('V', x + w / 2, y + h - 10);

        ctx.fillStyle = getCanvasTextColor();
        ctx.font = 'bold 11px Inter';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 2;
        ctx.fillText('P-V Diagram', x + w / 2, y + 22);
        ctx.shadowBlur = 0;

        // Draw Otto cycle curve
        const px = x + 25;
        const py = y + h - 25;
        const pw = w - 35;
        const ph = h - 45;

        const cycle = [
            { x: 0.9, y: 0.05 }, // TDC high pressure after combustion
            { x: 1.0, y: 0.5 },  // expansion ends
            { x: 0.8, y: 0.55 }, // exhaust
            { x: 0.2, y: 0.55 }, // intake
            { x: 0.1, y: 0.5 },  // compression start
            { x: 0.15, y: 0.08 }, // compressed
            { x: 0.9, y: 0.05 }, // back to start
        ];

        ctx.beginPath();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        cycle.forEach((pt, i) => {
            const sx = px + pt.x * pw;
            const sy = py - pt.y * ph;
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        });
        ctx.stroke();

        // Moving dot on cycle
        const progress = norm / 720;
        const dotIdx = Math.floor(progress * (cycle.length - 1));
        const frac = (progress * (cycle.length - 1)) - dotIdx;
        const p1 = cycle[Math.min(dotIdx, cycle.length - 1)];
        const p2 = cycle[Math.min(dotIdx + 1, cycle.length - 1)];

        const dotX = px + (p1.x + (p2.x - p1.x) * frac) * pw;
        const dotY = py - (p1.y + (p2.y - p1.y) * frac) * ph;

        ctx.beginPath();
        ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = this.sparkActive ? '#fbbf24' : '#10b981';
        ctx.fill();
    }
};
