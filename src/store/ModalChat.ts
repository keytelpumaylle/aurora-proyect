// store/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Definimos el tipo para los datos del usuario
export type UserData = {
  id: string;
  dni: string;
  name: string;
  edad: string;
  peso: string;
  talla: string;
  genero: string;
}

type Modal = {
  state: boolean;
  userData: UserData | null;
  isFormCompleted: boolean;
  open: () => void;
  close: () => void;
  setUserData: (data: UserData) => void;
  updateUserName: (name: string) => void; // Método para actualizar solo el nombre
  clearUserData: () => void;
  checkFormCompleted: () => boolean;
  editUserData: () => void; // Nuevo método para editar datos
}

export const useModalChat = create<Modal>()(
  persist(
    (set, get) => ({
      state: true,
      userData: null,
      isFormCompleted: false,
      open: () => set(() => ({ state: true })),
      close: () => set(() => ({ state: false })),
      setUserData: (data) => {
        set(() => ({ userData: data, isFormCompleted: true }));
        // También guardar en sessionStorage para compatibilidad
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userData', JSON.stringify(data));
        }
      },
      updateUserName: (name) => {
        const { userData } = get();
        if (userData) {
          const updatedData = { ...userData, name };
          set({ userData: updatedData });
          // Actualizar sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('userData', JSON.stringify(updatedData));
          }
        }
      },
      clearUserData: () => set({ userData: null, isFormCompleted: false }),
      checkFormCompleted: () => {
        const { userData } = get();
        // No requerimos name aquí porque se obtendrá del backend o se pedirá en el modal
        return !!(userData && userData.dni && userData.edad && userData.peso && userData.talla && userData.genero);
      },
      editUserData: () => {
        // Marcar como no completado para volver a mostrar el formulario
        // pero mantener los datos para pre-llenar
        set({ isFormCompleted: false });
      },
    }),
    {
      name: 'user-data-storage',
      // Solo persistir userData e isFormCompleted
      partialize: (state) => ({
        userData: state.userData,
        isFormCompleted: state.isFormCompleted
      }),
    }
  )
)