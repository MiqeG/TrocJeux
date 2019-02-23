module.exports = function (req, res, configFile) {
    if (req.isAuthenticated() == true) {
        let searchoption = req.session.searchoption
        req.session.searchoption = undefined
        res.render('pages/deposer', { csrfToken: req.csrfToken(), auth: req.isAuthenticated(), user: req.user, ServerUrl: configFile.ServerUrl, categories: configFile.categories, uploadAmount: configFile.serverConfigurationVariables.uploadAmount, searchoption: searchoption })

    }
    else {
        req.flash('error', 'Veuillez vous authentifier avant de déposer un annonce!')
        res.redirect('/')
        return
    }
}