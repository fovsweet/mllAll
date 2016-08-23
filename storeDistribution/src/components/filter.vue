<template>
  <div class='filter'>
    <h2 class="filter_title">1.筛选客户</h2>
    <div class="filter_content">
      <div class="search-group">
        <label>所在区域</label>
        <select v-model='sele'>
          <option v-for='item in citydata' :value='item.py'>{{item.value}}</option>
        </select>
        <select>
          <option>市</option>
        </select>
      </div>
      <div class="search-group">
        <label>激活时间</label>
        <input class="check" @click='check_date(7)' type='button' value="最近7天">
        <input @click='check_date(30)' type='button' value="最近30天">
        <input @click='check_date(48)' type='button' value="48小时内">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
    }
  },
  props: {
    citydata:Array,
    sele:String,
  },
  methods: {
    check_date (data){
      let $this = $(event.currentTarget)
      $this.siblings().removeClass('check')
      $this.addClass('check')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
$basecolor:#63a8eb;
$basebac:#ddd;
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
    border:1px solid $basebac;
    .search-group{
      margin-right:0;
      display:block;
      label{
        margin-right:10px;
      }
      select{
        width:110px;
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
        border:1px solid $basecolor;
        color:$basecolor;
      }
      .check{
        border:1px solid $basecolor;
        color:$basecolor;
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
    z-index:99;
    margin-left:-10px;
    width:0;
    height:0px;
    border-left:10px solid transparent;
    border-right:10px solid transparent;
    border-top:10px solid transparent;
    border-bottom:10px solid $basebac;
  }
  .filter_content:before{
    content: '';
    position:absolute;
    top:-18.5px;
    left:50%;
    z-index:100;
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
