module.exports = function (req, res, User, Annonce) {
  User.findOneAndUpdate({ Email: req.body.Email }, { $set: { MotDePasse: req.body.MotDePasse, Adresse: req.body.Adresse, Pays: req.body.Pays, Ville: req.body.Ville, CodePostal: req.body.CodePostal } }, function (err, data) {
    if (err) {
      req.flash('error', "Erreur! Les informations n'ont pas pu être modifées! Veuillez contacter le webmaster...")
      res.redirect('/espacemembre')
      return
    }
    console.log('user updated')
    Annonce.updateMany({ Email: req.body.Email }, { $set: { Ville: req.body.Ville, CodePostal: req.body.CodePostal } }, function (err, data) {
      if (err) {
        req.flash('error', "Erreur! Les informations des annonces n'ont pas pu être modifées! Veuillez contacter le webmaster...")
        res.redirect('/espacemembre')
        return
      }

      console.log('user ads updated')

      req.flash('success', 'Informations modifées avec succès!')
      res.redirect('/espacemembre')

    })

  })
}