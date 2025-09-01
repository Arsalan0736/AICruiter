import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function PUT(request) {
  try {
    const { email, settings } = await request.json();

    if (!email || !settings) {
      return NextResponse.json({ 
        error: 'Email and settings are required' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('Users')
      .update(settings)
      .eq('email', email)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Settings updated successfully',
      data 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('Users')
      .select('name, picture, timezone, language, notifications, privacy')
      .eq('email', email)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      settings: data
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
