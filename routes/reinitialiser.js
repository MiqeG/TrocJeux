let sendEmail = require('../securescripts/nodemailer/sendEmail')

module.exports=function(req,res,User,configFile,CryptoJS){
    User.findOne({ Email: req.body.userEmail }, function (err, user) {
   
        if (err) return
        else {
          if (user && user._id) {
    
    
            let ciphertext = CryptoJS.AES.encrypt(user._id.toString(), configFile.serverConfigurationVariables.serverKey).toString();
            console.log(ciphertext)
            let array = ciphertext.split('')
            for (let i = 0; i < array.length; i++) {
              if (array[i] == '+') { array[i] = '⺈' }
              else if (array[i] == '/') { array[i] = '⺋' }
              else if (array[i] == '=') { array[i] = '⺜' }
    
            }
    
            // Decrypt
    
            let deplaced = array.join('');
            console.log(deplaced);
        
            let formated = new Date
            formated=formated.toISOString()
            let link = 'https://theroxxors.ml/secureinitilisation?s=' + deplaced +'&d='+formated
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
            sendEmail(subject,output,user.Email)
          }
    
        }
      })
    
      req.flash('success', 'un email de réinitialisation va vous être envoyé dans quelques minutes...')
      res.redirect('/')
}