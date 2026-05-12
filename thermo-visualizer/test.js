// Application logic and SPA routing

const views = {
    'home': 
        <style>
            .welcome-page { min-height: calc(100vh - 140px); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 2rem 1rem 3rem; }
            .welcome-hero { width: 100%; max-width: 900px; text-align: center; }
            .welcome-logo-ring { width: 160px; height: 160px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.8rem; box-shadow: 0 0 0 6px rgba(59,130,246,0.25), 0 0 40px rgba(59,130,246,0.3), 0 0 80px rgba(139,92,246,0.2); padding: 12px; animation: logoGlow 3s ease-in-out infinite alternate; }
            @keyframes logoGlow { from { box-shadow: 0 0 0 6px rgba(59,130,246,0.25), 0 0 40px rgba(59,130,246,0.3), 0 0 80px rgba(139,92,246,0.2); } to { box-shadow: 0 0 0 8px rgba(139,92,246,0.35), 0 0 60px rgba(139,92,246,0.4), 0 0 100px rgba(59,130,246,0.3); } }
            .welcome-logo-ring img { width: 100%; height: 100%; object-fit: contain; border-radius: 50%; }
            .welcome-uni { font-family: var(--font-heading); font-size: 1rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1rem; }
            .welcome-name { font-family: var(--font-heading); font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 0.6rem; letter-spacing: -1px; animation: shimmer 4s ease-in-out infinite; background-size: 200%; }
            @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
            .welcome-usn { display: inline-block; font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700; color: var(--primary); background: rgba(59,130,246,0.1); border: 1.5px solid rgba(59,130,246,0.3); border-radius: 50px; padding: 0.35rem 1.5rem; margin-bottom: 1.2rem; letter-spacing: 2px; }
            .welcome-tag { display: inline-flex; align-items: center; gap: 0.6rem; font-size: 1rem; font-weight: 600; color: #a855f7; background: rgba(168,85,247,0.1); border: 1.5px solid rgba(168,85,247,0.3); border-radius: 50px; padding: 0.4rem 1.4rem; margin-bottom: 2rem; letter-spacing: 1px; }
            .welcome-tag .dot { width: 8px; height: 8px; border-radius: 50%; background: #a855f7; animation: blink 1.4s ease-in-out infinite; }
            @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
            .welcome-divider { width: 120px; height: 3px; background: linear-gradient(90deg, transparent, var(--primary), var(--accent), transparent); margin: 0 auto 2.5rem; border-radius: 2px; }
            .welcome-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; width: 100%; max-width: 900px; margin-bottom: 2rem; }
            .welcome-stat-card { background: var(--panel-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem; text-align: center; backdrop-filter: blur(12px); transition: transform 0.3s ease, box-shadow 0.3s ease; }
            .welcome-stat-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.25); }
            .welcome-stat-card .icon { font-size: 2.2rem; margin-bottom: 0.75rem; }
            .welcome-stat-card h3 { font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin: 0 0 0.3rem; }
            .welcome-stat-card p { color: var(--text-muted); font-size: 0.88rem; margin: 0; }
            .welcome-cta { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
            .welcome-cta .btn-primary { padding: 0.9rem 2.5rem; font-size: 1rem; font-weight: 700; border-radius: 50px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: none; color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(59,130,246,0.4); }
            .welcome-cta .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(139,92,246,0.5); }
            .welcome-cta .btn-secondary { padding: 0.9rem 2.5rem; font-size: 1rem; font-weight: 700; border-radius: 50px; background: transparent; border: 2px solid var(--accent); color: var(--accent); cursor: pointer; transition: all 0.3s ease; }
            .welcome-cta .btn-secondary:hover { background: var(--accent); color: white; transform: translateY(-3px); }
            body[data-theme="light"] .welcome-logo-ring { box-shadow: 0 0 0 6px rgba(37,99,235,0.2), 0 4px 30px rgba(37,99,235,0.25), 0 0 60px rgba(124,58,237,0.15); }
        </style>
        <div class="welcome-page">
            <div class="welcome-hero">
                <!-- Logo -->
                <div class="welcome-logo-ring">
                    <img src="https://logo.clearbit.com/kletech.ac.in" alt="KLE Tech Logo"
                         onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\\'font-size:3rem;\\'>ðŸŽ“</span>'">
                </div>
                <!-- University -->
                <p class="welcome-uni">KLE Technological University, Hubballi</p>
                <!-- Name -->
                <h1 class="welcome-name">TEJASWINI PATIL</h1>
                <!-- USN -->
                <div class="welcome-usn">USN: 01FE24BME044</div>
                <br>
                <!-- Project tag -->
                <div class="welcome-tag">
                    <span class="dot"></span>
                    Gen AI Project &nbsp;Â·&nbsp; 2025â€“2026
                </div>
                <div class="welcome-divider"></div>
                <!-- App title -->
                <p style="font-family:var(--font-heading);font-size:1.05rem;color:var(--text-muted);max-width:560px;margin:0 auto 2.5rem;line-height:1.7;">
                    An AI-powered interactive thermodynamics learning platform â€” from fundamental laws to quantum heat engines.
                </p>
            </div>

            <!-- Stats -->
            <div class="welcome-grid">
                <div class="welcome-stat-card">
                    <div class="icon">ðŸ”¬</div>
                    <h3 style="color:#3b82f6;">25+</h3>
                    <p>Interactive Simulators<br>across 5 tracks</p>
                </div>
                <div class="welcome-stat-card">
                    <div class="icon">âš›</div>
                    <h3 style="color:#a855f7;">7</h3>
                    <p>Advanced Topics<br>incl. Quantum Thermo</p>
                </div>
                <div class="welcome-stat-card">
                    <div class="icon">ðŸ†</div>
                    <h3 style="color:#f59e0b;"><span id="home-xp-display">0</span> XP</h3>
                    <p>Your Progress<br>Rank: <span id="home-rank-display">Beginner</span></p>
                </div>
            </div>

            <!-- CTA buttons -->
            <div class="welcome-cta">
                <button class="btn-primary" onclick="app.navigateTo('fundamentals')">ðŸš€ Start Learning</button>
                <button class="btn-secondary" onclick="app.navigateTo('adv-quantum')">âš› Advanced Topics</button>
                <button class="btn-secondary" onclick="app.navigateTo('quiz')">ðŸŸ Quiz Arena</button>
            </div>
        </div>
        <script>
            (function syncHomeStats(){
                const xp = parseInt(localStorage.getItem('thermoViz_XP') || '0');
                const el = document.getElementById('home-xp-display');
                if(el) el.textContent = xp;
                const rEl = document.getElementById('home-rank-display');
                if(rEl){
                    if(xp>=2000) rEl.textContent='Master Engineer';
                    else if(xp>=1000) rEl.textContent='Thermo Legend';
                    else if(xp>=600) rEl.textContent='Entropy Expert';
                    else if(xp>=300) rEl.textContent='Cycle Master';
                    else if(xp>=100) rEl.textContent='Thermo Apprentice';
                    else rEl.textContent='Beginner Engineer';
                }
            })();
        </script>
    ,
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
    'piston': `
        <div class="grid-2">
            <div class="card canvas-container" id="piston-canvas-container" style="padding: 0;">
                <canvas id="piston-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Piston Simulator</h2>
                <p>Explore boundary work as the piston expands or compresses the gas inside the cylinder. W = âˆ«P dV.</p>
                
                <div class="control-group">
                    <label>Heat Input (Q)</label>
                    <button class="btn" id="heat-btn">Add Heat</button>
                    <button class="btn" id="cool-btn" style="background: var(--bg-dark); margin-top: 0.5rem; border: 1px solid var(--border-color);">Remove Heat</button>
                </div>
                
                <div class="control-group" style="margin-top: 1rem;">
                    <label>Work (W)</label>
                    <button class="btn" id="compress-btn" style="background: var(--accent);">Compress Gas (Do Work)</button>
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">Work Done: <strong id="work-val" style="color:var(--accent); font-size:1.2rem;">0 J</strong></p>
                </div>
            </div>
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
                <p><strong>Isothermal (Constant Temperature):</strong> The gas expands/compresses slowly so temperature doesn't change. The graph is a hyperbola (P âˆ 1/V).<br>
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
                        <button class="btn" id="sys-add-heat" style="background: #ef4444; flex: 1;">ðŸ”¥ Apply Heat</button>
                        <button class="btn" id="sys-add-mass" style="background: #3b82f6; flex: 1;">ðŸ’§ Add Mass</button>
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
        
        <div class="grid-2" style="margin-top: 2rem;">
            <div class="card" style="grid-column: span 2;">
                <h3 style="color: var(--accent); margin-bottom: 1rem;">Real-Life Example: Jet Engine</h3>
                <p>Jet engines use the First Law extensively. Air is compressed (work in), fuel is burned (heat in), and the hot gas expands through a turbine (work out) and nozzle (kinetic energy out) to produce thrust.</p>
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; text-align: center; margin-top: 1rem;">
                    <p><em>(Image placeholder: Jet Engine cross-section)</em></p>
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
        
        <div class="grid-2" style="margin-top: 2rem;">
            <div class="card" style="grid-column: span 2;">
                <h3 style="color: var(--accent); margin-bottom: 1rem;">Real-Life Example: Coffee Cooling</h3>
                <p>A hot cup of coffee left in a room will inevitably cool down to room temperature. The heat flows from the hot coffee to the cooler room, creating microscopic disorder (entropy). It will never spontaneously heat back up!</p>
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
    'virtual-lab': `
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
        <div class="grid-2">
            <div class="card canvas-container" id="hvac-canvas-container" style="padding: 0; background: var(--bg-dark);">
                <canvas id="hvac-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>HVAC & Refrigeration</h2>
                <p>The vapor-compression refrigeration cycle moves heat from a cold space to a hot space by inputting work (via a compressor). It's essentially the Rankine cycle run in reverse!</p>
                
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Target Cooling Temp: <strong id="hvac-temp-val" style="color: #3b82f6;">4Â°C</strong></p>
                    <input type="range" id="hvac-temp-slider" min="-20" max="15" value="4" style="width:100%; margin-top:0.5rem;">
                </div>
                
                <div class="stats-panel glass" style="padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <p style="margin:0;">Compressor Power: <strong id="hvac-power-val" style="color:#ef4444;">150 W</strong></p>
                    <p style="margin:0;">COP (Cooling): <strong id="hvac-cop-val" style="color:#4ade80;">3.5</strong></p>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Real-Life Example: Refrigerator</h3>
            <p>Your home refrigerator uses this exact cycle. The cold coils inside (Evaporator) absorb heat from your food. The compressor squeezes the refrigerant gas, making it hot, and pumps it to the coils on the back (Condenser), where it dumps the heat into your kitchen. The expansion valve then drops the pressure so it gets cold again!</p>
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
        <div class="grid-2">
            <div class="card canvas-container" id="maxwell-canvas-container" style="padding: 0; background: var(--bg-dark);">
                <canvas id="maxwell-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Maxwell-Boltzmann Distribution</h2>
                <p>This simulator bridges micro-physics to macro-thermodynamics. It shows the statistical distribution of speeds for particles in a box.</p>
                
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Temperature: <strong id="maxwell-temp-val" style="color: #ef4444;">300 K</strong></p>
                    <input type="range" id="maxwell-temp-slider" min="100" max="1000" value="300" style="width:100%; margin-top:0.5rem;">
                </div>
                
                <p style="margin-top: 1rem; color: var(--text-muted);">As Temperature increases, the curve flattens and shifts right, meaning the average kinetic energy increases, but there is a wider spread of particle speeds.</p>
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
                    <p style="font-size: 0.9rem;"><strong>Enthalpy (Î”H):</strong> The total heat content of a system. Exothermic reactions (Î”H < 0) release heat to the surroundings, while Endothermic reactions (Î”H > 0) absorb heat from the surroundings.</p>
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
                
                <p>Simulating: <strong>Nâ‚‚ + 3Hâ‚‚ â‡Œ 2NHâ‚ƒ + Heat (Exothermic)</strong></p>
                
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Stress the System:</p>
                    <button class="btn" id="eq-add-n2" style="width:100%; margin-top:0.5rem; background:var(--bg-dark);">Add Nâ‚‚ (Reactant)</button>
                    <button class="btn" id="eq-inc-pres" style="width:100%; margin-top:0.5rem; background:var(--bg-dark);">Increase Pressure</button>
                    <button class="btn" id="eq-inc-temp" style="width:100%; margin-top:0.5rem; background:var(--bg-dark);">Increase Temp</button>
                </div>
                <p id="eq-feedback" style="margin-top: 1rem; color: var(--accent); font-weight: bold; min-height: 20px;"></p>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Real-Life Example: The Haber Process</h3>
            <p>To industrially manufacture ammonia (NHâ‚ƒ) for fertilizer, engineers use Le Chatelier's principle. Because 4 moles of gas react to form 2 moles, they use <strong>extremely high pressures</strong> to force the equilibrium to the right. Because the reaction is exothermic, they'd prefer low temperatures, but a catalyst requires high temperatures to work, so they compromise at ~450Â°C.</p>
        </div>
    `,
    'chem-advanced': `
        <div class="grid-2">
            <div class="card canvas-container" id="chem3-canvas-container" style="padding: 0; background: var(--bg-dark);">
                <canvas id="chem3-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Gibbs Free Energy (Î”G)</h2>
                
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Concept Definition</h3>
                    <p style="font-size: 0.9rem;"><strong>Spontaneity:</strong> A reaction is spontaneous (occurs naturally) only if Î”G < 0. It is a balance between Enthalpy and Entropy: <br><strong style="font-size:1.1rem; color:var(--text-main);">Î”G = Î”H - TÎ”S</strong></p>
                </div>
                
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Enthalpy (Î”H): <strong id="chem3-h-val" style="color:#ef4444;">-50 kJ/mol</strong></p>
                    <input type="range" id="chem3-h-slider" min="-100" max="100" value="-50" style="width:100%; margin-top:0.5rem;">
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Entropy (Î”S): <strong id="chem3-s-val" style="color:#4ade80;">100 J/molÂ·K</strong></p>
                    <input type="range" id="chem3-s-slider" min="-200" max="200" value="100" style="width:100%; margin-top:0.5rem;">
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="margin:0;">Temp (T): <strong id="chem3-t-val" style="color:#fbbf24;">300 K</strong></p>
                    <input type="range" id="chem3-t-slider" min="10" max="1000" value="300" style="width:100%; margin-top:0.5rem;">
                </div>
                <div class="glass" style="padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align:center;">
                    <h3 style="margin:0;">Î”G = <span id="chem3-g-val">-80 kJ/mol</span></h3>
                    <p id="chem3-spont" style="color:#4ade80; font-weight:bold; font-size:1.2rem; margin-top:0.5rem;">SPONTANEOUS</p>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Real-Life Example: Rusting vs. Photosynthesis</h3>
            <p><strong>Rusting (Spontaneous):</strong> Iron reacting with oxygen is exothermic (Î”H < 0) and highly spontaneous (Î”G < 0). It will happen naturally, even if it's very slow.</p>
            <p><strong>Photosynthesis (Non-Spontaneous):</strong> Plants converting COâ‚‚ and water into sugar has a positive Î”G > 0. It cannot happen on its own; it requires constant energy input from the sun to force the reaction to occur.</p>
        </div>
    `,
    'adv-classical': `
        <div style="margin-bottom:1.5rem;" class="card" style="padding:1rem;">
            <h2 style="color:var(--primary);margin-bottom:0.5rem;">âš› Advanced Topics</h2>
            <p style="color:var(--text-muted);font-size:0.9rem;">University-level thermodynamics â€” interactive simulations, mathematical derivations, and real-world engineering applications.</p>
        </div>
        <div class="grid-2">
            <div class="card canvas-container" id="adv-classical-container" style="height:420px;padding:0;">
                <canvas id="adv-classical-canvas"></canvas>
            </div>
            <div class="card controls-panel">
                <h2>Classical Thermodynamics</h2>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
                    <p style="font-size:0.9rem;">Classical thermodynamics describes macroscopic systems through state variables (P,V,T,S). The four fundamental processes â€” isothermal, isobaric, isochoric, adiabatic â€” define how systems exchange energy.</p>
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
                    <button class="btn" id="classical-run" style="flex:1;background:var(--accent);">â–¶ Animate Process</button>
                    <button class="btn" id="classical-reset" style="flex:1;background:var(--bg-dark);border:1px solid var(--border-color);">â†º Reset</button>
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
                <p>Modern steam turbines operate using near-adiabatic expansion. High-pressure steam at ~500Â°C enters a turbine and expands rapidly, converting enthalpy to shaft work. The Rankine cycle uses a combination of isobaric (boiler/condenser) and near-adiabatic (turbine/pump) processes â€” a direct application of classical therodynamics.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Virtual Lab: PV Work Calculator</h3>
                <p>Select a process and animate it on the PV diagram. The area under the curve <strong>= Work done W = âˆ«P dV</strong>.</p>
                <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:1.9;">
                    <li><strong style="color:#3b82f6;">Isothermal:</strong> W = nRT ln(Vâ‚‚/Vâ‚)</li>
                    <li><strong style="color:#10b981;">Isobaric:</strong> W = P(Vâ‚‚âˆ’Vâ‚)</li>
                    <li><strong style="color:#f59e0b;">Isochoric:</strong> W = 0 (no volume change)</li>
                    <li><strong style="color:#ef4444;">Adiabatic:</strong> W = (Pâ‚Vâ‚âˆ’Pâ‚‚Vâ‚‚)/(Î³âˆ’1)</li>
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
                <div class="control-group"><label>Volume V <span id="potentials-V-val">0.5</span> mÂ³</label><input type="range" id="potentials-V" min="0.01" max="2" step="0.01" value="0.5"></div>
            </div>
        </div>
        <div class="grid-2" style="margin-top:2rem;">
            <div class="card">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life Example: Fuel Cells</h3>
                <p>A hydrogen fuel cell runs at constant T and P â€” the maximum electrical work it can produce equals <strong>âˆ’Î”G</strong> (Gibbs free energy change). Engineers use G to optimise fuel cell design. Similarly, Î”H tells us the total heat released in a combustion reaction.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Legendre Transform Relations</h3>
                <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
                    <li><strong style="color:#ef4444;">U</strong> = Internal Energy â†’ natural vars: S, V</li>
                    <li><strong style="color:#f59e0b;">H = U + PV</strong> â†’ natural vars: S, P</li>
                    <li><strong style="color:#3b82f6;">F = U âˆ’ TS</strong> â†’ natural vars: T, V (Helmholtz)</li>
                    <li><strong style="color:#10b981;">G = H âˆ’ TS</strong> â†’ natural vars: T, P (Gibbs)</li>
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
                    <button class="btn" id="maxwell-rel-0" style="background:#ef444422;color:#ef4444;border:1px solid #ef4444;text-align:left;font-size:0.8rem;">(âˆ‚T/âˆ‚V)_S = âˆ’(âˆ‚P/âˆ‚S)_V  [from U]</button>
                    <button class="btn" id="maxwell-rel-1" style="background:#f59e0b22;color:#f59e0b;border:1px solid #f59e0b;text-align:left;font-size:0.8rem;">(âˆ‚T/âˆ‚P)_S = (âˆ‚V/âˆ‚S)_P  [from H]</button>
                    <button class="btn" id="maxwell-rel-2" style="background:#3b82f622;color:#3b82f6;border:1px solid #3b82f6;text-align:left;font-size:0.8rem;">(âˆ‚P/âˆ‚T)_V = (âˆ‚S/âˆ‚V)_T  [from F]</button>
                    <button class="btn" id="maxwell-rel-3" style="background:#10b98122;color:#10b981;border:1px solid #10b981;text-align:left;font-size:0.8rem;">(âˆ‚V/âˆ‚T)_P = âˆ’(âˆ‚S/âˆ‚P)_T  [from G]</button>
                </div>
                <div class="control-group"><label>Temperature T <span id="maxwell-T-val">300</span> K</label><input type="range" id="maxwell-T-slider" min="100" max="1000" value="300"></div>
                <div class="glass" style="padding:0.75rem;border-radius:8px;margin-top:1rem;min-height:48px;">
                    <p id="maxwell-rel-info" style="margin:0;font-size:0.85rem;color:var(--accent);">Click a relation above to highlight it on the square â†’</p>
                </div>
            </div>
        </div>
        <div class="card" style="margin-top:2rem;">
            <h3 style="color:var(--accent);margin-bottom:0.5rem;">Real-Life Example: Measuring Entropy Changes</h3>
            <p>You cannot directly measure entropy in a lab. But Maxwell's relation from Helmholtz tells us <strong>(âˆ‚S/âˆ‚V)_T = (âˆ‚P/âˆ‚T)_V</strong>. The right-hand side is the <em>thermal pressure coefficient</em> â€” easily measured with a pressure gauge and thermometer! This is how engineers calculate entropy changes of real gases.</p>
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
                    <p style="font-size:0.9rem;">Statistical mechanics bridges the microscopic (atoms) to macroscopic (temperature, pressure). The Boltzmann distribution gives the probability of a microstate: <strong>P_n âˆ e^(âˆ’E_n/kBT)</strong>.</p>
                </div>
                <div class="control-group"><label>Temperature T <span id="statmech-T-val">300</span> K</label><input type="range" id="statmech-T" min="50" max="1500" value="300"></div>
                <div class="control-group"><label>Particles N <span id="statmech-N-val">60</span></label><input type="range" id="statmech-N" min="10" max="120" value="60"></div>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
                    <p style="margin:0;">Boltzmann Entropy S = kB ln(Î©)</p>
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
                    <li><strong>Entropy S = kB ln Î©:</strong> Log of number of microstates</li>
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
                    <p style="font-size:0.9rem;">Near a critical point, a phase transition is described by an order parameter Î· (e.g., magnetization, crystal density). Landau's free energy <strong>f = a(Tâˆ’Tc)Î·Â² + bÎ·â´</strong> shows how symmetry breaks below Tc.</p>
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
                <p>When cooled below their critical temperature Tc, some materials undergo a phase transition to superconductivity â€” zero electrical resistance. This is a 2nd-order phase transition described by Landau theory. MRI machines exploit superconducting magnets cooled to ~4 K.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Order vs Disorder</h3>
                <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
                    <li><strong style="color:#3b82f6;">Solid:</strong> Î· large, highly ordered lattice</li>
                    <li><strong style="color:#10b981;">Liquid:</strong> Î· partial, short-range order only</li>
                    <li><strong style="color:#ef4444;">Gas:</strong> Î· â‰ˆ 0, maximum disorder</li>
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
                    <p style="font-size:0.9rem;">Real processes are irreversible. Non-equilibrium thermodynamics studies entropy production rate Ïƒ = JÂ·X â‰¥ 0, where J is a flux (heat, mass) and X is a thermodynamic force (âˆ‡T, âˆ‡Î¼). Onsager's reciprocal relations couple these fluxes.</p>
                </div>
                <div class="control-group"><label>Hot Reservoir T_H <span id="noneq-Th-val">600</span> K</label><input type="range" id="noneq-Th" min="350" max="1000" value="600"></div>
                <div class="control-group"><label>Cold Reservoir T_C <span id="noneq-Tc-val">300</span> K</label><input type="range" id="noneq-Tc" min="100" max="349" value="300"></div>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
                    <p style="margin:0;">Cumulative Entropy Production:</p>
                    <p style="margin:0.5rem 0 0;"><strong id="noneq-sigma" style="color:#a855f7;font-size:1.2rem;">0.000 J/K</strong></p>
                </div>
                <button class="btn" id="noneq-reset" style="width:100%;margin-top:0.75rem;background:var(--bg-dark);border:1px solid var(--border-color);">â†º Reset Plot</button>
            </div>
        </div>
        <div class="grid-2" style="margin-top:2rem;">
            <div class="card">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life Example: Biological Cells</h3>
                <p>Living cells are <strong>open, non-equilibrium systems</strong> â€” they maintain internal order by continuously consuming energy (ATP) and producing entropy in the surroundings. Prigogine's dissipative structures theory (Nobel 1977) explains how life self-organises far from equilibrium.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Onsager Reciprocal Relations</h3>
                <p style="color:var(--text-muted);font-size:0.9rem;">When multiple irreversible processes occur simultaneously, their fluxes are coupled:<br><br>
                Jâ‚ = Lâ‚â‚Xâ‚ + Lâ‚â‚‚Xâ‚‚<br>Jâ‚‚ = Lâ‚‚â‚Xâ‚ + Lâ‚‚â‚‚Xâ‚‚<br><br>
                <strong>Onsager proved: Lâ‚â‚‚ = Lâ‚‚â‚</strong> (reciprocal symmetry). This is why thermoelectric devices (Peltier coolers) work â€” heat flux and electric current are coupled.</p>
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
                    <p style="font-size:0.9rem;">At nanoscale, thermal fluctuations are quantum. A quantum harmonic oscillator has discrete energy levels E_n = (n+Â½)â„Ï‰. The Bose-Einstein distribution governs occupation. <strong>Landauer's principle</strong> â€” erasing one bit of information costs at least kBTÂ·ln2 of energy as heat.</p>
                </div>
                <div class="control-group"><label>Temperature T <span id="quantum-T-val">300</span> K</label><input type="range" id="quantum-T" min="1" max="1000" value="300"></div>
                <div class="control-group"><label>Frequency Ï‰ <span id="quantum-omega-val">1.0</span> THz</label><input type="range" id="quantum-omega" min="0.1" max="10" step="0.1" value="1.0"></div>
                <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
                    <p style="margin:0;">âŸ¨nâŸ© Bose-Einstein: <strong id="quantum-nBE" style="color:#f59e0b;">0.0000</strong></p>
                    <p style="margin:0.4rem 0 0;">Von Neumann Entropy: <strong id="quantum-vN" style="color:#10b981;">0.000 kB</strong></p>
                    <p style="margin:0.4rem 0 0;">Landauer Limit: <strong id="quantum-landauer" style="color:#ef4444;">0.000 zJ/bit</strong></p>
                </div>
                <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
                    <button class="btn" id="quantum-erase" style="flex:1;background:#a855f7;">âš¡ Erase Qubits</button>
                    <button class="btn" id="quantum-reset" style="flex:1;background:var(--bg-dark);border:1px solid var(--border-color);">â†º Reset</button>
                </div>
            </div>
        </div>
        <div class="grid-2" style="margin-top:2rem;">
            <div class="card">
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life Example: Quantum Computers</h3>
                <p>Quantum computers must erase qubit states during error correction. Landauer's principle sets a physical lower bound on the heat they must dissipate. IBM's quantum processors operate at ~15 millikelvin (colder than outer space!) to suppress thermal noise â€” a direct quantum thermodynamics challenge.</p>
            </div>
            <div class="card">
                <h3 style="color:var(--accent);margin-bottom:0.5rem;">Virtual Lab: Bit Erasure</h3>
                <p style="color:var(--text-muted);font-size:0.9rem;">Click <strong>"Erase Qubits"</strong> to watch 8 qubits be reset to |0âŸ©. Each erasure event generates heat â‰¥ kBTÂ·ln2. Watch the Bloch vectors collapse â€” this is the quantum origin of the second law of thermodynamics!</p>
                <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
                    <li>Maxwell's Demon is defeated by Landauer's principle</li>
                    <li>Szilard engine: 1 bit = kBTÂ·ln2 of work</li>
                    <li>Von Neumann entropy â†’ quantum generalisation of Boltzmann entropy</li>
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
    'ai-tutor': `
        <div class="card" style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; height: 600px;">
            <h2 style="color: var(--primary); margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">ThermoBot Tutor</h2>
            
            <div id="chat-window" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; padding-right: 1rem;">
                <!-- Chat messages -->
            </div>
            
            <div style="display: flex; gap: 1rem;">
                <input type="text" id="tutor-input" placeholder="Ask a thermodynamics question..." style="flex: 1; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-darker); color: white; font-family: var(--font-body);">
                <button class="btn" id="tutor-send-btn" style="background: var(--accent);">Ask</button>
            </div>
        </div>
    `
};

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
    'adv-quantum':    'Advanced: Quantum Thermodynamics',    'leaderboard': 'Global Leaderboard',
    'ai-tutor': 'AI Tutor'
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
        
        // Init audio context on first user interaction
        document.body.addEventListener('click', () => {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
        
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('thermoViz_Theme');
        if (savedTheme === 'light') {
            this.theme = 'light';
            document.body.setAttribute('data-theme', 'light');
            if(themeBtn) themeBtn.textContent = 'ðŸŒ™';
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
            if(themeBtn) themeBtn.textContent = 'ðŸŒ™';
        } else {
            document.body.removeAttribute('data-theme');
            if(themeBtn) themeBtn.textContent = 'â˜€ï¸';
        }
        this.saveProgress();
    },
    
    getColor(name) {
        // Helper for canvas to get current theme colors dynamically
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
                // Remove active class from all
                navItems.forEach(nav => nav.classList.remove('active'));
                // Add to clicked
                e.target.classList.add('active');
                // Load view
                const viewName = e.target.getAttribute('data-view');
                this.navigateTo(viewName);
            });
        });
    },

    navigateTo(viewName) {
        if (!views[viewName]) return;
        
        // Cleanup previous view logic if needed
        if (this.currentView === 'fundamentals' && window.fundamentals) window.fundamentals.stop();
        if (this.currentView === 'ideal-gas' && window.idealGas) window.idealGas.stop();
        if (this.currentView === 'piston' && window.piston) window.piston.stop();
        if (this.currentView === 'first-law' && window.firstLaw) window.firstLaw.stop();
        if (this.currentView === 'second-law' && window.secondLaw) window.secondLaw.stop();
        if (this.currentView === 'carnot' && window.carnotEngine) window.carnotEngine.stop();
        if (this.currentView === 'rankine' && window.rankineCycle) window.rankineCycle.stop();
        if (this.currentView === 'hvac' && window.hvac) window.hvac.stop();
        if (this.currentView === 'combustion' && window.combustion) window.combustion.stop();
        if (this.currentView === 'maxwell' && window.maxwell) window.maxwell.stop();
        if (this.currentView === 'phase-change' && window.phaseChange) window.phaseChange.stop();
        if (this.currentView === 'virtual-lab' && window.virtualLab) window.virtualLab.stop();
        if (this.currentView === 'chem-beginner' && window.chemBeginner) window.chemBeginner.stop();
        if (this.currentView === 'chem-intermediate' && window.chemIntermediate) window.chemIntermediate.stop();
        if (this.currentView === 'chem-advanced' && window.chemAdvanced) window.chemAdvanced.stop();

        if (this.currentView === 'adv-classical'  && window.advClassical)  window.advClassical.stop();
        if (this.currentView === 'adv-potentials' && window.thermoPotentials) window.thermoPotentials.stop();
        if (this.currentView === 'adv-maxwell-rel'&& window.advMaxwell)    window.advMaxwell.stop();
        if (this.currentView === 'adv-statmech'   && window.advStatMech)   window.advStatMech.stop();
        if (this.currentView === 'adv-phase-trans'&& window.advPhase)      window.advPhase.stop();
        if (this.currentView === 'adv-noneq'      && window.advNonEq)      window.advNonEq.stop();
        if (this.currentView === 'adv-quantum'    && window.advQuantum)    window.advQuantum.stop();        
        this.currentView = viewName;
        this.loadView(viewName);
        
        // Ensure nav is highlighted correctly (if navigated from somewhere else like a button)
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
        
        // Fade out
        container.style.opacity = 0;
        
        setTimeout(() => {
            container.innerHTML = views[viewName];
            title.textContent = viewTitles[viewName];
            
            // Fade in
            container.style.transition = 'opacity 0.3s ease';
            container.style.opacity = 1;
            
            // Initialize view specific logic after a short delay to ensure DOM is ready
            setTimeout(() => {
                this.initViewLogic(viewName);
            }, 50);
            
        }, 150);
    },

    initViewLogic(viewName) {
        if (viewName === 'fundamentals' && window.fundamentals) {
            window.fundamentals.init();
        } else if (viewName === 'ideal-gas' && window.idealGas) {
            window.idealGas.init();
        } else if (viewName === 'piston' && window.piston) {
            window.piston.init();
        } else if (viewName === 'pv-graph' && window.pvGraph) {
            window.pvGraph.init();
        } else if (viewName === 'quiz' && window.quizSystem) {
            window.quizSystem.init();
        } else if (viewName === 'first-law' && window.firstLaw) {
            window.firstLaw.init();
        } else if (viewName === 'second-law' && window.secondLaw) {
            window.secondLaw.init();
        } else if (viewName === 'carnot' && window.carnotEngine) {
            window.carnotEngine.init();
        } else if (viewName === 'rankine' && window.rankineCycle) {
            window.rankineCycle.init();
        } else if (viewName === 'hvac' && window.hvac) {
            window.hvac.init();
        } else if (viewName === 'combustion' && window.combustion) {
            window.combustion.init();
        } else if (viewName === 'maxwell' && window.maxwell) {
            window.maxwell.init();
        } else if (viewName === 'phase-change' && window.phaseChange) {
            window.phaseChange.init();
        } else if (viewName === 'virtual-lab' && window.virtualLab) {
            window.virtualLab.init();
        } else if (viewName === 'chem-beginner' && window.chemBeginner) {
            window.chemBeginner.init();
        } else if (viewName === 'chem-intermediate' && window.chemIntermediate) {
            window.chemIntermediate.init();
        } else if (viewName === 'chem-advanced' && window.chemAdvanced) {
            window.chemAdvanced.init();
        } else if (viewName === 'leaderboard' && window.leaderboardSystem) {
            window.leaderboardSystem.init();
        } else if (viewName === 'ai-tutor' && window.aiTutor) {
            window.aiTutor.init();
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
        
        // Leveling logic
        const rankEl = document.getElementById('user-rank');
        if (!rankEl) return;
        
        if (this.xp >= 100 && this.xp < 300) rankEl.textContent = 'Thermo Apprentice';
        else if (this.xp >= 300 && this.xp < 600) rankEl.textContent = 'Cycle Master';
        else if (this.xp >= 600 && this.xp < 1000) rankEl.textContent = 'Entropy Expert';
        else if (this.xp >= 1000 && this.xp < 2000) rankEl.textContent = 'Thermo Legend';
        else if (this.xp >= 2000) rankEl.textContent = 'Master Engineer';
    }
};

// Expose app to global scope for onclick handlers
window.app = app;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
 else if (viewName === 'adv-classical'  && window.advClassical)     window.advClassical.init();
        else if (viewName === 'adv-potentials' && window.thermoPotentials)  window.thermoPotentials.init();
        else if (viewName === 'adv-maxwell-rel'&& window.advMaxwell)        window.advMaxwell.init();
        else if (viewName === 'adv-statmech'   && window.advStatMech)       window.advStatMech.init();
        else if (viewName === 'adv-phase-trans'&& window.advPhase)          window.advPhase.init();
        else if (viewName === 'adv-noneq'      && window.advNonEq)          window.advNonEq.init();
        else if (viewName === 'adv-quantum'    && window.advQuantum)        window.advQuantum.init();
