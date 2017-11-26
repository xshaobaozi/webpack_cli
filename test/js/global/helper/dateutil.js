// 月(M)、日(d)、小时(h)、分(m)、秒(s)可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符
exports.dateFormat = function (date, format) {
    var o = {
        'M+': date.getMonth() + 1, //月
        'd+': date.getDate(), //日
        'h+': date.getHours(), //时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds() //秒
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    return format;
};

exports.zero = function (t) {
    t.setHours(0);
    t.setMinutes(0);
    t.setSeconds(0);
    return t;
};

exports.dateRange = function (start, end) {
    var ONEDAY = 24 * 3600 * 1000;

    var result = [];
    var x = start;

    function zero(t) {
        t.setHours(0);
        t.setMinutes(0);
        t.setSeconds(0);
    }

    zero(start);
    zero(end);

    if (end - start < 0) {
        return result;
    }

    do {
        result.push(x);
    } while ((x = new Date(x.getTime() + ONEDAY)) <= end);

    return result;
};

exports.dateMinus = function (date, num) {
    var ONEDAY = 24 * 3600 * 1000;
    return new Date(date.getTime() - num * ONEDAY);
};

exports.getTodayStr = function getTodayStr() {
    return exports.dateFormat(new Date(), 'yyyy-MM-dd');
};

exports.parseShortDate = function parseShortDate(str) {
    var a = str.split('-').map(function (s) {
        return parseInt(s, 10);
    });

    return new Date(a[0], a[1] - 1, a[2]);
};

exports.isDayEqual = function isDayEqual(day1, day2) {
    return day1.getFullYear() === day2.getFullYear() &&
        day1.getMonth() === day2.getMonth() &&
        day1.getDate() === day2.getDate();
};

exports.minusByDay = function isDayEqual(day1, day2) {
    day1.setHours(0);
    day1.setMinutes(0);
    day1.setSeconds(0);
    day2.setHours(0);
    day2.setMinutes(0);
    day2.setSeconds(0);

    return day1.getTime() - day2.getTime();
};