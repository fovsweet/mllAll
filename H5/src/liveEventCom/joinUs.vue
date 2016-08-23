<script>
import diaArea from './diaArea'
import diaQrcode from './diaQrcode'
export default{
	el:'#app',
	data(){
		return {
			//从JAVA接收的数据
			uuid:uuId,
			openId:openId,
			title:lvDef.lvDefTitle,  //活动标题 
			intro:lvDef.lvDefDescWx,  //活动介绍
			startTime:lvDef.lvDefStartTime,  //开始时间
			endTime:lvDef.lvDefEndTime,  //结束时间
			localOpen:lvDef.lvDefLocaOpen,  //0代表地理位置关闭，1代表开启
			setLgt:lvDef.lvDefLocaJson.longitude,
			setLat:lvDef.lvDefLocaJson.latitude,
			setRadius:lvDef.lvDefLocaJson.radius,
			ccid:lvDef.lvDefLocaCcid,
			desc:lvDef.lvDefDesc,   //活动描述
			prizeName:lvDefReward.lvDefRewName,  //奖品名称
			prizePic:lvDefReward.lvDefRewUrl, //奖品图片
			isFollow:isFollow,  //是否关注公众号 Y/N
			qrCodeUrl:qrCodeUrl, //公众号二维码图片地址

			//本应用设定的数据
			activeDia:'',  //当前弹框
			currentLgt:0,  //当前经度 
			currentLat:0,  //当前纬度
			btnShow:true,
			waitShow:false,
			overShow:false,
			stringStartTime:lvDef.lvDefStartTime,
		}
	},
	computed:{
		stringStartTime(){
			let t = parseInt(this.startTime)
			let d = new Date(t);
			let s = d.getFullYear()+'-'+ this.fixTime(d.getMonth()+1)+'-'+ this.fixTime(d.getDate())+' '+ this.fixTime(d.getHours())+':'+this.fixTime(d.getMinutes())+':'+this.fixTime(d.getSeconds());
			return s;
		}
	},
	components:{
		diaArea,diaQrcode
	},
	ready() {
		 window.onload = function(){
		    var load = document.querySelector('.loader');
		    load.remove();
		 }
       if(this.isFollow == 'Y' && this.activeState() != 'over' && this.localOpen == '1' ){ //当活动没有结束时，如果开启了地理限制,获取地理位置
			if(navigator.geolocation){
			    navigator.geolocation.getCurrentPosition(this.showPosition);
			}else{
				alert('您的设备不支持定位!');
			}
       }else if(this.activeState() == 'over'){
       		this.btnShow =  this.waitShow = false;
			this.overShow = true;
       }	
	},
	methods:{
		joinUs() {
			if(isFollow == 'N'){   //如果没有关注公众号，弹出二维码
				this.activeDia = 'diaQrcode';
			}else if(isFollow == 'Y'){
				if(this.localOpen == '1'){ //如果开启了地理限制
					if(!this.inArea()){
						this.activeDia = 'diaArea';						
						if(this.ccid != '' && this.ccid != null){   //判断有没有设置卡券，如果有，调接口推卡券
							$.post('h5/receiveCc',{uuid:this.uuid,openId:this.openId},function(res){
								if(res.isReceive){
									console.log('将推送卡券给您！');
								}
							})
						}						
						return false;
					}
				}
				
				//当前活动正在进行中时
				if(this.activeState() == 'starting'){
					window.location.href="h5/openPrize?uuid="+this.uuid+"&openId="+ this.openId;
					return false;
				}

				//当前活动未开始时
				if(this.activeState() == 'waiting'){
					//进行ajax请求，发送参与人信息
					var vThis = this;
					$.post('h5/signUp',{uuid:this.uuid,openId:this.openId},function(res){
						if(res.flag == 'success'){
							console.log('报名成功！');
							vThis.btnShow =  vThis.overShow = false;
							vThis.waitShow = true;
						}
					})
					return false;
				}
			}
		},
		fixTime(num){
			if(num < 10){
				return '0'+num;
			}else{
				return num;
			}
		},
		showPosition(position) {
			this.currentLgt = position.coords.longitude;
			this.currentLat = position.coords.latitude;
			//alert('新经度：'+ this.currentLgt  +'新纬度：'+ this.currentLat);
		},
		activeState(){ //判断活动当前状态
			let currentTime = new Date().getTime();
			if( currentTime <  this.startTime ){
				return 'waiting';
			}else if( currentTime >= this.startTime && currentTime < this.endTime){
				return 'starting';
			}else if( currentTime >= this.endTime ){
				return 'over';
			}
		},
		inArea(){
			let R,radSetLgt,radCurLgt,radSetLat,radCurLat,aLat,aLgt,distance;
			R = 6378137 ;
			radSetLgt = this.setLgt*Math.PI/180.0 , radCurLgt = this.currentLgt*Math.PI/180.0;
			radSetLat = this.setLat*Math.PI/180.0 ,radCurLat = this.currentLat*Math.PI/180.0;
			aLgt = radSetLgt - radCurLgt;
			aLat = radSetLat - radCurLat;
			distance = 2*R*Math.asin(Math.sqrt(Math.pow(Math.sin(aLgt/2),2) + Math.cos(radSetLgt)*Math.cos(radCurLgt)*Math.pow(Math.sin(aLat/2),2)));
			distance = Math.round(distance*10000)/10000.0;
			if(distance <= this.setRadius*1000){
				return true;
			}else if(distance > this.setRadius*1000){
				return false;
			}
		},
	},
	events:{
		closeDia() {
			this.activeDia = '';
		}
	}
}
</script>

