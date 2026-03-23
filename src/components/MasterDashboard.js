import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const ADMIN_EMAILS = [
  'admin1@yourdomain.com',
  'admin2@yourdomain.com',
  'admin3@yourdomain.com',
];

const S = {
  bg: '#07080a', surface: '#0a0b0e', border: '#1a1c20',
  gold: '#c8a932', text: '#f0ede6', muted: '#8a887f',
  mono: 'monospace', danger: '#e05252', success: '#4caf7d',
};

const QUERY_MAP = [
  [/all users|show.*users/, 'SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 100'],
  [/users.*trial|trial.*users/, "SELECT * FROM user_profiles WHERE subscription_status = 'trial'"],
  [/users.*paid|paid.*users|active.*subscri/, "SELECT * FROM user_profiles WHERE subscription_status = 'active'"],
  [/revenue.*summary|summary.*revenue/, 'SELECT * FROM admin_revenue_summary'],
  [/revenue|payments|stripe/, 'SELECT * FROM stripe_payments ORDER BY created_at DESC LIMIT 100'],
  [/critical alerts/, "SELECT * FROM alerts WHERE severity = 'critical' ORDER BY date DESC"],
  [/all alerts|show alerts/, 'SELECT * FROM alerts ORDER BY date DESC LIMIT 100'],
  [/all signals|show signals/, 'SELECT * FROM signals ORDER BY created_at DESC LIMIT 100'],
  [/query log|admin queries/, 'SELECT * FROM admin_query_log ORDER BY executed_at DESC LIMIT 50'],
  [/count users/, 'SELECT COUNT(*) AS total_users FROM user_profiles'],
  [/count.*alert|alert.*count/, 'SELECT severity, COUNT(*) FROM alerts GROUP BY severity'],
  [/webhook|stripe event/, 'SELECT * FROM stripe_webhook_events ORDER BY created_at DESC LIMIT 50'],
];

function nlToSql(input) {
  const q = input.toLowerCase().trim();
  for (const [pattern, sql] of QUERY_MAP) {
    if (pattern.test(q)) return sql;
  }
  // corridor query — value passed via parameterised RPC, not interpolated
  if (/users.*corridor|corridor.*users/.test(q)) {
    return 'SELECT * FROM user_profiles WHERE trade_corridor ILIKE $corridor';
  }
  // raw SQL passthrough
  if (/^(select|update|insert|delete)\s/.test(q)) return input;
  return null;
}

function btn(color) {
  return { background: color + '22', border: `1px solid ${color}44`, color, padding: '3px 8px', borderRadius: 3, cursor: 'pointer', fontSize: 11 };
}

