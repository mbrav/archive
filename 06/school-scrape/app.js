var cheerio = require('cheerio');
var request = require('request');
var jsonfile = require('jsonfile');
var fs = require('fs');
var exec = require('child_process').exec;


// scraping Parsons Student Work/
parsonStudentWork();
function parsonStudentWork() {

  var baseURL = 'http://www.newschool.edu'
  request({
    method: 'GET',
    url: 'http://www.newschool.edu/parsons/student-work/'
  }, function(err, response, body) {
    if (err) return console.error(err);

    $ = cheerio.load(body);

    $('div.column').each(function() {
      var img = $('img', this);
      var majorName = $('p.profile-program-name', this).text();

      console.log('http://www.newschool.edu' + img.attr('src')); // just links

      var command = 'wget "' + baseURL + img.attr('src') + '" -P ./parsons-img-scrapes';

      console.log(command);
      if (img.attr('src') != null) {
        exec(command, (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
        });
      }

    });
  });
}
