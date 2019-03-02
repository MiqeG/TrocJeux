module.exports = function (req, res, configFile, Annonce) {
    if (req.query.a) {
        Annonce.findOne({ _id: req.query.a }, function (err, annonce) {
            if (err) {
                req.flash('error', 'Annonce introuvable...')
                res.redirect('/')
                return
            }

            let searchoption = req.session.searchoption
            req.session.searchoption = undefined
            res.render('pages/annonce', { csrfToken: req.csrfToken(), auth: req.isAuthenticated(), user: req.user, ServerUrl: configFile.ServerUrl, categories: configFile.categories, searchoption: searchoption, annonce: annonce })
            return
        })
    } else {
        let searchoption = req.session.searchoption
        req.session.searchoption = undefined
        res.render('pages/index', { csrfToken: req.csrfToken(), auth: req.isAuthenticated(), ServerUrl: configFile.ServerUrl, user: req.user, categories: configFile.categories, searchoption: searchoption })
    }


}