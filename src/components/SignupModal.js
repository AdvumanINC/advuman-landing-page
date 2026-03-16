import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import LoginModal from './LoginModal';

function SignupModal({ onClose }) {
  const [formData, setFormData] = useState({
    companyName: '', fullName: '', email: '', password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            company_name: formData.companyName,
            full_name: formData.fullName
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from('user_profiles').insert([{
          user_id: authData.user.id,
          company_name: formData.companyName,
          full_name: formData.fullName,
          trial_start_date: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        }]);

        if (profileError) console.error('Profile creation error:', profileError);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {!showLogin ? (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: '#0f0f0f', borderRadius: 0, maxWidth: '100vw', width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Left Section - Form */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '100%', maxWidth: '28rem' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}>×</button>
            
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Create your account</h1>
              <p style={{ color: '#9ca3af' }}>Start your free trial today</p>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: 6, color: '#ff6b6b', fontSize: 13, marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="fullName" style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '0.5rem', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                  placeholder="John Doe"
                  required
                  onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>

              <div>
                <label htmlFor="companyName" style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Company Name</label>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '0.5rem', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                  placeholder="Acme Inc."
                  required
                  onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '0.5rem', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                  placeholder="you@example.com"
                  required
                  onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>

              <div>
                <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '0.5rem', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                    placeholder="••••••••"
                    required
                    onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                    onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0.25rem' }}
                    onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    {showPassword ? (
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: loading ? '#555' : '#16a34a', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 500, fontSize: '0.95rem', transition: 'background-color 0.2s', opacity: loading ? 0.5 : 1, marginTop: '0.5rem' }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#15803d')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#16a34a')}
              >
                {loading ? 'Creating Account...' : 'Create account'}
              </button>
            </form>

            <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center', marginTop: '1.5rem' }}>
              Already have an account?{' '}
              <button
                onClick={() => setShowLogin(true)}
                style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
              >
                Sign in
              </button>
            </p>

            <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', marginTop: '1rem' }}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div style={{ width: '1px', backgroundColor: '#2a2a2a' }}></div>

        {/* Right Section - Testimonial */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
          <div style={{ maxWidth: '28rem' }}>
            <svg style={{ width: '3rem', height: '3rem', color: '#4b5563', marginBottom: '1.5rem' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p style={{ fontSize: '1.25rem', color: '#d1d5db', lineHeight: 1.6, marginBottom: '2rem' }}>
              Intelligence. On your Doorstep. For every player.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #34d399 0%, #3b82f6 100%)' }}></div>
              <span style={{ color: '#9ca3af' }}>@Arush Dubey, Advuman.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    ) : null}
    {showLogin && <LoginModal onClose={onClose} />}
    </>
  );
}

export default SignupModal;
