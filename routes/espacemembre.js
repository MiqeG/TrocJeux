module.exports = function (req, res, Annonce, configFile, User, searchoption, csrfProtection) {
    Annonce.find({ User_Id: req.session._id }, function (err, annonces) {
        if (err) throw err
        let searchoption = req.session.searchoption
        req.session.searchoption = undefined
        User.findOne({ _id: req.session._id }, function (err, user) {
            if (err) throw err
            let userJson = {
                NomUitilisateur: user.NomUitilisateur,
                Nom: user.Nom,
                Prenom: user.Prenom,
                Email: user.Email,
                MotDePasse: user.MotDePasse,
                VerificationMotDePasse: user.MotDePasse,
                Adresse: user.Adresse,
                Pays: user.Pays,
                Ville: user.Ville,
                CodePostal: user.CodePostal
            }
            if(res.locals.flash===undefined){
                res.locals.flash=''
            }
           res.locals.flash.code=''


            res.locals.formdata = userJson
         
            res.render('pages/espacemembre', {
                csrfToken: req.csrfToken(), auth: req.isAuthenticated(), user: req.user, ServerUrl: configFile.ServerUrl, categories: configFile.categories, searchoption: searchoption, annonces: annonces
            })
        })



    })

}