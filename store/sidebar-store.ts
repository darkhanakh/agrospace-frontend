import { create } from "zustand";

type State = {
  isSidebarOpen: boolean;
};

type Action = {
  setIsSidebarOpen: (state: boolean) => void;
};

export const useSidebarStore = create<State & Action>((set) => ({
  isSidebarOpen: false,
  setIsSidebarOpen: (state) => set({ isSidebarOpen: state }),
}));
