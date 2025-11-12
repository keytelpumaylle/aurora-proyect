"use client";

import { useModalMedication } from "@/store/ModalMedication";
import Image from "next/image";
import BuyNowButton from "./BuyNow";
import AddCartButton from "./AddCart";

interface Props {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number | null;
}

export default function Medication(props: Props) {
  const { state, selectedProduct, open, close } = useModalMedication();
  
  
  return (
    <>
      <div
        onClick={() => open(props)}
        key={props.id}
        className="group relative block rounded-2xl overflow-hidden p-[2px] transition-all duration-500 h-full cursor-pointer hover:scale-[1.02] animate-fadeInUp"
      >
        {/* Borde degradado animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl animate-shimmer"></div>

        {/* Contenedor con glassmorphism */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden h-full flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-500">
          {/* Badge de stock */}
          {props.stock !== null && (
            <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-graydark text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
              {props.stock > 0 ? `Stock: ${props.stock}` : 'Agotado'}
            </div>
          )}

          {/* Badge de ver detalles */}
          <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Ver detalles
          </div>

          {/* Imagen del producto */}
          <div className="relative aspect-square bg-gradient-to-br from-graylight to-white overflow-hidden">
            <Image
              alt={props.name}
              src={props.image_url}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
            {/* Overlay gradiente en hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Contenido */}
          <div className="p-5 flex-1 flex flex-col bg-gradient-to-br from-white to-graylight/30">
            <div className="flex-1">
              <h3 className="font-bold text-graydark group-hover:text-primary transition-colors duration-300 line-clamp-2 text-base">
                {props.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {props.description}
              </p>
            </div>

            {/* Precio con efecto */}
            <div className="mt-4 border-t border-gray/30 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Precio</p>
                <p className="text-2xl font-bold text-bold">
                  S/ {props.price.toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-12">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {state && selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeInUp">
          {/* Backdrop con blur */}
          <div
            className="absolute inset-0 bg-[#12121205] transition-opacity duration-300"
            onClick={close}
          ></div>

          {/* Modal moderno */}
          <div className="relative bg-white rounded-3xl w-full max-w-5xl  transform transition-all duration-300 scale-100 overflow-hidden">
            {/* Botón cerrar */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row max-h-[90vh]">
              {/* Columna izquierda - Imagen */}
              <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-md">
                  <Image
                    alt={selectedProduct.name}
                    src={selectedProduct.image_url}
                    fill
                    className="object-contain "
                  />
                </div>
              </div>

              {/* Columna derecha - Detalles */}
              <div className="w-full md:w-1/2 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-thumb-rounded-full">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-graydark mb-2">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-xs text-gray-500 font-medium">Precio</span>
                    <span className="text-4xl font-bold text-dark">
                      s/ {selectedProduct.price.toFixed(2)}
                    </span>
                  </div>
                  {selectedProduct.stock !== null && (
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"/>
                      </svg>
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} disponibles` : 'Agotado'}
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="space-y-3 mb-8">
                  <BuyNowButton id={selectedProduct.id} name={selectedProduct.name} price={selectedProduct.price} image_url={selectedProduct.image_url}/>
                  <AddCartButton id={selectedProduct.id} name={selectedProduct.name} price={selectedProduct.price} image_url={selectedProduct.image_url}/>
                </div>

                {/* Información del producto */}
                <div className="space-y-6">
                  {/* Descripción */}
                  <div className="bg-gradient-to-br from-graylight/50 to-transparent p-4 rounded-2xl border border-gray/20">
                    <h3 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
                      </svg>
                      Descripción
                    </h3>
                    <p className="text-graydark leading-relaxed text-sm">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Información adicional */}
                  <div className="bg-gradient-to-br from-secondary/5 to-transparent p-4 rounded-2xl border border-secondary/20">
                    <h3 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wide flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd"/>
                      </svg>
                      Información importante
                    </h3>
                    <ul className="space-y-2 text-sm text-graydark">
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span>Consulta con SIRIA para recomendaciones personalizadas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span>Lee las instrucciones antes de usar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span>Mantén fuera del alcance de los niños</span>
                      </li>
                    </ul>
                  </div>

                  {/* Advertencia */}
                  <div className="bg-gradient-to-br from-red/5 to-transparent p-4 rounded-2xl border border-red/30">
                    <h3 className="text-sm font-bold text-red mb-2 uppercase tracking-wide flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      Advertencia
                    </h3>
                    <p className="text-red leading-relaxed text-sm font-medium">
                      Este producto es un medicamento. No automedicarse. Consulte a su médico.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}