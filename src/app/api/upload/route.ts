import { NextRequest, NextResponse } from 'next/server';
import { createUploadHistory, createWorkout } from '@/lib/db';
import { validateCSVWorkoutData } from '@/lib/validation';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
    const isJSON = file.type === 'application/json' || file.name.endsWith('.json');

    if (!isCSV && !isJSON) {
      return NextResponse.json(
        { error: 'Invalid file type. Only CSV and JSON are supported.' },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    let parsedData: any[] = [];

    if (isCSV) {
      const parseResult = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });
      parsedData = parseResult.data;
    } else if (isJSON) {
      parsedData = JSON.parse(fileContent);
    }

    // Validate the data
    const validation = validateCSVWorkoutData(parsedData);

    if (!validation.valid) {
      // Save failed upload record
      await createUploadHistory({
        id: Date.now().toString(),
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: 'admin',
        timestamp: new Date().toISOString(),
        status: 'failed',
        errorMessage: validation.errors.join('; '),
      });

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // Save workouts to database
    let recordsProcessed = 0;
    if (validation.processedData) {
      for (const workout of validation.processedData) {
        try {
          await createWorkout(workout);
          recordsProcessed++;
        } catch (error) {
          console.error('Failed to save workout:', error);
        }
      }
    }

    // Save successful upload record
    await createUploadHistory({
      id: Date.now().toString(),
      fileName: file.name,
      fileSize: file.size,
      uploadedBy: 'admin',
      timestamp: new Date().toISOString(),
      status: 'success',
      recordsProcessed,
    });

    return NextResponse.json(
      {
        success: true,
        recordsProcessed,
        message: `Successfully imported ${recordsProcessed} workouts`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Upload failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
