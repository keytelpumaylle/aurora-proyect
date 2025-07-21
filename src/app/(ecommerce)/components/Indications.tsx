"use client";
import { useChatResults } from '../hook/useChatResults'; // Ajusta la ruta según tu estructura
import CardMedication from "./CardMedication";

export default function IndicationInfo() {
  const { geminiResponse, medications, loading } = useChatResults();

  return (
    <div className=" px-4 sm:px-6 lg:px-8 py-6">
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <>
          <div className="grid grid-cols-12 h-[497px] gap-4 overflow-hidden">
            {/* Sección Gemini - Scroll independiente */}
            <div className="col-span-9 h-full flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-graylight pr-4 scrollbar-thumb-rounded-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 shrink-0">
                  Recomendaciones Médicas
                </h2>
                <div className="prose max-w-none whitespace-pre-wrap break-words text-gray-700 pb-4">
                  {geminiResponse}
                </div>
              </div>
            </div>

            {/* Sección Medicamentos - Scroll independiente */}
            <div className="col-span-3 h-[497px] flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-graylight pr-2 scrollbar-thumb-rounded-full">
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

                  <button className="mt-4 bg-gradient-to-r from-[#8C44C2] to-[#07050A] w-full p-4 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                    Pagar s/{medications
                          .reduce((total, med) => total + med.price, 0)
                          .toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}