'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  RefreshCw,
  Send,
  Database,
  Calculator,
  Package
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface ERPTransaction {
  id: string
  invoiceId: string
  supplier: string
  total: number
  status: string
  type: 'PHYSICAL' | 'FISCAL' | 'FINANCIAL'
  createdAt: string
  completedAt?: string
  logs: string[]
}

export default function ERPPostingPage() {
  const [transactions, setTransactions] = useState<ERPTransaction[]>([])
  const [isPosting, setIsPosting] = useState(false)
  const [selectedType, setSelectedType] = useState<'PHYSICAL' | 'FISCAL' | 'FINANCIAL' | 'ALL'>('ALL')

  // Mock data
  const mockTransactions: ERPTransaction[] = [
    {
      id: 'TXN001',
      invoiceId: 'NF001-2024',
      supplier: 'Vale Alumínio',
      total: 10234.50,
      status: 'COMPLETED',
      type: 'PHYSICAL',
      createdAt: '2024-01-15T10:00:00Z',
      completedAt: '2024-01-15T10:05:00Z',
      logs: [
        'Iniciando lançamento físico...',
        'Validando dados de estoque...',
        'Atualizando inventário...',
        'Lançamento físico concluído com sucesso'
      ]
    },
    {
      id: 'TXN002',
      invoiceId: 'NF002-2024',
      supplier: 'Alcoa Brasil',
      total: 5421.00,
      status: 'PROCESSING',
      type: 'FISCAL',
      createdAt: '2024-01-15T11:00:00Z',
      logs: [
        'Iniciando lançamento fiscal...',
        'Calculando impostos...',
        'Processando ICMS...'
      ]
    },
    {
      id: 'TXN003',
      invoiceId: 'NF003-2024',
      supplier: 'Hydro Alunorte',
      total: 8756.25,
      status: 'PENDING',
      type: 'FINANCIAL',
      createdAt: '2024-01-15T12:00:00Z',
      logs: []
    }
  ]

  useEffect(() => {
    setTransactions(mockTransactions)
  }, [])

  const simulateERPPosting = async (type: 'PHYSICAL' | 'FISCAL' | 'FINANCIAL') => {
    setIsPosting(true)
    
    const newTransaction: ERPTransaction = {
      id: `TXN${Date.now()}`,
      invoiceId: `NF-TEST-${Date.now()}`,
      supplier: 'Teste Alumar',
      total: Math.random() * 10000 + 1000,
      status: 'PROCESSING',
      type,
      createdAt: new Date().toISOString(),
      logs: [`Iniciando lançamento ${type.toLowerCase()}...`]
    }

    setTransactions(prev => [newTransaction, ...prev])

    // Simulate processing
    setTimeout(() => {
      newTransaction.status = 'COMPLETED'
      newTransaction.completedAt = new Date().toISOString()
      newTransaction.logs.push(`${type} lançamento concluído com sucesso`)
      
      setTransactions(prev => 
        prev.map(t => t.id === newTransaction.id ? newTransaction : t)
      )
      setIsPosting(false)
    }, 3000)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'PROCESSING': { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
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

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'PHYSICAL': { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Físico' },
      'FISCAL': { color: 'bg-purple-100 text-purple-800', icon: Calculator, label: 'Fiscal' },
      'FINANCIAL': { color: 'bg-green-100 text-green-800', icon: TrendingUp, label: 'Financeiro' }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig['PHYSICAL']
    const IconComponent = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const filteredTransactions = selectedType === 'ALL' 
    ? transactions 
    : transactions.filter(t => t.type === selectedType)

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'COMPLETED').length,
    processing: transactions.filter(t => t.status === 'PROCESSING').length,
    pending: transactions.filter(t => t.status === 'PENDING').length
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lançamento ERP</h1>
          <p className="text-gray-600 mt-2">
            Simulação de lançamentos físicos, fiscais e financeiros
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Transações</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Database className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
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
        </div>

        {/* Simulate Posting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary-600" />
              Simular Lançamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => simulateERPPosting('PHYSICAL')}
                disabled={isPosting}
                className="btn-primary h-20 flex flex-col items-center justify-center"
              >
                <Package className="h-6 w-6 mb-2" />
                Lançamento Físico
              </Button>
              
              <Button 
                onClick={() => simulateERPPosting('FISCAL')}
                disabled={isPosting}
                className="btn-primary h-20 flex flex-col items-center justify-center"
              >
                <Calculator className="h-6 w-6 mb-2" />
                Lançamento Fiscal
              </Button>
              
              <Button 
                onClick={() => simulateERPPosting('FINANCIAL')}
                disabled={isPosting}
                className="btn-primary h-20 flex flex-col items-center justify-center"
              >
                <TrendingUp className="h-6 w-6 mb-2" />
                Lançamento Financeiro
              </Button>
            </div>
            
            {isPosting && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processando lançamento no ERP...
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filter */}
        <div className="flex gap-2">
          {(['ALL', 'PHYSICAL', 'FISCAL', 'FINANCIAL'] as const).map((type) => (
            <Button
              key={type}
              onClick={() => setSelectedType(type)}
              variant={selectedType === type ? 'default' : 'outline'}
              className={selectedType === type ? 'btn-primary' : 'btn-outline'}
            >
              {type === 'ALL' ? 'Todos' : getTypeBadge(type).props.children[1]}
            </Button>
          ))}
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              Histórico de Lançamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{transaction.invoiceId}</h3>
                      <p className="text-sm text-gray-600">{transaction.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        R$ {transaction.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(transaction.status)}
                        {getTypeBadge(transaction.type)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-3">
                    <p>Criado em: {new Date(transaction.createdAt).toLocaleString('pt-BR')}</p>
                    {transaction.completedAt && (
                      <p>Concluído em: {new Date(transaction.completedAt).toLocaleString('pt-BR')}</p>
                    )}
                  </div>
                  
                  {/* Logs */}
                  {transaction.logs && transaction.logs.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 mb-2">Logs de Processamento:</h4>
                      <div className="space-y-1">
                        {transaction.logs.map((log, index) => (
                          <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            {log}
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
