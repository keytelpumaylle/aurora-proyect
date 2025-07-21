'use client'
import { useCartStore } from "@/store/Cart";

type AddCartButtonProps = {
    id: number;
    name:string;
    price: number;
    image_url:string;
    quantity?:number;
}

export default function AddCartButton(props:AddCartButtonProps) {
    const { addProduct } = useCartStore()
    const handleAddCart = () =>{
        addProduct({
            id: props.id,
            name:props.name,
            price: props.price,
            image_url: props.image_url,
            quantity: 1
        })
    }
  return (
    <button onClick={handleAddCart} className="bg-graylight w-full py-3 rounded-md cursor-pointer">Añadir al carrito</button>
  );
}