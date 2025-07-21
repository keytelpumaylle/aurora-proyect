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
  imageUrl: string;
}

interface ChatResults {
  respuesta_gemini: string;
  medicamentos: Medication[];
}

const STORAGE_EVENT = "chatResultsUpdated";

export const useChatResults = () => {
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const storedData = sessionStorage.getItem("chatResults");
      if (!storedData) {
        window.location.href = "/";
        return;
      }
      try {
        const parsedData: ChatResults = JSON.parse(storedData);
        setGeminiResponse(parsedData.respuesta_gemini);
        setMedications(parsedData.medicamentos);
        setLoading(false);
      } catch (error) {
        console.error("Error al parsear los datos:", error);
        window.location.href = "/";
        sessionStorage.removeItem("chatResults");
      }
    };

    // Cargar datos iniciales
    loadData();

    // Escuchar eventos de actualización
    window.addEventListener(STORAGE_EVENT, loadData);
    return () => window.removeEventListener(STORAGE_EVENT, loadData);
  }, []);

  return { geminiResponse, medications, loading };
};