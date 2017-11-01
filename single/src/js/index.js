import css from './../style/index.scss';
// import test from './../style/index.css';
import icon from './../icon/iconfont.css';
import axios from 'axios';

const aside = document.querySelector('.aside-list');
const main = document.querySelector('.main');
const aside_config = [{
    img: 'https://rescdn.qqmail.com/zh_CN/htmledition/images/webp/resume/template/ico_t1Account_png8204dc9.png',
    desc: '男  25岁  广州'
},{
    img: 'https://rescdn.qqmail.com/zh_CN/htmledition/images/webp/resume/template/ico_t1Edu_png8204dc9.png',
    desc: '本科'
},{
    img: 'https://rescdn.qqmail.com/zh_CN/htmledition/images/webp/resume/template/ico_t1Work_png8204dc9.png',
    desc: '1年工作经验'
},{
    img: 'https://rescdn.qqmail.com/zh_CN/htmledition/images/webp/resume/template/ico_t1Tel_png8204dc9.png',
    desc: '13539717574'
},{
    img: 'https://rescdn.qqmail.com/zh_CN/htmledition/images/webp/resume/template/ico_t1Email_png8204dc9.png',
    desc: '418348152@qq.com'
}]

const main_config = [{
    title: '求职意向',
    desc: '前端开发 ',
    type: 1
},{
    title: '教育经历',
    desc: '2012.09 - 2016.06   广东科技学院  软件工程  本科 ',
    type: 1
},{
    title: '工作经历',
    type: 2,
    list: [{
        title: '2016.07 - 2017.10',
        title_desc: '友友传媒科技有限公司  前端开发',
        desc: '对本公司相关的配套产品进行开发，包括首页SEO页面，OA系统，服务商系统，优选云的前端部分的相关开发，优粉家，口袋FM等产品。偶尔穿插部分H5页面，小程序相关的页面开发。'
    },{
        title: '2015.12 - 2016.04',
        title_desc: '越亮传奇科技股份有限公司  前端开发',
        desc: '1. 进行页面的定制开发和动画效果制作 2. 对页面的UI组件进行开发 如: 翻页翻动,3D相册,表单组件 3. 根据PSD原型设计图制作相关活动页面 4. 通过ajax与后台数据对接'
    }]
},{
    title: '项目经历',
    type: 2,
    list: [{
        title: '2016.09 - 至今',
        title_desc: '优选云DSP  前端开发',
        desc: `优选云是一个通过大数据驱动的筛选优质公众号，微博号，阿里任务的平台，通过对数据进行横向对比选择出你需要的号。
        本项目使用vue ＋ element-ui 界面和通过echart实现数据的可视化，让本系统的数据通过合理的方式呈现在用户面前。
        同时本系统搭配oa系统和管理商系统，形成产品的闭环。`
    },{
        title: '2017.07 - 2017.10',
        title_desc: '定位红包  前端开发',
        desc: `定位红包是发红包者通过发红包到本系统然后分享出去到被分享者里，被分享如果打开红包的话就会被要求获取当前地理位置，获取后发红包者可以获得打开红包者的信息。
        本系统通过vue实现，通过vuex实现用户信息和操作权限之间的查询，通过vue-router实现路由之间的切换，通过腾讯地图实现地理坐标和地图呈现的基本功能。`
    },{
        title: '2017.09 - 2017.09',
        title_desc: '优选云 - 小程序  前端开发',
        desc: `优选云的小程序，是一个简化版的优选云，里面具有优选云比较核心的媒体商城功能和优质号判断功能，具有一般页面都具有的基本功能，都过小程序自带的canvas实现数据可视化，通过小程序实现的一个帮助优选云和公众号吸粉的利器。`
    },{
        title: '2016.01 - 2016.04',
        title_desc: '一秀平台开发  前端开发',
        desc: `开发定制性移动H5贺卡页面开发,包括页面的翻动,播放,音乐播放,视频播放,动画播放,用户可以根据自己需求组合页面的动画效果,根据给定的场景特效添加页面特效,如烟花,飘雪等基于canvas的3D特效,组合出一套页面后用户可以自定义上传照片,组合文字等个人定制化信息,发布到微信,qq等平台. 工作内容 1.对进用户输入的信息组件进行开发,比如贺词，性别，姓名等，并绑定用户设置的css样式回发后台 2.对H5页面的动态效果组件的开发,用户可对效果进行选择如时间长度，动画效果，速度等 3.对页面翻动组件,相册播放组件进行开发 4.制作用户前端模版发布页面`
    
    }]
},{
    title: '个人技能',
    type: 3,
    list: [{
        title: '熟悉vue体系的技术架构'
    },{
        title: '熟悉webpack配置'
    },{
        title: '对nodeJS有一定经验'
    },{
        title: '熟悉移动端/pc端页面适配'
    },{
        title: '有小程序开发经验'
    },{
        title: '熟悉postCss/sass/es6/git的使用'
    }]
}]
window.onload = e => {
    init();
}


function init (){
    aside.innerHTML = ((arr) => {
        let inner = '';
        arr.forEach(item => {
            inner += `<div>
            <span>
                <img src="${item.img}">
            </span>
            <span>${item.desc}</span>
        </div>`
        })
        return inner;
    })(aside_config);
    main.innerHTML = ((arr) => {
        let inner = '';
        arr.forEach(item => {
            switch(item.type){
                case 1:
                    inner += `
                        <div class="main-item">
                            <div class="item-title">
                                ${item.title}
                            </div>
                            <div class="item-desc">
                                <span>${item.desc}</span>
                            </div>
                        </div>
                    `
                    break;
                case 2: 
                    inner += `
                    <div class="main-item">
                        <div class="item-title">${item.title}</div>
                        ${((inner_item)=>{
                            let innerText = '';
                            inner_item.forEach(item => {
                                innerText += `
                                    <div class="item-list">
                                        <div class="item-list__title">
                                            <span class="item-list__left">${item.title}</span>
                                            <span class="item-list__right">${item.title_desc}</span>
                                        </div>
                                        <div class="item-list__desc">
                                            ${item.desc}
                                        </div>
                                    </div>
                                `
                            })
                            return innerText;
                        })(item.list)}
                    </div>
                    `
                    break;
                case 3:
                        inner += `
                            <div class="main-item"> 
                            <div class="item-title">${item.title}</div>
                            <div class="item-list">
                                ${(inner_item => {
                                    let innerText = '';
                                    inner_item.forEach(item => {
                                        innerText += `
                                            <div class="item-list__desc">
                                                ${item.title}
                                            </div>
                                        `
                                    })
                                    return innerText;
                                })(item.list)}
                            </div>
                            </div>
                        `
            }
        })
        return inner;
    })(main_config)
    document.title = '彭毅俊 - 前端开发';
}