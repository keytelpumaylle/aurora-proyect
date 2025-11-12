"use client";

import { useState } from "react";
import { useModalChat } from "@/store/ModalChat";
import { X, Save } from "lucide-react";

interface EditUserDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditUserDataModal({ isOpen, onClose }: EditUserDataModalProps) {
  const { userData, setUserData } = useModalChat();
  
  type FormState = {
    edad: string;
    peso: string;
    talla: string;
    genero: string;
  };

  const [formData, setFormData] = useState<FormState>({
    edad: userData?.edad || "",
    peso: userData?.peso || "",
    talla: userData?.talla || "",
    genero: userData?.genero || ""
  });

  const [errors, setErrors] = useState<FormState & { [k: string]: string }>({
    edad: "",
    peso: "",
    talla: "",
    genero: ""
  });

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {
      edad: "",
      peso: "",
      talla: "",
      genero: ""
    };

    if (!formData.edad || parseInt(formData.edad) < 1 || parseInt(formData.edad) > 120) {
      newErrors.edad = "Edad debe estar entre 1 y 120 años";
    }

    if (!formData.peso || parseFloat(formData.peso) < 1 || parseFloat(formData.peso) > 300) {
      newErrors.peso = "Peso debe estar entre 1 y 300 kg";
    }

    if (!formData.talla || parseFloat(formData.talla) < 50 || parseFloat(formData.talla) > 250) {
      newErrors.talla = "Talla debe estar entre 50 y 250 cm";
    }

    if (!formData.genero) {
      newErrors.genero = "Selecciona un género";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Merge edited fields into the existing userData to produce a valid UserData
    const updatedUserData = {
      id: userData?.id || "",
      dni: userData?.dni || "",
      name: userData?.name || "",
      edad: formData.edad,
      peso: formData.peso,
      talla: formData.talla,
      genero: formData.genero,
    };

    setUserData(updatedUserData);
    sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-[#12121240] bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Editar Información Personal</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Edad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad (años)
            </label>
            <input
              type="number"
              value={formData.edad}
              onChange={(e) => handleInputChange("edad", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#885BDA] ${
                errors.edad ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: 25"
            />
            {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad}</p>}
          </div>

          {/* Peso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.peso}
              onChange={(e) => handleInputChange("peso", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#885BDA] ${
                errors.peso ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: 70.5"
            />
            {errors.peso && <p className="text-red-500 text-xs mt-1">{errors.peso}</p>}
          </div>

          {/* Talla */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Talla (cm)
            </label>
            <input
              type="number"
              value={formData.talla}
              onChange={(e) => handleInputChange("talla", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#885BDA] ${
                errors.talla ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: 170"
            />
            {errors.talla && <p className="text-red-500 text-xs mt-1">{errors.talla}</p>}
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <select
              value={formData.genero}
              onChange={(e) => handleInputChange("genero", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#885BDA] ${
                errors.genero ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar género</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
            {errors.genero && <p className="text-red-500 text-xs mt-1">{errors.genero}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#885BDA] to-[#66D6D7] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}