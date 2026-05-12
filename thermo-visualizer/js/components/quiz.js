window.quizSystem = {
    questions: [
        // Fundamentals
        { q: "Which thermodynamic process occurs at constant temperature?", options: ["Isobaric","Isochoric","Isothermal","Adiabatic"], answer: 2 },
        { q: "What defines an isolated system?", options: ["Mass can cross, energy cannot","Energy can cross, mass cannot","Neither mass nor energy can cross","Both mass and energy can cross"], answer: 2 },
        { q: "In a P-V diagram, what does the area under the curve represent?", options: ["Heat Transfer","Work Done","Internal Energy","Entropy"], answer: 1 },
        { q: "The Zeroth Law of Thermodynamics establishes the concept of:", options: ["Entropy","Work","Thermal Equilibrium","Enthalpy"], answer: 2 },
        { q: "Which system exchanges both mass AND energy with surroundings?", options: ["Isolated","Closed","Open","Adiabatic"], answer: 2 },
        { q: "A diathermic wall allows:", options: ["Mass transfer only","Heat transfer only","No transfer","Both mass and heat"], answer: 1 },
        { q: "An adiabatic wall prevents:", options: ["Mass transfer","Work transfer","Heat transfer","Momentum transfer"], answer: 2 },
        { q: "Which property is NOT an intensive property?", options: ["Temperature","Pressure","Volume","Density"], answer: 2 },
        { q: "Specific volume is the reciprocal of:", options: ["Pressure","Temperature","Density","Entropy"], answer: 2 },
        { q: "The state of a pure substance in equilibrium is defined by:", options: ["One property","Two independent intensive properties","Three properties","Four properties"], answer: 1 },

        // First Law
        { q: "The First Law of Thermodynamics states energy is:", options: ["Created in reactions","Destroyed in reactions","Conserved (cannot be created/destroyed)","Always converted to heat"], answer: 2 },
        { q: "For a closed system, the First Law is: Q - W =", options: ["ΔH","ΔU","ΔS","ΔG"], answer: 1 },
        { q: "In an isochoric process, the work done W equals:", options: ["PΔV","nRΔT","0","QΔT"], answer: 2 },
        { q: "Enthalpy H is defined as:", options: ["U - PV","U + PV","TS - PV","TS + PV"], answer: 1 },
        { q: "At constant pressure, the heat transfer equals:", options: ["ΔU","ΔH","ΔS","ΔG"], answer: 1 },
        { q: "For an ideal gas, internal energy U depends only on:", options: ["Pressure","Volume","Temperature","Entropy"], answer: 2 },
        { q: "Cp - Cv for an ideal gas equals:", options: ["γ","R","kB","0"], answer: 1 },
        { q: "The ratio γ = Cp/Cv for a diatomic ideal gas is approximately:", options: ["1.0","1.2","1.4","1.67"], answer: 2 },
        { q: "Work done in isothermal expansion of ideal gas is:", options: ["P(V2-V1)","nRT ln(V2/V1)","(P1V1-P2V2)/(γ-1)","0"], answer: 1 },
        { q: "A throttling process is:", options: ["Isobaric","Isenthalpic","Isentropic","Isothermal"], answer: 1 },

        // Second Law & Entropy
        { q: "The Second Law states that entropy of an isolated system:", options: ["Always decreases","Always increases or stays constant","Remains constant","First decreases then increases"], answer: 1 },
        { q: "A Carnot engine operates between Th=1000K and Tc=300K. Its efficiency is:", options: ["30%","50%","70%","100%"], answer: 2 },
        { q: "Clausius inequality states that for any cycle: ∮(dQ/T) is:", options: ["≥ 0","≤ 0","= 0","> 0 always"], answer: 1 },
        { q: "Entropy is a measure of:", options: ["Order","Disorder/randomness","Energy","Enthalpy"], answer: 1 },
        { q: "For a reversible adiabatic process, entropy change ΔS =", options: ["> 0","< 0","= 0","∞"], answer: 2 },
        { q: "The Kelvin-Planck statement says it is impossible to build a heat engine that:", options: ["Exchanges heat with two reservoirs","Converts ALL heat to work in a cycle","Operates in a cycle","Rejects heat to cold reservoir"], answer: 1 },
        { q: "Clausius statement says heat cannot flow spontaneously from:", options: ["Hot to cold","Cold to hot","High pressure to low pressure","Low pressure to high pressure"], answer: 1 },
        { q: "The entropy change for an ideal gas process ΔS = nCv ln(T2/T1) + nR ln(V2/V1). This is for:", options: ["Isobaric","Isochoric","General process","Adiabatic"], answer: 2 },
        { q: "Availability (or exergy) is:", options: ["Total energy","Maximum useful work","Enthalpy","Gibbs free energy"], answer: 1 },
        { q: "An irreversible process generates:", options: ["Negative entropy","Zero entropy","Positive entropy","Infinite entropy"], answer: 2 },

        // Carnot & Power Cycles
        { q: "The Carnot cycle consists of:", options: ["Two isothermal + two adiabatic processes","Two isobaric + two isochoric processes","Four isothermal processes","Four adiabatic processes"], answer: 0 },
        { q: "Carnot efficiency depends on:", options: ["Working fluid","Reservoir temperatures only","Engine material","Speed of operation"], answer: 1 },
        { q: "The Otto cycle models:", options: ["Diesel engines","Petrol (spark ignition) engines","Steam turbines","Gas turbines"], answer: 1 },
        { q: "Otto cycle efficiency η = 1 - 1/r^(γ-1). Here r is:", options: ["Pressure ratio","Compression ratio","Cut-off ratio","Temperature ratio"], answer: 1 },
        { q: "The Diesel cycle has which process instead of isochoric heat addition?", options: ["Isothermal","Isobaric","Adiabatic","Polytropic"], answer: 1 },
        { q: "Brayton cycle is used in:", options: ["Car petrol engines","Steam power plants","Gas turbines/jet engines","Refrigerators"], answer: 2 },
        { q: "Brayton efficiency η = 1 - 1/rp^((γ-1)/γ). Here rp is:", options: ["Compression ratio","Pressure ratio","Temperature ratio","Cut-off ratio"], answer: 1 },
        { q: "For same compression ratio, which cycle is most efficient?", options: ["Otto","Diesel","Dual","All equal"], answer: 0 },
        { q: "Mean Effective Pressure (MEP) is defined as:", options: ["Maximum pressure","Average pressure","Net work / Displacement volume","Net heat / Temperature"], answer: 2 },
        { q: "Regeneration in a Brayton cycle improves efficiency by:", options: ["Increasing compression ratio","Using exhaust heat to preheat compressed air","Increasing turbine inlet temperature","Decreasing pressure ratio"], answer: 1 },

        // Rankine & Steam
        { q: "The Rankine cycle sequence is:", options: ["Pump→Boiler→Turbine→Condenser","Boiler→Turbine→Condenser→Pump","Turbine→Pump→Boiler→Condenser","Condenser→Boiler→Turbine→Pump"], answer: 0 },
        { q: "Dryness fraction x = 0 means:", options: ["Superheated steam","Dry saturated steam","Wet saturated steam (all liquid)","Subcooled liquid"], answer: 2 },
        { q: "Dryness fraction x = 1 means:", options: ["All liquid","All vapor (dry saturated steam)","Superheated steam","Subcooled liquid"], answer: 1 },
        { q: "At the critical point of water, pressure is approximately:", options: ["1 bar","10 bar","100 bar","221.2 bar"], answer: 3 },
        { q: "Superheating steam in a Rankine cycle:", options: ["Decreases efficiency","Increases efficiency and dryness at turbine exit","Increases condenser pressure","Decreases work output"], answer: 1 },
        { q: "Reheating in Rankine cycle:", options: ["Increases condenser pressure","Improves efficiency and prevents excessive condensation in turbine","Decreases boiler pressure","Reduces pump work"], answer: 1 },
        { q: "Enthalpy of wet steam h = hf + x·hfg. hfg is called:", options: ["Enthalpy of liquid","Latent heat of vaporization","Sensible heat","Superheat enthalpy"], answer: 1 },
        { q: "The pump in a Rankine cycle does work on:", options: ["Steam","Saturated vapor","Liquid water","Both liquid and vapor"], answer: 2 },
        { q: "Condenser pressure in a Rankine cycle is typically:", options: ["Above atmospheric","At atmospheric","Below atmospheric (vacuum)","At critical pressure"], answer: 2 },
        { q: "Feed water heaters improve Rankine cycle efficiency by:", options: ["Cooling the water","Preheating feed water using extracted steam (regeneration)","Increasing condenser pressure","Superheating steam"], answer: 1 },

        // Refrigeration & HVAC
        { q: "COP of a refrigerator = Tc/(Th-Tc). What does COP stand for?", options: ["Coefficient Of Pressure","Coefficient Of Performance","Cycle Operating Point","Cooling Output Power"], answer: 1 },
        { q: "A refrigerator is essentially:", options: ["A heat engine","A Carnot cycle run in reverse","A Rankine cycle","An Otto cycle"], answer: 1 },
        { q: "In the vapor-compression refrigeration cycle, the component that reduces refrigerant pressure is:", options: ["Compressor","Condenser","Evaporator","Expansion valve"], answer: 3 },
        { q: "The evaporator in a refrigerator:", options: ["Rejects heat to surroundings","Absorbs heat from the refrigerated space","Increases refrigerant pressure","Condenses refrigerant"], answer: 1 },
        { q: "COP of a heat pump = Th/(Th-Tc). This is always:", options: ["Less than 1","Equal to 1","Greater than 1","Equal to Carnot efficiency"], answer: 2 },
        { q: "The condenser in a refrigeration system:", options: ["Absorbs heat from food","Rejects heat to the surroundings (kitchen)","Expands the refrigerant","Compresses the refrigerant"], answer: 1 },
        { q: "Refrigerant R-134a replaced R-12 primarily because:", options: ["Higher COP","Lower boiling point","Doesn't deplete the ozone layer","Lower cost"], answer: 2 },
        { q: "COP of refrigerator + COP of heat pump for same temperatures =", options: ["1","2","COP_ref","COP_ref + 1"], answer: 3 },
        { q: "In air conditioning, the 'ton of refrigeration' unit equals approximately:", options: ["1 kW","3.5 kW","7 kW","12 kW"], answer: 1 },
        { q: "Which process in vapor-compression cycle is isenthalpic (constant enthalpy)?", options: ["Compression","Condensation","Evaporation","Expansion through valve"], answer: 3 },

        // Heat Transfer
        { q: "Fourier's law of heat conduction: Q = -kA(dT/dx). Here k is:", options: ["Thermal diffusivity","Thermal conductivity","Heat transfer coefficient","Stefan-Boltzmann constant"], answer: 1 },
        { q: "Newton's law of cooling relates to:", options: ["Conduction","Convection","Radiation","All three"], answer: 1 },
        { q: "Stefan-Boltzmann law: E = σT⁴ applies to:", options: ["Conduction","Convection","Radiation","Evaporation"], answer: 2 },
        { q: "The Stefan-Boltzmann constant σ ≈", options: ["5.67×10⁻⁸ W/m²K⁴","8.314 J/mol·K","1.38×10⁻²³ J/K","6.022×10²³ mol⁻¹"], answer: 0 },
        { q: "Fourier number (Fo) is a dimensionless number for:", options: ["Forced convection","Transient heat conduction","Radiation heat transfer","Mass transfer"], answer: 1 },
        { q: "Biot number Bi = hL/k. When Bi << 1:", options: ["Radiation dominates","Lumped capacitance method is valid","Conduction resistance is dominant","Natural convection is negligible"], answer: 1 },
        { q: "In a heat exchanger, the LMTD method uses:", options: ["Arithmetic mean temperature difference","Log mean temperature difference","Geometric mean temperature difference","Harmonic mean temperature difference"], answer: 1 },
        { q: "Overall heat transfer coefficient U for a composite wall accounts for:", options: ["Only conduction","Only convection","Conduction + convection (and radiation)","Radiation only"], answer: 2 },
        { q: "Thermal resistance R_cond = L/(kA). Increasing thickness L:", options: ["Decreases thermal resistance","Increases thermal resistance","Has no effect","Depends on material"], answer: 1 },
        { q: "Which has the highest thermal conductivity?", options: ["Air","Water","Steel","Diamond"], answer: 3 },

        // Maxwell-Boltzmann & Statistical
        { q: "The Maxwell-Boltzmann distribution describes:", options: ["Energy levels in atoms","Speed distribution of gas molecules","Entropy production rate","Pressure distribution in atmosphere"], answer: 1 },
        { q: "As temperature increases, the Maxwell-Boltzmann curve:", options: ["Becomes narrower and taller","Becomes wider and shorter (flattens)","Stays the same","Shifts to lower speeds"], answer: 1 },
        { q: "The most probable speed in Maxwell-Boltzmann distribution is:", options: ["Greater than average speed","Equal to average speed","Less than average speed","Infinite"], answer: 2 },
        { q: "Boltzmann's entropy formula is S =", options: ["kB ln Ω","kB / Ω","Ω / kB","kB × Ω"], answer: 0 },
        { q: "Boltzmann constant kB ≈", options: ["6.022×10²³ J/K","1.38×10⁻²³ J/K","8.314 J/mol·K","5.67×10⁻⁸ W/m²K⁴"], answer: 1 },
        { q: "The average kinetic energy of a monatomic ideal gas molecule is:", options: ["½kBT","kBT","3/2 kBT","3kBT"], answer: 2 },
        { q: "Root mean square (rms) speed of gas molecules is proportional to:", options: ["T","√T","T²","1/T"], answer: 1 },
        { q: "Degrees of freedom of a diatomic gas molecule at room temperature =", options: ["3","5","6","7"], answer: 1 },
        { q: "The equipartition theorem assigns _____ energy per degree of freedom:", options: ["kBT","½kBT","3/2 kBT","2kBT"], answer: 1 },
        { q: "Maxwell's Demon thought experiment violated which law?", options: ["First Law","Second Law (entropy)","Third Law","Zeroth Law"], answer: 1 },

        // Phase Change & Chemical Thermo
        { q: "At the triple point of water, how many phases coexist?", options: ["1","2","3","4"], answer: 2 },
        { q: "Gibbs free energy G = H - TS. Spontaneous reactions have ΔG:", options: ["> 0","> 1","< 0","= 0"], answer: 2 },
        { q: "Le Chatelier's principle states: when a system at equilibrium is disturbed:", options: ["It will react to counteract the disturbance","It will amplify the disturbance","Equilibrium constant changes","Temperature always increases"], answer: 0 },
        { q: "An exothermic reaction has ΔH:", options: ["> 0","< 0","= 0","= ΔG"], answer: 1 },
        { q: "At a phase change (melting/boiling), temperature:", options: ["Increases rapidly","Decreases rapidly","Remains constant while latent heat is absorbed","Increases then decreases"], answer: 2 },
        { q: "Which phase transition requires the most latent heat for water?", options: ["Melting (solid→liquid)","Vaporization (liquid→gas)","Sublimation (solid→gas)","All equal"], answer: 1 },
        { q: "Clausius-Clapeyron equation relates:", options: ["Pressure and volume","Saturation pressure and temperature for phase change","Entropy and temperature","Enthalpy and Gibbs energy"], answer: 1 },
        { q: "A first-order phase transition is characterized by:", options: ["Continuous order parameter","Discontinuous entropy (latent heat)","No latent heat","Diverging specific heat at Tc"], answer: 1 },
        { q: "The Haber process for NH3 uses high pressure because:", options: ["Faster reaction rate","Le Chatelier: fewer moles on product side","Higher temperature needed","Lower activation energy"], answer: 1 },
        { q: "Gibbs phase rule: F = C - P + 2. For pure water at triple point, F =", options: ["0","1","2","3"], answer: 0 },

        // Advanced Topics
        { q: "The Third Law of Thermodynamics states that at absolute zero, entropy of a perfect crystal is:", options: ["Maximum","Undefined","Zero","Equal to Boltzmann constant"], answer: 2 },
        { q: "Absolute zero temperature in Celsius is:", options: ["-100°C","-200°C","-273.15°C","-373.15°C"], answer: 2 },
        { q: "Which thermodynamic potential is minimized at equilibrium under constant T and P?", options: ["Internal energy U","Enthalpy H","Helmholtz free energy F","Gibbs free energy G"], answer: 3 },
        { q: "Helmholtz free energy F = U - TS is minimized at equilibrium under constant:", options: ["T and P","T and V","S and V","S and P"], answer: 1 },
        { q: "Maxwell relation (∂S/∂V)_T = (∂P/∂T)_V comes from which potential?", options: ["U","H","F (Helmholtz)","G (Gibbs)"], answer: 2 },
        { q: "Joule-Thomson coefficient μ_JT = (∂T/∂P)_H. For ideal gas μ_JT =", options: ["> 0","< 0","= 0","= ∞"], answer: 2 },
        { q: "Inversion temperature is where Joule-Thomson coefficient changes from:", options: ["Positive to negative","Negative to positive","Zero to infinity","Constant to variable"], answer: 0 },
        { q: "The Carnot COP of a heat pump between 300K and 350K is:", options: ["5","7","350/50 = 7","0.857"], answer: 2 },
        { q: "Landauer's principle states that erasing 1 bit of information requires minimum energy of:", options: ["kBT","kBT ln2","kBT/2","2kBT"], answer: 1 },
        { q: "Curzon-Ahlborn efficiency at maximum power output is:", options: ["1 - Tc/Th","1 - √(Tc/Th)","√(1 - Tc/Th)","Tc/Th"], answer: 1 },
    ],
    
    botNames: [
        "ThermoBot_99","HeatEngine_X","EntropyKing","CarnotAce",
        "BoltzmannBot","RankineRacer","MaxwellMind","IsoProf",
        "SteamLord","PVMaster","QEngineer","ThermoDuke",
        "CycleSlayer","AbsoluteZero","EnthaBot","GibbsGuru"
    ],
    
    currentQ: 0,
    botScore: 0,
    playerScore: 0,
    botTimer: null,
    shuffledQ: [],
    opponentName: "ThermoBot_99",
    
    init() {
        this.currentQ = 0;
        this.botScore = 0;
        this.playerScore = 0;
        this.opponentName = this.botNames[Math.floor(Math.random() * this.botNames.length)];
        if(this.botTimer) clearTimeout(this.botTimer);
        
        // Shuffle and pick 10 questions
        const shuffled = [...this.questions].sort(() => Math.random() - 0.5);
        this.shuffledQ = shuffled.slice(0, 10);
        
        const container = document.getElementById('quiz-container');
        if(!container) return;
        
        container.innerHTML = `
            <div style="text-align:center; padding: 2rem;">
                <div style="font-size:3rem;margin-bottom:1rem;">⚔️</div>
                <h3 style="color:var(--text-main);">Finding opponent...</h3>
                <div style="margin: 1rem 0; color: var(--primary);">Matching you with <strong style="color:#ef4444;">${this.opponentName}</strong></div>
                <div style="color:var(--text-muted); font-size:0.9rem;">10 questions • Random selection from 100+ bank</div>
            </div>
        `;
        
        setTimeout(() => { this.renderQuestion(); }, 1800);
    },
    
    renderQuestion() {
        const container = document.getElementById('quiz-container');
        if(!container) return;
        
        if (this.currentQ >= this.shuffledQ.length) {
            const win = this.playerScore >= this.botScore;
            const xpEarned = win ? 100 + this.playerScore * 2 : this.playerScore * 2;
            container.innerHTML = `
                <div style="text-align:center; padding: 1rem;">
                    <div style="font-size:4rem;margin-bottom:1rem;">${win ? '🏆' : '😞'}</div>
                    <h3 style="color: ${win ? '#4ade80' : '#ef4444'}; font-size: 1.5rem; margin-bottom: 1rem;">
                        ${win ? 'Victory!' : 'Defeat!'}
                    </h3>
                    <div style="background:var(--panel-bg);border:1px solid var(--border-color);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;">
                        <p style="margin-bottom: 0.5rem; color:var(--text-muted);">Final Score</p>
                        <p style="font-size:1.3rem;"><strong style="color:var(--primary);">You: ${this.playerScore}</strong> &nbsp;|&nbsp; <strong style="color:#ef4444;">${this.opponentName}: ${this.botScore}</strong></p>
                        <p style="color:#fbbf24;margin-top:0.5rem;">+${xpEarned} XP earned!</p>
                    </div>
                    <button class="btn" style="margin-top: 0.5rem; background:var(--primary);" onclick="window.quizSystem.init()">🔄 New Match</button>
                </div>
            `;
            if(win) window.app.addXP(xpEarned);
            else window.app.addXP(xpEarned);
            return;
        }
        
        const qData = this.shuffledQ[this.currentQ];
        const progress = ((this.currentQ) / this.shuffledQ.length * 100).toFixed(0);
        
        let html = `
            <div style="margin-bottom:1rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                    <span style="color:var(--primary);font-weight:bold;">Q${this.currentQ + 1}/${this.shuffledQ.length}</span>
                    <span style="color:#ef4444;font-size:0.9rem;">vs ${this.opponentName}</span>
                </div>
                <div style="background:var(--bg-dark);border-radius:99px;height:6px;overflow:hidden;">
                    <div style="background:var(--primary);height:100%;width:${progress}%;transition:width 0.4s;"></div>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:0.75rem;">
                    <div style="background:rgba(59,130,246,0.1);border:1px solid var(--primary);border-radius:8px;padding:0.4rem 1rem;">
                        <span style="color:var(--text-muted);font-size:0.8rem;">YOU</span>
                        <div style="color:var(--primary);font-weight:bold;font-size:1.1rem;">${this.playerScore} pts</div>
                    </div>
                    <div style="background:rgba(239,68,68,0.1);border:1px solid #ef4444;border-radius:8px;padding:0.4rem 1rem;text-align:right;">
                        <span style="color:var(--text-muted);font-size:0.8rem;">${this.opponentName}</span>
                        <div style="color:#ef4444;font-weight:bold;font-size:1.1rem;">${this.botScore} pts</div>
                    </div>
                </div>
            </div>
            <div id="question-text" style="font-size:1.1rem;margin-bottom:1.5rem;font-weight:500;color:var(--text-main);padding:1rem;background:var(--panel-bg);border-radius:8px;border-left:4px solid var(--accent);">${qData.q}</div>
            <div id="options-container" style="display:flex;flex-direction:column;gap:0.75rem;">
        `;
        
        html += qData.options.map((opt, index) => `
            <button class="btn" style="background:var(--panel-bg);border:1px solid var(--border-color);text-align:left;padding:0.9rem 1rem;width:100%;transition:all 0.2s;border-radius:8px;"
                    onclick="window.quizSystem.checkAnswer(${index}, this)"
                    onmouseover="this.style.background='rgba(59,130,246,0.15)';this.style.borderColor='var(--primary)'"
                    onmouseout="this.style.background='var(--panel-bg)';this.style.borderColor='var(--border-color)'">
                <span style="color:var(--accent);margin-right:0.5rem;font-weight:bold;">${String.fromCharCode(65+index)}.</span> ${opt}
            </button>
        `).join('');
        
        html += `</div><div id="quiz-feedback" style="margin-top:1rem;font-weight:bold;text-align:center;min-height:24px;"></div>`;
        
        container.innerHTML = html;
        
        // Bot answers after random delay
        const botDelay = Math.random() * 4000 + 3000;
        this.botTimer = setTimeout(() => {
            const feedback = document.getElementById('quiz-feedback');
            if(feedback) {
                feedback.textContent = `${this.opponentName} answered first!`;
                feedback.style.color = '#ef4444';
                this.botScore += 10;
                this.disableButtons();
                setTimeout(() => { this.currentQ++; this.renderQuestion(); }, 1500);
            }
        }, botDelay);
    },
    
    disableButtons() {
        const cont = document.getElementById('options-container');
        if(cont) cont.querySelectorAll('button').forEach(b => b.disabled = true);
    },
    
    checkAnswer(index, btnElement) {
        clearTimeout(this.botTimer);
        this.disableButtons();
        
        const feedback = document.getElementById('quiz-feedback');
        const qData = this.shuffledQ[this.currentQ];
        
        if (index === qData.answer) {
            btnElement.style.background = 'rgba(74,222,128,0.2)';
            btnElement.style.borderColor = '#4ade80';
            feedback.style.color = '#4ade80';
            feedback.textContent = '✅ Correct! +10 pts';
            this.playerScore += 10;
            window.app.addXP(20);
        } else {
            btnElement.style.background = 'rgba(239,68,68,0.2)';
            btnElement.style.borderColor = '#ef4444';
            // Highlight correct answer
            const buttons = document.getElementById('options-container').querySelectorAll('button');
            buttons[qData.answer].style.background = 'rgba(74,222,128,0.2)';
            buttons[qData.answer].style.borderColor = '#4ade80';
            feedback.style.color = '#ef4444';
            feedback.textContent = `❌ Wrong! Correct: ${String.fromCharCode(65+qData.answer)}`;
            this.botScore += 10;
        }
        
        setTimeout(() => { this.currentQ++; this.renderQuestion(); }, 2000);
    }
};
