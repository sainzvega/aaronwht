const Author = require("../models/author");
const image = require("../utilities/s3");

exports.authors = async (req, res) => {
  let page = req.params.page;
  const limit = 25;

  if (typeof page === "undefined" || isNaN(page)) page = 0;
  else page = page * limit - limit;

  let authorQuery = Author.find({})
    .select("fullName firstName middleName lastName thumbNail")
    .sort({ name: -1 })
    .skip(page)
    .limit(limit);

  const [authors, authorsTotalRecords] = await Promise.all([
    authorQuery,
    Author.find({}).count()
  ]);
  let returnedData = {};
  returnedData.authors = authors;
  returnedData.maxRecordsReturned = limit;
  returnedData.totalRecords = authorsTotalRecords;
  return res.json(returnedData);
};

exports.search = (req, res) => {
  if (
    req.params.name === null ||
    typeof req.params.name === "undefined" ||
    req.params.name === ""
  ) {
    return;
  }

  let name = new RegExp(req.params.name.toLowerCase(), "i");

  Author.find({ fullName: name })
    .select("fullName firstName middleName lastName")
    .then(results => {
      res.json(results);
    });
};

exports.adminAuthors = async (req, res) => {
  let page = req.params.page;
  const limit = 100;

  if (typeof page === "undefined" || isNaN(page)) page = 0;
  else page = page * limit - limit;

  const authorsQuery = Author.find({})
    .select("fullName firstName middleName lastName thumbNail")
    .sort({ lastName: 1 })
    .skip(page)
    .limit(limit);
  const [authors, authorsTotalRecords] = await Promise.all([
    authorsQuery,
    Author.find({}).count()
  ]);
  let returnedData = {};
  returnedData.authors = authors;
  returnedData.maxRecordsReturned = limit;
  returnedData.totalRecords = authorsTotalRecords;
  res.json(returnedData);
};

exports.adminAuthor = (req, res) => {
  if (req.params.id !== "undefined" && req.params.id !== "0") {
    Author.findById(req.params.id, (err, author) => {
      if (err) throw Error(err);

      res.json(author);
    });
  } else {
    res.json("");
  }
};

exports.createOrUpdate = (req, res) => {
  let fullName = req.body.firstName.trim() + " " + req.body.lastName.trim();
  if (req.body.middleName !== null && typeof req.body.middleName !== "undefined" && req.body.middleName.trim() !== "") {
    fullName = req.body.firstName.trim() + " " + req.body.middleName.trim() + " " + req.body.lastName.trim();
  }

  if (req.body.id === null || typeof req.body.id === "undefined" || req.body.id === "0") {
    Author.findOne({
      fullName: {
        $regex: new RegExp("^" + fullName.toLowerCase(), "i")
      }
    }).then(existingAuthor => {
      if (existingAuthor === null) {
        let createAuthor = Author({
          firstName: req.body.firstName.trim(),
          middleName: req.body.middleName.trim(),
          lastName: req.body.lastName.trim(),
          fullName: fullName.trim()
        });

        createAuthor.save((err) => {
          if (err) throw Error(err);

          res.send(createAuthor._id);
        });
      }
    });
  } else {
    Author.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          firstName: req.body.firstName.trim(),
          middleName: req.body.middleName.trim(),
          lastName: req.body.lastName.trim(),
          fullName: fullName.trim()
        }
      },
      { upsert: false },
      (err) => {
        if (err) throw Error(err);
        res.send(req.body.id);
      }
    );
  }
};

exports.adminAuthorImageUpload = (req, res) => {
  let images = image.uploadAndResize("author", req);
  images.then(resp => {
    Author.findByIdAndUpdate(
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

exports.adminAuthorImageDelete = (req, res) => {
  let images = image.deleteImages(req);
  images.then(resp => {
    Author.findByIdAndUpdate(
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
