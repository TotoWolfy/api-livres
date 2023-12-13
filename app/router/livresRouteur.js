const LivreController = require('../controller/livresController.js');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

//middleware iniutilisable

// //middleware pour verifier le token et restreindre l'acces aux requetes
// const verifyToken = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(403).json({ status: false, message: 'Token absent' });
//   }

//   jwt.verify(token, 'sPE6SPFiWj', (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ status: false, message: 'Token invalide' });
//     }

//     //stocke le nom user dans la requete
//     req.name = decoded.name; 
//     next();
//   });
// };

// router.use(verifyToken);



//je n'ai pas reussi à proteger mes routes car mon middleware faisait tellement bien son travail
//qu'il considérait le token comme invalide alors qu'il était généré
//et validé avec les routes du jetonRouteur.js

router.get("/", LivreController.getLivres);
router.get("/:numero", LivreController.getLivreByNum);
router.get("/:numero/pages", LivreController.getPagesByNumLivre);
router.get("/:numero/pages/:page", LivreController.getPagesByNumPage);
router.post("/", LivreController.addLivre);
router.delete("/:numero", LivreController.deleteLivre);
router.put("/:numero", LivreController.putLivre);


module.exports = router;


// const router = express.Router();

// router.get("/", LivreController.getLivres);
// router.get("/:numero", LivreController.getLivreByNum);
// router.get("/:numero/pages", LivreController.getPagesByNumLivre);
// router.get("/:numero/pages/:page", LivreController.getPagesByNumPage);
// router.post("/", LivreController.addLivre);
// router.delete("/:numero", LivreController.deleteLivre);
// router.put("/:numero", LivreController.putLivre);



