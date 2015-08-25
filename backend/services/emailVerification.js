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
        console.log('email: ' + email +',token: ' + token);

        var transporter = nodemailer.createTransport(smtpTransport({
            host: config.SMTP_SERVER,
            secure: true,
            auth: {
                user: config.SMTP_USERNAME,
                pass: config.SMTP_PASSWORD
            }
        }));

        var mailOptions = {
            from: 'Gala FIS 2015 <accounts@google.com>',
            to: email,
            subject: 'Mail xac nhan dang ky tham gia gala "Goi ngay moi"',
            //html: getHtml(token)
            html: "<h3>Gala Gọi tên ngày mới<h3><p>Xác nhận đăng ký thành công!</p><p>Để hoàn thành bước đăng ký, xin vui lòng click vào nút xác nhận! <a href='" + config.APP_URL + '/auth/verifyEmail?token=' + token +"'> Xác nhận</a></p>"
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log("ERROR");
                console.log(err);
                //return res.status(500, err);
                ;
            }

            console.log("OK");
            //console.log('email sent ', info.response);
        });
    } catch (Err) {
            console.log("skipping: " + Err);
            return; // continue
    } 
};

function sendSucess(email){
    try{
        
        var transporter = nodemailer.createTransport(smtpTransport({
            host: config.SMTP_SERVER,
            secure: true,
            auth: {
                user: config.SMTP_USERNAME,
                pass: config.SMTP_PASSWORD
            }
        }));

        var mailOptions = {
            from: 'Gala FIS 2015 <accounts@google.com>',
            to: email,
            subject: 'Ban da day ky thanh cong tham gia su kien  "Gala Goi Ngay Moi"',
            //html: getHtml(token)
            html: "<p>Bạn đã đăng ký công. Bạn hãy nhanh chân đén BTC để nhận vé.</p>"
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
    console.log(token);

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

                sendSucess(email);
                return res.redirect(config.APP_URL);
            });
    });

};

function getHtml(token) {
    var path = './views/emailVerification.html';
    var html = fs.readFileSync(path, encoding = 'utf8');

    var template = _.template(html);

    model.verifyUrl += token;

    //var abc = template(model);
    //console.log(abc);
    //return abc;
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
