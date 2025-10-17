'use client'

import { useEffect } from 'react'
import { useSystemStore } from '@/store/system'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'

interface NotificationItemProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  onRemove: (id: string) => void
}

function NotificationItem({ id, type, title, message, timestamp, read, onRemove }: NotificationItemProps) {
  const typeConfig = {
    success: { color: 'bg-green-50 border-green-200', icon: CheckCircle, iconColor: 'text-green-600' },
    error: { color: 'bg-red-50 border-red-200', icon: XCircle, iconColor: 'text-red-600' },
    warning: { color: 'bg-yellow-50 border-yellow-200', icon: AlertTriangle, iconColor: 'text-yellow-600' },
    info: { color: 'bg-blue-50 border-blue-200', icon: Info, iconColor: 'text-blue-600' }
  }

  const config = typeConfig[type]
  const IconComponent = config.icon

  useEffect(() => {
    // Auto-remove after 5 seconds
    const timer = setTimeout(() => {
      onRemove(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onRemove])

  return (
    <div className={`border rounded-lg p-4 ${config.color} ${read ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <IconComponent className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            <p className="text-xs text-gray-500 mt-2">
              {timestamp.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
        <button
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useSystemStore()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  )
}
