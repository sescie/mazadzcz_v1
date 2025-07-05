const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const db = require('../db');
const { auth, isAdmin } = require('../middleware/auth');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Node.js fetch polyfill


// Create Investment (Admin Only)
router.post('/', auth, isAdmin, async (req, res) => {
  const data = req.body;

  // 1) Required checks
  const required = ['isin','name','asset_class','price'];
  const missing = required.filter(f => !data[f]);
  if (missing.length) {
    return res.status(400).json({ error: 'Missing fields', details: missing });
  }

  // 2) Prepare insert
  const id = uuid();
  const now = new Date();
  const cols = ['id','isin','name','asset_class','price','last_price_update'];
  const vals = [id, data.isin, data.name, data.asset_class, data.price, now];
  const placeholders = cols.map(_ => '?');

  // 3) Add any optional field supplied
  const optionalFields = [
    'cusip','ticker','currency','description','status','inception_date',
    // equity
    'exchange','market_cap','sector','industry','dividend_yield',
    // fixed income
    'coupon_rate','issue_date','maturity_date','credit_rating','duration','yield_to_maturity',
    // fund
    'fund_type','nav','aum','expense_ratio','dividend_frequency',
    // fees & mins
    'management_fee','performance_fee','minimum_investment','redemption_period'
  ];
  optionalFields.forEach(field => {
    if (data[field] !== undefined) {
      cols.push(field);
      placeholders.push('?');
      vals.push(data[field]);
    }
  });

  const sql = `
    INSERT INTO investments (${cols.join(',')})
    VALUES (${placeholders.join(',')})
  `;

  try {
    await db.query(sql, vals);
    const [rows] = await db.query('SELECT * FROM investments WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create investment error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'ISIN already exists' });
    }
    res.status(500).json({ error: 'Investment creation failed' });
  }
});

router.post('/map-isin', async (req, res) => {
  const { isin } = req.body;
  if (!isin) return res.status(400).json({ error: 'Missing isin in body' });

  try {
    const payload = [{ idType: 'ID_ISIN', idValue: isin }];
    const response = await fetch('https://api.openfigi.com/v3/mapping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OPENFIGI-APIKEY': process.env.OPENFIGI_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    // data is an array; each item has .data array with mapped instruments
    res.json(data[0].data);
  } catch (err) {
    console.error('OpenFIGI map error:', err);
    res.status(500).json({ error: 'Failed to map ISIN' });
  }
});

router.get('/isin/:isin', async (req, res) => {
  const { isin } = req.params;
  try {
    // 1) find base info in your DB
    const [[inv]] = await db.query(
      `SELECT id, isin, name, asset_class, description, ticker, currency, inception_date
         FROM investments
        WHERE isin = ?`, [isin]
    );
    if (!inv) return res.status(404).json({ error: 'ISIN not found' });
    inv.ticker = "ATO";

    const AV_KEY = process.env.ALPHA_VANTAGE_KEY;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${inv.ticker}&apikey=${AV_KEY}`;
    const apiRes = await fetch(url);
    const json = await apiRes.json();
    const quote = json['Global Quote'] || {};

    // 3) merge and return
    const details = {
      ...inv,
      current_price: quote['05. price'] ?? null,
      change_pct:    quote['10. change percent'] ?? null,
      last_trade:    quote['07. latest trading day'] ?? null,
    };
    res.json(details);

  } catch (err) {
    console.error('Fetch by ISIN error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get All Investments (Authenticated)
router.get('/', async (req, res) => {
  try {
    // Basic fields for listing
    const [investments] = await db.query(
      `SELECT 
        id, isin, name, asset_class, price as current_price,
        last_price_update, status, currency, ticker,
        description, inception_date
       FROM investments`
    );
    res.json(investments);
  } catch (err) {
    console.error('Fetch investments error:', err);
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

// Get Investment Details
router.get('/:id', async (req, res) => {
  try {
    const [investment] = await db.query(
      `SELECT * FROM investments WHERE id = ?`,
      [req.params.id]
    );
    
    if (!investment.length) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    res.json(investment[0]);
  } catch (err) {
    console.error('Fetch investment details error:', err);
    res.status(500).json({ error: 'Failed to fetch investment details' });
  }
});

// Update Investment (Admin Only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  const data = req.body;
  const now = new Date();
  
  // Prepare update fields
  const updateFields = [];
  const updateValues = [];
  
  // Required fields that can be updated
  const mainFields = ['name', 'asset_class', 'price', 'status', 'description', 'currency'];
  mainFields.forEach(field => {
    if (data[field] !== undefined) {
      updateFields.push(`${field} = ?`);
      updateValues.push(data[field]);
    }
  });
  
  // Always update last_price_update when price is updated
  if (data.price !== undefined) {
    updateFields.push('last_price_update = ?');
    updateValues.push(now);
  }
  
  // Optional fields
  const optionalFields = [
    'cusip', 'ticker', 'inception_date',
    // equity
    'exchange', 'market_cap', 'sector', 'industry', 'dividend_yield',
    // fixed income
    'coupon_rate', 'issue_date', 'maturity_date', 'credit_rating', 'duration', 'yield_to_maturity',
    // fund
    'fund_type', 'nav', 'aum', 'expense_ratio', 'dividend_frequency',
    // fees & mins
    'management_fee', 'performance_fee', 'minimum_investment', 'redemption_period'
  ];
  
  optionalFields.forEach(field => {
    if (data[field] !== undefined) {
      updateFields.push(`${field} = ?`);
      updateValues.push(data[field]);
    }
  });
  
  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  updateValues.push(req.params.id);
  
  try {
    const sql = `UPDATE investments SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.query(sql, updateValues);
    
    const [updatedInvestment] = await db.query(
      `SELECT * FROM investments WHERE id = ?`,
      [req.params.id]
    );
    
    res.json(updatedInvestment[0]);
  } catch (err) {
    console.error('Update investment error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'ISIN already exists' });
    }
    res.status(500).json({ error: 'Failed to update investment' });
  }
});

// Delete Investment (Admin Only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const [result] = await db.query(
      `DELETE FROM investments WHERE id = ?`,
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    res.json({ message: 'Investment deleted successfully' });
  } catch (err) {
    console.error('Delete investment error:', err);
    res.status(500).json({ error: 'Failed to delete investment' });
  }
});

