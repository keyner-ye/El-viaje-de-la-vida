// ==========================================================================
// NARRADOR POR VOZ MÉDICA (VoiceNarrator)
// Utiliza la síntesis de voz nativa del navegador para relatar los hitos
// biológicos de la etapa activa de manera pedagógica y envolvente.
// ==========================================================================

export class VoiceNarrator {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.synth = window.speechSynthesis || null;
    this.isSpeaking = false;
    this.utterance = null;
    this.voice = null;

    this.initVoice();
  }

  initVoice() {
    if (!this.synth) return;

    const setVoice = () => {
      const voices = this.synth.getVoices();
      // Buscar voz en español natural
      this.voice =
        voices.find((v) => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Sabina') || v.name.includes('Alvaro') || v.name.includes('Helena'))) ||
        voices.find((v) => v.lang.startsWith('es')) ||
        null;
    };

    setVoice();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = setVoice;
    }
  }

  toggleNarration(stageData) {
    if (!this.synth) {
      if (this.engine) this.engine.showToast("⚠️ La síntesis de voz no está disponible en este navegador.");
      return false;
    }

    if (this.isSpeaking) {
      this.stop();
      return false;
    } else {
      this.speak(stageData);
      return true;
    }
  }

  speak(stageData) {
    if (!this.synth) return;
    this.stop();

    const textToRead = `Etapa ${stageData.name}, correspondiente a ${stageData.weeks}. ${stageData.shortDesc}. Tamaño estimado: ${stageData.sizeDisplay}, comparable a una ${stageData.fruitName}. ${stageData.longBio}`;

    this.utterance = new SpeechSynthesisUtterance(textToRead);
    if (this.voice) this.utterance.voice = this.voice;
    this.utterance.rate = 0.95; // Cadencia tranquila y médica
    this.utterance.pitch = 1.05;
    this.utterance.lang = 'es-ES';

    this.utterance.onstart = () => {
      this.isSpeaking = true;
      const btn = document.getElementById('btn-voice-narrator');
      if (btn) btn.classList.add('active');
      if (this.engine) this.engine.showToast("🎙️ Narrador Médico activado");
    };

    this.utterance.onend = () => {
      this.isSpeaking = false;
      const btn = document.getElementById('btn-voice-narrator');
      if (btn) btn.classList.remove('active');
    };

    this.utterance.onerror = () => {
      this.isSpeaking = false;
      const btn = document.getElementById('btn-voice-narrator');
      if (btn) btn.classList.remove('active');
    };

    this.synth.speak(this.utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    const btn = document.getElementById('btn-voice-narrator');
    if (btn) btn.classList.remove('active');
  }
}

