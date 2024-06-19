const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authenticate');
const { predictFromModel, saveDetectionToFirestore } = require('../controllers/predictController');

// Contoh endpoint POST untuk melakukan prediksi dan menyimpan hasil deteksi
router.post('/predict', authenticate, async (req, res) => {
  const userId = req.user.uid;
  const { timestamp } = req.body;

  // Pastikan ada file gambar yang diunggah
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const imageFile = req.file;

  try {
    // Lakukan prediksi menggunakan model dari endpoint eksternal
    const detectedSignLanguage = await predictFromModel(imageFile.buffer);

    // Simpan hasil deteksi ke Firestore
    const imageUrl = 'https://example.com/image-url'; // Ganti dengan URL gambar yang sebenarnya
    const detectionId = await saveDetectionToFirestore(userId, imageUrl, detectedSignLanguage, timestamp);

    res.status(200).json({ detectionId, detectedSignLanguage });
  } catch (error) {
    console.error('Error handling prediction request:', error);
    res.status(500).json({ error: 'Unable to process prediction' });
  }
});

module.exports = router;
