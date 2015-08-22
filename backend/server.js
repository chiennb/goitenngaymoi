var express = require("express");
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

// Register all our routes
app.use(router);

//app.listen(port);
var io = require('socket.io').listen(app.listen(port));

console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {

	Book.count({}, function( err, count){	      
      	io.sockets.emit('booked', { message: (config.TICKETS - count)});
	});

    socket.on('send', function (data) {
    	try {
    		//console.log(data);
	    	//var _book = JSON.parse(data);	 
	    	_book = data;

	    	if (!filter.test(_book.email)){
	    		io.sockets.emit('message',{message: 'Bạn phải nhập email FPT!'});
	    		return;
	    	}

	        Book.findOne({ email: _book.email }, function(err, existingBook) {
			    if (existingBook) {
			    	if (existingBook.status == 'pending'){
			    		io.sockets.emit('message',{message: 'Email đã đăng ký, bạn chưa thanh toán!'});
			    		return;
			    	}		      			      		
			      	else{
			      		io.sockets.emit('message', { message: 'Email đã đăng ký và thanh toán!'});
			      		return;
			      	}			      
			    }

			    var book = new Book({
			      email: _book.email,
			      tickettype: _book.tickettype
			    });

			    book.save(function(err) {
			    	if (err){
			    		io.sockets.emit('message', {message: 'Không đăng ký thành công: ' + err});
			    		return;
			    	}
			      
			      	io.sockets.emit('message', { message: 'Đăng ký thành công! Bạn vui lòng check mail xác nhận!'});

			      	Book.count({}, function( err, count){
						    console.log( "Number of users:", count );
					      	console.log(config.TICKETS - count);
					      	
					      	io.sockets.emit('booked', { message: (config.TICKETS - count)});
					});

			      	emailVerification.send(_book.email);
			    });
			  });
        } catch (Err) {
	        console.log("skipping: " + Err);
	        //return; // continue
     	} 
    });
});