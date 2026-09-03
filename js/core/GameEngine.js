// ==========================================================================
// MOTOR CENTRAL DEL JUEGO (GameEngine)
// Coordina el estado de la aplicación, transiciones entre etapas, visor 3D,
// audio, minijuegos, simulador de cuidados, trivia y sistema de logros.
// ==========================================================================

import { STAGES_DATA } from '../data/stagesData.js';
import { MEDALS_DATA } from '../data/triviaData.js';
import { soundSystem } from '../audio/SoundSystem.js';

export class GameEngine {
  constructor(sceneManager, embryoBuilder, scaleObjects, ecgMonitor) {
    this.sceneManager = sceneManager;
    this.embryoBuilder = embryoBuilder;
    this.scaleObjects = scaleObjects;
    this.ecgMonitor = ecgMonitor;

    this.currentStageId = 0;
    this.currentMode = 'story'; // 'story' | 'lab' | 'minigames' | 'care' | 'trivia'
    this.currentRenderMode = 'bio'; // 'bio' | 'xray' | 'ultrasound'
    this.isScaleVisible = false;
    this.isTourPlaying = false;
    this.tourTimer = null;

    this.medals = JSON.parse(JSON.stringify(MEDALS_DATA));

    // Gestores delegados y extras
    this.minigamesManager = null;
    this.careSimulator = null;
    this.triviaManager = null;
    this.encyclopediaManager = null;

    this.maternalSilhouette = null;
    this.hotspotManager = null;
    this.snapshotTool = null;
    this.isMaternalVisible = false;

    // Vincular pulso de latido con el ECG y el HUD
    soundSystem.onHeartbeatTick = () => {
      if (this.ecgMonitor) this.ecgMonitor.triggerPulse();
    };

    // Registrar actualización en el ciclo de Three.js
    this.sceneManager.addUpdateCallback((deltaTime, elapsedTime) => {
      this.embryoBuilder.update(deltaTime, elapsedTime);
      this.scaleObjects.update(elapsedTime);
      if (this.maternalSilhouette) this.maternalSilhouette.update(elapsedTime);
      if (this.hotspotManager) this.hotspotManager.update(elapsedTime);
    });
  }

  setManagers(minigames, care, trivia, encyclopedia) {
    this.minigamesManager = minigames;
    this.careSimulator = care;
    this.triviaManager = trivia;
    this.encyclopediaManager = encyclopedia;
  }

  setExtras(maternalSilhouette, hotspotManager, snapshotTool) {
    this.maternalSilhouette = maternalSilhouette;
    this.hotspotManager = hotspotManager;
    this.snapshotTool = snapshotTool;
  }

  init() {
    this.sceneManager.scene.add(this.embryoBuilder.rootGroup);
    this.sceneManager.scene.add(this.scaleObjects.rootGroup);
    if (this.maternalSilhouette) {
      this.sceneManager.scene.add(this.maternalSilhouette.rootGroup);
    }
    this.scaleObjects.setVisible(this.isScaleVisible);

    this.loadStage(0);
  }

  loadStage(stageId) {
    if (stageId < 0) stageId = 0;
    if (stageId >= STAGES_DATA.length) stageId = STAGES_DATA.length - 1;

    this.currentStageId = stageId;
    const stage = STAGES_DATA[stageId];

    // 1. Reconstruir modelo 3D del embrión
    this.embryoBuilder.buildStage(stage, this.currentRenderMode);

    // 2. Actualizar objeto 3D de escala con fruta
    this.scaleObjects.showFruitForStage(stageId);

    // Actualizar silueta materna y marcadores si están activos
    if (this.maternalSilhouette) this.maternalSilhouette.updateForStage(stageId);
    if (this.hotspotManager) this.hotspotManager.updateForStage(stageId);

    // 3. Actualizar BPM y latidos cardíacos en tiempo real
    soundSystem.setBpm(stage.bpm);
    if (this.ecgMonitor) this.ecgMonitor.setBpm(stage.bpm);
    const bpmDisplay = document.getElementById('bpm-display');
    if (bpmDisplay) {
      bpmDisplay.textContent = stage.bpm > 0 ? `${stage.bpm} BPM` : 'Sin latido';
    }

    // 4. Actualizar Interfaz de Usuario (HUD derecho e inferior)
    this.updateUI(stage);

    // 5. Centrar suavemente la cámara
    if (this.isScaleVisible) {
      this.sceneManager.setComparisonView(stageId);
    } else {
      this.sceneManager.resetCamera();
    }

    // 6. Sonido de transición
    try {
      soundSystem.playWhoosh();
    } catch (e) {
      console.warn("Audio transition warning:", e);
    }

    // Comprobar logro de exploración completa
    if (stageId === 6) {
      this.unlockMedal('explorer_3d');
    }
  }

  getCurrentStageData() {
    return STAGES_DATA[this.currentStageId];
  }

  toggleMaternalSilhouette() {
    if (!this.maternalSilhouette) return false;
    this.isMaternalVisible = !this.isMaternalVisible;
    this.maternalSilhouette.setVisible(this.isMaternalVisible);
    this.maternalSilhouette.updateForStage(this.currentStageId);

    const btn = document.getElementById('btn-toggle-maternal');
    const status = document.getElementById('maternal-pill-status');
    if (btn && status) {
      if (this.isMaternalVisible) {
        btn.classList.add('active');
        status.textContent = "Activo";
      } else {
        btn.classList.remove('active');
        status.textContent = "Desactivado";
      }
    }

    soundSystem.playClick();
    this.showToast(this.isMaternalVisible ? "🤰 Silueta Materna y Útero en 3D Activados" : "Silueta Materna Desactivada");
    return this.isMaternalVisible;
  }

