// Application logic and SPA routing

const views = {
    'home': `
        <div class="grid-2">
            <div class="card">
                <h2>Welcome to ThermoViz Dashboard</h2>
                <p>Build your intuition for thermodynamics before diving into the complex mathematics. This platform uses interactive simulations and visual feedback to help you understand the core concepts.</p>
                <p>Use the sidebar to explore topics ranging from the Zeroth Law to advanced Quantum Thermodynamics.</p>
                <button class="btn" style="margin-top:1rem;background:var(--primary)" onclick="app.navigateTo('ideal-gas')">Start with Ideal Gases</button>
            </div>
            <div class="card">
                <h2>Your Progress</h2>
                <p>Complete challenges in the simulators and the Quiz Arena to earn XP and level up your engineering rank.</p>
                <div class="glass" style="padding:1rem;margin:1rem 0;border-radius:8px;">
                    <h3 style="color:var(--accent);margin:0 0 0.5rem 0;">Rank: <span id="dash-rank">Beginner</span></h3>
                    <p style="margin:0;font-weight:bold;"><span id="dash-xp">0</span> XP</p>
                </div>
                <button class="btn" style="border:1px solid var(--accent);background:transparent;color:var(--accent)" onclick="app.navigateTo('quiz')">Enter Quiz Arena</button>
            </div>
        </div>
        <script>
            setTimeout(() => {
                const xp = parseInt(localStorage.getItem('thermoViz_XP') || '0');
                if(document.getElementById('dash-xp')) document.getElementById('dash-xp').textContent = xp;
                const rEl = document.getElementById('dash-rank');
                if(rEl){
                    if(xp>=2000) rEl.textContent='Master Engineer';
                    else if(xp>=1000) rEl.textContent='Thermo Legend';
                    else if(xp>=600) rEl.textContent='Entropy Expert';
                    else if(xp>=300) rEl.textContent='Cycle Master';
                    else if(xp>=100) rEl.textContent='Thermo Apprentice';
                    else rEl.textContent='Beginner Engineer';
                }
            }, 100);
        </script>
    `,
    'ideal-gas': `
        <div class="grid-2">
            <div class="card canvas-container" id="gas-canvas-container" style="padding: 0;">
                <canvas id="gas-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Ideal Gas Simulator</h2>
                <p>Observe how molecules interact as you change temperature and volume. Notice the relationship: PV = nRT.</p>
                
                <div class="control-group">
                    <label>Temperature (T) <span id="temp-val">300 K</span></label>
                    <input type="range" id="temp-slider" min="100" max="1000" value="300">
                </div>
                
                <div class="control-group">
                    <label>Volume (V) <span id="vol-val">100%</span></label>
                    <input type="range" id="vol-slider" min="50" max="100" value="100">
                </div>
                
                <div class="control-group">
                    <label>Number of Particles (n) <span id="particles-val">100</span></label>
                    <input type="range" id="particles-slider" min="10" max="300" value="100">
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">Pressure (P): <strong id="pressure-val" style="color:var(--primary); font-size:1.2rem;">1.00 atm</strong></p>
                </div>
            </div>
        </div>
    `,
    'virtual-lab': `
        <div id="vlab-phase-picker">
            <div class="card vlab-intro-card" style="margin-bottom: 1.5rem; border-left: 10px solid var(--primary); border-top: 6px solid rgba(59,130,246,0.35); border-right: 6px solid rgba(59,130,246,0.22); border-bottom: 6px solid rgba(59,130,246,0.22); background: linear-gradient(90deg, rgba(59, 130, 246, 0.12), transparent);">
                <h2 style="color: var(--primary);">KLE Tech — Virtual Laboratory</h2>
                <p style="color: var(--text-main); font-weight: 600;">Step 1: Pick one of <strong>17</strong> experiments below.</p>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.5rem;">Step 2 opens <strong>Simulator</strong> (pseudo‑3D rig), <strong>Lab Manual</strong>, <strong>Steam Table</strong>, and <strong>Journal / PDF export</strong> for that rig only.</p>
            </div>
            <div id="vlab-picker-grid" class="vlab-picker-grid" aria-label="Experiment picker"></div>
        </div>

        <div id="vlab-phase-workspace" style="display:none;">
            <div class="card vlab-banner-card" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;border-left:10px solid var(--accent);border-width:6px;border-style:solid;border-color:rgba(148,163,184,0.35);border-left-color:var(--accent);">
                <div>
                    <p style="margin:0;font-size:0.85rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">Selected experiment</p>
                    <h2 id="vlab-banner-title" style="margin:0.35rem 0 0;color:var(--accent);font-size:1.35rem;">—</h2>
                </div>
                <button type="button" class="btn" id="vlab-back-picker" style="background:var(--bg-dark);border:5px solid var(--accent);color:var(--accent);font-weight:700;">&#8592; Change experiment</button>
            </div>

            <div style="display:flex;gap:0.5rem;margin-bottom:1.25rem;flex-wrap:wrap;">
                <button type="button" class="btn vlab-tab-btn active" onclick="window.virtualLab.switchTab('simulator')" style="flex:1;min-width:140px;font-size:1rem;padding:1rem;border-width:5px;">&#128300; Simulator</button>
                <button type="button" class="btn vlab-tab-btn" onclick="window.virtualLab.switchTab('manual')" style="flex:1;min-width:140px;font-size:1rem;padding:1rem;background:var(--bg-dark);border-width:5px;">&#128218; Manual</button>
                <button type="button" class="btn vlab-tab-btn" onclick="window.virtualLab.switchTab('steam-table')" style="flex:1;min-width:140px;font-size:1rem;padding:1rem;background:var(--bg-dark);border-width:5px;">&#128167; Steam table</button>
                <button type="button" class="btn vlab-tab-btn" onclick="window.virtualLab.switchTab('journal')" style="flex:1;min-width:140px;font-size:1rem;padding:1rem;background:var(--bg-dark);border-width:5px;">&#128196; Journal / PDF</button>
                            </div>

            <div id="vlab-simulator-content">
                <div style="display:grid;grid-template-columns:280px 1fr;gap:1rem;">
                    <div class="card vlab-side-panel" style="max-height:920px;overflow-y:auto;padding:0.85rem;">
                        <h3 style="margin-bottom:0.75rem;color:var(--text-main);font-size:1rem;">Switch rig</h3>
                        <div id="vlab-workspace-list" style="display:flex;flex-direction:column;gap:0.45rem;">
                            <button type="button" class="btn vlab-btn active" data-exp="4stroke" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">1. Cut Section: 4-Stroke Diesel</button>
                            <button type="button" class="btn vlab-btn" data-exp="2stroke" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">2. Cut Section: 2-Stroke Petrol</button>
                            <button type="button" class="btn vlab-btn" data-exp="redwood" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">3. Redwood Viscometer</button>
                            <button type="button" class="btn vlab-btn" data-exp="saybolt" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">4. Saybolt Viscometer</button>
                            <button type="button" class="btn vlab-btn" data-exp="hsd" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">5. High Speed Diesel Rig</button>
                            <button type="button" class="btn vlab-btn" data-exp="petrol" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">6. Petrol Engine Rig</button>
                            <button type="button" class="btn vlab-btn" data-exp="cooling" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">7. Optimum Cooling Rig</button>
                            <button type="button" class="btn vlab-btn" data-exp="retardation" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">8. Retardation Rig</button>
                            <button type="button" class="btn vlab-btn" data-exp="heatbal_no_cal" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">9. Heat Balance (No Cal.)</button>
                            <button type="button" class="btn vlab-btn" data-exp="heatbal_cal" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">10. Heat Balance (With Cal.)</button>
                            <button type="button" class="btn vlab-btn" data-exp="steam" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">11. Steam Power Plant</button>
                            <button type="button" class="btn vlab-btn" data-exp="compressor" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">12. Air Compressor Rig</button>
                            <button type="button" class="btn vlab-btn" data-exp="crdi" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">13. CRDI CI Engine</button>
                            <button type="button" class="btn vlab-btn" data-exp="wind" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">14. Wind Tunnel</button>
                            <button type="button" class="btn vlab-btn" data-exp="comp_ci" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">15. Computerised CI Engine</button>
                            <button type="button" class="btn vlab-btn" data-exp="avl_smoke" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">16. AVL Smoke Meter</button>
                            <button type="button" class="btn vlab-btn" data-exp="avl_gas" style="font-size:0.95rem;padding:0.75rem 0.85rem;text-align:left;border-width:4px;min-height:44px;">17. AVL Exhaust Gas Analyzer</button>
                        </div>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:0.85rem;">
                        <div class="card vlab-summary-panel" style="padding:1rem;">
                            <h2 id="vlab-title" style="color:var(--accent);margin:0 0 0.5rem;font-size:1.35rem;">Cut Section: 4-Stroke Diesel Engine</h2>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;">
                                <div>
                                    <h4 style="color:var(--primary);margin:0 0 0.25rem;">Aim</h4>
                                    <p id="vlab-aim" style="font-size:0.9rem;margin:0;color:var(--text-muted);">Study internal components of a 4-stroke diesel engine.</p>
                                </div>
                                <div>
                                    <h4 style="color:var(--primary);margin:0 0 0.25rem;">Procedure</h4>
                                    <p id="vlab-proc" style="font-size:0.9rem;margin:0;color:var(--text-muted);">1. Power on rig. 2. Observe strokes. 3. Note timings.</p>
                                </div>
                            </div>
                            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.65rem;margin-top:1rem;">
                                <div class="glass" style="padding:0.65rem;border-radius:10px;text-align:center;border-width:4px;">
                                    <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">RPM</div>
                                    <div id="vlab-readout-rpm" style="font-size:1.25rem;font-weight:700;color:var(--accent);">0</div>
                                </div>
                                <div class="glass" style="padding:0.65rem;border-radius:10px;text-align:center;border-width:4px;">
                                    <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">Load / signal</div>
                                    <div id="vlab-readout-load" style="font-size:1.25rem;font-weight:700;color:#38bdf8;">0%</div>
                                </div>
                                <div class="glass" style="padding:0.65rem;border-radius:10px;text-align:center;border-width:4px;">
                                    <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">Hot-side T</div>
                                    <div id="vlab-readout-temp" style="font-size:1.25rem;font-weight:700;color:#f97316;">300 K</div>
                                </div>
                            </div>
                        </div>
                        <div class="card" style="padding:0;overflow:hidden;flex:1;border-width:6px;">
                            <div style="background:var(--bg-darker);padding:0.55rem 1rem;border-bottom:2px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
                                <span style="font-size:0.78rem;color:var(--text-muted);letter-spacing:0.08em;">REAL-TIME PSEUDO-3D RIG</span>
                                <span id="vlab-3d-hint" style="font-size:0.78rem;color:rgba(250,204,21,0.85);font-weight:600;">Isometric projection + depth shading</span>
                            </div>
                            <div style="position:relative;background:#010816;height:500px;">
                                <canvas id="vlab-canvas" style="width:100%;height:100%;display:block;"></canvas>
                            </div>
                        </div>
                        <div class="card vlab-controls-panel" style="padding:0.85rem;">
                            <div style="display:flex;gap:0.75rem;margin-bottom:0.75rem;flex-wrap:wrap;">
                                <button type="button" class="btn" id="vlab-start" style="background:#10b981;flex:2;min-width:120px;font-size:1rem;padding:0.85rem;border-width:5px;">Start rig</button>
                                <button type="button" class="btn" id="vlab-stop" style="background:#ef4444;flex:1;min-width:100px;font-size:1rem;padding:0.85rem;border-width:5px;">Stop</button>
                                <button type="button" class="btn" id="vlab-record" style="background:#3b82f6;flex:2;min-width:140px;font-size:1rem;padding:0.85rem;border-width:5px;">Record value → journal</button>
                            </div>
                            <div class="glass" style="padding:0.85rem;border-radius:10px;border-width:4px;">
                                <p style="margin:0;font-size:0.85rem;color:var(--text-main);font-weight:600;">Event log</p>
                                <ul id="vlab-log" style="margin:0.4rem 0 0;padding-left:1.25rem;font-size:0.85rem;color:var(--accent);max-height:96px;overflow-y:auto;">
                                    <li>Select an experiment above, then Start rig.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="vlab-manual-content" style="display:none;">
                <div class="card vlab-manual-panel" style="min-height:560px;padding:1.5rem;">
                    <h2 style="color:var(--primary);">Lab manual — <span id="vlab-manual-exp-label" style="color:var(--accent);">selected rig</span></h2>
                    <div id="manual-display-area" style="margin-top:1.5rem;line-height:1.75;">
                        <p style="color:var(--text-muted);">Open this tab after choosing an experiment.</p>
                    </div>
                </div>
            </div>

            <div id="vlab-steam-table-content" style="display:none;">
                <div class="card" style="min-height:560px;padding:1.5rem;">
                    <h2 style="color:var(--primary);">Saturation steam table</h2>
                    <p style="color:var(--text-muted);font-size:0.9rem;margin-top:0.35rem;">Use with steam plant / boiler experiments.</p>
                    <div style="overflow-x:auto;margin-top:1.25rem;">
                        <table id="steam-table-el" style="width:100%;font-size:0.95rem;"></table>
                    </div>
                </div>
            </div>

            <div id="vlab-journal-content" style="display:none;">
                <div class="card vlab-journal-panel" style="min-height:560px;padding:1.5rem;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
                        <div>
                            <h2 style="color:var(--primary);margin:0;">Observation journal</h2>
                            <p style="margin:0.35rem 0 0;color:var(--text-muted);font-size:0.9rem;">Records include the active rig name and experimental data.</p>
                        </div>
                    </div>
                    <div id="journal-entries" style="display:flex;flex-direction:column;gap:1.25rem;"></div>
                </div>
            </div>
                    </div>
    `,
    'piston': `
        <div class="grid-2">
            <div class="card canvas-container" id="piston-canvas-container" style="padding: 0;">
                <canvas id="piston-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Piston Simulator</h2>
                <p>Explore boundary work as the piston expands or compresses the gas inside the cylinder. W = int P dV.</p>
                
                <div class="control-group">
                    <label>Heat Input (Q)</label>
                    <button class="btn" id="heat-btn">Add Heat</button>
                    <button class="btn" id="cool-btn" style="background: var(--bg-dark); margin-top: 0.5rem; border: 1px solid var(--border-color);">Remove Heat</button>
                </div>
                
                <div class="control-group" style="margin-top: 1rem;">
                    <label>Work (W)</label>
                    <button class="btn" id="compress-btn" style="background: var(--accent);">Compress Gas (Do Work)</button>
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.1);">
                    <p style="margin:0;">Work Done: <strong id="work-val" style="color:var(--accent); font-size:1.2rem;">0 J</strong></p>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--primary); margin-bottom: 1rem;">Real-Life Example: Internal Combustion Engines</h3>
            <p><strong>4-Stroke Engine (e.g., Cars):</strong> Uses four distinct strokes (Intake, Compression, Power, Exhaust) to complete one thermodynamic cycle. The <strong>compression</strong> is nearly <em>adiabatic</em> (fast, no heat lost), followed by spark ignition which acts as an <em>isochoric</em> (constant volume) heat addition because the explosion is so fast the piston hasn't moved yet. The expanding gas does <em>adiabatic</em> work on the piston, creating power!</p>
            <p style="margin-top:1rem;"><strong>2-Stroke Engine (e.g., Dirt Bikes, Chainsaws):</strong> Combines Intake/Compression and Power/Exhaust into just two strokes. It has fewer moving parts and fires on every single revolution, giving it high power-to-weight ratio, but it's less thermodynamically efficient and produces more emissions.</p>
        </div>
    `,
    'pv-graph': `
        <div class="grid-2">
            <div class="card canvas-container" id="pv-canvas-container" style="background: var(--bg-dark); padding: 0;">
                <canvas id="pv-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>P-V Graph Visualizer</h2>
                <p>Visualize different thermodynamic processes on a Pressure-Volume diagram.</p>
                
                <div class="control-group">
                    <button class="btn" style="margin-bottom: 0.5rem;" onclick="window.pvGraph.drawProcess('isothermal')">Isothermal (T = const)</button>
                    <button class="btn" style="margin-bottom: 0.5rem;" onclick="window.pvGraph.drawProcess('isobaric')">Isobaric (P = const)</button>
                    <button class="btn" style="margin-bottom: 0.5rem;" onclick="window.pvGraph.drawProcess('isochoric')">Isochoric (V = const)</button>
                    <button class="btn" style="background: var(--accent);" onclick="window.pvGraph.drawProcess('adiabatic')">Adiabatic (Q = 0)</button>
                </div>
            </div>
        </div>
        
        <div class="grid-2" style="margin-top: 2rem;">
            <div class="card">
                <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Isobaric & Isochoric Processes</h3>
                <p><strong>Isobaric (Constant Pressure):</strong> The volume changes while pressure remains constant. The graph is a horizontal line.<br>
                <em style="color: var(--text-muted);">Real-life example:</em> Heating water in an open pot. The steam expands at constant atmospheric pressure.</p>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 1rem 0;">
                <p><strong>Isochoric (Constant Volume):</strong> The pressure changes while volume remains constant. The graph is a vertical line. No boundary work is done.<br>
                <em style="color: var(--text-muted);">Real-life example:</em> Heating gas in a rigid, sealed metal tank.</p>
            </div>
            <div class="card">
                <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Isothermal & Adiabatic Processes</h3>
                <p><strong>Isothermal (Constant Temperature):</strong> The gas expands/compresses slowly so temperature doesn't change. The graph is a hyperbola (P ~ 1/V).<br>
                <em style="color: var(--text-muted);">Real-life example:</em> Extremely slow compression of air in a pump allowing heat to escape.</p>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 1rem 0;">
                <p><strong>Adiabatic (Zero Heat Transfer):</strong> The gas expands/compresses so quickly (or is so well insulated) that no heat enters or leaves (Q=0). The graph drops steeper than isothermal.<br>
                <em style="color: var(--text-muted);">Real-life example:</em> The rapid compression stroke in a diesel engine cylinder.</p>
            </div>
        </div>
    `,
    'fundamentals': `
        <div class="grid-2">
            <div class="card controls-panel">
                <h2 style="color: var(--primary); margin-bottom: 1rem;">System & Surroundings</h2>
                <p>Observe how different boundary types affect the transfer of mass and energy between a system and its surroundings.</p>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px; text-align: center;">
                    <p style="margin:0; font-size: 1.1rem;">Current State: <strong id="sys-type-val" style="color:var(--accent);">OPEN SYSTEM</strong></p>
                </div>
                
                <div style="margin-top: 1.5rem;">
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">System Boundaries:</h3>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <button class="btn" id="toggle-sys-lid" style="background: var(--bg-dark); flex: 1;">Lid: OPEN</button>
                        <button class="btn" id="toggle-sys-insulation" style="background: var(--bg-dark); flex: 1;">Walls: CONDUCTING</button>
                    </div>
                </div>
                
                <div style="margin-top: 1.5rem;">
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">Surroundings Actions:</h3>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <button class="btn" id="sys-add-heat" style="background: #ef4444; flex: 1;">Apply Heat</button>
                        <button class="btn" id="sys-add-mass" style="background: #3b82f6; flex: 1;">Add Mass</button>
                    </div>
                </div>
            </div>
            
            <div class="card canvas-container" id="system-canvas-container" style="height: 400px; padding: 0; background: var(--bg-darker);">
                <canvas id="system-canvas"></canvas>
            </div>
            
            
            <div class="card controls-panel">
                <h2 style="color: var(--primary); margin-bottom: 1rem;">Zeroth Law of Thermodynamics</h2>
                <p>If body A is in thermal equilibrium with body B, and body B is in thermal equilibrium with body C separately, then body A and body C must be in thermal equilibrium with each other.</p>
                
                <h3 style="margin-top: 1.5rem; font-size: 1rem;">Wall Types:</h3>
                <p><strong style="color:#ef4444;">Diathermic:</strong> Allows heat transfer.</p>
                <p><strong style="color:#64748b;">Adiabatic:</strong> Prevents heat transfer.</p>
                
                <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem;">
                    <button class="btn" id="toggle-wall-AB" style="background: var(--bg-dark); flex: 1; padding: 0.5rem; font-size: 0.9rem;">Wall AB: Adiabatic</button>
                    <button class="btn" id="toggle-wall-BC" style="background: var(--bg-dark); flex: 1; padding: 0.5rem; font-size: 0.9rem;">Wall BC: Adiabatic</button>
                    <button class="btn" id="toggle-wall-AC" style="background: var(--bg-dark); flex: 1; padding: 0.5rem; font-size: 0.9rem;">Wall AC: Adiabatic</button>
                </div>

                <div style="margin-top: 1.5rem;">
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">Initial Temperatures:</h3>
                    <div style="display: flex; gap: 1rem; margin-bottom: 0.5rem;">
                        <div style="flex: 1;">
                            <label style="font-size: 0.8rem;">Block A: <span id="temp-a-val">400</span>K</label>
                            <input type="range" id="slider-temp-a" min="100" max="600" value="400" style="width: 100%;">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 0.8rem;">Block B: <span id="temp-b-val">300</span>K</label>
                            <input type="range" id="slider-temp-b" min="100" max="600" value="300" style="width: 100%;">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 0.8rem;">Block C: <span id="temp-c-val">350</span>K</label>
                            <input type="range" id="slider-temp-c" min="100" max="600" value="350" style="width: 100%;">
                        </div>
                    </div>
                    <button class="btn" id="reset-zeroth-btn" style="width: 100%; background: var(--bg-darker); border: 1px solid var(--border-color); padding: 0.5rem; margin-top: 0.5rem;">Reset Simulation</button>
                </div>
            </div>
            
            <div class="card canvas-container" id="zeroth-canvas-container" style="height: 400px; padding: 0;">
                <canvas id="zeroth-canvas"></canvas>
            </div>
            <div class="card canvas-container" id="zeroth-graph-container" style="height: 400px; padding: 0; background: var(--bg-dark);">
                <canvas id="zeroth-graph-canvas"></canvas>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--primary); margin-bottom: 1rem;">Real-Life Examples of the Zeroth Law</h3>
            <div class="grid-2">
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid var(--accent);">
                    <h4 style="color:var(--accent);">1. Medical Thermometers</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">The thermometer reaches equilibrium with your mouth. Since the mercury is in equilibrium with the glass, and the glass with your mouth, we know your exact body temperature.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid var(--accent);">
                    <h4 style="color:var(--accent);">2. Ice in a Drink</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">When you drop ice into warm water, heat transfers until the ice, the water, and the glass all reach the exact same thermal equilibrium temperature.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid var(--accent);">
                    <h4 style="color:var(--accent);">3. Refrigerator Storage</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">All the different foods placed inside a refrigerator eventually cool down to match the internal air temperature, establishing thermal equilibrium.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid var(--accent);">
                    <h4 style="color:var(--accent);">4. Climate Control</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">Your home's thermostat works by reaching equilibrium with the room's air. Once equilibrium is achieved, it triggers the HVAC system if it's too hot or cold.</p>
                </div>
            </div>
        </div>
    `,
    'quiz': `
        <div class="card" style="max-width: 600px; margin: 0 auto;">
            <h2 style="text-align:center; color: var(--primary);">Thermodynamics Arena</h2>
            <p style="text-align:center; margin-bottom: 2rem;">Test your knowledge to earn XP and increase your rank!</p>
            <div id="quiz-container">
                <div id="question-text" style="font-size: 1.2rem; margin-bottom: 1.5rem; font-weight: 500;">Loading...</div>
                <div id="options-container" style="display: flex; flex-direction: column; gap: 1rem;">
                    <!-- Options injected here -->
                </div>
                <div id="quiz-feedback" style="margin-top: 1.5rem; font-weight: bold; text-align: center; min-height: 24px;"></div>
            </div>
        </div>
    `,
    'first-law': `
        <div class="grid-2">
            <div class="card canvas-container" id="firstlaw-canvas-container" style="padding: 0;">
                <canvas id="firstlaw-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>First Law & Turbines</h2>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Concept Definition</h3>
                    <p style="font-size: 0.9rem;"><strong>First Law of Thermodynamics:</strong> Energy cannot be created or destroyed, only transformed. In a control volume like a turbine, enthalpy is converted into boundary work.</p>
                </div>
                
                <div class="control-group">
                    <label>Steam Inlet Pressure (P)</label>
                    <input type="range" id="steam-p-slider" min="1" max="10" value="5">
                </div>
                <div class="control-group">
                    <label>Steam Temperature (T)</label>
                    <input type="range" id="steam-t-slider" min="300" max="600" value="450">
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">Power Output (W): <strong id="turbine-power-val" style="color:var(--accent); font-size:1.2rem;">0 MW</strong></p>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--primary); margin-bottom: 1rem;">Real-Life Examples of the First Law</h3>
            <div class="grid-2">
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <h4 style="color:#3b82f6;">1. Gas Turbine / Jet Engine</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">Air is compressed (work in), fuel is burned (heat in), and the hot gas expands through a turbine (work out) producing thrust. Energy is conserved perfectly.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <h4 style="color:#3b82f6;">2. Human Metabolism</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">We consume chemical energy (food). Our bodies convert this into boundary work (moving our muscles) and waste heat (sweating). Delta U = Q - W.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <h4 style="color:#3b82f6;">3. Electric Lightbulbs</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">Electrical work enters the filament and is 100% conserved by being converted into radiant light energy and thermal heat energy dissipation.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <h4 style="color:#3b82f6;">4. Hand Pumps</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">When you manually pump a bicycle tire, you input mechanical work. This increases the internal energy of the air, causing the pump cylinder to become hot to the touch.</p>
                </div>
            </div>
        </div>
    `,
    'second-law': `
        <div class="grid-2">
            <div class="card canvas-container" id="secondlaw-canvas-container" style="padding: 0;">
                <canvas id="secondlaw-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Second Law & Entropy</h2>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Concept Definition</h3>
                    <p style="font-size: 0.9rem;"><strong>Second Law of Thermodynamics:</strong> The total entropy (disorder) of an isolated system always increases. Heat flows naturally from hot to cold, generating entropy.</p>
                </div>
                
                <div class="control-group">
                    <label>Open Partition (Allow Mixing)</label>
                    <button class="btn" id="mix-btn" style="background: var(--accent);">Remove Partition</button>
                    <button class="btn" id="reset-entropy-btn" style="background: var(--bg-dark); margin-top: 0.5rem; border: 1px solid var(--border-color);">Reset</button>
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">Entropy Generated (S): <strong id="entropy-val" style="color:#ef4444; font-size:1.2rem;">0 J/K</strong></p>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--primary); margin-bottom: 1rem;">Real-Life Examples of the Second Law</h3>
            <div class="grid-2">
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <h4 style="color:#ef4444;">1. Coffee Cooling Down</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">A hot cup of coffee inevitably cools to room temperature. Heat naturally flows from hot to cold, increasing the total entropy of the universe. It never spontaneously heats back up!</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <h4 style="color:#ef4444;">2. Engine Waste Heat</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">No car engine can be 100% efficient (Kelvin-Planck statement). Some energy must always be rejected to a cold sink (the radiator) as waste heat.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <h4 style="color:#ef4444;">3. Unscrambling an Egg</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">Breaking and scrambling an egg is a highly irreversible process. The entropy (disorder) skyrockets, and it is impossible to reverse it back to a pristine egg.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <h4 style="color:#ef4444;">4. Perfume in a Room</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">Opening a bottle of perfume causes the molecules to spontaneously diffuse and fill the entire room, maximizing their microscopic disorder (entropy).</p>
                </div>
            </div>
        </div>
    `,
    'carnot': `
        <div class="grid-2">
            <div class="card canvas-container" id="carnot-canvas-container" style="padding: 0;">
                <canvas id="carnot-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Carnot Cycle</h2>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Concept Definition</h3>
                    <p style="font-size: 0.9rem;"><strong>Carnot Engine:</strong> An idealized theoretical engine that operates on the Carnot cycle. It sets the absolute maximum possible efficiency for any heat engine operating between two temperatures.</p>
                </div>
                
                <div class="control-group">
                    <label>Hot Reservoir Temp (Th)</label>
                    <input type="range" id="th-slider" min="500" max="1500" value="1000">
                </div>
                <div class="control-group">
                    <label>Cold Reservoir Temp (Tc)</label>
                    <input type="range" id="tc-slider" min="200" max="400" value="300">
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">Max Efficiency: <strong id="carnot-eff-val" style="color:#4ade80; font-size:1.2rem;">70.0%</strong></p>
                </div>
            </div>
        </div>
        
        <div class="grid-2" style="margin-top: 2rem;">
            <div class="card">
                <h3 style="color: var(--accent); margin-bottom: 1rem;">Real-Life Application</h3>
                <p>While no real engine can be a Carnot engine, engineers use the Carnot efficiency to evaluate how close a real engine (like a car engine or power plant) is to its theoretical limit. If a real engine operates at 35% and its Carnot limit is 70%, its "Second Law efficiency" is 50%.</p>
            </div>
        </div>
    `,
    'rankine': `
        <div class="grid-2">
            <div class="card canvas-container" id="rankine-canvas-container" style="padding: 0; background: var(--bg-dark);">
                <canvas id="rankine-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Rankine Cycle Flow</h2>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Concept Definition</h3>
                    <p style="font-size: 0.9rem;"><strong>Rankine Cycle:</strong> The fundamental operating cycle of thermal power plants. Water is pumped, boiled into steam, expanded through a turbine to generate electricity, and condensed back into liquid.</p>
                </div>
                
                <div class="control-group">
                    <button class="btn" id="start-plant-btn" style="background: var(--accent);">Start Power Plant</button>
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">System State: <strong id="plant-state" style="color:var(--text-muted); font-size:1.2rem;">Offline</strong></p>
                </div>
            </div>
        </div>
        
        <div class="grid-2" style="margin-top: 2rem;">
            <div class="card" style="grid-column: span 2;">
                <h3 style="color: var(--accent); margin-bottom: 1rem;">Real-Life Example: Coal/Nuclear Plants</h3>
                <p>The vast majority of the world's electricity is generated using the Rankine cycle. Nuclear power plants, coal plants, and natural gas combined-cycle plants all use this exact loop to boil water and spin massive turbines.</p>
            </div>
        </div>
    `,
    'isobaric-lab': `
        <div class="grid-2">
            <div class="card canvas-container" id="virtuallab-canvas-container" style="padding: 0;">
                <canvas id="virtuallab-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Virtual Lab: Constant Pressure Heating</h2>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Concept Definition</h3>
                    <p style="font-size: 0.9rem;"><strong>Isobaric Heating:</strong> Adding heat to a gas at constant pressure causes its volume and temperature to increase proportionally (Charles's Law).</p>
                </div>
                
                <div class="control-group">
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" id="start-lab-btn" style="background: var(--accent); flex: 1;">Start Heating</button>
                        <button class="btn" id="stop-lab-btn" style="background: #b91c1c; flex: 1; display: none;">Stop Heating</button>
                    </div>
                    <button class="btn" id="record-data-btn" style="background: var(--bg-dark); margin-top: 0.5rem; border: 1px solid var(--border-color); width: 100%;" disabled>Record Data Point</button>
                    <button class="btn" id="reset-lab-btn" style="background: var(--bg-dark); margin-top: 0.5rem; width: 100%;">Reset Lab</button>
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">Time: <strong id="lab-time" style="color:var(--text-main);">0s</strong></p>
                    <p style="margin:0;">Temp: <strong id="lab-temp" style="color:#ef4444;">300 K</strong></p>
                    <p style="margin:0;">Volume: <strong id="lab-vol" style="color:#3b82f6;">1.0 L</strong></p>
                </div>
                
                <div style="margin-top: 2rem;">
                    <h3 style="color: var(--accent); margin-bottom: 0.5rem; font-size: 1.1rem;">Standard Lab Procedure</h3>
                    <ol style="margin-left: 1.2rem; line-height: 1.6; font-size: 0.9rem; color: var(--text-muted);">
                        <li><strong>Aim:</strong> Verify Charles's Law via isobaric heating.</li>
                        <li><strong>Apparatus:</strong> Piston-cylinder device, heat source, thermometer.</li>
                        <li><strong>Formula:</strong> V&#8321;/T&#8321; = V&#8322;/T&#8322;</li>
                        <li><strong>Procedure:</strong> Apply heat, record temp and volume every 5 seconds.</li>
                        <li><strong>Observation:</strong> Note the linear expansion in the Data Table.</li>
                    </ol>
                    <h4 style="margin-top: 1rem; color: #ef4444; font-size: 0.95rem;">Viva Questions to Prepare:</h4>
                    <ul style="margin-left: 1.2rem; line-height: 1.6; font-size: 0.85rem; color: var(--text-muted);">
                        <li>Why must pressure remain strictly constant?</li>
                        <li>What happens to the gas molecules internally as temperature rises?</li>
                    </ul>
                    <button class="btn" style="margin-top: 1.5rem; width: 100%; background: var(--bg-darker); border: 1px solid var(--primary);" onclick="alert('PDF Generation integration required. This will download a structured lab manual.')">Download Lab Manual (PDF)</button>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 1rem;">Data Table</h3>
            <table style="width: 100%; text-align: left; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <th style="padding: 0.5rem;">Time (s)</th>
                        <th style="padding: 0.5rem;">Temperature (K)</th>
                        <th style="padding: 0.5rem;">Volume (L)</th>
                    </tr>
                </thead>
                <tbody id="lab-data-table">
                    <!-- Data rows injected here -->
                </tbody>
            </table>
        </div>
    `,
    'hvac': `
        <div class="card" style="padding:0;overflow:hidden;margin-bottom:1rem;">
            <div style="background:var(--bg-darker);padding:1rem 1.5rem;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
                <div>
                    <h2 style="margin:0;color:var(--primary);">3D Vapor-Compression Refrigeration Cycle</h2>
                    <p style="margin:0.25rem 0 0;font-size:0.85rem;color:var(--text-muted);">HVAC &amp; Refrigeration -- Real-time isometric simulation</p>
                </div>
                <div style="display:flex;align-items:center;gap:0.75rem;">
                    <label style="color:var(--text-muted);font-size:0.9rem;">Cooling Target:</label>
                    <strong id="hvac-temp-val" style="color:#38bdf8;font-size:1.1rem;min-width:55px;">4 deg C</strong>
                    <input type="range" id="hvac-temp-slider" min="-20" max="15" value="4" style="width:160px;">
                </div>
            </div>
            <div id="hvac-canvas-container" style="width:100%;height:560px;background:#0f172a;position:relative;">
                <canvas id="hvac-canvas" style="width:100%;height:100%;display:block;"></canvas>
            </div>
        </div>
        <div class="grid-2">
            <div class="card" style="border-left:4px solid #a855f7;">
                <h3 style="color:#a855f7;margin-bottom:0.5rem;">Cycle Performance</h3>
                <div style="display:flex;gap:1rem;">
                    <div class="glass" style="flex:1;padding:0.75rem;border-radius:8px;text-align:center;">
                        <p style="margin:0;font-size:0.8rem;color:var(--text-muted);">Compressor Power</p>
                        <p id="hvac-power-val" style="margin:0;font-size:1.3rem;font-weight:bold;color:#ef4444;">150 W</p>
                    </div>
                    <div class="glass" style="flex:1;padding:0.75rem;border-radius:8px;text-align:center;">
                        <p style="margin:0;font-size:0.8rem;color:var(--text-muted);">COP (Cooling)</p>
                        <p id="hvac-cop-val" style="margin:0;font-size:1.3rem;font-weight:bold;color:#4ade80;">3.5</p>
                    </div>
                </div>
            </div>
            <div class="card" style="border-left:4px solid #38bdf8;">
                <h3 style="color:#38bdf8;margin-bottom:0.5rem;">How It Works</h3>
                <p style="font-size:0.9rem;color:var(--text-muted);">The vapor-compression cycle moves heat from cold to hot using work input. <strong style="color:white;">Evaporator</strong> absorbs heat -> <strong style="color:#d8b4fe;">Compressor</strong> raises pressure -> <strong style="color:#fca5a5;">Condenser</strong> rejects heat -> <strong style="color:#fde68a;">Expansion valve</strong> drops pressure. COP = Tc/(Th-Tc)</p>
            </div>
        </div>
    `,
    'combustion': `
        <div class="grid-2">
            <div class="card canvas-container" id="combustion-canvas-container" style="padding: 0; background: var(--bg-dark);">
                <canvas id="combustion-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Combustion Thermodynamics</h2>
                <p>Combustion is an exothermic chemical reaction where a fuel reacts with an oxidant (air), breaking chemical bonds and releasing massive amounts of thermal energy.</p>
                
                <div class="control-group" style="margin-top: 1rem;">
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" id="ignite-btn" style="background: #ef4444; flex: 1;">IGNITE</button>
                        <button class="btn" id="stop-comb-btn" style="background: #b91c1c; flex: 1; display: none;">STOP</button>
                    </div>
                    <button class="btn" id="reset-comb-btn" style="background: var(--bg-dark); width: 100%; margin-top: 0.5rem;">Reset Chamber</button>
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">Energy Released: <strong id="comb-energy" style="color:#ef4444;">0 MJ/kg</strong></p>
                    <p style="margin:0;">Exhaust Temp: <strong id="comb-temp" style="color:#f97316;">300 K</strong></p>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Real-Life Example: Car Engine</h3>
            <p>Inside an internal combustion engine, gasoline vapor and air are mixed. A spark plug ignites the mixture, causing a rapid exothermic reaction. The massive release of heat causes the gases to expand rapidly, pushing the piston down to turn the wheels.</p>
        </div>
    `,
    'maxwell': `
        <div class="card" style="padding:0;overflow:hidden;margin-bottom:1rem;">
            <div style="background:var(--bg-darker);padding:1rem 1.5rem;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
                <h2 style="margin:0;color:var(--primary);">Maxwell-Boltzmann Distribution Simulator</h2>
                <div style="display:flex;align-items:center;gap:0.75rem;">
                    <label style="color:var(--text-muted);font-size:0.9rem;">Temperature:</label>
                    <strong id="maxwell-temp-val" style="color:#ef4444;font-size:1.1rem;min-width:65px;">300 K</strong>
                    <input type="range" id="maxwell-temp-slider" min="100" max="1000" value="300" style="width:180px;">
                </div>
            </div>
            <div id="maxwell-canvas-container" style="width:100%;height:520px;background:#020617;position:relative;">
                <canvas id="maxwell-canvas" style="width:100%;height:100%;display:block;"></canvas>
            </div>
        </div>
        <div class="grid-2">
            <div class="card" style="border-left:4px solid #ef4444;">
                <h3 style="color:#ef4444;margin-bottom:0.5rem;">Key Statistical Speeds</h3>
                <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2.2;">
                    <li><strong style="color:#ef4444;">Most Probable (v_p):</strong> sqrt(2RT/M)</li>
                    <li><strong style="color:#fbbf24;">Average Speed:</strong> sqrt(8RT/piM)</li>
                    <li><strong style="color:#4ade80;">RMS Speed:</strong> sqrt(3RT/M)</li>
                </ul>
            </div>
            <div class="card" style="border-left:4px solid var(--primary);">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Effect of Temperature</h3>
                <p style="font-size:0.9rem;color:var(--text-muted);">As T increases: distribution flattens and broadens, peak shifts right. Drag the slider to watch live!</p>
            </div>
        </div>
    `,
    'phase-change': `
        <div class="grid-2">
            <div class="card canvas-container" id="phase-canvas-container" style="padding: 0; background: var(--bg-dark);">
                <canvas id="phase-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Phase Change & Triple Point</h2>
                <p>A substance's phase (Solid, Liquid, Gas) depends on both Temperature and Pressure. The Triple Point is the exact condition where all three phases coexist in equilibrium.</p>
                
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Temperature: <strong id="phase-temp-val" style="color: #ef4444;">273.16 K</strong></p>
                    <input type="range" id="phase-temp-slider" min="200" max="400" value="273.16" step="0.01" style="width:100%; margin-top:0.5rem;">
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Pressure: <strong id="phase-pres-val" style="color: #3b82f6;">0.006 atm</strong></p>
                    <input type="range" id="phase-pres-slider" min="0.001" max="2" step="0.001" value="0.006" style="width:100%; margin-top:0.5rem;">
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0; font-size: 1.2rem;">Phase: <strong id="phase-state-val" style="color:#4ade80;">Triple Point</strong></p>
                </div>
            </div>
        </div>
    `,
    'chem-beginner': `
        <div class="grid-2">
            <div class="card canvas-container" id="chem1-canvas-container" style="padding: 0; background: var(--bg-dark);">
                <canvas id="chem1-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Calorimetry & Enthalpy</h2>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Concept Definition</h3>
                    <p style="font-size: 0.9rem;"><strong>Enthalpy (Delta H):</strong> The total heat content of a system. Exothermic reactions (Delta H < 0) release heat to the surroundings, while Endothermic reactions (Delta H > 0) absorb heat from the surroundings.</p>
                </div>
                
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Reaction Type:</p>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                        <button class="btn" id="rxn-exo" style="flex:1; background: var(--accent);">Exothermic</button>
                        <button class="btn" id="rxn-endo" style="flex:1; background: var(--bg-dark);">Endothermic</button>
                    </div>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Water Temp: <strong id="chem1-temp-val" style="color:#ef4444;">298 K</strong></p>
                    <button class="btn" id="rxn-start" style="width:100%; margin-top: 0.5rem; background: var(--primary);">Drop Reactants</button>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Real-Life Example: Hot & Cold Packs</h3>
            <p><strong>Instant Cold Packs (Endothermic):</strong> Contain water and ammonium nitrate. When squeezed, the barrier breaks, they mix, and the reaction absorbs massive amounts of heat from your skin, making it feel cold.</p>
            <p><strong>Hand Warmers (Exothermic):</strong> Contain iron powder. When opened, the iron reacts with oxygen in the air (oxidation/rusting), releasing heat into your hands.</p>
        </div>
    `,
    'chem-intermediate': `
        <div class="grid-2">
            <div class="card canvas-container" id="chem2-canvas-container" style="padding: 0; background: var(--bg-dark);">
                <canvas id="chem2-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Chemical Equilibrium</h2>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Concept Definition</h3>
                    <p style="font-size: 0.9rem;"><strong>Le Chatelier's Principle:</strong> If a stress (change in pressure, temperature, or concentration) is applied to a system at equilibrium, the system will shift to counteract that stress.</p>
                </div>
                
                <p>Simulating: <strong>N2 + 3H2 <=> 2NH3 + Heat (Exothermic)</strong></p>
                
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Stress the System:</p>
                    <button class="btn" id="eq-add-n2" style="width:100%; margin-top:0.5rem; background:var(--bg-dark);">Add N2 (Reactant)</button>
                    <button class="btn" id="eq-inc-pres" style="width:100%; margin-top:0.5rem; background:var(--bg-dark);">Increase Pressure</button>
                    <button class="btn" id="eq-inc-temp" style="width:100%; margin-top:0.5rem; background:var(--bg-dark);">Increase Temp</button>
                </div>
                <p id="eq-feedback" style="margin-top: 1rem; color: var(--accent); font-weight: bold; min-height: 20px;"></p>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Real-Life Example: The Haber Process</h3>
            <p>To industrially manufacture ammonia (NH3) for fertilizer, engineers use Le Chatelier's principle. Because 4 moles of gas react to form 2 moles, they use <strong>extremely high pressures</strong> to force the equilibrium to the right. Because the reaction is exothermic, they'd prefer low temperatures, but a catalyst requires high temperatures to work, so they compromise at ~450deg C.</p>
        </div>
    `,
    'chem-advanced': `
        <div class="grid-2">
            <div class="card canvas-container" id="chem3-canvas-container" style="padding: 0; background: var(--bg-dark);">
                <canvas id="chem3-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Gibbs Free Energy (Delta G)</h2>
                
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Concept Definition</h3>
                    <p style="font-size: 0.9rem;"><strong>Spontaneity:</strong> A reaction is spontaneous (occurs naturally) only if Delta G < 0. It is a balance between Enthalpy and Entropy: <br><strong style="font-size:1.1rem; color:var(--text-main);">Delta G = Delta H - T*Delta S</strong></p>
                </div>
                
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Enthalpy (Delta H): <strong id="chem3-h-val" style="color:#ef4444;">-50 kJ/mol</strong></p>
                    <input type="range" id="chem3-h-slider" min="-100" max="100" value="-50" style="width:100%; margin-top:0.5rem;">
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Entropy (Delta S): <strong id="chem3-s-val" style="color:#4ade80;">100 J/mol*K</strong></p>
                    <input type="range" id="chem3-s-slider" min="-200" max="200" value="100" style="width:100%; margin-top:0.5rem;">
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Temp (T): <strong id="chem3-t-val" style="color:#fbbf24;">300 K</strong></p>
                    <input type="range" id="chem3-t-slider" min="10" max="1000" value="300" style="width:100%; margin-top:0.5rem;">
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align:center;">
                    <h3 style="margin:0;">Delta G = <span id="chem3-g-val">-80 kJ/mol</span></h3>
                    <p id="chem3-spont" style="color:#4ade80; font-weight:bold; font-size:1.2rem; margin-top:0.5rem;">SPONTANEOUS</p>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Real-Life Example: Rusting vs. Photosynthesis</h3>
            <p><strong>Rusting (Spontaneous):</strong> Iron reacting with oxygen is exothermic (Delta H < 0) and highly spontaneous (Delta G < 0). It will happen naturally, even if it's very slow.</p>
            <p><strong>Photosynthesis (Non-Spontaneous):</strong> Plants converting CO2 and water into sugar has a positive Delta G > 0. It cannot happen on its own; it requires constant energy input from the sun to force the reaction to occur.</p>
        </div>
    `,
    'adv-classical': `
        <div style="margin-bottom:1.5rem;" class="card" style="padding:1rem;">
            <h2 style="color:var(--primary);margin-bottom:0.5rem;">Advanced Topics</h2>
            <p style="color:var(--text-muted);font-size:0.9rem;">University-level thermodynamics - interactive simulations, mathematical derivations, and real-world engineering applications.</p>
        </div>
        <div class="grid-2">
            <div class="card canvas-container" id="adv-classical-container" style="height:420px;padding:0;">
                <canvas id="adv-classical-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Classical Thermodynamics</h2>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
                    <p style="font-size:0.9rem;">Classical thermodynamics describes macroscopic systems through state variables (P,V,T,S). The four fundamental processes - isothermal, isobaric, isochoric, adiabatic - define how systems exchange energy.</p>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
                    <button class="btn" id="classical-isothermal" style="flex:1;background:#3b82f6;">Isothermal</button>
                    <button class="btn" id="classical-isobaric" style="flex:1;background:#10b981;">Isobaric</button>
                    <button class="btn" id="classical-isochoric" style="flex:1;background:#f59e0b;">Isochoric</button>
                    <button class="btn" id="classical-adiabatic" style="flex:1;background:#ef4444;">Adiabatic</button>
                </div>
                <div class="control-group">
                    <label>Temperature (T) <span id="classical-temp-val">400 K</span></label>
                    <input type="range" id="classical-temp" min="200" max="800" value="400">
                </div>
                <div style="display:flex;gap:0.5rem;margin-top:1rem;">
                    <button class="btn" id="classical-run" style="flex:1;background:var(--accent);">Animate Process</button>
                    <button class="btn" id="classical-reset" style="flex:1;background:var(--bg-dark);border:1px solid var(--border-color);">Reset</button>
                </div>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
                    <p style="margin:0;">Process: <strong id="classical-proc-label" style="font-size:1.1rem;">ISOTHERMAL</strong></p>
                    <p style="margin:0;">Work Done: <strong id="classical-work" style="color:var(--accent);">0 J</strong></p>
                </div>
            </div>
        </div>
        <div class="grid-2" style="margin-top:2rem;">
            <div class="card">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life Example: Steam Turbines</h3>
                <p>Modern steam turbines operate using near-adiabatic expansion. High-pressure steam at ~500deg C enters a turbine and expands rapidly, converting enthalpy to shaft work. The Rankine cycle uses a combination of isobaric (boiler/condenser) and near-adiabatic (turbine/pump) processes - a direct application of classical therodynamics.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Virtual Lab: PV Work Calculator</h3>
                <p>Select a process and animate it on the PV diagram. The area under the curve <strong>= Work done W = int P dV</strong>.</p>
                <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:1.9;">
                    <li><strong style="color:#3b82f6;">Isothermal:</strong> W = nRT ln(V2/V1)</li>
                    <li><strong style="color:#10b981;">Isobaric:</strong> W = P(V2-V1)</li>
                    <li><strong style="color:#f59e0b;">Isochoric:</strong> W = 0 (no volume change)</li>
                    <li><strong style="color:#ef4444;">Adiabatic:</strong> W = (P1V1-P2V2)/(gamma-1)</li>
                </ul>
            </div>
        </div>
    `,
    'adv-potentials': `
        <div class="grid-2">
            <div class="card canvas-container" id="potentials-container" style="height:420px;padding:0;">
                <canvas id="potentials-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Thermodynamic Potentials</h2>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
                    <p style="font-size:0.9rem;">The four thermodynamic potentials (U, H, F, G) are state functions that minimise at equilibrium under different constraints. Each is a Legendre transform of the others.</p>
                </div>
                <div class="control-group"><label>Temperature T <span id="potentials-T-val">300</span> K</label><input type="range" id="potentials-T" min="100" max="1000" value="300"></div>
                <div class="control-group"><label>Entropy S <span id="potentials-S-val">50</span> J/K</label><input type="range" id="potentials-S" min="1" max="200" value="50"></div>
                <div class="control-group"><label>Pressure P <span id="potentials-P-val">100</span> kPa</label><input type="range" id="potentials-P" min="10" max="1000" value="100"></div>
                <div class="control-group"><label>Volume V <span id="potentials-V-val">0.5</span> m^3</label><input type="range" id="potentials-V" min="0.01" max="2" step="0.01" value="0.5"></div>
            </div>
        </div>
        <div class="grid-2" style="margin-top:2rem;">
            <div class="card">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life Example: Fuel Cells</h3>
                <p>A hydrogen fuel cell runs at constant T and P - the maximum electrical work it can produce equals <strong>-Delta G</strong> (Gibbs free energy change). Engineers use G to optimise fuel cell design. Similarly, Delta H tells us the total heat released in a combustion reaction.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Legendre Transform Relations</h3>
                <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
                    <li><strong style="color:#ef4444;">U</strong> = Internal Energy -> natural vars: S, V</li>
                    <li><strong style="color:#f59e0b;">H = U + PV</strong> -> natural vars: S, P</li>
                    <li><strong style="color:#3b82f6;">F = U - TS</strong> -> natural vars: T, V (Helmholtz)</li>
                    <li><strong style="color:#10b981;">G = H - TS</strong> -> natural vars: T, P (Gibbs)</li>
                </ul>
            </div>
        </div>
    `,
    'adv-maxwell-rel': `
        <div class="grid-2">
            <div class="card canvas-container" id="maxwell-rel-container" style="height:420px;padding:0;">
                <canvas id="maxwell-rel-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Maxwell Relations</h2>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
                    <p style="font-size:0.9rem;">Maxwell relations are equality of mixed second partial derivatives of thermodynamic potentials. They let you relate unmeasurable quantities (like entropy change with volume) to measurable ones (like pressure change with temperature).</p>
                </div>
                <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1rem;">
                    <button class="btn" id="maxwell-rel-0" style="background:#ef444422;color:#ef4444;border:1px solid #ef4444;text-align:left;font-size:0.8rem;">(dT/dV)_S = -(dP/dS)_V  [from U]</button>
                    <button class="btn" id="maxwell-rel-1" style="background:#f59e0b22;color:#f59e0b;border:1px solid #f59e0b;text-align:left;font-size:0.8rem;">(dT/dP)_S = (dV/dS)_P  [from H]</button>
                    <button class="btn" id="maxwell-rel-2" style="background:#3b82f622;color:#3b82f6;border:1px solid #3b82f6;text-align:left;font-size:0.8rem;">(dP/dT)_V = (dS/dV)_T  [from F]</button>
                    <button class="btn" id="maxwell-rel-3" style="background:#10b98122;color:#10b981;border:1px solid #10b981;text-align:left;font-size:0.8rem;">(dV/dT)_P = -(dS/dP)_T  [from G]</button>
                </div>
                <div class="control-group"><label>Temperature T <span id="maxwell-T-val">300</span> K</label><input type="range" id="maxwell-T-slider" min="100" max="1000" value="300"></div>
                <div class="glass" style="padding:0.75rem;border-radius:8px;margin-top:1rem;min-height:48px;">
                    <p id="maxwell-rel-info" style="margin:0;font-size:0.85rem;color:var(--accent);">Click a relation above to highlight it on the square -></p>
                </div>
            </div>
        </div>
        <div class="card" style="margin-top:2rem;">
            <h3 style="color:var(--accent);margin-bottom:0.5rem;">Real-Life Example: Measuring Entropy Changes</h3>
            <p>You cannot directly measure entropy in a lab. But Maxwell's relation from Helmholtz tells us <strong>(dS/dV)_T = (dP/dT)_V</strong>. The right-hand side is the <em>thermal pressure coefficient</em> - easily measured with a pressure gauge and thermometer! This is how engineers calculate entropy changes of real gases.</p>
        </div>
    `,
    'adv-statmech': `
        <div class="grid-2">
            <div class="card canvas-container" id="statmech-container" style="height:420px;padding:0;">
                <canvas id="statmech-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Statistical Mechanics</h2>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
                    <p style="font-size:0.9rem;">Statistical mechanics bridges the microscopic (atoms) to macroscopic (temperature, pressure). The Boltzmann distribution gives the probability of a microstate: <strong>P_n ~ e^(-E_n/kBT)</strong>.</p>
                </div>
                <div class="control-group"><label>Temperature T <span id="statmech-T-val">300</span> K</label><input type="range" id="statmech-T" min="50" max="1500" value="300"></div>
                <div class="control-group"><label>Particles N <span id="statmech-N-val">60</span></label><input type="range" id="statmech-N" min="10" max="120" value="60"></div>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
                    <p style="margin:0;">Boltzmann Entropy S = kB ln(Omega)</p>
                    <p style="margin:0.5rem 0 0;">S = <strong id="statmech-entropy" style="color:#a855f7;">0.000 J/K</strong></p>
                </div>
            </div>
        </div>
        <div class="grid-2" style="margin-top:2rem;">
            <div class="card">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life Example: Stars & Blackbody Radiation</h3>
                <p>The Sun radiates like a blackbody at ~5778 K. Statistical mechanics (Planck's law) predicts the exact spectrum of light emitted. Without Boltzmann statistics we couldn't design solar cells, LED lights, or understand stellar evolution.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Key Concepts</h3>
                <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
                    <li><strong>Microstate:</strong> Exact position + momentum of every particle</li>
                    <li><strong>Macrostate:</strong> Observable quantities (T, P, V)</li>
                    <li><strong>Partition Function Z:</strong> Sum over all microstates</li>
                    <li><strong>Entropy S = kB ln Omega:</strong> Log of number of microstates</li>
                </ul>
            </div>
        </div>
    `,
    'adv-phase-trans': `
        <div class="grid-2">
            <div class="card canvas-container" id="adv-phase-container" style="height:420px;padding:0;">
                <canvas id="adv-phase-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Phase Transitions</h2>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Landau Theory</h3>
                    <p style="font-size:0.9rem;">Near a critical point, a phase transition is described by an order parameter eta (e.g., magnetization, crystal density). Landau's free energy <strong>f = a(T-Tc)eta^2 + beta^4</strong> shows how symmetry breaks below Tc.</p>
                </div>
                <div class="control-group"><label>Temperature T <span id="adv-phase-T-val">350</span> K</label><input type="range" id="adv-phase-T" min="200" max="600" value="350"></div>
                <div class="control-group"><label>Critical Temp Tc <span id="adv-phase-Tc-val">373</span> K</label><input type="range" id="adv-phase-Tc" min="250" max="550" value="373"></div>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;text-align:center;">
                    <p style="margin:0;font-size:1.1rem;">Phase: <strong id="adv-phase-state" style="font-size:1.3rem;color:#10b981;">LIQUID</strong></p>
                </div>
            </div>
        </div>
        <div class="grid-2" style="margin-top:2rem;">
            <div class="card">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life Example: Superconductors & Magnets</h3>
                <p>When cooled below their critical temperature Tc, some materials undergo a phase transition to superconductivity - zero electrical resistance. This is a 2nd-order phase transition described by Landau theory. MRI machines exploit superconducting magnets cooled to ~4 K.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Order vs Disorder</h3>
                <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
                    <li><strong style="color:#3b82f6;">Solid:</strong> eta large, highly ordered lattice</li>
                    <li><strong style="color:#10b981;">Liquid:</strong> eta partial, short-range order only</li>
                    <li><strong style="color:#ef4444;">Gas:</strong> eta != 0, maximum disorder</li>
                    <li><strong>1st order:</strong> Latent heat (e.g. melting ice)</li>
                    <li><strong>2nd order:</strong> Continuous, no latent heat (e.g. Curie point)</li>
                </ul>
            </div>
        </div>
    `,
    'adv-noneq': `
        <div class="grid-2">
            <div class="card canvas-container" id="noneq-container" style="height:420px;padding:0;">
                <canvas id="noneq-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Non-Equilibrium Thermodynamics</h2>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
                    <p style="font-size:0.9rem;">Real processes are irreversible. Non-equilibrium thermodynamics studies entropy production rate sigma = J*X >= 0, where J is a flux (heat, mass) and X is a thermodynamic force (grad T, grad mu). Onsager's reciprocal relations couple these fluxes.</p>
                </div>
                <div class="control-group"><label>Hot Reservoir T_H <span id="noneq-Th-val">600</span> K</label><input type="range" id="noneq-Th" min="350" max="1000" value="600"></div>
                <div class="control-group"><label>Cold Reservoir T_C <span id="noneq-Tc-val">300</span> K</label><input type="range" id="noneq-Tc" min="100" max="349" value="300"></div>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
                    <p style="margin:0;">Cumulative Entropy Production:</p>
                    <p style="margin:0.5rem 0 0;"><strong id="noneq-sigma" style="color:#a855f7;font-size:1.2rem;">0.000 J/K</strong></p>
                </div>
                <button class="btn" id="noneq-reset" style="width:100%;margin-top:0.75rem;background:var(--bg-dark);border:1px solid var(--border-color);">Reset Plot</button>
            </div>
        </div>
        <div class="grid-2" style="margin-top:2rem;">
            <div class="card">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life Example: Biological Cells</h3>
                <p>Living cells are <strong>open, non-equilibrium systems</strong> - they maintain internal order by continuously consuming energy (ATP) and producing entropy in the surroundings. Prigogine's dissipative structures theory (Nobel 1977) explains how life self-organises far from equilibrium.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Onsager Reciprocal Relations</h3>
                <p style="color:var(--text-muted);font-size:0.9rem;">When multiple irreversible processes occur simultaneously, their fluxes are coupled:<br><br>
                J1 = L11X1 + L12X2<br>J2 = L21X1 + L22X2<br><br>
                <strong>Onsager proved: L12 = L21</strong> (reciprocal symmetry). This is why thermoelectric devices (Peltier coolers) work - heat flux and electric current are coupled.</p>
            </div>
        </div>
    `,
    'adv-quantum': `
        <div class="grid-2">
            <div class="card canvas-container" id="quantum-container" style="height:420px;padding:0;">
                <canvas id="quantum-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Quantum Thermodynamics</h2>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
                    <p style="font-size:0.9rem;">At nanoscale, thermal fluctuations are quantum. A quantum harmonic oscillator has discrete energy levels E_n = (n+1/2)hbar omega. The Bose-Einstein distribution governs occupation. <strong>Landauer's principle</strong> - erasing one bit of information costs at least kBT*ln2 of energy as heat.</p>
                </div>
                <div class="control-group"><label>Temperature T <span id="quantum-T-val">300</span> K</label><input type="range" id="quantum-T" min="1" max="1000" value="300"></div>
                <div class="control-group"><label>Frequency omega <span id="quantum-omega-val">1.0</span> THz</label><input type="range" id="quantum-omega" min="0.1" max="10" step="0.1" value="1.0"></div>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
                    <p style="margin:0;"><n> Bose-Einstein: <strong id="quantum-nBE" style="color:#f59e0b;">0.0000</strong></p>
                    <p style="margin:0.4rem 0 0;">Von Neumann Entropy: <strong id="quantum-vN" style="color:#10b981;">0.000 kB</strong></p>
                    <p style="margin:0.4rem 0 0;">Landauer Limit: <strong id="quantum-landauer" style="color:#ef4444;">0.000 zJ/bit</strong></p>
                </div>
                <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
                    <button class="btn" id="quantum-erase" style="flex:1;background:#a855f7;">Erase Qubits</button>
                    <button class="btn" id="quantum-reset" style="flex:1;background:var(--bg-dark);border:1px solid var(--border-color);">Reset</button>
                </div>
            </div>
        </div>
        <div class="grid-2" style="margin-top:2rem;">
            <div class="card">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life Example: Quantum Computers</h3>
                <p>Quantum computers must erase qubit states during error correction. Landauer's principle sets a physical lower bound on the heat they must dissipate. IBM's quantum processors operate at ~15 millikelvin (colder than outer space!) to suppress thermal noise - a direct quantum thermodynamics challenge.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Virtual Lab: Bit Erasure</h3>
                <p style="color:var(--text-muted);font-size:0.9rem;">Click <strong>"Erase Qubits"</strong> to watch 8 qubits be reset to |0>. Each erasure event generates heat >= kBT*ln2. Watch the Bloch vectors collapse - this is the quantum origin of the second law of thermodynamics!</p>
                <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
                    <li>Maxwell's Demon is defeated by Landauer's principle</li>
                    <li>Szilard engine: 1 bit = kBT*ln2 of work</li>
                    <li>Von Neumann entropy -> quantum generalisation of Boltzmann entropy</li>
                </ul>
            </div>
        </div>
    `,
    'leaderboard': `
        <div class="card" style="max-width: 800px; margin: 0 auto;">
            <h2 style="text-align:center; color: var(--primary); margin-bottom: 2rem;">Global Leaderboard</h2>
            
            <div class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; border: 2px solid var(--accent);">
                <div>
                    <h3 style="margin:0;">Your Rank: <span id="lb-user-rank" style="color: var(--accent);">--</span></h3>
                    <p style="margin:0; color: var(--text-muted);">Current XP: <span id="lb-user-xp" style="color: white; font-weight: bold;">0</span></p>
                </div>
            </div>

            <table style="width: 100%; text-align: left; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted);">
                        <th style="padding: 1rem;">Rank</th>
                        <th style="padding: 1rem;">Engineer Name</th>
                        <th style="padding: 1rem;">Title</th>
                        <th style="padding: 1rem; text-align: right;">XP</th>
                    </tr>
                </thead>
                <tbody id="leaderboard-table">
                    <!-- Leaderboard populated by JS -->
                </tbody>
            </table>
        </div>
    `,
    'formula-derivations': `
        <div class="card katex-view" style="margin-bottom: 2rem;">
            <h2 style="color: var(--primary); margin-bottom: 0.6rem;">Thermodynamic formula derivations</h2>
            <p style="font-size: 0.95rem; color: var(--text-muted);">Exam-style steps below use <strong>KaTeX</strong>. Symbols such as \\( \\gamma \\), \\( \\Delta \\), and \\( \\int \\) replace plain-text placeholders.</p>
        </div>
        <div class="grid-2">
            <div class="card katex-view" style="grid-column: span 2; border-left: 4px solid var(--accent);">
                <h3 style="color: var(--accent);">1. Work — reversible isothermal expansion</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Ideal gas at constant \\( T \\), volume \\( V_1 \\to V_2 \\).</p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <div style="flex: 1; min-width: 220px; background: var(--bg-darker); padding: 1rem; border-radius: 8px;">
                        <p style="font-size: 0.9rem; color: var(--text-muted);"><strong>Steps 1–2.</strong> Boundary work increment \\( \\mathrm{d}W = P\\,\\mathrm{d}V \\).</p>
                    </div>
                    <div style="flex: 1; min-width: 180px; background: var(--bg-darker); padding: 1rem; border-radius: 8px;">
                        <p style="font-size: 0.85rem; color: var(--text-muted);"><strong>Sketch:</strong> \\( P \\) vs \\( V \\) — hyperbolic path \\( PV = \\text{const} \\).</p>
                    </div>
                </div>
                <div style="background: var(--bg-darker); padding: 1rem; border-radius: 8px;">
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.6rem;"><strong>Step 3.</strong> Ideal gas \\( PV = nRT \\Rightarrow P = nRT/V \\).</p>
                    $$ W = \\int_{V_1}^{V_2} \\frac{nRT}{V}\\,\\mathrm{d}V $$
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.8rem 0 0.4rem;"><strong>Step 4.</strong> \\( T \\) constant \\( \\Rightarrow \\)</p>
                    $$ W = nRT \\int_{V_1}^{V_2} \\frac{1}{V}\\,\\mathrm{d}V $$
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.8rem 0 0.4rem;"><strong>Step 5.</strong></p>
                    $$ W = nRT \\bigl[ \\ln V \\bigr]_{V_1}^{V_2} = nRT \\ln\\!\\frac{V_2}{V_1} $$
                </div>
                <p style="margin-top: 0.75rem; font-size: 0.85rem;"><strong>Prerequisite:</strong> logarithmic integral \\( \\int \\frac{1}{x}\\,\\mathrm{d}x \\).</p>
            </div>

            <div class="card katex-view" style="grid-column: span 2; border-left: 4px solid #3b82f6;">
                <h3 style="color: #3b82f6;">2. Work — reversible adiabatic expansion</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted);">No heat transfer; \\( PV^\\gamma = \\text{const} \\), \\( \\gamma = C_p/C_v \\).</p>
                <div style="background: var(--bg-darker); padding: 1rem; border-radius: 8px;">
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.5rem;"><strong>Step 2.</strong></p>
                    $$ W = \\int_{V_1}^{V_2} P\\,\\mathrm{d}V $$
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.8rem 0 0.4rem;"><strong>Step 3.</strong> \\( P = C V^{-\\gamma} \\) with \\( C = P_1 V_1^\\gamma = P_2 V_2^\\gamma \\).</p>
                    $$ W = \\int_{V_1}^{V_2} C\\, V^{-\\gamma}\\,\\mathrm{d}V $$
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.8rem 0 0.4rem;"><strong>Step 4.</strong> Power rule \\( \\int x^n\\,\\mathrm{d}x \\).</p>
                    $$ W = C \\left[ \\frac{V^{1-\\gamma}}{1-\\gamma} \\right]_{V_1}^{V_2} = \\frac{C\\,V_2^{1-\\gamma} - C\\,V_1^{1-\\gamma}}{1-\\gamma} $$
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.8rem 0 0.4rem;"><strong>Step 5.</strong> Substitute \\( C \\).</p>
                    $$ W = \\frac{P_2 V_2 - P_1 V_1}{1-\\gamma} = \\frac{P_1 V_1 - P_2 V_2}{\\gamma - 1} $$
                </div>
                <p style="margin-top: 0.75rem; font-size: 0.85rem;"><strong>Prerequisite:</strong> Poisson relation \\( PV^\\gamma = \\text{const} \\).</p>
            </div>

            <div class="card katex-view" style="grid-column: span 2; border-left: 4px solid #10b981;">
                <h3 style="color: #10b981;">3. Entropy change — ideal gas</h3>
                <div style="background: var(--bg-darker); padding: 1rem; border-radius: 8px;">
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.5rem;">Reversible: \\( T\\,\\mathrm{d}S = \\mathrm{d}U + P\\,\\mathrm{d}V = n C_v\\,\\mathrm{d}T + P\\,\\mathrm{d}V \\).</p>
                    $$ \\mathrm{d}S = \\frac{n C_v}{T}\\,\\mathrm{d}T + \\frac{nR}{V}\\,\\mathrm{d}V $$
                    $$ \\Delta S = n C_v \\ln\\!\\frac{T_2}{T_1} + n R \\ln\\!\\frac{V_2}{V_1} \\qquad \\Delta S = n C_p \\ln\\!\\frac{T_2}{T_1} - n R \\ln\\!\\frac{P_2}{P_1} $$
                </div>
            </div>

            <div class="card katex-view">
                <h3 style="color: var(--accent);">4. Enthalpy</h3>
                <div style="background: var(--bg-darker); padding: 1rem; border-radius: 8px;">
                    $$ H = U + PV \\qquad \\mathrm{d}H = \\delta Q \\ \\text{at constant } P $$
                </div>
            </div>
            <div class="card katex-view">
                <h3 style="color: var(--accent);">5. Mayer relation</h3>
                <div style="background: var(--bg-darker); padding: 1rem; border-radius: 8px;">
                    $$ C_p - C_v = R \\quad \\text{(per mole, ideal gas)} $$
                </div>
            </div>
            <div class="card katex-view" style="grid-column: span 2;">
                <h3 style="color: var(--accent);">6. Cold-air-standard Otto efficiency</h3>
                <div style="background: var(--bg-darker); padding: 1rem; border-radius: 8px;">
                    $$ \\eta = 1 - \\frac{1}{r^{\\gamma - 1}} \\qquad r = \\frac{V_1}{V_2} \\ \\text{(compression ratio)} $$
                </div>
            </div>
        </div>

    `,
    'third-law': `
        <div class="grid-2">
            <div class="card canvas-container" style="padding:0; min-height: 400px; display:flex; align-items:center; justify-content:center;">
                <canvas id="thirdlaw-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Third Law: Absolute Zero Simulator</h2>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Concept Definition</h3>
                    <p style="font-size: 0.9rem;"><strong>Third Law:</strong> The entropy of a perfect crystal approaches exactly zero as its temperature approaches absolute zero (0 K).</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;"><strong>Real-Life Example:</strong> Superconductors and Quantum Computers. To prevent data corruption from atomic vibrations (thermal noise), quantum chips are cooled to milliKelvin temperatures (near 0 K).</p>
                </div>
                <div class="control-group">
                    <label>Temperature (K): <span id="thirdlaw-temp-val">300</span> K</label>
                    <input type="range" id="thirdlaw-temp" min="0" max="300" value="300" step="1">
                </div>
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">System Entropy (S): <strong id="thirdlaw-entropy" style="color:var(--accent);">High</strong></p>
                    <p style="margin:0;">Lattice State: <strong id="thirdlaw-state" style="color:#ef4444;">Vibrating violently</strong></p>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--primary); margin-bottom: 1rem;">Real-Life Examples of the Third Law</h3>
            <div class="grid-2">
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #10b981;">
                    <h4 style="color:#10b981;">1. Quantum Computers</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">Quantum processors are cooled to milliKelvin temperatures (near absolute zero) to eliminate thermal lattice vibrations, preventing decoherence of qubits.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #10b981;">
                    <h4 style="color:#10b981;">2. Bose-Einstein Condensates</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">When certain atomic gases are cooled close to 0 K, they collapse into a single quantum state, acting as a single "super-atom" due to zero thermal motion.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #10b981;">
                    <h4 style="color:#10b981;">3. MRI Superconductors</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">Medical MRI machines use liquid helium to cool their magnetic coils close to 0 K. At this state, electrical resistance vanishes completely (entropy is minimal).</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #10b981;">
                    <h4 style="color:#10b981;">4. Deep Space Background</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">The vacuum of deep space is extremely cold, sitting around 2.7 Kelvin (due to CMB radiation). The Third Law proves that even deep space can never perfectly reach 0 K.</p>
                </div>
            </div>
        </div>
    `,
    'gas-laws': `
        <div class="card">
            <h2 style="color: var(--primary); margin-bottom: 1rem;">Gas Laws Hub</h2>
            <div class="grid-2">
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <div class="mini-piston-container" style="float:right;"><div class="mini-piston-gas" style="background:#3b82f6;"></div></div>
                    <h3 style="color: var(--primary);">Boyle's Law</h3>
                    <p>At constant Temperature (Isothermal): P âˆ 1/V</p>
                    <p style="font-family:monospace; margin-top:0.5rem;">P&#8321;V&#8321; = P&#8322;V&#8322;</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Derivation: From PV = nRT, if T is const, PV = const.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <div class="mini-piston-container" style="float:right;"><div class="mini-piston-gas" style="background:#ef4444;"></div></div>
                    <h3 style="color: #ef4444;">Charles' Law</h3>
                    <p>At constant Pressure (Isobaric): V âˆ T</p>
                    <p style="font-family:monospace; margin-top:0.5rem;">V&#8321;/T&#8321; = V&#8322;/T&#8322;</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Derivation: V = (nR/P)T. If P is const, V/T = const.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #10b981;">
                    <div class="mini-piston-container" style="float:right;"><div class="mini-piston-gas" style="background:#10b981;"></div></div>
                    <h3 style="color: #10b981;">Gay-Lussac's Law</h3>
                    <p>At constant Volume (Isochoric): P âˆ T</p>
                    <p style="font-family:monospace; margin-top:0.5rem;">P&#8321;/T&#8321; = P&#8322;/T&#8322;</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Derivation: P = (nR/V)T. If V is const, P/T = const.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border-left: 4px solid #a855f7;">
                    <div class="mini-wheel" style="float:right; border-color:#a855f7;"></div>
                    <h3 style="color: #a855f7;">Ideal Gas Equation</h3>
                    <p>Combines all empirical gas laws.</p>
                    <p style="font-family:monospace; margin-top:0.5rem;">PV = nRT</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Universal Gas Constant R = 8.314 J/(mol.K)</p>
                </div>
            </div>
        </div>
    `,
    'cycles': `
        <div class="grid-2">
            <div class="card canvas-container" style="padding:0; min-height: 400px; display:flex; align-items:center; justify-content:center; background: var(--bg-darker);">
                <canvas id="cycles-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2 style="color: var(--primary);">3D Engine Cycle Simulator</h2>
                <div class="control-group" style="margin-top: 1rem;">
                    <label>Select Thermodynamic Cycle:</label>
                    <select id="cycle-select" style="width:100%; padding:0.5rem; background:var(--bg-dark); color:white; border:1px solid var(--border-color); border-radius:4px; margin-top: 0.5rem;">
                        <option value="otto">Otto Cycle (Petrol Engine)</option>
                        <option value="diesel">Diesel Cycle</option>
                        <option value="brayton">Brayton Cycle (Jet Engine)</option>
                    </select>
                </div>
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">Current Stroke: <strong id="cycle-process" style="color:var(--accent);">Intake</strong></p>
                    <p style="margin:0; margin-top:0.5rem;">Volume: <strong id="cycle-vol" style="color:white;">High</strong> | Pressure: <strong id="cycle-press" style="color:#ef4444;">Atmospheric</strong></p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top:1rem; border-left: 4px solid var(--primary);">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Real-Life Application</h3>
                    <p id="cycle-real-life" style="font-size: 0.9rem; color: var(--text-muted);"><strong>Otto Cycle:</strong> Found in typical 4-stroke petrol car engines. Uses a spark plug to ignite a compressed fuel-air mixture.</p>
                </div>
            </div>
        </div>
    `,
    'heat-transfer': `
        <div class="card">
            <h2 style="color: var(--primary); margin-bottom: 1rem;">Heat Transfer Simulator</h2>
            <div class="grid-2">
                <div class="glass" style="padding: 1rem; border-radius: 8px;">
                    <h3 style="color: var(--accent); margin-bottom:0.5rem;">1. Conduction (Solid)</h3>
                    <canvas id="cond-canvas" style="width:100%; height:150px; background:#0f172a; border-radius:4px; box-shadow: inset 0 0 10px #000;"></canvas>
                    <p style="font-size:0.8rem; margin-top:0.5rem; color:var(--text-muted);">Fourier's Law: Heat flows directly through the solid bar from the hot end (red) to the cold end (blue).</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px;">
                    <h3 style="color: var(--accent); margin-bottom:0.5rem;">2. Convection (Fluid)</h3>
                    <canvas id="conv-canvas" style="width:100%; height:150px; background:#0f172a; border-radius:4px; box-shadow: inset 0 0 10px #000;"></canvas>
                    <p style="font-size:0.8rem; margin-top:0.5rem; color:var(--text-muted);">Newton's Law: The hot fluid (red) becomes less dense and rises, cools (blue), and sinks, creating a convection current.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px;">
                    <h3 style="color: var(--accent); margin-bottom:0.5rem;">3. Radiation (Vacuum)</h3>
                    <canvas id="rad-canvas" style="width:100%; height:150px; background:#0f172a; border-radius:4px; box-shadow: inset 0 0 10px #000;"></canvas>
                    <p style="font-size:0.8rem; margin-top:0.5rem; color:var(--text-muted);">Stefan-Boltzmann: Electromagnetic thermal waves are emitted radially from the hot surface through empty space.</p>
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; border: 1px solid var(--primary);">
                    <h3 style="color: var(--primary); margin-bottom:0.5rem;">Real-Life Examples</h3>
                    <ul style="font-size:0.85rem; color:var(--text-muted); margin-left:1.2rem;">
                        <li><strong>Conduction:</strong> Touching a hot metal spoon in coffee.</li>
                        <li><strong>Convection:</strong> Boiling water in a pot; oceanic currents.</li>
                        <li><strong>Radiation:</strong> Feeling the warmth of the Sun on your skin.</li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    'steam-boilers': `
        <div class="card" style="margin-bottom:1rem;">
            <h2 style="color: var(--primary); margin-bottom: 0.5rem;">Steam Boiler — 3D Lab Rig</h2>
            <p style="font-size:0.95rem;color:var(--text-muted);">Interactive drum with burner, water level, saturation tracking, and live steam bubbles (pseudo‑3D projection).</p>
        </div>
        <div class="grid-2">
            <div class="card canvas-container" style="padding:0; min-height:440px; background:#020617;">
                <canvas id="boiler-canvas" style="width:100%;height:420px;display:block;"></canvas>
            </div>
            <div class="card controls-panel">
                <h3 style="color:var(--accent);margin-top:0;">Operating Controls</h3>
                <div class="control-group">
                    <label>Pressure (gauge) <span id="boiler-press-val">1.01 bar</span></label>
                    <input type="range" id="boiler-pressure" min="1" max="220" value="1.01" step="0.1">
                </div>
                <button class="btn" id="boiler-heat-btn" style="width:100%; margin-top:0.75rem;">Ignite Burner</button>
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">Water Temp: <strong id="boiler-temp-val" style="color:#ef4444;">300 K</strong></p>
                    <p style="margin:0;">Saturation T<sub>sat</sub>: <strong id="boiler-tsat-val" style="color:#4ade80;">373 K</strong></p>
                    <p style="margin:0;">State: <strong id="boiler-state" style="color:var(--primary);">Subcooled Liquid</strong></p>
                </div>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;font-size:0.88rem;color:var(--text-muted);">
                    <p style="margin:0 0 0.5rem;"><strong>Steam tables:</strong> use the Virtual Lab → Steam Table tab for <em>h</em>, <em>s</em>, <em>v</em> at saturation.</p>
                    <p style="margin:0;"><strong>Dryness fraction:</strong> x = m<sub>v</sub> / (m<sub>f</sub> + m<sub>v</sub>). <strong>Boiler efficiency:</strong> &eta; &approx; Q<sub>useful</sub> / Q<sub>fuel</sub>.</p>
                </div>
            </div>
        </div>
    `,
    'numerical-bank': `
        <div class="card">
            <h2 style="color: var(--primary); margin-bottom: 1rem;">Infinite Numerical Problems Bank</h2>
            <p>Select a topic to generate a random numerical problem. Over 50+ unique variables are generated on the fly!</p>
            <div style="display:flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                <button class="btn" onclick="window.generateProblem('carnot')">Carnot Engine</button>
                <button class="btn" onclick="window.generateProblem('ideal-gas')">Ideal Gas Law</button>
                <button class="btn" onclick="window.generateProblem('work')">Isobaric Work</button>
                <button class="btn" onclick="window.generateProblem('rankine')">Rankine Efficiency</button>
                <button class="btn" onclick="window.generateProblem('heat-cond')">Heat Conduction</button>
                <button class="btn" onclick="window.generateProblem('otto')">Otto Efficiency</button>
            </div>
            <div class="glass" style="padding: 1.5rem; border-radius: 8px; min-height: 150px;" id="problem-display">
                <p style="color: var(--text-muted);">Click a button to generate a problem...</p>
            </div>
            <div style="margin-top: 1rem; display:none;" id="solution-section">
                <input type="number" id="user-answer" placeholder="Your answer..." style="padding: 0.5rem; width: 150px; background:var(--bg-dark); color:white; border: 1px solid var(--border-color); border-radius: 4px;">
                <button class="btn" onclick="window.checkAnswer()">Submit</button>
                <button class="btn" style="background:var(--bg-dark); border:1px solid var(--accent); margin-left:1rem;" onclick="window.showSolution()">Show Solution</button>
                <p id="answer-feedback" style="margin-top: 1rem; font-weight: bold;"></p>
                <div id="solution-steps" style="margin-top: 1rem; display:none; background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px; border-left:4px solid var(--accent); font-family:monospace;"></div>
            </div>
        </div>
    `,
    'formula-sheet': `
        <div class="card katex-view">
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem;">
                <div>
                    <h2 style="color: var(--primary); margin: 0 0 0.35rem 0;">University formula cheat sheet</h2>
                    <p style="margin:0;font-size:0.9rem;color:var(--text-muted);">KaTeX-rendered summary — comprehensive formula reference.</p>
                </div>
            </div>
            <div id="formula-sheet-export" class="grid-2">
                <div class="glass" style="padding:1rem; border-radius:8px;">
                    <h3 style="color:var(--accent); margin-top:0;">First law & boundary work</h3>
                    $$ Q - W = \\Delta U \\quad \\text{(closed)} \\qquad Q - W_s = \\Delta H \\quad \\text{(open, shaft work)} $$
                    $$ W_{\\text{isobar}} = P(V_2 - V_1) $$
                    $$ W_{\\text{isoth}} = nRT \\ln\\!\\frac{V_2}{V_1} $$
                    $$ W_{\\text{adiab}} = \\frac{P_1 V_1 - P_2 V_2}{\\gamma - 1} $$
                    $$ W_{\\text{poly}} = \\frac{P_1 V_1 - P_2 V_2}{n - 1} \\quad (\\text{polytropic index } n \\neq 1) $$
                </div>
                <div class="glass" style="padding:1rem; border-radius:8px;">
                    <h3 style="color:var(--accent); margin-top:0;">Entropy & second law</h3>
                    $$ \\Delta S = \\int \\frac{\\delta Q_{\\mathrm{rev}}}{T} $$
                    $$ \\Delta S = n C_p \\ln\\!\\frac{T_2}{T_1} - n R \\ln\\!\\frac{P_2}{P_1} $$
                    $$ \\eta_{\\mathrm{Carnot}} = 1 - \\frac{T_C}{T_H} $$
                    $$ \\mathrm{COP}_{R} = \\frac{T_C}{T_H - T_C} \\qquad \\mathrm{COP}_{HP} = \\frac{T_H}{T_H - T_C} $$
                </div>
                <div class="glass" style="padding:1rem; border-radius:8px;">
                    <h3 style="color:var(--accent); margin-top:0;">Gas cycles</h3>
                    $$ \\eta_{\\mathrm{Otto}} = 1 - \\frac{1}{r^{\\gamma - 1}} $$
                    $$ \\eta_{\\mathrm{Brayton}} = 1 - \\frac{1}{r_p^{(\\gamma - 1)/\\gamma}} $$
                    $$ \\eta_{\\mathrm{Rankine}} \\approx \\frac{(h_1 - h_2) - w_p}{(h_1 - h_4)} $$
                    $$ \\mathrm{MEP} = \\frac{W_{\\mathrm{net}}}{V_{\\mathrm{disp}}} $$
                </div>
                <div class="glass" style="padding:1rem; border-radius:8px;">
                    <h3 style="color:var(--accent); margin-top:0;">Properties & steam</h3>
                    $$ H = U + PV \\qquad C_p - C_v = R $$
                    $$ \\gamma = \\frac{C_p}{C_v} $$
                    $$ x = \\frac{m_v}{m_f + m_v} \\qquad h = h_f + x\\, h_{fg} $$
                </div>
            </div>
        </div>

    `,
    'ai-tutor': `
        <div class="card" style="max-width:900px;margin:0 auto;display:flex;flex-direction:column;height:680px;">
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-color);padding-bottom:1rem;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
                <div>
                    <h2 style="color:var(--primary);margin:0;">ThermoBot Vision AI</h2>
                    <p style="margin:0.25rem 0 0;font-size:0.8rem;color:var(--text-muted);">Ask questions, solve numericals, or upload exam photos</p>
                </div>
                <span style="background:var(--accent);color:white;padding:0.3rem 0.75rem;border-radius:20px;font-size:0.8rem;font-weight:bold;">GPT-4o Vision Active</span>
            </div>
            <div id="chat-window" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1rem;padding-right:0.5rem;">
                <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;align-self:flex-start;max-width:85%;border-left:4px solid var(--accent);">
                    <p style="margin:0;">Hello! I am your advanced <strong>ThermoBot</strong>. Ask me any thermodynamics question, get step-by-step solutions, or <strong style="color:#fbbf24;">upload a photo</strong> of an exam problem and I'll solve it!</p>
                </div>
            </div>
            <div style="display:flex;gap:0.5rem;align-items:flex-end;">
                <div style="flex:1;">
                    <input type="text" id="tutor-input" placeholder="Ask about entropy, Carnot efficiency, solve numericals..." style="width:100%;padding:0.85rem;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-dark);color:white;box-sizing:border-box;font-size:0.95rem;">
                </div>
                <button class="btn" id="tutor-send-btn" style="background:var(--primary);padding:0.85rem 1.2rem;white-space:nowrap;">Send</button>
                <label class="btn" style="background:#f59e0b;padding:0.85rem 1rem;cursor:pointer;white-space:nowrap;margin:0;" title="Upload exam photo to solve">
                    📷 Upload
                    <input type="file" accept="image/*" onchange="window.handlePhotoUpload(event)" style="display:none;">
                </label>
            </div>
        </div>
    `
};

// Register CFD view
views['adv-cfd'] = '<div id="cfd-wrapper"></div>';

// ---------------------------------------------------------------------------
// UI & ROUTING BOILERPLATE
// ---------------------------------------------------------------------------

const viewTitles = {
    'home': 'ThermoViz — Tejaswini Patil | 01FE24BME044',
    'fundamentals': 'Module 1: Fundamentals & Zeroth Law',
    'ideal-gas': 'Module 2: Ideal Gas Simulator',
    'piston': 'Module 4: Heat and Work',
    'pv-graph': 'Module 5: P-V Graph Visualizer',
    'quiz': 'Thermodynamics Arena',
    'first-law': 'Module 6: First Law & Turbines',
    'second-law': 'Module 7: Second Law & Entropy',
    'carnot': 'Module 7: Carnot Engine',
    'rankine': 'Module 10: Rankine Cycle',
    'hvac': 'Module 11: HVAC & Refrigeration',
    'combustion': 'Module 12: Combustion',
    'maxwell': 'Master Class: Maxwell-Boltzmann Dist.',
    'phase-change': 'Master Class: Phase Change & Triple Point',
    'virtual-lab': 'Virtual Labs',
    'chem-beginner': 'Chemical Thermo: Calorimetry & Enthalpy',
    'chem-intermediate': 'Chemical Thermo: Equilibrium',
    'chem-advanced': 'Chemical Thermo: Gibbs Free Energy',
    'adv-classical':  'Advanced: Classical Thermodynamics',
    'adv-potentials': 'Advanced: Thermodynamic Potentials',
    'adv-maxwell-rel':'Advanced: Maxwell Relations',
    'adv-statmech':   'Advanced: Statistical Mechanics',
    'adv-phase-trans':'Advanced: Phase Transitions',
    'adv-noneq':      'Advanced: Non-Equilibrium Thermodynamics',
    'adv-quantum':    'Advanced: Quantum Thermodynamics',
    'leaderboard': 'Global Leaderboard',
    'ai-tutor': 'ThermoBot Vision AI',
    'adv-cfd': 'CFD Simulator',
    'third-law': 'Module 8: Third Law of Thermodynamics',
    'gas-laws': 'Module 3: Gas Laws Hub',
    'cycles': 'Module 9: Engine Cycles',
    'heat-transfer': 'Module 13: Heat Transfer',
    'steam-boilers': 'Module 14: Steam & Boilers',
    'numerical-bank': 'Practice: Numerical Problem Bank',
    'formula-sheet': 'Reference: Formula Cheat Sheet',
    'formula-derivations': 'Reference: Step-by-Step Derivations'
};

const app = {
    currentView: 'home',
    xp: 0,
    audioCtx: null,
    theme: 'dark',

    init() {
        this.loadProgress();
        this.bindNavigation();
        this.loadView(this.currentView);
        
        document.body.addEventListener('click', () => {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
        
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }
        
        const savedTheme = localStorage.getItem('thermoViz_Theme');
        if (savedTheme === 'light') {
            this.theme = 'light';
            document.body.setAttribute('data-theme', 'light');
            if(themeBtn) themeBtn.textContent = 'Dark Mode';
        }
    },
    
    loadProgress() {
        const savedXP = localStorage.getItem('thermoViz_XP');
        if (savedXP) {
            this.xp = parseInt(savedXP, 10);
            this.updateRankUI();
        }
    },
    
    saveProgress() {
        localStorage.setItem('thermoViz_XP', this.xp.toString());
        localStorage.setItem('thermoViz_Theme', this.theme);
    },
    
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        const themeBtn = document.getElementById('theme-toggle');
        
        if (this.theme === 'light') {
            document.body.setAttribute('data-theme', 'light');
            if(themeBtn) themeBtn.textContent = 'Dark Mode';
        } else {
            document.body.removeAttribute('data-theme');
            if(themeBtn) themeBtn.textContent = 'â˜€ï¸';
        }
        this.saveProgress();
    },
    
    getColor(name) {
        const isLight = this.theme === 'light';
        switch (name) {
            case 'bg': return isLight ? '#f1f5f9' : '#0f172a';
            case 'bg-darker': return isLight ? '#f8fafc' : '#020617';
            case 'text': return isLight ? '#0f172a' : '#f8fafc';
            case 'text-muted': return isLight ? '#475569' : '#94a3b8';
            case 'border': return isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)';
            case 'panel': return isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30, 41, 59, 0.9)';
            default: return name;
        }
    },
    
    playSound(type) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        
        if (type === 'xp') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.5);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.3);
        } else if (type === 'ignite') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.8);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.8);
        }
    },

    bindNavigation() {
        const navItems = document.querySelectorAll('.nav-section li[data-view]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                navItems.forEach(nav => nav.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                const viewName = target.getAttribute('data-view');
                this.navigateTo(viewName);
            });
        });
    },

    navigateTo(viewName) {
        if (!views[viewName]) return;
        
        // Stop all simulations
        const simulators = [
            'fundamentals', 'idealGas', 'piston', 'firstLaw', 'secondLaw', 
            'carnotEngine', 'rankineCycle', 'hvac', 'combustion', 'maxwell', 
            'phaseChange', 'virtualLab', 'chemBeginner', 'chemIntermediate', 
            'chemAdvanced', 'advClassical', 'thermoPotentials', 'advMaxwell', 
            'advStatMech', 'advPhase', 'advNonEq', 'advQuantum', 'thirdLaw',
            'gasLaws', 'engineCycles', 'heatTransfer', 'boilers', 'numBank'
        ];
        
        simulators.forEach(sim => {
            if (window[sim] && typeof window[sim].stop === 'function') {
                window[sim].stop();
            }
        });
      
        this.currentView = viewName;
        this.loadView(viewName);
        
        document.querySelectorAll('.nav-section li[data-view]').forEach(nav => {
            nav.classList.remove('active');
            if(nav.getAttribute('data-view') === viewName) {
                nav.classList.add('active');
            }
        });
    },

    loadView(viewName) {
        const container = document.getElementById('view-container');
        const title = document.getElementById('page-title');
        if (!container || !title) return;
        
        container.style.opacity = 0;
        
        setTimeout(() => {
            container.innerHTML = views[viewName];
            title.textContent = viewTitles[viewName] || 'Thermodynamics Lab';
            
            container.style.transition = 'opacity 0.3s ease';
            container.style.opacity = 1;
            
            setTimeout(() => {
                this.initViewLogic(viewName);
            }, 50);
            
        }, 150);
    },

    initViewLogic(viewName) {
        const logicMap = {
            'fundamentals': 'fundamentals',
            'ideal-gas': 'idealGas',
            'piston': 'piston',
            'pv-graph': 'pvGraph',
            'quiz': 'quizSystem',
            'first-law': 'firstLaw',
            'second-law': 'secondLaw',
            'carnot': 'carnotEngine',
            'rankine': 'rankineCycle',
            'hvac': 'hvac',
            'combustion': 'combustion',
            'maxwell': 'maxwell',
            'phase-change': 'phaseChange',
            'virtual-lab': 'virtualLab',
            'chem-beginner': 'chemBeginner',
            'chem-intermediate': 'chemIntermediate',
            'chem-advanced': 'chemAdvanced',
            'leaderboard': 'leaderboardSystem',
            'ai-tutor': 'aiTutor',
            'adv-classical': 'advClassical',
            'adv-potentials': 'thermoPotentials',
            'adv-maxwell-rel': 'advMaxwell',
            'adv-statmech': 'advStatMech',
            'adv-phase-trans': 'advPhase',
            'adv-noneq': 'advNonEq',
            'adv-quantum': 'advQuantum',
            'adv-cfd': 'advCfd',
            'third-law': 'thirdLaw',
            'gas-laws': 'gasLaws',
            'cycles': 'cyclesSim',
            'heat-transfer': 'heatTransfer',
            'steam-boilers': 'boilers',
            'numerical-bank': 'numBank',
            'formula-sheet': 'formulaSheet'
        };

        const simName = logicMap[viewName];
        if (simName && window[simName] && typeof window[simName].init === 'function') {
            window[simName].init();
        }

        const vc = document.getElementById('view-container');
        if (vc && typeof window.typesetThermoMath === 'function') {
            window.typesetThermoMath(vc);
        }
    },
    
    addXP(amount) {
        this.xp += amount;
        this.updateRankUI();
        this.saveProgress();
        this.playSound('xp');
    },
    
    updateRankUI() {
        const xpEl = document.getElementById('user-xp');
        if (xpEl) xpEl.textContent = this.xp;
        
        const rankEl = document.getElementById('user-rank');
        if (!rankEl) return;
        
        if (this.xp >= 100 && this.xp < 300) rankEl.textContent = 'Thermo Apprentice';
        else if (this.xp >= 300 && this.xp < 600) rankEl.textContent = 'Cycle Master';
        else if (this.xp >= 600 && this.xp < 1000) rankEl.textContent = 'Entropy Expert';
        else if (this.xp >= 1000 && this.xp < 2000) rankEl.textContent = 'Thermo Legend';
        else if (this.xp >= 2000) rankEl.textContent = 'Master Engineer';
    }
};

window.app = app;

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*
// MASTER LEVEL EXTENSIONS
// â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*

// â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*
// MASTER LEVEL VIEWS
// â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*â*
views['master-antigrav'] = `
<div class="card monograph-header" style="margin-bottom:2rem; border-left: 6px solid #a855f7; background: linear-gradient(135deg, rgba(168,85,247,0.15), transparent);">
    <h1 style="font-family: var(--font-heading); font-size: 2.2rem; color: #a855f7; margin-bottom: 0.5rem;">Unified Non-Equilibrium Antigravity Framework</h1>
    <p style="font-size: 1.1rem; color: var(--text-main); font-weight: 600;">A Speculative PhD Research Monograph on Spacetime-Metric Manipulation via Advanced Thermodynamics</p>
    <div style="display: flex; gap: 1rem; margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted);">
        <span><strong>Author:</strong> Tejaswini Patil</span>
        <span>&bull;</span>
        <span><strong>Institution:</strong> KLE Technological University</span>
        <span>&bull;</span>
        <span><strong>Field:</strong> Relativistic Continuum Mechanics</span>
    </div>
