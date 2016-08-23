<template>
  <div class='filter'>
    <h2 class="filter_title">2.分配客户</h2>
    <div class="filter_content">
      <div class="search-group">
      	<h2>共筛选出<span>{{userCount}}</span>位客户</h2>
        <label>分配</label>
        <input class='wd90' type='text'>
        <label>位至</label>
        <input type='text' placeholder="请输入门店名称">
      </div>
      <div class="for_right search-group">
				<button class="btn-default">分配</button>
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
      userCount: '21042'
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
    border:1px solid $basebac;
    .for_right{
    	text-align:right;
    	.btn-default{
    		margin-right:0;
    	}
    }
    .search-group{
      margin-right:0;
      display:block;
      label:first-of-type{
        margin-right:10px;
      }
      .wd90{
      	width:90px;
      	margin-right:10px;
      	margin-left:0px;
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

