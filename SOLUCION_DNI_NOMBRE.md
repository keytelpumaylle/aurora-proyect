# Solución: Error "DNI y nombre son requeridos"

## Problema
El error indica que `userData.dni` o `userData.name` están llegando como `undefined`, `null`, o vacíos cuando se intenta guardar el tratamiento.

## Causa Raíz
El problema ocurre cuando:
1. El usuario completa el formulario pero los datos no se guardan correctamente en el store de Zustand
2. El nombre no se obtiene del backend o no se actualiza en el store después de obtenerlo
3. Los datos se pierden entre el formulario y el momento de guardar el tratamiento

## Mejoras Implementadas

### 1. **Validación Mejorada con Logs Detallados**

Ahora cuando se intenta guardar, verás logs específicos que te dirán exactamente qué falta:

```typescript
// Si userData es null
❌❌❌ NO HAY USERDATA ❌❌❌

// Si faltan campos específicos
❌❌❌ FALTAN CAMPOS REQUERIDOS EN USERDATA ❌❌❌
❌ userData.dni: "undefined" tipo: undefined vacío: true
❌ userData.name: "undefined" tipo: undefined vacío: true
❌ userData completo: { ... }
🔍 userData en sessionStorage: { ... }
```

### 2. **Validación Antes de Construir el Payload**

```typescript
// Validar y convertir DNI a número
const dniNumber = parseInt(userData.dni);
if (isNaN(dniNumber) || dniNumber === 0) {
  console.error('❌ DNI inválido:', userData.dni, '-> parseInt:', dniNumber);
  return;
}

// Validar nombre
if (!userData.name || userData.name.trim() === '') {
  console.error('❌ Nombre vacío o inválido:', userData.name);
  return;
}
```

### 3. **Mensajes de Loading Mejorados**

Agregados más mensajes para dar mejor feedback al usuario:
- "Analizando tus síntomas..."
- "Consultando con SIRIA..."
- "Buscando productos disponibles..."
- "Procesando recomendaciones médicas..."
- "Generando diagnóstico personalizado..."
- "Preparando tu receta digital..."
- "Guardando tu historial médico..."

## Cómo Debuggear el Problema

### Paso 1: Verifica los Logs en la Consola

Cuando presiones "Consultar con SIRIA", busca estos logs:

```
==========================================
🚀 INICIANDO GUARDADO DE TRATAMIENTO
==========================================
✅ UserData disponible: {
  dni: "78965412",
  name: "Juan Pérez",
  edad: "25",
  peso: "70",
  talla: "175",
  genero: "M"
}
```

**Si no ves este log**, el problema está ANTES de intentar guardar.

### Paso 2: Verifica el Store de Zustand

Abre la consola del navegador y ejecuta:

```javascript
// En la consola del navegador
console.log('UserData en store:', JSON.parse(localStorage.getItem('user-data-storage')));
console.log('UserData en session:', JSON.parse(sessionStorage.getItem('userData')));
```

Deberías ver algo como:
```json
{
  "state": {
    "userData": {
      "id": "abc-123",
      "dni": "78965412",
      "name": "Juan Pérez",
      "edad": "25",
      "peso": "70",
      "talla": "175",
      "genero": "M"
    },
    "isFormCompleted": true
  },
  "version": 0
}
```

### Paso 3: Verifica el Flujo del WelcomeForm

El flujo debería ser:
1. Usuario ingresa DNI y otros datos en WelcomeForm
2. Se llama a `GetUsers(dni)` para verificar si existe
3. **SI EXISTE**: Se obtiene el nombre del backend y se actualiza con `updateUserName()`
4. **SI NO EXISTE**: Se muestra modal para ingresar nombre manualmente
5. Se guarda todo en el store con `setUserData()`

### Paso 4: Verifica Que el Nombre Se Actualice

Busca en los logs:
```
🔍 Usuario existe, actualizando nombre...
✅ Nombre actualizado: Juan Pérez
```

