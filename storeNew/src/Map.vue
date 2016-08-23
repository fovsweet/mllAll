<template>
	<div id="mapContent" :class='mapsource.selectCity'></div>
</template>
<script>
	// 引入 ECharts 主模块
	var echarts = require('echarts/lib/echarts');
	// 引入地图
	require('echarts/lib/chart/map');
	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');
	require('echarts/lib/component/visualMap');
	require('echarts/lib/component/toolbox');


	export default {
	  data () {
	    return {
	      userCount: '21042',
        chinaData:[],
	      option: {
			    tooltip: {
			        trigger: 'item',
			        formatter:function(params,ticket,callback){
		              var res;
		              if(isNaN(params.value) == true){
		                  res = '暂无客户'
		              }else{
		                  res = params.name + ' ' + params.value + ' 个客户';
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
			        max: 5,
			        left: 'left',
			        top: 'bottom',
			        text: ['高','低'],           // 文本，默认为数值文本
			        calculable: true,
			        color: ['#036fdc','#67b1ed','#dcfbfd']
			    },
			    series: [
		          {
		              name: '客户数量',
		              type: 'map',
		              mapType: 'china',
		              roam: false,
		              selectedMode:'single',
		              itemStyle: {
		                  normal: {
		                      label: {
		                          show: false, textStyle: {
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
		              data:[],
		              nameMap : {
		                '中西區': '中西区',
		                '東區': '东区',
		                '離島區': '离岛',
		                '九龍城區': '九龙城',
		                '葵青區': '葵青',
		                '觀塘區': '观塘',
		                '北區': '北区',
		                '西貢區': '西贡',
		                '沙田區': '沙田',
		                '深水埗區': '深水埗',
		                '南區': '南区',
		                '大埔區': '大埔',
		                '荃灣區': '荃湾',
		                '屯門區': '屯门',
		                '灣仔區': '湾仔',
		                '黃大仙區': '黄大仙',
		                '油尖旺區': '油尖旺',
		                '元朗區': '元朗'
		            },
		          }
		      ],
		  },
		  seCity:''
	  	}
	  },
	  props:['mapsource','sele','mapd','maxdate','cityid'],
	  ready (){
	  	let _ = this;
	  	_.todo();
	  },
	  watch:{
	  	sele (val) {
	  		this.makeMap(val);
	  	},
	  	mapd (val) {
	  		if(this.sele == 'china' ){
	  			this.chinaData = val;

	  		}else{
				this.HKdata = val;

	  		}
	  		this.makeMap(this.sele);
	  	}
	  },
	  methods:{
	  	todo (){
	  		this.makeMap('china');
	  	},
	  	makeMap (val) {
	  		var _ = this;
  			var myChart = echarts.init(document.getElementById('mapContent'));
	  		myChart.showLoading();

	  		if(val == 'china'){
	  			myChart.on('click',_.map_click);
		  		// let mapUrl = '../build/map/json/'+val+'.json'
		  		let mapUrl = 'views/js/map/json/'+val+'.json'
		  		$.get(mapUrl,function(res){
			  		myChart.hideLoading();
			  		_.option.series[0].data = _.chinaData;
			  		_.option.series[0].mapType = val;
			  		if(parseInt(_.maxdate) == 0){
			  			_.option.visualMap.max = 5
			  		}else{
			  			_.option.visualMap.max = parseInt(_.maxdate);
			  		}
		  			echarts.registerMap(val, res);
		  			myChart.setOption(_.option);
		  		})
	  		}else{
	  			myChart.on('click',_.area_click);
		  		// let mapUrl = '../build/map/json/province/'+val+'.json'
		  		let mapUrl = 'views/js/map/json/province/'+val+'.json'
		  		$.get(mapUrl,function(res){
			  		myChart.hideLoading();
		  			_.option.series[0].data = _.HKdata;
			  		_.option.series[0].mapType = val;
			  		if(parseInt(_.maxdate) == 0){
			  			_.option.visualMap.max = 5
			  		}else{
			  			_.option.visualMap.max = parseInt(_.maxdate);
			  		}
		  			echarts.registerMap(val, res);
			  		myChart.setOption(_.option);
		  		})
	  		}
	  	},
	  	map_click (params){
	  		this.makeMap(params.data.pinYin);
	  		this.sele = params.data.pinYin
	  	},
	  	area_click(params){
				console.log(params)
	  		this.cityid = params.data.id
	  	},
	  	randomData (){
	  		return Math.round(Math.random()*1000);
	  	}
	  }
	}

</script>

<style lang='less' scoped>
	#mapContent{
		width:700px;
		height:500px;
		margin:auto;
	}
</style>
