"use client";

import { useModalChat } from "@/store/ModalChat";
import { useState } from "react";

export default function ModalInfoUser() {
  const { close, state, setUserData, userData } = useModalChat();
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
  });

  // Si el modal está cerrado, no renderizar nada
  if (!state) return null;

  function getUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Polyfill simple (no criptográficamente seguro, pero suficiente para IDs de usuario temporal)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Merge with existing userData to produce a complete UserData object
    const updatedUser = {
      id: userData?.id || getUUID(),
      dni: userData?.dni || "",
      name: userData?.name || "",
      edad: formData.age,
      peso: formData.weight,
      talla: formData.height,
      genero: formData.gender,
    };

    // Guardar datos en el estado global
    setUserData(updatedUser);
    // Cerrar el modal
    close();
  };

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className="min-h-screen fixed inset-0 bg-[#12121280] z-100"
        onClick={close}
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-110 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg max-h-[90vh] w-full max-w-md mx-auto relative overflow-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ¡Bienvenido!
            </h2>
            
            <div className="pb-4 text-gray-600">
              <p>
                Para darte una orientación personalizada y más segura, necesitamos algunos datos básicos sobre ti.
              </p>
            </div>

            <div className='flex flex-col gap-4 mb-6'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="age">Edad</label>
                    <input 
                      id="age"
                      name="age" 
                      type="number" 
                      className="border-gray border-[1px] px-4 py-2 rounded-md focus:outline-none focus:border-dark" 
                      placeholder="20"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="120"
                    />
                </div>
                 <div className='flex flex-col gap-1'>
                    <label htmlFor="weight">Peso (kg)</label>
                    <input 
                      id="weight"
                      name="weight" 
                      type="number" 
                      className="border-gray border-[1px] px-4 py-2 rounded-md focus:outline-none focus:border-dark" 
                      placeholder="55"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="300"
                      step="0.1"
                    />
                </div>
                 <div className='flex flex-col gap-1'>
                    <label htmlFor="height">Talla (cm)</label>
                    <input 
                      id="height"
                      name="height" 
                      type="number" 
                      className="border-gray border-[1px] px-4 py-2 rounded-md focus:outline-none focus:border-dark" 
                      placeholder="160"
                      value={formData.height}
                      onChange={handleInputChange}
                      required
                      min="30"
                      max="250"
                      step="0.1"
                    />
                </div>
                 <div className='flex flex-col gap-1'>
                    <label htmlFor="gender">Género</label>
                    <select 
                      id="gender"
                      name="gender"
                      className="border-gray border-[1px] px-4 py-2 rounded-md focus:outline-none focus:border-dark"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                        <option value="">Seleccione su género</option>
                        <option value='M'>Masculino</option>
                        <option value='F'>Femenino</option>
                    </select>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#885BDA] to-[#66D6D7] text-white py-3 px-4 rounded-md hover:opacity-90 transition-opacity font-medium"
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}