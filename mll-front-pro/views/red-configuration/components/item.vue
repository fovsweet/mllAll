<script>
	import {
		editShow,storeShow
	} from '../vuex/actions';

	import store from './newStore.vue';

	export default{
		components : { store },
		vuex: {
			getters : {
				show : state => state.editShow,
				stShow: state => state.storeShow,
				title : state => state.modalTitle,
			},
			actions: {
				editShow,storeShow
			}
		},
		methods:{
			checkStore(e){
				$(e.currentTarget).parent().find('a').removeClass('current');
				$(e.currentTarget).addClass('current');
				if(e.currentTarget.innerHTML === '指定门店'){
					this.storeShow();
				}
			}
		}
	}
</script>

<template>
	<div v-show='show' class="modal-mask" transition="modal">
		<div class="modal-wrapper">
			<div class="modal-container">
				<div class="modal-head">
					<div class="modal-title">
						<slot name="header">{{title}}</slot>
					</div>
					<span class="modal-close" @click='editShow()'></span>
				</div>
				<div class="modal-content">
					<div class="search-group">
						<em class="must-point">*</em>
						<label>规则名称</label>
						<input class="wd470" type="text" name="">
					</div>
					<div class="search-group">
						<em class="must-point">*</em>
						<label>有效期</label>
						<input class="wd100" type="text" name="">
						<span>至</span>
						<input class="wd100" type="text" name="">
					</div>
					<div class="search-group">
						<em class="must-point top2">*</em>
						<label>适用门店</label>
						<a @click='checkStore' class='radius current' href="javascript:;">所有门店</a>
						<a @click='checkStore' class='radius' href="javascript:;">指定门店</a>
						<store></store>
					</div>	
					<div class="search-group">
						<em class="must-point">*</em>
						<label>规则名称</label>
						<span>订单金额 ≥ </span>
						<input class="wd100" type="text" name="">
						<span>元，返点比例</span>
						<input class="wd100" type="text" name="">
						<span>%</span>
					</div>	
					<div class="search-group flx">
						<div>
							<em style="top:13px" class="must-point">*</em>
							<label>金主所得</label>
							<input class="wd100" type="text" name="">
							<span>%</span>
						</div>
						<div>
							<span>订单拥有者可以获得红包金额的比例，当计算剩余金额不足1元时，则金主获得全部金额</span>
						</div>
					</div>	
					<div class="search-group">
						<em class="must-point top2">*</em>
						<label>规则名称</label>
						<a @click='checkStore' class='radius current' href="javascript:;">固定金额</a>
						<a @click='checkStore' class='radius' href="javascript:;">随机金额</a>
					</div>
					<div class="search-group">
						<em class="must-point">*</em>
						<label>每人领取</label>
						<input class="wd100" type="text" name="">
						<span>请输入1~199的数值</span>
					</div>
					<div class="search-group">
						<label>红包金额</label>
						<span>红包金额 = 订单金额 * 返点比例</span>
						<span>（四舍五入，保留整数）</span>
					</div>
					<div class="search-group">
						<label>领取人数</label>
						<span class="block">
							固定金额时，领取人数 = （红包金额 - 金主所得）/ 每人领取</br>
							随机金额时，领取人数 = （红包金额 - 金主所得）/ 平均领取
						</span>
					</div>			
				</div>
				<div class="modal-foot">
					<button type="button" class="btn-cancel" @click='editShow()'>取&emsp;消</button>
					<button type="button" class="btn-save" @click='editShow()'> 保&emsp;存</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang='less' scoped>
.modal-container {
   width: 670px;
   margin: 0px auto;
   padding: 0px 30px 30px 30px;
   background-color: #fff;
   border-radius: 2px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
   transition: all .3s ease;
   font-family: Helvetica, Arial, sans-serif;
}

.modal-wrapper {
   display: table-cell;
   vertical-align: middle;
   color: #666;
   text-align: center;
}

.modal-head{
    position: relative;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 20px;
}

.modal-head .modal-title{
   /* height: 65px;
   line-height: 65px; */
   line-height: 1;
   padding-bottom: 15px;
   padding-top: 25px;
   
   font-size: 25px;
   text-align: center;
   font-weight: normal;
   color:#333;
}

.modal-head .modal-close{
   display: inline-block;
   width: 15px;
   height: 15px;
   background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAylpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTA0OTAxMjY5NzBCMTFFNTk0NEQ5NzVCQzZFNkNCMjAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTA0OTAxMjU5NzBCMTFFNTk0NEQ5NzVCQzZFNkNCMjAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuZGlkOjU2OTBmNmJiLTA5MmItMjA0YS1iOTU3LTE4NmFhMDY1MjY3MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NjkwZjZiYi0wOTJiLTIwNGEtYjk1Ny0xODZhYTA2NTI2NzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7UCCNHAAAAbElEQVR42pSRyQ3AMAgEzfbfANUSxVEkZLOI5cWDGS5z91hf2NJic0hgqPDL4ugeCvxPsATJtS6Ogk5S3gpFYSWhhwYZNUvaL6HZ10g+FgTJR4I8dvsdDK9NJZi8qpNgCFMJBLiUQIQvySPAADnqHeikkPSlAAAAAElFTkSuQmCC') no-repeat;
   position: absolute;
   top: 25px;
   right: 0;
   cursor: pointer;
}

.modal-foot{
   text-align: center;
   margin-top: 10px;
}

.modal-mask{
   position: fixed;
   z-index: 9998;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, .5);
   display: table;
   transition: opacity .3s ease;
}

.modal-content {
   font-size: 14px;
   padding: 20px;
   position:relative;
   text-align:left;
   div.flx{
   	display:flex;
   	flex-wrap:nowrap;
   	align-items:center;
   	div:nth-of-type(1){
   		margin-right:20px;
   	}
   	div:nth-of-type(2){
   		width:380px;
   		span{
   			margin-left:0;
   		}
   	}
   }
   .search-group{
   	position:relative;
   	display:block;
   	.block{
   		display:inline-block;
   		width:380px;
   		vertical-align:top;
   	}
   	.radius{
   		display: inline-block;
			width: 95px;
			height: 16px;
			line-height: 16px;
			text-align: center;
			font-size: 14px;
			background: url('../images/radio.png') 0 -18px no-repeat;
			background-size: 16px;
			cursor: pointer;
			color:#666;
   	}
   	.radius:first-of-type{
   		margin-left:10px;
   	}
   	.current{
   		background-position:0 0;
   	}
   	label{
   		width:56px;
   		display:inline-block;
   	}
   	span{
   		font-size:14px;
   		margin-left:10px;
   	}
   	.wd470{
   		width:470px;
   	}
   	.wd100{
   		width:100px;
   	}
   	.must-point{
			left: -10px;
			top: 9px;
   	}
   	.top2{
   		top:2px;
   	}
   }
}

.modal-foot button {
	font-size: 16px;
	width: 130px;
	height: 40px;
	line-height: 40px;
	border-radius: 3px;
	cursor: pointer;
	border: none;
	outline: none;
}

.modal-foot .btn-cancel {
	color: #666;
	background: #ddd;
	margin-right: 20px;
}

.modal-foot .btn-save {
	color: #fff;
	background: #63a8eb;
}
.modal-foot .btn-save:hover{
	background: #548ce5;
}

.modal-enter, .modal-leave {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container{
   -webkit-transform: scale(1.1);
   transform: scale(1.1);
}
</style>