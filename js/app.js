/**
 * list cards
 */
const cardsList = ['fa-anchor', 'fa-anchor',
  'fa-bolt', 'fa-bolt',
  'fa-cube', 'fa-cube',
  'fa-leaf', 'fa-leaf',
  'fa-bicycle', 'fa-bicycle',
  'fa-diamond', 'fa-diamond',
  'fa-bomb', 'fa-bomb',
  'fa-paper-plane-o', 'fa-paper-plane-o']

/**
 * build a card html
 * @param  {str} i element of cardsList
 */
function buildCard (i) {
  return `<li class='card'><i class='fa ${i}'></i></li>`
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle (array) {
  var currentIndex = array.length
  var temporaryValue
  var randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

// get the html elements
const deck = document.querySelector('.deck')
const starElement = document.querySelector('.stars')
const modal = document.getElementById('modal')
const movesText = document.querySelector('.moves')
const timeElement = document.getElementById('time')
const restartElement = document.querySelector('.restart')
const playAgainBtn = document.querySelector('.close-animatedModal.btn-slice')
const scoreMsg = document.querySelector('.score-message')

// list of open and match cards
let openCards, matchCards
// number of stars
const nStars = 3
// count moves and multiplying factor
let movesCounter, factor
// initialize second, minute, hour
let seconds, minutes, hours, t
// stars rating
const starElementChildren = starElement.children
// stop the game
let stopGame = false
// count the stars when game finishes
let starCount = 0
// number of moves after decrease star rating
const movesFactor = 9
// classes for card turn it over
const cls = ['open', 'show']

initGame()

// functionality to handle clicks on cards
deck.addEventListener('click', (evt) => {
  cardMatchingLogic(evt)
})

// click on restart button to restart the game
restartElement.addEventListener('click', () => {
  restartGame()
})

// click on play again button to play again
playAgainBtn.addEventListener('click', () => {
  restartGame()
})

/**
 * restart the game
 */
function restartGame () {
  initGame()
}

/**
 * initialize game
 */
function initGame () {
  resetGrid()
  initCardVariables()
  clearMoves()
  stopTimer()
  clearTimer()
  generateStarRating()
  startTimerEvent()
}

/**
 * initialize card variables
 */
function initCardVariables () {
  openCards = []
  matchCards = []
}

/**
 * clear the moves count
 */
function clearMoves () {
  movesText.textContent = '0'
  movesCounter = 0
  factor = 1
}

/**
 * clear the timer
 */
function clearTimer () {
  timeElement.textContent = '00:00:00'
  seconds = 0
  minutes = 0
  hours = 0
}

/**
 * generate a star html
 */
function generateStar () {
  return `<li><i class='fa fa-star'></i></li>`
}

/**
 * generate a star rating html
 */
function generateStarRating () {
  if (starElement.childElementCount > 0) {
    while (starElement.firstChild) {
      starElement.removeChild(starElement.firstChild)
    }
  }
  if (starElement.childElementCount <= 0) {
    for (let i = 0; i < nStars; i++) {
      starElement.innerHTML += generateStar()
    }
  }
}

/**
 * Display the cards on the page
 */
function buildGrid () {
  // shuffle the list of cards
  const shuffleCards = shuffle(cardsList)
  // create each card HTML
  const cardsHTML = shuffleCards.map(i => {
    return buildCard(i)
  })
  // add each card's HTML to page
  cardsHTML.forEach(element => {
    deck.innerHTML += element
  })
}

/**
 * reset the grid
 */
function resetGrid () {
  // if there is already cards therefore remove cards
  if (deck.childElementCount > 0) {
    while (deck.firstChild) {
      deck.removeChild(deck.firstChild)
    }
  }
  // add card's HTML to page
  buildGrid()
}

/**
 * Show the card
 * @param evt
 */
function cardMatchingLogic (evt) {
  if (stopGame) return
  const targetElement = evt.target

  cardFlip(targetElement)

  // list already has another card, check to see if the two cards match or not
  if (openCards.length > 1) {
    // cards do match, lock the cards in the open position
    if (openCards[0].firstElementChild.classList[1] === openCards[1].firstElementChild.classList[1]) {
      cardsMatch()
      showMoves()
      winningLogic()
    } else if (openCards[0].firstElementChild.classList[1] !== openCards[1].firstElementChild.classList[1]) { // cards do not match, remove the cards from the list and hide the card's symbol
      cardsMismatch()
      showMoves()
    }
  }
}

const superToggle = (element, class0, class1) => {
  element.classList.toggle(class0)
  element.classList.toggle(class1)
}

/**
 * check player has game won
 */
function winningLogic () {
  if (matchCards.length >= 16) {
    modal.style.display = 'block'
    showModal()
    stopTimer()
    modalInformation()
  }
}

/**
 * show the modal
 */
function showModal () {
  const $ = window.$
  $('#open-modal').animatedModal() // initialize animatedModal
  $('#open-modal').click() // triggers opening of Modal.
}

/**
 * show the modal information
 */
function modalInformation () {
  countStars()
  setScoreMsg()
}

/**
 * count the stars currently star rating has
 */
function countStars () {
  starCount = 0
  for (let i = 0; i < starElementChildren.length; i++) {
    if (starElementChildren[i].firstElementChild.classList.contains('fa-star')) {
      starCount++
    }
  }
}

/**
 * set the score message
 */
function setScoreMsg () {
  scoreMsg.textContent = `With ${movesCounter} Moves and ${starCount} Stars.\r\nTime Taken ${(hours > 0) ? `${hours}h ` : ''}${(minutes > 0) ? `${minutes}m ` : ''}${(seconds >= 0) ? `${seconds}s` : ''}\r\nWoohoo!`
}

/**
 * count and show the moves and star rating based on number of moves
 */
function showMoves () {
  movesCounter++
  movesText.innerHTML = movesCounter
  starRating()
}

/**
 * number of moves during the game visually decrease the star rating
 */
function starRating () {
  if (movesCounter > (factor * movesFactor) && factor <= nStars) {
    starElementChildren[nStars - factor].firstElementChild.classList.remove('fa-star')
    starElementChildren[nStars - factor].firstElementChild.classList.add('fa-star-o')
    factor++
  }
}

/**
 * Flip the cards and store the turned-over cards in openCards list
 * @param targetElement
 */
function cardFlip (targetElement) {
  if (targetElement.nodeName.toLowerCase() === 'li' &&
    !targetElement.classList.contains(...cls) &&
    !targetElement.classList.contains('match')) {
    superToggle(targetElement, ...cls)
    openCards.push(targetElement)
  }
}

/**
 * cards do not match, remove the cards from the list and hide the card's symbol
 */
function cardsMismatch () {
  stopGame = true
  openCards[0].classList.add('mismatch')
  openCards[1].classList.add('mismatch')
  openCards[0].classList.add('animated', 'wobble', 'faster')
  openCards[1].classList.add('animated', 'wobble', 'faster')
  setTimeout(() => {
    superToggle(openCards[0], ...cls)
    superToggle(openCards[1], ...cls)
    openCards[0].classList.remove('mismatch')
    openCards[1].classList.remove('mismatch')
    openCards[0].classList.remove('animated', 'wobble', 'faster')
    openCards[1].classList.remove('animated', 'wobble', 'faster')
    openCards.splice(0, 2)
    stopGame = false
  }, 1000)
}

/**
 * cards do match, lock the cards in the open position
 */
function cardsMatch () {
  openCards[0].classList.remove(...cls)
  openCards[1].classList.remove(...cls)
  openCards[0].classList.add('match')
  openCards[1].classList.add('match')
  openCards[0].classList.add('animated', 'pulse', 'faster')
  openCards[1].classList.add('animated', 'pulse', 'faster')
  const cards = openCards.splice(0, 2)
  matchCards.push(...cards)
}

// click on any card to start the timer
function startTimerEvent () {
  deck.addEventListener('click', startTimer, {
    once: true,
    passive: true,
    capture: true
  })
}

/**
 * start the timer
 * @param evt
 */
function startTimer (evt) {
  if (evt.target.nodeName.toLowerCase() === 'li') {
    timer()
  }
}

/**
 * stop the timer
 */
function stopTimer () {
  clearTimeout(t)
}

function add () {
  seconds++
  if (seconds >= 60) {
    seconds = 0
    minutes++
    if (minutes >= 60) {
      minutes = 0
      hours++
    }
  }

  timeElement.textContent = (hours ? (hours > 9 ? hours : '0' + hours) : '00') + ':' + (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') + ':' + (seconds > 9 ? seconds : '0' + seconds)

  timer()
}

function timer () {
  t = setTimeout(add, 1000)
}
