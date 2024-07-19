import { api_url } from './const.js';

getTodayGame();

function getTodayGame() {
    const todayString = formatDate(new Date(), "yy-mm-dd");

    const url = api_url + '?date=' + todayString;

    console.log(url);

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

function formatDate(date, format) {
    const result = format.replace('mm', date.getMonth() + 1)
                            .replace('yy', date.getFullYear())
	                        .replace('dd', date.getDate());

    return result;
}