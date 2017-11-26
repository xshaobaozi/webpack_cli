module.exports = function getGuildFlag(roomId, flag, url) {
    url = (url || '').replace(/^(http:|https:)/, '');

    var flagId = 154;
    var flags = [
        'cc.png', 'cc_small.png',
        'tx2.png', 'tx2_small.png',
        'qn.png', 'qn_small.png',
        'taobao.png', 'taobao_small.png',
        'csxy.png', 'csxy_small.png',
        'xywz.png', 'xywz_small.png',
        'dh2.png', 'dh2_small.png',
        'dhzs.png', 'dhzs_small.png',
        'flag_cc_consoles.a.png', 'flag_cc_consoles_s.a.png',
        'flag_cc_coollight.a.png', 'flag_cc_coollight_s.a.png',
        'flag_cc_ink.a.png', 'flag_cc_ink_s.a.png',
        'flag_cc_lovely.a.png', 'flag_cc_lovely_s.a.png',
        'flag_cc_skull.a.png', 'flag_cc_skull_s.a.png',
        'flag_entertainment.a.png', 'flag_entertainment_s.a.png',
        'flag_entertainment_fm.a.png', 'flag_entertainment_fm_s.a.png',
        'flag_entertainment_mc.a.png', 'flag_entertainment_mc_s.a.png',
        'flag_entertainment_mv.a.png', 'flag_entertainment_mv_s.a.png',
        'flag_entertainment_sing.a.png', 'flag_entertainment_sing_s.a.png',
        'flag_entertainment_talk.a.png', 'flag_entertainment_talk_s.a.png',
        'flag_game.a.png', 'flag_game_s.a.png',
        'flag_cc_00.a.png', 'flag_cc_00_s.a.png',
        'flag_cc_03.a.png', 'flag_cc_03_s.a.png',
        'flag_cc_04.a.png', 'flag_cc_04_s.a.png',
        'flag_game_arrows.a.png', 'flag_game_arrows_s.a.png',
        'flag_game_box.a.png', 'flag_game_box_s.a.png',
        'flag_game_coin.a.png', 'flag_game_coin_s.a.png',
        'flag_game_heart.a.png', 'flag_game_heart_s.a.png',
        'flag_game_method.a.png', 'flag_game_method_s.a.png',
        'flag_game_tx2.a.png', 'flag_game_tx2_s.a.png',
        'flag_game_mhxy.a.png', 'flag_game_mhxy_s.a.png',
        'flag_game_qnyh.a.png', 'flag_game_qnyh_s.a.png'
    ];
    var thatFlag = '';
    switch (roomId) {
        case 11:
            flagId = 112;
            break;
        case 815:
            flagId = 124;
            break;
        case 66:
            flagId = 114;
            break;
        case 5266:
            flagId = 126;
            break;
        case 77:
            flagId = 115;
            break;
        case 88:
            flagId = 120;
            break;
        case 99:
            flagId = 122;
            break;
    }
    if (flag == -1) {
        //TODO: unknow
    } else if (flag < 0) {
        return url;
    } else if (flag > 0) {
        flagId = flag;
    }

    thatFlag = '//cc.163.com/activity/common/images/flag/' + flags[flagId - 111];
    return thatFlag;
};