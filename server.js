
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
let fs=require('fs')
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
let secureReinitialisation = require('./routes/securereinitialisation')
let inscriptionval = require('./routes/inscriptionval')
let ajaxmdp = require('./routes/ajaxmdp')
let userupdinfo = require('./routes/userupdinfo')
let nmdp = require('./routes/nmdp')
let emailupd=require('./routes/emailupd')
let emailupdval=require('./routes/emailupdval')
let adupdpost=require('./routes/adupdpost')
let deleteuser=require('./routes/deleteuser')
//Empty temp folder on startup
let tempUsers = {};
let tempReinit = {};
let tempEmailUpd = {};
mkdirp(configFile.serverConfigurationVariables.userImageFolder + '/temp', function (err) {
  if (err) throw err
  console.log('Temp folder ok!')
});

server.listen(configFile.serverConfigurationVariables.port, function () {
  console.log('server started')
  
})

//listen on port specified in config file


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
//Socket.io
///////////////////////////////////////
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  socket.emit('authenticate',{
    message:'please authenticate'
  })
  socket.on('checkcredentials',(data)=>{
  
    User.findOne({_id:data._id},function(err,user){
     
      if(err){
        console.log('disconnecting1')
        socket.disconnect()
        return
      }
      else if(user==null){
        console.log('disconnecting2')
        socket.disconnect()
        return
      }
      if(data.password==user.MotDePasse){
        socket.emit('Logged',{
    
        })
      }
    })
  })

  
  socket.on('getads',(data)=>{
    let dateReference=new Date
    dateReference -= (1 * 60 * 60 * 1000);
    
  

    Annonce.find({DatePublication:{"$gt": dateReference}},function(err,annonces){
      if(err){
       
        socket.emit('error',{
          error:"database research error",
        })
      }
      else if(annonces==null){
        
        socket.emit('empty',{
          message:'aucune annonce a valider'
        })

      }
      else if (annonces){
        
        socket.emit('adsrefresh',{
          ads:annonces
        })
      }
    })
  })
///////////////////////////////////////
//Routes
///////////////////////////////////////
//parse password retrieval form
//index
app.get('/', csrfProtection, (req, res) => {
  console.log(req)
  index(req, res, configFile, Annonce)
})
app.get('/inscriptionval', (req, res) => {
  inscriptionval(req, res, User, CryptoJS, configFile, tempUsers, function (returnedUsers) {
    tempUsers = returnedUsers
  })

})
//send password reset email
app.post('/reinitialiser', (req, res) => {

  reinitialiser(req, res, User, configFile, CryptoJS)
})

