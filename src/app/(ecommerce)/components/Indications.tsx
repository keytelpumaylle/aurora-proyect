"use client";
import { useModalChat } from "@/store/ModalChat";
import { useChatResults } from "../hook/useChatResults"; // Ajusta la ruta según tu estructura
import CardMedication from "./CardMedication";
import { useEffect } from "react";
import { registrarConsulta } from "@/api/SubmitInfo";
import { Plus } from 'lucide-react';
import CalificationButton from "@/app/(Chat)/components/CalificationButton";
import { useCalificationModal } from "@/store/Calification";
export default function IndicationInfo() {
  const { geminiResponse, medications, loading, dosis, sintomas } =
    useChatResults();
  const { userData, clearUserData } = useModalChat();

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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 shrink-0">
                    Recomendaciones Médicas
                  </h2>
                  <button onClick={handleNewConsultation} className="flex items-center gap-2 bg-graylight rounded-lg p-2 text-sm hover:cursor-pointer hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7] hover:text-white">
                    <Plus size={18} strokeWidth={1.5}/>Nueva Consulta
                  </button>
                </div>
                <div className="border-gray bg-graylight border-1 rounded-lg w-full lg:py-3 py-2 px-3 lg:px-6 mb-4 text-sm">
                  <p className="">
                    Nos basamos en la información proporcionada inicialmente:
                    Edad: {userData?.edad}, Peso: {userData?.peso}, Talla:{" "}
                    {userData?.talla}, Género: {userData?.genero}
                  </p>
                </div>
                <div className="my-2 text-md lg:text-xl font-semibold">
                  <p>{sintomas}</p>
                </div>
                <div className="prose text-sm lg:text-normal max-w-none whitespace-pre-wrap break-words text-gray-700 pb-4">
                  {geminiResponse}
                </div>

                <article className="border-[#12121250] border-1 rounded-md lg:py-4 lg:px-8 py-2 px-4">
                  <header className="flex justify-between items-center font-bold mb-1">
                    <h3>Receta Digital</h3>
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
                      {dosis.map((d) => (
                        <li key={d.medicamento}>
                          <span className="font-medium text-gray-900">
                            {d.medicamento}
                          </span>
                          <div className="pl-5 text-sm text-gray-600">
                            <p>Dosis: {d.dosis}</p>
                            <p>Duración: {d.duracion}</p>
                          </div>
                        </li>
                      ))}
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
                  {medications.map((med) => (
                    <CardMedication
                      key={med.id}
                      id={med.id}
                      name={med.name}
                      description={med.description}
                      indication={med.indication}
                      contraindication={med.contraindication}
                      dose={med.dose}
                      price={med.price}
                      imageUrl={med.imageUrl}
                    />
                  ))}

                  <div className="w-full mb-16 lg:mb-0 lg:px-2 mt-4">
                    <button className="w-full bg-gradient-to-r from-[#8C44C2] to-[#07050A] p-4 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                      Pagar s/
                      {medications
                        .reduce((total, med) => total + med.price, 0)
                        .toFixed(2)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
