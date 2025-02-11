'use strict';

import {console_color,console_red,console_orange,console_yellow,console_green,
  console_blue,console_purple,console_magenta,console_cyan} from './logColor.js';

//---------------------------------------------------------------------------------------------------

//                                     ----- TRICK BIRDS -----
//---------------------------------------------------------------------------------------------------



const startBtn = document.querySelector('.start-btn'); 
const gameClearMessage = document.querySelector('.game-clear');
const gameOverMessage = document.querySelector('.game-over');
const container = document.querySelector('.container');
const cards = document.querySelectorAll('.memory-card');
const mobile = navigator.userAgent.match(/iPhone|Android.+Mobile/);
let portrait = window.matchMedia('(orientation: portrait)').matches;
let hasFlippedCard, lockBoard; 
let firstCard, secondCard;
let matched, unMatched;
let touch = false;
let startGame = false;
let defaultHeight = innerHeight;
let orientation = portrait ? 'portrait' : 'landscape';
let lastOrientation = orientation;
let menubar;
var bgmHowl = new Howl({src: ['mp3/bgm.mp3'], loop:true, volume: 0.05});
var flipCardHowl = new Howl({src: ['mp3/flipCard.mp3'], volume: 0.5});
var unmatchedHowl = new Howl({src: ['mp3/unmatched.mp3'], volume: 0.5});
var matchedHowl = new Howl({src: ['mp3/matched.mp3'], volume: 0.5});
var clearHowl = new Howl({src: ['mp3/clear.mp3'], volume: 0.1});
var gameClearHowl = new Howl({src: ['mp3/gameClear.mp3'], volume: 0.1});
var overHowl = new Howl({src: ['mp3/over.mp3'], volume: 0.1});
var gameOverHowl = new Howl({src: ['mp3/gameOver.mp3'], volume: 0.1});

//* touchCalloutPreventionEvents ---
container.addEventListener('touchstart', e => e.preventDefault());
cards.forEach(card => {
  card.addEventListener('touchstart', e => e.preventDefault());
});
gameClearMessage.addEventListener('touchstart', e => e.preventDefault());
gameOverMessage.addEventListener('touchstart', e => e.preventDefault());

startBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startBtn.click();
});

  const imgs = document.querySelectorAll('img');
imgs.forEach(img => {
  img.addEventListener('touchstart', (e) => {
    if(startGame) {
      if(!touch) { touch = true; e.stopPropagation()}
    }
  });
  img.addEventListener('mousedown', () => {
    img.style.pointerEvents = 'none';
    setTimeout(() => { img.style.pointerEvents = 'all'}, 500);
  });
  img.addEventListener('touchend', () => {
    setTimeout(() => { touch = false}, 150);
  });
});

//* --------------------------------------------------------

  startBtn.classList.add('js_visible'); //*>
  startBtn.addEventListener('click', function () {
    console.log('helloWorld');
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
    startGame = true; //*
    overHowl.stop();
    gameOverHowl.stop();
    clearHowl.stop();
    gameClearHowl.stop();
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
      startGame = false;
      firstCard = null;
      setTimeout(() => { clearHowl.play()}, 800);
      setTimeout(() => { gameClearHowl.play()}, 2000);
      setTimeout(() => {
        startBtn.classList.add('js_visible');
      }, 2500);
    }, 500);
  }
}

function gameOver() {        
  gameOverMessage.classList.add('js_visible');  
  disableCards();  
  bgmHowl.stop();
  startGame = false;
  setTimeout(() => { overHowl.play()}, 800);
  setTimeout(() => { gameOverHowl.play() }, 3700);
  setTimeout(() => {
    startBtn.classList.add('js_visible');                            
  }, 3200);  
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

function detectMenubarStatus() {
  if(mobile) {
    if(innerHeight > defaultHeight) { 
      menubar = false;
      startBtn.classList.add('menubarHidden');
    } else if(innerHeight === defaultHeight) {
      menubar = true;
      startBtn.classList.remove('menubarHidden');
    }	
  } else { startBtn.classList.add('menubarHidden')}
} detectMenubarStatus();

window.addEventListener('resize', () => {
  portrait = window.matchMedia('(orientation: portrait)').matches;
  orientation = portrait ? 'portrait' : 'landscape';
  if(orientation === lastOrientation) { detectMenubarStatus()}
  if(orientation !== lastOrientation && menubar) {
    defaultHeight = innerHeight;
    detectMenubarStatus();
  }
  lastOrientation = orientation;
});

//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------


// let portrait = window.matchMedia('(orientation: portrait)').matches;
// let landscape = window.matchMedia('(orientation: landscape)').matches;

// function detectMenubarStatus_landscape() {
//   if(mobile) {
//     if(landscape && innerHeight > defaultHeight) { 
//       startBtn.classList.add('menubarHidden');
//       menubar = false;
//     } else if(landscape && innerHeight === defaultHeight) {
//       startBtn.classList.remove('menubarHidden');
//       menubar = true;
//     }	
//   } else { startBtn.classList.add('menubarHidden')}
// } detectMenubarStatus_landscape();

// function detectMenubarStatus_portrait() {
//   if(mobile) {
//     if(portrait && innerHeight > defaultHeight) { //*large
//       startBtn.classList.add('menubarHidden');
//       menubar = false;
//     } else if(portrait && innerHeight === defaultHeight) { //*small //real610px
//       startBtn.classList.remove('menubarHidden');
//       menubar = true;
//     }	
//   } else { startBtn.classList.add('menubarHidden')}
// } detectMenubarStatus_portrait();


// window.addEventListener('resize', () => {
//   portrait = window.matchMedia('(orientation: portrait)').matches;
//   orientation = portrait ? 'portrait' : 'landscape';
//   if(orientation === lastOrientation) { detectMenubarStatus()}
//   if(orientation !== lastOrientation && menubar) {
//     defaultHeight = innerHeight;
//     let num = Math.floor(Math.random() * 360); //* logic finder
//     startBtn.textContent = num; //* logic finder
//     document.body.style.backgroundColor = `hsl(${num}, 100%, 50%)`; //* logic finder
//     detectMenubarStatus();
//   }
//   lastOrientation = orientation;
//   console.log(orientation);
// });


//^ iphone ----------------------------------------------------------------------

// startBtn.innerHTML = 
// `outerHeight ${outerHeight}<br>
// innerHeight ${innerHeight}<br>
// outerHeight-innerHeight ${outerHeight - innerHeight}<br><br>
// outerWidth ${outerWidth}<br>
// innerWidth ${innerWidth}<br>
// outerWidth-innerWidth ${outerWidth - innerWidth}<br>`


// window.addEventListener('resize', () => {
//   setTimeout(() => {
//     startBtn.innerHTML = 
//   `outerHeight ${outerHeight}<br>
//   innerHeight ${innerHeight}<br>
//   outerHeight-innerHeight ${outerHeight - innerHeight}<br><br>
//   outerWidth ${outerWidth}<br>
//   innerWidth ${innerWidth}<br>
//   outerWidth-innerWidth ${outerWidth - innerWidth}<br>`
//   }, 1000);
// });

//^ ----------------------------------------------------------------------






















