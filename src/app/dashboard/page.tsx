'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllWorkouts, getAllUsers, getAllPrograms } from '@/lib/db';
import { Workout, User, WorkoutProgram } from '@/types';
import { BarChart3, Users, Dumbbell, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalUsers: 0,
    totalPrograms: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [workouts, users, programs] = await Promise.all([
          getAllWorkouts(),
          getAllUsers(),
          getAllPrograms(),
        ]);

        setStats({
          totalWorkouts: workouts.length,
          totalUsers: users.length,
          totalPrograms: programs.length,
          activeUsers: users.filter((u) => u.subscription?.active).length,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your workout admin overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon={<Dumbbell className="h-4 w-4 text-muted-foreground" />}
          description="Exercises in system"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Registered users"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeUsers}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          description="Paid subscriptions"
        />
        <StatCard
          title="Programs"
          value={stats.totalPrograms}
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          description="Workout programs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </>
              ) : (
                <>
                  <a
                    href="/dashboard/workouts"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Add Workout
                  </a>
                  <a
                    href="/dashboard/uploads"
                    className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    Upload Data
                  </a>
                  <a
                    href="/dashboard/users"
                    className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                  >
                    View Users
                  </a>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">System initialized</span>
                <span className="text-xs text-slate-400">Today</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dashboard deployed</span>
                <span className="text-xs text-slate-400">Today</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Firebase configured</span>
                <span className="text-xs text-slate-400">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
