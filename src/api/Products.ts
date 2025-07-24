'use server'

// Interfaces para las respuestas
interface Meta {
    status: number;
    message: string;
}

interface SuccessResponse {
    meta: Meta;
}

interface ErrorDetail {
    status: number;
    type: string;
    title: string;
    detail: string[];
    instance: string;
}

interface ErrorResponse {
    error: ErrorDetail;
}

// Tipo unión para manejar ambas respuestas
type RegistrationResponse = SuccessResponse | ErrorResponse;

export async function getProducts() {
    try {
        const backUrl = process.env.BACK_URL;
        
        if (!backUrl) {
            console.error('BACK_URL no está definida');
            return [];
        }
        
        const response = await fetch(`${backUrl}/api/v1/medications`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (!response.ok) {
            console.error(`Error HTTP: ${response.status}`);
            return [];
        }
        
        const data = await response.json();
        
        // Verificación más robusta
        if (data?.data?.medication && Array.isArray(data.data.medication)) {
            return data.data.medication;
        } else {
            console.error('Estructura de respuesta inesperada:', data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; 
    }
}
export async function registerProducts(
    prevState: RegistrationResponse | undefined,
    formData: FormData
): Promise<RegistrationResponse> {
    const value = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        indication: formData.get('indication') as string,
        contraindication: formData.get('contraindication') as string,
        dose: formData.get('dose') as string,
        price: formData.get('price') as string,
        imageUrl: formData.get('imageUrl') as string,
    };

    try {
        const response = await fetch(`${process.env.BACK_URL}/api/v1/medications`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
        });

        const data: RegistrationResponse = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Registration error:', error);
        return {
            error: {
                status: 500,
                type: 'https://apifarma.tryasp.net/api/v1/errors/internal-error',
                title: 'Error interno del servidor',
                detail: ['Ocurrió un error inesperado'],
                instance: '/api/v1/medications'
            }
        };
    }
}

export async function updateProducts(formData: FormData, id: number): Promise<RegistrationResponse> {
    const value = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        indication: formData.get('indication') as string,
        contraindication: formData.get('contraindication') as string,
        dose: formData.get('dose') as string,
        price: formData.get('price') as string,
        imageUrl: formData.get('imageUrl') as string,
    };

    try {
        const response = await fetch(`${process.env.BACK_URL}/api/v1/medications/${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
        });

        const data: RegistrationResponse = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Update error:', error);
        return {
            error: {
                status: 500,
                type: 'https://apifarma.tryasp.net/api/v1/errors/internal-error',
                title: 'Error interno del servidor',
                detail: ['Ocurrió un error inesperado'],
                instance: `/api/v1/medications/${id}`
            }
        };
    }
    
}