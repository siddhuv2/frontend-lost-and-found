import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  'ID Cards',
  'Books and Notes',
  'Bags',
  'Electronics',
  'Wallets and Money',
  'Keys',
  'Other',
];

const ReportItemPage = ({ type = 'LOST' }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    campusLocation: '',
    incidentDate: new Date().toISOString().split('T')[0],
    additionalDetails: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isLost = type === 'LOST';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Item name is required';
    if (!formData.category) errors.category = 'Please choose a category';
    if (!formData.description.trim() || formData.description.length < 5) {
      errors.description = 'Please provide a clear description (at least 5 characters)';
    }
    if (!formData.campusLocation.trim()) {
      errors.campusLocation = isLost ? 'Last seen location is required' : 'Found location on campus is required';
    }
    if (!formData.incidentDate) errors.incidentDate = 'Date is required';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setGeneralError('');
      const payload = {
        ...formData,
        type: type,
      };

      const res = await api.post('/items', payload);
      setSuccessMessage(`Item successfully reported as ${type}! Redirecting...`);
      setTimeout(() => {
        navigate(`/items/${res.data.id}`);
      }, 1200);
    } catch (err) {
      if (err.response?.data?.fieldErrors) {
        setFieldErrors(err.response.data.fieldErrors);
      } else {
        setGeneralError(err.response?.data?.message || 'Failed to submit report. Please check your network and inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '20px auto 0' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="card">
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
              {type}
            </span>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isLost
              ? 'Provide accurate details of your missing possession so fellow campus members can identify and return it.'
              : 'Help return found property to its rightful owner. You can review proof before handing it over.'}
          </p>
        </div>

        {generalError && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{generalError}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <CheckCircle size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Item Name *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              placeholder={isLost ? "e.g. Student ID Card (Rahul Sharma) or Dell Laptop Charger" : "e.g. Casio Scientific Calculator or Black Lenovo Backpack"}
              value={formData.title}
              onChange={handleChange}
              required
            />
            {fieldErrors.title && <div className="form-error">{fieldErrors.title}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {fieldErrors.category && <div className="form-error">{fieldErrors.category}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="incidentDate">
                {isLost ? 'Date Lost *' : 'Date Found *'}
              </label>
              <input
                type="date"
                id="incidentDate"
                name="incidentDate"
                className="form-input"
                value={formData.incidentDate}
                onChange={handleChange}
                required
              />
              {fieldErrors.incidentDate && <div className="form-error">{fieldErrors.incidentDate}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="campusLocation">
              {isLost ? 'Last Seen Location on Campus *' : 'Found Location on Campus *'}
            </label>
            <input
              type="text"
              id="campusLocation"
              name="campusLocation"
              className="form-input"
              placeholder="e.g. Central Library - 2nd floor reading hall, or Canteen table #4"
              value={formData.campusLocation}
              onChange={handleChange}
              required
            />
            {fieldErrors.campusLocation && <div className="form-error">{fieldErrors.campusLocation}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Describe color, brand, model, size, markings, condition, or any items inside..."
              value={formData.description}
              onChange={handleChange}
              required
            />
            {fieldErrors.description && <div className="form-error">{fieldErrors.description}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="additionalDetails">
              Additional Identifying Details (Optional)
            </label>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              className="form-textarea"
              placeholder={isLost
                ? "Unique stickers, scratches, password lock, or custom marks that only you know"
                : "Mention if you submitted it to Security Gate 1, HOD office, or hold it personally"}
              value={formData.additionalDetails}
              onChange={handleChange}
              style={{ minHeight: '70px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Submitting Report...' : isLost ? 'Submit Lost Item Report' : 'Submit Found Item Report'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportItemPage;
