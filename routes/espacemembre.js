module.exports = function (req, res, Annonce, configFile, searchoption,csrfProtection) {
    Annonce.find({ User_Id: req.session._id }, function (err, annonces) {
        if (err) throw err
        let searchoption = req.session.searchoption
        req.session.searchoption = undefined
       
        res.render('pages/espacemembre', { 
          csrfToken: req.csrfToken(),auth: req.isAuthenticated(), user: req.user, ServerUrl: configFile.ServerUrl, categories: configFile.categories, searchoption: searchoption, annonces: annonces })


    })

}