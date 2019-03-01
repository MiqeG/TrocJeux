
/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
           TROC'JEUX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

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
let session = require('express-session')
const CryptoJS = require("crypto-js");
//Configuration file

let configFile = require('./config/server_config.json')


//http server to send to https in case someone requests http instead of https

const clearserver = http.createServer(function (req, res) {

  res.writeHead(302, {
    'Location': configFile.ServerUrl + req.url
  });
  res.end();
}).listen(configFile.serverConfigurationVariables.clearport)

//certificates

const privateKey = fs2.readFileSync(configFile.serverConfigurationVariables.keyPath, 'utf8');
const certificate = fs2.readFileSync(configFile.serverConfigurationVariables.certPath, 'utf8');
const credentials = { key: privateKey, cert: certificate };
const server = require('https').createServer(credentials, app);
//json file of french cities

let SearchVille = require('./csvvilles/FRANCE/villes.json')

// I/o operations

let IoOp = require('./securescripts/Io/copyformfiles.js')

///////////////////////////////////////
//Routes required files
///////////////////////////////////////

let index = require('./routes/index')
let inscription = require('./routes/inscription')
let deposer = require('./routes/deposer_post')
let deposerGet = require('./routes/deposer')
let espacemembre = require('./routes/espacemembre')
let ajaxCodePostal = require('./routes/ajaxcodepostal')
let inscriptionPost = require('./routes/inscription_post')
let passportLocalStrategy = require('./middlewares/passportLocalStrategy')
let effacerAnnonce = require('./routes/effacerannonce')
let errorNotFound = require('./routes/errornotfound')
let searchApi = require('./routes/searchapi')
let reinitialiser = require('./routes/reinitialiser')
let successValidation = require('./routes/successvalidation')
let secureReinitialisation = require('./routes/securereinitialisation')
let inscriptionval = require('./routes/inscriptionval')
//Empty temp folder on startup
let tempUsers = {};
let tempReinit = {};
mkdirp(configFile.serverConfigurationVariables.userImageFolder + '/temp', function (err) {
  if (err) throw err
  console.log('Temp folder empty!')
});


///////////////////////////////////////
//MongoDB
///////////////////////////////////////

let mongoConnection = require('./middlewares/mongoConnection', mongoose)

mongoConnection(mongoose)
var User = mongoose.model('User', require('./Schemas/UserSchema'), 'Users')
var Annonce = mongoose.model('Annonce', require('./Schemas/AnnonceSchema'), 'Annonces')

///////////////////////////////////////
//View engine
///////////////////////////////////////

app.set('view engine', 'ejs')

///////////////////////////////////////
//Static folders
///////////////////////////////////////

//public static folder

app.use('/assets', express.static('public'))

//User images static folder

app.use('/pregistered', express.static('UserImages'))

///////////////////////////////////////
//Cookies
///////////////////////////////////////

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [configFile.session.cookieKey]
}))

///////////////////////////////////////
//Authentication
///////////////////////////////////////

//initialiaze passport


app.set('trust proxy', 1) // trust first proxy

app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb, ) {
  User.findById(id, function (err, user) {
    cb(err, user);
  });
});
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    passportLocalStrategy(User, username, password, done)
  }

));

///////////////////////////////////////
//Middlewares
///////////////////////////////////////

// log in middleware

let isLoggedIn = require('./middlewares/isloggedin')

//flash message middleware

app.use(require('./middlewares/flash'))

///////////////////////////////////////
//Routes
///////////////////////////////////////
//parse password retrieval form
app.get('/inscriptionval', (req, res) => {
  inscriptionval(req, res, User, CryptoJS, configFile, tempUsers, function (returnedUsers) {
    tempUsers = returnedUsers
  })

})
app.post('/reinitialiser', (req, res) => {

  reinitialiser(req, res, User, configFile, CryptoJS)
})

