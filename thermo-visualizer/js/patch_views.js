// ═══════════════════════════════════════════════
// PATCH: Missing Advanced Views + Equilibrium Concepts
// Loaded AFTER app.js — injects views, titles, init logic
// ═══════════════════════════════════════════════

/* ── 1. Irreversible Processes ── */
views['irreversible'] = `
<div class="grid-2">
  <div class="card canvas-container" id="irr-container" style="height:680px;padding:0;">
    <canvas id="irr-canvas"></canvas>
  </div>
  <div class="card controls-panel">
    <h2>Irreversible Processes</h2>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
      <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
      <p style="font-size:0.9rem;">An <strong>irreversible process</strong> is any real process that cannot return both the system AND surroundings to their original states. All natural processes are irreversible due to friction, unrestrained expansion, heat transfer across a finite ΔT, mixing, and chemical reactions.</p>
      <p style="font-size:0.9rem;margin-top:0.5rem;"><strong>Key Formula:</strong> ΔS_universe = ΔS_system + ΔS_surroundings > 0 (always for irreversible)</p>
    </div>
    <div class="control-group"><label>Temperature Gradient ΔT <span id="irr-dt-val">200</span> K</label><input type="range" id="irr-dt" min="10" max="500" value="200"></div>
    <div class="control-group"><label>Friction Coefficient <span id="irr-fric-val">0.3</span></label><input type="range" id="irr-fric" min="0" max="1" step="0.05" value="0.3"></div>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
      <p style="margin:0;">Entropy Generated: <strong id="irr-sgen" style="color:#ef4444;font-size:1.2rem;">0.000 J/K</strong></p>
      <p style="margin:0;">Lost Work: <strong id="irr-wlost" style="color:#f59e0b;">0.00 J</strong></p>
    </div>
    <button class="btn" id="irr-reset" style="width:100%;margin-top:0.75rem;background:var(--bg-dark);border:1px solid var(--border-color);">Reset</button>
  </div>
</div>
<div class="grid-2" style="margin-top:2rem;">
  <div class="card">
    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Sources of Irreversibility</h3>
    <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
      <li><strong>Friction:</strong> Converts kinetic energy to heat (W_lost = μmgd)</li>
      <li><strong>Unrestrained Expansion:</strong> Gas expands into vacuum, W=0 but ΔS>0</li>
      <li><strong>Heat Transfer across ΔT:</strong> ΔS_gen = Q(1/T_cold − 1/T_hot) > 0</li>
      <li><strong>Mixing:</strong> ΔS_mix = −nR Σ(x_i ln x_i) > 0</li>
    </ul>
  </div>
  <div class="card">
    <h3 style="color:var(--accent);margin-bottom:0.5rem;">Real-Life: Car Braking</h3>
    <p>When you brake, kinetic energy converts to heat via friction pads. The car slows (ordered KE → disordered thermal energy). You can never recover that heat back into motion — this is irreversibility. The entropy of the universe increases permanently.</p>
  </div>
</div>`;

/* ── 2. Onsager Relations ── */
views['onsager'] = `
<div class="grid-2">
  <div class="card canvas-container" id="onsager-container" style="height:680px;padding:0;">
    <canvas id="onsager-canvas"></canvas>
  </div>
  <div class="card controls-panel">
    <h2>Onsager Reciprocal Relations</h2>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
      <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
      <p style="font-size:0.9rem;">Near equilibrium, thermodynamic fluxes <strong>J</strong> are linearly related to forces <strong>X</strong> by phenomenological coefficients <strong>L</strong>:</p>
      <p style="font-family:monospace;color:var(--accent);margin:0.5rem 0;">J₁ = L₁₁X₁ + L₁₂X₂<br>J₂ = L₂₁X₁ + L₂₂X₂</p>
      <p style="font-size:0.9rem;"><strong>Onsager proved: L₁₂ = L₂₁</strong> (Nobel Prize 1968). This reciprocity arises from microscopic reversibility (time-reversal symmetry).</p>
    </div>
    <div class="control-group"><label>∇T (thermal force) <span id="ons-gt-val">100</span> K/m</label><input type="range" id="ons-gt" min="0" max="500" value="100"></div>
    <div class="control-group"><label>∇μ (chemical force) <span id="ons-gm-val">50</span> J/mol·m</label><input type="range" id="ons-gm" min="0" max="300" value="50"></div>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
      <p style="margin:0;">Heat Flux J_q: <strong id="ons-jq" style="color:#ef4444;">0 W/m²</strong></p>
      <p style="margin:0;">Mass Flux J_m: <strong id="ons-jm" style="color:#3b82f6;">0 kg/m²s</strong></p>
      <p style="margin:0;">σ (entropy prod): <strong id="ons-sigma" style="color:#a855f7;">0 W/K·m³</strong></p>
    </div>
  </div>
</div>
<div class="grid-2" style="margin-top:2rem;">
  <div class="card">
    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Cross-Coupling Phenomena</h3>
    <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
      <li><strong>Seebeck Effect:</strong> ∇T → electric current (thermocouples)</li>
      <li><strong>Peltier Effect:</strong> electric current → heat flux (Peltier coolers)</li>
      <li><strong>Soret Effect:</strong> ∇T → mass diffusion (thermal diffusion)</li>
      <li><strong>Dufour Effect:</strong> ∇concentration → heat flux</li>
    </ul>
  </div>
  <div class="card">
    <h3 style="color:var(--accent);margin-bottom:0.5rem;">Real-Life: Thermoelectric Generators</h3>
    <p>Spacecraft like Voyager use thermoelectric generators (RTGs). Heat from radioactive decay creates ∇T across a thermoelectric material, generating electricity via Seebeck effect. Onsager relations predict exact coupling between heat and charge transport.</p>
  </div>
</div>`;

