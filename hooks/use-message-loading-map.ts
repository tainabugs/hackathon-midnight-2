import { create } from "zustand";

interface MessageLoadingProps {
  isLoading: boolean;
  indexLoading: number | undefined;
  setIsLoading: (index: number) => void;
  setNotLoading: () => void;
}

export const useMessageLoading = create<MessageLoadingProps>((set) => ({
  isLoading: false,
  indexLoading: undefined,
  setIsLoading: (index: number) => set({ isLoading: true, indexLoading: index }),
  setNotLoading: () => set({ isLoading: false, indexLoading: undefined }),
}));
