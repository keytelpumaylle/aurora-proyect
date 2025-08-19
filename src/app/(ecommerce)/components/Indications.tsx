"use client";
import { useModalChat } from "@/store/ModalChat";
import { useChatResults } from "../hook/useChatResults"; // Ajusta la ruta según tu estructura
import CardMedication from "./CardMedication";
import { useEffect, useState } from "react";
import { registrarConsulta } from "@/api/SubmitInfo";
import { Plus, Edit } from 'lucide-react';
import CalificationButton from "@/app/(Chat)/components/CalificationButton";
import { useCalificationModal } from "@/store/Calification";
import SymptomClassificationBadge from "./SymptomClassificationBadge";
import EditUserDataModal from "./EditUserDataModal";
import { useMedicationAvailability } from "../hook/useMedicationAvailability";

interface MedicationWithAvailabilityProps {
  medication: {
    id?: number;
    name?: string;
    description?: string;
    indication?: string;
    contraindication?: string;
    dose?: string;
    price?: number;
    imageUrl?: string;
  };
}

function MedicationWithAvailability({ medication }: MedicationWithAvailabilityProps) {
  const { isAvailable, storePrice, equivalentName } = useMedicationAvailability(medication.name || "");

  if (!medication.name) {
    return null;
  }

  return (
    <div className="space-y-2">
      <CardMedication
        id={medication.id || 0}
        name={medication.name}
        description={medication.description || ""}
        indication={medication.indication || ""}
        contraindication={medication.contraindication || ""}
        dose={medication.dose || ""}
        price={medication.price || 0}
        imageUrl={medication.imageUrl || ""}
      />
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 ml-2 mr-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Disponibilidad en Aura:</span>
          {isAvailable ? (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Disponible
              </span>
              {storePrice && (
                <span className="text-xs text-gray-600">S/. {storePrice.toFixed(2)}</span>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              No disponible en Aura
            </span>
          )}
        </div>
        {isAvailable && equivalentName && equivalentName !== medication.name && (
          <p className="text-xs text-gray-500 mt-1">
            Disponible como: {equivalentName}
          </p>
        )}
      </div>
    </div>
  );
}

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
    medicamentosDetectados
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


  const { responseFalse,response, open } = useCalificationModal();

  const handleNewConsultation = () => {
    if(!response){
      console.log("Te falta responder la encuesta")
      responseFalse();
      open();
      return;
    }

    clearUserData();
    sessionStorage.removeItem("chatResults");
    sessionStorage.removeItem("userSymptoms");
    sessionStorage.removeItem("userData");
    window.location.reload();
  }

  return (
    <div className=" px-4 sm:px-6 lg:px-8 py-6">
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 h-auto lg:h-full gap-4 overflow-hidden">

            {/* Sección Gemini - Scroll independiente */}
            <div className="col-span-12 lg:col-span-9 h-[600px] flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-graylight pr-0 lg:pr-4 scrollbar-thumb-rounded-full">
                <div className="md:flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 shrink-0">
                    {esRecetaMedica ? "Análisis de Receta Médica" : "Recomendaciones Médicas"}
                  </h2>
                  <button onClick={handleNewConsultation} className="flex items-center gap-2 bg-graylight rounded-lg p-2 text-sm hover:cursor-pointer hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7] hover:text-white">
                    <Plus size={18} strokeWidth={1.5}/>Nueva Consulta
                  </button>
                </div>
                <div className="border-gray bg-graylight border-1 rounded-lg w-full lg:py-3 py-2 px-3 lg:px-6 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="">
                      Nos basamos en la información proporcionada inicialmente:
                      Edad: {userData?.edad}, Peso: {userData?.peso}, Talla:{" "}
                      {userData?.talla}, Género: {userData?.genero}
                    </p>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-white rounded-lg hover:bg-gray-50 border border-gray-300 transition-colors"
                      title="Editar información personal"
                    >
                      <Edit size={12} />
                      Editar
                    </button>
                  </div>
                </div>
                
                {/* Alerta especial para recetas médicas */}
                {esRecetaMedica && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">℞</span>
                      </div>
                      <h3 className="font-semibold text-blue-800">Receta Médica Detectada</h3>
                    </div>
                    <p className="text-sm text-blue-700">
                      He identificado que subiste una receta médica. A continuación encontrarás los medicamentos prescritos.
                      {medicamentosDetectados.length > 0 && (
                        <span className="block mt-2 font-medium">
                          Medicamentos detectados: {medicamentosDetectados.join(", ")}
                        </span>
                      )}
                    </p>
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-yellow-700">
                        <strong>Importante:</strong> Esta información es solo para fines informativos. 
                        Sigue siempre las indicaciones exactas de tu médico y consulta cualquier duda con él.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="my-2 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-md lg:text-xl font-semibold">
                    <p>{sintomas}</p>
                  </div>
                  <SymptomClassificationBadge 
                    classification={clasificacion}
                    urgencia={urgencia}
                    requiereAtencionMedica={requiereAtencionMedica}
                  />
                </div>
                <div className="prose text-sm lg:text-normal max-w-none whitespace-pre-wrap break-words text-gray-700 pb-4">
                  {geminiResponse}
                </div>

                <article className="border-[#12121250] border-1 rounded-md lg:py-4 lg:px-8 py-2 px-4">
                  <header className="flex justify-between items-center font-bold mb-1">
                    <h3>{esRecetaMedica ? "Análisis de Receta Digital" : "Receta Digital"}</h3>
                    <span>Nº {codigo}</span>
                  </header>
                  <div className="text-[12px] lg:text-sm font-light">
                    <p>
                      AURA – Asistente Virtual de Recomendación Farmacéutica
                    </p>
                    <p className="font-normal">
                      Sistema Inteligente de Apoyo al Centro Médico
                    </p>
                    <p>Universidad Nacional Micaela Bastidas de Apurimac</p>
                    <p className="font-normal">
                      Escuela Profesional de Ingenieria Informatica y Sistemas
                    </p>
                    <p>
                      Fecha y hora de emisión: {new Date().toLocaleString()}
                    </p>
                  </div>
                  <div className="text-[13px] lg:text-normal border-y-1 border-gray flex justify-between items-center py-2 my-2">
                    <p>Paciente: anonimo</p>
                    <p>Edad: {userData?.edad}</p>
                    <p>Peso: {userData?.peso}</p>
                    <p>Talla: {userData?.talla}</p>
                  </div>
                  <main>
                    <h4 className="font-bold">Tratamiento</h4>
                    <ol className="list-decimal list-inside space-y-4 my-2">
                      {dosis && Array.isArray(dosis) ? dosis.map((d) => (
                        <li key={d?.medicamento || Math.random()}>
                          <span className="font-medium text-gray-900">
                            {d?.medicamento || "Medicamento no especificado"}
                          </span>
                          <div className="pl-5 text-sm text-gray-600">
                            <p>Dosis: {d?.dosis || "No especificada"}</p>
                            <p>Duración: {d?.duracion || "No especificada"}</p>
                          </div>
                        </li>
                      )) : (
                        <li>No hay dosis especificadas</li>
                      )}
                    </ol>
                  </main>
                </article>
                <div className="my-4">
                  <CalificationButton/>
                </div>
              </div>
            </div>

            {/* Sección Medicamentos - Scroll independiente */}
            <div className="col-span-12 lg:col-span-3 h-auto lg:h-[497px] flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-graylight pr-0 lg:pr-2 scrollbar-thumb-rounded-full">
                <div className="space-y-1 pb-4">
                  {medications && Array.isArray(medications) ? medications.map((med) => (
                    <MedicationWithAvailability
                      key={med?.id || Math.random()}
                      medication={med}
                    />
                  )) : (
                    <div className="text-center text-gray-500 p-4">
                      No hay medicamentos disponibles
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
