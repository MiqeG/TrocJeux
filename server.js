let express = require('express')
let app = express()
let mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session');
var formidable = require('formidable'),
  http = require('http'),
  util = require('util');
var csrf = require('csurf')
var mkdirp = require('mkdirp')
var rimraf = require("rimraf");
const fs2 = require('fs-extra');
let path = require('path')
var csrfProtection = csrf({ cookie: true })
var parseForm = express.urlencoded({ extended: true })
const passport = require('passport');
let IoOp = require('./securescripts/Io/copyformfiles.js')

mongoose.connect('mongodb://localhost:27017/NewTest', { useNewUrlParser: true })
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))

var UserSchema = mongoose.Schema({
  Type: { type: String, required: true },
  NomUitilisateur: { type: String, required: true },
  Nom: { type: String, required: true },
  Prenom: { type: String, required: true },
  Email: { type: String, required: true },
  MotDePasse: { type: String, required: true },
  Adresse: { type: String, required: true },
  CodePostal: { type: Number, required: true },
  Ville: { type: String, required: true },
  Pays: { type: String, required: true },
  DateInscription: { type: Date, default: Date.now, required: true },
  Actif: { type: Boolean, required: true }


}, { collection: 'Users' })
var AnnonceSchema = mongoose.Schema({
  Categories: { type: Array, required: true },
  User_Id: { type: String, required: true },
  NomUitilisateur: { type: String, required: true },
  CodePostal: { type: String, required: true },
  Email: { type: String, required: true },
  Ville: { type: String, required: true },
  DatePublication: { type: Date, default: Date.now, required: true },
  Texte: { type: String, required: true },
  Titre: { type: String, required: true },
  UserImages: { type: Array, required: true },
  Active: { type: Boolean, required: true }


}, { collection: 'Annonces' })
var User = mongoose.model('User', UserSchema, 'Users')
var Annonce = mongoose.model('Annonce', AnnonceSchema, 'Annonces')
db.once('open', function () { console.log("Connection to database NewTest Successful!") })

let session = require('express-session')
let SearchVille = require('./csvvilles/FRANCE/villes.json')
let configFile = require('./config/server_config.json')
app.set('view engine', 'ejs')
app.get('/favicon.ico', function (req, res) {

  res.redirect('/assets/favicon.ico')


})
app.use('/assets', express.static('public'))
app.use('/pregistered', express.static('UserImages'))

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [configFile.session.cookieKey]
}))
//initialiaze passport
mkdirp(configFile.serverConfigurationVariables.userImageFolder + '/temp', function (err) {
  if (err) throw err
  console.log('Temp folder ok!')
});
app.set('trust proxy', 1) // trust first proxy

app.use(passport.initialize());
app.use(passport.session());
app.use(require('./middlewares/flash'))


