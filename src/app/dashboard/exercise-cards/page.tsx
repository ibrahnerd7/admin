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
import { ExerciseCard, Workout } from '@/types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ExerciseCardsPage() {
  const [cards, setCards] = useState<ExerciseCard[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<ExerciseCard | null>(null);
  const [formData, setFormData] = useState<Partial<ExerciseCard>>({
    name: '',
    description: '',
    workoutIds: [],
    order: 0,
    imageUrl: '',
    color: '#3b82f6',
    estimatedMinutes: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cardsRes, workoutsRes] = await Promise.all([
        fetch('/api/exerciseCards'),
        fetch('/api/workouts'),
      ]);

      if (!cardsRes.ok || !workoutsRes.ok) throw new Error('Failed to fetch data');

      const cardsData = await cardsRes.json();
      const workoutsData = await workoutsRes.json();

      setCards(cardsData || []);
      setWorkouts(workoutsData || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (card?: ExerciseCard) => {
    if (card) {
      setEditingCard(card);
      setFormData(card);
    } else {
      setEditingCard(null);
      setFormData({
        name: '',
        description: '',
        workoutIds: [],
        order: cards.length,
        imageUrl: '',
        color: '#3b82f6',
        estimatedMinutes: 0,
      });
    }
    setShowForm(true);
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.name || !formData.description) {
        toast.error('Name and description are required');
        return;
      }

      const method = editingCard ? 'PUT' : 'POST';
      const payload = editingCard
        ? { id: editingCard.id, ...formData }
        : { ...formData, id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };

      const response = await fetch('/api/exerciseCards', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save card');

      const savedCard = await response.json();

      if (editingCard) {
        setCards(cards.map((c) => (c.id === savedCard.id ? savedCard : c)));
        toast.success('Card updated successfully');
      } else {
        setCards([...cards, savedCard]);
        toast.success('Card created successfully');
      }

      setShowForm(false);
      setEditingCard(null);
      setFormData({
        name: '',
        description: '',
        workoutIds: [],
        order: 0,
        imageUrl: '',
        color: '#3b82f6',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save card');
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Delete this exercise card?')) return;

    try {
      const response = await fetch(`/api/exerciseCards?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete card');
      setCards(cards.filter((c) => c.id !== id));
      toast.success('Card deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete card');
    }
  };

  const toggleWorkout = (workoutId: string) => {
    const workoutIds = formData.workoutIds || [];
    if (workoutIds.includes(workoutId)) {
      setFormData({
        ...formData,
        workoutIds: workoutIds.filter((id) => id !== workoutId),
      });
    } else {
      setFormData({
        ...formData,
        workoutIds: [...workoutIds, workoutId],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercise Cards</h1>
          <p className="text-muted-foreground">Manage homepage workout collections</p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenForm()}>
          <Plus className="h-4 w-4" />
          New Card
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cards ({cards.length})</CardTitle>
          <CardDescription>Warm Up, Super Set, and other workout collections</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No exercise cards found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {card.color && (
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: card.color }}
                        />
                      )}
                      <h3 className="font-semibold">{card.name}</h3>
                      <Badge variant="secondary">{card.order}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
                    <div className="text-xs text-muted-foreground mt-2 flex gap-4">
                      <span>{card.workoutIds?.length || 0} workouts</span>
                      <span>{card.estimatedMinutes || 0} minutes</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenForm(card)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCard ? 'Edit Card' : 'Create Exercise Card'}</DialogTitle>
            <DialogDescription>
              {editingCard ? 'Update card details' : 'Create a new workout collection card'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveCard} className="space-y-4">
            {/* Name, Order, and Minutes */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Card Name *</label>
                <Input
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Warm Up"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Display Order</label>
                <Input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Estimated Minutes</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.estimatedMinutes || 0}
                  onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 30"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">Description *</label>
              <textarea
                required
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this workout collection"
                className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                rows={2}
              />
            </div>

            {/* Image and Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={formData.color || '#3b82f6'}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 border rounded-md cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Workouts Selection */}
            <div>
              <label className="text-sm font-medium">Select Workouts</label>
              <div className="border rounded-md p-3 max-h-60 overflow-y-auto space-y-2">
                {workouts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No workouts available</p>
                ) : (
                  workouts.map((workout) => (
                    <label key={workout.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded">
                      <input
                        type="checkbox"
                        checked={(formData.workoutIds || []).includes(workout.id)}
                        onChange={() => toggleWorkout(workout.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{workout.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {workout.category}
                      </Badge>
                      {workout.imageUrl && (
                        <Badge className="text-xs bg-green-600 hover:bg-green-700">
                          📸 Image
                        </Badge>
                      )}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingCard ? 'Update Card' : 'Create Card'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
