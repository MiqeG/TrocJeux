module.exports = function (req, res, Annonce, configFile, IoOp, formidable, path, mkdirp,fs,io) {

    let form = new formidable.IncomingForm();
    form.maxFieldsSize = configFile.serverConfigurationVariables.maxFieldsSize * 1024 * 1024;
    form.maxFields = configFile.serverConfigurationVariables.maxFields;

    form.maxFileSize = configFile.serverConfigurationVariables.maxFileSize * 1024 * 1024;
    form.uploadDir = configFile.serverConfigurationVariables.userImageFolder;
    form.hash = 'md5';
    form.keepExtensions = true;
    form.uploadDir = configFile.serverConfigurationVariables.userImageFolder + ('/temp')
   
    form.parse(req, function (err, fields, files) {
        if (err) {

            console.log('FORM PARSE ERROR')
            req.flash('error', "Erreur lors de la soumission...taille maximale d'un fichier limité a 1MB")
            res.redirect('/deposer')
            return
        }
        if (files.length > configFile.serverConfigurationVariables.uploadAmount)
            return
        let filearray = []

        for (let i = 0; i < form.openedFiles.length; i++) {
            let temp_path = form.openedFiles[i].path;
            /* The file name of the uploaded file */
            let file_name = form.openedFiles[i].name;
            /* Location where we want to copy the uploaded file */
            let x = path.basename(temp_path)
            let y = x.indexOf(".")
            if (y != -1) {
               
                filearray.push(path.basename(x))
                mkdirp(configFile.serverConfigurationVariables.userImageFolder + '/' + fields.upd_User_Id + '/' + fields.upd_id, function (err) {
                    if (err) throw err
                    let new_location = configFile.serverConfigurationVariables.userImageFolder + '/' + fields.upd_User_Id + '/';
                    //copy from temp to folder
                    IoOp.copyFiles(temp_path, new_location, file_name,fields.upd_id, function (err, callback) {
                      if (err) throw err
        
                    });
                  });
                
            }
            else if(y==-1){
                let path=temp_path
              
                fs.unlink(path,function(err){
                    if(err){

                    }
                    else{
                        console.log('done')
                    }
                })
            }


           
        }
        let splitArray=fields.actualImages.split(',')
      
        let finalfilearray = []
        if (filearray[0]) {
            finalfilearray = filearray
            for (let index = 0; index < splitArray.length; index++) {
                let path=configFile.serverConfigurationVariables.userImageFolder+'/'+ fields.upd_User_Id + '/'+fields.upd_id+'/'+splitArray[index]
                try {
                    fs.unlinkSync(path)
                   console.log('old file removed')
                  } catch(err) {
                    console.error(err)
                  }
            }
        }
        else {
          
            finalfilearray = splitArray
        }
        
        let date=new Date
        let categoryArray=fields.actualCategories.split(',')
        Annonce.findOneAndUpdate({ _id: fields.upd_id },
             { $set: { Titre: fields.updTitre,Texte:fields.updTexte,Categories:categoryArray,UserImages:finalfilearray,DatePublication:date } },{new: true},
              function (err, annonce) {
            if (err) {
                req.flash('error','Erreur de type inconnue!!')
                res.redirect('/espacemembre')
                return
            }
            else if (annonce == null) {
                req.flash('error','Erreur inconnue!!')
                res.redirect('/espacemembre')
                return
            }
            else if (annonce._id) {
                console.log('ad updated!')
                io.emit('adadd',{
                    ad:annonce
                })
                req.flash('success','annonce actualisée')
                res.redirect('/espacemembre')
                return
            }
        })

    })
    return
    
}