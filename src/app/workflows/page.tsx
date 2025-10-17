'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw,
  Eye,
  CheckSquare,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface Workflow {
  id: string
  invoiceId: string
  supplier: string
  total: number
  status: string
  divergences: any[]
  createdAt: string
  resolvedAt?: string
}

interface WorkflowStats {
  totalWorkflows: number
  pendingValidation: number
  divergenceDetected: number
  resolved: number
  totalDivergences: number
  resolvedDivergences: number
  resolutionRate: string
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [stats, setStats] = useState<WorkflowStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resolvingWorkflow, setResolvingWorkflow] = useState<string | null>(null)

  const fetchWorkflows = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/workflows')
      const data = await response.json()
      
      if (data.success) {
        setWorkflows(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/workflows/stats/overview')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const resolveWorkflow = async (workflowId: string) => {
    setResolvingWorkflow(workflowId)
    try {
      const response = await fetch(`http://localhost:3001/api/workflows/${workflowId}/mark-resolved`, {
        method: 'PATCH'
      })
      const data = await response.json()
      
      if (data.success) {
        // Refresh workflows and stats after resolution
        fetchWorkflows()
        fetchStats()
      }
    } catch (error) {
      console.error('Failed to resolve workflow:', error)
    } finally {
      setResolvingWorkflow(null)
    }
  }

  useEffect(() => {
    fetchWorkflows()
    fetchStats()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING_VALIDATION': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'DIVERGENCE_DETECTED': { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      'RESOLVED': { color: 'bg-green-100 text-green-800', icon: CheckCircle }
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

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      'HIGH': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'MEDIUM': { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
      'LOW': { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
    }
    
    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig['MEDIUM']
    const IconComponent = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {severity}
      </Badge>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows & Divergências</h1>
          <p className="text-gray-600 mt-2">
            Gestão de fluxos de trabalho e resolução de divergências
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Workflows</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalWorkflows}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Divergências Detectadas</p>
                    <p className="text-2xl font-bold text-red-600">{stats.divergenceDetected}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolvidas</p>
                    <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Resolução</p>
                    <p className="text-2xl font-bold text-secondary-600">{stats.resolutionRate}%</p>
                  </div>
                  <CheckSquare className="h-8 w-8 text-secondary-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Workflows List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary-600" />
                Workflows de Divergências
              </CardTitle>
              <Button 
                onClick={() => {
                  fetchWorkflows()
                  fetchStats()
                }}
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
              {workflows.map((workflow) => (
                <div 
                  key={workflow.id} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.invoiceId}</h3>
                      <p className="text-sm text-gray-600">{workflow.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        R$ {workflow.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(workflow.status)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Divergences */}
                  {workflow.divergences && workflow.divergences.length > 0 && (
                    <div className="mb-4 space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        Divergências ({workflow.divergences.length})
                      </h4>
                      {workflow.divergences.map((divergence, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{divergence.type}</span>
                            {getSeverityBadge(divergence.severity)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{divergence.message}</p>
                          <div className="text-xs text-gray-500">
                            Detectado em: {new Date(divergence.createdAt).toLocaleString('pt-BR')}
                          </div>
                          {divergence.resolvedAt && (
                            <div className="text-xs text-green-600 mt-1">
                              Resolvido em: {new Date(divergence.resolvedAt).toLocaleString('pt-BR')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>Criado em: {new Date(workflow.createdAt).toLocaleString('pt-BR')}</p>
                      {workflow.resolvedAt && (
                        <p className="text-green-600">
                          Resolvido em: {new Date(workflow.resolvedAt).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="btn-outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                      
                      {workflow.status === 'DIVERGENCE_DETECTED' && (
                        <Button 
                          onClick={() => resolveWorkflow(workflow.id)}
                          disabled={resolvingWorkflow === workflow.id}
                          size="sm"
                          className="btn-primary"
                        >
                          {resolvingWorkflow === workflow.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                              Resolvendo...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Marcar como Resolvido
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
