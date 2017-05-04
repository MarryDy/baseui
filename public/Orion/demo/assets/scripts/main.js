(function() {
    "use strict";

    $.widget('rkui.baseInput', {
        options: {
            disabled: null, //是否不可用
            activeClass: 'rk-ui-state-active', //触发时状态
            disableClass: 'rk-ui-state-disable', //不可用状态
            errorClass: 'rk-ui-state-error', //错误时状态
            initClass: 'rk-ui-state-init', //初始化状态
            maxLength: '', //最大输入长度
            minLength: '', //最小输入长度
            require: false, //是否必填
            vilidataEvent: '', //验证事件
            type: 'text'
        },
        _create: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;
            elem.addClass(opt.initClass);

            if (opt.disabled) {
                elem.addClass(opt.disableClass);
            }
            me.bindEvent();
        },
        _init: function() {

        },
        valueVilidata: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            var value = elem.val();
            //必填验证
            if (opt.require && value.length === 0) {
                alert("内容不能为空");
                elem.addClass(opt.errorClass);
            }
            //最大输入长度限制
            if (opt.maxLength !== "" && value.length > opt.maxLength) {
                alert("超过最大输入长度" + opt.maxLength);
                elem.addClass(opt.errorClass);
            }
            //最小输入长度限制
            if (opt.minLength !== "" && value.length < opt.minLength) {
                alert("最少输入" + opt.minLengt + "字符");
                elem.addClass(opt.errorClass);
            }

        },
        bindEvent: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            elem.on('focus', function() {
                var that = $(this);
                if (that.hasClass(opt.errorClass)) {
                    that.removeClass(opt.errorClass);
                }
                that.addClass(opt.activeClass);
            });
            elem.on('blur', function() {
                var that = $(this);
                if (that.hasClass(opt.activeClass)) {
                    that.removeClass(opt.activeClass);
                }
            });
            //自定义事件触发验证
            if (opt.vilidataEvent !== "") {
                elem.on(opt.vilidataEvent, function() {
                    me.valueVilidata();
                });
            }


        }
    });
})();

(function() {
    "use strict";

    $.widget('rkui.emailInput', $.rkui.baseInput, {
        options: {
            type: 'email',
            emailRegText: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
        },
        _create: function() {
            var me = this;
            me._super();
            me._bindEvent();
        },
        _init: function() {

        },
        _validataEmail: function(value) {
            var me = this;
            var opt = me.options;
            var vilidataResult;

            if (opt.emailRegText.test(value)) {
                vilidataResult = true;
            } else {
                vilidataResult = false;
            }
            return vilidataResult;
        },
        _bindEvent: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            //邮箱校验
            elem.on('blur', function(event) {
                var that = $(this);
                var last = event.timeStamp;
                setTimeout(function() {
                    var value = $.trim(that.val());
                    if (last - event.timeStamp === 0) {
                        if (!me._validataEmail(value)) {
                            alert("邮箱格式不正确");
                            that.val('');
                            that.addClass(opt.errorClass);
                        }
                    }
                }, 1000);
            });
        }
    });
})();

(function() {
    "use strict";

    $.widget('rk-ui.firstDemo', {
        options: {},
        _create: function() {

        },
        _init: function() {
            var me = this;
            var elem = me.element;

            elem.on('click', function() {
                elem.html('clicked!');
            });
        }
    });
})();

