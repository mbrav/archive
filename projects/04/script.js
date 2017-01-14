//Adapted from Daniel Shiffman's A2Z example
//Code 2 Data Poetics, SP16, Bryan Ma

//read input file into string object
//count words
//count syllables
//count sentences
//apply formula
//write out report file

var dropzone, input, button;
var theText;

var donaldTrump;
var haircut = 1;

var dropZoneView = true;

function setup() {
  noCanvas();
  input = select('#textinput');
  button = select('#submit');
  button.mousePressed(handleInput);
  buttonMode = select('#toggle');
  buttonMode.mousePressed(toggleMode);
  dropzone = select('#dropzone');
  dropzoneText = select('#dropzone-text')
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(gotFile, unhighlight);

  dropZoneView = false;
  toggleMode();
}

function draw() {
  donaldTrump + haircut;
}

function highlight() {
  dropzone.style('background', 'repeating-linear-gradient(45deg, #BACFD8, #BACFD8 19px, white 19px, white 20px)');
  dropzoneText.style('color', '#6CA4BB;');
}

function unhighlight() {
  dropzone.style('background', '');
  dropzoneText.style('color', '');
}

function gotFile(file) {
  if (file.type === 'text') {
    theText = file.data;
    processFlesch(theText);
  } else {
    alert('not a text file');
  }
}

function handleInput() {
  theText = input.value();
  processFlesch(theText);
}

function toggleMode() {

  if (dropZoneView) {
    dropZoneView = false;
    console.log("text-field show");
    dropzone.hide();
    dropzoneText.hide();
    input.show();
    button.show();

    buttonMode.html('DropZone Input');
  } else {
    dropZoneView = true;
    console.log("dropzone show");
    dropzone.show();
    dropzoneText.show();
    input.hide();
    button.hide();

    buttonMode.html('Text-Field Input');
  }

}


function processFlesch(data) {
  var len = data.length;
  if (data.length === 0) {
    alert("Nothing entered");
  } else {
    var totalSyllables = 0;
    var totalSentences = 0;
    var totalWords = 0;

    //look for word delimiters
    var delimiters = '.:;?! !@#$%^&*()+';
    var words = splitTokens(data, delimiters);  //http://p5js.org/reference/#/p5/splitTokens
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      totalSyllables += countSyllables(word);
      totalWords++;
    }

    // Coleman–Liau
    // count average number of LETTERS per 100 words
    var hundredWords = ' ';
    for (var i = 0; i < 100; i++) {
      hundredWords = hundredWords + words[i];
    }
    console.log(hundredWords.length);
    // Coleman–Liau
    // count average number of SENTENCES per 100 words
    var numberOfSetencesPer100Words = splitTokens(hundredWords, sentenceDelim);
    console.log(numberOfSetencesPer100Words);

    //look for sentence delimiters
    var sentenceDelim = '.:;?!';
    var sentences = splitTokens(data, sentenceDelim);
    totalSentences = sentences.length;

    //calculate flesch index
    var f1 = 206.835;
    var f2 = 84.6;
    var f3 = 1.015;
    var r1 = totalSyllables / totalWords;
    var r2 = totalWords / totalSentences;
    var flesch = f1 - (f2 * r1) - (f3 * r2);

    // Coleman–Liau index
    var liau = 0.588 * hundredWords.length - 0.296 * numberOfSetencesPer100Words.length - 15.8;

    var report = "";

    report += "Total Syllables: " + "<span>" + totalSyllables + "</span>" + "<br>";
    report += "Total Words: " + "<span>" + totalWords + "</span>" + "<br>";
    report += "Total Sentences: " + "<span>" + totalSentences + "</span>" +"<br>";
    report += "Flesch Index: " + "<span>" +  flesch.toFixed(2) + "</span>" +"<br>";
    report += "C–Liau index: " + "<span>" +  liau.toFixed(2) + "</span>" + "\n";

    var reportParagraph = createDiv('');
    reportParagraph.attribute('class', 'report-paragraph')
    // var fleschResults = createP(report);
    reportParagraph.child(createP(report))
    // fleschResults.class('text');
  }
}

//count syllables of a word based on number of vowels
function countSyllables(word) {
  var syl = 0;
  var vowel = false;

  //check each word for vowels (don't count more than one vowel in a row)
  for (var i = 0; i < word.length; i++) {
    if (isVowel(word.charAt(i)) && (vowel == false)) {
      vowel = true;
      syl++;
    } else if (isVowel(word.charAt(i)) && (vowel == true)) {
      vowel = true;
    } else {
      vowel = false;
    }
  }

  // Coleman–Liau index
  //average number of sentences per 100 words
  function avLetters(sentences) {
  }

  var tempChar = word.charAt(word.length-1);
  //check for an 'e' at the end, as long as its not a word with one syllable
  //this is something we would need to change if we wanted this to analyze more than one word.
  if ((tempChar == 'e' || tempChar == 'E') && syl != 1) {
    syl--;
  }
  return syl;
}

function isVowel(c) {
  if      ((c == 'a') || (c == 'A')) { return true; }
  else if ((c == 'e') || (c == 'E')) { return true; }
  else if ((c == 'i') || (c == 'I')) { return true; }
  else if ((c == 'o') || (c == 'O')) { return true; }
  else if ((c == 'u') || (c == 'U')) { return true; }
  else if ((c == 'y') || (c == 'Y')) { return true; }
  else { return false; }
}
