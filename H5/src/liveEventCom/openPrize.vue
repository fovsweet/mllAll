<script>
import diaShake from './diaShake'
import disShare from '../components/diaShare'
import headGroup from './headGroup'
import diaLucky from './diaLucky'
// import luckGroup from './luckyGroup'
	export default{
		el:'#app',
		data(){
			return {
				uuId:uuId,
				openId:openId,
				activeDia:'', //当前弹框组件
				
				prizeInfo:{},
				headImgInfo:[],  //存储改造过后的头像列表的数据
				headImgGroup:[], //获取的头像列表数据
				headLeftNum:'', //还有XXX人数量

				luckyCounter:true, //幸运大奖两种状态的切换
				luckyNumber:0,
				luckTimer:'00:00:00', //幸运奖倒计时提示文字
				prizeTimer:'00:00:00', //奖品开将倒计时提示文字

				noTice:'', //轮播滚动
				btnState:false, //开奖按钮状态
				openType:'0', //0为系统开奖，1为主持人开奖
				isOpen:'N', //Y为主持人点了开奖，N为主持人没点开奖
				noHeadGroup:true, //头像列表
				activeHeadGroup:'',  //当前头像列表组件
				activeLuckGroup:'', //当前幸运奖组件
				serverNowTime:'', //返回系统当前时间

				activeBackTimer:null, //活动倒计时计时器
				btnStateTimer:null, //按钮状态定时器
				luckyBackTimer:null, //幸运奖倒计时计时器
				andriodTimer:null, //安卓手机定时刷新倒计时，减小倒计时误差
				headerGroupTimer:null,  //刷新头像定时器
				luckyNumberTimer:null,  //刷新幸运值定时器

				luckyAngel:''	//是否是幸运天使
			}
		},
		ready(){
			this.getInfo();
			this.getLuckyNumber();
			this.caclPositon();
			var vThis = this;
			window.onload = function(){
				var load = document.querySelector('.loader');
			    load.remove();
			    var imgArr = ['images/dist/shake-bag.gif','images/dist/shak-bg.png'];
			    for(var i= 0;i<imgArr.length;i++){
			      var img = new Image();
			      img.src = imgArr[i];
			    }
			    vThis.activeHeadGroup = 'headGroup';  //加载头像列表
			    vThis.activeLuckGroup = 'luckGroup';  //加载幸运大奖组件
			}
			this.fixBackTimerForIphone();  //绑定修复苹果倒时计事件
			this.fixBackTimerForAndorid(); //修复安卓倒计时误差
		},
		components:{
			diaShake,disShare,headGroup,diaLucky
		},
		watch:{
		},
		methods:{
			caclPositon(){
				var gap = 270/10;
				var radian = Math.PI /180; //角度=>弧度
				for(let i=0;i<10;i++){
					let myAngle = (212 - gap*i)*radian;
					let posi = {};
					posi.cos = Math.cos(myAngle);
					posi.sin = Math.sin(myAngle);
					posi.x = 4.75 + 4.75*Math.cos(myAngle);
					posi.y = 4.75 + 4.75*Math.sin(myAngle);	
					posi.img = '';
					this.headImgInfo.push(posi);
				}
			},
			replaceImg(){
				for(let i=0;i<this.headImgInfo.length;i++){
					if(this.headImgGroup[i] != undefined){
						this.headImgInfo[i].img = 'url("' + this.headImgGroup[i].headImgUrl + '")';
					}else{
						this.headImgInfo[i].img = 'url(images/default.png)';
					}
				}	
			},
			fixBackTimerForIphone(){
				var vThis = this;
				if(vThis.getSystemType() == 'iphone'){
				 document.addEventListener('touchend',function(){
				 	$.get('h5/getSysDate?fresh'+Math.random(),{},function(res){
				 		if(res.nowTime){
				 			clearInterval(vThis.activeBackTimer);
				 			clearInterval(vThis.luckyBackTimer);
				 			vThis.setActiveBackTime(vThis.activeBackTimer,res.nowTime,vThis.prizeInfo.lvDefRewTime);
					 		if(vThis.prizeInfo.luckyOpen == '1'){
					 			vThis.setLuckyBackTime(vThis.luckyBackTimer,res.nowTime,vThis.prizeInfo.luckyRewTime);
					 		}
				 		}
				 	})
				 }, false);  
				}
			},
			fixBackTimerForAndorid(){
				var vThis = this;
				if(vThis.getSystemType() == 'android'){
				clearInterval(this.andriodTimer);
				this.andriodTimer =	setInterval(function(){
					 	$.get('h5/getSysDate?fresh'+Math.random(),{},function(res){
					 		if(res.nowTime){
					 			clearInterval(vThis.activeBackTimer);
						 		clearInterval(vThis.luckyBackTimer);
						 		vThis.setActiveBackTime(vThis.activeBackTimer,res.nowTime,vThis.prizeInfo.lvDefRewTime);
						 		if(vThis.prizeInfo.luckyOpen == '1'){
						 			vThis.setLuckyBackTime(vThis.luckyBackTimer,res.nowTime,vThis.prizeInfo.luckyRewTime);
						 		}
					 		}
					 	})
					}, 10000);
				}
			},
			getInfo(){
				var vThis = this;
				$.get('h5/partIn?fresh'+Math.random(),{uuid:this.uuId,openId:this.openId},function(res){
					console.log(res)
					if(res != null){
						vThis.prizeInfo = res;
						vThis.luckyAngel = res.luckyAngel;
						var timeArea = res.lvDefRewTime - res.nowTime;
						var luckTimeArea = res.luckyRewTime - res.nowTime;
						vThis.setActiveBackTime(vThis.activeBackTimer,res.nowTime,res.lvDefRewTime);
						if(res.luckyOpen == '1'){  //如有幸运奖，则开启幸运倒计时
							vThis.setLuckyBackTime(vThis.luckyBackTimer,res.nowTime,res.luckyRewTime);
						}
						if((res.nowTime-res.lvDefRewTime)<=60000 && res.openType == '0'){  //当是系统自动开奖，则开启定时器，在开奖过一分钟后将按钮置灰
							vThis.setBtnState(res.nowTime,res.lvDefRewTime);
						}
						vThis.getHeadGroun();
						vThis.getNotice();
					}
				})
			},
			setActiveBackTime(timers,nowTime,openTime){
				var vThis = this;
				var timeArea = openTime - nowTime;
				clearInterval(vThis.activeBackTimer);
				vThis.activeBackTimer = setInterval(function(){
				  timeArea-=1000;
				  if(timeArea >= 1000){
				  	 vThis.prizeTimer = vThis.fixTime(Math.floor(timeArea/1000%86400/3600))  +':'+  vThis.fixTime(Math.floor(timeArea/1000%3600/60))+':'+vThis.fixTime(Math.floor(timeArea/1000%60)) ;
				  }else{
				  	vThis.prizeTimer = '00:00:00';
				  	clearInterval(vThis.activeBackTimer); //清除抽奖倒计时定时器
				  	clearInterval(vThis.andriodTimer);  //清除安卓机校正倒计时的定时器
				  	if((nowTime-openTime)<=60000 && vThis.prizeInfo.isAward == 'N' ){ //倒计时完成后，如果用户没有参与过开奖，则按钮可点，否则不可点
				  		vThis.btnState = true;
				  		if(vThis.prizeInfo.openType == '1'){  //1为主持人开奖，轮询查看主持人是否点击开奖，并设置定时将开奖按钮置灰
				  			vThis.getOpenState();
				  		}
				  	}
				  }
				}, 1000);
			},
			setLuckyBackTime(luckTimers,nowTime,openTime){
				var vThis = this;
				var luckTimeArea = openTime - nowTime;
				clearInterval(vThis.luckyBackTimer);
				vThis.luckyBackTimer = setInterval(function(){
					luckTimeArea-=1000;
					if(luckTimeArea >= 1000){
					  	vThis.luckTimer = vThis.fixTime(Math.floor(luckTimeArea/1000%86400/3600))  +':'+  vThis.fixTime(Math.floor(luckTimeArea/1000%3600/60))+':'+vThis.fixTime(Math.floor(luckTimeArea/1000%60)) ;
					}else{
						vThis.luckTimer='00:00:00';
					  	clearInterval(vThis.luckyBackTimer);
					}
				}, 1000);
			},
			getHeadGroun(){
				var vThis = this;
				$.get('h5/getHead?fresh'+Math.random(),{uuid:vThis.uuId,mchId:vThis.prizeInfo.mchId},function(res){
						if(res.userInfo.content != null){
							vThis.headImgGroup = res.userInfo.content;
							vThis.headLeftNum = res.userInfo.total;
							vThis.replaceImg();
						}
				})
				clearInterval(this.headerGroupTimer);
				this.headerGroupTimer =setInterval(function(){
					$.get('h5/getHead?fresh'+Math.random(),{uuid:vThis.uuId,mchId:vThis.prizeInfo.mchId},function(res){
						if(res.userInfo.content != null){
							vThis.headImgGroup = res.userInfo.content;
							vThis.headLeftNum = res.userInfo.total;
							vThis.replaceImg();
						}
					})
				}, 10000);
			},
			getLuckyNumber(){
				var vThis = this;
				$.get('h5/getLucky?fresh'+Math.random(),{uuid:vThis.uuId,openId:vThis.openId},function(res){
					if(res.lucky){
						vThis.luckyNumber = res.lucky;
					}
				})
				clearInterval(this.luckyNumberTimer);
				this.luckyNumberTimer = setInterval(function(){
					$.get('h5/getLucky?fresh'+Math.random(),{uuid:vThis.uuId,openId:vThis.openId},function(res){
						if(res.lucky){
						vThis.luckyNumber = res.lucky;
						}
					})
				}, 10000);
			},
			getOpenState(){
				var btnTimer = null;
				var vThis = this;
				btnTimer = setInterval(function(){
					$.get('h5/isHostLottery?fresh'+Math.random(),{uuid:vThis.uuId,rewardUuid:vThis.prizeInfo.lvDefRewUuid},function(res){
						if(res.isOpen == 'Y'){
							 clearInterval(btnTimer);
							 vThis.setBtnState(parseInt(res.nowTime),parseInt(res.rewTime));
							 vThis.isOpen = res.isOpen;
						}
					})
				}, 1000);
			},
			setBtnState(nowTime,openTime){
				var vThis = this;
				clearTimeout(this.btnStateTimer);
				this.btnStateTimer = setTimeout(function(){
					vThis.btnState = false;
					if(vThis.activeDia == 'diaShake'){
						vThis.activeDia = '';
					}
				}, (openTime+60000-nowTime));
			},
			getNotice(){
				var vThis = this;
				$.get('h5/getNotice?fresh'+Math.random(),{uuid:vThis.uuId,mchId:vThis.prizeInfo.mchId},function(res){
					 vThis.noTice = res.notice;
				})
			},
			fixTime(num){
				if(num < 10){
					return '0'+num;
				}else{
					return num;
				}
			},
			shakeOpen(){
				this.activeDia = 'diaShake';
				console.log('调用！');
				$.post('h5/addLottoNum?fresh'+Math.random(),{uuid:this.uuId,rewardUuid:this.prizeInfo.lvDefRewUuid,openId:this.openId},function(res){
						if(res.flag == 'success'){
							console.log('发送成功！')
						}
				})
			},
			getLucky(){
				this.activeDia = 'diaLucky';
			},
			toggleLuckyCounter(){
				this.luckyCounter = !this.luckyCounter;
			},
			directHref(rewardId){
				window.location.href = "h5/resultView?uuid="+ this.uuId +"&rewardUuid="+ rewardId +"&openId=" + this.openId;
			},
			getSystemType(){
				var ua = navigator.userAgent.toLowerCase();	
				var type= '';
				if (/iphone|ipad|ipod/.test(ua)) {
					    type = 'iphone';		
				} else if (/android/.test(ua)) {
					    type = "android";	
				}
				return type;
			},
		},
		events:{
			closeDia() {
				this.activeDia = '';
			},
			changeLucky(){
				this.activeDia = '';
				this.luckyAngel = 'Y';
			}
		}
	}
