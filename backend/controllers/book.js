// Load required packages
var Book = require('../models/Book');

// Create endpoint /api/books for POST
exports.postBooks = function(req, res) {
  // Create a new instance of the Book model
  var book = new Book();

  // Set the book properties that came from the POST data
  book.email = req.book.email;
  book.tickettype = req.book.tickettype;

  // Save the book and check for errors
  book.save(function(err) {
    if (err)
      return err;

    return book;
  });
};

// Create endpoint /api/books for GET
exports.getBooks = function(req, res) {

    var query = Book.find();

    if (req.query.email != null && req.query.email != '')
        query.where('email').equals(new RegExp(req.query.email, 'i'));

    if (req.query.status != null && req.query.status != '')
        query.where('status').equals(req.query.status);

    query.exec(function(err, books) {
        if (err)
            res.send(err);

        res.json(books);
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
exports.getBook = function(req, res) {
  // Use the Book model to find a specific book
  Book.findOne({_id: req.params.book_id }, function(err, book) {
    if (err)
      res.send(err);

    res.json(book);
  });
};

// Create endpoint /api/books/:book_id for PUT
exports.putBook = function(req, res) {
   //Use the Book model to find a specific book
   Book.update({ _id: req.params.book_id }, { tickettype: req.body.tickettype, status: req.body.status }, function(err, num, raw) {
     if (err)
       res.send(err);

     res.json({ message: num + ' updated' });
   });
};

// Create endpoint /api/books/:book_id for DELETE
exports.deleteBook = function(req, res) {
  // Use the Book model to find a specific book and remove it
  Book.remove({ _id: req.params.book_id }, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Book removed from the locker!' });
  });
};