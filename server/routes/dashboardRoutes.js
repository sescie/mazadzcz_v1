const express = require('express');
const router = express.Router();
const db = require('../db'); // Your MySQL connection instance
const { auth } = require('../middleware/auth');

// Dashboard Summary Data
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [portfolioValueRows] = await db.query(`
      SELECT SUM(current_value) AS total_value 
      FROM user_investments 
      WHERE user_id = ?
    `, [userId]);

    const [performanceRows] = await db.query(`
      SELECT 
        AVG(return_rate) AS avg_return,
        COUNT(DISTINCT asset_type) AS diversification_score
      FROM user_investments
      WHERE user_id = ?
    `, [userId]);

    const [recentActivityRows] = await db.query(`
      SELECT * FROM investment_activity
      WHERE user_id = ?
      ORDER BY activity_date DESC
      LIMIT 5
    `, [userId]);

    const totalValue = portfolioValueRows[0]?.total_value ?? 0;
    const avgReturn = performanceRows[0]?.avg_return ?? 0;
    const diversificationScore = performanceRows[0]?.diversification_score ?? 0;

    const response = {
      totalValue,
      monthlyReturn: (Math.random() * 5).toFixed(2), // placeholder until implemented
      annualReturn: avgReturn,
      riskLevel: 'Moderate', // static placeholder
      diversificationScore,
      recentActivity: recentActivityRows
    };

    res.json(response);
  } catch (err) {
    console.error('[ERROR] /summary route:', err);
    res.status(500).json({ error: 'Failed to load dashboard data', details: err.message });
  }
});

// Portfolio Performance Data
router.get('/performance', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [performanceDataRows] = await db.query(`
      SELECT 
        DATE_FORMAT(date, '%Y-%m-01') AS month,
        SUM(value) AS portfolio_value
      FROM portfolio_history
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month
      LIMIT 12
    `, [userId]);

    // Format for chart
    const chartData = [
      ['Month', 'Your Portfolio', 'Market Average'],
      ...performanceDataRows.map(row => [
        new Date(row.month).toLocaleString('default', { month: 'short' }),
        Number(row.portfolio_value),
        Number(row.portfolio_value) * (0.9 + Math.random() * 0.2) // random market average
      ])
    ];

    res.json(chartData);
  } catch (err) {
    console.error('[ERROR] /performance route:', err);
    res.status(500).json({ error: 'Failed to load performance data', details: err.message });
  }
});

// Asset Allocation Data
router.get('/allocation', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [allocationDataRows] = await db.query(`
      SELECT 
        asset_type AS asset,
        SUM(current_value) AS value
      FROM user_investments
      WHERE user_id = ?
      GROUP BY asset_type
    `, [userId]);

    // Format for pie chart
    const chartData = [
      ['Asset', 'Value'],
      ...allocationDataRows.map(row => [row.asset, Number(row.value)])
    ];

    res.json(chartData);
  } catch (err) {
    console.error('[ERROR] /allocation route:', err);
    res.status(500).json({ error: 'Failed to load allocation data', details: err.message });
  }
});

// Recent Activity
router.get('/activity', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [activityRows] = await db.query(`
      SELECT 
        id,
        activity_date AS date,
        activity_type AS action,
        amount,
        description AS asset
      FROM investment_activity
      WHERE user_id = ?
      ORDER BY activity_date DESC
      LIMIT 5
    `, [userId]);

    res.json(activityRows);
  } catch (err) {
    console.error('[ERROR] /activity route:', err);
    res.status(500).json({ error: 'Failed to load activity data', details: err.message });
  }
});

module.exports = router;
