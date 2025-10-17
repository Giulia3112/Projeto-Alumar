import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'operator'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Alumar',
    email: 'admin@alumar.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Operador Fiscal',
    email: 'fiscal@alumar.com',
    role: 'operator'
  },
  {
    id: '3',
    name: 'Usuário Teste',
    email: 'user@alumar.com',
    role: 'user'
  }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock authentication logic
        const user = mockUsers.find(u => u.email === email && password === '123456')
        
        if (user) {
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          })
          return true
        } else {
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)
