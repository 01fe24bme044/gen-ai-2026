const fs = require('fs');
let content = fs.readFileSync('app.html', 'utf8');

const researchBlock = `<div class="nav-section master-section" style="border-color:rgba(239,68,68,0.45);background:linear-gradient(135deg,rgba(239,68,68,0.07),rgba(245,158,11,0.05));">
                <h3 style="background:linear-gradient(90deg,#ef4444,#f59e0b,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">&#x1F52C; Research Level</h3>
                <ul>
                    <li data-view="res-vacuum">Vacuum Energy Thermodynamics</li>
                    <li data-view="res-mori">Mori-Zwanzig &amp; BBGKY</li>
                    <li data-view="res-holographic">Holographic Thermodynamics</li>
                    <li data-view="res-propulsion">Full Propulsion Monograph</li>
                    <li data-view="res-simulation">Research Simulation Lab</li>
                </ul>
            </div>

            `;

// Find "Global Arena" and insert research block before its parent div
const idx = content.indexOf('Global Arena');
if (idx === -1) { console.log('Global Arena not found'); process.exit(1); }

// Walk back to find the opening <div of that nav-section
const before = content.lastIndexOf('<div class="nav-section">', idx);
if (before === -1) { console.log('nav-section div not found'); process.exit(1); }

content = content.slice(0, before) + researchBlock + content.slice(before);
fs.writeFileSync('app.html', content, 'utf8');
console.log('SUCCESS');
