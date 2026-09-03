// ==========================================================================
// SIMULADOR DE CUIDADOS ESENCIALES DURANTE EL EMBARAZO (CareSimulator)
// Gestiona la vitalidad materno-fetal y las 7 decisiones de salud de la infografía.
// ==========================================================================

import { CARE_PILLARS_DATA } from '../data/carePilarsData.js';
import { soundSystem } from '../audio/SoundSystem.js';

export class CareSimulator {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.fetalVitality = 65;
    this.maternalVitality = 70;
    this.modal = document.getElementById('care-simulator-modal');
    this.pillarsGrid = document.getElementById('care-pillars-grid');
    this.feedbackText = document.getElementById('care-feedback-text');
    this.gaugeFetal = document.getElementById('gauge-fetal');
    this.gaugeMaternal = document.getElementById('gauge-maternal');
    this.valFetal = document.getElementById('val-fetal');
    this.valMaternal = document.getElementById('val-maternal');

    this.setupUI();
  }

  setupUI() {
    const btnClose = document.getElementById('btn-close-care');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    this.renderPillars();
    this.updateGauges();
  }

  open() {
    this.modal.classList.add('open');
    soundSystem.playClick();
  }

  close() {
    this.modal.classList.remove('open');
  }

  renderPillars() {
    if (!this.pillarsGrid) return;
    this.pillarsGrid.innerHTML = '';

    CARE_PILLARS_DATA.forEach((pillar) => {
      const card = document.createElement('div');
      card.className = 'care-pillar-card';
      card.innerHTML = `
        <div class="pillar-icon" style="color: ${pillar.iconColor};">
          <i class="fa-solid ${pillar.icon}"></i>
        </div>
        <div class="pillar-info">
          <h4>${pillar.title}</h4>
          <p>${pillar.summary}</p>
        </div>
      `;

      card.addEventListener('click', () => this.executePillarAction(pillar));
      this.pillarsGrid.appendChild(card);
    });
  }

  executePillarAction(pillar) {
    this.fetalVitality = Math.min(100, this.fetalVitality + pillar.fetalGain);
    this.maternalVitality = Math.min(100, this.maternalVitality + pillar.maternalGain);

    soundSystem.playSuccess();
    this.updateGauges();

    // Mensaje pedagógico
    if (this.feedbackText) {
      this.feedbackText.innerHTML = `<strong>${pillar.title}:</strong> ${pillar.fact}`;
    }

    // Verificar si alcanzó la salud óptima
    if (this.fetalVitality >= 100 && this.maternalVitality >= 100) {
      soundSystem.playFanfare();
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
      this.engine.unlockMedal('guardian_health');
      this.engine.showToast("🏆 ¡Medalla Desbloqueada: Guardián de la Maternidad!");
    }
  }

  updateGauges() {
    if (this.gaugeFetal) this.gaugeFetal.style.width = `${this.fetalVitality}%`;
    if (this.valFetal) this.valFetal.textContent = `${this.fetalVitality}%`;

    if (this.gaugeMaternal) this.gaugeMaternal.style.width = `${this.maternalVitality}%`;
    if (this.valMaternal) this.valMaternal.textContent = `${this.maternalVitality}%`;
  }
}

