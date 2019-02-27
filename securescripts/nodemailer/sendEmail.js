module.exports = function (subject, output, userMail) {
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
    let mailOptions = {
        from: 'trocjeux@gmail.com', // sender address
        to: userMail, // list of receivers
        subject: subject, // Subject line
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