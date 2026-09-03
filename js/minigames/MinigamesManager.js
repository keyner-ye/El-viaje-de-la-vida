// ==========================================================================
// GESTOR DE MINIJUEGOS EDUCATIVOS AVANZADOS (MinigamesManager)
// 7 experiencias biológicas profundas, multi-fase y con fichas pedagógicas
// integradas ("¿De qué trata?", "¿Qué significa cada elemento?", "¿A qué queremos llegar?")
// ==========================================================================

import { soundSystem } from '../audio/SoundSystem.js';
import { MinigamesFX } from './MinigamesFX.js';

export const MINIGAME_EDUCATIONAL_DATA = {
  fertilization: {
    title: "La Gran Odisea de la Fecundación",
    about: "La fecundación es la unión biológica del espermatozoide con el ovocito en la ampolla tubárica, restaurando el genoma diploide humano de 46 cromosomas.",
    meanings: [
      { icon: "⚡", label: "ATP / Calcio", desc: "Moneda energética mitocondrial que otorga motilidad e hiperactivación flagelar." },
      { icon: "🛡️", label: "Leucocitos Maternos", desc: "Células del sistema inmune que defienden el tracto y filtran espermatozoides débiles." },
      { icon: "🟣", label: "Corona Radiata & Zona Pelúcida", desc: "Barreras de células foliculares y glicoproteínas (ZP3) que rodean al óvulo." },
      { icon: "💥", label: "Reacción Acrosómica", desc: "Liberación de enzimas para fusionar membranas y bloquear la polispermia." }
    ],
    goal: "Guiar al espermatozoide pionero a través del tracto femenino, atravesar la corona radiata y fusionar los pronúcleos para crear el cigoto.",
    controls: "Mueve el ratón o flechas para dirigir. Mantén Clic o ESPACIO para Turbo / Hiperactivación."
  },

  heartbeat: {
    title: "Electro-Sinfonía del Primer Latido",
    about: "Hacia el día 21-22 de gestación, el tubo cardíaco primitivo inicia sus primeras contracciones rítmicas autónomas guiadas por potenciales de acción miocárdicos.",
    meanings: [
      { icon: "🔴", label: "Nodo Sinoauricular [A]", desc: "Marcapasos natural primitivo que origina la despolarización eléctrica." },
      { icon: "🔵", label: "Haz de His [S]", desc: "Haz conductor que transmite el impulso a través del tabique auriculoventricular." },
      { icon: "🟢", label: "Fibras de Purkinje [D]", desc: "Red de distribución rápida que activa la contracción de los ventrículos." },
      { icon: "❤️", label: "BPM (Frecuencia Cardíaca)", desc: "Ritmo en latidos por minuto que bombea las primeras células sanguíneas." }
    ],
    goal: "Sincronizar los 3 canales de conducción bioeléctrica al compás de la música para elevar la frecuencia cardíaca a 140 BPM y asegurar el flujo embrionario.",
    controls: "Pulsa [A], [S], [D] o haz clic sobre los anillos receptores en el momento exacto en que la nota eléctrica coincida con el círculo."
  },

  morphogenesis: {
    title: "Bio-Laboratorio de Morfogénesis Digital",
    about: "Durante las semanas 5 a 8, las paletas de las extremidades se transforman en manos humanas con 5 dedos individuales mediante muerte celular programada (apoptosis).",
    meanings: [
      { icon: "🩸", label: "Membrana Interdigital", desc: "Tejido conectivo que une los dedos incipientes en forma de aleta." },
      { icon: "🧪", label: "Enzima BMP-4 (Apoptosis)", desc: "Morfógeno que instruye a las células intermedias a autodisolverse limpiamente." },
      { icon: "🦴", label: "Condrogénesis Wnt / Sox9", desc: "Diferenciación de células mesenquimales en cartílago y huesos falángicos." },
      { icon: "💅", label: "Diferenciación Ungueal", desc: "Queratinización del lecho ungueal en los extremos de los dedos." }
    ],
    goal: "Disolver las membranas interdigitales, osificar las falanges y modelar las uñas para completar una mano humana perfectamente articulada.",
    controls: "1) Haz clic en las zonas rojas para apoptosis BMP. 2) Condensa el hueso interior. 3) Modela la uña de cada dedo."
  },

  ultrasound: {
    title: "Consola de Ecografía Doppler HD & Biometría",
    about: "La ecografía de primer y segundo trimestre utiliza ultrasonido acústico de alta frecuencia para evaluar la anatomía fetal y medir el crecimiento.",
    meanings: [
      { icon: "📏", label: "DBP (Diámetro Biparietal)", desc: "Distancia transversal de lado a lado del cráneo fetal entre ambos parietales." },
      { icon: "❤️", label: "Doppler Cardíaco (FCF)", desc: "Registro acústico del flujo sanguíneo a través de las 4 cámaras cardíacas." },
      { icon: "🦴", label: "LF (Longitud Femoral)", desc: "Medida del fémur, el hueso más largo del cuerpo y mejor marcador de talla." },
      { icon: "🌀", label: "Transductor Acústico", desc: "Sonda que emite y capta ondas sonoras para formar la imagen en abanico." }
    ],
    goal: "Explorar la cavidad amniótica, identificar los órganos clave y tomar las 4 medidas biométricas requeridas en el informe ecográfico oficial.",
    controls: "Mueve el ratón para guiar el transductor ultrasónico. Al posicionarte sobre un órgano, haz clic para fijar la medición con los Calipers."
  },

  placenta: {
    title: "La Fortaleza Placentaria: Intercambio Microvascular",
    about: "La placenta es un órgano vital efímero que realiza las funciones de pulmón, riñón e intestino fetal, mientras actúa como una barrera inmunológica selectiva.",
    meanings: [
      { icon: "🟢", label: "Nutrientes Esenciales", desc: "Oxígeno (O₂), glucosa, hierro, calcio y DHA que pasan por transporte activo." },
      { icon: "🔴", label: "Toxinas & Patógenos", desc: "Alcohol, nicotina, bacterias y virus que amenazan la salud del embrión." },
      { icon: "🛡️", label: "Macrófagos de Hofbauer", desc: "Células inmunitarias del estroma placentario que neutralizan agresores." },
      { icon: "👶", label: "Vena Umbilical", desc: "Conducto que lleva la sangre rica en nutrientes purificados hacia el corazón fetal." }
    ],
    goal: "Capturar nutrientes vitales para llenar el flujo del cordón umbilical y destruir sustancias teratógenas antes de que atraviesen la membrana.",
    controls: "Haz clic en los nutrientes verdes para absorberlos al cordón, y haz clic en las toxinas rojas para activar el escudo placentario."
  },

  sensory: {
    title: "Red Neuronal Fetal & Sinaptogénesis Sensorial",
    about: "A partir de la semana 24, el feto genera hasta 250.000 neuronas por minuto, conectando circuitos auditivos y táctiles que graban los primeros recuerdos de la vida.",
    meanings: [
      { icon: "💖", label: "Voz Materna", desc: "Estímulo auditivo primordial que promueve el desarrollo del lóbulo temporal y el lenguaje." },
      { icon: "💓", label: "Latido Materno", desc: "Ritmo biológico constante que sincroniza los ciclos circadianos fetales." },
      { icon: "🎵", label: "Música de Cuna", desc: "Estímulo polifónico armónico que estimula la corteza cerebral y el hipocampo." },
      { icon: "🌊", label: "Sonidos Acuáticos", desc: "Flujo del líquido amniótico que tranquiliza el sistema nervioso autónomo." }
    ],
    goal: "Disparar estímulos sensoriales y trazar los axones neuronales para construir la red sináptica del cerebro fetal.",
    controls: "Haz clic en los 4 nodos sensoriales al ritmo de la música para propagar los impulsos sinápticos hacia la corteza central."
  },

  birth: {
    title: "Monitorización Fetal Intraparto & Evaluación",
    about: "El trabajo de parto culmina 40 semanas de gestación. La monitorización cardiotocográfica evalúa las contracciones y la reserva de oxígeno del bebé.",
    meanings: [
      { icon: "📈", label: "Registro CTG", desc: "Monitor gráfico que compara la frecuencia cardíaca fetal con la presión uterina." },
      { icon: "🫁", label: "Respiración Rítmica", desc: "Técnica de respiración materna que optimiza el intercambio de oxígeno en la contracción." },
      { icon: "👶", label: "Presentación Cefálica", desc: "Alineación óptima de la cabeza fetal encajada hacia el estrecho pélvico inferior." },
      { icon: "⭐", label: "Test de Apgar 10/10", desc: "Evaluación clínica de vitalidad neonatal inmediata al nacer." }
    ],
    goal: "Monitorear la frecuencia cardíaca fetal durante las contracciones, coordinar la respiración materna y preparar al recién nacido para el parto.",
    controls: "Sigue la curva de contracción en el monitor. Cuando la onda suba, pulsa el botón de Respiración Asistida para coordinar el esfuerzo."
  }
};

