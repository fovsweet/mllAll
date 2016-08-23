<script>
	module.exports = {
		props:['luckimg','luckopen','timetext'],
		data(){
			return {
				luckycounter:true
			}
		},
		methods:{
			toggleLuckyCounter(){
				this.luckycounter = !this.luckycounter;
			}
		}
	}
</script>

<template>
<div v-if="luckopen == '1'">
	<div class="lucky-counter" v-gesture:tap.stop.prevent="toggleLuckyCounter" v-show="luckycounter">
		<span class="lucky-counter-name">幸运大奖</span>
	</div> 
	<div class="lucky-wrapper" v-gesture:tap.stop.prevent="toggleLuckyCounter" v-show="!luckycounter">
		<img :src="luckimg" alt="" class="luck-wrapper-img">
		<div class="lucky-time">
			{{timetext}}
		</div>
		<div class="lucky-tips">
			幸运大奖倒计时
		</div>
	</div>
</div>
</template>

