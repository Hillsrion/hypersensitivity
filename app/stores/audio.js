import { defineStore } from 'pinia';

export const useAudioStore = defineStore('audio', {
  state: () => ({
    currentAudio: null,
    currentTime: 0,
    fadeInterval: null,
    progressInterval: null,
    isPlaying: false,
    /** All preloaded audio items */
    list: [],
    volume: 0.8,
    playbackRate: 1.0,
    isPaused: false,
    /** Number of audio items that have fired `canplaythrough` */
    preloadedCount: 0,
  }),

  getters: {
    /** True once every item in the list has reported canplaythrough */
    allPreloaded: (state) => state.list.length > 0 && state.preloadedCount >= state.list.length,
  },

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
        
        // Fallback: If play() failed (e.g. NotAllowedError), simulate playback
        // so the game flow continues based on the expected duration.
        const duration = item.duration || (this.currentAudio ? this.currentAudio.duration : 0) || 3;
        console.warn(`LOG_DEBUG: Using fallback timer due to play error. Duration: ${duration}s`);
        
        this.isPlaying = true;
        this.isPaused = false;
        
        // Start a timer to simulate progress and trigger end
        if (this.progressInterval) clearInterval(this.progressInterval);
        
        const startTime = Date.now();
        this.progressInterval = setInterval(() => {
           // If audio changed in the meantime, stop this fallback
           if (this.currentAudio !== item.audio) {
              clearInterval(this.progressInterval);
              return;
           }

           const elapsed = (Date.now() - startTime) / 1000;
           this.currentTime = elapsed;
           
           if (elapsed >= duration) {
              clearInterval(this.progressInterval);
              this.progressInterval = null;
              this.isPlaying = false;
              this.currentTime = 0;
              
              console.log("LOG_DEBUG: Fallback timer ended, dispatching events");
              
              if (this.currentAudio) {
                 this.currentAudio.dispatchEvent(new Event('ended'));
                 if (this.currentAudio.onended) this.currentAudio.onended();
              }
           }
        }, 100);
      }
    },

    /**
     * Preload a list of audio items.
     * Each item is { path, transcript, timings? }.
     * Creates an Audio element per item and listens for `canplaythrough`
     * to track how many are truly ready to play without buffering.
     */
    preloadList(list) {
      this.preloadedCount = 0;

      this.list = list.map(item => {
        const timings = item.timings?.map(timing => {
          const start = typeof timing.start === 'number' 
            ? timing.start 
            : parseFloat(timing.startOffset?.replace('s', '') || 0);
          
          let end;
          if (typeof timing.end === 'number') {
            end = timing.end;
          } else if (timing.end === 'end') {
            end = Infinity; // Sentinel: "until audio ends"
          } else {
            end = parseFloat(timing.endOffset?.replace('s', '') || 0);
          }

          return {
            word: timing.word,
            annotation: timing.annotation,
            showOnly: timing.showOnly,
            start,
            end,
          };
        }) ?? [];

        // Calculate rough duration from timings: use finite ends only (exclude Infinity sentinel)
        let duration = 0;
        if (timings.length > 0) {
          const finiteEnds = timings.map(t => t.end).filter(e => Number.isFinite(e) && e > 0);
          if (finiteEnds.length > 0) {
            duration = Math.max(...finiteEnds) - timings[0].start;
          }
        }

        const audio = new Audio(item.path);
        audio.preload = 'auto';

        // Track when the browser has buffered enough to play without interruption
        const onCanPlayThrough = () => {
          this.preloadedCount++;
          audio.removeEventListener('canplaythrough', onCanPlayThrough);
        };
        audio.addEventListener('canplaythrough', onCanPlayThrough);

        return {
          ...item,
          audio,
          transcript: item.transcript,
          timings,
          duration: duration > 0 ? duration : 0,
        };
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
          const audioToStop = this.currentAudio;
          
          if (this.fadeResolve) {
            this.fadeResolve();
            this.fadeResolve = null;
          }

          if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
          }

          this.isPlaying = false;
          this.isPaused = false;
          this.currentTime = 0;
          
          const startVol = audioToStop.volume;
          let vol = startVol;
          const fadeOut = setInterval(() => {
             vol = Math.max(0, vol - 0.1);
              if (audioToStop) {
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
          this.isPlaying = false;
          this.isPaused = false;
      }
    },

    fadeVolume(fadeIn, duration = 500, steps = 20) {
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

    /**
     * Release all audio resources.
     * Call this on page teardown / route change to avoid memory leaks.
     */
    cleanupAudio() {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }

      this.list.forEach(item => {
        try {
          item.audio.pause();
          item.audio.src = ''; // Releases the media resource
        } catch (_) {}
      });

      this.list = [];
      this.currentAudio = null;
      this.isPlaying = false;
      this.isPaused = false;
      this.preloadedCount = 0;
    },
  },
});