function Cell({ value }) {
  return value === null
    ? <span style={{ color: S.muted }}>null</span>
    : <span style={{ display: 'inline-block', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(value)}</span>;
}

function DataTable({ rows }) {
  if (!rows?.length) return <p style={{ color: S.muted, padding: 16 }}>No results.</p>;
  const cols = Object.keys(rows[0]);
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: S.mono }}>
        <thead>
          <tr>{cols.map(c => <th key={c} style={{ padding: '8px 12px', background: '#0e1014', color: S.gold, textAlign: 'left', borderBottom: `1px solid ${S.border}`, whiteSpace: 'nowrap' }}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? S.surface : S.bg }}>
              {cols.map(c => <td key={c} style={{ padding: '7px 12px', color: S.text, borderBottom: `1px solid ${S.border}20` }}><Cell value={row[c]} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Single unified editable row — used by Users, Content, Stripe tabs
function EditRow({ row, cols, table, pkField = 'id', onSaved, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...row });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const save = async () => {
    setSaving(true); setErr('');
    const { error } = await supabase.from(table).update(draft).eq(pkField, row[pkField]);
    setSaving(false);
    if (error) setErr(error.message);
    else { setEditing(false); onSaved(); }
  };

  const cancel = () => { setEditing(false); setDraft({ ...row }); setErr(''); };

  return (
    <tr style={{ background: editing ? '#0e1014' : S.surface }}>
      <td style={{ padding: '6px 10px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
        {editing ? (
          <>
            <button onClick={save} disabled={saving} style={btn(S.gold)}>{saving ? '…' : '✓'}</button>
            <button onClick={cancel} style={{ ...btn(S.muted), marginLeft: 4 }}>✕</button>
            {err && <div style={{ color: S.danger, fontSize: 10, marginTop: 3, maxWidth: 120 }}>{err}</div>}
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} style={btn('#3a3c44')}>Edit</button>
            {onDelete && <button onClick={() => onDelete(row[pkField])} style={{ ...btn(S.danger), marginLeft: 4 }}>Del</button>}
          </>
        )}
      </td>
      {cols.map(c => (
        <td key={c} style={{ padding: '6px 10px', color: S.text, fontSize: 12, fontFamily: S.mono }}>
          {editing
            ? <input value={draft[c] ?? ''} onChange={e => setDraft(d => ({ ...d, [c]: e.target.value }))} style={{ background: '#07080a', border: `1px solid ${S.border}`, color: S.text, padding: '3px 6px', borderRadius: 3, width: '100%', fontSize: 12, fontFamily: S.mono }} />
            : <Cell value={row[c]} />}
        </td>
      ))}
    </tr>
  );
}

function TableHead({ cols, extra }) {
  return (
    <thead>
      <tr>
        {extra && <th style={{ padding: '8px 10px', background: '#0e1014', color: S.gold, textAlign: 'left', borderBottom: `1px solid ${S.border}` }}>{extra}</th>}
        {cols.map(c => <th key={c} style={{ padding: '8px 10px', background: '#0e1014', color: S.gold, textAlign: 'left', borderBottom: `1px solid ${S.border}`, whiteSpace: 'nowrap' }}>{c}</th>)}
      </tr>
    </thead>
  );
}

const TABS = ['Overview', 'Users', 'Content', 'Query Runner', 'Stripe'];

export default function MasterDashboard({ adminEmail, onLogout }) {
  const [tab, setTab] = useState('Overview');
  const [data, setData] = useState({ users: [], alerts: [], signals: [], payments: [] });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({ input: '', result: null, error: '', running: false });

  const load = useCallback(async () => {
    setLoading(true);
    const [u, a, s, p] = await Promise.all([
      supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('alerts').select('*').order('date', { ascending: false }).limit(100),
      supabase.from('signals').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('stripe_payments').select('*').order('created_at', { ascending: false }).limit(100),
    ]);
    setData({ users: u.data || [], alerts: a.data || [], signals: s.data || [], payments: p.data || [] });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const runQuery = async () => {
    const input = query.input.trim();
    if (!input) return;
    setQuery(q => ({ ...q, running: true, error: '', result: null }));

    const sql = nlToSql(input);
    if (!sql) {
      setQuery(q => ({ ...q, running: false, error: "Couldn't understand that. Try: 'show all users', 'critical alerts', 'revenue summary'." }));
      return;
    }

    const { data: rows, error } = await supabase.rpc('admin_run_query', { sql_query: sql });

    await supabase.from('admin_query_log').insert({
      admin_email: adminEmail,
      natural_query: input,
      generated_sql: sql,
      rows_affected: rows?.length ?? 0,
      success: !error,
      error_message: error?.message ?? null,
    });

    setQuery(q => ({ ...q, running: false, result: error ? null : rows, error: error?.message || '' }));
  };

  const stats = {
    totalUsers: data.users.length,
    trialUsers: data.users.filter(u => u.subscription_status === 'trial').length,
    activeUsers: data.users.filter(u => u.subscription_status === 'active').length,
    totalAlerts: data.alerts.length,
    totalSignals: data.signals.length,
    mrr: data.payments.filter(p => p.status === 'active').reduce((s, p) => s + (p.amount_cents || 0), 0),
  };

  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.text }}>
      <div style={{ background: S.surface, borderBottom: `1px solid ${S.border}`, padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: S.gold, fontSize: 18, fontWeight: 800 }}>⬡ MASTER DASHBOARD</span>
          <span style={{ background: S.gold + '22', color: S.gold, fontSize: 10, padding: '2px 8px', borderRadius: 3, fontFamily: S.mono, fontWeight: 700 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: S.muted, fontFamily: S.mono }}>{adminEmail}</span>
          <button onClick={onLogout} style={btn(S.muted)}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: `1px solid ${S.border}`, background: S.surface, padding: '0 32px' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '12px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? S.gold : 'transparent'}`, color: tab === t ? S.gold : S.muted, cursor: 'pointer', fontSize: 13, fontWeight: tab === t ? 700 : 500 }}>
            {t}
          </button>
        ))}
        <button onClick={load} style={{ marginLeft: 'auto', ...btn(S.muted), alignSelf: 'center' }}>{loading ? '…' : '↻'}</button>
      </div>

      <div style={{ padding: '28px 32px' }}>
        {tab === 'Overview'      && <OverviewTab stats={stats} payments={data.payments} />}
        {tab === 'Users'         && <UsersTab users={data.users} onSaved={load} />}
        {tab === 'Content'       && <ContentTab alerts={data.alerts} signals={data.signals} onSaved={load} />}
        {tab === 'Query Runner'  && <QueryTab query={query} setQuery={setQuery} runQuery={runQuery} />}
        {tab === 'Stripe'        && <StripeTab payments={data.payments} onSaved={load} />}
      </div>
    </div>
  );
}

