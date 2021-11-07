const functions = require("firebase-functions");
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const express = require('express');
const cors = require('cors');

const app = express();

initializeApp();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
app.post('/', (req, res) => {

  getAuth()
  .createCustomToken(req.body.id, { guest: true })
  .then((customToken) => res.send({customToken}) );

});


exports.tokenForInvite = functions.https.onRequest(app);
