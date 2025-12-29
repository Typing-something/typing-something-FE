"use client";

import { create } from "zustand";
import type { UIMode } from "@/components/molecules/settingssidebar/UIModePicker";

export type FontSize = "sm" | "md" | "lg";
type State = {
  uiMode: UIMode;
  setUIMode: (m: UIMode) => void;

  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
};

export const useTypingSettings = create<State>((set) => ({
  uiMode: "default",
  setUIMode: (uiMode) => set({ uiMode }),

  fontSize: "md",
  setFontSize: (fontSize) => set({fontSize}),
}));