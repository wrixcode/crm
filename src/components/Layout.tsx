import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, BarChart3, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: Users, label: 'Clients' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Phone className="w-6 h-6 text-sidebar-primary" />
            <h1 className="text-xl font-bold">Sales CRM</h1>
          </div>
          <p className="text-sm text-sidebar-foreground/60 mt-1">Call Tracking System</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start',
                  location.pathname === to && 'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
