const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();


app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Mazadzicz Backend is running! 🚀');
});

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});