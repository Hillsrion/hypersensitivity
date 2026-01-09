import { defineStore } from "pinia";

export const useAnimationsStore = defineStore("animations", {
  state: () => {
    const SKIP_INTRO = import.meta.dev;

    return {
      skipIntro: SKIP_INTRO,
      landing: {
        enabled: !SKIP_INTRO,
        complete: SKIP_INTRO,
        intro: {
          entry: {
            started: SKIP_INTRO,
            completed: SKIP_INTRO,
          },
          exit: {
            started: SKIP_INTRO,
            completed: SKIP_INTRO,
          },
        },
        mainTitle: {
          entry: {
            started: SKIP_INTRO,
            completed: SKIP_INTRO,
          },
          exit: {
            started: SKIP_INTRO,
            completed: SKIP_INTRO,
          },
        },
      },
      aurora: {
        color: "green",
        visible: false,
      },
    };
  },
  actions: {
    setAuroraColor(color: string) {
      this.aurora.color = color;
    },
    setAuroraVisibility(visible: boolean) {
      this.aurora.visible = visible;
    },
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
