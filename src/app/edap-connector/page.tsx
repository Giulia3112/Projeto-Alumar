'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  RefreshCw,
  Send,
  Eye,
  ExternalLink
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface EDAPResponse {
  id: string
  status: string
  message: string
  timestamp: string
  invoiceId: string
  errors?: string[]
}

export default function EDAPConnectorPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [responses, setResponses] = useState<EDAPResponse[]>([])
  const [connectionDetails, setConnectionDetails] = useState<any>(null)
  const [sendingData, setSendingData] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/edap/test-connection')
      const data = await response.json()
      
      if (data.success) {
        setIsConnected(true)
        setConnectionDetails(data.connectionDetails)
      }
    } catch (error) {
      console.error('Connection test failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEDAPResponses = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/edap/responses')
      const data = await response.json()
      
      if (data.success) {
        setResponses(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch EDAP responses:', error)
    }
  }

  const sendToEDAP = async (invoiceData: any) => {
    setSendingData(true)
    try {
      const response = await fetch('http://localhost:3001/api/edap/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceData,
          action: 'SEND_TO_SEFAZ'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh responses after sending
        fetchEDAPResponses()
      }
      
      return data
    } catch (error) {
      console.error('Failed to send data to EDAP:', error)
      return { success: false, message: 'Failed to send data to EDAP' }
    } finally {
      setSendingData(false)
    }
  }

  useEffect(() => {
    fetchEDAPResponses()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'SUCCESS': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
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

  const mockInvoiceData = {
    invoiceId: `NF-TEST-${Date.now()}`,
    supplier: 'Teste Alumar',
    total: 15000.00,
    xmlData: '<?xml version="1.0" encoding="UTF-8"?><nfeProc>...</nfeProc>'
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">EDAP Connector</h1>
          <p className="text-gray-600 mt-2">
            Integração com sistema fiscal para envio de NF-e
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary-600" />
              Status da Conexão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </div>
                
                {connectionDetails && (
                  <div className="text-sm text-gray-600">
                    <p><strong>Endpoint:</strong> {connectionDetails.endpoint}</p>
                    <p><strong>Versão:</strong> {connectionDetails.version}</p>
                    <p><strong>Última Sincronização:</strong> {new Date(connectionDetails.lastSync).toLocaleString('pt-BR')}</p>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={testConnection} 
                disabled={isLoading}
                className="btn-secondary"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Testar Conexão
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Send Data to EDAP */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-secondary-600" />
              Enviar Dados para EDAP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Dados de Teste</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Invoice ID:</strong> {mockInvoiceData.invoiceId}</p>
                  <p><strong>Fornecedor:</strong> {mockInvoiceData.supplier}</p>
                  <p><strong>Valor:</strong> R$ {mockInvoiceData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => sendToEDAP(mockInvoiceData)}
                disabled={sendingData || !isConnected}
                className="btn-secondary w-full"
              >
                {sendingData ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Enviando para EDAP...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar para EDAP
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* EDAP Responses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-secondary-600" />
                Respostas do EDAP
              </CardTitle>
              <Button 
                onClick={fetchEDAPResponses}
                variant="outline"
                className="btn-outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {responses.map((response) => (
                <div 
                  key={response.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{response.invoiceId}</h3>
                      <p className="text-sm text-gray-600">{response.message}</p>
                    </div>
                    {getStatusBadge(response.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>ID: {response.id}</span>
                    <span>•</span>
                    <span>{new Date(response.timestamp).toLocaleString('pt-BR')}</span>
                  </div>
                  
                  {response.errors && response.errors.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">Erros:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {response.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integration Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Integração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Funcionalidades Atuais</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Conexão simulada com EDAP</li>
                  <li>• Envio de dados para SEFAZ</li>
                  <li>• Monitoramento de respostas</li>
                  <li>• Tratamento de erros</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Próximas Implementações</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Integração real com API EDAP</li>
                  <li>• Manifestações automáticas</li>
                  <li>• Consulta de status SEFAZ</li>
                  <li>• Relatórios fiscais</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
