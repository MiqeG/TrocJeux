module.exports = function (req, res, User) {
  if (req.body && req.body.Email, req.body.Password) {
    function jsonCreation(httpcode, message) {
      let json = { message: message }
      res.writeHead(httpcode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(json));
    }
    User.findOne({ Email: req.body.Email }, function (err, user) {

      if (err) {

        jsonCreation(500, 'Erreur!')
        return
      }
      else if (user && (user.MotDePasse.trim() == req.body.Password.trim())) {
        jsonCreation(200, 'mot de passe verifié!')
        return
      }
      else if (user && (user.MotDePasse.trim() != req.body.Password.trim())) {
        jsonCreation(500, 'mauvais mot de passe!')
        return
      }
      else {
        jsonCreation(500, 'erreur...')
        return
      }
    })
  }
  else {
    jsonCreation(500, 'erreur!')
    return
  }
}