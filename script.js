import { api_url } from './const.js';

const currentGame = setUpGame();

var eventId;

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.getElementsByClassName('square');

    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', handleClick);
    }
});

function handleClick(event) {
    eventId = event.target.id;

    document.getElementById("overlay-response").style.display = 'flex';
    document.getElementById("popup-response").style.display = 'flex';
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