app.get('/searchoption', function (req, res) {
  if (req.query.searchoption) {

    req.session.searchoption = req.query.searchoption
    res.redirect(req.get('referer'))

  }
})
app.get('/success', isLoggedIn, function (req, res) {

  Annonce.find({ User_Id: req.session._id }, function (err, annonces) {
    if (err) throw err
  
    let searchoption = req.session.searchoption
    req.session.searchoption = undefined
    res.render('pages/espacemembre', { auth: req.isAuthenticated(), user: req.user, categories: configFile.categories, searchoption: searchoption, annonces: annonces })


  })
})
app.get('/deposer', isLoggedIn, csrfProtection, (req, res) => {
  if (req.isAuthenticated() == true) {
    let searchoption = req.session.searchoption
    req.session.searchoption = undefined
    res.render('pages/deposer', { csrfToken: req.csrfToken(), auth: req.isAuthenticated(), user: req.user, categories: configFile.categories, uploadAmount: configFile.serverConfigurationVariables.uploadAmount, searchoption: searchoption })

  }
  else {
    req.flash('error', 'Veuillez vous authentifiez avant de déposer un annonce!')
    res.redirect('/')
    return
  }
})
app.get('/error', (req, res) => {
  req.flash('error', 'Mot de pass ou email erroné', 'FailLogin')
  res.redirect('/');
});
app.get('/searchApi', (req, res) => {


  let strRegExPatternUpper = '(?i)' + req.query.q + '(?-i)'
  let searchWithoption
  
  switch (req.query.t) {
    case '1':
      searchWithoption = {
        $and: [{
          "$or": [
            { "Titre": { "$regex": strRegExPatternUpper } }
          ]
        }, { "Active": true }]
      }
      break;
    case '2':

      searchWithoption = {
        $and: [{
          "$or": [
            { Categories: { "$regex": strRegExPatternUpper } }
          ]
        }, { "Active": true }]
      }
      break
    case '3':
      searchWithoption = {
        $and: [{
          "$or": [
            { "CodePostal": req.query.q }, { "Ville": { "$regex": strRegExPatternUpper } }
          ]
        }, { "Active": true }]
      }
      break
    case '4':
      searchWithoption = {
        $and: [{
          "$or": [
            { "NomUitilisateur": req.query.q }
          ]
        }, { "Active": true }]
      }
      break
    default:
      break
  }

  Annonce.find(searchWithoption, function (err, docs) {
    if (err) throw err
    console.log(docs.length)
    if (docs.length != 0) {


      let results = []
      //for (let index = 0; index < docs.length; index++) {
      for (let index = 0; index < docs.length; index++) {
        let result = {
          titre: docs[index].Titre,
          imgsrc: '/pregistered/' + docs[index].User_Id + '/' + docs[index]._id + '/' + docs[index].UserImages[0],
          localisation: docs[index].Ville + ' ' + docs[index].CodePostal,
          description: docs[index].Categories,
          price: docs[index].Categories,
          categorie: docs[index].Categories,
          image: '/pregistered/' + docs[index].User_Id + '/' + docs[index]._id + '/' + docs[index].UserImages[0],
          url: '/?a='+ docs[index]._id

        }
        results.push(result)

      }

      let pathToResults = "/searchresults/?q=" + req.query.q + '&t=' + req.query.t
      let action = { url: pathToResults, text: docs.length + " resultats cliquez pour parcourir" }
      // console.log(results)

      let returnArray = { results: results, action }





      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(returnArray));


    }
  });



})


passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    cb(err, user);
  });
});
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      Email: username
    }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.MotDePasse != password) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

app.post('/connexion',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function (req, res) {
    console.log(req.user._id)

    req.session._id = req.user._id

    res.redirect('/success?username=' + req.user.NomUitilisateur);
  });
app.get('/logout', (req, res) => {
  res.cookie.maxAge = Date.now - 3
  req.session = null
  res.redirect('/')
})

app.get('/', csrfProtection, (req, res) => {
  if(req.query.a){
    Annonce.findOne({ _id:req.query.a }, function (err, annonce) {
      if (err) throw err
    
      let searchoption = req.session.searchoption
    req.session.searchoption = undefined
    res.render('pages/annonce', { csrfToken: req.csrfToken(), auth: req.isAuthenticated(), user: req.user, categories: configFile.categories, searchoption: searchoption,annonce:annonce })
  return
    })
  }else{
    let searchoption = req.session.searchoption
    req.session.searchoption = undefined
    res.render('pages/index', { csrfToken: req.csrfToken(), auth: req.isAuthenticated(), user: req.user, categories: configFile.categories, searchoption: searchoption })
  }
 

})

app.get('/inscription', csrfProtection, (req, res) => {
  if (req.isAuthenticated() == true) {
    res.redirect('/espacemembre')
    return
  }
  let searchoption = req.session.searchoption
  req.session.searchoption = undefined
  res.render('pages/inscription', { csrfToken: req.csrfToken(), auth: req.isAuthenticated(), user: req.user, categories: configFile.categories, searchoption: searchoption })

})

app.get('/ajaxCodePostal', csrfProtection, (req, res) => {
  let arrayFound = ''
  if (req.query.Pays == '-' || req.query.Pays == '') { req.query.CodePostal = ''; req.query.Ville = '' }
  if (req.query.options == 'CodePostal' && req.query.CodePostal != '') {

    arrayFound = SearchVille.Villes.filter(function (item) {

      return item.CodePostal == req.query.CodePostal;

    });
  }
  else if (req.query.options == 'Ville' && req.query.Ville != '') {

    arrayFound = SearchVille.Villes.filter(function (item) {

      return item.NomCommune == req.query.Ville.toUpperCase();

    });
  }

  if (arrayFound[0] === undefined || arrayFound == '') {

    let json = { Ville: "", Pays: req.query.Pays }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(json));
    return
  }
  console.log(req.query.Pays)
  let json = { Ville: arrayFound[0].NomCommune, Pays: req.query.Pays, CodePostal: arrayFound[0].CodePostal }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(json));


})
function isLoggedIn(req, res, next) {
 
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}
app.get('/espacemembre', isLoggedIn,
  function (req, res) {
    Annonce.find({ User_Id: req.session._id }, function (err, annonces) {
      if (err) throw err
      let searchoption = req.session.searchoption
      req.session.searchoption = undefined
      res.render('pages/espacemembre', { auth: req.isAuthenticated(), user: req.user, categories: configFile.categories, searchoption: searchoption, annonces: annonces })


    })


  });
