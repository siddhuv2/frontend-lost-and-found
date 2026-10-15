import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  MapPin,
  Calendar,
  Tag,
  User,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  Send,
  Trash2,
  Check,
  X
} from 'lucide-react';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Claim Submission Modal State
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimExplanation, setClaimExplanation] = useState('');
  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimError, setClaimError] = useState('');

  // Claim Status update state (for finder)
  const [responseNotes, setResponseNotes] = useState({});

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/items/${id}`);
      setItem(res.data);

      // If item is FOUND and current user is owner or admin, fetch claims for this item
      if (res.data.type === 'FOUND' && (res.data.isOwner || isAdmin)) {
        fetchClaimsForItem(id);
      }
    } catch (err) {
      console.error('Error fetching item:', err);
      setError('Item not found or could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimsForItem = async (itemId) => {
    try {
      const res = await api.get(`/claims/items/${itemId}`);
      setClaims(res.data);
    } catch (err) {
      console.error('Could not fetch claims for item:', err);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimExplanation.trim()) {
      setClaimError('Please provide an explanation/proof for your claim.');
      return;
    }

    try {
      setSubmittingClaim(true);
      setClaimError('');
      await api.post(`/claims/items/${id}`, {
        explanation: claimExplanation.trim(),
        identifyingDetails: identifyingDetails.trim() || null,
      });

      setSuccessMsg('Your claim request has been submitted to the finder for verification.');
      setShowClaimForm(false);
      setClaimExplanation('');
      setIdentifyingDetails('');
      fetchItemDetails();
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Failed to submit claim request.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const handleClaimDecision = async (claimId, status) => {
    const note = responseNotes[claimId] || '';
    try {
      await api.patch(`/claims/${claimId}/status`, {
        status: status,
        responseNote: note,
      });
      setSuccessMsg(`Claim status successfully updated to ${status}.`);
      fetchItemDetails();
      fetchClaimsForItem(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update claim status.');
    }
  };

  const handleDeleteItem = async () => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/items/${id}`);
      navigate('/my-reports');
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

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading item details...</div>;
  }

  if (error || !item) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto 0' }}>
        <div className="alert alert-error">
          <AlertCircle size={16} />
          <span>{error || 'Item not found.'}</span>
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
          <ArrowLeft size={14} /> Go Back
        </button>
      </div>
    );
  }

  const isOwner = item.isOwner;
  const isFound = item.type === 'FOUND';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back
      </button>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Item Information Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                {item.type}
              </span>
              <span className={`badge ${item.status === 'OPEN' ? 'badge-open' : item.status === 'CLAIMED' ? 'badge-claimed' : 'badge-resolved'}`}>
                {item.status}
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {item.title}
            </h1>
          </div>

          {(isOwner || isAdmin) && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleDeleteItem} className="btn btn-danger btn-sm" title="Delete this listing">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Core Metadata */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Category</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.category}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              {item.type === 'LOST' ? 'Last Seen Location' : 'Found Location'}
            </span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.campusLocation}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              {item.type === 'LOST' ? 'Date Lost' : 'Date Found'}
            </span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatDate(item.incidentDate)}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Reported By</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {item.reportedByName} ({item.reportedByDepartment})
            </span>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>Description</h3>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            {item.description}
          </p>
        </div>

        {/* Additional Details */}
        {item.additionalDetails && (
          <div style={{ marginBottom: '24px', backgroundColor: '#fdfdfe', padding: '12px', borderLeft: '3px solid var(--accent-color)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Additional Identifying Details</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {item.additionalDetails}
            </p>
          </div>
        )}

        {/* Claim Action for Found Item */}
        {isFound && !isOwner && item.status === 'OPEN' && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '16px' }}>
            {isAuthenticated ? (
              !showClaimForm ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Is this your lost belonging?</h4>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      Submit identifying proof. The finder will review your claim and coordinate safe recovery.
                    </p>
                  </div>
                  <button onClick={() => setShowClaimForm(true)} className="btn btn-primary">
                    <Send size={15} /> Claim This Item
                  </button>
                </div>
              ) : (
                <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                    Submit Claim Request
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Provide specific details that only the genuine owner would know (e.g. wallpaper on phone, contents inside bag, exact ID number).
                  </p>

                  {claimError && (
                    <div className="alert alert-error">
                      <AlertCircle size={16} />
                      <span>{claimError}</span>
                    </div>
                  )}

                  <form onSubmit={handleClaimSubmit}>
                    <div className="form-group">
                      <label className="form-label">Explanation / Proof of Ownership *</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Provide details proving this belongs to you..."
                        value={claimExplanation}
                        onChange={(e) => setClaimExplanation(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Secret / Distinctive Marks (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Any hidden marks, stickers, serial keys, or engravings..."
                        value={identifyingDetails}
                        onChange={(e) => setIdentifyingDetails(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn btn-primary btn-sm" disabled={submittingClaim}>
                        {submittingClaim ? 'Submitting...' : 'Send Claim to Finder'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setShowClaimForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Please <strong>log in</strong> to verify ownership and claim this item.
                </p>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Login to Claim
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Claims Management Section (Visible only to the finder or admin) */}
      {isFound && (isOwner || isAdmin) && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h2 className="card-title" style={{ fontSize: '1.1rem' }}>
              Claims Received ({claims.length})
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Only you and campus administrators can view these recovery requests
            </span>
          </div>

          {claims.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
              No claims submitted for this found item yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    backgroundColor: claim.status === 'ACCEPTED' ? '#f0fdf4' : claim.status === 'REJECTED' ? '#fef2f2' : '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{claim.claimantName}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                        {claim.claimantDepartment} • {claim.claimantCollegeId}
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
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      <strong>Identifying Proof:</strong> {claim.identifyingDetails}
                    </p>
                  )}

                  {claim.status === 'PENDING' && isOwner && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <div className="form-group" style={{ marginBottom: '8px' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Optional note / Handover instructions (e.g. Collect at CS Department Room 302)"
                          value={responseNotes[claim.id] || ''}
                          onChange={(e) => setResponseNotes({ ...responseNotes, [claim.id]: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleClaimDecision(claim.id, 'ACCEPTED')}
                          className="btn btn-primary btn-sm"
                          style={{ backgroundColor: 'var(--success-color)' }}
                        >
                          <Check size={14} /> Accept Claim
                        </button>
                        <button
                          onClick={() => handleClaimDecision(claim.id, 'REJECTED')}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger-color)' }}
                        >
                          <X size={14} /> Reject Claim
                        </button>
                      </div>
                    </div>
                  )}

                  {claim.responseNote && (
                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Response Note: {claim.responseNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;