</div>

<div class="grid-1" style="margin-bottom: 2rem;">
    <div class="card" style="padding: 0; overflow: hidden; border: 3px solid #a855f7; box-shadow: 0 0 50px rgba(168,85,247,0.3);">
        <div style="background: rgba(168,85,247,0.1); padding: 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; color: #a855f7;">Real-Time Spacetime-Entropy Coupling Simulation</h3>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn ag-mode-btn" data-mode="exergy" style="background:#f59e0b; font-size:0.8rem;">Exergy Field</button>
                <button class="btn ag-mode-btn" data-mode="onsager" style="background:#3b82f6; font-size:0.8rem; opacity:0.6;">Onsager Flux</button>
                <button class="btn ag-mode-btn" data-mode="fluctuation" style="background:#10b981; font-size:0.8rem; opacity:0.6;">FT Dynamics</button>
                <button class="btn ag-mode-btn" data-mode="geodesic" style="background:#f43f5e; font-size:0.8rem; opacity:0.6;">State Geodesic</button>
                <button class="btn ag-mode-btn" data-mode="generic" style="background:#06b6d4; font-size:0.8rem; opacity:0.6;">GENERIC Flow</button>
            </div>
        </div>
        <div id="antigrav-container" style="height: 600px; position: relative; background: #000;">
            <canvas id="antigrav-canvas"></canvas>
            <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.7); padding: 1rem; border-radius: 8px; border: 1px solid var(--accent); color: #fff; font-family: monospace; font-size: 0.8rem;">
                <div>ENERGY DENSITY: <span id="ag-energy-val" style="color:#a855f7;">1.00</span> PeV/mÂ^3</div>
                <div>ENTROPY PROD: <span id="ag-entropy-val" style="color:#10b981;">0.50</span> kJ/K&middot;s</div>
                <input type="range" id="ag-energy-slider" min="0.1" max="5.0" step="0.05" value="1.0" style="width:100%; margin-top:10px;">
                <input type="range" id="ag-entropy-slider" min="0.01" max="1.5" step="0.01" value="0.5" style="width:100%; margin-top:5px;">
            </div>
        </div>
    </div>
