<script type="text/javascript">
	module.exports = {
		props:['show','opentype','isopen','prizeurl','prizename','uuid','rewarduuid','openid'],
		data(){
			return {
				shakeNuber:0,
				shake:4000,
				last_update:0,
				count:0,
				x: 0,
				y: 0,
				z: 0,
				last_x: 0,
				last_y: 0,
				last_z: 0,
				diffTime: 0,
				rewTime:'', //开奖时间
				nowTime:'', //系统时间
				tipsShow:true,
			}
		},
		ready(){
			if(this.opentype == '0'){
				this.shaked();
			}
			else if(this.opentype == '1'){
				if(this.isopen == 'Y'){
					this.shaked();
					this.tipsShow = false;
				}
			}
		},
		destroyed(){
			window.removeEventListener("devicemotion",this.deviceMotionHandler,false);
		},
		watch:{
			isopen(){
				if(this.opentype == '0'){
					this.shaked();
				}
				else if(this.opentype == '1'){
					if(this.isopen == 'Y'){
						this.shaked();
						this.tipsShow = false;
					}
				}
			},
			shakeNuber(){
				var vThis = this;
				if(this.shakeNuber == '10'){
					window.removeEventListener("devicemotion",this.deviceMotionHandler,false);  
					//this.$els.music.play();
					document.getElementById('music').play();
					setTimeout(function(){
						$.get('lottery/lotto',{uuid:vThis.uuid,rewardUuid:vThis.rewarduuid,openId:vThis.openid},function(res){
						if(res.flag != 'error'){
							window.location.href="h5/resultView?uuid="+ vThis.uuid +"&rewardUuid="+ vThis.rewarduuid +"&openId=" + vThis.openid +"&ccState="+ res.isReceive ;
							//vThis.closeDia();
						}
						})
					}, 1000);
				}
			}
		},
		methods:{
			closeDia:function(){
				this.$dispatch('closeDia');
			},
			shaked(){
	           if(window.DeviceMotionEvent){  
	                window.addEventListener("devicemotion",this.deviceMotionHandler,false);  
	           }else{  
	             alert("本设备不支持devicemotion事件");  
	           }   
			},
			deviceMotionHandler(eventData){ 
					var acceleration = eventData.accelerationIncludingGravity;  
                    this.currTime=new Date().valueOf(); 
                    this.diffTime=this.currTime-this.last_update;  
                    if(this.diffTime>100){  
                       this.last_update=this.currTime;  
                       this.x=acceleration.x;  
                       this.y=acceleration.y;  
                       this.z=acceleration.z; 
                       var speed= Math.abs((this.x+this.y+this.z-this.last_x-this.last_y-this.last_z)/this.diffTime*10000);  
                       if(speed> this.shake){  
                             this.shakeNuber++;
                       }  
                       this.last_x = this.x;  
                       this.last_y = this.y;  
                       this.last_z = this.z;  
                    }  
			}
		}
	}
</script>
<template>
<div class="dia-mask" transition="dia">
	<div class="dia-container">
		<div class="dia-hand"></div>
		<div class="dia-info">
		<template v-if="opentype == 0 || tipsShow == false">
			<div class="title">
				开奖时间到!
			</div>
			<div class="title-tips">
				您离大奖只差摇摇手机的距离
			</div>
			<div class="title-tips">
				再摇{{10-shakeNuber}}次,即可开奖~
			</div>
		</template>
		<template  v-if="opentype == 1 && tipsShow == true">
			<div class="title">
			</div>
			<div class="title-tips">
				马上揭晓,轰炸现场主持人开大奖吧
			</div>
			<div class="title-tips">
				一起拿起手机摇一摇
			</div>
		</template>	
			<div class="shake-prize">
				<img :src="prizeurl" alt="" class="prize-img">
				<div class="prize-bottom"></div>
			</div>
			<div class="prize-name">
				{{prizename}}
			</div>
		</div>
	</div>
</div>
<audio id='music' v-el:music src="images/dist/music.mp3" preload="auto" ></audio>
</template>
<style lang="less">

.dia-mask {
	position: fixed;
	z-index: 9;
	top: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	background: rgba(0,0,0,.8);
	text-align: center;
	display: flex;
    justify-content: center;
    align-items: center;
	font-family: 'SimSun';
	transition: opacity .3s ease;
}

.dia-close{
	display: inline-block;
	position: absolute;
	top: -.5rem;
	right: -.5rem;
	height: 1.45rem;
	background: url(../assents/images/festival/close.png) center center no-repeat;
	background-size: 100%;
}

.dia-container {
	position:relative;
	color: #000;
	text-align: center;
	width: 14rem;
	height: 22.5rem;
	transition: all .3s ease;
	background: url(../assents/images/liveevent/shak-bg.png) center center no-repeat;
	background-size: 100% 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	transform: translate3d(0,0,0);

	.dia-hand{
		position: absolute;
		top: 1.4rem;
		left: 50%;
		width: 12.1rem;
		height: 16.3rem;
		background: url(../assents/images/liveevent/shake-bag.gif) center center no-repeat;
		background-size: 100% 100%;
		transform: translate3d(-50%,0,0);
	}

	.dia-info{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.title{
		margin:2.1rem auto 0;
		font-size: 1.2rem;
		height: 1.2rem;
		color: #ffd74a;
	}
	.title-tips{
		margin:.65rem auto 0;
		font-size: .65rem;
		color: #fff;
	}

	.shake-prize{
		margin:7.5rem auto 0;

		img{
			width:6.1rem;
			height: 6.1rem;
			box-sizing: border-box;
			border:.1rem solid #4aa3ef;
			border-radius: .25rem;
			transform: translate3d(0,0,0);
		}

		.prize-bottom{
			width: 11.25rem;
			height: 2.2rem;
			background:transparent url('../assents/images/liveevent/shake-bottom.png') center center no-repeat;
			background-size: 100% 100%;
			margin:-1.7rem auto 0;
		}
	}
	.prize-name{
		margin:.5rem auto 0;
		font-size: .65rem;
		color: #fff;
	}
}


.dia-enter, .dia-leave {
    opacity: 0;
}

.dia-enter .dia-container,
.dia-leave .dia-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
} 
</style>