window.aiTutor = {
    responses: {
        "entropy": "<strong>Entropy (S)</strong> is a measure of the disorder or randomness of a system. Real-life example: A messy room is higher entropy than a clean one. Heat naturally dispersing from a hot coffee cup into the cold air increases the entropy of the universe.",
        "enthalpy": "<strong>Enthalpy (H)</strong> represents the total heat content of a system (H = U + PV). Real-life example: When natural gas burns in your stove, the heat released is the change in enthalpy (Delta H).",
        "carnot": "The <strong>Carnot engine</strong> is a theoretical engine that shows the maximum possible efficiency. Real engines can never reach this due to friction and heat loss.",
        "first law": "<strong>First Law of Thermodynamics:</strong> Energy cannot be created or destroyed, only changed in form. Example: A car engine converts chemical energy (gasoline) into kinetic energy (motion) and heat.",
        "second law": "<strong>Second Law of Thermodynamics:</strong> Heat naturally flows from hot to cold, generating entropy. Example: An ice cube melting in a warm drink.",
        "rankine": "The <strong>Rankine cycle</strong> is the idealized cycle for steam power plants. It involves a pump, boiler, turbine, and condenser. Example: Nuclear and coal power plants.",
        "isochoric": "<strong>Isochoric Process:</strong> Constant volume. W=0. Example: Heating a closed, rigid aerosol can.",
        "isobaric": "<strong>Isobaric Process:</strong> Constant pressure. Example: Boiling water in an open pan.",
        "isothermal": "<strong>Isothermal Process:</strong> Constant temperature. Example: A phase change like melting ice at 0°C.",
        "adiabatic": "<strong>Adiabatic Process:</strong> No heat exchange (Q=0). Example: The rapid compression stroke in a diesel engine.",
        "hello": "Hello! I am ThermoBot Advanced. I can define concepts, provide real-life examples, and solve numerical problems! Try asking me to 'calculate Carnot efficiency with Th=800 and Tc=300'.",
        "default": "I'm still learning! Try asking me for definitions of entropy, enthalpy, or ask me to solve a numerical problem (e.g., 'calculate work P=100 V1=2 V2=5')."
    },
    
    init() {
        const sendBtn = document.getElementById('tutor-send-btn');
        const input = document.getElementById('tutor-input');
        
        if (!sendBtn || !input) return;
        
        const newBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newBtn, sendBtn);
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        
        newBtn.addEventListener('click', () => this.handleSend(newInput));
        newInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend(newInput);
        });
        
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow.children.length === 0) {
            this.addMessage("Hello! I am the Advanced ThermoBot. I can solve numerical problems, define concepts, and explain derivations. How can I help you?", 'bot');
        }
    },
    
    handleSend(inputEl) {
        const text = inputEl.value.trim();
        if (!text) return;
        
        this.addMessage(text, 'user');
        inputEl.value = '';
        
        setTimeout(() => {
            const reply = this.getReply(text.toLowerCase());
            this.addMessage(reply, 'bot');
            window.app.addXP(10);
        }, 600);
    },
    
    solveNumerical(query) {
        // Advanced Numerical Solver Engine
        let match;
        
        // Carnot Efficiency: Th=... Tc=...
        if (query.includes('carnot') || query.includes('efficiency')) {
            const thMatch = query.match(/th\s*=\s*([\d.]+)/);
            const tcMatch = query.match(/tc\s*=\s*([\d.]+)/);
            if (thMatch && tcMatch) {
                const th = parseFloat(thMatch[1]);
                const tc = parseFloat(tcMatch[1]);
                if (th <= tc) return "Hot reservoir temp (Th) must be greater than cold reservoir temp (Tc).";
                const eff = (1 - (tc / th)) * 100;
                return `<strong>Numerical Solution:</strong><br>Given Th = ${th} K, Tc = ${tc} K.<br>Carnot Efficiency (η) = 1 - (Tc/Th)<br>η = 1 - (${tc}/${th}) = ${(eff).toFixed(2)}%`;
            }
        }
        
        // Isobaric Work: P=... V1=... V2=...
        if (query.includes('work') || query.includes('isobaric')) {
            const pMatch = query.match(/p\s*=\s*([\d.]+)/);
            const v1Match = query.match(/v1\s*=\s*([\d.]+)/);
            const v2Match = query.match(/v2\s*=\s*([\d.]+)/);
            if (pMatch && v1Match && v2Match) {
                const p = parseFloat(pMatch[1]);
                const v1 = parseFloat(v1Match[1]);
                const v2 = parseFloat(v2Match[1]);
                const w = p * (v2 - v1);
                return `<strong>Numerical Solution:</strong><br>Given P = ${p} Pa, V1 = ${v1} m³, V2 = ${v2} m³.<br>Isobaric Work (W) = P * (V2 - V1)<br>W = ${p} * (${v2} - ${v1}) = ${w} Joules`;
            }
        }
        
        // Ideal Gas Law: P=... V=... T=...
        if (query.includes('ideal gas') || query.includes('moles')) {
            const pMatch = query.match(/p\s*=\s*([\d.]+)/);
            const vMatch = query.match(/v\s*=\s*([\d.]+)/);
            const tMatch = query.match(/t\s*=\s*([\d.]+)/);
            if (pMatch && vMatch && tMatch) {
                const p = parseFloat(pMatch[1]);
                const v = parseFloat(vMatch[1]);
                const t = parseFloat(tMatch[1]);
                const R = 8.314;
                const n = (p * v) / (R * t);
                return `<strong>Numerical Solution:</strong><br>Given P = ${p} Pa, V = ${v} m³, T = ${t} K.<br>Ideal Gas Law: PV = nRT -> n = PV / RT<br>n = (${p} * ${v}) / (8.314 * ${t}) = ${n.toFixed(3)} moles`;
            }
        }
        
        return null;
    },
    
    getReply(query) {
        // Try to solve as numerical first
        const numericalSolution = this.solveNumerical(query);
        if (numericalSolution) return numericalSolution;
        
        // Fallback to text responses
        for (const key in this.responses) {
            if (query.includes(key) && key !== 'default') {
                return this.responses[key];
            }
        }
        
        if (query.includes('derive') || query.includes('formula')) {
            return "Please visit the new 'Formula Derivations' section in the sidebar for in-depth step-by-step mathematical proofs!";
        }
        
        return this.responses['default'];
    },
    
    addMessage(text, sender) {
        const chatWindow = document.getElementById('chat-window');
        const msgDiv = document.createElement('div');
        
        msgDiv.style.padding = '1rem';
        msgDiv.style.borderRadius = '8px';
        msgDiv.style.maxWidth = '80%';
        msgDiv.style.lineHeight = '1.5';
        msgDiv.style.marginBottom = '0.5rem';
        
        if (sender === 'user') {
            msgDiv.style.background = 'var(--primary)';
            msgDiv.style.color = 'white';
            msgDiv.style.alignSelf = 'flex-end';
            msgDiv.style.borderBottomRightRadius = '0';
        } else {
            msgDiv.style.background = 'var(--panel-bg)';
            msgDiv.style.border = '1px solid var(--border-color)';
            msgDiv.style.alignSelf = 'flex-start';
            msgDiv.style.borderBottomLeftRadius = '0';
            text = `<strong>ThermoBot:</strong><br>${text}`;
        }
        
        msgDiv.innerHTML = text;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
};

