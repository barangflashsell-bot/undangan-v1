/**
 * Ambient Romantic Audio Synthesizer & Controller
 * Uses Web Audio API to create a gentle, warm, continuous romantic acoustic harp/piano arpeggio
 * with zero external network dependency, zero broken links, and instant playback.
 */

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private step: number = 0;

  // Romantic chord progression frequencies (Cmaj7 -> Am7 -> Fmaj7 -> Gsus4 / G)
  private readonly chords: number[][] = [
    // Cmaj7 (C3, G3, B3, E4, G4, B4, D5)
    [130.81, 196.00, 246.94, 329.63, 392.00, 493.88, 587.33],
    // Am9 (A2, E3, A3, C4, E4, G4, B4)
    [110.00, 164.81, 220.00, 261.63, 329.63, 392.00, 493.88],
    // Fmaj7 (F2, C3, F3, A3, C4, E4, A4)
    [87.31, 130.81, 174.61, 220.00, 261.63, 329.63, 440.00],
    // Gsus4 / G (G2, D3, G3, B3, D4, G4, B4)
    [98.00, 146.83, 196.00, 246.94, 293.66, 392.00, 493.88]
  ];

  private currentChordIdx = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master gain node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  private playNote(freq: number, duration: number, velocity: number = 0.15) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Dual oscillator: Warm sine base + soft triangle harmonic (piano/harp feel)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);

    // ADSR Envelope: gentle attack, long romantic release
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(velocity, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.4, now + 0.4);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  private tick() {
    if (!this.isPlaying) return;

    const chord = this.chords[this.currentChordIdx];
    const noteIdx = this.step % chord.length;
    const freq = chord[noteIdx];

    // Play arpeggiated note with gentle dynamics
    const velocity = noteIdx === 0 ? 0.22 : 0.12;
    const duration = noteIdx === 0 ? 2.5 : 1.8;
    this.playNote(freq, duration, velocity);

    this.step++;
    if (this.step % 8 === 0) {
      this.currentChordIdx = (this.currentChordIdx + 1) % this.chords.length;
    }

    // Tempo: ~105 BPM arpeggio
    const tempoDelay = 280;
    this.timerId = window.setTimeout(() => this.tick(), tempoDelay);
  }

  public start() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.isPlaying) {
      this.isPlaying = true;
      // Smooth fade-in
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.5, now + 1.5);
      this.tick();
    }
  }

  public pause() {
    if (this.isPlaying && this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);

      setTimeout(() => {
        this.isPlaying = false;
        if (this.timerId !== null) {
          clearTimeout(this.timerId);
          this.timerId = null;
        }
      }, 400);
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new RomanticAudioEngine();

export function setupAudioPlayerUI() {
  const btn = document.getElementById('music-toggle-btn');
  const disc = document.getElementById('music-disc');
  const waves = document.getElementById('music-waves');

  if (!btn) return;

  function updateUiState(isPlaying: boolean) {
    if (isPlaying) {
      btn?.classList.add('playing');
      disc?.classList.add('rotating');
      waves?.classList.remove('hidden');
    } else {
      btn?.classList.remove('playing');
      disc?.classList.remove('rotating');
      waves?.classList.add('hidden');
    }
  }

  btn.addEventListener('click', () => {
    const isNowPlaying = audioEngine.toggle();
    updateUiState(isNowPlaying);
  });

  return { updateUiState };
}
