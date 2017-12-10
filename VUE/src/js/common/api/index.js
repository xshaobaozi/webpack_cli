import q from 'qwest'
import CONSTANTS from 'constants'
import apis from './list'

let common = Object.keys(apis).reduce( (p, c, index) => {
    let module = {}
    const ajax = data => {
        return (params) => {
            if(data.methods){
                return q[data.methods](data.url, params,{
                    dataType: data.methods == 'post'?'json':'post'
                })
            }else{
                return Promise.resolve(data)
            }
        }
    }
    if( index == 1 ) {
        module[p] = new ajax(apis[p]())
        module[c] = new ajax(apis[c]())
        return module
    }else{
        module[c] = new ajax(apis[c]())
        return Object.assign({},p,module)
    }

})
export default common