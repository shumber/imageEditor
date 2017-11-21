/*
Todo: 
  add unique ID hash to filenames so that server side can deal with multiple users.
  add better error status codes for each function.
  add function to handle different image types, so you get back the same type you submitted.
  add function to delete images that are no longer in use.

*/
const express = require('express');
const multer  = require('multer');
const upload = multer();
const fs = require('fs');
var bodyParser = require('body-parser')
var gm = require('gm');
var request = require('request');
var path = require('path');
var uuid = require('node-uuid');

var uniqueID = uuid.v4();

const port = 8888;

const app = express();

const commands = ["Rotate", "Crop", "Resize"];
var imageID = 0;
var imageURL = ""
var out = 'public/images/doodle.png';
var imageLoaded = 0;
var imageName = "public/images/doodle.png"
//var imageName = 'public/images/doodle' + uniqueID + '.png';

app.use('/', express.static('public'));

app.get('/api/image/commands', (req, res) => {
    res.json({ commands });
})

app.post('/api/image/reset', (req, res) => {
  if (imageLoaded) {
    request(imageURL)
    .pipe(fs.createWriteStream(imageName))
    .on('close', function() {
      res.status(200).send();
      imageLoaded = 1;
    });
  }else {
    res.status(400).send();
  }
});

app.post('/api/image', upload.array(), (req, res) => {
  if (req.body.url) {
    console.log(req.body.url);
    imageURL = req.body.url;
    request(imageURL)
    .pipe(fs.createWriteStream(imageName))
    .on('close', function() {
      res.status(200).send();
      imageLoaded = 1;
    });
  } else {
    res.status(400).send();
  }
});

app.post('/api/image/rotate', upload.array(), (req, res) => {
  if (imageLoaded) {
    //var imageName = "public/images/doodle.png"
    console.log(imageName);
    console.log(req.body.bgColor);
    console.log(req.body.degrees);
    gm(imageName)
    .rotate(req.body.bgColor, req.body.degrees)
    .write(out, function (err) {
      if (!err) console.log('done');
      else console.log(err);
      res.status(200).send();
    });
  }else {
    res.status(400).send();
  }
});

app.post('/api/image/resize', upload.array(), (req, res) => {
  if (imageLoaded) {  
    //var imageName = "public/images/doodle.png"
    var x;
    var y;
    var aspect;
    if (req.body.x){
      x = req.body.x;
    }
    else{ x = Null};

    if (req.body.y) {
      y = req.body.y;
    }
    else { y = Null };

    if (req.body.aspect)
      aspect = "!"
    else { aspect = Null};
    console.log(x)
    console.log(y)
    console.log(aspect)
    gm(imageName)
    .resize(x, y, aspect)
    .write(out, function (err) {
      if (!err) console.log('done');
      else console.log(err);
      res.status(200).send();
    });
  } else {
    res.status(400).send();
  }
});

app.post('/api/image/crop', upload.array(), (req, res) => {
  if (imageLoaded) {
    gm(imageName)
    .crop(req.body.width, req.body.height, req.body.x, req.body.y)
    .write(out, function (err) {
      if (!err) console.log('done');
      else console.log(err);
      res.status(200).send();
    });
  }else {
    res.status(400).send();
  }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});