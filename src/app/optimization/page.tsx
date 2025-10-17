'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
  Calendar
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface KPIData {
  totalInvoices: number
  successRate: number
  avgProcessingTime: number
  divergenceRate: number
  totalAmount: number
  processedToday: number
  errorCount: number
  avgValidationTime: number
}

export default function OptimizationPage() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  // Mock KPI data
  const mockKPIData: KPIData = {
    totalInvoices: 1247,
    successRate: 94.2,
    avgProcessingTime: 2.3,
    divergenceRate: 5.8,
    totalAmount: 15750000.50,
    processedToday: 45,
    errorCount: 23,
    avgValidationTime: 1.2
  }

  // Mock chart data
  const processingTimeData = [
    { day: '01/01', time: 2.1 },
    { day: '02/01', time: 2.3 },
    { day: '03/01', time: 2.0 },
    { day: '04/01', time: 2.5 },
    { day: '05/01', time: 2.2 },
    { day: '06/01', time: 2.1 },
    { day: '07/01', time: 2.0 }
  ]

  const successRateData = [
    { day: '01/01', rate: 92.5 },
    { day: '02/01', rate: 94.1 },
    { day: '03/01', rate: 95.2 },
    { day: '04/01', rate: 93.8 },
    { day: '05/01', rate: 94.5 },
    { day: '06/01', rate: 94.8 },
    { day: '07/01', rate: 94.2 }
  ]

  const volumeData = [
    { day: '01/01', invoices: 180, amount: 2400000 },
    { day: '02/01', invoices: 195, amount: 2600000 },
    { day: '03/01', invoices: 165, amount: 2200000 },
    { day: '04/01', invoices: 210, amount: 2800000 },
    { day: '05/01', invoices: 185, amount: 2500000 },
    { day: '06/01', invoices: 175, amount: 2300000 },
    { day: '07/01', invoices: 200, amount: 2700000 }
  ]

  const supplierPerformance = [
    { supplier: 'Vale Alumínio', invoices: 450, successRate: 96.2, avgTime: 1.8 },
    { supplier: 'Alcoa Brasil', invoices: 320, successRate: 94.5, avgTime: 2.1 },
    { supplier: 'Hydro Alunorte', invoices: 280, successRate: 92.1, avgTime: 2.5 },
    { supplier: 'Rusal Brasil', invoices: 197, successRate: 95.8, avgTime: 1.9 }
  ]

  useEffect(() => {
    setKpiData(mockKPIData)
  }, [])

  const getPerformanceBadge = (value: number, type: 'rate' | 'time') => {
    if (type === 'rate') {
      if (value >= 95) return { color: 'bg-green-100 text-green-800', icon: TrendingUp }
      if (value >= 90) return { color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp }
      return { color: 'bg-red-100 text-red-800', icon: TrendingDown }
    } else {
      if (value <= 2) return { color: 'bg-green-100 text-green-800', icon: TrendingUp }
      if (value <= 3) return { color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp }
      return { color: 'bg-red-100 text-red-800', icon: TrendingDown }
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Otimização</h1>
            <p className="text-gray-600 mt-2">
              Análise de KPIs e estatísticas do sistema
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="btn-outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" className="btn-outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              onClick={() => setIsLoading(!isLoading)}
              variant="outline"
              className="btn-outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <Button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              className={selectedPeriod === period ? 'btn-primary' : 'btn-outline'}
              size="sm"
            >
              {period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : '90 dias'}
            </Button>
          ))}
        </div>

        {/* KPI Cards */}
        {kpiData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Faturas</p>
                    <p className="text-2xl font-bold text-gray-900">{kpiData.totalInvoices.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">+12.5% vs mês anterior</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-green-600">{kpiData.successRate}%</p>
                    <p className="text-xs text-gray-500">+2.1% vs mês anterior</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                    <p className="text-2xl font-bold text-blue-600">{kpiData.avgProcessingTime} min</p>
                    <p className="text-xs text-gray-500">-15% vs mês anterior</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Divergências</p>
                    <p className="text-2xl font-bold text-orange-600">{kpiData.divergenceRate}%</p>
                    <p className="text-xs text-gray-500">-5.2% vs mês anterior</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Processing Time Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary-600" />
                Tendência de Tempo de Processamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processingTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="time" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Success Rate Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                Tendência de Taxa de Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={successRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="rate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              Volume de Processamento Diário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [
                    name === 'invoices' ? value : `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    name === 'invoices' ? 'Faturas' : 'Valor'
                  ]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="invoices" fill="#8884d8" name="Faturas" />
                  <Bar yAxisId="right" dataKey="amount" fill="#82ca9d" name="Valor (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary-600" />
              Performance por Fornecedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplierPerformance.map((supplier, index) => {
                const rateBadge = getPerformanceBadge(supplier.successRate, 'rate')
                const timeBadge = getPerformanceBadge(supplier.avgTime, 'time')
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{supplier.supplier}</h3>
                        <p className="text-sm text-gray-600">{supplier.invoices} faturas processadas</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${rateBadge.color} flex items-center gap-1`}>
                          <rateBadge.icon className="h-3 w-3" />
                          {supplier.successRate}% sucesso
                        </Badge>
                        <Badge className={`${timeBadge.color} flex items-center gap-1`}>
                          <timeBadge.icon className="h-3 w-3" />
                          {supplier.avgTime}min médio
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${supplier.successRate}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
