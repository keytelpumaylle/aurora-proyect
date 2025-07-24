"use client";

import { updateProducts } from "@/api/Products";
import { useModalAdmin } from "@/store/ModalMedication";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

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
  const { open, close, state, selected } = useModalAdmin();
  const formRef = useRef<HTMLFormElement>(null);
  // Example usage: you need to provide a FormData object and an id
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;

    const formData = new FormData(formRef.current!);
    await updateProducts(formData, selected.id);
    close();
    // Opcional: refresca la lista de medicamentos aquí
  };
  return (
    <>
      <div
        key={props.id}
        className="group relative block rounded-md overflow-hidden p-0.5 transition-all duration-300 h-full"
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
            <div className="flex items-center justify-between mt-2">
              <p className="font-bold text-gray-900 mt-auto pt-2">
                s/{props.price.toFixed(2)}
              </p>
              <button onClick={() => open(props)}>
                <Ellipsis size={20} strokeWidth={1.3} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {state && selected && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-[#12121215]">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              <h2 className="font-bold mb-4">Editar Medicamento</h2>
              <form ref={formRef} onSubmit={handleUpdate}>
                <div>
                  <label>Nombre</label>
                  <input
                name="name"
                  className="border p-2 w-full mb-2"
                  defaultValue={selected.name}
                />
                </div>
                <div>
                  <label>Descripción</label>
                  <input
                name="description"
                  className="border p-2 w-full mb-2"
                  defaultValue={selected.description}
                />
                </div>

                <div>
                  <label>Indicación</label>
                  <input
                name="indication"
                  className="border p-2 w-full mb-2"
                  defaultValue={selected.indication}
                />
                </div>
                <div>
                  <label>Contra Indicación</label>

                  <input
                name="contraindication"
                  className="border p-2 w-full mb-2"
                  defaultValue={selected.contraindication}
                />
                </div>
                <div>
                  <label>Dosis</label>
                  <input
                name="dose"
                  className="border p-2 w-full mb-2"
                  defaultValue={selected.dose}
                />
                </div>
                <input
                name="price"
                  className="border p-2 w-full mb-2"
                  defaultValue={selected.price}
                  type="number"
                  step="any"
                />
                <input
                name="imageUrl"
                  className="border p-2 w-full mb-2"
                  defaultValue={selected.imageUrl}
                />
                <div className="flex gap-2 justify-center mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded" /* onClick={handleDelete} */
                  >
                    Eliminar
                  </button>
                  <button
                  
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded" /* onClick={handleEdit} */
                  >
                    Actualizar
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
