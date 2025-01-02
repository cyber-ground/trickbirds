'use strict';



//---------------------------------------------------------------------------------------------------

//                                     ----- TRICK BIRDS -----
//---------------------------------------------------------------------------------------------------


const startBtn = document.querySelector('.start-btn'); 
  const gameClearMessage = document.querySelector('.game-clear');
  const gameOverMessage = document.querySelector('.game-over');
const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard, lockBoard; 
let firstCard, secondCard;
let matched,unMatched;

  var bgmHowl = new Howl({src: ['mp3/bgm.mp3'], loop:true, volume: 0.05});
  var flipCardHowl = new Howl({src: ['mp3/flipCard.mp3'], volume: 0.5});
  var unmatchedHowl = new Howl({src: ['mp3/unmatched.mp3'], volume: 0.5});
  var matchedHowl = new Howl({src: ['mp3/matched.mp3'], volume: 0.5});
  var clearHowl = new Howl({src: ['mp3/clear.mp3'], volume: 0.1});
  var gameClearHowl = new Howl({src: ['mp3/gameClear.mp3'], volume: 0.1});
  var overHowl = new Howl({src: ['mp3/over.mp3'], volume: 0.1});
  var gameOverHowl = new Howl({src: ['mp3/gameOver.mp3'], volume: 0.1});
  
  startBtn.classList.add('js_visible'); //*>
  startBtn.addEventListener('click', function () {
    cards.forEach(card => {
      card.classList.remove('js_flip');
      card.addEventListener('click', flipCard);
    });
    startBtn.classList.remove('js_visible');
    gameClearMessage.classList.remove('js_visible');
    gameOverMessage.classList.remove('js_visible');
    startBtn.classList.add('active');
    shuffleCards();
    hasFlippedCard = false; 
    lockBoard = false;
    matched = 0;
    unMatched = 0;
    bgmHowl.play();
  });


function flipCard() {
    if(lockBoard) return;            
    if(this === firstCard) return;     
  this.classList.add('js_flip');
  flipCardHowl.play();
  if(!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
  } else {
    hasFlippedCard = false;
    secondCard = this;
    checkForMatch();
  }
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === 
    secondCard.dataset.framework;
  isMatch ? matchedCards() : unMatchedCards();
}

function matchedCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  matched++;
  setTimeout(() => { matchedHowl.play()}, 300);
  gameClear();
}

function unMatchedCards() {
  lockBoard = true; 
  setTimeout(() => {
    firstCard.classList.remove('js_flip');
    secondCard.classList.remove('js_flip');
    unmatchedHowl.play();
    lockBoard = false;
    firstCard = null;
    unMatched++; 
    gameOverCounter();
  }, 1000); 
}

function gameClear() {
  if(matched === cards.length / 2) {
    setTimeout(() => {
      gameClearMessage.classList.add('js_visible');
      disableCards();
      bgmHowl.stop();
      setTimeout(() => { clearHowl.play()}, 800);
      setTimeout(() => { gameClearHowl.play()}, 2000);
      setTimeout(() => {
        startBtn.classList.add('js_visible');
      }, 3000);
    }, 500);
  }
}

function gameOver() {        
  gameOverMessage.classList.add('js_visible');  
  disableCards();  
  bgmHowl.stop();
  setTimeout(() => { overHowl.play()}, 800);
  setTimeout(() => { gameOverHowl.play() }, 3700);
  setTimeout(() => {
    startBtn.classList.add('js_visible');                            
  }, 1500);  
}

function gameOverCounter() {   
  if(unMatched === 10) {    
    gameOver();                 
  }                                                             
}

function disableCards() {
  cards.forEach(card => {                       
    card.removeEventListener('click', flipCard);
  });
} 

function shuffleCards() {
  const number = [];
  for (let i = 0; i < cards.length; i++) {
    number[i] = i;
  }
  number.sort(value => {
    return  0.5 - Math.random();
  });
  // console.log(number);
  cards.forEach(card => {
    const orderNumber = 
    number.splice(Math.floor(Math.random() * number.length), 1);
    card.style.order = orderNumber;
    // console.log(orderNumber);
  });
}
shuffleCards();


//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------














































