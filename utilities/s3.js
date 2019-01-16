const AWS = require('aws-sdk');
const sharp = require("sharp");
const http = require("http");
const url = require("url");
const sizeOf = require("image-size");

exports.uploadAndResize = (imageType, req, callback) => {
    let images = [];
    let image = {};
    let height = 350;
    let width = 350;

    if (imageType === "author") {
        height = 100;
        width = 100;
    } else if (imageType === "book") {
        height = 150;
        width = 150;
    }

    return new Promise((resolve) => {
        let fileName = req.files.file.name.toLowerCase();
        let thumbNail = "";

        if (fileName === "") {
            return;
        }

        fileName = fileName.replace(/[^a-z-0-9._ ]+/gi, " ");
        if (fileName === "") {
            return;
        }

        let existingFileName = "";

        if (fileName.indexOf(" ") >= 0) {
            let newFileName = "";
            existingFileName = fileName.split(" ");
            for (let i = 0; i < existingFileName.length; i++) {
                newFileName = newFileName + existingFileName[i] + "-";
            }

            fileName = newFileName.substr(0, newFileName.length - 1);
        }

        if (fileName.indexOf(".") >= 0) {
            thumbNail = "";
            existingFileName = fileName.split(".");
            for (let i = 0; i < existingFileName.length; i++) {
                if (i === existingFileName.length - 1) {
                    thumbNail = thumbNail + "-th." + existingFileName[i];
                } else {
                    thumbNail = thumbNail + existingFileName[i];
                }
            }
        }

        let s3bucket = new AWS.S3({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            Bucket: process.env.S3_BUCKET
        });

        s3bucket.createBucket(() => {
            let params = {
                Bucket: process.env.IMAGE_BUCKET + "/" + process.env.IMAGE_BUCKET_FOLDER,
                Key: fileName,
                Body: req.files.file["data"]
            };

            s3bucket.upload(params, (err) => {
                if (err) throw Error(err);

                http.get(url.parse(process.env.IMAGE_URL + process.env.IMAGE_BUCKET + "/" + process.env.IMAGE_BUCKET_FOLDER + "/" + fileName), (response) => {
                    let chunks = [];
                    response.on('data', (chunk) => {
                        chunks.push(chunk);
                    }).on('end', () => {
                        let buffer = Buffer.concat(chunks);
                        image.name = fileName;
                        image.height = sizeOf(buffer).height;
                        image.width = sizeOf(buffer).width;
                        images.push(image);

                        sharp(req.files.file["data"]).resize(width, height).max().toBuffer().then((returnedImage) => {
                            params = {
                                Bucket: process.env.IMAGE_BUCKET + "/" + process.env.IMAGE_BUCKET_FOLDER,
                                Key: thumbNail,
                                Body: returnedImage
                            };

                            image = {};

                            s3bucket.upload(params, (err) => {
                                if (err) throw Error(err);

                                http.get(url.parse(process.env.IMAGE_URL + process.env.IMAGE_BUCKET + "/" + process.env.IMAGE_BUCKET_FOLDER + "/" + thumbNail), (response) => {
                                    chunks = [];
                                    response.on('data', (chunk) => {
                                        chunks.push(chunk);
                                    }).on('end', () => {
                                        buffer = Buffer.concat(chunks);
                                        image.name = thumbNail;
                                        image.height = sizeOf(buffer).height;
                                        image.width = sizeOf(buffer).width;
                                        images.push(image);

                                        return callback ? callback(images) : resolve(images);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

exports.deleteImages = (req, callback) => {
    return new Promise((resolve) => {
        let thumbNailId = req.body.thumbNail;
        let imageId = req.body.image;
        let existingFileName = "";

        if (thumbNailId.indexOf("/" >= 0)) {
            existingFileName = thumbNailId.split("/");
            for (let i = 0; i < existingFileName.length; i++) {
                if (i + 1 === existingFileName.length) {
                    thumbNailId = existingFileName[i];
                }
            }
        }

        if (imageId.indexOf("/" >= 0)) {
            existingFileName = imageId.split("/");
            for (let i = 0; i < existingFileName.length; i++) {
                if (i + 1 === existingFileName.length) {
                    imageId = existingFileName[i];
                }
            }
        }

        let s3bucket = new AWS.S3({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            Bucket: process.env.S3_BUCKET
        });

        let params = {
            Bucket: process.env.S3_BUCKET,
            Delete: {
                Objects: [
                    { Key: "images/" + imageId },
                    { Key: "images/" + thumbNailId }
                ],
            },
        };

        s3bucket.deleteObjects(params, (err) => {
            if (err) throw Error(err);

            return callback ? callback(null) : resolve(null);
        });
    });
};