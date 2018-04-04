/*
 * Create a list that holds all of your cards
 */
const diffList = ['Easy', 'Medium', 'Hard'];
const diffClassList = ['card1', 'card2', 'card3'];

const easyCardList =
['fa-diamond','fa-diamond',
'fa-paper-plane-o','fa-paper-plane-o',
'fa-anchor','fa-anchor',
'fa-bolt','fa-bolt',
'fa-cube','fa-cube',
'fa-leaf','fa-leaf',
'fa-bicycle','fa-bicycle',
'fa-bomb','fa-bomb'];

const mediumCardList =
['fa-diamond','fa-diamond',
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
'fa-hashtag','fa-hashtag'];

const hardCardList =
['fa-diamond','fa-diamond',
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
'fa-music','fa-music'];

const cardListSet = [easyCardList, mediumCardList, hardCardList];

const menu = document.getElementsByClassName('menu-container')[0];
const message = document.getElementsByClassName('message')[0];
const stats = document.getElementsByClassName('statistics')[0];
const starList = document.getElementsByClassName('stars');
const restart = document.getElementsByClassName('restart')[0];
const moveCount = document.getElementsByClassName('moves');
const diff = document.getElementsByClassName('difficulty')[0];
const timeCount = document.getElementsByTagName('time');
const deck = document.getElementsByClassName('deck')[0];

let score = 0, time = 0, moves = 0, difficulty = 1, turn = 0, inGame = 0;
let showCard = new Array(2);
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function initializeVariables(diff){
  score = 0;
  time = 0;
  moves = 0;
  difficulty = diff;
  turn = 0;
}

// Shuffle function from http://stackoverflow.com/a/2450976
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

function newStar(){
  const iStar = document.createElement('I');
  iStar.classList.add('fa','fa-star');
  const star = document.createElement('LI');
  star.appendChild(iStar);
  return star;
}

function fillStars(i, tot){
  while(starList[i].childElementCount < tot){
    starList[i].appendChild(newStar());
  }
  while(starList[i].childElementCount > tot){
    starList[i].removeChild(starList[i].firstChild);
  }
}

function setAllStars(tot){
  fillStars(0, tot);
  fillStars(1, tot);
}

function updateStars(){
  let min = cardListSet[difficulty].length/2;
  if(moves < 2 * min){
    setAllStars(3);
  }else if(moves >= 2 * min && moves < 3 * min){
    setAllStars(2);
  }else if(moves >= 3 * min){
    setAllStars(1);
  }
}

function updateMoves(){
  moveCount[0].textContent = moves;
  moveCount[1].textContent = moves;
}

function updateDiff(){
  diff.textContent = diffList[difficulty];
}

function updateStats(){
  updateStars();
  updateMoves();
  if(score >= cardListSet[difficulty].length/2){
    inGame = 0;
    setTimeout(
    endGame(1)
  , 3000);
  }
}

function updateTime(){
  let secs = time%60;
  if(secs < 10) secs = '0'+secs;
  let mins = (time-secs)/60;
  timeCount[0].textContent = mins+':'+secs;
  timeCount[1].textContent = mins+':'+secs;
}

function timer(){
  window.setInterval(function(){
    if(inGame){
      updateTime();
      ++time;
    }
  }, 1000);
}

function initGame(size){
  initializeVariables(size);
  let cardList = cardListSet[size];
  cardList = shuffle(cardList);
  let frag = document.createDocumentFragment();
  for(let i=0; i < cardList.length; i++){
    let card = document.createElement('LI');
    card.classList.add('card', diffClassList[size]);
    let symbol = document.createElement('I');
    symbol.classList.add('fa', cardList[i]);
    card.appendChild(symbol);
    frag.appendChild(card);
  }
  while(deck.firstChild){
    deck.removeChild(deck.firstChild);
  }
  deck.appendChild(frag);
  fillStars(1,3);
  menu.classList.add('invisible');
  fillStars(0,3);
  deck.addEventListener('click', function move(event){
    let el = event.target;
    if(el.classList.contains('card') && !el.classList.contains('open')){
      showCard[turn] = el;
      showCard[turn].classList.add('open','show');
      switch(turn){
        case 0:
          turn++;
          break;
        case 1:
          deck.classList.add('unclickable');
          setTimeout(function(){
            if(showCard[0].firstChild.className == showCard[1].firstChild.className){
              showCard[0].classList.remove('open','show');
              showCard[1].classList.remove('open','show');
              showCard[0].classList.add('match');
              showCard[1].classList.add('match');
              score++;
            }else{
                showCard[0].classList.remove('open','show');
                showCard[1].classList.remove('open','show');
            }
            moves++;
            turn = 0;
            updateStats();
            deck.classList.remove('unclickable');
          }, 1000);
      }
    }
  });
  restart.addEventListener('click', function restartGame(){
    inGame = 0;
    endGame(0);
  });
  inGame = 1;
  console.log("Game initialized correctly!");
}

function newGame(){
  initGame(document.getElementById('diffSelect').value);
}

function endGame(win){
  switch(win){
    case 1:
      message.textContent = 'Congratulations! You won!';
      updateDiff();
      starList[0].classList.remove('invisible');
      stats.classList.remove('invisible');
      break;
    case 0:
      message.textContent = 'You gave up...';
      starList[0].classList.add('invisible');
      stats.classList.add('invisible');
  }
  menu.classList.remove('invisible');
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 timer();
