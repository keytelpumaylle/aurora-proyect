"use client";

interface SymptomClassificationBadgeProps {
  classification: string;
  urgencia?: string;
  requiereAtencionMedica?: boolean;
}

export default function SymptomClassificationBadge({ 
  classification, 
  urgencia, 
  requiereAtencionMedica 
}: SymptomClassificationBadgeProps) {
  
  const getClassificationStyle = () => {
    switch (classification?.toLowerCase()) {
      case 'leve':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-300',
          label: 'Síntoma Leve',
          icon: '🟢'
        };
      case 'moderado':
        return {
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-300',
          label: 'Síntoma Moderado',
          icon: '🟡'
        };
      case 'grave':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-300',
          label: 'Síntoma Grave',
          icon: '🔴'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300',
          label: 'Sin Clasificar',
          icon: '⚪'
        };
    }
  };

  const style = getClassificationStyle();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border ${style.bgColor} ${style.textColor} ${style.borderColor} text-sm font-medium`}>
      <span className="text-xs">{style.icon}</span>
      <span>{style.label}</span>
      {requiereAtencionMedica && (
        <span className="text-xs opacity-75">
          • {urgencia === 'alta' ? 'Urgente' : 'Consulta médica'}
        </span>
      )}
    </div>
  );
}