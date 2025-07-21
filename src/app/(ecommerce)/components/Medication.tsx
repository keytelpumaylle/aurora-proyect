"use client";

import { useModalMedication } from "@/store/ModalMedication";
import Image from "next/image";
import BuyNowButton from "./BuyNow";
import AddCartButton from "./AddCart";

interface Props {
  id: number;
  name: string;
  description: string;
  indication: string;
  contraindication: string;
  dose: string;
  price: number;
  imageUrl: string;
}

export default function Medication(props: Props) {
  const { state, selectedProduct, open, close } = useModalMedication();
  
  
  return (
    <>
      <div
        onClick={() => open(props)} // Pasar la información del producto al abrir
        key={props.id}
        className="group relative block rounded-md overflow-hidden p-0.5 transition-all duration-300 h-full cursor-pointer"
      >
        {/* Fondo degradado que aparece al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#885BDA] to-[#66D6D7] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md z-0"></div>

        {/* Contenedor interno con altura fija */}
        <div className="relative bg-white rounded-md z-10 overflow-hidden h-full flex flex-col">
          {/* Sección de imagen con altura proporcional */}
          <div className="relative aspect-square">
            <Image
              alt={props.name}
              src={props.imageUrl}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          </div>

          {/* Sección de contenido con altura fija */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 h-6">
                {props.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-3 h-6">
                {props.description}
              </p>
            </div>
            <p className="font-bold text-gray-900 mt-auto pt-2">
              s/{props.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      {state && selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Fondo con opacidad */}
          <div 
            className="absolute inset-0 bg-[#12121208] transition-opacity duration-300"
            onClick={close}
          ></div>
          
          {/* Modal centrado - diseño para detalles del producto */}
          <div className="relative bg-white rounded-lg w-full max-w-4xl mx-4 transform transition-all duration-300 scale-100">
            
            
            {/* Contenido del modal dividido en dos columnas */}
            <div className=" md:flex-row rounded-lg p-2">
            <div className="flex h-[550px] overflow-y-auto">
              {/* Columna izquierda - Imagen del producto */}
              <div className="w-full md:w-1/2 relative">
                <div className="aspect-square flex items-center justify-center">
                  <Image
                    alt={selectedProduct.name}
                    src={selectedProduct.imageUrl}
                    width={450}
                    height={450}
                  />
                </div>
              </div>
              
              {/* Columna derecha - Detalles del producto */}
              <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-graylight scrollbar-thumb-rounded-full">
                <div className="flex-1">
                  {/* Nombre del producto */}
                  <h4 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedProduct.name}
                  </h4>
                  
                  {/* Precio */}
                  <div className="mb-6">
                    <span className="text-2xl font-semibold text-gray-900">
                      s/{selectedProduct.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Botones de acción */}
                <div className="space-y-3 pt-4 pb-10">
                  <BuyNowButton id={selectedProduct.id} name={selectedProduct.name} price={selectedProduct.price} image_url={selectedProduct.imageUrl}/>
                  
                  <AddCartButton id={selectedProduct.id} name={selectedProduct.name} price={selectedProduct.price} image_url={selectedProduct.imageUrl}/>
                </div>
                  
                  {/* Descripción */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Descripción
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Indicación */}
                  {selectedProduct.indication && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Indicación
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProduct.indication}
                      </p>
                    </div>
                  )}

                  {/* Dosis */}
                  {selectedProduct.dose && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Dosis
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProduct.dose}
                      </p>
                    </div>
                  )}

                  {/* Contraindicación */}
                  {selectedProduct.contraindication && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-red-600 mb-2">
                        Contraindicación
                      </h3>
                      <p className="text-red-600 leading-relaxed">
                        {selectedProduct.contraindication}
                      </p>
                    </div>
                  )}
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