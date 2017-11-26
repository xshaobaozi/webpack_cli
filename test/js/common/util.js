// //query param
function getUrlParam(url,str){
    var v;
    if(url.indexOf(str)>0){
        str=new RegExp("[?|&]" + str + "=([^&]+)(&|$)","i");
        v=url.match(str);
        if(v != null){
            v = v[1];
        }else{
            v = false;
          }
    }else{
        v = false;
    }
    return v;
};

//判断ie几
function isIE() {
    const ua = navigator.userAgent.toLowerCase();
    let s;
    return (s = ua.match(/msie ([\d.]+)/)) ? parseInt(s[1]) : undefined;
}

module.exports = {
    getUrlParam,
    isIE
}