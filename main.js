import './style.css';
import JSConfetti from 'js-confetti';

const jsConfetti = new JSConfetti();

const audioFile = './audio/chickienuggie.mp3';
const gameAudioFile = './audio/game-song.mp3';

const musicGame = new Audio(gameAudioFile);
function playMusic(file) {
  const music = new Audio(file);
  music.play();
}
function playMusicGame() {
  musicGame.play();
}
function pauseMusicGame() {
  musicGame.pause();
  musicGame.currentTime = 0;
}

let button = document.querySelector('.button');

if (button) {

  button.addEventListener('click', () => {
    playMusic(audioFile);
    jsConfetti.addConfetti({
      emojis: ['🐔', '🥚'],
      confettiNumber: 180,
    });
  });
}

// Set the date we're counting down to
var countDownDate = new Date('May 19, 2023 00:00:00').getTime();
const time = document.getElementById('time');

if (time) {
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
    time.innerHTML =
        days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById('demo').innerHTML = 'EXPIRED';
    }
  }, 1000);
}

window.onload = function(){
  const canvas = document.getElementById("canvas");
  if (canvas) {
    var context = canvas.getContext("2d");
    var canvasBack = document.getElementById("backgroundCanvas");
    var contextBack = canvasBack.getContext("2d");
    const arrowLeft = document.querySelector('.arrow-left')
    const arrowRight = document.querySelector('.arrow-right')
    const startButton = document.querySelector('.startgame');
    let previousHiScoreNumber = 0;

    // Check if hiscore is set
    if (localStorage.getItem("hiscore") !== null) {
      const previousHiScore = window.localStorage.getItem('hiscore');
      previousHiScoreNumber = parseInt(previousHiScore);
    } else {
      window.localStorage.setItem('hiscore', '0');
    }

    context.beginPath();
    context.rect(20, 20, 300, 50);
    context.stroke();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasBack.width = window.innerWidth;
    canvasBack.height = window.innerHeight;

    var timer;

    //Keeps track of hi score
    var hiscore = 0;


    // var background = new Image();
    // background.src = 'images/back.jpg';

    var player;
    var fruits = [];
    var numberOfFruits = 15;

    //Player constructor
    function Player()
    {
      this.gameOver = false;
      this.score = 0;
      this.fruitsCollected = 0;
      this.fruitsMissed = 0;
      this.playerWidth = 80;
      this.playerHeight = 120;
      this.playerSpeed = 20;
      this.x = canvas.width / 2;
      this.y = canvas.height - 200;
      this.playerImage = new Image();
      this.playerImage.src = 'images/player.png';

      //Draws the player
      this.render = function()
      {
        context.drawImage(this.playerImage, this.x, this.y);
      }

      //Moves the player left
      this.moveLeft = function()
      {
        if(this.x > 0)
        {
          this.x -= this.playerSpeed;
        }
      }

      //Moves the player right
      this.moveRight = function()
      {
        if(this.x < canvas.width - this.playerWidth)
        {
          this.x += this.playerSpeed;
        }
      }
    }

    //Fruit constructor
    function Fruit()
    {
      this.fruitNumber = Math.floor(Math.random() * 5);
      this.fruitType = "";
      this.fruitScore = 0;
      this.fruitWidth = 50;
      this.fruitHeight = 50;
      this.fruitImage = new Image();
      this.fruitSpeed = Math.floor(Math.random() * 3 + 1);
      this.x = Math.random() * (canvas.width - this.fruitWidth);
      this.y = Math.random() * (-canvas.height - this.fruitHeight);

      //Creates a different kind of fruit depending on the fruit number
      //which is generated randomly
      this.chooseFruit = function()
      {
        if(this.fruitNumber == 0)
        {
          this.fruitType = "pizza";
          this.fruitScore = 5 * this.fruitSpeed;
          this.fruitImage.src = 'images/pizza.png';
        }
        else if(this.fruitNumber == 1)
        {
          this.fruitType = "beer";
          this.fruitScore = 10 * this.fruitSpeed;
          this.fruitImage.src = 'images/beer.png';
        }
        else if(this.fruitNumber == 2)
        {
          this.fruitType = "chicken";
          this.fruitScore = 15 * this.fruitSpeed;
          this.fruitImage.src = 'images/chicken.png';
        }
        else if(this.fruitNumber == 3)
        {
          this.fruitType = "pineapple";
          this.fruitScore = 20 * this.fruitSpeed;
          this.fruitImage.src = 'images/pineapple2.png';
        }
        else if(this.fruitNumber == 4)
        {
          this.fruitType = "melon";
          this.fruitScore = 25 * this.fruitSpeed;
          this.fruitImage.src = 'images/beer.png';
        }
      }


      this.fall = function()
      {
        if(this.y < canvas.height - 150)
        {
          this.y += this.fruitSpeed;
        }
        else
        {

          player.fruitsMissed += 1;
          this.changeState();
          this.chooseFruit();
        }
        this.checkIfCaught();
      }


      this.checkIfCaught = function()
      {
        if(this.y >= player.y)
        {
          if((this.x > player.x && this.x < (player.x + player.playerWidth)) ||
              (this.x + this.fruitWidth > player.x && this.x + this.fruitWidth < (player.x + player.playerWidth)))
          {


            player.score += this.fruitScore;
            player.fruitsCollected += 1;

            this.changeState();
            this.chooseFruit();
          }
        }
      }

      //Randomly updates the fruit speed, fruit number, which defines the type of fruit
      //And also changes its x and y position on the canvas.
      this.changeState = function()
      {
        this.fruitNumber = Math.floor(Math.random() * 5);
        this.fruitSpeed = Math.floor(Math.random() * 3 + 1);
        this.x = Math.random() * (canvas.width - this.fruitWidth);
        this.y = Math.random() * -canvas.height - this.fruitHeight;
      }

      //Draws the fruit.
      this.render = function()
      {
        context.drawImage(this.fruitImage, this.x, this.y);
      }
    }

    arrowLeft.addEventListener('click', (e) => {
      e.preventDefault();
      player.moveLeft();
    })
    arrowRight.addEventListener('click', (e) => {
      e.preventDefault();
      player.moveRight();
    })

    main();

    //Fills an array of fruits, creates a player and starts the game
    function main()
    {
      contextBack.font = "bold 23px Velvetica";
      contextBack.fillStyle = "black";
      player = new Player();
      fruits = [];

      for(var i = 0; i < numberOfFruits; i++)
      {
        var fruit = new Fruit();
        fruit.chooseFruit();
        fruits.push(fruit);
      }

      startButton.addEventListener('click', () => {
        startGame();
        startButton.style.display = 'none';
      })
    }

    function startGame()
    {
      playMusicGame();
      updateGame();
      window.requestAnimationFrame(drawGame);
    }

    function updateGame()
    {

      if(player.fruitsMissed >= 1)
      {
        player.gameOver = true;
        pauseMusicGame();
      }

      for(var j = 0; j < fruits.length; j++)
      {
        fruits[j].fall();
      }
      timer = window.setTimeout(updateGame, 30);
    }

    //Draws the player and fruits on the screen as well as info in the HUD.
    function drawGame()
    {
      if(player.gameOver === false)
      {
        context.clearRect(0, 0, canvas.width, canvas.height);
        contextBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
        player.render();

        for(var j = 0; j < fruits.length; j++)
        {
          fruits[j].render();
        }
        contextBack.fillText("SCORE: " + player.score, 10, 40);
        if (previousHiScoreNumber) {
          contextBack.fillText("HI SCORE: " + previousHiScoreNumber, canvas.width - 170, 40);
        } else {
          contextBack.fillText("HI SCORE: " + hiscore, 200, 40);
        }
        // contextBack.fillText("FRUIT CAUGHT: " + player.fruitsCollected, 500, 50);
        // contextBack.fillText("FRUIT MISSED: " + player.fruitsMissed, 780, 50);
        contextBack.fillStyle = 'blue';
      }
      else
      {
        //Different screen for game over.
        for(var i = 0; i < numberOfFruits; i++)
        {
          fruits.pop();
        }

        if (player.score >= previousHiScoreNumber) {
          contextBack.fillText("NIEUWE HIGHSCORE: " + player.score, (canvas.width / 2) - 150, canvas.height / 3);
          contextBack.fillText("PRESS ENTER TO RESTART", (canvas.width / 2) - 140, canvas.height / 3 + 50);
          window.localStorage.setItem('hiscore', player.score);
          context.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          contextBack.fillText("JOUW SCORE: " + player.score, (canvas.width / 2) - 100, canvas.height / 3);
          contextBack.fillText("PRESS ENTER TO RESTART", (canvas.width / 2) - 140, canvas.height / 3 + 50);
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      window.requestAnimationFrame(drawGame);
    }
  }
}
