// ==========================================================================
// SIMULADOR CLÍNICO DE PARTO HUMANO SEGUNDO A SEGUNDO & HITOS CADA 10 SEGUNDOS
// Visualización médica ordenada y de alta fidelidad:
// - Imágenes fotorrealistas de cada maniobra médica (visión a través del abdomen,
//   coronamiento, hombros, corte de cordón, piel con piel y placenta).
// - Progresión segundo a segundo e hitos cada 10 segundos.
// - Información clínica estructurada, espaciosa y sin amontonamiento.
// - Telemetría CTG, registro de signos vitales y bitácora quirúrgica.
// ==========================================================================

import { soundSystem } from '../audio/SoundSystem.js';

export class BirthSimulator {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.modal = document.getElementById('birth-simulator-modal');
    this.canvas = document.getElementById('birth-sim-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // Fases clínicas del parto (1 a 6)
    this.phase = 1;
    this.totalPhases = 6;
    this.isRunning = false;
    this.animationId = null;

    // Control temporal
    this.isAutoPlaying = false;
    this.playbackSpeed = 1.0;
    this.clinicalSeconds = 0;
    this.lastSecondTick = Date.now();

    // Almacenamiento diferido de imágenes médicas (se cargan al abrir la sala de parto)
    this.images = {};
    this._imagesLoaded = false;

    // Datos detallados organizados cada 10 segundos
    this.milestones = [
      {
        secRange: [0, 10],
        phase: 1,
        title: "Ingreso & Dilatación Inicial (4 a 6 cm)",
        imageIndex: 1,
        doctorAction: "El obstetra palpa el fondo uterino materno para evaluar la intensidad de las contracciones y calibra los transductores del monitor cardiotocográfico (CTG).",
        maternalStatus: "Contracciones cada 4 minutos con duración de 45 segundos. FCF fetal reactiva en 142 BPM.",
        station: "-2 De Lee (Cabeza sobre plano de las espinas ciáticas)"
      },
      {
        secRange: [11, 20],
        phase: 1,
        title: "Dilatación Activa & Borramiento Completo (10 cm)",
        imageIndex: 1,
        doctorAction: "El doctor guía a la madre en la respiración diafragmática profunda durante el acmé de la contracción, facilitando el borramiento al 100% y la dilatación completa.",
        maternalStatus: "Contracciones intensas (>50 mmHg). Cuello borrado y permeable. Inicio del periodo expulsivo.",
        station: "0 a +1 De Lee (Encajamiento cefálico)"
      },
      {
        secRange: [21, 30],
        phase: 2,
        title: "Coronamiento Cefálico & Maniobra de Ritgen",
        imageIndex: 2,
        doctorAction: "La cabeza corona distendiendo el anillo vulvar. El doctor coloca una compresa estéril sobre el periné posterior para apoyar el mentón hacia arriba, mientras frena el occipucio con la otra mano.",
        maternalStatus: "Pujo activo coordinado. Periné distendido bajo protección médica para evitar desgarros.",
        station: "+3 a +4 De Lee (Coronamiento perineal)"
      },
      {
        secRange: [31, 40],
        phase: 3,
        title: "Restitución Cefálica & Desprendimiento de Hombro Anterior",
        imageIndex: 3,
        doctorAction: "El doctor toma la cabeza del recién nacido en posición biparietal con ambas manos. Aplica una tracción suave hacia abajo para hacer deslizar el hombro anterior bajo el pubis.",
        maternalStatus: "Cabeza rotada externamente 45°. Descenso controlado de la cintura escapular.",
        station: "Desprendimiento del hombro subpúbico"
      },
      {
        secRange: [41, 50],
        phase: 3,
        title: "Desprendimiento del Hombro Posterior & Salida Completa",
        imageIndex: 3,
        doctorAction: "Las manos del obstetra elevan suavemente la cabeza y el tórax hacia arriba. El hombro posterior nace sobre el periné, seguido de todo el cuerpo y extremidades del neonato.",
        maternalStatus: "Nacimiento del bebé completado. Alivio materno inmediato.",
        station: "Extracción completa del recién nacido"
      },
      {
        secRange: [51, 60],
        phase: 4,
        title: "Pinzamiento Tardío del Cordón Umbilical (Recomendación OMS)",
        imageIndex: 4,
        doctorAction: "Se mantiene al bebé a nivel del introito sobre campo estéril aguardando el cese de latidos del cordón (transfiriendo hasta 100 ml de sangre rica en hierro). Se coloca la 1ª pinza de Kocher a 2 cm.",
        maternalStatus: "Cordón umbilical pulsando con sangre oxigenada.",
        station: "1ª Pinza de Kocher colocada a 2 cm"
      },
      {
        secRange: [61, 70],
        phase: 4,
        title: "Sección Quirúrgica del Cordón Umbilical con Tijera",
        imageIndex: 4,
        doctorAction: "Se coloca la 2ª pinza de Kocher a 5 cm y el doctor corta el cordón con tijera quirúrgica estéril de Mayo en medio de ambas pinzas. El neonato inicia su primera respiración aérea.",
        maternalStatus: "Cordón seccionado con total esterilidad. Inicio del primer llanto vigoroso.",
        station: "Cordón seccionado e inicio de respiración pulmonar"
      },
      {
        secRange: [71, 80],
        phase: 5,
        title: "Contacto Piel a Piel Precoz & Test de Apgar (10/10)",
        imageIndex: 5,
        doctorAction: "El doctor alza al bebé y lo coloca sobre el tórax desnudo de su madre para iniciar el apego precoz. Se seca la espalda con una toalla tibia precalentada y se califica el Test de Apgar.",
        maternalStatus: "Apego inmediato, estímulo de oxitocina natural y calostro materno.",
        station: "Test de Apgar 10/10 (Vigoroso)"
      },
      {
        secRange: [81, 90],
        phase: 6,
        title: "Alumbramiento Placentario & Globo de Seguridad de Pinard",
        imageIndex: 6,
        doctorAction: "Maniobra de Brandt-Andrews: contratracción suprapúbica con la mano izquierda y tracción suave del cordón con la derecha. Expulsión completa de la placenta y revisión de 18 cotiledones.",
        maternalStatus: "Útero firmemente contraído (Globo de Seguridad de Pinard). Hemostasia lograda.",
        station: "Alumbramiento y revisión anatómica completados"
      }
    ];

    // Estado obstétrico dinámico
    this.state = {
      dilationCm: 4.0,
      effacementPct: 50,
      stationDeLee: -2,
      fhr: 142,
      maternalHr: 88,
      contractionIntensity: 12,
      contractionTimer: 0,
      clamp1Placed: false,
      clamp2Placed: false,
      cordCut: false,
      babyBorn: false,
      babyOnChest: false,
      babyCrying: false,
      apgarScore: 10,
      placentaDelivered: false
    };

    this.setupEvents();
  }

