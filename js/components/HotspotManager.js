// ==========================================================================
// GESTOR DE CARACTERÍSTICAS Y HITOS ANATÓMICOS 3D POR ETAPA (HotspotManager)
// - Marcadores 3D altamente visibles con anillos luminosos pulsantes.
// - Sprites de texto 3D flotantes con título y número visible en tiempo real.
// - Puntos anatómicos específicos y fidedignos para CADA una de las 7 etapas.
// - Panel de detalles clínicos y barra interactiva de acceso rápido.
// ==========================================================================

import * as THREE from 'three';
import { soundSystem } from '../audio/SoundSystem.js';

export class HotspotManager {
  constructor(sceneManager, gameEngine) {
    this.sceneManager = sceneManager;
    this.engine = gameEngine;
    this.hotspotsGroup = new THREE.Group();
    this.hotspotsGroup.name = "StageCharacteristicsHotspots";
    this.isVisible = true;

    // Catálogo de características anatómicas clave por etapa (0 a 6)
    this.stageFeaturesData = {
      // ETAPA 0: SEMANA 1 - CONCEPCIÓN / CIGOTO
      0: [
        {
          num: 1,
          id: "zona_pellucida",
          title: "Zona Pelúcida Protectora",
          category: "Membrana Celular",
          color: "#38bdf8",
          pos: new THREE.Vector3(0, 1.42, 0),
          camFocus: new THREE.Vector3(0, 1.0, 0),
          desc: "Matriz glucoproteica extracelular que envuelve al óvulo. Tras el ingreso del primer espermatozoide, experimenta la reacción cortical que endurece la membrana para bloquear permanentemente la polispermia."
        },
        {
          num: 2,
          id: "pronuclei",
          title: "Singamia & Pronúcleos",
          category: "Genética Humana",
          color: "#ec4899",
          pos: new THREE.Vector3(0.42, 0.25, 0.25),
          camFocus: new THREE.Vector3(0.2, 0.2, 0.2),
          desc: "Fusión de los pronúcleos masculino (espermatozoide) y femenino (óvulo). Se restablece el genoma diploide humano de 46 cromosomas, definiendo el sexo genético, grupo sanguíneo y características biológicas únicas."
        },
        {
          num: 3,
          id: "blastomeres",
          title: "Segmentación & Blastómeras",
          category: "Embriología Temprana",
          color: "#facc15",
          pos: new THREE.Vector3(-0.45, -0.22, -0.25),
          camFocus: new THREE.Vector3(-0.2, -0.2, 0),
          desc: "Primeras mitosis o clivajes celulares sin aumento de volumen global. Estas blastómeras son totipotentes: cada una tiene la capacidad de originar cualquier célula del cuerpo o un embrión completo."
        },
        {
          num: 4,
          id: "polar_bodies",
          title: "Cuerpos Polares",
          category: "Meiosis Celular",
          color: "#a855f7",
          pos: new THREE.Vector3(0.95, -0.85, 0.1),
          camFocus: new THREE.Vector3(0.6, -0.5, 0),
          desc: "Células no funcionales resultantes de la división meiótica asimétrica del ovocito. Su presencia en el espacio perivitelino confirma la finalización exitosa de la fecundación."
        }
      ],

      // ETAPA 1: SEMANAS 2-4 - EMBRIÓN TEMPRANO
      1: [
        {
          num: 1,
          id: "neural_tube",
          title: "Tubo Neural & Neuroectodermo",
          category: "Sistema Nervioso Central",
          color: "#38bdf8",
          pos: new THREE.Vector3(0.12, 0.95, 0.15),
          camFocus: new THREE.Vector3(0.1, 0.7, 0.1),
          desc: "Neurulación activa: la placa neural se invagina formando el tubo neural primitivo. Los neuroporos anterior y posterior se cierran en este periodo, originando el encéfalo y la médula espinal."
        },
        {
          num: 2,
          id: "heart_tube",
          title: "Tubo Cardíaco Primitivo",
          category: "Aparato Cardiovascular",
          color: "#f43f5e",
          pos: new THREE.Vector3(0.62, 0.48, 0.22),
          camFocus: new THREE.Vector3(0.4, 0.4, 0.1),
          desc: "Es el primer órgano funcional del embrión. Inicia sus contracciones rítmicas a partir del día 22 con ondas peristálticas, bombeando sangre a través del saco vitelino y los arcos aórticos."
        },
        {
          num: 3,
          id: "somites",
          title: "Somitas Paraxiales",
          category: "Aparato Locomotor",
          color: "#facc15",
          pos: new THREE.Vector3(-0.45, 0.25, 0.3),
          camFocus: new THREE.Vector3(-0.3, 0.2, 0.1),
          desc: "Bloques segmentarios de mesodermo a ambos lados del tubo neural. Se diferencian en esclerotomo (esqueleto axial, 33 vértebras y costillas), miotomo (músculos) y dermatomo (dermis)."
        },
        {
          num: 4,
          id: "yolk_sac",
          title: "Saco Vitelino Nutritivo",
          category: "Nutrición Embrionaria",
          color: "#10b981",
          pos: new THREE.Vector3(-1.05, 0.28, 0.05),
          camFocus: new THREE.Vector3(-0.7, 0.2, 0),
          desc: "Estructura membranosa extraembrionaria donde se forman las primeras células sanguíneas (hematopoyesis) y las células germinales primordiales antes del establecimiento de la placenta."
        }
      ],

      // ETAPA 2: SEMANAS 5-8 - EMBRIÓN
      2: [
        {
          num: 1,
          id: "pharyngeal_arches",
          title: "Arcos Faríngeos / Branquiales",
          category: "Desarrollo Craneofacial",
          color: "#a855f7",
          pos: new THREE.Vector3(0.32, 0.85, 0.42),
          camFocus: new THREE.Vector3(0.2, 0.7, 0.2),
          desc: "Estructuras segmentarias en el cuello que dan origen a la mandíbula, maxilar, huesecillos del oído medio (martillo y yunque), lengua y cartílagos laríngeos de la garganta."
        },
        {
          num: 2,
          id: "digital_rays",
          title: "Paletas con Rayos Digitales",
          category: "Morfogénesis de Miembros",
          color: "#38bdf8",
          pos: new THREE.Vector3(0.72, 0.28, 0.7),
          camFocus: new THREE.Vector3(0.5, 0.2, 0.4),
          desc: "Las extremidades superiores forman paletas aplanadas. Mediante apoptosis o muerte celular programada de los tejidos interdigitales, se separan los 5 dedos individuales de la mano."
        },
        {
          num: 3,
          id: "pigmented_retina",
          title: "Ojos con Retina Pigmentada",
          category: "Órganos de los Sentidos",
          color: "#f43f5e",
          pos: new THREE.Vector3(0.52, 1.35, 0.82),
          camFocus: new THREE.Vector3(0.3, 1.2, 0.5),
          desc: "Las copas ópticas acumulan melanina visible como dos puntos negros circulares en los laterales de la cabeza, antes de migrar a su posición anterior definitiva."
        },
        {
          num: 4,
          id: "gut_herniation",
          title: "Hernia Umbilical Fisiológica",
          category: "Aparato Digestivo",
          color: "#facc15",
          pos: new THREE.Vector3(0.95, -0.35, 0.38),
          camFocus: new THREE.Vector3(0.6, -0.2, 0.2),
          desc: "Debido a que el hígado embrionario ocupa casi todo el abdomen, las asas del intestino medio crecen hacia el cordón umbilical rotando 270° antes de regresar a la cavidad abdominal en la semana 10."
        }
      ],

      // ETAPA 3: SEMANAS 9-12 - FETO TEMPRANO
      3: [
        {
          num: 1,
          id: "sealed_eyelids",
          title: "Párpados Sellados Fetalmente",
          category: "Oftalmología Fetal",
          color: "#38bdf8",
          pos: new THREE.Vector3(0.98, 1.48, 0.55),
          camFocus: new THREE.Vector3(0.6, 1.3, 0.3),
          desc: "Los párpados se fusionan por completo para proteger las córneas y cristalinos en desarrollo contra la irritación del líquido amniótico hasta la semana 26."
        },
        {
          num: 2,
          id: "ossification",
          title: "Centros de Osificación Primaria",
          category: "Sistema Esquelético Humano",
          color: "#facc15",
          pos: new THREE.Vector3(0.32, -1.05, 0.58),
          camFocus: new THREE.Vector3(0.2, -0.8, 0.3),
          desc: "El cartílago hialino de los huesos largos (fémur, tibia, húmero) comienza a osificarse mediante osteoblastos, endureciendo el esqueleto y permitiendo detectar ecos óseos en ultrasonido."
        },
        {
          num: 3,
          id: "swallowing",
          title: "Reflejo de Deglución & Riñones",
          category: "Fisiología Digestiva y Renal",
          color: "#10b981",
          pos: new THREE.Vector3(0.92, 1.15, 0.12),
          camFocus: new THREE.Vector3(0.5, 0.9, 0.1),
          desc: "El feto comienza a tragar pequeñas cantidades de líquido amniótico. Sus riñones filtran la sangre y producen orina estéril que se excreta de nuevo al saco amniótico, manteniendo su volumen constante."
        },
        {
          num: 4,
          id: "external_genitalia",
          title: "Diferenciación Genital Externa",
          category: "Sistema Reproductor",
          color: "#ec4899",
          pos: new THREE.Vector3(0.08, -0.72, 0.38),
          camFocus: new THREE.Vector3(0.05, -0.6, 0.2),
          desc: "El tubérculo genital se diferencia claramente en genitales masculinos (pene y escroto por efecto de la testosterona) o femeninos (clítoris y labios mayores)."
        }
      ],

      // ETAPA 4: SEMANAS 13-20 - FETO EN DESARROLLO
      4: [
        {
          num: 1,
          id: "thumb_sucking",
          title: "Reflejo de Succión del Pulgar",
          category: "Neurología & Reflejos",
          color: "#ec4899",
          pos: new THREE.Vector3(0.82, 1.32, 0.22),
          camFocus: new THREE.Vector3(0.5, 1.1, 0.1),
          desc: "Coordinación psicomotriz avanzada: el feto se lleva el pulgar a los labios y realiza movimientos de succión rítmica, preparando los músculos para el amamantamiento al nacer."
        },
        {
          num: 2,
          id: "lanugo_vernix",
          title: "Lanugo & Vérnix Caseosa",
          category: "Dermatología Fetal",
          color: "#38bdf8",
          pos: new THREE.Vector3(-0.45, 0.85, 0.62),
          camFocus: new THREE.Vector3(-0.2, 0.6, 0.3),
          desc: "Aparece un vello fino sedoso (lanugo) que retiene la vérnix caseosa, una capa cremosa rica en lípidos que protege la piel del feto contra la maceración por el líquido amniótico."
        },
        {
          num: 3,
          id: "fetal_movements",
          title: "Movimientos Activos (Quickening)",
          category: "Sistema Musculoesquelético",
          color: "#facc15",
          pos: new THREE.Vector3(0.52, -1.45, 0.35),
          camFocus: new THREE.Vector3(0.3, -1.1, 0.2),
          desc: "Las articulaciones de rodillas, caderas y tobillos están completamente formadas. El feto patea, estira las piernas y gira sobre sí mismo; la madre comienza a percibir las primeras pataditas."
        },
        {
          num: 4,
          id: "auditory_cochlea",
          title: "Oído Funcional & Respuesta Acústica",
          category: "Audiología Fetal",
          color: "#a855f7",
          pos: new THREE.Vector3(-0.18, 1.55, 0.82),
          camFocus: new THREE.Vector3(-0.1, 1.3, 0.4),
          desc: "La cóclea y los huesecillos auditivos se mielinizan. El feto ya escucha los latidos maternos, el flujo de sangre de la placenta y los sonidos de la voz materna, reaccionando a la música."
        }
      ],

      // ETAPA 5: SEMANAS 21-36 - FETO AVANZADO
      5: [
        {
          num: 1,
          id: "eyelids_opening",
          title: "Apertura Ocular & Parpadeo",
          category: "Órganos Sensoriales",
          color: "#38bdf8",
          pos: new THREE.Vector3(0.92, 1.78, 0.62),
          camFocus: new THREE.Vector3(0.6, 1.5, 0.3),
          desc: "Los párpados se despegan. El feto abre los ojos, parpadea y reacciona girando la cabeza ante fuentes luminosas potentes aplicadas sobre el abdomen materno."
        },
        {
          num: 2,
          id: "lung_surfactant",
          title: "Surfactante Pulmonar (Neumocitos II)",
          category: "Aparato Respiratorio",
          color: "#f43f5e",
          pos: new THREE.Vector3(0.32, 0.52, 0.72),
          camFocus: new THREE.Vector3(0.2, 0.4, 0.3),
          desc: "Las células de los alvéolos producen dipalmitoilfosfatidilcolina (surfactante), sustancia lipídica que reduce la tensión superficial para que los pulmones no colapsen en la primera inhalación."
        },
        {
          num: 3,
          id: "rem_sleep",
          title: "Ciclos de Sueño REM & Corteza",
          category: "Neurodesarrollo Fetal",
          color: "#a855f7",
          pos: new THREE.Vector3(0.12, 1.95, 0.25),
          camFocus: new THREE.Vector3(0.1, 1.6, 0.1),
          desc: "La corteza cerebral presenta circunvoluciones y surcos pronunciados. El feto tiene ciclos regulares de sueño profundo y sueño REM (con movimientos oculares rápidos) donde procesa estímulos."
        },
        {
          num: 4,
          id: "fat_storage",
          title: "Depósito de Grasa Subcutánea",
          category: "Metabolismo & Termorregulación",
          color: "#facc15",
          pos: new THREE.Vector3(-0.42, 0.22, 0.85),
          camFocus: new THREE.Vector3(-0.2, 0.1, 0.4),
          desc: "Rápida acumulación de grasa parda y blanca bajo la piel, rellenando las arrugas corporales y preparando al bebé para regular su propia temperatura al nacer."
        }
      ],

      // ETAPA 6: SEMANAS 37-40 - FETO A TÉRMINO
      6: [
        {
          num: 1,
          id: "fontanelles",
          title: "Fontanelas Elásticas (Bregma & Lambda)",
          category: "Cráneo Fetal & Parto",
          color: "#38bdf8",
          pos: new THREE.Vector3(0.18, 2.05, 0.12),
          camFocus: new THREE.Vector3(0.1, 1.7, 0.1),
          desc: "Espacios membranosos entre los huesos parietales y frontales. Permiten el cabalgamiento óseo durante el paso por el canal vaginal sin dañar el encéfalo del bebé."
        },
        {
          num: 2,
          id: "cephalic_engagement",
          title: "Encajamiento Cefálico en la Pelvis",
          category: "Obstetricia & Trabajo de Parto",
          color: "#f43f5e",
          pos: new THREE.Vector3(-0.12, -0.72, 0.25),
          camFocus: new THREE.Vector3(-0.1, -0.5, 0.1),
          desc: "El diámetro mayor de la cabeza fetal (biparietal) desciende y se encaja en el estrecho superior de la pelvis materna en posición cefálica óptima (Estación 0 de De Lee)."
        },
        {
          num: 3,
          id: "respiratory_readiness",
          title: "Madurez Pulmonar Completa",
          category: "Preparación Neonatal",
          color: "#10b981",
          pos: new THREE.Vector3(0.42, 0.52, 0.82),
          camFocus: new THREE.Vector3(0.2, 0.4, 0.4),
          desc: "Alvéolos y surfactante maduros. Los movimientos respiratorios fetales practican la expansión del tórax para que el llanto y la respiración aérea comiencen inmediatamente tras el corte del cordón."
        },
        {
          num: 4,
          id: "grasp_reflex",
          title: "Reflejo de Prensión Palmar Fuerte",
          category: "Reflejos Arcaicos",
          color: "#facc15",
          pos: new THREE.Vector3(0.88, 0.82, 0.42),
          camFocus: new THREE.Vector3(0.6, 0.6, 0.2),
          desc: "Fuerza de prensión palmar completa en ambas manos: si se le toca la palma de la mano, los deditos se cierran con fuerza refleja suficiente para sostener su propio peso corporal."
        }
      ]
    };

    this.markers = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.setupPointerEvents();
    this.setupHUDChips();
  }

