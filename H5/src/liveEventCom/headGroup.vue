<script>
	module.exports = {
		props:['headgroup','rewurl']
	}
</script>

<template>
	<div v-for="item in headgroup" v-bind:style="{backgroundImage:item.img}" class="head-img" :style="{left:item.x +'rem',top:item.y +'rem'}">
	</div>
	<img :src="rewurl" alt="" class="prize-img">
</template>

