import { create } from 'zustand'

type Modal = {
  state: boolean;
  response: boolean;
  open: () => void;
  close: () => void;
  responseTrue: () => void;
  responseFalse: () => void;
}

export const useCalificationModal = create<Modal>()((set) => ({
  state: false,
  response: false,
  open: () => set(() => ({ state: true })),
  close: () => set(() => ({ state: false })),
  responseTrue: () => set(() => ({ response: true })),
  responseFalse: () => set(() => ({ response: false })),
}))