'use server'

export interface UserResponse {
    meta: {
        status: boolean;
        message: string;
    };
    user?: {
        dni: number;
        name: string;
    };
}

export async function GetUsers(dni: string): Promise<UserResponse> {
    try {
        const response = await fetch(
            `${process.env.BACK_URL}/api/v2/users/${dni}`,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
                cache: 'no-store'
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return {
            meta: {
                status: false,
                message: 'Error al conectar con el servidor'
            }
        };
    }
}

export async function CreateUser(dni: string, name: string): Promise<UserResponse> {
    try {
        const response = await fetch(
            `${process.env.BACK_URL}/api/v2/users`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dni, name })
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return {
            meta: {
                status: false,
                message: 'Error al conectar con el servidor'
            }
        };
    }
}