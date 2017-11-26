var onRoomEvent = {
    enterroom: []
};
var svr_bc = 0;
var i = 0;
var tcp = {
    '517|17': function() {},
    '41511|1': function() {
        return {
            ccsid: 41511,
            cccid: 1,
            code: 0,
            result: 0,
            coin: 520, //int，我的鸡翅数量            
            checkin: 0 //int，0 或 1。0：当前未领取鸡翅；1：当天已领取鸡翅
        }
    },
    '41511|2': function() {
        var subject_list = [];
        for (var i = 0; i < 10; i++) {
            var w = 0;
            var s = 1;
            if(i < 3){
                w = 0
                s = 1
            } else if(i >= 3 && i <= 4){
                w = 2
                s = 2
            } else {
                w = 0
                s = 1
            };
            subject_list.push({
                _id: i == 1 ? 123 : 123456789, // str，竞猜主题id
                state: s, // int，该条竞猜状态。1：进行中；2：封盘；3：已结束
                link: 'https://www.baidu.com/', // str， 观看回放视频链接
                title: 'come baby', // str，竞猜主题
                left_total: 12000, // 左边下注总额
                right_total: 0, // int，右边下注总额
                left_rate: '2', // str，左边赔率
                right_rate: '2.28', // str，右边赔率
                left: '能', // str，左边主题，如“能”
                right: '不能', // str，右边主题，如“不能”
                winner: w, // int，0、1 或 2，0表示进行中；1表示左边赢；2表示右边赢
                close_time: 1404958872 // int，时间戳，封盘时间，单位：秒
            });
        }
        return {
            ccsid: 41511,
            cccid: 2,
            code: 0,
            result: 0,
            day: '2017-09-11',
            day_list: ['2017-09-02','2017-09-03','2017-09-04','2017-09-11','2017-09-12'], // list，日期时间列表，如：["2017-01-02"]  
            from_svr: 0, // int，0 或 1。0：前端请求的返回；1：服务端主动广播
            subject_list: subject_list //list，主题列表，每个元素为一个dict
        };
    },
    '41511|3': function() {
        return {
            ccsid: 41511,
            cccid: 3,
            code: 0,
            result: 0,
            _id: 123, // str，主题id
            side: 2, // int，1 或 2。1：下注左边；2：下注右边
            coin: 50, // int，下注鸡翅数量
            remain_coin: 10, // int，下注成功后剩余鸡翅数量
            rate: '0.2', // str，下注时的赔率
            new_rate: '1.4'// str，新的赔率。注意：此字段在服务端返回错误码4时才有效
            
        };
    },
    '41511|4': function() {
        return {
            ccsid: 41511,
            cccid: 4,
            code: 0,
            result: 0,
            title: '人才你中奖了特殊特殊特殊', // str，竞猜主题名称
            coin: -200, // int，获得/失去的鸡翅数量。大于等于0表示赢；小于0表示输        
            win: 0 // int，0 或 1。0：猜错；1：猜对
        }
    },
    '41511|5': function() {
        var rank_list = [];
        for(var i = 0; i < 30;i++){
            rank_list.push({
                nickname: '林'+i, // str，玩家昵称
                coin: 10, // int，鸡翅数量
                uid: 12366,  // int，玩家uid
                ccid: 12544  //int，玩家ccid
            });
        };
        return {
            ccsid: 41511,
            cccid: 5,
            code: 0,
            result: 0,
            page: 1,// int，第几页
            page_size: 50,// int，每页个数
            total_page: 2,// int，总页数
            coin: 20,// int，我的鸡翅数量
            uid: 12333,// int，我的uid
            diff: 10,// int，距离上一名差多少个鸡翅
            rank: 0,// int，排名。为0时表示用户没有鸡翅，显示“无排名”
            rank_list: rank_list// list，排行榜，每个元素为一个dict，字段如下：
        }
    },
    '41511|6': function() {
        var guess_list = [];
        for(var i = 0; i < 30;i++){
            guess_list.push({
                state: 1, // int，0 、1 或 2。0：未结算；1：赢；2：输
                update_time: 1404958872, // int，主题结帐时间戳，单位：秒
                create_time: 1404958872,
                title: '赢了',  // str，竞猜主题
                guess_subject: '左边',  //str，选择方
                coin: 20, // int，下注鸡翅数量
                win_coin: 10, // int，赢/输鸡翅的数量
                rate: 1.4 //str，下注时的赔率
            });
        };
        return {
            ccsid: 41511,
            cccid: 6,
            code: 0,
            result: 0,
            page: 1,// int，第几页
            page_size: 50,// int，每页个数
            total_page: 2,// int，总页数
            par_count: 20,// int，参与场次数量
            win_count: 10,// int，猜中场次数量
            total_win: 1231,// int，总盈利
            guess_list: guess_list// list，参与竞猜列表，每个元素为一个dict，字段如下：
        };
    },
    '41511|7': function() {
        return {
            ccsid: 41511,
            cccid: 7,
            code: 0,
            result: 0,
            coin: 100 // int，获得鸡翅数量
        };
    },
    '41511|8': function() {
        return {
            ccsid: 41511,
            cccid: 8,
            code: 0,
            result: 0,
            coin: 500, // int，获赠的鸡翅数量
            remain_coin: 20 // int，目前我的剩余鸡翅数量
        }
    },
    '41511|9': function() {},
    '41511|10': function() {},
    '41511|11': function() {},
    '41511|12': function() {},
    '41511|13': function() {
        var player = [];
        for (var i = 0; i < 100; i++) {
            player.push({
                'nick': '昵称' + i,
                'ccid': 123532435 + i,
                'uid': 12313432423 + i,
                'gift_num': 1000 - i
            });
        }
        return {
            ccsid: 41511,
            cccid: 13,
            code: 0,
            result: 0,
            lottery_id: 1,
            page: 1,
            page_size: 100,
            total_page: 1,
            show_giftnum: 1,
            saleid: 1,
            willnum: 100,
            player_list: player
        }
    },
    '41511|200': function() {},
    '41511|201': function() {}
};
var tcpCallback = {};

