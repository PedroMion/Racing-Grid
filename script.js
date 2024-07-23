import { api_url } from './const.js';

const overlay = document.getElementById('overlay-response');
const responsePopup = document.getElementById('popup-response');
const gamePopup = document.getElementById('popup-game');
const input = document.getElementById('text-response');
const sendButton = document.getElementById('send-button');
const gameButton = document.getElementById('game-button');

const TOTAL_SQUARES = 9;

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.getElementsByClassName('square');
    
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', handleClick);
    }
    
    sendButton.addEventListener('click', sendResponse);
    gameButton.addEventListener('click', changeGame)
    overlay.addEventListener('click', hidePopup);
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendResponse();
        }
    });
});

const currentGame = await setUpGame();
const maxId = currentGame.id;

var eventId;
var guesses = [];
var squaresGuesseds = 0;

function showPopup(popup) {
    overlay.style.display = 'flex';
    if(popup == 'response') {
        responsePopup.style.display = 'flex';
    } else {
        gamePopup.style.display = 'flex';
    }
}

function hidePopup() {
    overlay.style.display = 'none';
    responsePopup.style.display = 'none';
    gamePopup.style.display = 'none';
}

function handleClick(event) {
    eventId = event.target.id;

    showPopup('response');
} 

function handleCorrectAnswer(pilot) {
    var responseId = 'response' + eventId.substring(eventId.length - 2);
    squaresGuesseds++;

    const squareDiv = document.getElementById(eventId);
    const squareText = document.getElementById(responseId);

    squareDiv.removeEventListener('click', handleClick);
    squareDiv.style.backgroundColor = '#b81414';
    squareDiv.style.cursor = 'auto';
    squareText.innerText = pilot;

    if(squaresGuesseds == TOTAL_SQUARES) {
        window.alert('You won!');
    }

    input.value = "";
}

function sendResponse() {
    hidePopup();
    
    const responses = getResponseListBySquareId(eventId);

    const treatedResponse = input.value.replace(" ", "").toLowerCase();

    if(guesses.includes(treatedResponse)) {
        return;
    }

    guesses.push(treatedResponse);

    for(var pilot of responses) {
        if(pilot.replace(" ", "").toLowerCase() == treatedResponse) {
            return handleCorrectAnswer(pilot);
        }
    }

    input.value = "";
}

function changeGame() {
    
    
    showPopup('game');
}

async function setUpGame() {
    var game = await getTodayGame();

    document.getElementById("question1").innerText = game.question1;
    document.getElementById("question2").innerText = game.question2;
    document.getElementById("question3").innerText = game.question3;
    document.getElementById("questionA").innerText = game.questionA;
    document.getElementById("questionB").innerText = game.questionB;
    document.getElementById("questionC").innerText = game.questionC;

    setGamesOptions(game.id);

    return game;
}

function setGamesOptions(id) {
    for (let i = 0; i <= id; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectValues.appendChild(option);
    }

    selectValues.value = id;
}

async function getTodayGame() {
    const todayString = formatDate(new Date(), "yy-mm-dd");

    const url = api_url + '?date=' + todayString;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        return undefined;
    }
}

function formatDate(date, format) {
    const result = format.replace('mm', date.getMonth() + 1)
                            .replace('yy', date.getFullYear())
	                        .replace('dd', date.getDate());

    return result;
}

function getResponseListBySquareId(id) {
    switch(id) {
        case 'square1A':
            return currentGame.square1A
        case 'square1B':
            return currentGame.square1B
        case 'square1C':
            return currentGame.square1C
        case 'square2A':
            return currentGame.square2A
        case 'square2B':
            return currentGame.square2B
        case 'square2C':
            return currentGame.square2C
        case 'square3A':
            return currentGame.square3A
        case 'square3B':
            return currentGame.square3B
        case 'square3C':
            return currentGame.square3C
    }
}