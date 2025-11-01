'use client'
import React,{ useEffect, useState, useContext, useRef } from 'react';
import { supabase, clearStaleSession } from '@/services/supabaseClient';
import { UserDetailContext } from '@/context/UserDetailContext';
import { BillingProvider } from '@/context/BillingContext';
import { SettingsProvider } from '@/context/SettingsContext';

function Provider({children}){
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const processingUserRef = useRef(false);
    const userEmailRef = useRef(null);
    
    const CreateNewUser = async (authUser) => {
        // Prevent multiple simultaneous calls for the same user
        if (processingUserRef.current) {
            console.log('User creation already in progress, skipping...');
            return;
        }

        if (!authUser?.email) {
            console.error('Invalid auth user:', authUser);
            setLoading(false);
            return;
        }

        // Check if we already have this user loaded using ref to avoid stale closure
        if (userEmailRef.current === authUser?.email) {
            console.log('User already loaded, skipping...');
            setLoading(false);
            return;
        }

        processingUserRef.current = true;

        try {
            // Check if user already exists
            let { data: Users, error } = await supabase
               .from('Users')
               .select("*")
               .eq('email', authUser?.email);
            
            if (error) {
                console.error('Error fetching user:', error);
                // Still set user from auth user as fallback
                const fallbackUser = {
                    email: authUser?.email,
                    name: authUser?.user_metadata?.name,
                    picture: authUser?.user_metadata?.picture
                };
                setUser(fallbackUser);
                userEmailRef.current = fallbackUser.email;
                setLoading(false);
                return;
            }
            
            console.log('Existing users:', Users);
            
            if(!Users || Users.length === 0){
                // Create new user
                const { data, error: insertError } = await supabase.from('Users').insert({
                    email: authUser?.email,
                    name: authUser?.user_metadata?.name,
                    picture: authUser?.user_metadata?.picture,
                    credits: 5 // Give new users 5 free credits
                }).select();
                
                if (insertError) {
                    console.error('Error creating user:', insertError);
                    // Set user from auth data as fallback
                    const fallbackUser = {
                        email: authUser?.email,
                        name: authUser?.user_metadata?.name,
                        picture: authUser?.user_metadata?.picture,
                        credits: 5
                    };
                    setUser(fallbackUser);
                    userEmailRef.current = fallbackUser.email;
                } else {
                    console.log('New user created:', data);
                    const newUser = data?.[0] || {
                        email: authUser?.email,
                        name: authUser?.user_metadata?.name,
                        picture: authUser?.user_metadata?.picture,
                        credits: 5
                    };
                    setUser(newUser);
                    userEmailRef.current = newUser.email;
                }
            } else {
                setUser(Users[0]);
                userEmailRef.current = Users[0]?.email;
            }
        } catch (error) {
            console.error('Error in CreateNewUser:', error);
            // Set user from auth data as fallback to prevent infinite loading
            if (authUser?.email) {
                const fallbackUser = {
                    email: authUser?.email,
                    name: authUser?.user_metadata?.name,
                    picture: authUser?.user_metadata?.picture
                };
                setUser(fallbackUser);
                userEmailRef.current = fallbackUser.email;
            }
        } finally {
            setLoading(false);
            processingUserRef.current = false;
        }
    };

    useEffect(() => {
        let mounted = true;
        let subscription = null;

        // Initialize auth - handle token refresh errors gracefully
        const initializeAuth = async () => {
            try {
                // Get the session (Supabase will try to refresh token if needed)
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (!mounted) return;

                // If there's an error, it's likely a token refresh failure
                // This happens with stale tokens - we'll just continue as unauthenticated
                if (error) {
                    // Only clear storage if it's a persistent network/refresh error
                    // and only log non-refresh errors in development
                    const isRefreshError = 
                        error.message?.includes('refresh') || 
                        error.message?.includes('Failed to fetch') ||
                        error.message?.includes('token');
                    
                    if (isRefreshError) {
                        // Clear stale token - it's invalid anyway
                        clearStaleSession();
                    } else if (process.env.NODE_ENV === 'development') {
                        console.error('Error getting session:', error);
                    }
                    setLoading(false);
                    return;
                }

                if (session?.user) {
                    await CreateNewUser(session.user);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                // Suppress network errors related to token refresh
                // These happen when there's a stale token and Supabase tries to refresh it
                if (process.env.NODE_ENV === 'development') {
                    const isTokenRefreshError = 
                        error.message?.includes('Failed to fetch') || 
                        error.message?.includes('Token refresh') ||
                        error.message?.includes('ERR_NAME_NOT_RESOLVED');
                    
                    if (!isTokenRefreshError) {
                        console.error('Unexpected error getting session:', error);
                    }
                }
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        // Listen for auth changes
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;

                console.log('Auth state changed:', event, session?.user?.email);
                
                if (session?.user) {
                    // Only process if user email is different from current user (using ref to avoid stale closure)
                    if (userEmailRef.current !== session.user.email) {
                        await CreateNewUser(session.user);
                    }
                } else {
                    setUser(null);
                    userEmailRef.current = null;
                    setLoading(false);
                    processingUserRef.current = false;
                }
            }
        );

        subscription = authSubscription;
        initializeAuth();

        return () => {
            mounted = false;
            processingUserRef.current = false;
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []); // Empty dependency array - only run once

    return (
        <UserDetailContext.Provider value={{user, setUser, loading}}>
            <BillingProvider>
                <SettingsProvider>
                    {children}
                </SettingsProvider>
            </BillingProvider>
        </UserDetailContext.Provider>
    )
}

export default Provider;

export const useUser = () =>{
    const context = useContext(UserDetailContext);
    return context;
}