/* ── 3. Blackbody Radiation ── */
views['blackbody'] = `
<div class="grid-2">
  <div class="card canvas-container" id="bb-container" style="height:680px;padding:0;">
    <canvas id="bb-canvas"></canvas>
  </div>
  <div class="card controls-panel">
    <h2>Blackbody Radiation</h2>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
      <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
      <p style="font-size:0.9rem;">A <strong>blackbody</strong> absorbs all incident radiation and re-emits it with a spectrum determined only by its temperature. Planck's law resolved the ultraviolet catastrophe:</p>
      <p style="font-family:monospace;color:var(--accent);margin:0.5rem 0;">u(ν,T) = (8πhν³/c³) · 1/(e^(hν/kT) − 1)</p>
    </div>
    <div class="control-group"><label>Temperature T <span id="bb-T-val">5778</span> K</label><input type="range" id="bb-T" min="500" max="15000" value="5778"></div>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
      <p style="margin:0;">Peak λ (Wien): <strong id="bb-peak" style="color:#f59e0b;">502 nm</strong></p>
      <p style="margin:0;">Total Power (Stefan-Boltzmann): <strong id="bb-power" style="color:#ef4444;">6.32×10⁷ W/m²</strong></p>
      <p style="margin:0;font-size:0.85rem;margin-top:0.5rem;color:var(--text-muted);">Wien's Law: λ_max = 2898/T μm·K<br>Stefan-Boltzmann: P = σT⁴ (σ = 5.67×10⁻⁸)</p>
    </div>
  </div>
</div>
<div class="grid-2" style="margin-top:2rem;">
  <div class="card">
    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life: Why Stars Have Colors</h3>
    <p>Our Sun (T≈5778K) peaks at yellow-green (502nm). Betelgeuse (T≈3500K) appears red (λ_peak≈828nm). Sirius (T≈9940K) appears blue-white (λ_peak≈291nm). Wien's displacement law directly explains stellar color from temperature alone.</p>
  </div>
  <div class="card">
    <h3 style="color:var(--accent);margin-bottom:0.5rem;">Key Laws</h3>
    <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
      <li><strong>Rayleigh-Jeans (classical):</strong> u ∝ ν²T — fails at high ν (UV catastrophe)</li>
      <li><strong>Wien's approximation:</strong> u ∝ ν³e^(−hν/kT) — fails at low ν</li>
      <li><strong>Planck's Law:</strong> Exact — introduces energy quantization E=hν</li>
    </ul>
  </div>
</div>`;

