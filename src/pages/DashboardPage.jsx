import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { Search, PlusCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/items/recent');
      setRecentItems(res.data);
    } catch (err) {
      console.error('Failed to load recent items:', err);
      setError('Could not load recent items from the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      window.location.href = `/items?keyword=${encodeURIComponent(keyword.trim())}`;
    }
  };

  return (
    <div>
      {/* Welcome Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '24px 28px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Welcome back, {user?.fullName}!
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {user?.department} • {user?.collegeIdNumber} • ({user?.role === 'ROLE_ADMIN' ? 'Administrator' : user?.role === 'ROLE_STAFF' ? 'Staff' : 'Student'})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/report-lost" className="btn btn-outline">
            <PlusCircle size={16} color="var(--danger-color)" />
            Report Lost Item
          </Link>
          <Link to="/report-found" className="btn btn-primary">
            <PlusCircle size={16} />
            Report Found Item
          </Link>
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px', height: '44px' }}
              placeholder="Search by item name, description, or campus location (e.g. library, ID card, bag, canteen)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '44px', padding: '0 20px' }}>
            Search Items
          </button>
        </form>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <Link to="/items?type=LOST" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ transition: 'border-color 0.15s ease', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
               onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
            <span className="badge badge-lost" style={{ marginBottom: '8px' }}>Missing Items</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Browse Lost Items
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Check what other students & faculty are currently missing across campus.
            </p>
          </div>
        </Link>

        <Link to="/items?type=FOUND" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ transition: 'border-color 0.15s ease', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
               onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
            <span className="badge badge-found" style={{ marginBottom: '8px' }}>Recovered Items</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Browse Found Items
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Look through items recovered by security or peers to submit a claim request.
            </p>
          </div>
        </Link>

        <Link to="/my-reports" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ transition: 'border-color 0.15s ease', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
               onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
            <span className="badge badge-open" style={{ marginBottom: '8px' }}>Personal Logs</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              My Reports & Claims
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Manage your lost/found listings and handle claim requests you've received.
            </p>
          </div>
        </Link>
      </div>

      {/* Recently Reported Items */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--primary-color)" />
            Recently Reported Items
          </h2>
          <Link to="/items" className="btn btn-outline btn-sm">
            View All Items <ArrowRight size={14} />
          </Link>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading recent campus reports...
          </div>
        ) : recentItems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
            No recent items reported yet. Check back soon or report an item.
          </div>
        ) : (
          <div className="items-grid">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
