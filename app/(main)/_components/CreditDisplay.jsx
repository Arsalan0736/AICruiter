"use client";
import { useBilling } from '@/context/BillingContext';
import { CreditCard } from 'lucide-react';

function CreditDisplay() {
  const { credits } = useBilling();

  return (
    <div className='flex items-center gap-2 px-4 py-2 bg-purple-600/30 border border-purple-400/50 rounded-lg mx-4 mb-4'>
      <CreditCard className='h-4 w-4 text-purple-300' />
      <span className='text-sm font-medium text-white'>{credits} Credits</span>
    </div>
  );
}

export default CreditDisplay;
