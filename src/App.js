import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LandingPage from './components/LandingPage';
import DashboardNew from './components/DashboardNew';
import DemoView from './components/DemoView';

function App() {
  const [view, setView] = useState("landing");
  const [userData, setUserData] = useState(null);

  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserProfile(session.user.id);
      }
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
  }, []);

  const loadUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (data) {
      setUserData(data);
      setView('dashboard');
    } else {
      // If no profile exists, get user data from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fallbackData = {
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          company_name: user.user_metadata?.company_name || 'Company',
          email: user.email
        };
        setUserData(fallbackData);
        setView('dashboard');
      }
      console.error('Error loading profile:', error);
    }
  };
  
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
  
  if (view === 'demo') {
    return <DemoView onBack={handleBackToLanding} />;
  }
  
  return view === "landing"
    ? <LandingPage onShowDemo={handleShowDemo} />
    : <DashboardNew onBackToLanding={handleLogout} userData={userData} />;
}

export default App;
