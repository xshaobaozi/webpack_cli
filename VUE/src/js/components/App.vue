<style>
    /*@mixin flex_center($justify: center, $align: center) {
        display: flex;
        justify-content: $justify;
        align-items: $align;
    }*/
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
        display: flex;
        justify-content: flex-end;
        align-items: center;
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
        position: absolute;
        right: 0;
        top: 0;
        transform: translateY(40px);
        width: 200px;
        background-color: red;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        flex-wrap: wrap;
        padding: 10px 10px 0 10px;
    }
    .banner_drop > div{
        margin-bottom: 5px;
    }
    .banner_drop-info{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .banner_drop-info__title{
        width: 50px;
        background-color: green;
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
</style>

<template>
    <div id="app">
        <div 
            @click="logincc"
            class="login"></div>
        <div class="page1_box">
            <div class="team_box">
                <div class="team_box_num">
                    {{team1.val}}/{{team1.max}}人
                </div>
                <div 
                    class="team_box_btn"
                    @click="jointeam('DBD')"></div>
            </div>
            <div class="team_box center">
                <div class="team_box_num">
                    {{team2.val}}/{{team2.max}}人
                </div>
                <div 
                    class="team_box_btn"
                    @click="jointeam('FDM')"></div>
            </div>
            <div class="team_box">
                <div class="team_box_num">
                    {{team3.val}}/{{team3.max}}人
                </div>
                <div 
                    class="team_box_btn"
                    @click="jointeam('WSYW')"></div>
            </div>
        </div>
        <div class="banner">
            <div 
                @mouseover="showInfoBox(true)"
                class="banner-info">
                <div class="banner-info-img">
                    <img src="http://imgs.aixifan.com/content/2017_11_09/1512833048.gif" alt="">
                </div>
                <div class="banner-info-name">
                    {{ccinfo.name}}
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
        <div 
            v-if="bindbox"
            class="dialog">
            <div class="dialog-box">
                <div class="dialog-box__desc">
                    当前登录账号
                </div>
                <div class="dialog-box__desc">
                    {{user_info.cuteid}}
                </div>
                <div class="dialog-box__item">
                    <div>工号</div>
                    <div>
                        <input 
                            v-model="account.id"
                            type="text">
                    </div>
                </div>
                <div class="dialog-box__item">
                    <div>工号</div>
                    <div>
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
            team1: {
                val: null,
                max: 500
            },
            team2: {
                val: null,
                max: 500
            },
            team3: {
                val: null,
                max: 500
            },
            user_info: {
                bind_time: null,
                cuteid: null,
                join_time: null,
                staff_id: null,
                staff_name: null,
                team: null,
                urs: null,
            },
            account: {
                id: null,
                name: null
            },
            ccinfo: {
                name: null,
                islogin: false
            },
            infobox: false,
            bindbox: false,
            isBind: false
        }
      },
      filters: {
        formatdesc(val, bind) {
            if(bind && val){
                return val
            }else{
                return '未绑定'
            }
        }
      },
      methods: {
        showBindBox(tag) {
            this.bindbox = tag;
        },
        showInfoBox(tag) {
            this.infobox = tag;
        },
        loginout() {
            this.user_info = {
                bind_time: null,
                cuteid: null,
                join_time: null,
                staff_id: null,
                staff_name: null,
                team: null,
                urs: null,
            }
            this.account = {
                id: null,
                name: null
            }
            this.ccinfo = {
                name: null,
                islogin: false
            }
            this.isBind = false
        },
        logincc() {
            console.log('登录cc')
            this.ccinfo.name = 'cc登录成功';
            this.ccinfo.islogin = true;
        },
        activeTime() {
            apis.getActtime()
            .then(res => {
                if(res.code == 0){
                    
                }else{
                    alert(availbale[res.code])
                }
            })
        },
        bindAccount() {
            apis.postBinding({
                staff_id: this.account.id,
                staff_name: this.account.name
            })
            .then(res => {
                if(res.code == 'OK'){
                    this.showBindBox(false);
                    this.isBind = true;
                    alert(bindCode[res.code]);
                }else{
                    alert(bindCode[res.code]);
                }
            })
        },
        jointeam(type) {
            apis.postJoin({
                team_name: type
            })
            .then(res => {
                if(res.code == 'OK'){
                    this.refreshTeam(res.team_num)
                }else{
                    alert(joinCode[res.code])
                }
            })
        },
        getTeamNum() {
            apis.getTeamnum()
            .then(res => {
                if(res.code == 'OK'){
                    this.refreshTeam(res.data)
                }
            })
        },
        refreshTeam(data) {
            const {DBD, FDM, WSYM} = data;
            this.team1.val = DBD;
            this.team2.val = FDM;
            this.team3.val = WSYM;
        },
        getUserInfo() {
            apis.getUserInfo()
            .then(res => {
                if(res.code == 'OK'){
                    this.user_info = res.data.user_info
                }
            })
        },
        init() {
            this.getTeamNum();
        }
      },
      mounted() {
        this.init();
      }
    }

</script>


