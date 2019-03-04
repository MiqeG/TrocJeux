module.exports = function (req, res, Annonce, rimraf, configFile) {
    let json = {}
    console.log(req.body._id)
    
    Annonce.findOneAndDelete({ _id: req.body._id }, function (err,annonce) {
        if (err) {

            console.log(err)

            req.flash('error', "Erreur lors de la suppression de l'annonce: " + req.body._id +"code: erreur inconnue")
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(json));

            return
        }
        else if(annonce==null){
            req.flash('error', "Erreur lors de la suppression de l'annonce: " + req.body._id+" code= Annonce introuvable...vous l'avez peut être déja supprimmée ")
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(json));

            return
        }
        else {
            console.log(annonce)
            json = { annonceId: req.body._id }
        }


        console.log('Path: ' + configFile.serverConfigurationVariables.installationPath + '/UserImages/' + req.body.User_Id + '/' + req.body._id)

        rimraf(configFile.serverConfigurationVariables.installationPath + '/UserImages/' + req.body.User_Id + '/' + req.body._id, function (err) {
            if (err) {
                req.flash('error', "une erreur est survenue lors de l'effacement! Contactez un webmaster...")
                res.redirect('/espacemembre')
            }
            console.log('deleted ad: ' + req.body.User_Id)
            req.flash('success', 'Annonce : ' + req.body._id + ' supprimée...!')
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(json));
            return
        })
    });
}