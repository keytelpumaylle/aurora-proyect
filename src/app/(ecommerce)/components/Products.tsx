export const dynamic = 'force-dynamic';

import { getProducts, type Product } from "@/api/Products"
import Medication from "./Medication"

export default async function Products() {
  const products = await getProducts();

  // Verificación defensiva
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
              Respuestas claras para tus malestares
            </h1>
            <p className="text-lg text-graydark/70">Impulsado por <span className="font-bold text-primary">SIRIA</span></p>
          </div>
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-primary/10">
              <svg className="w-6 h-6 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p className="text-gray-500 font-medium">No hay productos disponibles en este momento</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-transparent to-graylight/30">
      <div className="mx-auto max-w-7xl">

        {/* Grid de productos mejorado */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: Product) => (
            <Medication
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image_url={product.image_url}
              stock={product.stock}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
