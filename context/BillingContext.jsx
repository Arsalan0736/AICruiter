"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';

const BillingContext = createContext();

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

export const BillingProvider = ({ children }) => {
  const { user } = useUser();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, [user]);

  const fetchCredits = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('credits')
        .eq('email', user?.email)
        .single();

      if (error) throw error;
      setCredits(data?.credits || 0);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const addCredits = async (amount) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('Users')
        .update({ credits: Number(credits) + amount })
        .eq('email', user?.email);

      if (error) throw error;
      
      await fetchCredits();
      return { success: true };
    } catch (error) {
      console.error('Error adding credits:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deductCredits = async (amount) => {
    try {
      const { error } = await supabase
        .from('Users')
        .update({ credits: Math.max(0, Number(credits) - amount) })
        .eq('email', user?.email);

      if (error) throw error;
      
      await fetchCredits();
      return { success: true };
    } catch (error) {
      console.error('Error deducting credits:', error);
      return { success: false, error: error.message };
    }
  };

  const hasEnoughCredits = (required) => {
    return credits >= required;
  };

  const value = {
    credits,
    loading,
    fetchCredits,
    addCredits,
    deductCredits,
    hasEnoughCredits,
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
};
