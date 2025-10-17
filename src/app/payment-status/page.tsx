'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts'

interface Payment {
  id: string
  invoiceId: string
  supplier: string
  amount: number
  status: 'PENDING' | 'PAID' | 'OVERDUE'
  dueDate: string
  paidAt?: string
  createdAt: string
}

export default function PaymentStatusPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock data
  const mockPayments: Payment[] = [
    {
      id: 'PAY001',
      invoiceId: 'NF001-2024',
      supplier: 'Vale Alumínio',
      amount: 10234.50,
      status: 'PAID',
      dueDate: '2024-01-10',
      paidAt: '2024-01-08',
      createdAt: '2024-01-01'
    },
    {
      id: 'PAY002',
      invoiceId: 'NF002-2024',
      supplier: 'Alcoa Brasil',
      amount: 5421.00,
      status: 'PENDING',
      dueDate: '2024-01-20',
      createdAt: '2024-01-05'
    },
    {
      id: 'PAY003',
      invoiceId: 'NF003-2024',
      supplier: 'Hydro Alunorte',
      amount: 8756.25,
      status: 'OVERDUE',
      dueDate: '2024-01-05',
      createdAt: '2023-12-20'
    },
    {
      id: 'PAY004',
      invoiceId: 'NF004-2024',
      supplier: 'Rusal Brasil',
      amount: 12345.67,
      status: 'PENDING',
      dueDate: '2024-01-25',
      createdAt: '2024-01-10'
    },
    {
      id: 'PAY005',
      invoiceId: 'NF005-2024',
      supplier: 'Mineração Rio do Norte',
      amount: 9876.54,
      status: 'PAID',
      dueDate: '2024-01-15',
      paidAt: '2024-01-12',
      createdAt: '2024-01-08'
    }
  ]

  useEffect(() => {
    setPayments(mockPayments)
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'PAID': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'OVERDUE': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['PENDING']
    const IconComponent = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status === 'PENDING' ? 'Pendente' : status === 'PAID' ? 'Pago' : 'Vencido'}
      </Badge>
    )
  }

  const stats = {
    total: payments.length,
    paid: payments.filter(p => p.status === 'PAID').length,
    pending: payments.filter(p => p.status === 'PENDING').length,
    overdue: payments.filter(p => p.status === 'OVERDUE').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    paidAmount: payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: payments.filter(p => p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0)
  }

  // Chart data
  const pieChartData = [
    { name: 'Pagos', value: stats.paid, color: '#10b981' },
    { name: 'Pendentes', value: stats.pending, color: '#f59e0b' },
    { name: 'Vencidos', value: stats.overdue, color: '#ef4444' }
  ]

  const amountChartData = [
    { name: 'Pagos', amount: stats.paidAmount, color: '#10b981' },
    { name: 'Pendentes', amount: stats.pendingAmount, color: '#f59e0b' },
    { name: 'Vencidos', amount: stats.overdueAmount, color: '#ef4444' }
  ]

  const monthlyData = [
    { month: 'Jan', paid: 45000, pending: 25000, overdue: 5000 },
    { month: 'Fev', paid: 52000, pending: 18000, overdue: 3000 },
    { month: 'Mar', paid: 48000, pending: 22000, overdue: 7000 },
    { month: 'Abr', paid: 55000, pending: 20000, overdue: 4000 }
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Status de Pagamento</h1>
          <p className="text-gray-600 mt-2">
            Visualização do status de pagamento de faturas
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Faturas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">
                    R$ {stats.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pagas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                  <p className="text-xs text-gray-500">
                    R$ {stats.paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-xs text-gray-500">
                    R$ {stats.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vencidas</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                  <p className="text-xs text-gray-500">
                    R$ {stats.overdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary-600" />
                Distribuição por Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <PieChart
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </PieChart>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Amount Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary-600" />
                Valores por Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={amountChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']} />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              Tendência Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']} />
                  <Legend />
                  <Bar dataKey="paid" stackId="a" fill="#10b981" name="Pagas" />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pendentes" />
                  <Bar dataKey="overdue" stackId="a" fill="#ef4444" name="Vencidas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary-600" />
                Lista de Pagamentos
              </CardTitle>
              <Button 
                onClick={() => setPayments([...mockPayments])}
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
            <div className="space-y-4">
              {payments.map((payment) => (
                <div 
                  key={payment.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{payment.invoiceId}</h3>
                      <p className="text-sm text-gray-600">{payment.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Vencimento:</span>
                      <p>{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="font-medium">Criado em:</span>
                      <p>{new Date(payment.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    {payment.paidAt && (
                      <div>
                        <span className="font-medium">Pago em:</span>
                        <p>{new Date(payment.paidAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                  </div>
                  
                  {payment.status === 'OVERDUE' && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Pagamento em atraso!</span>
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
