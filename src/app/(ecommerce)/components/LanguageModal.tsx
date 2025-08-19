"use client";

import { useLanguageStore, type Language } from "@/store/LanguageStore";
import { X, Check } from "lucide-react";

export default function LanguageModal() {
  const { isModalOpen, closeModal, selectedLanguage, setLanguage, availableLanguages } = useLanguageStore();

  if (!isModalOpen) return null;

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
  };

  return (
    <div className="fixed inset-0 bg-[#12121240] bg-opacity-50 flex items-center justify-center z-[150]">
      <div className="bg-white rounded-xl p-6 w-80 max-w-[90vw] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Seleccionar idioma</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Lista de idiomas */}
        <div className="space-y-2">
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                selectedLanguage.code === language.code
                  ? "border-[#885BDA] bg-[#885BDA]/10 text-[#885BDA]"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </div>
              
              {selectedLanguage.code === language.code && (
                <Check size={20} className="text-[#885BDA]" />
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Las respuestas de Aura serán en {selectedLanguage.name}
          </p>
        </div>
      </div>
    </div>
  );
}