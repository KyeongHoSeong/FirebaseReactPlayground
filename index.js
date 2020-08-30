const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();
//step 6
const firebaseConfig = {
    apiKey: "AIzaSyAf3mgT3HiJAhGLuT9HN80A3E0fp-nTe9M",
    authDomain: "fireactplayground.firebaseapp.com",
    databaseURL: "https://fireactplayground.firebaseio.com",
    projectId: "fireactplayground",
    storageBucket: "fireactplayground.appspot.com",
    messagingSenderId: "860050537620",
    appId: "1:860050537620:web:d1d568049934984a06c881",
    measurementId: "G-LZH00LGQEY"
  };
  
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/screams', (req, res) => {
    // admin
    //     .firestore()
    db
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc=> {
                //screams.push(doc.data());
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(screams);
        })
        .catch(err => console.error(err));
});

app.post('/scream', (req,res) => {  
    const newScreams = {
        body:req.body.body,
        userHandle: req.body.userHandle,
        //createdAt: admin.firestore.Timestamp.fromDate(new Date())
        createdAt: new Date().toISOString()
    };

    // admin
    //     .firestore()
    db
        .collection('screams')
        .add(newScreams)
        .then(doc => {
            res.json({messabe: `document ${doc.id} created successfully`});
        })
        .catch(err=> {
            res.status(500).json({eror: 'something went wrong' });
            console.error(err);
        });
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello World!");
});
 
// Signup Route

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  // TODO: validate data;
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => { 
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then((idToken) => {// step 7
        //return res.status(201).json({ token });
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId 
        };
        // users에 자료 입력
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        
    })
    .then(() => {
        return res.status(201).json({token});
    })
    .catch((err) => {
      console.error(err);
      if(err.code === 'auth/email-already-in-use'){
          res.status(400).json( {email: 'Email is already is use'})
      } else {
        return res.status(500).json({ error: err.code });
        }
    });
});


exports.api = functions.region('asia-northeast3').https.onRequest(app); 