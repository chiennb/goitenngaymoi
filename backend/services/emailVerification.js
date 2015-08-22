var _ = require('underscore');
var fs = require('fs');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var config = require('./config.js');
var Book = require('../models/Book.js');


var model = {
    verifyUrl: config.APP_URL + '/auth/verifyEmail?token=',
    title: 'Gala Gọi tên ngày mới',
    subTitle: 'Xác nhận đăng ký thành công!',
    body: 'Để hoàn thành bước đăng ký, xin vui lòng click vào nút xác nhận!'
};


exports.send =  function(email){
    try{
        var payload = {
            sub: email
        };

        var token = jwt.encode(payload, config.EMAIL_SECRET);

        var transporter = nodemailer.createTransport(smtpTransport({
            host: config.SMTP_SERVER,
            secure: true,
            auth: {
                user: config.SMTP_USERNAME,
                pass: config.SMTP_PASSWORD
            }
        }));

        var mailOptions = {
            from: 'Accounts <accounts@google.com>',
            to: email,
            subject: 'Mail xac nhan dang ky tham gia gala "Goi ngay moi"',
            html: getHtml(token)
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log("ERROR");
                console.log(err);
                //return res.status(500, err);
                ;
            }

            console.log("OK");
            console.log('email sent ', info.response);
        });
    } catch (Err) {
            console.log("skipping: " + Err);
            return; // continue
    } 
};

exports.handler = function(req, res){
    var token = req.query.token;

    var payload = jwt.decode(token, config.EMAIL_SECRET);

    var email = payload.sub;

    if(!email) return handleError(res);
    
    Book.findOne({email: email}, function(err, foundUser){
            if(err) return res.status(500);

            if(!foundUser) return handleError(res);

            if(foundUser.status == 'pending'){
                foundUser.status = 'active';
            }
            
            foundUser.save(function(err){
                if(err) return res.status(500);

                
                return res.redirect(config.APP_URL);
            });
    });

};

function getHtml(token){
    var path = './views/emailVerification.html';
    var html = fs.readFileSync(path, encoding = 'utf8');

    var template = _.template(html);

    model.verifyUrl += token;

    return template(model);
}

function handleError(res){
    return res.status(401).send({
        message: 'Authentication failed, unable to verify email'
    });
}

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};
