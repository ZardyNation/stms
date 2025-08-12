'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function login(prevState: { error: string } | undefined, formData: FormData) {
  const password = formData.get('password');

  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin-session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect('/admin');
  }

  return { error: 'Invalid password.' };
}

export async function logout() {
  cookies().delete('admin-session');
  redirect('/admin/login');
}
