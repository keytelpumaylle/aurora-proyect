"use client";
import { useModalChat } from "@/store/ModalChat";
import { useChatResults } from "../hook/useChatResults";
import CardMedication from "./CardMedication";
import { useEffect, useState } from "react";
import { registrarConsulta } from "@/api/SubmitInfo";
import { Plus } from 'lucide-react';
import SymptomClassificationBadge from "./SymptomClassificationBadge";
import EditUserDataModal from "./EditUserDataModal";
import ReactMarkdown from 'react-markdown';

export default function IndicationInfo() {
  const {
    geminiResponse,
    medications,
    loading,
    dosis,
    sintomas,
    clasificacion,
    requiereAtencionMedica,
    urgencia,
    esRecetaMedica,
    medicamentosDetectados,
    diagnosticoPreliminar,
    precisionDiagnostico
  } = useChatResults();
  const { userData, clearUserData } = useModalChat();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Generar código dinámico para la receta
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const codigo = `0000${day}${month}${seconds}`;

  //Registro de datos de la consulta
  useEffect(() => {
    const chatResults = sessionStorage.getItem("chatResults");
    const userData = sessionStorage.getItem("userData");
    const userSymptoms = sessionStorage.getItem("userSymptoms");

    if (chatResults && userData && userSymptoms) {
      // Si necesitas objetos:
      const chatResultsObj = JSON.parse(chatResults);
      const userDataObj = JSON.parse(userData);

      // Llama a tu action aquí
      registrarConsulta({
        sintomas: userSymptoms,
        dosisRecomendada: chatResultsObj.dosis_recomendada,
        usuario: userDataObj,
      });
    }
  }, []);


  const handleNewConsultation = () => {
    clearUserData();
    sessionStorage.removeItem("chatResults");
    sessionStorage.removeItem("userSymptoms");
    sessionStorage.removeItem("userData");
    window.location.reload();
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-gradient-to-br from-graylight/50 via-white to-secondary/5">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-graydark font-medium">Analizando con SIRIA...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 h-auto lg:h-full gap-6 overflow-hidden">

            {/* Sección Gemini - Scroll independiente */}
            <div className="col-span-12 lg:col-span-9 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 pr-0 lg:pr-4 scrollbar-thumb-rounded-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 animate-fadeInUp">
                  <div>
                    <h2 className="text-3xl font-bold text-dark mb-2">
                      {esRecetaMedica ? "Análisis de Receta Médica" : "Recomendaciones Médicas"}
                    </h2>
                    <p className="text-sm text-graydark/60">Generado por SIRIA - IA médica</p>
                  </div>
                  <button
                    onClick={handleNewConsultation}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-4 py-3 font-semibold hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                  >
                    <Plus size={20} strokeWidth={2}/>
                    Nueva Consulta
                  </button>
                </div>
                

                {/* Alerta especial para recetas médicas */}
                {esRecetaMedica && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-5 mb-6 shadow-lg animate-fadeInUp">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg font-bold">℞</span>
                      </div>
                      <h3 className="text-lg font-bold text-blue-800">Receta Médica Detectada</h3>
                    </div>
                    <p className="text-sm text-blue-700 leading-relaxed mb-3">
                      He identificado que subiste una receta médica. A continuación encontrarás los medicamentos prescritos.
                      {medicamentosDetectados.length > 0 && (
                        <span className="block mt-3 p-3 bg-white/60 rounded-xl font-medium">
                          📋 Medicamentos: <span className="text-blue-900">{medicamentosDetectados.join(", ")}</span>
                        </span>
                      )}
                    </p>
                    <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-xl">
                      <p className="text-xs text-yellow-800 flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        <span>
                          <strong>Importante:</strong> Esta información es solo para fines informativos.
                          Sigue siempre las indicaciones exactas de tu médico y consulta cualquier duda con él.
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Diagnóstico Preliminar */}
                {diagnosticoPreliminar && precisionDiagnostico && (
                  <div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 rounded-2xl p-6 mb-6 border-2 border-primary/20 shadow-lg animate-fadeInUp">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shadow-lg">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-1">Diagnóstico Preliminar</h3>
                        <p className="text-2xl font-bold text-graydark">{diagnosticoPreliminar}</p>
                      </div>
                      <div className="text-center bg-white rounded-xl px-4 py-3 shadow-md border border-primary/20">
                        <p className="text-xs text-graydark/60 mb-1">Precisión</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {precisionDiagnostico}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4 border border-primary/10">
                      <p className="text-xs text-graydark/70 flex items-start gap-2">
                        <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                        </svg>
                        <span>
                          Este diagnóstico es preliminar y se basa en los síntomas reportados. Para un diagnóstico definitivo, consulta con un profesional de la salud.
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Tarjeta de síntomas */}
                <div className="bg-white rounded-2xl p-5 mb-6 animate-fadeInUp">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-graydark/60 mb-2">CONSULTA</h3>
                      <p className="text-lg lg:text-xl font-semibold text-graydark leading-relaxed">{sintomas}</p>
                    </div>
                    <SymptomClassificationBadge
                      classification={clasificacion}
                      urgencia={urgencia}
                      requiereAtencionMedica={requiereAtencionMedica}
                    />
                  </div>

                  <div className="">
                    <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                      </svg>
                      Análisis de SIRIA
                    </h4>
                    <div className="prose prose-sm max-w-none text-graydark/80 leading-relaxed [&>p]:mb-3 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mb-2 [&>strong]:font-bold [&>strong]:text-graydark [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-3 [&>li]:mb-1">
                      <ReactMarkdown>{geminiResponse}</ReactMarkdown>
                    </div>
                  </div>
                </div>

                {/* Receta Digital Moderna */}
                <article className="bg-white rounded-2xl border-2 border-primary/20 shadow-xl overflow-hidden mb-6 animate-fadeInUp">
                  {/* Header de la receta */}
                  <header className="bg-gradient-to-r from-primary to-secondary p-5 text-white">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {esRecetaMedica ? "Análisis de Receta Digital" : "Receta Digital"}
                        </h3>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <p className="text-xs text-white/80">Nº Receta</p>
                        <p className="font-mono font-bold">{codigo}</p>
                      </div>
                    </div>
                  </header>

                  {/* Información del sistema */}
                  <div className="bg-gradient-to-br from-graylight/30 to-white p-5 border-b border-gray/20">
                    <div className="grid md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-bold text-primary">SIRIA – Asistente Virtual</p>
                        <p className="text-graydark/70">Sistema Inteligente de Apoyo Médico</p>
                      </div>
                      <div>
                        <p className="font-bold text-primary">Universidad Nacional Micaela Bastidas</p>
                        <p className="text-graydark/70">Escuela de Ingeniería Informática y Sistemas</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray/20">
                      <p className="text-xs text-graydark/60">
                        📅 Fecha de emisión: <span className="font-semibold text-graydark">{new Date().toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  {/* Datos del paciente */}
                  <div className="p-5 border-b border-gray/20">
                    <h4 className="text-sm font-bold text-graydark mb-3">DATOS DEL PACIENTE</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-graylight/50 rounded-xl p-3">
                        <p className="text-xs text-graydark/60">Paciente</p>
                        <p className="font-semibold text-graydark">{userData?.name}</p>
                      </div>
                      <div className="bg-graylight/50 rounded-xl p-3">
                        <p className="text-xs text-graydark/60">Edad</p>
                        <p className="font-semibold text-graydark">{userData?.edad} años</p>
                      </div>
                      <div className="bg-graylight/50 rounded-xl p-3">
                        <p className="text-xs text-graydark/60">Peso</p>
                        <p className="font-semibold text-graydark">{userData?.peso} kg</p>
                      </div>
                      <div className="bg-graylight/50 rounded-xl p-3">
                        <p className="text-xs text-graydark/60">Talla</p>
                        <p className="font-semibold text-graydark">{userData?.talla} cm</p>
                      </div>
                    </div>
                  </div>

                  {/* Tratamiento */}
                  <main className="p-5">
                    <h4 className="text-sm font-bold text-graydark mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"/>
                      </svg>
                      TRATAMIENTO RECOMENDADO
                    </h4>
                    <div className="space-y-3">
                      {dosis && Array.isArray(dosis) ? dosis.map((d, idx) => (
                        <div key={d?.medicamento || Math.random()} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/10">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-bold text-graydark mb-2">
                                {d?.medicamento || "Medicamento no especificado"}
                              </h5>
                              <div className="space-y-1 text-sm text-graydark/70">
                                <p className="flex items-center gap-2">
                                  <span className="font-semibold text-primary">💊 Dosis:</span>
                                  {d?.dosis || "No especificada"}
                                </p>
                                <p className="flex items-center gap-2">
                                  <span className="font-semibold text-primary">⏱️ Duración:</span>
                                  {d?.duracion || "No especificada"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <p className="text-graydark/60 text-center py-4">No hay dosis especificadas</p>
                      )}
                    </div>
                  </main>

                  {/* Footer con disclaimer */}
                  <footer className="bg-gradient-to-r from-graylight/50 to-gray/20 p-4 border-t border-gray/20">
                    <p className="text-xs text-graydark/60 text-center">
                      ⚠️ Esta receta digital es generada por IA con fines informativos. Siempre consulte con un profesional médico.
                    </p>
                  </footer>
                </article>
              </div>
            </div>

            {/* Sección Medicamentos - Scroll independiente */}
            <div className="col-span-12 lg:col-span-3 flex flex-col overflow-hidden">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-4 mb-4 animate-fadeInUp">
                <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"/>
                  </svg>
                  Medicamentos Recomendados
                </h3>
                <p className="text-xs text-graydark/60">{medications?.length || 0} medicamentos encontrados</p>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 pr-0 lg:pr-2 scrollbar-thumb-rounded-full">
                <div className="grid grid-cols-1 gap-3 pb-4">
                  {medications && Array.isArray(medications) && medications.length > 0 ? medications.map((med) => (
                    <CardMedication
                      key={med?.id || Math.random()}
                      id={med?.id || 0}
                      name={med?.name || ""}
                      description={med?.description || ""}
                      indication={med?.indication || ""}
                      contraindication={med?.contraindication || ""}
                      dose={med?.dose || ""}
                      price={med?.price || 0}
                      imageUrl={med?.imageUrl || ""}
                    />
                  )) : (
                    <div className="text-center bg-white rounded-2xl border border-gray/20 p-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary/40" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                        </svg>
                      </div>
                      <p className="text-graydark/60 font-medium">No hay medicamentos disponibles</p>
                      <p className="text-xs text-graydark/40 mt-2">Realiza una consulta para obtener recomendaciones</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Modal para editar datos del usuario */}
      <EditUserDataModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
