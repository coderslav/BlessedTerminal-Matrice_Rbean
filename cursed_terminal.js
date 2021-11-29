const blessed = require('blessed');

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

screen.append(box);
screen.append(memoryBox);
screen.append(weatherBox);
memoryBox.append(memoryPercentBox);

setInterval(() => {
    box.setContent(`\n\n\n\n\n${timeHandler().time}\n\n\n\n\n${timeHandler().date}`);
    screen.render(box);
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
