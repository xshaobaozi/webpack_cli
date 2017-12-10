module.exports = {
    setImageURl({_el, offset, length, t, url}, unInfinite = true) {
        const _rootSize = $('html').css('fontSize').replace('px', '');
        return new Promise((resolve,reject) => {
            const el = $(_el);
            const time = t / length;
            let count = 0;
            el.addClass(url);
            const changePosition = () => {
                if(count < length){
                    el.css({
                        transform: `translateY(calc(${count * -6}rem))`,
                    })
                    count = count + 1;
                    if(count >= length) {
                        if(unInfinite || window.isFinish){
                            el.removeClass(url);
                            resolve();
                        }else{
                            setTimeout(() => {
                                count = 0;
                                changePosition()
                            }, time * 1000)
                        }
                    }else{
                        setTimeout(() => {
                            changePosition()
                        }, time * 1000)
                    }
                }
            }
            changePosition()
        })
    },
    checkView({show, fade}) {
        $(fade).fadeOut('0', function() {
            $(show).removeClass('hide');
        })
    },
    setStaticUrl({_el, cls}) {
        const el = $(_el);
        el
            .addClass(cls)
            .css({
                backgroundPositionY: 0
            })
        return Promise.resolve()
    },
    numberAnimationUp({_el, number, t}) {
        const el = $(_el);

    }
}