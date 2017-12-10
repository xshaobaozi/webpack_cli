const api_list = {
    postMsg(data) {
        console.log(data)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    code: 0,
                    data: {
                        url: '',
                        ok: 1
                    }
                })
            }, 2000)
        })
    },
    getImg(data) {
        console.log(data)
        return new Promise((resolve, reject) => {
            let count = 0;
            getservImg();
            function getservImg() {
                count++
                setTimeout(() => {
                    if(count > 5){
                        resolve(count)
                    }else{
                        setTimeout(() => {
                            console.log(count)
                            getservImg()
                        }, 1000)
                    }
                }, 2000)
            }
        })
    }
}

module.exports = api_list;