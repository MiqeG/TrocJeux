let masterReplace = require('../middlewares/masterreplace')
module.exports=function(req,res,userId,userEmail,UserDate,tempEmailUpd,CryptoJS,configFile,User,Annonce,callback){
    try {
        var dereplaced = userId
        var dereplaced2=userEmail
        let dereplacedDate = UserDate
        let array2 = dereplaced.split('')
        let array3 = dereplaced2.split('')
        let arrayDate = dereplacedDate.split('')
    
        array2 = masterReplace.Inverted(array2)
        array3 = masterReplace.Inverted(array3)
        arrayDate = masterReplace.Inverted(arrayDate)
    
        let rereplaced = array2.join('')
        let rereplaced2 = array3.join('')
        let rereplacedDate = arrayDate.join('')
    
    
    
        var bytes = CryptoJS.AES.decrypt(rereplaced, configFile.serverConfigurationVariables.serverKey)
        var bytes2 = CryptoJS.AES.decrypt(rereplaced2, configFile.serverConfigurationVariables.serverKey)
        var bytesDate = CryptoJS.AES.decrypt(rereplacedDate, configFile.serverConfigurationVariables.serverKey)
    
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        var plaintext2 = bytes2.toString(CryptoJS.enc.Utf8);
        var plaintextDate = bytesDate.toString(CryptoJS.enc.Utf8);
        let linkDate = new Date(plaintextDate)
    
        let DateNow = new Date()
    
      
        if (isNaN(linkDate.getTime())) {
          req.flash('error', 'Une erreur est survenue: Lien invalide!')
          res.redirect('/')
          callback(tempEmailUpd)
          return
        }
    
        if (DateNow.getTime() > linkDate.getTime()) {
          req.flash('error', 'Le lien a expiré vuillez réiterer votre demande')
          res.redirect('/')
          callback(tempEmailUpd)
          return
        }
       
        if (tempEmailUpd[plaintext]&&tempEmailUpd[plaintext].emailupd) {
            User.findOne({Email:tempEmailUpd[plaintext].emailupd},function(err,user){
                if(err){
                    req.flash('error','Erreur serveur inconnue...veuillez réitérer votre demande')
                    res.redirect('/')
                    delete tempEmailUpd[plaintext]
                    callback(tempEmailUpd)
                    return
                }
                else if(user==null){
                    Annonce.updateMany({ User_Id: plaintext }, { $set: { Email: tempEmailUpd[plaintext].emailupd} }, function (err, data) {
                        if(err){
                            req.flash('error',"Erreur serveur d'origine inconnue code 1,vous avez peut être clôturé votre compte...")
                            res.redirect('/')
                            delete tempEmailUpd[plaintext]
                            callback(tempEmailUpd)
                            return
                        }
                        User.findOneAndUpdate({_id:plaintext}, { $set: { Email: tempEmailUpd[plaintext].emailupd} },function(err,data){
                            if(err){
                                req.flash('error',"Erreur serveur d'origine inconnue code 2,vous avez peut être clôturé votre compte...")
                                res.redirect('/')
                                delete tempEmailUpd[plaintext]
                                callback(tempEmailUpd)
                                return
                            }
                          
                            req.flash('success','Votre nouvel e-mail est: '+plaintext2)
                            res.redirect('/')
                            delete tempEmailUpd[plaintext]
                            callback(tempEmailUpd)
                            return
                        })
                    })
                  
                }
                else if(user!=null){
                  
                    req.flash('error','Erreur serveur email déja présent dans la base de données...veuillez réitérer votre demande')
                    res.redirect('/')
                    delete tempEmailUpd[plaintext]
                    callback(tempEmailUpd)
                    return
                }
            })
      
        }
        else {
          req.flash('error', 'Une erreur serveur est survenue! Votre email est peut être déja vérifié...')
          res.redirect('/')
          callback(tempEmailUpd)
          return
        }
    } catch (error) {
       
        req.flash('error','Erreur interne serveur! Veuillez contacter un Webmaster...')
        res.redirect('/')
        callback(tempEmailUpd)
        return
    }
  

}