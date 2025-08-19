
import Link from "next/link";
import { useMedicationAvailability } from "../hook/useMedicationAvailability";

interface Props {
    id: number,
    name: string,
    description: string,
    indication: string,
    contraindication: string,
    dose: string,
    price: number,
    imageUrl: string
}

export default function CardMedication(props: Props) {
    const { isAvailable, storePrice, equivalentName } = useMedicationAvailability(props.name || "");
    
    // Safety checks
    if (!props.name) {
        return null;
    }
    
    return (
        <Link
  key={props.id}
  href={`/${encodeURIComponent(props.name)}`}
  className="group relative block rounded-md overflow-hidden p-0.5 transition-all duration-300"
>
  {/* Fondo degradado que aparece al hacer hover */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#885BDA] to-[#66D6D7] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md z-0"></div>

  {/* Contenedor interno con altura fija */}
  <div className="relative bg-white rounded-md z-10 overflow-hidden flex h-2/7 items-center px-4 border-graylight border-1">
    

    {/* Sección de contenido con altura fija */}
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 h-6">
          {props.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-3 h-6">
          {props.description}
        </p>
      </div>
      
      {/* Información de disponibilidad y precio */}
      <div className="mt-auto pt-2">
        {isAvailable ? (
          <div>
            <p className="font-bold text-gray-900">
              s/{storePrice?.toFixed(2)}
            </p>
            {equivalentName && equivalentName !== props.name && (
              <p className="text-xs text-green-600">
                Disponible como: {equivalentName}
              </p>
            )}
            <p className="text-xs text-green-600 font-medium">
              ✓ Disponible en tienda
            </p>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-gray-900">
              {props.name}
            </p>
            <p className="text-xs text-red-500 font-medium">
              No disponible en la tienda de Aura
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
</Link>
    );
}