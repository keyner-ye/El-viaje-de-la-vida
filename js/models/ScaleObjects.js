// ==========================================================================
// MODELOS 3D PROCEDURALES DE LAS FRUTAS Y OBJETOS DE COMPARACIÓN
// Representa en 3D fielmente los objetos de la escala de la infografía:
// Semilla de amapola, grano de arroz, arándano, ciruela, aguacate, berenjena y sandía.
// ==========================================================================

import * as THREE from 'three';

export class ScaleObjects {
  constructor() {
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = "ScaleObjectsRoot";
    this.rootGroup.position.set(3.5, 0, 0); // Posicionado al lado derecho del feto
    this.currentMesh = null;
    this.pedestal = null;

    this.createPedestal();
  }

  createPedestal() {
    // Pedestal flotante para la fruta
    const pedGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.25, 32);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.8
    });
    this.pedestal = new THREE.Mesh(pedGeo, pedMat);
    this.pedestal.position.set(0, -2.2, 0);
    this.rootGroup.add(this.pedestal);

    // Anillo de luz en el pedestal
    const ringGeo = new THREE.RingGeometry(1.3, 1.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.13;
    this.pedestal.add(ring);
  }

  showFruitForStage(stageId) {
    if (this.currentMesh) {
      this.rootGroup.remove(this.currentMesh);
      this.disposeObject(this.currentMesh);
      this.currentMesh = null;
    }

    // Separación dinámica generosa para que las formas nunca se choquen
    let posX = 3.8;
    if (stageId === 4) posX = 4.6; // Aguacate
    if (stageId === 5) posX = 5.4; // Berenjena
    if (stageId === 6) posX = 6.6; // Gran Sandía
    this.rootGroup.position.set(posX, 0, 0);

    let fruitGroup = new THREE.Group();

    switch (stageId) {
      case 0:
        fruitGroup = this.createPoppySeed();
        break;
      case 1:
        fruitGroup = this.createRiceGrain();
        break;
      case 2:
        fruitGroup = this.createBlueberry();
        break;
      case 3:
        fruitGroup = this.createPlum();
        break;
      case 4:
        fruitGroup = this.createAvocado();
        break;
      case 5:
        fruitGroup = this.createEggplant();
        break;
      case 6:
        fruitGroup = this.createWatermelon();
        break;
      default:
        fruitGroup = this.createPoppySeed();
    }

    this.currentMesh = fruitGroup;
    this.rootGroup.add(this.currentMesh);
  }

  // 1. Semilla de amapola (~0.1 mm)
  createPoppySeed() {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.35, 16, 16);
    geo.scale(1.1, 0.9, 0.8);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.1
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = -1.5;
    group.add(mesh);
    return group;
  }

  // 2. Grano de arroz (~0.5 cm)
  createRiceGrain() {
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(0.26, 0.26, 1.2, 20);
    geo.scale(1, 1, 0.7);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.05
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = -1.2;
    mesh.rotation.z = Math.PI / 6;
    group.add(mesh);
    return group;
  }

  // 3. Arándano (~2.5 cm)
  createBlueberry() {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.9, 32, 32);
    geo.scale(1.1, 0.95, 1.1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.45,
      metalness: 0.1
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = -0.8;
    group.add(mesh);

    // Corona superior del cáliz
    const crownGeo = new THREE.TorusGeometry(0.22, 0.06, 8, 16);
    const crownMat = new THREE.MeshStandardMaterial({ color: 0x172554, roughness: 0.6 });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.rotation.x = Math.PI / 2;
    crown.position.set(0, 0.05, 0);
    mesh.add(crown);

    return group;
  }

  // 4. Ciruela (~6 cm)
  createPlum() {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(1.2, 32, 32);
    geo.scale(0.95, 1.15, 1.0);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x581c87, // Púrpura ciruela intenso
      roughness: 0.35,
      metalness: 0.15
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = -0.5;
    group.add(mesh);

    // Tallo de la ciruela
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.4, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3f2e0f, roughness: 0.9 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 1.5, 0);
    stem.rotation.z = 0.2;
    mesh.add(stem);

    return group;
  }

  // 5. Aguacate (~16 cm)
  createAvocado() {
    const group = new THREE.Group();

    // Piel exterior rugosa verde oscuro
    const skinGeo = new THREE.SphereGeometry(1.4, 32, 32);
    skinGeo.scale(0.85, 1.3, 0.85);
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0x14532d, // Verde oscuro aguacate
      roughness: 0.85,
      metalness: 0.05
    });
    const mesh = new THREE.Mesh(skinGeo, skinMat);
    mesh.position.y = 0.0;
    group.add(mesh);

    // Pulpa cremosa visible (mitad frontal)
    const pulpGeo = new THREE.SphereGeometry(1.35, 32, 32, 0, Math.PI, 0, Math.PI);
    pulpGeo.scale(0.84, 1.28, 0.84);
    const pulpMat = new THREE.MeshStandardMaterial({
      color: 0xa3e635, // Verde lima cremoso
      roughness: 0.4
    });
    const pulp = new THREE.Mesh(pulpGeo, pulpMat);
    pulp.rotation.y = Math.PI / 2;
    mesh.add(pulp);

    // Semilla grande marrón en el centro
    const seedGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const seedMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.5
    });
    const seed = new THREE.Mesh(seedGeo, seedMat);
    seed.position.set(0.4, -0.2, 0);
    mesh.add(seed);

    return group;
  }

  // 6. Berenjena (~28 cm)
  createEggplant() {
    const group = new THREE.Group();

    // Forma de pera alargada púrpura brillante
    const bodyGeo = new THREE.CylinderGeometry(0.7, 1.3, 2.8, 32);
    bodyGeo.scale(1.0, 1.0, 0.9);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x3b0764, // Morado berenjena muy profundo y brillante
      roughness: 0.22,
      metalness: 0.2
    });
    const mesh = new THREE.Mesh(bodyGeo, bodyMat);
    mesh.position.y = 0.3;
    group.add(mesh);

    // Cáliz verde con hojas estrelladas arriba
    const calyxGeo = new THREE.ConeGeometry(0.9, 0.5, 6);
    const calyxMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const calyx = new THREE.Mesh(calyxGeo, calyxMat);
    calyx.position.set(0, 1.5, 0);
    calyx.rotation.x = Math.PI;
    mesh.add(calyx);

    // Tallo verde curvado
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(0.1, 1.9, 0),
      new THREE.Vector3(0.3, 2.2, 0)
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 12, 0.08, 8, false);
    const stem = new THREE.Mesh(stemGeo, calyxMat);
    mesh.add(stem);

    return group;
  }

  // 7. Sandía (~48-52 cm)
  createWatermelon() {
    const group = new THREE.Group();

    // Gran esfera verde con franjas
    const geo = new THREE.SphereGeometry(1.85, 36, 36);
    geo.scale(1.05, 1.25, 1.05);

    const mat = new THREE.MeshStandardMaterial({
      color: 0x166534, // Verde sandía
      roughness: 0.35,
      metalness: 0.05
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.6;
    group.add(mesh);

    // Rayas oscuras de la sandía
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x052e16, roughness: 0.4 });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const stripeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2.3, 0),
        new THREE.Vector3(Math.cos(angle) * 1.95, 0.6, Math.sin(angle) * 1.95),
        new THREE.Vector3(0, -1.1, 0)
      ]);
      const stripeGeo = new THREE.TubeGeometry(stripeCurve, 24, 0.08, 6, false);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      group.add(stripe);
    }

    return group;
  }

  setVisible(visible) {
    this.rootGroup.visible = visible;
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

  update(elapsedTime) {
    if (this.currentMesh && this.rootGroup.visible) {
      this.currentMesh.rotation.y = elapsedTime * 0.4;
    }
  }
}

