import css from './../style/index.scss';
// import test from './../style/index.css';
import icon from './../icon/iconfont.css';
import axios from 'axios';

window.onload = e => {
    init();
}


function init (){
   console.log('-----start-----');
   console.log(axios);
   axios({
       method: 'get',
       url: '/api/common/captcha/',
       params: {
           length: 4,
           width: 100,
           height: 35
       }
   })
   .then((res) => {
        console.log(res);
   })
}