function OverviewTab({ stats, payments }) {
  const cards = [
    ['Total Users', stats.totalUsers],
    ['Trial Users', stats.trialUsers],
    ['Active Paid', stats.activeUsers],
    ['Total Alerts', stats.totalAlerts],
    ['Total Signals', stats.totalSignals],
    ['Active MRR', `£${(stats.mrr / 100).toFixed(2)}`],
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {cards.map(([label, value]) => (
          <div key={label} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: '20px 24px' }}>
            <div style={{ fontSize: 11, color: S.muted, fontFamily: S.mono, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: S.gold, fontFamily: S.mono }}>{value ?? '—'}</div>
          </div>
        ))}
      </div>
      <h3 style={{ color: S.text, marginBottom: 12 }}>Recent Payments</h3>
      <DataTable rows={payments.slice(0, 10)} />
    </div>
  );
}

function UsersTab({ users, onSaved }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => !search || u.email?.includes(search) || u.full_name?.toLowerCase().includes(search.toLowerCase()));
  const cols = users[0] ? Object.keys(users[0]).filter(k => k !== 'user_id') : [];
  return (
    <div>
      <input placeholder="Search by email or name…" value={search} onChange={e => setSearch(e.target.value)}
        style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: '8px 14px', borderRadius: 6, fontSize: 13, width: 320, marginBottom: 16, outline: 'none' }} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <TableHead cols={cols} extra="Actions" />
          <tbody>{filtered.map(u => <EditRow key={u.id} row={u} cols={cols} table="user_profiles" onSaved={onSaved} />)}</tbody>
        </table>
      </div>
    </div>
  );
}

function AddRowForm({ cols, onInsert }) {
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    setSaving(true); setErr('');
    const ok = await onInsert(draft);
    setSaving(false);
    if (ok) setDraft({});
    else setErr('Insert failed — check required fields.');
  };

  return (
    <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
        {cols.map(c => (
          <div key={c}>
            <div style={{ fontSize: 10, color: S.muted, marginBottom: 3, fontFamily: S.mono }}>{c}</div>
            <input value={draft[c] ?? ''} onChange={e => setDraft(d => ({ ...d, [c]: e.target.value }))}
              style={{ background: S.bg, border: `1px solid ${S.border}`, color: S.text, padding: '5px 8px', borderRadius: 3, width: '100%', fontSize: 12 }} />
          </div>
        ))}
      </div>
      {err && <div style={{ color: S.danger, fontSize: 12, marginBottom: 8 }}>{err}</div>}
      <button onClick={submit} disabled={saving} style={btn(S.gold)}>{saving ? 'Saving…' : 'Insert'}</button>
    </div>
  );
}

