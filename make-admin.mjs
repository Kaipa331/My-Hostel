import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ygybvzahqzpfaamigyor.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlneWJ2emFocXpwZmFhbWlneW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjE1MjEsImV4cCI6MjA5MDAzNzUyMX0.29fMHqUc9dBL73WZfeVdGC16BN7RtRWCycwRglpIVI8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminAccount() {
  console.log('Checking if admin account already exists...')

  // Try to sign in with existing admin account
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@myhostel.com',
    password: 'admin123'
  })

  if (signInError) {
    if (signInError.message.includes('Invalid login credentials')) {
      console.log('Admin account does not exist, creating new one...')
      
      // Create new account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@myhostel.com',
        password: 'admin123',
        options: {
          data: {
            name: 'System Admin',
            role: 'admin'
          }
        }
      })

      if (signUpError) {
        console.error('Signup error:', signUpError)
        return
      }

      console.log('Admin account created. Please check email for confirmation.')
      return
    }
    
    if (signInError.message.includes('Email not confirmed')) {
      console.log('Admin account exists but email not confirmed.')
      console.log('Please check your email (admin@myhostel.com) and confirm the account.')
      console.log('Then run this script again.')
      return
    }
    
    console.error('Sign in error:', signInError)
    return
  }

  console.log('Admin account exists and is confirmed!')
}

async function signInAdmin() {
  console.log('Attempting to sign in admin...')

  // First try to sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@myhostel.com',
    password: 'admin123'
  })

  if (error) {
    if (error.message.includes('Email not confirmed')) {
      console.log('Email not confirmed. Trying to resend confirmation...')
      
      // Try to resend confirmation
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: 'admin@myhostel.com'
      })
      
      if (resendError) {
        console.error('Resend error:', resendError)
        console.log('Please check your email and confirm the admin account manually.')
        console.log('Then run this script again.')
        return
      }
      
      console.log('Confirmation email resent. Please check your email and confirm, then run this script again.')
      return
    }
    console.error('Sign in error:', error)
    return
  }

  console.log('Admin signed in successfully')

  // Wait for profile creation
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Check if profile was created
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'admin@myhostel.com')
    .single()

  if (profileError) {
    console.error('Profile still not found:', profileError)
  } else {
    console.log('Admin profile created:', profile)
  }

  // Sign out
  await supabase.auth.signOut()
}

async function checkProfiles() {
  console.log('Checking all profiles...')

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, status')

  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }

  console.log('All profiles:', profiles)

  // Also check for emails containing 'kaipa'
  const kaipaProfiles = profiles.filter(p => p.email.toLowerCase().includes('kaipa'))
  if (kaipaProfiles.length > 0) {
    console.log('Found Kaipa profiles:', kaipaProfiles)
  }
}

async function makeAdmin() {
  const email = 'kaipap33@gmail.com'

  console.log('Checking for existing profile...')

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('id, role, status')
    .eq('email', email)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      console.log('Profile not found. Creating admin account first...')
      await createAdminAccount()
      await signInAdmin()
      console.log('\n=== ADMIN CREDENTIALS ===')
      console.log('Email: admin@myhostel.com')
      console.log('Password: admin123')
      console.log('========================\n')
      console.log('Now you can use these credentials to approve your landlord account!')
      return
    }
    console.error('Error fetching profile:', fetchError)
    return
  }

  console.log('Current profile:', profile)

  if (profile.role === 'admin') {
    console.log('User is already an admin!')
    return
  }

  // Update the role to admin and status to approved
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'admin', status: 'approved' })
    .eq('id', profile.id)
    .select()

  if (error) {
    console.error('Error updating profile:', error)
    return
  }

  console.log('Successfully made user an admin:', data)
}

// Run the main function
makeAdmin()