let sendEmail = require('../securescripts/nodemailer/sendEmail')
let masterReplace = require('../middlewares/masterreplace')
let jsonCreation = require('../middlewares/jsonCreation')
module.exports = function (req, res, CryptoJS, tempEmailUpd, configFile,User, callback) {
    if (req.body && req.body.Email && req.body.ajaxEmail) {
        if (req.user.Email != req.body.Email) {
            callback(tempEmailUpd)
            jsonCreation(res, 500, "Erreur!!Problème d'authentification")
            return
        }
        if (req.user.Email == req.body.ajaxEmail.toLowerCase().trim()) {
            callback(tempEmailUpd)
            jsonCreation(res, 500, "Erreur!! le nouvel e-mail est le même que l'ancien...")
            return
        }

        else {

            try {
                User.findOne({Email:req.body.ajaxEmail},function(err,user){
                    if(err){
                        jsonCreation(res, 500, 'Erreur Interne Serveur...')
                        callback(tempEmailUpd)
                        return
                    }
                    else if(user==null){
                         // Encrypt link
                let formated = new Date
                let dateofnow= new Date
                 formated.setHours(formated.getHours() + 1)
                 formated = formated.toISOString()
                 let ciphertext = CryptoJS.AES.encrypt(req.body.ajaxEmail.toString().toLowerCase().trim(), configFile.serverConfigurationVariables.serverKey).toString();
                 let ciphertext2 = CryptoJS.AES.encrypt(req.user._id.toString(), configFile.serverConfigurationVariables.serverKey).toString();
                 let ciphertextDate = CryptoJS.AES.encrypt(formated, configFile.serverConfigurationVariables.serverKey).toString();
                
                 let array = ciphertext.split('')
                 let array2 = ciphertext2.split('')
                 let arrayDate = ciphertextDate.split('')
                 array = masterReplace(array)
                 array2 = masterReplace(array2)
                 arrayDate = masterReplace(arrayDate)
 
 
                 let deplaced = array.join('')
                 let deplaced2 = array2.join('')
                 let deplacedDate = arrayDate.join('')
                
 
 
 
                 // save model to RAM (tempUsers)
              
                 if (tempEmailUpd[req.user._id]) {
                    
                     let ramdate = new Date(tempEmailUpd[req.user._id].date)
                     if(ramdate>dateofnow){
                         console.log(ramdate-dateofnow)
                         let remaining=ramdate-dateofnow
                         remaining=parseInt(remaining/1000/60)
                         jsonCreation(res, 500, "Erreur!! Vous avez deja changé votre e-mail...veuillez vérifier votre boîte aux lettres...le lien est actif pendant 1h restant: " +remaining.toString()+' min')
                         callback(tempEmailUpd)
                         return
                     }
                     
                 }
                 tempEmailUpd[req.user._id] = { emailupd: req.body.ajaxEmail,date:formated }
 
                 //compose and send email with link
                 let link = 'https://theroxxors.ml/emailupdval?u=' + deplaced2 + '&e=' + deplaced + '&d=' + deplacedDate
                 console.log(link)
                 const output = `
                                
                                <h3>Chngemant d'adresse Email</h3>
                                <p>Cliquez sur le lien ci-dessous pour valider votre nouvelle adresse...</p>
                                <ul>  
                                <li>
                                <a href="${link}">Valider</a>
                                </li>
                                </ul>
                               `;
                 let subject = "Changement d'adresse Email"
 

                 sendEmail(subject, output, req.body.ajaxEmail)
                 jsonCreation(res, 200, 'E-mail de verification envoyé à: ' + req.body.ajaxEmail)
               
                 callback(tempEmailUpd)
                 return
                    }
                    else if(user.Email){
                        jsonCreation(res, 500, 'Erreur! cet e-mail est déja présent dans notre base de données. Veuillez en choisir un autre...')
                        callback(tempEmailUpd)
                        return
                    }
                    else{
                        jsonCreation(res, 500, 'Erreur Interne Serveur...')
                        callback(tempEmailUpd)
                        return
                    }
                })
                
              
            } catch (error) {
                console.log(error)
                jsonCreation(res, 500, 'Internal Server Error')
                callback(tempEmailUpd)
                return
            }

        }
    }
    else {
       
        jsonCreation(res, 500, 'Erreur!! Abscence de données...')
        callback(tempEmailUpd)
        return
    }

}