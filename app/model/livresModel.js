const nano = require('nano')('http://cbt4065a:P395e1c2@localhost:5984');
const dbLivres = nano.db.use('livres');

const LivreModel = {

  //afficher la liste des livres avec toutes les données
  getLivres: async () => {
    const query = {
      "selector": {},
      "fields": ["titre", "numero", "resume", "pages", "auteur", "date", "nombrePages", "isbn"],
      "sort": ["titre", "numero", "resume", "pages", "auteur", "date", "nombrePages", "isbn"],
    };

    return await dbLivres.find(query);

  },

  //afficher toutes les données d'un seul livre sélectionné en fonction de son numero
  getLivreByNum: async (numero) => {

    const query ={
      "selector": { "numero": parseInt(numero, 10) },
      "fields": ["titre", "numero", "resume", "pages", "auteur", "date", "nombrePages", "isbn"],
    };

    return await dbLivres.find(query);
  },

  //afficher toutes les pages d'un seul livre sélectionné en fonction de son numero
  getPagesByNumLivre: async (numero) => {
    const query = {
      "selector": { "numero": parseInt(numero, 10) },
      "fields": ["pages"],
    };

    const livreSelect = await dbLivres.find(query);

    if (livreSelect.docs.length ==0) {
      throw new Error("Il n'y a pas de livre qui correspond à ce numéro.");
    }

    const pagesLivre = livreSelect.docs[0].pages;
    return {numero, pages: pagesLivre };

  },


  //afficher une page précise d'un livre au choix en fonction du numéro du livre et du numéro de la page voulue
  getPagesByNumPage: async (numero, page) => {


    const query = {
      "selector": { "numero": parseInt(numero, 10) },
      "fields": ["pages"],
    };

    const livreSelect = await dbLivres.find(query);

//verifie s'il y a un tableau correspondant au numero fourni, s'il n'y en a pas, ça renvoie une erreur
    if(livreSelect.docs.length ==0){
      throw new Error("Il n'y a pas de livre qui correspond à ce numéro.");
    }

    const pagesLivre = livreSelect.docs[0].pages;

    //vérifie si la page existe en évitant par exemple d'entrer 0 ou une valeur supérieure au nb de pages dans le livre
    if(page < 1 || page > pagesLivre.length){
      throw new Error("Cette page n'est pas dans le livre.");
    }

//on met un -1 pour que ça corresponde au positionnement de la page dans le tableau
    const pageSelect = pagesLivre[page - 1];
    return {numero, page, contenu: pageSelect };

  },


//ajout d'un livre
  addLivre: async (newLivre) => {
  
    await dbLivres.insert(newLivre);
  },

//suppression d'un livre en fonction de son numero
  deleteLivre: async (numero) => {
    const query ={
      "selector": { "numero": parseInt(numero, 10) },
      "fields": ["_id", "_rev", "titre", "numero", "resume", "pages", "auteur", "date", "nombrePages", "isbn"],
    };

    const livreToDelete= await dbLivres.find(query);

    if (livreToDelete.docs.length ==0){
      throw new Error("Il n'y a pas de livre qui correspond à ce numéro.");
    }

    const suppression = await dbLivres.destroy(
      livreToDelete.docs[0]._id, livreToDelete.docs[0]._rev, livreToDelete.docs[0].titre, livreToDelete.docs[0].numero,
      livreToDelete.docs[0].pages, livreToDelete.docs[0].auteur, livreToDelete.docs[0].date, livreToDelete.docs[0].nombrePages, livreToDelete.docs[0].isbn,
    );

    if (!suppression.ok){
      throw new Error("Erreur lors de la suppression du livre.");

    }

  },


//modification d'un livre
  updateLivre: async (numero, newLivre) => {
    
    const query ={
      "selector": { "numero": parseInt(numero, 10)},
      "fields": ["_id", "_rev", "titre", "numero", "resume", "pages", "auteur", "date", "nombrePages", "isbn"],
    };

    const oldLivre = await dbLivres.find(query);

    if (oldLivre.docs.length ==0) {
      throw new Error("Il n'y a pas de livre qui correspond à ce numéro.");
    }


//concatenation du contenu du sportif avec le body de la requête pour que ça vienne écraser l'ancien field correspondant
    const fieldModif= {
      ...oldLivre.docs[0],
      ...newLivre
    };


    const modification = await dbLivres.insert(fieldModif);

    if (!modification.ok){
      throw new Error("Erreur pour la mise à jour du livre.");
    }
  },
  
};

module.exports = LivreModel;
