module.exports = function (req, res, User, Annonce, configFile, IoOp, formidable, path, mkdirp) {
  if (req.body === undefined || req.body === '') {
    req.flash('error', 'formulaire vide', 'vide')
    res.redirect('/deposer')
    return
  }
  else {

    //get user images
    let form = new formidable.IncomingForm();
    form.maxFieldsSize = configFile.serverConfigurationVariables.maxFieldsSize* 1024 * 1024;
    form.maxFields = configFile.serverConfigurationVariables.maxFields;

    form.maxFileSize = configFile.serverConfigurationVariables.maxFileSize* 1024 * 1024;
    form.uploadDir = configFile.serverConfigurationVariables.userImageFolder;
    form.hash = 'md5';
    form.keepExtensions = true;
    form.uploadDir = configFile.serverConfigurationVariables.userImageFolder + ('/temp')
    form.parse(req, function (err, fields, files) {
      if(err){
       
        console.log('FORM PARSE ERROR')
        req.flash('error',"Erreur lors de la soumission...taille maximale d'un fichier limité a 1MB")
        res.redirect('/deposer')
        return
      }
      if (files.length > configFile.serverConfigurationVariables.uploadAmount)
        return
        
      User.findOne({ Email: fields.Email.trim() }, function (err, item) {

        var array = fields.Categories.split(',')


        if (err) throw err

        var annonce1 = new Annonce({

          User_Id: item._id,
          NomUitilisateur: item.NomUitilisateur,
          Email: item.Email,
          UserImages: [],
          Ville: item.Ville,
          CodePostal: item.CodePostal,
          Categories: array,
          Titre: fields.Titre,
          Texte: fields.Texte,

          Active: true



        })

        let filearray = []

        for (let i = 0; i < form.openedFiles.length; i++) {
          let temp_path = form.openedFiles[i].path;
          /* The file name of the uploaded file */
          let file_name = form.openedFiles[i].name;
          /* Location where we want to copy the uploaded file */
          filearray.push(path.basename(temp_path))
          mkdirp(configFile.serverConfigurationVariables.userImageFolder + '/' + item._id + '/' + annonce1._id, function (err) {
            if (err) throw err
            let new_location = configFile.serverConfigurationVariables.userImageFolder + '/' + item._id + '/';
            //copy from temp to folder
            IoOp.copyFiles(temp_path, new_location, file_name, annonce1._id, function (err, callback) {
              if (err) throw err

            });
          });
        }
        annonce1.UserImages = filearray

        annonce1.save(function (err, annonce) {
          if (err) return console.error(err)
          console.log(annonce.NomUitilisateur + "\r\n saved to Annonces collection.")


        });
      })
    });
    //on end of transfer
    form.on('end', function (fields, files) {



      req.flash('success', "Merci pour votre confiance!", "SuccessCode")


      res.redirect('/');



    });
  }
}