// Simulators for the 8 missing views
// Each draws a real-time canvas animation

function makeSimpleCanvasSim(canvasId, containerId, drawFn) {
  return {
    canvas: null, ctx: null, animId: null, t: 0,
    init() {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      const c = this.canvas.parentElement;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(c.clientWidth, 600);
      const h = Math.max(c.clientHeight, 400);
      this.canvas.width = w * dpr; this.canvas.height = h * dpr;
      this.canvas.style.width = w + 'px'; this.canvas.style.height = h + 'px';
      this.ctx.scale(dpr, dpr);
      this._w = w; this._h = h;
      this.t = 0; this.bindControls(); this.animate();
    },
    stop() { if (this.animId) cancelAnimationFrame(this.animId); this.animId = null; },
    bindControls() {},
    animate() { this.t++; drawFn.call(this); this.animId = requestAnimationFrame(() => this.animate()); }
  };
}

// ── Irreversible Processes ──
window.irrSim = makeSimpleCanvasSim('irr-canvas','irr-container', function() {
  const ctx=this.ctx, w=this._w, h=this._h;
  ctx.clearRect(0,0,w,h);
  const dt = parseFloat((document.getElementById('irr-dt')||{}).value||200);
  const fric = parseFloat((document.getElementById('irr-fric')||{}).value||0.3);
  const bw=w*0.35, bh=h*0.35;
  ctx.fillStyle='#ef4444'; ctx.fillRect(30,h/2-bh/2,bw,bh);
  ctx.fillStyle='#3b82f6'; ctx.fillRect(w-30-bw,h/2-bh/2,bw,bh);
  const flux = dt * 0.5;
  for(let i=0;i<8;i++){
    const py = h/2-bh/3+i*(bh*0.7/7);
    const prog = ((this.t*2+i*40)%200)/200;
    const x = (30+bw) + prog*(w-60-2*bw);
    ctx.fillStyle=`hsl(${40-prog*40},100%,55%)`;
    ctx.beginPath(); ctx.arc(x,py,6,0,Math.PI*2); ctx.fill();
  }
  ctx.fillStyle='#fff'; ctx.font='bold 20px Inter'; ctx.textAlign='center';
  ctx.fillText('HOT (T₁)',30+bw/2,h/2+5);
  ctx.fillText('COLD (T₂)',w-30-bw/2,h/2+5);
  ctx.font='bold 16px Inter'; ctx.fillStyle='#a5f3fc';
  ctx.fillText('ΔS_gen = Q(1/T₂ - 1/T₁) > 0',w/2,h-25);
  ctx.fillStyle='rgba(245,158,11,0.25)'; ctx.fillRect(30,h-65,w-60,30);
  ctx.fillStyle='#f59e0b'; ctx.font='14px Inter';
  ctx.fillText(`Friction μ=${fric} → W_lost = μ·F·d`,w/2,h-47);
  const sgen = (dt>0? flux*(1/(300)-1/(300+dt)) : 0).toFixed(4);
  const el1 = document.getElementById('irr-sgen'); if(el1) el1.textContent = sgen+' J/K';
  const el2 = document.getElementById('irr-wlost'); if(el2) el2.textContent = (fric*flux*0.1).toFixed(2)+' J';
  const el3 = document.getElementById('irr-dt-val'); if(el3) el3.textContent = dt;
  const el4 = document.getElementById('irr-fric-val'); if(el4) el4.textContent = fric;
});

