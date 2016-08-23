/**
 * 漂浮弹窗
 * setting对象
 * {
 *     boxID:{string},//必填参数 表示弹出对话框的id为boxID + 'Dia'
 *     width:{number},//div.data-content的宽度
 *     closeOther: {boolean},//是否关闭之前弹框，默认关闭之前全部弹框
 *     isDelwFade: {boolean},//关闭弹框时是否删除弹框dom，默认true默认删除
 *     title:{string},//弹框标题
 *     html:{string},//插入到div.data-content .dia-main的html内容，
 *     buttons:{arrgy} [{value: '确认',className: 'dia-close',callbackFun: {function}},{...}...]//操作按钮
 *     buttons参数可传入null使用默认按钮，[]传入无按钮,
 * }
 * 打开新弹窗时会先关闭已有弹窗
 */
$.lightBox = function(setting){
    return new $.lightBox.prototype.init( setting );
}

var urldata;
$.lightBox.prototype = {
    constructor:$.lightBox,
    init: function(setting){
        // $.lightBox.list = $.lightBox.list || {};
        // for(var k in $.lightBox.list ){
        //     if( !$.lightBox.list[k].isHide )$.lightBox.list[k].close();
        // }
        // TODO 扩展多层弹框
        this.setting = $.extend( {
            width: 760,
            closeOther: true,
            isDelwFade: true
        },setting  );
        this.setting.buttons = this.setting.buttons || ([{value: '确定', className: 'dia-close bright-button'}]);
        this.id = this.setting.boxID + 'Dia';
        //默认删除之前弹框
        if( this.setting.closeOther && $('#'+this.id)[0] ) {
            $('#'+this.id).remove();
        }
        //添加弹框dom

        var h = this.createDiaHTML();
        $('body').append(h);

        /*修改上传图片样式*/
        $('.data-dia').on('click','.picChoose',function(){
            $('.pic-title .picChoose').removeClass("on");
            $(this).addClass("on");

            if($(this).attr("id") == "localUp"){
                $('.search_pics').hide()
                $(".picsChoose").hide();
                $('.localChoose').show();
            }else {
                $('.search_pics').show()
                $(".picsChoose").show();
                $('.localChoose').hide();
                var option = {
                    menu_url:'photo/getphotosysinfo',
                    img_list_url:'photo/getphoto',
                    sys_code:'op'
                };
                $('.picsChoose').material(option,function(data){
                    urldata = data;
                    console.log(data);
                })
            }
        });
        /*修改上传图片样式*/

        this.dom = $('#' + this.id);
        var btnIDpr = '#' + this.id + '_btn';
        for(var kk in this.setting.buttons){
            if ( typeof this.setting.buttons[kk].callbackFun == 'function' ){
                $(btnIDpr + kk).on('click',this.setting.buttons[kk].callbackFun);
                $(btnIDpr + kk)[0].lightBox = this;
            }
        }

        //展现关闭弹框
        this.dom.fadeIn();
        this.dom.css('display', 'flex');
        var that = this;
        $(this.dom).find('.fix,.dia-close,.bright-button').on('click',function(){
            that.dom.fadeOut();
            setTimeout(function(){
                $(that.dom).find('.fix').detach();

                if ( that.setting.isDelwFade ) {
                    $(that.dom).remove();
                }
            },500);
        });

        //TODO radio增加点击效果
        $(this.dom).find('.radio-input').on('click',function(){
            $('.data-dia .radio-input').removeClass('check');
            // $('.data-dia input[name=status]').attr('checked',false);
            $(this).addClass('check');
            // $(this).siblings().attr('checked',true);
        });
        //返回弹窗dom
        return this.dom;
    },
    close: function(){
        this.dom.fadeOut();
        setTimeout(function(){
            $(this.dom).find('.fix').detach();
        },500);
    },

    createDiaHTML: function(){
        var h = '<div class="data-dia" id="' + this.id + '">'
            + '<div class="fix"></div>'
            + '<div class="data-content" style="width:' + this.setting.width +'px;color: #666;">';
        if ( this.setting.title ) {
            h += '<div class="dia-header">'
            + '<span class="dia-title">' + this.setting.title + '</span>'
            + '<a class="dia-close dia-cha" href="javascript:;" title="关闭"></a></div>';
        }
        h += '<div class="dia-main localChoose clearfix">'
        + this.setting.html
        + '</div>';
        h += '<div class="dia-main picsChoose clearfix" style="display: none;">'

        + '</div>';
        if ( this.setting.buttons ) {
            h += '<div class="dia-footer">';
            for(var k in this.setting.buttons) {
                if ( k != 0 ){
                    h += '&emsp;'
                }
                h += '<input type="button" id="' + this.id + '_btn' + k + '" class="' + this.setting.buttons[k].className + '" value="' + this.setting.buttons[k].value + '" />';
            }
            h += '</div>'
        }
        h += '</div></div>';
        return h;
    }
}


