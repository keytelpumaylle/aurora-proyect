// store/userStore.ts
import { create } from 'zustand'

// Definimos el tipo para los datos del usuario
export type UserData = {
  id:string;
  edad: string;
  peso: string;
  talla: string;
  genero: string;
}

type Modal = {
  state: boolean;
  userData: UserData | null;
  open: () => void;
  close: () => void;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
}

export const useModalChat = create<Modal>()((set) => ({
  state: true,
  userData: null,
  open: () => set(() => ({ state: true })),
  close: () => set(() => ({ state: false })),
  setUserData: (data) => set(() => ({ userData: data })),
  clearUserData: () => set({ userData: null }),
}))