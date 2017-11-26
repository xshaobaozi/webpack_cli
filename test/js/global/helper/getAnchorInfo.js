var normalizeUserLog = require('./normalizeUserLogo');

module.exports = function getAnchorInfo(callback) {
    var self = this;
    if (ccapi.isCCPC) {
        return callback({
            aid: external.ICC_GetAnchorUid(),
            anick: '',
            alogo: ''
        });
    }/* else if (ccapi.isWebCC) {
        const info = ccapi.roomModules.getAnchorInfo();
        console.log('getAnchorInfo', info);
        return callback(info ? {
            uid: info.anchorId,
            nickname: info.anchorName,
            head: info.anchorPic,
            islogin: true
        } : {
            islogin: false
        });
    } */else {
        ccapi.getAnchorInfo({
            complete: function (res) {
                var result = {};

                if (res.code === 1) {
                    if (res.data.uid) {
                        result.aid = parseInt(res.data.uid);
                    } else {
                        result.aid = parseInt(res.data.UID);
                    }
                    result.anick = res.data.nick;
                    result.alogo = normalizeUserLog(res.data.ptype, res.data.purl);
                } else {
                    result.aid = null;
                    result.anick = '';
                    result.alogo = '';
                }

                callback(result);
            }
        });
    }
};
