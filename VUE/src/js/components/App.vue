<style lang="scss">
    @mixin flex_center($justify: center, $align: center) {
        display: flex;
        justify-content: $justify;
        align-items: $align;
    }
    html, body, div , p{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    #app {
      background-image: url('./../../assets/netyear.png');
      background-size: 100% 100%;
      width: 1920px;
      height: 8000px;
      position: relative;
    }
    .login{
        position: absolute;
        left: 50%;
        margin-left: -92px;
        background-color: red;
        width: 180px;
        height: 60px;
        top: 670px;
    }
    * {
        box-sizing: border-box;
    }
    .page1_box{
        display: flex;
        width: 100%;
        padding-top: 1732px;
        justify-content: center;
        align-items: center;
    }
    .team_box{
        width: 320px;
        flex-wrap: wrap;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: rgba(212,12,45,.6);
        color: white;
    }
    .team_box.center{
        transform:translateY(-76px);
    }
    .team_box_num{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 60px;
        width: 200px;
        background-color: rgba(123,65,87,.6);
        margin-bottom: 54px;
        font-size: 24px;
        padding-top: 17px;
    }
    .team_box_btn{
        width: 240px;
        height: 65px;
        background-color: rgba(98,76,21,.6);
    }
    .banner{
        position: fixed;
        top: 0;
        padding-right: 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        height: 40px;
    }
    .banner-info{
        @include flex_center(flex-end, center);
        background-color: rgba(0,0,0,.6);
    }
    .banner-info-img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
    }
    .banner-info-img > img{
        width: 100%;
        height: 100%;
    }
    .banner-info-name{
        font-size: 14px;
    }
    .banner_drop{
        @include flex_center();
        flex-direction: column;
        flex-wrap: wrap;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateY(40px);
        width: 200px;
        background-color: white;
        border: 1px solid black;
        border-radius: 12px;
        padding: 10px 10px 0 10px;
    }
    .banner_drop > div{
        margin-bottom: 10px;
    }
    .banner_drop-info{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .banner_drop-info__title{
        width: 40px;
        text-align: right;
        margin-right: 10px;
    }
    .banner_drop-info__desc{
        width: 100px;
    }

    /*dialog*/
    .dialog{
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,.6);
    }
    .dialog-box{
        @include flex_center();
        flex-direction: column;
        width: 350px;
        background-color: white;
        border: 1px solid black;
        border-radius: 12px;
        padding: 10px;
        & > div{
            margin-bottom: 10px;
        }
    }
    .dialog-box__item{
        @include flex_center(flex-start);
        & > .title{
            width: 40px;
            text-align: left;
            margin-right: 10px;
            flex-shrink: 0;
        }
        & > .in{
            width: 100%;
        }
    }
    .dialog-box__item-bottom{
        @include flex_center();
        .dialog-box__item-bottom__bind{
            margin-right: 20px;
        }
        & > div{
            border: 1px solid black;
            padding: 5px 10px;
            border-radius: 12px;
        }
    }
</style>

