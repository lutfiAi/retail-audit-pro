import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null

export const signIn = (email, password) =>
  supabase?.auth.signInWithPassword({ email, password })

export const signUp = (email, password, metadata) =>
  supabase?.auth.signUp({ email, password, options: { data: metadata } })

export const signOut = () =>
  supabase?.auth.signOut()

export const getUser = async () => {
  const { data } = await supabase?.auth.getUser()
  return data?.user ?? null
}
