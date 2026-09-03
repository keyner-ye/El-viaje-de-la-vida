// ==========================================================================
// SILUETA Y ANATOMÍA MATERNA 3D (MaternalSilhouette)
// Representa la silueta de la madre y el útero en expansión a lo largo de las
// semanas, ilustrando los cambios corporales mostrados en la infografía.
// ==========================================================================

import * as THREE from 'three';

export class MaternalSilhouette {
  constructor() {
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = "MaternalSilhouetteRoot";
    this.rootGroup.visible = false;

    this.bodyMesh = null;
    this.uterusMesh = null;
    this.spineMesh = null;
    this.bladderMesh = null;

    this.initModel();
  }

  initModel() {
    // 1. Material traslúcido elegante para la silueta materna
    const silhouetteMat = new THREE.MeshPhysicalMaterial({
      color: 0xec4899,
      transmission: 0.88,
      transparent: true,
      opacity: 0.22,
      roughness: 0.2,
      ior: 1.34,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // 2. Torso materno femenino estilizado
    const torsoCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.8, -0.4),  // Hombros/cuello
      new THREE.Vector3(0, 2.5, -0.2),  // Tórax
      new THREE.Vector3(0, 1.2, 0.2),   // Cintura
      new THREE.Vector3(0, -0.6, 0.4),  // Vientre / Abdomen
      new THREE.Vector3(0, -2.4, 0.1),  // Pelvis / Caderas
      new THREE.Vector3(0, -4.2, -0.1)  // Muslos
    ]);

    const torsoGeo = new THREE.TubeGeometry(torsoCurve, 32, 1.85, 20, false);
    torsoGeo.scale(1.35, 1.0, 1.15);
    this.bodyMesh = new THREE.Mesh(torsoGeo, silhouetteMat);
    this.rootGroup.add(this.bodyMesh);

    // 3. Senos maternos con cambios en el embarazo
    const breastGeo = new THREE.SphereGeometry(0.75, 24, 24);
    breastGeo.scale(1.0, 1.1, 0.95);
    const breastL = new THREE.Mesh(breastGeo, silhouetteMat);
    breastL.position.set(0.95, 2.3, 1.2);
    const breastR = new THREE.Mesh(breastGeo, silhouetteMat);
    breastR.position.set(-0.95, 2.3, 1.2);
    this.rootGroup.add(breastL, breastR);

    // 4. Columna vertebral materna (con lordosis lumbar pronunciada)
    const spineCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.6, -1.3),
      new THREE.Vector3(0, 2.2, -1.0),
      new THREE.Vector3(0, 0.8, -0.7),
      new THREE.Vector3(0, -0.8, -1.2), // Curvatura lumbar lordótica del embarazo
      new THREE.Vector3(0, -2.5, -1.1)
    ]);
    const spineGeo = new THREE.TubeGeometry(spineCurve, 24, 0.14, 10, false);
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.3,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.35
    });
    this.spineMesh = new THREE.Mesh(spineGeo, spineMat);
    this.rootGroup.add(this.spineMesh);

    // 5. Útero grávido en expansión dinámica
    const uterusGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const uterusMat = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      transmission: 0.82,
      transparent: true,
      opacity: 0.32,
      roughness: 0.25,
      side: THREE.DoubleSide
    });
    this.uterusMesh = new THREE.Mesh(uterusGeo, uterusMat);
    this.uterusMesh.position.set(0, 0.1, 0.2);
    this.rootGroup.add(this.uterusMesh);

    // 6. Vejiga urinaria comprimida en la base
    const bladderGeo = new THREE.SphereGeometry(0.45, 16, 16);
    bladderGeo.scale(1.2, 0.7, 1.0);
    const bladderMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.45
    });
    this.bladderMesh = new THREE.Mesh(bladderGeo, bladderMat);
    this.bladderMesh.position.set(0, -2.1, 0.7);
    this.rootGroup.add(this.bladderMesh);
  }

  updateForStage(stageId) {
    // Ajustar tamaño del útero grávido y la protuberancia del abdomen según la etapa
    let uterusScale = 0.5;
    let bellyBumpZ = 0.0;

    switch (stageId) {
      case 0: // Sem. 1
        uterusScale = 0.4;
        bellyBumpZ = 0.0;
        break;
      case 1: // Sem. 2-4
        uterusScale = 0.55;
        bellyBumpZ = 0.05;
        break;
      case 2: // Sem. 5-8
        uterusScale = 0.8;
        bellyBumpZ = 0.15;
        break;
      case 3: // Sem. 9-12
        uterusScale = 1.05;
        bellyBumpZ = 0.35;
        break;
      case 4: // Sem. 13-20
        uterusScale = 1.35;
        bellyBumpZ = 0.65;
        break;
      case 5: // Sem. 21-36
        uterusScale = 1.68;
        bellyBumpZ = 0.95;
        break;
      case 6: // Sem. 37-40
        uterusScale = 1.95;
        bellyBumpZ = 1.25;
        break;
    }

    if (this.uterusMesh) {
      this.uterusMesh.scale.set(uterusScale, uterusScale * 1.2, uterusScale * 1.05);
      this.uterusMesh.position.z = 0.2 + bellyBumpZ * 0.4;
    }

    if (this.bodyMesh) {
      this.bodyMesh.scale.set(1.35 + bellyBumpZ * 0.2, 1.0, 1.15 + bellyBumpZ * 0.35);
    }

    if (this.bladderMesh) {
      // Compresión vesical en etapas avanzadas
      const compress = Math.max(0.3, 1.0 - (stageId / 6) * 0.5);
      this.bladderMesh.scale.set(1.2, 0.7 * compress, 1.0);
    }
  }

  setVisible(visible) {
    this.rootGroup.visible = visible;
  }

  update(time) {
    if (!this.rootGroup.visible) return;
    // Respiración materna sutil
    const breath = 1 + Math.sin(time * 1.5) * 0.018;
    this.bodyMesh.scale.y = breath;
  }
}