</div>

<div class="monograph-content" style="max-width: 1000px; margin: 0 auto;">
    <section id="abstract" style="margin-bottom: 3rem;">
        <h2 style="color: var(--accent); border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1rem;">1. Abstract</h2>
        <p style="font-size: 1.1rem; line-height: 1.8; text-align: justify;">
            This framework proposes a unified description of antigravity propulsion by synthesizing <strong>GENERIC formalism</strong>, <strong>Extended Irreversible Thermodynamics (EIT)</strong>, and <strong>Relativistic Continuum Mechanics</strong>. We hypothesize that gravitational metric manipulation is achievable through the controlled generation of entropic gradients in the quantum vacuum, mediated by non-local constitutive transport. By minimizing exergy destruction in relativistic plasma-thermal systems, we derive a speculative propulsion cycle that extracts momentum from vacuum-energy fluctuations.
        </p>
    </section>

    <section id="theoretical-basis" style="margin-bottom: 3rem;">
        <h2 style="color: var(--accent); border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1rem;">2. Theoretical Foundations</h2>
        
        <h3 style="color: var(--primary);">2.1 The GENERIC Master Equation</h3>
        <p>The temporal evolution of the propulsion system's state variables <em>x</em> is governed by the General Equation for Non-Equilibrium Reversible-Irreversible Coupling:</p>
        <div style="text-align: center; font-size: 1.5rem; margin: 1.5rem 0; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px dashed var(--border-color); font-family: 'JetBrains Mono';">
            dx/dt = L(x)&middot;Î´E/Î´x + M(x)&middot;Î´S/Î´x
        </div>
        <p>Here, <strong>L</strong> represents the reversible Poisson operator, and <strong>M</strong> is the irreversible dissipation matrix. To ensure thermodynamic consistency, the following degeneracy conditions must hold:</p>
        <ul style="margin-left: 2rem; margin-bottom: 1.5rem;">
            <li>L&middot;Î´S/Î´x = 0 (Entropy is invariant under reversible dynamics)</li>
            <li>M&middot;Î´E/Î´x = 0 (Energy is preserved during irreversible dissipation)</li>
        </ul>

        <h3 style="color: var(--primary);">2.2 Extended Irreversible Thermodynamics (EIT)</h3>
        <p>In high-frequency propulsion cycles, the infinite-speed heat propagation predicted by Fourier's law is physically inadmissible. We employ the <strong>Cattaneo-Vernotte</strong> hyperbolic model:</p>
        <div style="text-align: center; font-size: 1.3rem; margin: 1rem 0; font-family: 'JetBrains Mono';">
            Ï„&middot;âˆ‚q/âˆ‚t + q = âˆ'Îº&nabla;T
        </div>
        <p>This formulation treats the heat flux <strong>q</strong> as an independent thermodynamic variable, leading to a state space extended by tensorial fluxes. The resulting entropy production analysis reveals stable attractors in the non-linear phase space.</p>
    </section>

    <section id="relativistic-coupling" style="margin-bottom: 3rem;">
        <h2 style="color: var(--accent); border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1rem;">3. Relativistic Entropy-Curvature Coupling</h2>
        <p>Drawing from <strong>Israel-Stewart theory</strong> and emergent gravity concepts, we relate the metric tensor <em>g<sub>Î¼Î½</sub></em> to the covariant entropy flux <em>s<sup>Î¼</sup></em>. The generalized energy-momentum tensor includes dissipative viscous stresses and heat flux:</p>
        <div style="text-align: center; font-size: 1.2rem; margin: 1.5rem 0; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px;">
            T<sup>Î¼Î½</sup> = (Ï + p/cÂ^2)u<sup>Î¼</sup>u<sup>Î½</sup> + pg<sup>Î¼Î½</sup> + Ï€<sup>Î¼Î½</sup> + (q<sup>Î¼</sup>u<sup>Î½</sup> + q<sup>Î½</sup>u<sup>Î¼</sup>)/cÂ^2
        </div>
        <p>We postulate that <strong>Antigravity</strong> arises when the divergence of the entropy current &nabla;<sub>Î¼</sub>s<sup>Î¼</sup> creates a local distortion in the Ricci curvature <em>R<sub>Î¼Î½</sub></em>, effectively generating a repulsive entropic force density.</p>
    </section>

    <section id="vacuum-energetics" style="margin-bottom: 3rem;">
        <h2 style="color: var(--accent); border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1rem;">4. Quantum Vacuum Exergy Extraction</h2>
        <p>The framework utilizes <strong>Lindblad master equations</strong> to model open quantum systems interacting with the vacuum. The <strong>Casimir-energy coupling</strong> serves as the primary exergy source:</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
            <div class="glass" style="padding: 1.5rem; border-radius: 12px; border-top: 4px solid #f59e0b;">
                <h4 style="color: #f59e0b;">Fluctuation Theorems</h4>
                <p style="font-size: 0.85rem;">Applying the <strong>Jarzynski Equality</strong> &lang;e<sup>âˆ'W/kT</sup>&rang; = e<sup>âˆ'Î"F/kT</sup>, we calculate the work extractable from stochastic vacuum fluctuations at the sub-Planckian scale.</p>
            </div>
            <div class="glass" style="padding: 1.5rem; border-radius: 12px; border-top: 4px solid #3b82f6;">
                <h4 style="color: #3b82f6;">Mori-Zwanzig Projection</h4>
                <p style="font-size: 0.85rem;">We use the <strong>Mori-Zwanzig formalism</strong> to project many-body BBGKY dynamics onto a set of relevant macroscopic observables for propulsion control.</p>
            </div>
        </div>
    </section>

    <section id="propulsion-architecture" style="margin-bottom: 3rem;">
        <h2 style="color: var(--accent); border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1rem;">5. Speculative Propulsion-Cycle Architecture</h2>
        <div class="glass" style="padding: 2rem; border-radius: 16px; border: 1px solid #a855f7;">
            <p style="font-weight: bold; margin-bottom: 1rem; color: #a855f7;">Phase A: Vacuum Modulation</p>
            <p>Non-linear excitation of the quantum vacuum state through ultra-high-frequency (THz) magnetic resonance, inducing a metastable vacuum state with negative effective temperature.</p>
            
            <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;">
            
            <p style="font-weight: bold; margin-bottom: 1rem; color: #3b82f6;">Phase B: Exergy Conversion</p>
            <p>Convergent-divergent relativistic plasma flow where exergy destruction is minimized via <strong>Onsager-Machlup</strong> stochastic path optimization.</p>
            
            <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;">
            
            <p style="font-weight: bold; margin-bottom: 1rem; color: #10b981;">Phase C: Metric Thrust</p>
            <p>Asymmetric momentum flux generation. The resulting thrust is a direct consequence of the <strong>Clausius-Duhem inequality</strong> constraints in a non-local transport regime.</p>
        </div>
    </section>

    <section id="conclusion" style="margin-bottom: 5rem;">
        <h2 style="color: var(--accent); border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1rem;">6. Conclusion</h2>
        <p style="font-size: 1.1rem; line-height: 1.8; text-align: justify;">
            While highly speculative, this framework provides a mathematically consistent foundation for exploring antigravity propulsion through advanced thermodynamic principles. The synthesis of GENERIC formalism with relativistic continuum mechanics offers novel pathways for energy extraction from vacuum fluctuations. Future work should focus on experimental validation of the predicted entropic-curvature coupling effects.
        </p>
    </section>
