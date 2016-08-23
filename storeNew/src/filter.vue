<template>
  <div class='filter'>
    <h2 class="filter_title">1.筛选客户</h2>
    <div class="filter_content">
      <div class="search-group">
        <label>所在区域</label>
        <slot v-if='sele == "back"||sele == "china"'>
           <select class="selec" v-model='sele'>
               <option :value='shengfen'>省</option>
               <option v-for='item in citydata' :id='item.id' :value='item.pinYin'>{{item.name}}</option>
           </select>
        </slot>
        <slot v-else>
           <select class="selec" v-model='sele'>
               <option value='china'>省</option>
               <option v-for='item in citydata' :id='item.id' :value='item.pinYin'>{{item.name}}</option>
           </select>
        </slot>

        <select class="selec" v-model='areas'>
          <option value='10'>市</option>
          <option v-for='item in area' :value='item.id' @click='getCityId(item.id)'>{{item.name}}</option>
        </select>
      </div>
      <div class="check_china">
        <span @click='check_ct' class="check_point"></span>
        <span>国外及未知区域页面</span>
      </div>
      <div class="search-group">
        <label>激活时间</label>
        <select v-model='selec.time'>
          <option v-for='item in selec.options' :value='item.value'>{{item.text}}</option>
        </select>
      </div>
      <div class="search-group">
        <label>关注时间</label>
        <input id="cardStartDate" v-model='starttime' class="wd110" type="text">
        <span class="fov">至</span>
        <input id="cardEndDate" v-model='endtime' class="wd110" type="text">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selec:{
        time:'',
        options:[
          { text: '全部', value: '' },
          { text: '48小时内', value: 2 },
          { text: '最近7天', value: 7 },
          { text: '最近30天', value: 30 },
          { text: '超出30天', value: 31 },
        ]
      }
    }
  },
  props:['activemodal','citydata','sele','mapp','cd','area','areas','starttime','endtime','shengfen','foreign'],
  watch:{
    selec:{
      handler(val,oldVal){
        this.cd = val.time;
      },
      deep:true
    },
    sele(val,oldVal){
      this.shengfen = val;
    }
  },
  methods: {
    getCityId(val){
      this.cityId = val;
    },
    check_ct(){
      $('.check_point').toggleClass('checked');
      $('.selec').toggleClass('disable');
      if($('.check_point').hasClass('checked')){
         this.activemodal = '';
        //  this.sele = 'back';
        this.foreign='2';
         this.$dispatch('getChina')
        //  this.shengfen = 'back';
         $('.selec').attr('disabled','disabled');
      }else{
         this.activemodal = 'Map';
         this.sele = 'china';
         this.shengfen = 'china';
         this.foreign='';
         this.$dispatch('getChina');
         $('.selec').removeAttr('disabled');
         this.foreign = '';
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
    .check_china{
      margin-left:76px;
      position:relative;
      top:-13px;
      span{
        font-size:14px;
        vertical-align:middle;
      }
      .check_point{
        display:inline-block;
         cursor:pointer;
        width:16px;
        height:16px;
        background: url(../static/img/check.png) no-repeat;
        background-position:0 -16px;
      }
      .checked{
        background-position:0 0!important;
      }
    }
    .search-group{
      margin-right:0;
      display:block;
      label{
        margin-right:10px;
      }
      .disable{
         background-color:#eee;
      }
      select{
        width:110px;
      }
      .fov{
        font-size:14px;
        margin-left:10px;
      }
      .wd110{
        width: 110px;
      }
      input[type='button']{
        width:90px;
        height:34px;
        box-sizing:border-box;
        text-align:center;
        background:transparent;
        margin-left:10px;
      }
      input[type='button']:hover{
        border:1px solid @basecolor;
        color:@basecolor;
      }
      .check{
        border:1px solid @basecolor;
        color:@basecolor;
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
