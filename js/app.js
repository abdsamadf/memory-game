/*
 * Create a list that holds all of your cards
 */
let cardsList = document.querySelectorAll(".card");

let numbers = [];
for (let i = 0; i < cardsList.length; i++) {
    numbers.push(i);
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

// shuffle the list of cards
let randomNumbers = shuffle(numbers);
let randomCards = [];
for (let i = 0; i < cardsList.length; i++) {
    randomCards.push(cardsList[randomNumbers[i]]);
}

// remove cards
let deck = document.querySelector('.deck');
while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
}

// add each card's HTML to page
randomCards.forEach(element => {
    console.log(element);
    deck.appendChild(element);
});


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
})

// get the modal element
let modal = document.getElementById("modal");
// get the moves text element
let movesText = document.querySelector(".moves");
// list of open cards
let openCards = [];
// list of match cards
let matchCards = [];
// classes for card turn it over
const cls = ["open", "show"];
// count moves
let movesCounter = 0;

// get the stars element
let starsElement = document.querySelectorAll(".stars li");
const starsElementLength = starsElement.length;
// number of moves after decrease star rating
const movesFactor = 9;
// multiplying factor
let factor = 1;

/**
 * Show the card
 * @param evt
 */
function cardMatchingLogic(evt) {
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
        if (openCards[0].firstElementChild.classList[1] !== openCards[1].firstElementChild.classList[1]) {
            cardsMismatch();
            showMoves();
        }
    }
}

let superToggle = (element, class0, class1) => {
    element.classList.toggle(class0);
    element.classList.toggle(class1);
}
/**
 * check player has game won
 */
function winningLogic() {
    if (matchCards.length >= 16) {
        modal.style.display = "block";
        showModal();
    }
}
/**
 * show the modal
 */
function showModal() {
    $("#demo01").animatedModal(); //initialize animatedModal
    $("#demo01").click(); //triggers opening of Modal.
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
    if (movesCounter > (factor * movesFactor) && factor <= starsElementLength) {
        starsElement[starsElementLength - factor].firstElementChild.classList.remove("fa-star");
        starsElement[starsElementLength - factor].firstElementChild.classList.add("fa-star-o");
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
    setTimeout(() => {
        superToggle(openCards[0], "open", "show");
        superToggle(openCards[1], "open", "show");
        openCards.splice(0, 2);
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