// ==========================================================================
// MOTOR DE EFECTOS VISUALES Y PARTÍCULAS PARA MINIJUEGOS (MinigamesFX)
// Proporciona:
// - Partículas luminosas dinámicas (ATP, chispas eléctricas, sangre oxigenada).
// - Textos flotantes de puntuación y combos (Combo x2, x3, ¡Épico!).
// - Sacudida sutil de pantalla (Screen Shake) para impacto háptico.
// - Ondas expansivas de choque en aciertos y pulsos.
// ==========================================================================

export class MinigamesFX {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
  }

  // Genera explosión de partículas en (x, y)
  spawnBurst(x, y, count = 18, color = '#38bdf8', speed = 3) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * speed) + 1;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        radius: Math.random() * 3.5 + 1.5,
        color,
        alpha: 1.0,
        decay: Math.random() * 0.03 + 0.015
      });
    }
  }

  // Onda expansiva de impacto
  spawnShockwave(x, y, maxRadius = 50, color = '#67e8f9') {
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius,
      color,
      alpha: 0.9,
      speed: 3
    });
  }

  // Texto flotante de puntuación
  spawnFloatingText(text, x, y, color = '#facc15', size = 16) {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -1.4,
      color,
      alpha: 1.0,
      size,
      decay: 0.02
    });
  }

  // Sacudida de pantalla háptica
  shake(durationMs = 200, intensity = 4) {
    this.shakeDuration = durationMs;
    this.shakeIntensity = intensity;
  }

  // Aplica el desplazamiento de cámara si hay screen shake
  applyCameraShake() {
    if (this.shakeDuration > 0) {
      const dx = (Math.random() - 0.5) * this.shakeIntensity;
      const dy = (Math.random() - 0.5) * this.shakeIntensity;
      this.ctx.translate(dx, dy);
      this.shakeDuration -= 16;
    }
  }

  // Actualiza y dibuja todas las partículas y efectos
  updateAndRender() {
    // 1. Dibujar ondas de choque
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.alpha -= 0.025;

      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.strokeStyle = sw.color;
      this.ctx.globalAlpha = Math.max(0, sw.alpha);
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 2. Dibujar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 3. Dibujar textos flotantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= ft.decay;

      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.fillStyle = ft.color;
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.font = `bold ${ft.size}px Outfit, sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = '#000';
      this.ctx.shadowBlur = 6;
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    }
  }

  reset() {
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
    this.shakeDuration = 0;
  }
}

