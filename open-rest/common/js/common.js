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
$.lightBox = function (setting) {
    return new $.lightBox.prototype.init(setting);
}
$.lightBox.prototype = {
    constructor: $.lightBox,
    init: function (setting) {
        // $.lightBox.list = $.lightBox.list || {};
        // for(var k in $.lightBox.list ){
        //     if( !$.lightBox.list[k].isHide )$.lightBox.list[k].close();
        // }
        // TODO 扩展多层弹框
        this.setting = $.extend({
            width: 760,
            closeOther: true,
            isDelwFade: true
        }, setting);
        this.setting.buttons = this.setting.buttons || ([{value: '确定', className: 'dia-close bright-button'}]);
        //默认删除之前弹框
        this.id = this.setting.boxID + 'Dia';
        if (this.setting.closeOther && $('.data-dia')[0]) {
            $('#' + this.id).remove();
        }
        //添加弹框dom
        var h = this.createDiaHTML();
        $('body').append(h);
        this.dom = $('#' + this.id);
        var btnIDpr = '#' + this.id + '_btn';
        for (var kk in this.setting.buttons) {
            if (typeof this.setting.buttons[kk].callbackFun == 'function') {
                $(btnIDpr + kk).on('click', this.setting.buttons[kk].callbackFun);
                $(btnIDpr + kk)[0].lightBox = this;
            }
        }

        //展现关闭弹框
        this.dom.fadeIn();
        this.dom.css('display', 'flex');
        var that = this;
        $(this.dom).find('.fix,.dia-close').on('click', function () {
            that.dom.fadeOut();
            setTimeout(function () {
                $(that.dom).find('.fix').detach();

                if (that.setting.isDelwFade) {
                    $(that.dom).remove();
                }
            }, 500);
        });

        //TODO radio增加点击效果
        $(this.dom).find('.radio-input').on('click', function () {
            $('.data-dia .radio-input').removeClass('check');
            // $('.data-dia input[name=status]').attr('checked',false);
            $(this).addClass('check');
            // $(this).siblings().attr('checked',true);
        });
        //返回弹窗dom
        return this.dom;
    },
    close: function () {
        this.dom.fadeOut();
        setTimeout(function () {
            $(this.dom).find('.fix').detach();
        }, 500);
    },
    createDiaHTML: function () {
        var h = '<div class="data-dia" id="' + this.id + '">'
            + '<div class="fix"></div>'
            + '<div class="data-content" style="width:' + this.setting.width + 'px;color: #666;">';
        if (this.setting.title) {
            h += '<div class="dia-header">'
                + '<span class="dia-title">' + this.setting.title + '</span>'
                + '<a class="dia-close dia-cha" href="javascript:;" title="关闭"></a></div>';
        }
        h += '<div class="dia-main clearfix">'
            + this.setting.html
            + '</div>';
        if (this.setting.buttons) {
            h += '<div class="dia-footer">';
            for (var k in this.setting.buttons) {
                if (k != 0) {
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
$.lightBox.getCurDia = function (curDom) {
    var tempDom = curDom;
    if (tempDom && tempDom[0]) {
        var tempClassname = $(tempDom).attr('class');
        while (!tempClassname || tempClassname.indexOf('data-dia') == -1) {
            tempDom = $(tempDom).parent();
            if ($(tempDom)[0] === document.body) {
                return null;
            }
            tempClassname = $(tempDom).attr('class');
        }
        return tempDom;
    } else {
        return null;
    }
}
$.lightBox.showBox = function (lightBoxId) {
    $('#' + lightBoxId).prepend('<div class="fix"></div>');
    $('#' + lightBoxId).fadeIn();
    $('#' + lightBoxId).css('display', 'flex');
}
$.lightBox.closeBox = function (thisLightBox) {
    var diaObj = thisLightBox.dom;
    $(diaObj).fadeOut();
    setTimeout(function () {
        $(diaObj).find('.fix').detach();
        if (thisLightBox.setting.isDelwFade) {
            $(diaObj).remove();
        }
    }, 500);
}
$.lightBox.closeALL = function () {
    $('.data-dia').fadeOut();
    setTimeout(function () {
        $('.fix').detach();
        $('#' + this.id).remove();
    }, 500);
}

function dialog(obj) {
    var r = $(obj).data('role');
    var d = $("#" + r + "");
    d.prepend("<div class='fix'></div>");
    d.fadeIn();
    d.css('display', 'flex');
    $('#' + r + ' .fix,#' + r + ' .close_log').on('click', function () {
        d.fadeOut();
        setTimeout(function () {
            $('#' + r + ' .fix').detach();
        }, 500)
    });
}

/*cnzz网站数据统计代码*/
var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1258985760'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D1258985760%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E"));