</div>
            <p>Convergent-divergent relativistic plasma flow where exergy destruction is minimized via <strong>Onsager-Machlup</strong> stochastic path optimization.</p>
            
            <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;">
            
            <p style="font-weight: bold; margin-bottom: 1rem; color: #10b981;">Phase C: Metric Thrust</p>
            <p>Asymmetric momentum flux generation. The resulting thrust is a direct consequence of the <strong>Clausius-Duhem inequality</strong> constraints in a non-local transport regime.</p>
        </div>
    </section>

    <section id="conclusion" style="margin-bottom: 5rem;">
        <h2 style="color: var(--accent); border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1rem;">6. Admissibility & Stability</h2>
        <p>Lyapunov stability analysis confirms that the coupled non-linear PDE system remains stable under high energy-density perturbations, provided the <strong>Maximum Entropy Production Principle (MEPP)</strong> is maintained. Future numerical simulations using CFD-compatible relativistic plasma-thermal transport codes are required to validate the metric-distortion magnitudes.</p>
    </section>
</div>
`;

views['master-exergy'] = `
<div class="card katex-view master-exergy-lead" style="margin-bottom:1.2rem;border-left:10px solid #f59e0b;border-top:6px solid rgba(245,158,11,0.35);border-right:6px solid rgba(245,158,11,0.25);border-bottom:6px solid rgba(245,158,11,0.25);">
    <h2 style="color:#f59e0b;">Exergy &amp; availability</h2>
    <p style="color:var(--text-muted);">Maximum useful work relative to an environment \\((T_0,\\,p_0)\\). Equations below are rendered with KaTeX (no corrupted symbols).</p>
