import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AlertCircle, CheckCircle, FileText, Send, Trash2, Eye } from 'lucide-react';

const MyReportsPage = () => {
  const [activeTab, setActiveTab] = useState('reports'); // 'reports', 'sent-claims', 'received-claims'
  const [myReports, setMyReports] = useState([]);
  const [sentClaims, setSentClaims] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError('');
      const [reportsRes, sentRes, receivedRes] = await Promise.all([
        api.get('/items/my-reports'),
        api.get('/claims/my-requests'),
        api.get('/claims/received'),
      ]);
      setMyReports(reportsRes.data);
      setSentClaims(sentRes.data);
      setReceivedClaims(receivedRes.data);
    } catch (err) {
      console.error('Failed to load reports and claims:', err);
      setError('Unable to load your personal records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.delete(`/items/${id}`);
      setSuccessMsg('Report deleted successfully.');
      setMyReports(myReports.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete report.');
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

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          My Campus Reports & Claims
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Track the status of items you reported lost or found, and monitor recovery claim requests.
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('reports')}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'reports' ? '2px solid var(--primary-color)' : '2px solid transparent',
            backgroundColor: 'transparent',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: activeTab === 'reports' ? 'var(--primary-color)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          My Reported Items ({myReports.length})
        </button>

        <button
          onClick={() => setActiveTab('received-claims')}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'received-claims' ? '2px solid var(--primary-color)' : '2px solid transparent',
            backgroundColor: 'transparent',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: activeTab === 'received-claims' ? 'var(--primary-color)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Claims on My Found Items ({receivedClaims.length})
        </button>

        <button
          onClick={() => setActiveTab('sent-claims')}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'sent-claims' ? '2px solid var(--primary-color)' : '2px solid transparent',
            backgroundColor: 'transparent',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: activeTab === 'sent-claims' ? 'var(--primary-color)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          My Recovery Claims ({sentClaims.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading your portal activity...
        </div>
      ) : activeTab === 'reports' ? (
        /* My Reported Items */
        myReports.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p>You have not reported any lost or found items yet.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <Link to="/report-lost" className="btn btn-outline btn-sm">Report Lost Item</Link>
              <Link to="/report-found" className="btn btn-primary btn-sm">Report Found Item</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myReports.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '16px' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                      {item.type}
                    </span>
                    <span className={`badge ${item.status === 'OPEN' ? 'badge-open' : item.status === 'CLAIMED' ? 'badge-claimed' : 'badge-resolved'}`}>
                      {item.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Reported: {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Category: <strong>{item.category}</strong> • Campus Location: <strong>{item.campusLocation}</strong>
                    {item.type === 'FOUND' && ` • Claims Received: ${item.claimsCount}`}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm">
                    <Eye size={14} /> View Details
                  </Link>
                  <button onClick={() => handleDeleteReport(item.id)} className="btn btn-danger btn-sm" title="Delete listing">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'received-claims' ? (
        /* Claims Received by finder */
        receivedClaims.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No claims received on any found items reported by you.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {receivedClaims.map((claim) => (
              <div key={claim.id} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
                      Item: <Link to={`/items/${claim.itemId}`}>{claim.itemTitle}</Link>
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Claimant: <strong>{claim.claimantName}</strong> ({claim.claimantDepartment} • {claim.claimantCollegeId})
                    </span>
                  </div>
                  <span className={`badge ${claim.status === 'ACCEPTED' ? 'badge-found' : claim.status === 'REJECTED' ? 'badge-lost' : 'badge-claimed'}`}>
                    {claim.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <strong>Explanation:</strong> {claim.explanation}
                </p>
                {claim.identifyingDetails && (
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <strong>Proof Details:</strong> {claim.identifyingDetails}
                  </p>
                )}
                <div style={{ marginTop: '10px' }}>
                  <Link to={`/items/${claim.itemId}`} className="btn btn-primary btn-sm">
                    Review Claim on Item Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* My Sent Claims */
        sentClaims.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            You haven't submitted any recovery claims for found items yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sentClaims.map((claim) => (
              <div key={claim.id} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
                    Item: <Link to={`/items/${claim.itemId}`}>{claim.itemTitle}</Link>
                  </h3>
                  <span className={`badge ${claim.status === 'ACCEPTED' ? 'badge-found' : claim.status === 'REJECTED' ? 'badge-lost' : 'badge-claimed'}`}>
                    {claim.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <strong>Your Proof:</strong> {claim.explanation}
                </p>
                {claim.responseNote && (
                  <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', color: '#166534' }}>
                    <strong>Finder Response:</strong> {claim.responseNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MyReportsPage;
