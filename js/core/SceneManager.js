// ==========================================================================
// GESTOR DE ESCENA THREE.JS (SceneManager)
// Manejo de renderizado WebGL, iluminación biológica, partículas flotantes de
// líquido amniótico, cámara orbital fluida y transiciones cinematográficas.
// ==========================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    this.fluidParticles = null;
    this.autoRotate = true;
    this.isTransitioning = false;
    this.targetCameraPos = null;
    this.targetControlsTarget = null;

    this.clock = new THREE.Clock();
    this.onUpdateCallbacks = [];

    this.init();
  }

  init() {
    // 1. Escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x04060a);
    this.scene.fog = new THREE.FogExp2(0x04060a, 0.04);

    // 2. Cámara
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0.5, 7.5);

    // 3. Renderizador WebGL
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Controles Orbitales
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 0.6;
    this.controls.maxDistance = 50.0;
    this.controls.maxPolarAngle = Math.PI * 0.90;
    this.controls.minPolarAngle = Math.PI * 0.10;
    this.controls.target.set(0, 0.2, 0);

    // 5. Iluminación Biológica
    this.setupLighting();

    // 6. Partículas de Fluido Amniótico
    this.setupAmnioticParticles();

    // 7. Eventos de Redimensionamiento
    window.addEventListener('resize', () => this.onWindowResize());

    // 8. Iniciar Ciclo de Animación
    this.animate();
  }

  setupLighting() {
    // Luz ambiental suave azulada
    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 0.9);
    this.scene.add(ambientLight);

    // Luz principal frontal/superior cálida
    const keyLight = new THREE.DirectionalLight(0xfff1f2, 2.0);
    keyLight.position.set(5, 7, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    // Luz trasera de halo (Rim light magenta/violeta para silueta biológica)
    const rimLight = new THREE.DirectionalLight(0xec4899, 2.5);
    rimLight.position.set(-6, -2, -6);
    this.scene.add(rimLight);

    // Luz de relleno inferior cian
    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.2);
    fillLight.position.set(0, -5, 2);
    this.scene.add(fillLight);
  }

  setupAmnioticParticles() {
    // Partículas microscópicas flotantes simulando células y fluido amniótico
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      speeds[i] = 0.2 + Math.random() * 0.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.06,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    this.fluidParticles = new THREE.Points(geometry, material);
    this.fluidParticles.userData = { speeds };
    this.scene.add(this.fluidParticles);
  }

  animateParticles(deltaTime) {
    if (!this.fluidParticles) return;
    const positions = this.fluidParticles.geometry.attributes.position.array;
    const speeds = this.fluidParticles.userData.speeds;
    const count = speeds.length;

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += speeds[i] * deltaTime * 0.4;
      if (positions[i * 3 + 1] > 5) {
        positions[i * 3 + 1] = -5;
      }
      positions[i * 3] += Math.sin(positions[i * 3 + 1] * 2) * deltaTime * 0.05;
    }
    this.fluidParticles.geometry.attributes.position.needsUpdate = true;
    this.fluidParticles.rotation.y += deltaTime * 0.02;
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  resetCamera() {
    this.targetCameraPos = new THREE.Vector3(0, 0.5, 7.5);
    this.targetControlsTarget = new THREE.Vector3(0, 0.2, 0);
    this.isTransitioning = true;
  }

  setComparisonView(stageId) {
    let fruitX = 3.8;
    let dist = 11.5;
    if (stageId === 4) { fruitX = 4.6; dist = 14.5; }
    if (stageId === 5) { fruitX = 5.4; dist = 17.0; }
    if (stageId === 6) { fruitX = 6.6; dist = 21.0; } // Sandía espaciosa

    const midX = fruitX / 2;
    this.targetControlsTarget = new THREE.Vector3(midX, 0.1, 0);
    this.targetCameraPos = new THREE.Vector3(midX, 0.8, dist);
    this.isTransitioning = true;
  }

  zoomIn() {
    const offset = this.camera.position.clone().sub(this.controls.target);
    if (offset.length() > this.controls.minDistance + 0.4) {
      offset.multiplyScalar(0.78);
      this.targetCameraPos = this.controls.target.clone().add(offset);
      this.targetControlsTarget = this.controls.target.clone();
      this.isTransitioning = true;
    }
  }

  zoomOut() {
    const offset = this.camera.position.clone().sub(this.controls.target);
    if (offset.length() < this.controls.maxDistance - 2) {
      offset.multiplyScalar(1.35);
      this.targetCameraPos = this.controls.target.clone().add(offset);
      this.targetControlsTarget = this.controls.target.clone();
      this.isTransitioning = true;
    }
  }

  setFocusOnObject(center, distance = 6.0) {
    this.targetControlsTarget = center.clone();
    this.targetCameraPos = new THREE.Vector3(center.x, center.y + 0.5, center.z + distance);
    this.isTransitioning = true;
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    return this.autoRotate;
  }

  addUpdateCallback(cb) {
    this.onUpdateCallbacks.push(cb);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Rotación automática orbital
    if (this.autoRotate && !this.controls.state) {
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.0;
    } else {
      this.controls.autoRotate = false;
    }

    // Transición suave de cámara (Lerp)
    if (this.isTransitioning && this.targetCameraPos && this.targetControlsTarget) {
      this.camera.position.lerp(this.targetCameraPos, 0.08);
      this.controls.target.lerp(this.targetControlsTarget, 0.08);

      if (
        this.camera.position.distanceTo(this.targetCameraPos) < 0.05 &&
        this.controls.target.distanceTo(this.targetControlsTarget) < 0.05
      ) {
        this.camera.position.copy(this.targetCameraPos);
        this.controls.target.copy(this.targetControlsTarget);
        this.isTransitioning = false;
      }
    }

    this.controls.update();
    this.animateParticles(deltaTime);

    // Callbacks externos (modelos procedurales, animaciones)
    this.onUpdateCallbacks.forEach((cb) => cb(deltaTime, elapsedTime));

    this.renderer.render(this.scene, this.camera);
  }
}