</script>

<template>
		<!-- 幸运奖固定层组件 start -->
		<component :is="activeLuckGroup" :luckopen.sync="prizeInfo.luckyOpen"  :luckimg.sync="prizeInfo.luckyImgUrl" :timetext.sync="luckTimer" ></component>	
		<!-- 幸运奖固定层组件 end -->
		<marquee behavior="" direction="" class="marquee" v-if="noTice != ''">
			<span>中奖通告</span>：{{{noTice}}}
		</marquee>
		<div class="head-group">
			<!-- 10个头像组件 start -->
			<component :is="activeHeadGroup" :rewurl.sync="prizeInfo.lvDefRewUrl" :headgroup.sync="headImgInfo"></component>			
			<!-- 10个头像组件 end -->
			<div class="prize-name">
				{{prizeInfo.lvDefRewName}}
			</div>
		</div>
		<div class="left-number">
			共有{{headLeftNum}}名参与者
		</div>
		<div class="counter-time">
			{{prizeTimer}}
		</div>
		<div v-show="btnState" class="shake-join"  v-gesture:tap.stop.prevent="shakeOpen">
			开奖啦,快戳我
		</div>
		<div v-show="!btnState" class="shake-join shake-gray">
			还未到开奖时间
		</div>
		<slot v-if='luckyAngel == "N"'>
			<div class="lucky-level">
				<div class="lucky-left">
					<div class="luck_queen">
						<h2>成为<span>幸运天使</span>，</h2>
						<h5>中奖概率<span>翻倍</span>哦!</h5>
						<img class="chibang chibang2" src="../assents/images/liveevent/chibang2.png">
					</div>
					<div class="img-wraper">
						<img :src="prizeInfo.headImgUrl" alt="" class="lucky-img">
					</div>
					<div class="lucky-name">
						{{prizeInfo.nickName}}
					</div>
				</div>
			</div>
			<div class="get-lucky toLucky" v-gesture:tap.stop.prevent="getLucky">
				成为幸运天使
			</div>
		</slot>
		<slot v-else>
			<div class="lucky-level">
				<div class="lucky-left">
					<div class="luck_queen">
						<h2>成为<span>幸运天使</span>，</h2>
						<h5>中奖概率<span>翻倍</span>哦!</h5>
						<img class="chibang" src="../assents/images/liveevent/chibang.png">
					</div>
					<div class="img-wraper">
						<img :src="prizeInfo.headImgUrl" alt="" class="lucky-img">
					</div>
					<div class="lucky-name">
						{{prizeInfo.nickName}}
					</div>
				</div>
			</div>
			<div class="get-lucky">
				幸运天使降临
			</div>
		</slot>
		<div class="prize-list">
			<div class="prize-item" v-for="item in prizeInfo.lvDefRewards">
				<div class="item-img">
					<img v-lazy="item.lvDefRewUrl" alt="">
				</div>
				<div class="item-info">
					<p>{{item.lvDefRewName}}</p>
					<p>开奖时间</p>
					<p>{{item.lvDefRewTimeStr}}</p>
				</div>
				<div class="item-result" v-gesture:tap.stop.prevent="directHref(item.lvDefRewUuid)" v-if="item.lvDefRewIsopen == '1'" >
					<span class="result">开奖结果</span>
				</div>
			</div>
		</div>
		<!-- 摇一摇弹框组件 start -->
		<component :is="activeDia" :uuid.sync="uuId" :openid.sync="openId" :rewarduuid.sync="prizeInfo.lvDefRewUuid" :opentype.sync="prizeInfo.openType" :isopen.sync="isOpen" :prizeurl.sync="prizeInfo.lvDefRewUrl" :prizename.sync="prizeInfo.lvDefRewName" ></component>
		<!-- 摇一摇弹框组件 end-->
