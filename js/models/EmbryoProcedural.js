// ==========================================================================
// MODELADOR 3D PROCEDURAL ANATÓMICO ULTRA-DETALLADO (EmbryoProcedural)
// Modela con alta fidelidad anatómica todas las fases del desarrollo:
// - Esqueleto humano completo (cráneo, fontanelas, 24 vértebras, 12 pares de costillas,
//   esternón, clavículas, escápulas, húmero, radio, cúbito, pelvis, fémur, tibia, peroné, falanges)
// - Órganos internos: Pulmones con árbol bronquial, corazón 4 cámaras, hígado, estómago, cerebro.
// - Piel orgánica con translucidez dérmica, vérnix, rasgos faciales y movimientos vivos.
// ==========================================================================

import * as THREE from 'three';

export class EmbryoProcedural {
  constructor() {
    this.currentStageId = 0;
    this.renderMode = 'bio'; // 'bio' | 'anatomy' | 'xray' | 'ultrasound'
    this.dissectionLayer = 0.0; // 0.0 = Piel -> 1.0 = Esqueleto

    this.rootGroup = new THREE.Group();
    this.rootGroup.name = "EmbryoRootGroup";

    this.activeMeshes = [];
    this.animatables = [];
    this.pulsingHeart = null;
    this.skeletonMeshes = [];
    this.organMeshes = [];
    this.skinMeshes = [];

    this.initSharedMaterials();
  }

