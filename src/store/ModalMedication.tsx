import { create } from 'zustand'

type Modal = {
  state: boolean
  open: () => void
  close: () => void
}

export const useModalMedication = create<Modal>()((set) => ({
  state: false,
  open: () => set((state) => ({ state: true })),
  close: () => set((state) => ({ state: false })),
}))