  // ================= CREACIÓN DE SPRITES 3D CON TEXTO Y NÚMERO =================
  createTextSprite(text, number, hexColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');

    // Fondo píldora translúcida de alta definición
    ctx.fillStyle = 'rgba(7, 12, 28, 0.88)';
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(6, 6, 308, 78, 20);
    ctx.fill();
    ctx.stroke();

    // Círculo del número
    ctx.fillStyle = hexColor;
    ctx.beginPath();
    ctx.arc(46, 45, 26, 0, Math.PI * 2);
    ctx.fill();

    // Número blanco
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(number), 46, 45);

    // Texto del título
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 21px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(text.length > 20 ? text.substring(0, 19) + '...' : text, 84, 46);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.4, 0.4, 1.0);
    sprite.position.set(0.2, 0.28, 0);
    return sprite;
  }

  // ================= INICIALIZACIÓN Y ACTUALIZACIÓN POR ETAPA =================
  updateForStage(stageId) {
    // Remover marcadores anteriores
    while (this.hotspotsGroup.children.length > 0) {
      const obj = this.hotspotsGroup.children[0];
      this.hotspotsGroup.remove(obj);
    }
    this.markers = [];

    const features = this.stageFeaturesData[stageId] || this.stageFeaturesData[0];

    features.forEach((feat) => {
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(feat.pos);
      markerGroup.userData = feat;

      const colorInt = parseInt(feat.color.replace('#', '0x'));

      // 1. Anillo exterior pulsante visible
      const ringGeo = new THREE.RingGeometry(0.18, 0.25, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorInt,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      markerGroup.add(ring);

      // 2. Anillo fino orbital
      const outerRingGeo = new THREE.RingGeometry(0.32, 0.34, 32);
      const outerRingMat = new THREE.MeshBasicMaterial({
        color: colorInt,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45
      });
      const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
      markerGroup.add(outerRing);

      // 3. Núcleo esférico luminoso central
      const coreGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(coreGeo, coreMat);
      markerGroup.add(core);

      // 4. Luz puntual para iluminar la superficie del feto en esa zona
      const light = new THREE.PointLight(colorInt, 1.2, 2.0);
      markerGroup.add(light);

      // 5. Sprite flotante de texto 3D con nombre de la característica
      const sprite = this.createTextSprite(feat.title, feat.num, feat.color);
      markerGroup.add(sprite);

      markerGroup.visible = this.isVisible;
      this.hotspotsGroup.add(markerGroup);
      this.markers.push(markerGroup);
    });

    if (!this.hotspotsGroup.parent) {
      this.sceneManager.scene.add(this.hotspotsGroup);
    }

    this.renderHUDChips(features, stageId);
  }

  // ================= BARRA HUD DE ACCESO RÁPIDO A LAS CARACTERÍSTICAS =================
  setupHUDChips() {
    let container = document.getElementById('stage-characteristics-hud');
    if (!container) {
      container = document.createElement('div');
      container.id = 'stage-characteristics-hud';
      container.className = 'stage-characteristics-hud';
      container.style.cssText = `
        position: absolute;
        top: 86px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9;
        display: flex;
        gap: 8px;
        background: rgba(10, 15, 30, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 6px 14px;
        border-radius: 30px;
        border: 1px solid rgba(56, 189, 248, 0.35);
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        max-width: 90vw;
        overflow-x: auto;
        pointer-events: auto;
      `;
      const canvasContainer = document.getElementById('canvas-container');
      if (canvasContainer) canvasContainer.appendChild(container);
    }
  }

  renderHUDChips(features, stageId) {
    const container = document.getElementById('stage-characteristics-hud');
    if (!container) return;

    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; white-space: nowrap; margin-right: 4px;">
        <i class="fa-solid fa-star" style="color: #facc15;"></i> Hitos de la Etapa:
      </div>
    `;

    features.forEach((feat) => {
      const chip = document.createElement('button');
      chip.className = 'feature-chip-btn';
      chip.style.cssText = `
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid ${feat.color};
        color: #f8fafc;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        transition: all 0.2s ease;
      `;
      chip.innerHTML = `<span style="background: ${feat.color}; color: #000; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800;">${feat.num}</span> <span>${feat.title}</span>`;

      chip.addEventListener('mouseenter', () => {
        chip.style.background = feat.color;
        chip.style.color = '#000';
      });
      chip.addEventListener('mouseleave', () => {
        chip.style.background = 'rgba(255, 255, 255, 0.08)';
        chip.style.color = '#f8fafc';
      });
      chip.addEventListener('click', () => {
        this.triggerHotspot(feat);
      });

      container.appendChild(chip);
    });
  }

  setupPointerEvents() {
    window.addEventListener('click', (e) => {
      if (!this.isVisible) return;

      const rect = this.sceneManager.canvas.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) return;

      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
      const intersects = this.raycaster.intersectObjects(this.markers, true);

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== this.hotspotsGroup) {
          root = root.parent;
        }
        if (root.userData && root.userData.title) {
          this.triggerHotspot(root.userData);
        }
      }
    });
  }

  triggerHotspot(data) {
    soundSystem.playSuccess();

    // Enfocar la cámara suavemente hacia el punto anatómico
    const targetPos = data.camFocus || data.pos;
    this.sceneManager.setFocusOnObject(targetPos, 3.8);

    // Mostrar modal / ficha informativa detallada y elegante
    this.showFeatureCard(data);
  }

  showFeatureCard(data) {
    let card = document.getElementById('feature-detail-popover');
    if (!card) {
      card = document.createElement('div');
      card.id = 'feature-detail-popover';
      card.style.cssText = `
        position: fixed;
        bottom: 110px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        width: 440px;
        max-width: 90vw;
        background: rgba(10, 15, 30, 0.95);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-radius: 14px;
        border: 1px solid ${data.color};
        box-shadow: 0 12px 36px rgba(0,0,0,0.6);
        padding: 16px 20px;
        color: #fff;
        animation: fadeIn 0.25s ease-out;
      `;
      document.body.appendChild(card);
    }

    card.style.borderColor = data.color;
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="background: ${data.color}; color: #000; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800;">${data.num}</span>
          <div>
            <span style="font-size: 11px; font-weight: 700; color: ${data.color}; text-transform: uppercase;">${data.category}</span>
            <h3 style="margin: 0; font-size: 16px; color: #fff;">${data.title}</h3>
          </div>
        </div>
        <button id="btn-close-feature-card" style="background: none; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 2px 6px;">✕</button>
      </div>
      <p style="color: #cbd5e1; font-size: 13px; line-height: 1.5; margin: 0 0 12px 0;">${data.desc}</p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; color: #64748b;">Haz clic en otro punto para explorar</span>
        <button id="btn-focus-feature" style="background: ${data.color}; color: #000; border: none; padding: 5px 12px; border-radius: 6px; font-size: 11.5px; font-weight: 700; cursor: pointer;">
          <i class="fa-solid fa-crosshairs"></i> Enfocar Cámara
        </button>
      </div>
    `;

    card.style.display = 'block';

    const btnClose = document.getElementById('btn-close-feature-card');
    if (btnClose) btnClose.addEventListener('click', () => card.style.display = 'none');

    const btnFocus = document.getElementById('btn-focus-feature');
    if (btnFocus) {
      btnFocus.addEventListener('click', () => {
        this.sceneManager.setFocusOnObject(data.camFocus || data.pos, 3.2);
        soundSystem.playClick();
      });
    }
  }

  toggleVisible() {
    this.isVisible = !this.isVisible;
    this.markers.forEach(m => m.visible = this.isVisible);
    const hud = document.getElementById('stage-characteristics-hud');
    if (hud) hud.style.display = this.isVisible ? 'flex' : 'none';
    const card = document.getElementById('feature-detail-popover');
    if (card && !this.isVisible) card.style.display = 'none';
    soundSystem.playClick();
    return this.isVisible;
  }

  update(elapsedTime) {
    if (!this.isVisible) return;

    this.markers.forEach((marker) => {
      if (marker.visible) {
        // Mirar siempre hacia la cámara (Billboard)
        marker.quaternion.copy(this.sceneManager.camera.quaternion);

        // Pulsación luminosa continua
        const ring = marker.children[0];
        if (ring) {
          const s = 1.0 + Math.sin(elapsedTime * 4.5 + marker.position.x * 2) * 0.15;
          ring.scale.set(s, s, 1.0);
        }

        const outerRing = marker.children[1];
        if (outerRing) {
          const s2 = 1.0 + Math.cos(elapsedTime * 3.5 + marker.position.y * 2) * 0.2;
          outerRing.scale.set(s2, s2, 1.0);
        }
      }
    });
  }
}