/* ── 4. Bose-Einstein & Fermi-Dirac Distributions ── */
views['be-fd-dist'] = `
<div class="grid-2">
  <div class="card canvas-container" id="befd-container" style="height:680px;padding:0;">
    <canvas id="befd-canvas"></canvas>
  </div>
  <div class="card controls-panel">
    <h2>Bose-Einstein &amp; Fermi-Dirac</h2>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
      <h3 style="color:var(--primary);margin-bottom:0.5rem;">Quantum Statistics</h3>
      <p style="font-size:0.9rem;"><strong>Bosons</strong> (photons, phonons): integer spin, can share states.<br><strong>Fermions</strong> (electrons, protons): half-integer spin, Pauli exclusion.</p>
      <p style="font-family:monospace;color:#10b981;margin:0.5rem 0;">⟨n_BE⟩ = 1/(e^((ε−μ)/kT) − 1)</p>
      <p style="font-family:monospace;color:#3b82f6;">⟨n_FD⟩ = 1/(e^((ε−μ)/kT) + 1)</p>
    </div>
    <div class="control-group"><label>Temperature <span id="befd-T-val">300</span> K</label><input type="range" id="befd-T" min="10" max="2000" value="300"></div>
    <div class="control-group"><label>Chemical Potential μ <span id="befd-mu-val">0.5</span> eV</label><input type="range" id="befd-mu" min="0" max="2" step="0.05" value="0.5"></div>
    <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
      <button class="btn" id="befd-show-be" style="flex:1;background:#10b981;">Show BE</button>
      <button class="btn" id="befd-show-fd" style="flex:1;background:#3b82f6;">Show FD</button>
      <button class="btn" id="befd-show-mb" style="flex:1;background:#f59e0b;">Show MB</button>
    </div>
  </div>
</div>
<div class="grid-2" style="margin-top:2rem;">
  <div class="card">
    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life: Lasers &amp; Semiconductors</h3>
    <p><strong>Lasers:</strong> Work because photons are bosons — stimulated emission creates many photons in the same quantum state (Bose-Einstein condensation of light).<br><strong>Semiconductors:</strong> Electron behavior in chips follows Fermi-Dirac statistics. The Fermi level determines conductivity.</p>
  </div>
  <div class="card">
    <h3 style="color:var(--accent);margin-bottom:0.5rem;">Classical Limit</h3>
    <p>At high T or low density, both BE and FD distributions approach the <strong>Maxwell-Boltzmann distribution</strong>: ⟨n_MB⟩ = e^(−(ε−μ)/kT). This is the classical regime where quantum effects are negligible.</p>
  </div>
</div>`;

/* ── 5. Relativistic Thermodynamics ── */
views['relativistic-thermo'] = `
<div class="grid-2">
  <div class="card canvas-container" id="relthermo-container" style="height:680px;padding:0;">
    <canvas id="relthermo-canvas"></canvas>
  </div>
  <div class="card controls-panel">
    <h2>Relativistic Thermodynamics</h2>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
      <h3 style="color:var(--primary);margin-bottom:0.5rem;">Core Concept</h3>
      <p style="font-size:0.9rem;">At relativistic speeds (v→c), thermodynamic quantities transform. The stress-energy tensor unifies energy, momentum, and pressure:</p>
      <p style="font-family:monospace;color:var(--accent);margin:0.5rem 0;">T^μν = (ε+p)u^μu^ν/c² + pg^μν</p>
      <p style="font-size:0.9rem;"><strong>Tolman-Ehrenfest:</strong> T√g₀₀ = const (temperature varies with gravitational potential!)</p>
    </div>
    <div class="control-group"><label>Velocity v/c <span id="rel-v-val">0.00</span></label><input type="range" id="rel-v" min="0" max="0.99" step="0.01" value="0"></div>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
      <p style="margin:0;">Lorentz Factor γ: <strong id="rel-gamma" style="color:#ef4444;">1.000</strong></p>
      <p style="margin:0;">Rest Energy E₀: <strong id="rel-e0" style="color:#3b82f6;">mc²</strong></p>
      <p style="margin:0;">Relativistic Mass-Energy: <strong id="rel-etot" style="color:#a855f7;">γmc²</strong></p>
    </div>
  </div>
</div>
<div class="grid-2" style="margin-top:2rem;">
  <div class="card">
    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Real-Life: GPS Satellites</h3>
    <p>GPS satellites move at ~3.9 km/s and experience weaker gravity than Earth's surface. Both special (time dilation) and general (gravitational redshift) relativistic effects shift their clocks. Without corrections from relativistic thermodynamics, GPS would drift ~10 km/day!</p>
  </div>
  <div class="card">
    <h3 style="color:var(--accent);margin-bottom:0.5rem;">Key Results</h3>
    <ul style="color:var(--text-muted);font-size:0.9rem;padding-left:1.2rem;line-height:2;">
      <li><strong>E = γmc²</strong> (total relativistic energy)</li>
      <li><strong>S is Lorentz invariant</strong> (entropy doesn't change with frame)</li>
      <li><strong>T transforms:</strong> T' = T/γ (Planck-Einstein) or T' = γT (Ott) — debated</li>
      <li><strong>Unruh effect:</strong> T_U = ℏa/(2πck_B) — accelerating observer sees thermal bath</li>
    </ul>
  </div>
</div>`;