// ── Onsager Relations ──
window.onsagerSim = makeSimpleCanvasSim('onsager-canvas','onsager-container', function(){
  const ctx=this.ctx, w=this.canvas.width, h=this.canvas.height;
  ctx.clearRect(0,0,w,h);
  const gt=parseFloat((document.getElementById('ons-gt')||{}).value||100);
  const gm=parseFloat((document.getElementById('ons-gm')||{}).value||50);
  const L11=0.5, L12=0.1, L21=0.1, L22=0.3; // L12=L21 (Onsager!)
  const Jq=L11*gt+L12*gm, Jm=L21*gt+L22*gm;
  // Draw coupling matrix
  ctx.fillStyle='rgba(168,85,247,0.1)'; ctx.fillRect(w/4,30,w/2,h/2-20);
  ctx.strokeStyle='#a855f7'; ctx.lineWidth=2; ctx.strokeRect(w/4,30,w/2,h/2-20);
  ctx.fillStyle='#fff'; ctx.font='bold 13px Inter'; ctx.textAlign='center';
  ctx.fillText('Onsager Coupling Matrix',w/2,25);
  ctx.font='12px monospace';
  ctx.fillText(`L₁₁=${L11}  L₁₂=${L12}`,w/2,70);
  ctx.fillText(`L₂₁=${L21}  L₂₂=${L22}`,w/2,95);
  ctx.fillStyle='#10b981'; ctx.fillText('L₁₂ = L₂₁ ✓ (Reciprocity)',w/2,125);
  // Flux arrows
  const arrowY = h*0.65;
  // Heat flux
  ctx.strokeStyle='#ef4444'; ctx.lineWidth=Math.max(1,Jq*0.05);
  ctx.beginPath(); ctx.moveTo(50,arrowY); ctx.lineTo(50+Jq*2,arrowY); ctx.stroke();
  ctx.fillStyle='#ef4444'; ctx.font='11px Inter';
  ctx.fillText(`J_q = ${Jq.toFixed(1)} W/m²`,w/4,arrowY+20);
  // Mass flux
  ctx.strokeStyle='#3b82f6'; ctx.lineWidth=Math.max(1,Jm*0.1);
  ctx.beginPath(); ctx.moveTo(w/2+20,arrowY); ctx.lineTo(w/2+20+Jm*3,arrowY); ctx.stroke();
  ctx.fillStyle='#3b82f6';
  ctx.fillText(`J_m = ${Jm.toFixed(1)} kg/m²s`,3*w/4,arrowY+20);
  // Entropy production
  const sigma = Jq*gt/300/300 + Jm*gm/300;
  ctx.fillStyle='#a855f7'; ctx.font='bold 12px Inter';
  ctx.fillText(`σ = ΣJ·X = ${sigma.toFixed(3)} W/K·m³ ≥ 0`,w/2,h-15);
  // Update readouts
  const e1=document.getElementById('ons-jq'); if(e1) e1.textContent=Jq.toFixed(1)+' W/m²';
  const e2=document.getElementById('ons-jm'); if(e2) e2.textContent=Jm.toFixed(1)+' kg/m²s';
  const e3=document.getElementById('ons-sigma'); if(e3) e3.textContent=sigma.toFixed(4)+' W/K·m³';
  const e4=document.getElementById('ons-gt-val'); if(e4) e4.textContent=gt;
  const e5=document.getElementById('ons-gm-val'); if(e5) e5.textContent=gm;
});

