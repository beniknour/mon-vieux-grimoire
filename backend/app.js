//On importe express
const express = require('express');

//Application express
const app = express();

//traite les données JSON
app.use(express.json());

const Thing = require('./models/Thing.js');


//permet à l'application d'appeler l'api

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



//requêtes POST

app.post('/api/books', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body
  });
  thing.save() //méthode save() qui enregistre simplement le Thing dans la base de données
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

//requêtes GET

app.get('/api/books/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.get('/api/books', (req, res, next) => {
  Thing.find() //find() renvoye un tableau contenant tous les Things dans notre base de données
  .then(things => res.status(200).json(things))
  .catch(error => res.status(400).json({ error }));
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