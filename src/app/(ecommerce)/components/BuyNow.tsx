'use client'
import { useCartStore } from "@/store/Cart";
import { useRouter } from 'next/navigation'

type BuyNowButtonProps = {
    id: number;
    name:string;
    price: number;
    image_url:string;
    quantity?:number;
}

export default function BuyNowButton(props:BuyNowButtonProps) {
    const { addProduct } = useCartStore()
    const router = useRouter()
    
    const handleCheckout = () =>{
      addProduct({
        id: props.id,
        name:props.name,
        price: props.price,
        image_url: props.image_url,
        quantity: 1
      })
      router.push('/checkout')
    }
  return (
    <button onClick={handleCheckout} className="bg-gradient-to-r from-[#885BDA] to-[#66D6D7] w-full py-3 rounded-md cursor-pointer hover:text-white">Comprar ahora</button>
  );
}