// reset user password / parse password link
app.get('/secureinitilisation', csrfProtection, function (req, res) {

  secureReinitialisation(req, res, User, tempReinit, configFile, function (returnedReinit) {
    tempReinit = returnedReinit
  })

})
// secure password reset form
app.post('/nmdp', parseForm, csrfProtection, function (req, res) {

  nmdp(req, res, User)

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


//display ad form
app.get('/deposer', isLoggedIn, csrfProtection, (req, res) => {
  Annonce.find({ User_Id: req.user._id }, function (err, annonces) {
    if (err) {
      req.flash('error', "Erreur inconnue!")
      res.redirect('/')
      return
    }
    else if (annonces.length > configFile.serverConfigurationVariables.maxAnnonces) {
      req.flash('error', "Vous avez atteint le nombre maximal d'annonces! Veuillez en supprimer pour en publier de nouvelles...")
      res.redirect('/')
      return
    }
    deposerGet(req, res, configFile)
  })

})
// on wrong password or email
app.get('/error', (req, res) => {
  req.flash('error', 'Mot de pass ou email erroné', 'FailLogin')
  res.redirect('/');
});
app.get('/searchApi', (req, res) => {

  searchApi(req, res, Annonce)

})

//Update email ajax
app.post('/emailupd',isLoggedIn,function(req,res){
 
    emailupd(req,res,CryptoJS,tempEmailUpd,configFile,User,function(returnedTempEmail){
      tempEmailUpd=returnedTempEmail
   console.log('email updated')
    })

})
app.post('/adupdpost',isLoggedIn,function(req,res){

if(req.body){
  adupdpost(req,res,Annonce,configFile, IoOp, formidable, path, mkdirp,fs,io)
}
else{
  req.flash('error','Erreur interne serveur...')
  res.redirect('/espacemembre')
  return
}

})
app.post('/deleteuser',isLoggedIn,function(req,res){
  if(req.body.user_Id!=req.user._id){
  
    req.flash('error','Erreur interne serveur contactez nous!...')
    res.redirect('/logout')
    return
  }
  else if(req.body.Email!=req.user.Email){
  
    req.flash('error','Erreur interne serveur contactez nous!...')
    res.redirect('/logout')
    return
  }
  else{
    deleteuser(req,res,User,Annonce,configFile, rimraf,io)
  }
 

  })
//Connect user
app.get('/espaceadmin',isLoggedIn,function(req,res){
  if(req.user.Type=='Admin'){
    res.render('pages/espaceadmin',{configFile:configFile,ServerUrl:configFile.serverConfigurationVariables.ServerUrl, auth: req.isAuthenticated(),user: req.user,categories:configFile.categories})
  }
  else{
    res.redirect('/')
  }

})
app.post('/connexion',

  passport.authenticate('local', { failureRedirect: '/error' }),
  function (req, res) {
   
   if(req.user.Type=='Admin'){
    req.session._id = req.user._id

    res.redirect('/espaceadmin')
   }
   else if(req.user.Type=='User'){
    
    req.session._id = req.user._id

    res.redirect('/espacemembre')
   }
   
  });

//logout user
app.get('/logout', (req, res) => {
  res.cookie.maxAge = Date.now - 3
  req.session = null
  res.redirect('/')
})

//display subsciption page
app.get('/inscription', csrfProtection, (req, res) => {
  inscription(req, res, configFile)
})
//ajax for postal code retrieval
app.get('/ajaxCodePostal', csrfProtection, (req, res) => {
  ajaxCodePostal(req, res, SearchVille)

})
app.post('/adupd',isLoggedIn,function(req,res){

Annonce.findOne({_id:req.body._id},function(err,annonce){
  if(err){
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify('Erreur inconnue! veuillez nous contacter!'));
    return
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(annonce));
  return
})
})
//validate email upload link
app.get('/emailupdval',function(req,res){
  if(req.query.u&&req.query.e&&req.query.d){
    emailupdval(req,res,req.query.u,req.query.e,req.query.d,tempEmailUpd,CryptoJS,configFile,User,Annonce,function(returnedTempEmailUpd){
      tempEmailUpd=returnedTempEmailUpd
    })
  }
 else{
   req.flash('error','Lien Invalide!!')
   res.redirect('/')
 }
})

//member area
app.get('/espacemembre', isLoggedIn, csrfProtection, function (req, res) {
if(req.user.Type=='Admin'){
  
  res.redirect('/espaceadmin')
  return
}
else if(req.user.Type=='User'){
  let searchoption = getSearchOption(req)
  espacemembre(req, res, Annonce, configFile, User, searchoption, csrfProtection)

}
  else{
    redirect('/')
  }


});
app.post('/ajaxmdp', isLoggedIn, function (req, res) {
  ajaxmdp(req, res, User)
})
app.post('/upduserinfo', isLoggedIn, parseForm, csrfProtection, function (req, res) {
  if (req.body && req.body.Email) {
    userupdinfo(req, res, User, Annonce)
  }
  else {
    req.flash('error', 'Erreur lors de la soumission du formulaire!')
    res.redirect('/espacemembre')
  }

})
//parse incoming ad post
app.post('/deposer', isLoggedIn, (req, res) => {
  deposer(req, res, User, Annonce, configFile, IoOp, formidable, path, mkdirp,io)

})
// parse incoming user subscription
app.post('/inscription', parseForm, csrfProtection, (req, res) => {
  inscriptionPost(req, res, User, SearchVille, CryptoJS, configFile, tempUsers, function (returnerUder) {
    tempUsers = returnerUder

  })

})
//remove ad
app.post('/effacerannonce', isLoggedIn, (req, res) => {

  
  effacerAnnonce(req, res, Annonce, rimraf, configFile,io)

})

//404 not found route
app.use(function (req, res, next) {

  let searchoption = getSearchOption(req)
  errorNotFound(req, res, next, searchoption, configFile)

});








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

//end of nesting inside io
})