// reset user password
app.get('/secureinitilisation', csrfProtection, function (req, res) {
  console.log(req.query.s)
  console.log(req.query.d)
  secureReinitialisation(req, res, User, tempReinit, configFile, function (returnedReinit) {
    tempReinit = returnedReinit
  })

})
app.post('/nmdp', parseForm, csrfProtection, function (req, res) {
  console.log(req.body.MotDePasse)
  console.log(req.body.user)
  User.findOneAndUpdate({ _id: req.body.user }, { $set: { MotDePasse: req.body.MotDePasse } }, function (err, user) {
    if (err) {
      console.log("Erreur d'update du mdp de l'user: " + req.body.user);
      req.flash('error', 'Erreur de réinitialisation veuillez nous contacter!')
      res.redirect('/')
    }

    console.log('updated user password of: ' + user._id + ' value= ' + user.MotDePasse);
    req.flash('success', 'Mot de passe réinitialisé')
    res.redirect('/')
  })

})
//favicon icon
app.get('/favicon.ico', function (req, res) {

  res.redirect('/assets/favicon.ico')


})

// when user changes search option redirect to same page 
app.get('/searchoption', function (req, res) {
  if (req.query.searchoption) {

    req.session.searchoption = req.query.searchoption
    res.redirect(req.get('referer'))

  }
})
//on auth success diplay user ads
app.get('/success', isLoggedIn,csrfProtection, function (req, res) {
  successValidation(req, res, Annonce, configFile,csrfProtection)

})
//display ad form
app.get('/deposer', isLoggedIn, csrfProtection, (req, res) => {

  deposerGet(req, res, configFile)

})
// on wrong password or email
app.get('/error', (req, res) => {
  req.flash('error', 'Mot de pass ou email erroné', 'FailLogin')
  res.redirect('/');
});
app.get('/searchApi', (req, res) => {

  searchApi(req, res, Annonce)

})

//connect user
app.post('/connexion',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function (req, res) {
    console.log(req.user._id)

    req.session._id = req.user._id

    res.redirect('/success?username=' + req.user.NomUitilisateur);
  });

//logout user
app.get('/logout', (req, res) => {
  res.cookie.maxAge = Date.now - 3
  req.session = null
  res.redirect('/')
})
//index
app.get('/', csrfProtection, (req, res) => {
  index(req, res, configFile, Annonce)
})
//display subsciption page
app.get('/inscription', csrfProtection, (req, res) => {
  inscription(req, res, configFile)
})
//ajax for postal code retrieval
app.get('/ajaxCodePostal', csrfProtection, (req, res) => {
  ajaxCodePostal(req, res, SearchVille)

})


//member area
app.get('/espacemembre', isLoggedIn,csrfProtection, function (req, res) {

  let searchoption = getSearchOption(req)
  espacemembre(req, res, Annonce, configFile, searchoption,csrfProtection)


});

//parse incoming ad post
app.post('/deposer', isLoggedIn, (req, res) => {
  deposer(req, res, User, Annonce, configFile, IoOp, formidable, path, mkdirp)

})
// parse incoming user subscription
app.post('/inscription', parseForm, csrfProtection, (req, res) => {
  inscriptionPost(req, res, User, SearchVille, CryptoJS, configFile, tempUsers, function (returnerUder) {
    tempUsers = returnerUder
    console.log(tempUsers)
  })

})
//remove ad
app.post('/effacerannonce', isLoggedIn, (req, res) => {
  effacerAnnonce(req, res, Annonce, rimraf)

})

//404 not found route
app.use(function (req, res, next) {

  let searchoption = getSearchOption(req)
  errorNotFound(req, res, next, searchoption, configFile)

});

//listen on port specified in config file

server.listen(configFile.serverConfigurationVariables.port, function () {
  console.log('server started')
})

///////////////////////////////////////
//Functions
///////////////////////////////////////

// function in case session searchoption does not exist

function getSearchOption(req) {
  let searchoption;
  if (req.session.searchoption === undefined) {
    searchoption = '1'
    return searchoption
  }
  else {
    searchoption = req.session.searchoption
    return searchoption
  }
}

//encryption

function aes_encrypt(password, content) {

  let ciphertext = CryptoJS.AES.encrypt(content, password).toString();
  // ciphertext.toString().replace('+','xMl3Jk').replace('/','Por21Ld').replace('=','Ml32');
  console.log(ciphertext)
  return ciphertext
}

function aes_decrypt(password, encrypted) {
  console.log(encrypted)
  encrypted.toString().replace('xMl3Jk', '+').replace('Por21Ld', '/').replace('Ml32', '=');
  let decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);

  return decrypted
}

