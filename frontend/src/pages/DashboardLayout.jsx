import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Heart, Menu, X, Home, Calendar, FileText, Activity, Users, Settings, LogOut, Bell, MessageSquare, ClipboardList, DollarSign, BarChart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function DashboardLayout({ children, role }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const getNavItems = () => {
    switch (role) {
      case 'PATIENT':
        return [
          { href: '/patient/dashboard', icon: Home, label: 'Dashboard' },
          { href: '/patient/appointments', icon: Calendar, label: 'Appointments' },
          { href: '/patient/prescriptions', icon: FileText, label: 'Prescriptions' },
          { href: '/patient/lab-results', icon: Activity, label: 'Lab Results' },
          { href: '/patient/billing', icon: DollarSign, label: 'Billing' },
          { href: '/patient/documents', icon: ClipboardList, label: 'Documents' },
          { href: '/patient/chat', icon: MessageSquare, label: 'Messages' },
        ];
      case 'DOCTOR':
        return [
          { href: '/doctor/dashboard', icon: Home, label: 'Dashboard' },
          { href: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
          { href: '/doctor/patients', icon: Users, label: 'Patients' },
          { href: '/doctor/prescriptions', icon: FileText, label: 'Prescriptions' },
          { href: '/doctor/lab-requests', icon: Activity, label: 'Lab Requests' },
          { href: '/doctor/schedule', icon: ClipboardList, label: 'My Schedule' },
          { href: '/doctor/chat', icon: MessageSquare, label: 'Messages' },
        ];
      case 'ADMIN':
        return [
          { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
          { href: '/admin/users', icon: Users, label: 'Users' },
          { href: '/admin/appointments', icon: Calendar, label: 'Appointments' },
          { href: '/admin/billing', icon: DollarSign, label: 'Billing' },
          { href: '/admin/reports', icon: BarChart, label: 'Reports' },
          { href: '/admin/settings', icon: Settings, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Top Navigation Bar */}
      <nav className="backdrop-blur-xl bg-white/70 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X /> : <Menu />}
              </Button>
              <Link to="/" className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-900 hidden sm:block">MediCareOPD</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-300">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{role.toLowerCase()}</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'bg-white/70 backdrop-blur-xl border-r border-gray-200 pt-16 lg:pt-0'
          )}
        >
          <div className="h-full overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-blue-50'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link
                to={`/${role.toLowerCase()}/settings`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
