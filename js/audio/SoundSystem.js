// ==========================================================================
// SISTEMA DE SONIDO NATIVO (WEB AUDIO API)
// Generación procedural de audio: latidos fetales en tiempo real,
// ambiente uterino subacuático y efectos sonoros interactivos sin dependencias externas.
// ==========================================================================

export class SoundSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.heartGain = null;
    this.ambientGain = null;
    this.sfxGain = null;

    this.heartbeatTimer = null;
    this.currentBpm = 0;
    this.isHeartbeatPlaying = false;
    this.isAmbientPlaying = false;
    this.ambientNodes = null;

    this.onHeartbeatTick = null; // Callback para sincronizar animaciones visuales (ECG e ícono de corazón)
  }

  // Inicialización bajo la primera interacción del usuario (política de navegadores)
  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Ganancia principal
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Canales separados
      this.heartGain = this.ctx.createGain();
      this.heartGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.heartGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.startAmbientWombSound();
    } catch (e) {
      console.warn("Web Audio API no soportada o bloqueada:", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    if (!this.ctx) this.init();
    this.resume();

    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  // ================= LATIDOS CARDÍACOS FETALES (BPM) =================
  setBpm(bpm) {
    this.currentBpm = bpm;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (bpm <= 0) {
      this.isHeartbeatPlaying = false;
      return;
    }

    this.isHeartbeatPlaying = true;
    const intervalMs = (60 / bpm) * 1000;

    // Disparar latido inicial
    this.playHeartLubDub();
    if (this.onHeartbeatTick) this.onHeartbeatTick();

    this.heartbeatTimer = setInterval(() => {
      this.playHeartLubDub();
      if (this.onHeartbeatTick) this.onHeartbeatTick();
    }, intervalMs);
  }

  playHeartLubDub() {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;

    // 1er impulso: "LUB" (más grave y prolongado)
    this.synthesizePulse(t, 58, 0.12, 0.6);

    // 2do impulso: "DUB" (ligeramente más agudo y corto, ~120ms después)
    this.synthesizePulse(t + 0.13, 72, 0.09, 0.45);
  }

  synthesizePulse(startTime, freq, duration, gainLevel) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(32, startTime + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.heartGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  // ================= AMBIENTE UTERINO (RUIDO ROSA + FILTRO ACUÁTICO) =================
  startAmbientWombSound() {
    if (!this.ctx || this.ambientNodes) return;

    // Buffer de Ruido Rosa (10 segundos)
    const bufferSize = this.ctx.sampleRate * 8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filtro pasa-bajos cálido simulando líquido amniótico y pared abdominal
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    // LFO muy lento para dar sensación de pulso sanguíneo materno
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // Ciclo respiratorio cada 5s
    lfoGain.gain.setValueAtTime(40, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noiseSource.connect(filter);
    filter.connect(this.ambientGain);

    noiseSource.start();
    lfo.start();

    this.ambientNodes = { noiseSource, filter, lfo };
    this.isAmbientPlaying = true;
  }

  // ================= EFECTOS DE SONIDO (SFX) =================
  playClick() {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  playSuccess() {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const chords = [523.25, 659.25, 783.99, 1046.50]; // Do - Mi - Sol - Do (C5, E5, G5, C6)
    chords.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  playFanfare() {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const notes = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 659.25, d: 0.1 },  // E5
      { f: 783.99, d: 0.1 },  // G5
      { f: 1046.50, d: 0.35 } // C6
    ];

    let delay = 0;
    notes.forEach((n) => {
      const t = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + n.d + 0.05);

      delay += 0.11;
    });
  }

  playThump() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    this.synthesizePulse(this.ctx.currentTime, 90, 0.1, 0.4);
  }

  playError() {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.18);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  playWhoosh() {
    if (!this.ctx || this.isMuted) return;
    try {
      this.resume();
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain || this.masterGain);

      osc.start(t);
      osc.stop(t + 0.23);
    } catch (err) {
      console.warn("SoundSystem playWhoosh warning:", err);
    }
  }

  // Sonido de tijera quirúrgica seccionando el cordón umbilical
  playSnip() {
    if (!this.ctx || this.isMuted) return;
    try {
      this.resume();
      const t = this.ctx.currentTime;
      // Golpe metálico de tijera
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1600, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.08);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain || this.masterGain);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch (e) {}
  }

  // Sintetizador del primer llanto vigoroso del recién nacido
  playBabyCry() {
    if (!this.ctx || this.isMuted) return;
    try {
      this.resume();
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      // Curva melódica de llanto infantil: sube a 550 Hz y desciende a 420 Hz modulado
      osc.frequency.setValueAtTime(380, t);
      osc.frequency.linearRampToValueAtTime(540, t + 0.15);
      osc.frequency.linearRampToValueAtTime(420, t + 0.45);
      osc.frequency.linearRampToValueAtTime(510, t + 0.65);
      osc.frequency.exponentialRampToValueAtTime(280, t + 1.1);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.masterGain);
      osc.start(t);
      osc.stop(t + 1.15);
    } catch (e) {}
  }
}

export const soundSystem = new SoundSystem();

