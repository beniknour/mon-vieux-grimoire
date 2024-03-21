const express = require('express');

const router = express.Router();
const Thing = require('../models/Thing.js');
//requêtes POST

router.post('/', (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
      ...req.body
    });
    thing.save() //méthode save() qui enregistre simplement le Thing dans la base de données
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });
  
  //requêtes GET
  
  router.get('/:id', (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  });
  
  router.get('/', (req, res, next) => {
    Thing.find() //find() renvoye un tableau contenant tous les Things dans notre base de données
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
  });
  
  //requêtes PUT
  
  router.put('/:id', (req, res, next) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  });
  
  // requête DELETE
  
  router.delete('/:id', (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  });
  

module.exports = router;