</template>


<style lang="less">
	
	[v-cloak] {
		  display: none;
		}
	html,body{
		margin:0;
		padding: 0;
		background-color: #0a0522;
		line-height: 1;
		font-family: 微软雅黑, Arial;
	}
	div{
		-webkit-tap-highlight-color: rgba(0,0,0,0);
		-webkit-tap-highlight-color: transparent; 
	}
	a{
		text-decoration: none;
		-webkit-tap-highlight-color: rgba(0,0,0,0);
		-webkit-tap-highlight-color: transparent; 
	}
	.lucky-counter{
		z-index: 9;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 2.4rem;
		height: 2.65rem;
		background:transparent url('../assents/images/liveevent/xinyundajiangtishi.png') no-repeat top center;
		background-size: 100% 100%;
		position: fixed;
		right: 0;
		top:9rem;
		padding-left: .2rem;
		box-sizing: border-box;

		.lucky-counter-name{
			display: inline-block;
			font-size: 0.55rem;
			line-height: 1.2;
			width: 1.2rem;
			text-align: center;
			color: #ff75a4;
		}
	}
	.lucky-wrapper{
		width: 6.25rem;
		height: 5.25rem;
		background:transparent url('../assents/images/liveevent/dajiangdaojishi.png') no-repeat top center;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: fixed;
		right: 0;
		top: 6.5rem;
		z-index: 9;
		padding-left: .2rem;
		box-sizing: border-box;
		line-height: 0;


		.luck-wrapper-img{
			box-sizing: border-box;
			width: 2rem;
			height: 2rem;
			border-radius: 50%;
			border: 0.05rem solid #fff;
			margin-top: .5rem;
			transform: translate3d(0,0,0);
		}

		.lucky-time{
			font-size: 1.2rem;
			font-family: 'Time';
			color: #ffa39e;
			text-align: center;
			line-height: 1;
			transform: translate3d(0,0,0);
		}

		.lucky-tips{
			font-size: 0.55rem;
			color: #fff;
			text-align: center;
			line-height: 1;
			margin-top: .25rem;
		}

	}
	.marquee{
		font-size: .65rem;
		color: white;

		span{
			color:#79d1ff;
		}
	}
	.head-group{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 11.25rem;
		height: 8.5rem;
		margin:1rem auto 0;
		position: relative;


		.head-img{
			position: absolute;
			width: 1.7rem;
			height: 1.7rem;
			border-radius: 50%;
			transform: translate3d(0,-2.5rem,0);
			border:0.05rem solid #fff;
			background-repeat: no-repeat;
			background-position: center center;
			background-size: 100% 100%;

		}

		.prize-img{
			width: 3.75rem; 
			height: 3.75rem;
			border-radius: 50%;
			border:.2rem solid #8a83a4;
			position: absolute;
			top: .5rem;
			left: 50%;
			transform: translate3d(-50%,0,0);
		}

		.prize-name{
			width: 3.5rem;
			text-align: center;
			position: absolute;
			top: 5rem;
			left: 50%;
			transform: translateX(-50%);
			font-size: .65rem;
			color: white;
			line-height: 1.2;
		}
	}

	.left-number{
		margin:.75rem auto 0;
		text-align: center;
		font-size: .65rem;
		color: white;
	}

	.counter-time{
		box-sizing: border-box;
		font-family: 'Time';
		display: flex;
		align-items: center;
		justify-content: center;
		margin:.75rem auto 0;
		width: 13.35rem;
		height: 4.5rem;
		background:transparent url('../assents/images/liveevent/daojishi.png') no-repeat top center;
		background-size: 100% 100%;
		padding-bottom: .75rem;
		font-size: 3rem;
		color:#ffa39e;
		transform: translate3d(0,0,0);
	}
	.shake-join{
		box-sizing: border-box;
		display: flex;
		width: 11.825rem;
		height: 3.9rem;
		font-size: .9rem;
		background:transparent url('../assents/images/liveevent/kedian.png') no-repeat top center;
		background-size: 100% 100%;
		color:#1e4084;
		text-align: center;
		justify-content: center;
		align-items: center;
		margin:0 auto;
		padding-bottom: .3rem;
	}
	.shake-gray{
		background:transparent url('../assents/images/liveevent/bukedian.png') no-repeat top center;
		background-size: 100% 100%;
	}
	.lucky-level{
		display: flex;
		margin:1.5rem auto 0;
		display: flex;
		justify-content: center;

		.lucky-left{
			display: flex;
			position:relative;
			width: 5rem;
			flex-direction: column;
			align-items: center;
			.luck_queen{
				width:10rem;
				h2,h5{
					line-height:1;
					margin:0;
					font-weight:normal;
					font-size:0.8rem;
					color:#79d1ff;
					span{
						font-size:1.2rem;
						color: #79d1ff;
					}
				}
				h5{
					margin-left:3.3rem;
				}
			}
			.chibang{
				position: absolute;
			    border-radius: initial;
			    border: none;
				width: 9.75rem;
				height: 7rem;
				left: -2.25rem;
				top: -0.2rem;
			    z-index: 0;
			}
			.chibang2{
			    width: 6rem;
			    height: 3.75rem;
			    top: 3.1rem;
			    left: -0.5rem;
			}
			.img-wraper{
				height: 2.5rem;
				margin-top:1.5rem;
				position: relative;
				z-index:1;
				display: flex;
				align-items: center;
				background: url('../assents/images/liveevent/chibang.png');
			}

			img{
				width: 2.25rem;
				height: 2.25rem;
				border-radius: 50%;
				border:.05rem solid #fff;
				box-sizing: border-box;
			}

			.lucky-name{
				margin-top: .25rem;
				color: white;
				font-size: .75rem;
				line-height: 1.2;
				width: 100%;
				text-align: center;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}

		}

		.lucky-right{
			display: flex;
			width: 5rem;
			flex-direction: column;
			align-items:center;
			font-size: 0;
			
			.lucky-number{
				display: flex;
				font-size: 2.5rem;
				align-items:center;
				justify-content: center;
				line-height: 1;
				height: 2.5rem;
				color: #79d1ff;
			}
			
			.lucky-number-name{
				line-height: 1.2;
				margin-top: .25rem;
				color: white;
				font-size: .75rem;
				width: 100%;
				text-align: center;
			}
		}
	}

	.get-lucky{
		box-sizing: border-box;
		display: flex;
		width: 9.8rem;
		height: 3.9rem;
		font-size: .9rem;
		background:transparent url('../assents/images/liveevent/lucky_button.png') no-repeat top center;
		background-size: 100% 100%;
		color:#fff;
		text-align: center;
		justify-content: center;
		align-items: center;
		margin:.75rem auto 0;
		padding-bottom: .3rem;
	}

	.toLucky{
		background:transparent url('../assents/images/liveevent/anniu.png') no-repeat top center;
		background-size:100% 100%;
		color:#1e4084;
	}

	.prize-list{
		width: 14.5rem;
		margin:2.25rem auto 0;
		padding: 0 .375rem;
		box-sizing: border-box;
		background: rgba(5,25,57,.8);
		box-shadow: 0 0 .9rem rgba(21,164,255,.8) inset;
		border: 2px solid #4aa3ef;
		border-radius: .25rem;
	}
	.prize-item{
		padding: .5rem 0;
		display: flex;
		align-items: center;
		font-size: .65rem;
		color: #fff;
		
		div{
			display: flex;
		}
		.item-img{
			width:3rem;
			justify-content: center;
			align-items: center;

			img{
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
			}

			img[lazy=loading] {
			    width: 1rem;
				height: 1rem;
				border-radius: 50%;
			  }
		}

		.item-info{
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			margin-left: .5rem;
			flex: 1;

			p{
				margin:0;
			}
			p:nth-child(1){
				font-size: .75rem;
			}
			p:nth-child(2){
				margin-top: .75rem;
			}
			p:nth-child(3){
				margin-top: .25rem;
			}
		}

		.item-result{
			width: 2rem;
			height: 2rem;
			border: .05rem solid #fff;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;

			.result{
				display: inline-block;
				width: 1.2rem;
				font-size: 0.55rem;
				line-height: 1.2;
				text-align: center;
			}
		}
		
	}
	.prize-item:not(:last-child){
		border-bottom: 1px solid #4aa3ef;
	}
</style>