O para usuarios nuevos:
```
📝 Guardando nombre desde modal...
✅ UserData actualizado con nombre
```

## Posibles Problemas y Soluciones

### Problema 1: userData es null
**Causa**: El formulario no se completó o los datos no se guardaron
**Solución**: Asegúrate de que `WelcomeForm` llame a `setUserData()` correctamente

### Problema 2: userData.dni es undefined
**Causa**: El DNI no se guardó en el store
**Solución**: Verifica que el campo DNI en el formulario tenga el atributo `name="dni"`

### Problema 3: userData.name es undefined
**Causa**: El nombre no se obtuvo del backend o no se guardó desde el modal
**Solución**:
- Verifica que `GetUsers()` devuelva el nombre correctamente
- Verifica que `updateUserName()` se llame después de obtener el usuario
- Verifica que el modal de nombre llame a `updateUserName()` al confirmar

### Problema 4: DNI es NaN después de parseInt
**Causa**: El DNI contiene caracteres no numéricos
**Solución**: Valida el DNI en el formulario para que solo acepte números

## Código de Referencia

### WelcomeForm debería hacer algo así:

```typescript
const handleSubmit = async (data) => {
  // 1. Verificar si el usuario existe
  const response = await GetUsers(data.dni);

  if (response.meta.status && response.users?.length > 0) {
    // Usuario EXISTE - obtener nombre del backend
    const user = response.users[0];

    // Guardar datos en el store (SIN nombre aún)
    setUserData({
      id: user.id,
      dni: data.dni,
      name: user.name || "",  // ⚠️ Asegúrate de que esto no sea undefined
      edad: data.edad,
      peso: data.peso,
      talla: data.talla,
      genero: data.genero
    });

    // Si no tiene nombre en el backend, mostrar modal
    if (!user.name) {
      // Mostrar modal para ingresar nombre
    }
  } else {
    // Usuario NO EXISTE - mostrar modal para ingresar nombre
    // Guardar datos temporalmente (sin nombre)
    setUserData({
      id: crypto.randomUUID(),
      dni: data.dni,
      name: "",  // ⚠️ Se llenará en el modal
      edad: data.edad,
      peso: data.peso,
      talla: data.talla,
      genero: data.genero
    });

    // Mostrar modal
    setIsNameModalOpen(true);
  }
};
```

### NameModal debería hacer algo así:

```typescript
const handleConfirm = async (name: string) => {
  // Actualizar el nombre en el store
  updateUserName(name);

  // Si es usuario nuevo, crear en el backend
  if (isNewUser) {
    await CreateUser({
      dni: userData.dni,
      name: name
    });
  }

  // Cerrar modal y continuar
  onClose();
};
```

## Verificación Final

Después de implementar los cambios, el flujo completo debería verse así en la consola:

```
1. Usuario llena formulario
2. 🔍 Buscando usuario con DNI: 78965412
3. ✅ Usuario encontrado: Juan Pérez
4. 📝 Guardando userData en store
5. ✅ userData guardado correctamente
6. Usuario escribe síntomas
7. Usuario presiona "Consultar con SIRIA"
8. 🚀 INICIANDO GUARDADO DE TRATAMIENTO
9. ✅ UserData disponible: { dni: "78965412", name: "Juan Pérez", ... }
10. ✅ GeminiResult disponible
11. 🔍 Buscando productos reales en la base de datos...
12. ✅ Validación exitosa - DNI: 78965412 Nombre: Juan Pérez
13. 📦 TreatmentData final: { dni: 78965412, name: "Juan Pérez", ... }
14. 🚀 Enviando tratamiento al backend...
15. ✅✅✅ TRATAMIENTO GUARDADO EXITOSAMENTE ✅✅✅
```

Si ves todos estos logs en orden, el sistema está funcionando correctamente.

Si falta alguno, ese es el punto donde necesitas revisar el código.
