const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();


app.use(cors());
app.use(express.json());

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const investmentsRouter = require('./routes/investments');
app.use('/api/investments', investmentsRouter);

const userInvestmentsRouter = require('./routes/userInvestments');
app.use('/api', userInvestmentsRouter);

const invReqRouter = require('./routes/investmentRequests');
app.use('/api', invReqRouter);

const userActivityRoutes = require('./routes/userActivity');
app.use('/api', userActivityRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const PORT = process.env.SERVER_PORT || 5000;
const path = require('path');

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});