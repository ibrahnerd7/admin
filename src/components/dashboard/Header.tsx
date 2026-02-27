'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { User as FirebaseUser } from 'firebase/auth';

export function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{user?.email || 'Admin'}</p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>
      </div>
    </header>
  );
}
