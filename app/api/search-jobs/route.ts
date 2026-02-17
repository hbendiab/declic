import { NextResponse } from 'next/server';

/**
 * API de recherche de métiers avec RAG
 *
 * POST /api/search-jobs
 * Body: { query: string, n_results?: number }
 *
 * Retourne: Liste des métiers les plus pertinents
 */
export async function POST(request: Request) {
  try {
    const { query, n_results = 5 } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Appeler le script Python pour la recherche
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python3', [
      'search_jobs.py',
      query,
      n_results.toString()
    ]);

    // Collecter la sortie
    let dataString = '';

    for await (const chunk of pythonProcess.stdout) {
      dataString += chunk;
    }

    // Parser le résultat JSON
    const results = JSON.parse(dataString);

    return NextResponse.json({
      success: true,
      query,
      results: results.jobs,
      count: results.jobs.length
    });

  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET pour tester l'API
 */
export async function GET() {
  return NextResponse.json({
    message: 'Job Search API',
    usage: 'POST with { query: string, n_results?: number }',
    example: {
      query: 'métiers créatifs',
      n_results: 5
    }
  });
}