$.lightBox.prototype.init.prototype = $.lightBox.prototype;
$.lightBox.getCurDia = function(curDom){
    var tempDom = curDom;
    if ( tempDom && tempDom[0] ) {
        var tempClassname = $(tempDom).attr('class');
        while ( !tempClassname || tempClassname.indexOf('data-dia') == -1 ) {
            tempDom = $(tempDom).parent();
            if ( $(tempDom)[0] === document.body ) {
                return null;
            }
            tempClassname = $(tempDom).attr('class');
        }
        return tempDom;
    } else {
        return null;
    }
}
$.lightBox.showBox = function(lightBoxId){
    $('#' + lightBoxId).prepend('<div class="fix"></div>');
    $('#' + lightBoxId).fadeIn();
    $('#' + lightBoxId).css('display','flex');
}
$.lightBox.closeBox = function(thisLightBox){
    var diaObj = thisLightBox.dom;
    $(diaObj).fadeOut();
    setTimeout(function(){
        $(diaObj).find('.fix').detach();
        if ( thisLightBox.setting.isDelwFade ) {
            $(diaObj).remove();
        }
    },500);
}
$.lightBox.closeALL = function(){
    $('.data-dia').fadeOut();
    setTimeout(function(){
        $('.fix').detach();
        $('#'+this.id).remove();
    },500);
}
/**
 * [upImgBox 上传图片弹框]
 * @param  {object} boxSize   [弹框宽度,默认宽度530] {boxWidth:[number],maxWidth:[number],maxHeight:[number],minWidth:[number],minHeight:[number]}
 * @param  {string} upImgBoxId [删除图片的boxid]
 * @param  {string} boxTitle   [弹框标题，默认为“更换图片”]
 * @param  {object} boxButtons [弹框下部操作按钮，默认按钮有取消和确认提交。格式如$.lightBox]
 * 使用时需按顺序分别引入 css/jquery.Jcrop.css js/jquery.Jcrop.js 和 js/imgUploadPre.js
 */
function upImgBox(flag,boxSize,upImgBoxId,boxTitle,boxButtons) {
    upImgBoxId = upImgBoxId || 'upImg';
    var upImgDiaId = upImgBoxId + 'Dia';
    //判断是否已打开图片选择对话框
    //新建图片选择弹框
    //设置大小
    var boxSize = $.extend({
        boxWidth: 530,
        maxWidth: 290,
        maxHeight: 200,
        minWidth: 210,
        minHeight: 140,
        tipWidth:900,
        tipHeight:500,
        boxId: upImgDiaId
    },boxSize);
    var boxSizeString = '({maxWidth:'+ boxSize.maxWidth +
        ',maxHeight:' + boxSize.maxHeight +
        ',minWidth:' + boxSize.minWidth +
        ',minHeight:' + boxSize.minHeight +
        ',boxId:\'' + boxSize.boxId + '\'})';
    //默认的弹框内容
    var defaultContentH = '<div class="imgup-block imgup-block1">'
        + '<form method="post" enctype="multipart/form-data">'
        + '<div class="js-imgDragPane img-drag-pane" style="width:'+boxSize.maxWidth+'px;height:'+(boxSize.maxHeight)+'px;">'
        + '<div class="js-imgDragContainer img-drag-container" style="width:'+boxSize.maxWidth+'px;height:'+boxSize.maxHeight+'px;">'
        + '<p class="p1">（建议尺寸：'+boxSize.tipWidth+'×'+boxSize.tipHeight+'，建议大小：2M以下）</p>'
        + '</div></div>'
        + '<span class="file-btn" onclick="fileImage.click()" style="width:'+(boxSize.maxWidth-2)+'px;"><span class="file-ico"></span>上传本地图片</span>'
        + '<input type="file" name="fileImage" id="fileImage" style="display:none" onchange="previewImage(this,eval('+boxSizeString+'))">'
            // + '<input type="hidden" id="imgLeft" name="imgLeft" />'
            // + '<input type="hidden" id="imgTop" name="imgTop" />'
            // + '<input type="hidden" id="imgW" name="imgW" />'
            // + '<input type="hidden" id="imgH" name="imgH">'
            // + '<input type="hidden" id="cutW" name="cutW" value="'+boxSize.minWidth+'">'
            // + '<input type="hidden" id="cutH" name="cutH" value="'+boxSize.minHeight+'">'
        + '<span class="file-tips">支持图片类型jpg、jpeg、png</span>'
        + '<input type="hidden" id="erroMsg" value="yes"/>'
        + '</form></div>'
        + '<div class="imgup-block imgup-block2">'
        + '<div class="img-fi-preview" style="width:'+boxSize.minWidth+'px;height:'+boxSize.minHeight+'px;">'
        + '<div class="preview-pane">'
        + '<div class="preview-container" style="width:'+boxSize.minWidth+'px;height:'+boxSize.minHeight+'px;overflow:hidden;">'
        + ' <img class="js-imgpre jcrop-preview" />'
        + '</div></div></div>'
        + '<span class="label">预览效果</span>'
        + '</div>';
    var defaultBut = [{
        value: '取消',
        className: 'dia-close cancel-button'
    },{
        value: '确认',
        className: 'bright-button',
        callbackFun: function() {
            if($(".on")[0].id == "picChoose"){
                if(flag=="big"){
                    $("#ccPicBigImg").attr("src", urldata.url);
                    $('input[name="ccDefinition.ccPicBigUrl"]').val(urldata.url);
                }
                else if(flag=="small"){
                    $("#ccPicSmallImg").attr("src", urldata.url);
                    $('input[name="ccDefinition.ccPicSmallUrl"]').val(urldata.url);
                }
            }else {
                imgUpLoad(boxSize,flag);
            }
        }
    }];
    $.lightBox({
        boxID: upImgBoxId,
        width: boxSize.boxWidth,
        isDelwFade: false,
        title: boxTitle || '上传图片',
        html: defaultContentH,
        buttons: boxButtons || defaultBut
    });

}
function callback(data){
    console.log(data);
}
/**
 * [imgUpLoad 上传图片处理]
 * @param {object} boxSize [存放弹窗对话框相应的信息,必须包含当前图片选择框的domID，裁剪框大小]
 * imgLeft：图片预览左偏移；mgTop：图片预览上偏移
 * imgW：图片预览时宽度；mgH：图片预览时高度
 * cutW：裁剪框宽度；cutH：裁剪框高度
 */
