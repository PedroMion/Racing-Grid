import { api_url } from './const.js';

const overlay = document.getElementById('overlay-response');
const popup = document.getElementById('popup-response');
const input = document.getElementById('text-response');
const button = document.getElementById('send-button');

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.getElementsByClassName('square');
    
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', handleClick);
    }
    
    button.addEventListener('click', sendResponse);
    overlay.addEventListener('click', hidePopup);
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendResponse();
        }
    });
});

const currentGame = await setUpGame();
var eventId;
var guesses = [];

function showPopup() {
    overlay.style.display = 'flex';
    popup.style.display = 'flex';
}

function hidePopup() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
}

function handleClick(event) {
    eventId = event.target.id;

    showPopup();
} 

function handleCorrectAnswer() {
    console.log(input.value);
}

function sendResponse() {
    hidePopup();
    
    const responses = getResponseListBySquareId(eventId);

    const treatedResponse = input.value.replace(" ", "").toLowerCase();

    if(treatedResponse in guesses) {
        return;
    }

    guesses.append(treatedResponse);

    for(var pilot of responses) {
        if(pilot.replace(" ", "").toLowerCase() == treatedResponse) {
            return handleCorrectAnswer();
        }
    }

    input.value = "";
}

async function setUpGame() {
    var game = await getTodayGame();

    document.getElementById("question1").innerText = game.question1;
    document.getElementById("question2").innerText = game.question2;
    document.getElementById("question3").innerText = game.question3;
    document.getElementById("questionA").innerText = game.questionA;
    document.getElementById("questionB").innerText = game.questionB;
    document.getElementById("questionC").innerText = game.questionC;

    return game;
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