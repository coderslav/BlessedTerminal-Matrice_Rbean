const blessed = require('blessed');
const axios = require('axios');
const API_KEY = require('./key.js');

function timeHandler() {
    let timeObject = new Date();
    return { time: timeObject.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), date: timeObject.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) };
}
function memoryUsageHandler() {
    let memoryData = process.memoryUsage();
    let memoryUsagePercent = (memoryData.heapUsed * 100) / memoryData.heapTotal;
    return memoryUsagePercent.toFixed(2);
}

let screen = blessed.screen({
    smartCSR: true,
});
screen.title = 'Cursed Terminal';

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

let box = blessed.box({
    width: '20%',
    height: '50%',
    content: `\n\n\n\n\n${timeHandler().time}\n\n\n\n\n${timeHandler().date}`,
    align: 'center',
    tags: true,
    border: {
        type: 'line',
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
    },
});

let memoryPercentBox = blessed.box({
    height: '20%',
    top: '40%',
    content: memoryUsageHandler() + '%',
    align: 'center',
    tags: true,
    style: {
        fg: 'green',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
    },
});

let memoryBox = blessed.box({
    left: '80%',
    width: '20%',
    height: '25%',
    align: 'center',
    content: `\n\nMemory`,
    tags: true,
    border: {
        type: 'line',
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
    },
});

let weatherBox = blessed.box({
    left: '20%',
    width: '40%',
    height: '50%',
    align: 'center',
    content: '',
    tags: true,
    border: {
        type: 'line',
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
    },
});
let weatherImage = blessed.image({
    parent: weatherBox,
    top: 0,
    left: '25%',
    width: '500',
    height: '500',
    type: 'ansi',
    file: '',
});

let exchangeRate = blessed.box({
    left: '60%',
    width: '20%',
    height: '50%',
    content: `\n\n\nBTC\n\n\n\n\n\nUSD\n57,687.04`,
    align: 'center',
    tags: true,
    border: {
        type: 'line',
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
    },
});

screen.append(box);
screen.append(memoryBox);
screen.append(weatherBox);
screen.append(exchangeRate);
memoryBox.append(memoryPercentBox);
weatherBox.append(weatherImage);

screen.render();

setInterval(() => {
    box.setContent(`\n\n\n\n\n${timeHandler().time}\n\n\n\n\n${timeHandler().date}`);
    screen.render();
}, 1000);

setInterval(() => {
    let memoryUsageUpdatePercent = memoryUsageHandler();
    if (parseFloat(memoryPercentBox.content) > memoryUsageUpdatePercent) {
        memoryPercentBox.style.fg = 'green';
    } else {
        memoryPercentBox.style.fg = 'red';
    }
    memoryPercentBox.setContent(`${memoryUsageUpdatePercent}%`);
}, 5000);

axios
    .get(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${API_KEY}&q=Paris&format=json&date=today`)
    .then((data) => {
        weatherBox.setContent('\n\n\n\n\n\n\n\n\n\nParis ' + data.data.data.current_condition[0].temp_C + '°C\n\n\n\n');
        weatherImage.setImage(data.data.data.current_condition[0].weatherIconUrl[0].value);
    })
    .catch((err) => console.log(err));

setInterval(() => {
    axios
        .get(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${API_KEY}&q=Paris&format=json&date=today`)
        .then((data) => {
            weatherBox.setContent('\n\n\n\n\n\n\n\n\n\nParis ' + data.data.data.current_condition[0].temp_C + '°C');
            weatherImage.setImage(data.data.data.current_condition[0].weatherIconUrl[0].value);
        })
        .catch((err) => console.log(err));
}, 15000);
