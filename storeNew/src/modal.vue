<template>
	<div class="modal-mask modal-transition" v-show="show" transition="modal">
		<div class="modal-wrapper">
			<div class="modal-area">
				<div class="modal-head clearfix">
					<span class="modal-close" @click="show=false"></span>
					<div class="modal-title" >提示</div>
				</div>
				<div class='modal-body'>
					<span>{{words}}</span>
				</div>
				<div class="modal-foot">
			 		<button type="button" class="btn-save"  @click="show=false"> 确&emsp;定</button>
			   </div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		props:['show','words']
	}
</script>

<style lang='less'>
	.modal-mask {
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

	.modal-wrapper,.moimg-wrapper {
	    display: table-cell;
	    vertical-align: middle;
	    color: #666;
	    text-align: center;
	}

	.modal-area,.moimg-area{
	    padding: 30px;
	    padding-top: 0;
	    width: 480px;
	    margin: 0 auto;
	    background-color: #ffffff;
	    border-radius: 2px;
	    margin: 0 auto;
	    transition: all .3s ease;
	}
	.modal-area span.info,.moimg-area span.info{
	    color: #999;
	}

	.modal-head{
	    position: relative;
	    border-bottom: 1px solid #e8e8e8;
	    margin-bottom: 40px;
	}

	.modal-head .modal-title{
	    height: 65px;
	    line-height: 65px;
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
	    margin-top: 30px;
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
	.modal-enter, .modal-leave ,.moimg-enter, .moimg-leave {
	    opacity: 0;
	}
	.modal-enter .modal-area,
	.modal-leave .modal-area,
	.moimg-enter .moimg-area,
	.moimg-leave .moimg-area{
	    -webkit-transform: scale(1.1);
	    transform: scale(1.1);
	}
</style>
