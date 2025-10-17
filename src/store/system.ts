import { create } from 'zustand'

interface ConnectionStatus {
  ebs: 'connected' | 'disconnected' | 'error'
  edap: 'connected' | 'disconnected' | 'error'
  database: 'connected' | 'disconnected' | 'error'
}

interface SystemState {
  connectionStatus: ConnectionStatus
  notifications: Notification[]
  updateConnectionStatus: (system: keyof ConnectionStatus, status: ConnectionStatus[keyof ConnectionStatus]) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export const useSystemStore = create<SystemState>((set, get) => ({
  connectionStatus: {
    ebs: 'disconnected',
    edap: 'disconnected',
    database: 'disconnected'
  },
  notifications: [],

  updateConnectionStatus: (system, status) => {
    set(state => ({
      connectionStatus: {
        ...state.connectionStatus,
        [system]: status
      }
    }))

    // Add notification for connection changes
    const statusMessages = {
      connected: 'Conexão estabelecida com sucesso',
      disconnected: 'Conexão perdida',
      error: 'Erro na conexão'
    }

    get().addNotification({
      type: status === 'connected' ? 'success' : status === 'error' ? 'error' : 'warning',
      title: `${system.toUpperCase()} - ${statusMessages[status]}`,
      message: `Sistema ${system.toUpperCase()} ${statusMessages[status].toLowerCase()}`,
      timestamp: new Date(),
      read: false
    })
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }

    set(state => ({
      notifications: [newNotification, ...state.notifications]
    }))
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  }
}))
