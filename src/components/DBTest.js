import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function DBTest() {
  const [status, setStatus] = useState('Testing connection...');
  const [tables, setTables] = useState({});

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    const tableNames = ['alerts', 'signals', 'corridor_indexes', 'sectors', 'corridors', 'user_profiles'];
    const results = {};

    for (const table of tableNames) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: false })
          .limit(1);
        
        if (error) {
          results[table] = { status: 'error', message: error.message };
        } else {
          results[table] = { status: 'success', count: count || 0, sample: data?.[0] };
        }
      } catch (err) {
        results[table] = { status: 'error', message: err.message };
      }
    }

    setTables(results);
    setStatus('Connection test complete');
  };

  return (
    <div style={{ padding: '40px', background: '#07080a', minHeight: '100vh', color: '#e8e6e1' }}>
      <h1 style={{ fontSize: 32, marginBottom: 20, color: '#c8a932' }}>Database Connection Test</h1>
      <p style={{ marginBottom: 30, color: '#8a887f' }}>{status}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {Object.entries(tables).map(([tableName, info]) => (
          <div key={tableName} style={{ 
            background: '#0a0b0e', 
            border: `1px solid ${info.status === 'success' ? '#4ddbaa40' : '#ff6b6b40'}`,
            borderRadius: 8, 
            padding: 24 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 18, color: '#f0ede6' }}>{tableName}</h3>
              <span style={{ 
                padding: '4px 12px', 
                background: info.status === 'success' ? '#4ddbaa20' : '#ff6b6b20',
                color: info.status === 'success' ? '#4ddbaa' : '#ff6b6b',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700
              }}>
                {info.status === 'success' ? `✓ ${info.count} rows` : '✗ ERROR'}
              </span>
            </div>
            
            {info.status === 'error' && (
              <p style={{ color: '#ff6b6b', fontSize: 14 }}>{info.message}</p>
            )}
            
            {info.status === 'success' && info.sample && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Sample columns:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Object.keys(info.sample).map(col => (
                    <span key={col} style={{ 
                      padding: '4px 10px', 
                      background: '#07080a', 
                      borderRadius: 4, 
                      fontSize: 11,
                      color: '#8a887f',
                      fontFamily: 'monospace'
                    }}>
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DBTest;
