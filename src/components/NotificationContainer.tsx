"use client"

import { useNotificationStore } from "@/store/Notification"
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore()

  // Iconos por tipo de notificación
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <XCircle className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'info':
        return <Info className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  // Clases de estilo por tipo
  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          border: 'border-green-500/20',
          icon: 'text-green-600',
          bgLight: 'bg-green-50',
        }
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-rose-500',
          border: 'border-red-500/20',
          icon: 'text-red-600',
          bgLight: 'bg-red-50',
        }
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          border: 'border-yellow-500/20',
          icon: 'text-yellow-600',
          bgLight: 'bg-yellow-50',
        }
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          border: 'border-blue-500/20',
          icon: 'text-blue-600',
          bgLight: 'bg-blue-50',
        }
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-slate-500',
          border: 'border-gray-500/20',
          icon: 'text-gray-600',
          bgLight: 'bg-gray-50',
        }
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((notification) => {
        const styles = getStyles(notification.type)

        return (
          <div
            key={notification.id}
            className="pointer-events-auto animate-slideInRight"
          >
            {/* Notificación */}
            <div className={`relative overflow-hidden rounded-2xl shadow-2xl border ${styles.border} bg-white/95 backdrop-blur-xl`}>
              {/* Barra superior de color */}
              <div className={`h-1 ${styles.bg}`} />

              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icono */}
                  <div className={`flex-shrink-0 ${styles.icon}`}>
                    {notification.icon || getIcon(notification.type)}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-graydark mb-1">
                      {notification.title}
                    </p>
                    {notification.message && (
                      <p className="text-xs text-graydark/70 leading-relaxed">
                        {notification.message}
                      </p>
                    )}
                  </div>

                  {/* Botón cerrar */}
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="flex-shrink-0 text-graydark/40 hover:text-graydark transition-colors p-1 hover:bg-gray-100 rounded-lg"
                    aria-label="Cerrar notificación"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Barra de progreso (opcional) */}
              {notification.duration && notification.duration > 0 && (
                <div className="h-1 bg-gray-200">
                  <div
                    className={`h-full ${styles.bg} animate-shrinkWidth`}
                    style={{
                      animationDuration: `${notification.duration}ms`,
                      animationTimingFunction: 'linear'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
