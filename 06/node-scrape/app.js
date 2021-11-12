var cheerio = require('cheerio');
var request = require('request');
var jsonfile = require('jsonfile');
var fs = require('fs');
var exec = require('child_process').exec;

wikiFaces();
// momaPS1();
// parsonStudentWork();

// scraping wikiFaces past exibitions
function wikiFaces() {
  var baseURL = 'https://en.wikipedia.org';

  request({
    method: 'GET',
    url: baseURL + '/wiki/List_of_mineralogists'
  }, function(err, response, body) {
    if (err) return console.error(err);

    var fileName = 'mineralogists.csv';
    //setup the csv
    var csvInitText = "name, img, birth, death, length \n";
    fs.appendFile(fileName, csvInitText, function (err) {
      if (err) throw err;
    });

    var $ = cheerio.load(body);

    // got throught the list of people
    $('div.mw-content-ltr ul li').each(function() {
      var link = $('a', this);

      // person link
      var a = $('a', this);
      var l = baseURL + a.attr('href');

      // go to the link of the person's page
      request({
        method: 'GET',
        url: l
      }, function(err, response, body2) {
        if (err) return console.error(err);

        var $2 = cheerio.load(body2);

        var img = $2('table.infobox img', body2);
        var birth = $2('table.infobox .bday', body2);
        var death = $2('table.infobox .dday', body2);
        var title = $2('h1.firstHeading', body2);
        var textContent = $2('div.mw-content-ltr', body2);

        var txt = title.text().trim() + ", http:" + img.attr('src') + ", " + birth.text().trim() + ", " +  death.text().trim() + ", " + textContent.text().length + '\n';

        console.log(txt);

        // include only pages with images
        if (img.attr('src') != null) {
          fs.appendFile(fileName, txt, function (err) {
            if (err) throw err;
          });
        }

        // save files
        // var command = 'wget \'http:' + img.attr('src') + '\' -P ./wiki-faces-biologists';
        // if (img.attr('src') != null && img.attr('src') != undefined) {
        //   // console.log(command);
        //   exec(command, (err, stdout, stderr) => {
        //     if (err) {
        //       console.error(err);
        //       return;
        //     }
        //     console.log(stdout);
        //   });
        // }
      });
    });
  });
  // }
}

// scraping MoMaPS1 past exibitions
function momaPS1() {
  var baseURL = 'http://www.momaps1.org';

  request({
    method: 'GET',
    url: 'http://www.momaps1.org/exhibitions/'
  }, function(err, response, body) {
    if (err) return console.error(err);

    var $ = cheerio.load(body);

    $('div.exhibitionsublist ul li').each(function() {
      var link = $('a', this);
      console.log('Going into: ' + baseURL + link.attr('href'));

      // go to the link of the exibition
      request({
        method: 'GET',
        url: baseURL + link.attr('href')
      }, function(err, response, bod) {
        if (err) return console.error(err);

        var exPage = cheerio.load(bod);

        var title = exPage('h3.exhibit-title', bod);
        var img = exPage('div#slides img', bod);
        // console.log(title.text());
        console.log(baseURL + img.attr('src'));

        var command = 'wget "' + baseURL + img.attr('src') + '" -P ./ps1-img-scrapes';
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
  });
}

// scraping Parsons Student Work/
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

// Oh, I did not realize that haha.
