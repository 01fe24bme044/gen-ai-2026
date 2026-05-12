/**
 * KaTeX typesetting for ThermoViz (formula derivations & cheat sheet).
 * Depends on global renderMathInElement from KaTeX auto-render (loaded before this file).
 */
(function () {
    'use strict';

    window.typesetThermoMath = function (root) {
        if (!root || typeof renderMathInElement === 'undefined') return;
        try {
            renderMathInElement(root, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
                throwOnError: false,
                strict: false
            });
        } catch (e) {
            console.warn('[ThermoMath] typeset failed', e);
        }
    };

    
    window.formulaSheet = {
        init() {},
        stop() {}
    };
})();
