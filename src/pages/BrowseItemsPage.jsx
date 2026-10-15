import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'ID Cards',
  'Books and Notes',
  'Bags',
  'Electronics',
  'Wallets and Money',
  'Keys',
  'Other',
];

const BrowseItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchItems();
  }, [type, category, page]);

  const fetchItems = async (customKeyword = keyword) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: page,
        size: 12,
      };

      if (type) params.type = type;
      if (category && category !== 'All Categories') params.category = category;
      if (customKeyword.trim()) params.keyword = customKeyword.trim();

      const res = await api.get('/items', { params });
      setItems(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setError('Unable to fetch items. Please ensure backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    // Update URL query parameters cleanly
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    if (type) newParams.type = type;
    if (category && category !== 'All Categories') newParams.category = category;
    setSearchParams(newParams);

    fetchItems(keyword);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setPage(0);
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    if (newType) newParams.type = newType;
    if (category && category !== 'All Categories') newParams.category = category;
    setSearchParams(newParams);
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setPage(0);
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    if (type) newParams.type = type;
    if (newCat && newCat !== 'All Categories') newParams.category = newCat;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setKeyword('');
    setType('');
    setCategory('');
    setPage(0);
    setSearchParams({});
    fetchItems('');
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Campus Lost & Found Catalog
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Browse, filter, and search through verified items logged by campus students and security.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Search Query</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '32px' }}
                  placeholder="Keywords, location, or name..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Item Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="">All Types (Lost & Found)</option>
                <option value="LOST">Lost Items</option>
                <option value="FOUND">Found Items</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Search size={15} /> Filter
              </button>
              <button type="button" onClick={clearFilters} className="btn btn-outline" title="Reset all filters">
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{totalElements}</strong> items found
        </span>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Searching campus records...
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            No matching items found.
          </p>
          <p style={{ fontSize: '0.85rem' }}>
            Try broadening your search keywords or switching between Lost and Found filters.
          </p>
          <button onClick={clearFilters} className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="items-grid">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Simple Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </button>
              <span style={{ alignSelf: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseItemsPage;
