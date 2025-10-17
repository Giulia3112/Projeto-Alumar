import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function formatDateOnly(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'PENDING_VALIDATION': 'status-pending',
    'VALIDATED': 'status-success',
    'PROCESSED': 'status-success',
    'ERROR': 'status-error',
    'DIVERGENCE_DETECTED': 'status-error',
    'RESOLVED': 'status-success',
    'PENDING': 'status-pending',
    'READING': 'status-processing',
    'VALIDATING': 'status-processing',
    'READY': 'status-success'
  }
  
  return statusColors[status] || 'status-pending'
}

export function getStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    'PENDING_VALIDATION': 'Aguardando Validação',
    'VALIDATED': 'Validado',
    'PROCESSED': 'Processado',
    'ERROR': 'Erro',
    'DIVERGENCE_DETECTED': 'Divergência Detectada',
    'RESOLVED': 'Resolvido',
    'PENDING': 'Pendente',
    'READING': 'Lendo',
    'VALIDATING': 'Validando',
    'READY': 'Pronto'
  }
  
  return statusTexts[status] || status
}