window.roomModules = {
    onRoomEvent: function(name, cb) {
        console.log('[onRoomEvent]', arguments);
        onRoomEvent[name].push(cb);
        setTimeout(function() {
            var tmp;
            while (onRoomEvent[name].length) {
                tmp = onRoomEvent[name].shift();
                tmp && tmp();
            }
        }, 1000);
    },
    getUserInfo: function() {
        console.log('[getUserInfo]', arguments);
        return {
            ccid: 11111, // 当前用户ccid
            uid: 2, // 当前用户uid
            urs: '11@163.com', // 当前用户urs
            nick: '阿斯顿发啊', // 当前用户昵称
            purl: '', // 当前用户完整头像地址
            cquan: {
                paid: 0, // 付费c券，默认0
                free: 0 // 免费c券，默认0
            }
        };
    },
    getAnchorInfo: function() {
        console.log('[getAnchorInfo]', arguments);

    },
    tcp: {
        send: function(msg) {
            console.log('[tcp.send]', arguments);
            setTimeout(function() {
                var key = msg.sid + '|' + msg.cid;
                var tmp = tcp[key];
                console.log('tcpCallback tmp', key, tmp);
                if (tmp) {
                    $.each(tcpCallback[key], function(index, val) {
                        tmp() && val(tmp());
                    });
                }
            }, 20);
        },
        listen: function(sid, cid, callback) {
            console.log('[tcp.listen]', sid, cid, callback);
            var key = sid + '|' + cid,
                tmp = tcpCallback[key];
            if (!tmp) {
                tmp = tcpCallback[key] = [];
            }
            tcpCallback[key].push(callback);
        }
    },
    win: {}
};