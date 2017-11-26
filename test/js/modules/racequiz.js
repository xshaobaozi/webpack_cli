const scroll = require('./../common/scroll');

const sliderConfig = {
    effect: "left",
    vis: 3,
    pnLoop: false,
    triggerTime: 150
}

class Racequiz{
    constructor() {
        const scroll_title = new scroll($('.scroll__box'), {
            mainCell: ".scroll__list-box",
            root: '.scroll__box',
            vis: 3,
            ...sliderConfig
        })
        const scroll_game = new scroll($('.scroll__box1'), {
            mainCell: ".scroll__list-box",
            root: '.scroll__box1',
            vis: 3,
            ...sliderConfig
        })
    }
}

module.exports = Racequiz;