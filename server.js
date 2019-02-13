let express = require('express')
let app = express()
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/TestDB',{useNewUrlParser:true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var CommentSchema = mongoose.Schema({
    Comment: String,
    Type:String
  
  });
  var Comment = mongoose.model('Comment', CommentSchema, 'Comment');
db.once('open', function() { console.log("Connection to database TestDB Successful!")});

let session=require('express-session')
let configFile= require('./config/server_config.json')
app.set('view engine','ejs')
app.use('/assets',express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'testpass',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(require('./middlewares/flash'))

app.get('/',(req,res)=>{

    res.render('pages/index')
})
app.post('/',(req,res)=>{
   if(req.body.message===undefined||req.body.message===''){
      req.flash('error','message vide')
      res.redirect('/')
   }
   else{
    var comment1 = new Comment({ Comment: req.body.message,Type:"Comment"});
 
    // save model to database
    comment1.save(function (err, comment) {
      if (err) return console.error(err);
      console.log(comment.Comment + "\r\n saved to comment collection.");
    });
   }

})
app.listen(configFile.serverConfigurationVariables.port)