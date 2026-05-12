window.leaderboardSystem = {
    peers: [
        { name: "ThermoBot_99", xp: 1200 },
        { name: "Engine_Geek", xp: 850 },
        { name: "Entropy_Master", xp: 620 },
        { name: "Newbie_Mech", xp: 150 },
        { name: "Carnot_Fan", xp: 450 }
    ],
    
    init() {
        this.render();
    },
    
    render() {
        const userXp = window.app.xp;
        
        const allUsers = [...this.peers, { name: "You", xp: userXp, isUser: true }];
        
        allUsers.sort((a, b) => b.xp - a.xp);
        
        const tableBody = document.getElementById('leaderboard-table');
        if (!tableBody) return;
        
        let html = '';
        let userRank = 0;
        
        allUsers.forEach((u, index) => {
            const rank = index + 1;
            if (u.isUser) userRank = rank;
            
            const isHighlight = u.isUser ? 'background: rgba(59, 130, 246, 0.2);' : '';
            
            let title = 'Beginner Engineer';
            if (u.xp >= 100) title = 'Thermo Apprentice';
            if (u.xp >= 300) title = 'Cycle Master';
            if (u.xp >= 600) title = 'Entropy Expert';
            if (u.xp >= 1000) title = 'Thermo Legend';
            
            html += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); ${isHighlight}">
                    <td style="padding: 1rem;">#${rank}</td>
                    <td style="padding: 1rem; font-weight: ${u.isUser ? 'bold' : 'normal'}; color: ${u.isUser ? 'var(--primary)' : 'inherit'};">${u.name}</td>
                    <td style="padding: 1rem; color: var(--text-muted);">${title}</td>
                    <td style="padding: 1rem; text-align: right; color: var(--accent); font-weight: bold;">${u.xp}</td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        
        const rankEl = document.getElementById('lb-user-rank');
        const xpEl = document.getElementById('lb-user-xp');
        if(rankEl) rankEl.textContent = `#${userRank}`;
        if(xpEl) xpEl.textContent = userXp;
    }
};
