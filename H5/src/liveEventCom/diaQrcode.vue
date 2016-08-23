<script type="text/javascript">
	module.exports = {
		props:['qrcode'],
		methods:{
			closeDia:function(){
				this.$dispatch('closeDia');
			}
		}
	}
</script>
<template>
<div  class="dia-mask" transition="dia" v-gesture:tap.stop.prevent="closeDia">
	<div  class="dia-containe">
		 <!-- <a href="javascript:;" class="dia-close" @click='closeDia()'></a> -->
		 <div class="dia-title">关注公众号</div>
		 <img :src="qrcode">
	</div>
</div>
</template>
<style lang="less" >

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

.dia-containe {
	position:relative;
	color: #000;
	text-align: center;
	border-radius: .25rem;
 	background-color:rgba(5,25,57,.8);
	box-shadow: 0 0 .9rem rgba(21,164,255,.8) inset;	
	border:.1rem solid #4aa3ef;	
	transition: all .3s ease;
	padding: 1.25rem;

	img{
		width: 8.5rem;
		height: 8.5rem;
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