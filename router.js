const passport = require('passport');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const fs = require('fs');
const Homepage = require('./controllers/homepage');
const Authentication = require('./controllers/authentication');
const Author = require('./controllers/authors');
const Blog = require('./controllers/blog');
const Book = require('./controllers/books');
const Email = require('./controllers/email');
const Quote = require('./controllers/quotes');
const Video = require('./controllers/videos');

dotenv.load();

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {
  const os = require('os');
  const mongoose = require('mongoose');

  if (os.hostname().indexOf('local') > -1) {
    mongoose.connect("mongodb://localhost:27017/" + process.env.MONGODB_NAME);
  } else {
    mongoose.connect(process.env.MONGODB_URI);
  }

  app.get('/api/admin', requireAuth, (req, res) => {
    res.send({ message: 'Authentication error' });
  });

  app.post('/api/signin', Authentication.signin);
  app.post('/api/signup', Authentication.signup);
  app.get('/api/homepage', Homepage.homepage);
  app.use(fileUpload());

  app.get('/api/files', (req, res) => {
    let files = '';

    fs.readdirSync('/static').forEach((file) => {
      files += `${ file }, `;
    });

    return res.send(files);
  });

  app.get('/api/blog/:page?', Blog.articles);
  app.get('/api/blog/find/:title', Blog.search);
  app.get('/api/blog/article/:url?', Blog.article);
  app.get('/api/quotes/:page?', Quote.quotes);
  app.post('/api/email', Email.sendEmail);
  app.get('/api/videos/:page?', Video.videos);
  app.get('/api/admin/blog/:page?', Blog.adminArticles);
  app.get('/api/admin/blog/find/:title', Blog.adminSearch);
  app.get('/api/admin/blog/article/:id', Blog.adminArticle);
  app.post('/api/admin/blog/article/createOrUpdate', Blog.createOrUpdate);
  app.post('/api/admin/blog/articleUpload', Blog.adminArticleImageUpload);
  app.post('/api/admin/blog/articleImageDelete', Blog.adminArticleImageDelete);
  app.get('/api/books/:page?', Book.books);
  app.get('/api/book/:id', Book.book);
  app.post('/api/admin/books/updateDisplayOrder', Book.updateDisplayOrder);
  app.post('/api/admin/book/createOrUpdate', Book.createOrUpdate);
  app.post('/api/admin/book/bookUpload', Book.adminBookImageUpload);
  app.post('/api/admin/book/bookImageDelete', Book.adminBookImageDelete);
  app.get('/api/admin/quote/:id', Quote.adminQuote);
  app.post('/api/admin/quote/createOrUpdate', Quote.createOrUpdate);
  app.get('/api/admin/authors/:page?', Author.adminAuthors);
  app.get('/api/admin/authors/find/:name', Author.search);
  app.get('/api/admin/author/:id', Author.adminAuthor);
  app.post('/api/admin/author/createOrUpdate', Author.createOrUpdate);
  app.post('/api/admin/author/authorUpload', Author.adminAuthorImageUpload);
  app.post('/api/admin/author/authorImageDelete', Author.adminAuthorImageDelete);
  app.get('/api/admin/videos/:page?', Video.adminVideos);
  app.get('/api/admin/video/:id', Video.adminVideo);
  app.post('/api/admin/video/createOrUpdate', Video.createOrUpdate);
};
