const Video = require("../models/video");
const moment = require("moment-timezone");
const config = require("../config");

exports.videos = async (req, res) => {
  let page = req.params.page;
  const limit = 25;

  if (typeof page === "undefined" || isNaN(page)) page = 0;
  else page = page * limit - limit;

  let videoQuery = Video.find({})
    .select("title url videoUrl mainVideo people publishDate, content")
    .sort({ content: -1 })
    .skip(page)
    .limit(limit);

  const [videos, videosTotalRecords] = await Promise.all([
    videoQuery,
    Video.find({}).count()
  ]);
  let returnedData = {};
  returnedData.videos = videos;
  returnedData.maxRecordsReturned = limit;
  returnedData.totalRecords = videosTotalRecords;
  return res.json(returnedData);
};

exports.adminVideos = async (req, res) => {
  let page = req.params.page;
  const limit = 25;

  if (typeof page === "undefined" || isNaN(page)) page = 0;
  else page = page * limit - limit;

  let videoQuery = Video.find({})
    .sort({ url: -1 })
    .select("title publishDate url videoUrl")
    .skip(page)
    .limit(limit);
  const [videos, videosTotalRecords] = await Promise.all([
    videoQuery,
    Video.find({}).count()
  ]);
  let returnedData = {};
  returnedData.videos = videos;
  returnedData.maxRecordsReturned = limit;
  returnedData.totalRecords = videosTotalRecords;
  return res.json(returnedData);
};

exports.adminVideo = (req, res) => {
  if (req.params.id !== "undefined") {
    Video.findById(req.params.id, (err, video) => {
      if (err) throw Error(err);

      res.json(video);
    });
  }
};

exports.createOrUpdate = (req, res) => {
  let url = req.body.url.toLowerCase();
  if (url === "") {
    if (req.body.title !== "") {
      url = req.body.title.toLowerCase();
    } else {
      url = "new-blog-post";
    }
  }

  url = url.replace(/\s+/g, "-");
  url = url.replace(/[^a-z-0-9]+/gi, "");
  if (url === "") {
    url = "new-video";
  }

  let publishDate = moment(req.body.publishDate)
    .utc()
    .format("MM/DD/YY");

  Video.find({ url: { $regex: new RegExp("^" + url, "i") } }, (err, videos) => {
    if (err) throw Error(err);

    if (videos) {
      let urlMatchFound;
      let urlExists = false;
      do {
        urlMatchFound = false;

        videos.forEach(video => {
          if (video.url === url && req.body.id !== video._id.toString()) {
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
      req.body.id === null ||
      typeof req.body.id === "undefined" ||
      req.body.id === "0"
    ) {
      var createOrUpdateVideo = Video({
        title: req.body.title,
        url: url,
        videoUrl: req.body.videoUrl,
        content: req.body.content,
        publishDate: publishDate,
        people: req.body.people,
        mainVideo: req.body.mainVideo
      });

      createOrUpdateVideo.save((err) => {
        if (err) throw Error(err);

        res.send(createOrUpdateVideo._id);
      });
    } else {
      Video.findByIdAndUpdate(
        req.body.id,
        {
          $set: {
            title: req.body.title,
            url: url,
            videoUrl: req.body.videoUrl,
            content: req.body.content,
            publishDate: publishDate,
            people: req.body.people,
            mainVideo: req.body.mainVideo
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
};
