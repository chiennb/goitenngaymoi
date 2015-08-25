var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var emailVerification = require('./services/emailVerification.js');
var bookController = require('./controllers/book');
var userController = require('./controllers/user');
var Book = require('./models/Book');
var config = require('./services/config.js');

var filter = /^([\w-\.]+)@fpt.com.vn$/;

// Connect to the booklocker MongoDB
mongoose.connect(config.DB_CONNECTION);

var port = config.PORT || 6969;

//app.use(bodyParser.urlencoded({
//    extended: true
//}));

app.use(bodyParser.json());

// app.set('views', __dirname + '/tpl');
// app.set('view engine', "jade");
// app.engine('jade', require('jade').__express);



app.use(express.static(path.join(__dirname, '../frontend')));

// app.get("/", function(req, res){
//     //res.render("page");
//     res.render('index.html');
// });

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});

//app.get('/auth/verifyEmail', emailVerification.handler);

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /books
router.route('/api/books')
    .post(bookController.postBooks)
    .get(bookController.getBooks);

// Create endpoint handlers for /books/:book_id
router.route('/api/books/:book_id')
    .get(bookController.getBook)
    .put(bookController.putBook)
    .delete(bookController.deleteBook);

//app.get('/auth/verifyEmail', emailVerification.handler);
router.route('/auth/verifyEmail')
  .get(emailVerification.handler)

router.route('/api/sendMail')
  .post(bookController.sendMailPending)

// Register all our routes
app.use(router);

//app.listen(port);
var io = require('socket.io').listen(app.listen(port));

console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {


    Book.count({ status: { $ne: 'pending' }, tickettype: '1'}, function (err, count) {
        if (err) console.log(err);

        io.sockets.emit('floorOne', { message: (config.FLOORONE - count) });
    });

    Book.count({ status: { $ne: 'pending' }, tickettype: '2' }, function (err, count) {
        io.sockets.emit('floorTwo', { message: (config.FLOORTWO - count) });
    });

    socket.on('send', function (data) {
    	try {
    		//console.log(data);
	    	//var _book = JSON.parse(data);	 
    	    _book = data;

    	    _book.email = _book.email.toLowerCase();

	    	if (!filter.test(_book.email)){
	    		io.sockets.emit('message',{message: 'Bạn phải nhập email FPT!'});
	    		return;
	    	}

	    	var regex = new RegExp(["^", _book.email, "$"].join(""), "i");
    	    // Creates a regex of: /^SomeStringToFind$/i
	    	//db.stuff.find({ foo: regex });

	    	Book.findOne({ email: regex }, function (err, existingBook) {
			    if (existingBook) {
			    	if (existingBook.status == 'pending'){
			    		io.sockets.emit('message',{message: ' Email đã đăng ký nhưng chưa xác nhận!'});
			    		return;
			    	}		      			      		
			    	else if (existingBook.status == 'active') {
			    	    io.sockets.emit('message', { message: 'Email đã xác nhận. Vui lòng liên hệ với BTC để thanh toán!'});
			      		return;
			    	}
			    	else{
			    	    io.sockets.emit('message', { message: 'Bạn đã đóng tiền. Thật không thể tin nổi :D!' });
			    	    return;
			    	}
			    }



			    var book = new Book({
			        email: _book.email,
			      tickettype: _book.tickettype
			    });

			    Book.count({ status: { $ne: 'pending' }, tickettype: _book.tickettype }, function (err, count) {

			        var check1 = 0;
			        var check2 = 0;

                    //Neu dang ky ve tang 1
			        if (_book.tickettype == '1') {
			            check1 = config.FLOORONE - count;

                        //Neu tang 1 het
			            if (check1 <= 0) {

                            //Dem ve tang 2
			                Book.count({ status: { $ne: 'pending' }, tickettype: '2' }, function (err, count2) {
			                    check2 = config.FLOORTWO - count2;

                                //Neu tang 2 het
			                    if (check2 == 0) {
			                        io.sockets.emit('message', { message: 'Thật không thể tin nổi. Các vé đã được đặt hết!' });
			                        return;
			                    }
			                    else {
			                        io.sockets.emit('message', { message: 'Vé tầng 1 đã đăng ký hết. Bạn chuyển sang đăng ký tầng 2.' });
			                        return;
			                    }
			                });
			            } else {
			                book.save(function (err) {
			                    if (err) {
			                        io.sockets.emit('message', { message: 'Không đăng ký thành công: ' + err });
			                        return;
			                    }

			                    io.sockets.emit('message', { message: 'Đăng ký thành công! Bạn vui lòng check mail xác nhận!' });

			                    emailVerification.send(_book.email);
			                });
			            }

			        }
			        else {//Dang ky ve tang 2
			            check1 = config.FLOORTWO - count;

			            //Neu tang 2 het
			            if (check1 <= 0) {

			                //Dem ve tang 1
			                Book.count({ status: { $ne: 'pending' }, tickettype: '1' }, function (err, count2) {
			                    check2 = config.FLOORONE - count2;

			                    //Neu tang 2 het
			                    if (check2 == 0) {
			                        io.sockets.emit('message', { message: 'Thật không thể tin nổi. Các vé đã được đặt hết!' });
			                        return;
			                    }
			                    else {
			                        io.sockets.emit('message', { message: 'Vé tầng 2 đã đăng ký hết. Bạn chuyển sang đăng ký tầng 1.' });
			                        return;
			                    }
			                });
			            } else {
			                book.save(function (err) {
			                    if (err) {
			                        io.sockets.emit('message', { message: 'Không đăng ký thành công: ' + err });
			                        return;
			                    }

			                    io.sockets.emit('message', { message: 'Đăng ký thành công! Bạn vui lòng check mail xác nhận!' });

			                    emailVerification.send(_book.email);
			                });
			            }
			        }
			        
			    });
			    
			  });
        } catch (Err) {
	        console.log("skipping: " + Err);
	        //return; // continue
     	} 
    });
});