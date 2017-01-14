function setup() {
  noCanvas();

}

function draw() {

}

function generate() {
  // get the element from the text field
  var rawText = select('.enter').value();
  var words = RiTa.tokenize(rawText);

  var pluralizedWords = [];
  var participleWords = [];
  var phonemes = [];
  var syllables = [];
  for (var i = 0; i < words.length; i++) {
    pluralizedWords[i] =  RiTa.pluralize(words[i]);
    participleWords[i] = RiTa.getPastParticiple(words[i]);
    phonemes[i] = RiTa.getPhonemes(words[i]);
    syllables[i] = RiTa.getSyllables(words[i]);
  }
  for (var i = 0; i < words.length; i++) {
    createP(words[i]).position(random(windowWidth), random(windowHeight)).class('strikeout');
    createP(pluralizedWords[i]).position(random(windowWidth), random(windowHeight)).class('strikeout');
    createP(participleWords[i]).position(random(windowWidth), random(windowHeight)).class('strikeout');
    createP(phonemes[i]).position(random(windowWidth), random(windowHeight)).class('strikeout');
    createP(syllables[i]).position(random(windowWidth), random(windowHeight)).class('strikeout');
  }
}
