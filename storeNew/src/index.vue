<template>
  <div class="container">
    <h2 class='page_header'>门店客户</h2>
    <div class='tab'>
      <a href="fans/fans?menuKey=st:fans">门店客户</a>
      <a href="allot/index?menuKey=st:fans" class='active'>分配客户</a>
    </div>
    <div class='store_content'>
      <table>
        <tr>
          <td class="wd410"><h2>待分配客户总数：<span class='userCount'>{{userCount}}</span> 位</h2></td>
          <td style="width:700px">
            <h2 style="display:inline-block">客户分配区域</h2>
            <span v-show='returnShow' @click='return_china' class="return_china">全国地图</span>
          </td>
        </tr>
        <tr>
          <td class="wd410">
            <filter
              :activemodal.sync='activemodal'
              :shengfen.sync = 'shengfen'
              :cd.sync='checkDay'
              :sele.sync='selectCity'
              :citydata.sync='cityVal'
              :area.sync='areas'
              :areas.sync='areasSele'
              :starttime.sync='startTime'
              :endtime.sync='endTime'
              :foreign.sync='foreign'>
            </filter>
            <distribution
              :cd.sync='checkDay'
              :hascount.sync='canAssignTotal'
              :cityid.sync='areasSele'
              :proviid.sync='proId'
              :usercount.sync='userCount'
              :starttime.sync='startTime'
              :endtime.sync='endTime'
              :foreign.sync='foreign'>
            </distribution>
          </td>
          <td>
            <component
              :is='activemodal'
              :shengfen.sync='shengfen'
              :mapp.sync='mapPlace'
              :sele.sync='selectCity'
              :cityid.sync='areasSele'
              :maxdate.sync = 'max'
              :mapsource.sync='cityVal'
              :mapd.sync='mapData'>
            </component>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import filter from './filter.vue'
import distribution from './distribution.vue'
import Map from './Map.vue'

