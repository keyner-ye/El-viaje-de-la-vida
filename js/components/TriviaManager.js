// ==========================================================================
// GESTOR DE TRIVIA Y EVALUACIÓN PEDAGÓGICA (TriviaManager)
// Selección dinámica de 10 preguntas aleatorias sin repetición,
// contextualizadas a la etapa gestacional activa.
// ==========================================================================

import { TRIVIA_QUESTIONS } from '../data/triviaData.js';
import { soundSystem } from '../audio/SoundSystem.js';

export class TriviaManager {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.allQuestions = TRIVIA_QUESTIONS;
    this.activeQuestions = [];
    this.recentlyUsedIds = new Set();

    this.currentIndex = 0;
    this.score = 0;
    this.isAnswered = false;

    this.modal = document.getElementById('trivia-modal');
    this.counterEl = document.getElementById('trivia-counter');
    this.scoreEl = document.getElementById('trivia-score');
    this.progressFill = document.getElementById('trivia-progress-fill');
    this.questionText = document.getElementById('trivia-question-text');
    this.optionsWrap = document.getElementById('trivia-options-wrap');
    this.explanationBox = document.getElementById('trivia-explanation');
    this.explanationText = document.getElementById('trivia-explanation-text');
    this.btnNext = document.getElementById('btn-next-question');

