let moment=require('moment')
moment.locale('fr')
module.exports = function (req, res, configFile, Annonce) {
    console.log(req.query.categorie)
    let type='User'
    if(req.user){
        type=req.user.Type
    }
    let x='Toutes'
    if(req.query.categorie){
        x=req.query.categorie
    }
    if (req.query.a) {
      
        Annonce.findOne({ _id: req.query.a }, function (err, annonce) {
            if (err) {
                req.flash('error', 'Annonce introuvable...')
                res.redirect('/')
                return
            }
            if(annonce==null){
                res.redirect('/error')
                return
            }
            let date = moment(annonce.DatePublication, "YYYYMMDD").fromNow()
           
            let searchoption = req.session.searchoption
            req.session.searchoption = undefined
            res.render('pages/annonce', { csrfToken: req.csrfToken(), auth: req.isAuthenticated(), user: req.user, ServerUrl: configFile.ServerUrl, categories: configFile.categories, searchoption: searchoption, annonce: annonce ,selectedcat:x,date:date,type:type})
            return
        })
    } else {
        let searchoption = req.session.searchoption
        req.session.searchoption = undefined
        res.render('pages/index', { csrfToken: req.csrfToken(), auth: req.isAuthenticated(), ServerUrl: configFile.ServerUrl, user: req.user, categories: configFile.categories, searchoption: searchoption ,selectedcat:x})
    }


}