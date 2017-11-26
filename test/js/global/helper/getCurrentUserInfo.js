var normalizeUserLog = require('./normalizeUserLogo');

module.exports = function getCurrentUserInfo(callback) {
    var self = this;

    if (ccapi.isCCPC) {
        return callback({
            uid: (() => {
                try {
                    return external.ICC_GetMyUid();
                } catch(e) {
                    return external.ICC_QuerySelfUid();
                }
            })(),
            nickname: external.ICC_GetMyNick(),
            head: '',
            islogin: true
        });
        //bus_instants['main'].emit('user.update', );
    }/* else if (ccapi.isWebCC) {
        const info = ccapi.roomModules.getUserInfo();
        console.log('getUserInfo', info);
        return callback(info ? {
            uid: info.uid,
            nickname: info.nick,
            head: typeof(info.ptype) === "undefined" ? normalizeUserLog(info.ptype, info.purl) : info.purl,
            islogin: true
        } : {
            islogin: false
        });
    } */else {
        ccapi.getUserStatus({
            complete: function(res) {
                console.log('getUserStatus',res);
                var user = {
                    islogin: res.code,
                };

                if (user.islogin) {
                    user.uid = parseInt(res.data.uid, 10);
                    user.ccid = res.data.ccid;
                    user.nickname = res.data.nickname;
                    user.head = res.data.purl && typeof(res.data.ptype) !== "undefined" ? normalizeUserLogo(res.data.ptype, res.data.purl) : res.data.purl;
                }
                callback(user);
                //bus_instants['main'].emit('user.update', user);
            }
        });
    }
};
