module.exports = function (req, res, next, searchoption, configFile) {
    console.log(req.url)
    if (res.status(404)) {

        res.status(404).render('pages/error', { auth: req.isAuthenticated(), user: req.user, ServerUrl: configFile.ServerUrl, categories: configFile.categories, searchoption: searchoption, referrer: '404 Url : ' + req.url + ' not found' })

    }
    else if (req.status(500)) {
        res.status(500).render('pages/error', { auth: req.isAuthenticated(), user: req.user, ServerUrl: configFile.ServerUrl, categories: configFile.categories, searchoption: searchoption, referrer: 'Internal server error' })
    }
}