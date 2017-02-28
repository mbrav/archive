var cheerio = require('cheerio');
var request = require('request');
var sleep = require('sleep');

var exec = require('child_process').exec;

wikiFaces();
// momaPS1();
// parsonStudentWork();


function scrape(l) {
  request({
    method: 'GET',
    url: l
  }, function(err, response, body) {
    if (err) return console.error(err);
    console.log("HI!");
    console.log(body);
  });
}

function test(t) {
  console.log(t);
}

// function wikiFaces() {
//   var baseURL = 'https://en.wikipedia.org';
//
//   var first = "A",last = "Z";
//
//   for (var i = first.charCodeAt(0); i <= last.charCodeAt(0); i++) {
//     var letter = String.fromCharCode(i);
//
//     request({
//       method: 'GET',
//       url: baseURL + '/wiki/List_of_mathematicians_(' + letter + ')'
//     }, function(err, response, body) {
//       if (err) return console.error(err);
//
//       // console.log(body);
//
//       var $ = cheerio.load(body);
//
//       $('div.mw-content-ltr ul li').each(function() {
//
//         // person link
//         var a = $('a', this);
//         var l = baseURL + a.attr('href');
//         console.log('requesting: ' + l);
//
//
//         request('https://en.wikipedia.org', function(err, res, h) {
//           test("HI!!!!");
//           if (!err && res.statusCode == 200) {
//             console.log(h);
//             var $ = cheerio.load(h);
//           }
//         });
//
//       });
//
//     });
//   }
// }

// scraping wikiFaces past exibitions
function wikiFaces() {
  var baseURL = 'https://en.wikipedia.org';

  var first = "A",last = "Z";

  for (var i = first.charCodeAt(0); i <= last.charCodeAt(0); i++) {
    var letter = String.fromCharCode(i);

    request({
      method: 'GET',
      url: baseURL + '/wiki/List_of_mathematicians_(' + letter + ')'
    }, function(err, response, body) {
      if (err) return console.error(err);

      // console.log(body);

      var $ = cheerio.load(body);

      $('div.mw-content-ltr ul li').each(function() {
        var link = $('a', this);

        // person link
        var a = $('a', this);
        var l = baseURL + a.attr('href');
        // console.log('requesting: ' + l);

        // go to the link of the exibition
        request({
          method: 'GET',
          url: l
        }, function(err, response, body) {
          // if (err) return console.error(err);

          var $ = cheerio.load(body);

          var img = $('table.infobox img', body);
          var title = $('h1.firstHeading', body);

          var command = 'wget "' + img.attr('src') + '" -P ./wiki-faces-scrapes';

          if (img.attr('src') != null && img.attr('src') != undefined) {
            console.log(command);
            exec(command, (err, stdout, stderr) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log(stdout);
            });
          }

          // console.log(title.text(),img.attr('src'));

        });
      });
    });
  }
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
