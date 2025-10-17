import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Database, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3,
  ArrowRight,
  Users,
  DollarSign,
  Clock
} from 'lucide-react'
import Link from 'next/link'

const modules = [
  {
    name: 'EBS Connector',
    description: 'Integração com ERP para captura de dados de compras e faturas',
    href: '/ebs-connector',
    icon: Database,
    color: 'bg-blue-500',
    stats: { processed: 1247, total: 1500 }
  },
  {
    name: 'EDAP Connector',
    description: 'Integração com sistema fiscal para envio de NF-e',
    href: '/edap-connector',
    icon: FileText,
    color: 'bg-green-500',
    stats: { processed: 1180, total: 1247 }
  },
  {
    name: 'Validação de Dados',
    description: 'Leitura e validação de dados de NF-e do EBS',
    href: '/data-validation',
    icon: CheckCircle,
    color: 'bg-purple-500',
    stats: { processed: 1156, total: 1180 }
  },
  {
    name: 'Workflows & Divergências',
    description: 'Gestão de fluxos de trabalho e resolução de divergências',
    href: '/workflows',
    icon: AlertTriangle,
    color: 'bg-orange-500',
    stats: { processed: 1089, total: 1156 }
  },
  {
    name: 'Lançamento ERP',
    description: 'Simulação de lançamentos físicos, fiscais e financeiros',
    href: '/erp-posting',
    icon: TrendingUp,
    color: 'bg-indigo-500',
    stats: { processed: 1045, total: 1089 }
  },
  {
    name: 'Manifestações',
    description: 'Comunicação com SEFAZ para manifestações de NF-e',
    href: '/manifestations',
    icon: FileText,
    color: 'bg-teal-500',
    stats: { processed: 998, total: 1045 }
  },
  {
    name: 'Status de Pagamento',
    description: 'Visualização do status de pagamento de faturas',
    href: '/payment-status',
    icon: DollarSign,
    color: 'bg-emerald-500',
    stats: { processed: 945, total: 998 }
  },
  {
    name: 'Dashboard de Otimização',
    description: 'Análise de KPIs e estatísticas do sistema',
    href: '/optimization',
    icon: BarChart3,
    color: 'bg-pink-500',
    stats: { processed: 945, total: 945 }
  }
]

const kpiCards = [
  {
    title: 'Total de Faturas Processadas',
    value: '1.247',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: FileText,
    color: 'bg-blue-500'
  },
  {
    title: 'Taxa de Sucesso',
    value: '94,2%',
    change: '+2.1%',
    changeType: 'positive' as const,
    icon: CheckCircle,
    color: 'bg-green-500'
  },
  {
    title: 'Tempo Médio de Processamento',
    value: '2.3 min',
    change: '-15%',
    changeType: 'positive' as const,
    icon: Clock,
    color: 'bg-purple-500'
  },
  {
    title: 'Divergências Resolvidas',
    value: '89%',
    change: '+5.2%',
    changeType: 'positive' as const,
    icon: AlertTriangle,
    color: 'bg-orange-500'
  }
]

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NF-easy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema integrado para centralização e processamento de dados de compras e fiscais da <strong>Alumar (São Luís – MA)</strong>
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className={`text-sm ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change} vs mês anterior
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.color} bg-opacity-10`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modules Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card key={module.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${module.color} bg-opacity-10`}>
                      <module.icon className={`h-6 w-6 ${module.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Processadas</p>
                      <p className="text-lg font-semibold">{module.stats.processed.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">de {module.stats.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <CardTitle>{module.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  <Link href={module.href}>
                    <Button variant="outline" className="w-full">
                      Acessar Módulo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">EBS Connection</h3>
                <p className="text-sm text-gray-600">Online</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">EDAP Connection</h3>
                <p className="text-sm text-gray-600">Online</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Database</h3>
                <p className="text-sm text-gray-600">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
