'use server'

export interface DosisRecomendada {
  medicamento: string;
  dosis: string;
  duracion: string;
}

export interface UsuarioConsulta {
  id: string;
  edad: string;
  peso: string;
  talla: string;
  genero: string;
}

export interface RegistroConsulta {
  sintomas: string;
  dosisRecomendada: DosisRecomendada[];
  usuario: UsuarioConsulta;
}

export async function registrarConsulta(data: RegistroConsulta) {

  // Aquí puedes guardar en base de datos o hacer lo que necesites
  try {
    // Realizar la solicitud POST a la URL de tu Google Apps Script
    const response = await fetch(`https://script.google.com/macros/s/${process.env.GOOGLE_ID_IMPLEMENTACION}/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Indicar que estamos enviando JSON
      },
      // El cuerpo de la solicitud es el objeto 'data' convertido a JSON
      body: JSON.stringify(data), 
      // Opcional: Caché para fetch, 'no-store' asegura que siempre haga una nueva solicitud
      cache: 'no-store' 
    });

    // Verificar si la respuesta de la aplicación web fue exitosa (estado HTTP 2xx)
    if (!response.ok) {
      const errorText = await response.text(); // Leer el cuerpo del error si lo hay
      console.error(`Error HTTP al registrar en Google Sheet: ${response.status} ${response.statusText}`, errorText);
      return { 
        success: false, 
        message: `Error al registrar en Google Sheet: ${response.statusText}. Detalles: ${errorText}` 
      };
    }

    // Parsear la respuesta JSON del Apps Script
    const result = await response.json(); 
    console.log('Respuesta de Google Apps Script:', result);

    // Verificar el 'status' dentro del JSON de respuesta del Apps Script
    if (result.status === 'success') {
      return { success: true, message: 'Consulta registrada exitosamente en Google Sheet.' };
    } else {
      // Si el Apps Script devolvió un 'status: "error"'
      return { success: false, message: `Error del Apps Script: ${result.message || 'Mensaje de error desconocido.'}` };
    }

  } catch (error) {
    // Capturar cualquier error de red o de ejecución del fetch
    console.error('Error al conectar con la aplicación web de Google Apps Script:', error);
    return { 
      success: false, 
      message: `Error de conexión o inesperado: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}