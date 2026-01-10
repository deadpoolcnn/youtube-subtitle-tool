import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { checkUserQuota, getUserApiKey } from '@/lib/quota';


const SUPADATA_API_KEY = process.env.SUPADATA_API_KEY;
const SUPADATA_API_URL = 'https://api.supadata.ai/v1/transcript';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );
    // Get logged in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'not logged in' }, { status: 401 });
    }
    // Check user quota
    const quota = await checkUserQuota(user.id);
    
    if (!quota.hasQuota && !quota.hasApiKey) {
      return NextResponse.json(
        { 
          error: 'QUOTA_EXCEEDED',
          message: `${quota.limit} times/month. Please provide your own YouTube API Key to continue using the service.`,
          quota 
        },
        { status: 403 }
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
    // Get user's API Key (if any)
    const userApiKey = await getUserApiKey(user.id);

    // Use user's API Key if available, otherwise use server's key
    const apiKey = userApiKey || SUPADATA_API_KEY;

    if (!apiKey) {
      console.error('No API key available');
      return NextResponse.json(
        { error: 'API key is not configured. Please add your YouTube API Key in settings.' },
        { status: 500 }
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

      // If user has API key, the error might be due to their key
      if (userApiKey) {
        return NextResponse.json(
          { error: 'Your API Key may be invalid or has reached its quota. Please check your YouTube API Key in settings.' },
          { status: response.status }
        );
      }

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
