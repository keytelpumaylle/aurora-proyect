"use client"
import { useState, useEffect,useCallback } from 'react';
import Medication from './Medication';

interface Medication {
  id: number;
  name: string;
  description: string;
  indication: string;
  contraindication: string;
  dose: string;
  price: number;
  reason: string;
  imageUrl: string;
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
  const updateData = useCallback(() => {
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
      sessionStorage.removeItem('chatResults');
    }
  }, []);

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
      {loading ? ( // Mostrar un mensaje de carga
        <div>Cargando...</div>
      ) : (
        <>
          {/* Sección de respuesta de Gemini */}
          <div className="">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recomendaciones Médicas</h2>
            <div className="prose max-w-none whitespace-pre-wrap break-words text-gray-700">
              {geminiResponse}
            </div>
          </div>
  
          {/* Sección de Medicamentos */}
          <div className="">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {medications.map((med) => (
                <Medication
                  key={med.id}
                  id={med.id}
                  name={med.name}
                  description={med.description}
                  indication={med.indication}
                  contraindication={med.contraindication}
                  dose={med.dose}
                  price={med.price}
                  imageUrl={med.imageUrl || 'https://dcuk1cxrnzjkh.cloudfront.net/imagesproducto/424751L.jpg'}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
  
}