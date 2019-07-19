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

// list of open cards
let openCards = [];
// classes for card turn it over
const cls = ["open", "show"];

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
        }
        // cards do not match, remove the cards from the list and hide the card's symbol
        if (openCards[0].firstElementChild.classList[1] !== openCards[1].firstElementChild.classList[1]) {
            cardsMismatch();
        }
    }
}

let superToggle = (element, class0, class1) => {
    element.classList.toggle(class0);
    element.classList.toggle(class1);
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
    openCards.splice(0, 2);
}