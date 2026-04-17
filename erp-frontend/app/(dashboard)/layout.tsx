import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  LayoutDashboard, 
  FileText, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-50 selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-slate-900/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-xl group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all">
              <Zap className="w-5 h-5 text-white shrink-0" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              SmartFlow
            </span>
          </Link>
        </div>
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
          <nav className="space-y-1">
            {[
              { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
              { label: 'Invoices', icon: FileText, href: '/invoices' },
              { label: 'Clients', icon: Users, href: '/clients' },
              { label: 'Payments', icon: CreditCard, href: '/payments' },
              { label: 'Reports', icon: BarChart3, href: '/reports' },
              { label: 'Settings', icon: Settings, href: '/settings' },
            ].map(({ label, icon: Icon, href }) => (
              <Link 
                key={label}
                href={href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-slate-50 hover:bg-white/5`}
              >
                <Icon className="w-5 h-5 text-slate-500" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold select-none cursor-pointer">
              AD
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-white truncate">Admin User</div>
              <div className="text-xs text-slate-400 truncate">admin@smartflow.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        {/* Header */}
        <header className="h-20 border-b border-white/10 bg-slate-900/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="w-1/3 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search invoices, clients, or payments..." 
              className="pl-9 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 rounded-full h-10 w-full focus-visible:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
            </Button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8 relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
