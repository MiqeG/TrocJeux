module.exports = function(req,res,next){
    if(req.session.flash){
        res.locals.flash= req.session.flash
      
        req.session.flash=undefined
    }
    if(req.session.formdata){
        res.locals.formdata=req.session.formdata
        req.session.formdata=undefined
    }
    req.flash = function (type,content){
        if(req.session.flash===undefined){
            req.session.flash={}
        }
        if(req.session.formdata===undefined){
            req.session.formdata={}
        }
        req.session.formdata=req.body
        req.session.flash[type]= content

    }
 
    next()
}