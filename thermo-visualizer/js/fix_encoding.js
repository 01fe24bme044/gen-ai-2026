// ============================================================
// ENCODING FIX: Replaces ALL corrupted Unicode/mojibake text
// with clean ASCII English throughout the entire application.
// This runs AFTER app.js loads and patches all view HTML.
// ============================================================

(function fixAllCorruptedText() {
    'use strict';

    // Comprehensive map of corrupted sequences -> clean ASCII
    const replacements = [
        // ---- Double-encoded corruption (worst offenders) ----
        [/Ã¢Ë†â€¡/g, 'grad'],         // ∇ nabla
        [/ÃŽâ€/g, 'Delta'],            // Δ
        [/ÃŽâ€™/g, 'Delta'],           // Δ variant
        [/ÃÆ'/g, 'sigma'],             // σ
        [/Ã¢Â´/g, '^4'],               // ⁴
        [/Ã¢â‚¬â€œ/g, '--'],            // — em dash
        [/Ã¢â‚¬â€/g, '"'],              // "
        [/Ã¢â‚¬Å"/g, '"'],             // "
        [/Ã¢â‚¬â„¢/g, "'"],             // '
        [/Ã¢â‚¬Ëœ/g, "'"],             // '
        [/Ã¢â‚¬Â¦/g, '...'],           // …
        [/Ã¢â€°Â¥/g, '>='],            // ≥
        [/Ã¢â€°Â¤/g, '<='],            // ≤
        [/Ã¢Ë†Â«/g, 'Integral '],     // ∫
        [/Ã¢Ë†â€™/g, '-'],             // −
        [/Ã¢Ë†/g, ' ~ '],             // ∝ proportional
        [/Ã¢Ë†â€š/g, 'd'],             // ∂
        [/Ã¢Ë†â€¡/g, 'nabla'],         // ∇

        // ---- Greek capital letters (2-byte mojibake Î + char) ----
        [/Î"U/g, 'DeltaU'],
        [/Î"H/g, 'DeltaH'],
        [/Î"S/g, 'DeltaS'],
        [/Î"G/g, 'DeltaG'],
        [/Î"F/g, 'DeltaF'],
        [/Î"T/g, 'DeltaT'],
        [/Î"P/g, 'DeltaP'],
        [/Î"V/g, 'DeltaV'],
        [/Î"/g, 'Delta'],              // Generic Δ
        [/Î³/g, 'gamma'],              // γ
        [/Î·/g, 'eta'],                // η
        [/Î¾/g, 'xi'],                 // ξ
        [/Îž/g, 'Xi'],                 // Ξ
        [/Î¼/g, 'mu'],                 // μ
        [/Î½/g, 'nu'],                 // ν
        [/Îº/g, 'kappa'],              // κ
        [/Î±/g, 'alpha'],              // α
        [/Î²/g, 'beta'],               // β
        [/Î´/g, 'delta'],              // δ
        [/Î¸/g, 'theta'],              // θ
        [/Î»/g, 'lambda'],             // λ
        [/Î¶/g, 'zeta'],               // ζ

        // ---- Greek lowercase letters (Ï + char) ----
        [/Ï„/g, 'tau'],                // τ
        [/Ïƒ/g, 'sigma'],              // σ
        [/Ï€/g, 'pi'],                 // π
        [/Ï/g, 'rho'],                 // ρ (note: bare Ï)
        [/Ï†/g, 'phi'],                // φ
        [/Ïˆ/g, 'psi'],                // ψ
        [/Ï‰/g, 'omega'],              // ω

        // ---- Math symbols (3-byte âˆ + chars) ----
        [/âˆ«/g, 'Integral '],          // ∫
        [/âˆ'/g, 'Sum'],                // ∑
        [/âˆ‡/g, 'nabla'],              // ∇
        [/âˆ‚/g, 'd'],                  // ∂
        [/âˆ[^«'‡‚‡]/g, ' ~ '],        // ∝ proportional (catch remaining)
        [/â‰¥/g, '>='],                 // ≥
        [/â‰¤/g, '<='],                 // ≤
        [/â‰ˆ/g, '~='],                // ≈

        // ---- Subscript digits (â‚ + char) ----
        [/â‚€/g, '0'],                  // ₀
        [/â‚/g, '1'],                  // ₁ (was missing: bare â‚ matched first and left stray U+0081)
        [/â‚‚/g, '2'],                  // ₂
        [/â‚ƒ/g, '3'],                  // ₃
        [/â‚„/g, '4'],                  // ₄
        [/â‚…/g, '5'],                  // ₅
        [/â‚†/g, '6'],                  // ₆
        [/â‚‡/g, '7'],                  // ₇
        [/â‚ˆ/g, '8'],                  // ₈
        [/â‚‰/g, '9'],                  // ₉
        [/â‚/g, '1'],                   // ₁ (bare â‚ = subscript 1, do last)

        // ---- Superscripts ----
        [/Â²/g, '^2'],                  // ²
        [/Â³/g, '^3'],                  // ³
        [/â´/g, '^4'],                  // ⁴

        // ---- Special punctuation ----
        [/Â·/g, '*'],                   // · middle dot
        [/â€"/g, '--'],                 // — em dash
        [/â€"/g, '-'],                  // – en dash
        [/â€™/g, "'"],                  // ' right quote
        [/â€˜/g, "'"],                  // ' left quote
        [/â€œ/g, '"'],                  // " left double quote
        [/â€[^"˜™œ"]/g, '"'],           // " right double quote (catch remaining)
        [/â€¦/g, '...'],                // … ellipsis

        // ---- Arrows ----
        [/â†'/g, '->'],                 // →
        [/â†/g, '<-'],                  // ←
        [/â‡'/g, '=>'],                  // ⇒

        // ---- Misc Latin-1 artifacts ----
        [/Â /g, ' '],                   // Non-breaking space artifact
        [/Â°/g, ' deg '],              // °
        [/Ã—/g, 'x'],                   // ×
        [/Ã--/g, ' x '],               // corrupted multiplication sign (\u00d7 \xd7\xc3--)
        [/Â\^/g, '^'],                 // c^2, m^3 (spurious byte before superscript ASCII)
        [/Â\*/g, '*'],                 // stray byte before middot/multiplication

        [/Ä§/g, ' hbar '],             // Reduced Planck constant (ħ) mojibake
        [/âš›\s*/g, ''],                // corrupted symbol before Master: titles

        // Corrupted superscript numerals -> ASCII powers
        [/â´/g, '^4'],
        [/â¶/g, '^6'],
        [/â¸/g, '^8'],
        [/âµ/g, '^5'],
        [/Â¹/g, '^1'],
        [/â>>/g, '^-'],

        // ---- Corrupted emoji sequences ----
        [/ðŸ"¥/g, ''],                 // 📥
        [/ðŸ"¬/g, ''],                 // 🔬
        [/ðŸ"–/g, ''],                 // 📖
        [/ðŸ'§/g, ''],                 // 💧
        [/ðŸ"/g, ''],                  // 📝
        [/ðŸ†/g, ''],                  // 🏆
        [/ðŸŒ™/g, ''],                 // 🌙
        [/ðŸ"/g, ''],                  // 🔍
        [/ðŸ§ª/g, ''],                 // 🧪

        // ---- Cleanup any remaining Î or Â artifacts ----
        [/Î\^3/g, 'gamma'],            // Î^3 was gamma that got partially fixed
        [/Î\*/g, 'eta'],               // Î* was eta that got partially fixed
    ];

    // Apply to all view HTML templates
    function sanitizeString(str) {
        let result = str;
        for (const [pattern, replacement] of replacements) {
            result = result.replace(pattern, replacement);
        }
        return result;
    }

    function sanitizeAllTemplates() {
        if (window.views || typeof views !== 'undefined') {
            const viewsObj = window.views || views;
            for (const key in viewsObj) {
                if (typeof viewsObj[key] !== 'string') continue;
                if (key === 'formula-derivations' || key === 'formula-sheet' || key === 'master-exergy') continue;
                viewsObj[key] = sanitizeString(viewsObj[key]);
            }
            console.log('[EncodingFix] All view templates sanitized - corrupted text removed');
        }
        if (typeof viewTitles !== 'undefined') {
            for (const key in viewTitles) {
                if (typeof viewTitles[key] === 'string') {
                    viewTitles[key] = sanitizeString(viewTitles[key]);
                }
            }
        }
    }

    sanitizeAllTemplates();

    // Sanitize only the view content area (NOT the sidebar — replacing
    // sidebar innerHTML destroys navigation event listeners!)
    function sanitizeDOM() {
        const container = document.getElementById('view-container');
        if (container) {
            container.innerHTML = sanitizeString(container.innerHTML);
        }
    }

    // Monkey-patch the loadView function to sanitize after each navigation
    const originalLoadView = window.app && window.app.loadView;
    if (window.app) {
        const origLoad = window.app.loadView.bind(window.app);
        window.app.loadView = function(viewName) {
            origLoad(viewName);
            setTimeout(() => {
                const container = document.getElementById('view-container');
                if (container && !container.querySelector('.katex-view')) {
                    container.innerHTML = sanitizeString(container.innerHTML);
                }
            }, 50);
        };

        // Fix the theme toggle button text
        const origToggle = window.app.toggleTheme.bind(window.app);
        window.app.toggleTheme = function() {
            origToggle();
            const btn = document.getElementById('theme-toggle');
            if (btn) {
                btn.textContent = window.app.theme === 'light' ? 'Dark Mode' : 'Light Mode';
            }
        };

        // Fix initial theme button text
        setTimeout(() => {
            const btn = document.getElementById('theme-toggle');
            if (btn) {
                btn.textContent = window.app.theme === 'light' ? 'Dark Mode' : 'Light Mode';
            }
        }, 100);
    }
})();

