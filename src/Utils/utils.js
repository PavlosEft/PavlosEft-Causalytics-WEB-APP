const utils = {
    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    PredefinedColors: ['#3A5CB9', '#922AF7', '#E49521', '#778422', '#9C965A', '#51C676', '#730DFB', '#7A0A38', '#861A9F', '#C6D638', '#2C387A', '#160726', '#FD1BCD', '#DE0DB3', '#A40CDD', '#2C505D', '#AF5793', '#1F2E1B', '#6CA8E4', '#0AF710']
}

export default utils