import Vue from 'vue';
import myStore from './myStoreIndex';
import cacl from 'cacl';
import lazyload from 'vue-lazyload';
import vueDrapLoad from 'vue-drapload';

 var config = {
    domUp: {                                                            // 上方DOM
      initialCall: function () {
        var me = this
        me.dom.innerHTML = '<div class="dropload-refresh">数据加载中...</div>'
      },
      loadingCall: function () {
        var me = this
        me.dom.innerHTML = '<div class="dropload-load"><span class="loading"></span>拼命加载中...</div>'
      },
      pullingCall: function (_absMoveY) {
        var me = this
        if (_absMoveY <= me.distance) {
          // 下拉过程
          me.initialCall()
        } else if (_absMoveY > me.distance
                && _absMoveY <= me.distance * 2) {
          // 可以释放更新
          me.dom.innerHTML = '<div class="dropload-update">主人,放开我!</div>'
        }
      }
    },
    domDown:{
    	initialCall: function () {
	        var me = this
	        me.dom.innerHTML = '<div class="dropload-load">数据加载中...</div>'
	      },
	    loadingCall: function () {
	        var me = this
	        me.dom.innerHTML = '<div class="dropload-load"><span class="loading"></span>拼命加载中...</div>'
	      },
    	domNoData: function () {
    		console.log('havenodata');
    		var me = this
        	me.dom.innerHTML = '<div class="dropload-load">没有数据了</div>'
    	}
    }
  }
Vue.use(vueDrapLoad, config)

Vue.use(lazyload)
new Vue(myStore);

