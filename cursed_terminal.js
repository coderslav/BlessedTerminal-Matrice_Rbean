const blessed = require('blessed');
const axios = require('axios');
const WEATHER_API_KEY = require('./weather_key.js');
const CRYPTOCURRENCY_API_KEY = require('./cryptocurrency_key.js');

function timeHandler(format) {
    let timeObject = new Date();
    return { time: timeObject.toLocaleString(format, { hour: '2-digit', minute: '2-digit', second: '2-digit' }), date: timeObject.toLocaleString(format, { day: '2-digit', month: '2-digit', year: 'numeric' }) };
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
    content: `\n\n\n\n\n${timeHandler('en-GB').time}\n\n\n\n\n${timeHandler('en-GB').date}`,
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
let inputField = blessed.textbox({
    top: '70%',
    left: '36.5%',
    width: '27%',
    height: '10%',
    value: 'Choose a City',
    align: 'center',
    mouse: 'enabled',
    inputOnFocus: true,
    style: {
        fg: 'white',
        bg: 'blue',
        hover: {
            fg: 'black',
            bg: 'white',
        },
    },
});
let changeTimeFormatButton = blessed.button({
    top: '70%',
    left: '16%',
    width: '68%',
    height: '10%',
    content: 'US Date/Time Format',
    mouse: 'enabled',
    style: {
        fg: 'white',
        bg: 'blue',
        hover: {
            fg: 'black',
            bg: 'white',
        },
    },
});

submitButton.addListener('click', () => {
    if (radioButtonUSD.value || radioButtonGBP.value || radioButtonEUR.value) {
        let ticker;
        if (radioButtonUSD.value) {
            ticker = 'USD';
        } else if (radioButtonGBP.value) {
            ticker = 'GBP';
        } else {
            ticker = 'EUR';
        }
        axios
            .get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${CRYPTOCURRENCY_API_KEY}&symbol=BTC&convert=${ticker}`)
            .then((data) => {
                let formattedBTCprice;
                if (ticker === 'USD') {
                    formattedBTCprice = parseFloat(data.data.data.BTC.quote.USD.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
                } else if (ticker === 'EUR') {
                    formattedBTCprice = parseFloat(data.data.data.BTC.quote.EUR.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
                } else {
                    formattedBTCprice = parseFloat(data.data.data.BTC.quote.GBP.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
                }
                exchangeCurrency.setContent(`${ticker}\n${formattedBTCprice}`);
            })
            .catch((err) => {
                console.log(err);
            });
        screen.remove(exchangeCurrencyChoice);
    }
});

cancelButton.addListener('click', () => {
    screen.remove(exchangeCurrencyChoice);
});

inputField.once('focus', () => {
    inputField.clearValue();
    inputField.style.fg = 'black';
    inputField.style.bg = 'white';
});
inputField.addListener('submit', () => {
    axios
        .get(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${WEATHER_API_KEY}&q=${inputField.value}&format=json&date=today`)
        .then((data) => {
            if (data.data.data.error) {
                inputField.clearValue();
                inputField.style.fg = 'red';
                inputField.style.hover.fg = 'red';
                inputField.setValue('Not found :(');
                inputField.once('focus', () => {
                    inputField.clearValue();
                    inputField.style.fg = 'black';
                    inputField.style.bg = 'white';
                });
            } else {
                inputField.clearValue();
                inputField.style.fg = 'white';
                inputField.style.bg = 'blue';
                inputField.style.hover.fg = 'black';
                inputField.setValue('Choose a City');
                inputField.once('focus', () => {
                    inputField.clearValue();
                    inputField.style.fg = 'black';
                    inputField.style.bg = 'white';
                });
                weatherBox.setContent(`\n\n\n\n\n\n\n\n\n\n${data.data.data.request[0].query}: ` + data.data.data.current_condition[0].temp_C + '°C');
                weatherImage.setImage(data.data.data.current_condition[0].weatherIconUrl[0].value);
            }
        })
        .catch((err) => console.log(err));
});

inputField.addListener('cancel', () => {
    if (inputField.value === '') {
        inputField.style.fg = 'white';
        inputField.style.bg = 'blue';
        inputField.style.hover.fg = 'black';
        inputField.setValue('Choose a City');
        inputField.once('focus', () => {
            inputField.clearValue();
            inputField.style.fg = 'black';
            inputField.style.bg = 'white';
        });
    }
});

changeTimeFormatButton.addListener('press', () => {
    let format;
    if (box.content.includes('PM') || box.content.includes('AM')) {
        format = 'en-GB';
        box.setContent(`\n\n\n\n\n${timeHandler(format).time}\n\n\n\n\n${timeHandler(format).date}`);
        changeTimeFormatButton.setContent('US Date/Time Format');
    } else {
        format = 'en-US';
        box.setContent(`\n\n\n\n\n${timeHandler(format).time}\n\n\n\n\n${timeHandler(format).date}`);
        changeTimeFormatButton.setContent('EU Date/Time Format');
    }
});

screen.append(box);
screen.append(memoryBox);
screen.append(weatherBox);
screen.append(exchangeRate);
screen.append(exchangeCurrencyChoice);
memoryBox.append(memoryPercentBox);
weatherBox.append(weatherImage);
weatherBox.append(inputField);
box.append(changeTimeFormatButton);
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
        weatherBox.setContent(`\n\n\n\n\n\n\n\n\n\n${data.data.data.request[0].query}: ` + data.data.data.current_condition[0].temp_C + '°C');
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
    let format;
    if (box.content.includes('PM') || box.content.includes('AM')) {
        format = 'en-US';
        box.setContent(`\n\n\n\n\n${timeHandler(format).time}\n\n\n\n\n${timeHandler(format).date}`);
    } else {
        format = 'en-GB';
        box.setContent(`\n\n\n\n\n${timeHandler(format).time}\n\n\n\n\n${timeHandler(format).date}`);
    }
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
    let weatherContentList = weatherBox.content.split(',');
    let weatherContentCity = weatherContentList[0].replaceAll('\n', '');
    axios
        .get(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${WEATHER_API_KEY}&q=${weatherContentCity}&format=json&date=today`)
        .then((data) => {
            weatherBox.setContent(`\n\n\n\n\n\n\n\n\n\n${data.data.data.request[0].query}: ` + data.data.data.current_condition[0].temp_C + '°C');
            weatherImage.setImage(data.data.data.current_condition[0].weatherIconUrl[0].value);
        })
        .catch((err) => console.log(err));
}, 5 * 60000);

setInterval(() => {
    let ticker;
    if (exchangeCurrency.content.includes('USD')) {
        ticker = 'USD';
    } else if (exchangeCurrency.content.includes('EUR')) {
        ticker = 'EUR';
    } else if (exchangeCurrency.content.includes('GBP')) {
        ticker = 'GBP';
    }
    axios
        .get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${CRYPTOCURRENCY_API_KEY}&symbol=BTC&convert=${ticker}`)
        .then((data) => {
            let formattedBTCprice;
            if (ticker === 'USD') {
                formattedBTCprice = parseFloat(data.data.data.BTC.quote.USD.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
            } else if (ticker === 'EUR') {
                formattedBTCprice = parseFloat(data.data.data.BTC.quote.EUR.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
            } else if (ticker === 'GBP') {
                formattedBTCprice = parseFloat(data.data.data.BTC.quote.GBP.price.toFixed(4)).toLocaleString('en-FR', { minimumFractionDigits: 4 });
            }
            exchangeCurrency.setContent(`${ticker}\n${formattedBTCprice}`);
        })
        .catch((err) => {
            console.log(err);
        });
}, 5 * 6000);

setInterval(() => {
    screen.render();
}, 100);
