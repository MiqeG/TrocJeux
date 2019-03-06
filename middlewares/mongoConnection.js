module.exports=function (mongoose){
    
mongoose.connect('mongodb://localhost:27017/NewTest', { useNewUrlParser: true })
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function () { 
  
    console.log("Connection to database NewTest Successful!")
})}

