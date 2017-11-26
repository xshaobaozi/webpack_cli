var MessageBus = require('../MessageBus');

export default function gotoRoom({isSelf, roomId, channelId, uid}) {
    var islive = roomId && channelId;

    if (ccapi.isCCPC) {
        return external.ICC_ShowConfirmJoinRoomDialog(roomId, channelId, 'others');
    }

    if (isSelf || !islive) {
        // MessageBus.clientAlert({
        //     text: '您确定前往查看该主播资料？',
        //     btn1: '确定',
        //     btn2: '取消'
        // }, function () {
        //     window.location.href: = 'cc://personal/' + uid;
        // });
        window.location.href = 'cc://personal/' + uid;
    } else {
        MessageBus.clientAlert({
            text: '您确定离开当前所在频道，前往围观该主播？',
            btn1: '确定',
            btn2: '取消'
        }, function () {
            window.location.href = 'cc://join-room/' + roomId + '/' + channelId;
        });
    }
}