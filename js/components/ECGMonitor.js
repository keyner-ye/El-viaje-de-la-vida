// ==========================================================================
// MONITOR DE ECG (ELECTROCARDIOGRAMA) EN TIEMPO REAL
// Dibuja en un canvas 2D la onda P-Q-R-S-T sincronizada con los latidos cardíacos.
// ==========================================================================

export class ECGMonitor {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.bpm = 0;
    this.points = [];
    this.maxPoints = 40;
    this.x = 0;
    this.pulsePhase = 0;

    if (this.canvas) {
      for (let i = 0; i < this.maxPoints; i++) {
        this.points.push(this.canvas.height / 2);
      }
      this.animate();
    }
  }

  setBpm(bpm) {
    this.bpm = bpm;
  }

  triggerPulse() {
    this.pulsePhase = 1.0;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.ctx || !this.canvas) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const midY = h / 2;

    let y = midY;

    if (this.bpm > 0 && this.pulsePhase > 0) {
      // Simular complejo QRS
      if (this.pulsePhase > 0.8) y = midY - 2; // Onda P
      else if (this.pulsePhase > 0.6) y = midY + 4; // Onda Q
      else if (this.pulsePhase > 0.4) y = midY - 9; // Pico R
      else if (this.pulsePhase > 0.2) y = midY + 6; // Onda S
      else y = midY - 3; // Onda T

      this.pulsePhase -= 0.15;
      if (this.pulsePhase < 0) this.pulsePhase = 0;
    } else {
      // Línea base con fluctuación imperceptible
      y = midY + (Math.random() - 0.5) * 0.8;
    }

    this.points.push(y);
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }

    // Dibujar trazo
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.strokeStyle = '#f43f5e';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();

    const step = w / (this.maxPoints - 1);
    for (let i = 0; i < this.points.length; i++) {
      const px = i * step;
      const py = this.points[i];
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.stroke();
  }
}

