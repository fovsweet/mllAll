<template>
  <div id="app">
    <div class='store_content'>
      <table>
        <tr>
          <td><h2>待分配客户总数：<span class='userCount'>{{userCount}}</span> 位</h2></td>
          <td><h2>客户分配区域</h2></td>
        </tr>
        <tr>
          <td>
            <filter :sele.sync='selectCity' :citydata.sync='cityVal'></filter>
            <distribution></distribution>
          </td>
          <td>
            <Map :sele.sync='selectCity' :mapsource.sync='cityVal'></Map>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import filter from './components/filter.vue'
import distribution from './components/distribution.vue'
import Map from './components/Map.vue'

export default {
  data () {
    return {
      userCount: '21042',
      cityVal:[
          {id:'a11',value:'省',py:'china'},
          {id:'a11',value:'四川',py:'sichuan'},
          {id:'a12',value:'广东',py:'guangdong'},
          {id:'a13',value:'北京',py:'beijing'},
      ],
      selectCity:'china',
    }
  },
  components: {
    filter,Map,distribution
  },
}
</script>

<style lang='scss'>
$basecolor:#63a8eb;
.store_content{
  margin-top:25px;
  table{
    width:100%;
    vertical-align:middle;
    td{
      width:50%;
      vertical-align:middle;
      h2{
        font-size:14px;
        font-weight:normal;
        margin-bottom: 20px;
        .userCount{
          color:$basecolor
        }
      }
    }
  }
}
</style>
