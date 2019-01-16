const Quote = require('../models/quote');
const Author = require('../models/author');

module.exports.quotes = async (req, res) => {
  const authorsQuery = Author.find({});

  const quotesQuery = Quote.find({})
    .select('id content authorId')
    .sort({ content: -1 });

  const [quotes, authors, quotesTotalRecords] = await Promise.all([
    quotesQuery,
    authorsQuery,
    Quote.find({}).count(),
  ]);
  const jsonQuotes = [];

  for (let i = 0; i < quotes.length; i++) {
    let quote = {};
    quote._id = quotes[i]._id;
    quote.content = quotes[i].content;

    for (let x = 0; x < authors.length; x++) {
      if (
        quotes[i].toObject().hasOwnProperty('authorId')
        && quotes[i].authorId.toString() === authors[x]._id.toString()
      ) {
        quote.author = authors[x].fullName;
        quote.thumbNail = authors[x].thumbNail;
      }
    }

    jsonQuotes.push(quote);
  }

  const returnedData = {};
  returnedData.quotes = jsonQuotes;
  returnedData.maxRecordsReturned = quotesTotalRecords;
  returnedData.totalRecords = quotesTotalRecords;
  res.json(returnedData);
};

module.exports.adminQuote = (req, res) => {
  if (typeof req.params.id !== 'undefined' && req.params.id === '0') {
    res.json('');
  }

  Quote.findById(req.params.id, (err, quote) => {
    if (err) throw Error(err);

    const jsonQuote = quote;
    if (
      quote.toObject().hasOwnProperty('authorId')
      && quote.authorId !== null
    ) {
      jsonQuote.content = quote.content;
      Author.findById(quote.authorId, (err, author) => {
        if (author !== null && typeof author !== 'undefined') {
          jsonQuote.author = author.fullName;
          jsonQuote.image = author.image;
          jsonQuote.thumbNail = author.thumbNail;
          jsonQuote.thumbNailHeight = author.thumbNailHeight;
          jsonQuote.thumbNailWidth = author.thumbNailWidth;
        }

        res.json(jsonQuote);
      });
    } else {
      res.json(quote);
    }
  });
};

module.exports.createOrUpdate = (req, res) => {
  if (req.body.authorId === 0 && req.body.author !== '') {
    let author = req.body.author.trim();
    let authorFirstName = '';
    let authorLastName = '';

    if (author.indexOf(' ') >= 0) {
      const authorAry = author.split(' ');
      authorFirstName = authorAry[0];
      for (let i = 1; i < authorAry.length; i++) {
        authorLastName += `${authorAry[i]} `;
      }

      authorLastName = authorLastName.trim();
    } else {
      authorLastName = author;
    }

    let createAuthor = Author({
      firstName: authorFirstName,
      middleName: '',
      lastName: authorLastName,
      fullName: author.trim()
    });

    createAuthor.save((err, author) => {
      if (err) throw Error(err);

      if (
        req.body.id === null
        || typeof req.body.id === 'undefined'
        || req.body.id === '0'
      ) {
        let createOrUpdateQuote = Quote({
          authorId: author._id,
          content: req.body.content
        });

        createOrUpdateQuote.save((err) => {
          if (err) throw Error(err);

          res.send(createOrUpdateQuote._id);
        });
      } else {
        Quote.findByIdAndUpdate(
          req.body.id,
          {
            $set: {
              authorId: author._id,
              content: req.body.content,
            },
          },
          { upsert: false },
          (err) => {
            if (err) throw Error(err);

            res.send(req.body.id);
          },
        );
      }
    });
  } else if (
    req.body.id === null
    || typeof req.body.id === 'undefined'
    || req.body.id === '0'
  ) {
    let createOrUpdateQuote = Quote({
      authorId: req.body.authorId,
      content: req.body.content,
    });

    createOrUpdateQuote.save((err) => {
      if (err) throw Error(err);

      res.send(createOrUpdateQuote._id);
    });
  } else {
    Quote.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          authorId: req.body.authorId,
          content: req.body.content,
        }
      },
      { upsert: false },
      (err) => {
        if (err) throw Error(err);

        res.send(req.body.id);
      },
    );
  }
};
