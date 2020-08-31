const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./utils/fbAuth');

const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signup, login, uploadImage } = require('./handlers/users');
 
// scream Routes
app.get('/screams', getAllScreams,);
app.post('/scream', FBAuth, postOneScream);

// users Routes
app.post("/signup", signup);
app.post('/login', login);

app.post('/user/image', FBAuth, uploadImage);
 
exports.api = functions.region('asia-northeast3').https.onRequest(app); 