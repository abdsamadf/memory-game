/*
 * Create a list that holds all of your cards
 */
let cardsList = ["fa-anchor", "fa-anchor",
                "fa-bolt", "fa-bolt",
                "fa-cube", "fa-cube",
                "fa-leaf", "fa-leaf",
                "fa-bicycle", "fa-bicycle",
                "fa-diamond", "fa-diamond",
                "fa-bomb", "fa-bomb",
                "fa-paper-plane-o", "fa-paper-plane-o"];

/**
 * build a card html
 * @param  {str} i element of cardsList
 */
function buildCard(i) {
    return `<li class="card"><i class="fa ${i}"></i></li>`;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

// get the html elements
let deck = document.querySelector('.deck'),
    starElement = document.querySelector(".stars"),
    modal = document.getElementById("modal"),
    movesText = document.querySelector(".moves"),
    timeElement = document.getElementById("time"),
    restartElement = document.querySelector(".restart");
    playAgainBtn = document.querySelector(".close-animatedModal.btn-slice");

// list of open and match cards
let openCards, matchCards;
// number of stars
let nStars = 3;
// count moves and multiplying factor
let movesCounter, factor;
// initialize second, minute, hour
let seconds, minutes, hours, t;
// stars rating
let starElementChildren = starElement.children;
// stop the game
let stopGame = false;
// number of moves after decrease star rating
const movesFactor = 9;
// classes for card turn it over
const cls = ["open", "show"];

initGame();
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

// functionality to handle clicks on cards
deck.addEventListener('click', (evt) => {
    cardMatchingLogic(evt);
});

// click on restart button to restart the game
restartElement.addEventListener('click', () => {
    restartGame();
});

// click on play again button to play again
playAgainBtn.addEventListener('click', () => {
    restartGame();
});

/**
 * restart the game
 */
function restartGame() {
    initGame();
}

/**
 * initialize game
 */
function initGame() {
    resetGrid();
    initCardVariables();
    clearMoves();
    stopTimer();
    clearTimer();
    generateStarRating();
    startTimerEvent();
}

/**
 * initialize card variables
 */
function initCardVariables() {
    openCards = [];
    matchCards = ["l", "l", "l", "l", "l", "l", "l", "l", "l", "l", "l", "l", "l", "l", ];
}

/**
 * clear the moves count
 */
function clearMoves() {
    movesText.textContent = "0";
    movesCounter = 0;
    factor = 1;
}

/**
 * clear the timer
 */
function clearTimer() {
    timeElement.textContent = "00:00:00";
    seconds = 0;
    minutes = 0;
    hours = 0;
}

/**
 * generate a star html
 */
function generateStar() {
    return `<li><i class="fa fa-star"></i></li>`;
}

/**
 * generate a star rating html
 */
function generateStarRating() {
    if (starElement.childElementCount > 0) {
        while (starElement.firstChild) {
            starElement.removeChild(starElement.firstChild);
        }

    }
    if (starElement.childElementCount <= 0) {
        for (let i = 0; i < nStars; i++) {
            starElement.innerHTML += generateStar();
        }
    }
}

/**
 * Display the cards on the page
 */
function buildGrid() {
    // shuffle the list of cards
    let shuffleCards = shuffle(cardsList);
    // create each card HTML
    let cardsHTML = shuffleCards.map(i => {
        return buildCard(i);
    });
    // add each card's HTML to page
    cardsHTML.forEach(element => {
        deck.innerHTML += element;
    });
}

/**
 * reset the grid
 */
function resetGrid() {
    // if there is already cards therefore remove cards
    if (deck.childElementCount > 0) {
        while (deck.firstChild) {
            deck.removeChild(deck.firstChild);
        }
    }
    // add card's HTML to page
    buildGrid();
}

/**
 * Show the card
 * @param evt
 */
function cardMatchingLogic(evt) {
    if (stopGame) return;
    let targetElement = evt.target;

    cardFlip(targetElement);

    // list already has another card, check to see if the two cards match or not
    if (openCards.length > 1) {
        // cards do match, lock the cards in the open position
        if (openCards[0].firstElementChild.classList[1] === openCards[1].firstElementChild.classList[1]) {
            cardsMatch();
            showMoves();
            winningLogic();
        }
        // cards do not match, remove the cards from the list and hide the card's symbol
        else if (openCards[0].firstElementChild.classList[1] !== openCards[1].firstElementChild.classList[1]) {
            cardsMismatch();
            showMoves();
        }
    }
}

let superToggle = (element, class0, class1) => {
    element.classList.toggle(class0);
    element.classList.toggle(class1);
};

/**
 * check player has game won
 */
function winningLogic() {
    if (matchCards.length >= 16) {
        modal.style.display = "block";
        showModal();
        stopTimer();
    }
}

/**
 * show the modal
 */
function showModal() {
    $("#open-modal").animatedModal(); //initialize animatedModal
    $("#open-modal").click(); //triggers opening of Modal.
}

/**
 * count and show the moves and star rating based on number of moves
 */
function showMoves() {
    movesCounter++;
    movesText.innerHTML = movesCounter;
    starRating();
}

/**
 * number of moves during the game visually decrease the star rating
 */
function starRating() {
    if (movesCounter > (factor * movesFactor) && factor <= nStars) {
        starElementChildren[nStars - factor].firstElementChild.classList.remove("fa-star");
        starElementChildren[nStars - factor].firstElementChild.classList.add("fa-star-o");
        factor++;
    }
}

/**
 * Flip the cards and store the turned-over cards in openCards list
 * @param targetElement
 */
function cardFlip(targetElement) {
    if (targetElement.nodeName.toLowerCase() === 'li') {
        if (!targetElement.classList.contains(...cls)) {
            superToggle(targetElement, ...cls);
            openCards.push(targetElement);
        }
    }
}

/**
 * cards do not match, remove the cards from the list and hide the card's symbol
 */
function cardsMismatch() {
    stopGame = true;
    setTimeout(() => {
        superToggle(openCards[0], ...cls);
        superToggle(openCards[1], ...cls);
        openCards.splice(0, 2);
        stopGame = false;
    }, 1000);
}

/**
 * cards do match, lock the cards in the open position
 */
function cardsMatch() {
    openCards[0].classList.remove(...cls);
    openCards[1].classList.remove(...cls);
    openCards[0].classList.add("match");
    openCards[1].classList.add("match");
    let cards = openCards.splice(0, 2);
    matchCards.push(...cards);
}

// click on any card to start the timer
function startTimerEvent() {
    deck.addEventListener('click', startTimer, {
        once: true,
        passive: true,
        capture: true
    });
}

/**
 * start the timer
 * @param evt
 */
function startTimer(evt) {
    if (evt.target.nodeName.toLowerCase() === 'li') {
        timer();
    }
}

/**
 * stop the timer
 */
function stopTimer() {
    clearTimeout(t);
}

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    timeElement.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}