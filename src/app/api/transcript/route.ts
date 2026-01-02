import { NextRequest, NextResponse } from 'next/server';

const SUPADATA_API_KEY = process.env.SUPADATA_API_KEY;
const SUPADATA_API_URL = 'https://api.supadata.ai/v1/transcript';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!SUPADATA_API_KEY) {
      console.error('SUPADATA_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API key is not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { url, lang = 'en', text = false } = body;

    // Validate input
    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Build API URL with query parameters
    const apiUrl = new URL(SUPADATA_API_URL);
    apiUrl.searchParams.append('url', url);
    apiUrl.searchParams.append('lang', lang);
    if (text) {
      apiUrl.searchParams.append('text', 'true');
    }

    // Call Supadata API
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': SUPADATA_API_KEY!,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supadata API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch transcript. Please check the URL and try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
