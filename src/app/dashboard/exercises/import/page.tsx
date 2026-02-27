'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';

interface PreviewRow {
  Name: string;
  'Exercise type': string;
  BodyPart: string;
  Equipment: string;
  'GIF Link'?: string;
  Target?: string;
  Synergist?: string;
  Gender?: string;
}

export default function ExercisesImportPage() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [pastedText, setPastedText] = useState('');
  const [skippedCount, setSkippedCount] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        if (results.data && results.data.length > 0) {
          setCsvData(results.data);
          setPreview(results.data.slice(0, 5) as PreviewRow[]);
          setErrors([]);
          setImportResult(null);
          setSkippedCount(0);
          toast.success(`Loaded ${results.data.length} rows from CSV`);
        }
      },
      error: (error: any) => {
        toast.error(`CSV parsing error: ${error.message}`);
      },
    });
  };

  const handlePasteData = () => {
    if (!pastedText.trim()) {
      toast.error('Please paste CSV data');
      return;
    }

    Papa.parse(pastedText, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        if (results.data && results.data.length > 0) {
          setCsvData(results.data);
          setPreview(results.data.slice(0, 5) as PreviewRow[]);
          setErrors([]);
          setImportResult(null);
          setPastedText('');
          setSkippedCount(0);
          toast.success(`Loaded ${results.data.length} rows from pasted data`);
        }
      },
      error: (error: any) => {
        toast.error(`CSV parsing error: ${error.message}`);
      },
    });
  };

  const handleImport = async () => {
    if (csvData.length === 0) {
      toast.error('No CSV data to import. Please load a file or paste data first.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/exercises/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors(result.validationErrors || result.details || [result.error]);
        setSkippedCount(result.skippedCount || 0);
        toast.error(result.error || 'Import failed');
      } else {
        setImportResult(result.data);
        setCsvData([]);
        setPreview([]);
        setPastedText('');
        setSkippedCount(0);
        toast.success(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Import failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Workouts</h1>
        <p className="text-muted-foreground">Import exercises from Google Sheets CSV (requires valid GIF Link)</p>
      </div>

      {/* Data Input */}
      <Card>
        <CardHeader>
          <CardTitle>Load CSV Data</CardTitle>
          <CardDescription>Choose how to provide your exercise data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed rounded-lg p-6">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Upload CSV File</p>
              <p className="text-xs text-muted-foreground">Supports .csv files from Google Sheets</p>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mt-2"
              />
            </div>
          </div>

          {/* Or Paste Data */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or paste data</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Paste CSV Data</label>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your CSV content here (headers required)"
              className="w-full px-3 py-2 border rounded-md text-sm resize-none font-mono"
              rows={4}
            />
            <Button
              onClick={handlePasteData}
              variant="outline"
              className="mt-2"
              disabled={isLoading}
            >
              Load Pasted Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Preview
              {skippedCount > 0 ? (
                <>
                  ({csvData.length - skippedCount} valid rows of {csvData.length} total - {skippedCount} skipped)
                </>
              ) : (
                <>({csvData.length} rows total)</>
              )}
            </CardTitle>
            <CardDescription>Showing first 5 rows with valid GIF Link</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Exercise Type</TableHead>
                    <TableHead>Body Part</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Target Muscles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.Name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {row['Exercise type']}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.BodyPart}</TableCell>
                      <TableCell>{row.Equipment}</TableCell>
                      <TableCell>{row.Gender || 'Unisex'}</TableCell>
                      <TableCell className="text-xs">
                        {row.Target ? row.Target.split(',').length : 0} muscles
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              Validation Errors
              {skippedCount > 0 && <span className="text-sm font-normal ml-2">({skippedCount} records skipped - no GIF Link)</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {errors.map((error, idx) => (
                <p key={idx} className="text-sm text-red-800">
                  • {error}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Result */}
      {importResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle className="h-5 w-5" />
              Import Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-2xl font-bold text-green-600">{importResult.createdCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="text-2xl font-bold text-blue-600">{importResult.updatedCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{importResult.failureCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{importResult.totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleImport}
          disabled={csvData.length === 0 || isLoading}
          size="lg"
          className="gap-2"
        >
          {isLoading ? 'Importing...' : 'Import Exercises'}
        </Button>
        {csvData.length > 0 && (
          <Button
            onClick={() => {
              setCsvData([]);
              setPreview([]);
              setErrors([]);
              setImportResult(null);
            }}
            variant="outline"
            size="lg"
          >
            Clear
          </Button>
        )}
      </div>

      {/* CSV Format Guide */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">CSV Format Guide</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900 space-y-2">
          <p><strong>Required Column:</strong> GIF Link (only records with valid GIF Link will be imported)</p>
          <p>Other columns for context:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>ID</strong> (optional) - Unique identifier</li>
            <li><strong>Name</strong> - Exercise name</li>
            <li><strong>Exercise type</strong> - Strength, Cardio, Flexibility, or Balance</li>
            <li><strong>BodyPart</strong> - Target body part (e.g., Chest, Legs)</li>
            <li><strong>Equipment</strong> - Equipment used</li>
            <li><strong>Gender</strong> (optional) - Male, Female, or Unisex</li>
            <li><strong>Target</strong> (optional) - Primary muscles (comma-separated)</li>
            <li><strong>Synergist</strong> (optional) - Secondary muscles (comma-separated)</li>
            <li><strong>GIF Link</strong> (required) - URL to exercise form image/GIF</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
