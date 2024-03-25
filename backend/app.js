//On importe express
const express = require('express');

//Application express
const app = express();

//traite les données JSON
app.use(express.json());

//Routes

const booksRoutes = require('./routes/books');
app.use('/api/books', booksRoutes);

const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes);


//permet à l'application d'appeler l'api

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//On exporte l'application

module.exports = app;

//MongoDB

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user:user@cluster0.dx2diar.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));