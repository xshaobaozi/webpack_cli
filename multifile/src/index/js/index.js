import highcharts from 'highcharts/highstock';
import css from './../style/index.scss';
import chart from './modules/echart';
const { dataType, music_list, img_all_list } = require('./modules/baseData');
import { setImageURl, setStaticUrl, checkView, numberAnimationUp } from './common/animation';
import audio from './modules/audio';
import apis from './modules/api';
const music_list_control = audio();

window.isFinish = true;

let manifest = [];
Object.keys(music_list).forEach(item => {
    manifest.push({
        id: music_list[item].id,
        src: music_list[item].src
    })
})
manifest = manifest.concat(img_all_list);

//长图动画映射
window.onload = init();
function init() {

    const page1BtnGroup = $('.page1__btn-group');
    const page1 = $('.page1');
    const page2 = $('.page2');
    const page3 = $('.page3');
    const page4 = $('.page4');
    const loading = $('.loading');
    const music = $('.app_music');
    const setInfo = $('.page3__main-bottom-box');
    const page2_list = ['page2_1', 'page2_2', 'page2_3', 'page2_4'];
    const infoInput = $('.info_input');
    const sharelist = ['page4__bottom-left', 'page4__bottom-right'];
    let radar = null;
    const loadingPrecent = $('.loading-precent');

    const queue = new createjs.LoadQueue()

    queue.on('complete', handleFileComplete);
    queue.on('progress', handleProgress);
    queue.on('error', handleError);
    
    queue.loadManifest(manifest)

    function handleFileComplete() {
        queue.off('complete', handleFileComplete);
        queue.off('progress', handleProgress);
    }

    function handleProgress(event) {
        const present = parseInt(event.progress * 100);
        loadingPrecent.text(present + '%');
        if(present >= 100){
            mounted()
            loading.fadeOut('normal', function() {
                $(this).addClass('hide');
                page1.removeClass('hide');
            })
        }
    }
    
        // 初始化音乐
    $('html').one('touchstart', function() {
        Object.keys(music_list_control).forEach(item => {
            if(item === '100'){
                //首页音乐循环播放
                music_list_control['100'].play();
            }else{
                music_list_control[item].play();
                music_list_control[item].pause();
            }
        })
    })

    function handleError(event) {
        console.log(event);
    }
    
    function mounted() {
        // 音乐事件
        music.on('touchstart', function() {
            if(music_list_control['100'].paused){
                $(this).removeClass('check');
                music_list_control['100'].play()
            }else{
                $(this).addClass('check');
                music_list_control['100'].pause()
            }
        })

        // 第一页按钮
        page1BtnGroup.on('touchstart', function() {
            $(this).addClass('check');
            page1.fadeOut('normal', function(){
                $(this).addClass('hide');
                page2.removeClass('hide');
                $(`.${page2_list[0]}`).trigger('animation', {
                    type: 1,
                    isleft: null
                })
            })
        })

        // 第二页选择按钮
        page2_list.forEach((item, i) => {
            if(i < 3){
                $(`.${item} .page2__bottom-1>div`).one('touchstart', changeSelcet)
            }else{
                $(`.${item} .page2__bottom-2>div`).one('touchstart', changeSelcet)
            }
            $(`.${item}`).on('animation', function(e, {type, isleft}) {
                switch(type){
                    case 1: 
                        // 飞机等待
                            window.isFinish = false;
                            music_list_control['101'].play();
                            setImageURl(dataType['101'], false);
                        break;
                    case 2:
                        // 中部主城
                        window.isFinish = true;
                        music_list_control['101'].pause();
                        if(isleft === 1){
                            $('.page2__top-city').addClass('silder');
                        }else{
                            $('.page2__top-city').addClass('center');
                        }
                        setImageURl(dataType['201'])
                            .then(() => {
                                $('.page2__top-city').addClass('hide');
                                window.isFinish = false;
                                return setImageURl(dataType['202'], false)
                            })
                        break;
                    case 3:
                        // 快递
                        // window.isFinish = true;
                        if(isleft === 1){
                            setImageURl(dataType['310'])
                                .then(() => {
                                    window.isFinish = false;
                                    return setImageURl(dataType['301'], false)
                                })
                        }else{
                            music_list_control['320'].play();
                            setImageURl(dataType['320'])
                                .then(() => {
                                    music_list_control['320'].pause();
                                    window.isFinish = false;
                                    return setImageURl(dataType['301'], false)
                                })
                        }
                        break;
                    case 4:
                        // 舔包
                        window.isFinish = true;
                        const _config = {
                            show: '.page2_4 .page2__top_2',
                            fade: '.page2_4 .page2__top'
                        };

                        if(isleft === 1){
                            music_list_control['410'].play();
                            setImageURl(dataType['410'])
                                .then(() => {
                                    music_list_control['410'].pause();
                                    return checkView(_config)
                                })
                        }else{
                            setImageURl(dataType['420'])
                                .then(() => {
                                    return checkView(_config)
                                })
                        }
                        break;
                    case 5:
                        //三选一
                        break;
                }
            })

            function changeSelcet(){
                const isleft = $(this).data('isleft');
                if(i < 3){
                    $(this)
                        .addClass('check')
                }else{
                    const isleft = $(this).data('isleft');
                    if(isleft === 2){
                        $(this)
                            .addClass('check')
                            .addClass('select_show_true')
                            .siblings()
                            .addClass('select_show_false')
                    }else{
                        $(this)
                            .siblings('.page2__bottom-right')
                            .addClass('check')
                            .addClass('select_show_true')
                            .siblings()
                            .addClass('select_show_false')

                    }
                }

                //表示page2_*
                $(`.page2 .page2_${i + 1}`)
                    .fadeOut(i < 3?'slow':'slow', function(){
                        if(i < 3){
                            //二选一
                            $(this)
                                .addClass('hide')
                                .next()
                                .trigger('animation', {
                                    type: i + 2, 
                                    isleft: isleft
                                })
                                .removeClass('hide')
                        }else {
                            //三选一
                            $(this)
                                .addClass('hide')
                                .trigger('animation', {
                                    type: i + 2, 
                                    isleft: isleft
                                })
                            page2.addClass('hide')
                            $('.page3')
                                .removeClass('hide')
                        }
                })
            }
        })

        $('.page2_4 .page2__top_2 .music_ban_btn').on('touchstart', function() {
            if(music_list_control['501'].paused){
                music_list_control['501'].play();
            }
        })
        // 用户信息录入
        setInfo.on('touchstart', function() {
            const val = infoInput.val();
            const hasCheck = $('.page3__main-list__desc').find('check')
            if(!val.trim()){
                weui.topTips('信息录入失败~');
            }else{
                $(this).addClass('check');
                apis.postMsg({
                    val: val
                })
                .then((res) => {
                    console.log('getImg')
                    loading.fadeIn('fast', function(){
                        $(this).removeClass('hide');
                        loadingPrecent.text('获取数据中...');
                    })
                    return apis.getImg()
                },(err) => {
                    $(this).removeClass('check');
                    weui.topTips('err~');
                })
                .then(() => {
                    loading.fadeOut('fast', function(){
                        $(this).addClass('hide');
                        
                    })
                    page3.fadeOut('normal', function() {
                        $(this).addClass('hide');
                        page4
                            .removeClass('hide')
                            .trigger('showCanvas')
                    })
                },() => {
                    debugger
                })
            }
        })

        //icon选择切换
        $('.page3__main-list__desc div').on('touchstart', function() {
            $(this).addClass('check').siblings().removeClass('check');
        })

        // 结果展示页
        page4.on('showCanvas', function() {
            setTimeout(() => {
                radar = new chart('#page4__main-echart_box', null);
            }, 2000)
            setTimeout(() => {
                radar.freshData({
                    series: {
                        data: [{
                            value: [10, 59, 38 ,67, 20]
                        }, {
                            value: [79, 80, 74, 30, 10]
                        }]
                    }
                })
            }, 4000)
        })

        sharelist.forEach((item, i) => {
            $(`.${item}`).one('touchstart', function() {
                $(this).addClass('check').siblings().removeClass('check')
                if(i === 0){
                    window.location.href = 'http://cc.163.com/';
                }else{
                    console.log('拉朋友测测')
                }
            })
        })

        // 初始化loading
    }
}

// import './bind.js';

// import config from './conf.js';
// import base from './base.js';
// import './debug';