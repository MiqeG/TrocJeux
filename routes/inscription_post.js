module.exports = function (req, res, User, SearchVille) {
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
                            Actif: true
                        });

                        // save model to database
                        user1.save(function (err, user) {
                            if (err) return console.error(err)
                            console.log(user.Email + "\r\n saved to Users collection.")
                            req.flash('success', "Merci pour votre inscription", "SuccessCode")
                            res.redirect('/')

                        });
                    }
                })


            }

        })

    }

}