'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import UserDailyExercisesDetail from '@/components/admin/UserDailyExercisesDetail';

interface DailyExerciseCard {
  id: string;
  name?: string;
  description?: string;
  exerciseCount: number;
  exercises: any[];
}

interface UserWithDailyExercises {
  userId: string;
  user: any;
  cards: DailyExerciseCard[];
  totalCards: number;
}

export default function DailyExercisesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithDailyExercises | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  // Load all users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data || []);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserExpanded = async (userId: string) => {
    const newExpanded = new Set(expandedUsers);

    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
      setExpandedUsers(newExpanded);
      setSelectedUser(null);
    } else {
      // Load daily exercises for this user
      try {
        const response = await fetch(
          `/api/users/daily-exercises?userId=${userId}`
        );
        if (!response.ok) throw new Error('Failed to fetch daily exercises');
        const data = await response.json();
        setSelectedUser(data);
        newExpanded.add(userId);
        setExpandedUsers(newExpanded);
      } catch (error: any) {
        toast.error('Failed to load daily exercises');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Daily Exercises</CardTitle>
            <CardDescription>
              View and manage daily exercise routines for all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Daily Exercises</CardTitle>
          <CardDescription>
            View and manage daily exercise routines for all users ({users.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6 flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Users List */}
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div key={user.uid} className="border rounded-lg overflow-hidden">
                {/* User Row */}
                <button
                  onClick={() => toggleUserExpanded(user.uid)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div
                      className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold text-blue-700"
                      title={user.email}
                    >
                      {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">
                        {user.displayName}
                      </div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                    <Badge variant="outline">
                      {user.subscription?.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {expandedUsers.has(user.uid) ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>

                {/* Expanded Content */}
                {expandedUsers.has(user.uid) && selectedUser?.userId === user.uid && selectedUser && (
                  <div className="border-t bg-slate-50 p-4">
                    <UserDailyExercisesDetail userData={selectedUser} />
                  </div>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="py-8 text-center text-slate-500">
                No users found matching your search
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
