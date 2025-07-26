// src/pages/investorDashboard/NewRequest.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchInvestments, createInvestmentRequest } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import '../../styles/InvestmentDashboard.css';
import Layout from '../layouts/InvestorLayout';


export default function NewRequest() {
  const { auth }  = useAuth();
  const userId    = auth.user.id;
  const token     = auth.token;
  const navigate  = useNavigate();

  const [investments, setInvestments] = useState([]);
  const [form, setForm]               = useState({
    investmentId: '',
    amount: '',
    notes: ''
  });
  const [errors, setErrors]           = useState({});
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    fetchInvestments(token).then(setInvestments);
  }, [token]);

  const validate = () => {
    const errs = {};
    if (!form.investmentId) errs.investmentId = 'Please select an investment.';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount.';
    return errs;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await createInvestmentRequest(
        userId,
        form.investmentId,
        Number(form.amount),
        { type: 'assign', notes: form.notes },
        token
      );
      navigate('/investor/requests');
    } catch {
      setErrors({ submit: 'Failed to create request. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
    <div className="request-page">
      <h1 className="page-title">New Investment Request</h1>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Investment Select */}
          <div className="form-group">
            <label className="form-label" htmlFor="investmentId">
              Choose Investment <span className="required">*</span>
            </label>
            <select
              id="investmentId"
              name="investmentId"
              className={`form-control ${errors.investmentId ? 'invalid' : ''}`}
              value={form.investmentId}
              onChange={handleChange}
            >
              <option value="">– select an option –</option>
              {investments.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.name} (${inv.price.toLocaleString()})
                </option>
              ))}
            </select>
            {errors.investmentId && <p className="field-error">{errors.investmentId}</p>}
          </div>

          {/* Amount & Notes Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="amount">
                Amount (USD) <span className="required">*</span>
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                placeholder="e.g. 5,000"
                className={`form-control ${errors.amount ? 'invalid' : ''}`}
                value={form.amount}
                onChange={handleChange}
              />
              {errors.amount && <p className="field-error">{errors.amount}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                placeholder="Any additional details..."
                className="form-control"
                value={form.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          {errors.submit && <p className="field-error submit-error">{errors.submit}</p>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Layout>
  );
}
