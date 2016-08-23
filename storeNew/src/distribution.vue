<template>
  <div class='filter'>
    <h2 class="filter_title">2.分配客户</h2>
    <div class="filter_content">
      <div class="search-group">
      	<h2>共筛选出<span class='userCount'>{{hascount}}</span>位客户</h2>
        <label>分配</label>
        <input v-model='total' class='wd90' type='text' onkeyup='this.value=this.value.replace(/\D/gi,"")' onblur="this.value=this.value.replace(/[^\d]/g,'')">
        <label>位至</label>
        <input @keydown='changeSto()' @blur='blur()' @focus='searchStroe()' v-model='storeName' type='text' placeholder="请输入门店名称">
        <div v-show='search_show' class="store_info">
          <ul>
            <li v-for='item in storeInfo' @click='checkStoreName(item)'>{{item.storeName}}</li>
            <li v-show='addM' class="addmore" @click='addMore()'>点击加载更多 >></li>
          </ul>
        </div>
        <em class='error left37'>{{warmtext}}</em>
        <em class='error left120'>{{warmstoretext}}</em>
      </div>
      <div class="for_right search-group">
				<input type="button" @click='dialog()' class="btn-default" value='分配'>
      </div>
    </div>
    <modal :words='diaWords' :show.sync='modalshow'></modal>
  </div>
</template>
<script>
import modal from './modal.vue'

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      userCount: '',
      search_show: false ,
      addM:false,
      storeName:'',
      storeSize:'20',
      initPage:0,
      storePage:0,
      storeInfo:[],
      modalshow:false,
      total:'',
      storeUuid:'',
      warmtext:'',
      warmstoretext:'',
      diaWords:'分配成功'
    }
  },
  components:{modal},
  props :['hascount','cd','proviid','cityid','usercount','starttime','endtime','foreign'],
  watch :{
    storeName (val, oldVal) {
      this.storePage = 0

      this.getStore();
    }
  },
  methods : {
    changeSto(){
      this.storeUuid = '';
    },
    checkStoreName (obj) {
      this.storeName = obj.storeName;
      this.storeUuid = obj.sysUuid;
    },
    searchStroe () {
      this.search_show = true;
      this.getStore ()
    },
    addMore (){
      var _ = this;
      setTimeout(function(){
        _.search_show = true;
      },151)
      _.storePage = parseInt(_.storePage)+1;
      $.post('set/findStoreBasic',{storeName:_.storeName,currentPage:_.storePage,size:_.storeSize},function(res){
        if(res.content.length<20){
          _.addM = false;
        }else{
          _.addM = true;
        }
        for(var i=0;i<res.content.length;i++){
          _.storeInfo.push(res.content[i])
        }
      })
    },
    blur (){
      var _ =this;
      setTimeout(function(){
        _.search_show = false;
      },150)
    },
    getStore (){
      var _ =this;
      $.post('set/findStoreBasic',{storeName:_.storeName,currentPage:_.initPage,size:_.storeSize},function(res){
        if(res.content.length<20){
          _.addM = false;
        }else{
          _.addM = true;
        }
        _.storeInfo = res.content;
      })
    },
    dialog () {
      var _ = this;
      if(parseInt(_.total)>parseInt(_.hascount)){
        _.warmtext = '分配数大于筛选数'
      }else if (_.total == '' || parseInt(_.total)== 0 ){
        _.warmtext = '请填写分配数量'
      }else{
        _.warmtext=''
      }
      if (_.storeName == '' ){
        _.warmstoretext = '请选择分配门店'
      }else if(_.storeUuid == ''){
        _.warmstoretext = '请选择正确的门店'
      }else{
        _.warmstoretext = ''
      }
      if(_.storeName != '' && _.total != '' && parseInt(_.total)<=parseInt(_.hascount) && _.storeUuid != '' && parseInt(_.total)!= 0){
        $.post('allot/save',{day:_.cd,storeUuid:_.storeUuid,total:_.total,provinceId:_.proviid,cityId:_.cityid,foreign:_.foreign,startDate:_.startTime,endDate:_.endTime},function(res){
          if(res.success == true){
            _.hascount = parseInt(_.hascount)-parseInt(_.total);
            _.usercount = parseInt(_.usercount)-parseInt(_.total);
            _.diaWords = '分配成功';
            _.storeName = '';
            _.storeUuid = '';
            _.total = '';
            _.modalshow = true;
          }else{
            _.diaWords = '该门店还没有店长，暂时无法分配粉丝。由于只有店长才能在app中将粉丝分配给店员，所以请先给门店添加店长再分配粉丝';
            _.storeName = '';
            _.storeUuid = '';
            _.total = '';
            _.modalshow = true;
          }
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@basecolor:#63a8eb;
@basebac:#ddd;
.filter{
  width:408px;
  margin-top:50px;
  .filter_title{
    background:#f5f5f5;
    height:30px;
    line-height:30px;
    text-align:center;
  }
  .filter_content{
    position:relative;
    box-sizing:border-box;
    padding:30px 20px;
    border:1px solid @basebac;
    .for_right{
    	text-align:right;
    	.btn-default{
    		margin-right:0;
    	}
    }
    .search-group{
      margin-right:0;
      display:block;
      position:relative;
      label:first-of-type{
        margin-right:10px;
      }
      .store_info{
        font-size:14px;
        position: absolute;
        height: auto;
        border: 1px solid #ddd;
        z-index: 2000;
        max-height: 150px;
        overflow: auto;
        width:174px;
        left:176px;
        z-index:9999;
        background:#fff;
        li{
          width: 100%;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          border:1px solid transparent;
          -webkit-box-sizing: border-box;
          padding: 0 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          cursor:pointer;
        }
        li:hover{
          border:1px @basecolor solid;
          color:@basecolor;
        }
      }
      .userCount{
        color:@basecolor;
        font-weight:bold;
      }
      .wd90{
      	width:90px;
      	margin-right:10px;
      	margin-left:0px;
      }
      .error{
        font-style: normal;
        color:#f94a05;
        position: absolute;
        left:38px;
        bottom:-20px;
        font-size: 14px;
      }
      .left120{
        left:177px;
      }
      .left37{
        left:37px;
      }
    }
    .search-group:last-of-type{
      margin-bottom:0
    }
  }
  .filter_content:after{
    content: '';
    position:absolute;
    top:-20px;
    left:50%;
    z-index:0;
    margin-left:-10px;
    width:0;
    height:0px;
    border-left:10px solid transparent;
    border-right:10px solid transparent;
    border-top:10px solid transparent;
    border-bottom:10px solid @basebac;
  }
  .filter_content:before{
    content: '';
    position:absolute;
    top:-18.5px;
    left:50%;
    z-index:1;
    margin-left:-10px;
    width:0;
    height:0px;
    border-left:10px solid transparent;
    border-right:10px solid transparent;
    border-top:10px solid transparent;
    border-bottom:10px solid #fff;
  }
}

</style>
