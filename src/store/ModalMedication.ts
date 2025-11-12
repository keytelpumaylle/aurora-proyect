import { create } from 'zustand'

// Tipo actualizado para el producto/medicamento (nuevo formato del backend)
interface MedicationProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number | null;
}

type Modal = {
  state: boolean;
  selectedProduct: MedicationProduct | null;
  open: (product: MedicationProduct) => void;
  close: () => void;
}

export const useModalMedication = create<Modal>()((set) => ({
  state: false,
  selectedProduct: null,
  open: (product: MedicationProduct) => set(() => ({
    state: true,
    selectedProduct: product
  })),
  close: () => set(() => ({
    state: false,
    selectedProduct: null
  })),
}))

//Modal Medicamentos Administrador
type ModalAdmin = {
  state: boolean;
  selected: MedicationProduct | null;
  open: (product: MedicationProduct) => void;
  close: () => void;
}

export const useModalAdmin = create<ModalAdmin>()((set) => ({
  state: false,
  selected: null,
  open: (product: MedicationProduct) => set({ state: true, selected: product }),
  close: () => set({ state: false, selected: null }),
}));