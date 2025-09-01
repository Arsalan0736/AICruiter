"use client";
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Zap, Crown, Star } from 'lucide-react';
import { toast } from 'sonner';

function Billing() {
  const { user } = useUser();
  const [userCredits, setUserCredits] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserCredits();
    }
  }, [user]);

  const fetchUserCredits = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('credits')
        .eq('email', user?.email)
        .single();

      if (error) throw error;
      setUserCredits(data?.credits || 0);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const addCredits = async (amount) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('Users')
        .update({ credits: Number(userCredits) + amount })
        .eq('email', user?.email);

      if (error) throw error;
      
      toast.success(`${amount} credits added successfully!`);
      await fetchUserCredits();
    } catch (error) {
      toast.error('Failed to add credits. Please try again.');
      console.error('Error adding credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Starter',
      credits: 10,
      price: 9.99,
      icon: Star,
      popular: false,
      features: ['10 Interview Credits', 'Basic Support', 'Standard Questions']
    },
    {
      name: 'Professional',
      credits: 50,
      price: 39.99,
      icon: Zap,
      popular: true,
      features: ['50 Interview Credits', 'Priority Support', 'Advanced Questions', 'Custom Templates']
    },
    {
      name: 'Enterprise',
      credits: 200,
      price: 149.99,
      icon: Crown,
      popular: false,
      features: ['200 Interview Credits', '24/7 Support', 'Premium Questions', 'Custom Templates', 'Analytics Dashboard']
    }
  ];

  return (
    <div className='mt-5 px-5 md:px-10 lg:px-20'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Billing & Credits</h1>
        <p className='text-gray-600 mt-2'>Manage your interview credits and subscription plans</p>
      </div>

      {/* Current Credits Section */}
      <div className='bg-white rounded-lg border p-6 mb-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-primary/10 p-3 rounded-full'>
              <CreditCard className='h-6 w-6 text-primary' />
            </div>
            <div>
              <h2 className='text-xl font-semibold'>Current Credits</h2>
              <p className='text-gray-600'>Available interview credits</p>
            </div>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold text-primary'>{userCredits}</div>
            <div className='text-sm text-gray-500'>credits remaining</div>
          </div>
        </div>
        
        <div className='mt-6 flex gap-3'>
          <Button 
            onClick={() => addCredits(5)} 
            disabled={loading}
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Add 5 Credits
          </Button>
          <Button 
            onClick={() => addCredits(10)} 
            disabled={loading}
            variant='outline'
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Add 10 Credits
          </Button>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>Choose Your Plan</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg border p-6 relative ${
                plan.popular ? 'border-primary shadow-lg' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                  <span className='bg-primary text-white px-3 py-1 rounded-full text-sm font-medium'>
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className='text-center mb-6'>
                <div className={`inline-flex p-3 rounded-full mb-4 ${
                  plan.popular ? 'bg-primary/10' : 'bg-gray-100'
                }`}>
                  <plan.icon className={`h-8 w-8 ${
                    plan.popular ? 'text-primary' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className='text-xl font-bold text-gray-900'>{plan.name}</h3>
                <div className='mt-2'>
                  <span className='text-3xl font-bold text-gray-900'>${plan.price}</span>
                  <span className='text-gray-500'>/month</span>
                </div>
                <div className='text-lg font-semibold text-primary mt-1'>
                  {plan.credits} Credits
                </div>
              </div>

              <ul className='space-y-3 mb-6'>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <span className='text-gray-600'>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-gray-800 hover:bg-gray-900'
                }`}
                onClick={() => addCredits(plan.credits)}
                disabled={loading}
              >
                Get {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Usage Info */}
      <div className='bg-blue-50 rounded-lg border border-blue-200 p-6'>
        <h3 className='text-lg font-semibold text-blue-900 mb-3'>How Credits Work</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
            <span>1 credit = 1 interview creation</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
            <span>Credits are deducted when you create an interview</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
            <span>Unlimited candidates can take your interviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;
