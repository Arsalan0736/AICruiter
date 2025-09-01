"use client";
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

function Settings() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    picture: '',
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

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        picture: user.picture || '',
        timezone: user.timezone || 'UTC',
        language: user.language || 'en',
        notifications: user.notifications || {
          email: true,
          push: true,
          sms: false
        },
        privacy: user.privacy || {
          profileVisibility: 'public',
          showEmail: false,
          allowContact: true
        }
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('Users')
        .update({
          name: formData.name,
          picture: formData.picture,
          timezone: formData.timezone,
          language: formData.language,
          notifications: formData.notifications,
          privacy: formData.privacy
        })
        .eq('email', user?.email);

      if (error) throw error;

      // Update local user state
      setUser(prev => ({
        ...prev,
        ...formData
      }));

      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success('Signed out successfully!');
      // Redirect to landing page
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
      console.error('Error signing out:', error);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'preferences', name: 'Preferences', icon: Globe },
    { id: 'account', name: 'Account', icon: Shield }
  ];

  const renderProfileTab = () => (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <div className='relative'>
          <div className='w-20 h-20 bg-white/10 rounded-full flex items-center justify-center'>
            {formData.picture ? (
              <img 
                src={formData.picture} 
                alt="Profile" 
                className='w-20 h-20 rounded-full object-cover border border-white/30'
              />
            ) : (
              <User className='w-10 h-10 text-purple-400' />
            )}
          </div>
          <Button 
            size='sm' 
            variant='outline' 
            className='absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full border-white/30 text-white hover:bg-white/10'
          >
            <User className='w-4 h-4' />
          </Button>
        </div>
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-white'>Profile Picture</h3>
          <p className='text-sm text-gray-300'>Upload a new profile picture</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='text-sm font-medium text-white'>Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder='Enter your full name'
            className='mt-1 bg-white/10 border-white/30 text-white placeholder:text-gray-300'
          />
        </div>
        <div>
          <label className='text-sm font-medium text-white'>Email</label>
          <Input
            value={formData.email}
            disabled
            className='mt-1 bg-white/5 border-white/20 text-gray-300'
          />
          <p className='text-xs text-gray-400 mt-1'>Email cannot be changed</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='text-sm font-medium text-white'>Timezone</label>
          <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
            <SelectTrigger className='mt-1 bg-white/10 border-white/30 text-white'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value='UTC' className="text-white hover:bg-white/10">UTC</SelectItem>
              <SelectItem value='EST' className="text-white hover:bg-white/10">Eastern Time</SelectItem>
              <SelectItem value='PST' className="text-white hover:bg-white/10">Pacific Time</SelectItem>
              <SelectItem value='GMT' className="text-white hover:bg-white/10">GMT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className='text-sm font-medium text-white'>Language</label>
          <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
            <SelectTrigger className='mt-1 bg-white/10 border-white/30 text-white'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value='en' className="text-white hover:bg-white/10">English</SelectItem>
              <SelectItem value='es' className="text-white hover:bg-white/10">Spanish</SelectItem>
              <SelectItem value='fr' className="text-white hover:bg-white/10">French</SelectItem>
              <SelectItem value='de' className="text-white hover:bg-white/10">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5'>
          <div>
            <h4 className='font-medium text-white'>Email Notifications</h4>
            <p className='text-sm text-gray-300'>Receive notifications via email</p>
          </div>
          <Button
            variant={formData.notifications.email ? 'default' : 'outline'}
            size='sm'
            className={formData.notifications.email ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0' : 'border-white/30 text-white hover:bg-white/10'}
            onClick={() => handleInputChange('notifications.email', !formData.notifications.email)}
          >
            {formData.notifications.email ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        <div className='flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5'>
          <div>
            <h4 className='font-medium text-white'>Push Notifications</h4>
            <p className='text-sm text-gray-300'>Receive push notifications in browser</p>
          </div>
          <Button
            variant={formData.notifications.push ? 'default' : 'outline'}
            size='sm'
            className={formData.notifications.push ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0' : 'border-white/30 text-white hover:bg-white/10'}
            onClick={() => handleInputChange('notifications.push', !formData.notifications.push)}
          >
            {formData.notifications.push ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        <div className='flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5'>
          <div>
            <h4 className='font-medium text-white'>SMS Notifications</h4>
            <p className='text-sm text-gray-300'>Receive notifications via SMS</p>
          </div>
          <Button
            variant={formData.notifications.sms ? 'default' : 'outline'}
            size='sm'
            className={formData.notifications.sms ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0' : 'border-white/30 text-white bg-white/10'}
            onClick={() => handleInputChange('notifications.sms', !formData.notifications.sms)}
          >
            {formData.notifications.sms ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div>
          <label className='text-sm font-medium text-gray-700'>Profile Visibility</label>
          <Select value={formData.privacy.profileVisibility} onValueChange={(value) => handleInputChange('privacy.profileVisibility', value)}>
            <SelectTrigger className='mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='public'>Public</SelectItem>
              <SelectItem value='private'>Private</SelectItem>
              <SelectItem value='friends'>Friends Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center justify-between p-4 border rounded-lg'>
          <div>
            <h4 className='font-medium'>Show Email Address</h4>
            <p className='text-sm text-gray-500'>Allow others to see your email address</p>
          </div>
          <Button
            variant={formData.privacy.showEmail ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleInputChange('privacy.showEmail', !formData.privacy.showEmail)}
          >
            {formData.privacy.showEmail ? 'Visible' : 'Hidden'}
          </Button>
        </div>

        <div className='flex items-center justify-between p-4 border rounded-lg'>
          <div>
            <h4 className='font-medium'>Allow Contact</h4>
            <p className='text-sm text-gray-500'>Allow others to contact you</p>
          </div>
          <Button
            variant={formData.privacy.allowContact ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleInputChange('privacy.allowContact', !formData.privacy.allowContact)}
          >
            {formData.privacy.allowContact ? 'Allowed' : 'Blocked'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div>
          <label className='text-sm font-medium text-gray-700'>Theme</label>
          <Select defaultValue='light'>
            <SelectTrigger className='mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='light'>Light</SelectItem>
              <SelectItem value='dark'>Dark</SelectItem>
              <SelectItem value='auto'>Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm font-medium text-gray-700'>Font Size</label>
          <Select defaultValue='medium'>
            <SelectTrigger className='mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='small'>Small</SelectItem>
              <SelectItem value='medium'>Medium</SelectItem>
              <SelectItem value='large'>Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center justify-between p-4 border rounded-lg'>
          <div>
            <h4 className='font-medium'>Compact Mode</h4>
            <p className='text-sm text-gray-500'>Use compact layout for better space utilization</p>
          </div>
          <Button variant='outline' size='sm'>
            Disabled
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div>
          <label className='text-sm font-medium text-gray-700'>Default Interview Duration</label>
          <Select defaultValue='30'>
            <SelectTrigger className='mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='15'>15 minutes</SelectItem>
              <SelectItem value='30'>30 minutes</SelectItem>
              <SelectItem value='45'>45 minutes</SelectItem>
              <SelectItem value='60'>1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm font-medium text-gray-700'>Default Interview Type</label>
          <Select defaultValue='technical'>
            <SelectTrigger className='mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='technical'>Technical</SelectItem>
              <SelectItem value='behavioral'>Behavioral</SelectItem>
              <SelectItem value='mixed'>Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center justify-between p-4 border rounded-lg'>
          <div>
            <h4 className='font-medium'>Auto-save Drafts</h4>
            <p className='text-sm text-gray-500'>Automatically save interview drafts</p>
          </div>
          <Button variant='default' size='sm'>
            Enabled
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className='space-y-6'>
      <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-red-400 mb-2'>Danger Zone</h3>
        <p className='text-gray-300 mb-4'>These actions cannot be undone. Please proceed with caution.</p>
        
        <div className='flex items-center justify-between'>
          <div>
            <h4 className='font-medium text-white'>Sign Out</h4>
            <p className='text-sm text-gray-400'>Sign out of your account on this device</p>
          </div>
          <Button 
            variant='outline' 
            onClick={handleSignOut}
            className='border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300'
          >
            <LogOut className='w-4 h-4 mr-2' />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'account':
        return renderAccountTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className='mt-5 px-5 md:px-10 lg:px-20'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white'>Settings</h1>
        <p className='text-gray-300 mt-2'>Manage your account settings and preferences</p>
      </div>

      <div className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg'>
        {/* Tab Navigation */}
        <div className='border-b border-white/20'>
          <div className='flex space-x-8 px-6'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-purple-400'
                    : 'border-transparent text-gray-300 hover:text-white'
                }`}
              >
                <tab.icon className='w-4 h-4' />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          {renderTabContent()}
        </div>

        {/* Save Button */}
        <div className='border-t border-white/20 p-6 flex justify-end'>
          <Button 
            onClick={saveSettings} 
            disabled={loading}
            className='flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'
          >
            {loading ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : (
              <Save className='w-4 h-4' />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
