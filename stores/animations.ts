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
        entry: {
          started: false,
          completed: false,
        },
        exit: {
          started: false,
          completed: false,
        },
      },
    },
  }),
  actions: {
    onTitleEntryComplete() {
      this.landing.mainTitle.entry.completed = true;
    },
    startTitleExit() {
      this.landing.mainTitle.exit.started = true;
    },
    onTitleExitComplete() {
      this.landing.mainTitle.exit.completed = true;
    },
    onIntroComplete() {
      this.landing.intro.completed = true;
    },
    startIntro() {
      this.landing.intro.started = true;
    },
  },
});
