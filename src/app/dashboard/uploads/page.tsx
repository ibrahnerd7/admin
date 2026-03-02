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
import { UploadHistory } from '@/types';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadsPage() {
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    // Load mock history
    const mockHistory: UploadHistory[] = [
      {
        id: '1',
        fileName: 'workouts_batch_1.csv',
        fileSize: 45000,
        uploadedBy: 'admin',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'success',
        recordsProcessed: 45,
      },
      {
        id: '2',
        fileName: 'workouts_batch_2.json',
        fileSize: 67000,
        uploadedBy: 'admin',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'success',
        recordsProcessed: 32,
      },
    ];
    setUploadHistory(mockHistory);
    setIsHistoryLoading(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isValidType = ['text/csv', 'application/json'].includes(selectedFile.type);
      if (!isValidType) {
        toast.error('Only CSV and JSON files are supported');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      toast.success(`Successfully uploaded ${file.name}`);
      setFile(null);

      // Reload history
      const newRecord: UploadHistory = {
        id: Date.now().toString(),
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: 'admin',
        timestamp: new Date().toISOString(),
        status: 'success',
        recordsProcessed: result.recordsProcessed || 0,
      };
      setUploadHistory([newRecord, ...uploadHistory]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Data</h1>
        <p className="text-muted-foreground">
          Import workout data from CSV or JSON files
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Supported formats: CSV, JSON. Max file size: 10MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-slate-50 transition">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <label className="block cursor-pointer">
                <span className="text-sm font-medium">
                  Click to upload or drag and drop
                </span>
                <p className="text-xs text-muted-foreground">
                  CSV or JSON (up to 10MB)
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.json"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </label>
              {file && (
                <div className="mt-4 p-4 bg-blue-50 rounded text-sm text-blue-900">
                  <p>Selected: {file.name}</p>
                  <p className="text-xs">Size: {(file.size / 1024).toFixed(2)} KB</p>
                </div>
              )}
            </div>

            <Button type="submit" disabled={!file || isLoading} className="w-full">
              {isLoading ? 'Uploading...' : 'Upload File'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>Recent file uploads and imports</CardDescription>
        </CardHeader>
        <CardContent>
          {isHistoryLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : uploadHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No uploads yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.fileName}</TableCell>
                    <TableCell className="text-sm">
                      {(record.fileSize / 1024).toFixed(2)} KB
                    </TableCell>
                    <TableCell className="text-sm">
                      {record.recordsProcessed || 0}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={record.status === 'success' ? 'default' : 'destructive'}
                        className="flex items-center gap-1 w-fit"
                      >
                        {record.status === 'success' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(record.timestamp).toLocaleDateString()} at{' '}
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Format</CardTitle>
          <CardDescription>Expected data structure for imports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">CSV Format:</h4>
            <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
{`name,bodyPart,category,level,equipment,numberOfReps,weight
Push-Up,Chest,Strength,Beginner,None,12,0
Dumbbell Bench Press,Chest,Strength,Intermediate,Dumbbell,10,30`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">JSON Format:</h4>
            <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
{`[
  {
    "name": "Push-Up",
    "bodyPart": "Chest",
    "category": "Strength",
    "level": "Beginner",
    "equipment": "None",
    "numberOfReps": 12,
    "weight": 0
  }
]`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
