# Guía de Debugging - Guardado de Tratamientos

## Problema
Los tratamientos no se están guardando después de que Gemini responde.

## Mejoras Implementadas

### 1. **Eliminación del return temprano**
- **Antes**: Si no se encontraban productos en BD, la función retornaba sin guardar
- **Ahora**: Siempre intenta guardar el tratamiento, incluso sin productos

### 2. **Mejor algoritmo de búsqueda de productos**
Se implementaron 4 estrategias de búsqueda:
- Coincidencia exacta
- Nombre de BD contiene nombre de Gemini
- Nombre de Gemini contiene nombre de BD
- Búsqueda por palabras clave

### 3. **Logs mejorados**
Ahora verás logs detallados con emojis para identificar cada etapa:
- 🚀 Inicio del proceso
- ✅ Validaciones exitosas
- ❌ Errores
- 📋 Datos procesados
- 🔎 Búsqueda de productos
- 💊 Productos encontrados
- 📡 Envío al backend

## Cómo Probar

### 1. Abre la consola del navegador (F12)

### 2. Completa el formulario de usuario
- DNI
- Nombre
- Edad, peso, talla, género

### 3. Envía síntomas a Siria
Ejemplo: "Tengo tos leve y fiebre"

### 4. Busca en la consola estos logs:

```
==========================================
🚀 INICIANDO GUARDADO DE TRATAMIENTO
==========================================
✅ UserData disponible: { dni, name, edad, peso, talla, genero }
✅ GeminiResult disponible: { tiene_respuesta, tiene_diagnostico, tiene_medicamentos, num_medicamentos }
```

## Logs Críticos a Verificar

### ✅ **Si TODO está bien, verás:**
```
✅✅✅ TRATAMIENTO GUARDADO EXITOSAMENTE ✅✅✅
📋 ID del tratamiento: [UUID]
```

### ❌ **Si hay error de userData:**
```
❌❌❌ NO HAY USERDATA ❌❌❌
❌ No se puede guardar el tratamiento sin datos del usuario
```
**Solución**: Asegúrate de llenar el formulario de usuario antes de consultar a Siria.

### ❌ **Si hay error de productos:**
```
⚠️ Producto NO encontrado en BD: "Nombre del medicamento"
💡 Nombres de productos disponibles en BD: [lista de 10 productos]
```
**Solución**:
1. Verifica que los medicamentos recomendados por Gemini coincidan con los nombres en tu BD
2. El sistema intentará guardar de todas formas (con array de productos vacío)

### ❌ **Si hay error del backend:**
```
❌❌❌ ERROR AL GUARDAR TRATAMIENTO ❌❌❌
❌ Mensaje de error: [mensaje del servidor]
```
**Solución**: Verifica:
1. Que el backend esté activo: https://apifarma.tryasp.net
2. Que el endpoint `/api/v2/medications` esté funcionando
3. Los logs del servidor backend

### ❌ **Si hay error de red:**
```
💥💥💥 ERROR CRÍTICO AL GUARDAR TRATAMIENTO 💥💥💥
💥 Error: [detalles del error]
```
**Solución**: Verifica la conexión a internet y que el backend esté accesible.

## Datos que se Envían al Backend

⚠️ **IMPORTANTE**: El formato debe coincidir exactamente con el curl de ejemplo

```json
{
  "dni": 78965412,  // ⚠️ NÚMERO, no string
  "name": "Juan Pérez",
  "description": "Tengo tos leve y fiebre",
  "indication": "Diagnóstico preliminar: Gripe común (Precisión: 85%)",
  "contraindication": "No usar si es alérgico...",
  "gemini_response": "STRING SIMPLE (no JSON)",  // ⚠️ STRING directo, NO JSON.stringify()
  "products": [
    {
      "product_id": "019a7451-9914-7157-b697-540969ab0c59",
      "dose": "400mg cada 8 horas por 5 días"
    }
  ]
}
```

### ⚠️ Errores Comunes Corregidos:

1. **DNI como string**: ❌ `"dni": "78965412"` → ✅ `"dni": 78965412`
2. **gemini_response como JSON**: ❌ `JSON.stringify({...})` → ✅ `geminiResult.respuesta_gemini`

## Verificación en el Backend

### Usando Scalar (como en la imagen):
1. POST a `https://apifarma.tryasp.net/api/v2/medications`
2. Headers: `Content-Type: application/json`
3. Body: Usa el formato del ejemplo arriba
4. Deberías ver: `status: true` y un `id` generado

### Si funciona en Scalar pero no en el proyecto:
1. Verifica que `userData` esté disponible al momento de llamar a `saveTreatmentToBackend`
2. Verifica que la función se esté ejecutando (busca los logs con 🚀)
3. Verifica que no haya errores de CORS
4. Verifica que los productos se estén buscando correctamente en la BD

## Puntos Clave del Código

### Chat.tsx (líneas 292-294)
```typescript
// Guardar tratamiento en el backend
if (userData) {
  await saveTreatmentToBackend(result, formData);
}
```
**IMPORTANTE**: Esto se ejecuta ANTES de redirigir a `/chat`

### Medication.ts (línea 72)
```typescript
export async function CreateTreatment(treatmentData: CreateTreatmentData)
```
**IMPORTANTE**: Esta es una server action (`"use server"`)

## Contacto y Soporte

Si después de revisar todos los logs aún no funciona:
1. Copia TODOS los logs de la consola
2. Verifica la respuesta del network tab (F12 > Network > medications)
3. Verifica que el payload esté correctamente formateado

## Checklist de Verificación

- [ ] Variable `BACK_URL` está configurada en `.env`
- [ ] Backend está activo y accesible
- [ ] userData está disponible antes de llamar a Gemini
- [ ] Se ve el log "🚀 INICIANDO GUARDADO DE TRATAMIENTO"
- [ ] Se ve el log "✅ UserData disponible"
- [ ] Se ve el log "🚀 Enviando tratamiento al backend..."
- [ ] Se ve el log "✅✅✅ TRATAMIENTO GUARDADO EXITOSAMENTE ✅✅✅"
