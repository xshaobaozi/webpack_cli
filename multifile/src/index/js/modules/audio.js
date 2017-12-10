const { music_list } = require('./baseData');

const initMusic = () => {
        const music_obj = {};
        Object.keys(music_list).forEach(item => {
            const audio = document.createElement('audio');
            audio.src = music_list[item].src
            if(music_list[item].loop){
                audio.loop = true;
            }
            music_obj[item] = audio;
        })
        return music_obj;
    
}

module.exports = initMusic;