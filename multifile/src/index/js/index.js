import css from './../style/index.scss';

window.onload = init();

function init () {
    var canvas = document.querySelector('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var Heart = function(ctx, x, y, a) {
            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.a = a;
            this.vertices = [];
            for(let i = 0; i < 50; i++) {
                var step = i / 50 * (Math.PI * 2);//设置心上面两点之间的角度，具体分成多少份，好像需要去试。
                var vector = {
                    x : this.a *(16 * Math.pow(Math.sin(step), 3)),
                    y : this.a *(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step))
                }
                this.vertices.push(vector);
            }
        }
        Heart.prototype.draw = function() {
            this.ctx.beginPath();
            this.ctx.translate(this.x,this.y);
            this.ctx.rotate(Math.PI);
            for(let i=0; i<50; i++) {
                var vector = this.vertices[i];
                this.ctx.lineTo(vector.x, vector.y);
            }
            this.ctx.strokeStyle = "#dc143c";
            this.ctx.stroke();
        }
        canvas.onmousedown = function(e) {
            var x = e.offsetX;
            var y = e.offsetY;
            var a = 3;
            var heart = new Heart(ctx, x, y, a);
            heart.draw();
        }
};