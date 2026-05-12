window.pvGraph = {
    canvas: null,
    ctx: null,

    init() {
        this.canvas = document.getElementById('pv-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const container = document.getElementById('pv-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        this.drawAxes();
    },

    drawAxes() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const pad = 40;
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.strokeStyle = '#94a3b8';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(pad, pad);
        this.ctx.lineTo(pad, h - pad);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(pad, h - pad);
        this.ctx.lineTo(w - pad, h - pad);
        this.ctx.stroke();

        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = '14px Inter';
        this.ctx.fillText('Pressure (P)', pad, pad - 10);
        this.ctx.fillText('Volume (V)', w - pad - 60, h - pad + 20);

        this.ctx.fillText('0', pad - 15, h - pad + 15);
    },

    drawProcess(type) {
        this.drawAxes();

        const pad = 40;
        const w = this.canvas.width;
        const h = this.canvas.height;

        const p1 = h - pad - 200;
        const v1 = pad + 50;

        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(v1, p1);

        let targetV = v1 + 200;

        if (type === 'isobaric') {
            this.ctx.lineTo(targetV, p1);
        } else if (type === 'isochoric') {
            this.ctx.lineTo(v1, p1 + 150);
        } else if (type === 'isothermal') {
            const C = (h - pad - p1) * v1;
            for (let v = v1; v <= targetV; v++) {
                const p = h - pad - (C / v);
                this.ctx.lineTo(v, p);
            }
        } else if (type === 'adiabatic') {
            const gamma = 1.4;
            const C = (h - pad - p1) * Math.pow(v1, gamma);
            for (let v = v1; v <= targetV; v++) {
                const p = h - pad - (C / Math.pow(v, gamma));
                this.ctx.lineTo(v, p);
            }
            this.ctx.strokeStyle = '#8b5cf6';
        }

        this.ctx.stroke();

        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(v1, p1, 6, 0, Math.PI * 2);
        this.ctx.fill();

        window.app.addXP(5);
    }
};