/* ── 6. Thermal Equilibrium ── */
views['thermal-equil'] = `
<div class="grid-2">
  <div class="card canvas-container" id="theq-container" style="height:680px;padding:0;">
    <canvas id="theq-canvas"></canvas>
  </div>
  <div class="card controls-panel">
    <h2>Thermal Equilibrium</h2>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
      <h3 style="color:var(--primary);margin-bottom:0.5rem;">Definition</h3>
      <p style="font-size:0.9rem;"><strong>Thermal equilibrium</strong> exists when two bodies in thermal contact have the same temperature and there is no net heat flow between them: <strong>Q_net = 0 when T_A = T_B</strong>.</p>
      <p style="font-size:0.9rem;margin-top:0.5rem;"><strong>Zeroth Law:</strong> If A is in thermal equilibrium with B, and B with C, then A is in equilibrium with C.</p>
    </div>
    <div class="control-group"><label>Body A Temperature <span id="theq-ta-val">500</span> K</label><input type="range" id="theq-ta" min="200" max="800" value="500"></div>
    <div class="control-group"><label>Body B Temperature <span id="theq-tb-val">300</span> K</label><input type="range" id="theq-tb" min="200" max="800" value="300"></div>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
      <p style="margin:0;">ΔT = <strong id="theq-dt" style="color:#ef4444;">200 K</strong></p>
      <p style="margin:0;">Heat Flow Q: <strong id="theq-q" style="color:#f59e0b;">→ A to B</strong></p>
      <p style="margin:0;">Status: <strong id="theq-status" style="color:#3b82f6;">NOT in equilibrium</strong></p>
    </div>
    <button class="btn" id="theq-equalize" style="width:100%;margin-top:0.75rem;background:var(--accent);">Bring to Equilibrium</button>
  </div>
</div>
<div class="card" style="margin-top:2rem;">
  <h3 style="color:var(--accent);margin-bottom:0.5rem;">Real-Life: Mercury Thermometer</h3>
  <p>A thermometer works by reaching thermal equilibrium with the body it measures. Mercury expands/contracts until T_mercury = T_body. The zeroth law guarantees that two objects measured at the same temperature by a thermometer are in mutual thermal equilibrium.</p>
</div>`;

/* ── 7. Mechanical Equilibrium ── */
views['mech-equil'] = `
<div class="grid-2">
  <div class="card canvas-container" id="meq-container" style="height:680px;padding:0;">
    <canvas id="meq-canvas"></canvas>
  </div>
  <div class="card controls-panel">
    <h2>Mechanical Equilibrium</h2>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
      <h3 style="color:var(--primary);margin-bottom:0.5rem;">Definition</h3>
      <p style="font-size:0.9rem;"><strong>Mechanical equilibrium</strong> exists when there is no unbalanced force or pressure difference across a boundary: <strong>P_A = P_B</strong> (no net work transfer).</p>
      <p style="font-size:0.9rem;margin-top:0.5rem;">If P_A > P_B, the boundary (piston) moves until pressures equalize. Work W = ∫PdV is done during this process.</p>
    </div>
    <div class="control-group"><label>Chamber A Pressure <span id="meq-pa-val">300</span> kPa</label><input type="range" id="meq-pa" min="50" max="600" value="300"></div>
    <div class="control-group"><label>Chamber B Pressure <span id="meq-pb-val">100</span> kPa</label><input type="range" id="meq-pb" min="50" max="600" value="100"></div>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
      <p style="margin:0;">ΔP = <strong id="meq-dp" style="color:#ef4444;">200 kPa</strong></p>
      <p style="margin:0;">Piston Motion: <strong id="meq-dir" style="color:#f59e0b;">→ A pushes B</strong></p>
      <p style="margin:0;">Status: <strong id="meq-status" style="color:#3b82f6;">NOT in equilibrium</strong></p>
    </div>
    <button class="btn" id="meq-equalize" style="width:100%;margin-top:0.75rem;background:var(--accent);">Release Piston</button>
  </div>
</div>
<div class="card" style="margin-top:2rem;">
  <h3 style="color:var(--accent);margin-bottom:0.5rem;">Real-Life: Balloon Inflation</h3>
  <p>When you inflate a balloon, the air inside is at higher pressure than outside. The elastic membrane stretches until P_inside = P_outside + P_elastic. At that point, mechanical equilibrium is reached and the balloon stops expanding.</p>
</div>`;

