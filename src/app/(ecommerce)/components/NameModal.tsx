"use client";

import { useState } from "react";
import { X, UserCircle } from "lucide-react";

interface NameModalProps {
  isOpen: boolean;
  dni: string;
  initialName: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export default function NameModal({ isOpen, dni, initialName, onConfirm, onCancel }: NameModalProps) {
  const [name, setName] = useState(initialName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 3) {
      onConfirm(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <UserCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Registrar historial clínico</h3>
                <p className="text-sm text-white/90">DNI: {dni}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-graydark mb-4 text-center">
              Para registrar su historial clínico por favor ingrese su nombre
            </p>

            <div className="space-y-2">
              <label htmlFor="modal-name" className="text-sm font-semibold text-graydark flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Nombre Completo
              </label>
              <input
                id="modal-name"
                type="text"
                className="w-full border-2 border-gray/30 focus:border-primary px-4 py-3 rounded-xl focus:outline-none transition-all focus:shadow-lg focus:shadow-primary/10"
                placeholder="Ej: Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={3}
                autoFocus
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-graydark bg-gray/20 hover:bg-gray/30 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={name.trim().length < 3}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
