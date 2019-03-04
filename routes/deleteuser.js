
module.exports = function (req, res, User, Annonce, configFile, rimraf) {

    let path = configFile.serverConfigurationVariables.userImageFolder + '/' + req.user._id
    rimraf(path, function (err) {
        if (err) {
            req.flash('error', 'Une erreur est survenue!')
            let json = { Response: "Une erreur est survenue" }
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(json));
        }
        
        User.findByIdAndRemove(req.user._id,function(err,user){
            if (err) {
                req.flash('error', 'Une erreur est survenue!')
                let json = { Response: "Une erreur est survenue" }
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(json));
                return
            }
             Annonce.deleteMany({User_Id:req.user._id},function(err,annonces){
                 if(err){
                    req.flash('error', 'Une erreur est survenue!')
                    let json = { Response: "Une erreur est survenue" }
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(json));
                    return
                 }
                req.flash('success', 'Nous espérons vous revoir bientôt!') 
                console.log("done deleting");
                let json = { Response: "Deleted" }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(json));
                return
             })
        })
     
    });

}