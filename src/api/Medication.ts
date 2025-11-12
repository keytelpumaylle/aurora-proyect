"use server"

export interface TreatmentProduct {
    product_id: string;
    dose: string;
}

export interface CreateTreatmentData {
    dni: number;                    // DNI del paciente (número)
    name: string;                   // Nombre completo del paciente
    description: string;            // Síntomas descritos por el paciente
    indication: string;             // Diagnóstico preliminar
    contraindication: string;       // Contraindicaciones generales
    gemini_response: string;        // Respuesta completa de Gemini (string simple, NO JSON)
    products: TreatmentProduct[];   // Lista de productos recomendados con sus dosis
}

export interface Treatment {
    id: string;
    name: string;
    description: string;
    indication: string;
    contraindication: string;
    gemini_response: string;
    products: Array<{
        Product_id: string;
        dose: string;
        created_on: string;
    }>;
}

export interface TreatmentResponse {
    meta: {
        status: boolean;
        message: string;
    };
    pagination?: {
        page_number: number;
        page_size: number;
        total_pages: number;
        total_records: number;
    };
    treatments?: Treatment[];
}

export async function GetTreatment(dni: string): Promise<TreatmentResponse> {
    try {
        if (!process.env.BACK_URL) {
            console.error('BACK_URL no está configurado');
            return {
                meta: { status: false, message: 'BACK_URL no configurado' }
            };
        }

        // timeout helper
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(
            `${process.env.BACK_URL}/api/v2/medications?dni=${dni}`,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
                cache: 'no-store',
                signal: controller.signal
            }
        );

        clearTimeout(timeout);

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            console.error('Error HTTP al obtener tratamiento:', response.status, text);
            return { meta: { status: false, message: `Error HTTP ${response.status}` } };
        }

        const data = await response.json().catch((e) => {
            console.error('Error parsing JSON de GetTreatment:', e);
            return null;
        });

        if (!data) return { meta: { status: false, message: 'Respuesta inválida del servidor' } };
        return data;
    } catch (error) {
        console.error('Error al obtener tratamiento:', error);
        let msg = 'Error al conectar con el servidor';
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                msg = 'Timeout al conectar con el servidor';
            } else {
                msg = `Error al conectar con el servidor: ${error.message}`;
            }
        }
        return { meta: { status: false, message: msg } };
    }
}

export async function CreateTreatment(treatmentData: CreateTreatmentData): Promise<TreatmentResponse> {
    try {
        // Validar datos requeridos antes de enviar
        if (!treatmentData.dni || !treatmentData.name) {
            console.error('❌ Faltan datos requeridos: DNI o nombre del paciente');
            return {
                meta: {
                    status: false,
                    message: 'DNI y nombre son requeridos'
                }
            };
        }

        if (!treatmentData.description || !treatmentData.gemini_response) {
            console.error('❌ Faltan datos requeridos: descripción o respuesta de Gemini');
            return {
                meta: {
                    status: false,
                    message: 'Descripción y respuesta de Gemini son requeridos'
                }
            };
        }

        console.log('📤 Enviando tratamiento al backend:', {
            dni: treatmentData.dni,
            name: treatmentData.name,
            productos_count: treatmentData.products.length
        });

        const response = await fetch(
            `${process.env.BACK_URL}/api/v2/medications`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(treatmentData)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Error HTTP ${response.status}:`, errorText);
            return {
                meta: {
                    status: false,
                    message: `Error del servidor: ${response.status} - ${errorText}`
                }
            };
        }

        const data = await response.json();
        console.log('✅ Respuesta del servidor:', data);
        return data;
    } catch (error) {
        console.error('💥 Error al crear tratamiento:', error);
        return {
            meta: {
                status: false,
                message: `Error al conectar con el servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`
            }
        };
    }
}
