// server.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const predictRoutes = require('./routes/predictRoutes');
const { authenticate } = require('./middlewares/authenticate'); // Pastikan path-nya benar

const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk parsing body request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware untuk menangani upload file
const upload = multer();
app.use(upload.single('image'));

// Middleware authenticate sebelum menggunakan rute prediksi yang memerlukan autentikasi
app.use('/api', authenticate, predictRoutes);

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
