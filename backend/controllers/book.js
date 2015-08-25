// Load required packages
var Book = require('../models/Book');
var config = require('../services/config.js');
var emailVerification = require('../services/emailVerification.js');
// Create endpoint /api/books for POST
exports.postBooks = function (req, res) {
    // Create a new instance of the Book model
    var book = new Book();

    // Set the book properties that came from the POST data
    book.email = req.body.email;
    book.tickettype = req.body.tickettype;

    // Save the book and check for errors
    book.save(function (err) {
        if (err)
            return err;

        res.json(book);
    });
};

// Create endpoint /api/books for GET
exports.getBooks = function (req, res) {

    var perPage = config.PAGESIZE;
    var query = Book.find();

    //var query = {};


    if (req.query.email != null && req.query.email != '')
        query.where('email').equals(new RegExp(req.query.email, 'i'));
    //query["email"] = new RegExp(req.query.email, 'i');

    if (req.query.status != null && req.query.status != '')
        query.where('status').equals(req.query.status);
    //query["status"] = status;

    var page = 0;
    if (req.query.page != null && req.query.page != '')
        page = req.query.page - 1;


    //console.log(page);
    query
    //Book.find(query)
    .limit(perPage)
    .skip((perPage * page))
    .sort({
        created_time: 'desc'
    })
    //query
    .exec(function (err, books) {
        if (err)
            res.send(err);
        var queryCount = Book.find();
        if (req.query.email != null && req.query.email != '')
            queryCount.where('email').equals(new RegExp(req.query.email, 'i'));

        if (req.query.status != null && req.query.status != '')
            queryCount.where('status').equals(req.query.status);

        queryCount.count().exec(function (err, count) {
            res.json({ books: books, count: count });
        })


    });


    //console.log(req.query.page);
    //console.log(req.query.email);
    //console.log(req.query.status);
    //console.log(req.query.floor);

    // Use the Book model to find all book
    //Book.find({}, function(err, books) {
    //  if (err)
    //    res.send(err);

    //  res.json(books);
    //});
};

// Create endpoint /api/books/:book_id for GET
exports.getBook = function (req, res) {
    // Use the Book model to find a specific book
    Book.findOne({ _id: req.params.book_id }, function (err, book) {
        if (err)
            res.send(err);

        res.json(book);
    });
};

// Create endpoint /api/books/:book_id for PUT
exports.putBook = function (req, res) {
    //Use the Book model to find a specific book
    Book.update({ _id: req.params.book_id }, { tickettype: req.body.tickettype, status: req.body.status }, function (err, num, raw) {
        if (err)
            res.send(err);

        res.json({ message: num + ' updated' });
    });
};

// Create endpoint /api/books/:book_id for DELETE
exports.deleteBook = function (req, res) {
    // Use the Book model to find a specific book and remove it
    Book.remove({ _id: req.params.book_id }, function (err) {
        if (err)
            res.send(err);

        res.json({ message: 'Book removed from the locker!' });
    });
};


// Create endpoint /api/books/:book_id for DELETE
exports.sendMailPending = function (req, res) {

    var query = Book.find();

    query.where('status').equals('pending');

    query.sort({
        created_time: 'desc'
    })
    .exec(function (err, books) {
        if (err)
            res.send(err);

        //books.forEach(function (entry) {
        //    //console.log(entry.email);
        //    try{
        //        emailVerification.send(entry.email);
        //    } catch (Err) {
        //        console.log("skipping: " + Err);
        //        continue;
        //    }
        //});
        for (var i = 0, len = books.length; i < len; i++) {
            try {
                console.log('Send mail: ' + books[i].email);
                emailVerification.send(books[i].email);
            } catch (e) {
                console.log(e);
                continue;
            }
        }

        res.send('Ok');
    });

};