export default {
  el: '#app',
  data () {
    return {
      activemodal:'Map',   //modal显隐
      shengfen:'china',   //省份选择
      userCount: '',
      cityVal:[],
      selectCity:'china',   //选择城市的拼音
      canAssignTotal:'',  //可分配客户
      mapData:[],
      max:'',   //地图最大值参数
      areas:[],
      areasSele:'10',   //市id
      checkDay:'',   //可选择时间
      proId:'10',   //省id
      mapPlace:'china',
      startTime:'',   //开始时间
      endTime:'',    //结束时间
      foreign:'',   //是否是国外地区
      returnShow:false  //全国地图显示按钮
    }
  },
  ready () {
    var _ = this;
    _.todo();
    _.init();
  },
  watch: {
    checkDay (val) {
      if(this.selectCity == 'china'){
        this.todo ();
      }else{
        this.resizeData(this.selectCity);
      }
    },
    selectCity(val){
      if(val == 'china'){
        this.areasSele = '10';
        this.areas = [];
        this.todo();
        this.proId = '10';
        this.returnShow = false;
      }else if(val == 'back'){
        this.areasSele = '10';
        this.areas = [];
        this.todo();
        this.proId = '10';
        this.returnShow = false;
      }else{
        this.areasSele = '10';
        this.resizeData(val);
        this.proId = this.getCyId(1,val);
        this.returnShow = true;
      }
    },
    areasSele(val){
      this.resizeData(this.selectCity);
    },
    startTime(val){
      if(this.selectCity == 'china'){
        this.todo()
      }else{
        this.resizeData(this.selectCity)
      }
    },
    endTime(val){
      if(this.selectCity == 'china'){
        this.todo()
      }else{
        this.resizeData(this.selectCity)
      }
    },
    foreign(val){
      this.resizeData(this.selectCity)
    }
  },
  methods:{
    todo () {
      var _ = this;
      if(_.foreign == ''){
        $.post('allot/provinces',{day:_.checkDay,foreign:_.foreign,startDate:_.startTime,endDate:_.endTime},function(res){
            _.max = res.max;
            _.userCount = res.allocateTotal;
            _.mapData = res.data;
            _.cityVal = res.provinces;
            _.canAssignTotal = res.canAssignTotal;
        })
      }
    },
    resizeData (val){
      var _ = this;
      var o ;
      if(_.areasSele == 10){
        o = {day:_.checkDay,provinceId:_.getCyId(1,val),cityId:'',foreign:_.foreign,startDate:_.startTime,endDate:_.endTime}
      }else{
        o = {day:_.checkDay,provinceId:_.getCyId(1,val),cityId:_.areasSele,foreign:_.foreign,startDate:_.startTime,endDate:_.endTime}
      }
      if(_.selectCity != 'china'){
        $.post('allot/areas',o,function(res){
            if(_.foreign == '2'){
              _.mapData = [];
              _.canAssignTotal = res.canAssignTotal;
            }else{
              _.max = res.max;
              _.mapData = res.data;
              _.canAssignTotal = res.canAssignTotal;
              _.userCount = res.allocateTotal;
              _.areas = res.areas;
            }
        })
      }
    },
    getCyId (type,val){
      //type:1-省；2-市
      var _ = this;
      if(type == 1){
        for(var i=0;i<_.cityVal.length;i++){
          if(val == _.cityVal[i].pinYin){
            return _.cityVal[i].id;
            break;
          }
        }
      }else{
        for(var i=0;i<_.areas.length;i++){
          if(val == _.areas[i].pinYin){
            return _.areas[i].id;
            break;
          }
        }
      }
    },
    init(){
        var _ =this;
        var cardStay = {
          start:$('#cardStartDate'),
          end:$('#cardEndDate'),
          today:(new Date()),
          init:function(){
              cardStay.inputVal();
              cardStay.endFun();
              cardStay.startFun();
          },
          startFun:function(){
              cardStay.start.datepicker({
                  dateFormat : 'yy-mm-dd',
                  dayNamesMin : ['日','一','二','三','四','五','六'],
                  monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                  altFormat : 'yy-mm-dd',
                  yearSuffix:'年',
                  showMonthAfterYear:true,
                  firstDay : 1,
                  showOtherMonths:true,
                  minDate : -360,
                  maxDate:360,
                  onSelect:function(dateText,inst){
                    _.startTime = dateText;
                    cardStay.end.datepicker('option', 'minDate', new Date(moment(dateText).add('days', 0)));
                    cardStay.end.datepicker('option', 'maxDate', new Date(moment(dateText).add('days', 360)));
                    var strDay =  cardStay.compare($(this));
                    var s = new Date(moment(dateText).add('days', 0));
                    var s1 = new Date(moment(dateText).add('days', 1));
                  }
              });
          },
          endFun:function(){
              cardStay.end.datepicker('refresh');
              cardStay.end.datepicker({
                  dateFormat : 'yy-mm-dd',
                  dayNamesMin : ['日','一','二','三','四','五','六'],
                  monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                  altFormat : 'yy-mm-dd',
                  yearSuffix:'年',
                  showMonthAfterYear:true,
                  firstDay : 1,
                  showOtherMonths:true,
                  minDate : -360,
                  maxDate:360,
                  onSelect:function(dateText){
                      _.endTime = dateText;
                      //cardStay.end.datepicker('option', 'appendText', cardStay.compare($(this)));
                      if($("#startDate").val()==""||$("#endDate").val()==""){
                          $('#start_end_fault_tips').css('display','block').html('请选中固定有效期的开始时间、结束时间');
                      }
                      else{
                          $('#start_end_fault_tips').css('display','none');
                      }
                  }

              });
          },
          transformStr:function(day,strDay){
              switch (day){
                      case 1:
                          strDay  = '星期一';
                          break;
                      case 2:
                          strDay  = '星期二';
                          break;
                      case 3:
                          strDay  = '星期三';
                          break;
                      case 4:
                          strDay  = '星期四';
                          break;
                      case 5:
                          strDay  = '星期五';
                          break;
                      case 6:
                          strDay  = '星期六';
                          break;
                      case 0:
                          strDay  = '星期日';
                          break;
                  }
              return strDay;
          },
          compare:function(obj){
              var strDay = '今天';
              var myDate = new Date(cardStay.today.getFullYear(),cardStay.today.getMonth(),cardStay.today.getDate());
              var day = (obj.datepicker('getDate') - myDate)/(24*60*60*1000);
              day == 0 ? strDay: day == 1 ?
                  (strDay = '明天') : day == 2 ?
                  (strDay = '后天') : (strDay = cardStay.transformStr(obj.datepicker('getDate').getDay(),strDay));
              return strDay;
          },
          inputVal:function(){
             // cardStay.inputTimes(cardStay.start,1);
             // cardStay.inputTimes(cardStay.end,2);
          },
          inputTimes:function(obj,day){
              var m = new Date(moment(cardStay.today).add('days', day));
              obj.val(m.getFullYear() + "-" + cardStay.addZero((m.getMonth()+1)) + "-" + cardStay.addZero(m.getDate()));
          },
          addZero:function(num){
              num < 10 ? num = "0" + num : num ;
              return num;
          }
        }
        cardStay.init();
    },
    return_china(){
      this.selectCity = 'china';
    }
  },
  components: {
    filter,Map,distribution
  },
  events : {
    getData (day) {
    },
    getChina(){
      var _ = this;
      if(_.foreign == "2"){
        $.post('allot/provinces',{day:_.checkDay,foreign:_.foreign,startDate:_.startTime,endDate:_.endTime},function(res){
            _.canAssignTotal = res.canAssignTotal;
        })
      }else{
        $.post('allot/provinces',{day:_.checkDay,foreign:_.foreign,startDate:_.startTime,endDate:_.endTime},function(res){
            _.max = res.max;
            _.userCount = res.allocateTotal;
            _.mapData = res.data;
            _.cityVal = res.provinces;
            _.canAssignTotal = res.canAssignTotal;
        })
      }
    }
  }
}
</script>

<style lang='less'>
@basecolor:#63a8eb;
.container{
  position:relative;
}
.store_content{
  margin-top:25px;
  table{
    width:100%;
    vertical-align:middle;
    td{
      vertical-align:middle;
      .return_china{
        position:absolute;
        right:30px;
        margin-right: 10px;
        margin-top:-10px;
        font-size:14px;
        display: inline-block;
        width: 110px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border-radius: 2px;
        border: 1px solid #ddd;
        color: #666666;
        cursor: pointer;
      }
      .return_china:hover{
        border: 1px solid #63a8eb;
        color: #63a8eb;
      }
      h2{
        font-size:14px;
        font-weight:normal;
        margin-bottom: 20px;
        .userCount{
          color:@basecolor
        }
      }
    }
    .wd410{
      width:440px;
    }
  }
}
</style>
