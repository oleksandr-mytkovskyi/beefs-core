const events = require('events');

const range = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'];
const attempt = 10;

const config = {
    range: range,
    attempt: attempt,
    secretRange: 6

}

class CoreGame {
    constructor(secret, gameConfig = config) {
        this.gameConfig = gameConfig;
        this.secret = secret || this.randomSecret();
        this.gameOptions = {
            ox: 0,
            cow: 0,
            trying: 0,
            status: false,
        };
        this.event = new events.EventEmitter();
    }

    randomSecret() {
        const workArr = this.gameConfig.range.slice(0);
        let removed = [];
        for (let i = 0; i < this.gameConfig.secretRange; i++) {
            const randomItem = Math.floor(Math.random() * workArr.length);
            removed += workArr.splice(randomItem, 1).slice(0);
        }
        return removed
    }

    checkSecret(value) {
        try {
            this.validateSecret(value);

            if (this.gameOptions.status) return

            const secretArr = this.secret.split('');
            const valueArr = value.split('');
            let ox = 0; // бики = правильний символ + позиція
            let cow = 0; // корови = правильних символів
            secretArr.forEach((item, index) => {
                if (valueArr.includes(item)) {
                    cow++;
                }
                if (valueArr[index] === item) {
                    ox++;
                }
            });
            console.log('Бичків:', ox, 'Корів:', cow-ox, 'Залишилось спроб:', attempt - this.gameOptions.trying - 1);
            if (ox === this.gameConfig.secretRange) {
                this.gameOptions.status = true;
                this.event.emit('win');
                return true
            }
            if (this.gameOptions.trying === attempt - 1) {
                this.gameOptions.status = true;
                this.event.emit('lose');
                return true
            }

            this.setGameOptions(ox, cow, ++this.gameOptions.trying);

            return { cow: cow-ox, ox }
        } catch (e) {
            return console.log(e.message);
        }
    }

    getGameOptions() {
        return this.gameOptions;
    }

    setGameOptions(ox, cow, trying) {
        this.gameOptions.ox = ox;
        this.gameOptions.cow = cow;
        this.gameOptions.trying = trying;
        this.gameOptions.status = false;
    }

    getSecret() {
        return this.secret;
    }

    setSecret(newSecret) {
        return this.secret = newSecret || this.randomSecret();
    }

    reset(newSecret) {
        this.setSecret(newSecret);
        this.setGameOptions(0, 0, 0);
    }

    validateSecret(secret) {
        if (secret.length != this.gameConfig.secretRange) throw new Error(`must be ${this.gameConfig.secretRange} symbol`);

        const arr = secret.split('');

        arr.forEach(item => {
            const res = this.gameConfig.range.includes(item);
            if (!res) throw new Error('error range');
        });

        const uniqueItems = Array.from(new Set(arr))
        if (arr.length != uniqueItems.length) throw new Error('must be uniq value');

        return true;
    }

}

module.exports = CoreGame;