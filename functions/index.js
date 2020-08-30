const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();


app.get('/screams', (req, res) => {
    admin
        .firestore()
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

    admin.firestore()
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
 
// exports.getScreams = functions.https.onRequest((req,res) => {
    
// })

// exports.createScream = functions.https.onRequest((req,res) => {
//     if(req.method !== 'POST') {
//         return res.status(400).json({ error: 'Method not allowed' })
//     }
//     const newScreams = {
//         body:req.body.body,
//         userHandle: req.body.userHandle,
//         createdAt: admin.firestore.Timestamp.fromDate(new Date())
//     };

//     admin.firestore()
//         .collection('screams')
//         .add(newScreams)
//         .then(doc => {
//             res.json({messabe: `document ${doc.id} created successfully`});
//         })
//         .catch(err=> {
//             res.status(500).json({eror: 'something went wrong' });
//             console.error(err);
//         });
// });

// https://baseurl.com/api/
//exports.api = functions.https.onRequest(app); 
exports.api = functions.region('asia-northeast3').https.onRequest(app); 


