const express = require('express');
const app = express();
const router = require('./app/router/livresRouteur.js');
const jetonrouter = require('./app/router/jetonRouteur.js');
const jwt = require('jsonwebtoken');


app.use(express.json());


app.use('/', jetonrouter);
app.use('/livres', router);

app.listen(8080, () => {
  console.log("Server demarré");
});