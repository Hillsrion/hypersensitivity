import { defineStore } from 'pinia';

export const useAudioStore = defineStore('audio', {
  state: () => ({
    currentAudio: null,
    fadeInterval: null,
    isPlaying: false,
    list: [],
    volume: 0.8,
  }),

  actions: {
    setVolume(val) {
      this.volume = val;
      if (this.currentAudio && !this.fadeInterval) {
        this.currentAudio.volume = val;
      }
    },

    async playAudio(audioPath) {
      // Stop any currently playing audio first
      await this.stopCurrentAudio();

      // Create and play new audio
      const item = this.list.find(item => item.path === audioPath);
      if (!item) return;

      this.currentAudio = item.audio;
      this.currentAudio.volume = 0;
      // Start playing and fade in
      this.currentAudio.play();
      this.isPlaying = true;
      this.fadeVolume(true);
    },

    preloadList(list) {
      this.list = list.map(item => {
        const timings = item.timings?.map(timing => {
          return {
            word: timing.word,
            start: parseFloat(timing.startOffset.replace('s', '')),
            end: parseFloat(timing.endOffset.replace('s', '')),
          }
        }) ?? [];

        // Calculate duration from timings if available
        let duration = 0;
        if (timings.length > 0) {
          duration = timings[timings.length - 1].end - timings[0].start;
        }

        return {
          ...item,
          audio: new Audio(item.path),
          transcript: item.transcript,
          timings,
          duration
        };
      });
    },

    defineDurations() {
      this.list.forEach(item => {
        if (item.timings && item.timings.length > 0) {
          item.duration = item.timings[item.timings.length - 1].end - item.timings[0].start;
        }
      });
    },

    async analyzeTimings() {
      const audioTimingAnalyzer = new AudioTimingAnalyzer();
      this.list.forEach(async item => {
        const { duration } = await audioTimingAnalyzer.analyzeAudio(item.path, item.transcript);
        item.duration = duration;
      });
    },

    async stopCurrentAudio() {
      if (this.currentAudio && this.isPlaying) {
        // Fade out and stop
        await this.fadeVolume(false);
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
        this.isPlaying = false;
      }
    },

    fadeVolume(fadeIn, duration = 500, steps = 20) {
      // Clear any existing fade interval
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }
      return new Promise((resolve) => {
        if (!this.currentAudio) {
          resolve();
          return;
        }

        const targetVolume = fadeIn ? this.volume : 0;
        const startVolume = this.currentAudio.volume;
        const volumeStep = (targetVolume - startVolume) / steps;
        const stepDuration = duration / steps;
        let currentStep = 0;

        this.fadeInterval = setInterval(() => {
          currentStep++;
          this.currentAudio.volume = Math.max(0, Math.min(1, startVolume + (volumeStep * currentStep)));

          if (currentStep >= steps) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
            resolve();
          }
        }, stepDuration);
      });
    },
  },
}); 