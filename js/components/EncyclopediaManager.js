// ==========================================================================
// GESTOR DE LA ENCICLOPEDIA Y LOGROS (EncyclopediaManager)
// Muestra "El Gran Libro de la Vida": Medallas, Glosario y Tabla Comparativa de Frutas.
// ==========================================================================

import { GLOSSARY_DATA } from '../data/triviaData.js';
import { STAGES_DATA } from '../data/stagesData.js';
import { soundSystem } from '../audio/SoundSystem.js';

export class EncyclopediaManager {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.modal = document.getElementById('encyclopedia-modal');
    this.contentWrap = document.getElementById('encyclopedia-content');
    this.activeSubtab = 'medals';

    this.setupUI();
  }

  setupUI() {
    const btnClose = document.getElementById('btn-close-encyclopedia');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    const subtabs = document.querySelectorAll('.encyclopedia-tabs .sub-tab');
    subtabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        subtabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeSubtab = tab.getAttribute('data-subtab');
        soundSystem.playClick();
        this.renderActiveTab();
      });
    });
  }

  open(tab = 'medals') {
    this.modal.classList.add('open');
    this.activeSubtab = tab;

    // Actualizar botones de subtab
    const subtabs = document.querySelectorAll('.encyclopedia-tabs .sub-tab');
    subtabs.forEach((t) => {
      if (t.getAttribute('data-subtab') === tab) t.classList.add('active');
      else t.classList.remove('active');
    });

    this.renderActiveTab();
    soundSystem.playClick();
  }

  close() {
    this.modal.classList.remove('open');
  }

  renderActiveTab() {
    if (!this.contentWrap) return;

    if (this.activeSubtab === 'medals') {
      this.renderMedals();
    } else if (this.activeSubtab === 'glossary') {
      this.renderGlossary();
    } else if (this.activeSubtab === 'comparison') {
      this.renderComparisonTable();
    }
  }

  renderMedals() {
    const medals = this.engine.getMedals();
    let html = '<div class="medals-grid">';

    medals.forEach((m) => {
      html += `
        <div class="medal-card ${m.unlocked ? 'unlocked' : ''}">
          <div class="medal-icon">${m.icon}</div>
          <div class="medal-info">
            <h4>${m.title}</h4>
            <p>${m.desc}</p>
            <span style="font-size: 10px; font-weight: 700; color: ${m.unlocked ? 'var(--emerald)' : 'var(--text-dim)'}; margin-top: 4px; display: block;">
              ${m.unlocked ? '✓ DESBLOQUEADO' : '🔒 BLOQUEADO'}
            </span>
          </div>
        </div>
      `;
    });

    html += '</div>';
    this.contentWrap.innerHTML = html;
  }

  renderGlossary() {
    let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';

    GLOSSARY_DATA.forEach((item) => {
      html += `
        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-sm); padding: 12px 16px;">
          <strong style="color: var(--cyan); font-family: var(--font-heading); font-size: 14px;">${item.term}</strong>
          <p style="color: var(--text-muted); font-size: 12.5px; margin-top: 4px; line-height: 1.4;">${item.def}</p>
        </div>
      `;
    });

    html += '</div>';
    this.contentWrap.innerHTML = html;
  }

  renderComparisonTable() {
    let html = `
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Etapa</th>
            <th>Semanas</th>
            <th>Tamaño Real</th>
            <th>Comparación</th>
          </tr>
        </thead>
        <tbody>
    `;

    STAGES_DATA.forEach((stage) => {
      html += `
        <tr>
          <td><strong style="color: #fff;">${stage.name}</strong></td>
          <td style="color: var(--primary-light);">${stage.weeks}</td>
          <td><strong style="color: var(--cyan);">${stage.sizeDisplay}</strong></td>
          <td>${stage.fruitIcon} ${stage.fruitName}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    this.contentWrap.innerHTML = html;
  }
}