export class MinigamesManager {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.canvas = document.getElementById('minigame-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.modal = document.getElementById('minigame-modal');
    this.hud = document.getElementById('minigame-hud');
    this.overlay = document.getElementById('minigame-overlay');

    this.activeMinigameId = null;
    this.isRunning = false;
    this.animationId = null;

    this.state = {
      score: 0,
      targetScore: 100,
      combo: 1,
      lives: 3,
      stageId: 0,
      phase: 1,
      entities: [],
      particles: [],
      floatingTexts: [],
      speed: 1.0,
      player: { x: 90, y: 225, radius: 14, isTurbo: false, angle: 0, energy: 100 }
    };

    this.fx = new MinigamesFX(this.canvas, this.ctx);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const btnClose = document.getElementById('btn-close-minigame');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.closeMinigame());
    }

    const btnStart = document.getElementById('btn-start-minigame');
    if (btnStart) {
      btnStart.addEventListener('click', () => this.startCurrentMinigame());
    }

    if (this.canvas) {
      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY
        };
      };

      this.canvas.addEventListener('mousemove', (e) => {
        if (!this.isRunning) return;
        const pos = getPos(e);
        this.handlePointerMove(pos.x, pos.y);
      });

      this.canvas.addEventListener('touchmove', (e) => {
        if (!this.isRunning) return;
        e.preventDefault();
        const pos = getPos(e);
        this.handlePointerMove(pos.x, pos.y);
      }, { passive: false });

      this.canvas.addEventListener('mousedown', (e) => {
        if (!this.isRunning) return;
        this.state.player.isTurbo = true;
        const pos = getPos(e);
        this.handlePointerClick(pos.x, pos.y);
      });

      this.canvas.addEventListener('mouseup', () => {
        this.state.player.isTurbo = false;
      });

      this.canvas.addEventListener('click', (e) => {
        if (!this.isRunning) return;
        const pos = getPos(e);
        this.handlePointerClick(pos.x, pos.y);
      });

      // Controles táctiles y de botones en pantalla
      const btnUp = document.getElementById('btn-touch-up');
      const btnDown = document.getElementById('btn-touch-down');
      const btnLeft = document.getElementById('btn-touch-left');
      const btnRight = document.getElementById('btn-touch-right');
      const btnAction = document.getElementById('btn-touch-action');

      const movePlayer = (dx, dy) => {
        if (!this.isRunning) return;
        const p = this.state.player;
        const step = 32;
        p.x = Math.max(30, Math.min(this.canvas.width - 30, p.x + dx * step));
        p.y = Math.max(30, Math.min(this.canvas.height - 30, p.y + dy * step));
        soundSystem.playClick();
      };

      if (btnUp) btnUp.addEventListener('click', () => movePlayer(0, -1));
      if (btnDown) btnDown.addEventListener('click', () => movePlayer(0, 1));
      if (btnLeft) btnLeft.addEventListener('click', () => movePlayer(-1, 0));
      if (btnRight) btnRight.addEventListener('click', () => movePlayer(1, 0));
      if (btnAction) {
        btnAction.addEventListener('click', () => {
          if (!this.isRunning) return;
          this.state.player.isTurbo = true;
          this.handleSpaceKey();
          soundSystem.playWhoosh();
          setTimeout(() => { this.state.player.isTurbo = false; }, 350);
        });
      }
    }

    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
      }

      const p = this.state.player;
      const step = p.isTurbo ? 28 : 18;

      if (e.key === 'ArrowUp' || e.key === 'w') p.y = Math.max(30, p.y - step);
      if (e.key === 'ArrowDown' || e.key === 's') p.y = Math.min(this.canvas.height - 30, p.y + step);
      if (e.key === 'ArrowLeft' || e.key === 'a') p.x = Math.max(30, p.x - step);
      if (e.key === 'ArrowRight' || e.key === 'd') p.x = Math.min(this.canvas.width - 30, p.x + step);

      if (e.code === 'Space' || e.key === 'Shift') {
        p.isTurbo = true;
        this.handleSpaceKey();
      }

      if (this.activeMinigameId === 'heartbeat') {
        if (e.code === 'KeyA') this.hitRhythmTrack(0);
        if (e.code === 'KeyS') this.hitRhythmTrack(1);
        if (e.code === 'KeyD') this.hitRhythmTrack(2);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.key === 'Shift') {
        this.state.player.isTurbo = false;
      }
    });
  }

  openMinigame(stageId) {
    this.state.stageId = stageId;
    this.modal.classList.add('open');
    soundSystem.init();

    const stageBadge = document.getElementById('minigame-stage-badge');
    const titleEl = document.getElementById('minigame-title');
    const instructionsEl = document.getElementById('minigame-instructions');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayDesc = document.getElementById('overlay-desc');
    const btnStart = document.getElementById('btn-start-minigame');

    this.overlay.classList.remove('hidden');

    const keyMap = ['fertilization', 'heartbeat', 'morphogenesis', 'ultrasound', 'placenta', 'sensory', 'birth'];
    const key = keyMap[stageId] || 'fertilization';
    this.activeMinigameId = key;
    const edu = MINIGAME_EDUCATIONAL_DATA[key];

    stageBadge.textContent = `Etapa ${stageId + 1}`;
    titleEl.textContent = edu.title;
    instructionsEl.innerHTML = `<span><i class="fa-solid fa-circle-info"></i> ${edu.controls}</span>`;

    // Renderizar la Ficha Pedagógica Completa en el overlay
    overlayTitle.innerHTML = `<span style="color: var(--primary-light); font-size: 20px;"><i class="fa-solid fa-graduation-cap"></i> ${edu.title}</span>`;
    
    let meaningsHTML = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 8px; margin: 10px 0; text-align: left; width: 100%; box-sizing: border-box;">`;
    edu.meanings.forEach((m) => {
      meaningsHTML += `
        <div style="background: rgba(255,255,255,0.06); padding: 8px 12px; border-radius: 8px; border-left: 3px solid var(--primary); box-sizing: border-box;">
          <strong style="color: #fff; font-size: 13px;">${m.icon} ${m.label}:</strong> <span style="color: #cbd5e1; font-size: 12.5px;">${m.desc}</span>
        </div>
      `;
    });
    meaningsHTML += `</div>`;

    overlayDesc.innerHTML = `
      <div style="text-align: left; line-height: 1.45; color: #e2e8f0; font-size: 13.5px; width: 100%;">
        <p style="margin-bottom: 6px;"><strong style="color: #67e8f9;"><i class="fa-solid fa-dna"></i> ¿De qué trata este proceso?</strong> ${edu.about}</p>
        <p style="margin-bottom: 6px;"><strong style="color: #fde047;"><i class="fa-solid fa-eye"></i> ¿Qué significa cada elemento en pantalla?</strong></p>
        ${meaningsHTML}
        <p style="margin-top: 6px; margin-bottom: 8px;"><strong style="color: #34d399;"><i class="fa-solid fa-bullseye"></i> ¿A qué objetivo queremos llegar?</strong> ${edu.goal}</p>
      </div>
    `;

    btnStart.innerHTML = "<i class='fa-solid fa-play'></i> ¡Comenzar Reto!";
    const overlayWrap = document.querySelector('.overlay-content');
    if (overlayWrap) overlayWrap.scrollTop = 0;
  }

  startCurrentMinigame() {
    this.overlay.classList.add('hidden');
    this.isRunning = true;
    this.state.score = 0;
    this.state.combo = 1;
    this.state.lives = 3;
    this.state.phase = 1;
    this.state.entities = [];
    this.state.particles = [];
    this.state.floatingTexts = [];
    this.state.player = { x: 80, y: 225, radius: 14, isTurbo: false, angle: 0, energy: 100 };

    soundSystem.playWhoosh();

    if (this.activeMinigameId === 'fertilization') this.initFertilization();
    else if (this.activeMinigameId === 'heartbeat') this.initHeartbeat();
    else if (this.activeMinigameId === 'morphogenesis') this.initMorphogenesis();
    else if (this.activeMinigameId === 'ultrasound') this.initUltrasound();
    else if (this.activeMinigameId === 'placenta') this.initPlacenta();
    else if (this.activeMinigameId === 'sensory') this.initSensory();
    else if (this.activeMinigameId === 'birth') this.initBirth();

    this.runLoop();
  }

  // ================= 1. JUEGO FECUNDACIÓN =================
  initFertilization() {
    this.state.distanceProgress = 0;
    this.state.targetScore = 120;
    this.state.phase = 1;
    this.state.streamlines = [];

    for (let i = 0; i < 35; i++) {
      this.state.streamlines.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        len: 25 + Math.random() * 60,
        speed: 3 + Math.random() * 4,
        color: 'rgba(99, 102, 241, 0.25)'
      });
    }

    for (let i = 0; i < 22; i++) {
      this.state.entities.push({
        x: 450 + i * 150 + Math.random() * 80,
        y: 45 + Math.random() * 360,
        radius: Math.random() > 0.4 ? 14 : 22,
        type: Math.random() > 0.4 ? 'atp' : 'obstacle',
        speed: 2.8 + Math.random() * 2.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  updateFertilization() {
    const p = this.state.player;
    const speedMult = p.isTurbo ? 2.3 : 1.0;
    this.state.distanceProgress += 0.08 * speedMult;

    const gradBg = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradBg.addColorStop(0, '#090d1e');
    gradBg.addColorStop(1, '#1e113a');
    this.ctx.fillStyle = gradBg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.lineWidth = 1.5;
    this.state.streamlines.forEach((s) => {
      s.x -= s.speed * speedMult;
      if (s.x < -s.len) {
        s.x = this.canvas.width + 20;
        s.y = Math.random() * this.canvas.height;
      }
      this.ctx.strokeStyle = s.color;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(s.x + s.len, s.y);
      this.ctx.stroke();
    });

    if (this.state.distanceProgress > 60) {
      this.state.phase = 2;
      const ovumX = this.canvas.width + 180 - (this.state.distanceProgress - 60) * 8.5;
      const ovumY = this.canvas.height / 2;

      this.ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
      this.ctx.beginPath();
      this.ctx.arc(ovumX, ovumY, 220, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#ec4899';
      this.ctx.lineWidth = 16;
      this.ctx.shadowColor = '#f472b6';
      this.ctx.shadowBlur = 30;
      this.ctx.beginPath();
      this.ctx.arc(ovumX, ovumY, 120, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      const eggGrad = this.ctx.createRadialGradient(ovumX, ovumY, 10, ovumX, ovumY, 110);
      eggGrad.addColorStop(0, '#fbcfe8');
      eggGrad.addColorStop(0.7, '#db2777');
      eggGrad.addColorStop(1, '#9d174d');
      this.ctx.fillStyle = eggGrad;
      this.ctx.beginPath();
      this.ctx.arc(ovumX, ovumY, 110, 0, Math.PI * 2);
      this.ctx.fill();

      if (p.x + p.radius >= ovumX - 115) {
        this.triggerFertilizationExplosion(ovumX, ovumY);
        return;
      }
    }

    if (p.isTurbo) {
      for (let i = 0; i < 2; i++) {
        this.state.particles.push({
          x: p.x - 22,
          y: p.y + (Math.random() - 0.5) * 10,
          vx: -(5 + Math.random() * 5),
          vy: (Math.random() - 0.5) * 3,
          life: 1.0,
          color: ['#67e8f9', '#38bdf8', '#818cf8', '#fde047'][Math.floor(Math.random() * 4)]
        });
      }
    }

    this.updateParticles();

    this.state.entities.forEach((ent) => {
      ent.x -= ent.speed * speedMult;
      ent.pulse += 0.05;

      if (ent.x < -50) {
        ent.x = this.canvas.width + 60 + Math.random() * 140;
        ent.y = 45 + Math.random() * 360;
      }

      if (ent.type === 'atp') {
        const r = ent.radius + Math.sin(ent.pulse) * 2;
        this.ctx.fillStyle = '#fde047';
        this.ctx.shadowColor = '#facc15';
        this.ctx.shadowBlur = 16;
        this.ctx.beginPath();
        this.ctx.arc(ent.x, ent.y, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = '#713f12';
        this.ctx.font = 'bold 9px Outfit, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ATP', ent.x, ent.y + 3);
      } else {
        this.ctx.fillStyle = '#475569';
        this.ctx.beginPath();
        this.ctx.arc(ent.x, ent.y, ent.radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        this.ctx.fillStyle = '#fca5a5';
        this.ctx.font = '9px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Barrera', ent.x, ent.y + 3);
      }

      const dist = Math.hypot(p.x - ent.x, p.y - ent.y);
      if (dist < p.radius + ent.radius) {
        if (ent.type === 'atp') {
          this.state.score += 20;
          this.state.combo++;
          soundSystem.playClick();
          this.addFloatingText(`+20 ATP (x${this.state.combo})`, ent.x, ent.y, '#fde047');
          ent.x = -100;
        } else {
          this.state.lives--;
          this.state.combo = 1;
          soundSystem.playError();
          this.addFloatingText("-1 Vida", ent.x, ent.y, '#f43f5e');
          ent.x = -100;
          if (this.state.lives <= 0) {
            this.gameOver("La célula agotó sus reservas energéticas antes de alcanzar la trompa. ¡Usa el turbo para esquivar las barreras!");
          }
        }
      }
    });

    this.ctx.save();
    this.ctx.translate(p.x, p.y);

    if (p.isTurbo) {
      this.ctx.strokeStyle = 'rgba(103, 232, 249, 0.6)';
      this.ctx.lineWidth = 6;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.radius * 1.7, p.radius * 1.3, 0, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    this.ctx.fillStyle = p.isTurbo ? '#67e8f9' : '#ffffff';
    this.ctx.shadowColor = p.isTurbo ? '#06b6d4' : '#818cf8';
    this.ctx.shadowBlur = p.isTurbo ? 22 : 12;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, p.radius * 1.5, p.radius, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    this.ctx.fillStyle = '#f59e0b';
    this.ctx.fillRect(-p.radius * 1.5 - 6, -3, 6, 6);

    this.ctx.strokeStyle = p.isTurbo ? '#a5f3fc' : 'rgba(255, 255, 255, 0.9)';
    this.ctx.lineWidth = p.isTurbo ? 3.8 : 2.4;
    this.ctx.beginPath();
    this.ctx.moveTo(-p.radius * 1.5 - 6, 0);

    const freq = p.isTurbo ? 0.05 : 0.025;
    const waveAmp = p.isTurbo ? 18 : 10;
    const now = Date.now() * freq;
    const w1 = Math.sin(now) * waveAmp;
    const w2 = Math.cos(now + 1) * waveAmp;
    const w3 = Math.sin(now + 2) * waveAmp * 0.6;
    this.ctx.bezierCurveTo(-26, w1, -50, -w2, -75, w3);
    this.ctx.stroke();

    this.ctx.restore();

    this.drawFloatingTexts();

    const progressPct = Math.min(100, Math.floor(this.state.distanceProgress));
    this.updateHUD(
      `Fase ${this.state.phase}/3 | Recorrido: ${progressPct}% | ATP: ${this.state.score}`,
      `Vidas: ${'❤️'.repeat(Math.max(0, this.state.lives))} ${p.isTurbo ? '⚡ ¡HIPERACTIVACIÓN!' : '[ESPACIO / CLIC = Turbo]'}`
    );
  }

  triggerFertilizationExplosion(x, y) {
    for (let i = 0; i < 120; i++) {
      this.state.particles.push({
        x: x - 90,
        y: y,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
        life: 1.2,
        color: ['#fde047', '#f472b6', '#38bdf8', '#ffffff', '#a855f7'][Math.floor(Math.random() * 5)]
      });
    }
    this.victory("¡Fecundación y Reacción Cortical Completadas! El espermatozoide ha penetrado la zona pelúcida, liberando la dotación cromosómica haploide para crear una nueva vida única con 46 cromosomas.");
  }

  // ================= 2. JUEGO RITMO CARDÍACO =================
  initHeartbeat() {
    this.state.targetScore = 18;
    this.state.bpm = 70;
    this.state.combo = 0;
    this.state.notes = [];
    this.state.lastNoteTime = 0;
    this.state.tracks = [
      { id: 0, key: 'A', name: 'Nodo Sinoauricular', x: 250, color: '#f43f5e' },
      { id: 1, key: 'S', name: 'Haz de His', x: 400, color: '#38bdf8' },
      { id: 2, key: 'D', name: 'Fibras de Purkinje', x: 550, color: '#10b981' }
    ];
  }

  updateHeartbeat() {
    this.ctx.fillStyle = '#060914';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const hitY = 360;

    if (Date.now() - this.state.lastNoteTime > 850) {
      const trackIdx = Math.floor(Math.random() * 3);
      this.state.notes.push({
        track: trackIdx,
        y: 40,
        speed: 4.8,
        hit: false
      });
      this.state.lastNoteTime = Date.now();
    }

    this.state.tracks.forEach((tr) => {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(tr.x, 30);
      this.ctx.lineTo(tr.x, this.canvas.height - 20);
      this.ctx.stroke();

      this.ctx.strokeStyle = tr.color;
      this.ctx.lineWidth = 3;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      this.ctx.beginPath();
      this.ctx.arc(tr.x, hitY, 34, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 16px Outfit, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(tr.key, tr.x, hitY + 6);

      this.ctx.font = '10px Inter';
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.fillText(tr.name, tr.x, hitY + 48);
    });

    this.state.notes.forEach((n) => {
      n.y += n.speed;
      const tr = this.state.tracks[n.track];

      this.ctx.fillStyle = tr.color;
      this.ctx.shadowColor = tr.color;
      this.ctx.shadowBlur = 18;
      this.ctx.beginPath();
      this.ctx.arc(tr.x, n.y, 22, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(tr.x, n.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.state.notes = this.state.notes.filter((n) => {
      if (n.y > hitY + 50 && !n.hit) {
        this.state.combo = 0;
        soundSystem.playError();
        this.addFloatingText("¡FALLO!", this.state.tracks[n.track].x, hitY - 40, "#f43f5e");
        return false;
      }
      return n.y <= hitY + 50;
    });

    this.updateParticles();
    this.drawFloatingTexts();

    this.updateHUD(
      `Puntos: ${this.state.score}/${this.state.targetScore} | Frecuencia: ${this.state.bpm} BPM`,
      `Combo: x${this.state.combo} | Pulsa [A], [S], [D] o haz clic en los anillos al llegar la nota`
    );
  }

  hitRhythmTrack(trackIdx) {
    const hitY = 360;
    const tr = this.state.tracks[trackIdx];
    let matchedNote = null;
    let minDiff = 999;

    this.state.notes.forEach((n) => {
      if (n.track === trackIdx && !n.hit) {
        const diff = Math.abs(n.y - hitY);
        if (diff < minDiff) {
          minDiff = diff;
          matchedNote = n;
        }
      }
    });

    if (matchedNote && minDiff < 45) {
      matchedNote.hit = true;
      matchedNote.y = 999;
      this.state.score++;
      this.state.combo++;
      this.state.bpm = Math.min(145, 70 + this.state.score * 4);
      soundSystem.playThump();

      const rating = minDiff < 18 ? "¡PERFECTO!" : "¡EXCELENTE!";
      const color = minDiff < 18 ? '#facc15' : '#34d399';
      this.addFloatingText(rating, tr.x, hitY - 45, color);

      for (let i = 0; i < 18; i++) {
        this.state.particles.push({
          x: tr.x,
          y: hitY,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 0.9,
          color: tr.color
        });
      }

      if (this.state.score >= this.state.targetScore) {
        this.victory("¡Electro-Conducción Cardíaca Establecida! El nódulo sinusal sincroniza el gasto cardíaco embrionario a 140 BPM, oxigenando el cerebro y los somitas.");
      }
    } else {
      this.state.combo = 0;
      soundSystem.playError();
      this.addFloatingText("¡A DESTIEMPO!", tr.x, hitY - 45, "#f43f5e");
    }
  }

  // ================= 3. JUEGO MORFOGÉNESIS DIGITAL =================
  initMorphogenesis() {
    this.state.phase = 1;
    this.state.score = 0;
    this.state.fingers = [
      { id: 0, name: "Pulgar", x: 260, y: 220, apoptosis: 0, boneDone: false, nailDone: false },
      { id: 1, name: "Índice", x: 330, y: 155, apoptosis: 0, boneDone: false, nailDone: false },
      { id: 2, name: "Medio", x: 400, y: 130, apoptosis: 0, boneDone: false, nailDone: false },
      { id: 3, name: "Anular", x: 470, y: 155, apoptosis: 0, boneDone: false, nailDone: false },
      { id: 4, name: "Meñique", x: 540, y: 220, apoptosis: 0, boneDone: false, nailDone: false }
    ];
  }

  updateMorphogenesis() {
    this.ctx.fillStyle = '#0a0e1c';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const cx = 400, cy = 295;

    this.ctx.fillStyle = '#fbcfe8';
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    this.ctx.fill();

    this.state.fingers.forEach((f) => {
      const isSeparated = f.apoptosis >= 100;
      const fH = isSeparated ? 90 : 40;

      this.ctx.fillStyle = isSeparated ? '#fda4af' : '#f472b6';
      this.ctx.beginPath();
      this.ctx.ellipse(f.x, f.y - (isSeparated ? 30 : 0), 22, fH, 0, 0, Math.PI * 2);
      this.ctx.fill();

      if (f.boneDone) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.ellipse(f.x, f.y - 25, 8, 32, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }

      if (f.nailDone) {
        this.ctx.fillStyle = '#fff1f2';
        this.ctx.strokeStyle = '#f43f5e';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.ellipse(f.x, f.y - 62, 10, 7, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
      }

      if (!isSeparated) {
        this.ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
        this.ctx.beginPath();
        this.ctx.arc(f.x, f.y, 32, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 11px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`BMP: ${f.apoptosis}%`, f.x, f.y + 4);
      } else if (!f.boneDone) {
        this.ctx.fillStyle = '#67e8f9';
        this.ctx.font = 'bold 11px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("Condensar Hueso", f.x, f.y + 35);
      } else {
        this.ctx.fillStyle = '#059669';
        this.ctx.font = 'bold 11px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`✓ ${f.name}`, f.x, f.y + 35);
      }
    });

    this.updateParticles();
    this.drawFloatingTexts();

    const completed = this.state.fingers.filter((f) => f.nailDone).length;
    this.updateHUD(
      `Mano Humana: ${completed}/5 Dedos Diferenciados`,
      "1) Haz clic en las zonas rojas para apoptosis (BMP). 2) Condensa el hueso. 3) Modela las uñas."
    );
  }

  // ================= 4. JUEGO ECOGRAFÍA DOPPLER =================
  initUltrasound() {
    this.state.targetScore = 4;
    this.state.gain = 75;
    this.state.calipersFound = 0;
    this.state.organs = [
      { id: 'bpd', name: 'Diámetro Biparietal (DBP)', val: '22 mm', x: 260, y: 160, r: 50, measured: false },
      { id: 'heart', name: 'Flujo Cardíaco Doppler', val: '158 BPM', x: 410, y: 240, r: 42, measured: false, isDoppler: true },
      { id: 'fl', name: 'Longitud Femoral (LF)', val: '14 mm', x: 330, y: 340, r: 36, measured: false },
      { id: 'spine', name: 'Columna Vertebral', val: 'Curvatura Normal', x: 550, y: 210, r: 46, measured: false }
    ];
  }

  updateUltrasound() {
    const p = this.state.player;

    this.ctx.fillStyle = '#030509';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    const coneGrad = this.ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, 150);
    coneGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    coneGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.22)');
    coneGrad.addColorStop(1, 'transparent');

    this.ctx.fillStyle = coneGrad;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, 150, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = '#22d3ee';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, 24, 0, Math.PI * 2);
    this.ctx.moveTo(p.x - 34, p.y);
    this.ctx.lineTo(p.x + 34, p.y);
    this.ctx.moveTo(p.x, p.y - 34);
    this.ctx.lineTo(p.x, p.y + 34);
    this.ctx.stroke();

    this.state.organs.forEach((org) => {
      const dist = Math.hypot(p.x - org.x, p.y - org.y);
      if (dist < 135) {
        this.ctx.fillStyle = org.measured ? '#10b981' : '#38bdf8';
        this.ctx.shadowColor = org.measured ? '#34d399' : '#0284c7';
        this.ctx.shadowBlur = 16;
        this.ctx.beginPath();
        this.ctx.arc(org.x, org.y, org.r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px Outfit, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(org.name, org.x, org.y - 6);
        this.ctx.font = '11px Inter';
        this.ctx.fillText(org.val, org.x, org.y + 12);

        if (org.isDoppler && dist < 45 && Math.random() < 0.08) {
          soundSystem.playHeartLubDub();
        }

        if (!org.measured && dist < 38) {
          org.measured = true;
          this.state.score++;
          soundSystem.playSuccess();
          this.addFloatingText(`✓ ${org.name}: ${org.val}`, org.x, org.y - 35, '#34d399');

          if (this.state.score >= this.state.targetScore) {
            this.victory("¡Informe Ecográfico Completo! Todos los parámetros biométricos se encuentran dentro de los percentiles normales de la OMS.");
          }
        }
      }
    });

    this.drawFloatingTexts();

    this.updateHUD(
      `Biometría Ecográfica: ${this.state.score}/4 Mediciones Registradas`,
      "Mueve el transductor ultrasónico por la cavidad amniótica para captar los órganos"
    );
  }

  // ================= 5. JUEGO PLACENTA DEFENSE =================
  initPlacenta() {
    this.state.targetScore = 140;
    this.state.entities = [];
  }

  updatePlacenta() {
    this.ctx.fillStyle = '#080d1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const midX = this.canvas.width / 2;

    this.ctx.strokeStyle = '#ec4899';
    this.ctx.lineWidth = 14;
    this.ctx.beginPath();
    this.ctx.moveTo(midX, 0);
    this.ctx.lineTo(midX, this.canvas.height);
    this.ctx.stroke();

    this.ctx.fillStyle = 'rgba(236, 72, 153, 0.12)';
    this.ctx.fillRect(midX - 30, 0, 60, this.canvas.height);

    this.ctx.fillStyle = '#fda4af';
    this.ctx.font = 'bold 12px Outfit, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("🩸 Sangre Materna (Espacio Intervelloso)", midX - 160, 24);
    this.ctx.fillText("👶 Vena Umbilical Fetal", midX + 160, 24);

    if (Math.random() < 0.1) {
      const isNutrient = Math.random() > 0.35;
      this.state.entities.push({
        x: Math.random() * (midX - 90) + 45,
        y: 0,
        radius: 22,
        type: isNutrient ? 'nutrient' : 'toxic',
        label: isNutrient
          ? ['O₂', 'Calcio', 'Hierro', 'Glucosa', 'Ác. Fólico', 'DHA'][Math.floor(Math.random() * 6)]
          : ['Alcohol', 'Nicotina', 'Virus', 'Toxina'][Math.floor(Math.random() * 4)],
        speed: 2.2 + Math.random() * 2.0
      });
    }

    this.state.entities.forEach((e) => {
      e.y += e.speed;

      this.ctx.fillStyle = e.type === 'nutrient' ? '#10b981' : '#ef4444';
      this.ctx.shadowColor = e.type === 'nutrient' ? '#34d399' : '#f87171';
      this.ctx.shadowBlur = 14;
      this.ctx.beginPath();
      this.ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 10px Inter';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(e.label, e.x, e.y + 4);

      if (e.y > this.canvas.height - 30) {
        if (e.type === 'toxic') {
          this.state.lives--;
          soundSystem.playError();
          this.addFloatingText("¡Toxina Traspasó la Barrera!", e.x, e.y, "#f43f5e");
          if (this.state.lives <= 0) {
            this.gameOver("La barrera placentaria fue superada por sustancias nocivas. ¡Protege el entorno materno!");
          }
        }
        e.y = 999;
      }
    });

    this.state.entities = this.state.entities.filter((e) => e.y < this.canvas.height + 20);

    this.updateParticles();
    this.drawFloatingTexts();

    this.updateHUD(
      `Nutrición Fetal: ${this.state.score}/${this.state.targetScore} pts`,
      `Defensas: ${'🛡️'.repeat(Math.max(0, this.state.lives))} | Clic en Nutrientes para absorber y en Toxinas para neutralizar`
    );
  }

  // ================= 6. JUEGO RED NEURONAL =================
  initSensory() {
    this.state.targetScore = 8;
    this.state.stimuli = [
      { id: 0, label: "Voz Materna", color: "#ec4899", x: 170, y: 130 },
      { id: 1, label: "Latido Cardíaco", color: "#ef4444", x: 630, y: 130 },
      { id: 2, label: "Música de Cuna", color: "#8b5cf6", x: 170, y: 330 },
      { id: 3, label: "Sonido del Agua", color: "#06b6d4", x: 630, y: 330 }
    ];
  }

  updateSensory() {
    this.ctx.fillStyle = '#080c18';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    this.ctx.fillStyle = '#fed7aa';
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 65, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#78350f';
    this.ctx.font = 'bold 13px Outfit, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("Corteza Cerebral", cx, cy + 4);

    const pulseR = (Date.now() * 0.05) % 180;
    this.ctx.strokeStyle = 'rgba(129, 140, 248, 0.35)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
    this.ctx.stroke();

    this.state.stimuli.forEach((s) => {
      this.ctx.fillStyle = s.color;
      this.ctx.shadowColor = s.color;
      this.ctx.shadowBlur = 18;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, 48, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 12px Inter';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(s.label, s.x, s.y + 4);
    });

    this.updateParticles();
    this.drawFloatingTexts();

    this.updateHUD(
      `Sinapsis Auditivas: ${this.state.score}/${this.state.targetScore}`,
      "Haz clic en los 4 estímulos sensoriales para construir conexiones neuronales"
    );
  }

  // ================= 7. JUEGO MONITORIZACIÓN INTRAPARTO =================
  initBirth() {
    this.state.angle = 0;
    this.state.isAligned = false;
    this.state.dilation = 4;
    this.state.breathCycle = 0;
    this.state.contractionsDone = 0;
  }

  updateBirth() {
    this.ctx.fillStyle = '#070a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const cx = 350;
    const cy = 225;

    this.ctx.strokeStyle = this.state.isAligned ? '#10b981' : '#a855f7';
    this.ctx.lineWidth = 12;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy + 45, 115, 0, Math.PI);
    this.ctx.stroke();

    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(this.state.angle);

    this.ctx.fillStyle = '#fed7aa';
    this.ctx.beginPath();
    this.ctx.arc(0, -65, 50, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#78350f';
    this.ctx.beginPath();
    this.ctx.arc(0, -85, 24, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    const gaugeX = 630;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.fillRect(gaugeX - 105, 65, 210, 310);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    this.ctx.strokeRect(gaugeX - 105, 65, 210, 310);

    this.ctx.fillStyle = '#38bdf8';
    this.ctx.font = 'bold 14px Outfit, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("Monitor CTG de Parto", gaugeX, 95);

    this.state.breathCycle = (this.state.breathCycle + 0.6) % 100;
    const waveY = Math.sin((this.state.breathCycle / 100) * Math.PI * 2) * 45;

    this.ctx.strokeStyle = '#f43f5e';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(gaugeX, 220 + waveY, 36, 0, Math.PI * 2);
    this.ctx.stroke();

    const guide = this.state.breathCycle < 50 ? "Inhalar Profundo (4s)" : "Exhalar Suave (4s)";
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 12px Inter';
    this.ctx.fillText(guide, gaugeX, 290);
    this.ctx.fillText(`Dilatación: ${this.state.dilation} cm / 10 cm`, gaugeX, 320);

    this.updateParticles();
    this.drawFloatingTexts();

    this.updateHUD(
      this.state.isAligned ? `✓ Posición Cefálica Encajada (${this.state.dilation} cm)` : "Posición: No encajado (Haz clic para rotar la cabeza)",
      this.state.isAligned ? "Haz clic para acompañar la contracción y completar el nacimiento" : "Haz clic sobre el bebé para girar la cabeza hacia la pelvis"
    );
  }

  handlePointerMove(x, y) {
    if (this.activeMinigameId === 'fertilization' || this.activeMinigameId === 'ultrasound') {
      this.state.player.x = x;
      this.state.player.y = y;
    }
  }

  handlePointerClick(x, y) {
    if (this.activeMinigameId === 'heartbeat') {
      if (x < 320) this.hitRhythmTrack(0);
      else if (x < 480) this.hitRhythmTrack(1);
      else this.hitRhythmTrack(2);
    } else if (this.activeMinigameId === 'morphogenesis') {
      this.state.fingers.forEach((f) => {
        const dist = Math.hypot(x - f.x, y - f.y);
        if (dist < 42) {
          if (f.apoptosis < 100) {
            f.apoptosis = Math.min(100, f.apoptosis + 35);
            soundSystem.playClick();
            this.addFloatingText(`BMP +35%`, f.x, f.y - 25, '#fda4af');
            for (let i = 0; i < 12; i++) {
              this.state.particles.push({
                x: f.x,
                y: f.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 0.8,
                color: '#fda4af'
              });
            }
          } else if (!f.boneDone) {
            f.boneDone = true;
            soundSystem.playSuccess();
            this.addFloatingText(`¡Hueso Condensado!`, f.x, f.y - 25, '#ffffff');
          } else if (!f.nailDone) {
            f.nailDone = true;
            this.state.score++;
            soundSystem.playSuccess();
            this.addFloatingText(`✓ ${f.name} Completo`, f.x, f.y - 25, '#34d399');

            if (this.state.fingers.every((fing) => fing.nailDone)) {
              this.victory("¡Morfogénesis y Extremidad Completa! Los 5 dedos están individualizados por apoptosis, con sus falanges óseas y uñas perfectamente formadas.");
            }
          }
        }
      });
    } else if (this.activeMinigameId === 'placenta') {
      this.state.entities.forEach((e) => {
        const dist = Math.hypot(x - e.x, y - e.y);
        if (dist < e.radius + 20) {
          if (e.type === 'nutrient') {
            this.state.score += 25;
            soundSystem.playSuccess();
            this.addFloatingText(`+25 ${e.label}`, e.x, e.y, "#34d399");
            e.y = 999;
            if (this.state.score >= this.state.targetScore) {
              this.victory("¡Nutrición Fetal Óptima! La placenta ha transportado glucosa, oxígeno y oligoelementos vitales a través del cordón umbilical.");
            }
          } else {
            soundSystem.playThump();
            this.addFloatingText("🛡️ ¡Toxina Neutralizada!", e.x, e.y, "#38bdf8");
            e.y = 999;
          }
        }
      });
    } else if (this.activeMinigameId === 'sensory') {
      this.state.stimuli.forEach((s) => {
        const dist = Math.hypot(x - s.x, y - s.y);
        if (dist < 48) {
          this.state.score++;
          soundSystem.playSuccess();
          this.addFloatingText(`♪ ${s.label}`, s.x, s.y - 25, s.color);

          const cx = this.canvas.width / 2;
          const cy = this.canvas.height / 2;
          for (let i = 0; i < 16; i++) {
            this.state.particles.push({
              x: s.x,
              y: s.y,
              vx: (cx - s.x) * 0.045 + (Math.random() - 0.5) * 4,
              vy: (cy - s.y) * 0.045 + (Math.random() - 0.5) * 4,
              life: 1.0,
              color: s.color
            });
          }

          if (this.state.score >= this.state.targetScore) {
            this.victory("¡Circuito Cerebral Conectado! Las vías auditivas y sensoriales han establecido memorias perinatales tempranas.");
          }
        }
      });
    } else if (this.activeMinigameId === 'birth') {
      if (!this.state.isAligned) {
        this.state.angle += Math.PI / 4;
        soundSystem.playClick();
        if (Math.abs(this.state.angle - Math.PI) < 0.25) {
          this.state.isAligned = true;
          soundSystem.playSuccess();
          this.addFloatingText("✓ ¡Encajamiento Cefálico Óptimo!", 350, 120, "#10b981");
        }
      } else {
        this.state.dilation = Math.min(10, this.state.dilation + 2);
        soundSystem.playSuccess();
        this.addFloatingText(`¡Dilatación +2 cm!`, 630, 220, '#34d399');

        if (this.state.dilation >= 10) {
          this.victory("¡Bienvenido al Mundo! Ha nacido un bebé a término en la Semana 40 con llanto vigoroso y Test de Apgar 10/10. ¡El milagro de la vida se ha completado!");
        }
      }
    }
  }

  handleSpaceKey() {
    if (this.activeMinigameId === 'heartbeat') {
      this.hitRhythmTrack(1);
    }
  }

  addFloatingText(text, x, y, color = '#ffffff') {
    this.state.floatingTexts.push({
      text,
      x,
      y,
      color,
      life: 1.0
    });
    if (this.fx) {
      this.fx.spawnFloatingText(text, x, y, color);
      this.fx.spawnBurst(x, y, 14, color, 3.5);
    }
  }

  drawFloatingTexts() {
    this.state.floatingTexts.forEach((ft) => {
      this.ctx.fillStyle = ft.color;
      this.ctx.globalAlpha = Math.max(0, Math.min(1, ft.life));
      this.ctx.font = 'bold 15px Outfit, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = ft.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1.0;

      ft.y -= 1.4;
      ft.life -= 0.035;
    });

    this.state.floatingTexts = this.state.floatingTexts.filter((ft) => ft.life > 0.05);
  }

  updateParticles() {
    this.state.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;

      if (p.life > 0.04) {
        const radius = Math.max(0.1, 4 * p.life);
        this.ctx.fillStyle = p.color || '#60a5fa';
        this.ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
      }
    });

    this.state.particles = this.state.particles.filter((p) => p.life > 0.04);
  }

  updateHUD(leftText, rightText) {
    this.hud.innerHTML = `
      <div class="minigame-hud-badge"><i class="fa-solid fa-trophy"></i> ${leftText}</div>
      <div class="minigame-hud-badge"><i class="fa-solid fa-heart-pulse"></i> ${rightText}</div>
    `;
  }

  victory(message) {
    this.isRunning = false;
    soundSystem.playFanfare();

    if (window.confetti) {
      window.confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
    }

    this.engine.unlockMedalForMinigame(this.state.stageId);

    const overlayTitle = document.getElementById('overlay-title');
    const overlayDesc = document.getElementById('overlay-desc');
    const btnStart = document.getElementById('btn-start-minigame');

    overlayTitle.innerHTML = "<span style='color: #10b981;'><i class='fa-solid fa-circle-check'></i> ¡Reto Superado!</span>";
    overlayDesc.textContent = message;
    btnStart.innerHTML = "<i class='fa-solid fa-rotate-right'></i> Jugar de Nuevo";
    this.overlay.classList.remove('hidden');
  }

  gameOver(message) {
    this.isRunning = false;
    soundSystem.playError();

    const overlayTitle = document.getElementById('overlay-title');
    const overlayDesc = document.getElementById('overlay-desc');
    const btnStart = document.getElementById('btn-start-minigame');

    overlayTitle.innerHTML = "<span style='color: #f43f5e;'><i class='fa-solid fa-circle-xmark'></i> Fin del Reto</span>";
    overlayDesc.textContent = message;
    btnStart.innerHTML = "<i class='fa-solid fa-rotate-right'></i> Reintentar Reto";
    this.overlay.classList.remove('hidden');
  }

  closeMinigame() {
    this.isRunning = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.modal.classList.remove('open');
  }

  runLoop() {
    if (!this.isRunning) return;

    try {
      this.ctx.save();
      this.fx.applyCameraShake();

      if (this.activeMinigameId === 'fertilization') this.updateFertilization();
      else if (this.activeMinigameId === 'heartbeat') this.updateHeartbeat();
      else if (this.activeMinigameId === 'morphogenesis') this.updateMorphogenesis();
      else if (this.activeMinigameId === 'ultrasound') this.updateUltrasound();
      else if (this.activeMinigameId === 'placenta') this.updatePlacenta();
      else if (this.activeMinigameId === 'sensory') this.updateSensory();
      else if (this.activeMinigameId === 'birth') this.updateBirth();

      this.fx.updateAndRender();
      this.ctx.restore();
    } catch (err) {
      console.warn("Minigame runLoop safe catch:", err);
    }

    if (this.isRunning) {
      this.animationId = requestAnimationFrame(() => this.runLoop());
    }
  }
}
