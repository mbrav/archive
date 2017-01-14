//Terra form
//created by Michael Braverman on June 16, 2016
// Based on Marijn Haverbeke's code from his book  "Eloquent JavaScript"

var landscape = function() {
   var result = "";
   var flat = function(size) {
     for (var count = 0; count < size; count++) result += "_";
   };
   var mountain = function(size) {
     result += "/";
     for (var count = 0; count < size; count++) result += "'";
     result += "\\";
   };

   for (var i = 0; i < 40; i++) {
     var randomNum = Math.floor(Math.random() * 40);
     flat(randomNum);
     randomNum = Math.floor(Math.random() * 6);
     mountain(randomNum);
   }
   return result;
};

setInterval(function(){
  console.log(landscape());

}, 500);
