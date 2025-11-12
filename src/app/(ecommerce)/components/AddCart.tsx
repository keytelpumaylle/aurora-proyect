'use client'
import { useCartStore } from "@/store/Cart";
import { useNotifications } from "@/store/Notification";

type AddCartButtonProps = {
    id: string;
    name: string;
    price: number;
    image_url: string;
    quantity?: number;
}

export default function AddCartButton(props: AddCartButtonProps) {
    const { addProduct } = useCartStore()
    const { success } = useNotifications()

    const handleAddCart = () => {
        addProduct({
            id: props.id,
            name: props.name,
            price: props.price,
            image_url: props.image_url,
            quantity: 1
        })

        // Mostrar notificación de éxito
        success(
            '¡Producto agregado!',
            `${props.name} se agregó al carrito`,
            4000
        )
    }
  return (
    <button
      onClick={handleAddCart}
      className="group relative w-full py-3 px-4 rounded-xl font-semibold text-graydark bg-white border-2 border-primary/30 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:shadow-primary/20"
    >
      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      Añadir al carrito
    </button>
  );
}