<template>
	<div class="shake-logo"></div>
	<div class="shake-logo-text"></div>
	<div class="shake-hello">
		{{title}}
	</div>
	<div class="shake-join" v-gesture:tap.stop.prevent="joinUs()" v-show="btnShow">我要参与</div>
	 <div class="shake-warning" v-show="waitShow">
		<span class="p-tip">恭喜你报名成功!活动开始前我们会通知您哦</span><br>
		<span class="p-begin">活动开始时间为</span><br>
		<span class="p-time">{{stringStartTime}}</span>
	</div> 
	 <div class="shake-warning" v-show="overShow">
		<span class="p-over">很抱歉,活动已结束!</span><br>
		<span class="p-over">请关注公众号更多粉丝活动</span>
	</div> 
	<div class="shake-desc">
		<div class="shake-desc-title">
			活动介绍
		</div>
		{{intro}}
	</div>
	<div class="shake-prize">
		<div class="shake-prize-light"></div>
		<div class="shake-prize-title">
			{{prizeName}}
		</div>
		<div class="shake-img-warpper">
		<img class="shake-img" v-lazy="prizePic" alt="">
		</div>
		<div class="shake-bottom">	</div>
	</div>
	<div class="shake-info shake-tips">
		<div class="shake-desc-title">
			活动说明
		</div>
		{{{desc}}}
	</div>

	<!-- 显示何种弹窗组件 start -->
		<component :is="activeDia" :qrcode.sync="qrCodeUrl"></component>
	<!-- 显示何种弹窗组件 end-->

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
	
	.shake-logo{
		background:transparent url('../assents/images/liveevent/beijing-yaoyiyao.png') no-repeat top center;
		background-size: 100% auto;
		width: 10rem;
		height:11.3rem;
		margin:0 auto;
		animation: scaleout 1.2s infinite ease-in; 
		/* animation: ball-scale 1.2s 0s infinite cubic-bezier(.21, .53, .56, .8) */
	}
	@keyframes ball-scale{
	  0% {
	    transform: scale(0.8);
	    opacity: 1; 
	 	}

	  70% {
	    transform: scale(1);
	    opacity: 0.7; 
		}

	  100% {
	  	transform: scale(1.4);
	    opacity: 0.0; 
		} 
	  }
	@keyframes scaleout {
	  0% {
	    transform: scale(1.0);
	    opacity: 1;
	  }
	  10% {
	    transform: scale(1.0);
	    opacity: 1;
	  }  
	  55% {
	    transform: scale(1.1);
	    opacity: 0.7;
	  }
	  90% {
	    transform: scale(1.4);
	    opacity: 0;
	  }
	  100% {
	    transform: scale(1.4);
	    opacity: 0;
	  }
	}
	.shake-logo-text{
		width: 9.5rem;
		height: 7.5rem;
		background:transparent url('../assents/images/liveevent/wenzi.png') no-repeat top center;
		background-size: 100% auto;
		position: absolute;
		top: 2.625rem;
		left: 50%;
		transform: translateX(-50%);
	}
	.shake-hello{
		display: flex;
		width: 12rem;
		height: 6.25rem;
		margin:0 auto;
		text-align: center;
		justify-content: center;
		align-items: center;
		font-size: 1.1rem;
		color: #79d1ff;
	}
	.shake-join{
		display: flex;
		width: 11.825rem;
		height: 3.9rem;
		font-size: .9rem;
		background:transparent url('../assents/images/liveevent/anniu.png') no-repeat top center;
		background-size: 100% 100%;
		color:#1e4084;
		justify-content: center;
		align-items: center;
		margin:0 auto;
		padding-bottom: .3rem;
	}
	.shake-warning{
		width: 16rem;
		height: 3.9rem;
		display: table-cell;
		vertical-align: middle;
		text-align: center;
		font-size: 0;
		line-height: 1;
	
		span{
			display: inline-block;
			vertical-align: middle;
			margin-top: .25rem;
		}

		.p-tip{
			text-align: center;
			font-size: .65rem;
			color: white;
		}
		.p-begin{
			text-align: center;
			color: #79d1ff;
			font-size: .75rem;
		}
		.p-time{
			text-align: center;
			color:#79d1ff;
			font-size: .9rem;
		}

		.p-over{
			text-align: center;
			font-size: .75rem;
			color: white;
		}
	}
	.shake-desc{
		display: flex;
		position: relative;
		box-sizing: border-box;
		width: 14.5rem;
		min-height: 5.25rem;
		align-items: center;
		justify-content: cneter;
		font-size: .65rem;
		color: #fff;
		line-height: 1.5;
		margin:3rem auto 0;
		padding: 1.25rem .75rem;
		border-radius: .25rem;
 		background-color:rgba(5,25,57,.8);
		box-shadow: 0 0 .9rem rgba(21,164,255,.8) inset;	
		border:.1rem solid #4aa3ef;	
		word-break: break-all;
		text-align: justify;
	}
	.shake-info{
		position: relative;
		box-sizing: border-box;
		width: 14.5rem;
		min-height: 5.25rem;
		font-size: .65rem;
		color: #fff;
		line-height: 1.5;
		margin:3rem auto 0;
		padding: 1.25rem .75rem;
		border-radius: .25rem;
 		background-color:rgba(5,25,57,.8);
		box-shadow: 0 0 .9rem rgba(21,164,255,.8) inset;	
		border:.1rem solid #4aa3ef;	
		word-break: break-all;
		text-align: justify;
	}
	.shake-desc-title{
		display: flex;
		position: absolute;
		z-index: 4;
		width: 6rem;
		height: 2rem;
		font-size: .7rem;
		color: #fff;
		background:transparent url('../assents/images/liveevent/biaoti.png') no-repeat top center;
		background-size: 100% 100%;
		justify-content: center;
		align-items: center;
		line-height:1;
		top: -1rem;
		left: 50%;
		margin-left: -3rem;
		text-shadow: 0 0 .15rem #54b1ff;
		padding-bottom: .3rem;
	}
	.shake-prize-title{
		display: flex;
		position: absolute;
		z-index: 4;
		width: 12rem;
		height: 2rem;
		font-size: .75rem;
		color: #fff;
		background-size: 100% 100%;
		justify-content: center;
		align-items: center;
		line-height:1;
		top:0;
		left: 50%;
		transform: translateX(-50%);
		text-shadow: 0 0 .15rem #54b1ff;
		padding-bottom: .3rem;
	}
	.shake-prize{
		margin-top: 3.25rem;
		width: 16rem;
		height: 12.225rem;
		position: relative;

		.shake-prize-light{
			position: relative;
			width: 16rem;
			height: 12.225rem;
			z-index: 3;
			background:transparent url('../assents/images/liveevent/dengguang.png') no-repeat top center;
			background-size: 100% auto;
		}
		
		.shake-img-warpper{
			width: 7.65rem;
			height: 7.65rem;
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.shake-img{
			box-sizing: border-box;
			width: 7.65rem;
			height: 7.65rem;
			border-radius: .25rem;	
			border:.1rem solid #4aa3ef;	
			/* position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%); */
			z-index: 0;
		}

		img[lazy=loading] {
		    width: 2rem;
			height: 2rem;
			border-radius: 50%;
			border:none;
		  }
		.shake-bottom{
			width: 14.5rem;
			height: 2.285rem;
			background:transparent url('../assents/images/liveevent/dizuo.png') no-repeat top center;
			background-size: 100% 100%;
			margin:-1.8rem auto;
		}
	}

	.shake-tips{
		margin:3.75rem auto 0;
		padding:1.25rem .75rem;

		*{
			font-size: .65rem!important;
			font-weight: normal!important;
			line-height: 1.5!important;
		}
	}	
</style>