</div>
<div class="grid-2 master-exergy-grid" style="gap:1.2rem;">
    <div class="card katex-view" style="border-left:10px solid #f59e0b;border-width:6px;border-style:solid;border-color:rgba(148,163,184,0.35);border-left-color:#f59e0b;">
        <h4 style="color:#f59e0b;">Closed-system exergy</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:10px;margin-top:0.5rem;">
            $$ \\Xi = (U - U_0) + p_0(V - V_0) - T_0(S - S_0) $$
            $$ \\dot{\\Xi}_\\mathrm{dest} = T_0 \\dot{S}_\\mathrm{gen} \\ge 0 \\quad \\text{(Gouy--Stodola)} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.75rem;">Irreversibilities destroy available work in proportion to entropy generation.</p>
    </div>
    <div class="card katex-view" style="border-left:10px solid #10b981;border-width:6px;border-style:solid;border-color:rgba(148,163,184,0.35);border-left-color:#10b981;">
        <h4 style="color:#10b981;">Flow (physical) exergy</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:10px;margin-top:0.5rem;">
            $$ \\xi_\\mathrm{flow} = (h - h_0) - T_0(s - s_0) + \\frac{V^2}{2} + gz $$
            $$ \\eta_\\mathrm{II} = \\frac{W_\\mathrm{actual}}{\\Delta \\xi_\\mathrm{flow}} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.75rem;">Used for turbines, compressors, and ducts with kinetic and potential terms.</p>
    </div>
    <div class="card katex-view" style="grid-column:span 2;border-left:10px solid #a855f7;border-width:6px;border-style:solid;border-color:rgba(148,163,184,0.35);border-left-color:#a855f7;">
        <h4 style="color:#a855f7;">Open-system exergy rate balance</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:10px;margin-top:0.5rem;">
            $$ \\frac{\\mathrm{d}\\Xi_\\mathrm{sys}}{\\mathrm{d}t} = \\sum_k\\Bigl(1-\\frac{T_0}{T_k}\\Bigr)\\dot Q_k - \\dot W_\\mathrm{cv} + \\sum_\\mathrm{in}\\dot m\\,\\xi - \\sum_\\mathrm{out}\\dot m\\,\\xi - T_0\\dot S_\\mathrm{gen} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.75rem;">Heat, work, flow exergy transfers, then destruction \\(T_0\\dot S_\\mathrm{gen}\\).</p>
    </div>
    <div class="card katex-view" style="border-left:10px solid #ef4444;border-width:6px;border-style:solid;border-color:rgba(148,163,184,0.35);border-left-color:#ef4444;">
        <h4 style="color:#ef4444;">Entropy generation minimization (EGM)</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:10px;margin-top:0.5rem;">
            $$ \\dot S_\\mathrm{gen,HEX} \\sim \\frac{\\dot Q^2 R_\\mathrm{th}}{T_m^2} + \\frac{\\Delta p\\,\\dot m}{\\rho T_m} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.75rem;">Competing irreversibilities yield a thermodynamic optimum (Bejan).</p>
    </div>
    <div class="card katex-view" style="border-left:10px solid #3b82f6;border-width:6px;border-style:solid;border-color:rgba(148,163,184,0.35);border-left-color:#3b82f6;">
        <h4 style="color:#3b82f6;">Chemical exergy &amp; fuel cells</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:10px;margin-top:0.5rem;">
            $$ \\xi_\\mathrm{ch} = \\sum_i x_i\\mu_i - \\sum_i x_{i,0}\\mu_{i,0} \\qquad W_\\mathrm{elec,max} = -\\Delta G $$
            $$ \\eta_\\mathrm{ex} = \\frac{W_\\mathrm{elec}}{\\xi_\\mathrm{ch}} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.75rem;">Example: \\( \\mathrm{H}_2 \\) fuel cell reference \\(\\approx 236\\ \\mathrm{kJ/mol}\\) chemical exergy (order of magnitude).</p>
    </div>
