//import Vue from 'vue';
import joinUs from './joinUs.vue';
import cacl from 'cacl';
import vueTap from 'vue-gesture';
import lazyLoad from 'vue-lazyload'

Vue.use(vueTap)
Vue.use(lazyLoad,{
	loading: 'images/loading.gif',
	try:3
})

new Vue(joinUs);