const BlogArticle = require("../models/blog");
const Quote = require("../models/quote");
const Author = require("../models/author");
const moment = require('moment-timezone');

module.exports.homepage = async (req, res) => {
  const minPublishDate = moment()
    .utc()
    .format('MM/DD/YY');

  const featuredBlogArticleQuery = BlogArticle.findOne({
    isActive: true,
    publishDate: { $lte: minPublishDate },
  })
    .select('title url publishDate content')
    .sort({ publishDate: -1 })
    .limit(1);

  const blogArticlesQuery = BlogArticle.find({
    isActive: true,
    publishDate: { $lte: minPublishDate },
  })
    .select('title url publishDate')
    .sort({ publishDate: -1 })
    .skip(1)
    .limit(5);

  const quotesQuery = Quote.find({}).select('authorId content');
  const authorsQuery = Author.find({});

  const [
    featuredBlogArticle,
    blogArticles,
    quotes,
    authors
  ] = await Promise.all([
    featuredBlogArticleQuery,
    blogArticlesQuery,
    quotesQuery,
    authorsQuery
  ]);

  const homepage = {};
  homepage.featuredBlogArticle = featuredBlogArticle;
  homepage.blogArticles = blogArticles;

  let randomNumber = (Math.random().toFixed(2) * 100).toFixed(0);

  if (quotes.length > 0) {
    while (randomNumber > quotes.length - 1) {
      randomNumber = (Math.random().toFixed(2) * 100).toFixed(0);
    }
  }

  const quote = quotes[randomNumber];

  for (let x = 0; x < authors.length; x++) {
    if (
      quote !== null
      && typeof quote !== 'undefined'
      && quote.toObject().hasOwnProperty('authorId')
      && quote.authorId.toString() === authors[x]._id.toString()
    ) {
      quote.author = authors[x].fullName;
      quote.thumbNail = authors[x].thumbNail;
      quote.thumbNailHeight = authors[x].thumbNailHeight;
      quote.thumbNailWidth = authors[x].thumbNailWidth;
    }
  }

  homepage.quote = quote;

  return res.json(homepage);
};
