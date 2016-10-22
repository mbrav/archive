
var filters = ['blur', 'invert', 'sepia', 'grayscale '];
var index = 0;

fibonacci();
function fibonacci() {
  var fibonacci = [0,1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,
   1597,2584,4181,6765,10946,17711,28657,46368,75025,
   121393,196418,317811,514229,832040,1346269,
   2178309,3524578,5702887,9227465,14930352,24157817,
   39088169];

   var num = 0;
   console.log("START");
   for (var i = 0; i < fibonacci.length; i++) {
     num += fibonacci[i];
     console.log("num = " +num%12 + " i = " + i);
   }
   console.log("FINISH");
}

function changeFilter(event) {
  var eventList = event.target;
  eventList.className = "";
  var effect = filters[index++ % filters.length];
  eventList.classList.add(effect);
}

var video = document.querySelector('video');
video.addEventListener('click', changeFilter, false);

var handleVideo = function(stream) {
  video.src = window.URL.createObjectURL(stream);
}

function errorCallback(banana) {
  console.log('User Rejected', banana);
}

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);
}


if (hasGetUserMedia()) {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  navigator.getUserMedia({
    audio: true,
    video: true
  }, handleVideo, errorCallback);
} else {

}
