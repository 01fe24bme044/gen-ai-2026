window.quizSystem = {
    questions: [
        {
            q: "Which thermodynamic process occurs at constant temperature?",
            options: ["Isobaric", "Isochoric", "Isothermal", "Adiabatic"],
            answer: 2
        },
        {
            q: "What defines an isolated system?",
            options: [
                "Mass can cross the boundary but not energy",
                "Energy can cross the boundary but not mass",
                "Neither mass nor energy can cross the boundary",
                "Both mass and energy can cross the boundary"
            ],
            answer: 2
        },
        {
            q: "In a P-V diagram, what does the area under the curve represent?",
            options: ["Heat Transfer", "Work Done", "Internal Energy", "Entropy"],
            answer: 1
        }
    ],
    currentQ: 0,
    
    init() {
        this.currentQ = 0;
        this.renderQuestion();
    },
    
    renderQuestion() {
        if (this.currentQ >= this.questions.length) {
            document.getElementById('quiz-container').innerHTML = `
                <div style="text-align:center;">
                    <h3 style="color: #4ade80; font-size: 1.5rem; margin-bottom: 1rem;">Quiz Complete!</h3>
                    <p>You have mastered this level.</p>
                    <button class="btn" style="margin-top: 1.5rem;" onclick="window.quizSystem.init()">Restart Quiz</button>
                </div>
            `;
            return;
        }
        
        const qData = this.questions[this.currentQ];
        document.getElementById('question-text').textContent = `Q${this.currentQ + 1}: ${qData.q}`;
        
        const optionsHtml = qData.options.map((opt, index) => `
            <button class="btn" style="background: var(--panel-bg); border: 1px solid var(--border-color); text-align: left; padding: 1rem; width: 100%; transition: 0.2s;" 
                    onclick="window.quizSystem.checkAnswer(${index}, this)"
                    onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                    onmouseout="this.style.background='var(--panel-bg)'">
                ${opt}
            </button>
        `).join('');
        
        document.getElementById('options-container').innerHTML = optionsHtml;
        document.getElementById('quiz-feedback').textContent = '';
    },
    
    checkAnswer(index, btnElement) {
        const feedback = document.getElementById('quiz-feedback');
        const qData = this.questions[this.currentQ];
        
        // Disable all buttons after guess
        const buttons = document.getElementById('options-container').querySelectorAll('button');
        buttons.forEach(b => b.disabled = true);
        
        if (index === qData.answer) {
            btnElement.style.background = 'rgba(74, 222, 128, 0.3)';
            btnElement.style.borderColor = '#4ade80';
            feedback.style.color = '#4ade80';
            feedback.textContent = 'Correct! +50 XP';
            window.app.addXP(50);
            
            setTimeout(() => {
                this.currentQ++;
                this.renderQuestion();
            }, 1200);
        } else {
            btnElement.style.background = 'rgba(239, 68, 68, 0.3)';
            btnElement.style.borderColor = '#ef4444';
            feedback.style.color = '#ef4444';
            feedback.textContent = 'Incorrect. Try again!';
            
            // Re-enable to let them try again
            setTimeout(() => {
                buttons.forEach(b => b.disabled = false);
                btnElement.style.background = 'var(--panel-bg)';
                btnElement.style.borderColor = 'var(--border-color)';
                feedback.textContent = '';
            }, 1500);
        }
    }
};
