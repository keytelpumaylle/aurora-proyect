"use client";

import { useState } from "react";
import { ShoppingCart, X, CircleX, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/images/Logo.png";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/Cart";

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    products,
    removeProduct,
    increaseQuantity,
    decreaseQuantity,
    getTotal,
  } = useCartStore();

  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalPrice = products.reduce((acc, p) => acc + p.quantity * p.price, 0);
  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="sticky top-0 z-60">
      <header className="relative ">
        <nav aria-label="Top" className=" px-8">
          <div className="flex h-16 items-center">

            <div className="flex justify-between w-full items-center">
              <div className="flex gap-2 items-center">
                {/* Logo */}
                <div className="ml-4 flex lg:ml-0">
                  <Link href="/" className="">
                    <Image
                      width={50}
                      height={50}
                      alt="Logo Aura"
                      src={Logo}
                      className="h-12 w-auto"
                    />
                  </Link>
                </div>

                {/* Search */}
              </div>

              {/* Items */}
              <div className="flex gap-2 items-center">
                {/* Cart */}
                <div
                  className="ml-4 flow-root lg:ml-6 border-gray border-1 rounded-lg p-2 bg-white"
                  onClick={() => setOpen(true)}
                >
                  <a
                    href="#"
                    className="group -m-2 flex items-center p-2 relative"
                  >
                    <ShoppingCart size={20} />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {totalItems}
                      </span>
                    )}
                    <span className="sr-only">items in cart, view bag</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      
      {open && (
        <div className="fixed top-0 right-0 w-full sm:w-3/5 md:w-2/5 lg:w-1/4 py-6 px-4 h-screen flex-1 bg-white border-gray border-l-2 z-50">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Mi carrito</h3>
            <button
              className="border-gray border-1 p-2 rounded-lg hover:cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-6 w-full">
            {products.length === 0 ? (
              <p className="text-gray-500">Tu carrito está vacío.</p>
            ) : (
              <>
                <ul className="space-y-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-graylight scrollbar-thumb-rounded-full pb-20">
                  <div className="h-[405px] pr-3">
                    {products.map((p) => (
                    <li
                      key={p.id}
                      className="flex justify-between items-center border-gray border-b py-3 "
                    >
                      <div className="flex items-center gap-2 relative pt-2 px-2">
                        <button
                          onClick={() => removeProduct(p.id.toString())}
                          className="absolute top-0 left-0 bg-gray rounded-full hover:text-red"
                        >
                          <CircleX size={24} strokeWidth={1.5}/>
                        </button>
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
                        <div className="flex items-center border border-gray rounded-full">
                          <button
                            className="border-r border-gray p-2"
                            onClick={() => decreaseQuantity(p.id.toString())}
                          >
                            <Minus size={16} />
                          </button>
                          <label className="px-3">{p.quantity}</label>
                          <button
                            className="border-l border-gray p-2"
                            onClick={() => increaseQuantity(p.id.toString())}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                  </div>
                </ul>

                <div className="absolute bottom-5 w-full left-0 bg-white py-4 border-graylight border-t-2">
                  <div className="mx-6 text-right font-semibold flex justify-between border-gray border-b pt-2 pb-4">
                    <span>Total:</span>
                    <span>S/ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="px-6 ">
                    <button
                      onClick={handleCheckout}
                      className="p-4 rounded-md bg-blue w-full cursor-pointer"
                    >
                      Ir a pagar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
