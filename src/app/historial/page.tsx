"use client";

// Forzar render dinámico en esta ruta para evitar errores de prerender
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { GetTreatment } from "@/api/Medication";
import type { Treatment as ApiTreatment } from "@/api/Medication";
import Header from "@/app/(ecommerce)/components/Header";
import {
  CreditCard,
  Search,
  Calendar,
  FileText,
  AlertCircle,
  X,
  Folder,
  FolderOpen,
  Clock,
  Activity,
  User,
  Gauge
} from "lucide-react";

// UI-friendly treatment type: extend API type with fields the UI expects
// UITreatment: start from ApiTreatment but override the products field
type UITreatment = Omit<ApiTreatment, "products"> & {
  dni: string;
  created_at: string;
  products?: Array<{
    product_id?: string;
    dose?: string;
  }>;
};

export default function HistorialPage() {
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [treatments, setTreatments] = useState<UITreatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<UITreatment | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dni || dni.length !== 8 || !/^\d+$/.test(dni)) {
      setError("Por favor ingrese un DNI válido de 8 dígitos");
      return;
    }

    setError("");
    setLoading(true);
    setSearched(true);

    try {
      const response = await GetTreatment(dni);

      if (response.meta.status && response.treatments) {
        // Normalizar y mapear la respuesta del API a UITreatment
        type RawRecord = Record<string, unknown>;
        type RawProduct = { product_id?: string; Product_id?: string; id?: string; dose?: string } | RawRecord;

        const mapped: UITreatment[] = response.treatments.map((t: ApiTreatment) => {
          const raw = t as unknown as RawRecord;

          const dniValue = (() => {
            const v = raw.dni ?? raw.DNI ?? raw.dni_number;
            if (typeof v === "string") return v;
            if (typeof v === "number") return String(v);
            return dni; // fallback to searched dni
          })();

          const createdAtValue = (() => {
            const v = raw.created_at ?? raw.createdAt ?? raw.created;
            if (typeof v === "string") return v;
            return new Date().toISOString();
          })();

          const productsRaw = raw.products;
          const products: UITreatment["products"] = Array.isArray(productsRaw)
            ? (productsRaw as unknown[]).map((p) => {
                const prod = p as RawProduct;
                const rawId = prod.product_id ?? prod.Product_id ?? prod.id;
                let productId: string | undefined = undefined;
                if (typeof rawId === "string") productId = rawId;
                else if (typeof rawId === "number") productId = String(rawId);

                const dose = typeof prod.dose === "string" ? prod.dose : "";
                return { product_id: productId, dose };
              })
            : [];

          return {
            ...t,
            dni: dniValue,
            created_at: createdAtValue,
            products,
          } as UITreatment;
        });

        setTreatments(mapped);

        if (mapped.length === 0) {
          setError("No se encontraron consultas para este DNI");
        }
      } else {
        setTreatments([]);
        setError(response.meta.message || "No se encontraron registros para este DNI");
      }
    } catch (error) {
      console.error("Error al buscar historial:", error);
      setError("Error al conectar con el servidor. Por favor, intenta de nuevo.");
      setTreatments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Vista inicial: Solo formulario
  if (!searched) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-graylight to-primary/10 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Círculos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-60 right-20 w-80 h-80 bg-secondary rounded-full blur-3xl opacity-15"></div>
          <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-primary/80 rounded-full blur-3xl opacity-25"></div>
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-secondary/80 rounded-full blur-3xl opacity-10"></div>
        </div>

        {/* Formulario */}
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-primary/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-dark mb-2">Historial Clínico</h1>
            <p className="text-graydark">Ingresa tu DNI para consultar tus registros médicos</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="dni" className="text-sm font-semibold text-graydark flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4" />
                Número de DNI
              </label>
              <input
                id="dni"
                type="text"
                maxLength={8}
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full border-2 border-gray/30 focus:border-primary px-4 py-3 rounded-xl focus:outline-none transition-all focus:shadow-lg focus:shadow-primary/10 text-lg"
                placeholder="Ej: 73505700"
                pattern="\d{8}"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Consultar Historial
                </>
              )}
            </button>
          </form>

          {error && !loading && (
            <div className="mt-6 p-4 bg-red/10 border border-red/20 rounded-xl flex items-center gap-2 text-red">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
      </>
    );
  }

  // Vista con resultados
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-graylight to-primary/10 relative">
      {/* Círculos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-secondary rounded-full blur-3xl opacity-15"></div>
        <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-primary/80 rounded-full blur-3xl opacity-25"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-secondary/80 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl opacity-15"></div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-dark mb-1">Historial Clínico</h1>
              <p className="text-sm md:text-base text-graydark">
                DNI: <span className="text-primary font-semibold">{dni}</span> • {" "}
                <span className="text-gray">{treatments.length} {treatments.length === 1 ? 'consulta' : 'consultas'}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setSearched(false);
                setTreatments([]);
                setSelectedTreatment(null);
                setError("");
                setDni("");
              }}
              className="w-full sm:w-auto px-3 md:px-4 py-2 bg-white border border-gray/30 text-graydark rounded-xl hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Buscar otro DNI</span>
              <span className="sm:hidden">Buscar DNI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10">
        {error && (
          <div className="bg-red/10 border border-red/20 rounded-2xl p-4 md:p-6 mb-4 md:mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red flex-shrink-0" />
            <p className="text-red text-sm md:text-base">{error}</p>
          </div>
        )}

        {treatments.length === 0 && !error ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-primary/10">
            <FileText className="w-20 h-20 mx-auto mb-4 text-gray/40" />
            <h3 className="text-2xl font-semibold text-graydark mb-2">No se encontraron registros</h3>
            <p className="text-gray">Este DNI aún no tiene consultas registradas en el sistema.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {treatments.map((treatment) => (
              <div
                key={treatment.id}
                onMouseEnter={() => setHoveredFolder(treatment.id)}
                onMouseLeave={() => setHoveredFolder(null)}
                onClick={() => setSelectedTreatment(treatment)}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl border border-primary/10 p-6 hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Folder Icon */}
                  <div className="mb-4 flex items-center justify-between">
                    {hoveredFolder === treatment.id ? (
                      <FolderOpen size={48} className="text-primary transition-all" />
                    ) : (
                      <Folder size={48} className="text-primary/70 transition-all" />
                    )}
                    <div className="bg-primary/10 px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-primary">HC-{treatment.id.slice(-4)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User size={16} className="text-primary" />
                        <h3 className=" text-sm text-gray-500 line-clamp-1">{treatment.name}</h3>
                      </div>
                      <p className="text-md text-dark line-clamp-2 font-bold">{treatment.description}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-graydark">
                      <Calendar size={14} />
                      <span className="text-xs">{formatDate(treatment.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-graydark">
                      <Clock size={14} />
                      <span className="text-xs">{formatTime(treatment.created_at)}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-gray/10">
                    <div className="flex items-center justify-between text-xs text-gray">
                      <span>{(treatment.products ?? []).length} medicamento{(treatment.products ?? []).length !== 1 ? 's' : ''}</span>
                      <span className="text-primary font-semibold">Ver detalles</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {selectedTreatment && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedTreatment(null)}
        >
          <div
            className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-full md:max-w-5xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 md:p-6 lg:p-8">
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="bg-white/20 p-2 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-sm">
                    <FileText size={24} className="md:w-[32px] md:h-[32px]" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">Historia Clínica</h2>
                    <p className="text-white/90 text-xs md:text-sm">Consulta Médica</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTreatment(null)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors flex-shrink-0"
                >
                  <X size={20} className="md:w-[24px] md:h-[24px]" />
                </button>
              </div>

              {/* Info del paciente */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Paciente</p>
                  <p className="font-semibold">{selectedTreatment.name}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Código HC</p>
                  <p className="font-semibold">HC-{selectedTreatment.id.slice(-6)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Fecha</p>
                  <p className="font-semibold">{formatDate(selectedTreatment.created_at)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Hora</p>
                  <p className="font-semibold">{formatTime(selectedTreatment.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Contenido scrollable */}
            <div className="overflow-y-auto max-h-[calc(95vh-200px)] md:max-h-[calc(90vh-280px)] p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
              {/* Síntomas reportados */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-primary" />
                  Síntomas Reportados
                </h3>
                <p className="text-graydark leading-relaxed">{selectedTreatment.description}</p>
              </div>

              {/* Diagnóstico y Recomendación */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  Diagnóstico y Recomendación
                </h3>
                <div className="text-graydark leading-relaxed whitespace-pre-wrap">
                  {selectedTreatment.indication}
                </div>
              </div>

              {/* Contraindicaciones */}
              <div className="bg-secondary/5 rounded-2xl p-6 border border-secondary/20">
                <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-secondary" />
                  Contraindicaciones
                </h3>
                <p className="text-graydark leading-relaxed">{selectedTreatment.contraindication}</p>
              </div>

              {/* Medicamentos recomendados */}
              {selectedTreatment.products && selectedTreatment.products.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                    <Gauge size={20} className="text-primary" />
                    Medicamentos Recomendados ({selectedTreatment.products.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedTreatment.products.map((product: { product_id?: string; dose?: string }, index: number) => (
                      <div
                        key={index}
                        className="bg-primary/5 rounded-xl p-4 border border-primary/10"
                      >
                        <p className="font-medium text-dark mb-1">
                          Medicamento #{index + 1}
                        </p>
                        <p className="text-sm text-graydark">
                          <span className="font-semibold">Dosis:</span> {product.dose}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
