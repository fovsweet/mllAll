<script>
	import item from './item.vue';
	import delitem from './delete.vue';

	import {
		modalShow,
		editShow,
		deleteItem
	} from '../vuex/actions';

	export default{
		components:{ item,delitem },
		vuex: {
			getters: {
				show: state => state.modalShow,
				itemShow : state => state.editShow,
			},
			actions: {
				modalShow,
				editShow,
				deleteItem
			}
		}
	}
</script>

<template>
	<div class="table-form">
		<div class="search-group">
			<label>规则名称</label>
			<input type="text">
		</div>
		<div class="search-group">
			<label>状态</label>
			<select>
				<option>全部</option>
				<option>未开通</option>
				<option>已开通</option>
			</select>
		</div>
		<div class="search-group ml30">
			<input class="btn-default" type="button" value="查询">
			<input class="btn-default" type="button" value="新增规则" @click='editShow()'>
		</div>
		<table class="table-list">
			<thead>
				<tr>
					<th>
						规则名称
						<div class="opr-tips">
                     <span class="tips-icon">?</span>
                     <div class="opr-tips-content">
                        <dl class="tips-list">
                           <dd>一个门店可配置多个红包规则，已发放红包金额最多的规则为准</dd>
                        </dl>
                     </div>
                  </div>
					</th>
					<th>有效时间</th>
					<th>状态</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>南山店晒单规则</td>
					<td>2016-06-24~2016-07-24</td>
					<td>未开始</td>
					<td>
						<div class="operate-group">
							<a href="javascript:;" @click='editShow(11)'>编辑</a>
							<a class="delete" href="javascript:;" @click='deleteItem()'>删除</a>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<div id="pageNav"></div>
	</div>
	<item></item>
	<delitem></delitem>
</template>

<style scoped lang='less'>
	.table-form{
		margin-top:20px;
		.ml30{
			margin-left:10px;
		}
	}
	.opr-tips{
	    position: relative;
	    vertical-align: 15px;
	    display: inline-block;
	    font-weight: normal;
	}

	.opr-tips .tips-icon {
	    position: absolute;
	    top: 1px;
	    display: inline-block;
	    width: 15px;
	    height: 15px;
	    border-radius: 50%;
	    border: 1px solid #666666;
	    font-size: 12px;
	    line-height: 15px;
	    text-align: center;
	    cursor: pointer;
	    z-index: 9;
	    background:#fff;
	}

	.tips-icon:hover+.opr-tips-content {
	    transform: scale(1);
	}

	.opr-tips .opr-tips-content {
	    position: absolute;
	    top: 32px;
	    left:-20px;
	    padding: 5px 10px;
	    width: 200px;
	    border: 1px solid #ddd;
	    background: #fff;
	    box-sizing: border-box;
	    transform-origin:12% 0 ;
	    transform: scale(0);
	    transition: all .3s ease-in-out;
	    text-align: justify;
	}

	.opr-tips .opr-tips-content:before {
	    content: "";
	    width: 0;
	    height: 0;
	    border-width: 15px  10px;
	    border-style: solid;
	    border-color: transparent transparent #ddd transparent;
	    position: absolute;
	    left: 15px;
	    top: -30px;
	}

	.opr-tips .opr-tips-content:after {
	    content: "";
	    width: 0;
	    height: 0;
	    border-width: 15px  10px;
	    border-style: solid;
	    border-color: transparent transparent #fff transparent;
	    position: absolute;
	    left: 15px;
	    top: -28px;
	}
</style>