(function() {
    "use strict";

    $.widget('rkui.numberInput', $.rkui.baseInput, {
        options: {
            numberRegText: /^[-+]?[0-9]+(\.[0-9]+)?$/, //正负数，小数
            hasPrefix: '', //前缀
            hasSuffix: '', //后缀
            type: 'number'
        },
        _create: function() {
            var me = this;
            me._super();
            me._bindEvent();
        },
        _init: function() {

        },
        getValue: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;
            var val = elem.val();
            if (val !== "" && opt.hasPrefix !== "" && val.indexOf(opt.hasPrefix) === -1) {
                val = opt.hasPrefix + val;
            } else {
                val = val;
            }
            if (val !== "" && opt.hasSuffix !== "" && val.indexOf(opt.hasSuffix) === -1) {
                val = val + opt.hasSuffix;
            } else {
                val = val;
            }
            return val;
        },
        setValue: function(val) {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            if (opt.hasPrefix !== "") {
                elem.val(opt.hasPrefix + val);
            }
            if (opt.hasSuffix !== "") {
                elem.val(opt.hasSuffix + val);
            }
        },
        _vilidataNum: function(value) {
            var me = this;
            var opt = me.options;
            var vilidataResult;
            if (opt.numberRegText.test(value)) {
                vilidataResult = true;
            } else {
                vilidataResult = false;
            }
            return vilidataResult;
        },
        _bindEvent: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            //非数字判断
            elem.on('keyup', function(event) {
                var that = $(this);
                var last = event.timeStamp;
                setTimeout(function() {
                    var value = $.trim(that.val());
                    var len = value.length;
                    //获取值时，过滤掉前后缀
                    if (opt.hasPrefix !== "" && value.indexOf(opt.hasPrefix) > -1) {
                        value = value.substring(1, len);
                    }
                    if (opt.hasSuffix !== "" && value.indexOf(opt.hasSuffix) > -1) {
                        value = value.substring(0, len - 1);
                    }
                    if (last - event.timeStamp === 0) {
                        value = parseInt(value);
                        if (!me._vilidataNum(value)) {
                            alert("只能输入数字");
                            that.val('');
                            that.addClass(opt.errorClass);
                        }
                    }
                }, 1000);
            });
            elem.off('blur').on('blur', function() {
                var val = me.getValue();
                elem.val(val);
            });
        }
    });
})();

(function() {
    "use strict";

    $.widget('rkui.phoneInput', $.rkui.baseInput, {
        options: {
            type: 'phone',
            phoneRegText: /^1[34578]\d{9}$/
        },
        _create: function() {
            var me = this;
            me._super();
            me._bindEvent();
        },
        _init: function() {

        },
        _vilidataPhone: function(value) {
            var me = this;
            var opt = me.options;
            var vilidataResult;
            if (opt.phoneRegText.test(value)) {
                vilidataResult = true;
            } else {
                vilidataResult = false;
            }
            return vilidataResult;
        },
        _bindEvent: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            elem.on('blur', function(event) {
                var that = $(this);
                var last = event.timeStamp;
                setTimeout(function() {
                    var value = $.trim(that.val());
                    if (last - event.timeStamp === 0) {
                        if (!me._vilidataPhone(value)) {
                            alert("移动电话格式不正确");
                            that.val('');
                            that.addClass(opt.errorClass);
                        }
                    }
                }, 1000);
            });
        }
    });
})();

