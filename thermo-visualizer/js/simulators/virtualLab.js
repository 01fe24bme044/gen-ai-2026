/**
 * Virtual Lab - 17 Machines with 3D Canvas Simulations
 */
// Helper function to get theme-aware text color
window.getCanvasTextColor = function(lightColor = '#000000', darkColor = '#ffffff') {
    return document.body.getAttribute('data-theme') === 'light' ? lightColor : darkColor;
};

window.virtualLab = {
    animationId: null,
    active: false,
    currentExp: '4stroke',
    angle: 0,
    journalData: [],
    currentTab: 'simulator',

    steamTableData: [
        {t:100,p:1.013,hf:419.1,hfg:2257,hg:2676,sf:1.307,sg:7.355},
        {t:120,p:1.985,hf:503.7,hfg:2203,hg:2706,sf:1.528,sg:7.130},
        {t:140,p:3.614,hf:589.1,hfg:2145,hg:2734,sf:1.739,sg:6.930},
        {t:160,p:6.180,hf:675.5,hfg:2083,hg:2758,sf:1.943,sg:6.740},
        {t:180,p:10.03,hf:763.2,hfg:2015,hg:2778,sf:2.139,sg:6.586},
        {t:200,p:15.55,hf:852.4,hfg:1941,hg:2793,sf:2.331,sg:6.432},
        {t:220,p:23.20,hf:943.6,hfg:1859,hg:2802,sf:2.518,sg:6.258},
        {t:240,p:33.48,hf:1037,hfg:1767,hg:2804,sf:2.702,sg:6.069},
        {t:260,p:46.94,hf:1135,hfg:1663,hg:2797,sf:2.885,sg:5.862},
        {t:280,p:64.19,hf:1237,hfg:1543,hg:2780,sf:3.069,sg:5.636},
        {t:300,p:85.93,hf:1345,hfg:1405,hg:2750,sf:3.255,sg:5.361},
        {t:320,p:112.9,hf:1462,hfg:1239,hg:2701,sf:3.449,sg:5.042},
        {t:340,p:146.1,hf:1594,hfg:1027,hg:2622,sf:3.660,sg:4.650},
        {t:360,p:186.7,hf:1761,hfg:721,hg:2482,sf:3.916,sg:4.115},
        {t:374,p:220.6,hf:2084,hfg:0,hg:2084,sf:4.407,sg:4.407}
    ],


    experiments: {
        '4stroke': { title: 'Cut Section: 4-Stroke Diesel Engine', aim: 'Study internal components of a 4-stroke diesel engine.', proc: '1. Power on rig.\n2. Observe Suction→Compression→Power→Exhaust strokes.\n3. Note valve timings and crank angles.', color: '#3b82f6' },
        '2stroke': { title: 'Cut Section: 2-Stroke Petrol Engine', aim: 'Study the two-stroke cycle and port timing diagrams.', proc: '1. Start motor.\n2. Observe Up (compression/exhaust) and Down (power/scavenging) strokes.\n3. Record port opening angles.', color: '#10b981' },
        'redwood': { title: 'Redwood Viscometer Apparatus', aim: 'Determine kinematic viscosity of oil at various temperatures.', proc: '1. Fill oil cup.\n2. Heat water bath to target temperature.\n3. Open valve, record time for 50ml collection.', color: '#f59e0b' },
        'saybolt': { title: 'Saybolt Viscometer Apparatus', aim: 'Determine Saybolt Universal Viscosity (SUV) of oil.', proc: '1. Heat oil to specified temp.\n2. Remove cork.\n3. Time flow of 60ml oil into flask.', color: '#f97316' },
        'hsd': { title: 'High Speed Diesel Engine Test Rig', aim: 'Load test on HSD engine, determine performance characteristics.', proc: '1. Start engine, warm up.\n2. Apply load via dynamometer.\n3. Record speed, fuel consumption, temperatures.', color: '#ef4444' },
        'petrol': { title: 'Petrol Engine Test Rig', aim: 'Determine BP, IP and efficiency of petrol engine.', proc: '1. Start engine.\n2. Gradually apply load.\n3. Note manometer readings and RPM.', color: '#8b5cf6' },
        'cooling': { title: 'Optimum Cooling Test Rig', aim: 'Find optimum cooling water flow for maximum thermal efficiency.', proc: '1. Run engine at constant load.\n2. Vary cooling water flow rate.\n3. Record temperatures to find optimum.', color: '#06b6d4' },
        'retardation': { title: 'Retardation Test Rig', aim: 'Find frictional power by retardation (run-down) method.', proc: '1. Run engine at rated speed.\n2. Cut off fuel supply.\n3. Record time for equal speed drops.', color: '#6366f1' },
        'heatbal_no_cal': { title: 'Heat Balance (Without Calorimeter)', aim: 'Draw heat balance sheet without exhaust gas calorimeter.', proc: '1. Run engine at steady state.\n2. Measure fuel input, brake output, cooling water heat.\n3. Estimate exhaust heat by difference.', color: '#ec4899' },
        'heatbal_cal': { title: 'Heat Balance (With Calorimeter)', aim: 'Accurate heat balance using exhaust gas calorimeter.', proc: '1. Attach calorimeter to exhaust.\n2. Measure water flow and temp rise.\n3. Calculate exact exhaust heat rejection.', color: '#e11d48' },
        'steam': { title: 'Steam Power Plant Test Rig', aim: 'Study Rankine cycle and determine overall plant efficiency.', proc: '1. Fire the boiler.\n2. Open steam valve to turbine.\n3. Note condenser temperatures and alternator output.', color: '#94a3b8' },
        'compressor': { title: 'Air Compressor Test Rig', aim: 'Determine volumetric and isothermal efficiency.', proc: '1. Start compressor.\n2. Note receiver pressure rise vs time.\n3. Note manometer readings for air intake.', color: '#78716c' },
        'crdi': { title: 'CRDI CI Engine Test Rig', aim: 'Study performance and emissions of Common Rail Direct Injection engine.', proc: '1. Adjust injection pressure via ECU.\n2. Apply load.\n3. Record SFC and exhaust emissions.', color: '#0ea5e9' },
        'wind': { title: 'Wind Tunnel Test Rig', aim: 'Study pressure distribution over airfoil, determine lift/drag coefficients.', proc: '1. Turn on blower.\n2. Adjust angle of attack.\n3. Note multi-tube manometer readings.', color: '#fb923c' },
        'comp_ci': { title: 'Computerised CI Engine', aim: 'P-V and P-theta diagram acquisition using data logger.', proc: '1. Start engine and software.\n2. Sync crank angle encoder.\n3. Save pressure-crank angle data logs.', color: '#22c55e' },
        'avl_smoke': { title: 'AVL Smoke Meter', aim: 'Measure smoke opacity of diesel engine exhaust.', proc: '1. Connect probe to exhaust.\n2. Trigger measurement.\n3. Note Filter Smoke Number (FSN) or opacity %.', color: '#475569' },
        'avl_gas': { title: 'AVL Exhaust Gas Analyzer', aim: 'Measure CO, HC, CO2, O2, NOx concentrations in exhaust.', proc: '1. Calibrate analyzer with span gas.\n2. Insert probe into tailpipe.\n3. Wait for stable readings and record.', color: '#38bdf8' }
    },

    experimentOrder: ['4stroke', '2stroke', 'redwood', 'saybolt', 'hsd', 'petrol', 'cooling', 'retardation', 'heatbal_no_cal', 'heatbal_cal', 'steam', 'compressor', 'crdi', 'wind', 'comp_ci', 'avl_smoke', 'avl_gas'],

    renderPickerGrid() {
        const grid = document.getElementById('vlab-picker-grid');
        if (!grid) return;
        grid.innerHTML = '';
        this.experimentOrder.forEach((key, idx) => {
            const exp = this.experiments[key];
            if (!exp) return;
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn vlab-exp-card';
            b.setAttribute('data-exp', key);
            b.style.cssText = 'display:flex;align-items:center;padding:1rem 1.2rem;font-size:1.1rem;min-height:60px;border-width:4px;';
            b.innerHTML =
                '<span style="display:inline-block;min-width:2.5rem;color:' + exp.color + ';font-weight:800;font-size:1.2rem;">' +
                (idx + 1) +
                '</span><span style="color:var(--text-main);font-weight:650;">' +
                exp.title +
                '</span>';
            b.addEventListener('click', () => this.enterWorkspace(key));
            grid.appendChild(b);
        });
    },

    enterWorkspace(key) {
        const pick = document.getElementById('vlab-phase-picker');
        const ws = document.getElementById('vlab-phase-workspace');
        if (!pick || !ws) {
            this.loadExperiment(key);
            return;
        }
        pick.style.display = 'none';
        ws.style.display = 'block';
        this.loadExperiment(key);
        document.querySelectorAll('#vlab-workspace-list .vlab-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.getAttribute('data-exp') === key);
        });
        this.switchTab('simulator');
    },

    returnToPicker() {
        const pick = document.getElementById('vlab-phase-picker');
        const ws = document.getElementById('vlab-phase-workspace');
        if (!pick || !ws) return;
        this.active = false;
        pick.style.display = 'block';
        ws.style.display = 'none';
        const log = document.getElementById('vlab-log');
        if (log) log.innerHTML = '<li>Pick one of the 17 experiments to continue.</li>';
    },

    init() {
        const pick = document.getElementById('vlab-phase-picker');
        const ws = document.getElementById('vlab-phase-workspace');
        if (pick && ws) {
            pick.style.display = 'block';
            ws.style.display = 'none';
        }
        this.active = false;
        this.renderPickerGrid();

        const back = document.getElementById('vlab-back-picker');
        if (back) {
            const nb = back.cloneNode(true);
            back.parentNode.replaceChild(nb, back);
            nb.addEventListener('click', () => this.returnToPicker());
        }

        this.bindControls();
        if (!this.animationId) this.animate();
    },

    stop() {
        this.active = false;
        if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
    },

    switchTab(tabName) {
        this.currentTab = tabName;
        ['simulator','manual','steam-table','journal'].forEach(t => {
            const el = document.getElementById('vlab-' + t + '-content');
            if (el) el.style.display = 'none';
        });
        const target = document.getElementById('vlab-' + tabName + '-content');
        if (target) target.style.display = 'block';
        document.querySelectorAll('.vlab-tab-btn').forEach((btn, i) => {
            const tabs = ['simulator','manual','steam-table','journal'];
            btn.classList.toggle('active', tabs[i] === tabName);
            btn.style.background = tabs[i] === tabName ? '' : 'var(--bg-dark)';
        });
        if (tabName === 'manual') this.renderManual();
        if (tabName === 'steam-table') this.renderSteamTable();
        if (tabName === 'journal') this.renderJournal();
    },

    renderManual() {
        const exp = this.experiments[this.currentExp];
        const area = document.getElementById('manual-display-area');
        if (!area || !exp) return;
        area.innerHTML = '<h3 style="color:var(--accent);margin-bottom:1rem;">' + exp.title + '</h3>' +
            '<div class="glass" style="padding:1.5rem;border-radius:12px;margin-bottom:1.5rem;">' +
            '<h4 style="color:var(--primary);">Aim</h4><p>' + exp.aim + '</p></div>' +
            '<div class="glass" style="padding:1.5rem;border-radius:12px;margin-bottom:1.5rem;">' +
            '<h4 style="color:var(--primary);">Procedure</h4><p>' + exp.proc.replace(/\\n/g,'<br>') + '</p></div>' +
            '<div class="glass" style="padding:1.5rem;border-radius:12px;margin-bottom:1.5rem;">' +
            '<h4 style="color:var(--primary);">Theory</h4>' +
            '<p>This experiment demonstrates fundamental principles of thermodynamics and mechanical engineering. ' +
            'Students should observe the energy conversion processes, measure relevant parameters, and verify theoretical predictions against experimental data.</p></div>' +
            '<div class="glass" style="padding:1.5rem;border-radius:12px;">' +
            '<h4 style="color:var(--primary);">Observation Table</h4>' +
            '<table style="width:100%;margin-top:0.5rem;"><thead><tr>' +
            '<th>Sr.</th><th>Parameter</th><th>Trial 1</th><th>Trial 2</th><th>Trial 3</th></tr></thead>' +
            '<tbody><tr><td>1</td><td>Speed (RPM)</td><td>—</td><td>—</td><td>—</td></tr>' +
            '<tr><td>2</td><td>Load (N)</td><td>—</td><td>—</td><td>—</td></tr>' +
            '<tr><td>3</td><td>Temperature (K)</td><td>—</td><td>—</td><td>—</td></tr>' +
            '<tr><td>4</td><td>Fuel Consumed (ml)</td><td>—</td><td>—</td><td>—</td></tr></tbody></table></div>';
    },

    renderSteamTable() {
        const table = document.getElementById('steam-table-el');
        if (!table) return;
        table.innerHTML = '<thead><tr>' +
            '<th>T (°C)</th><th>P (bar)</th><th>h<sub>f</sub> (kJ/kg)</th>' +
            '<th>h<sub>fg</sub> (kJ/kg)</th><th>h<sub>g</sub> (kJ/kg)</th>' +
            '<th>s<sub>f</sub> (kJ/kgK)</th><th>s<sub>g</sub> (kJ/kgK)</th>' +
            '</tr></thead><tbody>' +
            this.steamTableData.map(r =>
                '<tr><td>' + r.t + '</td><td>' + r.p.toFixed(2) + '</td><td>' +
                r.hf.toFixed(1) + '</td><td>' + r.hfg + '</td><td>' +
                r.hg + '</td><td>' + r.sf.toFixed(3) + '</td><td>' + r.sg.toFixed(3) + '</td></tr>'
            ).join('') + '</tbody>';
    },

    renderJournal() {
        const el = document.getElementById('journal-entries');
        if (!el) return;
        if (this.journalData.length === 0) {
            el.innerHTML = '<div class="glass" style="padding:2rem;text-align:center;border-radius:12px;">' +
                '<p style="color:var(--text-muted);font-size:1.1rem;">No recordings yet. Start a rig and click "Record Value" to log data.</p></div>';
            return;
        }
        el.innerHTML = this.journalData.map((entry, i) =>
            '<div class="glass" style="padding:1rem;border-radius:8px;border-left:4px solid var(--primary);">' +
            '<strong style="color:var(--accent);">' + entry.exp + '</strong>' +
            '<p style="margin:0.3rem 0;font-size:0.9rem;color:var(--text-muted);">Time: ' + entry.time +
            ' | Value: ' + entry.value + ' | Temp: ' + entry.temp + '</p></div>'
        ).join('');
    },

    
    bindControls() {
        document.querySelectorAll('.vlab-btn').forEach(btn => {
            const nb = btn.cloneNode(true);
            btn.parentNode.replaceChild(nb, btn);
            nb.addEventListener('click', (e) => {
                const tgt = e.currentTarget;
                document.querySelectorAll('.vlab-btn').forEach(b => b.classList.remove('active'));
                tgt.classList.add('active');
                this.active = false;
                this.loadExperiment(tgt.getAttribute('data-exp'));
            });
        });

        ['vlab-start','vlab-stop','vlab-record'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const ne = el.cloneNode(true);
            el.parentNode.replaceChild(ne, el);
            ne.addEventListener('click', () => {
                if (id === 'vlab-start') { this.active = true; this.log('Rig STARTED'); }
                else if (id === 'vlab-stop') { this.active = false; this.log('Rig STOPPED'); }
                else if (id === 'vlab-record') {
                    if (!this.active) { this.log('ERROR: Start rig first!'); return; }
                    const val = (Math.random()*100).toFixed(2);
                    const temp = (300+Math.random()*200).toFixed(1);
                    const exp = this.experiments[this.currentExp];
                    this.journalData.push({
                        exp: exp ? exp.title : this.currentExp,
                        time: new Date().toLocaleTimeString(),
                        value: val + ' units',
                        temp: temp + ' K'
                    });
                    this.log(`Recorded: ${val} units | Temp: ${temp} K`);
                    if(window.app) window.app.addXP(5);
                }
            });
        });
    },

    loadExperiment(key) {
        this.currentExp = key;
        const exp = this.experiments[key];
        if (!exp) return;
        const t = document.getElementById('vlab-title');
        const a = document.getElementById('vlab-aim');
        const p = document.getElementById('vlab-proc');
        const banner = document.getElementById('vlab-banner-title');
        const manualLb = document.getElementById('vlab-manual-exp-label');
        if (t) t.textContent = exp.title;
        if (a) a.textContent = exp.aim;
        if (p) p.innerHTML = exp.proc.replace(/\n/g, '<br>');
        if (banner) banner.textContent = exp.title;
        if (manualLb) manualLb.textContent = exp.title;
        this.log('Loaded rig: ' + exp.title);
    },

    log(msg) {
        const ul = document.getElementById('vlab-log');
        if (!ul) return;
        const li = document.createElement('li');
        li.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        ul.prepend(li);
        while (ul.children.length > 8) ul.removeChild(ul.lastChild);
    },

    animate() {
        this.angle += this.active ? 4 : 0.35;
        this.drawRig();
        this.updateLiveReadouts();
        this.animationId = requestAnimationFrame(() => this.animate());
    },

    updateLiveReadouts() {
        const rpmEl = document.getElementById('vlab-readout-rpm');
        const loadEl = document.getElementById('vlab-readout-load');
        const tempEl = document.getElementById('vlab-readout-temp');
        if (!rpmEl || !loadEl || !tempEl) return;

        const rpm = this.active
            ? Math.max(0, Math.round(1320 + Math.sin(this.angle * 0.07) * 240 + Math.cos(this.angle * 0.03) * 90))
            : Math.max(0, Math.round(Math.sin(this.angle * 0.02) * 4));
        rpmEl.textContent = rpm;

        const load = this.active
            ? Math.min(100, 38 + Math.sin(this.angle * 0.045) * 32 + Math.sin(this.angle * 0.11) * 8)
            : 0;
        loadEl.textContent = load.toFixed(1) + '%';

        const tK = this.active
            ? Math.round(410 + Math.sin(this.angle * 0.038) * 70 + this.angle * 0.025)
            : 300 + Math.round(Math.sin(this.angle * 0.015) * 6);
        tempEl.textContent = tK + ' K';
    },

    drawRig() {
        const canvas = document.getElementById('vlab-canvas');
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent || parent.offsetHeight < 20 || parent.offsetWidth < 20) return;

        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = parent.getBoundingClientRect();
        const W = rect.width;
        const H = rect.height;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const exp = this.experiments[this.currentExp];
        const col = exp ? exp.color : '#3b82f6';

        // Enhanced background with gradient for depth
        const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H));
        bg.addColorStop(0, '#0f172a');
        bg.addColorStop(1, '#020617');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Add subtle grid for 3D effect
        ctx.strokeStyle = 'rgba(59,130,246,0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < W; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, H);
            ctx.stroke();
        }
        for (let i = 0; i < H; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(W, i);
            ctx.stroke();
        }

        const cx = W / 2;
        const cy = H / 2;
        const a = this.angle * Math.PI / 180;
        const key = this.currentExp;

        // Enhanced 3D rendering with shadows and depth
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 8;
        ctx.shadowOffsetY = 8;

        // Scale up the drawings for better visibility
        const scale = 1.3;
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.translate(-cx, -cy);

        if (key === '4stroke' || key === '2stroke') this.drawEngine(ctx, cx, cy, a, col, key);
        else if (key === 'redwood' || key === 'saybolt') this.drawViscometer(ctx, cx, cy, a, col);
        else if (key === 'steam') this.drawRankinePlant(ctx, W, H, a, col);
        else if (key === 'wind') this.drawWindTunnel(ctx, cx, cy, a, col);
        else if (key === 'compressor') this.drawCompressor(ctx, cx, cy, a, col);
        else if (key === 'avl_smoke' || key === 'avl_gas') this.drawAVL(ctx, cx, cy, a, col, key);
        else if (['hsd', 'petrol', 'crdi', 'comp_ci'].includes(key)) this.drawCombustionChamber(ctx, W, H, a, col, key);
        else if (['cooling', 'retardation'].includes(key)) this.drawHeatTransferModes(ctx, W, H, a, col, key);
        else if (['heatbal_no_cal', 'heatbal_cal'].includes(key)) this.drawHeatBalancePlant(ctx, W, H, a, col);
        else this.drawGenericEngine(ctx, cx, cy, a, col);
        
        ctx.restore();

        // Enhanced status indicator with glow effect
        const statusX = W - 110;
        const statusY = 15;
        
        if (this.active) {
            // Glow effect for running status
            const glow = ctx.createRadialGradient(statusX + 46, statusY + 13, 0, statusX + 46, statusY + 13, 50);
            glow.addColorStop(0, 'rgba(16,185,129,0.5)');
            glow.addColorStop(1, 'rgba(16,185,129,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(statusX - 25, statusY - 25, 142, 76);
        }
        
        // Status box with enhanced styling
        const statusGradient = ctx.createLinearGradient(statusX, statusY, statusX + 92, statusY + 26);
        if (this.active) {
            statusGradient.addColorStop(0, '#10b981');
            statusGradient.addColorStop(1, '#059669');
        } else {
            statusGradient.addColorStop(0, '#ef4444');
            statusGradient.addColorStop(1, '#dc2626');
        }
        
        ctx.fillStyle = statusGradient;
        ctx.beginPath();
        ctx.roundRect(statusX, statusY, 92, 26, 8);
        ctx.fill();
        
        // Add border for depth
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Status text with better styling
        ctx.fillStyle = getCanvasTextColor();
        ctx.font = 'bold 13px system-ui,sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText(this.active ? 'RUNNING' : 'STOPPED', statusX + 46, statusY + 17);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
    },

    drawRankinePlant(ctx, W, H, ang, col) {
        ctx.fillStyle = 'rgba(15,23,42,0.95)';
        ctx.beginPath();
        ctx.ellipse(W * 0.46, H * 0.87, W * 0.44, H * 0.065, 0, 0, Math.PI * 2);
        ctx.fill();

        const bx = W * 0.1;
        const by = H * 0.26;
        const bw = W * 0.22;
        const bh = H * 0.44;
        const rx = bw * 0.075;

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(bx + rx * 0.38, by + bh / 2, rx * 0.85, bh * 0.49, 0, Math.PI / 2, -Math.PI / 2, true);
        ctx.fill();

        const metal = ctx.createLinearGradient(bx + rx, 0, bx + bw - rx * 0.5, 0);
        metal.addColorStop(0, '#334155');
        metal.addColorStop(0.45, '#94a3b8');
        metal.addColorStop(1, '#1e293b');
        ctx.fillStyle = metal;
        ctx.fillRect(bx + rx * 0.32, by, bw - rx * 1.15, bh);

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.ellipse(bx + bw - rx * 0.15, by + bh / 2, rx * 1.08, bh * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();

        if (this.active) {
            const fy = by + bh - 6;
            const grd = ctx.createRadialGradient(bx + bw * 0.38, fy, 4, bx + bw * 0.38, fy - 48, 62);
            grd.addColorStop(0, 'rgba(253,224,71,0.95)');
            grd.addColorStop(0.45, 'rgba(249,115,22,0.85)');
            grd.addColorStop(1, 'rgba(239,68,68,0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.moveTo(bx + bw * 0.14, fy);
            ctx.quadraticCurveTo(bx + bw * 0.38 + Math.sin(ang * 5) * 10, fy - 58, bx + bw * 0.62, fy);
            ctx.fill();
        }

        const steamY = by + bh * 0.22;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 9;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bx + bw - rx * 0.6, steamY);
        ctx.quadraticCurveTo(W * 0.42, by + bh * 0.12, W * 0.52, H * 0.42);
        ctx.stroke();

        if (this.active) {
            for (let i = 0; i < 8; i++) {
                const u = ((ang * 35 + i * 13) % 100) / 100;
                ctx.fillStyle = 'rgba(226,232,240,' + (0.45 * (1 - u)) + ')';
                ctx.beginPath();
                ctx.arc(W * 0.38 + u * 95, steamY - u * 35 + Math.sin(u * 10) * 8, 5 + u * 12, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const tx = W * 0.52;
        const ty = H * 0.34;
        const tw = W * 0.2;
        const th = H * 0.24;
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = col;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(tx, ty, tw, th, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx + 16, ty - 14);
        ctx.lineTo(tx + tw + 16, ty - 14);
        ctx.lineTo(tx + tw, ty);
        ctx.fill();

        ctx.save();
        ctx.translate(tx + tw / 2, ty + th / 2);
        ctx.rotate(this.active ? ang * 3.2 : ang * 0.06);
        for (let i = 0; i < 9; i++) {
            ctx.rotate(Math.PI / 4.5);
            ctx.fillStyle = col;
            ctx.fillRect(0, -4, tw * 0.38, 8);
        }
        ctx.restore();

        const cxr = W * 0.76;
        const cyw = H * 0.38;
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(cxr, cyw, W * 0.17, H * 0.32, 14);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tx + tw, ty + th / 2);
        ctx.quadraticCurveTo(W * 0.67, ty + th * 0.75, cxr + W * 0.085, cyw + H * 0.06);
        ctx.stroke();

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cxr + W * 0.085, cyw + H * 0.22);
        ctx.quadraticCurveTo(W * 0.58, H * 0.72, bx + bw * 0.5, by + bh - 10);
        ctx.stroke();

        const px = W * 0.3;
        const py = H * 0.76;
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(px, py, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(px, py, 26, -Math.PI / 2, -Math.PI / 2 + (this.active ? (ang * 6) % (Math.PI * 2) : 0));
        ctx.stroke();

        ctx.fillStyle = 'rgba(148,163,184,0.95)';
        ctx.font = 'bold 12px system-ui,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Steam plant — boiler · turbine · condenser · pump (pseudo-3D)', W / 2, H * 0.935);
        ctx.textAlign = 'left';
    },

    drawCombustionChamber(ctx, W, H, ang, col, key) {
        const cx = W / 2;
        const cylW = Math.min(160, W * 0.32);
        const cylH = Math.min(260, H * 0.55);
        const cylX = cx - cylW / 2;
        const cylTop = H * 0.18;
        const d = 20;

        ctx.fillStyle = 'rgba(30,41,59,0.96)';
        ctx.fillRect(cylX + d, cylTop - d, cylW, cylH);

        ctx.fillStyle = 'rgba(71,85,105,0.88)';
        ctx.beginPath();
        ctx.moveTo(cylX + cylW, cylTop);
        ctx.lineTo(cylX + cylW + d, cylTop - d);
        ctx.lineTo(cylX + cylW + d, cylTop + cylH - d);
        ctx.lineTo(cylX + cylW, cylTop + cylH);
        ctx.fill();

        ctx.fillStyle = 'rgba(51,65,85,0.9)';
        ctx.beginPath();
        ctx.moveTo(cylX, cylTop);
        ctx.lineTo(cylX + d, cylTop - d);
        ctx.lineTo(cylX + cylW + d, cylTop - d);
        ctx.lineTo(cylX + cylW, cylTop);
        ctx.fill();

        const pistonY = cylTop + 42 + Math.sin(ang * 2.2) * (this.active ? 32 : 10);

        if (this.active) {
            const grad = ctx.createLinearGradient(cx, pistonY + 30, cx, cylTop + cylH - 12);
            grad.addColorStop(0, key === 'petrol' ? 'rgba(251,191,36,0.95)' : 'rgba(251,146,60,0.95)');
            grad.addColorStop(0.55, key === 'petrol' ? 'rgba(249,115,22,0.65)' : 'rgba(239,68,68,0.82)');
            grad.addColorStop(1, 'rgba(15,23,42,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(cylX + 10, pistonY + 24, cylW - 20, cylTop + cylH - pistonY - 48);

            for (let i = 0; i < 22; i++) {
                const ph = ang * 3 + i * 0.55;
                const r = 22 + (i % 7) * 14;
                ctx.fillStyle = 'rgba(253,186,116,' + (0.12 + (i % 4) * 0.05) + ')';
                ctx.beginPath();
                ctx.arc(cx + Math.cos(ph) * r * 0.35, pistonY + 70 + Math.sin(ph) * 32, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.fillStyle = '#475569';
        ctx.fillRect(cylX + 8, pistonY, cylW - 16, 28);

        ctx.strokeStyle = 'rgba(148,163,184,0.85)';
        ctx.lineWidth = 3;
        ctx.strokeRect(cylX, cylTop, cylW, cylH);

        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(cx - 6, cylTop - 26, 12, 28);

        ctx.fillStyle = 'rgba(226,232,240,0.9)';
        ctx.font = 'bold 12px system-ui,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
            key === 'petrol' ? 'SI combustion chamber (spark ignition)' : 'CI combustion chamber (compression ignition)',
            cx,
            cylTop + cylH + 36
        );
        ctx.textAlign = 'left';
    },

    drawHeatTransferModes(ctx, W, H, ang, col, key) {
        ctx.font = 'bold 12px system-ui,sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Conduction', W * 0.14, H * 0.1);
        ctx.fillText('Convection', W * 0.46, H * 0.1);
        ctx.fillText('Thermal radiation', W * 0.74, H * 0.1);

        const wy = H * 0.22;
        const wx = W * 0.06;
        const g = ctx.createLinearGradient(wx, 0, wx + 76, 0);
        g.addColorStop(0, '#f97316');
        g.addColorStop(1, '#38bdf8');
        ctx.fillStyle = g;
        ctx.fillRect(wx, wy, 76, H * 0.52);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.strokeRect(wx, wy, 76, H * 0.52);

        ctx.strokeStyle = 'rgba(248,250,252,0.85)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            const y = wy + 28 + i * 38;
            ctx.beginPath();
            ctx.moveTo(wx - 22, y);
            ctx.lineTo(wx + 102, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(wx + 92, y - 7);
            ctx.lineTo(wx + 102, y);
            ctx.lineTo(wx + 92, y + 7);
            ctx.fill();
        }

        const bx = W * 0.34;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        for (let k = 0; k < 5; k++) {
            const oy = wy + k * 42 + Math.sin(ang + k) * 12;
            ctx.beginPath();
            ctx.moveTo(bx, oy);
            for (let x = 0; x < 160; x += 7) {
                ctx.lineTo(bx + x, oy + Math.sin(x / 22 + ang * 4 + k) * 18);
            }
            ctx.stroke();
        }
        ctx.fillStyle = 'rgba(56,189,248,0.22)';
        ctx.fillRect(bx - 10, wy + H * 0.38, W * 0.26, 22);

        const sx = W * 0.82;
        const sy = H * 0.46;
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#f97316';
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(sx, sy, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(251,191,36,0.45)';
        ctx.lineWidth = 2;
        for (let r = 42; r < 160; r += 30) {
            ctx.beginPath();
            ctx.arc(sx, sy, r + (ang * 25) % 18, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(226,232,240,0.92)';
        ctx.font = '12px system-ui,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
            key === 'cooling' ? 'Cooling circuit — jacket convection + radiator radiation losses' : 'Run-down thermal coupling — predominantly convection to ambient',
            W / 2,
            H * 0.92
        );
        ctx.textAlign = 'left';
    },

    drawHeatBalancePlant(ctx, W, H, ang, col) {
        const cx = W / 2;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = col;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(cx - 130, H * 0.32, 260, 150, 16);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx - 145, H * 0.42);
        ctx.lineTo(cx - 230, H * 0.42);
        ctx.lineTo(cx - 230, H * 0.62);
        ctx.lineTo(cx - 145, H * 0.62);
        ctx.stroke();

        ctx.fillStyle = 'rgba(56,189,248,0.28)';
        ctx.fillRect(cx - 228, H * 0.44, 82, 58);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '12px system-ui,sans-serif';
        ctx.fillText('Fuel Q_dot,in', cx, H * 0.26);
        ctx.fillText('Shaft W_dot', cx + 155, H * 0.46);
        ctx.fillText('Cooling Q_dot,out', cx - 40, H * 0.88);
        ctx.fillText('Exhaust / calorimeter Q_dot,ex', cx - 225, H * 0.28);

        ctx.fillStyle = 'rgba(148,163,184,0.95)';
        ctx.textAlign = 'center';
        ctx.fillText('Heat balance envelope — log each term in the journal', cx, H * 0.935);
        ctx.textAlign = 'left';
    },

    drawEngine(ctx, cx, cy, a, col, key) {
        const is4stroke = key === '4stroke';
        // Enhanced crank kinematics with larger scale
        const crankR = 55, rodLen = 120;
        const ckX = Math.sin(a) * crankR, ckY = Math.cos(a) * crankR;
        const pistonY = cy - (ckY + Math.sqrt(rodLen*rodLen - ckX*ckX)) + 25;
        const cylW = 95, cylX = cx - cylW/2, cylTop = cy - 170, cylBot = cy + 15;

        // Enhanced 3D isometric offset
        const d = 22;
        
        // Enhanced cylinder with gradient and better 3D
        const cylinderGradient = ctx.createLinearGradient(cylX, cylTop, cylX + cylW, cylTop);
        cylinderGradient.addColorStop(0, 'rgba(30,41,59,0.9)');
        cylinderGradient.addColorStop(0.5, 'rgba(51,65,85,0.8)');
        cylinderGradient.addColorStop(1, 'rgba(30,41,59,0.9)');
        
        // Back face with gradient
        ctx.fillStyle = cylinderGradient;
        ctx.fillRect(cylX+d, cylTop-d, cylW, cylBot-cylTop);
        
        // Enhanced side face with gradient
        const sideGradient = ctx.createLinearGradient(cylX+cylW, cylTop, cylX+cylW+d, cylTop-d);
        sideGradient.addColorStop(0, 'rgba(51,65,85,0.8)');
        sideGradient.addColorStop(1, 'rgba(71,85,105,0.7)');
        ctx.fillStyle = sideGradient;
        ctx.beginPath(); ctx.moveTo(cylX+cylW,cylTop); ctx.lineTo(cylX+cylW+d,cylTop-d); ctx.lineTo(cylX+cylW+d,cylBot-d); ctx.lineTo(cylX+cylW,cylBot); ctx.closePath(); ctx.fill();
        
        // Enhanced top face with gradient
        const topGradient = ctx.createLinearGradient(cylX, cylTop, cylX+d, cylTop-d);
        topGradient.addColorStop(0, 'rgba(71,85,105,0.9)');
        topGradient.addColorStop(1, 'rgba(100,116,139,0.8)');
        ctx.fillStyle = topGradient;
        ctx.beginPath(); ctx.moveTo(cylX,cylTop); ctx.lineTo(cylX+d,cylTop-d); ctx.lineTo(cylX+cylW+d,cylTop-d); ctx.lineTo(cylX+cylW,cylTop); ctx.closePath(); ctx.fill();

        // Enhanced gas color with better gradients
        const stroke = Math.floor(((a * 180/Math.PI) % 720) / 180);
        const gasColors = [
            'rgba(59,130,246,0.4)','rgba(16,185,129,0.5)','rgba(239,68,68,0.8)','rgba(100,116,139,0.4)'
        ];
        const gasTop = pistonY + 25;
        
        // Gas with gradient effect
        const gasGradient = ctx.createLinearGradient(cylX, gasTop, cylX + cylW, gasTop);
        gasGradient.addColorStop(0, gasColors[stroke % 4]);
        gasGradient.addColorStop(0.5, gasColors[stroke % 4].replace('0.', '0.6'));
        gasGradient.addColorStop(1, gasColors[stroke % 4]);
        ctx.fillStyle = gasGradient;
        ctx.fillRect(cylX+3, Math.min(gasTop, cylTop), cylW-6, Math.abs(cylTop - gasTop));

        // Enhanced spark flash on power stroke
        if (stroke === 2 && Math.sin(a*2) > 0.8) {
            ctx.save(); 
            ctx.shadowBlur=40; 
            ctx.shadowColor='#fbbf24';
            const sparkGradient = ctx.createRadialGradient(cx, cylTop+10, 0, cx, cylTop+10, 15);
            sparkGradient.addColorStop(0, '#fef3c7');
            sparkGradient.addColorStop(0.5, '#fbbf24');
            sparkGradient.addColorStop(1, 'rgba(251,191,36,0)');
            ctx.fillStyle=sparkGradient;
            ctx.beginPath(); ctx.arc(cx, cylTop+10, 12, 0, Math.PI*2); ctx.fill();
            ctx.restore();
        }

        // Enhanced piston 3D with gradients
        const pistonGradient = ctx.createLinearGradient(cylX+3, pistonY, cylX+cylW-3, pistonY);
        pistonGradient.addColorStop(0, '#475569');
        pistonGradient.addColorStop(0.5, '#64748b');
        pistonGradient.addColorStop(1, '#475569');
        ctx.fillStyle=pistonGradient; 
        ctx.fillRect(cylX+3, pistonY, cylW-6, 25);
        
        // Piston top face with gradient
        const pistonTopGradient = ctx.createLinearGradient(cylX+3, pistonY, cylX+3+d, pistonY-d);
        pistonTopGradient.addColorStop(0, '#64748b');
        pistonTopGradient.addColorStop(1, '#94a3b8');
        ctx.fillStyle=pistonTopGradient;
        ctx.beginPath(); ctx.moveTo(cylX+3,pistonY); ctx.lineTo(cylX+3+d,pistonY-d); ctx.lineTo(cylX+cylW-3+d,pistonY-d); ctx.lineTo(cylX+cylW-3,pistonY); ctx.closePath(); ctx.fill();

        // Enhanced connecting rod with gradient
        const rodGradient = ctx.createLinearGradient(cx, pistonY+25, cx+ckX, cy+ckY);
        rodGradient.addColorStop(0, '#94a3b8');
        rodGradient.addColorStop(0.5, '#cbd5e1');
        rodGradient.addColorStop(1, '#94a3b8');
        ctx.strokeStyle=rodGradient; 
        ctx.lineWidth=9; 
        ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(cx,pistonY+25); ctx.lineTo(cx+ckX,cy+ckY); ctx.stroke();

        // Enhanced crank circle with gradient
        const crankGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, crankR);
        crankGradient.addColorStop(0, 'rgba(148,163,184,0.5)');
        crankGradient.addColorStop(1, 'rgba(148,163,184,0.1)');
        ctx.strokeStyle=crankGradient; 
        ctx.lineWidth=2;
        ctx.beginPath(); ctx.ellipse(cx,cy,crankR,crankR*0.4,0,0,Math.PI*2); ctx.stroke();
        
        // Enhanced crank pin with gradient
        const pinGradient = ctx.createRadialGradient(cx+ckX, cy+ckY, 0, cx+ckX, cy+ckY, 9);
        pinGradient.addColorStop(0, '#f1f5f9');
        pinGradient.addColorStop(0.7, '#cbd5e1');
        pinGradient.addColorStop(1, '#94a3b8');
        ctx.fillStyle=pinGradient;
        ctx.beginPath(); ctx.ellipse(cx+ckX,cy+ckY,9,5,0,0,Math.PI*2); ctx.fill();

        // Front cylinder outline
        ctx.strokeStyle='rgba(148,163,184,0.7)'; ctx.lineWidth=2;
        ctx.strokeRect(cylX,cylTop,cylW,cylBot-cylTop);

        // Spark plug
        ctx.fillStyle='#94a3b8'; ctx.fillRect(cx-4, cylTop-16, 8, 18);
        ctx.fillStyle=getCanvasTextColor(); ctx.beginPath(); ctx.arc(cx,cylTop-16,5,0,Math.PI*2); ctx.fill();

        // Title
        ctx.fillStyle='rgba(148,163,184,0.8)'; ctx.font='12px Inter'; ctx.textAlign='center';
        ctx.fillText(is4stroke ? '4-Stroke Diesel Engine' : '2-Stroke Petrol Engine', cx, cy+60);
    },

    drawViscometer(ctx, cx, cy, a, col) {
        // Oil bath cylinder (3D)
        const bx = cx-50, bw = 100, bh = 150, by = cy - 80;
        ctx.fillStyle='rgba(30,41,59,0.9)'; ctx.fillRect(bx+12,by-12,bw,bh);
        ctx.fillStyle='rgba(51,65,85,0.8)';
        ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+12,by-12); ctx.lineTo(bx+12+bw,by-12); ctx.lineTo(bx+bw,by); ctx.closePath(); ctx.fill();
        // Oil fill (animates drop level)
        const oilH = bh - 30 + (this.active ? Math.sin(a*0.1)*5 : 0);
        const grad = ctx.createLinearGradient(0,by+bh-oilH,0,by+bh);
        grad.addColorStop(0, 'rgba(245,158,11,0.6)'); grad.addColorStop(1,'rgba(180,83,9,0.9)');
        ctx.fillStyle=grad; ctx.fillRect(bx+2,by+bh-oilH,bw-4,oilH-2);
        ctx.strokeStyle='rgba(148,163,184,0.6)'; ctx.lineWidth=2; ctx.strokeRect(bx,by,bw,bh);
        // Thermometer
        ctx.strokeStyle='#ef4444'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.moveTo(bx+bw+15, by+10); ctx.lineTo(bx+bw+15, by+bh-20); ctx.stroke();
        ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(bx+bw+15,by+bh-18,8,0,Math.PI*2); ctx.fill();
        // Flow indicator (drops)
        if (this.active) {
            const dropY = by+bh + ((a*2)%40);
            ctx.fillStyle=col; ctx.beginPath(); ctx.ellipse(cx,dropY,4,6,0,0,Math.PI*2); ctx.fill();
        }
        ctx.fillStyle='rgba(148,163,184,0.8)'; ctx.font='12px Inter'; ctx.textAlign='center';
        ctx.fillText('Viscometer Apparatus', cx, cy+90);
    },

    drawWindTunnel(ctx, cx, cy, a, col) {
        // Tunnel shape
        ctx.fillStyle='rgba(30,41,59,0.8)';
        ctx.beginPath(); ctx.moveTo(cx-150,cy-40); ctx.lineTo(cx-150,cy+40); ctx.lineTo(cx+150,cy+60); ctx.lineTo(cx+150,cy-60); ctx.closePath(); ctx.fill();
        ctx.strokeStyle=col; ctx.lineWidth=2; ctx.stroke();

        // Airfoil
        ctx.fillStyle='#94a3b8'; ctx.save(); ctx.translate(cx-20, cy);
        ctx.rotate(Math.sin(a*0.02)*0.2);
        ctx.beginPath(); ctx.ellipse(0,0,50,14,0,0,Math.PI*2); ctx.fill();
        ctx.restore();

        // Flow streamlines
        for(let i=-2;i<=2;i++) {
            const offset = (a * 2 % 60);
            const y = cy + i*20;
            ctx.strokeStyle=`rgba(56,189,248,${0.3+Math.abs(i)*0.1})`; ctx.lineWidth=1.5;
            ctx.beginPath();
            for(let x=-150;x<=150;x+=5) {
                const wave = i*5*Math.sin((x/30) + a*0.05);
                if(x===-150) ctx.moveTo(cx+x,y+wave); else ctx.lineTo(cx+x,y+wave);
            }
            ctx.stroke();
        }
        ctx.fillStyle='rgba(148,163,184,0.8)'; ctx.font='12px Inter'; ctx.textAlign='center';
        ctx.fillText('Wind Tunnel Test Rig', cx, cy+90);
    },

    drawCompressor(ctx, cx, cy, a, col) {
        // Cylinder
        ctx.fillStyle='rgba(30,41,59,0.9)';
        ctx.beginPath(); ctx.roundRect(cx-45, cy-80, 90, 100, 6); ctx.fill();
        ctx.strokeStyle=col; ctx.lineWidth=2; ctx.stroke();

        // Piston inside
        const pisY = cy - 40 + Math.sin(a * Math.PI/180) * 35;
        ctx.fillStyle='#64748b'; ctx.fillRect(cx-35, pisY, 70, 18);

        // Receiver tank (circle)
        ctx.fillStyle='rgba(30,41,59,0.9)';
        ctx.beginPath(); ctx.ellipse(cx+90, cy-10, 40, 55, 0, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle=col; ctx.lineWidth=2; ctx.stroke();

        // Pipe connecting them
        ctx.strokeStyle='#94a3b8'; ctx.lineWidth=5;
        ctx.beginPath(); ctx.moveTo(cx+45,cy-30); ctx.lineTo(cx+50,cy-30); ctx.stroke();

        // Pressure gauge animation
        const pressure = this.active ? 0.3 + Math.sin(a*0.05)*0.2 : 0.1;
        ctx.fillStyle='rgba(148,163,184,0.7)'; ctx.beginPath(); ctx.arc(cx+90,cy+50,14,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#ef4444'; ctx.save(); ctx.translate(cx+90,cy+50);
        ctx.rotate(-Math.PI/2 + pressure*Math.PI); ctx.fillRect(-1,-10,2,10); ctx.restore();

        ctx.fillStyle='rgba(148,163,184,0.8)'; ctx.font='12px Inter'; ctx.textAlign='center';
        ctx.fillText('Air Compressor Test Rig', cx, cy+90);
    },

    drawAVL(ctx, cx, cy, a, col, key) {
        // Analyzer box
        ctx.fillStyle='rgba(15,23,42,0.9)';
        ctx.beginPath(); ctx.roundRect(cx-80, cy-70, 160, 110, 10); ctx.fill();
        ctx.strokeStyle=col; ctx.lineWidth=2; ctx.stroke();

        // Screen display
        ctx.fillStyle='#020617'; ctx.beginPath(); ctx.roundRect(cx-65,cy-55,130,60,6); ctx.fill();
        ctx.strokeStyle='rgba(56,189,248,0.4)'; ctx.lineWidth=1; ctx.stroke();

        const isSmoke = key === 'avl_smoke';
        if (isSmoke) {
            // Opacity bar
            const opacity = this.active ? 0.2 + Math.sin(a*0.05)*0.15 : 0.05;
            ctx.fillStyle=`rgba(100,116,139,${opacity+0.5})`;
            ctx.fillRect(cx-55, cy-45, 110*(opacity*2), 40);
            ctx.fillStyle=col; ctx.font='10px monospace'; ctx.textAlign='left';
            ctx.fillText(`FSN: ${(opacity*10).toFixed(2)}`, cx-55, cy-10);
        } else {
            // Gas readings
            const vals = ['CO:0.12%','HC:45ppm','CO2:14.2%','O2:2.3%'];
            vals.forEach((v,i) => {
                ctx.fillStyle=this.active ? '#22c55e' : '#94a3b8';
                ctx.font='9px monospace'; ctx.textAlign='left';
                ctx.fillText(v, cx-60+(i%2)*65, cy-40+(Math.floor(i/2)*18));
            });
        }

        // Probe tube (exhaust pipe)
        ctx.strokeStyle='#475569'; ctx.lineWidth=8; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(cx, cy+40); ctx.lineTo(cx, cy+90); ctx.stroke();
        // Smoke puffs from pipe when active
        if (this.active) {
            for(let i=0;i<3;i++) {
                const puf = (a*2 + i*25) % 60;
                ctx.fillStyle=`rgba(100,116,139,${0.5 - puf/120})`;
                ctx.beginPath(); ctx.arc(cx + Math.sin(a*0.1+i)*10, cy+90+puf, 8+puf*0.3, 0, Math.PI*2); ctx.fill();
            }
        }
        ctx.fillStyle='rgba(148,163,184,0.8)'; ctx.font='12px Inter'; ctx.textAlign='center';
        ctx.fillText(isSmoke ? 'AVL Smoke Meter' : 'AVL Exhaust Gas Analyzer', cx, cy+110);
    },

    drawGenericEngine(ctx, cx, cy, a, col) {
        // Generic test rig - spinning flywheel + housing
        const exp = this.experiments[this.currentExp];

        // Housing base
        ctx.fillStyle='rgba(30,41,59,0.9)';
        ctx.beginPath(); ctx.roundRect(cx-100, cy-30, 200, 80, 8); ctx.fill();
        ctx.strokeStyle=col; ctx.lineWidth=2; ctx.stroke();

        // 3D effect top face
        ctx.fillStyle='rgba(51,65,85,0.8)';
        ctx.beginPath(); ctx.moveTo(cx-100,cy-30); ctx.lineTo(cx-85,cy-45); ctx.lineTo(cx+115,cy-45); ctx.lineTo(cx+100,cy-30); ctx.closePath(); ctx.fill();

        // Flywheel (spinning)
        ctx.save(); ctx.translate(cx-40, cy+20);
        ctx.rotate(this.active ? a * Math.PI/180 : a * 0.01 * Math.PI/180);
        for(let i=0;i<8;i++) {
            ctx.rotate(Math.PI/4);
            ctx.fillStyle='rgba(148,163,184,0.6)'; ctx.fillRect(0,-3,35,6);
        }
        ctx.restore();
        ctx.fillStyle=col; ctx.beginPath(); ctx.arc(cx-40,cy+20,14,0,Math.PI*2); ctx.fill();

        // Dynamo / load
        ctx.fillStyle='rgba(30,41,59,0.9)';
        ctx.beginPath(); ctx.roundRect(cx+20, cy-10, 60, 50, 6); ctx.fill();
        ctx.strokeStyle='#94a3b8'; ctx.lineWidth=1; ctx.stroke();
        ctx.fillStyle=this.active ? col : '#475569';
        ctx.beginPath(); ctx.arc(cx+50,cy+15,14,0,Math.PI*2); ctx.fill();

        // Coupling shaft
        ctx.strokeStyle='#94a3b8'; ctx.lineWidth=5;
        ctx.beginPath(); ctx.moveTo(cx-26,cy+20); ctx.lineTo(cx+20,cy+15); ctx.stroke();

        // Gauges
        [cx-80, cx-60].forEach((gx,i) => {
            const gy = cy-50;
            ctx.fillStyle='#1e293b'; ctx.beginPath(); ctx.arc(gx,gy,18,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle=col; ctx.lineWidth=1; ctx.stroke();
            const needle = this.active ? -Math.PI/2 + Math.sin(a*0.03+i)*Math.PI*0.4 : -Math.PI/2;
            ctx.strokeStyle='#ef4444'; ctx.lineWidth=2;
            ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+Math.cos(needle)*14,gy+Math.sin(needle)*14); ctx.stroke();
        });

        ctx.fillStyle='rgba(148,163,184,0.8)'; ctx.font='11px Inter'; ctx.textAlign='center';
        ctx.fillText(exp ? exp.title.substring(0,35) : 'Test Rig', cx, cy+75);
    }
};
