# Contexte
Les librairies “Au Vieux Grimoire“ comptent de nombreux clients
passionnés. L’objectif du site “Mon Vieux Grimoire” est de donner la
possibilité aux lecteurs de créer des livres, de les noter et de consulter les
livres existants ainsi que leurs notes.
## Missions

Utilisations de Mongoose pour modéliser les données MongoDB, le site doit respecter le GreenCode.

## Architecture générale

L’application web sera composée de 4 pages :
● une page pour permettre l’inscription / la connexion des utilisateurs ;
● une page d’accueil présentant les livres déjà ajoutés par les
utilisateurs (visible en étant connecté ou non) ;
● une page “livre” présentant toutes les informations sur un livre
proposé (visible en étant connecté ou non) ;
● une page permettant aux utilisateurs d’ajouter de nouveaux livres à
la plateforme (visible seulement aux utilisateurs connectés).



## API Errors

Les erreurs éventuelles doivent être renvoyées telles qu'elles sont produites, sans modification ni ajout. Si
nécessaire, utilisez une nouvelle Error().
API Routes

Toutes les routes pour les livres doivent disposer d’une autorisation (le token est envoyé par le front-end avec
l'en-tête d’autorisation « Bearer »). Avant qu’un utilisateur puisse apporter des modifications à la route livre (book),
le code doit vérifier si le user ID actuel correspond au user ID du livre. Si le user ID ne correspond pas, renvoyer
« 403: unauthorized request ». Cela permet de s'assurer que seul le propriétaire d’un livre puisse apporter des
modifications à celui-ci.

## Models

User {
email : String - adresse e-mail de l’utilisateur [unique]
password : String - mot de passe haché de l’utilisateur
}

Book {
userId : String - identifiant MongoDB unique de l'utilisateur qui a créé le livre

title : String - titre du livre

author : String - auteur du livre

imageUrl : String - illustration/couverture du livre

year: Number - année de publication du livre

genre: String - genre du livre

ratings : [
{
userId : String - identifiant MongoDB unique de l'utilisateur qui a noté le livre
grade : Number - note donnée à un livre
}

] - notes données à un livre

averageRating : Number - note moyenne du livre
}


  ## Sécurité
  
  ● Le mot de passe de l'utilisateur doit être haché.
  
  ● L'authentification doit être renforcée sur toutes les routes livre (book) requises.
  
  ● Les adresses électroniques dans la base de données sont uniques, et un plugin Mongoose approprié est
  utilisé pour garantir leur unicité et signaler les erreurs.
  
  ● La sécurité de la base de données MongoDB (à partir d'un service tel que MongoDB Atlas) ne doit pas
  empêcher l'application de se lancer sur la machine d'un utilisateur.
  
  ● Les erreurs issues de la base de données doivent être remontées.
