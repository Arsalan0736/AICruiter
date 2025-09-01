"use client";
import { useUser } from '@/app/provider';
import { useSettings } from '@/context/SettingsContext';
import { User, Settings } from 'lucide-react';
import Link from 'next/link';

function UserProfile() {
  const { user } = useUser();
  const { settings } = useSettings();

  return (
    <div className='px-4 py-3 border-t border-white/10'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center'>
          {user?.picture ? (
            <img 
              src={user.picture} 
              alt="Profile" 
              className='w-10 h-10 rounded-full object-cover border border-white/30'
            />
          ) : (
            <User className='w-5 h-5 text-purple-400' />
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-white truncate'>
            {user?.name || 'User'}
          </p>
          <p className='text-xs text-gray-300 truncate'>
            {user?.email}
          </p>
        </div>
        <Link href='/settings'>
          <button className='p-1 text-gray-300 hover:text-white transition-colors'>
            <Settings className='w-4 h-4' />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default UserProfile;