window.handlePhotoUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Create an image preview in the chat
    const chatWindow = document.getElementById('chat-window');
    
    const msgDiv = document.createElement('div');
    msgDiv.style.padding = '1rem';
    msgDiv.style.borderRadius = '8px';
    msgDiv.style.maxWidth = '80%';
    msgDiv.style.alignSelf = 'flex-end';
    msgDiv.style.background = 'var(--primary)';
    msgDiv.innerHTML = `<p style="margin:0 0 0.5rem 0;color:white;">Uploaded Image:</p><img src="${URL.createObjectURL(file)}" style="max-width:100%; border-radius:4px;">`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    window.aiTutor.addMessage("<em>Initializing ThermoViz Vision AI... Scanning numerical...</em>", 'bot');
    
    function processImage(f) {
        Tesseract.recognize(f, 'eng').then(({ data: { text } }) => {
            if (!text || text.trim().length === 0) {
                window.aiTutor.addMessage("Could not read any text from the image. Please upload a clearer photo.", 'bot');
                return;
            }
            window.aiTutor.addMessage("<strong>Extracted Numerical:</strong> " + text, 'bot');
            
            // Try to solve it
            const answer = window.aiTutor.getReply(text.toLowerCase());
            if (answer && !answer.includes("I'm sorry, I don't have information")) {
                setTimeout(() => window.aiTutor.addMessage(`<strong>Step-by-Step Solution:</strong><br>${answer}`, 'bot'), 1000);
            } else {
                setTimeout(() => window.aiTutor.addMessage(`I read the text, but couldn't parse it into a standard thermo problem format. Currently I can solve Carnot engine, Isobaric Work, and Ideal Gas law problems if you provide the variables explicitly in the text.`, 'bot'), 1000);
            }
        }).catch(err => {
            window.aiTutor.addMessage("OCR Failed: " + err.message, 'bot');
        });
    }

    if (!window.Tesseract) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
        script.onload = () => processImage(file);
        document.head.appendChild(script);
    } else {
        processImage(file);
    }
    
    // Reset file input
    event.target.value = '';
};