</div>`;

views['master-generic'] = `
<div class="card katex-view" style="margin-bottom:1rem;border-left:4px solid #06b6d4;">
    <h2 style="color:#06b6d4;">GENERIC Formalism</h2>
    <p style="color:var(--text-muted);">General Equation for Non-Equilibrium Reversible-Irreversible Coupling — unified framework for all non-equilibrium thermodynamic systems.</p>
</div>
<div class="grid-2" style="gap:1rem;">
    <div class="card katex-view" style="border-left:4px solid #06b6d4;grid-column:span 2;">
        <h4 style="color:#06b6d4;">The GENERIC Master Equation</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\frac{dx}{dt} = L(x) \\cdot \\frac{\\delta E}{\\delta x} + M(x) \\cdot \\frac{\\delta S}{\\delta x} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Where: $x$ = state variables, $L$ = Poisson matrix (reversible, antisymmetric), $M$ = friction matrix (irreversible, positive semi-definite), $E$ = total energy, $S$ = entropy</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ L \\cdot \\frac{\\delta S}{\\delta x} = 0, \\quad M \\cdot \\frac{\\delta E}{\\delta x} = 0 $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Degeneracy conditions ensure thermodynamic consistency</p>
    </div>
    <div class="card katex-view" style="border-left:4px solid #a855f7;">
        <h4 style="color:#a855f7;">Rational Thermodynamics (Truesdell)</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\mathbf{T} = \\mathcal{F}(\\mathbf{F}, \\dot{\\mathbf{F}}, \\nabla T, \\ldots) $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Constitutive relations as tensor functionals of process history</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\mathbf{T}^* = \\mathbf{Q}^T \\mathbf{T} \\mathbf{Q} \\quad \\text{(Objectivity principle)} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Invariant under rigid body rotations $\\mathbf{Q}$</p>
    </div>
    <div class="card katex-view" style="border-left:4px solid #10b981;">
        <h4 style="color:#10b981;">Extended Irreversible Thermodynamics (EIT)</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\tau \\frac{\\partial \\mathbf{q}}{\\partial t} + \\mathbf{q} = -\\kappa \\nabla T $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Cattaneo-Vernotte hyperbolic heat conduction</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ v_T = \\sqrt{\\frac{\\kappa}{\\rho c_p \\tau}} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Finite thermal wave speed eliminates Fourier's infinite-speed paradox</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ S = S(u, \\mathbf{q}) $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Extended state space with heat flux as independent variable</p>
    </div>
    <div class="card katex-view" style="border-left:4px solid #ef4444;">
        <h4 style="color:#ef4444;">Boltzmann Transport & H-Theorem</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\frac{\\partial f}{\\partial t} + \\mathbf{v} \\cdot \\nabla f + \\mathbf{F} \\cdot \\frac{\\partial f}{\\partial \\mathbf{p}} = \\left(\\frac{\\partial f}{\\partial t}\\right)_{\\text{coll}} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Boltzmann equation for distribution function $f(\\mathbf{r}, \\mathbf{p}, t)$</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ H = \\int f \\ln f \\, d^3v, \\quad \\frac{dH}{dt} \\leq 0 $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Boltzmann H-function: irreversible approach to equilibrium</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ f_{\\text{MB}}(\\mathbf{v}) = n \\left(\\frac{m}{2\\pi k_B T}\\right)^{3/2} e^{-mv^2/2k_B T} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Maxwell-Boltzmann distribution maximizes entropy</p>
    </div>
    <div class="card katex-view" style="border-left:4px solid #f59e0b;">
        <h4 style="color:#f59e0b;">Finite-Time Thermodynamics</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\eta_{\\text{CA}} = 1 - \\sqrt{\\frac{T_c}{T_h}} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Curzon-Ahlborn efficiency at maximum power</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ P = \\dot{Q}_h - \\dot{Q}_c, \\quad \\eta = \\frac{P}{\\dot{Q}_h} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Trade-off: power $P$ vs. efficiency $\\eta$</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\dot{Q} = UA \\Delta T_{\\text{lm}} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Finite heat conductance limits transfer rate</p>
    </div>
    <div class="card katex-view" style="border-left:4px solid #6366f1;">
        <h4 style="color:#6366f1;">Phase Transitions near Vacuum Criticality</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ f(\\phi) = a(T - T_c)\\phi^2 + b\\phi^4 $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Landau-Ginzburg free energy density</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\phi^2 = \\begin{cases} 0 & T > T_c \\\\ -\\frac{a(T - T_c)}{2b} & T < T_c \\end{cases} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Order parameter behavior near critical temperature</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\xi = \\sqrt{\\frac{\\kappa}{a|T - T_c|}} $$
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Correlation length diverges at critical point</p>
    </div>