function imgUpLoad(boxSize,flag){
    if($('#erroMsg').val()=="no") {//表示校验未通过}
        return;
    }
    var upFile = $('#' + boxSize.boxId).find('input[type=file]');
    if( !$(upFile).val() ) {
        $('#pic_fault_tips').css('display','block').html('还未选择图片,请重新选择');
        return;
    }

    var imgPreDom = $('#' + boxSize.boxId).find('.js-imgpre')[0];

    //var res = {imgTop: parseFloat(imgPreDom.style.marginTop),
    //    imgLeft: parseFloat(imgPreDom.style.marginLeft),
    //    imgW: parseFloat(imgPreDom.style.width),
    //    imgH: parseFloat(imgPreDom.style.height),
    //    cutW: boxSize.minWidth,
    //    cutH: boxSize.minHeight,
    //    imgSrc: imgPreDom.src
    //};

    var x = parseFloat(imgPreDom.style.marginLeft);
    var y = parseFloat(imgPreDom.style.marginTop);
    var  width = boxSize.minWidth;
    var height = boxSize.minHeight;
    var boxWidth = parseFloat(imgPreDom.style.width);
    var boxheight = parseFloat(imgPreDom.style.height);
    var data = {"x":x,"y":y,"width":width,"height":height,"boxWidth":boxWidth,"boxHeight":boxheight};
    imageClickInvoke(flag,"fileImage",data);

    //TODO
    //裁剪需要的信息参见res中
    //注意上传图片的<input type="file" />元素的name、id如下
    var fileInputId = $(upFile).attr('id');

    console.log(fileInputId);

}
function imageClickInvoke(flag,fileImage,data){

    var fileElementId=fileImage;
    $.ajaxFileUpload({
        url: 'def/ntpl/upload', //用于文件上传的服务器端请求地址
        type:'post',
        secureuri: false, //一般设置为false
        fileElementId: fileElementId, //文件上传空间的id属性  <input type="file" id="file" name="file" />
        dataType: 'String', //返回值类型 一般设置为json
        data:data,//传参数给后台
        success: function (res)  //服务器成功响应处理函数
        {
            if(res=="failure"){
                $('#pic_fault_tips').css('display','block').html('服务超时,上传失败');
                return;
            }
            else if(flag=="big"){
                $("#ccPicBigImg").attr("src", res);
                $('input[name="ccDefinition.ccPicBigUrl"]').val(res);
            }
            else if(flag=="small"){
                $("#ccPicSmallImg").attr("src", res);
                $('input[name="ccDefinition.ccPicSmallUrl"]').val(res);
            }

            //图片js校验
            var acPicBigUrl=$("#ccPicBigUrl").val();
            var acPicSmallUrl=$("#ccPicSmallUrl").val();
            if(acPicBigUrl=="" || acPicSmallUrl==""){
                //alert("请上传商户logo（大图）！");
                //$('#pic_fault_tips').css('display','block').html('请上传图片');
                //result = false;
            }
            else{
                $('#pic_fault_tips').css('display','none');
            }

        },
        error: function (res)//服务器响应失败处理函数
        {
            alert(res);
        }
    })
}