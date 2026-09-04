// ==========================================================================
// PUNTO DE ENTRADA PRINCIPAL (main.js)
// Inicialización y enlace de todos los subsistemas del juego interactivo 3D.
// ==========================================================================

import { SceneManager } from './core/SceneManager.js';
import { EmbryoProcedural } from './models/EmbryoProcedural.js';
import { ScaleObjects } from './models/ScaleObjects.js';
import { ECGMonitor } from './components/ECGMonitor.js';
import { GameEngine } from './core/GameEngine.js';
import { MinigamesManager } from './minigames/MinigamesManager.js';
import { CareSimulator } from './components/CareSimulator.js';
import { TriviaManager } from './components/TriviaManager.js';
import { EncyclopediaManager } from './components/EncyclopediaManager.js';
import { MaternalSilhouette } from './models/MaternalSilhouette.js';
import { HotspotManager } from './components/HotspotManager.js';
import { SnapshotTool } from './components/SnapshotTool.js';
import { GestogramManager } from './components/GestogramManager.js';
import { VoiceNarrator } from './audio/VoiceNarrator.js';
import { BirthSimulator } from './components/BirthSimulator.js';
import { soundSystem } from './audio/SoundSystem.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Obtener canvas WebGL
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) {
    console.error("Error: Canvas WebGL no encontrado.");
    return;
  }

  // 2. Inicializar Gestor de Escena 3D
  const sceneManager = new SceneManager(canvas);

  // 3. Inicializar Modeladores 3D
  const embryoBuilder = new EmbryoProcedural();
  const scaleObjects = new ScaleObjects();
  const maternalSilhouette = new MaternalSilhouette();

  // 4. Inicializar Monitor ECG
  const ecgMonitor = new ECGMonitor('ecg-canvas');

  // 5. Inicializar Motor Central de Juego
  const gameEngine = new GameEngine(sceneManager, embryoBuilder, scaleObjects, ecgMonitor);

  // 6. Inicializar Gestores de Componentes, Extras y Modales
  const minigamesManager = new MinigamesManager(gameEngine);
  const careSimulator = new CareSimulator(gameEngine);
  const triviaManager = new TriviaManager(gameEngine);
  const encyclopediaManager = new EncyclopediaManager(gameEngine);
  const hotspotManager = new HotspotManager(sceneManager, gameEngine);
  const snapshotTool = new SnapshotTool(canvas, gameEngine);
  const gestogramManager = new GestogramManager(gameEngine);
  const voiceNarrator = new VoiceNarrator(gameEngine);
  const birthSimulator = new BirthSimulator(gameEngine);

  // Enlazar gestores con el motor central
  gameEngine.setManagers(minigamesManager, careSimulator, triviaManager, encyclopediaManager);
  gameEngine.setExtras(maternalSilhouette, hotspotManager, snapshotTool);
  gameEngine.init();

  // ================= ENLACE DE EVENTOS DE INTERFAZ =================

  // Inicializar audio al primer clic en cualquier parte
  const userGestureInit = () => {
    soundSystem.init();
    document.removeEventListener('click', userGestureInit);
    document.removeEventListener('keydown', userGestureInit);
  };
  document.addEventListener('click', userGestureInit);
  document.addEventListener('keydown', userGestureInit);

  // Pestañas de Modo Superior
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      navTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.getAttribute('data-mode');
      soundSystem.playClick();

      if (mode === 'story') {
        gameEngine.loadStage(gameEngine.currentStageId);
      } else if (mode === 'lab') {
        if (!gameEngine.isScaleVisible) gameEngine.toggleScale();
      } else if (mode === 'minigames') {
        minigamesManager.openMinigame(gameEngine.currentStageId);
      } else if (mode === 'care') {
        careSimulator.open();
      } else if (mode === 'trivia') {
        triviaManager.open();
      } else if (mode === 'birth-sim') {
        birthSimulator.open();
      }
    });
  });

  // Botón Foto Médica / Ecografía
  const btnSnapshot = document.getElementById('btn-snapshot');
  if (btnSnapshot) {
    btnSnapshot.addEventListener('click', () => gameEngine.takeSnapshot());
  }

  // Botón Narrador por Voz
  const btnVoiceNarrator = document.getElementById('btn-voice-narrator');
  if (btnVoiceNarrator) {
    btnVoiceNarrator.addEventListener('click', () => {
      const stage = gameEngine.getCurrentStageData();
      voiceNarrator.toggleNarration(stage);
    });
  }

  // Botón Pantalla Completa
  const btnFullscreen = document.getElementById('btn-fullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        btnFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i>';
      } else {
        document.exitFullscreen().catch(() => {});
        btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
      }
      soundSystem.playClick();
    });
  }

  // Botón de Audio / Silencio
  const btnAudio = document.getElementById('btn-audio-toggle');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      const isMuted = soundSystem.toggleMute();
      btnAudio.innerHTML = isMuted
        ? '<i class="fa-solid fa-volume-xmark"></i>'
        : '<i class="fa-solid fa-volume-high"></i>';
      gameEngine.showToast(isMuted ? "🔇 Audio silenciado" : "🔊 Audio activado");
    });
  }

  // Botón de Enciclopedia y Logros
  const btnEncyclopedia = document.getElementById('btn-encyclopedia');
  if (btnEncyclopedia) {
    btnEncyclopedia.addEventListener('click', () => encyclopediaManager.open('medals'));
  }

  // Botón de Ayuda e Instrucciones
  const btnHelp = document.getElementById('btn-help');
  const modalHelp = document.getElementById('help-modal');
  const btnCloseHelp = document.getElementById('btn-close-help');
  const btnGotIt = document.getElementById('btn-got-it');

  if (btnHelp && modalHelp) {
    btnHelp.addEventListener('click', () => {
      modalHelp.classList.add('open');
      soundSystem.playClick();
    });
  }
  if (btnCloseHelp && modalHelp) {
    btnCloseHelp.addEventListener('click', () => modalHelp.classList.remove('open'));
  }
  if (btnGotIt && modalHelp) {
    btnGotIt.addEventListener('click', () => modalHelp.classList.remove('open'));
  }

  // Modos de Renderizado (Biológico, Rayos X, Ecografía)
  const hudRenderBtns = document.querySelectorAll('.hud-btn');
  hudRenderBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      hudRenderBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const rMode = btn.getAttribute('data-render-mode');
      gameEngine.setRenderMode(rMode);
    });
  });

  // Interruptor de Comparativa de Frutas
  const btnToggleScale = document.getElementById('btn-toggle-scale');
  if (btnToggleScale) {
    btnToggleScale.addEventListener('click', () => gameEngine.toggleScale());
  }

  // Interruptor de Silueta Materna 3D
  const btnToggleMaternal = document.getElementById('btn-toggle-maternal');
  if (btnToggleMaternal) {
    btnToggleMaternal.addEventListener('click', () => gameEngine.toggleMaternalSilhouette());
  }

  // Interruptor de Marcadores Anatómicos 3D
  const btnToggleHotspots = document.getElementById('btn-toggle-hotspots');
  if (btnToggleHotspots) {
    btnToggleHotspots.addEventListener('click', () => gameEngine.toggleHotspots());
  }

  // Slider de Capas Anatómicas (Piel ⇄ Órganos ⇄ Esqueleto)
  const sliderDissection = document.getElementById('slider-dissection');
  const dissectionValLabel = document.getElementById('dissection-val-label');
  if (sliderDissection) {
    sliderDissection.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 100;
      embryoBuilder.setDissectionLayer(val);
      if (dissectionValLabel) {
        if (val < 0.2) dissectionValLabel.textContent = "Piel";
        else if (val < 0.7) dissectionValLabel.textContent = "Órganos";
        else dissectionValLabel.textContent = "Solo Huesos";
      }
    });
  }

  // Interruptor de Rotación Automática
  const btnToggleRotate = document.getElementById('btn-toggle-autorotate');
  const rotateStatus = document.getElementById('rotate-pill-status');
  if (btnToggleRotate) {
    btnToggleRotate.addEventListener('click', () => {
      const isRotating = sceneManager.toggleAutoRotate();
      if (isRotating) {
        btnToggleRotate.classList.add('active');
        if (rotateStatus) rotateStatus.textContent = "Activo";
      } else {
        btnToggleRotate.classList.remove('active');
        if (rotateStatus) rotateStatus.textContent = "Pausado";
      }
      soundSystem.playClick();
    });
  }

  // Botones de Zoom de Cámara
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      sceneManager.zoomIn();
      soundSystem.playClick();
    });
  }
  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      sceneManager.zoomOut();
      soundSystem.playClick();
    });
  }

  // Modal de Compartir URL y Código QR para Celular
  const btnShareUrl = document.getElementById('btn-share-url');
  const shareModal = document.getElementById('share-modal');
  const btnCloseShare = document.getElementById('btn-close-share');
  const btnCopyUrl = document.getElementById('btn-copy-public-url');
  const inputShareUrl = document.getElementById('share-url-public-input');

  if (btnShareUrl && shareModal) {
    btnShareUrl.addEventListener('click', () => {
      shareModal.classList.add('open');
      soundSystem.playClick();
    });
  }

  if (btnCloseShare && shareModal) {
    btnCloseShare.addEventListener('click', () => {
      shareModal.classList.remove('open');
    });
  }

  if (btnCopyUrl && inputShareUrl) {
    btnCopyUrl.addEventListener('click', () => {
      navigator.clipboard.writeText(inputShareUrl.value).then(() => {
        btnCopyUrl.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
        btnCopyUrl.style.background = '#10b981';
        gameEngine.showToast("✓ Enlace público copiado al portapapeles. ¡Listo para compartir!");
        soundSystem.playSuccess();
        setTimeout(() => {
          btnCopyUrl.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar';
          btnCopyUrl.style.background = '';
        }, 2500);
      }).catch(() => {
        inputShareUrl.select();
        document.execCommand('copy');
        gameEngine.showToast("✓ Enlace copiado.");
      });
    });
  }

  // Botón Centrar Cámara
  const btnResetCam = document.getElementById('btn-reset-cam');
  if (btnResetCam) {
    btnResetCam.addEventListener('click', () => {
      sceneManager.resetCamera();
      soundSystem.playClick();
    });
  }

  // Botón Jugar Minijuego de la Etapa (Panel Derecho)
  const btnLaunchMinigame = document.getElementById('btn-launch-stage-minigame');
  if (btnLaunchMinigame) {
    btnLaunchMinigame.addEventListener('click', () => {
      minigamesManager.openMinigame(gameEngine.currentStageId);
    });
  }

  // Navegación de Etapas (Prev / Tour / Next)
  const btnPrev = document.getElementById('btn-prev-stage');
  const btnNext = document.getElementById('btn-next-stage');
  const btnTour = document.getElementById('btn-play-tour');

  if (btnPrev) btnPrev.addEventListener('click', () => gameEngine.prevStage());
  if (btnNext) btnNext.addEventListener('click', () => gameEngine.nextStage());
  if (btnTour) btnTour.addEventListener('click', () => gameEngine.toggleAutoTour());

  // Nodos de la barra inferior de tiempo
  const stageNodes = document.querySelectorAll('.timeline-stage-node');
  stageNodes.forEach((node) => {
    node.addEventListener('click', () => {
      const stageId = parseInt(node.getAttribute('data-stage'));
      gameEngine.loadStage(stageId);
    });
  });

  // Botones para colapsar/expandir paneles y tener la vista 3D despejada
  const btnToggleLeft = document.getElementById('btn-toggle-left-hud');
  const leftHud = document.querySelector('.left-controls-hud');
  if (btnToggleLeft && leftHud) {
    btnToggleLeft.addEventListener('click', () => {
      leftHud.classList.toggle('collapsed');
      const icon = btnToggleLeft.querySelector('i');
      if (leftHud.classList.contains('collapsed')) {
        icon.className = 'fa-solid fa-chevron-right';
        btnToggleLeft.style.right = '-32px';
      } else {
        icon.className = 'fa-solid fa-chevron-left';
        btnToggleLeft.style.right = '-14px';
      }
    });
  }

  const btnToggleRight = document.getElementById('btn-toggle-right-hud');
  const rightHud = document.getElementById('stage-info-drawer');
  if (btnToggleRight && rightHud) {
    btnToggleRight.addEventListener('click', () => {
      rightHud.classList.toggle('collapsed');
      const icon = btnToggleRight.querySelector('i');
      if (rightHud.classList.contains('collapsed')) {
        icon.className = 'fa-solid fa-chevron-left';
        btnToggleRight.style.left = '-32px';
      } else {
        icon.className = 'fa-solid fa-chevron-right';
        btnToggleRight.style.left = '-14px';
      }
    });
  }

  // En móviles o pantallas estrechas (Google / Chrome en celular), colapsar paneles de inmediato
  // para que el feto 3D sea 100% visible desde el primer instante sin paneles encima
  if (window.innerWidth <= 900) {
    if (leftHud && btnToggleLeft) {
      leftHud.classList.add('collapsed');
      const iconL = btnToggleLeft.querySelector('i');
      if (iconL) iconL.className = 'fa-solid fa-chevron-right';
      btnToggleLeft.style.right = '-32px';
    }
    if (rightHud && btnToggleRight) {
      rightHud.classList.add('collapsed');
      const iconR = btnToggleRight.querySelector('i');
      if (iconR) iconR.className = 'fa-solid fa-chevron-left';
      btnToggleRight.style.left = '-32px';
    }
  }

  // Mensaje de bienvenida inicial
  setTimeout(() => {
    gameEngine.showToast("👋 ¡Bienvenido al Viaje de la Vida! Usa el mouse para rotar el feto en 3D.");
  }, 1200);
});

