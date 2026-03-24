import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import LandingPage from './components/LandingPage';
import DashboardNew from './components/DashboardNew';
import DemoView from './components/DemoView';
import MasterDashboard, { ADMIN_EMAILS } from './components/MasterDashboard';

function App() {
  const [view, setView] = useState('landing');
  const [userData, setUserData] = useState(null);

  const loadUserProfile = useCallback(async (userId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (ADMIN_EMAILS.includes(user.email)) {
        setUserData({ email: user.email, isMasterAdmin: true });
        setView('master');
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setUserData(data ?? {
        user_id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        company_name: user.user_metadata?.company_name || '',
        email: user.email,
      });
      setView('dashboard');
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) loadUserProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadUserProfile(session.user.id);
      } else {
        setView('landing');
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);
  
  const handleShowDemo = () => {
    setView("demo");
  };
  
  const handleBackToLanding = () => {
    setView('landing');
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
    setUserData(null);
  };
  
  if (view === 'demo') return <DemoView onBack={handleBackToLanding} />;
  if (view === 'master') return <MasterDashboard adminEmail={userData?.email} onLogout={handleLogout} />;
  
  return view === "landing"
    ? <LandingPage onShowDemo={handleShowDemo} />
    : <DashboardNew onBackToLanding={handleLogout} userData={userData} />;
}

export default App;
