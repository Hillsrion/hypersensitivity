import { defineStore } from "pinia";

export const useAnimationsStore = defineStore("animations", {
  state: () => ({
    landing: {
      enabled: true,
      complete: false,
      intro: {
        started: false,
        completed: false,
      },
      mainTitle: {
        started: false,
        completed: false,
      },
    },
  }),
  actions: {
    onTitleEntryComplete() {
      this.landing.mainTitle.completed = true;
    },
    onIntroComplete() {
      this.landing.intro.completed = true;
    },
    startIntro() {
      this.landing.intro.started = true;
    },
  },
});