    this.setupUI();
  }

  setupUI() {
    const btnClose = document.getElementById('btn-close-trivia');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.nextQuestion());
    }
  }

  open() {
    this.modal.classList.add('open');
    this.startQuiz();
    soundSystem.playClick();
  }

  close() {
    this.modal.classList.remove('open');
  }

  startQuiz() {
    this.currentIndex = 0;
    this.score = 0;
    this.activeQuestions = this.selectTenQuestions();
    this.loadQuestion(0);
  }

  selectTenQuestions() {
    const currentStage = this.engine ? this.engine.currentStageId : 0;

    // 1. Filtrar preguntas que no hayan sido usadas recientemente
    let available = this.allQuestions.filter((q) => !this.recentlyUsedIds.has(q.id));

    // Si ya se usaron casi todas, reiniciar historial para permitir un ciclo nuevo
    if (available.length < 10) {
      this.recentlyUsedIds.clear();
      available = [...this.allQuestions];
    }

    // 2. Priorizar preguntas de la etapa actual
    const stageQuestions = available.filter((q) => q.stageId === currentStage);
    const otherQuestions = available.filter((q) => q.stageId !== currentStage);

    // Barajar ambos grupos
    this.shuffleArray(stageQuestions);
    this.shuffleArray(otherQuestions);

    // Tomar preguntas de la etapa actual (hasta 4) y completar hasta 10 con otras etapas
    const selected = [];
    const stagePickCount = Math.min(stageQuestions.length, 4);
    for (let i = 0; i < stagePickCount; i++) {
      selected.push(stageQuestions[i]);
    }

    for (let q of otherQuestions) {
      if (selected.length >= 10) break;
      selected.push(q);
    }

    // Si aún faltan para 10, rellenar con las que resten de la etapa
    if (selected.length < 10) {
      for (let q of stageQuestions) {
        if (!selected.includes(q) && selected.length < 10) {
          selected.push(q);
        }
      }
    }

    // Barajar las 10 preguntas finales
    this.shuffleArray(selected);

    // Registrar IDs seleccionados para no repetirlas en la siguiente partida
    selected.forEach((q) => this.recentlyUsedIds.add(q.id));

    // Barajar opciones dentro de cada pregunta
    return selected.map((q) => {
      const cloned = JSON.parse(JSON.stringify(q));
      const correctAnswerText = cloned.options[cloned.correct];
      this.shuffleArray(cloned.options);
      cloned.correct = cloned.options.indexOf(correctAnswerText);
      return cloned;
    });
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  loadQuestion(index) {
    if (index >= this.activeQuestions.length) {
      this.showFinalSummary();
      return;
    }

    this.isAnswered = false;
    const q = this.activeQuestions[index];

    if (this.counterEl) {
      this.counterEl.textContent = `Pregunta ${index + 1} de ${this.activeQuestions.length}`;
    }
    if (this.scoreEl) {
      this.scoreEl.textContent = `Puntaje: ${this.score} / ${this.activeQuestions.length * 10} pts`;
    }
    if (this.progressFill) {
      const pct = (index / this.activeQuestions.length) * 100;
      this.progressFill.style.width = `${pct}%`;
    }

    if (this.questionText) {
      this.questionText.textContent = q.question;
    }

    if (this.explanationBox) {
      this.explanationBox.classList.add('hidden');
    }
    if (this.btnNext) {
      this.btnNext.classList.add('hidden');
    }

    if (this.optionsWrap) {
      this.optionsWrap.innerHTML = '';
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'trivia-option';
        btn.innerHTML = `
          <span style="font-weight: 700; color: var(--primary-light);">${String.fromCharCode(65 + idx)}.</span>
          <span>${opt}</span>
        `;
        btn.addEventListener('click', () => this.checkAnswer(idx, btn));
        this.optionsWrap.appendChild(btn);
      });
    }
  }

  checkAnswer(selectedIndex, selectedBtn) {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const q = this.activeQuestions[this.currentIndex];
    const allOptions = this.optionsWrap.children;

    for (let opt of allOptions) {
      opt.classList.add('locked');
    }

    if (selectedIndex === q.correct) {
      selectedBtn.classList.add('correct');
      this.score += 10;
      soundSystem.playSuccess();
    } else {
      selectedBtn.classList.add('incorrect');
      if (allOptions[q.correct]) {
        allOptions[q.correct].classList.add('correct');
      }
      soundSystem.playError();
    }

    if (this.scoreEl) {
      this.scoreEl.textContent = `Puntaje: ${this.score} / ${this.activeQuestions.length * 10} pts`;
    }

    if (this.explanationBox && this.explanationText) {
      this.explanationText.textContent = q.explanation;
      this.explanationBox.classList.remove('hidden');
    }

    if (this.btnNext) {
      this.btnNext.classList.remove('hidden');
      if (this.currentIndex === this.activeQuestions.length - 1) {
        this.btnNext.innerHTML = "Ver Resultados Finales <i class='fa-solid fa-flag-checkered'></i>";
      } else {
        this.btnNext.innerHTML = "Siguiente Pregunta <i class='fa-solid fa-arrow-right'></i>";
      }
    }
  }

  nextQuestion() {
    this.currentIndex++;
    this.loadQuestion(this.currentIndex);
  }

  showFinalSummary() {
    const totalMax = this.activeQuestions.length * 10;
    const isPerfect = this.score === totalMax;

    if (this.scoreEl) {
      this.scoreEl.textContent = `Puntaje Final: ${this.score} / ${totalMax} pts`;
    }

    if (isPerfect) {
      this.engine.unlockMedal('trivia_master');
      soundSystem.playFanfare();
      if (window.confetti) {
        window.confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
      }
    } else if (this.score >= totalMax * 0.7) {
      soundSystem.playSuccess();
    }

    if (this.questionText) {
      this.questionText.innerHTML = `
        <div style="text-align: center; padding: 24px 0;">
          <i class="fa-solid fa-trophy" style="font-size: 52px; color: ${isPerfect ? '#f59e0b' : 'var(--primary-light)'}; margin-bottom: 16px;"></i>
          <h3 style="font-family: Outfit, sans-serif; font-size: 24px; color: #fff;">¡Cuestionario Completado!</h3>
          <p style="color: var(--text-muted); font-size: 15px; margin-top: 8px;">
            Has acertado <strong>${this.score / 10} de ${this.activeQuestions.length}</strong> preguntas (${this.score} puntos).
          </p>
          <p style="color: #cbd5e1; font-size: 14px; margin-top: 10px;">
            ${isPerfect ? "¡Excelente! Demuestras un conocimiento sobresaliente en embriología humana." : "¡Buen esfuerzo! Puedes volver a jugar para descubrir nuevas preguntas."}
          </p>
        </div>
      `;
    }

    if (this.optionsWrap) {
      this.optionsWrap.innerHTML = `
        <button class="primary-btn" id="btn-retry-trivia" style="width: 100%; justify-content: center; padding: 14px; font-size: 15px;">
          <i class="fa-solid fa-rotate-right"></i> Jugar de Nuevo (Preguntas Nuevas)
        </button>
      `;

      const btnRetry = document.getElementById('btn-retry-trivia');
      if (btnRetry) {
        btnRetry.addEventListener('click', () => {
          this.startQuiz();
          soundSystem.playClick();
        });
      }
    }

    if (this.explanationBox) this.explanationBox.classList.add('hidden');
    if (this.btnNext) this.btnNext.classList.add('hidden');
    if (this.counterEl) this.counterEl.textContent = "Resultados";
    if (this.progressFill) this.progressFill.style.width = "100%";
  }
}
