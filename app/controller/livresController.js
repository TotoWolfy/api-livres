const Joi = require('joi');
const moment = require('moment');
const LivreModel = require('../model/livresModel');

const verifDate = (dateString, format) => {
  const date = moment(dateString, format, true);
  return date.isValid();
};

const schema = Joi.object({
  titre: Joi.string().min(3).max(50).required(),
  numero: Joi.number().min(1).required(),
  resume: Joi.string().min(20).max(800).required(),
  pages: Joi.array().items(Joi.string()).required(),
  auteur: Joi.string().min(3).max(30).required(),
  date: Joi.string().custom((value, helpers) => {
    if (!verifDate(value, 'DD/MM/YYYY')) {
      return helpers.message('Le format de date doit être DD/MM/YYYY');
    }
    return value;
  }).required(),
  nombrePages: Joi.number().min(1).required(),
  isbn: Joi.number().min(1).required(),
});

const LivreController = {

//afficher la liste des livres avec toutes les données
  getLivres: async (req, res) => {
    try{
      const listLivres = await LivreModel.getLivres();
      res.json(listLivres.docs);
    } 
    catch (err){
      console.error("Erreur dans la requête :", err);
      res.status(500).json({ error: "Erreur dans la requête :", err });
    }
  },

  //afficher toutes les données d'un seul livre sélectionné en fonction de son numero
  getLivreByNum: async (req, res) => {
    try {
      const numero = req.params.numero;
      const livreSelect = await LivreModel.getLivreByNum(numero);

      res.json(livreSelect.docs);
    }
    
    catch(err) {
      console.error("Erreur dans la requête :", err);
      res.status(500).json({ error: "Erreur dans la requête :", err });
    }
  },

  //afficher toutes les pages d'un seul livre sélectionné en fonction de son numero
  getPagesByNumLivre: async (req, res) => {
    try {
      const numero = req.params.numero;
      const pagesLivre = await LivreModel.getPagesByNumLivre(numero);

      res.json({ numero, pages: pagesLivre });
    }
    
    catch (err) {
      console.error("Erreur dans la requête :", err);
      res.status(500).json({ error: "Erreur dans la requête :", err });
    }
  },

  //afficher une page précise d'un livre au choix en fonction du numéro du livre et du numéro de la page voulue
  getPagesByNumPage: async (req, res) => {
    try{
      const numero = req.params.numero;
      const page = req.params.page;

      const pageSelect = await LivreModel.getPagesByNumPage(numero, page);

      res.json({ numero, page, contenu: pageSelect });
    }
    catch (err){
      console.error("Erreur dans la requête :", err);
      res.status(500).json({ error: "Erreur dans la requête :", err });
    }
  },

//ajout d'un livre
  addLivre: async (req, res) => {
    try{
      const newLivre = req.body;
      const { error } = schema.validate(newLivre);

      if(error){
        res.status(400).json({
          message: "le nouveau livre n'a pas pu être ajouté car des données sont manquantes ou le schéma n'a pas été respecté. Voici pourquoi :", error: error.message,
        });
      } 
      else{
        await LivreModel.addLivre(newLivre);
        res.json({ message: "Livre ajouté avec succès", livre: newLivre });
      }
    } 
    catch (err){
      console.error("Erreur pour l'ajout du livre :", err);
      res.status(500).json({ error: "Erreur pour l'ajout du livre :", err });
    }
  },

  //suppression d'un livre en fonction de son numero
  deleteLivre: async (req, res) => {
    try{
      const numero = req.params.numero;
      await LivreModel.deleteLivre(numero);
      res.json({ message: "Livre supprimé avec succès" });
    }
    catch (err){
      console.error("Erreur dans la requête :", err);
      res.status(500).json({ error: "Erreur dans la requête :", err });
    }
  },

  //modification d'un livre
  putLivre: async (req, res) => {
    try{
      const numero = req.params.numero;
      const newLivre = req.body;
      const fieldModif = await LivreModel.updateLivre(numero, newLivre);

      res.json({ message: "Livre mis à jour !", livre: fieldModif });
    }
    catch (err){
      console.error("Erreur dans la requête :", err);
      res.status(500).json({ error: "Erreur dans la requête :", err });
    }
  },

};


module.exports = LivreController;
