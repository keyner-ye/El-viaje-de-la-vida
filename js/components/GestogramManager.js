// ==========================================================================
// GESTOGRAMA Y CALCULADORA OBSTÉTRICA CLÍNICA (GestogramManager)
// Permite calcular semanas de gestación, fecha probable de parto (Regla de Naegele),
// percentiles de peso y longitud fetal promedio.
// ==========================================================================

import { soundSystem } from '../audio/SoundSystem.js';

export class GestogramManager {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.modal = document.getElementById('gestogram-modal');
    this.inputDate = document.getElementById('gestogram-fur');
    this.btnCalculate = document.getElementById('btn-calc-gestogram');
    this.resultsWrap = document.getElementById('gestogram-results');

    this.setupUI();
  }

  setupUI() {
    const btnOpen = document.getElementById('btn-gestogram');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => this.open());
    }

    const btnClose = document.getElementById('btn-close-gestogram');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    if (this.btnCalculate && this.inputDate) {
      this.btnCalculate.addEventListener('click', () => this.calculate());
    }
  }

  open() {
    if (this.modal) this.modal.classList.add('open');
    soundSystem.playClick();
  }

  close() {
    if (this.modal) this.modal.classList.remove('open');
  }

  calculate() {
    if (!this.inputDate || !this.inputDate.value) {
      if (this.engine) this.engine.showToast("⚠️ Por favor selecciona una fecha de última menstruación (FUM).");
      return;
    }

    soundSystem.playSuccess();
    const fum = new Date(this.inputDate.value + 'T00:00:00');
    const today = new Date();

    // Días transcurridos
    const diffMs = today - fum;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0 || diffDays > 300) {
      if (this.engine) this.engine.showToast("⚠️ La fecha ingresada está fuera del rango gestacional (0 a 42 semanas).");
      return;
    }

    const weeks = Math.floor(diffDays / 7);
    const extraDays = diffDays % 7;

    // Regla de Naegele: FUM + 7 días + 1 año - 3 meses (o FUM + 280 días)
    const fpp = new Date(fum.getTime() + 280 * 24 * 60 * 60 * 1000);
    const fppFormatted = fpp.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Trimestre
    let trimester = "Primer Trimestre";
    if (weeks >= 13 && weeks <= 26) trimester = "Segundo Trimestre";
    else if (weeks >= 27) trimester = "Tercer Trimestre";

    // Estimación biométrica de peso y longitud según semanas
    let estLength = (weeks * 1.25).toFixed(1);
    if (weeks > 20) estLength = (weeks * 1.35).toFixed(1);
    let estWeight = Math.round(Math.pow(weeks, 2.7) * 0.16);
    if (estWeight < 1) estWeight = 1;

    // Fruta comparativa equivalente
    let fruit = "Semilla de Amapola";
    if (weeks >= 4 && weeks < 8) fruit = "Arándano (1.5 - 3 cm)";
    else if (weeks >= 8 && weeks < 13) fruit = "Ciruela (5 - 8 cm)";
    else if (weeks >= 13 && weeks < 21) fruit = "Aguacate (16 cm)";
    else if (weeks >= 21 && weeks < 37) fruit = "Berenjena (30 cm)";
    else if (weeks >= 37) fruit = "Sandía (50 cm)";

    if (this.resultsWrap) {
      this.resultsWrap.innerHTML = `
        <div style="background: rgba(99, 102, 241, 0.12); border: 1px solid var(--primary); border-radius: 12px; padding: 18px; margin-top: 16px;">
          <h4 style="color: var(--primary-light); font-size: 17px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-stethoscope"></i> Ficha de Edad Gestacional
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
            <div><strong>Tiempo de Gestación:</strong> <span style="color: #fff;">${weeks} semanas + ${extraDays} días</span></div>
            <div><strong>Trimestre:</strong> <span style="color: #67e8f9;">${trimester}</span></div>
            <div><strong>Longitud Estimada:</strong> <span style="color: #fff;">${estLength} cm</span></div>
            <div><strong>Peso Fetal Estimado:</strong> <span style="color: #fff;">${estWeight} gramos</span></div>
            <div><strong>Escala Frutal:</strong> <span style="color: #fbcfe8;">${fruit}</span></div>
            <div><strong>Días Restantes Aprox.:</strong> <span style="color: #fff;">${Math.max(0, 280 - diffDays)} días</span></div>
          </div>
          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.15);">
            <strong style="color: #34d399;"><i class="fa-solid fa-calendar-check"></i> Fecha Probable de Parto (FPP):</strong>
            <div style="font-size: 15px; font-weight: 700; color: #fff; margin-top: 4px; text-transform: capitalize;">${fppFormatted}</div>
          </div>
        </div>
      `;
    }
  }
}

