module.exports = function (req, res, Annonce, rimraf,configFile) {
    let json = {}
    console.log(req.body._id)
    Annonce.findOneAndDelete({ _id: req.body._id }, function (err) {
        if (err) {

            console.log(err)

            req.flash('error', "Erreur lors de la suppression de l'annonce: " + req.body._id)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(json));

            return
        }
        else {
            json = { annonceId: req.body._id }
        }
       
       
        console.log('Path: '+configFile.serverConfigurationVariables.installationPath + '/UserImages/' + req.body.User_Id + '/' + req.body._id)

        rimraf(configFile.serverConfigurationVariables.installationPath + '/UserImages/' + req.body.User_Id + '/' + req.body._id, function (err) {
            if(err){
                req.flash('error',"une erreur est survenue lors de l'effacement! Contactez un webmaster...")
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