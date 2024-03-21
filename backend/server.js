const http = require('http');
require('dotenv').config();

//on importe l'application

const app = require('./app');

//normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

//errorHandler recherche les différentes erreurs et les gère de manière appropriée
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  // Gère les erreurs spécifiques liées à la gestion du port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
    // Erreur si le port est déjà utilisé
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
//On cree le serveur HTTP grâce à l'application express
const server = http.createServer(app);
//gere les erreurs liées au serveur
server.on('error', errorHandler);
//on ecoute l'evenement 'listening' du serveur
server.on('listening', () => {
  const address = server.address();// on obtient les détails sur l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // affiche un message indiquant sur quel port ou canal le serveur écoute
});
// met le serveur en ecoute sur le port défini
server.listen(port);
