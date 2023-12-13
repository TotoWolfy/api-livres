const express = require('express');
const jwt = require('jsonwebtoken');


const jetonrouter = express.Router();


//route pour obtenir un token : http://localhost:8080/jeton?user=mettre un nom
jetonrouter.get('/jeton', (req, res) => {
    try {
      const userName = req.query.user;
  
      if (!userName) {
        return res.status(400).json({ error: "il manque le nom d'utilisateur" });
      }
  
      const payload = { name: userName };
      const token = jwt.sign(payload, 'sPE6SPFiWj');
      res.json({ jeton: token });
    } catch (error) {
      console.error('Erreur lors de la création du jeton :', error);
      res.status(500).json({ error: 'Erreur lors de la création du jeton', details: error.message });
    }
  });


  //route de verification du token : http://localhost:8080/verify?token=le token obtenu avec la route precedente
  jetonrouter.get('/verify', (req, res) => {
    try {
      const token = req.query.token;
  
      if (!token) {
        return res.status(400).json({ status: false, message: "il manque le token" });
      }
  
      jwt.verify(token, 'sPE6SPFiWj', (err, decoded) => {
        if (err) {
          return res.status(403).json({ status: false, message: "token invalide" });
        }
  
        res.json({ status: true, name: decoded.name });
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du jeton :', error);
      res.status(500).json({ error: 'Erreur lors de la vérification du jeton', details: error.message });
    }
  });


  module.exports = jetonrouter;