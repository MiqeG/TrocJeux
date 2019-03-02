let masterReplace = require('../middlewares/masterreplace')
const CryptoJS = require("crypto-js");
let configFile = require('../config/server_config.json')

module.exports = function (req, res, User, tempReinit, configFile, callback) {


  var dereplaced = req.query.s
  let dereplacedDate = req.query.d
  let array2 = dereplaced.split('')
  let arrayDate = dereplacedDate.split('')

  array2 = masterReplace.Inverted(array2)
  arrayDate = masterReplace.Inverted(arrayDate)

  let rereplaced = array2.join('');
  let rereplacedDate = arrayDate.join('')

  try {

    var bytes = CryptoJS.AES.decrypt(rereplaced, configFile.serverConfigurationVariables.serverKey);

    var bytesDate = CryptoJS.AES.decrypt(rereplacedDate, configFile.serverConfigurationVariables.serverKey);

    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    var plaintextDate = bytesDate.toString(CryptoJS.enc.Utf8);
    let linkDate = new Date(plaintextDate)

    let DateNow = new Date()


    console.log(DateNow.getTime())
    console.log(linkDate.getTime())

    if (isNaN(linkDate.getTime())) {
      req.flash('error', 'lien non valide!')
      res.redirect('/')
      callback(tempReinit)
      return
    }
    if (DateNow.getTime() > linkDate.getTime()) {
      if (tempReinit[plaintext + plaintextDate]) {
        delete tempReinit[plaintext + plaintextDate]
      }
      req.flash('error', 'Le lien a expiré vuillez réiterer votre demande')
      res.redirect('/')
      callback(tempReinit)
      return
    }
    if (tempReinit[plaintext + plaintextDate]) {
      req.flash('error', 'Vous avez deja reinitialisé votre mot de passe avec ce lien! Verifiez vos emails et réiterez votre demande...')
      callback(tempReinit)
      res.redirect('/')
      return
    }
    tempReinit[plaintext + plaintextDate] = { "clicked": true }
    User.findOne({ _id: plaintext }, function (err, user) {
      if (err) {
        req.flash('error', 'Une erreur est survenue!')
        res.redirect('/')
        callback(tempReinit)
        return
      }
      else if (user) {

        res.render('pages/secureform', { csrfToken: req.csrfToken(), auth: req.isAuthenticated(), user: user._id, userName: user.NomUitilisateur, ServerUrl: configFile.ServerUrl, categories: configFile.categories, searchoption: '1' })

        callback(tempReinit)
        return
      }
      else {
        req.flash('error', 'Erreur...')
        res.redirect('/')
        callback(tempReinit)
      }

    })
  } catch (error) {
    console.log(error)
    console.log('bad link or crypto problem')
    req.flash('error', 'Une erreur est survenue!')
    res.redirect('/')
    callback(tempReinit)
  }

}