import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: Request) {
  const { email, password, user_metadata, role } = await req.json();

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Add to public.users table
  await supabaseAdmin.from('users').insert({
    id: data.user.id,
    email,
    role,
    username: user_metadata.username,
    is_active: true,
  });

  return NextResponse.json({ user: data.user });
}
