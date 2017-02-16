var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var exec = require('child_process').exec;
var crypto = require('crypto');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/gallery', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/gallery.html'));
});

app.post('/upload', function(req, res) {

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');
  console.log(form.uploadDir);

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    var newFileName = crypto.randomBytes(3).toString('hex');
    fs.rename(file.path, path.join(form.uploadDir, newFileName + '.jpg'));

    appendCSV(newFileName + '\n', './public/list.csv');

    var command = 'jp2a --html --width=200 --color ' + './uploads/' + newFileName + '.jpg > public/ascii/' + newFileName + '.html';
    console.log(command);
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
      exec('rm ./uploads/' + newFileName + '.jpg');
    });



  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success, image uploaded');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

// function for writing new entries
function appendCSV(string, file) {
  fs.appendFile(file, string, function (err) {
  });
}


var server = app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
