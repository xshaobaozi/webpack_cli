var DAY_CONS = 3600 * 24;
var HOUR_CONS = 3600;
var MIN_CONS = 60;
var SEC_CONS = 1;


module.exports = function timeRemain(remain) {
    var delta = remain;
    var remain_time = {};

    if (delta < 0) delta = 0;

    remain_time.days = Math.floor(delta / DAY_CONS);
    delta -= remain_time.days * DAY_CONS;

    remain_time.hours = Math.floor(delta / HOUR_CONS);
    delta -= remain_time.hours * HOUR_CONS;

    remain_time.mins = Math.floor(delta / MIN_CONS);
    delta -= remain_time.mins * MIN_CONS;

    remain_time.secs = Math.floor(delta / SEC_CONS);

    return remain_time;
};