import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function POST(request) {
  try {
    const { email, credits, amount } = await request.json();

    // Here you would typically integrate with a payment processor like Stripe
    // For now, we'll just update the credits directly
    
    const { data, error } = await supabase
      .from('Users')
      .update({ credits: credits })
      .eq('email', email)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `${credits} credits added successfully`,
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
      .select('credits, email')
      .eq('email', email)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      credits: data.credits,
      email: data.email
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
