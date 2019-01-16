const moment = require('moment-timezone');
const BlogArticle = require('../models/blog');
const config = require('../config');

module.exports.articles = async (req, res) => {
  let { page } = req.params;
  const limit = 25;

  if (typeof page === 'undefined' || isNaN(page)) {
    page = 0;
  } else {
    page = page * limit - limit;
  }

  const minPublishDate = moment()
    .utc()
    .format('MM/DD/YY');

  const blogQuery = BlogArticle.find({
    isActive: true,
    publishDate: { $lte: minPublishDate }
  })
    .select('title url publishDate')
    .sort({ publishDate: -1 })
    .skip(page)
    .limit(limit);
  const [blogArticles, blogArticlesTotalRecords] = await Promise.all([
    blogQuery,
    BlogArticle.find({
      isActive: true,
      publishDate: { $lte: minPublishDate }
    }).count()
  ]);
  const returnedData = {};
  returnedData.blogArticles = blogArticles;
  returnedData.maxRecordsReturned = limit;
  returnedData.totalRecords = blogArticlesTotalRecords;
  return res.json(returnedData);
};

module.exports.adminArticles = async (req, res) => {
  let { page } = req.params;
  const limit = 100;

  if (typeof page === 'undefined' || isNaN(Number(page))) page = 0;
  else page = page * limit - limit;

  const blogQuery = BlogArticle.find({})
    .sort({ publishDate: -1 })
    .select('title url isActive publishDate')
    .skip(page)
    .limit(limit);
  const [blogArticles, blogArticlesTotalRecords] = await Promise.all([
    blogQuery,
    BlogArticle.find({}).count(),
  ]);
  const returnedData = {};
  returnedData.blogArticles = blogArticles;
  returnedData.maxRecordsReturned = limit;
  returnedData.totalRecords = blogArticlesTotalRecords;
  return res.json(returnedData);
};

module.exports.adminSearch = async (req, res) => {
  let { page } = req.params;
  const limit = 25;

  if (typeof page === 'undefined' || isNaN(page)) page = 0;
  else page = page * limit - limit;

  const blogArticleQsuery = BlogArticle.find({
    title: { $regex: new RegExp(`^${req.params.title.toLowerCase()}`, 'i') },
  })
    .sort({ title: 1 })
    .select('title url publishDate')
    .skip(page)
    .limit(limit);

  const [blogArticles, blogArticlesTotalRecords] = await Promise.all([
    blogArticleQsuery,
    BlogArticle.find({
      title: { $regex: new RegExp(`^${req.params.title.toLowerCase()}`, 'i') },
    }).count(),
  ]);
  const returnedData = {};
  returnedData.blogArticles = blogArticles;
  returnedData.maxRecordsReturned = limit;
  returnedData.totalRecords = blogArticlesTotalRecords;
  return res.json(returnedData);
};

module.exports.search = async (req, res) => {
  let { page } = req.params;
  const limit = 25;

  if (typeof page === 'undefined' || isNaN(page)) page = 0;
  else page = page * limit - limit;

  const minPublishDate = moment()
    .utc()
    .format('MM/DD/YY');

  const blogArticlesQuery = BlogArticle.find(
    {
      $text: {
        $search: req.params.title.toLowerCase(),
        $language: 'en',
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
      isActive: true,
      publishDate: { $lte: minPublishDate },
    },
    { score: { $meta: 'textScore' } },
  )
    .sort({ score: { $meta: 'textScore' } })
    .select('title url publishDate')
    .skip(page)
    .limit(limit);
  const [blogArticles, blogArticlesTotalRecods] = await Promise.all([
    blogArticlesQuery,
    BlogArticle.find({
      $text: { $search: req.params.title.toLowerCase() },
      isActive: true,
      publishDate: { $lte: minPublishDate }
    }).count()
  ]);
  const returnedData = {};
  returnedData.blogArticles = blogArticles;
  returnedData.maxRecordsReturned = limit;
  returnedData.totalRecords = blogArticlesTotalRecods;
  return res.json(returnedData);
};

module.exports.adminArticle = (req, res) => {
  if (req.params.id !== 'undefined' && req.params.id !== '0') {
    BlogArticle.findById(req.params.id, (err, blogArticle) => {
      if (err) throw new Error(err);

      res.json(blogArticle);
    });
  }
};

module.exports.adminArticleImageUpload = (req, res) => {
  const images = image.uploadAndResize('blog', req);
  images.then((resp) => {
    BlogArticle.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          image: resp[0],
          thumbNail: resp[1]
        }
      },
      { upsert: false },
      (err) => {
        if (err) throw new Error(err);
        res.send(resp);
      },
    );
  });
};

module.exports.adminArticleImageDelete = (req, res) => {
  const images = image.deleteImages(req);
  images.then((resp) => {
    BlogArticle.findByIdAndUpdate(
      req.body.id,
      {
        $unset: {
          image: 1,
          thumbNail: 1
        }
      },
      (err) => {
        if (err) throw new Error(err);
        res.send(resp);
      },
    );
  });
};

module.exports.article = (req, res) => {
  if (req.params.url == null || typeof req.params.url === 'undefined') {
    res.json({
      _id: 0,
      title: 'Blog Not Found',
      url: 'not-found',
      content: 'Blog article not found'
    });
    return;
  }

  const minPublishDate = new Date();
  minPublishDate.setDate(minPublishDate.getDate());

  BlogArticle.findOne(
    {
      url: req.params.url,
      isActive: true,
      publishDate: { $lte: minPublishDate }
    },
    (err, blogArticle) => {
      if (err) throw Error(err);
      if (!blogArticle) {
        res.json({ _id: 0, title: 'Blog Not Found', url: 'not-found' });
        return;
      }

      res.json(blogArticle);
    },
  );
};


module.exports.createOrUpdate = (req, res) => {
  let url = req.body.url.toLowerCase();
  if (url === '') {
    if (req.body.title !== '') {
      url = req.body.title.toLowerCase();
    } else {
      url = 'new-blog-post';
    }
  }

  url = url.replace(/\s+/g, '-');
  url = url.replace(/[^a-z-0-9]+/gi, '');
  if (url === '') {
    url = 'new-blog-post';
  }

  const publishDate = moment(req.body.publishDate)
    .utc()
    .format('MM/DD/YY');

  BlogArticle.find({ url: { $regex: new RegExp(`^${url}`, 'i') } }, (
    err,
    blogArticles,
  ) => {
    if (blogArticles) {
      let urlMatchFound;
      let urlExists = false;
      do {
        urlMatchFound = false;

        blogArticles.forEach((blogArticle) => {
          if (
            blogArticle.url === url
            && req.body.id !== blogArticle._id.toString()
          ) {
            urlMatchFound = true;
            urlExists = true;
            url = config().incrementUrl(url);
          }
        });

        if (!urlMatchFound) {
          urlExists = false;
        }
      } while (urlExists);
    }

    if (
      req.body.id === null
      || typeof req.body.id === 'undefined'
      || req.body.id === 0
    ) {
      const createOrUpdateBlog = BlogArticle({
        title: req.body.title,
        content: req.body.content,
        url,
        isActive: req.body.isActive,
        publishDate
      });

      createOrUpdateBlog.save((err) => {
        if (err) throw Error(err);

        res.send(createOrUpdateBlog._id);
      });
    } else {
      BlogArticle.findByIdAndUpdate(
        req.body.id,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            url,
            isActive: req.body.isActive,
            publishDate
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
};
