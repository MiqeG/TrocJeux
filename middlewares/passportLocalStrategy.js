module.exports= function(User,username,password,done){
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
   
     
   