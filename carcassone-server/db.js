const admin = require('firebase-admin');
const serviceAccount = require('./connection-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const gameRef = db.collection('games').doc('instance');
