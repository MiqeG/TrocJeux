let sendEmail = require('../securescripts/nodemailer/sendEmail')
let masterReplace = require('../middlewares/masterreplace')

module.exports = function (req, res, User, SearchVille, CryptoJS, configFile, tempUsers, callback) {
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
                        // Decrypt link
                        let formated = new Date
                        formated.setHours(formated.getHours() + 1)
                        formated = formated.toISOString()
                        let ciphertext = CryptoJS.AES.encrypt(req.body.Email.toString(), configFile.serverConfigurationVariables.serverKey).toString();
                        let ciphertextDate = CryptoJS.AES.encrypt(formated, configFile.serverConfigurationVariables.serverKey).toString();
                        console.log(ciphertext)
                        let array = ciphertext.split('')
                        let arrayDate = ciphertextDate.split('')
                        array = masterReplace(array)
                        arrayDate = masterReplace(arrayDate)
                        

                        let deplaced = array.join('');
                        let deplacedDate = arrayDate.join('')
                        console.log(deplaced);
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
                            Actif: true
                        });

                        // save model to database

                        if (tempUsers[user1.Email]) {
                            req.flash('error', "Vous vous etes deja inscrit...vérifiez vos e-mails et validez votre inscription...")
                            res.redirect('/')
                            return
                        }
                        tempUsers[user1.Email] = user1



                        let link = 'https://theroxxors.ml/inscriptionval?u=' + deplaced + '&d=' + deplacedDate

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


                        sendEmail(subject, output, user1.Email)
                        req.flash('success', "Merci pour votre inscription, un e-mail de confimation va vous etre envoyé dans quelques minutes...", "SuccessCode")
                        res.redirect('/')

                        console.log(link)
                        callback(tempUsers)
                        return
                    }
                })


            }

        })

    }

}