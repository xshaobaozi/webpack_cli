module.exports = function normalizeUserLogo(ptype, purl) {
    purl = purl.replace(/^(http:|https:)/, '');

    // cc.cottage.netease.com 已经不推荐使用了，而且不支持 https
    if (purl.indexOf('//cc.cottage.netease.com/nsep/') == 0) {
        purl = purl.replace('//cc.cottage.netease.com/nsep/', '//cc.res.netease.com/webcc/portrait/nsep/');
    }

    if (purl.indexOf('//') == 0) {
        return purl;
    }

    var url = '';

    switch (ptype) {
        case 0:
        case 1:
            url = '//cc.res.netease.com/webcc/portrait/nsep/headicon/builtin/' + purl;
            break;
        case 2:
            url = '//cc.res.netease.com/webcc/portrait/nsep/' + purl;
            break;
        case 3:
            url = purl;
            break;
    }

    return url;
};