<template>
    <div id="app">
        <!-- banner -->
        <div class="banner">
            <div 
                @mouseover="showInfoBox(true)"
                class="banner-info">
                <div class="banner-info-img">
                    <img :src="user_info.purl" alt="">
                </div>
                <div class="banner-info-name">
                    {{user_info.nickname}}
                </div>
            </div>
            <div 
                v-if="infobox"
                @mouseleave="showInfoBox(false)"
                class="banner_drop">
                <div class="banner_drop-info">
                    <div class="banner_drop-info__title">工号:</div>
                    <div class="banner_drop-info__desc">{{account.id|formatdesc(isBind)}}</div>
                </div>
                <div class="banner_drop-info">
                    <div class="banner_drop-info__title">姓名:</div>
                    <div class="banner_drop-info__desc">{{account.name| formatdesc(isBind)}}</div>
                </div>
                <div 
                    v-if="!isBind"
                    @click="showBindBox(true)"
                    class="banner_drop-btn">绑定工号&姓名</div>
                <div 
                    @click="loginout"
                    class="banner_drop-btn">退出</div>
            </div>
        </div>
        <!-- 登录 -->
        <div 
            @click="handleLoginCC"
            class="login"></div>
        <!-- 队伍 -->
        <div class="page1_box">
            <div class="team_box">
                <div class="team_box_num">
                    {{team.FDM}}/500人
                </div>
                <div 
                    class="team_box_btn"
                    @click="jointeam('FDM')"></div>
            </div>
            <div class="team_box center">
                <div class="team_box_num">
                    {{team.DBD}}/500人
                </div>
                <div 
                    class="team_box_btn"
                    @click="jointeam('DBD')"></div>
            </div>
            <div class="team_box">
                <div class="team_box_num">
                    {{team.WSYW}}/500人
                </div>
                <div 
                    class="team_box_btn"
                    @click="jointeam('WSYW')"></div>
            </div>
        </div>
        <!-- 绑定弹窗 -->
        <div 
            v-if="bindbox"
            class="dialog">
            <div class="dialog-box">
                <div class="dialog-box__desc">
                    当前登录账号
                </div>
                <div class="dialog-box__desc">
                    {{user_info.urs}}
                </div>
                <div class="dialog-box__item">
                    <div class="title">工号</div>
                    <div class="in">
                        <input 
                            v-model="account.id"
                            type="text">
                    </div>
                </div>
                <div class="dialog-box__item">
                    <div class="title">姓名</div>
                    <div class="in">
                        <input 
                            v-model="account.name"
                            type="text">
                    </div>
                </div>
                <div class="dialog-box__item-tip">
                    一旦绑定将无法更改工号&姓名
                </div>
                <div class="dialog-box__item-bottom">
                    <div 
                        @click="bindAccount"
                        class="dialog-box__item-bottom__bind">
                        绑定
                    </div>
                    <div 
                        @click="showBindBox(false)"
                        class="dialog-box__item-bottom__cancel">
                        取消
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import apis from './../common/api';
    import {uinfo} from './userinfo';
    console.log(uinfo)
    const joinCode = {
        'OK': '成功',
        'OVER_TIME': '报已结束',
        'NOT_EXIST_TEAM': '队伍不存在',
        'NUM_LIMIT': '队伍人数达到上限，请报其他队伍',
        'ALREADY_JOIN': '已经报名',
        'NOT_BINGDING': '未绑定，请先绑定'
    }
    const bindCode = {
        'OK': '绑定成功',
        'NOT_IN_WHITE_LIST': '您的工号和姓名不在年会名单内',
        'ALREADY_BOUND': '您的工号和姓名已被绑定'
    }
    const availbale = {
        0: '活动中',
        '-1': '未开始',
        1: '结束'
    }

    export default {
      name: 'app',
      data(){
        return {
            team: {
                FDM: 0,
                WSYW: 0,
                DBD: 0
            },
            user_info: uinfo,
            account: {
                id: null,
                name: null
            },
            infobox: false,
            bindbox: false,
            isBind: false,
            islogin: false
        }
      },
      filters: {
        formatdesc(val, bind) {
            if(bind){
                return val
            }else{
                return '未绑定'
            }
        }
      },
      methods: {
        // 隐藏绑定窗口
        showBindBox(tag) {
            if(!this.isBind && tag === false){
                account.id = '';
                account.name = '';
            }
            this.bindbox = tag;
        },
        //显示 banner下面的信息窗口
        showInfoBox(tag) {
            this.infobox = tag;
        },
        //退出登录
        loginout() {
            this.user_info = {
            }
            this.account = {
                id: null,
                name: null
            }
            this.isBind = false;
            window.localStorage.removeItem('userinfo');
        },
        //登录
        handleLoginCC() {
            // const userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
            if(!this.islogin){
                this.getUserInfo();
                console.log('登录cc')
            }
            // else{
            //     this.user_info = uinfo;
            //     this.islogin = true;
            // }
        },
        // 设置cc信息
        setUserInfo(info) {
            this.user_info = userinfo.uinfo;
            this.islogin = true
        },
        //获取活动时间
        activeTime() {
            apis.getActtime()
            .then(res => {
                if(res.code == 0){
                    
                }else{
                    alert(availbale[res.code])
                }
            })
        },
        //绑定用户信息
        bindAccount() {
            apis.postBinding({
                staff_id: this.account.id,
                staff_name: this.account.name
            })
            .then(res => {
                if(res.code == 'OK'){
                    this.isBind = true;
                    this.showBindBox(false);
                    // alert(bindCode[res.code]);
                }else{
                    // alert(bindCode[res.code]);
                    alert(res.msg);
                }
            })
        },
        // 加入队伍
        jointeam(type) {
            apis.postJoin({
                team_name: type
            })
            .then(res => {
                if(res.code == 'OK'){
                    this.refreshTeam(res.team_num)
                }
                alert(joinCode[res.code])
            })
        },
        //获取队伍人数
        getTeamNum() {
            apis.getTeamnum()
            .then(res => {
                if(res.code == 'OK'){
                    this.refreshTeam(res.data)
                }
            })
        },
        //设置队伍人数信息
        refreshTeam(data) {
            const {DBD, FDM, WSYM} = data;
            this.team = data;
        },
        // 获取用户信息
        getUserInfo() {
            apis.getUserInfo()
            .then(res => {
                if(res.code == 'OK'){
                    this.account.id = res.data.user_info.staff_id;
                    this.account.name = res.data.user_info.staff_name;
                    this.user_info.urs = res.data.user_info.urs;
                    let time = new Date(this.user_info.bind_time).getTime();
                    if( time < new Date().getTime()) {
                        this.isBind = true;
                    }
                }
            })
        },
        init() {
            this.getTeamNum();
        }
      },
      mounted() {
        window.localStorage.removeItem('userinfo');
        this.init();
      }
    }

</script>