// ── Blackbody Radiation ──
window.bbSim = makeSimpleCanvasSim('bb-canvas','bb-container', function(){
  const ctx=this.ctx, w=this.canvas.width, h=this.canvas.height;
  ctx.clearRect(0,0,w,h);
  const T=parseFloat((document.getElementById('bb-T')||{}).value||5778);
  const pad=50, gw=w-2*pad, gh=h-2*pad;
  // Axes
  ctx.strokeStyle='#94a3b8'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(pad,pad); ctx.lineTo(pad,pad+gh); ctx.lineTo(pad+gw,pad+gh); ctx.stroke();
  ctx.fillStyle='#cbd5e1'; ctx.font='11px Inter'; ctx.textAlign='center';
  ctx.fillText('Wavelength λ (nm)',pad+gw/2,h-8);
  ctx.save(); ctx.translate(12,pad+gh/2); ctx.rotate(-Math.PI/2);
  ctx.fillText('Spectral Radiance',0,0); ctx.restore();
  // Planck curve
  const h_=6.626e-34, c_=3e8, kB=1.381e-23;
  let maxI=0;
  const pts=[];
  for(let lam=100;lam<=3000;lam+=10){
    const l=lam*1e-9;
    const I=(2*h_*c_*c_)/(Math.pow(l,5))*(1/(Math.exp(h_*c_/(l*kB*T))-1));
    if(I>maxI) maxI=I;
    pts.push({lam,I});
  }
  ctx.beginPath(); ctx.strokeStyle='#f59e0b'; ctx.lineWidth=2.5;
  pts.forEach((p,i)=>{
    const x=pad+(p.lam-100)/2900*gw;
    const y=pad+gh-(p.I/maxI)*gh*0.95;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  // Color fill under curve
  pts.forEach(p=>{
    const x=pad+(p.lam-100)/2900*gw;
    const y=pad+gh-(p.I/maxI)*gh*0.95;
    if(p.lam>=380&&p.lam<=700){
      const hue=270-(p.lam-380)/320*270;
      ctx.fillStyle=`hsla(${hue},100%,50%,0.3)`;
      ctx.fillRect(x,y,3,pad+gh-y);
    }
  });
  // Wien peak
  const peakLam=2898000/T;
  ctx.fillStyle='#fff'; ctx.font='bold 12px Inter';
  ctx.fillText(`T=${T}K  λ_max=${peakLam.toFixed(0)}nm`,w/2,pad-8);
  const power = 5.67e-8*Math.pow(T,4);
  const e1=document.getElementById('bb-T-val'); if(e1) e1.textContent=T;
  const e2=document.getElementById('bb-peak'); if(e2) e2.textContent=peakLam.toFixed(0)+' nm';
  const e3=document.getElementById('bb-power'); if(e3) e3.textContent=power.toExponential(2)+' W/m²';
});

// ── BE/FD Distributions ──
window.befdSim = makeSimpleCanvasSim('befd-canvas','befd-container', function(){
  const ctx=this.ctx, w=this.canvas.width, h=this.canvas.height;
  ctx.clearRect(0,0,w,h);
  const T=parseFloat((document.getElementById('befd-T')||{}).value||300);
  const mu=parseFloat((document.getElementById('befd-mu')||{}).value||0.5);
  const kT=8.617e-5*T; // eV
  const pad=50, gw=w-2*pad, gh=h-2*pad;
  ctx.strokeStyle='#94a3b8'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(pad,pad); ctx.lineTo(pad,pad+gh); ctx.lineTo(pad+gw,pad+gh); ctx.stroke();
  ctx.fillStyle='#cbd5e1'; ctx.font='11px Inter'; ctx.textAlign='center';
  ctx.fillText('Energy ε (eV)',pad+gw/2,h-8);
  ctx.save(); ctx.translate(12,pad+gh/2); ctx.rotate(-Math.PI/2);
  ctx.fillText('⟨n⟩ occupation',0,0); ctx.restore();
  // Draw distributions
  const colors = {BE:'#10b981',FD:'#3b82f6',MB:'#f59e0b'};
  ['BE','FD','MB'].forEach(type=>{
    ctx.beginPath(); ctx.strokeStyle=colors[type]; ctx.lineWidth=2.5;
    for(let i=0;i<=200;i++){
      const eps=mu*0.1+i*0.02;
      const x_=(eps-mu*0.1)/(200*0.02);
      const x=pad+x_*gw;
      let n=0;
      const arg=(eps-mu)/kT;
      if(type==='BE'&&arg>0.01) n=1/(Math.exp(arg)-1);
      else if(type==='FD') n=1/(Math.exp(arg)+1);
      else if(type==='MB'&&arg>-10) n=Math.exp(-arg);
      n=Math.min(n,3);
      const y=pad+gh-Math.min(n/3,1)*gh;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  });
  // Legend
  ctx.font='bold 11px Inter';
  ctx.fillStyle='#10b981'; ctx.fillText('— Bose-Einstein',pad+60,pad+15);
  ctx.fillStyle='#3b82f6'; ctx.fillText('— Fermi-Dirac',pad+60,pad+30);
  ctx.fillStyle='#f59e0b'; ctx.fillText('— Maxwell-Boltzmann',pad+60,pad+45);
  // μ line
  const muX=pad+((mu-mu*0.1)/(200*0.02))*gw;
  ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.setLineDash([5,5]);
  ctx.beginPath(); ctx.moveTo(muX,pad); ctx.lineTo(muX,pad+gh); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle='#fff'; ctx.fillText('μ',muX,pad+gh+15);
  const e1=document.getElementById('befd-T-val'); if(e1) e1.textContent=T;
  const e2=document.getElementById('befd-mu-val'); if(e2) e2.textContent=mu;
});

// ── Relativistic Thermo ──
window.relThermoSim = makeSimpleCanvasSim('relthermo-canvas','relthermo-container', function(){
  const ctx=this.ctx, w=this.canvas.width, h=this.canvas.height;
  ctx.clearRect(0,0,w,h);
  const v=parseFloat((document.getElementById('rel-v')||{}).value||0);
  const gamma=1/Math.sqrt(1-v*v);
  const cx=w/2, cy=h/2;
  // Lorentz contraction visualization
  const baseW=100, baseH=60;
  const contractedW=baseW/gamma;
  // Rest frame
  ctx.strokeStyle='#3b82f6'; ctx.lineWidth=2;
  ctx.strokeRect(cx-baseW/2,cy-120,baseW,baseH);
  ctx.fillStyle='rgba(59,130,246,0.2)'; ctx.fillRect(cx-baseW/2,cy-120,baseW,baseH);
  ctx.fillStyle='#3b82f6'; ctx.font='11px Inter'; ctx.textAlign='center';
  ctx.fillText('Rest Frame',cx,cy-125);
  // Moving frame
  ctx.strokeStyle='#ef4444'; ctx.lineWidth=2;
  ctx.strokeRect(cx-contractedW/2,cy+20,contractedW,baseH);
  ctx.fillStyle='rgba(239,68,68,0.2)'; ctx.fillRect(cx-contractedW/2,cy+20,contractedW,baseH);
  ctx.fillStyle='#ef4444';
  ctx.fillText(`Moving at v=${v.toFixed(2)}c`,cx,cy+15);
  ctx.fillText(`Length contracted by 1/γ`,cx,cy+95);
  // Info
  ctx.fillStyle='#fff'; ctx.font='bold 14px Inter';
  ctx.fillText(`γ = ${gamma.toFixed(3)}`,cx,h-40);
  ctx.fillText(`E = γmc² = ${gamma.toFixed(3)}mc²`,cx,h-20);
  const e1=document.getElementById('rel-v-val'); if(e1) e1.textContent=v.toFixed(2);
  const e2=document.getElementById('rel-gamma'); if(e2) e2.textContent=gamma.toFixed(3);
  const e3=document.getElementById('rel-etot'); if(e3) e3.textContent=gamma.toFixed(3)+'mc²';
});

// ── Thermal Equilibrium ──
window.thermalEqSim = makeSimpleCanvasSim('theq-canvas','theq-container', function(){
  const ctx=this.ctx, w=this._w, h=this._h;
  ctx.clearRect(0,0,w,h);
  const ta=parseFloat((document.getElementById('theq-ta')||{}).value||500);
  const tb=parseFloat((document.getElementById('theq-tb')||{}).value||300);
  const dt=ta-tb;
  const bw=w*0.35, bh=h*0.45;
  const hotPct=ta/800, coldPct=tb/800;
  // Block A
  ctx.fillStyle=`hsl(${60-hotPct*60},100%,45%)`; ctx.fillRect(30,h/2-bh/2,bw,bh);
  ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.strokeRect(30,h/2-bh/2,bw,bh);
  // Block B
  ctx.fillStyle=`hsl(${200+coldPct*20},80%,50%)`; ctx.fillRect(w-30-bw,h/2-bh/2,bw,bh);
  ctx.strokeRect(w-30-bw,h/2-bh/2,bw,bh);
  ctx.fillStyle='#fff'; ctx.font='bold 22px Inter'; ctx.textAlign='center';
  ctx.fillText(`A: ${ta} K`,30+bw/2,h/2+8);
  ctx.fillText(`B: ${tb} K`,w-30-bw/2,h/2+8);
  if(Math.abs(dt)>5){
    ctx.fillStyle='#f59e0b'; ctx.font='bold 18px Inter';
    for(let i=0;i<6;i++){
      const prog=((this.t*3+i*40)%200)/200;
      const x=(30+bw)+prog*(w-60-2*bw);
      const py=h/2-bh/4+i*(bh/5);
      ctx.beginPath(); ctx.arc(dt>0?x:w-x+30,py,5,0,Math.PI*2); ctx.fill();
    }
    ctx.fillText(`Q ${dt>0?'→':'←'} (heat flows hot → cold)`,w/2,h/2+bh/2+30);
  } else {
    ctx.fillStyle='#10b981'; ctx.font='bold 20px Inter';
    ctx.fillText('✓ THERMAL EQUILIBRIUM (T_A = T_B)',w/2,h/2+bh/2+30);
  }
  const e1=document.getElementById('theq-ta-val'); if(e1) e1.textContent=ta;
  const e2=document.getElementById('theq-tb-val'); if(e2) e2.textContent=tb;
  const e3=document.getElementById('theq-dt'); if(e3) e3.textContent=Math.abs(dt)+' K';
  const e4=document.getElementById('theq-q'); if(e4) e4.textContent=Math.abs(dt)<5?'None (equilibrium)':dt>0?'→ A to B':'← B to A';
  const e5=document.getElementById('theq-status'); if(e5){e5.textContent=Math.abs(dt)<5?'IN EQUILIBRIUM':'NOT in equilibrium';e5.style.color=Math.abs(dt)<5?'#10b981':'#ef4444';}
});
thermalEqSim.bindControls = function() {
  const btn = document.getElementById('theq-equalize');
  if(btn) btn.addEventListener('click', () => {
    const avg = Math.round((parseFloat(document.getElementById('theq-ta').value)+parseFloat(document.getElementById('theq-tb').value))/2);
    document.getElementById('theq-ta').value = avg;
    document.getElementById('theq-tb').value = avg;
  });
};

// ── Mechanical Equilibrium ──
window.mechEqSim = makeSimpleCanvasSim('meq-canvas','meq-container', function(){
  const ctx=this.ctx, w=this._w, h=this._h;
  ctx.clearRect(0,0,w,h);
  const pa=parseFloat((document.getElementById('meq-pa')||{}).value||300);
  const pb=parseFloat((document.getElementById('meq-pb')||{}).value||100);
  const dp=pa-pb;
  const pistonX=w/2+(dp/600)*w/4;
  const cy=h*0.15, ch=h*0.6;
  ctx.fillStyle='rgba(59,130,246,0.25)'; ctx.fillRect(30,cy,pistonX-35,ch);
  ctx.fillStyle='rgba(239,68,68,0.25)'; ctx.fillRect(pistonX+5,cy,w-pistonX-35,ch);
  ctx.strokeStyle='#94a3b8'; ctx.lineWidth=3;
  ctx.strokeRect(30,cy,w-60,ch);
  ctx.fillStyle='#94a3b8'; ctx.fillRect(pistonX-4,cy,8,ch);
  ctx.fillStyle='#fff'; ctx.font='bold 22px Inter'; ctx.textAlign='center';
  ctx.fillText(`A: ${pa} kPa`,(30+pistonX)/2,cy+ch/2+8);
  ctx.fillText(`B: ${pb} kPa`,(pistonX+w-30)/2,cy+ch/2+8);
  if(Math.abs(dp)>10){
    ctx.fillStyle='#f59e0b'; ctx.font='bold 18px Inter';
    ctx.fillText(dp>0?'Piston → (A pushes B)':'← Piston (B pushes A)',w/2,cy+ch+35);
  } else {
    ctx.fillStyle='#10b981'; ctx.font='bold 20px Inter';
    ctx.fillText('✓ MECHANICAL EQUILIBRIUM (P_A = P_B)',w/2,cy+ch+35);
  }
  const e1=document.getElementById('meq-pa-val'); if(e1) e1.textContent=pa;
  const e2=document.getElementById('meq-pb-val'); if(e2) e2.textContent=pb;
  const e3=document.getElementById('meq-dp'); if(e3) e3.textContent=Math.abs(dp)+' kPa';
  const e4=document.getElementById('meq-dir'); if(e4) e4.textContent=Math.abs(dp)<10?'Stationary':dp>0?'→ A pushes B':'← B pushes A';
  const e5=document.getElementById('meq-status'); if(e5){e5.textContent=Math.abs(dp)<10?'IN EQUILIBRIUM':'NOT in equilibrium';e5.style.color=Math.abs(dp)<10?'#10b981':'#ef4444';}
});
mechEqSim.bindControls = function() {
  const btn = document.getElementById('meq-equalize');
  if(btn) btn.addEventListener('click', () => {
    const avg = Math.round((parseFloat(document.getElementById('meq-pa').value)+parseFloat(document.getElementById('meq-pb').value))/2);
    document.getElementById('meq-pa').value = avg;
    document.getElementById('meq-pb').value = avg;
  });
};

// ── Chemical Equilibrium (Adv) ──
window.chemEqAdvSim = makeSimpleCanvasSim('ceq-canvas','ceq-container', function(){
  const ctx=this.ctx, w=this.canvas.width, h=this.canvas.height;
  ctx.clearRect(0,0,w,h);
  const T=parseFloat((document.getElementById('ceq-T')||{}).value||298);
  const dG=parseFloat((document.getElementById('ceq-dg')||{}).value||-20);
  const R=8.314, Keq=Math.exp(-dG*1000/(R*T));
  const pad=50, gw=w-2*pad, gh=h-2*pad;
  // G vs extent of reaction curve
  ctx.strokeStyle='#94a3b8'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(pad,pad); ctx.lineTo(pad,pad+gh); ctx.lineTo(pad+gw,pad+gh); ctx.stroke();
  ctx.fillStyle='#cbd5e1'; ctx.font='11px Inter'; ctx.textAlign='center';
  ctx.fillText('Extent of Reaction ξ',pad+gw/2,h-8);
  // Parabolic G curve
  ctx.beginPath(); ctx.strokeStyle='#10b981'; ctx.lineWidth=2.5;
  const minX = dG<0?0.7:0.3;
  for(let i=0;i<=100;i++){
    const xi=i/100;
    const G=50*(xi-minX)*(xi-minX)+10;
    const x=pad+xi*gw, y=pad+gh-G/80*gh;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  // Minimum marker
  const minPx=pad+minX*gw;
  ctx.strokeStyle='#f59e0b'; ctx.setLineDash([5,5]);
  ctx.beginPath(); ctx.moveTo(minPx,pad); ctx.lineTo(minPx,pad+gh); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle='#f59e0b'; ctx.fillText('Equilibrium (dG/dξ=0)',minPx,pad-5);
  ctx.fillStyle='#fff'; ctx.font='bold 13px Inter';
  ctx.fillText(`K_eq = ${Keq>1e6?Keq.toExponential(1):Keq.toFixed(1)}`,w/2,pad+20);
  const e1=document.getElementById('ceq-T-val'); if(e1) e1.textContent=T;
  const e2=document.getElementById('ceq-dg-val'); if(e2) e2.textContent=dG;
  const e3=document.getElementById('ceq-keq'); if(e3) e3.textContent=Keq>1e6?Keq.toExponential(1):Keq.toFixed(1);
  const e4=document.getElementById('ceq-dir'); if(e4) e4.textContent=Keq>1?'Products favored':'Reactants favored';
});

// ═══════════════════════════════════════════════
// Wire into app routing
// ═══════════════════════════════════════════════
const _origInit = app.initViewLogic.bind(app);
app.initViewLogic = function(viewName) {
  _origInit(viewName);
  const patchMap = {
    'irreversible': 'irrSim',
    'onsager': 'onsagerSim',
    'blackbody': 'bbSim',
    'be-fd-dist': 'befdSim',
    'relativistic-thermo': 'relThermoSim',
    'thermal-equil': 'thermalEqSim',
    'mech-equil': 'mechEqSim',
    'chem-equil-adv': 'chemEqAdvSim'
  };
  const simName = patchMap[viewName];
  if (simName && window[simName] && typeof window[simName].init === 'function') {
    setTimeout(() => window[simName].init(), 80);
  }
};

// Also add these to stop list
const _origNav = app.navigateTo.bind(app);
app.navigateTo = function(viewName) {
  ['irrSim','onsagerSim','bbSim','befdSim','relThermoSim','thermalEqSim','mechEqSim','chemEqAdvSim'].forEach(s => {
    if (window[s] && typeof window[s].stop === 'function') window[s].stop();
  });
  _origNav(viewName);
};

console.log('[PATCH] 8 simulators + routing wired successfully');
