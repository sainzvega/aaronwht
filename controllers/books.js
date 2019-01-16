const Book = require("../models/book");
const image = require("../utilities/s3");
const Author = require("../models/author");

exports.books = async (req, res) => {
  let page = req.params.page;
  const limit = 500;

  if (typeof page === "undefined" || isNaN(page)) page = 0;
  else page = page * limit - limit;

  let authorsQuery = Author.find({});

  let booksQuery = Book.find({})
    .select("title authorId thumbNail rating purchaseUrl ordinal")
    .sort({ ordinal: 1 })
    .skip(page)
    .limit(limit);

  const [books, authors, booksTotalRecords] = await Promise.all([
    booksQuery,
    authorsQuery,
    Book.find({}).count()
  ]);
  let jsonBooks = [];

  for (let i = 0; i < books.length; i++) {
    let book = {};
    book._id = books[i]._id;
    book.title = books[i].title;
    book.purchaseUrl = books[i].purchaseUrl;
    book.rating = books[i].rating;
    book.ordinal = books[i].ordinal;
    book.thumbNail = books[i].thumbNail;
    book.thumbNailHeight = books[i].thumbNailHeight;
    book.thumbNailWidth = books[i].thumbNailWidth;

    for (let x = 0; x < authors.length; x++) {
      if (
        books[i] !== null &&
        typeof books[i] !== "undefined" &&
        books[i].toObject().hasOwnProperty("authorId") &&
        books[i].authorId.toString() === authors[x]._id.toString()
      ) {
        book.author = authors[x].fullName;
      }
    }

    jsonBooks.push(book);
  }

  let returnedData = {};
  returnedData.books = jsonBooks;
  returnedData.maxRecordsReturned = limit;
  returnedData.totalRecords = booksTotalRecords;
  res.json(returnedData);
};

exports.book = (req, res) => {
  if (typeof req.params.id !== "undefined" && req.params.id === "0") {
    res.json("");
  }

  Book.findById(req.params.id, (err, book) => {
    if (err) throw Error(err);

    let jsonBook = book;
    if (
      book !== null &&
      typeof book !== "undefined" &&
      book.toObject().hasOwnProperty("authorId") &&
      book.authorId !== null
    ) {
      jsonBook.title = book.title;
      jsonBook.purchaseUrl = book.purchaseUrl;
      jsonBook.rating = book.rating;
      jsonBook.ordinal = book.ordinal;
      jsonBook.image = book.image;
      jsonBook.thumbNail = book.thumbNail;
      jsonBook.thumbNailHeight = book.thumbNailHeight;
      jsonBook.thumbNailWidth = book.thumbNailWidth;

      Author.findById(book.authorId, (err, author) => {
        if (author !== null && typeof author !== "undefined") {
          jsonBook.author = author.fullName;
        }

        res.json(jsonBook);
      });
    } else {
      res.json(jsonBook);
    }
  });
};

exports.createOrUpdate = (req, res) => {
  if (req.body.authorId === 0 && req.body.author !== "") {
    let author = req.body.author.trim();
    let authorFirstName = "";
    let authorLastName = "";

    if (author.indexOf(" ") >= 0) {
      let authorAry = author.split(" ");
      authorFirstName = authorAry[0];
      for (let i = 1; i < authorAry.length; i++) {
        authorLastName += authorAry[i] + " ";
      }

      authorLastName = authorLastName.trim();
    } else {
      authorLastName = author;
    }

    let createAuthor = Author({
      firstName: authorFirstName,
      middleName: "",
      lastName: authorLastName,
      fullName: author.trim()
    });

    createAuthor.save((err, author) => {
      if (err) throw Error(err);

      if (
        req.body.id === null ||
        typeof req.body.id === "undefined" ||
        req.body.id === "0"
      ) {
        let createBook = Book({
          authorId: author._id,
          title: req.body.title,
          purchaseUrl: req.body.purchaseUrl,
          rating: req.body.rating,
          ordinal: 99999
        });

        createBook.save((err) => {
          if (err) throw Error(err);

          res.send(createBook._id);
        });
      } else {
        Book.findByIdAndUpdate(
          req.body.id,
          {
            $set: {
              authorId: author._id,
              title: req.body.title,
              purchaseUrl: req.body.purchaseUrl,
              rating: req.body.rating
            }
          },
          { upsert: false },
          (err) => {
            if (err) throw Error(err);
            res.send(req.body.id);
          }
        );
      }
    });
  } else {
    if (
      req.body.id === null ||
      typeof req.body.id === "undefined" ||
      req.body.id === "0"
    ) {
      let createBook = Book({
        authorId: req.body.authorId,
        title: req.body.title,
        purchaseUrl: req.body.purchaseUrl,
        rating: req.body.rating,
        ordinal: 99999
      });

      createBook.save((err) => {
        if (err) throw Error(err);

        res.send(createBook._id);
      });
    } else {
      Book.findByIdAndUpdate(
        req.body.id,
        {
          $set: {
            authorId: req.body.authorId,
            title: req.body.title,
            purchaseUrl: req.body.purchaseUrl,
            rating: req.body.rating
          }
        },
        { upsert: false },
        (err) => {
          if (err) throw Error(err);
          res.send(req.body.id);
        }
      );
    }
  }
};

exports.updateDisplayOrder = (req, res) => {
  req.body.forEach(book => {
    Book.findByIdAndUpdate(
      book._id,
      {
        $set: {
          ordinal: book.ordinal
        }
      },
      { upsert: true },
      (err) => {
        if (err) throw Error(err);
        //console.log(bookUpdated);
      }
    );
  });
  res.json("done");
};

exports.adminBookImageUpload = (req, res) => {
  let images = image.uploadAndResize("book", req);
  images.then(resp => {
    Book.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          image: resp[0].name,
          imageHeight: resp[0].height,
          imageWidth: resp[0].width,
          thumbNail: resp[1].name,
          thumbNailHeight: resp[1].height,
          thumbNailWidth: resp[1].width
        }
      },
      { upsert: false },
      (err) => {
        if (err) throw Error(err);

        res.send(resp);
      }
    );
  });
};

exports.adminBookImageDelete = (req, res) => {
  let images = image.deleteImages(req);
  images.then(resp => {
    Book.findByIdAndUpdate(
      req.body.id,
      {
        $unset: {
          image: 1,
          imageHeight: 1,
          imageWidth: 1,
          thumbNail: 1,
          thumbNailHeight: 1,
          thumbNailWidth: 1
        }
      },
      (err) => {
        if (err) throw Error(err);
        res.send(resp);
      }
    );
  });
};
