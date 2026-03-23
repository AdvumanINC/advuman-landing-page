import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { COLORS, FONTS } from '../constants';

function Settings({ userData }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    full_name: '',
    company_name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (userData) {
      setProfileData({
        full_name: userData.full_name || '',
        company_name: userData.company_name || '',
        email: userData.email || ''
      });
    }
  }, [userData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profileData.full_name,
          company_name: profileData.company_name,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userData.user_id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 12) {
      setMessage({ type: 'error', text: 'Password must be at least 12 characters' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    if (deleteInput !== 'DELETE') {
      setMessage({ type: 'error', text: 'Type DELETE to confirm' });
      return;
    }
    setLoading(true);
    try {
      // Delete user profile first
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userData.user_id);

      if (profileError) throw profileError;

      // Sign out (Supabase will handle auth user deletion via cascade)
      await supabase.auth.signOut();
      
      setMessage({ type: 'success', text: 'Account deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px 40px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 800 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f0ede6', marginBottom: 8 }}>
            Account Settings
          </h1>
          <p style={{ fontSize: 15, color: '#8a887f' }}>Manage your account information and preferences</p>
        </div>

      {message.text && (
        <div style={{
          padding: '14px 18px',
          marginBottom: 24,
          background: message.type === 'success' ? 'rgba(77, 219, 170, 0.1)' : 'rgba(255, 59, 48, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(77, 219, 170, 0.3)' : 'rgba(255, 59, 48, 0.3)'}`,
          borderRadius: 6,
          color: message.type === 'success' ? '#4ddbaa' : '#ff6b6b',
          fontSize: 14
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gap: 24 }}>
        {/* Profile Information */}
        <div style={{ background: '#0a0b0e', border: '1px solid #1a1c20', borderRadius: 8, padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0ede6', marginBottom: 24 }}>
            Profile Information
          </h3>
          
          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#b0ae9f', marginBottom: 8, fontWeight: 600 }}>
                Full Name
              </label>
              <input
                type="text"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#07080a',
                  border: '1px solid #2a2c34',
                  borderRadius: 6,
                  color: '#e8e6e1',
                  fontSize: 14,
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                onBlur={(e) => e.target.style.borderColor = '#2a2c34'}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#b0ae9f', marginBottom: 8, fontWeight: 600 }}>
                Company Name
              </label>
              <input
                type="text"
                value={profileData.company_name}
                onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#07080a',
                  border: '1px solid #2a2c34',
                  borderRadius: 6,
                  color: '#e8e6e1',
                  fontSize: 14,
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                onBlur={(e) => e.target.style.borderColor = '#2a2c34'}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#b0ae9f', marginBottom: 8, fontWeight: 600 }}>
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                disabled
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0e1014',
                  border: '1px solid #2a2c34',
                  borderRadius: 6,
                  color: '#666',
                  fontSize: 14,
                  outline: 'none',
                  cursor: 'not-allowed'
                }}
              />
              <p style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 28px',
                background: loading ? '#555' : 'linear-gradient(135deg, #c8a932 0%, #d4b744 100%)',
                color: '#07080a',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div style={{ background: '#0a0b0e', border: '1px solid #1a1c20', borderRadius: 8, padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0ede6', marginBottom: 24 }}>
            Change Password
          </h3>
          
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#b0ae9f', marginBottom: 8, fontWeight: 600 }}>
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#07080a',
                  border: '1px solid #2a2c34',
                  borderRadius: 6,
                  color: '#e8e6e1',
                  fontSize: 14,
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                onBlur={(e) => e.target.style.borderColor = '#2a2c34'}
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#b0ae9f', marginBottom: 8, fontWeight: 600 }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#07080a',
                  border: '1px solid #2a2c34',
                  borderRadius: 6,
                  color: '#e8e6e1',
                  fontSize: 14,
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                onBlur={(e) => e.target.style.borderColor = '#2a2c34'}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 28px',
                background: loading ? '#555' : 'linear-gradient(135deg, #c8a932 0%, #d4b744 100%)',
                color: '#07080a',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Trial Information */}
        {userData?.trial_end_date && (
          <div style={{ background: '#0a0b0e', border: '1px solid #1a1c20', borderRadius: 8, padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0ede6', marginBottom: 24 }}>
              Subscription Status
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#8a887f' }}>Status</span>
                <span style={{
                  fontSize: 12,
                  fontFamily: FONTS.mono,
                  color: COLORS.primary,
                  background: COLORS.primary + '20',
                  padding: '4px 12px',
                  borderRadius: 4,
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {userData.subscription_status || 'Trial'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#8a887f' }}>Trial Started</span>
                <span style={{ fontSize: 14, color: '#f0ede6', fontFamily: FONTS.mono }}>
                  {new Date(userData.trial_start_date).toLocaleDateString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#8a887f' }}>Trial Ends</span>
                <span style={{ fontSize: 14, color: '#f0ede6', fontFamily: FONTS.mono }}>
                  {new Date(userData.trial_end_date).toLocaleDateString()}
                </span>
              </div>

              <div style={{
                marginTop: 16,
                padding: '16px',
                background: 'linear-gradient(135deg, #c8a93208 0%, #c8a93205 100%)',
                border: '1px solid #c8a93230',
                borderRadius: 6
              }}>
                <p style={{ fontSize: 13, color: '#b0ae9f', lineHeight: 1.6 }}>
                  Your trial includes full access to all features. Upgrade to a paid plan to continue after your trial ends.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div style={{ background: '#0a0b0e', border: '1px solid rgba(255, 59, 48, 0.3)', borderRadius: 8, padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ff3b30', marginBottom: 24 }}>
          
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, color: '#f0ede6', fontWeight: 600, marginBottom: 4 }}>Delete Account</div>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            {!deleteConfirm ? (
              <button onClick={handleDeleteAccount} disabled={loading} style={{ padding: '10px 24px', background: 'transparent', color: '#ff3b30', border: '1px solid rgba(255, 59, 48, 0.5)', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', marginLeft: 24 }}>
                Delete Account
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 24 }}>
                <input
                  value={deleteInput}
                  onChange={e => setDeleteInput(e.target.value)}
                  placeholder='Type DELETE to confirm'
                  style={{ padding: '8px 12px', background: '#07080a', border: '1px solid rgba(255,59,48,0.5)', borderRadius: 6, color: '#ff3b30', fontSize: 13, outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleDeleteAccount} disabled={loading} style={{ padding: '8px 16px', background: 'rgba(255,59,48,0.15)', color: '#ff3b30', border: '1px solid rgba(255,59,48,0.5)', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Confirm</button>
                  <button onClick={() => { setDeleteConfirm(false); setDeleteInput(''); }} style={{ padding: '8px 16px', background: 'transparent', color: '#8a887f', border: '1px solid #2a2c34', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Settings;
