module.exports = {
    getUrlParam: function (url,str){
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
    }
}