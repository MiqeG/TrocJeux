
module.exports = function (req, res, User, Annonce, configFile, rimraf,io) {

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
             Annonce.deleteMany({User_Id:req.user._id},function(err,rapport){
                 if(err){
                    req.flash('error', 'Une erreur est survenue!')
                    let json = { Response: "Une erreur est survenue" }
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(json));
                    return
                 }

                 let dateReference = new Date
                 dateReference -= (1 * 60 * 60 * 1000);
                 Annonce.find({DatePublication:{"$gt": dateReference}},function(err,annonces){
                    if(err){
                     
                      io.emit('error',{
                        error:"database research error",
                      })
                    }
                    else if(annonces==null){
                      
                      io.emit('empty',{
                        message:'aucune annonce a valider'
                      })
              
                    }
                    else if (annonces){
                      
                      io.emit('adsrefresh',{
                        ads:annonces
                      })
                    }
                })
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