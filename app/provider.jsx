'use client'
import React,{ useEffect, useState, useContext } from 'react';
import { supabase } from '@/services/supabaseClient';
import { UserDetailContext } from '@/context/UserDetailContext';
import { BillingProvider } from '@/context/BillingContext';
import { SettingsProvider } from '@/context/SettingsContext';

function Provider({children}){
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    
    useEffect(() =>{
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                CreateNewUser(session.user);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    await CreateNewUser(session.user);
                } else {
                    setUser(null);
                    setLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const CreateNewUser = async (authUser) => {
        try {
            // Check if user already exists
            let { data: Users, error } = await supabase
               .from('Users')
               .select("*")
               .eq('email', authUser?.email);
            
            console.log('Existing users:', Users);
            
            if(Users?.length === 0){
                // Create new user
                const { data, error } = await supabase.from('Users').insert({
                    email: authUser?.email,
                    name: authUser?.user_metadata?.name,
                    picture: authUser?.user_metadata?.picture,
                    credits: 5 // Give new users 5 free credits
                }).select();
                
                if (error) {
                    console.error('Error creating user:', error);
                } else {
                    console.log('New user created:', data);
                    setUser(data[0]);
                }
            } else {
                setUser(Users[0]);
            }
        } catch (error) {
            console.error('Error in CreateNewUser:', error);
        } finally {
            setLoading(false);
        }
    }
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