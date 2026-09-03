// ==========================================================================
// HERRAMIENTA DE CAPTURA MÉDICA 3D (SnapshotTool)
// Captura el lienzo WebGL y genera una ficha médica ecográfica descargable.
// ==========================================================================

import { soundSystem } from '../audio/SoundSystem.js';

export class SnapshotTool {
  constructor(canvasElement, gameEngine) {
    this.webglCanvas = canvasElement;
    this.engine = gameEngine;
  }

  takeSnapshot() {
    soundSystem.playClick();

    // Efecto de flash fotográfico en pantalla
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100vw';
    flash.style.height = '100vh';
    flash.style.background = '#ffffff';
    flash.style.zIndex = '9999';
    flash.style.opacity = '0.7';
    flash.style.pointerEvents = 'none';
    flash.style.transition = 'opacity 0.4s ease';
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 400);
    }, 50);

    // Crear canvas para la ficha médica
    const stage = this.engine.getCurrentStageData();
    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = this.webglCanvas.width;
    snapCanvas.height = this.webglCanvas.height;
    const ctx = snapCanvas.getContext('2d');

    // 1. Dibujar captura 3D
    ctx.drawImage(this.webglCanvas, 0, 0);

    // 2. Viñeta ecográfica
    const grad = ctx.createRadialGradient(
      snapCanvas.width / 2, snapCanvas.height / 2, snapCanvas.width * 0.3,
      snapCanvas.width / 2, snapCanvas.height / 2, snapCanvas.width * 0.65
    );
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.75)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, snapCanvas.width, snapCanvas.height);

    // 3. Marco y membrete médico obstétrico
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, snapCanvas.width - 40, snapCanvas.height - 40);

    // Encabezado
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.fillText("CLÍNICA PRENATAL 3D - EL VIAJE DE LA VIDA", 45, 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText(`ETAPA: ${stage.name.toUpperCase()} (${stage.weeks})`, 45, 85);
    ctx.fillText(`TAMAÑO ESTIMADO: ${stage.sizeDisplay} | ESCALA: ${stage.fruitName}`, 45, 105);
    ctx.fillText(`FRECUENCIA CARDÍACA: ${stage.bpm > 0 ? stage.bpm + ' BPM' : 'N/A'}`, 45, 125);

    // Marca de agua y fecha
    const today = new Date().toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    ctx.textAlign = 'right';
    ctx.fillText(`REGISTRO: ${today}`, snapCanvas.width - 45, 60);
    ctx.fillText("RESOLUCIÓN 3D EN TIEMPO REAL", snapCanvas.width - 45, 85);

    // Pie de foto
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbcfe8';
    ctx.font = 'italic 14px Inter, sans-serif';
    ctx.fillText('"Cada etapa es única y maravillosa. Cuidemos la vida desde su inicio."', snapCanvas.width / 2, snapCanvas.height - 40);

    // 4. Descargar archivo PNG
    const dataUrl = snapCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ecografia-prenatal-${stage.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();

    this.engine.showToast(`📸 ¡Foto ecográfica de la ${stage.weeks} guardada con éxito!`);
  }
}

