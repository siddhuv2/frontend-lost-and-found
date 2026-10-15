import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, PlusCircle, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Welcome Banner */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '48px 32px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <span className="badge badge-open" style={{ marginBottom: '16px' }}>
          Official Campus Utility
        </span>
        <h1 style={{ fontSize: '2.25rem', color: 'var(--primary-color)', marginBottom: '16px', fontWeight: 700 }}>
          College Lost and Found Portal
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 28px' }}>
          A secure, centralized platform for students, faculty, and campus staff to report missing items, browse recovered belongings, and coordinate safe claim verification across campus premises.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-lg">
                Portal Login
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                New User Registration
              </Link>
            </>
          )}
          <Link to="/items" className="btn btn-outline btn-lg">
            <Search size={18} />
            Browse Items
          </Link>
        </div>
      </section>

      {/* Campus Guidelines / Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', color: 'var(--primary-color)' }}>
              <PlusCircle size={20} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Report Swiftly</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Lost your ID card, bag, books, or calculator? Report it promptly with the last seen location so security and peers can assist.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-sm)', color: '#15803d' }}>
              <CheckCircle size={20} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Verify & Claim</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Found someone's property? List it safely. Legitimate owners can submit identifying proof which only you can review and accept.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-sm)', color: '#1d4ed8' }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Official & Verified</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Strict role-based access for students and staff with verified college credentials ensures accountability across campus departments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
