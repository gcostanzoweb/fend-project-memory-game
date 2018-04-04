/*!
 * Memory - a Matching Game, code by Gabriele Costanzo
 */

/*
 * DIFFICULTY setup: these lines' purpose is to set up the decks and classes for the three
 * different levels of difficulty: Easy (4x4), Medium (6x6), Hard (8x8)
 */

// Defines the names for the three difficulties
const diffList = ['Easy', 'Medium', 'Hard'];
// Defines their respective classes to apply specific CSS
const diffClassList = ['card1', 'card2', 'card3'];

// Following are the classes for the three deck: as in the original commit,
// I used FontAwesome to give each card a different image
const easyCardList = [
	'fa-diamond','fa-diamond',
	'fa-paper-plane-o','fa-paper-plane-o',
	'fa-anchor','fa-anchor',
	'fa-bolt','fa-bolt',
	'fa-cube','fa-cube',
	'fa-leaf','fa-leaf',
	'fa-bicycle','fa-bicycle',
	'fa-bomb','fa-bomb'
];

const mediumCardList = [
	'fa-diamond','fa-diamond',
	'fa-paper-plane-o','fa-paper-plane-o',
	'fa-anchor','fa-anchor',
	'fa-bolt','fa-bolt',
	'fa-cube','fa-cube',
	'fa-leaf','fa-leaf',
	'fa-bicycle','fa-bicycle',
	'fa-bomb','fa-bomb',
	'fa-asterisk','fa-asterisk',
	'fa-lock','fa-lock',
	'fa-battery-half','fa-battery-half',
	'fa-bell','fa-bell',
	'fa-birthday-cake','fa-birthday-cake',
	'fa-book','fa-book',
	'fa-briefcase','fa-briefcase',
	'fa-bug','fa-bug',
	'fa-bullhorn','fa-bullhorn',
	'fa-hashtag','fa-hashtag'
];

const hardCardList = [
	'fa-diamond','fa-diamond',
	'fa-paper-plane-o','fa-paper-plane-o',
	'fa-anchor','fa-anchor',
	'fa-bolt','fa-bolt',
	'fa-cube','fa-cube',
	'fa-leaf','fa-leaf',
	'fa-bicycle','fa-bicycle',
	'fa-bomb','fa-bomb',
	'fa-asterisk','fa-asterisk',
	'fa-lock','fa-lock',
	'fa-battery-half','fa-battery-half',
	'fa-bell','fa-bell',
	'fa-birthday-cake','fa-birthday-cake',
	'fa-book','fa-book',
	'fa-briefcase','fa-briefcase',
	'fa-bug','fa-bug',
	'fa-bullhorn','fa-bullhorn',
	'fa-hashtag','fa-hashtag',
	'fa-cloud','fa-cloud',
	'fa-coffee','fa-coffee',
	'fa-desktop','fa-desktop',
	'fa-phone','fa-phone',
	'fa-mouse-pointer','fa-mouse-pointer',
	'fa-envelope','fa-envelope',
	'fa-flask','fa-flask',
	'fa-microphone','fa-microphone',
	'fa-magnet','fa-magnet',
	'fa-graduation-cap','fa-graduation-cap',
	'fa-heart','fa-heart',
	'fa-headphones','fa-headphones',
	'fa-paperclip','fa-paperclip',
	'fa-music','fa-music'
];

// An array of the previous decks, to access on the base of the Difficulty's picker's value
const cardListSet = [easyCardList, mediumCardList, hardCardList];

/*
 * GAME SETTING: a list of variables used during the game rounds and initialization
 */

// note: `starList`, `moveCount` and `timeCount` represent each an array of two elements,
// one in the main game's container, the other in the menu's container
const menu = document.getElementsByClassName('menu-container')[0];
const message = document.getElementsByClassName('message')[0];
const stats = document.getElementsByClassName('statistics')[0];
const starList = document.getElementsByClassName('stars');
const restart = document.getElementsByClassName('restart')[0];
const moveCount = document.getElementsByClassName('moves');
const diff = document.getElementsByClassName('difficulty')[0];
const timeCount = document.getElementsByTagName('time');
const deck = document.getElementsByClassName('deck')[0];

// Game variables: `score` needs to get to the max number of pairings in order to win (8, 18, 32);
// `time` is updated to be the amount of secs passed since the game started; `moves` is the number of moves (pairings) executed;
// `difficulty` is the index of the value in the `diffList`; `turn` is needed to distinguish between first and second halves
// of a pairing; `inGame` is used to tell other functions when to start or end the game cycle
let score = 0, time = 0, moves = 0, difficulty = 0, turn = 0, inGame = 0;
// `showCard` holds the elements of the cards in the current pairing
let showCard = new Array(2);
// This holds the timer function, in order to later remove it when the game is done
let gameTimer;

/*
 * GAME FUNCTIONS: all the functions needed for the game cycle, often divided in multiple ones for easier usage
 */

// Initializes the game variables to default values
function initializeVariables(diff){
	score = 0;
  time = 0;
  moves = 0;
  difficulty = diff;
  turn = 0;
}

