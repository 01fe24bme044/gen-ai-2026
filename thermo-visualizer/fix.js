const fs = require('fs');
let content = fs.readFileSync('c:\\Users\\dell\\OneDrive\\Desktop\\thermo-visualizer\\js\\app.js', 'utf8');

let idx = content.indexOf('updateRankUI() {');
if(idx === -1) process.exit(1);

let startOfRankUI = idx;
let endOfValidApp = content.indexOf('    }', startOfRankUI);
endOfValidApp = content.indexOf('    }', endOfValidApp + 1); // wait, let's just find "    }\n};"

let target = '    }\n};\n';
let endIdx = content.indexOf(target, startOfRankUI);
if (endIdx === -1) {
    target = '    }\n};';
    endIdx = content.indexOf(target, startOfRankUI);
}

if (endIdx !== -1) {
    content = content.substring(0, endIdx + target.length) + `
// Expose app to global scope for onclick handlers
window.app = app;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

window.handleResearchSearch = function() {
    const input = document.getElementById('research-search-input');
    const results = document.getElementById('research-results');
    if(!input || !results) return;
    const query = input.value.toLowerCase();
    
    if(query.includes('carnot')) {
        results.innerHTML = \`
            <div class="glass" style="padding: 2rem; border-radius: 8px; text-align: left; border-left: 4px solid var(--primary);">
                <h3 style="color: var(--primary);">Carnot Engine</h3>
                <p><strong>Definition:</strong> The most efficient possible heat engine, consisting of two isothermal and two adiabatic processes.</p>
                <button class="btn" style="margin-top: 1rem;" onclick="window.app.navigateTo('carnot')">Go to Simulator</button>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 1rem 0;">
                <h4 style="color: white; margin-bottom: 0.5rem;">Recommended Video</h4>
                <a href="https://www.youtube.com/watch?v=sOweYMejPno" target="_blank" class="btn" style="background: #ef4444;">Watch Carnot Cycle on YouTube</a>
            </div>
        \`;
    } else if(query.includes('entropy') || query.includes('second law')) {
        results.innerHTML = \`
            <div class="glass" style="padding: 2rem; border-radius: 8px; text-align: left; border-left: 4px solid var(--accent);">
                <h3 style="color: var(--accent);">Entropy & Second Law</h3>
                <p><strong>Definition:</strong> Entropy is a measure of molecular disorder. The Second Law states total entropy of an isolated system always increases.</p>
                <button class="btn" style="margin-top: 1rem; background: var(--accent);" onclick="window.app.navigateTo('second-law')">Go to Simulator</button>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 1rem 0;">
                <h4 style="color: white; margin-bottom: 0.5rem;">Recommended Video</h4>
                <a href="https://www.youtube.com/watch?v=kfffy12uQ7g" target="_blank" class="btn" style="background: #ef4444;">Watch Entropy Explained</a>
            </div>
        \`;
    } else {
        results.innerHTML = \`
            <div class="glass" style="padding: 2rem; border-radius: 8px; text-align: center;">
                <p style="color: var(--text-muted);">Results for "\${query}":</p>
                <p>We recommend checking out the <strong>Formula Cheat Sheet</strong> or the <strong>AI Tutor</strong> for more complex queries!</p>
                <button class="btn" style="margin-top: 1rem;" onclick="window.app.navigateTo('ai-tutor')">Ask AI Tutor</button>
            </div>
        \`;
    }
};
`;
} else {
   console.log("Could not find end of app block");
}

fs.writeFileSync('c:\\Users\\dell\\OneDrive\\Desktop\\thermo-visualizer\\js\\app.js', content, 'utf8');
console.log("Fixed!");
