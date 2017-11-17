const express = require('express');
const multer  = require('multer');
const upload = multer();
const fs = require('fs');
var bodyParser = require('body-parser')
var gm = require('gm');
var request = require('request');

const port = 8888;

const app = express();

const commands = ["Rotate", "Crop", "Resize"];
var imageID = 0;
var imageURL = ""
var out = 'test.png';

app.use('/', express.static('public'));

app.get('/api/image/commands', (req, res) => {
    res.json({ commands });
})

app.post('/api/image', upload.array(), (req, res) => {
  if (req.body.url) {
    request(req.body.url).pipe(fs.createWriteStream('doodle.png')).on('close', res.status(200).send());
  }
  res.status(400).send();
})

app.post('/api/image/rotate', upload.array(), (req, res) => {
  console.log('done');
  var imageName = "doodle.png"
  console.log(imageName);
  console.log(req.body.bgColor);
  console.log(req.body.degrees);
  gm(imageName)
  .rotate(req.body.bgColor, req.body.degrees)
  .write(out, function (err) {
    if (!err) console.log('done');
    else console.log(err);
  });
  
      res.status(200).send();
  if (req.body.url) {
    request(req.body.url).pipe(fs.createWriteStream('doodle.png')).on('close', process);
  }
  res.status(400).send();

});

app.post('/api/image/resize', upload.array(), (req, res) => {
  var process = function(){
    var imageName = "doodle.png"
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
    });
  }
  
  if (req.body.url) {
    request(req.body.url).pipe(fs.createWriteStream('doodle.png')).on('close', process);
  }
  res.status(400).send();
})

app.post('/api/image/crop', upload.array(), (req, res) => {
  var process = function(){
    var imageName = "doodle.png"
    gm(imageName)
    .crop(req.body.width, req.body.height, req.body.x, req.body.y)
    .write(out, function (err) {
      if (!err) console.log('done');
    });
  }
  
  if (req.body.url) {
    request(req.body.url).pipe(fs.createWriteStream('doodle.png')).on('close', process);
  }
  res.status(400).send();
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
