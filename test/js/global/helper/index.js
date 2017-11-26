import dateutil from './dateutil.js';

const ONE_MINUTE = 60;

export function removeEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return string.replace(regex, '');
}

export function getTimeDes({ cur_timestamp, timestamp }) {
    var delta = cur_timestamp - timestamp;
    if (delta <= ONE_MINUTE) {
        return '刚刚';
    }

    var deltaMinutes = delta / ONE_MINUTE;
    var ceilMin = Math.ceil(deltaMinutes);
    if (ceilMin >= 2 && ceilMin <= 59) {
        return `${ceilMin}分钟前`;
    }

    var today = dateutil.zero(new Date(cur_timestamp * 1000));
    var yestoday = dateutil.dateMinus(today, 1);
    var cur_year = dateutil.zero(new Date(cur_timestamp * 1000));
    cur_year.setDate(1);
    cur_year.setMonth(0);
    var stamp = new Date(timestamp * 1000);

    if (today <= stamp) {
        return dateutil.dateFormat(stamp, 'hh:mm');
    } else if (yestoday <= stamp) {
        return `昨天${dateutil.dateFormat(stamp, 'hh:mm')}`;
    } else if (cur_year <= stamp) {
        return dateutil.dateFormat(stamp, 'MM/dd hh:mm');
    } else {
        return dateutil.dateFormat(stamp, 'yyyy/MM/dd hh:mm');
    }
}

export function calcSongLen(songName, limit) {
    var i = 0;
    var len = 0;
    var sigleByte = /[\x00-\xff]/;
    var result = {
        overflow: false,
        shorted: removeEmojis(songName)
    };

    for ( ;i < songName.length; i++) {
        if (sigleByte.test(songName[i])) {
            len += 1;
        } else {
            len += 2;
        }

        if (len > limit) {
            result.overflow = true;
            result.shorted = songName.slice(0, i);
            break;
        }
    }

    return result;
}