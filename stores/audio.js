import { defineStore } from 'pinia';

export const useAudioStore = defineStore('audio', {
  state: () => ({
    currentAudio: null,
    fadeInterval: null,
    isPlaying: false,
    list: [],
  }),

  actions: {
    async playAudio(audioPath) {
      // Stop any currently playing audio first
      await this.stopCurrentAudio();

      // Create and play new audio
      const { audio } = this.list.find(item => item.path === audioPath);
      this.currentAudio = audio;
      this.currentAudio.volume = 0;
      // Start playing and fade in
      this.currentAudio.play();
      this.isPlaying = true;
      this.fadeVolume(true);
    },

    preloadList(list) {
      this.list = list.map(item => {
        return {
          ...item,
          audio: new Audio(item.path),
          transcript: item.transcript,
          timings: item.timings?.map(timing => {
            return {
              word: timing.word,
              start: parseFloat(timing.startOffset.replace('s', '')),
              end: parseFloat(timing.endOffset.replace('s', '')),
            }
          }) ?? [],
        };
      });;
    },

    defineDurations() {
      this.list.forEach(item => {
        item.duration = item.timings[item.timings.length - 1].end - item.timings[0].start;
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

        const targetVolume = fadeIn ? 0.5 : 0; // Max volume 50%
        const startVolume = this.currentAudio.volume;
        const volumeStep = (targetVolume - startVolume) / steps;
        const stepDuration = duration / steps;
        let currentStep = 0;

        this.fadeInterval = setInterval(() => {
          currentStep++;
          this.currentAudio.volume = Math.abs(startVolume + (volumeStep * currentStep));

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