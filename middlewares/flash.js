module.exports = function (req, res, next) {
    if (req.session.flash) {
        console.log(req.session.flash)
        res.locals.flash = req.session.flash
        res.locals.flash.code = req.session.flash.code
        req.session.flash = undefined
    }
    if (req.session.formdata) {
       
        res.locals.formdata = req.session.formdata
        req.session.formdata = undefined
    }
    req.flash = function (type, content, code) {

        if (req.session.flash === undefined) {
            req.session.flash = {}
        }
        if (req.session.formdata === undefined) {
            req.session.formdata = {}
        }
        console.log(req.body)
        req.session.formdata = req.body
        req.session.flash.code = code;
        req.session.flash[type] = content


    }

    next()
}