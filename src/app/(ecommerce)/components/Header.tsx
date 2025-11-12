"use client";

import { useState } from "react";
import { ShoppingCart, X, Minus, Plus, ReceiptText } from "lucide-react";
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
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <header className="relative">
        <nav aria-label="Top" className="px-4 md:px-8 max-w-[1920px] mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  width={48}
                  height={48}
                  alt="Logo Aurora"
                  src={Logo}
                  className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Siria
                </h1>
                <p className="text-xs text-graydark/60">Farmacia Inteligente</p>
              </div>
            </Link>

            {/* Cart Button */}
            <div className="flex items-center gap-5">
              <Link href={"/historial"} className="relative group border-gray-300 border-1 p-[10px] rounded-lg text-dark hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 flex items-center gap-1">
                <ReceiptText size={18}/>
                <span className="text-sm">Mi Historial</span>
              </Link>

              <button
              onClick={() => setOpen(true)}
              className="relative group border-gray-300 border-1 p-[10px] rounded-lg text-dark hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
            >
              <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
            </div>
          </div>
        </nav>
      </header>
      
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 animate-fadeInUp"
            onClick={() => setOpen(false)}
          ></div>

          {/* Sidebar del carrito */}
          <div className="fixed top-0 right-0 w-full sm:w-96 md:w-[400px] h-screen bg-white shadow-2xl z-[200] flex flex-col animate-fadeInUp">
            {/* Header del carrito */}
            <div className="bg-gradient-to-r from-primary to-secondary p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">Mi Carrito</h3>
                  <p className="text-xs text-white/80">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Contenido del carrito */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                    <ShoppingCart size={40} className="text-primary/40" />
                  </div>
                  <p className="text-graydark font-medium mb-2">Tu carrito está vacío</p>
                  <p className="text-sm text-gray-500">Agrega productos para comenzar</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {products.map((p) => (
                    <li
                      key={p.id}
                      className="bg-gradient-to-br from-graylight/30 to-white p-4 rounded-2xl border border-gray/20 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="flex gap-3">
                        {/* Imagen */}
                        <div className="relative flex-shrink-0">
                          <Image
                            src={p.image_url}
                            alt={p.name}
                            width={80}
                            height={80}
                            className="rounded-xl object-cover bg-white shadow-sm"
                          />
                          <button
                            onClick={() => removeProduct(p.id.toString())}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red text-white flex items-center justify-center hover:bg-red/80 transition-all shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-graydark text-sm mb-2 line-clamp-2">
                            {p.name}
                          </h4>
                          <p className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                            S/ {getTotal(p.price, p.quantity)}
                          </p>

                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseQuantity(p.id.toString())}
                              className="w-8 h-8 rounded-lg bg-white border border-gray/30 hover:border-primary hover:text-primary transition-all flex items-center justify-center"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center font-semibold text-graydark">
                              {p.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(p.id.toString())}
                              className="w-8 h-8 rounded-lg bg-white border border-gray/30 hover:border-primary hover:text-primary transition-all flex items-center justify-center"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer con total y botón de pago */}
            {products.length > 0 && (
              <div className="border-t border-gray/30 bg-white p-6 pb-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-graydark font-medium">Total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    S/ {totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Proceder al pago
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
