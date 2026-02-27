'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { User } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const SUBSCRIPTION_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Basic workouts', 'Limited programs', 'Community support'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 4.99,
    features: ['All workouts', 'All programs', 'Ad-free', 'Email support'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'All features',
      'Personal training',
      'Priority support',
      'Advanced analytics',
    ],
  },
];

export default function SubscriptionsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>('all');

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

  const filteredUsers =
    selectedTier === 'all'
      ? users
      : users.filter((u) => u.subscription?.plan === selectedTier);

  const stats = {
    total: users.length,
    active: users.filter((u) => u.subscription?.active).length,
    free: users.filter((u) => u.subscription?.plan === 'free').length,
    basic: users.filter((u) => u.subscription?.plan === 'basic').length,
    premium: users.filter((u) => u.subscription?.plan === 'premium').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage subscription tiers and users</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Free Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.free}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Basic Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.basic}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Premium Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premium}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUBSCRIPTION_TIERS.map((tier) => (
          <Card key={tier.id}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>${tier.price}/month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
          <CardDescription>Filter by subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['all', 'free', 'basic', 'premium'].map((tier) => (
              <Button
                key={tier}
                variant={selectedTier === tier ? 'default' : 'outline'}
                onClick={() => setSelectedTier(tier)}
                className="capitalize"
              >
                {tier === 'all' ? 'All Users' : `${tier} Plan`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users in this category</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="capitalize">{user?.subscription?.plan}</TableCell>
                    <TableCell>
                      <Badge variant={user?.subscription?.active ? 'default' : 'secondary'}>
                        {user?.subscription?.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(user?.subscription?.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {user?.subscription?.endDate
                        ? new Date(user.subscription.endDate).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
