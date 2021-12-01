const blessed = require('blessed');
const axios = require('axios');
const WEATHER_API_KEY = require('./weather_key.js');
const CRYPTOCURRENCY_API_KEY = require('./cryptocurrency_key.js');

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
    content: `\n\n\nBTC`,
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

let exchangeCurrency = blessed.box({
    top: '47.37%',
    content: '',
    align: 'center',
    tags: true,
    style: {
        fg: 'white',
        bg: 'black',
    },
});

let exchangeCurrencyChoice = blessed.radioset({
    top: '43%',
    left: '40%',
    width: '20%',
    height: '20%',
    content: 'Choose Unit',
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

let radioButtonUSD = blessed.radiobutton({
    text: 'USD',
    width: '33.33%',
    top: '37.5%',
    height: '25%',
    mouse: 'enabled',
    style: {
        fg: 'white',
        bg: 'black',
    },
});
let radioButtonEUR = blessed.radiobutton({
    text: 'EUR',
    width: '33.33%',
    top: '37.5%',
    left: '33.33%',
    height: '25%',
    mouse: 'enabled',
    style: {
        fg: 'white',
        bg: 'black',
    },
});
let radioButtonGBP = blessed.radiobutton({
    text: 'GBP',
    width: '32.14%',
    top: '37.5%',
    left: '66.66%',
    height: '25%',
    mouse: 'enabled',
    style: {
        fg: 'white',
        bg: 'black',
    },
});
let submitButton = blessed.box({
    top: '70%',
    left: '40%',
    width: '22%',
    height: '20%',
    content: 'Submit',
    tags: true,
    style: {
        fg: 'white',
        bg: 'blue',
        hover: {
            bg: 'white',
            fg: 'black',
        },
    },
});
let cancelButton = blessed.box({
    top: '70%',
    left: '69%',
    width: '22%',
    height: '20%',
    content: 'Cancel',
    tags: true,
    style: {
        fg: 'white',
        bg: 'blue',
        hover: {
            bg: 'white',
            fg: 'black',
        },
    },
});

submitButton.addListener('click', () => {
    if (radioButtonUSD.value || radioButtonGBP.value || radioButtonEUR.value) {
        if (radioButtonUSD.value) {
            axios
                .get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${CRYPTOCURRENCY_API_KEY}&symbol=BTC&convert=USD`)
                .then((data) => {
                    let formattedBTCprice = parseFloat(data.data.data.BTC.quote.USD.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
                    exchangeCurrency.setContent(`USD\n${formattedBTCprice}`);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (radioButtonGBP.value) {
            axios
                .get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${CRYPTOCURRENCY_API_KEY}&symbol=BTC&convert=GBP`)
                .then((data) => {
                    let formattedBTCprice = parseFloat(data.data.data.BTC.quote.GBP.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
                    exchangeCurrency.setContent(`GBP\n${formattedBTCprice}`);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (radioButtonEUR.value) {
            axios
                .get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${CRYPTOCURRENCY_API_KEY}&symbol=BTC&convert=EUR`)
                .then((data) => {
                    let formattedBTCprice = parseFloat(data.data.data.BTC.quote.EUR.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
                    exchangeCurrency.setContent(`EUR\n${formattedBTCprice}`);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        screen.remove(exchangeCurrencyChoice);
    }
});

cancelButton.addListener('click', () => {
    screen.remove(exchangeCurrencyChoice);
});

screen.append(box);
screen.append(memoryBox);
screen.append(weatherBox);
screen.append(exchangeRate);
screen.append(exchangeCurrencyChoice);
memoryBox.append(memoryPercentBox);
weatherBox.append(weatherImage);
exchangeRate.append(exchangeCurrency);
exchangeCurrencyChoice.append(radioButtonUSD);
exchangeCurrencyChoice.append(radioButtonEUR);
exchangeCurrencyChoice.append(radioButtonGBP);
exchangeCurrencyChoice.append(submitButton);
exchangeCurrencyChoice.append(cancelButton);

screen.render();

axios
    .get(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${WEATHER_API_KEY}&q=Paris&format=json&date=today`)
    .then((data) => {
        weatherBox.setContent('\n\n\n\n\n\n\n\n\n\nParis ' + data.data.data.current_condition[0].temp_C + '°C\n\n\n\n');
        weatherImage.setImage(data.data.data.current_condition[0].weatherIconUrl[0].value);
    })
    .catch((err) => console.log(err));

axios
    .get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${CRYPTOCURRENCY_API_KEY}&symbol=BTC&convert=USD`)
    .then((data) => {
        let formattedBTCprice = parseFloat(data.data.data.BTC.quote.USD.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
        exchangeCurrency.setContent(`USD\n${formattedBTCprice}`);
    })
    .catch((err) => {
        console.log(err);
    });

setInterval(() => {
    box.setContent(`\n\n\n\n\n${timeHandler().time}\n\n\n\n\n${timeHandler().date}`);
    screen.render();
}, 1000);

setInterval(() => {
    let memoryUsageUpdatePercent = memoryUsageHandler();
    if (parseFloat(memoryPercentBox.content) > parseFloat(memoryUsageUpdatePercent)) {
        memoryPercentBox.style.fg = 'green';
    } else {
        memoryPercentBox.style.fg = 'red';
    }
    memoryPercentBox.setContent(`${memoryUsageUpdatePercent}%`);
}, 1000);

setInterval(() => {
    axios
        .get(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${API_KEY}&q=Paris&format=json&date=today`)
        .then((data) => {
            weatherBox.setContent('\n\n\n\n\n\n\n\n\n\nParis ' + data.data.data.current_condition[0].temp_C + '°C');
            weatherImage.setImage(data.data.data.current_condition[0].weatherIconUrl[0].value);
        })
        .catch((err) => console.log(err));
}, 5 * 60000);

setInterval(() => {
    if (exchangeCurrency.content.includes('USD')) {
        axios
            .get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${CRYPTOCURRENCY_API_KEY}&symbol=BTC&convert=USD`)
            .then((data) => {
                let formattedBTCprice = parseFloat(data.data.data.BTC.quote.USD.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
                exchangeCurrency.setContent(`USD\n${formattedBTCprice}`);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    if (exchangeCurrency.content.includes('EUR')) {
        axios
            .get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${CRYPTOCURRENCY_API_KEY}&symbol=BTC&convert=EUR`)
            .then((data) => {
                let formattedBTCprice = parseFloat(data.data.data.BTC.quote.EUR.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
                exchangeCurrency.setContent(`EUR\n${formattedBTCprice}`);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    if (exchangeCurrency.content.includes('GBP')) {
        axios
            .get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${CRYPTOCURRENCY_API_KEY}&symbol=BTC&convert=GBP`)
            .then((data) => {
                let formattedBTCprice = parseFloat(data.data.data.BTC.quote.GBP.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
                exchangeCurrency.setContent(`GBP\n${formattedBTCprice}`);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}, 10 * 6000);
