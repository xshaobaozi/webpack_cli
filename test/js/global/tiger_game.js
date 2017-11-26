/*
*linmengdun
*weber
*/
;(function ($) {
    var roomModules = window.parent.roomModules;
    window.configLot = {
        Index: 0,   //奖品索引
        LaseItem: 0,   //最后奖励索引
        Item: '',   //计时器
        Ward: 2,  //奖励索引
        Round: 7, //动画执行完，开始缓冲个数
        Times: 0, //计算圈数
        SumTimes: 3, //需要走的圈数
        Mod: 0, //缓冲余数
        Continue: true,  //标示，阻止执行动画时再次点击
        Count: false,  //标示，防止圈数持续计算
        Stop: false,   //标示，开始缓冲执行
        Result: false,  //标示，开始执行目标走向
        Length: $('#tiger_game li').length,  //奖品长度
        AwardList: $('#tiger_game li'),  //奖品li
        Time:  40 * $('#tiger_game li').length,  //最慢的时间走步
        enterRoomItem: false,
        enterRoom: []
    };
    var lotteryInit = {
        init: function(){
            var ths = this;
            var userInfo = roomModules.getUserInfo();

            $('.tiger_begin').on('click', function(){
                if(!userInfo){
                    roomModules.showLoginWin();
                    return;
                };
                if(!configLot.enterRoomItem){ // 未进入房间
                    return;
                };
                if(!configLot.Continue){ return false };
                configLot.Continue = false;
                $('.lotTips').addClass('hide');
                roomModules.tcp.send({
                    sid: 41344, //
                    cid: 555,
                    data: { 'uid': userInfo.uid } // 发送的数据包
                });
            });
            
            roomModules.onRoomEvent('enterroom',function(){
                configLot.enterRoomItem = true;
                while (configLot.enterRoom.length) {
                    var func = configLot.enterRoom.shift();
                    func();
                }
            });
            var lotReg = function() {
                roomModules.tcp.listen(41344, 555, function(json) {
                    ths.lotteryAct(json);
                });
            };
            configLot.enterRoomItem ? lotReg() : configLot.enterRoom.push(lotReg);
        },
        lotTips: function(text){
            var htm = text;
            $('.lot-tips').html(htm).removeClass('hide');
            clearTimeout(configLot.lotTipsTime);
            configLot.lotTipsTime = setTimeout(function(){
                $('.lot-tips').addClass('hide');
            }, 2000);
        },
        lotteryAct: function(data){
            var _this = this;
            if(data.result == 0){
                for(var i = 0; i < configLot.Length; i++){
                    var $type = configLot.AwardList.eq(i).attr('_type');
                    if(data.type == $type){
                        configLot.Ward = i;
                        break;
                    };
                };
                var lotMes = {'name': data.name, 'num': data.num, 'type': data.type};
                $('.lotTips').find('.tips-main').html(template("lotteryTips",lotMes));
                 _this.lottery();
            } else if(data.result == 2){
                _this.lotTips('今天非比赛日，不能抽奖哦～');
                configLot.Continue = true;
            } else if(data.result == 3){
                _this.lotTips('抽奖次数不足');
                configLot.Continue = true;
            } else if(data.result == 5){
                _this.lotTips('观看直播倒计时未完成');
                configLot.Continue = true;
            } else if(data.result == 6){
                _this.lotTips('看直播获得抽奖次数到了上限');
                configLot.Continue = true;
            } else if(data.result == 98){
                _this.lotTips('服务器维护中');
                configLot.Continue = true;
            } else if(data.result == 99){
                _this.lotTips('服务器内部错误');
                configLot.Continue = true;
            };
        },
        getHeightFun: function(h){
            var windowHeight = window.screen.height,
                documentHeight = 0,
                wTop = 0,
                parentCon = $(window.parent.document).find('.main-container'),
                parentWra = $(window.parent.document).find('.main-wrapper'),
                parentTop = parentWra.css('margin-top').replace('px','');
            var _top = 0;
            if(parentCon.length && parentWra.length){
                var 
                documentHeight = parentCon.scrollTop();
                wTop = parentWra.height()+parseInt(parentTop)+50;
            };
            if(documentHeight < wTop){
                _top = 290;
            } else {
                _top = (documentHeight-wTop)+(windowHeight-h)/2;
            };
            return _top;
        },
        lottery: function(){  //动画
            var ths = configLot;
            var _this = this;
            var num = _this.getIndex();
            ths.AwardList.eq(num).addClass('hover').siblings().removeClass('hover');
            ths.Index = num;
            if(!ths.Count && num == ths.LaseItem){
                ths.Times++;
                if(ths.Times == ths.SumTimes){
                    window.time = +new Date;
                    _this.numChange();
                }
            };
            _this.changeTime();
            ths.Item = setTimeout(function(){ _this.lottery() }, ths.Time);
            if(ths.Result){
                _this.stopLottery();
            };
        },
        numChange: function(){  //最后缓冲判断
            var ths = configLot;
            var mod = 0;
            var b = 0;
            //这里的4为奖励索引
            if(ths.Index >= ths.Ward){
                b = (ths.Length - ths.Index) + ths.Ward;
            }
            else{
                b = ths.Ward - ths.Index;
            };

            //判断动画最后索引和目标奖励索引的相隔个数
            if(b < ths.Round){
                var sum = ths.Round - b;
                mod = ths.Length - sum;
                ths.Mod = mod + 1;  //+1的原因是在获取时间那里会缺少一个计算点
            }
            else if(b > ths.Round){
                mod = b - ths.Round;
                ths.Mod = mod + 1;
            }
            else{
                ths.Mod = 0;
                ths.Stop = true;
            };

        },
        stopLottery: function(){  //执行结果后复位

            clearTimeout(configLot.Item);
            configLot.LaseItem = configLot.Index;
            configLot.Times = 0;
            configLot.Mod = 0;
            configLot.Count = false;
            configLot.Stop = false;
            configLot.Result = false;
            configLot.Continue = true;
            configLot.Time = 40 * configLot.Length;
            $('.lotTips').css('top',this.getHeightFun(263)).removeClass('hide');

        },
        getIndex: function(){  //返回目标索引

            if(configLot.Index + 1 >= configLot.Length){
                return 0;
            }
            else{
                return configLot.Index + 1;
            }

        },
        changeTime: function(){  //返回动画时间
            //计算缓冲余数
            if(configLot.Mod != 0){
                configLot.Mod--;
                if(configLot.Mod == 0){
                    configLot.Stop = true;
                }
            };
            if(!configLot.Stop){
                if(configLot.Time > 40 ){
                    configLot.Time = configLot.Time - 80;
                }
                else{
                    configLot.Time = 40;
                };
            }
            else{
                configLot.Time = configLot.Time + 40;
                if(configLot.Time > (40 * (configLot.Round + 1))){  //停止动画 返回对应标示
                    configLot.Result = true;
                }
            }
        }
    }
    lotteryInit.init();
})(jQuery)