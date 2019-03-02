let sendEmail = require('../securescripts/nodemailer/sendEmail')
let masterReplace = require('../middlewares/masterreplace')

module.exports = function (req, res, User, configFile, CryptoJS) {
  User.findOne({ Email: req.body.userEmail }, function (err, user) {

    if (err) return
    else {
      if (user && user._id) {

        let formated = new Date
        formated.setHours(formated.getHours() + 1)
        formated = formated.toISOString()
        let ciphertext = CryptoJS.AES.encrypt(user._id.toString(), configFile.serverConfigurationVariables.serverKey).toString();
        let ciphertextDate = CryptoJS.AES.encrypt(formated, configFile.serverConfigurationVariables.serverKey).toString();
        console.log(ciphertext)
        let array = ciphertext.split('')
        let arrayDate = ciphertextDate.split('')
        array = masterReplace(array)
        arrayDate = masterReplace(arrayDate)
        // Decrypt

        let deplaced = array.join('');
        let deplacedDate = arrayDate.join('')
        console.log(deplaced);


        let link = 'https://theroxxors.ml/secureinitilisation?s=' + deplaced + '&d=' + deplacedDate
        const output = `
            <p>Vous avez demandé une réinitialisation de votre mot de passe</p>
            <h3></h3>
            <ul>  
            <li>
            <a href="${link}">Cliquez sur ce lien pour procéder a la réinitialisation</a>
            </li>
            </ul>
           `;
        let subject = "Réinitialisation mot de passe"
        sendEmail(subject, output, user.Email)
      }

    }
  })

  req.flash('success', 'un email de réinitialisation va vous être envoyé dans quelques minutes...')
  res.redirect('/')
}