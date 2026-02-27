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
import { WorkoutProgram } from '@/types';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const response = await fetch('/api/programs');
        if (!response.ok) throw new Error('Failed to fetch programs');
        const data = await response.json();
        setPrograms(data || []);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load programs');
      } finally {
        setIsLoading(false);
      }
    };

    loadPrograms();
  }, []);

  const filteredPrograms = programs.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      const response = await fetch(`/api/programs?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete program');
      setPrograms(programs.filter((p) => p.id !== id));
      toast.success('Program deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete program');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workout Programs</h1>
          <p className="text-muted-foreground">Create and manage workout programs</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Program
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Programs ({filteredPrograms.length})</CardTitle>
          <CardDescription>All available workout programs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No programs found. Create your first program to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Workouts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>{program.duration} weeks</TableCell>
                    <TableCell>
                      <Badge variant="outline">{program.difficulty}</Badge>
                    </TableCell>
                    <TableCell>{program.workoutIds.length}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(program.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(program.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
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
