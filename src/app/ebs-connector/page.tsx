'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  RefreshCw,
  Download,
  Eye,
  ArrowRight
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface EBSInvoice {
  id: number
  invoiceId: string
  supplier: string
  total: number
  status: string
  date: string
  xmlData: string
  jsonData: any
}

export default function EBSConnectorPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [invoices, setInvoices] = useState<EBSInvoice[]>([])
  const [connectionDetails, setConnectionDetails] = useState<any>(null)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/ebs/test-connection')
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

  const fetchEBSData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ebs/data')
      const data = await response.json()
      
      if (data.success) {
        setInvoices(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch EBS data:', error)
    }
  }

  useEffect(() => {
    fetchEBSData()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending Validation': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'Validated': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Processing': { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
      'Error': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending Validation']
    const IconComponent = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">EBS Connector</h1>
          <p className="text-gray-600 mt-2">
            Integração com ERP para captura de dados de compras e faturas
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary-600" />
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
                    <p><strong>Host:</strong> {connectionDetails.host}</p>
                    <p><strong>Database:</strong> {connectionDetails.database}</p>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={testConnection} 
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Testar Conexão
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* EBS Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary-600" />
                Dados do EBS
              </CardTitle>
              <Button 
                onClick={fetchEBSData}
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
              {invoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{invoice.invoiceId}</h3>
                      <p className="text-sm text-gray-600">{invoice.supplier}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(invoice.status)}
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        R$ {invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Data: {new Date(invoice.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="btn-outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver XML
                    </Button>
                    <Button variant="outline" size="sm" className="btn-outline">
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
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
                  <li>• Conexão simulada com EBS</li>
                  <li>• Captura de dados de faturas</li>
                  <li>• Validação de XML/JSON</li>
                  <li>• Status de processamento</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Próximas Implementações</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Integração real com API EBS</li>
                  <li>• Sincronização automática</li>
                  <li>• Filtros avançados</li>
                  <li>• Relatórios de integração</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