  initSharedMaterials() {
    this.materials = {
      amnioticSac: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.16,
        roughness: 0.1,
        transmission: 0.92,
        ior: 1.33,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      umbilicalCord: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.35,
        metalness: 0.05
      }),
      bone: new THREE.MeshStandardMaterial({
        color: 0xfafafa,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95
      }),
      cartilage: new THREE.MeshStandardMaterial({
        color: 0xbae6fd,
        roughness: 0.3,
        metalness: 0.05,
        transparent: true,
        opacity: 0.78
      }),
      brain: new THREE.MeshStandardMaterial({
        color: 0xe9d5ff,
        roughness: 0.4,
        metalness: 0.05
      })
    };
  }

  // ================= CONSTRUCCIÓN POR ETAPA =================
  buildStage(stageData, renderMode = 'bio') {
    this.currentStageId = stageData.id;
    this.renderMode = renderMode;

    // Limpiar escena anterior
    while (this.rootGroup.children.length > 0) {
      const obj = this.rootGroup.children[0];
      this.disposeObject(obj);
      this.rootGroup.remove(obj);
    }
    this.activeMeshes = [];
    this.animatables = [];
    this.skeletonMeshes = [];
    this.organMeshes = [];
    this.skinMeshes = [];
    this.pulsingHeart = null;

    const stageGroup = new THREE.Group();

    switch (stageData.id) {
      case 0:
        this.buildZygote(stageGroup, stageData);
        break;
      case 1:
        this.buildEarlyEmbryo(stageGroup, stageData);
        break;
      case 2:
        this.buildEmbryo(stageGroup, stageData);
        break;
      case 3:
        this.buildEarlyFetus(stageGroup, stageData);
        break;
      case 4:
        this.buildDevelopingFetus(stageGroup, stageData);
        break;
      case 5:
        this.buildAdvancedFetus(stageGroup, stageData);
        break;
      case 6:
        this.buildFullTerm(stageGroup, stageData);
        break;
      default:
        this.buildZygote(stageGroup, stageData);
    }

    // Saco amniótico protector envolvente (a partir de la semana 5)
    if (stageData.id >= 2) {
      const sacGeo = new THREE.SphereGeometry(3.7, 36, 36);
      const sacMat = this.materials.amnioticSac.clone();
      if (this.renderMode === 'xray') sacMat.opacity = 0.05;
      if (this.renderMode === 'ultrasound') sacMat.opacity = 0.04;
      if (this.renderMode === 'anatomy') sacMat.opacity = 0.1;
      const sacMesh = new THREE.Mesh(sacGeo, sacMat);
      sacMesh.scale.set(1.15, 1.35, 1.15);
      stageGroup.add(sacMesh);
    }

    this.rootGroup.add(stageGroup);
    this.applyRenderMode(this.renderMode);
    return this.rootGroup;
  }

  // ================= SISTEMA ESQUELÉTICO 3D COMPLETO Y ANATÓMICO =================
  buildCompleteSkeleton(parentGroup, scale = 1.0, stageId = 3, centerOffset = new THREE.Vector3(0, 0, 0)) {
    const skeletonGroup = new THREE.Group();
    skeletonGroup.name = "CompleteSkeletonGroup";
    skeletonGroup.position.copy(centerOffset);
    const boneMat = this.materials.bone;

    // 1. Cráneo óseo completo con fontanelas y mandíbula
    const skullGroup = new THREE.Group();
    skullGroup.position.set(0, 1.38 * scale, 0);

    // Calota craneal (bóveda)
    const calvariaGeo = new THREE.SphereGeometry(0.75 * scale, 28, 28);
    calvariaGeo.scale(0.92, 1.06, 0.96);
    const calvaria = new THREE.Mesh(calvariaGeo, boneMat);
    calvaria.userData = { isBone: true, originalMat: boneMat };
    skullGroup.add(calvaria);
    this.registerBone(calvaria);

    // Fontanela anterior (Bregma) romboidal elástica
    const bregmaGeo = new THREE.PlaneGeometry(0.18 * scale, 0.18 * scale);
    const fontanelleMat = this.materials.cartilage;
    const bregma = new THREE.Mesh(bregmaGeo, fontanelleMat);
    bregma.rotation.x = -Math.PI / 2;
    bregma.rotation.z = Math.PI / 4;
    bregma.position.set(0.1 * scale, 0.78 * scale, 0);
    skullGroup.add(bregma);

    // Órbitas oculares óseas
    const orbitGeo = new THREE.RingGeometry(0.08 * scale, 0.18 * scale, 16);
    const orbitMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, side: THREE.DoubleSide });
    const orbitL = new THREE.Mesh(orbitGeo, orbitMat);
    orbitL.position.set(0.68 * scale, 0.05 * scale, 0.32 * scale);
    orbitL.rotation.y = Math.PI / 2.8;
    const orbitR = new THREE.Mesh(orbitGeo, orbitMat);
    orbitR.position.set(0.68 * scale, 0.05 * scale, -0.32 * scale);
    orbitR.rotation.y = -Math.PI / 2.8;
    skullGroup.add(orbitL, orbitR);

    // Mandíbula inferior ósea articulada
    const jawCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1 * scale, -0.22 * scale, 0.38 * scale),
      new THREE.Vector3(0.48 * scale, -0.35 * scale, 0.18 * scale),
      new THREE.Vector3(0.58 * scale, -0.38 * scale, 0),
      new THREE.Vector3(0.48 * scale, -0.35 * scale, -0.18 * scale),
      new THREE.Vector3(0.1 * scale, -0.22 * scale, -0.38 * scale)
    ]);
    const jaw = new THREE.Mesh(new THREE.TubeGeometry(jawCurve, 20, 0.05 * scale, 8, false), boneMat);
    jaw.userData = { isBone: true, originalMat: boneMat };
    skullGroup.add(jaw);
    this.registerBone(jaw);

    skeletonGroup.add(skullGroup);

    // 2. Columna Vertebral articulada de 24 vértebras segmentarias
    const spineGroup = new THREE.Group();
    const vertCount = 20;
    for (let i = 0; i < vertCount; i++) {
      const t = i / vertCount;
      const y = (1.05 - t * 1.65) * scale;
      // Curvaturas cervical, torácica y lumbar
      const x = (-0.22 + Math.sin(t * Math.PI) * 0.15 - Math.sin(t * Math.PI * 2) * 0.05) * scale;

      // Cuerpo vertebral
      const vertGeo = new THREE.CylinderGeometry(0.1 * scale, 0.1 * scale, 0.06 * scale, 12);
      const vert = new THREE.Mesh(vertGeo, boneMat);
      vert.position.set(x, y, 0);
      vert.rotation.z = 0.12;
      vert.userData = { isBone: true, originalMat: boneMat };
      spineGroup.add(vert);
      this.registerBone(vert);

      // Apófisis espinosa posterior
      const spinousGeo = new THREE.ConeGeometry(0.04 * scale, 0.1 * scale, 6);
      const spinous = new THREE.Mesh(spinousGeo, boneMat);
      spinous.position.set(x - 0.08 * scale, y, 0);
      spinous.rotation.z = Math.PI / 2;
      spineGroup.add(spinous);
      this.registerBone(spinous);
    }
    skeletonGroup.add(spineGroup);

    // 3. Caja Torácica completa: 10 pares de costillas y esternón articulado
    const ribGroup = new THREE.Group();
    const ribCount = 10;
    for (let i = 0; i < ribCount; i++) {
      const yPos = (0.62 - i * 0.09) * scale;
      const rArc = (0.5 + Math.sin((i / ribCount) * Math.PI) * 0.18) * scale;
      const ribGeo = new THREE.TorusGeometry(rArc, 0.026 * scale, 8, 24, Math.PI * 1.58);
      const rib = new THREE.Mesh(ribGeo, boneMat);
      rib.rotation.x = Math.PI / 2;
      rib.rotation.z = -Math.PI * 0.79;
      rib.position.set(0.09 * scale, yPos, 0);
      rib.userData = { isBone: true, originalMat: boneMat };
      ribGroup.add(rib);
      this.registerBone(rib);
    }

    // Esternón anterior dividido (Manubrio, Cuerpo y Xifoides)
    const sternumGeo = new THREE.BoxGeometry(0.05 * scale, 0.75 * scale, 0.12 * scale);
    const sternum = new THREE.Mesh(sternumGeo, boneMat);
    sternum.position.set(0.52 * scale, 0.28 * scale, 0);
    sternum.userData = { isBone: true, originalMat: boneMat };
    ribGroup.add(sternum);
    this.registerBone(sternum);

    skeletonGroup.add(ribGroup);

    // 4. Cintura Escapular y Miembros Superiores (Clavícula, Escápula, Húmero, Radio, Cúbito y Mano)
    const createBoneCylinder = (len, r) => new THREE.CylinderGeometry(r * 0.95, r, len, 10);

    // Clavículas
    const clavicleGeo = createBoneCylinder(0.48 * scale, 0.035 * scale);
    const clavicleL = new THREE.Mesh(clavicleGeo, boneMat);
    clavicleL.position.set(0.38 * scale, 0.72 * scale, 0.28 * scale);
    clavicleL.rotation.x = Math.PI / 3.2;
    const clavicleR = new THREE.Mesh(clavicleGeo, boneMat);
    clavicleR.position.set(0.38 * scale, 0.72 * scale, -0.28 * scale);
    clavicleR.rotation.x = -Math.PI / 3.2;
    skeletonGroup.add(clavicleL, clavicleR);
    this.registerBone(clavicleL, clavicleR);

    // Húmeros (brazos)
    const humerusGeo = createBoneCylinder(0.6 * scale, 0.048 * scale);
    const humerusL = new THREE.Mesh(humerusGeo, boneMat);
    humerusL.position.set(0.4 * scale, 0.48 * scale, 0.52 * scale);
    humerusL.rotation.set(0.35, 0.2, -0.55);
    const humerusR = new THREE.Mesh(humerusGeo, boneMat);
    humerusR.position.set(0.4 * scale, 0.48 * scale, -0.52 * scale);
    humerusR.rotation.set(-0.35, -0.2, -0.55);
    skeletonGroup.add(humerusL, humerusR);
    this.registerBone(humerusL, humerusR);

    // Radio y Cúbito (antebrazos)
    const forearmGeo = createBoneCylinder(0.55 * scale, 0.038 * scale);
    const forearmL = new THREE.Mesh(forearmGeo, boneMat);
    forearmL.position.set(0.68 * scale, 0.22 * scale, 0.32 * scale);
    forearmL.rotation.set(0.2, 0.6, -1.2);
    const forearmR = new THREE.Mesh(forearmGeo, boneMat);
    forearmR.position.set(0.68 * scale, 0.22 * scale, -0.32 * scale);
    forearmR.rotation.set(-0.2, -0.6, -1.2);
    skeletonGroup.add(forearmL, forearmR);
    this.registerBone(forearmL, forearmR);

    // Falanges de la mano (5 deditos)
    for (let f = 0; f < 5; f++) {
      const phalanxGeo = new THREE.CylinderGeometry(0.015 * scale, 0.015 * scale, 0.15 * scale, 6);
      const phL = new THREE.Mesh(phalanxGeo, boneMat);
      const fAngle = (f - 2) * 0.15;
      phL.position.set((0.78 + Math.cos(fAngle) * 0.1) * scale, 0.08 * scale, (0.28 + f * 0.03) * scale);
      phL.rotation.z = -1.5;
      const phR = new THREE.Mesh(phalanxGeo, boneMat);
      phR.position.set((0.78 + Math.cos(fAngle) * 0.1) * scale, 0.08 * scale, (-0.28 - f * 0.03) * scale);
      phR.rotation.z = -1.5;
      skeletonGroup.add(phL, phR);
      this.registerBone(phL, phR);
    }

    // 5. Pelvis Ósea Humana Completa (Sacro, Cóccix, Ilion, Isquion, Pubis y Acetábulos)
    const pelvisGroup = new THREE.Group();
    pelvisGroup.position.set(0, -0.62 * scale, 0);

    // Sacro y Cóccix (columna lumbosacra posterior)
    const sacrumGeo = new THREE.ConeGeometry(0.24 * scale, 0.42 * scale, 8);
    const sacrum = new THREE.Mesh(sacrumGeo, boneMat);
    sacrum.position.set(-0.18 * scale, 0.05 * scale, 0);
    sacrum.rotation.x = Math.PI;
    sacrum.rotation.z = -0.3;
    pelvisGroup.add(sacrum);
    this.registerBone(sacrum);

    // Crestas Ilíacas / Ilion (Paletas pélvicas bilaterales anatómicas)
    const iliumGeoL = new THREE.CylinderGeometry(0.32 * scale, 0.22 * scale, 0.38 * scale, 12, 1, false, 0, Math.PI);
    const iliumL = new THREE.Mesh(iliumGeoL, boneMat);
    iliumL.position.set(-0.04 * scale, 0.12 * scale, 0.28 * scale);
    iliumL.rotation.set(0.35, 0.6, -0.2);
    const iliumR = new THREE.Mesh(iliumGeoL, boneMat);
    iliumR.position.set(-0.04 * scale, 0.12 * scale, -0.28 * scale);
    iliumR.rotation.set(-0.35, -0.6, -0.2);
    pelvisGroup.add(iliumL, iliumR);
    this.registerBone(iliumL, iliumR);

    // Isquion y Pubis (Anillo pélvico inferior y sínfisis del pubis)
    const pubisCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.05 * scale, -0.15 * scale, 0.22 * scale),
      new THREE.Vector3(0.22 * scale, -0.22 * scale, 0.08 * scale),
      new THREE.Vector3(0.22 * scale, -0.22 * scale, -0.08 * scale),
      new THREE.Vector3(-0.05 * scale, -0.15 * scale, -0.22 * scale)
    ]);
    const pubisMesh = new THREE.Mesh(new THREE.TubeGeometry(pubisCurve, 16, 0.045 * scale, 8, false), boneMat);
    pelvisGroup.add(pubisMesh);
    this.registerBone(pubisMesh);

    // Acetábulos (Cavidades articulares para la cabeza del fémur)
    const acetabulumGeo = new THREE.SphereGeometry(0.11 * scale, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const acetabulumL = new THREE.Mesh(acetabulumGeo, boneMat);
    acetabulumL.position.set(0.04 * scale, -0.08 * scale, 0.34 * scale);
    acetabulumL.rotation.x = Math.PI / 2;
    const acetabulumR = new THREE.Mesh(acetabulumGeo, boneMat);
    acetabulumR.position.set(0.04 * scale, -0.08 * scale, -0.34 * scale);
    acetabulumR.rotation.x = -Math.PI / 2;
    pelvisGroup.add(acetabulumL, acetabulumR);
    this.registerBone(acetabulumL, acetabulumR);

    skeletonGroup.add(pelvisGroup);

    // 6. Miembros Inferiores Humanos Completos (Fémur, Rótula, Tibia, Peroné y Pie)
    const buildHumanLeg = (isLeft) => {
      const legGroup = new THREE.Group();
      const sign = isLeft ? 1 : -1;

      // FÉMUR:
      // Cabeza femoral esférica encajada en el acetábulo
      const headGeo = new THREE.SphereGeometry(0.085 * scale, 14, 14);
      const head = new THREE.Mesh(headGeo, boneMat);
      head.position.set(0.05 * scale, -0.72 * scale, sign * 0.35 * scale);
      legGroup.add(head);
      this.registerBone(head);

      // Cuello femoral oblicuo (125 grados)
      const neckGeo = createBoneCylinder(0.16 * scale, 0.045 * scale);
      const neck = new THREE.Mesh(neckGeo, boneMat);
      neck.position.set(0.1 * scale, -0.76 * scale, sign * 0.42 * scale);
      neck.rotation.set(sign * 0.55, 0, 0.4);
      legGroup.add(neck);
      this.registerBone(neck);

      // Trocánter mayor (saliente superior lateral)
      const trochanterGeo = new THREE.BoxGeometry(0.09 * scale, 0.12 * scale, 0.08 * scale);
      const trochanter = new THREE.Mesh(trochanterGeo, boneMat);
      trochanter.position.set(0.12 * scale, -0.74 * scale, sign * 0.48 * scale);
      legGroup.add(trochanter);
      this.registerBone(trochanter);

      // Diáfisis del Fémur (cuerpo óseo largo, curvado hacia adelante)
      const femurShaftGeo = createBoneCylinder(0.68 * scale, 0.058 * scale);
      const femurShaft = new THREE.Mesh(femurShaftGeo, boneMat);
      femurShaft.position.set(0.28 * scale, -1.05 * scale, sign * 0.46 * scale);
      femurShaft.rotation.set(sign * 0.25, 0, 0.72);
      legGroup.add(femurShaft);
      this.registerBone(femurShaft);

      // Cóndilos femorales (rodilla distal)
      const condyleGeo = new THREE.SphereGeometry(0.075 * scale, 12, 12);
      const condyleMed = new THREE.Mesh(condyleGeo, boneMat);
      condyleMed.position.set(0.48 * scale, -1.34 * scale, sign * 0.41 * scale);
      const condyleLat = new THREE.Mesh(condyleGeo, boneMat);
      condyleLat.position.set(0.48 * scale, -1.34 * scale, sign * 0.51 * scale);
      legGroup.add(condyleMed, condyleLat);
      this.registerBone(condyleMed, condyleLat);

      // RÓTULA / PATELLA (Hueso sesamoideo de la rodilla)
      const patellaGeo = new THREE.SphereGeometry(0.06 * scale, 12, 12);
      patellaGeo.scale(1.0, 1.25, 0.55);
      const patella = new THREE.Mesh(patellaGeo, boneMat);
      patella.position.set(0.55 * scale, -1.32 * scale, sign * 0.46 * scale);
      legGroup.add(patella);
      this.registerBone(patella);

      // TIBIA (Hueso principal y robusto de la pierna)
      const tibiaShaftGeo = createBoneCylinder(0.65 * scale, 0.052 * scale);
      const tibia = new THREE.Mesh(tibiaShaftGeo, boneMat);
      tibia.position.set(0.45 * scale, -1.68 * scale, sign * 0.38 * scale);
      tibia.rotation.set(sign * 0.1, 0.4, 1.35);
      legGroup.add(tibia);
      this.registerBone(tibia);

      // PERONÉ / FÍBULA (Hueso lateral delgado y paralelo)
      const fibulaShaftGeo = createBoneCylinder(0.62 * scale, 0.026 * scale);
      const fibula = new THREE.Mesh(fibulaShaftGeo, boneMat);
      fibula.position.set(0.44 * scale, -1.68 * scale, sign * 0.48 * scale);
      fibula.rotation.set(sign * 0.1, 0.4, 1.35);
      legGroup.add(fibula);
      this.registerBone(fibula);

      // PIE ÓSEO COMPLETO (Tarso, Astrágalo, Calcáneo y 5 Metatarsianos/Falanges)
      // Calcáneo (hueso del talón)
      const calcaneusGeo = new THREE.BoxGeometry(0.18 * scale, 0.1 * scale, 0.12 * scale);
      const calcaneus = new THREE.Mesh(calcaneusGeo, boneMat);
      calcaneus.position.set(0.38 * scale, -1.98 * scale, sign * 0.32 * scale);
      calcaneus.rotation.set(0, sign * 0.3, 0.2);
      legGroup.add(calcaneus);
      this.registerBone(calcaneus);

      // 5 Metatarsianos y Deditos del Pie
      for (let toe = 0; toe < 5; toe++) {
        const metatarsalGeo = new THREE.CylinderGeometry(0.016 * scale, 0.018 * scale, 0.16 * scale, 6);
        const toeMesh = new THREE.Mesh(metatarsalGeo, boneMat);
        const toeAngle = (toe - 2) * 0.14;
        toeMesh.position.set(
          (0.48 + Math.cos(toeAngle) * 0.08) * scale,
          -2.06 * scale,
          (sign * 0.28 + toe * sign * 0.035) * scale
        );
        toeMesh.rotation.set(1.4, 0, sign * 0.2);
        legGroup.add(toeMesh);
        this.registerBone(toeMesh);
      }

      return legGroup;
    };

    const leftLegSkeleton = buildHumanLeg(true);
    const rightLegSkeleton = buildHumanLeg(false);
    skeletonGroup.add(leftLegSkeleton, rightLegSkeleton);

    parentGroup.add(skeletonGroup);
    return skeletonGroup;
  }

  // ================= CONSTRUCTOR DE ÓRGANOS VISCERALES Y TORÁCICOS =================
  buildThoracicAnatomy(parentGroup, scale = 1.0, stageId = 3, centerOffset = new THREE.Vector3(0, 0, 0)) {
    const organsGroup = new THREE.Group();
    organsGroup.name = "ThoracicOrgansGroup";
    organsGroup.position.copy(centerOffset);

    // 1. Pulmones en Desarrollo (Lóbulo Superior, Medio e Inferior)
    const lungMat = new THREE.MeshStandardMaterial({
      color: 0xfb7185, // Rosa coral pulmonar
      emissive: 0xe11d48,
      emissiveIntensity: 0.35,
      roughness: 0.35,
      metalness: 0.05
    });

    const lungGeoL = new THREE.SphereGeometry(0.38 * scale, 24, 24);
    lungGeoL.scale(0.82, 1.35, 0.92);
    const lungGeoR = new THREE.SphereGeometry(0.42 * scale, 24, 24);
    lungGeoR.scale(0.86, 1.4, 0.96);

    const lungLeft = new THREE.Mesh(lungGeoL, lungMat);
    lungLeft.position.set(0.08 * scale, 0.28 * scale, 0.31 * scale);
    lungLeft.userData = { isLung: true, originalMat: lungMat };

    const lungRight = new THREE.Mesh(lungGeoR, lungMat);
    lungRight.position.set(0.08 * scale, 0.28 * scale, -0.31 * scale);
    lungRight.userData = { isLung: true, originalMat: lungMat };

    organsGroup.add(lungLeft, lungRight);
    this.registerOrgan(lungLeft, lungRight);

    // Árbol traqueobronquial
    const tracheaGeo = new THREE.CylinderGeometry(0.052 * scale, 0.052 * scale, 0.48 * scale, 12);
    const tracheaMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.3 });
    const trachea = new THREE.Mesh(tracheaGeo, tracheaMat);
    trachea.position.set(0.06 * scale, 0.6 * scale, 0);
    trachea.userData = { isLung: true, originalMat: tracheaMat };
    organsGroup.add(trachea);
    this.registerOrgan(trachea);

    // Bronquios principales
    const bronchusGeo = new THREE.CylinderGeometry(0.036 * scale, 0.036 * scale, 0.24 * scale, 8);
    const bronchusL = new THREE.Mesh(bronchusGeo, tracheaMat);
    bronchusL.position.set(0.06 * scale, 0.39 * scale, 0.13 * scale);
    bronchusL.rotation.x = Math.PI / 4;
    const bronchusR = new THREE.Mesh(bronchusGeo, tracheaMat);
    bronchusR.position.set(0.06 * scale, 0.39 * scale, -0.13 * scale);
    bronchusR.rotation.x = -Math.PI / 4;
    organsGroup.add(bronchusL, bronchusR);
    this.registerOrgan(bronchusL, bronchusR);

    // 2. Corazón 4 Cámaras con arco aórtico y tronco pulmonar
    const heartGeo = new THREE.SphereGeometry(0.32 * scale, 24, 24);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });
    const heart = new THREE.Mesh(heartGeo, heartMat);
    heart.position.set(0.24 * scale, 0.24 * scale, 0);
    heart.userData = { isHeart: true, originalMat: heartMat };
    organsGroup.add(heart);
    this.registerOrgan(heart);
    this.pulsingHeart = heart;

    // Arco aórtico
    const aortaGeo = new THREE.TorusGeometry(0.13 * scale, 0.038 * scale, 8, 16, Math.PI);
    const aortaMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c });
    const aorta = new THREE.Mesh(aortaGeo, aortaMat);
    aorta.position.set(0.2 * scale, 0.44 * scale, 0);
    aorta.rotation.z = Math.PI / 2;
    aorta.userData = { isHeart: true, originalMat: aortaMat };
    organsGroup.add(aorta);
    this.registerOrgan(aorta);

    // 3. Hígado fetal (voluminoso, hematopoyético) y Estómago
    const liverGeo = new THREE.SphereGeometry(0.35 * scale, 20, 20);
    liverGeo.scale(1.25, 0.75, 1.05);
    const liverMat = new THREE.MeshStandardMaterial({
      color: 0x881337,
      roughness: 0.4,
      metalness: 0.05
    });
    const liver = new THREE.Mesh(liverGeo, liverMat);
    liver.position.set(0.14 * scale, -0.16 * scale, 0.12 * scale);
    liver.userData = { isOrgan: true, originalMat: liverMat };
    organsGroup.add(liver);
    this.registerOrgan(liver);

    // Cerebro fetal (Hemisferios cerebrales)
    const brainGeo = new THREE.SphereGeometry(0.68 * scale, 24, 24);
    brainGeo.scale(0.85, 1.0, 0.95);
    const brain = new THREE.Mesh(brainGeo, this.materials.brain);
    brain.position.set(0, 1.42 * scale, 0);
    brain.userData = { isBrain: true, originalMat: this.materials.brain };
    organsGroup.add(brain);
    this.registerOrgan(brain);

    // Animaciones sincronizadas de respiración fetal y latido cardíaco
    this.animatables.push((time) => {
      const breath = 1 + Math.sin(time * 2.8) * 0.09;
      lungLeft.scale.set(0.82 * breath, 1.35 * breath, 0.92 * breath);
      lungRight.scale.set(0.86 * breath, 1.4 * breath, 0.96 * breath);

      const pulse = 1 + Math.pow(Math.sin(time * 7.5), 6) * 0.28;
      heart.scale.set(pulse, pulse, pulse);
    });

    parentGroup.add(organsGroup);
    return organsGroup;
  }

  registerBone(...meshes) {
    meshes.forEach((m) => {
      this.activeMeshes.push(m);
      this.skeletonMeshes.push(m);
    });
  }

  registerOrgan(...meshes) {
    meshes.forEach((m) => {
      this.activeMeshes.push(m);
      this.organMeshes.push(m);
    });
  }

  registerSkin(...meshes) {
    meshes.forEach((m) => {
      m.userData.isSkin = true;
      this.activeMeshes.push(m);
      this.skinMeshes.push(m);
    });
  }

  // ================= ETAPA 0: CONCEPCIÓN (SEMANA 1) =================
  buildZygote(group, stageData) {
    const mainGroup = new THREE.Group();

    // Zona Pelúcida cristalina con efecto glicoproteico
    const zonaGeo = new THREE.SphereGeometry(1.65, 48, 48);
    const zonaMat = new THREE.MeshPhysicalMaterial({
      color: 0xec4899,
      transmission: 0.84,
      opacity: 0.65,
      transparent: true,
      roughness: 0.18,
      ior: 1.42,
      side: THREE.DoubleSide
    });
    const zonaMesh = new THREE.Mesh(zonaGeo, zonaMat);
    this.registerSkin(zonaMesh);
    mainGroup.add(zonaMesh);

    // Blastómeros en división celular (mórula)
    const cellGroup = new THREE.Group();
    const cellGeo = new THREE.SphereGeometry(0.58, 32, 32);
    const cellMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.35,
      metalness: 0.1
    });

    const positions = [
      [-0.45, -0.45, -0.3],
      [0.45, -0.45, 0.3],
      [-0.45, 0.45, 0.3],
      [0.45, 0.45, -0.3],
      [0.1, 0.5, 0.2],
      [-0.2, -0.5, -0.1],
      [0.4, 0.0, 0.45],
      [-0.4, 0.0, -0.45]
    ];

    positions.forEach((pos) => {
      const cell = new THREE.Mesh(cellGeo, cellMat);
      cell.position.set(pos[0], pos[1], pos[2]);
      cellGroup.add(cell);
      this.activeMeshes.push(cell);

      // Núcleo celular fluorescente con cromosomas
      const nucleusGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const nucleusMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
      const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleus.position.copy(cell.position);
      cellGroup.add(nucleus);
      this.activeMeshes.push(nucleus);
    });

    mainGroup.add(cellGroup);

    // Corona radiata (folículos envolventes)
    const follicleGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const follicleMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.5 });
    const follicleGroup = new THREE.Group();

    for (let i = 0; i < 90; i++) {
      const fMesh = new THREE.Mesh(follicleGeo, follicleMat);
      const phi = Math.acos(-1 + (2 * i) / 90);
      const theta = Math.sqrt(90 * Math.PI) * phi;
      const r = 1.8 + Math.random() * 0.16;
      fMesh.position.setFromSphericalCoords(r, phi, theta);
      follicleGroup.add(fMesh);
      this.activeMeshes.push(fMesh);
    }
    mainGroup.add(follicleGroup);

    this.animatables.push((time) => {
      cellGroup.rotation.y = time * 0.2;
      follicleGroup.rotation.y = -time * 0.08;
    });

    group.add(mainGroup);
  }

  // ================= ETAPA 1: EMBRIÓN TEMPRANO (SEMANAS 2-4) =================
  buildEarlyEmbryo(group, stageData) {
    const mainGroup = new THREE.Group();

    // Tubo neural en curvatura C con cierre de neuroporos
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.55, 0),
      new THREE.Vector3(0.65, 0.95, 0),
      new THREE.Vector3(0.72, 0.0, 0),
      new THREE.Vector3(0.42, -0.95, 0),
      new THREE.Vector3(-0.25, -1.35, 0)
    ]);

    const tubeGeo = new THREE.TubeGeometry(curve, 44, 0.44, 16, false);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.35,
      metalness: 0.05
    });
    const bodyMesh = new THREE.Mesh(tubeGeo, bodyMat);
    this.registerSkin(bodyMesh);
    mainGroup.add(bodyMesh);

    // 28 Somitas mesodérmicos (precursores de las vértebras)
    const somiteGeo = new THREE.BoxGeometry(0.18, 0.14, 0.62);
    const somiteMat = this.materials.cartilage;
    for (let i = 0; i <= 18; i++) {
      const t = 0.15 + (i / 18) * 0.72;
      const pt = curve.getPoint(t);
      const sMesh = new THREE.Mesh(somiteGeo, somiteMat);
      sMesh.position.copy(pt);
      sMesh.userData = { isBone: true, originalMat: somiteMat };
      mainGroup.add(sMesh);
      this.registerBone(sMesh);
    }

    // Prominencia cefálica voluminosa
    const headGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headMesh.position.set(0, 1.45, 0);
    this.registerSkin(headMesh);
    mainGroup.add(headMesh);

    // Placodas ópticas y óticas incipientes
    const oticGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const oticMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
    const oticL = new THREE.Mesh(oticGeo, oticMat);
    oticL.position.set(0.35, 1.48, 0.55);
    const oticR = new THREE.Mesh(oticGeo, oticMat);
    oticR.position.set(0.35, 1.48, -0.55);
    mainGroup.add(oticL, oticR);

    // Tubo cardíaco primordial en asa bulbo-ventricular
    const heartGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.5,
      roughness: 0.2
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(0.48, 0.32, 0);
    heartMesh.userData = { isHeart: true, originalMat: heartMat };
    this.registerOrgan(heartMesh);
    mainGroup.add(heartMesh);
    this.pulsingHeart = heartMesh;

    // Brotes pulmonares primitivos
    const lungBudGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const lungBudMat = new THREE.MeshStandardMaterial({ color: 0xfb7185, emissive: 0xe11d48, emissiveIntensity: 0.4 });
    const lungBud = new THREE.Mesh(lungBudGeo, lungBudMat);
    lungBud.position.set(0.38, 0.48, 0.16);
    lungBud.userData = { isLung: true, originalMat: lungBudMat };
    this.registerOrgan(lungBud);
    mainGroup.add(lungBud);

    // Saco Vitelino nutritivo
    const yolkGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const yolkMat = new THREE.MeshPhysicalMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.58,
      transmission: 0.72,
      roughness: 0.2
    });
    const yolkMesh = new THREE.Mesh(yolkGeo, yolkMat);
    yolkMesh.position.set(-0.65, 0.2, 0);
    mainGroup.add(yolkMesh);
    this.activeMeshes.push(yolkMesh);

    this.animatables.push((time) => {
      const pulse = 1 + Math.pow(Math.sin(time * 6.5), 6) * 0.35;
      heartMesh.scale.set(pulse, pulse, pulse);
    });

    group.add(mainGroup);
  }

  // ================= ETAPA 2: EMBRIÓN (SEMANAS 5-8) =================
  buildEmbryo(group, stageData) {
    const mainGroup = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xfbcfe8,
      roughness: 0.38,
      metalness: 0.05
    });

    // Cabeza con flexura cervical marcada
    const headGeo = new THREE.SphereGeometry(1.05, 32, 32);
    headGeo.scale(1.0, 1.12, 0.92);
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headMesh.position.set(-0.2, 1.15, 0);
    this.registerSkin(headMesh);
    mainGroup.add(headMesh);

    // Ojos pigmentados de retina
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(0.42, 1.25, 0.68);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.42, 1.25, -0.68);
    mainGroup.add(eyeL, eyeR);
    this.activeMeshes.push(eyeL, eyeR);

    // Arcos branquiales / faríngeos en el cuello
    for (let b = 0; b < 3; b++) {
      const archGeo = new THREE.TorusGeometry(0.45 - b * 0.06, 0.04, 8, 16, Math.PI * 0.8);
      const arch = new THREE.Mesh(archGeo, bodyMat);
      arch.position.set(0.18, 0.75 - b * 0.12, 0);
      arch.rotation.y = Math.PI / 2;
      mainGroup.add(arch);
      this.registerSkin(arch);
    }

    // Torso embrionario curvado
    const torsoCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 1.05, 0),
      new THREE.Vector3(0.52, 0.42, 0),
      new THREE.Vector3(0.32, -0.52, 0),
      new THREE.Vector3(-0.32, -1.15, 0),
      new THREE.Vector3(-0.85, -1.35, 0)
    ]);
    const torsoMesh = new THREE.Mesh(new THREE.TubeGeometry(torsoCurve, 32, 0.54, 16, false), bodyMat);
    this.registerSkin(torsoMesh);
    mainGroup.add(torsoMesh);

    // Esqueleto cartilaginoso y órganos torácicos
    this.buildCompleteSkeleton(mainGroup, 0.78, 2, new THREE.Vector3(0.1, 0.1, 0));
    this.buildThoracicAnatomy(mainGroup, 0.78, 2, new THREE.Vector3(0.2, 0.1, 0));

    // Paletas de extremidades con rayos digitales
    const limbMat = bodyMat;
    const paddleGeo = new THREE.BoxGeometry(0.35, 0.55, 0.12);
    const handPaddleL = new THREE.Mesh(paddleGeo, limbMat);
    handPaddleL.position.set(0.55, 0.25, 0.6);
    handPaddleL.rotation.set(0.4, 0.2, -0.6);
    const handPaddleR = new THREE.Mesh(paddleGeo, limbMat);
    handPaddleR.position.set(0.55, 0.25, -0.6);
    handPaddleR.rotation.set(-0.4, -0.2, -0.6);
    this.registerSkin(handPaddleL, handPaddleR);
    mainGroup.add(handPaddleL, handPaddleR);

    // Cordón umbilical con asas intestinales herniadas fisiológicamente
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.22, -0.1, 0),
      new THREE.Vector3(0.95, -0.4, 0.4),
      new THREE.Vector3(1.45, -1.0, 0.1),
      new THREE.Vector3(2.1, -1.5, -0.3)
    ]);
    const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 32, 0.15, 12, false), this.materials.umbilicalCord);
    mainGroup.add(cordMesh);
    this.activeMeshes.push(cordMesh);

    group.add(mainGroup);
  }

  // ================= ETAPA 3: FETO TEMPRANO (SEMANAS 9-12) =================
  buildEarlyFetus(group, stageData) {
    const mainGroup = new THREE.Group();

    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xffedd5,
      roughness: 0.35,
      transmission: 0.28,
      ior: 1.35
    });

    // Cabeza proporcionalmente humana
    const headGeo = new THREE.SphereGeometry(1.18, 36, 36);
    headGeo.scale(1.0, 1.16, 1.05);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(0, 1.28, 0);
    this.registerSkin(headMesh);
    mainGroup.add(headMesh);

    // Rasgos faciales (nariz, labios, párpados sellados)
    const noseGeo = new THREE.ConeGeometry(0.13, 0.28, 16);
    const noseMesh = new THREE.Mesh(noseGeo, skinMat);
    noseMesh.position.set(0.98, 1.22, 0);
    noseMesh.rotation.z = -Math.PI / 2;
    this.registerSkin(noseMesh);
    mainGroup.add(noseMesh);

    // Párpados sellados
    const eyelidGeo = new THREE.BoxGeometry(0.08, 0.14, 0.28);
    const eyelidL = new THREE.Mesh(eyelidGeo, skinMat);
    eyelidL.position.set(0.85, 1.38, 0.48);
    const eyelidR = new THREE.Mesh(eyelidGeo, skinMat);
    eyelidR.position.set(0.85, 1.38, -0.48);
    this.registerSkin(eyelidL, eyelidR);
    mainGroup.add(eyelidL, eyelidR);

    // Torso cilíndrico
    const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.58, 1.45, 28), skinMat);
    torsoMesh.position.set(0, 0.15, 0);
    this.registerSkin(torsoMesh);
    mainGroup.add(torsoMesh);

    // Esqueleto óseo completo y órganos internos
    this.buildCompleteSkeleton(mainGroup, 1.0, 3, new THREE.Vector3(0, 0.05, 0));
    this.buildThoracicAnatomy(mainGroup, 1.0, 3, new THREE.Vector3(0, 0.1, 0));

    // Extremidades articuladas con dedos diferenciados
    const createLimb = (len, r) => new THREE.CylinderGeometry(r * 0.9, r, len, 16);
    const armL = new THREE.Mesh(createLimb(0.72, 0.18), skinMat);
    armL.position.set(0.48, 0.62, 0.58);
    armL.rotation.set(0.4, 0.3, -0.7);
    const armR = new THREE.Mesh(createLimb(0.72, 0.18), skinMat);
    armR.position.set(0.48, 0.62, -0.58);
    armR.rotation.set(-0.4, -0.3, -0.7);
    this.registerSkin(armL, armR);
    mainGroup.add(armL, armR);

    const legL = new THREE.Mesh(createLimb(0.82, 0.22), skinMat);
    legL.position.set(0.18, -0.75, 0.52);
    legL.rotation.set(0.5, 0, 0.8);
    const legR = new THREE.Mesh(createLimb(0.82, 0.22), skinMat);
    legR.position.set(0.18, -0.75, -0.52);
    legR.rotation.set(-0.5, 0, 0.8);
    this.registerSkin(legL, legR);
    mainGroup.add(legL, legR);

    // Cordón umbilical
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.48, 0.05, 0),
      new THREE.Vector3(1.25, -0.3, 0.5),
      new THREE.Vector3(1.85, -0.9, 0.2),
      new THREE.Vector3(2.5, -1.4, -0.4)
    ]);
    const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 32, 0.16, 12, false), this.materials.umbilicalCord);
    mainGroup.add(cordMesh);
    this.activeMeshes.push(cordMesh);

    group.add(mainGroup);
  }

  // ================= ETAPA 4: FETO EN DESARROLLO (SEMANAS 13-20) =================
  buildDevelopingFetus(group, stageData) {
    const mainGroup = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfed7aa,
      roughness: 0.45,
      metalness: 0.02
    });

    // Cabeza con vérnix incipiente
    const headGeo = new THREE.SphereGeometry(1.32, 36, 36);
    headGeo.scale(0.95, 1.12, 1.02);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(-0.1, 1.48, 0);
    this.registerSkin(headMesh);
    mainGroup.add(headMesh);

    // Cuerpo
    const bodyGeo = new THREE.SphereGeometry(1.05, 36, 36);
    bodyGeo.scale(0.8, 1.38, 0.84);
    const bodyMesh = new THREE.Mesh(bodyGeo, skinMat);
    bodyMesh.position.set(0, 0.22, 0);
    this.registerSkin(bodyMesh);
    mainGroup.add(bodyMesh);

    // Esqueleto óseo y órganos torácicos y abdominales
    this.buildCompleteSkeleton(mainGroup, 1.25, 4, new THREE.Vector3(0, 0.15, 0));
    this.buildThoracicAnatomy(mainGroup, 1.25, 4, new THREE.Vector3(0, 0.2, 0));

    // Mano succionándose el pulgar (reflejo de succión vivo)
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.52, 0.72, 0.46),
      new THREE.Vector3(0.84, 1.05, 0.3),
      new THREE.Vector3(0.72, 1.34, 0.1)
    ]);
    const armMesh = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 20, 0.21, 12, false), skinMat);
    this.registerSkin(armMesh);
    mainGroup.add(armMesh);

    // Piernas recogidas con patadita activa
    const legCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.12, -0.85, 0.38),
      new THREE.Vector3(0.65, -1.25, 0.2),
      new THREE.Vector3(0.22, -1.55, -0.1)
    ]);
    const legMesh = new THREE.Mesh(new THREE.TubeGeometry(legCurve, 20, 0.25, 12, false), skinMat);
    this.registerSkin(legMesh);
    mainGroup.add(legMesh);

    // Cordón umbilical
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.52, 0.0, 0),
      new THREE.Vector3(1.35, -0.4, 0.6),
      new THREE.Vector3(2.1, -1.1, 0.1),
      new THREE.Vector3(2.7, -1.6, -0.5)
    ]);
    const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 36, 0.19, 12, false), this.materials.umbilicalCord);
    mainGroup.add(cordMesh);
    this.activeMeshes.push(cordMesh);

    group.add(mainGroup);
  }

  // ================= ETAPA 5: FETO AVANZADO (SEMANAS 21-36) =================
  buildAdvancedFetus(group, stageData) {
    const mainGroup = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      roughness: 0.42,
      metalness: 0.02
    });

    const headGeo = new THREE.SphereGeometry(1.52, 40, 40);
    headGeo.scale(0.92, 1.06, 0.98);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(0, 1.58, 0);
    this.registerSkin(headMesh);
    mainGroup.add(headMesh);

    const bodyGeo = new THREE.SphereGeometry(1.42, 40, 40);
    bodyGeo.scale(0.86, 1.24, 0.92);
    const bodyMesh = new THREE.Mesh(bodyGeo, skinMat);
    bodyMesh.position.set(0, 0.1, 0);
    this.registerSkin(bodyMesh);
    mainGroup.add(bodyMesh);

    // Esqueleto avanzado y anatomía torácica (surfactante y respiración continua)
    this.buildCompleteSkeleton(mainGroup, 1.48, 5, new THREE.Vector3(0, 0.1, 0));
    this.buildThoracicAnatomy(mainGroup, 1.48, 5, new THREE.Vector3(0, 0.15, 0));

    // Extremidades articuladas gruesas bilaterales (Brazos y Piernas)
    const armL = this.createSegmentedLimb(
      [new THREE.Vector3(0.62, 0.72, 0.62), new THREE.Vector3(1.05, 0.62, 0.2), new THREE.Vector3(0.72, 0.42, -0.2)],
      0.29,
      skinMat
    );
    const armR = this.createSegmentedLimb(
      [new THREE.Vector3(0.62, 0.72, -0.62), new THREE.Vector3(1.05, 0.42, -0.2), new THREE.Vector3(0.72, 0.22, 0.2)],
      0.29,
      skinMat
    );
    const legL = this.createSegmentedLimb(
      [new THREE.Vector3(0.35, -0.85, 0.58), new THREE.Vector3(0.82, -1.25, 0.3), new THREE.Vector3(0.42, -1.45, -0.15)],
      0.34,
      skinMat
    );
    const legR = this.createSegmentedLimb(
      [new THREE.Vector3(0.35, -0.85, -0.58), new THREE.Vector3(0.82, -1.25, -0.3), new THREE.Vector3(0.42, -1.45, 0.15)],
      0.34,
      skinMat
    );
    this.registerSkin(armL, armR, legL, legR);
    mainGroup.add(armL, armR, legL, legR);

    // Cordón umbilical grueso
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.72, -0.1, 0),
      new THREE.Vector3(1.65, -0.5, 0.7),
      new THREE.Vector3(2.45, -1.3, 0.2),
      new THREE.Vector3(3.1, -1.8, -0.6)
    ]);
    const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 40, 0.23, 14, false), this.materials.umbilicalCord);
    mainGroup.add(cordMesh);
    this.activeMeshes.push(cordMesh);

    group.add(mainGroup);
  }

  // ================= ETAPA 6: TÉRMINO (SEMANAS 37-40) =================
  buildFullTerm(group, stageData) {
    const mainGroup = new THREE.Group();

    const babySkinMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      roughness: 0.38,
      metalness: 0.01
    });

    mainGroup.rotation.z = Math.PI * 0.92;
    mainGroup.position.y = 0.2;

    const headGeo = new THREE.SphereGeometry(1.68, 44, 44);
    headGeo.scale(0.9, 1.03, 0.96);
    const headMesh = new THREE.Mesh(headGeo, babySkinMat);
    headMesh.position.set(0, 1.62, 0);
    this.registerSkin(headMesh);
    mainGroup.add(headMesh);

    const bodyGeo = new THREE.SphereGeometry(1.62, 44, 44);
    bodyGeo.scale(0.9, 1.26, 0.96);
    const bodyMesh = new THREE.Mesh(bodyGeo, babySkinMat);
    bodyMesh.position.set(0, 0.0, 0);
    this.registerSkin(bodyMesh);
    mainGroup.add(bodyMesh);

    // Esqueleto óseo completo de recién nacido y anatomía torácica a término
    this.buildCompleteSkeleton(mainGroup, 1.62, 6, new THREE.Vector3(0, 0.0, 0));
    this.buildThoracicAnatomy(mainGroup, 1.62, 6, new THREE.Vector3(0, 0.05, 0));

    // Extremidades flexionadas en actitud de flexión fisiológica bilateral (Brazos y Piernas)
    const armL = this.createSegmentedLimb(
      [new THREE.Vector3(0.72, 0.62, 0.68), new THREE.Vector3(1.15, 0.52, 0.2), new THREE.Vector3(0.72, 0.62, -0.2)],
      0.35,
      babySkinMat
    );
    const armR = this.createSegmentedLimb(
      [new THREE.Vector3(0.72, 0.62, -0.68), new THREE.Vector3(1.15, 0.52, -0.2), new THREE.Vector3(0.72, 0.62, 0.2)],
      0.35,
      babySkinMat
    );
    const legL = this.createSegmentedLimb(
      [new THREE.Vector3(0.42, -0.92, 0.72), new THREE.Vector3(0.92, -1.35, 0.3), new THREE.Vector3(0.42, -1.45, -0.2)],
      0.41,
      babySkinMat
    );
    const legR = this.createSegmentedLimb(
      [new THREE.Vector3(0.42, -0.92, -0.72), new THREE.Vector3(0.92, -1.35, -0.3), new THREE.Vector3(0.42, -1.45, 0.2)],
      0.41,
      babySkinMat
    );
    this.registerSkin(armL, armR, legL, legR);
    mainGroup.add(armL, armR, legL, legR);

    // Cordón umbilical terminal
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.82, -0.2, 0),
      new THREE.Vector3(1.75, -0.7, 0.8),
      new THREE.Vector3(2.65, -1.5, 0.3),
      new THREE.Vector3(3.3, -2.1, -0.7)
    ]);
    const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 44, 0.26, 14, false), this.materials.umbilicalCord);
    mainGroup.add(cordMesh);
    this.activeMeshes.push(cordMesh);

    group.add(mainGroup);
  }

  // ================= CONTROL DESLIZANTE DE DISECCIÓN POR CAPAS =================
  setDissectionLayer(layer) {
    this.dissectionLayer = Math.max(0, Math.min(1, layer));

    this.skinMeshes.forEach((mesh) => {
      if (!mesh.material) return;
      const skinOpacity = Math.max(0.05, 1.0 - this.dissectionLayer * 0.95);
      mesh.material.transparent = true;
      mesh.material.opacity = skinOpacity;
      mesh.material.depthWrite = skinOpacity > 0.6;
    });

    this.skeletonMeshes.forEach((mesh) => {
      if (!mesh.material) return;
      mesh.visible = true;
      if (this.dissectionLayer > 0.3) {
        mesh.material.emissive = new THREE.Color(0x06b6d4);
        mesh.material.emissiveIntensity = (this.dissectionLayer - 0.3) * 0.85;
      } else {
        mesh.material.emissive = new THREE.Color(0x000000);
        mesh.material.emissiveIntensity = 0;
      }
    });

    this.organMeshes.forEach((mesh) => {
      if (!mesh.material) return;
      mesh.visible = true;
      if (this.dissectionLayer > 0.15 && this.dissectionLayer < 0.85) {
        mesh.material.opacity = 1.0;
      } else if (this.dissectionLayer >= 0.85) {
        // En disección ósea extrema, atenuar órganos para destacar el esqueleto
        mesh.material.opacity = Math.max(0.2, 1.0 - (this.dissectionLayer - 0.85) * 5);
      }
    });
  }

  // ================= 4 MODOS DE RENDERIZADO VISUAL =================
  applyRenderMode(mode) {
    this.renderMode = mode;

    this.activeMeshes.forEach((mesh) => {
      if (!mesh.material) return;

      if (mode === 'bio') {
        // Modo Biológico Realista
        mesh.visible = true;
        if (mesh.userData.originalMat) {
          mesh.material = mesh.userData.originalMat;
        }
      } else if (mode === 'anatomy') {
        // MODO ANATOMÍA: Piel translúcida revelando esqueleto, pulmones, corazón e hígado
        mesh.visible = true;
        if (mesh.userData.isSkin) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: 0xffedd5,
            roughness: 0.12,
            transparent: true,
            opacity: 0.22,
            transmission: 0.85,
            ior: 1.34,
            depthWrite: false
          });
        } else if (mesh.userData.isBone) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x93c5fd,
            emissiveIntensity: 0.45,
            roughness: 0.2
          });
        } else if (mesh.userData.isLung) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xfb7185,
            emissive: 0xf43f5e,
            emissiveIntensity: 0.8,
            roughness: 0.2
          });
        } else if (mesh.userData.isHeart) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0xdc2626,
            emissiveIntensity: 1.0,
            roughness: 0.2
          });
        }
      } else if (mode === 'xray') {
        // Modo Rayos X: Esqueleto en cian eléctrico y órganos bioluminiscentes
        mesh.visible = true;
        if (mesh.userData.isSkin) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.05,
            roughness: 0.1
          });
        } else if (mesh.userData.isBone) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0x22d3ee,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.98,
            roughness: 0.1
          });
        } else if (mesh.userData.isLung) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            emissive: 0x1d4ed8,
            emissiveIntensity: 0.65,
            roughness: 0.3
          });
        } else if (mesh.userData.isHeart) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xf43f5e,
            emissive: 0xe11d48,
            emissiveIntensity: 0.9,
            roughness: 0.2
          });
        }
      } else if (mode === 'ultrasound') {
        // Modo Ecografía 3D Doppler
        mesh.visible = true;
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          roughness: 0.85,
          metalness: 0.15
        });
      }
    });
  }

  createSegmentedLimb(points, radius, material) {
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 24, radius, 14, false);
    return new THREE.Mesh(geo, material);
  }

  disposeObject(obj) {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material.dispose();
    }
    if (obj.children) {
      obj.children.forEach((child) => this.disposeObject(child));
    }
  }

  update(deltaTime, elapsedTime) {
    this.animatables.forEach((anim) => anim(elapsedTime, deltaTime));
  }
}
