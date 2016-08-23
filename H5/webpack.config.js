var webpack = require('webpack');
var HtmlWebPackPlugin = require('html-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	resolve:{
		extensions:['','.js','.vue'],
		root:'./src/assents/js',
		alias:{
			'jquery':'jquery.min.js',
			'swiper':'swiper.min.js',
			'cacl':'caclrem.js',
			'zepto':'zepto.min.js',
			'moment':'moment.js',
			'vue':'vue.min.js'
		}
	},
	entry:{
		/*'festival':'./src/festivalCom/festival',
		'mycenter':'./src/myCenterCom/myCenter.js',
		'mystore':'./src/myCenterCom/myStore.js',
		'mydrap':'./src/myCenterCom/myDrap.js',*/
		'joinUs':'./src/liveEventCom/joinUs.js',
		'openPrize':'./src/liveEventCom/openPrize.js',
		// 'vuer': ["vue"],
	},
	output:{
		path:'build',
		filename:'../../../../javamll/LiveEvent/LiveEvent-wap/src/main/webapp/js/[name].js'
		// filename:'[name].js'
	},
	plugins: [
	    //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vuer", /* filename= */"vuer.common.js"),
	    /*new HtmlWebPackPlugin({
	    	title:'test',
	    	template:'html/myCenter.html',
	    	minify:false,
	    	hash:true
	    })*/
	],
	module:{
		loaders:[
		{test:/\.vue$/,loader:'vue'},
		{test:/\.js$/,loader:'babel',exclude:/node_modules/},
		{test:/\.css$/,loader:'style!css!autoprefixer'},
		{test:/\.less/,loader:'style!css!autoprefixer!less'},
		//{test:/\.(png|gif|jpg)$/,loader:'url?limit=88888&name=dist/[name].[ext]'},
		 {test:/\.(png|gif|jpg)$/,loader:'url?limit=11111=&name=images/dist/[name].[ext]'},
		{test: /\.TTF$/, loader: "file-loader" },
		{test:/\.(html|tpl)/,loader:'html-loader'}
		]
	},
	vue:{
		loaders:{
			css:'style!css!autoprefixer!less'
		}
	},
	babel:{
		presets:['es2015'],
		plugins:['transform-runtime']
	},
	devSever:{
		historyApiFallback:true,
		hot:false,
		inline:true,
		grogress:true
	}
}