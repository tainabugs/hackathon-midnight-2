import { create } from "zustand";

interface ShowToastProps {
  isDisabled: boolean;
  setIsDisabled: () => void;
  setNotDisabled: () => void;
}

export const useShowToast = create<ShowToastProps>((set) => ({
  isDisabled: false,
  setIsDisabled: () => set({ isDisabled: true }),
  setNotDisabled: () => set({ isDisabled: false }),
}));
