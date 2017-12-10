const bg_music = require('./../../music/bg_music.mp3');
const page1_fly_wait = require('./../../music/page1_fly_wait.mp3');
const page2_findprerson = require('./../../music/page2_findprerson.mp3');
const page4_bam = require('./../../music/page4_bam.wav');
const page4_tao = require('./../../music/page4_tao.mp3');
const baseFile = './../../images/';
const music_list = {
    '101': {
        src: page1_fly_wait,
        loop: true,
        id: 'page1_fly_wait_m'
    },
    '320': {
        src : page2_findprerson,
        loop: false,
        id: 'page2_findprerson_m'
    },
    '410': {
        src : page4_tao,
        loop: false,
        id: 'page4_tao_m'
    },
    '501': {
        src: page4_bam,
        loop: false,
        id: 'page4_bam_m'
    },
    '100': {
        src: bg_music,
        loop: true,
        id: 'bg_music_m'
    }
}

const img_list = {
    'page1_bottom_wait': 15,
    'page1_fly': 30,
    'page1_fly_wait': 16,
    'page2_room': 15,
    'page2_findprerson': 9,
    'page4_tian': 21,
    'page4_tao': 15,
'page4_wait': 15
}

const dataType = {
    '101': {
        _el: '.page2_1 .page2__animation',
        offset: '-6',
        length: img_list['page1_fly_wait'],
        t: 1,
        url: 'page1_fly_wait'
    },
    '201': {
        _el: '.page2_2 .page2__animation',
        offset: '-6',
        length: img_list['page1_fly'],
        t: 1,
        url: 'page1_fly'
    },
    '202': {
        _el: '.page2_2 .page2__animation',
        offset: '-6',
        length: img_list['page1_bottom_wait'],
        t: 1,
        url: 'page1_bottom_wait'
    },
    '310': {
        _el: '.page2_3 .page2__animation',
        offset: '-6',
        length: img_list['page2_room'],
        t: 1,
        url: 'page2_room'
    },
    '320': {
        _el: '.page2_3 .page2__animation',
        offset: '-6',
        length: img_list['page2_findprerson'],
        t: 1,
        url: 'page2_findprerson'
    },
    '301': {
        _el: '.page2_3 .page2__animation',
        offset: '-6',
        length: img_list['page4_wait'],
        t: 1,
        url: 'page4_wait'
    },
    '420': {
        _el: '.page2_4 .page2__animation',
        offset: '-6',
        length: img_list['page4_tian'],
        t: 1,
        url: 'page4_tian'
    },
    '410': {
        _el: '.page2_4 .page2__animation',
        offset: '-6',
        length: img_list['page4_tao'],
        t: 1,
        url: 'page4_tao'
    }
}

const img_all_list = [
    {
        id: 'page1_bottom_wait',
        src: `${baseFile}page_1/page1_bottom_wait.png`
    },{
        id: 'page1_fly_wait',
        src: `${baseFile}page_1/page1_fly_wait.png`
    },{
        id: 'page1_fly',
        src: `${baseFile}page_1/page1_fly.png`
    },{
        id: 'page2_findprerson',
        src: `${baseFile}page_2/page2_findprerson.png`
    },{
        id: 'page2_room',
        src: `${baseFile}page_2/page2_room.png`
    },{
        id: 'page_3_ban',
        src: `${baseFile}page_2/page_3_ban.png`
    },{
        id: 'page4_tao',
        src: `${baseFile}page_4/page4_tao.png`
    },{
        id: 'page4_tian',
        src: `${baseFile}page_4/page4_tian.png`
    },{
        id: 'page4_wait',
        src: `${baseFile}page_4/page4_wait.png`
    },{
        id: 'page1_title',
        src: `${baseFile}/page1_title.gif`
    },{
        id: 'bg',
        src: `${baseFile}/bg.jpg`
    },{
        id: 'l_btn_active',
        src: `${baseFile}/l_btn_active.png`
    },{
        id: 'l_btn_nor',
        src: `${baseFile}/l_btn_nor.png`
    },{
        id: 'n_btn_active',
        src: `${baseFile}/n_btn_active.png`
    },{
        id: 'n_btn_nor',
        src: `${baseFile}/n_btn_nor.png`
    },{
        id: 'page_bottom_cao',
        src: `${baseFile}/page_bottom_cao.png`
    },{
        id: 'page1__title',
        src: `${baseFile}/page1__title.png`
    },{
        id: 'page1_person',
        src: `${baseFile}/page1_person.png`
    }
]
module.exports = {
    img_list,
    dataType,
    music_list,
    img_all_list
};