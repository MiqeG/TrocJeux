let jsonCreation =require('../middlewares/jsonCreation')

module.exports = function (req, res, User) {
  if (req.body && req.body.Email, req.body.Password) {
   
    User.findOne({ Email: req.body.Email }, function (err, user) {

      if (err) {

        jsonCreation(res,500, 'Erreur!')
        return
      }
      else if (user && (user.MotDePasse.trim() == req.body.Password.trim())) {
        jsonCreation(res,200, 'mot de passe verifié!')
        return
      }
      else if (user && (user.MotDePasse.trim() != req.body.Password.trim())) {
        jsonCreation(res,500, 'mauvais mot de passe!')
        return
      }
      else {
        jsonCreation(res,500, 'erreur...')
        return
      }
    })
  }
  else {
    jsonCreation(res,500, 'erreur!')
    return
  }
}