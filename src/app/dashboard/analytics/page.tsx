'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Analytics } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Mock analytics data for now
        const mockData: Analytics[] = [
          {
            totalUsers: 150,
            activeUsers: 120,
            totalWorkouts: 450,
            completedWorkouts: 380,
            totalPrograms: 12,
            activeSubscriptions: 45,
            newUsersToday: 5,
            date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            totalUsers: 155,
            activeUsers: 125,
            totalWorkouts: 460,
            completedWorkouts: 390,
            totalPrograms: 12,
            activeSubscriptions: 46,
            newUsersToday: 3,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            totalUsers: 160,
            activeUsers: 128,
            totalWorkouts: 475,
            completedWorkouts: 405,
            totalPrograms: 12,
            activeSubscriptions: 47,
            newUsersToday: 4,
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            totalUsers: 165,
            activeUsers: 132,
            totalWorkouts: 490,
            completedWorkouts: 420,
            totalPrograms: 13,
            activeSubscriptions: 50,
            newUsersToday: 6,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            totalUsers: 170,
            activeUsers: 136,
            totalWorkouts: 505,
            completedWorkouts: 435,
            totalPrograms: 13,
            activeSubscriptions: 52,
            newUsersToday: 5,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            totalUsers: 175,
            activeUsers: 140,
            totalWorkouts: 520,
            completedWorkouts: 450,
            totalPrograms: 13,
            activeSubscriptions: 54,
            newUsersToday: 4,
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            totalUsers: 180,
            activeUsers: 144,
            totalWorkouts: 535,
            completedWorkouts: 465,
            totalPrograms: 14,
            activeSubscriptions: 56,
            newUsersToday: 3,
            date: new Date().toISOString(),
          },
        ];

        setAnalytics(mockData);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const chartData = analytics.map((a) => ({
    date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: a.totalUsers,
    activeUsers: a.activeUsers,
    workouts: a.completedWorkouts,
    subscriptions: a.activeSubscriptions,
  }));

  const latestData = analytics[analytics.length - 1];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Historical dashboard and system metrics</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {latestData?.newUsersToday || 0} new today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData?.activeUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {latestData ? ((latestData.activeUsers / latestData.totalUsers) * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData?.completedWorkouts || 0}</div>
              <p className="text-xs text-muted-foreground">
                {latestData ? ((latestData.completedWorkouts / latestData.totalWorkouts) * 100).toFixed(1) : 0}% completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData?.activeSubscriptions || 0}</div>
              <p className="text-xs text-muted-foreground">
                {latestData ? ((latestData.activeSubscriptions / latestData.totalUsers) * 100).toFixed(1) : 0}% conversion
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Growth & Engagement</CardTitle>
          <CardDescription>Last 7 days historical data</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  dot={false}
                  name="Total Users"
                />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#10b981"
                  dot={false}
                  name="Active Users"
                />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="#f59e0b"
                  dot={false}
                  name="Subscriptions"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workout Completion Trend</CardTitle>
          <CardDescription>Historical workout completions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="workouts"
                  stroke="#8b5cf6"
                  dot={false}
                  name="Completed Workouts"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
