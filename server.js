
/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            TrocJeux
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

//City json file

let SearchVille = require('./csvvilles/FRANCE/villes.json')

//Configuration file

let configFile = require('./config/server_config.json')

//Create temp folder if it doesnt exist

mkdirp(configFile.serverConfigurationVariables.userImageFolder + '/temp', function (err) {
  if (err) throw err
  console.log('Temp folder empty!')
});


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
let successValidation = require('./routes/successvalidation')


///////////////////////////////////////
//MongoDB
///////////////////////////////////////

let mongoConnection = require('./middlewares/mongoConnection', mongoose)

mongoConnection(mongoose)
var User = mongoose.model('User', require('./Schemas/UserSchema'), 'Users')
var Annonce = mongoose.model('Annonce', require('./Schemas/AnnonceSchema'), 'Annonces')


//App

//View engine

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
app.get('/success', isLoggedIn, function (req, res) {
  successValidation(req, res, Annonce, configFile)

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
  index(req, res, configFile)
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
app.get('/espacemembre', isLoggedIn, function (req, res) {

  let searchoption = getSearchOption(req)
  espacemembre(req, res, Annonce, configFile, searchoption)


});
//parse incoming ad post
app.post('/deposer', isLoggedIn, (req, res) => {
  deposer(req, res, User, Annonce, configFile, IoOp, formidable, path, mkdirp)

})
// parse incoming user subscription
app.post('/inscription', parseForm, csrfProtection, (req, res) => {
  inscriptionPost(req, res, User, SearchVille)
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

app.listen(configFile.serverConfigurationVariables.port)



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