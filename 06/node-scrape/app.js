var cheerio = require('cheerio');
var request = require('request');

var exec = require('child_process').exec;

momaPS1();
// parsonStudentWork();

// scraping MoMaPS1 past exibitions
function momaPS1() {
  var baseURL = 'http://www.momaps1.org';
  request({
    method: 'GET',
    url: 'http://www.momaps1.org/exhibitions/'
  }, function(err, response, body) {
    if (err) return console.error(err);

    $ = cheerio.load(body);

    $('div.exhibitionsublist ul li').each(function() {
      var link = $('a', this);
      console.log('Going into: ' + baseURL + link.attr('href'));

      // go to the link of the exibition
      request({
        method: 'GET',
        url: 'http://www.momaps1.org' + link.attr('href')
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

        // var containter = exPage('div#maincontainer', bod);
        //
        // containter('p').each(function() {
        //   console.log(this);
        // });
        //
        // exPage('div.column').each(function() {
        // });

      });

    });
  });
}

// scraping Parsons Student Work/
function parsonStudentWork() {
  request({
    method: 'GET',
    url: 'http://www.newschool.edu/parsons/student-work/'
  }, function(err, response, body) {
    if (err) return console.error(err);

    $ = cheerio.load(body);

    // $('div.small-up-1').each(function() {
    //   var href = $('a', this).attr('href');
    //   if (href.lastIndexOf('/') > 0) {
    //     console.log($('h3', this).text()); // student name
    //   }
    // });
    // $('div.column').each(function() {
    //   var img = $('h3');
    //   console.log(img.text());
    // });

    $('div.column').each(function() {
      var img = $('img', this).attr('src');
      var majorName = $('p.profile-program-name', this).text();

      // console.log('![](http://www.newschool.edu' + img + ')'); // markdown images
      // console.log('http://www.newschool.edu' + img + ' , ' + majorName); // csv output
      console.log('http://www.newschool.edu' + img); // just links

    });

  });
}
