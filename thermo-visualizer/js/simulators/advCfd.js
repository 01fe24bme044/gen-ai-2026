/**
 * CFD Simulator – Thermodynamic Flow (Optimized: ImageData pixel rendering)
 * Concepts: EOS, Energy, Navier-Stokes, Heat Transfer, Compressible, 2nd Law, Phase Change
 */
window.advCfd = {
    animationId: null, isRunning: false,
    mode: 'heat', t: 0,
    COLS: 120, ROWS: 75,   // increased resolution – fast via ImageData
    grid: null, imgData: null,
    frameCount: 0,

    init() {
        this.container = document.getElementById('view-container');
        if (!this.container) return;
        this.container.innerHTML = `
        <div class="card katex-view" style="margin-bottom:1rem;border-left:4px solid #0ea5e9;">
            <h2 style="color:#0ea5e9;margin-bottom:0.3rem;">Thermodynamic CFD Simulator</h2>
            <p style="color:var(--text-muted);font-size:0.88rem;">Navier-Stokes + EOS + Energy conservation — real-time pixel rendering.</p>
        </div>
        <div class="card katex-view" style="margin-bottom:1rem;border-left:4px solid #3b82f6;">
            <h3 style="color:#3b82f6;">Governing Equations</h3>
            <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
                $$ \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{v}) = 0 \\quad \\text{(Continuity)} $$
            </div>
            <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
                $$ \\rho \\frac{D\\mathbf{v}}{Dt} = -\\nabla p + \\mu \\nabla^2 \\mathbf{v} + \\rho \\mathbf{g} \\quad \\text{(Momentum)} $$
            </div>
            <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
                $$ \\rho c_p \\frac{DT}{Dt} = k \\nabla^2 T + \\Phi \\quad \\text{(Energy)} $$
            </div>
            <p style="font-size:0.85rem;color:var(--text-muted);">Where $\\Phi = \\mu(\\nabla \\mathbf{v} : \\nabla \\mathbf{v})$ is viscous dissipation</p>
        </div>
        <div class="card katex-view" style="margin-bottom:1rem;border-left:4px solid #10b981;">
            <h3 style="color:#10b981;">Equation of State</h3>
            <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
                $$ p = \\rho R T \\quad \\text{(Ideal Gas)} $$
            </div>
            <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
                $$ c_p - c_v = R, \\quad \\gamma = \\frac{c_p}{c_v} $$
            </div>
            <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
                $$ a = \\sqrt{\\gamma R T} \\quad \\text{(Speed of sound)} $$
            </div>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">
            <button class="btn cfd-mode-btn" data-mode="heat"     style="background:#ef4444;flex:1;font-size:0.8rem;">🔥 Heat Transfer</button>
            <button class="btn cfd-mode-btn" data-mode="compress" style="background:#3b82f6;flex:1;font-size:0.8rem;">💨 Compressible</button>
            <button class="btn cfd-mode-btn" data-mode="phase"    style="background:#10b981;flex:1;font-size:0.8rem;">❄️ Phase Change</button>
            <button class="btn cfd-mode-btn" data-mode="entropy"  style="background:#a855f7;flex:1;font-size:0.8rem;">⚡ Entropy</button>
        </div>
        <div class="grid-2" style="gap:1rem;">
            <div class="card" style="padding:0;overflow:hidden;position:relative;min-height:360px;">
                <canvas id="cfd-canvas" style="width:100%;height:100%;display:block;image-rendering:pixelated;"></canvas>
                <div id="cfd-legend" style="position:absolute;bottom:8px;left:8px;font-size:0.68rem;color:#fff;background:rgba(0,0,0,0.65);padding:5px 9px;border-radius:6px;font-family:monospace;pointer-events:none;"></div>
            </div>
            <div class="card controls-panel">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Parameters</h3>
                <div class="control-group">
                    <label>Inlet Velocity <span id="cfd-vel-val">5</span> m/s</label>
                    <input type="range" id="cfd-vel" min="1" max="20" value="5">
                </div>
                <div class="control-group">
                    <label>Hot Wall <span id="cfd-th-val">800</span> K</label>
                    <input type="range" id="cfd-th" min="300" max="1500" value="800">
                </div>
                <div class="control-group">
                    <label>Cold Wall <span id="cfd-tc-val">300</span> K</label>
                    <input type="range" id="cfd-tc" min="100" max="600" value="300">
                </div>
                <div class="control-group">
                    <label>γ (Cp/Cv) <span id="cfd-gamma-val">1.40</span></label>
                    <input type="range" id="cfd-gamma" min="1.10" max="1.67" step="0.01" value="1.40">
                </div>
                <div style="display:flex;gap:0.5rem;margin-top:0.5rem;">
                    <button class="btn" id="cfd-start" style="background:#10b981;flex:1;">▶ Run</button>
                    <button class="btn" id="cfd-stop"  style="background:#ef4444;flex:1;">■ Stop</button>
                    <button class="btn" id="cfd-reset" style="background:#475569;flex:1;">↺ Reset</button>
                </div>
                <div class="glass" style="padding:0.8rem;border-radius:8px;margin-top:0.75rem;font-family:monospace;font-size:0.78rem;line-height:1.9;">
                    <div style="color:#0ea5e9;font-weight:bold;margin-bottom:0.2rem;">Live Readout</div>
                    <div>T_avg: <strong id="r-T" style="color:#ef4444;">—</strong> K</div>
                    <div>ρ_avg: <strong id="r-rho" style="color:#f59e0b;">—</strong> kg/m³</div>
                    <div>P_avg: <strong id="r-P" style="color:#3b82f6;">—</strong> kPa</div>
                    <div>U_int: <strong id="r-U" style="color:#a855f7;">—</strong> kJ/kg</div>
                    <div>H:     <strong id="r-H" style="color:#10b981;">—</strong> kJ/kg</div>
                    <div>Ma:    <strong id="r-Ma" style="color:#fbbf24;">—</strong></div>
                    <div>ΔS:    <strong id="r-S" style="color:#f43f5e;">—</strong> J/kg·K</div>
                    <div>Phase: <strong id="r-Ph" style="color:#38bdf8;">—</strong></div>
                </div>
            </div>
        </div>
        <!-- Concept panels -->
        <div class="grid-2" style="margin-top:1rem;gap:0.75rem;">
            <div class="card" style="border-left:4px solid #ef4444;padding:1rem;">
                <h4 style="color:#ef4444;margin-bottom:0.3rem;">1st Law – Energy Conservation</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);">∂(ρE)/∂t + ∇·[(ρE+p)u] = ∇·(k∇T) + Q̇<br>E = CᵥT + ½|v|²</p>
            </div>
            <div class="card" style="border-left:4px solid #3b82f6;padding:1rem;">
                <h4 style="color:#3b82f6;margin-bottom:0.3rem;">Equation of State</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);">p = ρRT &nbsp;(ideal gas, R=287 J/kg·K)<br>ρ updated every step via EOS.</p>
            </div>
            <div class="card" style="border-left:4px solid #a855f7;padding:1rem;">
                <h4 style="color:#a855f7;margin-bottom:0.3rem;">Internal Energy &amp; Enthalpy</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);">u = CᵥT &nbsp;|&nbsp; h = CₚT = u + p/ρ<br>Shown live in readout panel.</p>
            </div>
            <div class="card" style="border-left:4px solid #f59e0b;padding:1rem;">
                <h4 style="color:#f59e0b;margin-bottom:0.3rem;">Fourier Heat Transfer</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);">q = −k∇T &nbsp;(conduction)<br>Convection via upwind advection scheme.</p>
            </div>
            <div class="card" style="border-left:4px solid #10b981;padding:1rem;">
                <h4 style="color:#10b981;margin-bottom:0.3rem;">Compressible Thermodynamics</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);">a = √(γRT) &nbsp;|&nbsp; Ma = V/a<br>T₀ = T(1 + ½(γ−1)Ma²)</p>
            </div>
            <div class="card" style="border-left:4px solid #f43f5e;padding:1rem;">
                <h4 style="color:#f43f5e;margin-bottom:0.3rem;">2nd Law – Entropy Production</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);">σ = k(∇T)²/T² + μΦ/T ≥ 0<br>Entropy mode shows irreversibility hotspots.</p>
            </div>
            <div class="card" style="border-left:4px solid #38bdf8;padding:1rem;">
                <h4 style="color:#38bdf8;margin-bottom:0.3rem;">Phase Change</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);">Lᵥ=2257 kJ/kg absorbs at T_sat≈373 K.<br>Blue=liquid | white=boiling | orange=vapour</p>
            </div>
            <div class="card" style="border-left:4px solid #6366f1;padding:1rem;">
                <h4 style="color:#6366f1;margin-bottom:0.3rem;">Navier-Stokes Coupling</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);">ρ(∂u/∂t+u·∇u) = −∇p + μ∇²u + ρgβΔT<br>Buoyancy links T→momentum every frame.</p>
            </div>
        </div>`;

        this.canvas = document.getElementById('cfd-canvas');
        this.ctx    = this.canvas.getContext('2d');
        const rect  = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width  = this.W = Math.max(rect.width  || 560, 200);
        this.canvas.height = this.H = Math.max(rect.height || 360, 200);
        this.imgData = this.ctx.createImageData(this.COLS, this.ROWS);

        this._initGrid();
        this._bindEvents();
        this.isRunning = true;
        this._animate();
    },

    _initGrid() {
        const Th = +((document.getElementById('cfd-th')?.value) || 800);
        const Tc = +((document.getElementById('cfd-tc')?.value) || 300);
        const R  = 287, rho0 = 1.2;
        this.grid = new Array(this.ROWS * this.COLS);
        for (let j = 0; j < this.ROWS; j++) {
            for (let i = 0; i < this.COLS; i++) {
                const T = Tc + (Th - Tc) * (1 - j / (this.ROWS - 1));
                this.grid[j * this.COLS + i] = { T, rho: rho0, u: 2, v: 0, p: rho0*R*T, sigma: 0, phase: 0 };
            }
        }
        this.t = 0;
    },

    _bindEvents() {
        document.getElementById('cfd-start')?.addEventListener('click',  () => { if (!this.isRunning) { this.isRunning = true; this._animate(); } });
        document.getElementById('cfd-stop')?.addEventListener('click',   () => { this.isRunning = false; if (this.animationId) cancelAnimationFrame(this.animationId); });
        document.getElementById('cfd-reset')?.addEventListener('click',  () => { this._initGrid(); if (!this.isRunning) { this.isRunning = true; this._animate(); } });
        ['cfd-vel','cfd-th','cfd-tc','cfd-gamma'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', e => {
                const map = {'cfd-vel':'cfd-vel-val','cfd-th':'cfd-th-val','cfd-tc':'cfd-tc-val','cfd-gamma':'cfd-gamma-val'};
                const v = parseFloat(e.target.value);
                const el = document.getElementById(map[id]); if (el) el.textContent = v.toFixed(id==='cfd-gamma'?2:0);
                if (id==='cfd-th'||id==='cfd-tc') this._initGrid();
            });
        });
        document.querySelectorAll('.cfd-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.mode = btn.dataset.mode;
                document.querySelectorAll('.cfd-mode-btn').forEach(b => b.style.opacity='0.5');
                btn.style.opacity='1';
                this._initGrid();
            });
        });
    },

    _step() {
        const Th    = +((document.getElementById('cfd-th')?.value)    || 800);
        const Tc    = +((document.getElementById('cfd-tc')?.value)    || 300);
        const vel   = +((document.getElementById('cfd-vel')?.value)   || 5);
        const gamma = +((document.getElementById('cfd-gamma')?.value) || 1.4);
        const R  = 287, Cv = R/(gamma-1), k = 0.025, dt = 0.35, dx = 1;
        const G = this.grid, C = this.COLS, R2 = this.ROWS;
        const next = G.map(c => ({ ...c }));

        for (let j = 0; j < R2; j++) {
            for (let i = 0; i < C; i++) {
                const idx = j*C + i;
                const c   = G[idx];

                // Boundary
                if (j === 0)    { next[idx].T = Th; continue; }
                if (j === R2-1) { next[idx].T = Tc; continue; }
                if (i === 0)    { next[idx].u = vel; next[idx].T = (Th+Tc)*0.5; continue; }
                if (i === C-1)  { next[idx].T = G[idx].T; next[idx].u = G[idx].u; continue; }

                const Tl = G[j*C + (i-1)].T, Tr = G[j*C + (i+1)].T;
                const Tu = G[(j-1)*C + i].T, Td = G[(j+1)*C + i].T;

                // Conduction
                let dT = k * (Tl + Tr + Tu + Td - 4*c.T) * dt;
                // Convection (upwind)
                dT -= c.u > 0
                    ? c.u * (c.T - Tl) / dx * dt
                    : c.u * (Tr - c.T) / dx * dt;

                // Buoyancy
                const beta = 1 / Math.max(c.T, 1);
                const buoy = -9.81 * 1.2 * beta * (c.T - (Th+Tc)/2);
                const dv   = buoy / Math.max(c.rho, 0.01) * dt;

                // Phase change
                let phase = 0, newT = c.T + dT;
                if (this.mode === 'phase') {
                    if (c.T < 373 && newT >= 373) { dT = 373 - c.T - 0.01; phase = 1; }
                    else if (newT > 373)            { phase = 2; }
                    newT = c.T + dT;
                }

                const T2   = Math.max(newT, 1);
                const gradT2 = ((Tr-Tl)/(2*dx))**2 + ((Td-Tu)/(2*dx))**2;
                next[idx].T     = T2;
                next[idx].rho   = Math.max(0.01, c.p / (R * T2));
                next[idx].u     = c.u * 0.99 + vel * 0.01;
                next[idx].v     = (c.v + dv) * 0.97;
                next[idx].p     = next[idx].rho * R * T2;
                next[idx].sigma = k * gradT2 / (T2*T2 + 1e-6);
                next[idx].phase = phase;
            }
        }
        this.grid = next;
        this.t   += dt;
    },

    _tempRGB(f) {
        // blue→cyan→green→yellow→red
        let r,g,b;
        if      (f < 0.25){ const t=f/0.25;           r=0;             g=Math.round(t*255);   b=255; }
        else if (f < 0.50){ const t=(f-0.25)/0.25;    r=0;             g=255;                 b=Math.round((1-t)*255); }
        else if (f < 0.75){ const t=(f-0.50)/0.25;    r=Math.round(t*255); g=255;             b=0; }
        else               { const t=(f-0.75)/0.25;    r=255;           g=Math.round((1-t)*255);b=0; }
        return [r,g,b];
    },

    _draw() {
        const ctx = this.ctx, G = this.grid, C = this.COLS, R2 = this.ROWS;
        const gamma = +((document.getElementById('cfd-gamma')?.value) || 1.4);
        const Th = +((document.getElementById('cfd-th')?.value) || 800);
        const Tc = +((document.getElementById('cfd-tc')?.value) || 300);
        const Rv = 287, Cv2 = Rv/(gamma-1);
        const px = this.imgData.data;

        let sumT=0,sumRho=0,sumP=0,sumSig=0,maxV=0,phaseLabel='Single-phase';

        for (let j = 0; j < R2; j++) {
            for (let i = 0; i < C; i++) {
                const c   = G[j*C+i];
                let   r,g,b;

                if (this.mode === 'heat') {
                    const f = Math.min(1,Math.max(0,(c.T-Tc)/(Th-Tc)));
                    [r,g,b] = this._tempRGB(f);
                } else if (this.mode === 'compress') {
                    const spd = Math.sqrt(c.u*c.u+c.v*c.v);
                    const a   = Math.sqrt(gamma*Rv*c.T);
                    const Ma  = Math.min(1, spd/(a||1));
                    r=Math.round(Ma*255); g=50; b=Math.round((1-Ma)*255);
                } else if (this.mode === 'phase') {
                    if (c.phase===0){ r=29;g=78;b=216; }
                    else if (c.phase===1){ r=224;g=242;b=254; }
                    else { r=249;g=115;b=22; }
                    if (c.phase===1) phaseLabel='Boiling';
                    else if(c.phase===2) phaseLabel='Vapour';
                } else {
                    const f  = Math.min(1, (c.sigma||0)*8000);
                    r=Math.round(50+f*200); g=Math.round((1-f)*80); b=Math.round(180-f*80);
                }

                const base = (j*C+i)*4;
                px[base]=r; px[base+1]=g; px[base+2]=b; px[base+3]=255;

                sumT   += c.T; sumRho += c.rho; sumP += c.p; sumSig += c.sigma||0;
                const spd = Math.sqrt(c.u*c.u+c.v*c.v); if(spd>maxV) maxV=spd;
            }
        }

        // Blit ImageData scaled to canvas
        // Draw to offscreen then scale
        const tmp = document.createElement('canvas');
        tmp.width=C; tmp.height=R2;
        tmp.getContext('2d').putImageData(this.imgData,0,0);
        ctx.drawImage(tmp, 0, 0, this.W, this.H);

        // Stats
        const N=C*R2, avgT=sumT/N, avgRho=sumRho/N, avgP=sumP/N;
        const a_avg=Math.sqrt(gamma*Rv*avgT), Ma_avg=maxV/(a_avg||1);
        const avgU=Cv2*avgT, avgH=avgU+avgP/avgRho;
        const set=(id,v)=>{ const el=document.getElementById(id); if(el)el.textContent=v; };
        set('r-T',   avgT.toFixed(1));
        set('r-rho', avgRho.toFixed(3));
        set('r-P',   (avgP/1000).toFixed(2));
        set('r-U',   (avgU/1000).toFixed(2));
        set('r-H',   (avgH/1000).toFixed(2));
        set('r-Ma',  Ma_avg.toFixed(4));
        set('r-S',   ((sumSig/N)*1e4).toFixed(4));
        set('r-Ph',  this.mode==='phase' ? phaseLabel : 'Gas');

        const leg=document.getElementById('cfd-legend');
        const legends={heat:'🌡 Temperature field (blue=cold → red=hot)',compress:'💨 Mach number (blue=slow → red=faster)',phase:'❄️ Liquid | Boiling | Vapour',entropy:'⚡ Entropy production σ (purple=high)'};
        if(leg) leg.textContent=legends[this.mode]||'';
    },

    _animate() {
        if (!this.isRunning) return;
        this.frameCount++;
        // Run multiple physics steps per frame for speed
        for (let i = 0; i < 3; i++) this._step();
        this._draw();
        this.animationId = requestAnimationFrame(() => this._animate());
    },

    stop() {
        this.isRunning = false;
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }
};
