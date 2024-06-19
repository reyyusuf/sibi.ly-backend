const axios = require('axios');
const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data'); // Pastikan ini ditambahkan

// Fungsi untuk melakukan prediksi menggunakan model dari endpoint eksternal
async function predictFromModel(imageBuffer) {
  try {
    const formData = new FormData();
    formData.append('image', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });

    const response = await axios.post('https://model-ml-v5azymbbtq-et.a.run.app', formData, {
      headers: formData.getHeaders(),
    });

    return response.data.prediction;
  } catch (error) {
    console.error('Error predicting from model:', error);
    throw error;
  }
}

// Fungsi untuk menyimpan hasil deteksi ke Firestore
async function saveDetectionToFirestore(userId, imageUrl, detectedSignLanguage, timestamp) {
  try {
    const docRef = db.collection('detectionHistory').doc();
    await docRef.set({
      detectionId: docRef.id,
      userId,
      detectionType: 'Sign Language',
      timestamp: timestamp || new Date().toISOString(),
      data: {
        imageUrl,
        detectedSignLanguage,
      },
    });

    return docRef.id; // Mengembalikan ID dokumen baru yang disimpan
  } catch (error) {
    console.error('Error saving detection to Firestore:', error);
    throw error;
  }
}

module.exports = {
  predictFromModel,
  saveDetectionToFirestore,
};
