"use client"
import { useState, useEffect } from 'react';

interface Medication {
  id: number;
  name: string;
  description: string;
  indication: string;
  contraindication: string;
  dose: string;
  price: number;
  reason: string;
}

interface ChatResults {
  respuesta_gemini: string;
  medicamentos: Medication[];
}
const STORAGE_EVENT = 'chatResultsUpdated';
export default function IndicationInfo() {
  const [geminiResponse, setGeminiResponse] = useState<string>('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para actualizar datos
  const updateData = () => {
    const storedData = sessionStorage.getItem('chatResults');
    if (!storedData) {
      window.location.href = '/';
      return;
    }

    try {
      const parsedData: ChatResults = JSON.parse(storedData);
      setGeminiResponse(parsedData.respuesta_gemini);
      setMedications(parsedData.medicamentos);
      setLoading(false);
    } catch (error) {
      console.error('Error al parsear los datos:', error);
      window.location.href = '/';
      sessionStorage.removeItem('chatResults')
    }
  };

  useEffect(() => {
    // Cargar datos iniciales
    updateData();

    // Escuchar eventos de actualización
    const handleStorageUpdate = () => updateData();
    
    window.addEventListener(STORAGE_EVENT, handleStorageUpdate);
    return () => window.removeEventListener(STORAGE_EVENT, handleStorageUpdate);
  }, []);

  return (
    <div className="h-[calc(100vh-180px)] overflow-y-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Sección de respuesta de Gemini */}
      <div className="">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recomendaciones Médicas</h2>
        <div className="prose max-w-none whitespace-pre-wrap break-words text-gray-700">
          {geminiResponse}
        </div>
      </div>

      {/* Sección de Medicamentos */}
      <div className="">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Medicamentos Recomendados</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {medications.map((med) => (
            <div key={med.id} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600">{med.name}</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Precio:</span> ${med.price}</p>
                <p><span className="font-medium">Dosis:</span> {med.dose}</p>
                <p><span className="font-medium">Indicación:</span> {med.indication}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}