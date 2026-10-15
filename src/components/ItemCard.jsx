import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag } from 'lucide-react';

const ItemCard = ({ item }) => {
  // Format Indian date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
          {item.type}
        </span>
        <span className={`badge ${item.status === 'OPEN' ? 'badge-open' : item.status === 'CLAIMED' ? 'badge-claimed' : 'badge-resolved'}`}>
          {item.status}
        </span>
      </div>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
        <Link to={`/items/${item.id}`} style={{ color: 'inherit' }}>
          {item.title}
        </Link>
      </h3>

      <p style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        marginBottom: '16px',
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {item.description}
      </p>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Tag size={14} />
          <span>{item.category}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={14} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.campusLocation}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} />
          <span>{item.type === 'LOST' ? 'Lost on:' : 'Found on:'} {formatDate(item.incidentDate)}</span>
        </div>
      </div>

      <div style={{ marginTop: '14px', paddingTop: '10px' }}>
        <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