// Update Investment Status (Admin Only)
router.patch('/:id/status', auth, isAdmin, async (req, res) => {
  const { status } = req.body;
  
  try {
    if (!['Active', 'Pending', 'Suspended', 'Closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const [result] = await db.query(
      `UPDATE investments SET status = ? WHERE id = ?`,
      [status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    res.json({ message: `Investment status updated to ${status}` });
  } catch (err) {
    console.error('Update investment status error:', err);
    res.status(500).json({ error: 'Failed to update investment status' });
  }
});

// Get Investment Performance Metrics
router.get('/:id/performance', auth, async (req, res) => {
  try {
    // Verify investment exists first
    const [investment] = await db.query(
      `SELECT id FROM investments WHERE id = ?`,
      [req.params.id]
    );
    
    if (!investment.length) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    // This would query your performance data table
    const [performance] = await db.query(
      `SELECT * FROM investment_performance 
       WHERE investment_id = ?
       ORDER BY date DESC LIMIT 12`,
      [req.params.id]
    );
    
    res.json(performance);
  } catch (err) {
    console.error('Fetch investment performance error:', err);
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

// Export Investments (Admin Only)
router.get('/export', auth, isAdmin, async (req, res) => {
  try {
    const [investments] = await db.query(
      `SELECT * FROM investments`
    );
    
    // Set headers based on requested format
    if (req.query.format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=investments.csv');
      
      // Get all possible columns from the first item
      const columns = investments.length > 0 ? Object.keys(investments[0]) : [];
      
      // Convert to CSV
      const header = columns.join(',');
      const rows = investments.map(inv => {
        return columns.map(col => {
          // Escape quotes and wrap in quotes if contains comma
          const value = inv[col] !== null ? String(inv[col]).replace(/"/g, '""') : '';
          return value.includes(',') ? `"${value}"` : value;
        }).join(',');
      }).join('\n');
      
      return res.send(header + '\n' + rows);
    } else {
      res.json(investments);
    }
  } catch (err) {
    console.error('Export investments error:', err);
    res.status(500).json({ error: 'Failed to export investments' });
  }
});



module.exports = router;