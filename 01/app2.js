// Terra form
// created by Michael Braverman on Jan 29, 2017

// plain text version

var fs = require('fs'); // for saving files

var width = process.stdout.columns;
var height = process.stdout.rows;

var output;
var name;

setup();

setInterval(function() {
    output = "";
    // name of the artwork
    name = "terra-form-" + makeName(6, 2) + "-" + makeName(4, 3);

    for (var i = 0; i < height; i++) {
      output += landscape();
    }

    // add name
    output += "\n" + name;

    // save file
    saveFile(name, output)

    console.log(output);
    console.reset;
}, 50);

function setup() {
    console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);
    output = "";
}

console.reset = function() {
    return process.stdout.write('\033c');
}

var landscape = function() {

    var result = "";

    var plainOrDesert = true;

    var flat = function(size) {
        // a 10% chance that the type of terrain will switch
        if (Math.random() < 0.05) {
            plainOrDesert = !plainOrDesert;
        }

        // draw the plain
        for (var count = 0; count < size; count++) {
            // check whether it is a desert or a plain
            if (plainOrDesert) {
                result += "_";
            } else {
                result += "_";
            }
        }
        plainOrDesert = !plainOrDesert;
    };

    var mountain = function(size) {
        result += "/";
        for (var count = 0; count < size; count++) result += "'";
        result += "\\";
    };

    var ocean = function(size) {
        for (var count = 0; count < size; count++) result += "_";
    };

    for (var i = 0; i < width; i++) {
      var randomNum = Math.floor(Math.random() * 50);
      flat(randomNum);
      randomNum = Math.floor(Math.random() * 4);
      mountain(randomNum);
    }

    result = result.substring(0, width) + "\n";

    return result
};

function makeName(len, type) {
    var text = "";
    var possible = "";

    if (type == 0) {
      possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    } else if (type == 1) {
      possible = "bcdefghijklmnopqrstuvwxyz0123456789";
    } else if (type == 2) {
      possible = "0123456789";
    } else if (type == 3) {
      possible = "bcdefghijklmnopqrstuvwxyz";
    } else {
      possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    }

    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function saveFile(fileName, text) {
  fs.writeFile("output/" + fileName + ".txt", text, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}
