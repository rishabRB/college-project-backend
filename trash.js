app.use(bodyParser.json());

// Connect to the MongoDB database
MongoClient.connect(url, function(err, client) {
  const db = client.db(dbName);
  const books = db.collection('books');

  // Route to get all books
  app.get('/api/books', (req, res) => {
    books.find({}).toArray(function(err, books) {
      if (err) throw err;
      res.json(books);
    });
  });

  // Route to get a book by ID
  app.get('/api/books/:id', (req, res) => {
    const id = req.params.id;
    books.findOne({ _id: id }, function(err, book) {
      if (err) throw err;
      res.json(book);
    });
  });

  // Route to add a new book
  app.post('/api/books', (req, res) => {
    books.insertOne(req.body, function(err, result) {
      if (err) throw err;
      res.json(result.ops[0]);
    });
  });

  // Route to update a book by ID
  app.put('/api/books/:id', (req, res) => {
    const id = req.params.id;
    books.updateOne({ _id: id }, { $set: req.body }, function(err, result) {
      if (err) throw err;
      res.json(result);
    });
  });

  // Route to delete a book by ID
  app.delete('/api/books/:id', (req, res) => {
    const id = req.params.id;
    books.deleteOne({ _id: id }, function(err, result) {
      if (err) throw err;
      res.json(result);
    });
  });
});

// Start the server
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});




// const url = 'mongodb+srv://ris_v:rishabbibhuty@cluster0.k5rl8.mongodb.net/?retryWrites=true&w=majority';
// const dbName = 'Library-management';