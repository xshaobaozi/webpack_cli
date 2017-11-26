var noop = require('./noop');

module.exports = function sendGift(id) {
    ccapi.showGiftBoard({
        activityId: id,
        complete: noop
    });
};