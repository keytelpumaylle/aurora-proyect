"use client";

import { indication } from "@/api/Chat";
import {
  ArrowUp,
  LoaderCircle,
  MessageCircle,
  Languages,
  ImageIcon,
  X,
  Edit,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useModalChat } from "@/store/ModalChat";
import { useLanguageStore } from "@/store/LanguageStore";
import LanguageModal from "./LanguageModal";
import EditUserDataModal from "./EditUserDataModal";
import Image from "next/image";


const STORAGE_EVENT = "chatResultsUpdated";

export default function ChatInterface() {
  const router = useRouter();
  const {userData} = useModalChat();
  const { openModal: openLanguageModal, selectedLanguage } = useLanguageStore();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageMode, setIsImageMode] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [textLoading, setTextLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    sessionStorage.setItem("userSymptoms", e.target.value);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("La imagen es demasiado grande. Por favor, selecciona una imagen menor a 10MB.");
        return;
      }
      
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setIsImageMode(true);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setIsImageMode(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageAnalysis = async (formData: FormData) => {
    try {
      setImageLoading(true);
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error en el análisis de imagen');
      }
      
      const result = await response.json();
      
      // Simular el mismo comportamiento que el useActionState
      const chatResultsWithImage = {
        ...result,
        imageData: imagePreview
      };
      
      sessionStorage.setItem("chatResults", JSON.stringify(chatResultsWithImage));
      window.dispatchEvent(
        new CustomEvent(STORAGE_EVENT, {
          detail: chatResultsWithImage,
        })
      );
      
      router.push("/chat");
    } catch (error) {
      console.error('Error:', error);
      alert('Error al analizar la imagen. Por favor, intenta de nuevo.');
    } finally {
      setImageLoading(false);
    }
  };

  const handleTextSubmit = async (formData: FormData) => {
    try {
      setTextLoading(true);
      const result = await indication({}, formData);
      
      if (result && !('error' in result)) {
        sessionStorage.setItem("chatResults", JSON.stringify(result));
        window.dispatchEvent(
          new CustomEvent(STORAGE_EVENT, {
            detail: result,
          })
        );
        router.push("/chat");
      } else {
        console.error('Error in text analysis:', result);
        alert('Error al procesar tu consulta. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar tu consulta. Por favor, intenta de nuevo.');
    } finally {
      setTextLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    formData.append('language', selectedLanguage.code);
    
    if (isImageMode && selectedImage) {
      formData.append('image', selectedImage);
      handleImageAnalysis(formData);
    } else if (!isImageMode) {
      handleTextSubmit(formData);
    }
  };

   useEffect(() => {
    if (typeof window !== "undefined" && userData) {
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);



  return (
      <div className="px-2 md:px-[100px] py-2 md:py-4 bg-white border-t-1 border-gray-300 flex justify-between items-center gap-8 fixed bottom-0 w-full z-50">
      
      {/* Indicador de carga global */}
      {(textLoading || imageLoading) && (
        <div className="absolute bottom-full left-0 right-0 bg-gradient-to-r from-[#885BDA] to-[#66D6D7] text-white py-2 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
            <LoaderCircle size={16} className="animate-spin" />
            <span className="text-sm font-medium">
              {imageLoading ? "Analizando imagen y síntomas..." : "Procesando tu consulta..."}
            </span>
          </div>
        </div>
      )}
      
      {/* Preview de imagen */}
      {imagePreview && (
        <div className="absolute bottom-full left-0 right-0 p-4 bg-white border-t border-gray-300">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Imagen seleccionada:</span>
              <button
                type="button"
                onClick={clearImage}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative">
              <Image
                src={imagePreview}
                height={150}
                width={150}
                alt="Preview"
                className="max-h-32 rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1">
        <input type="hidden" name="userData" value={JSON.stringify(userData)} />
        
        {/* Input file oculto para selección */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        {/* Contenedor principal con efecto de sombra degradada */}
        <div className="relative bg-white border border-gray-300 rounded-xl shadow-lg group">
          {/* Sombra degradada con desenfoque */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8C44C2] to-[#07050A] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          </div>

          <div className="flex gap-2 md:gap-2 items-center px-1 md:px-4">
            <Link
              href={"/chat"}
              type="button"
              className="bg-graylight rounded-full p-2 md:p-3 hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7] hover:text-white transition-all duration-300"
            >
              <MessageCircle size={21} />
            </Link>

            {/* Botón de imagen */}
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={textLoading || imageLoading}
              className={`rounded-full p-2 md:p-3 transition-all duration-300 ${
                textLoading || imageLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : isImageMode 
                    ? "bg-gradient-to-r from-[#885BDA] to-[#66D6D7] text-white" 
                    : "bg-graylight hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7] hover:text-white"
              }`}
            >
              <ImageIcon size={21} />
            </button>

            {/* Botón de idiomas */}
            <button
              type="button"
              onClick={openLanguageModal}
              disabled={textLoading || imageLoading}
              className={`flex gap-1 items-center p-3 rounded-full transition-all duration-200 ${
                textLoading || imageLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-graylight cursor-pointer hover:bg-gray-200 hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7] hover:text-white"
              }`}
              title={textLoading || imageLoading ? "Procesando consulta..." : `Idioma actual: ${selectedLanguage.name}`}
            >
              <Languages className="w-5 h-5" />
              <span className="text-xs font-medium hidden sm:block">{selectedLanguage.flag}</span>
            </button>

            {/* Botón de editar información */}
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              disabled={textLoading || imageLoading}
              className={`p-3 rounded-full transition-all duration-200 ${
                textLoading || imageLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-graylight cursor-pointer hover:bg-gray-200 hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7] hover:text-white"
              }`}
              title={textLoading || imageLoading ? "Procesando consulta..." : "Editar información personal"}
            >
              <Edit className="w-5 h-5" />
            </button>

            <input
              name={isImageMode ? "symptoms" : "indication"}
              placeholder={
                textLoading || imageLoading 
                  ? "Procesando tu consulta..." 
                  : isImageMode 
                    ? "Sube tu receta médica o imagen de síntomas. Describe brevemente..." 
                    : "Cuéntame. ¿Qué síntomas tienes?..."
              }
              className="flex-1 bg-transparent border-0 focus:outline-none placeholder:text-zinc-500 py-6 group-hover:placeholder:text-[#885BDA]/70 transition-colors duration-300"
              disabled={textLoading || imageLoading}
              onChange={handleInputChange}
            />

            {(textLoading || imageLoading) ? (
              <button
                type="submit"
                disabled={textLoading || imageLoading}
                className={`rounded-full p-2 md:p-3 bg-gradient-to-r from-[#8C44C2] to-[#07050A] text-white transition-all duration-300 disabled:cursor-not-allowed`}
              >
                <LoaderCircle size={20} className="animate-spin text-dark" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isImageMode && !selectedImage}
                className={`bg-gray-200 rounded-full p-2 md:p-3 hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ArrowUp size={20} />
              </button>
            )}
          </div>
        </div>
      </form>
      
      {/* Modal de idiomas */}
      <LanguageModal />
      
      {/* Modal para editar datos del usuario */}
      <EditUserDataModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
