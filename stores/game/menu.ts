import type { MenuStatus } from "../../app/types/game";

export const MENU_CLOSE_DELAY_MS = 700;

export const getToggleTargetMenuStatus = (status: MenuStatus): MenuStatus => {
  if (status === "open") {
    return "closing";
  }

  return "opening";
};

export const getMenuOpenStatus = (): MenuStatus => "open";

export const getMenuClosingStatus = (): MenuStatus => "closing";

export const finalizeClosingStatus = (status: MenuStatus): MenuStatus =>
  status === "closing" ? "closed" : status;
