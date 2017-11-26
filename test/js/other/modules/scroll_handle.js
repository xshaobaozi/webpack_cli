require('./scroll');

class Scroll {
    constructor(name, options) {
        if(options.endFun) {
            name.slide({
                ...options
            });
        }else{
            name.slide({
                ...options,
                'endFun': _initBtnCall
            });
        }
        this._optons = options;
        this._pre = $(options.root).find('.prev');
        this._next = $(options.root).find('.next');
        this
            .initStopBtn()
            .initShowList();

        //这里的this是组件本身
        function _initBtnCall(i, c) {
            const _root = $(this.root);
            const prevCell = _root.find(this.prevCell);
            const nextCell = _root.find(this.nextCell)
            const isLast = parseInt(i + this.vis) >= c;

            if(i < 1 ) {
                prevCell.addClass('disabled');
            }else if(isLast){
                nextCell.addClass('disabled');

            }else{
                prevCell.removeClass('disabled');
                nextCell.removeClass('disabled');
            }
        }
    }
    //监听展示列表
    initShowList() {
        return this;
    }
    initStopBtn() {
        // this._pre.on('click', _stopBtn);
        // this._next.on('click', _stopBtn);

        // function _stopBtn(e) {
        //     if($(this).hasClass('disabled')) {
        //     }
        // }
        return this;
    }
}

module.exports = Scroll;
