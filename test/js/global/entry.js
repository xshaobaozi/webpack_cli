/**
	linmengdun
**/
if(location.host=='cc.163.com'){
    if(!window.console){
        window.console = {log : function(){}};
    } else {
        window.console.log = function(){};
    }
} else {
    if(!window.console){
        window.console = {log : function(){}};
    }
};
String.prototype.escapeHtml = function(isAttr){
    if(isAttr) return $('<div>').text(this).html().replace('"', '\\"');
    return $('<div>').text(this).html();
};
/*数字格式化
  exmple: var d= 11000.1155, dFormat = d.format(2,',');
  companyMin和company, 表示大于等于companyMin时用company单位
*/
Number.prototype.format =function(precision, separator, companyMin, company){
  var companyTxt = {
    '10': '十',
    '100': '百',
    '1000': '千',
    '10000': '万'
  };
  var parts, num = this, txt = '';
      // 判断是否为数字
      if (!isNaN(parseFloat(num)) && isFinite(num)) {
          // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
          // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
          // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
          // 的值变成了 12312312.123456713
          num = Number(num);
          //处理单位
          if(companyMin && company && num>=companyMin){
            num = Math.floor(num/company);
            txt = companyTxt[company+'']+'+';
          }
          // 处理小数点位数
          num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
          // 分离数字的小数部分和整数部分
          parts = num.split('.');
          // 整数部分加[separator]分隔, 借用一个著名的正则表达式
          parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

          return parts.join('.')+txt;
      }
      return NaN;
}
function getUrlParam(url,str){
    var v;
    if(url.indexOf(str)>0){
        str=new RegExp("[?|&]" + str + "=([^&]+)(&|$)","i");
        v=url.match(str);
        if(v != null){
            v = v[1];
        }else{
            v = false;
          }
    }else{
        v = false;
    }
    return v;
};
// 引入API
/* import SDK from './sdk.js'; // 使用es6这个引入ie8会报错 */
var SDK = require('./sdk.js');
var Pagination = require('./helper/Pagination.js');
require('./jquery.mousewheel.js');
require('./jquery.jscrollpane.min.js');
var isPro = (location.host=='cc.163.com');
window.roomModules = window.parent.roomModules;
var locationHost = window.location.href;
var iframeId = getUrlParam(locationHost, 'moduleid');
var h = $(document).height();
$(window.parent.document).find('#'+iframeId).css({'height': h});
// 
var config = {
	user: {},
	anchor: {},
	jci: 0,
	num: 0,
	mod: 0,
	allTimes: 0,
	checkedTime: '',
	endTipsTime: '',
	enjoyData: {}, // 参与数据
	srollNum: 1
}
var gue = {};
var index = {
	basics: function(){
		var ths = this;
		// 关闭功能
		$('.close').on('click', function(){
			$(this).parent().addClass('hide');
			if($(this).parent().hasClass('receive') || $(this).parent().hasClass('endMessage1') || $(this).parent().hasClass('endMessage2')){ return };
			$('.maskMain').addClass('hide');
			// 如果为竞猜记录，关闭则清空数据
			if($(this).parent().hasClass('guess-record')){
				$('.recordListMain').empty();
				config.srollNum = 1;
				config.scrollItem = false;
				config.scrollMore = false;
				$('.recordListMain').unbind('scroll',ths.eScroll);
			};
		});
		$('.signTips').on('click', '.sign-btn', function(){
			$('.signTips').addClass('hide');
		});
		// 竞猜结果弹窗按钮事件
		$('.emBtn1').on('click', function(){
			$(this).parent().parent().addClass('hide');
			$('.guess-ward,.maskMain').removeClass('hide');
			$('.ward-h4 a').eq(1).trigger('click');
		});
		$('.emBtn2').on('click', function(){
			$('.guessRecord').trigger('click');
			$(this).parent().parent().addClass('hide');
		});
		// 排行榜登录
		$('.ward-containt').on('click', '.goLogin', function(){
			roomModules.showLoginWin();
		});
		// 天降鸡翅弹窗
		$('.receive-btn').on('click', function(){
			$('.receive').addClass('hide');
		});
		// 排行榜提示窗
		$('.ward-containt').on('mouseover', '.exp', function(){
			$('.exp-tips').removeClass('hide');
		});
		$('.ward-containt').on('mouseout', '.exp', function(){
			$('.exp-tips').addClass('hide');
		})
		// 抽奖弹窗
		$('.lot-btn').on('click', function(){
			$('.lotTips').addClass('hide');
		});
		// 去抽奖
		$('.go-lot-btn').on('click', function(){
			var df = $('#lottery').offset().top;
			$('.getLotTips').addClass('hide');
			$('body,html').animate({scrollTop:df});
		});
		// 中奖记录
		$('.ward-record').on('click', function(){
			if(!config.user.nickname){
				roomModules.showLoginWin();
				return;
			};
			roomModules.emitter.trigger('room_plugin', [{
				type: 'open-plugin',
				value: 6
			}]);
		});
		// 分享
		$('.share-btn').on('click', function(){
			$('.share-tips').css('top',ths.getHeightFun(310)).removeClass('hide');
		});
	},
	// 签到交互
	signFun: function(){
		var ths = this;
		var $type = 0; 
		// cid7
		SDK('act_main').on('cid7', function(data) {
			var num = Number($('#myck').attr('_num'))+data.coin;
			$('#myck').attr('_num', num).html(num);
			$('.signTips').html(template("signTemplate",{'type': $type, 'coin': data.coin})).removeClass('hide');
			$('.sign-in').attr('_type', 1).addClass('geted').html('已领取');
		});
		// click
		$('.sign-in').on('click', function(){
			if(!config.user.nickname){
				roomModules.showLoginWin();
				return;
			};
			$type = $(this).attr('_type');
			if($type == 1){
				$('.signTips').removeClass('hide');
				$('.signTips').html(template("signTemplate",{'type': $type}));
			} else {
				SDK('act_main').sendMsg(7, {});
			};
		});
	},
	// tab交互
	tabFun: function(m, arry, show, callBack,global){
		var ths = this;
		var $m = $(m), // 包裹div
			$t = $(m).find('.pages-main'), // 内部ul外层div
			$p = $(m).find('.icon-time-prev'), // 上一页按钮
			$n = $(m).find('.icon-time-next'), // 下一页按钮
			$w = $t.find('li').outerWidth(true); // li宽度
		global.l = arry.length; // 数组长度
		global.arry = arry;
		var ii = $t.find('li').length-1,
			b = global.l-1,  // 初始选中状态处于数组的位置
			isprev = true,  // 标记上一页
			isnext = false; // 标记下一页
		// 判断个数是否大于5,5个就显示下一页
		if(global.arry.length > show){
			$p.removeClass('hidden');
		};
		// listFun
		function listFun(e){
			var $time = $t.find('li').eq(e).attr('_time');
			$t.find('li').eq(e).addClass('current').siblings().removeClass('current');
			callBack($time);
		};
		// 列表点击
		$t.on('click', 'li', function(){
			ii = $(this).index();
			listFun(ii);
		});
		// prev点击
		$p.on('click', function(){
			if(isprev){
				b = b-(show-1);
				isprev = false;
				isnext = true;
			};
			if(b == 0){ return };
			var idx = $t.find('li.current').index();
			b--;
			if(b == 0){
				$p.addClass('hidden');
			};
			$n.removeClass('hidden');
			var li_data = { "list": [{'times': global.arry[b], 'time': ths.userTime(global.arry[b])}]};
			$t.find('li').last().remove();
			$t.find('ul').prepend(template("timeTemplate",li_data));
			if(idx == $t.find('li').length-1){
				ii = idx;
				listFun(ii);
			};
		});
		// next点击
		$n.on('click', function(){
			if(isnext){
				b = b+(show-1);
				isprev = true;
				isnext = false;
			};
			if(b == global.l-1){ return };
			var idx = $t.find('li.current').index();
			b++;
			if(b == global.l-1){
				$n.addClass('hidden');
			};
			$p.removeClass('hidden');
			var li_data = { "list": [{'times': global.arry[b], 'time': ths.userTime(global.arry[b])}]};
			$t.find('li').first().remove();
			$t.find('ul').append(template("timeTemplate",li_data));
			if(idx == 0){
				ii = 0;
				listFun(ii);
			};
		});
	},
	// 返回对应日期
	userTime: function(uData){
		return uData.replace(/(.+?)\-(.+?)\-(.+)/,"$2月$3日");
	},
	// 返回时间点
	timeFun: function(uTime, item){
		var myDate = new Date(uTime*1000);
		var hours = myDate.getHours();
		var minutes = myDate.getMinutes();
		var year = myDate.getFullYear();
		var month = myDate.getMonth() + 1;
		var day = myDate.getDate();
		var thtml = '';
		function changeTime(num){
			var n = num;
			if(n < 10){
				n = '0'+n;
			};
			return n;
		};
		if(item){
			thtml = year+'-'+changeTime(month)+'-'+changeTime(day)+' '+changeTime(hours) + ':' + changeTime(minutes);
		} else {
			thtml = changeTime(hours) + ':' + changeTime(minutes);
		};
		return thtml;
	},
	// 返回页面居中高度
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
	// 竞猜结束与封盘tips
	endTips: function(text){
		var htm = text;
		$('.end-tips').html(htm).removeClass('hide');
		clearTimeout(config.endTipsTime);
		config.endTipsTime = setTimeout(function(){
			$('.end-tips').addClass('hide');
		}, 3000);
	},
	enjoyTips: function(text){
		var htm = text;
		$('.enjoy-tips').html(htm).removeClass('hide');
		clearTimeout(config.enjoyTipsTime);
		config.enjoyTipsTime = setTimeout(function(){
			$('.enjoy-tips').addClass('hide');
		}, 2000);
	},
	lotTips: function(text){
		var htm = text;
		$('.lot-tips').html(htm).removeClass('hide');
		clearTimeout(config.lotTipsTime);
		config.lotTipsTime = setTimeout(function(){
			$('.lot-tips').addClass('hide');
		}, 2000);
	},
	// 处理CID信息
	dealCID: function(){
		var ths = this;
		var dateFirst = true;
		// user
		SDK('main').on('user.update', function(user) {
			user && user.uid && (config.user = user);
		});
		SDK('main').on('qiemai', function(anchor) {
			config.anchor = anchor;
		});
		// cid1
		SDK('act_main').on('cid1', function(data) {
			$('#myck').attr('_num', data.coin).html(data.coin);
			$('.sign-in').attr('_type', data.checkin);
			if(data.checkin == 1){
				$('.sign-in').addClass('geted').html('已领取');
			};
		});
		SDK('act_main').sendMsg(1, {});
		// cid2
		SDK('act_main').on('cid2', function(data) {
			// 竞猜日期列表
			if(dateFirst){
				dateFirst = false;
				ths.dealGuessDate(data.day_list);
			};
			// 竞猜内容
			if(data.from_svr == 0){  // 如果是主动请求则触发
				ths.dealGuess(data.subject_list);
			};
			// 更新日期
			if(data.from_svr == 1 && data.add_day){  // 如果是更新数据为当前日期，则触发
				ths.refreshDate(data.add_day);
			};
			// 更新指定竞猜内容
			if(config.checkedTime == data.day && data.from_svr == 1){  // 如果是更新数据为当前日期，则触发
				ths.refresh(data.subject_list);
			};
		});
		SDK('act_main').sendMsg(2, {}); // day -- str，查询日期，eg：2017-09-10，不传则默认当天	
		// cid3	
		SDK('act_main').on('cid3', function(data) {
			$('#myck').attr('_num', data.remain_coin).html(data.remain_coin);
			ths.enjoyTips('下注成功~');
		});
		// cid4
		SDK('act_main').on('cid4', function(data) {
			var json = data;
			var endM = '';
			json.title = json.title.escapeHtml();
			if(json.win == 0){
				json.coin = Math.abs(json.coin);
				endM = $('.endMessage1');
			} else {
				endM = $('.endMessage2');
			};
			endM.find('.tips-main').html(template("endMessageTemplate",json));
			endM.css('top',ths.getHeightFun(263)).removeClass('hide');
		});
		// cid 5
		SDK('act_main').on('cid5', function(data) {
			ths.dealRank(data);
		});
		// cid 6
		SDK('act_main').on('cid6', function(data) {
			ths.dealRecord(data);
		});
		// cid 8
		SDK('act_main').on('cid8', function(data) {
			$('#myck').attr('_num', data.remain_coin).html(data.remain_coin);
			$('.receive .tips-main').html(template("receiveTemplate",data));
			$('.receive').css('top',ths.getHeightFun(263)).removeClass('hide');
		});
		// cid 553
		SDK('gamechdrum').on('cid553', function(data) {
			$('.tiger_begin').attr('_stage', data.stage);// 活动阶段，活动阶段（0：活动未开始，1：活动期间，2：活动结束后展示）
			if(data.stage == 0){
				$('.tiger_begin').addClass('noneData');
			};
		});
		SDK('gamechdrum').sendMsg(553, {
			anchor_uid: config.anchor.aid
		});
		// cid 554
		SDK('gamechdrum').on('cid554', function(data) {
			$('#lotTimes').html(data.lot_times);
			if(data.lot_times == 0){
				$('.tiger_begin').addClass('noneData');
			} else {
				$('.tiger_begin').removeClass('noneData');
			};
			if(data.duration >= 0){
				clearTimeout(config.lotTime);
				ths.dealCountDown(data.duration);
			};
		});
		// cid 557
		SDK('gamechdrum').on('cid557', function(data) {
			$('.getLotTips').css('top',ths.getHeightFun(263)).removeClass('hide');
		});
		// error
		SDK('main').on('error', function(err) {
			var _err = err.data;
			ths.dealErrer(_err);
		});
	},
	// 处理竞猜日期
	dealGuessDate: function(data){
		var ths = this;
		var day_list = [];
		var list = [];
		if(data.length > 5){
			day_list = data.slice(-5);
		} else {
			day_list = data;
		};
		for(var i = 0; i < day_list.length; i++){
			list.push({'times': day_list[i], 'time': ths.userTime(day_list[i])});
		};
		var li_data = { 'list': list, 'hover': day_list.length};
		config.checkedTime = day_list[day_list.length-1];
		$('.guess .pages-main').find('ul').html(template("timeTemplate",li_data));
		// 竞猜日期交互
		function dateHit(t){
			config.checkedTime = t; // 存储选中日期
			config.jci = 0;
			SDK('act_main').sendMsg(2, {
				day: t
			});
		};
		ths.tabFun('.guessTab', data, 5, dateHit,gue);
	},
	// 更新竞猜日期
	refreshDate: function(date){
		if($('.icon-time-next').hasClass('hidden') && gue.arry.length >= 5){
			$('.icon-time-next').removeClass('hidden');
		};
		if(gue.arry.length < 5){
			var li_data = { "list": [{'times': date, 'time': this.userTime(date)}]};
			$('.guess .pages-main').find('ul').append(template("timeTemplate",li_data));
		}
		gue.l = gue.arry.length+1; // 数组长度
		gue.arry.push(date);
	},
	// 处理竞猜数据
	dealGuess: function(data){
		var subject_list = this.returnDealGuess(data);
		var subject_len = data.length ? data.length*320 : 'auto';

		config.mod = data.length%3; // 主题内容余数
		config.allTimes = Math.floor(data.length/3); // 主题内容总页数
		config.num = 0;
		config.jci = 0;

		$('.enjoy').addClass('hide');
		if(data.length <= 3){
			$('.cons').addClass('hide');
		} else {
			$('.cons').removeClass('hide');
		};
		$('.guess-cons-main').find('ul').removeAttr('style').css('width', subject_len).html(template("guessTemplate",subject_list));
	},
	// 更新对应竞猜数据
	refresh: function(data){
		var ths = this,
			subject_list = this.returnDealGuess(data),
			temp = template("guessTemplate",subject_list),
			thsId = data[0]._id,
			thsState = data[0].state,
			thsCloseTime = data[0].close_time,
			hasItem = true,
			refreshItem = 0, // 刷新目标
			isThan = false, // 状态存在的情况标记是否已经大于后面一个,如果状态不存在的情况也使用这个变量，两种情况互斥，存在一个就不存在另一个情况
			isState = true; // 标记是存在状态 
		/* if(!$('.enjoy').hasClass('hide') && config.enjoyData._id == thsId){
			$('.enjoy').addClass('hide');
		}; */
		// 隐藏投注框
		//$('.enjoy').addClass('hide');
		// 移除存在的主题
		if($('.guess-cons-main ul li[_lid="'+thsId+'"]').length){
			hasItem = false;
			$('.guess-cons-main ul li[_lid="'+thsId+'"]').remove();
		};
		var guessLi = $('.guess-cons-main ul li');
		// 特殊处理，数据只有一个的情况
		if(!guessLi.length){
			$('.guess-cons-main ul').append(temp);
			return;
		};
		// 判断是否存在对应的状态
		if(!$('.guess-cons-main ul li[_state="'+thsState+'"]').length){
			isState = false;
		};
		for(var i = 0; i < guessLi.length; i++){
			var liState = guessLi.eq(i).attr('_state');
			var liCtime = guessLi.eq(i).attr('_time');
			// 列表中存在状态的情况
			if(liState == thsState){
				if(thsCloseTime - liCtime <= 0 && !isThan) {
					refreshItem = i;
					isThan = true;
				} else if(thsCloseTime - liCtime > 0 && !isThan) {
					refreshItem = i;
				};
			};
			// 列表中不存在状态的情况
			if(!isState){
				if(thsState - liState < 0){
					refreshItem = i;
					isThan = true;
					break;
				};
				refreshItem = i;
			};
		};
		if(hasItem){
			var newLength = guessLi.length+data.length;
			var refreshLen = newLength*320;
			config.mod = newLength%3; // 主题内容余数
			config.allTimes = Math.floor(newLength/3); // 主题内容总页数
			$('.guess-cons-main ul').css('width', refreshLen).append(temp);
			if(newLength > 3 && $('.icon-content-next').hasClass('hide')){
				$('.icon-content-next,.icon-content-prev').removeClass('hide');
			};
		} else {
			if(isThan){
				guessLi.eq(refreshItem).before(temp);
			} else {
				guessLi.eq(refreshItem).after(temp);
			};
		};
	},
	// 返回处理后的竞猜数据
	returnDealGuess: function(data){
		var list = data;
		for(var i = 0; i < data.length; i++){
			list[i].ctime = this.timeFun(list[i].close_time, false);
			list[i].percent = (list[i].left_total+list[i].right_total == 0 ? 50 : list[i].left_total/(list[i].left_total+list[i].right_total)*100)+'%';
			list[i].left_total = list[i].left_total.toString().length > 4 ? (Math.round((list[i].left_total /10000) * 100) / 100).toFixed(1) + 'W+' : list[i].left_total;
			list[i].right_total = list[i].right_total.toString().length > 4 ? (Math.round((list[i].right_total /10000) * 100) / 100).toFixed(1) + 'W+' : list[i].right_total;
			list[i].title = list[i].title.escapeHtml();
		};
		return { "list": list};
	},
	// 竞猜数据交互
	GuessJh: function(){
		var ths = this;
		// 参与点击交互
		$('.guess-cons-main').on('click', '.pkBtn', function(){
			if(!config.user.nickname){
				roomModules.showLoginWin();
				return;
			};
			var type = Number($(this).attr('_type'));
			switch(type)
			{
				case 1:
					var left = $(this).offset().left;
					var top = $(this).offset().top;
					$('.enjoy').removeClass('hide').css({'left': left+18, 'top': top});
					$('input[name="cknumber"]').focus().val('');
					$('#winNum').html('--');
					config.enjoyData = {_id: $(this).attr('_id'), side: $(this).attr('_side'), rate: $(this).attr('_rate')};
					// 弹幕鸡翅
					ths.barrageCid();
					break;
				case 2:
					ths.endTips('已封盘，不可以再下注哦~');
					break;
				case 3:
					ths.endTips('竞猜已结束~');
					break;
			};
		});
		// 参与投注交互
		$('.enjoy').on('click', '.enjoyBtn', function(){
			var number = $('input[name="cknumber"]').val();
			var $num = parseInt($('#myck').attr('_num'));
			var reg = /[@#\$%\^&\*+-.]+/g;
			if(((number == 0 || number == '') && $num != 0)){
				ths.enjoyTips('请输入正确的鸡翅数量~');
				return;
			} else if(isNaN(number) || reg.test(number)){
				ths.enjoyTips('请输入正整数的鸡翅数量~');
				return;
			} else if(number > $num || (number == 0 && $num == 0)){
				ths.enjoyTips('你的鸡翅不足~');
				return;
			};
			SDK('act_main').sendMsg(3, {
				_id: config.enjoyData._id,
				side: config.enjoyData.side,
				coin: number,
				rate: config.enjoyData.rate
			});
		});
		// 处理js乘法误差有误差的问题
		function accMul(arg1,arg2){
			var m=0,s1=arg1.toString(),s2=arg2.toString();
			try{m+=s1.split(".")[1].length}catch(e){}
			try{m+=s2.split(".")[1].length}catch(e){}
			return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
		};
		// 处理获得数量
		function dealGet(n){
			var number = parseInt(n);
			var htm = '--';
			if(typeof number == 'number'){
				htm = Math.floor(accMul(config.enjoyData.rate, number));
			};
			$('#winNum').html(htm);
		}
		$('input[name="cknumber"]').on('keyup', function(){
			dealGet($(this).val());
		});
		// 全下
		$('.allIn').on('click', function(){
			var $num = $('#myck').attr('_num');
			$('input[name="cknumber"]').val($num);
			dealGet($num);
		});
		// 切换交互
		function PN(n){
			$('.enjoy').addClass('hide');
			$('.guess-cons-main ul').animate({'margin-left': -320*n}, 500, function(){});
		};
		$('.icon-content-prev').on('click', function(){
			if(config.num > 0){
				config.num--;
				config.jci = config.num*3+config.mod;
			} else if(config.num == 0){
				config.jci = 0;
			};
			PN(config.jci);
		});
		$('.icon-content-next').on('click', function(){
			if(config.num == config.allTimes-1){
				config.jci = config.num*3+config.mod;
			} else if(config.num < config.allTimes-1){
				config.num++;
				config.jci = config.num*3;
			};
			PN(config.jci);
		});
		// 鸡翅排行榜
		$('.chickenRank').on('click', function(){
			$('.guess-ward,.maskMain').removeClass('hide');
			$('.ward-h4 a').eq(0).trigger('click');
			// 弹幕鸡翅
			if(config.user.nickname){
				ths.barrageCid();
			}
		});
		$('.ward-h4 a').on('click', function(){
			var idx = $(this).index();
			$(this).addClass('current').siblings().removeClass('current');
			$('.ward-tab').eq(idx).removeClass('hide').siblings().addClass('hide');
			if(idx == 0){
				SDK('act_main').sendMsg(5, {
					page: 1,
					page_size: 100
				});
			}
		});
		// 竞猜记录
		$('.guessRecord').on('click', function(){
			if(!config.user.nickname){
				roomModules.showLoginWin();
				return;
			};
			SDK('act_main').sendMsg(6, {
				page: 1,
				page_size: 20
			});
			$('.guess-record,.maskMain').removeClass('hide');
		});
		// 滚动加载更多
		
	},
	// 处理赔率发生变化数据
	dealOdds: function(data){
		var newRate = data.new_rate;
		var guessLi = $('.guess-cons-main ul li');
		for(var i = 0; i < guessLi.length; i++){
			var liId = guessLi.eq(i).attr('_lid');
			if(liId == data._id){
				guessLi.eq(i).find('[_side="'+data.side+'"]').attr('_rate', newRate);
				guessLi.eq(i).find('[_side="'+data.side+'"]').siblings('.rateNum').html(newRate);
				return;
			};
		};
	},
	// 排行榜数据
	dealRank: function(data){
		var list = data;
		for(var i = 0; i < list.rank_list.length; i++){
			list.rank_list[i].nickname = list.rank_list[i].nickname.escapeHtml();
		};
		$('.my-message').html(template("wardTemplate",{"list": list, 'islogin': config.user.nickname}));
		$('.ward-dd').html(template("wardListTemplate",{"list": list.rank_list, 'uid': config.user.uid}));
		$('.scroll-pane').jScrollPane();
	},
	// 竞猜记录
	dealRecord: function(data){
		var ths = this;
		var list = data;
		if(config.scrollMore && list.guess_list.length == 0){
			return;
		};
		for(var i = 0; i < list.guess_list.length; i++){
			var res = '';
			if(list.guess_list[i].state == 0){
				res = '未揭晓';
				list.guess_list[i].win_coin = '未结算';
			} else if(list.guess_list[i].state == 1){
				res = '赢';
			} else if(list.guess_list[i].state == 2){
				res = '输';
			};
			list.guess_list[i].title = list.guess_list[i].title.escapeHtml();
			list.guess_list[i].state_text = res;
			list.guess_list[i].time = this.timeFun(list.guess_list[i].create_time, true);
		};
		$('.recordListMain').append(template("recordTemplate",{"list": list, 'isMore': config.scrollMore}));
		config.scrollItem = false;
		//$('.recordListMain').jScrollPane();
		// 滚动加载更多
		if(config.scrollMore){
			return;
		};
		config.scrollMore = true;
		$('#parcount').html(list.par_count);
		$('#totalwin').html(list.total_win);
		$('#wincount').html(list.win_count);
		$('.recordListMain').bind('scroll', ths.eScroll);
	},
	eScroll: function(){
		var h,hSee,st;
		var timeOut = null;
		var target = $('.recordListMain');
		if(config.scrollItem){ return };
		h = target[0].scrollHeight;
		hSee = $(this).innerHeight();
		st = target[0].scrollTop;
		clearTimeout(timeOut);
		timeOut = setTimeout(function () {
			if (h == hSee + st) {
				config.srollNum++;
				config.scrollItem = true;
				SDK('act_main').sendMsg(6, {
					page: config.srollNum,
					page_size: 20
				});
			};
		}, 200);
	},
	// 查询抽奖配置
	getLottery: function(){
		var _url = isPro ? '//game.api.cc.163.com/' : '//gameapi.dev.cc.163.com/';
		$.ajax({
			url: _url+'pubg/lottery_cfg',
			type: 'get',
			dataType: 'jsonp',
			success: function(data){
				if(data.code == 0){
					$('#tiger_game ul').html(template("lotteryImg",{"list": data.data}));
					// 重置抽奖dom
					window.configLot.Length = $('#tiger_game li').length;
					window.configLot.AwardList = $('#tiger_game li');
					window.configLot.Time = 40 * $('#tiger_game li').length;
				};
			}
		});
		// 抽奖按钮
		if(!config.user.nickname){
			$('.tiger_begin em').html('请先登录再抽奖');
		};
	},
	// 抽奖倒计时
	dealCountDown: function(t){
		config.lotTime = setTimeout(function(){
			SDK('gamechdrum').sendMsg(557, {
				uid: config.user.uid
			});
		}, t*1000);
	},
	// 获取中奖信息
	getLotMessage: function(){
		var ths = this;
		var _url = isPro ? '//game.api.cc.163.com/' : '//gameapi.dev.cc.163.com/';
		$.ajax({
			url: _url+'pubg/lottery_log',
			data: {'page': 1, 'size': 50},
			type: 'get',
			dataType: 'jsonp',
			success: function(data){
				if(data.code == 0){
					var data = data.data.billboard
					for(var i = 0; i < data.length;i++){
						data[i].nick = data[i].nick.escapeHtml();
					}
					$('.winners ul').html(template("broadTemplate",{'list': data}));
					ths.broadFun();
				};
			}
		});
	},
	// 滚动中奖信息
	broadFun: function(){
		let ths = this;
		let target = $('.winners ul');
		clearInterval(config.broadTimer);
		config.broadTimer = setInterval(function(){
			let nowLength = target.find('li').length;
			let height = target.find('li').outerHeight(true);
			if(nowLength > 1){
				var first = target.find('li').eq(0);
				target.animate({'margin-top' : -height}, 500, function(){
					target.css({'margin-top' : 0});
					target.append(first);
				});
			} else {
				clearInterval(config.broadTimer);
			};
		},3000);
	},
	// 处理错误信息
	dealErrer: function(err){
		var ths = this;
		var result = err.result;
		// 处理cid7错误信息
		switch(err.cccid)
		{
			case 7:
				if(result == 1){
					ths.endTips('系统错误~');
				} else if(result == 7){
					$('.signTips').html(template("signTemplate",{'type': 1})).removeClass('hide');
				} else if(result == 8){
					ths.endTips('今天非比赛日，没有鸡翅送哦~');
				} else if(result == 11){
					ths.endTips('非活动频道~');
				};
				break;
			case 3:
				if(result == 1){
					ths.enjoyTips('系统错误~');
				} else if(result == 2){
					ths.enjoyTips('参数无效~');
				} else if(result == 3){
					ths.enjoyTips('鸡翅数量不足~');
				} else if(result == 4){
					ths.enjoyTips('赔率发生变化~');
					$('.enjoy').addClass('hide');
					ths.dealOdds(err);
				} else if(result == 5){
					ths.enjoyTips('主题已封盘~');
				} else if(result == 6){
					ths.enjoyTips('主题已结束~');
				} else if(result == 11){
					ths.enjoyTips('非活动频道~');
				};
				break;
		};
	},
	// 窗口变化
	windowChange: function(){
		var width = $(window).width();
		$('.enjoy').addClass('hide'); // 窗口变化关闭参与弹窗
		if(width < 1570){
			$('.module-right').addClass('hide');
		} else {
			$('.module-right').removeClass('hide');
		};
	},
	isIe: function(){
		var Sys={};
		var ua=navigator.userAgent.toLowerCase();
		var s;
		(s=ua.match(/msie ([\d.]+)/))?Sys.ie=s[1]:0;
		return Sys.ie;
	},
	// 请求领取弹幕鸡翅
	barrageCid: function(){
		SDK('act_main').sendMsg(9, {});
	},
	init: function(){
		// 处理ie8以下
		if(parseInt(this.isIe()) < 9){
			$(window.parent.document).find('#'+iframeId).css({'height': 483});
			$('.guess-btn-list,.guess-p').addClass('hide');
			$('.guess-cons-main').find('ul').html('<li class="noData">本页面暂不兼容ie8，请用chrome或者火狐浏览器</li>');
			return;
		};
		// 基础交互
		this.basics();
		// 签到交互
		this.signFun();
		// cid
		this.dealCID();
		// 竞猜交互
		this.GuessJh();
		// 获取抽奖配置
		this.getLottery();
		// 滚动中奖信息
		this.getLotMessage();
		// 监听窗口变化
		this.windowChange();

		popularityList.init();
		getConfigInfo();

		$(window).on('resize', this.windowChange);
	}
};
require('./tiger_game.js');
/*鸡腿人气榜*/
var popularityList = {
	Boss: $('.popularity-list'),
	listDom: $('.popularity-list .list-wrap'),
	tabSwitch: function(type){
		var self = this;
		var hostHead = isPro?'//game.api.cc.163.com/':'//gameapi.dev.cc.163.com/';
		if(self.listDom.children().length==0){
			self.listDom.html('<div class="loading">加载中...</div>');
		}
		$.ajax({
			url: hostHead+'gamechdrum/get_combat_billboard',
			type: 'get',
			dataType: 'jsonp',
			jsonp: 'callback',
			data: {
				'type': type
			},
			success: function(data){
				if(data.code == 0){
					for (var i = 0; i < data.list.length; i++) {
						data.list[i].nameT = data.list[i].name.escapeHtml(true);
						data.list[i].name = data.list[i].name.escapeHtml();
						data.list[i].num = data.list[i].num.format(0,',');
					}
					self.listDom.filter('.list'+type).html(template("popularityItem",{'list': data.list, 'type': type})).find('.scroll-block').jScrollPane();
				}
			}
		})
	},
	getChdrum: function(){
		var self = this;
		var hostHead = isPro?'//game.api.cc.163.com/':'//192.168.229.171:55218/'
		$.ajax({
			url: hostHead+'gamechdrum/get_chdrum_num',
			type: 'get',
			dataType: 'jsonp',
			jsonp: 'callback',
			data: {
				'uid': config.user.uid
			},
			success: function(data){
				if(data.code == 0){
					self.Boss.find('.my-chicken .num').text(data.num.format(0,','));
				}
			}
		})
	},
	updateRank: function(dict){
		var listItems = this.Boss.find('.list-wrap.cur .list-item');
		listItems.each(function(i) {
			var id = $(this).attr('_id');
			$(this).find('.index').text(dict[id].rank);
			$(this).find('.num').text('鸡腿 x '+dict[id].num);
		})
	},
	initSDK: function(){
		var self = this;
		self.isInitSDK = true;
		SDK('gamechdrum').sendMsg(563, {'uid': config.user.uid});
		
		SDK('gamechdrum').on('cid563', function(data) {
			if(data.code == 0){
				if(data.state==1 && data.left_secs>0){
					config.getCHDCount = data.left_secs;
					self.countdown = setTimeout(function(){
						SDK('gamechdrum').sendMsg(564, {'uid': config.user.uid});
					},data.left_secs*1000)
				}
				if(data.checkin_state == 1){
					self.Boss.find('.get-chicken').text('已领取').addClass('disabled');
				}
				config.is_active = data.is_active;
			}
		});
		SDK('gamechdrum').on('cid564', function(data) {
			if(data.code == 0){
				if(data.state==1 && data.left_secs>0){
					config.getCHDCount = data.left_secs;
					self.countdown = setTimeout(function(){
						SDK('gamechdrum').sendMsg(564, {'uid': config.user.uid});
					},data.left_secs*1000)
				} else if(data.state==2){
					self.Boss.find('.my-chicken .num').text(data.num.format(0,','));
					$('.signTips.whole-tips').html(template("viewGetChd",{'num': data.add_num, 'time': Math.floor(config.getCHDCount/60)})).removeClass('hide').css('top',index.getHeightFun(310));
				}
			}
		});

		/*签到领取鸡腿*/
		SDK('gamechdrum').on('cid561', function(data) {
			var $type;
			if(data.code == 0){
				self.Boss.find('.my-chicken .num').text(data.num.format(0,','));
				$type = 0;
				self.Boss.find('.get-chicken').text('已领取').attr('type',1);
			} else if(data.code == 102){
				$type = 1;
				self.Boss.find('.get-chicken').text('已领取').attr('type',1);
			} else if(data.code == 104){
				$type = 2;
				self.Boss.find('.get-chicken').attr('type',2);
			} else if(data.code == 105){
				$type = 3;
				self.Boss.find('.get-chicken').attr('type',3);
			}
			$('.signTips.popularity-tips').html(template("signTemplate",{'type': $type, 'coin': 1, 'isDrumsticks': true})).removeClass('hide');
			self.Boss.find('.get-chicken').addClass('disabled');
		});
 
		/*赠送鸡腿*/
		SDK('gamechdrum').on('cid562', function(data) {
			console.log(data);
			var $type, thisDom, tipText;
			thisDom = self.Boss.find('.list-item[_id'+data.id+']');
			if(data.code == 0){
				self.Boss.find('.my-chicken .num').text(data.left_num.format(0,','));
				self.updateRank(data.rank_dict);
				tipText = '送出了1个鸡腿';
			} else if(data.code==104){
				tipText = '比赛已结束，不能送鸡腿';
			} else if(data.code==103){
				tipText = '鸡腿不足';
			}
			self.listDom.find('.cloud-tip').text(tipText).addClass('on');
			setTimeout(function(){
				self.listDom.find('.cloud-tip').removeClass('on');
			},2000);
		});
	},
	init: function(){
		var self = this;
		self.Boss.find('.tab-item').click(function(){
			if($(this).hasClass('cur')) return;
			$(this).addClass('cur').siblings().removeClass('cur');
			self.listDom.filter('.list'+$(this).attr('_type')).addClass('cur').siblings('.list-wrap').removeClass('cur');
			self.tabSwitch($(this).attr('_type')-0);
		})
		self.Boss.find('.tab-item').eq(0).click();
		self.getChdrum();
		/* if(roomModules){
			roomModules.onRoomEvent('user:getuserinfo',function(result){
			    config.user = roomModules.getUserInfo();
			    if(config.user.uid && !self.isInitSDK){
			    	self.initSDK();
			    }
			})
		} */
		if(config.user.uid){
			self.initSDK();
		}
		self.Boss.find('.get-chicken').click(function(){
			if(!config.user.uid){
				roomModules.showLoginWin();
				return;
			};
			if($(this).hasClass('disabled')){
				$('.signTips.popularity-tips').html(template("signTemplate",{'type': ($(this).attr('type')-0)||1, 'coin': 0, 'isDrumsticks': true})).removeClass('hide');
			} else {
				SDK('gamechdrum').sendMsg(561, {'uid': config.user.uid});
			}
		})
		self.listDom.on('click','.send-chicken',function(){
			var id = $(this).closest('.list-item').attr('_id');
			if(!config.user.uid){
				roomModules.showLoginWin();
				return;
			};
			if($(this).hasClass('disabled')) return;
			SDK('gamechdrum').sendMsg(562, {'uid': config.user.uid, 'id': id, 'num': 1});
		})
	}
}
var getConfigInfo = function(){
	var hostHead = isPro?'//cc.163.com/':'//dev.cc.163.com/';
	$.ajax({
		url: hostHead+'zt/Battleground',
		type: 'get',
		data: {
			'format': 'json'
		},
		success: function(data){
			if(data.module_infos){
				for (var i = 0; i < data.module_infos.length; i++) {
					if(data.module_infos[i].module_type == 'topic'){
						$('.topic').show();
						$('.topic-wrap').html('<script src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js" type="text/javascript" charset="utf-8"></script>'+data.module_infos[i].content[0].code);
					} else if(data.module_infos[i].module_type == 'video'){
						$('.videoes').show();
						videoModule.initTemp(data.module_infos[i].tag_infos, data.module_infos[i].extra_url);
					} else if(data.module_infos[i].module_type == 'totalscore'){
						$('.schedule').show();
						schedule.initTemp(data.module_infos[i].tag_infos);
					}
				}
			}
			$(window.parent.document).find('#'+iframeId).css({'height': $(document).height()});
		}
	})
}

/*视频模块*/
var videoModule = {
	dataListTemp: null, //视频模块
	/*获取视频cgi*/
	getVideos: function(videoBox, pageNum){
		var hostHead = isPro?'//cc.163.com/':'//dev.cc.163.com/';
		var that = this;
		var tagId = videoBox.attr('_id');
		
		$.ajax({
			url: hostHead + 'zt/module/video',
			type: 'get',
			data: {
				'tag_id': tagId,
				'page': pageNum||1,
				'size': 8
			},
			success: function(data){
				if(data.content){
					videoBox.find('.video_wrap').html(template("videoItemTeml",{list: data.content}));
				}
				if(!pageNum && data.total_page>1 && data.current_page<=data.total_page ){
					new Pagination(videoBox.find('.navigation').removeClass('hide'), data.current_page, data.total_page, function(indexNum){
						var contentBox = $('.video_box.cur');
						that.getVideos(contentBox, indexNum);
					});
				}
			}
		})
	},
	initTemp: function(tags, url){
		$('.videoes').html(template("videoTeml",{'info': {'extra_url': url, 'list': tags}}));
		videoModule.init();
	},
	/*初始化*/
	init: function(){
		var that = this;
		var videoBox = $('.video_box.cur');
		if(videoBox.length > 0){
			for (var i = 0; i < videoBox.length; i++) {
				if(videoBox.eq(i).find('.navigation').length){
					new Pagination(videoBox.eq(i).find('.navigation'), 1, Math.ceil((videoBox.eq(i).attr('totalsize')-0)/8), function(indexNum){
						var contentBox = $('.video_box.cur');
						that.getVideos(contentBox, indexNum);
					});
				}
			}
		}
		$('.videoes .tab-item').click(function(){
			var index = $(this).attr('index'), thatVideoBox;
			if($(this).hasClass('cur')) return;
			$(this).addClass('cur').siblings().removeClass('cur');
			thatVideoBox = $('.video_box.item'+index);
			thatVideoBox.addClass('cur').siblings().removeClass('cur');
			if(thatVideoBox.find('.video_wrap').children().length<=0){
				that.getVideos(thatVideoBox);
			}
		})
	}
}


/*赛程模块*/
var schedule = {
	Boss: $('.schedule'),
	thisDay2Group:[],
	thisType: '',
	thisDay: '',
	thisGroup: '',
	playStatusArr: {
		'promote': '晋级',
		'over': '淘汰',
		'undefined': '待定'
	},
	initTemp: function(list){
		var self = this;
		$('.schedule').html(template("scheduleTeml",{'list': list}));
		for (var i = 0; i < list.length; i++) {
			if(list[i].is_selected = 'yes' && list[i].day2group){
				self.thisDay2Group = list[i].day2group;
				self.initDayTemp(self.thisDay2Group);
				self.initListTemp(list[i].scores);
				self.thisType = list[i]._id;
				break;
			}
		}
		self.init();
	},
	initDayTemp: function(list){
		var self = this;
		for (var i = 0; i < list.length; i++) {
			list[i].day = list[i].day.slice(0,10);
			list[i].dayTxt = list[i].day.slice(5,7) + '月' + list[i].day.slice(8) + '日';
		}
		self.Boss.find('.pages-main ul').html(template("scheduleDayTeml",{'list': list}));
		self.thisDay = list[list.length-1].day;
		self.initGroupTemp(list[list.length-1].groups);
		self.tabFun();
	},
	initGroupTemp: function(list){
		var self = this;
		self.Boss.find('.tab-wrap').html(template("scheduleGroupTeml",{'list': list}));
		self.thisGroup = list[0]||'';
	},
	initListTemp: function(list){
		var self = this;
		for (var i = 0; i < list.length; i++) {
			list[i].kill_score = (list[i].kill_score-0).format(0,',');
			list[i].ranking_score = (list[i].ranking_score-0).format(0,',');
			list[i].total_score = (list[i].total_score-0).format(0,',');
			list[i].statusTxt = self.playStatusArr[list[i].play_status];
		}
		self.Boss.find('.table-wrap').html(template("scheduleListTeml",{'list': list, 'hasPlayStatus': list[0].play_status!=='no'})).find('.tbody-wrap').jScrollPane();
		if(self.Boss.find('.jspDrag').length){
			self.Boss.find('.thead-wrap').addClass('pr10');
		} else {
			self.Boss.find('.thead-wrap').removeClass('pr10');
		}
	},
	getInfoByType: function(type) {
		var self = this;
		self.thisType = type;
		var hostHead = isPro?'//cc.163.com/':'//dev.cc.163.com/';
		$.ajax({
			url: hostHead+'zt/module/totalscore/info',
			type: 'get',
			data: {
				'tag_id': type
			},
			success: function(data){
				if(type == self.thisType){
					if(data.content.day2group){
						self.thisDay2Group = data.content.day2group;
						self.initDayTemp(self.thisDay2Group);
						self.initListTemp(data.content.scores);
					} else {
						self.Boss.find('.table-wrap').html('<div class="data-none">敬请期待</div>')
						self.Boss.find('.tab-wrap, .pages-main ul').html('');
						self.Boss.find('.time-tab-main .pages').addClass('hidden');
					}
				}
			}
		})
	},
	getInfoByGroup: function() {
		var self = this;
		var hostHead = isPro?'//cc.163.com/':'//dev.cc.163.com/';
		$.ajax({
			url: hostHead+'zt/module/totalscore',
			type: 'get',
			data: {
				'tag_id': self.thisType,
				'day': self.thisDay,
				'group': self.thisGroup
			},
			success: function(data){
				if(data.tag_id==self.thisType && data.day==self.thisDay && data.group==self.thisGroup){
					self.initListTemp(data.content);
				}
			}
		})
	},
	// tab交互
	tabFun: function(){
		var self = this;
		var mainDom = self.Boss.find('.pages-main ul'), // 内部ul外层div
			prevDom = self.Boss.find('.icon-time-prev'), // 上一页按钮
			nextDom = self.Boss.find('.icon-time-next'), // 下一页按钮
			itemDom = mainDom.find('li'),
			itemWidth = mainDom.find('li').outerWidth(true),
			ulWidth = itemWidth*itemDom.length,
			maxLeft = ulWidth- self.Boss.find('.pages-main').width(),
			left = maxLeft; // li宽度
		mainDom.width(ulWidth);
		nextDom.addClass('hidden');
		if(maxLeft<=0){
			prevDom.addClass('hidden');
			mainDom.css('left', '0px');
		} else {
			mainDom.css('left', -left+'px');
			prevDom.removeClass('hidden');
		}
		prevDom.click(function() {
			left -= itemWidth;
			if(left == 0){
				prevDom.addClass('hidden');
			} else {
				prevDom.removeClass('hidden');
			}
			nextDom.removeClass('hidden');
			mainDom.css('left', -left+'px');
		})
		nextDom.click(function() {
			left += itemWidth;
			if(left == maxLeft){
				nextDom.addClass('hidden');
			} else {
				nextDom.removeClass('hidden');
			}
			prevDom.removeClass('hidden');
			mainDom.css('left', -left+'px');
		})
	},
	init: function(){
		var self = this;
		self.Boss.find('.pages-main').on('click','li',function() {
			var index;
			if($(this).hasClass('current')) return;
			index = $(this).attr('index')-0;
			self.thisDay = $(this).attr('day');
			self.initGroupTemp(self.thisDay2Group[index].groups);
			self.getInfoByGroup();
			$(this).addClass('current').siblings().removeClass('current');
		})
		self.Boss.find('.tag-item').click(function() {
			var id;
			if($(this).hasClass('cur')) return;
			id = $(this).attr('_id');
			self.getInfoByType(id);
			$(this).addClass('cur').siblings().removeClass('cur');
		})
		self.Boss.find('.tab-wrap').on('click','.group-item',function() {
			if($(this).hasClass('cur')) return;
			self.thisGroup = $(this).attr('group');
			self.getInfoByGroup();
			$(this).addClass('cur').siblings().removeClass('cur');
		})
	}
}

index.init();
