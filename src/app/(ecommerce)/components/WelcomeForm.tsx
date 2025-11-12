"use client";

import { useState, useEffect } from "react";
import { useModalChat } from "@/store/ModalChat";
import { GetUsers, CreateUser } from "@/api/Users";
import { User, Weight, Ruler, Users, CreditCard } from "lucide-react";
import NameModal from "./NameModal";

export default function WelcomeForm() {
  const { setUserData, userData } = useModalChat();
  const [formData, setFormData] = useState({
    dni: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
  });
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-llenar el formulario con datos existentes si hay
  useEffect(() => {
    if (userData) {
      setFormData({
        dni: userData.dni || "",
        age: userData.edad || "",
        weight: userData.peso || "",
        height: userData.talla || "",
        gender: userData.genero || "",
      });
    }
  }, [userData]);

  function getUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!formData.dni || !formData.age || !formData.weight || !formData.height || !formData.gender) {
      return;
    }

    // Validar que el DNI tenga exactamente 8 dígitos
    if (formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
      alert('El DNI debe tener exactamente 8 dígitos numéricos');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔍 Verificando si el usuario existe con DNI:', formData.dni);

      // Verificar si el usuario existe en el backend
      const response = await GetUsers(formData.dni);

      if (response.meta.status && response.user) {
        // Usuario EXISTE en el backend
        const user = response.user;
        console.log('✅ Usuario encontrado en backend:', user);

        // Preparar datos del usuario
        // Evitar 'any' usando un type-guard para detectar si la respuesta tiene 'id'
        const hasId = (obj: unknown): obj is { id: string | number } => {
          if (typeof obj !== 'object' || obj === null) return false;
          const rec = obj as Record<string, unknown>;
          if (!('id' in rec)) return false;
          return typeof rec['id'] === 'string' || typeof rec['id'] === 'number';
        };
        const apiId = hasId(user) ? (user.id as string | number) : undefined;
        const userDataToSave = {
          id: apiId ? String(apiId) : getUUID(),
          dni: formData.dni,
          name: user.name || "", // ⚠️ Obtener nombre del backend
          edad: formData.age,
          peso: formData.weight,
          talla: formData.height,
          genero: formData.gender,
        };

        console.log('💾 Guardando userData en store:', userDataToSave);

        // Guardar datos con el nombre del backend
        setUserData(userDataToSave);

        // Verificar que se guardó
        setTimeout(() => {
          const savedData = useModalChat.getState().userData;
          console.log('✅ Datos guardados en store:', savedData);
          if (typeof window !== 'undefined') {
            const localData = localStorage.getItem('user-data-storage');
            console.log('💾 localStorage después de guardar:', localData);
          }
        }, 100);

        // Si el usuario existe pero no tiene nombre, mostrar modal
        if (!user.name || user.name.trim() === '') {
          console.log('⚠️ Usuario sin nombre, mostrando modal...');
          setIsNameModalOpen(true);
        } else {
          console.log('✅ Usuario con nombre completo:', user.name);
        }
      } else {
        // Usuario NO EXISTE - crear uno nuevo y pedir nombre
        console.log('⚠️ Usuario no encontrado, mostrando modal para nombre...');

        // Guardar datos temporalmente (sin nombre)
        setUserData({
          id: getUUID(),
          dni: formData.dni,
          name: "", // Se llenará en el modal
          edad: formData.age,
          peso: formData.weight,
          talla: formData.height,
          genero: formData.gender,
        });

        // Mostrar modal para ingresar nombre
        setIsNameModalOpen(true);
      }
    } catch (error) {
      console.error('💥 Error al verificar usuario:', error);
      alert('Error al verificar el usuario. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameConfirm = async (name: string) => {
    console.log('📝 Confirmando nombre:', name);

    if (!name || name.trim() === '') {
      console.error('❌ Nombre vacío, no se puede confirmar');
      alert('Por favor, ingresa un nombre válido');
      return;
    }

    // Actualizar userData con el nombre
    const updatedUserData = {
      id: userData?.id || getUUID(),
      dni: formData.dni,
      name: name.trim(),
      edad: formData.age,
      peso: formData.weight,
      talla: formData.height,
      genero: formData.gender,
    };

    console.log('💾 Actualizando userData con nombre:', updatedUserData);
    setUserData(updatedUserData);

    // Verificar que se guardó correctamente
    setTimeout(() => {
      const savedData = useModalChat.getState().userData;
      console.log('✅ Datos actualizados en store:', savedData);
      console.log('✅ ¿Tiene nombre?', savedData?.name && savedData.name.trim() !== '');

      if (typeof window !== 'undefined') {
        // También guardar en sessionStorage como backup
        sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
        console.log('💾 También guardado en sessionStorage');
      }
    }, 100);

    // Crear usuario en el backend si es nuevo
    try {
      await CreateUser(formData.dni, name.trim());
      console.log('✅ Usuario creado en backend');
    } catch (error) {
      console.warn('⚠️ Error al crear usuario en backend:', error);
      // No bloqueamos el flujo si falla la creación
    }

    setIsNameModalOpen(false);
  };

  const handleNameCancel = () => {
    console.log('❌ Usuario canceló el ingreso de nombre');
    setIsNameModalOpen(false);
    // Limpiar el formulario si el usuario cancela
    setFormData({
      dni: "",
      age: "",
      weight: "",
      height: "",
      gender: "",
    });
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-3 bg-gradient-to-br from-primary/5 via-white to-secondary/5 animate-fadeIn">
      <div className="w-full max-w-md animate-scaleIn">
        <div className="bg-white  overflow-hidden border border-primary/10">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-dark mb-2">
                {userData ? 'Editar mis datos' : '¡Bienvenido a SIRIA!'}
              </h2>
              <p className="text-graydark/70 text-sm">
                {userData
                  ? 'Actualiza tu información personal'
                  : 'Para brindarte recomendaciones personalizadas, necesitamos conocerte mejor'
                }
              </p>
            </div>

            {/* Formulario */}
            <div className="space-y-5 mb-8">
              {/* DNI */}
              <div className="space-y-2">
                <label htmlFor="dni" className="text-sm font-semibold text-graydark flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  DNI
                </label>
                <input
                  id="dni"
                  name="dni"
                  type="text"
                  maxLength={8}
                  className="w-full border-2 border-gray/30 focus:border-primary px-4 py-3 rounded-xl focus:outline-none transition-all focus:shadow-lg focus:shadow-primary/10"
                  placeholder="Ej: 73505700"
                  value={formData.dni}
                  onChange={handleFormDataChange}
                  required
                  pattern="\d{8}"
                  title="El DNI debe tener exactamente 8 dígitos"
                />
              </div>

              <div className="flex gap-4">
                {/* Edad */}
              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-semibold text-graydark flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Edad
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  className="w-full border-2 border-gray/30 focus:border-primary px-4 py-3 rounded-xl focus:outline-none transition-all focus:shadow-lg focus:shadow-primary/10"
                  placeholder="Ej: 25"
                  value={formData.age}
                  onChange={handleFormDataChange}
                  required
                  min="1"
                  max="120"
                />
              </div>

              {/* Peso */}
              <div className="space-y-2">
                <label htmlFor="weight" className="text-sm font-semibold text-graydark flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Peso (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  className="w-full border-2 border-gray/30 focus:border-primary px-4 py-3 rounded-xl focus:outline-none transition-all focus:shadow-lg focus:shadow-primary/10"
                  placeholder="Ej: 70"
                  value={formData.weight}
                  onChange={handleFormDataChange}
                  required
                  min="1"
                  max="300"
                  step="0.1"
                />
              </div>
              </div>

              {/* Talla */}
              <div className="space-y-2">
                <label htmlFor="height" className="text-sm font-semibold text-graydark flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Talla (cm)
                </label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  className="w-full border-2 border-gray/30 focus:border-primary px-4 py-3 rounded-xl focus:outline-none transition-all focus:shadow-lg focus:shadow-primary/10"
                  placeholder="Ej: 170"
                  value={formData.height}
                  onChange={handleFormDataChange}
                  required
                  min="30"
                  max="250"
                  step="0.1"
                />
              </div>

              {/* Género */}
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-semibold text-graydark flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Género
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="w-full border-2 border-gray/30 focus:border-primary px-4 py-3 rounded-xl focus:outline-none transition-all focus:shadow-lg focus:shadow-primary/10"
                  value={formData.gender}
                  onChange={handleFormDataChange}
                  required
                >
                  <option value="">Seleccione su género</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-4 rounded-xl transition-all font-semibold text-lg ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? 'Verificando...' : (userData ? 'Guardar cambios' : 'Comenzar consulta')}
            </button>
          </form>
        </div>
      </div>

      {/* Modal para ingresar nombre */}
      <NameModal
        isOpen={isNameModalOpen}
        dni={formData.dni}
        initialName=""
        onConfirm={handleNameConfirm}
        onCancel={handleNameCancel}
      />
    </div>
  );
}
