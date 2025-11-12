'use client'
import { useCartStore } from "@/store/Cart";
import Image from "next/image";

export default function HistorialProductos() {
    const {
    products,
    getTotal
  } = useCartStore();

  const totalPrice = products.reduce((acc, p) => acc + p.quantity * p.price, 0);
  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Products List */}
      <div className="w-full">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-graydark/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <p className="text-graydark/60 text-sm">No tienes productos en tu carrito.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex gap-3 p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {p.quantity}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <p className="text-sm font-semibold text-graydark truncate">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-graydark/60">
                      S/ {p.price.toFixed(2)} c/u
                    </span>
                    <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      S/ {getTotal(p.price, p.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {products.length > 0 && (
        <div className="pt-4 border-t-2 border-gray-100 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-graydark/60">Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
            <span className="font-semibold text-graydark">S/ {totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-graydark/60">Envío</span>
            <span className="font-semibold text-secondary">Gratis</span>
          </div>
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-graydark">Total a pagar</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                S/ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}