const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/cab-types', require('./routes/cabTypes'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/geo', require('./routes/geo'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (In-memory Mock Mode)`);
});
