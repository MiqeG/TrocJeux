module.exports=function(req,res,User){
    User.findOneAndUpdate({ _id: req.body.user }, { $set: { MotDePasse: req.body.MotDePasse } }, function (err, user) {
        if (err) {
          console.log("Erreur d'update du mdp de l'user: " + req.body.user);
          req.flash('error', 'Erreur de réinitialisation veuillez nous contacter!')
          res.redirect('/')
          return
        }
    
        console.log('updated user password of: ' + user._id + ' value= ' + user.MotDePasse);
        req.flash('success', 'Mot de passe réinitialisé')
        res.redirect('/')
        return
      }) 
}