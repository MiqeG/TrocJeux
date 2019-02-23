module.exports = function (req, res, configFile) {

    if (req.isAuthenticated() == true) {
        res.redirect('/espacemembre')
        return
    }
    let searchoption = req.session.searchoption
    req.session.searchoption = undefined
    res.render('pages/inscription', {
        csrfToken: req.csrfToken(), auth: req.isAuthenticated(), user: req.user, ServerUrl: configFile.ServerUrl, categories: configFile.categories, searchoption: searchoption
    })

}