import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ygybvzahqzpfaamigyor.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlneWJ2emFocXpwZmFhbWlneW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjE1MjEsImV4cCI6MjA5MDAzNzUyMX0.29fMHqUc9dBL73WZfeVdGC16BN7RtRWCycwRglpIVI8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
  console.log('Result:', { data, error })
}
run()
