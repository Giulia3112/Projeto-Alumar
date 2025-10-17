'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye,
  RefreshCw,
  Send,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface Manifestation {
  id: string
  invoiceId: string
  supplier: string
  total: number
  manifestationType: 'CONFIRM_OPERATION' | 'DENY_OPERATION' | 'AWARE_OPERATION' | null
  status: string
  protocol: string
  createdAt: string
  processedAt?: string
}

export default function ManifestationsPage() {
  const [manifestations, setManifestations] = useState<Manifestation[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Mock data
  const mockManifestations: Manifestation[] = [
    {
      id: 'MAN001',
      invoiceId: 'NF001-2024',
      supplier: 'Vale Alumínio',
      total: 10234.50,
      manifestationType: 'CONFIRM_OPERATION',
      status: 'PROCESSED',
      protocol: 'SEFAZ-MAN-001',
      createdAt: '2024-01-15T10:00:00Z',
      processedAt: '2024-01-15T10:05:00Z'
    },
    {
      id: 'MAN002',
      invoiceId: 'NF002-2024',
      supplier: 'Alcoa Brasil',
      total: 5421.00,
      manifestationType: null,
      status: 'PENDING',
      protocol: '',
      createdAt: '2024-01-15T11:00:00Z'
    },
    {
      id: 'MAN003',
      invoiceId: 'NF003-2024',
      supplier: 'Hydro Alunorte',
      total: 8756.25,
      manifestationType: 'AWARE_OPERATION',
      status: 'PROCESSING',
      protocol: 'SEFAZ-MAN-003',
      createdAt: '2024-01-15T12:00:00Z'
    }
  ]

  useEffect(() => {
    setManifestations(mockManifestations)
  }, [])

  const processManifestation = async (manifestationId: string, type: 'CONFIRM_OPERATION' | 'DENY_OPERATION' | 'AWARE_OPERATION') => {
    setIsProcessing(true)
    setProcessingId(manifestationId)

    try {
      // Simulate API call
      const response = await fetch('http://localhost:3001/api/edap/manifestation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: manifestations.find(m => m.id === manifestationId)?.invoiceId,
          manifestationType: type
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update manifestation
        setManifestations(prev => 
          prev.map(m => 
            m.id === manifestationId 
              ? {
                  ...m,
                  manifestationType: type,
                  status: 'PROCESSED',
                  protocol: data.data.protocol,
                  processedAt: data.data.timestamp
                }
              : m
          )
        )
      }
    } catch (error) {
      console.error('Failed to process manifestation:', error)
    } finally {
      setIsProcessing(false)
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'PROCESSING': { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
      'PROCESSED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'ERROR': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['PENDING']
    const IconComponent = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const getManifestationTypeBadge = (type: string | null) => {
    if (!type) return null

    const typeConfig = {
      'CONFIRM_OPERATION': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Confirmar Operação' },
      'DENY_OPERATION': { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Negar Operação' },
      'AWARE_OPERATION': { color: 'bg-blue-100 text-blue-800', icon: Eye, label: 'Ciente da Operação' }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig]
    const IconComponent = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const stats = {
    total: manifestations.length,
    pending: manifestations.filter(m => m.status === 'PENDING').length,
    processed: manifestations.filter(m => m.status === 'PROCESSED').length,
    processing: manifestations.filter(m => m.status === 'PROCESSING').length
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manifestações</h1>
          <p className="text-gray-600 mt-2">
            Comunicação com SEFAZ para manifestações de NF-e
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Manifestações</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processadas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.processed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processando</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manifestations List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              Manifestações de NF-e
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {manifestations.map((manifestation) => (
                <div 
                  key={manifestation.id} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{manifestation.invoiceId}</h3>
                      <p className="text-sm text-gray-600">{manifestation.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        R$ {manifestation.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(manifestation.status)}
                        {getManifestationTypeBadge(manifestation.manifestationType)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Criado em: {new Date(manifestation.createdAt).toLocaleString('pt-BR')}</p>
                    {manifestation.processedAt && (
                      <p>Processado em: {new Date(manifestation.processedAt).toLocaleString('pt-BR')}</p>
                    )}
                    {manifestation.protocol && (
                      <p>Protocolo: {manifestation.protocol}</p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  {manifestation.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => processManifestation(manifestation.id, 'CONFIRM_OPERATION')}
                        disabled={isProcessing && processingId === manifestation.id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirmar Operação
                      </Button>
                      
                      <Button
                        onClick={() => processManifestation(manifestation.id, 'DENY_OPERATION')}
                        disabled={isProcessing && processingId === manifestation.id}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Negar Operação
                      </Button>
                      
                      <Button
                        onClick={() => processManifestation(manifestation.id, 'AWARE_OPERATION')}
                        disabled={isProcessing && processingId === manifestation.id}
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ciente da Operação
                      </Button>
                    </div>
                  )}
                  
                  {isProcessing && processingId === manifestation.id && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processando manifestação...
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações sobre Manifestações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-900">Confirmar Operação</h4>
                <p className="text-sm text-green-700 mt-1">
                  Confirma o recebimento e aceita a operação comercial
                </p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold text-red-900">Negar Operação</h4>
                <p className="text-sm text-red-700 mt-1">
                  Informa desconhecimento ou rejeição da operação
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-900">Ciente da Operação</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Informa ciência da operação sem confirmação
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
