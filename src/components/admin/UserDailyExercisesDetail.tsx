'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  workoutId: string;
  workoutName: string;
  bodyPart: string;
  level: string;
  sets: number;
  reps: number;
  equipment: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

interface DailyExerciseCard {
  id: string;
  name?: string;
  description?: string;
  exerciseCount: number;
  exercises: Exercise[];
}

interface UserDailyExercisesDetailProps {
  userData: {
    userId: string;
    user: any;
    cards: DailyExerciseCard[];
    totalCards: number;
  };
}

export default function UserDailyExercisesDetail({
  userData,
}: UserDailyExercisesDetailProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpanded = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const handleRemoveExercise = async (cardId: string, exerciseId: string) => {
    try {
      const response = await fetch(
        `/api/users/daily-exercises?userId=${userData.userId}&cardId=${cardId}&exerciseId=${exerciseId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to remove exercise');
      }

      toast.success('Exercise removed successfully');
      // Refresh would be handled by parent component
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove exercise');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (userData.cards.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No daily exercises created yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-slate-700">
        Total Exercise Cards: {userData.totalCards}
      </div>

      {userData.cards.map((card) => (
        <Card key={card.id} className="border">
          <button
            onClick={() => toggleCardExpanded(card.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 text-left">
              <div className="font-semibold text-slate-900">
                {card.name || 'Untitled'}
              </div>
              {card.description && (
                <p className="text-sm text-slate-500 line-clamp-1">
                  {card.description}
                </p>
              )}
              <Badge variant="secondary">
                {card.exerciseCount} exercises
              </Badge>
            </div>
            {expandedCards.has(card.id) ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {/* Expanded Exercises */}
          {expandedCards.has(card.id) && (
            <div className="border-t bg-slate-50 px-6 py-4">
              {card.exercises.length === 0 ? (
                <p className="text-sm text-slate-500">No exercises in this card</p>
              ) : (
                <div className="space-y-3">
                  {card.exercises
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((exercise) => (
                      <div
                        key={exercise.id}
                        className="bg-white rounded-lg p-3 border border-slate-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">
                              {exercise.workoutName}
                            </div>
                            <div className="text-sm text-slate-500">
                              Order: {exercise.order || 'N/A'}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              handleRemoveExercise(card.id, exercise.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <div className="text-xs text-slate-500">Body Part</div>
                            <div className="text-sm font-medium text-slate-900">
                              {exercise.bodyPart}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Level</div>
                            <Badge className={`${getLevelColor(exercise.level)} text-xs`}>
                              {exercise.level}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Sets × Reps</div>
                            <div className="text-sm font-medium text-slate-900">
                              {exercise.sets} × {exercise.reps}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Equipment</div>
                            <div className="text-sm font-medium text-slate-900">
                              {exercise.equipment || 'None'}
                            </div>
                          </div>
                        </div>

                        {exercise.createdAt && (
                          <div className="text-xs text-slate-400 mt-2">
                            Added: {formatDate(exercise.createdAt)}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
