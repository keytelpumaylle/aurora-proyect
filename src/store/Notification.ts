import { create } from 'zustand'

// Tipos de notificaciones
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

// Interface para una notificación individual
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number // en milisegundos, default 3000
  icon?: React.ReactNode
}

// Interface del store
interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

// Función para generar IDs únicos
const generateId = () => {
  return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Store de notificaciones
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = generateId()
    const newNotification: Notification = {
      id,
      duration: 3000, // 3 segundos por defecto
      ...notification,
    }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // Auto-remover después del tiempo especificado
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      }, newNotification.duration)
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearAll: () => {
    set({ notifications: [] })
  },
}))

// Hook de utilidad para notificaciones rápidas
export const useNotifications = () => {
  const { addNotification, removeNotification, clearAll } = useNotificationStore()

  return {
    success: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'success', title, message, duration })
    },
    error: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'error', title, message, duration })
    },
    warning: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'warning', title, message, duration })
    },
    info: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'info', title, message, duration })
    },
    remove: removeNotification,
    clearAll,
  }
}
