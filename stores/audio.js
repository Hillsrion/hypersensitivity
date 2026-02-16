import { defineStore } from 'pinia';

export const useAudioStore = defineStore('audio', {
  state: () => ({
    currentAudio: null,
    currentTime: 0,
    fadeInterval: null,
    progressInterval: null,
    isPlaying: false,
    list: [],
    volume: 0.8,
    playbackRate: 1.0,
    isPaused: false,
  }),

  actions: {
    setVolume(val) {
      this.volume = val;
      if (this.currentAudio && !this.fadeInterval) {
        this.currentAudio.volume = val;
      }
    },

    setPlaybackRate(rate) {
      this.playbackRate = rate;
      if (this.currentAudio) {
        this.currentAudio.playbackRate = rate;
      }
    },

    async playAudio(audioPath) {
      console.log(`LOG_DEBUG: playAudio called for ${audioPath}`);
      // Start stopping current audio without awaiting its full fade out
      // to keep the user gesture context for the next play() call
      this.stopCurrentAudio(false);

      // Find and play new audio
      const item = this.list.find(item => item.path === audioPath);
      if (!item) {
        console.warn(`Audio item not found: ${audioPath}`);
        return;
      }

      this.currentAudio = item.audio;
      this.currentAudio.volume = 0;
      this.currentAudio.currentTime = 0;
      this.currentAudio.playbackRate = this.playbackRate;
      
      // Handle when audio ends naturally
      this.currentAudio.onended = () => {
        this.isPlaying = false;
        this.currentTime = 0;
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
          this.progressInterval = null;
        }
        // Don't nullify currentAudio immediately so currentAudio.volume can still be handled if needed
      };

      try {
        await this.currentAudio.play();
        console.log(`LOG_DEBUG: Audio playback started successfully: ${audioPath}`);
        this.isPlaying = true;
        this.isPaused = false;
        this.fadeVolume(true);
        
        // Start tracking progress
        if (this.progressInterval) clearInterval(this.progressInterval);
        this.progressInterval = setInterval(() => {
          if (this.currentAudio) {
            this.currentTime = this.currentAudio.currentTime;
          }
        }, 100);
      } catch (err) {
        console.error(`LOG_DEBUG: Failed to play audio: ${audioPath}`, err);
      }
    },

    preloadList(list) {
      this.list = list.map(item => {
        const timings = item.timings?.map(timing => {
          const start = typeof timing.start === 'number' 
            ? timing.start 
            : parseFloat(timing.startOffset?.replace('s', '') || 0);
          
          let end;
          if (typeof timing.end === 'number') {
            end = timing.end;
          } else if (timing.end === 'end') {
            end = 999999; // Use a large number to indicate "until the end"
          } else {
            end = parseFloat(timing.endOffset?.replace('s', '') || 0);
          }

          return {
            word: timing.word,
            annotation: timing.annotation,
            showOnly: timing.showOnly,
            start,
            end,
          }
        }) ?? [];

        // Calculate a rough duration from timings if possible
        let duration = 0;
        if (timings.length > 0) {
          // Find the maximum end time that is not 0
          const validEnds = timings.map(t => t.end).filter(e => e > 0);
          if (validEnds.length > 0) {
            duration = Math.max(...validEnds) - timings[0].start;
          }
        }

        const audio = new Audio(item.path);
        audio.preload = 'auto';

        return {
          ...item,
          audio,
          transcript: item.transcript,
          timings,
          duration: duration > 0 ? duration : 0
        };
      });
    },

    defineDurations() {
      this.list.forEach(item => {
        if (item.timings && item.timings.length > 0) {
          const validEnds = item.timings.map(t => t.end).filter(e => e > 0);
          if (validEnds.length > 0) {
            item.duration = Math.max(...validEnds) - item.timings[0].start;
          }
        }
      });
    },

    pauseAudio() {
      if (this.currentAudio && this.isPlaying && !this.isPaused) {
        console.log("LOG_DEBUG: pauseAudio called");
        this.currentAudio.pause();
        this.isPaused = true;
      }
    },

    resumeAudio() {
      if (this.currentAudio && this.isPlaying && this.isPaused) {
        console.log("LOG_DEBUG: resumeAudio called");
        this.currentAudio.play();
        this.isPaused = false;
      }
    },

    async analyzeTimings() {
      const audioTimingAnalyzer = new AudioTimingAnalyzer();
      for (const item of this.list) {
        try {
          const { duration } = await audioTimingAnalyzer.analyzeAudio(item.path, item.transcript);
          item.duration = duration;
        } catch (err) {
          console.warn(`Failed to analyze timings for ${item.path}`, err);
        }
      }
    },

    async stopCurrentAudio(shouldAwaitFade = true) {
      console.log(`LOG_DEBUG: stopCurrentAudio called. isPlaying=${this.isPlaying}, hasCurrent=${!!this.currentAudio}, shouldAwait=${shouldAwaitFade}`);
      if (this.currentAudio && this.isPlaying) {
        if (shouldAwaitFade) {
          console.log("LOG_DEBUG: Awaiting full fade out...");
          await this.fadeVolume(false);
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
          this.isPlaying = false;
          this.currentTime = 0;
          if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
          }
        } else {
          console.log("LOG_DEBUG: Fast fade out triggered.");
          // Fast fade out separate from main flow
          // Capture the audio to stop in a local variable
          const audioToStop = this.currentAudio;
          
          // Clean up any pending fade promise from the previous audio
          if (this.fadeResolve) {
            this.fadeResolve();
            this.fadeResolve = null;
          }

          if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
          }

          // Detach from store state immediately so playAudio can use the slot
          this.isPlaying = false;
          this.isPaused = false;
          this.currentTime = 0;
          
          // Manually fade out the old audio instance
          const startVol = audioToStop.volume;
          let vol = startVol;
          const fadeOut = setInterval(() => {
             vol = Math.max(0, vol - 0.1);
              if (audioToStop) {
                // If this audio element was reclaimed by a new play, stop fading it
                if (audioToStop === this.currentAudio && this.isPlaying) {
                  clearInterval(fadeOut);
                  return;
                }
               audioToStop.volume = vol;
               if (vol <= 0) {
                  audioToStop.pause();
                  audioToStop.currentTime = 0;
                  clearInterval(fadeOut);
               }
             } else {
               clearInterval(fadeOut);
             }
          }, 50);
        }
      } else {
          // If not playing or no current audio, ensure state is clean
          this.isPlaying = false;
          this.isPaused = false;
      }
    },

    fadeVolume(fadeIn, duration = 500, steps = 20) {
      // Clear any existing fade interval and resolve previous promise
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
      if (this.fadeResolve) {
        this.fadeResolve();
        this.fadeResolve = null;
      }

      return new Promise((resolve) => {
        if (!this.currentAudio) {
          resolve();
          return;
        }

        this.fadeResolve = resolve;
        const targetVolume = fadeIn ? this.volume : 0;
        const startVolume = this.currentAudio.volume;
        const volumeStep = (targetVolume - startVolume) / steps;
        const stepDuration = duration / steps;
        let currentStep = 0;

        this.fadeInterval = setInterval(() => {
          currentStep++;
          if (this.currentAudio) {
            this.currentAudio.volume = Math.max(0, Math.min(1, startVolume + (volumeStep * currentStep)));
          }

          if (currentStep >= steps) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
            if (this.fadeResolve) {
              this.fadeResolve();
              this.fadeResolve = null;
            }
          }
        }, stepDuration);
      });
    },
  },
}); 