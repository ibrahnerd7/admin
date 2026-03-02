'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [appName, setAppName] = useState('Workout Tracker');
  const [email, setEmail] = useState('admin@admin.com');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulated save
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage application configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic application configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Application Name</label>
            <Input
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Enter app name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Admin Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
            />
          </div>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Configuration</CardTitle>
          <CardDescription>Firebase database settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 p-4 rounded text-sm font-mono space-y-2">
            <div>
              <span className="text-muted-foreground">Project ID:</span>
              <span className="ml-2">chat-165ca</span>
            </div>
            <div>
              <span className="text-muted-foreground">Database URL:</span>
              <span className="ml-2">https://chat-165ca.firebaseio.com</span>
            </div>
            <div>
              <span className="text-muted-foreground">Storage Bucket:</span>
              <span className="ml-2">chat-165ca.appspot.com</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup & Export</CardTitle>
          <CardDescription>Manage data backups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline">Export All Data</Button>
            <Button variant="outline">Create Backup</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Last backup: Not available (implement backup scheduling)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced</CardTitle>
          <CardDescription>Advanced configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive">Clear All Analytics</Button>
          <p className="text-sm text-muted-foreground">
            This action will clear all historical analytics data and cannot be undone.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Application and environment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Version</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-muted-foreground">Environment</p>
              <p className="font-medium">Production</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">API Status</p>
              <p className="font-medium text-green-600">Connected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