app.post('/deposer', isLoggedIn, (req, res) => {
  if (req.body === undefined || req.body === '') {
    req.flash('error', 'formulaire vide', 'vide')
    res.redirect('/deposer')
    return
  }
  else {

    //get user images
    let form = new formidable.IncomingForm();
    form.maxFieldsSize = configFile.serverConfigurationVariables.maxFieldsSize * 1024 * 1024;
    form.maxFields = configFile.serverConfigurationVariables.maxFields;
    form.maxFileSize = configFile.serverConfigurationVariables.maxFile * 1024 * 1024;
    form.uploadDir = configFile.serverConfigurationVariables.userImageFolder;
    form.hash = 'md5';
    form.keepExtensions = true;
    form.uploadDir = configFile.serverConfigurationVariables.userImageFolder + ('/temp')
    form.parse(req, function (err, fields, files) {
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
        console.log(annonce1)
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
})
app.post('/Inscription', parseForm, csrfProtection, (req, res) => {
  if (req.body === undefined || req.body === '') {
    req.flash('error', 'formulaire vide', 'vide')
    res.redirect('/inscription')

  }
  else {

    User.findOne({ Email: req.body.Email }, 'Email', function (err, item) {
      if (err) return console.error(err)
      else if (item != null) {


        req.flash('error', 'Email deja soumis', 'eDejaSoumis')


        res.redirect('/inscription')

      }
      else {
        User.findOne({ NomUitilisateur: req.body.NomUitilisateur }, 'NomUtilisateur', function (err, item) {
          if (err) return console.error(err)
          else if (item != null) {


            req.flash('error', "Nom d'utilisateur deja soumis", "nUdejaSoumis")


            res.redirect('/inscription')

          }
          else {
            var arrayFound = SearchVille.Villes.filter(function (item) {
              return item.CodePostal == req.body.CodePostal;

            });

            if (arrayFound[0] === undefined) {

              req.flash('error', 'Ville introuvable', "villeIntrouvable")


              res.redirect('/inscription')
              return
            }

            var user1 = new User({
              Type: "User",
              NomUitilisateur: req.body.NomUitilisateur,
              Nom: req.body.Nom.toUpperCase().trim(),
              Prenom: req.body.Prenom.toUpperCase().trim(),
              Email: req.body.Email.toLowerCase().trim(),
              MotDePasse: req.body.MotDePasse.trim(),
              Adresse: req.body.Adresse.toUpperCase().trim(),
              CodePostal: req.body.CodePostal.trim(),
              Ville: arrayFound[0].NomCommune.toUpperCase().trim(),
              Pays: req.body.Pays,
              Actif: true
            });

            // save model to database
            user1.save(function (err, user) {
              if (err) return console.error(err)
              console.log(user.Email + "\r\n saved to Users collection.")
              req.flash('success', "Merci pour votre inscription", "SuccessCode")
              res.redirect('/')

            });
          }
        })


      }

    })

  }

}

)
app.post('/effacerannonce', isLoggedIn, (req, res) => {
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
    console.log('deleting ad from user' + req.body.User_Id)
    console.log('deleting ad from ad id' + req.body._id)
    console.log('Path: ' + "/UserImages/" + req.body.User_Id + '/' + req.body._id)
    rimraf('C:/git/trocjeux/UserImages/' + req.body.User_Id + '/' + req.body._id, function (err) {
      console.log('deleted ad: ' + req.body.User_Id)
      req.flash('success', 'Annonce : ' + req.body._id + ' supprimée...!')
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(json));
      return
    })
  });
})
app.get('*', function (req, res) {
  res.status(404)
  // respond with html page
  if (req.accepts('html')) {
    let searchoption;
    if (req.session.searchoption === undefined) {
      searchoption = '1'
    }
console.log(req.get('referer'))
    res.render('pages/404', {  auth: req.isAuthenticated(), user: req.user, categories: configFile.categories, searchoption: searchoption ,referrer : req.header('Referrer') })
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});
app.listen(configFile.serverConfigurationVariables.port)