import getUrlParam from './getUrlParam';

function toInt(x) {
    return parseInt(x || 0, 10) || 0;
}

function getActMainUrl(act_id = 0, room_id = 0) {
    // var result = location.href.replace(/^(http:|https:)/, '');
    var result = location.href;
    var str_array = result.split('/');
    str_array.pop();
    result = str_array.join('/') + `/?activity_id=${act_id}&room_id=${room_id}`;
    return result;
}

var act_id = toInt(getUrlParam(location.href, 'activity_id'));
var room_id = toInt(getUrlParam(location.href, 'room_id'));
// 活动主页面链接
var act_main_url = getActMainUrl(act_id, room_id);

export default {
    id: act_id,
    name: '',
    location: '',
    room_id: room_id,
    act_main_url
};