// Shuffle function from http://stackoverflow.com/a/2450976
// used here to get a shuffled deck of cards
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Creates a new star element for the star system
function newStar(){
  const iStar = document.createElement('I');
  iStar.classList.add('fa','fa-star');
  const star = document.createElement('LI');
  star.appendChild(iStar);
  return star;
}

// Updates set no.'i' of stars to 'tot' stars
function fillStars(i, tot){
  while(starList[i].childElementCount < tot){
    starList[i].appendChild(newStar());
  }
  while(starList[i].childElementCount > tot){
    starList[i].removeChild(starList[i].firstChild);
  }
}

// Like 'fillStars', but on both sets of stars
function setAllStars(tot){
  fillStars(0, tot);
  fillStars(1, tot);
}

// This function contains to algorithm used to determine how to update the stars
function updateStars(){
  let min = cardListSet[difficulty].length / 2;
  if(moves < 2 * min){
    setAllStars(3);
  }else if(moves >= 2 * min && moves < 3 * min){
    setAllStars(2);
  }else if(moves >= 3 * min){
    setAllStars(1);
  }
}

// Updates both elements used to count moves to current value
function updateMoves(){
  moveCount[0].textContent = moves;
  moveCount[1].textContent = moves;
}

// Updates the name used to show current difficulty
function updateDiff(){
  diff.textContent = diffList[difficulty];
}

// Used after every move to update the stats and determine if the user won
function updateStats(){
  updateStars();
  updateMoves();
  if(score >= cardListSet[difficulty].length/2){
    inGame = 0;
    setTimeout(endGame(1), 3000);
  }
}

// Updates the visualization of current time
function updateTime(){
  let secs = time%60;
  if(secs < 10) secs = '0'+secs;
  let mins = (time-secs)/60;
  timeCount[0].textContent = mins+':'+secs;
  timeCount[1].textContent = mins+':'+secs;
}

// Adds one to the time every seconds, unless `inGame` is false
function timer(){
  return window.setInterval(function(){
    if(inGame){
			console.log(time);
      updateTime();
      ++time;
    }
  }, 1000);
}

// MAIN INIZIALIZATION FUNCTION
// It's run every time the user clicks on the New Game button
function initGame(size){
  initializeVariables(size);
	// Creates a new shuffled deck
  let cardList = cardListSet[size];
  cardList = shuffle(cardList);
	// Creates the fragment where to append the cards
  let frag = document.createDocumentFragment();
	// Card creation/appending cycle
  for(let i=0; i < cardList.length; i++){
    let card = document.createElement('LI');
    card.classList.add('card', diffClassList[size]);
    let symbol = document.createElement('I');
    symbol.classList.add('fa', cardList[i]);
    card.appendChild(symbol);
    frag.appendChild(card);
  }
	// Erases the old deck
  while(deck.firstChild){
    deck.removeChild(deck.firstChild);
  }
	// Appends the new deck
  deck.appendChild(frag);
	// Refills the stars and makes the menu disappear
  fillStars(1,3);
  menu.classList.add('invisible');
  fillStars(0,3);
	// Main event listener on the cards
  deck.addEventListener('click', function move(event){
    let el = event.target;
		// Only works if the user clicks on a card that is not open
    if(el.classList.contains('card') && !el.classList.contains('open')){
			// Adds the card to the pairing array and "opens" it
      showCard[turn] = el;
      showCard[turn].classList.add('open','show');

      switch(turn){
        case 0:
          turn++;
          break;
        case 1:
					// The checks have to be done on the second half of the pairing
					// We first render the deck 'unclickable' until the pairing is resolved
          deck.classList.add('unclickable');
          setTimeout(function(){
            if(showCard[0].firstChild.className == showCard[1].firstChild.className){
							// Case: the cards are identical
              showCard[0].classList.remove('open','show');
              showCard[1].classList.remove('open','show');
              showCard[0].classList.add('match');
              showCard[1].classList.add('match');
              score++;
            }else{
							// Case: the cards are different
              showCard[0].classList.remove('open','show');
              showCard[1].classList.remove('open','show');
            }
            moves++;
            turn = 0;
            updateStats();
						// Renders the deck clickable again
            deck.classList.remove('unclickable');
          }, 1000);
      }
    }
  });
	// Adds an event listener on the Restart button to instantly end the game
  restart.addEventListener('click', function restartGame(){
    inGame = 0;
    endGame(0);
  });
	// Starts the game cycle and timer and keeps the timer running
  inGame = 1;
	gameTimer = timer();
}

// Like `initGame`, but selectes the difficulty from the Input selector
function newGame(){
  initGame(document.getElementById('diffSelect').value);
}

// Brings the menu back to communicate infos about the match which just ended
function endGame(win){
	// Shows stats and stars only if the player won, not if they restarted
  switch(win){
		// Case: victory
    case 1:
      message.textContent = 'Congratulations! You won!';
      updateDiff();
      starList[0].classList.remove('invisible');
      stats.classList.remove('invisible');
      break;
		// Case: restart
    case 0:
      message.textContent = 'You gave up...';
      starList[0].classList.add('invisible');
      stats.classList.add('invisible');
  }
  menu.classList.remove('invisible');
	// Stops the timer
	window.clearInterval(gameTimer);
}