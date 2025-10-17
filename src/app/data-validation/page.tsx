'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  RefreshCw,
  Eye,
  FileText,
  CheckSquare,
  XCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface Invoice {
  id: string
  invoiceId: string
  supplier: string
  total: number
  status: string
  validationStatus: string
  xmlData: string
  createdAt: string
  divergences: any[]
}

export default function DataValidationPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [validatingInvoice, setValidatingInvoice] = useState<string | null>(null)

  const fetchInvoices = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/invoices')
      const data = await response.json()
      
      if (data.success) {
        setInvoices(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateInvoice = async (invoiceId: string) => {
    setValidatingInvoice(invoiceId)
    try {
      const response = await fetch(`http://localhost:3001/api/invoices/${invoiceId}/validate`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        // Refresh invoices after validation
        fetchInvoices()
      }
    } catch (error) {
      console.error('Failed to validate invoice:', error)
    } finally {
      setValidatingInvoice(null)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING_VALIDATION': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'VALIDATED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'ERROR': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['PENDING_VALIDATION']
    const IconComponent = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getValidationStatusBadge = (status: string) => {
    const statusConfig = {
      'READING': { color: 'bg-blue-100 text-blue-800', icon: FileText },
      'VALIDATING': { color: 'bg-orange-100 text-orange-800', icon: RefreshCw },
      'READY': { color: 'bg-green-100 text-green-800', icon: CheckSquare }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['READING']
    const IconComponent = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const getStepIndicator = (invoice: Invoice) => {
    const steps = [
      { key: 'READING', label: 'Lendo XML', icon: FileText },
      { key: 'VALIDATING', label: 'Validando', icon: RefreshCw },
      { key: 'READY', label: 'Pronto', icon: CheckCircle }
    ]

    return (
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isActive = invoice.validationStatus === step.key
          const isCompleted = steps.findIndex(s => s.key === invoice.validationStatus) > index
          const IconComponent = step.icon
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                isCompleted 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : isActive 
                    ? 'bg-primary-500 border-primary-500 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 ml-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Validação de Dados</h1>
          <p className="text-gray-600 mt-2">
            Leitura e validação de dados de NF-e do EBS
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Faturas</p>
                  <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Validadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {invoices.filter(inv => inv.status === 'VALIDATED').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Com Erros</p>
                  <p className="text-2xl font-bold text-red-600">
                    {invoices.filter(inv => inv.status === 'ERROR').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {invoices.filter(inv => inv.status === 'PENDING_VALIDATION').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                Faturas para Validação
              </CardTitle>
              <Button 
                onClick={fetchInvoices}
                disabled={isLoading}
                variant="outline"
                className="btn-outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {invoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceId}</h3>
                      <p className="text-sm text-gray-600">{invoice.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        R$ {invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(invoice.status)}
                        {getValidationStatusBadge(invoice.validationStatus)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Step Indicator */}
                  <div className="mb-4">
                    {getStepIndicator(invoice)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Criado em: {new Date(invoice.createdAt).toLocaleString('pt-BR')}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="btn-outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver XML
                      </Button>
                      
                      {invoice.validationStatus !== 'VALIDATING' && (
                        <Button 
                          onClick={() => validateInvoice(invoice.id)}
                          disabled={validatingInvoice === invoice.id}
                          size="sm"
                          className="btn-primary"
                        >
                          {validatingInvoice === invoice.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                              Validando...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Validar
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Divergences */}
                  {invoice.divergences && invoice.divergences.length > 0 && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2 flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        Divergências Detectadas ({invoice.divergences.length})
                      </h4>
                      <div className="space-y-2">
                        {invoice.divergences.map((divergence, index) => (
                          <div key={index} className="text-sm text-red-700">
                            <span className="font-medium">{divergence.type}:</span> {divergence.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