(function () {
    "use strict";
    $.widget('rkui.selectMenu',{
        options:{
            source:null
        },
        _create:function () {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            var addIcon = $('<a href="javascript:;" class="rk-ui-selectmenu-add"></a>');
            elem.append(addIcon);
            me._bindEvent();
        },
        _init:function () {
            var me = this;
            var elem = me.element;
            var opt = me.options;
        },
        _bindEvent:function () {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            //弹出下拉框ComboBox
            elem.on('click','a.rk-ui-selectmenu-add',function () {
               var that = $(this);
               var selectMenuComboBox = $('body').find('.rk-ui-selectmenu-combobox.rk-ui-selectmenu-open');
               if(selectMenuComboBox.size() > 0){
                   selectMenuComboBox.hide();
                   selectMenuComboBox.removeClass('rk-ui-selectmenu-open');
               }else{
                   me._showComboBox();
               }
            });
        },
        _showComboBox:function () {
            var me = this;
            var elem = me.element;
            var opt = me.options;
            var selectMenuComboBox = $('<div class="rk-ui-selectmenu-combobox"></div>');
            if($('body').find('.rk-ui-selectmenu-combobox').size() > 0){
                $('.rk-ui-selectmenu-combobox').show();
                $('.rk-ui-selectmenu-combobox').addClass('rk-ui-selectmenu-open');
            }else{
                $('body').append(selectMenuComboBox);
                selectMenuComboBox.addClass('rk-ui-selectmenu-open');
            }
            var  selectInput = elem.find('.rk-ui-selectmenu-input');
            console.log("1",selectInput.width);
            me._comboBoxSource();
            var selectInputOffset = selectInput.offset();
            var selectInputWidth = elem.width();
            $(selectMenuComboBox).css({
                "left":selectInputOffset.left,
                "top":selectInputOffset.top - 100,
                "width":selectInputWidth
            });

        },
        _comboBoxSource:function () {
            var me = this;
            var elem = me.element;
            var opt = me.options;
            var json = {
                status: 0,
                data: [{
                    id: 10207,
                    "label": [
                        {
                            id:1,
                            value:"亲切"
                        },
                        {
                            id:2,
                            value:"服务态度好"
                        },
                        {
                            id:3,
                            value:"效率高"
                        }
                    ]
                }]
            };
            var source = opt.source || json;
            var list = source.data[0].label;
            var sourceContent = $('<ul class="rk-ui-selectmenu-content"></ul>');
            for(var i = 0,len = list.length; i < len; i++){
                var html = '<li>'+
                         '<a href="javascript:;">'+list[i].value+'</a>'+
                         '</li>'
                sourceContent.append(html);
            }
            $('.rk-ui-selectmenu-combobox').append(sourceContent);
        }
    });
})();
(function() {
    "use strict";

    $.widget('rkui.telInput', $.rkui.baseInput, {
        options: {
            type: 'tel',
            telRegText: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
        },
        _create: function() {
            var me = this;
            me._super();
            me._bindEvent();
        },
        _init: function() {

        },
        _vilidataTel: function(value) {
            var me = this;
            var opt = me.options;
            var vilidataResult;
            if (opt.telRegText.test(value)) {
                vilidataResult = true;
            } else {
                vilidataResult = false;
            }
            return vilidataResult;
        },
        _bindEvent: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            elem.on('blur', function(event) {
                var that = $(this);
                var last = event.timeStamp;
                setTimeout(function() {
                    var value = $.trim(that.val());
                    if (last - event.timeStamp === 0) {
                        if (!me._vilidataTel(value)) {
                            alert("固定电话格式不正确");
                            that.val('');
                            that.addClass(opt.errorClass);
                        }
                    }
                }, 1000);
            });
        }
    });
})();

(function() {
    "use strict";

    $.widget('rkui.textarea', {
        options: {
            activeClass: 'rk-ui-state-active',
            disabledClass: 'rk-ui-state-disable',
            initClass: 'rk-ui-state-init',
            errorClass: 'rk-ui-state-error',
            width: 300,
            height: 50,
            maxLength: 500,
            minlength: null,
            autoHeight: true,
            showLable: true
        },
        _create: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            var textarea = elem.find('textarea');
            textarea.addClass(opt.initClass);
            elem.css({
                width: opt.width,
                height: opt.height
            });
            if (opt.autoHeight) {
                me._autoHeight();
            }
            me._bindEvent();
            me._showLabel();
        },
        _init: function() {

        },
        _autoHeight: function() {
            var me = this;
            var elem = me.element;

            var textarea = elem.find('textarea');
            var $this = textarea;
            if (!$this.attr('_initAdjustHeight')) {
                $this.attr('_initAdjustHeight', $this.outerHeight());
            }
            me._adjustH($this);
            me._adjustH($this).on('input', function() {
                me._adjustH($this);
            });
        },
        _adjustH: function(tag) {
            var $obj = tag;
            return $obj.css({ height: $obj.attr('_initAdjustHeight'), 'overflow-y': 'hidden' }).height(tag[0].scrollHeight);
        },
        _showLabel: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            me.size = 0;
            var labelElem = $('<div class="rk-ui-textarea-label"><span class="num">' + me.size + '</span><span>/</span><span>' + opt.maxLength + '</span></div>');
            if (opt.showLable) {
                elem.append(labelElem);
            }
            elem.find('textarea').on('keyup', function() {
                var textlength = $(this).val().length;
                me.size = textlength;
                elem.find('.num').text(me.size);
            });
        },
        _bindEvent: function() {
            var me = this;
            var elem = me.element;
            var opt = me.options;

            var textarea = elem.find('textarea');
            textarea.on('focus', function() {
                var $this = $(this);
                if ($this.addClass(opt.errorClass)) {
                    $this.removeClass(opt.errorClass);
                }
                $this.addClass(opt.activeClass);
            });
            textarea.on('blur', function() {
                var $this = $(this);
                if ($this.addClass(opt.activeClass)) {
                    $this.removeClass(opt.activeClass);
                }
            });

        }
    });
})();
