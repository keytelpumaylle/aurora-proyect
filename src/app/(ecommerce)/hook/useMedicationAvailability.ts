import { useState, useEffect } from 'react';
import medicamentosDB from "@/data/Medications.json";

interface MedicationAvailability {
  isAvailable: boolean;
  storePrice?: number;
  equivalentName?: string;
}

export const useMedicationAvailability = (medicationName: string): MedicationAvailability => {
  const [availability, setAvailability] = useState<MedicationAvailability>({
    isAvailable: false,
  });

  useEffect(() => {
    const checkAvailability = () => {
      try {
        if (!medicationName || typeof medicationName !== 'string' || medicationName.trim() === '') {
          setAvailability({ isAvailable: false });
          return;
        }

        // Normalizar el nombre del medicamento para comparación
        const normalizedMedicationName = medicationName.toLowerCase().trim();
        
        // Safety check for medicamentosDB
        if (!medicamentosDB || !Array.isArray(medicamentosDB.medicamentos)) {
          setAvailability({ isAvailable: false });
          return;
        }
        
        // Buscar en la base de datos
        const foundMedication = medicamentosDB.medicamentos.find(med => {
          // Safety checks
          if (!med || !med.nombre || typeof med.nombre !== 'string') {
            return false;
          }
          
          // Comparar con el nombre principal
          if (med.nombre.toLowerCase().includes(normalizedMedicationName)) {
            return true;
          }
          
          // Comparar con equivalentes comerciales
          return med.equivalentes_comerciales?.some(equiv => {
            if (!equiv || typeof equiv !== 'string') return false;
            return equiv.toLowerCase().includes(normalizedMedicationName) ||
                   normalizedMedicationName.includes(equiv.toLowerCase());
          });
        });

        if (foundMedication) {
          setAvailability({
            isAvailable: true,
            // Precio simulado basado en el medicamento
            storePrice: generateMockPrice(foundMedication.nombre),
            equivalentName: foundMedication.nombre
          });
        } else {
          setAvailability({ isAvailable: false });
        }
      } catch (error) {
        console.error('Error checking medication availability:', error);
        setAvailability({ isAvailable: false });
      }
    };

    checkAvailability();
  }, [medicationName]);

  return availability;
};

// Función auxiliar para generar un precio simulado consistente
const generateMockPrice = (medicationName: string): number => {
  try {
    if (!medicationName || typeof medicationName !== 'string') {
      return 15; // Precio base por defecto
    }
    
    const basePrice = 15; // Precio base
    const nameHash = medicationName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variation = (nameHash % 30) + 5; // Variación entre 5 y 35
    return basePrice + variation; // Precio consistente sin aleatoriedad
  } catch (error) {
    console.error('Error generating mock price:', error);
    return 15; // Precio base por defecto
  }
};