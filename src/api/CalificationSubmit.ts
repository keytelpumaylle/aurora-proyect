'use server'

export async function registrarCalificacion(formData: FormData) {
    const q1 = formData.get('q1');
    const q2 = formData.get('q2');
    const q3 = formData.get('q3');
    const q4 = formData.get('q4');
    const q5 = formData.get('q5');
    const q6 = formData.get('q6');
    const q7 = formData.get('q7');
    
    console.log('Respuestas al formulario:', { q1, q2, q3, q4, q5, q6, q7 });

    try {
        // OPCIÓN 1: Enviar como FormData (recomendado)
        const formDataToSend = new FormData();
        formDataToSend.append('q1', q1 as string);
        formDataToSend.append('q2', q2 as string);
        formDataToSend.append('q3', q3 as string);
        formDataToSend.append('q4', q4 as string);
        formDataToSend.append('q5', q5 as string);
        formDataToSend.append('q6', q6 as string);
        formDataToSend.append('q7', q7 as string);

        const response = await fetch(`https://script.google.com/macros/s/${process.env.GOOGLE_ID_IMPLEMENTACION_FORMS}/exec`, {
            method: 'POST',
            body: formDataToSend,
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error HTTP: ${response.status} ${response.statusText}`, errorText);
            return { 
                success: false, 
                message: `Error al registrar: ${response.statusText}. Detalles: ${errorText}` 
            };
        }

        const result = await response.json();

        if (result.status === 'success') {
            return { success: true, message: 'Calificación registrada exitosamente.' };
        } else {
            return { success: false, message: `Error: ${result.message || 'Error desconocido'}` };
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        return { 
            success: false, 
            message: `Error de conexión: ${error instanceof Error ? error.message : String(error)}` 
        };
    }
}