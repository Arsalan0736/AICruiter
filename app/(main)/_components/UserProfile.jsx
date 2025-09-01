"use client";
import { useUser } from '@/app/provider';
import { useSettings } from '@/context/SettingsContext';
import { User, Settings } from 'lucide-react';
import Link from 'next/link';

function UserProfile() {
  const { user } = useUser();
  const { settings } = useSettings();

  return (
    <div className='px-4 py-3 border-t'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
          {user?.picture ? (
            <img 
              src={user.picture} 
              alt="Profile" 
              className='w-10 h-10 rounded-full object-cover'
            />
          ) : (
            <User className='w-5 h-5 text-primary' />
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-gray-900 truncate'>
            {user?.name || 'User'}
          </p>
          <p className='text-xs text-gray-500 truncate'>
            {user?.email}
          </p>
        </div>
        <Link href='/settings'>
          <button className='p-1 text-gray-400 hover:text-gray-600 transition-colors'>
            <Settings className='w-4 h-4' />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default UserProfile;
