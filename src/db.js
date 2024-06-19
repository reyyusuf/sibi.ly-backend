const admin = require('firebase-admin');
const serviceAccount = require('/sibily-firebase-adminsdk-nkzig-3114e4c965.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sibily.firebaseio.com' // Ganti dengan URL database Anda
});

const db = admin.firestore();

module.exports = { db };
