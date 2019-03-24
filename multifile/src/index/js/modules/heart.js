class Heart{
    constructor(x, y) {
        this.point = [];
        this.x = x;
        this.y = y;
    }   

    // 计算心形坐标
    computed() {
        const Num = 6; // 我也不知道这个数字代码啥
        for(let i = 0; i < 50; i++) {
            var step = i / 50 * (Math.PI * 2);//设置心上面两点之间的角度，具体分成多少份，好像需要去试。
            const x = Num *(16 * Math.pow(Math.sin(step), 3));
            const y = Num *(
                    13 * Math.cos(step) 
                    - 5 * Math.cos(2 * step) 
                    - 2 * Math.cos(3 * step) 
                    - Math.cos(4 * step)
                );
            this.point.push({x, y});
        }
    }

    drar(ctx) {
        ctx.beginPath();
        ctx.translate(this.x,this.y);
        ctx.rotate(Math.PI);
        for(let i=0; i<50; i++) {
            var vector = this.vertices[i];
            ctx.lineTo(vector.x, vector.y);
        }
        ctx.strokeStyle = "#dc143c";
        ctx.stroke();
    }
}