function ContentTab({ alerts, signals, onSaved }) {
  const [section, setSection] = useState('alerts');
  const [showAdd, setShowAdd] = useState(false);
  const [deleteErr, setDeleteErr] = useState('');

  const table = section === 'alerts' ? 'alerts' : 'signals';
  const rows = section === 'alerts' ? alerts : signals;
  const cols = rows[0] ? Object.keys(rows[0]).filter(k => k !== 'id' && k !== 'created_at') : [];

  const handleInsert = async (draft) => {
    const { error } = await supabase.from(table).insert(draft);
    if (!error) { onSaved(); return true; }
    return false;
  };

  const handleDelete = async (id) => {
    setDeleteErr('');
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) setDeleteErr(error.message);
    else onSaved();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['alerts', 'signals'].map(s => (
          <button key={s} onClick={() => setSection(s)} style={{ ...btn(section === s ? S.gold : S.muted), textTransform: 'capitalize' }}>{s}</button>
        ))}
        <button onClick={() => setShowAdd(v => !v)} style={{ ...btn(S.success), marginLeft: 'auto' }}>+ Add Row</button>
      </div>
      {deleteErr && <div style={{ color: S.danger, fontSize: 12, marginBottom: 8 }}>{deleteErr}</div>}
      {showAdd && <AddRowForm cols={cols} onInsert={handleInsert} />}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <TableHead cols={cols} extra="Actions" />
          <tbody>{rows.map(row => <EditRow key={row.id} row={row} cols={cols} table={table} onSaved={onSaved} onDelete={handleDelete} />)}</tbody>
        </table>
      </div>
    </div>
  );
}

const EXAMPLES = ['show all users', 'users on trial', 'critical alerts', 'revenue summary', 'all signals', 'count users'];

function QueryTab({ query, setQuery, runQuery }) {
  const preview = query.input ? nlToSql(query.input) : null;
  return (
    <div style={{ maxWidth: 900 }}>
      <p style={{ color: S.muted, marginBottom: 16, fontSize: 13 }}>Type in plain English — translated to SQL and run against your database.</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {EXAMPLES.map(e => <button key={e} onClick={() => setQuery(q => ({ ...q, input: e }))} style={btn(S.muted)}>{e}</button>)}
      </div>
      <textarea value={query.input} onChange={e => setQuery(q => ({ ...q, input: e.target.value }))}
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runQuery(); }}
        placeholder="e.g. show all users on trial" rows={3}
        style={{ width: '100%', background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: '12px 14px', borderRadius: 6, fontSize: 13, fontFamily: S.mono, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
      {preview && (
        <div style={{ background: '#0e1014', border: `1px solid ${S.border}`, borderRadius: 4, padding: '8px 12px', marginTop: 6, fontSize: 11, fontFamily: S.mono, color: S.gold }}>
          SQL: {preview}
        </div>
      )}
      <button onClick={runQuery} disabled={query.running || !query.input.trim()}
        style={{ marginTop: 10, padding: '10px 24px', background: S.gold, border: 'none', borderRadius: 6, color: '#07080a', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
        {query.running ? 'Running…' : '▶ Run'}
      </button>
      {query.error && <div style={{ marginTop: 12, color: S.danger, fontSize: 13, fontFamily: S.mono }}>{query.error}</div>}
      {query.result && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: S.muted, marginBottom: 8, fontFamily: S.mono }}>{query.result.length} row(s)</div>
          <DataTable rows={query.result} />
        </div>
      )}
    </div>
  );
}

const STRIPE_FIELDS = ['user_id', 'stripe_customer_id', 'stripe_subscription_id', 'plan', 'status', 'amount_cents', 'currency', 'interval'];

function StripeTab({ payments, onSaved }) {
  const [showAdd, setShowAdd] = useState(false);
  const [err, setErr] = useState('');

  const handleInsert = async (draft) => {
    const { error } = await supabase.from('stripe_payments').insert(draft);
    if (error) { setErr(error.message); return false; }
    onSaved(); return true;
  };

  const cols = payments[0] ? Object.keys(payments[0]).filter(k => k !== 'id') : STRIPE_FIELDS;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ color: S.text, margin: 0 }}>Stripe Payments</h3>
        <button onClick={() => setShowAdd(v => !v)} style={btn(S.success)}>+ Add Record</button>
      </div>
      {err && <div style={{ color: S.danger, fontSize: 12, marginBottom: 8 }}>{err}</div>}
      {showAdd && <AddRowForm cols={STRIPE_FIELDS} onInsert={handleInsert} />}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <TableHead cols={cols} extra="Actions" />
          <tbody>{payments.map(p => <EditRow key={p.id} row={p} cols={cols} table="stripe_payments" onSaved={onSaved} />)}</tbody>
        </table>
      </div>
    </div>
  );
}
