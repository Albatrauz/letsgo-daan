import './style.css';
import JSConfetti from 'js-confetti';

const jsConfetti = new JSConfetti();

const audioFile = './audio/chickienuggie.mp3';
function playMusic() {
  const music = new Audio(audioFile);
  music.play();
}

let button = document.querySelector('.button');

button.addEventListener('click', () => {
  playMusic();
  jsConfetti.addConfetti({
    emojis: ['🐔', '🥚'],
    confettiNumber: 180,
  });
});

// Set the date we're counting down to
var countDownDate = new Date('May 19, 2023 00:00:00').getTime();

// Update the count down every 1 second
var x = setInterval(function () {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById('time').innerHTML =
    days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById('demo').innerHTML = 'EXPIRED';
  }
}, 1000);
