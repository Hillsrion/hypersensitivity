import { defineStore } from "pinia";

export const useAnimationsStore = defineStore("animations", {
  state: () => ({
    landing: {
      enabled: true,
      complete: false,
      intro: {
        entry: {
          started: false,
          completed: false,
        },
        exit: {
          started: false,
          completed: false,
        },
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
      this.startIntroEntry();
    },
    onIntroEntryComplete() {
      this.landing.intro.entry.completed = true;
    },
    startIntroExit() {
      this.landing.intro.exit.started = true;
    },
    onIntroExitComplete() {
      this.landing.intro.exit.completed = true;
    },
    startIntroEntry() {
      this.landing.intro.entry.started = true;
    },
  },
});
