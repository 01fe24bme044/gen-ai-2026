import re

with open('app.html', encoding='utf-8') as f:
    content = f.read()

# Find the closing of the master-section nav div and insert research section before Global Arena
# We look for the last </div> before <div class="nav-section"> that contains Global Arena

marker = '<div class="nav-section">\r\n                <h3>Global Arena &amp; Study</h3>'
if marker not in content:
    marker = '<div class="nav-section">\n                <h3>Global Arena &amp; Study</h3>'

research_block = '''<div class="nav-section master-section" style="border-color:rgba(239,68,68,0.45);background:linear-gradient(135deg,rgba(239,68,68,0.07),rgba(245,158,11,0.05));">
                <h3 style="background:linear-gradient(90deg,#ef4444,#f59e0b,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">&#x1F52C; Research Level</h3>
                <ul>
                    <li data-view="res-vacuum">Vacuum Energy Thermodynamics</li>
                    <li data-view="res-mori">Mori-Zwanzig &amp; BBGKY</li>
                    <li data-view="res-holographic">Holographic Thermodynamics</li>
                    <li data-view="res-propulsion">Full Propulsion Monograph</li>
                    <li data-view="res-simulation">Research Simulation Lab</li>
                </ul>
            </div>

            '''

if marker in content:
    content = content.replace(marker, research_block + marker, 1)
    with open('app.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: Research nav inserted')
else:
    # Debug: find what's around Global Arena
    idx = content.find('Global Arena')
    print('MARKER NOT FOUND. Context:')
    print(repr(content[max(0,idx-300):idx+100]))
