<template>
	<div id="mapContent" :class='mapsource.selectCity'></div>
</template>
<script>
	// 引入 ECharts 主模块
	var echarts = require('echarts/lib/echarts');
	// 引入地图
	require('echarts/lib/chart/map');
	// require('echarts/map/js/china.js');
	require('echarts/map/js/province/xianggang.js');
	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');
	require('echarts/lib/component/visualMap');
	require('echarts/lib/component/toolbox');


	export default {
	  data () {
	    return {
	      // note: changing this line won't causes changes
	      // with hot-reload because the reloaded component
	      // preserves its current state and we are modifying
	      // its initial state.
	      userCount: '21042',
	      HKdata:[
	            {name: '中西区', value: 20057.34},
	            {name: '湾仔', value: 15477.48},
	            {name: '东区', value: 31686.1},
	            {name: '南区', value: 6992.6},
	            {name: '油尖旺', value: 44045.49},
	            {name: '深水埗', value: 40689.64},
	            {name: '九龙城', value: 37659.78},
	            {name: '黄大仙', value: 45180.97},
	            {name: '观塘', value: 55204.26},
	            {name: '葵青', value: 21900.9},
	            {name: '荃湾', value: 4918.26},
	            {name: '屯门', value: 5881.84},
	            {name: '元朗', value: 4178.01},
	            {name: '北区', value: 2227.92},
	            {name: '大埔', value: 2180.98},
	            {name: '沙田', value: 9172.94},
	            {name: '西贡', value: 3368},
	            {name: '离岛', value: 806.98}
	        ],
	      option: {
			    tooltip: {
			        trigger: 'item',
			        formatter:function(params,ticket,callback){
		              var res;
		              if(isNaN(params.value) == true){
		                  res = '暂无门店'
		              }else{
		                  res = params.name + ' ' + params.value + ' 家';
		              }
		              for (var i = 0, l = params.length; i < l; i++) {
		                  res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
		              }
		              setTimeout(function (){
		                  callback(ticket, res);
		              }, 0);
		              return 'loading';
		          }
			    },
			    visualMap: {
			        min: 0,
			        max: 2500,
			        left: 'left',
			        top: 'bottom',
			        text: ['高','低'],           // 文本，默认为数值文本
			        calculable: true,
			        color: ['#036fdc','#67b1ed','#dcfbfd']
			    },
			    toolbox: {
			        show: true,
			        orient: 'vertical',
			        left: 'right',
			        top: 'center',
			        feature: {
			            dataView: {readOnly: false},
			            restore: {},
			            saveAsImage: {}
			        }
			    },
			    series: [
		          {
		              name: '门店数量',
		              type: 'map',
		              mapType: 'xianggang',
		              roam: false,
		              selectedMode:'single',
		              itemStyle: {
		                  normal: {
		                      label: {
		                          show: true, textStyle: {
		                              color: '#666',
		                              fontSize: 12
		                          }
		                      }, borderColor: '#fff', borderWidth: 2
		                  },
		                  emphasis: {
		                      label: {
		                          show: true,
		                          textStyle: {
		                              color: '#666',
		                              fontSize: 12
		                          }
		                      },
		                      color: '#63a8eb', borderColor: '#fff', borderWidth: 2,
		                  }
		              },
		              data:[
		                {name: '北京',value: this.randomData() },
		                {name: '天津',value: this.randomData() },
		                {name: '上海',value: this.randomData() },
		                {name: '重庆',value: this.randomData() },
		                {name: '河北',value: this.randomData() },
		                {name: '河南',value: this.randomData() },
		                {name: '云南',value: this.randomData() },
		                {name: '辽宁',value: this.randomData() },
		                {name: '黑龙江',value: this.randomData() },
		                {name: '湖南',value: this.randomData() },
		                {name: '安徽',value: this.randomData() },
		                {name: '山东',value: this.randomData() },
		                {name: '新疆',value: this.randomData() },
		                {name: '江苏',value: this.randomData() },
		                {name: '浙江',value: this.randomData() },
		                {name: '江西',value: this.randomData() },
		                {name: '湖北',value: this.randomData() },
		                {name: '广西',value: this.randomData() },
		                {name: '甘肃',value: this.randomData() },
		                {name: '山西',value: this.randomData() },
		                {name: '内蒙古',value: this.randomData() },
		                {name: '陕西',value: this.randomData() },
		                {name: '吉林',value: this.randomData() },
		                {name: '福建',value: this.randomData() },
		                {name: '贵州',value: this.randomData() },
		                {name: '广东',value: this.randomData() },
		                {name: '青海',value: this.randomData() },
		                {name: '西藏',value: this.randomData() },
		                {name: '四川',value: this.randomData() },
		                {name: '宁夏',value: this.randomData() },
		                {name: '海南',value: this.randomData() },
		                {name: '台湾',value: this.randomData() },
		                {name: '香港',value: this.randomData() },
		                {name: '澳门',value: this.randomData() }
		            ]
		          }
		      ],
		  },
		  seCity:''
	  	}
	  },
	  props : {
	  	mapsource:Array,
	  	sele:String,
	  },
	  ready (){
	  	let _ = this;
	  	// _.todo()
	  	_.makeMap('xianggang')
	  },
	  watch:{
	  	sele (val) {
	  		this.makeMap(val);
	  	}
	  },
	  methods:{
	  	todo (){
	  		// 基于准备好的dom，初始化echarts实例
			const myChart = echarts.init(document.getElementById('mapContent'));
			// 绘制图表
			myChart.setOption(this.option);
			myChart.on('click',function(params){
				console.log(params)
			})
	  	},
	  	makeMap (val) {
	  		const _ = this;
	  		let mapUrl = 'map/json/'+val+'.json'
	  		let mapName = val+'Json';
	  		console.log(mapUrl)
  			// echarts.registerMap(val, mapName);
	  		const myChart = echarts.init(document.getElementById('mapContent'));
	  		_.option.series.data = _.HKdata;
	  		console.log(_.option.series)
  			myChart.setOption(this.option);
	  	},
	  	map_click (params){
	  		console.log(params)
	  	},
	  	randomData (){
	  		return Math.round(Math.random()*1000);
	  	}
	  }
	}
	
</script>

<style lang='scss' scoped>
	#mapContent{
		width:500px;
		height:400px;
		margin:auto;
	}
</style>