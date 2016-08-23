//图片上传预览    IE是用了滤镜。
function previewImage(file,boxSize) {
    var MAXWIDTH  = boxSize.maxWidth,MINWIDTH = boxSize.minWidth;
    var MAXHEIGHT = boxSize.maxHeight,MINHEIGHT = boxSize.minHeight;
    var fileSuffixs = 'image/jpg,image/jpeg,image/png';
    var pDiv = $('#' + boxSize.boxId );
    var imgContain = $(pDiv).find('.js-imgDragContainer');
    if (file.files && file.files[0]) {
        //验证选择的文件类型
        var fileType = file.files[0].type;
        var fileSize = file.files[0].size;
        if ( fileSuffixs.indexOf(fileType) <=0 ) {
            //alert('仅支持图片类型jpg、jpeg、png');
            $('.file-tips').css('color','red');
            $('#erroMsg').val("no");
            return;
        }
        else{
            $('.file-tips').css('color','black');
            $('#erroMsg').val("yes");
        }
        if(fileSize>2097152){
            $('.file-tips').css('color','red').html('所选图片已超过2M,请重新选择');
            $('#erroMsg').val("no");
            //$('#pic_fault_tips').css('display','block').html('所选图片已超过2M,请重新选择');
            return;
        }
        else{
            $('.file-tips').css('color','block').html("仅支持图片类型jpg、jpeg、png");
            $('#erroMsg').val("yes");
        }
        var imgContainInner = $('<div class="js-imgContainInner">');
        $(imgContain).html(imgContainInner);
        var imgDrag = $('<img class="js-imgDrag" alt="jcrop Image">');
        $(imgContainInner).html(imgDrag);

        var imgDom = $(imgDrag)[0],
            imgPre = $(pDiv).find('.js-imgpre');
        imgDom.onload = function(){
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, imgDom.offsetWidth, imgDom.offsetHeight);
            var rectPre = clacImgZoomParam2(MINWIDTH, MINHEIGHT, imgDom.offsetWidth, imgDom.offsetHeight);
            imgDom.width  =  rect.width;
            imgDom.height =  rect.height;
            $(imgPre).css({width: (rectPre.width + 'px') ,height: (rectPre.height + 'px')});
            $(imgContainInner).css({'margin-left': (rect.left + 'px'),'margin-top': (rect.top + 'px')});
            $(pDiv).find('.preview-pane').css({right: -(30 + MINWIDTH + rect.left) + 'px',top: -(rect.top) + 'px'});

            //添加拖拽框裁剪扩展
            var dragRect = clacImgZoomParam3(rect.width,rect.height,(MINWIDTH/MINHEIGHT));
            jQuery(function($) {

                var jcrop_api,
                    boundx,
                    boundy,
                    $preview = $('.preview-pane'),
                    $pcnt = $('.preview-pane .preview-container'),
                    $pimg = $('.preview-pane .preview-container img'),
                    xsize = $pcnt.width(),
                    ysize = $pcnt.height();
                $(imgDrag).Jcrop({
                    bgFade:     true,
                    bgOpacity: .5,
                    // allowSelect: false,
                    // allowResize: false,
                    onSelect: updatePreview,
                    onChange: updatePreview,
                    aspectRatio: xsize / ysize,

                    setSelect: [ dragRect.left, dragRect.top, dragRect.width, dragRect.height]
                },function(){
                    var bounds = this.getBounds();
                    boundx = bounds[0];
                    boundy = bounds[1];
                    jcrop_api = this;
                    $preview.appendTo(jcrop_api.ui.holder);
                });

                //更新裁剪预览框中图片
                function updatePreview(c){
                    if (parseInt(c.w) > 0){
                        var rx = xsize / c.w;
                        var ry = ysize / c.h;

                        $pimg.css({
                            width: Math.round(rx * boundx) + 'px',
                            height: Math.round(ry * boundy) + 'px',
                            marginLeft: '-' + Math.round(rx * c.x) + 'px',
                            marginTop: '-' + Math.round(ry * c.y) + 'px'
                        });
                    }
                };
            });
        }
        var reader = new FileReader();
        reader.onload = function(evt){
            imgDom.src = evt.target.result;

            if ( !$(imgPre)[0] ) {
                var preContainH = '<div class="preview-pane">'
                    + '<div class="preview-container" style="width:'+ MINWIDTH +'px;height:'+ MINHEIGHT +'px;overflow:hidden;">'
                    + ' <img class="js-imgpre jcrop-preview" />'
                    + '</div></div>';
                $(pDiv).find('.img-fi-preview').html(preContainH);
                imgPre = $(pDiv).find('.js-imgpre');
            }
            $(imgPre).attr('src', evt.target.result);
        }
        reader.readAsDataURL(file.files[0]);
    } else {
        //兼容IE
        //TODO
        // var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        // file.select();
        // var src = document.selection.createRange().text;
        // div.innerHTML = '<img id="imgDrag">';
        // var img = document.getElementById('imgDrag');
        // img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        // var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        // status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
        // div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;"+sFilter+src+"\"'></div>";
    }
}
/**
 * [clacImgZoomParam 上传预览图片给定最大宽高计算图片展示宽高及margin]
 * @param  {[type]} maxWidth  [最大宽度值]
 * @param  {[type]} maxHeight [最大高度值]
 * @param  {[type]} width     [图片本身宽度值]
 * @param  {[type]} height    [图片本身高度值]
 * @return {[type]}           [预展示图片的宽高，margin值]
 */
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height};
    if( width>maxWidth || height>maxHeight )
    {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if( rateWidth > rateHeight )
        {
            param.width =  maxWidth;
            param.height = Math.round(height / rateWidth);
        }else
        {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}

/**
 * [clacImgZoomParam2 上传预览图片给定最小宽高计算图片展示宽高及margin]
 * @param  {[type]} maxWidth  [最小宽度值]
 * @param  {[type]} maxHeight [最小高度值]
 * @param  {[type]} width     [图片本身宽度值]
 * @param  {[type]} height    [图片本身高度值]
 * @return {[type]}           [预展示图片的宽高，margin值]
 */
function clacImgZoomParam2( minWidth, minHeight, width, height ) {
    var param = {top:0, left:0, width:width, height:height};
    var rateWidth = width / minWidth,
        rateHeight = height / minHeight;
    if( rateWidth > rateHeight ) {
        param.width =  Math.round(width / rateHeight);
        param.height = minHeight;
    } else {
        param.width = minWidth;
        param.height = Math.round(height / rateWidth);
    }
    return param;
}
/**
 * [clacImgZoomParam3 计算裁剪框大小]
 */
function clacImgZoomParam3(realWidth,realHeight,rate) {
    var rRate = realWidth / realHeight;
    var tempWidth = 0,tempHeight = 0;
    if ( rRate > rate ) {
        tempHeight = realHeight;
        tempWidth = rate * tempHeight;
    } else {
        tempWidth = realWidth;
        tempHeight = tempWidth / rate;
    }
    return clacImgZoomParam(realWidth,realHeight,tempWidth,tempHeight);
}