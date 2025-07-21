'use client'
import { useCartStore } from "@/store/Cart";
import Image from "next/image";

export default function HistorialProductos() {
    const {
    products,
    getTotal
  } = useCartStore();

  //const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalPrice = products.reduce((acc, p) => acc + p.quantity * p.price, 0);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3>Total a pagar:</h3>
        <span className="font-bold">s/ {totalPrice}</span>
      </div>
       <div className="mt-2 w-full">
            {products.length === 0 ? (
              <p className="text-gray-500">No tienes productos en tu carrito.</p>
            ) : (
              <>
                <ul className="space-y-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-graylight scrollbar-thumb-rounded-full pb-20">
                  <div className="h-[505px] pr-3">
                    {products.map((p) => (
                    <li
                      key={p.id}
                      className="flex justify-between items-center border-gray border-b py-3 "
                    >
                      <div className="flex items-center gap-2 relative pt-2 px-2">
                        
                        <Image
                          src={p.image_url}
                          alt={p.name}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <p className="text-sm font-medium">{p.name}</p>
                      </div>
                      <div className="text-right flex flex-col gap-1">
                        <p className="text-sm font-semibold">
                          S/ {getTotal(p.price, p.quantity)}
                        </p>
                        
                      </div>
                    </li>
                  ))}
                  </div>
                </ul>
             
              </>
            )}
          </div>
    </>
  );
}