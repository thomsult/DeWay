# DeWay : l'application pour trouver un emploi

Né de la collaboration entre quatre développeurs en formation - Anaïs, Marie-Hermine, Maxime et Thomas, l'application DeWay a pour objectif de proposer l'ensemble des offres d'emploi de développement informatique (ROME M1805) dans la région de Toulouse, disponibles sur le site de Pôle emploi.

DeWay se présente sous la forme d'une carte où vous pouvez rechercher des offres d'emploi dans Toulouse et sa région. En cliquant sur un <i>marker</i>, vous aurez accès aux informations principales de l'offre d'emploi (titre, entreprise, type de poste, expérience). Vous pouvez également accéder à l'ensemble des informations de l'offre en cliquant sur "Voir plus". Enfin, il est possible la page Pôle Emploi en cliquant sur le bouton "Postuler".
## L'utilisation d'APIs

Le développement de l'application repose sur le croisement de données d'origine divers. 
- API Offres d'emploi (v2) de Pole Emploi (https://pole-emploi.io/data/api/offres-emploi)
- API Base SIRENE de Toulouse Métropole (https://data.toulouse-metropole.fr/explore/dataset/base-sirene-v3/api/)
- API Vélos en libre-service de JCDecaux (https://developer.jcdecaux.com/#/opendata/vls)

L'API de Pole emploi permet de récupérer les données relatives aux offres d'emploi publiées sur le site.
A partir de ces données, nous récupérons la géolocalisation des offres afin de les afficher sur la carte. 
Nous rencontrons trois catégories de données : 
- offres avec géolocalisation exacte;
- offres avec géolocalisation sur le centre de Toulouse (coordonnées XXXX);
- offres sans géolocalisation.

Afin de pallier la géolocalisation imprécise, nous faisons appel à une autre API, celle de la base SIRENE de Toulouse Métropole. 
Cette API fournit toutes les informations concernant les entreprises situées sur le territoire de Toulouse Métropole. En utilisant le nom de l'entreprise contenu dans l'offre d'emploi, nous récupérons les données de géolocalisation exactes. 
Cependant, l'appel à cette API ne permet pas de trouver la géolocalisation de toutes les offres d'emploi, notamment parce que certaines entreprises ne sont pas situées sur le territoire (entreprises sans locaux, uniquement présentes sur Internet par exemple). De plus, dans certaines offres d'emploi, le nom de l'entreprise est indiqué dans la description et non dans le champ correspondant, ce qui ne permet pas de le récupérer. 
Nous avons tenté d'utiliser l'API Recherche d'entreprises du Gouvernement (https://api.gouv.fr/les-api/api-recherche-entreprises) afin de récupérer davantage de données de géolocalisation. Nous avons été stoppés dans notre tentative : l'API refuse les appels depuis le front. 

Enfin, l'API de JCDecaux permet d'afficher les informations relatives aux VélôToulouse. 
### Pré-requis

Ce qu'il est requis pour commencer avec votre projet...

- Programme 1
- Programme 2
- etc...

## Fabriqué avec

* [React](https://fr.reactjs.org/) - Librairie JS
* [Vite](https://vitejs.dev/) - 
* [Axios](https://fhttps://axios-http.com/fr/) - Librairie JS
* [NodeJS](https://nodejs.org/)
* [Leaflet](http://https://leafletjs.com/) - Librairie JS pour carte interactive
* [MUI](http://mui.com) - Framework CSS (front-end)

## Auteurs
* *Anaïs Malige-Bordes* _alias_ [@curiouseagle](https://github.com/curiouseagle)
* *Marie-Hermine Schneider* _alias_ [@aimach](https://github.com/aimach)
* *Maxime Faure* _alias_ [@Milimaks](https://github.com/Milimaks)
* *Thomas Sultan* _alias_ [@thomsult](https://github.com/thomsult)

Sous la bienveillance d'*Arthur Heurtebise* _alias_ [@ArthurHtbk](https://github.com/ArthurHtbk)


