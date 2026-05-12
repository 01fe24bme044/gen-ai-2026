/**
 * Numerical Problem Bank - Restored
 */
window.currentProblem = {};

window.generateProblem = function(topic) {
    const display = document.getElementById('problem-display');
    const solSec  = document.getElementById('solution-section');
    if (!display || !solSec) return;

    document.getElementById('answer-feedback').innerText = '';
    document.getElementById('user-answer').value = '';
    const steps_el = document.getElementById('solution-steps');
    if (steps_el) steps_el.style.display = 'none';

    let text = '', answer = 0, steps = '';

    if (topic === 'carnot') {
        const tc = Math.floor(Math.random()*200)+200;
        const th = Math.floor(Math.random()*400)+600;
        text = `A Carnot engine runs between Th=${th} K and Tc=${tc} K. Find thermal efficiency (%).`;
        answer = (1 - tc/th)*100;
        steps = `η = (1 - Tc/Th)×100 = (1 - ${tc}/${th})×100 = <b>${answer.toFixed(2)}%</b>`;
    } else if (topic === 'ideal-gas') {
        const p = Math.floor(Math.random()*5)+1;
        const v = Math.floor(Math.random()*10)+5;
        const t = Math.floor(Math.random()*100)+300;
        text = `Find moles of ideal gas: P=${p} atm, V=${v} L, T=${t} K. R=0.0821 L·atm/mol·K`;
        answer = (p*v)/(0.0821*t);
        steps = `n = PV/RT = (${p}×${v})/(0.0821×${t}) = <b>${answer.toFixed(3)} mol</b>`;
    } else if (topic === 'work') {
        const p = Math.floor(Math.random()*100)+50;
        const v1 = Math.floor(Math.random()*5)+1;
        const v2 = v1 + Math.floor(Math.random()*5)+2;
        text = `Gas expands isobarically at P=${p} kPa, from V₁=${v1} m³ to V₂=${v2} m³. Find W (kJ).`;
        answer = p*(v2-v1);
        steps = `W = P(V₂-V₁) = ${p}×(${v2}-${v1}) = <b>${answer.toFixed(2)} kJ</b>`;
    } else if (topic === 'rankine') {
        const qin  = Math.floor(Math.random()*2000)+1500;
        const qout = Math.floor(Math.random()*1000)+500;
        text = `Rankine cycle: Q_in=${qin} kJ/kg, Q_out=${qout} kJ/kg. Thermal efficiency (%)?`;
        answer = (1 - qout/qin)*100;
        steps = `η = (1 - Q_out/Q_in)×100 = (1 - ${qout}/${qin})×100 = <b>${answer.toFixed(2)}%</b>`;
    } else if (topic === 'heat-cond') {
        const k  = (Math.random()*200+50).toFixed(1);
        const A  = Math.floor(Math.random()*5)+1;
        const dT = Math.floor(Math.random()*100)+20;
        const dx = (Math.random()*0.1+0.05).toFixed(3);
        text = `Wall: k=${k} W/m·K, A=${A} m², ΔT=${dT} K, thickness=${dx} m. Heat rate (W)?`;
        answer = (k*A*dT)/dx;
        steps = `q = kA(ΔT/Δx) = ${k}×${A}×${dT}/${dx} = <b>${answer.toFixed(2)} W</b>`;
    } else if (topic === 'otto') {
        const r = Math.floor(Math.random()*4)+6;
        answer = (1 - 1/Math.pow(r, 0.4))*100;
        text = `Otto cycle, compression ratio r=${r}, γ=1.4. Thermal efficiency (%)?`;
        steps = `η = [1 - 1/r^(γ-1)]×100 = [1 - 1/${r}^0.4]×100 = <b>${answer.toFixed(2)}%</b>`;
    } else if (topic === 'entropy') {
        const m = Math.floor(Math.random()*5)+1;
        const t1 = Math.floor(Math.random()*100)+300;
        const t2 = t1 + Math.floor(Math.random()*200)+100;
        const cp = (0.8 + Math.random()*0.6).toFixed(2);
        text = `${m} kg of gas (Cp=${cp} kJ/kg·K) heated at const P from T₁=${t1} K to T₂=${t2} K. ΔS (kJ/K)?`;
        answer = m*cp*Math.log(t2/t1);
        steps = `ΔS = mCp·ln(T₂/T₁) = ${m}×${cp}×ln(${t2}/${t1}) = <b>${answer.toFixed(4)} kJ/K</b>`;
    } else if (topic === 'cop') {
        const tc = Math.floor(Math.random()*50)+250;
        const th = tc + Math.floor(Math.random()*80)+40;
        text = `Refrigerator between Th=${th} K and Tc=${tc} K. Max COP?`;
        answer = tc/(th-tc);
        steps = `COP_max = Tc/(Th-Tc) = ${tc}/(${th}-${tc}) = <b>${answer.toFixed(3)}</b>`;
    } else if (topic === 'onsager') {
        const l11 = (Math.random()*2+1).toFixed(2);
        const l12 = (Math.random()*0.5+0.1).toFixed(2);
        const dmu = (Math.random()*10+5).toFixed(1);
        const dt  = (Math.random()*20+10).toFixed(1);
        text = `Onsager: L₁₁=${l11}, L₁₂=${l12}, X₁=ΔT/T²=${dt} K⁻¹, X₂=Δμ/T=${dmu} J/mol/K. J₁ = L₁₁X₁ + L₁₂X₂ = ?`;
        answer = l11*dt + l12*dmu;
        steps = `J₁ = L₁₁X₁ + L₁₂X₂ = ${l11}×${dt} + ${l12}×${dmu} = <b>${answer.toFixed(3)}</b>`;
    } else if (topic === 'blackbody') {
        const t = Math.floor(Math.random()*3000)+1000;
        const sig = 5.67e-8;
        answer = sig * Math.pow(t, 4);
        text = `Black body at T=${t} K. Emissive power (W/m²)? σ=5.67×10⁻⁸ W/m²K⁴`;
        steps = `E = σT⁴ = 5.67×10⁻⁸ × ${t}⁴ = <b>${answer.toFixed(2)} W/m²</b>`;
    }

    window.currentProblem = { topic, answer, steps };
    display.innerHTML = `<h3 style="color:var(--accent);margin-bottom:0.5rem;">Problem:</h3><p style="font-size:1.15rem;line-height:1.8;">${text}</p>`;
    solSec.style.display = 'block';
};

window.checkAnswer = function() {
    const userAns  = parseFloat(document.getElementById('user-answer').value);
    const feedback = document.getElementById('answer-feedback');
    if (isNaN(userAns)) { feedback.innerText = 'Enter a valid number.'; feedback.style.color='#ef4444'; return; }
    const correct = window.currentProblem.answer;
    const pct = Math.abs((userAns - correct)/correct);
    if (pct < 0.02 || Math.abs(userAns - correct) < 0.01) {
        feedback.innerHTML = '✅ Correct! Well done!';
        feedback.style.color = '#10b981';
        if (window.app) window.app.addXP(20);
    } else {
        feedback.innerHTML = `❌ Incorrect. Correct answer: <b>${correct.toFixed(3)}</b>`;
        feedback.style.color = '#ef4444';
    }
};

window.showSolution = function() {
    const el = document.getElementById('solution-steps');
    if (el) { el.innerHTML = window.currentProblem.steps || 'No solution available.'; el.style.display = 'block'; }
};
