import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, Users, AlertCircle, Trash2, CheckCircle } from 'lucide-react';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
      setError('Failed to fetch administrator data. Ensure you have ROLE_ADMIN privilege.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      setSuccessMsg('User account status updated.');
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update user status.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading administrator controls...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <ShieldCheck size={24} color="var(--primary-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Campus Administrator Moderation Portal
          </h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Monitor platform metrics, manage user access, and maintain integrity across college lost and found listings.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats Section */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Users</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)', marginTop: '4px' }}>
              {stats.totalUsers}
            </div>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lost Item Reports</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--danger-color)', marginTop: '4px' }}>
              {stats.totalLostItems}
            </div>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Found Item Reports</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success-color)', marginTop: '4px' }}>
              {stats.totalFoundItems}
            </div>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Claims Filed</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#d97706', marginTop: '4px' }}>
              {stats.totalClaims}
            </div>
          </div>
        </div>
      )}

      {/* Users Management Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title" style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} /> Registered College Members ({users.length})
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>Full Name</th>
                <th style={{ padding: '10px 12px' }}>Email Address</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px' }}>College ID</th>
                <th style={{ padding: '10px 12px' }}>Department</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{u.fullName}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{u.collegeIdNumber}</td>
                  <td style={{ padding: '12px' }}>{u.department}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${u.enabled ? 'badge-found' : 'badge-lost'}`}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {u.role !== 'ROLE_ADMIN' ? (
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`btn btn-sm ${u.enabled ? 'btn-outline' : 'btn-primary'}`}
                      >
                        {u.enabled ? 'Disable Access' : 'Enable Access'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admin Root</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