</div>`;

views['master-relativistic'] = `
<div class="card katex-view" style="margin-bottom:1rem;border-left:4px solid #f43f5e;">
    <h2 style="color:#f43f5e;">Relativistic Heat & Energy Flux Tensors</h2>
    <p style="color:var(--text-muted);">Energy-momentum formulation of thermodynamics in curved spacetime — foundation of relativistic propulsion thermodynamics.</p>
</div>
<div class="grid-2" style="gap:1rem;">
    <div class="card katex-view" style="border-left:4px solid #f43f5e;grid-column:span 2;">
        <h4 style="color:#f43f5e;">Stress-Energy-Momentum Tensor</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ T^{\\mu\\nu} = (\\epsilon + p)\\frac{u^\\mu u^\\nu}{c^2} + pg^{\\mu\\nu} + \\pi^{\\mu\\nu} + \\frac{q^\\mu u^\\nu + q^\\nu u^\\mu}{c^2} $$
        </div>
        <p style="font-size:0.83rem;color:var(--text-muted);">Where: $\\epsilon$ = energy density, $p$ = pressure, $u^\\mu$ = 4-velocity, $\\pi^{\\mu\\nu}$ = viscous stress, $q^\\mu$ = heat 4-flux</p>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\nabla_\\mu T^{\\mu\\nu} = F^{\\nu}_{\\text{ext}} $$
        </div>
        <p style="font-size:0.83rem;color:var(--text-muted);">Conservation law reduces to Navier-Stokes + energy equation in flat spacetime</p>
    </div>
    <div class="card katex-view" style="border-left:4px solid #3b82f6;">
        <h4 style="color:#3b82f6;">Relativistic Heat Conduction (Israel-Stewart)</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\tau_q \\frac{Dq^\\mu}{D\\tau} + q^\\mu = -\\kappa\\left(\\nabla^\\mu T + \\frac{T u^\\nu \\nabla_\\nu u^\\mu}{c^2}\\right) - \\alpha \\kappa T q^\\mu \\nabla_\\nu u^\\nu $$
        </div>
        <p style="font-size:0.82rem;color:var(--text-muted);">Israel-Stewart second-order theory eliminates acausal signals. Relaxation time $\\tau_q$ ensures finite propagation speed. Reduces to Fourier law: $q^\\mu = -\\kappa \\nabla^\\mu T$ in non-relativistic limit $v \\ll c$</p>
    </div>
    <div class="card katex-view" style="border-left:4px solid #10b981;">
        <h4 style="color:#10b981;">Entropy 4-Current & 2nd Law</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ s^\\mu = \\rho s u^\\mu - \\frac{q^\\mu}{T} + \\text{higher-order terms} $$
        </div>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\nabla_\\mu s^\\mu \\geq 0 \\quad \\text{(covariant 2nd Law)} $$
        </div>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\sigma = -\\frac{q^\\mu \\nabla_\\mu(1/T)}{ } - \\frac{\\pi^{\\mu\\nu} \\nabla_\\mu u_\\nu}{T} \\geq 0 $$
        </div>
        <p style="font-size:0.82rem;color:var(--text-muted);">Each term represents viscous and heat-flow irreversibility in relativistic frame</p>
    </div>
    <div class="card katex-view" style="border-left:4px solid #a855f7;">
        <h4 style="color:#a855f7;">Gibbs & Maxwell Relations in Curved Spacetime</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ d\\epsilon = Tds - pdV + \\mu dn + \\Phi_{\\text{grav}} dm $$
        </div>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ T\\sqrt{|g_{00}|} = \\text{const} \\quad \\text{(Tolman-Ehrenfest equilibrium)} $$
        </div>
        <p style="font-size:0.82rem;color:var(--text-muted);">Temperature varies with gravitational potential! Maxwell relation: $\\left(\\frac{\\partial T}{\\partial p}\\right)_s = \\left(\\frac{\\partial V}{\\partial s}\\right)_p$ generalized to $g^{\\mu\\nu}$ derivatives</p>
    </div>
    <div class="card katex-view" style="border-left:4px solid #f59e0b;">
        <h4 style="color:#f59e0b;">Unruh Effect & Quantum Vacuum Thermodynamics</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ T_U = \\frac{\\hbar a}{2\\pi c k_B} $$
        </div>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ T_H = \\frac{\\hbar c^3}{8\\pi G M k_B} $$
        </div>
        <p style="font-size:0.82rem;color:var(--text-muted);">Accelerating observer perceives vacuum as thermal bath. At $a = 10^2 \\text{ m/s}^2$: $T_U \\sim 400$ K at extreme acceleration. Hawking radiation for black hole mass $M$</p>
    </div>
    <div class="card katex-view" style="border-left:4px solid #06b6d4;">
        <h4 style="color:#06b6d4;">CFD Transport Equations (Relativistic)</h4>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\partial_\\mu(\\rho u^\\mu) = 0 \\quad \\text{(mass conservation)} $$
        </div>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\partial_\\mu T^{\\mu\\nu} = 0 \\quad \\text{(momentum-energy)} $$
        </div>
        <div style="background:var(--bg-darker);padding:1rem;border-radius:8px;margin:0.5rem 0;">
            $$ \\partial_\\mu s^\\mu = \\sigma \\geq 0 \\quad \\text{(entropy)} $$
        </div>
        <p style="font-size:0.82rem;color:var(--text-muted);">Numerical: HRSC schemes (Godunov-type) for relativistic Riemann problem. Primitive variable recovery: $\\rho, v, \\epsilon$ from conserved $D, S^i, \\tau$ requires Newton-Raphson iteration on EOS</p>
    </div>
