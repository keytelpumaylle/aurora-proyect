'use server'

// Interfaces para los productos
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number | null;
    image_url: string;
}

interface Meta {
    status: boolean;
    message: string;
}

interface Pagination {
    page_number: number;
    page_size: number;
    total_pages: number;
    total_records: number;
}

interface ProductsResponse {
    meta: Meta;
    pagination: Pagination;
    product: Product[];
}

interface ProductByIdResponse {
    meta: Meta;
    product: Product;
}

/**
 * Obtiene todos los productos disponibles
 * @returns Array de productos o array vacío en caso de error
 */
export async function getProducts(): Promise<Product[]> {
    try {
        const response = await fetch(`${process.env.BACK_URL}/api/v2/products`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store' // Para obtener siempre datos frescos
        });

        if (!response.ok) {
            console.error(`Error HTTP: ${response.status}`);
            return [];
        }

        const data: ProductsResponse = await response.json();

        // Verificación de la estructura de respuesta
        if (data?.meta?.status && data?.product && Array.isArray(data.product)) {
            return data.product;
        } else {
            console.error('Estructura de respuesta inesperada:', data);
            return [];
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return [];
    }
}

/**
 * Obtiene un producto específico por su ID
 * @param id - ID del producto (UUID)
 * @returns Producto o null en caso de error
 */
export async function GetByIdProducts(id: string): Promise<Product | null> {
    try {
        const response = await fetch(`${process.env.BACK_URL}/api/v2/products/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`Error HTTP al obtener producto ${id}: ${response.status}`);
            return null;
        }

        const data: ProductByIdResponse = await response.json();

        // Verificación de la estructura de respuesta
        if (data?.meta?.status && data?.product) {
            return data.product;
        } else {
            console.error('Estructura de respuesta inesperada para producto:', data);
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener producto ${id}:`, error);
        return null;
    }
}

/**
 * Obtiene productos con paginación
 * @param page - Número de página (default: 1)
 * @param pageSize - Tamaño de página (default: 25)
 * @returns Objeto con productos y metadata de paginación
 */
export async function getProductsPaginated(page: number = 1, pageSize: number = 25) {
    try {
        const response = await fetch(
            `${process.env.BACK_URL}/api/v2/products?page=${page}&page_size=${pageSize}`,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            console.error(`Error HTTP: ${response.status}`);
            return { products: [], pagination: null };
        }

        const data: ProductsResponse = await response.json();

        if (data?.meta?.status && data?.product && Array.isArray(data.product)) {
            return {
                products: data.product,
                pagination: data.pagination
            };
        } else {
            console.error('Estructura de respuesta inesperada:', data);
            return { products: [], pagination: null };
        }
    } catch (error) {
        console.error('Error al obtener productos paginados:', error);
        return { products: [], pagination: null };
    }
}