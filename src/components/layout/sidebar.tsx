'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Database, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  BarChart3,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'EBS Connector', href: '/ebs-connector', icon: Database },
  { name: 'EDAP Connector', href: '/edap-connector', icon: FileText },
  { name: 'Validação de Dados', href: '/data-validation', icon: CheckCircle },
  { name: 'Workflows', href: '/workflows', icon: AlertTriangle },
  { name: 'Lançamento ERP', href: '/erp-posting', icon: TrendingUp },
  { name: 'Manifestações', href: '/manifestations', icon: FileText },
  { name: 'Status de Pagamento', href: '/payment-status', icon: DollarSign },
  { name: 'Dashboard', href: '/optimization', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white">NF-easy</h1>
      </div>
      
      <nav className="flex flex-1 flex-col px-3 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-6 w-6 shrink-0',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
        
        <div className="mt-auto p-3">
          <div className="rounded-md bg-gray-800 p-3">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-gray-400" />
              <span className="ml-3 text-sm font-medium text-gray-300">Configurações</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