  toggleHotspots() {
    if (!this.hotspotManager) return false;
    const vis = this.hotspotManager.toggleVisible();
    const btn = document.getElementById('btn-toggle-hotspots');
    const status = document.getElementById('hotspots-pill-status');
    if (btn && status) {
      if (vis) {
        btn.classList.add('active');
        status.textContent = "Visible";
      } else {
        btn.classList.remove('active');
        status.textContent = "Oculto";
      }
    }
    this.showToast(vis ? "📌 Marcadores Anatómicos Visibles" : "Marcadores Ocultos");
    return vis;
  }

  takeSnapshot() {
    if (this.snapshotTool) {
      this.snapshotTool.takeSnapshot();
    }
  }

  nextStage() {
    if (this.currentStageId < STAGES_DATA.length - 1) {
      this.loadStage(this.currentStageId + 1);
    } else {
      this.loadStage(0);
    }
  }

  prevStage() {
    if (this.currentStageId > 0) {
      this.loadStage(this.currentStageId - 1);
    } else {
      this.loadStage(STAGES_DATA.length - 1);
    }
  }

  setRenderMode(mode) {
    this.currentRenderMode = mode;
    this.embryoBuilder.applyRenderMode(mode);
    soundSystem.playClick();
  }

  toggleScale() {
    this.isScaleVisible = !this.isScaleVisible;
    this.scaleObjects.setVisible(this.isScaleVisible);

    const pillBtn = document.getElementById('btn-toggle-scale');
    const pillText = document.getElementById('scale-pill-status');

    if (pillBtn && pillText) {
      if (this.isScaleVisible) {
        pillBtn.classList.add('active');
        pillText.textContent = "Activo";
        this.unlockMedal('fruit_master');
        this.sceneManager.setComparisonView(this.currentStageId);
        this.showToast("🍉 Vista comparativa activada: Feto y Fruta lado a lado");
      } else {
        pillBtn.classList.remove('active');
        pillText.textContent = "Desactivado";
        this.sceneManager.resetCamera();
      }
    }

    soundSystem.playClick();
    return this.isScaleVisible;
  }

  toggleAutoTour() {
    this.isTourPlaying = !this.isTourPlaying;
    const playBtn = document.getElementById('btn-play-tour');

    if (this.isTourPlaying) {
      if (playBtn) playBtn.innerHTML = "<i class='fa-solid fa-pause'></i>";
      this.showToast("▶ Iniciando recorrido automático");
      this.tourTimer = setInterval(() => {
        this.nextStage();
      }, 7000);
    } else {
      if (playBtn) playBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
      this.showToast("⏸ Recorrido pausado");
      if (this.tourTimer) {
        clearInterval(this.tourTimer);
        this.tourTimer = null;
      }
    }

    soundSystem.playClick();
    return this.isTourPlaying;
  }

  updateUI(stage) {
    // Actualizar ficha lateral derecha
    const stageBadge = document.getElementById('drawer-stage-badge');
    const stageTitle = document.getElementById('drawer-stage-title');
    const stageWeeks = document.getElementById('drawer-stage-weeks');
    const sizeIcon = document.getElementById('size-fruit-icon');
    const sizeValue = document.getElementById('drawer-size-value');
    const sizeFruit = document.getElementById('drawer-size-fruit');
    const fetalList = document.getElementById('drawer-fetal-milestones');
    const maternalList = document.getElementById('drawer-maternal-changes');
    const minigameName = document.getElementById('drawer-minigame-name');

    if (stageBadge) stageBadge.textContent = `Etapa ${stage.id + 1}`;
    if (stageTitle) stageTitle.textContent = stage.name;
    if (stageWeeks) stageWeeks.textContent = stage.weeks;
    if (sizeIcon) sizeIcon.textContent = stage.fruitIcon;
    if (sizeValue) sizeValue.textContent = stage.sizeDisplay;
    if (sizeFruit) sizeFruit.textContent = `(${stage.fruitName})`;
    if (minigameName) minigameName.textContent = stage.minigameTitle;

    if (fetalList) {
      fetalList.innerHTML = '';
      stage.fetalMilestones.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        fetalList.appendChild(li);
      });
    }

    if (maternalList) {
      maternalList.innerHTML = '';
      stage.maternalChanges.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        maternalList.appendChild(li);
      });
    }

    // Actualizar barra de tiempo inferior (nodos)
    const nodes = document.querySelectorAll('.timeline-stage-node');
    nodes.forEach((node) => {
      const sId = parseInt(node.getAttribute('data-stage'));
      if (sId === stage.id) node.classList.add('active');
      else node.classList.remove('active');
    });
  }

  // ================= SISTEMA DE MEDALLAS =================
  unlockMedal(medalId) {
    const m = this.medals.find((item) => item.id === medalId);
    if (m && !m.unlocked) {
      m.unlocked = true;
      this.showToast(`🏆 ¡Logro Desbloqueado: ${m.title}!`);
      soundSystem.playFanfare();
    }
  }

  unlockMedalForMinigame(stageId) {
    if (stageId === 0) this.unlockMedal('first_breath');
    if (stageId === 1) this.unlockMedal('heart_beating');
  }

  getMedals() {
    return this.medals;
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-sparkles"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }
}

