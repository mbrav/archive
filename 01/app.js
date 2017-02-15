// Terra form
// created by Michael Braverman on Jan 29, 2017

var chalk = require('chalk');

var width = process.stdout.columns;
var height = process.stdout.rows;

var output;

setup();

setInterval(function() {
  output = landscape();
  console.log(output);
  console.reset;
}, 400);

function setup() {
  console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);
  output = "";
}

console.reset = function () {
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
         result += chalk.green("_");
       } else {
         result += chalk.yellow("_");
       }
     }
     plainOrDesert = !plainOrDesert;
   };

   var mountain = function(size) {
     result += chalk.gray("/");
     for (var count = 0; count < size; count++) result += chalk.white("'");
     result += chalk.gray("\\");
   };

   var ocean = function(size) {
     for (var count = 0; count < size; count++) result += chalk.blue("_");
   };

   for (var i = 0; i < 30; i++) {
     var randomNum = Math.floor(Math.random() * 50);
     flat(randomNum);
     randomNum = Math.floor(Math.random() * 2)+1;
     mountain(randomNum);
   }

   return result;
};
