'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { OnboardingImage } from '@/types';
import { Plus, GripVertical, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const [images, setImages] = useState<OnboardingImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch('/api/onboarding');
        if (!response.ok) throw new Error('Failed to fetch onboarding images');
        const data = await response.json();
        setImages(data || []);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load onboarding images');
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/onboarding?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete image');
      setImages(images.filter((img) => img.id !== id));
      toast.success('Image deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Onboarding Images</h1>
          <p className="text-muted-foreground">Manage app onboarding content</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding Screens</CardTitle>
          <CardDescription>Images shown during app onboarding</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No onboarding images yet</p>
              <Button variant="outline">Add First Image</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 transition"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          {image.order}. {image.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{image.description}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Uploaded by: {image.uploadedBy}</p>
                        <p>
                          {new Date(image.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {image.imageUrl && (
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="mt-3 h-40 rounded object-cover"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(image.id)}
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

      <Card>
        <CardHeader>
          <CardTitle>Guidelines</CardTitle>
          <CardDescription>Best practices for onboarding images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Recommended Specifications:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Resolution: 1080x1920px (9:16 aspect ratio)</li>
              <li>Format: PNG or JPG</li>
              <li>File size: Max 5MB</li>
              <li>3-5 screens recommended for good UX</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Content Tips:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Use clear, high-quality images</li>
              <li>Include helpful text descriptions</li>
              <li>Show key app features</li>
              <li>Maintain consistent branding</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
