
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

    if (!props.name) {
        return null;
    }

    return (
        <div className="group bg-white rounded-xl border border-primary/10 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fadeInUp">
            {/* Header con imagen */}
            <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5">
                
                {/* Badge de disponibilidad */}
                <div className="absolute top-2 right-2">
                    {isAvailable ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm">
                            ✓ Disponible
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-sm">
                            ✗ No disponible
                        </span>
                    )}
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4 space-y-3">
                {/* Nombre del medicamento */}
                <h3 className="font-bold text-graydark line-clamp-2 text-sm min-h-[2.5rem]">
                    {props.name}
                </h3>

                {/* Dosis recomendada */}
                <div className="bg-primary/5 rounded-lg p-2 border border-primary/10">
                    <p className="text-xs font-semibold text-primary mb-1">💊 Dosis:</p>
                    <p className="text-xs text-graydark">{props.dose || "Consultar con médico"}</p>
                </div>

                {/* Precio y acción */}
                <div className="flex items-center justify-between pt-2 border-t border-gray/20">
                    {isAvailable && storePrice ? (
                        <div>
                            <p className="text-lg font-bold text-dark">S/ {storePrice.toFixed(2)}</p>
                            {equivalentName && equivalentName !== props.name && (
                                <p className="text-xs text-green-600">→ {equivalentName}</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-graydark font-medium">No disponible</p>
                    )}

                </div>
            </div>
        </div>
    );
}