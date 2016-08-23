//import Vue from 'vue'
import openPrize from './openPrize.vue'
import cacl from 'cacl'
import vueTap from 'vue-gesture'
import lazyLoad from 'vue-lazyload'
Vue.use(lazyLoad,{
	loading: 'images/loading.gif',
	try:3
})

Vue.use(vueTap)
new Vue(openPrize);
