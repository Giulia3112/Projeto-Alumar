import { create } from 'zustand'

interface Invoice {
  id: string
  invoiceId: string
  supplier: string
  total: number
  status: 'PENDING_VALIDATION' | 'VALIDATED' | 'PROCESSED' | 'ERROR'
  validationStatus: 'READING' | 'VALIDATING' | 'READY'
  xmlData?: string
  jsonData?: any
  createdAt: string
  updatedAt: string
  divergences: Divergence[]
}

interface Divergence {
  id: string
  type: string
  message: string
  status: 'PENDING' | 'RESOLVED' | 'IGNORED'
  createdAt: string
  resolvedAt?: string
  resolution?: string
}

interface InvoiceState {
  invoices: Invoice[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchInvoices: () => Promise<void>
  fetchInvoice: (id: string) => Promise<Invoice | null>
  validateInvoice: (id: string) => Promise<boolean>
  updateInvoiceStatus: (id: string, status: Invoice['status']) => Promise<boolean>
  addDivergence: (invoiceId: string, divergence: Omit<Divergence, 'id' | 'createdAt'>) => void
  resolveDivergence: (invoiceId: string, divergenceId: string, resolution: string) => Promise<boolean>
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  isLoading: false,
  error: null,

  fetchInvoices: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('http://localhost:3001/api/invoices')
      const data = await response.json()
      
      if (data.success) {
        set({ invoices: data.data, isLoading: false })
      } else {
        set({ error: 'Failed to fetch invoices', isLoading: false })
      }
    } catch (error) {
      set({ error: 'Network error while fetching invoices', isLoading: false })
    }
  },

  fetchInvoice: async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/invoices/${id}`)
      const data = await response.json()
      
      if (data.success) {
        // Update the invoice in the store
        set(state => ({
          invoices: state.invoices.map(inv => 
            inv.id === id ? data.data : inv
          )
        }))
        return data.data
      }
      return null
    } catch (error) {
      set({ error: 'Network error while fetching invoice' })
      return null
    }
  },

  validateInvoice: async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/invoices/${id}/validate`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        // Update the invoice in the store
        set(state => ({
          invoices: state.invoices.map(inv => 
            inv.id === id ? data.data : inv
          )
        }))
        return true
      }
      return false
    } catch (error) {
      set({ error: 'Network error while validating invoice' })
      return false
    }
  },

  updateInvoiceStatus: async (id: string, status: Invoice['status']) => {
    try {
      const response = await fetch(`http://localhost:3001/api/invoices/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      const data = await response.json()
      
      if (data.success) {
        set(state => ({
          invoices: state.invoices.map(inv => 
            inv.id === id ? data.data : inv
          )
        }))
        return true
      }
      return false
    } catch (error) {
      set({ error: 'Network error while updating invoice status' })
      return false
    }
  },

  addDivergence: (invoiceId: string, divergence: Omit<Divergence, 'id' | 'createdAt'>) => {
    const newDivergence: Divergence = {
      ...divergence,
      id: `div-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }

    set(state => ({
      invoices: state.invoices.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, divergences: [...inv.divergences, newDivergence] }
          : inv
      )
    }))
  },

  resolveDivergence: async (invoiceId: string, divergenceId: string, resolution: string) => {
    set(state => ({
      invoices: state.invoices.map(inv => 
        inv.id === invoiceId 
          ? {
              ...inv,
              divergences: inv.divergences.map(div => 
                div.id === divergenceId 
                  ? { ...div, status: 'RESOLVED', resolution, resolvedAt: new Date().toISOString() }
                  : div
              )
            }
          : inv
      )
    }))
    
    return true
  }
}))
