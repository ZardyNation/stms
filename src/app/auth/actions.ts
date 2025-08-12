
'use server'
 
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
 
export async function login(formData: FormData) {
  const supabase = createClient()

  if (!supabase) {
    redirect('/login?message=Supabase is not configured. Please check your environment variables.')
    return;
  }
 
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
 
  const { error } = await supabase.auth.signInWithPassword(data)
 
  if (error) {
    redirect('/?message=Could not authenticate user')
  }
 
  revalidatePath('/', 'layout')
  redirect('/')
}
 
export async function signup(formData: FormData) {
  const supabase = createClient()
 
  if (!supabase) {
    redirect('/?message=Supabase is not configured. Please check your environment variables.')
    return;
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
 
  const { error } = await supabase.auth.signUp(data)
 
  if (error) {
    redirect('/?message=Could not authenticate user')
  }
 
  revalidatePath('/', 'layout')
  redirect('/?message=Check email to continue sign in process')
}

export async function signOut() {
  const supabase = createClient()
  if (!supabase) {
    return;
  }
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
