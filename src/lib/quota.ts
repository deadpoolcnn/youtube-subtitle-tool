import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { decryptApiKey } from './crypto'

const FREE_TIER_LIMIT = 5

export async function checkUserQuota(userId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  // Check if user has a YouTube API key
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('youtube_api_key')
    .eq('id', userId)
    .single()


  if (profile?.youtube_api_key) {
    return {
      hasApiKey: true,
      hasQuota: true,
      used: 0,
      limit: Infinity,
      remaining: Infinity,
    }
  }

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('subtitles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())

  const used = count || 0
  const remaining = FREE_TIER_LIMIT - used

  return {
    hasApiKey: false,
    hasQuota: remaining > 0,
    used,
    limit: FREE_TIER_LIMIT,
    remaining: Math.max(0, remaining),
  }
}

export async function getUserApiKey(userId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('youtube_api_key')
    .eq('id', userId)
    .single()

  if (profile?.youtube_api_key) {
    try {
      return decryptApiKey(profile.youtube_api_key)
    } catch (error) {
      console.error('Failed to decrypt API key:', error)
      return null
    }
  }
  
  return null
}