  setupEvents() {
    const btnOpen = document.getElementById('btn-birth-simulator');
    if (btnOpen) btnOpen.addEventListener('click', () => this.open());

    const tabBirth = document.getElementById('tab-birth-simulator');
    if (tabBirth) {
      tabBirth.addEventListener('click', () => {
        const sec = document.getElementById('section-birth-suite');
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth' });
          this.open();
        } else {
          this.open();
        }
      });
    }

    const btnClose = document.getElementById('btn-close-birth-sim');
    if (btnClose) btnClose.addEventListener('click', () => this.close());

    // Reproducción segundo a segundo
    const btnPlayPause = document.getElementById('btn-sim-autoplay');
    if (btnPlayPause) {
      btnPlayPause.addEventListener('click', () => this.toggleAutoPlay());
    }

    const btnSpeed = document.getElementById('btn-sim-speed');
    if (btnSpeed) {
      btnSpeed.addEventListener('click', () => this.cycleSpeed());
    }

    const btnRestart = document.getElementById('btn-restart-birth-sim');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => this.resetDelivery());
    }

    // Barra deslizadora de tiempo segundo a segundo
    const scrubber = document.getElementById('birth-timeline-scrubber');
    if (scrubber) {
      scrubber.addEventListener('input', (e) => {
        this.isAutoPlaying = false;
        const btnPlay = document.getElementById('btn-sim-autoplay');
        if (btnPlay) {
          btnPlay.innerHTML = '<i class="fa-solid fa-play"></i> Continuar Segundo a Segundo';
          btnPlay.style.background = 'linear-gradient(135deg, #0284c7, #6366f1)';
        }
        this.seekToSecond(parseInt(e.target.value));
      });
    }

    // Botones de salto directo a cada 10 segundos
    for (let s = 0; s <= 90; s += 10) {
      const btnTick = document.getElementById(`btn-tick-${s}`);
      if (btnTick) {
        btnTick.addEventListener('click', () => {
          this.isAutoPlaying = false;
          this.seekToSecond(s);
        });
      }
    }

    // Botones de acción manual
    const btnBreathe = document.getElementById('btn-sim-breathe');
    if (btnBreathe) btnBreathe.addEventListener('click', () => this.handleBreathingAction());

    const btnRitgen = document.getElementById('btn-sim-ritgen');
    if (btnRitgen) btnRitgen.addEventListener('click', () => this.handleRitgenAction());

    const btnShoulders = document.getElementById('btn-sim-shoulders');
    if (btnShoulders) btnShoulders.addEventListener('click', () => this.handleShouldersAction());

    const btnClamp1 = document.getElementById('btn-sim-clamp1');
    if (btnClamp1) btnClamp1.addEventListener('click', () => this.placeClamp1());

    const btnClamp2 = document.getElementById('btn-sim-clamp2');
    if (btnClamp2) btnClamp2.addEventListener('click', () => this.placeClamp2());

    const btnCutCord = document.getElementById('btn-sim-cut-cord');
    if (btnCutCord) btnCutCord.addEventListener('click', () => this.cutUmbilicalCord());

    const btnApgar = document.getElementById('btn-sim-apgar');
    if (btnApgar) btnApgar.addEventListener('click', () => this.evaluateApgar());

    const btnPlacenta = document.getElementById('btn-deliver-placenta');
    if (btnPlacenta) btnPlacenta.addEventListener('click', () => this.deliverPlacenta());
  }

  getCurrentMilestone(sec) {
    for (const m of this.milestones) {
      if (sec >= m.secRange[0] && sec <= m.secRange[1]) {
        return m;
      }
    }
    return this.milestones[this.milestones.length - 1];
  }

  seekToSecond(sec) {
    this.clinicalSeconds = Math.max(0, Math.min(90, sec));
    const mins = String(Math.floor(this.clinicalSeconds / 60)).padStart(2, '0');
    const secs = String(this.clinicalSeconds % 60).padStart(2, '0');
    
    const clockEl = document.getElementById('clock-display');
    if (clockEl) clockEl.textContent = `${mins}:${secs}`;

    const scrubber = document.getElementById('birth-timeline-scrubber');
    if (scrubber && parseInt(scrubber.value) !== this.clinicalSeconds) {
      scrubber.value = this.clinicalSeconds;
    }

    const milestone = this.getCurrentMilestone(this.clinicalSeconds);
    this.phase = milestone.phase;
    this.updateUIForMilestone(milestone, mins, secs);
  }

  updateUIForMilestone(m, mins, secs) {
    // Actualizar indicador superior de fases (1 a 6)
    for (let i = 1; i <= this.totalPhases; i++) {
      const stepBadge = document.getElementById(`birth-step-indicator-${i}`);
      if (stepBadge) {
        if (i < m.phase) stepBadge.className = "birth-progress-node completed";
        else if (i === m.phase) stepBadge.className = "birth-progress-node active";
        else stepBadge.className = "birth-progress-node";
      }
      const p = document.getElementById(`birth-action-panel-${i}`);
      if (p) p.style.display = i === m.phase ? 'flex' : 'none';
    }

    // Actualizar tarjeta clínica de información ordenada
    const titleEl = document.getElementById('birth-info-title');
    if (titleEl) titleEl.innerHTML = `<span style="color:#38bdf8;">[${mins}:${secs}]</span> ${m.title}`;

    const docActionEl = document.getElementById('birth-info-doctor');
    if (docActionEl) docActionEl.textContent = m.doctorAction;

    const maternalEl = document.getElementById('birth-info-maternal');
    if (maternalEl) maternalEl.textContent = m.maternalStatus;

    const stationEl = document.getElementById('birth-info-station');
    if (stationEl) stationEl.textContent = m.station;

    const doctorHeaderLabel = document.getElementById('birth-current-doctor-step');
    if (doctorHeaderLabel) doctorHeaderLabel.textContent = `Dr. Torres [${mins}:${secs}]: ${m.title}`;

    // Registrar en bitácora si coincide con el inicio del bloque de 10s
    if (this.clinicalSeconds % 10 === 0) {
      this.logClinicalEvent(`[${mins}:${secs}] ${m.title}: ${m.doctorAction}`);
    }
  }

  logClinicalEvent(msg) {
    const log = document.getElementById('birth-action-log');
    if (!log) return;
    const item = document.createElement('div');
    item.innerHTML = `<strong style="color: #38bdf8;">Dr. Torres:</strong> ${msg}`;
    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
  }

  preloadImages() {
    if (this._imagesLoaded) return;
    this._imagesLoaded = true;
    for (let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `assets/images/birth_phase${i}.jpg`;
      this.images[i] = img;
    }
  }

  open() {
    this.preloadImages();
    if (this.modal) this.modal.classList.add('open');
    this.isRunning = true;
    soundSystem.init();
    soundSystem.playClick();
    this.seekToSecond(this.clinicalSeconds);
    this.runLoop();
  }

  close() {
    this.isRunning = false;
    this.isAutoPlaying = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.modal) this.modal.classList.remove('open');
  }

  toggleAutoPlay() {
    this.isAutoPlaying = !this.isAutoPlaying;
    soundSystem.playClick();
    const btn = document.getElementById('btn-sim-autoplay');
    if (btn) {
      btn.innerHTML = this.isAutoPlaying
        ? '<i class="fa-solid fa-pause"></i> Pausar Simulación'
        : '<i class="fa-solid fa-play"></i> Continuar Segundo a Segundo';
      btn.style.background = this.isAutoPlaying ? '#f59e0b' : 'linear-gradient(135deg, #0284c7, #6366f1)';
    }
  }

  cycleSpeed() {
    if (this.playbackSpeed === 1.0) this.playbackSpeed = 2.0;
    else if (this.playbackSpeed === 2.0) this.playbackSpeed = 0.5;
    else this.playbackSpeed = 1.0;

    const btn = document.getElementById('btn-sim-speed');
    if (btn) btn.textContent = `${this.playbackSpeed}x`;
    soundSystem.playClick();
  }

  resetDelivery() {
    this.phase = 1;
    this.clinicalSeconds = 0;
    this.isAutoPlaying = false;

    const btn1 = document.getElementById('btn-sim-clamp1');
    const btn2 = document.getElementById('btn-sim-clamp2');
    const btnCut = document.getElementById('btn-sim-cut-cord');
    if (btn1) {
      btn1.disabled = false;
      btn1.innerHTML = '<i class="fa-solid fa-paperclip"></i> 1. Colocar Pinza 1 (a 2 cm)';
      btn1.style.background = '#0284c7';
    }
    if (btn2) {
      btn2.disabled = true;
      btn2.innerHTML = '<i class="fa-solid fa-paperclip"></i> 2. Colocar Pinza 2 (a 5 cm)';
      btn2.style.background = '#2563eb';
    }
    if (btnCut) {
      btnCut.disabled = true;
      btnCut.innerHTML = '<i class="fa-solid fa-scissors"></i> 3. ✂️ Cortar Cordón con Tijera';
      btnCut.style.background = '#059669';
    }

    const summary = document.getElementById('birth-completion-banner');
    if (summary) summary.style.display = 'none';

    this.seekToSecond(0);
  }

  // ================= ACCIONES CLÍNICAS =================
  handleBreathingAction() {
    this.state.dilationCm = Math.min(10.0, +(this.state.dilationCm + 2.0).toFixed(1));
    soundSystem.playSuccess();
    this.engine.showToast(`✓ Respiración coordinada: Cuello uterino dilatado a ${this.state.dilationCm} cm.`);
    if (this.state.dilationCm >= 10.0) {
      soundSystem.playFanfare();
      this.engine.showToast("🎉 ¡Dilatación completa alcanzada (10 cm)! Pasando al coronamiento.");
      setTimeout(() => this.seekToSecond(21), 1200);
    }
  }

  handleRitgenAction() {
    soundSystem.playSuccess();
    this.engine.showToast("✓ Maniobra de Ritgen aplicada: Periné protegido con compresa, cabeza extendida suavemente.");
    setTimeout(() => this.seekToSecond(31), 1400);
  }

  handleShouldersAction() {
    soundSystem.playFanfare();
    this.engine.showToast("👶 ¡Hombros anterior y posterior liberados con éxito! El bebé ha nacido.");
    setTimeout(() => this.seekToSecond(51), 1500);
  }

  placeClamp1() {
    this.state.clamp1Placed = true;
    soundSystem.playClick();
    const btn1 = document.getElementById('btn-sim-clamp1');
    const btn2 = document.getElementById('btn-sim-clamp2');
    if (btn1) {
      btn1.disabled = true;
      btn1.innerHTML = "✓ Pinza 1 Colocada (a 2 cm)";
      btn1.style.background = "#10b981";
    }
    if (btn2) btn2.disabled = false;
    this.engine.showToast("1ª Pinza de Kocher colocada a 2 cm del ombligo.");
  }

  placeClamp2() {
    this.state.clamp2Placed = true;
    soundSystem.playClick();
    const btn2 = document.getElementById('btn-sim-clamp2');
    const btnCut = document.getElementById('btn-sim-cut-cord');
    if (btn2) {
      btn2.disabled = true;
      btn2.innerHTML = "✓ Pinza 2 Colocada (a 5 cm)";
      btn2.style.background = "#10b981";
    }
    if (btnCut) btnCut.disabled = false;
    this.engine.showToast("2ª Pinza de Kocher colocada a 5 cm. Cordón clampado con seguridad.");
  }

  cutUmbilicalCord() {
    this.state.cordCut = true;
    soundSystem.playSnip();

    const btnCut = document.getElementById('btn-sim-cut-cord');
    if (btnCut) {
      btnCut.disabled = true;
      btnCut.innerHTML = "✂️ ¡Cordón Seccionado!";
      btnCut.style.background = "#059669";
    }

    setTimeout(() => {
      soundSystem.playBabyCry();
      this.engine.showToast("👶 ¡Primer llanto vigoroso del recién nacido! Respiración aérea iniciada.");
    }, 400);

    if (window.confetti) {
      window.confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
    }

    setTimeout(() => this.seekToSecond(71), 2000);
  }

  evaluateApgar() {
    soundSystem.playFanfare();
    this.engine.showToast("⭐ Test de Apgar 10/10 completado con éxito. Pasando al alumbramiento.");
    setTimeout(() => this.seekToSecond(81), 1800);
  }

  deliverPlacenta() {
    soundSystem.playFanfare();
    const btn = document.getElementById('btn-deliver-placenta');
    if (btn) btn.disabled = true;

    const summary = document.getElementById('birth-completion-banner');
    if (summary) summary.style.display = 'block';

    if (window.confetti) {
      window.confetti({ particleCount: 220, spread: 100, origin: { y: 0.5 } });
    }

    this.engine.showToast("🎉 ¡Parto hospitalario culminado con éxito y estricto rigor clínico!");
  }

  updateClinicalClock() {
    if (!this.isAutoPlaying) return;

    const now = Date.now();
    if (now - this.lastSecondTick >= 1000 / this.playbackSpeed) {
      this.lastSecondTick = now;
      if (this.clinicalSeconds < 90) {
        this.clinicalSeconds++;
        this.seekToSecond(this.clinicalSeconds);
      } else {
        this.isAutoPlaying = false;
        const btnPlay = document.getElementById('btn-sim-autoplay');
        if (btnPlay) {
          btnPlay.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Reiniciar Simulación';
          btnPlay.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }
      }
    }
  }

  // ================= RENDERIZADO VISUAL LIMPIO Y FOTORREALISTA =================
  render() {
    if (!this.ctx) return;
    this.updateClinicalClock();

    const w = this.canvas.width;
    const h = this.canvas.height;
    const milestone = this.getCurrentMilestone(this.clinicalSeconds);

    // 1. Dibujar Imagen Médica Fotorrealista correspondiente al hito actual
    const currentImg = this.images[milestone.imageIndex];
    if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
      this.ctx.drawImage(currentImg, 0, 0, w, h);
    } else {
      this.ctx.fillStyle = '#0a101d';
      this.ctx.fillRect(0, 0, w, h);
    }

    // 2. Monitor CTG y Telemetría en Vivo (Limpio y estilizado en esquina superior)
    this.drawLiveTelemetryOverlay(w, h);
  }

  drawLiveTelemetryOverlay(w, h) {
    const s = this.state;

    // Monitor CTG Compacto Semitransparente
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(2, 6, 23, 0.82)';
    this.ctx.strokeStyle = '#38bdf8';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(16, 14, 210, 88, 8);
    this.ctx.fill();
    this.ctx.stroke();

    // Trazado FCF (Verde Neón)
    this.ctx.fillStyle = '#22c55e';
    this.ctx.font = 'bold 11px monospace';
    this.ctx.fillText(`♥ FCF Fetal: ${s.fhr} BPM`, 26, 32);

    this.ctx.strokeStyle = '#22c55e';
    this.ctx.lineWidth = 1.6;
    this.ctx.beginPath();
    for (let px = 0; px < 190; px += 6) {
      const py = 46 + Math.sin(px * 0.16 + Date.now() * 0.008) * 5 + (Math.random() - 0.5) * 2;
      if (px === 0) this.ctx.moveTo(26 + px, py);
      else this.ctx.lineTo(26 + px, py);
    }
    this.ctx.stroke();

    // Trazado de Contracción Uterina (Rojo)
    s.contractionTimer = (s.contractionTimer + 0.016) % (Math.PI * 2);
    s.contractionIntensity = Math.max(10, Math.sin(s.contractionTimer) * 78);

    this.ctx.fillStyle = '#f43f5e';
    this.ctx.fillText(`Tocograma: ${Math.round(s.contractionIntensity)} mmHg`, 26, 68);

    this.ctx.strokeStyle = '#f43f5e';
    this.ctx.lineWidth = 1.8;
    this.ctx.beginPath();
    for (let px = 0; px < 190; px += 6) {
      const cpy = 86 - Math.max(0, Math.sin((px * 0.03) + s.contractionTimer) * 12);
      if (px === 0) this.ctx.moveTo(26 + px, cpy);
      else this.ctx.lineTo(26 + px, cpy);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  runLoop() {
    if (!this.isRunning) return;
    try {
      this.render();
    } catch (e) {
      console.warn("BirthSimulator loop safe catch:", e);
    }
    this.animationId = requestAnimationFrame(() => this.runLoop());
  }
}
