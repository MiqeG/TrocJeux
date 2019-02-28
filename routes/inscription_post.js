let sendEmail = require('../securescripts/nodemailer/sendEmail')
let masterReplace=require('../middlewares/masterreplace')

module.exports = function (req, res, User, SearchVille,CryptoJS,configFile) {
    if (req.body === undefined || req.body === '') {
        req.flash('error', 'formulaire vide', 'vide')
        res.redirect('/inscription')

    }
    else {

        User.findOne({ Email: req.body.Email }, 'Email', function (err, item) {
            if (err) return console.error(err)
            else if (item != null) {


                req.flash('error', 'Email deja soumis', 'eDejaSoumis')


                res.redirect('/inscription')

            }
            else {
                User.findOne({ NomUitilisateur: req.body.NomUitilisateur }, 'NomUtilisateur', function (err, item) {
                    if (err) return console.error(err)
                    else if (item != null) {


                        req.flash('error', "Nom d'utilisateur deja soumis", "nUdejaSoumis")


                        res.redirect('/inscription')

                    }
                    else {
                        var arrayFound = SearchVille.Villes.filter(function (item) {
                            return item.CodePostal == req.body.CodePostal;

                        });

                        if (arrayFound[0] === undefined) {

                            req.flash('error', 'Ville introuvable', "villeIntrouvable")


                            res.redirect('/inscription')
                            return
                        }

                        var user1 = new User({
                            Type: "User",
                            NomUitilisateur: req.body.NomUitilisateur,
                            Nom: req.body.Nom.toUpperCase().trim(),
                            Prenom: req.body.Prenom.toUpperCase().trim(),
                            Email: req.body.Email.toLowerCase().trim(),
                            MotDePasse: req.body.MotDePasse.trim(),
                            Adresse: req.body.Adresse.toUpperCase().trim(),
                            CodePostal: req.body.CodePostal.trim(),
                            Ville: arrayFound[0].NomCommune.toUpperCase().trim(),
                            Pays: req.body.Pays,
                            Actif: false
                        });

                        // save model to database
                        user1.save(function (err, user) {
                            if (err) return console.error(err)
                            console.log(user.Email + "\r\n saved to Users collection.")
                                //secure activation link
                                let formated = new Date
                                formated.setHours(formated.getHours()+1)
                                formated=formated.toISOString()
                                let ciphertext = CryptoJS.AES.encrypt(user1._id.toString(), configFile.serverConfigurationVariables.serverKey).toString();
                                let ciphertextDate = CryptoJS.AES.encrypt(formated, configFile.serverConfigurationVariables.serverKey).toString();
                                console.log(ciphertext)
                                let array = ciphertext.split('')
                                let arrayDate=ciphertextDate.split('')
                                array=masterReplace(array)
                                arrayDate=masterReplace(arrayDate)
                                // Decrypt
                        
                                let deplaced = array.join('');
                                let deplacedDate=arrayDate.join('')
                                //send confirmation e-mail
                           
                            let link = 'https://theroxxors.ml/inscriptionval?u=' + deplaced +'&d='+deplacedDate
                            console.log(link)
                            const output = `
                            
                            <h3>Bienvenue parmi nous!</h3>
                            <p>Cliquez sur le lien ci-dessous pour valider votre inscription...</p>
                            <ul>  
                            <li>
                            <a href="${link}">Valider</a>
                            </li>
                            </ul>
                           `;
                            let subject = "Bienvenue sur Troc'Jeux!!!"


                            sendEmail(subject, output, user.Email)
                            req.flash('success', "Merci pour votre inscription, un e-mail de confimation va vous etre envoyé dans quelques minutes...", "SuccessCode")
                            res.redirect('/')

                        });
                    }
                })


            }

        })

    }

}