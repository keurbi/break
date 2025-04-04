import {Router} from 'express';

const router = Router();

// Route pour gérer la soumission du formulaire de login
//router.post('/login', validateLoginData, authenticateUser, (req, res) => {
  // Si tout est valide, renvoyer une réponse de succès
  //res.send('Connexion réussie');
//});

router.get('pause', (req, res) => {
    res.send('Page de pause');
});


export default router;