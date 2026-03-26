import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://ygybvzahqzpfaamigyor.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlneWJ2emFocXpwZmFhbWlneW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjE1MjEsImV4cCI6MjA5MDAzNzUyMX0.29fMHqUc9dBL73WZfeVdGC16BN7RtRWCycwRglpIVI8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuth() {
  const testEmail = 'kaipalandlord' + Date.now().toString().slice(-4) + '@gmail.com'
  const testPassword = 'Password123!'

  console.log('Signing up...')
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        name: 'Test Landlord',
        phone: '1234567890',
        role: 'landlord'
      }
    }
  })

  if (signUpError) {
    console.error('SignUp Error:', signUpError)
    fs.writeFileSync('test-error.json', JSON.stringify({ step: 'signup', error: signUpError }, null, 2))
    return
  }
  
  console.log('SignUp Success User ID:', signUpData.user?.id)

  console.log('Logging in...')
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  })

  if (loginError) {
    console.error('Login Error:', loginError)
    fs.writeFileSync('test-error.json', JSON.stringify({ step: 'login', error: loginError }, null, 2))
    // Sometimes it needs email confirmation
  } else {
    console.log('Login Success User ID:', loginData.user?.id)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', loginData.user?.id)
      .single()

    if (profileError) {
      console.error('Profile Fetch Error:', profileError)
      fs.writeFileSync('test-error.json', JSON.stringify({ step: 'profile', error: profileError }, null, 2))
    } else {
      fs.writeFileSync('test-error.json', JSON.stringify({ step: 'success', profile, loginData }, null, 2))
      console.log('Profile:', profile)
    }
  }
}

testAuth()
