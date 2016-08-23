<script>
	export default  {
		methods:{
			closeDia(){
				this.$dispatch('closeDia');
			}
		}
	}
</script>
<template>
	<div class="share-container" v-gesture:tap.stop.prevent='closeDia' transition="share">
   		<img src="../assents/images/liveevent/fenxiangzhiyin.png">
	</div>
</template>

<style lang="less">

.share-container {
	z-index: 99;
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	background: rgba(0,0,0,.8);
	transition:opacity .3s ease;
	-webkit-transition: opacity .3s ease;
	-moz-transition: opacity .3s ease;

	img{
		width: 13.75rem;
		float: right;
		margin-right: 1.125rem;
		margin-top: 1rem;
	}
}

.share-enter, .share-leave {
    opacity: 0;
}

</style>