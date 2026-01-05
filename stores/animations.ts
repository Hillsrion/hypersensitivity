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
    },
  }),
  actions: {
    onTitleEntryComplete() {
      this.landing.intro.started = true;
    },
    onIntroComplete() {
      this.landing.intro.completed = true;
    },
  },
});
