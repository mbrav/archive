// Oulipo

var primeNumbers = [2,3,5,7,11,13,17,19];
var blink = true;

var generated = false;

function setup() {
  noCanvas();
}

function draw() {
  if (frameCount % 10 == 0 && generated) {
    var title1 = select('.one');
    var title2 = select('.two');
    var title3 = select('.poemTitle');
    if (blink) {
      title1.attribute("id", "on");
      title2.attribute("id", "on");
      title3.attribute("id", "on");
    } else {
      title1.attribute("id", "off");
      title2.attribute("id", "off");
      title3.attribute("id", "off");
    }
    blink = !blink;
  }
}

// P5 CODE!
function generate() {
  // get the element from the text field
  var rawText = select('.enter');

  // get the text from the text field
  var arrayText = rawText.value().split(" ");
  var poemArray = [];
  var add = 0;

  // generate the poem into the poemArray
  for (var i = 0; i < arrayText.length * 10; i++) {

      add += primeNumbers[i % primeNumbers.length] + i;
      // console.log(add % arrayText.length);

      poemArray.push(arrayText[add % arrayText.length]);
  }

  // generate poem in html
  var title = createElement('h2', 'Generated Poem:');
  title.attribute('class', 'poemTitle');
  title.attribute('id', 'on');

  // create an 'output' div
  var output = createDiv(' ');
  output.attribute('class', 'output');

  for (var a = 1; a < 9; a++) {

    // create a 'paragraph' div in an 'output' div
    var paragraph = createDiv(' ');
    paragraph.attribute('class', 'paragraph')
    output.child(paragraph);

    // build sentence
    var sentence;
    for (var i = 1; i < 5; i++) {
        // randomize sentece lenght
        var randomSentenceSize = random(5,10);

        // construct sentence
        for (var j = 1; j < randomSentenceSize; j++) {
          sentence = sentence + poemArray[a*i*j] + ' ';
        }

        // output finished sentence
        paragraph.child(createP(sentence));

        // clear sentence
        sentence = '';
    }
  }
  console.log(poemArray);
  generated = true;
}

// //VANILLA JS CODE
// function generate2(id) {
//     var textBox = document.getElementById(id);
//
//     // get the text from the text field
//     var rawText = textBox.value;
//
//     // split the text into a word array
//     var arrayText = rawText.split(" ");
//     var poemArray = [];
//     var add = 0;
//
//     // generate the poem into the poemArray
//     for (var i = 0; i < arrayText.length * 10; i++) {
//
//         add += primeNumbers[i % primeNumbers.length] + i;
//         console.log(add % arrayText.length);
//
//         poemArray.push(arrayText[add % arrayText.length]);
//     }
//
//     // generate poem in html
//     document.write("<h1>Generated Poem</h1><h3>Enjoy!</h3>");
//     for (var a = 1; a < 9; a++) {
//         for (var i = 1; i < 5; i++) {
//
//             var randomSentenceSize = 10; // to randomize
//             document.write("<p>");
//
//             for (var j = 1; j < randomSentenceSize; j++) {
//                 // Problem: document.write does not write arrays
//                 document.write(poemArray[a*i*j]);
//                 document.write(" ");
//             }
//
//             document.write("</p>");
//         }
//         document.write("<p> ---- </p>");
//     }
// }
