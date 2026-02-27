'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/lib/auth';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Dumbbell,
  Users,
  BarChart3,
  Upload,
  BookOpen,
  ImageIcon,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Layers,
  DatabaseIcon,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/workouts',
    label: 'Workouts',
    icon: Dumbbell,
  },
  {
    href: '/dashboard/exercises/import',
    label: 'Import Workouts',
    icon: DatabaseIcon,
  },
  {
    href: '/dashboard/exercise-cards',
    label: 'Exercise Cards',
    icon: Layers,
  },
  {
    href: '/dashboard/users',
    label: 'Users',
    icon: Users,
  },
  {
    href: '/dashboard/daily-exercises',
    label: 'Daily Exercises',
    icon: Calendar,
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    href: '/dashboard/uploads',
    label: 'Upload Data',
    icon: Upload,
  },
  {
    href: '/dashboard/programs',
    label: 'Workout Programs',
    icon: BookOpen,
  },
  {
    href: '/dashboard/onboarding',
    label: 'Onboarding',
    icon: ImageIcon,
  },
  {
    href: '/dashboard/subscriptions',
    label: 'Subscriptions',
    icon: CreditCard,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex lg:hidden mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-40"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative left-0 top-0 z-30 w-64 h-screen bg-slate-900 text-white p-4 transition-transform duration-300 flex flex-col border-r border-slate-700`}
      >
        <div className="mb-8 mt-12 lg:mt-0">
          <h1 className="text-2xl font-bold text-white">Workout Admin</h1>
          <p className="text-xs text-slate-400">Management Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-700 pt-4">
          <LogoutButton onLogout={() => setIsOpen(false)} />
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function LogoutButton({ onLogout }: { onLogout?: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      toast.success('Logged out successfully');
      onLogout?.();
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="ghost"
      className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
    >
      <LogOut className="h-5 w-5 mr-3" />
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
