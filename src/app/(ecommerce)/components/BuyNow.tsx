'use client'
import { useCartStore } from "@/store/Cart";
import { useRouter } from 'next/navigation'
import { useNotifications } from "@/store/Notification";

type BuyNowButtonProps = {
    id: string;
    name: string;
    price: number;
    image_url: string;
    quantity?: number;
}

export default function BuyNowButton(props: BuyNowButtonProps) {
    const { addProduct } = useCartStore()
    const router = useRouter()
    const { info } = useNotifications()

    const handleCheckout = () => {
      addProduct({
        id: props.id,
        name: props.name,
        price: props.price,
        image_url: props.image_url,
        quantity: 1
      })

      // Mostrar notificación informativa
      info(
        'Redirigiendo al checkout',
        `Procesando ${props.name}`,
        2000
      )

      router.push('/checkout')
    }
  return (
    <button
      onClick={handleCheckout}
      className="group w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
      Comprar ahora
    </button>
  );
}
