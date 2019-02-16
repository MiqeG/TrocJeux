let express = require('express')
let app = express()
let mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
const cookieSession =require('cookie-session');
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })
var parseForm = express.urlencoded({ extended: true })
const passport = require('passport');
mongoose.connect('mongodb://localhost:27017/NewTest', { useNewUrlParser: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))

var UserSchema = mongoose.Schema({
  Type: { type: String, required: true },
  NomUitilisateur: { type: String, required: true },
  Nom: { type: String, required: true },
  Prenom:{ type: String, required: true },
  Email: { type: String, required: true },
  MotDePasse: { type: String, required: true },
  Adresse: { type: String, required: true },
  CodePostal:{ type: Number, required: true },
  Ville: { type: String, required: true },
  Pays: { type: String, required: true },
  DateInscription:{ type: Date, default: Date.now ,required:true},
  Actif:{ type: Boolean, required: true }


}, { collection: 'Villes' })

var User = mongoose.model('User', UserSchema, 'Users')
db.once('open', function () { console.log("Connection to database NewTest Successful!") })

let session = require('express-session')
let SearchVille = require('./csvvilles/FRANCE/villes.json')
let configFile = require('./config/server_config.json')
app.set('view engine', 'ejs')
app.use('/assets', express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cookieSession({
  maxAge:24*60*60*1000,
  keys:[configFile.session.cookieKey]
}))
//initialiaze passport

app.set('trust proxy', 1) // trust first proxy

app.use(passport.initialize());
app.use(passport.session());
app.use(require('./middlewares/flash'))
app.get('/success', (req, res) => res.send("Ok logging in" +req.user));
app.get('/error', (req, res) => {
  req.flash('error', 'Mot de pass ou email erroné','FailLogin')
  res.redirect('/');
});

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
      User.findOne({
        Email: username
      }, function(err, user) {
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
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
  });
app.get('/logout',(req,res)=>{
  res.cookie.maxAge=Date.now -3
  req.session=null
  res.redirect('/')
})

app.get('/', csrfProtection, (req, res) => {

  res.render('pages/index', { csrfToken: req.csrfToken(),auth:req.isAuthenticated(),user:req.user,categories:configFile.categories })

})
app.get('/inscription', csrfProtection, (req, res) => {

  res.render('pages/inscription', { csrfToken: req.csrfToken(),auth:req.isAuthenticated(),user:req.user,categories:configFile.categories },)

})
/*app.get('/connexion', csrfProtection, (req, res) => {

  res.query.Email
  res.query.MotDePasse
  res.render('pages/espacemembre', { csrfToken: req.csrfToken() })

})*/
app.get('/ajaxCodePostal', csrfProtection, (req, res) => {
  let arrayFound=''
 if(req.query.Pays=='-'||req.query.Pays==''){req.query.CodePostal='';req.query.Ville=''}
   if(req.query.options=='CodePostal'&&req.query.CodePostal!=''){
  
   arrayFound = SearchVille.Villes.filter(function (item) {
   
      return item.CodePostal == req.query.CodePostal;
  
    });
  }
  else if(req.query.options=='Ville'&&req.query.Ville!=''){
 
     arrayFound = SearchVille.Villes.filter(function (item) {
   
      return item.NomCommune == req.query.Ville.toUpperCase();
  
    });
  }
 
  if (arrayFound[0] === undefined||arrayFound=='') {
    
   let json={Ville:"",Pays:req.query.Pays}
    res.writeHead(200, { 'Content-Type': 'application/json' }); 
      res.end(JSON.stringify(json));
    return
  }
  console.log(req.query.Pays)
  let json={Ville:arrayFound[0].NomCommune,Pays:req.query.Pays,CodePostal:arrayFound[0].CodePostal}
  res.writeHead(200, { 'Content-Type': 'application/json' }); 
      res.end(JSON.stringify(json));
 

})
function isLoggedIn(req, res, next) {
  console.log('here is Authenticated', req.isAuthenticated())
  if (req.isAuthenticated()){
      return next();
  }
 
  res.redirect('/');
}
app.get('/espacemembre', isLoggedIn,
function(req, res){
 
 res.render('pages/espacemembre',{auth:req.isAuthenticated(),user:req.user,categories:configFile.categories})
});
app.post('/Inscription', parseForm, csrfProtection, (req, res) => {
  if (req.body === undefined || req.body === '') {
    req.flash('error', 'formulaire vide','vide')
    res.redirect('/inscription')

  }
  else {

    User.findOne({ Email: req.body.Email }, 'Email', function (err, item) {
      if (err) return console.error(err)
      else if (item != null) {


        req.flash('error', 'Email deja soumis','eDejaSoumis')


        res.redirect('/inscription')

      }
      else {
        User.findOne({ NomUitilisateur: req.body.NomUitilisateur }, 'NomUtilisateur', function (err, item) {
          if (err) return console.error(err)
          else if (item != null) {


            req.flash('error', "Nom d'utilisateur deja soumis","nUdejaSoumis")
    
    
            res.redirect('/inscription')
    
          }
          else{
            var arrayFound = SearchVille.Villes.filter(function (item) {
              return item.CodePostal == req.body.CodePostal;
    
            });
    
            if (arrayFound[0] === undefined) {
    
              req.flash('error', 'Ville introuvable',"villeIntrouvable")
    
    
              res.redirect('/inscription')
              return
            }
    
            var user1 = new User({
              Type: "User",
              NomUitilisateur: req.body.NomUitilisateur,
              Nom: req.body.Nom.toUpperCase(),
              Prenom: req.body.Prenom.toUpperCase(),
              Email: req.body.Email.toLowerCase(),
              MotDePasse: req.body.MotDePasse,
              Adresse: req.body.Adresse.toUpperCase(),
              CodePostal: req.body.CodePostal,
              Ville: arrayFound[0].NomCommune.toUpperCase(),
              Pays:req.body.Pays,
              Actif:true
            });
    
            // save model to database
            user1.save(function (err, user) {
              if (err) return console.error(err)
              console.log(user.Email + "\r\n saved to Users collection.")
              req.flash('success', "Merci","SuccessCode")
              res.redirect('/inscription')
    
            });
          }
        })
       

      }

    })

  }

}

)
app.listen(configFile.serverConfigurationVariables.port)