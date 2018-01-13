import css from './../style/index.scss';
import png from './../images/page_1/page1_fly_wait.png';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 600;

const img = new Image();

img.src = png;
window.onload = function() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(img, 0, 0, 640, 600, 0, 0, 640, 600);
    createAnimation(ctx, {
        w: 640,
        h: 9600,
        l: 16,
        img: img,
        time: 10000
    })
}

function createAnimation (_ctx, {w, h, l, img, time}) {
    let inner_h = h / l;
    let count = 0;
    let debounce = null;


    debounce = setInterval(() => {
        if(count < l){
            drawCanvas(_ctx, inner_h);
        }else{
            count = 0;
        }
    }, 1000/60)

    setTimeout(() => {
        console.log(111)
        clearInterval(debounce)
    }, time)

    function drawCanvas(_ctx, inner_h) {
        ctx.clearRect(0, 0, w, inner_h);
        ctx.drawImage(
            img,
            0,
            count * inner_h,
            w,
            inner_h,
            0,
            0,
            w,
            inner_h
        )
        count++;
    }
}