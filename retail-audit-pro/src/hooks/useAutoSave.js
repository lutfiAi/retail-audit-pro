import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useAutoSave(key, data, delay = 1500) {
  const timer = useRef(null)

  useEffect(() => {
    // Save to localStorage always (works without Supabase)
    localStorage.setItem(`rap_${key}`, JSON.stringify(data))

    // Save to Supabase if connected
    if (supabase) {
      clearTimeout(timer.current)
      timer.current = setTimeout(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from('audit_sessions').upsert({
          user_id: user.id,
          session_key: key,
          data: data,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,session_key' })
      }, delay)
    }

    return () => clearTimeout(timer.current)
  }, [key, data, delay])
}

export function loadSaved(key) {
  try {
    const raw = localStorage.getItem(`rap_${key}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
