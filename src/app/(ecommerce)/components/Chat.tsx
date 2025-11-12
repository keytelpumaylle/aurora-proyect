"use client";

import { indication } from "@/api/Chat";
import { GetUsers, CreateUser } from "@/api/Users";
import { CreateTreatment, CreateTreatmentData } from "@/api/Medication";
import type { Product } from "@/api/Products";
import { getProducts } from "@/api/Products";
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
import WelcomeForm from "./WelcomeForm";
import NameModal from "./NameModal";
import Image from "next/image";


const STORAGE_EVENT = "chatResultsUpdated";

const LOADING_MESSAGES = [
  "Analizando tus síntomas...",
  "Consultando con SIRIA...",
  "Buscando productos disponibles...",
  "Procesando recomendaciones médicas...",
  "Generando diagnóstico personalizado...",
  "Preparando tu receta digital...",
  "Guardando tu historial médico...",
];

export default function ChatInterface() {
  const router = useRouter();
  const { userData, isFormCompleted, checkFormCompleted, editUserData, updateUserName } = useModalChat();
  const { openModal: openLanguageModal, selectedLanguage } = useLanguageStore();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageMode, setIsImageMode] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [textLoading, setTextLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    sessionStorage.setItem("userSymptoms", e.target.value);
  };

  // Tipos para la respuesta de la IA (Gemini)
  interface GeminiMedication {
    id?: string;
    name?: string;
    description?: string;
    indication?: string;
    contraindication?: string;
    dose?: string;
    duration?: string;
    price?: number;
    imageUrl?: string;
    reason?: string;
    disponible_en_tienda?: boolean;
    equivalentes_comerciales?: string[];
  }

  interface GeminiResult {
    diagnostico_preliminar?: string;
    precision_diagnostico?: string;
    respuesta_gemini?: string;
    medicamentos?: GeminiMedication[];
    requiere_atencion_medica?: boolean;
    [key: string]: unknown;
  }

  const saveTreatmentToBackend = async (geminiResult: GeminiResult, formData: FormData) => {
    // ⚠️ CRÍTICO: Leer userData DIRECTAMENTE del store de Zustand
    // No usar el valor del closure que podría estar desactualizado
    const currentUserData = useModalChat.getState().userData;


    // Validar userData
    if (!currentUserData) {

      // Intentar recuperar de sessionStorage como fallback
      if (typeof window !== 'undefined') {
        const sessionUserData = sessionStorage.getItem('userData');
        console.log('🔍 userData en sessionStorage:', sessionUserData);
        const localStorageData = localStorage.getItem('user-data-storage');
        console.log('🔍 user-data-storage en localStorage:', localStorageData);
      }
      console.error('❌ No se puede guardar el tratamiento sin datos del usuario');
      return;
    }

    // Validar campos específicos CRÍTICOS
    if (!currentUserData.dni || !currentUserData.name || currentUserData.name.trim() === '') {
      console.error('❌❌❌ FALTAN CAMPOS REQUERIDOS EN USERDATA ❌❌❌');
      console.error('❌ dni:', `"${currentUserData.dni}"`, 'tipo:', typeof currentUserData.dni, 'vacío:', !currentUserData.dni);
      console.error('❌ name:', `"${currentUserData.name}"`, 'tipo:', typeof currentUserData.name, 'vacío:', !currentUserData.name || currentUserData.name.trim() === '');
      console.error('❌ currentUserData completo:', JSON.stringify(currentUserData, null, 2));

      // Mostrar estado completo del store
      if (typeof window !== 'undefined') {
        const localStorageData = localStorage.getItem('user-data-storage');
        console.log('🔍 Estado completo del store:', localStorageData);
      }
      return;
    }

    console.log('✅ UserData disponible:', {
      dni: currentUserData.dni,
      name: currentUserData.name,
      edad: currentUserData.edad,
      peso: currentUserData.peso,
      talla: currentUserData.talla,
      genero: currentUserData.genero
    });

    // Validar geminiResult
    if (!geminiResult) {
      console.error('❌❌❌ NO HAY GEMINI RESULT ❌❌❌');
      return;
    }

    console.log('✅ GeminiResult disponible:', {
      tiene_respuesta: !!geminiResult.respuesta_gemini,
      tiene_diagnostico: !!geminiResult.diagnostico_preliminar,
      tiene_medicamentos: !!geminiResult.medicamentos,
      num_medicamentos: geminiResult.medicamentos?.length || 0
    });

    try {
      console.log('📊 Datos completos recibidos:');
      console.log('📊 - geminiResult keys:', Object.keys(geminiResult));
      console.log('📊 - formData entries:', Array.from(formData.entries()));

      // Extraer descripción (los síntomas que escribió el usuario)
      const description = formData.get("indication")?.toString() || formData.get("symptoms")?.toString() || "";
      console.log('📝 Description extraída:', description);

      // Extraer indicación (diagnóstico preliminar resumido)
      let indication = "";
      if (geminiResult.diagnostico_preliminar) {
        indication = `Diagnóstico preliminar: ${geminiResult.diagnostico_preliminar}`;
        if (geminiResult.precision_diagnostico) {
          indication += ` (Precisión: ${geminiResult.precision_diagnostico})`;
        }
      } else {
        // Fallback: extraer primera parte de la respuesta de Gemini
        const firstParagraph = geminiResult.respuesta_gemini?.split('\n\n')[0] || geminiResult.respuesta_gemini || "";
        indication = firstParagraph.substring(0, 300);
      }
      console.log('💊 Indication extraída:', indication);

      // Extraer contraindicaciones
      let contraindication = "";
      if (geminiResult.medicamentos && geminiResult.medicamentos.length > 0) {
        const contraindicaciones = (geminiResult.medicamentos || [])
          .map((med: GeminiMedication) => med.contraindication)
          .filter((c): c is string => typeof c === "string" && c.trim() !== "")
          .join(". ");
        contraindication = contraindicaciones || "Consultar con un médico antes de usar si tiene condiciones preexistentes.";
      } else if (geminiResult.requiere_atencion_medica) {
        contraindication = "Requiere atención médica profesional. Consultar con un médico.";
      } else {
        contraindication = "Consultar con un médico antes de usar si tiene condiciones preexistentes.";
      }
      console.log('⚠️ Contraindication extraída:', contraindication);

      // OBTENER PRODUCTOS REALES DE LA BASE DE DATOS
      console.log('🔍 Buscando productos reales en la base de datos...');
  const dbProducts: Product[] = await getProducts();
      console.log(`📦 Productos en BD: ${dbProducts.length}`);

      // Mapear productos de Gemini a productos reales de la BD
      const products: Array<{ product_id: string; dose: string }> = [];

  if (geminiResult.medicamentos && Array.isArray(geminiResult.medicamentos)) {
        console.log(`📋 Total de medicamentos a buscar: ${geminiResult.medicamentos.length}`);

  for (const geminiMed of geminiResult.medicamentos as GeminiMedication[]) {
          console.log(`🔎 Buscando en BD: "${geminiMed.name}"`);

          // Normalizar nombre del medicamento de Gemini
          const geminiNameNormalized = (geminiMed.name?.toLowerCase() || '')
            .replace(/\s+/g, ' ')
            .trim();

          // Extraer palabras clave del nombre (ej: "Ibuprofeno 400mg" -> ["ibuprofeno", "400mg"])
            const keywords = geminiNameNormalized.split(' ').filter((k: string) => k.length > 2);

          console.log(`🔑 Keywords: ${keywords.join(', ')}`);

          // Buscar producto por nombre (case insensitive y parcial)
            const foundProduct = dbProducts.find((dbProd: Product) => {
            const dbName = (dbProd.name?.toLowerCase() || '').replace(/\s+/g, ' ').trim();
            const dbDesc = (dbProd.description?.toLowerCase() || '').replace(/\s+/g, ' ').trim();

            // Estrategia 1: Coincidencia exacta
            if (dbName === geminiNameNormalized) {
              console.log(`✅ [EXACTA] Encontrado: ${dbProd.name}`);
              return true;
            }

            // Estrategia 2: El nombre de BD contiene el nombre de Gemini
            if (dbName.includes(geminiNameNormalized)) {
              console.log(`✅ [CONTIENE] Encontrado: ${dbProd.name}`);
              return true;
            }

            // Estrategia 3: El nombre de Gemini contiene el nombre de BD
            if (geminiNameNormalized.includes(dbName)) {
              console.log(`✅ [ES CONTENIDO] Encontrado: ${dbProd.name}`);
              return true;
            }

            // Estrategia 4: Buscar por palabras clave principales
            const hasKeywordMatch = keywords.some((keyword: string) =>
              dbName.includes(keyword) || dbDesc.includes(keyword)
            );
            if (hasKeywordMatch) {
              console.log(`✅ [KEYWORD] Encontrado: ${dbProd.name}`);
              return true;
            }

            return false;
          });

            if (foundProduct) {
            console.log(`✅ Producto encontrado en BD: ${foundProduct.name} (ID: ${foundProduct.id})`);
            products.push({
              product_id: foundProduct.id,
              dose: geminiMed.dose || "Según indicación médica"
            });
          } else {
            console.warn(`⚠️ Producto NO encontrado en BD: "${geminiMed.name}"`);
            console.log(`💡 Nombres de productos disponibles en BD:`, dbProducts.slice(0, 10).map(p => p.name));
          }
        }
      }

      console.log(`💊 Products finales (${products.length}/${geminiResult.medicamentos?.length || 0}):`, products);

      // IMPORTANTE: SIEMPRE intentar guardar el tratamiento, incluso sin productos
      // El historial médico es valioso aunque no tenga productos asociados
      if (products.length === 0) {
        console.warn('⚠️ No se encontraron productos en la BD');
        if (!geminiResult.requiere_atencion_medica) {
          console.warn('⚠️ Se guardará el tratamiento SIN productos asociados');
        } else {
          console.warn('⚠️ Caso de atención médica: se guardará sin productos');
        }
      }

      // Validar y convertir DNI a número
      const dniNumber = parseInt(currentUserData.dni);
      if (isNaN(dniNumber) || dniNumber === 0) {
        console.error('❌ DNI inválido:', currentUserData.dni, '-> parseInt:', dniNumber);
        return;
      }

      // Validar nombre
      if (!currentUserData.name || currentUserData.name.trim() === '') {
        console.error('❌ Nombre vacío o inválido:', currentUserData.name);
        return;
      }

      console.log('✅ Validación exitosa - DNI:', dniNumber, 'Nombre:', currentUserData.name);

      // Construir datos del tratamiento siguiendo el formato exacto del backend (ver curl de ejemplo)
      const treatmentData: CreateTreatmentData = {
        dni: dniNumber,  // ⚠️ CRÍTICO: Backend espera NUMBER, no string
        name: currentUserData.name.trim(),
        description: description,
        indication: indication,
        contraindication: contraindication,
        // ⚠️ CRÍTICO: Backend espera STRING SIMPLE, NO JSON stringificado
        gemini_response: geminiResult.respuesta_gemini || "",
        products: products
      };

      console.log('📦 TreatmentData final:', JSON.stringify(treatmentData, null, 2));

      // Mostrar resumen del payload
      console.log('📋 RESUMEN DEL TRATAMIENTO:');
      console.log(`   👤 Paciente: ${treatmentData.name} (DNI: ${treatmentData.dni})`);
      console.log(`   📝 Síntomas: ${treatmentData.description.substring(0, 50)}...`);
      console.log(`   💊 Diagnóstico: ${treatmentData.indication.substring(0, 80)}...`);
      console.log(`   ⚠️  Contraindicaciones: ${treatmentData.contraindication.substring(0, 50)}...`);
      console.log(`   💊 Productos: ${treatmentData.products.length}`);
      console.log(`   📄 Gemini Response Length: ${treatmentData.gemini_response.length} caracteres`);

      // Enviar al backend - SIEMPRE intentar guardar
      console.log('🚀 Enviando tratamiento al backend...');
      console.log('📡 URL del backend:', process.env.NEXT_PUBLIC_BACK_URL || process.env.BACK_URL);

      try {
        const response = await CreateTreatment(treatmentData);
        console.log('📥 Respuesta del backend:', response);

        if (response.meta.status) {
          console.log('✅✅✅ TRATAMIENTO GUARDADO EXITOSAMENTE ✅✅✅');
          console.log('📋 ID del tratamiento:', response.treatments?.[0]?.id || 'No disponible');
        } else {
          console.error('❌❌❌ ERROR AL GUARDAR TRATAMIENTO ❌❌❌');
          console.error('❌ Mensaje de error:', response.meta.message);
          console.error('❌ Response completo:', JSON.stringify(response, null, 2));
        }
      } catch (saveError) {
        console.error('ERROR CRÍTICO AL GUARDAR TRATAMIENTO 💥💥💥');
        console.error('💥 Error:', saveError);
        console.error('💥 Stack:', saveError instanceof Error ? saveError.stack : 'No stack trace');
        // NO lanzar el error para no interrumpir el flujo del usuario
      }
    } catch (error) {
      console.error('💥 Error general al guardar tratamiento:', error);
      console.error('💥 Stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
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

  const result = (await response.json()) as GeminiResult;

      // Simular el mismo comportamiento que el useActionState
      const chatResultsWithImage = {
        ...(result as Record<string, unknown>),
        imageData: imagePreview,
      };

      sessionStorage.setItem("chatResults", JSON.stringify(chatResultsWithImage));
      window.dispatchEvent(
        new CustomEvent(STORAGE_EVENT, {
          detail: chatResultsWithImage,
        })
      );

      // Guardar tratamiento en el backend ANTES de redirigir
      if (userData) {
        console.log('🔄 Guardando tratamiento (imagen) antes de redirigir...');
        await saveTreatmentToBackend(result, formData);
        console.log('✅ Guardado completado (imagen), redirigiendo...');
      } else {
        console.warn('⚠️ No hay userData, se omitirá el guardado');
      }

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
        // Guardar resultado en sessionStorage
        sessionStorage.setItem("chatResults", JSON.stringify(result));
        window.dispatchEvent(
          new CustomEvent(STORAGE_EVENT, {
            detail: result,
          })
        );

        // Guardar tratamiento en el backend ANTES de redirigir
        if (userData) {
          console.log('🔄 Guardando tratamiento antes de redirigir...');
          await saveTreatmentToBackend(result, formData);
          console.log('✅ Guardado completado, redirigiendo...');
        } else {
          console.warn('⚠️ No hay userData, se omitirá el guardado');
        }

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

  const handleNameConfirm = async (confirmedName: string) => {
    if (!userData || !pendingFormData) return;

    try {
      // Crear usuario en el backend
      const createResult = await CreateUser(userData.dni, confirmedName);

      if (createResult.meta.status) {
        // Usuario creado exitosamente - actualizar el nombre en el store
        updateUserName(confirmedName);

        // Cerrar modal
        setIsNameModalOpen(false);

        // Procesar la consulta que estaba pendiente
        if (isImageMode && selectedImage) {
          await handleImageAnalysis(pendingFormData);
        } else {
          await handleTextSubmit(pendingFormData);
        }

        setPendingFormData(null);
      } else {
        alert('Error al crear usuario: ' + createResult.meta.message);
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('Error al crear usuario. Por favor, intenta de nuevo.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData) return;

    const formData = new FormData(e.currentTarget);
    formData.append('language', selectedLanguage.code);

    try {
      // Verificar si el usuario existe antes de proceder
      const userCheck = await GetUsers(userData.dni);

      if (userCheck.meta.status && userCheck.user) {
        // Usuario existe en el backend - guardar el nombre obtenido
        updateUserName(userCheck.user.name);

        // Proceder con la consulta normalmente
        if (isImageMode && selectedImage) {
          formData.append('image', selectedImage);
          handleImageAnalysis(formData);
        } else if (!isImageMode) {
          handleTextSubmit(formData);
        }
      } else {
        // Usuario NO existe - mostrar modal para ingresar nombre
        setPendingFormData(formData);
        setIsNameModalOpen(true);
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      // En caso de error de conexión, mostrar el modal igualmente
      setPendingFormData(formData);
      setIsNameModalOpen(true);
    }
  };

  // Efecto para rotar mensajes de carga
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (textLoading || imageLoading) {
      setLoadingMessageIndex(0); // Resetear al iniciar
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000); // Cambiar mensaje cada 2 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [textLoading, imageLoading]);

  useEffect(() => {
    if (typeof window !== "undefined" && userData) {
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  // Cargar datos del localStorage al inicio si existen
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = sessionStorage.getItem("userData");
      if (storedUserData && !userData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          if (parsedData && parsedData.edad && parsedData.peso && parsedData.talla && parsedData.genero) {
            // No usar setUserData aquí para evitar sobrescribir el store persistido
            // El store de Zustand con persist ya maneja la carga automáticamente
          }
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
        }
      }
    }
  }, [userData]);



  // Si el formulario no está completado, mostrar solo el WelcomeForm
  if (!isFormCompleted || !checkFormCompleted()) {
    return (
      <div className="lg:h-full flex flex-col h-screen">
        <WelcomeForm />
      </div>
    );
  }

  return (
      <div className="lg:h-full flex flex-col animate-fadeIn">
        {/* Desktop: Panel lateral futurista */}
        <div className="hidden lg:flex lg:flex-col h-full bg-gradient-to-br from-primary/5 via-white to-secondary/5 backdrop-blur-xl rounded-2xl border border-primary/10 overflow-hidden animate-slideInRight">
          

          {/* Indicador de carga */}
          {(textLoading || imageLoading) && (
            <div className="bg-gradient-to-r from-primary to-secondary text-white py-3 px-4">
              <div className="flex items-center justify-center gap-2">
                <LoaderCircle size={18} className="animate-spin" />
                <span className="text-sm font-medium">
                  {LOADING_MESSAGES[loadingMessageIndex]}
                </span>
              </div>
            </div>
          )}

          {/* Preview de imagen */}
          {imagePreview && (
            <div className="p-4 border-b border-primary/10 bg-white/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-graydark">Imagen seleccionada:</span>
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-gray-500 hover:text-red transition-colors p-1 hover:bg-red/10 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="relative">
                <Image
                  src={imagePreview}
                  height={150}
                  width={150}
                  alt="Preview"
                  className="max-h-32 rounded-xl border border-primary/20 shadow-lg w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Área de formulario expandida */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col h-full gap-4">
              <input type="hidden" name="userData" value={JSON.stringify(userData)} />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />

              {/* Controles superiores */}
              <div className="flex gap-2">
                <Link
                  href={"/chat"}
                  className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-3 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 border border-primary/10 shadow-sm group"
                >
                  <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Diagnostico</span>
                </Link>

                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={textLoading || imageLoading}
                  className={`p-3 rounded-xl transition-all duration-300 border ${
                    textLoading || imageLoading
                      ? "bg-gray-200 cursor-not-allowed border-gray-300"
                      : isImageMode
                        ? "bg-gradient-to-r from-primary to-secondary text-white border-primary/20 shadow-lg"
                        : "bg-white/80 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-primary/10 shadow-sm"
                  }`}
                  title="Subir imagen de receta"
                >
                  <ImageIcon size={20} />
                </button>

                <button
                  type="button"
                  onClick={openLanguageModal}
                  disabled={textLoading || imageLoading}
                  className={`flex gap-1 items-center p-3 rounded-xl transition-all duration-300 border ${
                    textLoading || imageLoading
                      ? "bg-gray-200 cursor-not-allowed border-gray-300"
                      : "bg-white/80 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-primary/10 shadow-sm"
                  }`}
                  title={`Idioma: ${selectedLanguage.name}`}
                >
                  <Languages className="w-5 h-5" />
                  <span className="text-xs font-medium">{selectedLanguage.flag}</span>
                </button>

                <button
                  type="button"
                  onClick={editUserData}
                  disabled={textLoading || imageLoading}
                  className={`p-3 rounded-xl transition-all duration-300 border ${
                    textLoading || imageLoading
                      ? "bg-gray-200 cursor-not-allowed border-gray-300"
                      : "bg-white/80 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-primary/10 shadow-sm"
                  }`}
                  title="Editar información"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              {/* Input de texto principal */}
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
                <textarea
                  name={isImageMode ? "symptoms" : "indication"}
                  placeholder={
                    textLoading || imageLoading
                      ? "Procesando tu consulta..."
                      : isImageMode
                        ? "Describe tus síntomas o adjunta una imagen de tu receta..."
                        : "Cuéntame tus síntomas, estoy aquí para ayudarte..."
                  }
                  className="w-full h-full bg-white/80 backdrop-blur-sm border border-primary/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-gray-400 resize-none shadow-sm transition-all duration-300"
                  disabled={textLoading || imageLoading}
                  onChange={handleInputChange}
                  rows={8}
                />
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={(isImageMode && !selectedImage) || textLoading || imageLoading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                  (isImageMode && !selectedImage) || textLoading || imageLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {(textLoading || imageLoading) ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle size={20} className="animate-spin" />
                    {LOADING_MESSAGES[loadingMessageIndex]}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Consultar a SIRIA
                    <ArrowUp size={20} />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Mobile: Barra inferior */}
        <div className="lg:hidden px-2 py-2 bg-white border-t border-gray-300 flex justify-between items-center gap-2">
          {/* Indicador de carga mobile */}
          {(textLoading || imageLoading) && (
            <div className="absolute bottom-full left-0 right-0 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4">
              <div className="flex items-center justify-center gap-2">
                <LoaderCircle size={16} className="animate-spin" />
                <span className="text-sm font-medium">
                  {LOADING_MESSAGES[loadingMessageIndex]}
                </span>
              </div>
            </div>
          )}

          {/* Preview de imagen mobile */}
          {imagePreview && (
            <div className="absolute bottom-full left-0 right-0 p-4 bg-white border-t border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Imagen:</span>
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-gray-500 hover:text-red transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <Image
                src={imagePreview}
                height={150}
                width={150}
                alt="Preview"
                className="max-h-32 rounded-lg border border-gray-200"
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-1">
            <input type="hidden" name="userData" value={JSON.stringify(userData)} />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            <div className="relative bg-white border border-primary/20 rounded-xl shadow-lg group">
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
              </div>

              <div className="flex gap-2 items-center px-2">
                <Link
                  href={"/chat"}
                  className="bg-graylight rounded-full p-2 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all duration-300"
                >
                  <MessageCircle size={20} />
                </Link>

                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={textLoading || imageLoading}
                  className={`rounded-full p-2 transition-all duration-300 ${
                    textLoading || imageLoading
                      ? "bg-gray-300 cursor-not-allowed"
                      : isImageMode
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-graylight hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white"
                  }`}
                >
                  <ImageIcon size={20} />
                </button>

                <button
                  type="button"
                  onClick={openLanguageModal}
                  disabled={textLoading || imageLoading}
                  className={`flex gap-1 items-center p-2 rounded-full transition-all duration-200 ${
                    textLoading || imageLoading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-graylight hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white"
                  }`}
                >
                  <Languages className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={editUserData}
                  disabled={textLoading || imageLoading}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    textLoading || imageLoading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-graylight hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white"
                  }`}
                >
                  <Edit className="w-5 h-5" />
                </button>

                <input
                  name={isImageMode ? "symptoms" : "indication"}
                  placeholder={
                    textLoading || imageLoading
                      ? "Procesando..."
                      : isImageMode
                        ? "Describe síntomas..."
                        : "¿Qué síntomas tienes?..."
                  }
                  className="flex-1 bg-transparent border-0 focus:outline-none placeholder:text-zinc-500 py-5 text-sm group-hover:placeholder:text-primary/70 transition-colors duration-300"
                  disabled={textLoading || imageLoading}
                  onChange={handleInputChange}
                />

                {(textLoading || imageLoading) ? (
                  <button
                    type="submit"
                    disabled
                    className="rounded-full p-2 bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    <LoaderCircle size={20} className="animate-spin" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isImageMode && !selectedImage}
                    className="bg-gradient-to-r from-primary to-secondary rounded-full p-2 text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUp size={20} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Modales */}
        <LanguageModal />
        <NameModal
          isOpen={isNameModalOpen}
          dni={userData?.dni || ""}
          initialName={userData?.name || ""}
          onConfirm={handleNameConfirm}
          onCancel={() => {
            setIsNameModalOpen(false);
            setPendingFormData(null);
          }}
        />
      </div>
  );
}