/* ── 8. Chemical Equilibrium (Advanced) ── */
views['chem-equil-adv'] = `
<div class="grid-2">
  <div class="card canvas-container" id="ceq-container" style="height:680px;padding:0;">
    <canvas id="ceq-canvas"></canvas>
  </div>
  <div class="card controls-panel">
    <h2>Chemical Equilibrium (Advanced)</h2>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-bottom:1rem;">
      <h3 style="color:var(--primary);margin-bottom:0.5rem;">Definition</h3>
      <p style="font-size:0.9rem;"><strong>Chemical equilibrium</strong> exists when the chemical potential μ of each species is equal in all phases and the net reaction rate is zero:</p>
      <p style="font-family:monospace;color:var(--accent);margin:0.5rem 0;">Σν_i·μ_i = 0 (at equilibrium)<br>ΔG = ΔG° + RT ln(Q) = 0<br>K_eq = e^(−ΔG°/RT)</p>
    </div>
    <div class="control-group"><label>Temperature <span id="ceq-T-val">298</span> K</label><input type="range" id="ceq-T" min="200" max="1000" value="298"></div>
    <div class="control-group"><label>ΔG° <span id="ceq-dg-val">-20</span> kJ/mol</label><input type="range" id="ceq-dg" min="-100" max="100" value="-20"></div>
    <div class="glass" style="padding:1rem;border-radius:8px;margin-top:1rem;">
      <p style="margin:0;">K_eq = <strong id="ceq-keq" style="color:#10b981;">3200</strong></p>
      <p style="margin:0;">Direction: <strong id="ceq-dir" style="color:var(--accent);">Products favored</strong></p>
    </div>
  </div>
</div>
<div class="grid-2" style="margin-top:2rem;">
  <div class="card">
    <h3 style="color:var(--primary);margin-bottom:0.5rem;">Complete Thermodynamic Equilibrium</h3>
    <p>A system is in <strong>complete thermodynamic equilibrium</strong> when ALL three are satisfied simultaneously:<br>
    • <strong>Thermal:</strong> T uniform (no heat flow)<br>
    • <strong>Mechanical:</strong> P uniform (no work transfer)<br>
    • <strong>Chemical:</strong> μ uniform (no mass transfer or reaction)</p>
  </div>
  <div class="card">
    <h3 style="color:var(--accent);margin-bottom:0.5rem;">Real-Life: Industrial Ammonia</h3>
    <p>The Haber process (N₂+3H₂⇌2NH₃) uses Le Chatelier's principle: high P (200 atm) shifts equilibrium right (fewer moles of gas), but high T shifts it left (exothermic). Engineers compromise at 450°C with an iron catalyst to achieve economically viable K_eq.</p>
  </div>
</div>`;

// ═══════════════════════════════════════════════
// Register titles
// ═══════════════════════════════════════════════
viewTitles['irreversible']       = 'Advanced: Irreversible Processes';
viewTitles['onsager']            = 'Advanced: Onsager Reciprocal Relations';
viewTitles['blackbody']          = 'Advanced: Blackbody Radiation';
viewTitles['be-fd-dist']         = 'Advanced: Bose-Einstein & Fermi-Dirac Distributions';
viewTitles['relativistic-thermo']= 'Advanced: Relativistic Thermodynamics';
viewTitles['thermal-equil']      = 'Intermediate: Thermal Equilibrium';
viewTitles['mech-equil']         = 'Intermediate: Mechanical Equilibrium';
viewTitles['chem-equil-adv']     = 'Intermediate: Chemical Equilibrium (Advanced)';

