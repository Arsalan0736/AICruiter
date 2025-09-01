"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const { user } = useUser();
  const [settings, setSettings] = useState({
    timezone: 'UTC',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      allowContact: true
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('timezone, language, notifications, privacy')
        .eq('email', user?.email)
        .single();

      if (error) throw error;
      
      if (data) {
        setSettings({
          timezone: data.timezone || 'UTC',
          language: data.language || 'en',
          notifications: data.notifications || {
            email: true,
            push: true,
            sms: false
          },
          privacy: data.privacy || {
            profileVisibility: 'public',
            showEmail: false,
            allowContact: true
          }
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('Users')
        .update(newSettings)
        .eq('email', user?.email);

      if (error) throw error;
      
      setSettings(prev => ({
        ...prev,
        ...newSettings
      }));

      return { success: true };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSetting = async (type, enabled) => {
    const newNotifications = {
      ...settings.notifications,
      [type]: enabled
    };

    return await updateSettings({ notifications: newNotifications });
  };

  const updatePrivacySetting = async (type, value) => {
    const newPrivacy = {
      ...settings.privacy,
      [type]: value
    };

    return await updateSettings({ privacy: newPrivacy });
  };

  const value = {
    settings,
    loading,
    fetchSettings,
    updateSettings,
    updateNotificationSetting,
    updatePrivacySetting,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
