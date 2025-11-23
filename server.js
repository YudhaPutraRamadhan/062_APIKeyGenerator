const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

db.sequelize
  .sync()
  .then(() => {
    console.log('Database terhubung & tersinkronisasi.');
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Gagal terhubung ke database:', err);
  });