const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./utils/fbAuth');

const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signup, login } = require('./handlers/users');
  

 
// scream Routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);

// users Routes
app.post("/signup", signup);
app.post('/login', login);
 
exports.api = functions.region('asia-northeast3').https.onRequest(app); 