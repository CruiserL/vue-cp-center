(function(win, $){
    var Alert = win.alert;
    var ossPath = 'https://psbizweb-prod.oss-cn-hangzhou.aliyuncs.com/static/images/';
    win.alert = function(msg, cb, title){
        try {
            AlipayJSBridge.call('alert', {
                title: title || '领券中心',
                message: msg,
                button: '确定'
            }, function(){
                cb && cb();
            });
        } catch (error) {
            Alert(msg);
            cb && cb();
        }
    };
    
    // 工具类
    win.Util = {
        localSet: function(key, value){
            window.localStorage.setItem(key, JSON.stringify(value));
        },
        localGet: function(key){
            var value = window.localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        },
        getUrlParam: function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var value = window.location.search.slice(1).match(reg);
            if(value !== null) return decodeURI(value[2]);
            return null;
        },
        praseStrEmpty: function (str){
            if(!str || str=="undefined" || str=="null"){
                return "";
            }
            return str;
        },
        confirm: function(msg, time, cb){
            $('.confirm').remove();
            var $c = $('<div class="confirm">');
            var $c_box = $('<div class="confirm-box">');
            var $c_header = $('<div class="confirm-header"></div>');
            var $c_btn = $('<div class="confirm-footer">确定</div>');
            var btnCb = null;
            var closeCb = null;
            if(typeof msg === 'string'){
                $c_box.append($c_header, '<div class="confirm-body">'+msg+'</div>', $c_btn);
                btnCb = cb;
                closeCb = cb;
            }else{
                $c_btn.text(msg.okText);
                $c_box.append('<div class="confirm-title">'+msg.title+'</div>', $c_header, '<div class="confirm-body">'+msg.body+'</div>', $c_btn);
                btnCb = msg.btnCb;
                closeCb = msg.closeCb;
            }
            $c.append($c_box).appendTo('body');
            time && (this.timer = setTimeout(function(){
                $c.remove();
                $c = null;
                closeCb && closeCb();
            }.bind(this), time));
            $c.on('click', '.confirm-header', function(){
                $c.off().remove();
                $c = null;
                clearTimeout(this.timer);
                closeCb && closeCb();
            });
            $c.on('click', '.confirm-footer', function(){
                $c.off().remove();
                $c = null;
                clearTimeout(this.timer);
                btnCb && btnCb();
            }.bind(this), false);
            $c.on('touchmove',function(e){
                e.preventDefault();
            }, false);
        }
    };
    // 请求
    win.HttpService = {
        timeout: 15000,
        post: function(url, data, contentTypeValue, success, error, noResponse){
            var ajaxUrl = '';
            if (url.indexOf('cpiAreaCode') < 0) {
                var paramData = window.Util.localGet('indexParams').key;
                var paramArray = [];
                paramArray = paramData.split('&');
                ajaxUrl = url+'&'+paramArray[1];
            }
            else {
                ajaxUrl = url;
            }
            this._ajax(ajaxUrl, 'post', data || {}, contentTypeValue, success, error, noResponse);
        },
        get: function(url, data, contentTypeValue, success, error){
            var ajaxUrl = '';
            if (url.indexOf('cpiAreaCode') < 0) {
                var paramData = window.Util.localGet('indexParams').key;
                var paramArray = paramData.split('&');
                ajaxUrl = url+'&'+paramArray[1];
            }
            else {
                ajaxUrl = url;
            }
            this._ajax(url, 'get', data || {}, contentTypeValue, success, error);
        },
        handleSuccess: function(success, error, res, status){
            if(['SUCCESS', 'NO_DATA', '10000', '20000', '31023', 'USER_NULL', 'PREVIEW_COUPON_DISABLE', 'CDKEY_IS_NULL'].indexOf(res.returnCode) !== -1 ){
                
                if (res.returnCode === 'USER_NULL' && win.PAGE !== 'index') {
                    var urlData = res.data;
                    win.loadAuth.getAuth('authCallBack', urlData);
                    $('.container,.more,.error').hide();
                    // $('.container-error').show();
                }
                success(res);
            }
            // else if(res.returnCode === 'USER_NULL'){ // 为fix bug: 用户回话异常添加的逻辑
            //     var urlData = res.data;
            //     // if(win.PAGE === 'index'){
            //         // win.location.reload(true);
            //     // }
            //     else{
            //         win.loadAuth.getAuth('authCallBack', urlData);
            //         $('.container,.more,.error').hide();
            //         $('.container-error').show();
            //     }
            // }
            else{
                error && error(res.returnDesc);
            }
        },
        handleError: function(error, xhr, errorType, err){
            if(errorType === 'timeout'){
                alert('请求超时', error, '领券中心');
            }else{
                alert('服务异常', error, '领券中心');
            }
            error && error();
        },
        _ajax: function(url, type, data, contentTypeValue, success, error, noResponse){

            if (typeof contentTypeValue == "undefined" || contentTypeValue == null || contentTypeValue == "") {
                contentTypeValue = 'application/x-www-form-urlencoded';
            }
            $.ajax({
                url: url,
                type: type,
                data: data,
                async: true,
                dataType: 'json',
                contentType: contentTypeValue,
                timeout: this.timeout,
                cache: false,
                success: noResponse ? function(){} : this.handleSuccess.bind(this, success, error),
                error: noResponse ? function(){} : this.handleError.bind(this, error)
            });
        }
    };
    //加载用户授权请求
    win.loadAuth = {
        getAuth: function (callbackName, url) {
            AlipayJSBridge.call('showLoading', {
                text: '授权中',
                autoHide: true
            });
            var newUrl='';
            if (url == '') {
                var baseUri         = win.Util.getUrlParam('ali_user_auth_url'), 
                    scope           = win.Util.getUrlParam('scope'),
                    psalibackrandom = win.Util.getUrlParam('psalibackrandom'),
                    redirect_uri    = win.Util.getUrlParam('redirect_uri');
                newUrl = baseUri+'&scope='+scope+'&psalibackrandom='+psalibackrandom+'&redirect_uri='+redirect_uri;
            }
            else {
                newUrl = url;
            }
            $.ajax({
                url : newUrl,
                type : 'get',
                dataType : 'jsonp',
                jsonp : "callback",                 //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback : callbackName,     //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                success : function(result, textStatus, request) {
                    var pageUrl = result.data;
                    if (result.returnCode === '10000') {
                        AlipayJSBridge.call('hideLoading');
                        if ((win.location.href.indexOf('goToUserAuthWait') > 0) || (win.location.href.indexOf('goToUserAuthWaitOut') > 0)){
                            win.location.replace(pageUrl);
                        }
                        else {
                            win.location.replace(win.location.href);
                        }
                    }
                    else {
                        win.location.replace(pageUrl);
                    }
                },
                error : function(req, status, err) {
                    AlipayJSBridge.call('hideLoading');
                    var indexParams = window.Util.localGet('indexParams');
                    if(indexParams){
                        indexParams = indexParams.key;
                        indexParams = indexParams.split('&')[1]+'&'+indexParams.split('&')[2]
                    }
                    var urlParams = encodeURIComponent(baseUrl);
                    location.replace('../error/goToSystemError?'+indexParams+'&psbizweb_goToCoupon_page='+urlParams);
                    // AlipayJSBridge.call('pushWindow',{
                    //     url: '../error/goToSystemError?'+indexParams+'&psbizweb_goToCoupon_page='+urlParams
                    // });
                }
            });
        }
    };
})(window, $);
