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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Workout } from '@/types';
import { Plus, Search, Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Workout>>({
    name: '',
    bodyPart: '',
    category: 'Strength',
    equipment: 'None',
    level: 'Beginner',
    preparation: '',
    execution: '',
    reps: 10,
    duration: 0,
    restTime: 0,
    caloriesBurned: 0,
    videoUrl: '',
    imageUrl: '',
    musclesTargeted: [],
    tips: '',
    contraindications: '',
    recommendedWeight: 0,
    sets: [{ id: '1', numberOfReps: 10, weight: 0, status: 'pending' }],
  });

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await fetch('/api/workouts');
        if (!response.ok) throw new Error('Failed to fetch workouts');
        const data = await response.json();
        setWorkouts(data || []);

        // Extract unique categories
        const uniqueCategories = [...new Set((data || []).map((w: Workout) => w.category))];
        setCategories(uniqueCategories as string[]);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load workouts');
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  const filteredWorkouts = workouts.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.bodyPart.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || w.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    try {
      const response = await fetch(`/api/workouts?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete workout');
      setWorkouts(workouts.filter((w) => w.id !== id));
      toast.success('Workout deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete workout');
    }
  };

  const handleDeleteDuplicates = async () => {
    // Find duplicates by name
    const nameMap = new Map<string, Workout[]>();
    workouts.forEach((workout) => {
      const name = workout.name.toLowerCase();
      if (!nameMap.has(name)) {
        nameMap.set(name, []);
      }
      nameMap.get(name)!.push(workout);
    });

    // Get duplicates (name appears more than once)
    const duplicates: Workout[] = [];
    nameMap.forEach((workoutGroup) => {
      if (workoutGroup.length > 1) {
        // Keep the first one, mark the rest for deletion
        duplicates.push(...workoutGroup.slice(1));
      }
    });

    if (duplicates.length === 0) {
      toast.info('No duplicate workouts found');
      return;
    }

    const confirmMsg = `Found ${duplicates.length} duplicate workout(s). Delete them?`;
    if (!confirm(confirmMsg)) return;

    try {
      let deletedCount = 0;
      let errorCount = 0;

      for (const duplicate of duplicates) {
        try {
          const response = await fetch(`/api/workouts?id=${duplicate.id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            deletedCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      // Refresh the workouts list
      const response = await fetch('/api/workouts');
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data || []);
      }

      if (errorCount === 0) {
        toast.success(`Successfully deleted ${deletedCount} duplicate workout(s)`);
      } else {
        toast.warning(`Deleted ${deletedCount} duplicate(s), but ${errorCount} failed`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete duplicates');
    }
  };

  const handleUpdateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWorkout?.id) return;

    try {
      const response = await fetch('/api/workouts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: selectedWorkout.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details?.[0] || error.error || 'Failed to update workout');
      }

      const data = await response.json();
      setWorkouts(workouts.map((w) => (w.id === selectedWorkout.id ? data.workout : w)));
      setSelectedWorkout(null);
      setIsEditMode(false);
      setFormData({
        name: '',
        bodyPart: '',
        category: 'Strength',
        equipment: 'None',
        level: 'Beginner',
        preparation: '',
        execution: '',
        reps: 10,
        duration: 0,
        restTime: 0,
        caloriesBurned: 0,
        videoUrl: '',
        imageUrl: '',
        musclesTargeted: [],
        tips: '',
        contraindications: '',
        recommendedWeight: 0,
        sets: [{ id: '1', numberOfReps: 10, weight: 0, status: 'pending' }],
      });
      toast.success('Workout updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update workout');
    }
  };

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: formData.id || Date.now().toString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details?.[0] || error.error || 'Failed to create workout');
      }

      const data = await response.json();
      setWorkouts([...workouts, data.workout]);
      setShowAddForm(false);
      setFormData({
        name: '',
        bodyPart: '',
        category: 'Strength',
        equipment: 'None',
        level: 'Beginner',
        preparation: '',
        execution: '',
        reps: 10,
        duration: 0,
        restTime: 0,
        caloriesBurned: 0,
        videoUrl: '',
        imageUrl: '',
        musclesTargeted: [],
        tips: '',
        contraindications: '',
        recommendedWeight: 0,
        sets: [{ id: '1', numberOfReps: 10, weight: 0, status: 'pending' }],
      });
      toast.success('Workout created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create workout');
    }
  };

  const handleSetDefaultSets = async () => {
    // Find workouts without sets or with empty sets
    const workoutsToUpdate = workouts.filter(
      (w) => !w.sets || w.sets.length === 0
    );

    if (workoutsToUpdate.length === 0) {
      toast.info('All workouts already have sets');
      return;
    }

    const confirmMsg = `Add 4 default sets to ${workoutsToUpdate.length} workout(s)?`;
    if (!confirm(confirmMsg)) return;

    try {
      let successCount = 0;
      let failureCount = 0;

      for (const workout of workoutsToUpdate) {
        try {
          // Create 4 default sets
          const defaultSets = Array.from({ length: 4 }, (_, i) => ({
            id: (i + 1).toString(),
            numberOfReps: workout.reps || 10,
            weight: workout.recommendedWeight || 0,
            status: 'pending' as const,
          }));

          const response = await fetch('/api/workouts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: workout.id,
              sets: defaultSets,
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            failureCount++;
          }
        } catch (error) {
          failureCount++;
          console.error(`Failed to update workout: ${workout.name}`, error);
        }
      }

      // Refresh workouts list
      const response = await fetch('/api/workouts');
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data || []);
      }

      if (failureCount === 0) {
        toast.success(`Successfully added default sets to ${successCount} workout(s)`);
      } else {
        toast.warning(
          `Added sets to ${successCount} workout(s), but ${failureCount} failed`
        );
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to set default sets');
    }
  };

  const handleDeleteWithoutImageUrl = async () => {
    // Find workouts without imageUrl
    const workoutsToDelete = workouts.filter((w) => !w.imageUrl || w.imageUrl.trim() === '');

    if (workoutsToDelete.length === 0) {
      toast.info('All workouts have image URLs');
      return;
    }

    const confirmMsg = `Delete ${workoutsToDelete.length} workout(s) without image URL?`;
    if (!confirm(confirmMsg)) return;

    try {
      let deletedCount = 0;
      let failureCount = 0;

      for (const workout of workoutsToDelete) {
        try {
          const response = await fetch(`/api/workouts?id=${workout.id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            deletedCount++;
          } else {
            failureCount++;
          }
        } catch (error) {
          failureCount++;
          console.error(`Failed to delete workout: ${workout.name}`, error);
        }
      }

      // Refresh workouts list
      const response = await fetch('/api/workouts');
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data || []);
      }

      if (failureCount === 0) {
        toast.success(`Successfully deleted ${deletedCount} workout(s) without image URL`);
      } else {
        toast.warning(
          `Deleted ${deletedCount} workout(s), but ${failureCount} failed`
        );
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete workouts');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground">Manage your exercise database</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleSetDefaultSets}
          >
            <Plus className="h-4 w-4" />
            Add Default Sets
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleDeleteDuplicates}
          >
            <AlertCircle className="h-4 w-4" />
            Delete Duplicates
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleDeleteWithoutImageUrl}
          >
            <Trash2 className="h-4 w-4" />
            Delete No Image
          </Button>
          <Button className="gap-2" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4" />
            Add Workout
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter workouts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Workouts ({filteredWorkouts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No workouts found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Body Part</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Sets</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell 
                      className="font-medium cursor-pointer hover:text-blue-600"
                      onClick={() => setSelectedWorkout(workout)}
                    >
                      {workout.name}
                    </TableCell>
                    <TableCell>{workout.bodyPart}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {workout.equipment}
                      </Badge>
                    </TableCell>
                    <TableCell>{workout.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{workout.level}</Badge>
                    </TableCell>
                    <TableCell>{workout?.sets?.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedWorkout(workout);
                            setIsEditMode(true);
                            setFormData(workout);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(workout.id)}
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

      {/* Add Workout Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl md:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Workout</DialogTitle>
            <DialogDescription>Create a new exercise workout</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWorkout} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium">Workout Name *</label>
              <Input
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Squat Variation 6"
              />
            </div>

            {/* Body Part and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Body Part *</label>
                <Input
                  required
                  value={formData.bodyPart || ''}
                  onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
                  placeholder="e.g., Legs"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category *</label>
                <select
                  required
                  value={formData.category || 'Strength'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'Strength' | 'Cardio' | 'Mobility' | 'Flexibility' })}
                  className="px-3 py-2 border rounded-md text-sm w-full"
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Mobility">Mobility</option>
                  <option value="Flexibility">Flexibility</option>
                </select>
              </div>
            </div>

            {/* Equipment and Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Equipment *</label>
                <Input
                  required
                  value={formData.equipment || ''}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  placeholder="e.g., None, Dumbbells"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Level *</label>
                <select
                  required
                  value={formData.level || 'Beginner'}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="px-3 py-2 border rounded-md text-sm w-full"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Preparation */}
            <div>
              <label className="text-sm font-medium">Preparation</label>
              <textarea
                value={formData.preparation || ''}
                onChange={(e) => setFormData({ ...formData, preparation: e.target.value })}
                placeholder="e.g., Prepare as instructed for Squat."
                className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                rows={2}
              />
            </div>

            {/* Execution */}
            <div>
              <label className="text-sm font-medium">Execution</label>
              <textarea
                value={formData.execution || ''}
                onChange={(e) => setFormData({ ...formData, execution: e.target.value })}
                placeholder="e.g., Execute proper form of Squat."
                className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                rows={2}
              />
            </div>

            {/* Recommended Reps and Duration */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Recommended Reps</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.reps || 0}
                  onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) || 0 })}
                  placeholder="10"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Duration (seconds)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.duration || 0}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Rest Time (seconds)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.restTime || 0}
                  onChange={(e) => setFormData({ ...formData, restTime: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Calories, Weight, and Media */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Calories Burned (est.)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.caloriesBurned || 0}
                  onChange={(e) => setFormData({ ...formData, caloriesBurned: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Recommended Weight (kg)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.recommendedWeight || 0}
                  onChange={(e) => setFormData({ ...formData, recommendedWeight: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Video URL</label>
                <Input
                  value={formData.videoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                  type="url"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="text-sm font-medium">Image URL (form reference)</label>
              <Input
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            {/* Muscles Targeted */}
            <div>
              <label className="text-sm font-medium">Muscles Targeted (comma-separated)</label>
              <Input
                value={(formData.musclesTargeted || []).join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    musclesTargeted: e.target.value.split(',').map((m) => m.trim()).filter((m) => m),
                  })
                }
                placeholder="e.g., Quadriceps, Glutes, Hamstrings"
              />
            </div>

            {/* Tips */}
            <div>
              <label className="text-sm font-medium">Tips & Advice</label>
              <textarea
                value={formData.tips || ''}
                onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                placeholder="Additional advice for correct form and efficiency"
                className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                rows={2}
              />
            </div>

            {/* Contraindications */}
            <div>
              <label className="text-sm font-medium">Contraindications & Warnings</label>
              <textarea
                value={formData.contraindications || ''}
                onChange={(e) => setFormData({ ...formData, contraindications: e.target.value })}
                placeholder="e.g., Avoid if knee injury present"
                className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                rows={2}
              />
            </div>

            {/* Sets */}
            <div>
              <label className="text-sm font-medium">Sets</label>
              <div className="space-y-2">
                {(formData.sets || []).map((set, index) => (
                  <div key={set.id} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Set {index + 1} - Reps</label>
                      <Input
                        type="number"
                        min="1"
                        required
                        value={set.numberOfReps}
                        onChange={(e) => {
                          const newSets = [...(formData.sets || [])];
                          newSets[index].numberOfReps = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, sets: newSets });
                        }}
                        placeholder="15"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Weight (kg)</label>
                      <Input
                        type="number"
                        min="0"
                        required
                        value={set.weight}
                        onChange={(e) => {
                          const newSets = [...(formData.sets || [])];
                          newSets[index].weight = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, sets: newSets });
                        }}
                        placeholder="0"
                      />
                    </div>
                    {(formData.sets || []).length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSets = (formData.sets || []).filter((_, i) => i !== index);
                          setFormData({ ...formData, sets: newSets });
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const newSets = [...(formData.sets || [])];
                    const newId = (Math.max(...newSets.map(s => parseInt(s.id) || 0)) + 1).toString();
                    newSets.push({ id: newId, numberOfReps: 10, weight: formData.recommendedWeight || 0, status: 'pending' });
                    setFormData({ ...formData, sets: newSets });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Set
                </Button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Create Workout
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Workout Details/Edit Modal */}
      <Dialog open={!!selectedWorkout} onOpenChange={(open) => {
        if (!open) {
          setSelectedWorkout(null);
          setIsEditMode(false);
        }
      }}>
        <DialogContent className="max-w-4xl md:max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedWorkout && (
            <>
              <DialogHeader>
                <DialogTitle>{isEditMode ? 'Edit Workout' : selectedWorkout.name}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? 'Update workout details' : 'Workout Details'}
                </DialogDescription>
              </DialogHeader>

              {isEditMode ? (
                /* Edit Form */
                <form onSubmit={handleUpdateWorkout} className="space-y-4">
                  {/* Name and Body Part */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Workout Name *</label>
                      <Input
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Squat"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Body Part *</label>
                      <Input
                        required
                        value={formData.bodyPart || ''}
                        onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
                        placeholder="e.g., Legs"
                      />
                    </div>
                  </div>

                  {/* Category and Equipment */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Category *</label>
                      <select
                        required
                        value={formData.category || 'Strength'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="px-3 py-2 border rounded-md text-sm w-full"
                      >
                        <option value="Strength">Strength</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Mobility">Mobility</option>
                        <option value="Flexibility">Flexibility</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Equipment *</label>
                      <Input
                        required
                        value={formData.equipment || ''}
                        onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                        placeholder="e.g., None, Dumbbells"
                      />
                    </div>
                  </div>

                  {/* Equipment and Level */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Equipment *</label>
                      <Input
                        required
                        value={formData.equipment || ''}
                        onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                        placeholder="e.g., None, Dumbbells"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Level *</label>
                      <select
                        required
                        value={formData.level || 'Beginner'}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                        className="px-3 py-2 border rounded-md text-sm w-full"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Preparation */}
                  <div>
                    <label className="text-sm font-medium">Preparation</label>
                    <textarea
                      value={formData.preparation || ''}
                      onChange={(e) => setFormData({ ...formData, preparation: e.target.value })}
                      placeholder="e.g., Prepare as instructed for Squat."
                      className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Execution */}
                  <div>
                    <label className="text-sm font-medium">Execution</label>
                    <textarea
                      value={formData.execution || ''}
                      onChange={(e) => setFormData({ ...formData, execution: e.target.value })}
                      placeholder="e.g., Execute proper form of Squat."
                      className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Recommended Reps and Duration */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Recommended Reps</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.reps || 0}
                        onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) || 0 })}
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Duration (seconds)</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.duration || 0}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Rest Time (seconds)</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.restTime || 0}
                        onChange={(e) => setFormData({ ...formData, restTime: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Calories, Weight, and Media */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Calories Burned (est.)</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.caloriesBurned || 0}
                        onChange={(e) => setFormData({ ...formData, caloriesBurned: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Recommended Weight (kg)</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.recommendedWeight || 0}
                        onChange={(e) => setFormData({ ...formData, recommendedWeight: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Video URL</label>
                      <Input
                        value={formData.videoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://youtube.com/..."
                        type="url"
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                  </div>

                  {/* Tips and Contraindications */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Form Tips</label>
                      <textarea
                        value={formData.tips || ''}
                        onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                        placeholder="e.g., Keep your back straight and core engaged."
                        className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contraindications</label>
                      <textarea
                        value={formData.contraindications || ''}
                        onChange={(e) => setFormData({ ...formData, contraindications: e.target.value })}
                        placeholder="e.g., Not recommended if you have knee pain."
                        className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Muscles Targeted */}
                  <div>
                    <label className="text-sm font-medium">Muscles Targeted (comma-separated)</label>
                    <Input
                      value={(formData.musclesTargeted || []).join(', ')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        musclesTargeted: e.target.value.split(',').map(m => m.trim()).filter(m => m)
                      })}
                      placeholder="e.g., Quadriceps, Glutes"
                    />
                  </div>

                  {/* Sets */}
                  <div>
                    <label className="text-sm font-medium">Sets</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(formData.sets || []).map((set, index) => (
                        <div key={set.id} className="flex gap-3 items-end">
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground">Reps</label>
                            <Input
                              type="number"
                              min="0"
                              value={set.numberOfReps}
                              onChange={(e) => {
                                const newSets = [...(formData.sets || [])];
                                newSets[index].numberOfReps = parseInt(e.target.value) || 0;
                                setFormData({ ...formData, sets: newSets });
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground">Weight (kg)</label>
                            <Input
                              type="number"
                              min="0"
                              value={set.weight}
                              onChange={(e) => {
                                const newSets = [...(formData.sets || [])];
                                newSets[index].weight = parseInt(e.target.value) || 0;
                                setFormData({ ...formData, sets: newSets });
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newSets = (formData.sets || []).filter((_, i) => i !== index);
                              setFormData({ ...formData, sets: newSets });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const newSets = [...(formData.sets || [])];
                          const newId = (Math.max(...newSets.map(s => parseInt(s.id) || 0)) + 1).toString();
                          newSets.push({ id: newId, numberOfReps: 10, weight: formData.recommendedWeight || 0, status: 'pending' });
                          setFormData({ ...formData, sets: newSets });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Set
                      </Button>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Update Workout
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedWorkout(null);
                        setIsEditMode(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                /* Details View */
                <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Body Part</p>
                    <p className="font-medium">{selectedWorkout.bodyPart}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Category</p>
                    <p className="font-medium">{selectedWorkout.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Level</p>
                    <Badge className="w-fit">{selectedWorkout.level}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Equipment</p>
                    <p className="font-medium">{selectedWorkout.equipment}</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted rounded">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Recommended Reps</p>
                    <p className="font-medium">{selectedWorkout.reps || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Recommended Weight</p>
                    <p className="font-medium">{selectedWorkout.recommendedWeight || 0} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Duration</p>
                    <p className="font-medium">{selectedWorkout.duration || 0} sec</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Rest Time</p>
                    <p className="font-medium">{selectedWorkout.restTime || 0} sec</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Calories Burned</p>
                    <p className="font-medium">{selectedWorkout.caloriesBurned || 0} cal</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Total Sets</p>
                    <p className="font-medium">{selectedWorkout?.sets?.length}</p>
                  </div>
                </div>

                {/* Preparation */}
                {selectedWorkout.preparation && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Preparation</h3>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {selectedWorkout.preparation}
                    </p>
                  </div>
                )}

                {/* Execution */}
                {selectedWorkout.execution && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Execution</h3>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {selectedWorkout.execution}
                    </p>
                  </div>
                )}

                {/* Form Tips & Contraindications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedWorkout.tips && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Form Tips</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {selectedWorkout.tips}
                      </p>
                    </div>
                  )}
                  {selectedWorkout.contraindications && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Contraindications</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {selectedWorkout.contraindications}
                      </p>
                    </div>
                  )}
                </div>

                {/* Muscles Targeted */}
                {selectedWorkout.musclesTargeted && selectedWorkout.musclesTargeted.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Muscles Targeted</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedWorkout.musclesTargeted.map((muscle, idx) => (
                        <Badge key={idx} variant="secondary">{muscle}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Links */}
                <div className="grid grid-cols-2 gap-2">
                  {selectedWorkout.videoUrl && (
                    <a 
                      href={selectedWorkout.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-500 hover:underline flex items-center gap-2 p-2 bg-muted rounded"
                    >
                      📹 Watch Video Guide
                    </a>
                  )}
                  {selectedWorkout.imageUrl && (
                    <a 
                      href={selectedWorkout.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-500 hover:underline flex items-center gap-2 p-2 bg-muted rounded"
                    >
                      🖼️ View Form Image
                    </a>
                  )}
                </div>

                {/* Sets - Without Status Badge */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Sets ({selectedWorkout?.sets?.length})</h3>
                  <div className="space-y-2">
                    {selectedWorkout.sets.map((set, index) => (
                      <div key={set.id} className="flex items-center gap-4 p-3 border rounded bg-card">
                        <span className="font-medium text-sm w-12">Set {index + 1}</span>
                        <div className="flex gap-6">
                          <div>
                            <p className="text-xs text-muted-foreground">Reps</p>
                            <p className="font-medium">{set.numberOfReps}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Weight</p>
                            <p className="font-medium">{set.weight > 0 ? `${set.weight} kg` : 'Bodyweight'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                {(selectedWorkout.createdAt || selectedWorkout.createdBy) && (
                  <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                    {selectedWorkout.createdBy && <p>Created by: {selectedWorkout.createdBy}</p>}
                    {selectedWorkout.createdAt && (
                      <p>
                        Created:{' '}
                        {new Date(selectedWorkout.createdAt).toLocaleDateString() === 'Invalid Date'
                          ? 'N/A'
                          : new Date(selectedWorkout.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => setIsEditMode(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Workout
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedWorkout(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
