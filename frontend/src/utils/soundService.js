/**
 * EduPulse AI Web Audio Synthesizer Sound Engine
 * Zero external audio assets required — pure HTML5 Web Audio API
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play Tone with Envelope
   */
  playTone(freq, type = "sine", startTime = 0, duration = 0.3, gainValue = 0.2) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      // Attack and Exponential Decay Envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    } catch (err) {
      console.warn("SoundEngine playTone error:", err);
    }
  }

  /**
   * Play specific soundpack sample
   */
  playSoundpack(pack = "lofi") {
    switch (pack) {
      case "lofi":
        // Warm mellow dual-tone chime
        this.playTone(392.0, "sine", 0, 0.45, 0.25); // G4
        this.playTone(523.25, "triangle", 0.08, 0.5, 0.2); // C5
        this.playTone(659.25, "sine", 0.16, 0.6, 0.15); // E5
        break;

      case "chime":
        // High crystal shimmer chime
        this.playTone(880.0, "sine", 0, 0.35, 0.2); // A5
        this.playTone(1318.5, "sine", 0.06, 0.45, 0.18); // E6
        this.playTone(1760.0, "triangle", 0.12, 0.6, 0.12); // A6
        break;

      case "digital":
        // Modern crisp UI ping
        this.playTone(587.33, "triangle", 0, 0.12, 0.22);
        this.playTone(880.0, "sine", 0.08, 0.25, 0.25);
        break;

      case "arcade":
        // 8-bit retro arcade fanfare
        this.playTone(261.63, "square", 0, 0.08, 0.12); // C4
        this.playTone(329.63, "square", 0.08, 0.08, 0.12); // E4
        this.playTone(392.0, "square", 0.16, 0.08, 0.12); // G4
        this.playTone(523.25, "square", 0.24, 0.25, 0.15); // C5
        break;

      case "bell":
        // Rich singing meditation bell
        this.playTone(440.0, "sine", 0, 0.8, 0.3);
        this.playTone(880.0, "sine", 0.02, 0.6, 0.15);
        this.playTone(1320.0, "triangle", 0.04, 0.4, 0.08);
        break;

      default:
        this.playTone(523.25, "sine", 0, 0.3, 0.2);
    }
  }

  /**
   * Play Notification Pop
   */
  playNotification() {
    this.playSoundpack("lofi");
  }

  /**
   * Play Success Celebration
   */
  playSuccess() {
    this.playTone(523.25, "sine", 0, 0.18, 0.22); // C5
    this.playTone(659.25, "sine", 0.09, 0.22, 0.22); // E5
    this.playTone(783.99, "sine", 0.18, 0.35, 0.25); // G5
  }

  /**
   * Play Level Up Fanfare
   */
  playLevelUp() {
    this.playTone(392.0, "triangle", 0, 0.12, 0.2); // G4
    this.playTone(523.25, "triangle", 0.1, 0.12, 0.2); // C5
    this.playTone(659.25, "triangle", 0.2, 0.12, 0.22); // E5
    this.playTone(783.99, "triangle", 0.3, 0.15, 0.24); // G5
    this.playTone(1046.5, "sine", 0.45, 0.55, 0.28); // C6
  }

  /**
   * Play Warning / Nudge Tone
   */
  playWarning() {
    this.playTone(440.0, "triangle", 0, 0.15, 0.2);
    this.playTone(349.23, "sine", 0.15, 0.3, 0.22);
  }
}

export const soundService = new SoundEngine();
export default soundService;
