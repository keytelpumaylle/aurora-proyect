import { create } from "zustand";

type Product = {
    id: string; // Cambiado a string para UUID
    name: string;
    price: number;
    image_url: string;
    quantity: number;
}

type CartState = {
    products: Product[];
    isOpen: boolean;
    addProduct: (product: Product) => void;
    buyNow: (product: Product) => void;
    clearCart: () => void;
    removeProduct: (id: string) => void;
    toggleCart: () => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    getTotal: (price: number, quantity: number) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    products: [],
    isOpen: false,

    addProduct: (product) => {
      const existing = get().products.find((p) => p.id === product.id)
      if (existing) {
        const updated = get().products.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + product.quantity }
            : p
        )
        set({ products: updated })
      } else {
        set({ products: [...get().products, product] })
      }
    },

    buyNow: (product) => {
      set({ products: [{ ...product }] })
      // luego haces un router.push('/checkout') en la UI
    },

    clearCart: () => set({ products: [] }),

    removeProduct: (id) => {
      set({ products: get().products.filter((p) => p.id !== id) })
    },

    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

    increaseQuantity: (id: string) => {
      const updated = get().products.map((p) => (
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p
      ))
      set({ products: updated })
    },

    decreaseQuantity: (id: string) => {
      const updated = get().products.map((p) => (
        p.id === id ? { ...p, quantity: p.quantity > 1 ? p.quantity - 1 : 1 } : p
      ))
      set({ products: updated })
    },

    getTotal: (price: number, quantity: number) => {
      return Number((price * quantity).toFixed(2));
    }
  }))