// ── Override heat-transfer view (fix corrupted Unicode + add definitions) ──
views['heat-transfer'] = `
<div class="grid-2">
  <div class="card canvas-container" style="padding:0; min-height:500px; background:#020617;">
    <canvas id="ht-canvas"></canvas>
  </div>
  <div class="card controls-panel">
    <h2>Heat Transfer Simulator</h2>
    <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
      <button class="btn ht-mode-btn active" data-mode="conduction" style="flex:1;">Conduction</button>
      <button class="btn ht-mode-btn" data-mode="convection" style="flex:1;">Convection</button>
      <button class="btn ht-mode-btn" data-mode="radiation" style="flex:1;">Radiation</button>
    </div>
    <div class="control-group">
      <label>Source Temperature: <span id="ht-source-val">800 K</span></label>
      <input type="range" id="ht-source-temp" min="300" max="1500" value="800">
    </div>
    <div class="glass" style="padding:1rem; border-radius:8px; margin-top:1rem; border-left:4px solid var(--primary);">
      <h3 style="color:var(--primary); margin-bottom:0.5rem;">Laws of Heat Transfer</h3>
      <ul style="font-size:0.85rem; color:var(--text-muted); margin-left:1.2rem; line-height:1.8;">
        <li><strong>Conduction (Fourier):</strong> q = -k dT/dx</li>
        <li><strong>Convection (Newton):</strong> Q = hA(T_s - T_f)</li>
        <li><strong>Radiation (Stefan-Boltzmann):</strong> E = sigma * T^4</li>
      </ul>
    </div>
  </div>
</div>
<div class="grid-3" style="margin-top:2rem;">
  <div class="card" style="border-left:4px solid #ef4444;">
    <h3 style="color:#ef4444;">Conduction</h3>
    <p style="font-size:0.9rem;"><strong>Definition:</strong> Transfer of heat through a solid material by molecular vibration and free electron movement, WITHOUT any bulk motion of the material.</p>
    <p style="font-size:0.85rem; color:var(--text-muted);"><strong>Formula:</strong> Q = kA(T1-T2)/L<br>k = thermal conductivity (W/m-K)<br>A = cross-sectional area, L = thickness</p>
    <p style="font-size:0.85rem; color:var(--accent);"><strong>Example:</strong> Touching a hot metal spoon in coffee. Heat flows through the solid metal from hot end to cold end.</p>
  </div>
  <div class="card" style="border-left:4px solid #3b82f6;">
    <h3 style="color:#3b82f6;">Convection</h3>
    <p style="font-size:0.9rem;"><strong>Definition:</strong> Transfer of heat by bulk movement of a fluid (liquid or gas). Hot fluid rises (less dense), cool fluid sinks, creating circulation currents.</p>
    <p style="font-size:0.85rem; color:var(--text-muted);"><strong>Formula:</strong> Q = hA(T_surface - T_fluid)<br>h = convective heat transfer coefficient (W/m^2-K)<br>Natural vs Forced convection</p>
    <p style="font-size:0.85rem; color:var(--accent);"><strong>Example:</strong> Boiling water in a pot. Hot water at bottom rises, cool water at top sinks, creating convection currents.</p>
  </div>
  <div class="card" style="border-left:4px solid #f59e0b;">
    <h3 style="color:#f59e0b;">Radiation</h3>
    <p style="font-size:0.9rem;"><strong>Definition:</strong> Transfer of heat through electromagnetic waves (photons). Does NOT require any medium - works through vacuum.</p>
    <p style="font-size:0.85rem; color:var(--text-muted);"><strong>Formula:</strong> Q = epsilon * sigma * A * T^4<br>sigma = 5.67 x 10^-8 W/m^2-K^4<br>epsilon = emissivity (0 to 1)</p>
    <p style="font-size:0.85rem; color:var(--accent);"><strong>Example:</strong> Feeling the warmth of the Sun on your skin. Solar radiation travels 150 million km through vacuum to reach Earth.</p>
  </div>
</div>`;

// ── Remove personal name from Antigravity Propulsion monograph ──
(function() {
  const origLoadView = app.loadView.bind(app);
  app.loadView = function(viewName) {
    origLoadView(viewName);
    if (viewName === 'master-antigrav') {
      setTimeout(() => {
        // Remove author line
        const container = document.getElementById('view-container');
        if (!container) return;
        const spans = container.querySelectorAll('span');
        spans.forEach(s => {
          if (s.textContent.includes('Author:') || s.textContent.includes('Tejaswini') || s.textContent.includes('01FE24BME')) {
            s.style.display = 'none';
          }
          // Also hide the bullet next to it
          if (s.textContent.trim() === '\u2022' || s.innerHTML === '&bull;') {
            const prev = s.previousElementSibling;
            const next = s.nextElementSibling;
            if ((prev && prev.style.display === 'none') || (next && next.style.display === 'none')) {
              s.style.display = 'none';
            }
          }
        });
        // Fix the subtitle
        const ps = container.querySelectorAll('p');
        ps.forEach(p => {
          if (p.textContent.includes('PhD Research')) {
            p.textContent = 'A Speculative Research Framework on Spacetime-Metric Manipulation via Advanced Thermodynamics';
          }
        });
      }, 200);
    }
  };
})();

console.log('[PATCH] All views + antigravity fix registered successfully');

