let masterReplace = require('../middlewares/masterreplace')
module.exports = function (req, res, User, CryptoJS, configFile, tempUsers, callback) {


  if (req.query.u && req.query.d) {
    try {
      var dereplaced = req.query.u
      let dereplacedDate = req.query.d
      let array2 = dereplaced.split('')
      let arrayDate = dereplacedDate.split('')

      array2 = masterReplace.Inverted(array2)
      arrayDate = masterReplace.Inverted(arrayDate)

      let rereplaced = array2.join('')
      let rereplacedDate = arrayDate.join('')



      var bytes = CryptoJS.AES.decrypt(rereplaced, configFile.serverConfigurationVariables.serverKey)

      var bytesDate = CryptoJS.AES.decrypt(rereplacedDate, configFile.serverConfigurationVariables.serverKey)

      var plaintext = bytes.toString(CryptoJS.enc.Utf8);
      var plaintextDate = bytesDate.toString(CryptoJS.enc.Utf8);
      let linkDate = new Date(plaintextDate)

      let DateNow = new Date()

   
      
      if (isNaN(linkDate.getTime())) {
        req.flash('error', 'Une erreur est survenue lien invalide!')
        res.redirect('/')
        callback(tempUsers)
        return
      }

      if (DateNow.getTime() > linkDate.getTime()) {
        req.flash('error', 'Le lien a expiré vuillez réiterer votre demande')
        res.redirect('/')
        callback(tempUsers)
        return
      }
      if (tempUsers[plaintext.toLowerCase()]) {
        tempUsers[plaintext.toLowerCase()].save(function (err, user) {
          if (err) return
          delete tempUsers[plaintext.toLowerCase()]
          console.log('User: ' + user.NomUitilisateur + ' Activated')
          req.flash('success', 'Inscription validée! Connectez vous pour commencer a troquer...')
          res.redirect('/')
          callback(tempUsers)
          return
        })
      }
      else {
        req.flash('error', 'Une erreur est survenue! Votre compte est peut-être déja actif')
        res.redirect('/')
        callback(tempUsers)
        return
      }


    }
    catch (error) {
      console.log(error)
      console.log('bad link or crypto problem')
      req.flash('error', 'Une erreur est survenue!')
      res.redirect('/')
      callback(tempUsers)
      return
    }

  }

}