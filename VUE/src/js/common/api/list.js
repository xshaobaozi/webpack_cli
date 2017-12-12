// api的url前缀, 对应规则可以查看根目录的 config.js 里的 proxy
let PREFIX = '/api';
if(window.location.host === 'localhost:8080'){
    PREFIX = '//api.dev.cc.163.com'
}else{
    PREFIX = '//api.cc.163.com'
}
// const PREFIX = '';

let url = {
    //获取活动时间
    getActtime: `${PREFIX}/v1/campinfo/2018/act_time`,
    // 绑定员工帐号
    postBinding: `${PREFIX}/v1/campinfo/2018/binding`,
    //加入队伍
    postJoin: `${PREFIX}/v1/campinfo/2018/join`,
    //获取各队伍报名人数
    getTeamnum: `${PREFIX}/v1/campinfo/2018/team_num`,
    //获取用户详细信息
    getUserInfo: `${PREFIX}/v1/campinfo/2018/user_info`

}

export default {
    getActtime (data) {
        // return {
        //     methods: 'get', url: url.getActtime, data: data
        // }
        return {
            code: 'OK',
            data: {
                available: 0,
                end_time: 'yyy-mm-dd hh:mm:ss',
                start_time: 'mm-dd hh:mm:Ss' 
            },
            msg: '',
            time: new Date().getTime(),
            why: 'not why'
        }
    },
    postBinding (data) {
        return {
            code: 'OK'
        }
        return {
            methods: 'post', url: url.postBinding, data: data
        }
    },
    postJoin (data) {
        return {
            code: 'OK',
            team_num: {
                DBD: 101,
                FDM: 200,
                WSYW: 300 
            },
            msg: '',
            time: new Date().getTime(),
            why: 'not why'
        }
        return {
            methods: 'post', url: url.postJoin, data: data
        }
    },
    getTeamnum (data) {
        return {
            code: 'OK',
            data: {
                DBD: 100,
                FDM: 200,
                WSYW: 300 
            },
            msg: '',
            time: new Date().getTime(),
            why: 'not why'
        }
        return {
            methods: 'get', url: url.getTeamnum, data: data
        }
    },
    getUserInfo (data) {
        return {
            code: 'OK',
            data: {
                user_info: {
                    bind_time: '2017-12-18 hh:mm:ss',
                    cuteid: 'gzm211',
                    join_time: 'yyy-mm-dd hh:mm:ss',
                    staff_id: 123,
                    staff_name: '烧包',
                    team: 'DBD',
                    urs: 1231
                }
            },
            msg: '',
            time: new Date().getTime(),
            why: 'not why'
        }
        return {
            methods: 'get', url: url.getUserInfo, data: data
        }
    }
}