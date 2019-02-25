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


//let test2=aes_decrypt(pass,test1)
//console.log(test2)

var encrypted = CryptoJS.AES.encrypt('012345678910', "Secret Passphrase");
var words  = CryptoJS.enc.Base64.parse(encrypted);
var parsed= CryptoJS.Base64.enc(words)
var base64 = CryptoJS.enc.Base64.stringify(words);
 //console.log(base64)

var words = CryptoJS.enc.Latin1.parse('01223546789764732135674');


var latin1 = CryptoJS.enc.Latin1.stringify(words);
//console.log(words.)
//console.log(latin1)
var words = CryptoJS.enc.Hex.parse('48656c6c6f2c20576f726c6421');
var hex = CryptoJS.enc.Hex.stringify(words);
//console.log(hex)

var words = CryptoJS.enc.Utf16.parse('Hello, World!');
var utf16 = CryptoJS.enc.Utf16.stringify(words);
//console.log(utf16)