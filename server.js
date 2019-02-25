
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
let successValidation = require('./routes/successvalidation')

//Empty temp folder on startup

mkdirp(configFile.serverConfigurationVariables.userImageFolder + '/temp', function (err) {
  if (err) throw err
  console.log('Temp folder empty!')
});
///////////////////////////////////////
//Nodemailer in order to send messages to users
///////////////////////////////////////

//use self signed certificate 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'trocjeux@gmail.com',
    pass: 'Peon8216'
  }
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
app.post('/reinitialiser',  (req, res) =>{

  User.findOne({ Email: req.body.userEmail }, function (err,user) {
    
    if (err) return
    else {
      if(user&&user._id){
       
       
        let ciphertext = CryptoJS.AES.encrypt(user._id.toString(),configFile.serverConfigurationVariables.serverKey).toString();
        console.log(ciphertext)
        let array=ciphertext.split('')
        for (let i = 0; i < array.length; i++) {
         if(array[i]=='+'){  array[i]=    '⺈'      }
         else if(array[i]=='/'){  array[i]=    '⺋'      }
         else if(array[i]=='='){  array[i]=    '⺜'      }
          
        }
        
        // Decrypt
    
         let deplaced=array.join('');
        console.log(deplaced);
       
              
        let link = 'https://theroxxors.ml/secureinitilisation?s='+deplaced
        const output = `
        <p>Vous avez demandé une réinitialisation de votre mot de passe</p>
        <h3></h3>
        <ul>  
        <li>
        <a href="${link}">Cliquez sur ce lien pour procéder a la réinitialisation</a>
        </li>
        </ul>
       `;
  
        let mailOptions = {
          from: 'trocjeux@gmail.com', // sender address
          to: user.Email, // list of receivers
          subject: 'Réinitialisation mot de passe', // Subject line
          text: "Troc'Jeux", // plain text body
          html: output // html body
        };
  
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
   
    }
  })

  req.flash('success','un email va vous être envoyé prochainement...')
res.redirect('/')
})

// reset user password
app.get('/secureinitilisation',function(req,res){
  console.log(req.query.s)

  var dereplaced= req.query.s
  let array2=dereplaced.split('')
  for (let i = 0; i < array2.length; i++) {
    if(array2[i]=='⺈'){  array2[i]=    '+'      }
    else if(array2[i]=='⺋'){  array2[i]=    '/'      }
    else if(array2[i]=='⺜'){  array2[i]=    '='      }
     
   }

   let rereplaced=array2.join('');
  console.log(rereplaced)
        try {
          var bytes  = CryptoJS.AES.decrypt(rereplaced, configFile.serverConfigurationVariables.serverKey);
          var plaintext = bytes.toString(CryptoJS.enc.Utf8);
          console.log(plaintext)
          User.findOne({_id:plaintext},function(err,user){
           if(err){
            req.flash('error','Une erreur est survenue!')
            res.redirect('/')
            return
           }
           else if(user){
              res.render('pages/secureform')
              return
            }
           else{
           
           }
  
          })
        } catch (error) {
          console.log('bad link or crypto problem')
          req.flash('error','Une erreur est survenue!')
          res.redirect('/')
        }

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
  
 let ciphertext= CryptoJS.AES.encrypt(content, password).toString();
 // ciphertext.toString().replace('+','xMl3Jk').replace('/','Por21Ld').replace('=','Ml32');
 console.log(ciphertext)
  return ciphertext
}

function aes_decrypt(password, encrypted) {
  console.log(encrypted)
  encrypted.toString().replace('xMl3Jk', '+' ).replace('Por21Ld', '/').replace('Ml32', '=');
let decrypted=CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);

  return decrypted
}