</div>`;

views['master-finitetime'] = `
<div class="card" style="margin-bottom:1rem;border-left:4px solid #22c55e;">
    <h2 style="color:#22c55e;">Finite-Time Thermodynamics &amp; Propulsion Cycles</h2>
    <p style="color:var(--text-muted);">Real-time power optimization, endoreversible cycles, and high-power propulsion architectures under thermodynamic constraints.</p>
</div>
<div class="grid-2" style="gap:1rem;">
    <div class="card" style="border-left:4px solid #22c55e;">
        <h4 style="color:#22c55e;">Curzon-Ahlborn at Maximum Power</h4>
        <p style="font-size:0.82rem;color:var(--text-muted);">Î*_CA = 1 âˆ' âˆš(Tc/Th)<br><br>Endoreversible engine with finite UA conductance. Power: P = UAÂ*Î"T_lmÂ*Î*_CA. At max power Î*_CA &lt; Î*_Carnot always. For Th=1000K, Tc=300K: Î*_Carnot=70%, Î*_CA=45.2%.</p>
    </div>
    <div class="card" style="border-left:4px solid #3b82f6;">
        <h4 style="color:#3b82f6;">Thermodynamic Length &amp; State-Space Geodesics</h4>
        <p style="font-size:0.82rem;color:var(--text-muted);">L = âˆ<<âˆš(g_ij dÎ¾â±/dt Â* dÎ¾Ê^2/dt) dt<br><br>Fisher-Rao metric: g_ij = âˆ'âˆ‚Â^2S/âˆ‚Î¾â±âˆ‚Î¾Ê^2. Minimum dissipation path = geodesic in thermodynamic state space. Weinhold metric: g_ij^W = âˆ‚Â^2U/âˆ‚Xâ±âˆ‚XÊ^2 gives geometric interpretation of stability.</p>
    </div>
    <div class="card" style="border-left:4px solid #ef4444;">
        <h4 style="color:#ef4444;">Plasma &amp; Radiation Interactions</h4>
        <p style="font-size:0.82rem;color:var(--text-muted);">Radiation pressure: p_rad = a T^4 / 3 (Stefan–Boltzmann constant a ~ 7.56e-16 J/(m^3 K^4)). At T ~ 10^6 K, p_rad ~ 25 MPa. Plasma EOS: p = p_ion + p_electron + p_rad. Braginskii viscosity tensor for magnetized plasma. Entropy production: sigma = j*E/T + q dot nabla(1/T) + pi : nabla v / T.</p>
    </div>
    <div class="card" style="border-left:4px solid #a855f7;">
        <h4 style="color:#a855f7;">Coupled Nonlinear PDE System</h4>
        <p style="font-size:0.82rem;color:var(--text-muted);">Governing system for simulation:<br>âˆ‚Ï/âˆ‚t + âˆ‡Â*(Ïv) = 0<br>ÏDv/Dt = âˆ'âˆ‡p + âˆ‡Â*Ï„ + Ïg + JÃ--B<br>ÏDe/Dt = âˆ'pâˆ‡Â*v + Ï„:âˆ‡v âˆ' âˆ‡Â*q + Q_rad<br>âˆ‚B/âˆ‚t = âˆ‡Ã--(vÃ--B) âˆ' âˆ‡Ã--(Î*âˆ‡Ã--B)<br><br>Numerical: implicit IMEX-RK, adaptive mesh, hyperbolic divergence cleaning for âˆ‡Â*B=0.</p>
    </div>
    <div class="card" style="border-left:4px solid #f59e0b;grid-column:span 2;">
        <h4 style="color:#f59e0b;">Antigravity Propulsion Cycle Architecture</h4>
        <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.8;">
            <strong style="color:#fbbf24;">Stage 1 â€" Vacuum Energy Extraction:</strong> Dynamical Casimir effect at GHz-modulated mirror: P_Casimir = Ä§Ï‰Â^3vÂ^2/(3Ï€Â^2câµ). Effective temperature T_eff via Unruh coupling.<br>
            <strong style="color:#60a5fa;">Stage 2 â€" Exergy Amplification:</strong> Non-equilibrium plasma (Teâ‰ˆ10â¸K, Tiâ‰ˆ10â´K). Electron thermal exergy: Îž_e = nkTeÂ*ln(Te/T&#8320;). Onsager cross-coupling: thermoelectric enhancement Î*_TE = ZT/(ZT+1).<br>
            <strong style="color:#34d399;">Stage 3 â€" Entropy Rejection:</strong> Photon rocket: entropy rejection ~ P_rad/T_rad. Directed ~4 pi steradian radiation. Specific impulse: Isp ~ c/g_0 ~ 3e4 s (order-of-magnitude).<br>
            <strong style="color:#f87171;">Stage 4 â€" Momentum Thrust:</strong> Î"p^Î¼ = âˆ<<(T^Î¼Î½ âˆ' T&#8320;^Î¼Î½)n_Î½ dÎ£. Net anisotropic stress from engineered vacuum polarization field.
        </p>
    </div>
</div>`;

// Register master views in viewTitles
viewTitles['master-antigrav']    = 'Master: Antigravity Propulsion Framework';
viewTitles['master-exergy']      = 'Master: Exergy & Availability Theory';
viewTitles['master-generic']     = 'Master: GENERIC Formalism & EIT';
viewTitles['master-relativistic']= 'Master: Relativistic Heat & Energy Tensors';
viewTitles['master-finitetime']  = 'Master: Finite-Time Thermo & Propulsion Cycles';

// Wire routing for master views
const _origInitView = app.initViewLogic.bind(app);
app.initViewLogic = function(viewName) {
    _origInitView(viewName);
    if (viewName === 'master-antigrav' && window.antigravSim) {
        setTimeout(() => window.antigravSim.init(), 80);
    }
};

// Global search functionality
window.handleGlobalSearch = function() {
    const input = document.getElementById('global-search');
    const results = document.getElementById('search-results');
    if (!input || !results) return;
    
    const query = input.value.toLowerCase().trim();
    if (query.length < 2) {
        results.style.display = 'none';
        return;
    }
    
    // Search through view titles and descriptions
    const searchItems = [];
    for (const [key, title] of Object.entries(viewTitles)) {
        if (title && title.toLowerCase().includes(query)) {
            searchItems.push({ key, title, type: 'view' });
        }
    }
    
    // Search through virtual lab experiments
    if (window.virtualLab && window.virtualLab.experiments) {
        for (const [key, exp] of Object.entries(window.virtualLab.experiments)) {
            if (exp.title && exp.title.toLowerCase().includes(query)) {
                searchItems.push({ key, title: exp.title, type: 'experiment' });
            }
        }
    }
    
    // Display results
    if (searchItems.length > 0) {
        results.innerHTML = searchItems.slice(0, 8).map(item => {
            const icon = item.type === 'experiment' ? '🔬' : '📚';
            const action = item.type === 'experiment' ? 
                `window.virtualLab.loadExperiment('${item.key}')` : 
                `app.navigateTo('${item.key}')`;
            return `<div style="padding:0.5rem;cursor:pointer;border-radius:4px;" 
                     onmouseover="this.style.background='var(--bg-dark)'" 
                     onmouseout="this.style.background='transparent'"
                     onclick="${action}; document.getElementById('search-results').style.display='none';">
                     ${icon} ${item.title}</div>`;
        }).join('');
        results.style.display = 'block';
    } else {
        results.innerHTML = '<div style="padding:0.5rem;color:var(--text-muted);">No results found</div>';
        results.style.display = 'block';
    }
};

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleGlobalSearch);
        searchInput.addEventListener('focus', handleGlobalSearch);
        
        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#global-search') && !e.target.closest('#search-results')) {
                const results = document.getElementById('search-results');
                if (results) results.style.display = 'none';
            }
        });
    }
});

