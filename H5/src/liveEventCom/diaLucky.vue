<script type="text/javascript">
	module.exports = {
		props:['uuid'],
		methods:{
			closeDia:function(){
				this.$dispatch('closeDia');
			},
			getTelDia(){
				var _ = this;
				if(_.telVali == false && _.ifFirst == false){
					$.get('msg/checkMsg',{uuid:_.uuid,openId:openId,phoneNo:_.tel,code:_.yan},function(res){
						if(res.flag == 'success'){
							_.$dispatch('changeLucky');
						}else{
							_.codeVali = true
						}
					})
				}
			},
			sendMsg(){
				var _ = this;
				console.log('tel'+_.telVali)
				console.log('anniu'+_.btnC)
				if(_.btnC == true && _.telVali == false){
					_.btnC = false;
					_.cutDate = 60;
					setTimeout(function(){
						$('.send_phone').css('background','#999');
					},0)
					var cutDte = setInterval(function(){
						_.cutDate-= 1;
						if(_.cutDate == 0){
							clearInterval(cutDte)
							$('.send_phone').css('background','#008aff');
							_.btnC = true;
						}
					},1000)
					if(_.ifFirst == true){
						_.ifFirst = false;
						cutDte;
						_.btnC = false;
					}
					$.get('msg/sendMsg',{openId:openId,phoneNo:_.tel},function(res){
						console.log(res);
						_.code = res.code;
					})
				}
			}
		},
		data(){
			return {
				tel:'',
				yan:'',
				telVali:true,
				codeVali:false,
				cutDate:60,
				ifFirst:true,
				code:'',
				btnC:true,
			}
		},
		watch:{
			tel(val,oldVal){
				if(!(/^1[3|4|5|7|8]\d{9}$/.test(val))){
					this.telVali = true;
					$('.send_phone').css('top','2.65rem')
				}else{
					this.telVali = false;
					$('.send_phone').css('top','2rem')
				}
			}
		},
		ready(){
			$('.send_phone').css('top','2.65rem')
		}
	}
</script>
<template>
<div  class="dia-mask" transition="dia">
	<div  class="dia-container">
		 <!-- <a href="javascript:;" class="dia-close" @click='closeDia()'></a> -->
		 <div class="dia-title">提示</div>
		 <div class="dia-tips">你将成为我们的幸运天使！</div>
		 <div class="dia-phone">
		 	<i class="phone-header">手机号码:</i>
		 	<input v-model='tel' maxlength="11" type="text" placeholder="请输入手机号码" onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'')">
		 	<em v-show='telVali'>请输入正确的电话号码</em>
		 	<input v-model='yan' maxlength="6" type="text" placeholder="请输入验证码" onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'')">
		 	<slot v-if='ifFirst == true'>
		 		<a class="send_phone" v-gesture:tap.stop.prevent='sendMsg' href="javascript:;">获取验证码</a>
		 	</slot>
		 	<slot v-else>
		 		<a class="send_phone send2" v-gesture:tap.stop.prevent='sendMsg' href="javascript:;">重新发送 ({{cutDate}})</a>
		 	</slot>
		 	<em v-show='codeVali'>验证码错误</em>
		 </div>
		 <div class="dia-footer">
			 <div class="dia-btn" v-gesture:tap.stop.prevent="getTelDia">确认</div>
			 <div class="dia-btn" v-gesture:tap.stop.prevent="closeDia">取消</div>		 	
		 </div>

	</div>
</div>
</template>
<style lang="less" scoped>
::-webkit-input-placeholder {
	color:#666;
}
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
	background-image: url('../assents/images/liveevent/diaBack.png')!important;
	color: #000;
	text-align: center;
	display:inline-block;
	width: 14rem;
	height: 10rem;
	border-radius: .25rem;
 	background-color:rgba(5,25,57,.8);
	box-shadow: 0 0 .9rem rgba(21,164,255,.8) inset;	
	border:.1rem solid #4aa3ef;	
	transition: all .3s ease; 
	-webkit-transition: all .3s ease;
	-moz-transition: all .3s ease;
	box-shadow: 0 0 0.9rem rgba(21, 164, 255, 0.8) inset;
	background-image:none;
	background-color: rgba(5, 25, 57, 0.8);
	.dia-phone{
		position:relative;
		em{
			display: block;
			font-size: 0.6rem;
			line-height: 1;
			position: relative;
			font-style: normal;
			text-align: left;
			padding-left: 2rem;
			top: -0.25rem;
			color: #f07063;
		}
		.phone-header{
			position: absolute;
			font-size: 0.65rem;
			color: #fff;
			font-style: normal;
			height: 1.5rem;
			line-height: 1.5rem;
			left:2.15rem;
		}
		.send_phone{
			position:absolute;
			color:#fff;
			font-size: 0.65rem;
			line-height: 1.5rem;
			display:inline-block;
			width: 5.5rem;
			height: 1.5rem;
			border-radius: 0.9rem;
			background:#008aff;
			right: 1.4rem;
    		top: 2rem;
		}
		input{
			width:11.25rem;
			height: 1.5rem;
			margin-bottom:0.5rem;
			border-radius: 0.75rem;
			outline: none;
			font-size: 0.65rem;
			/*line-height: 1.5rem;*/
			padding-left:3.7rem;
			box-sizing: border-box;
		    background-color: rgba(5, 29, 64, 0.80);
		    color:#22d0fb;
			border:1px solid #11587f;
		}
		input:nth-of-type(2){
			padding-left: 0.75rem;
		}
	}
	.dia-title{
		display: flex;
		position: absolute;
		z-index: 4;
		width: 5.25rem;
		height: 1.35rem;
		font-size: .75rem;
		color: #fff;
		background:transparent url('../assents/images/liveevent/dia_title.png') no-repeat top center;
		background-size: 100% 100%;
		justify-content: center;
		align-items: center;
		line-height:1;
		top: -.675rem;
		left: 50%;
		margin-left: -2.625rem; 
		text-shadow: 0 0 .15rem #54b1ff;
		padding-bottom: .2rem;
	}

	.dia-tips{
		padding: 1.25rem 0.75rem 0.75rem;
		color: #ccc;
		text-align: center;
		line-height: 1.2;
		font-size: .65rem;
	}
	.dia-footer{
	    display: flex;
		padding: 0 1rem;
		margin-top: 0.25rem;
	}
	.dia-btn{
		width: 5.125rem;
		height: 2.05rem;
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 1;
		background:transparent url('../assents/images/liveevent/dia_btn.png') no-repeat top center;
		background-size: 100% 100%;
		margin:0 auto;
		font-size: .6rem;
		color: #1e4084;
		padding-bottom: .3rem;
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