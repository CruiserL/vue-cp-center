// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
window.Vue = Vue
import axios from 'axios'
window.axios = axios;
axios.defaults.timeout = 15000;
// 关闭axios所有接口缓存
axios.defaults.headers["Cache-Control"] = "no-cache";

import qs from 'qs';
window.qs = qs;
let globalVue = null;
//// TODO：测试代码，记得删除
//
// 引入vConsole并初始化
//import vConsole from 'vconsole';
//new vConsole();
//axios.defaults.baseURL = 'http://172.30.82.82:8083';
//window.locationCode = "000000";
//// 暂时绕开授权和获取定位
//globalVue = newVue();
//
//// TODO：测试代码end

// 应该不用此属性
Vue.prototype.HOST = '/api'
import VueAwesomeSwiper from 'vue-awesome-swiper' // require stylesimport 'swiper/dist/css/swiper.css'Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.use(VueAwesomeSwiper)
import 'swiper/dist/css/swiper.css'
import App from './App'

Vue.config.productionTip = false

// 重试次数相关：暂时无用
let retryMaxTimes = 100
let retryTimes = 0;
var test = false;
var time = 0;

var ossPath = 'https://psbizweb-prod.oss-cn-hangzhou.aliyuncs.com/static/images/';
var win = window;

(function(win, $) {
	try {

		win.init = init;
		win.PAGE = 'index';
		win.couponList = [];
		win.cpiId = '';
		win.pageStatus = 'load';

		function init() {
			// 添加响应拦截器
			// 熟悉promise对象之后，回头来看看这个逻辑
			axios.interceptors.response.use(function(response) {
				let requestUrl = response.config.url;
				//				// TODO：测试代码，记得删除
				//				if(requestUrl.indexOf("userAuth/verify") > 0) {
				//					console.log("userAuth/verify");
				//					response.data.returnCode = "USER_NULL";
				//				}
				//				// TODO：测试代码，记得删除
				// 如果接口返回"USER_NULL",则重发两个请求：
				// 请求重新授权
				// 请求重新获取接口数据
				if(response.data.returnCode === "USER_NULL") {
					// 两种情况下"USER_NULL"，则重刷页面
					// 1.初进页面请求授权时
					// 2.请求列表时
					// TODO: 是否需要考虑最终状态刷新时的USER_NULL及类目信息、营销位信息返回失败的USER_NULL
					if(requestUrl.indexOf("userAuth/verify") > 0 || requestUrl.indexOf("getCouponListByArea") > 0) {
						getUserAuth(response.data.data, true);
						return response;
					} else {
						// 其他情况不重刷页面，只重新请求授权
						getUserAuth(response.data.data, false);
						globalVue.sessionValidity = false;
						return response;
					}
					// 这里需要保证是同步
					// 重新发送授权请求，只请求对应的数据
					//					return new Promise(function() {
					//						axios.post(response.config.url, response.config.data).then(res => {
					//							resolve(res)
					//						})
					//					})
				} else if(response.data.returnCode == "SYSTEM_ERROR") {
					if(requestUrl.indexOf("userAuth/verify") > 0) {
						return response;
					} else {
						// 通知confirm组件弹窗
						let confirmObj = globalVue.$children[0].$refs.cfmPopup.confirmObj;
						confirmObj.confirmTitle = "";
						confirmObj.OKText = "";
						confirmObj.confirmText = response.data.returnDesc;
						confirmObj.showConfirm = true;
						return response;
					}
				} else {
					return response;
				}
				// 不能异步调用，否则后续接口会调url is not defined，原因未知
				// 异步调用会直接透过拦截器，不会等待异步执行结果，需要使用promise包装。
				//	await axios.post(USER_AUTH_URL);
				//	const reResponse = await axios.post(response.config.url, response.config.data);
				//	return reResponse;
			}, function(error) {
				// 对响应错误做点什么
				//	return Promise.reject(error);
			});

			var ossPath = 'https://psbizweb-prod.oss-cn-hangzhou.aliyuncs.com/static/images/';
			var provinceCode = '000000';
			var indexParams = window.Util.localGet('indexParams');
			//var sys_tips = '<p class="system_tips" style="line-height: 0.4rem;font-size: 0.32rem;text-align: center;color: #999999;">系统将于2018-10-25日3:00-4:00维护</p>';
			if(indexParams) {
				indexParams = indexParams.key;
				indexParams = indexParams.split('&')[1] + '&' + indexParams.split('&')[2]
			}
			// 专设首页刷新
			$('#error-refresh').off('click').on('click', function() {
				window.location.reload(true);
				document.body.scrollTop = document.documentElement.scrollTop = 0;
			});

			loadPage();

			function loadPage() {
				var pathParam = win.Util.getUrlParam('user_auth');
				if(parseInt(pathParam) == 10000) {
					$('.float-layer h2').text('一大波券正在赶来的路上···');
				} else {
					$('.float-layer h2').text('正在授权登录,请您稍等……');
				}
				loadAuth();
			}

			function loadAuth() {
				var urlPath = win.location.href;
				axios.post("/userAuth/verify?ajax=ajax&r=" + Math.random() + "&" + indexParams).then(function(res) {
					//					globalVue.sessionValidity = true;
					if(res.data.returnCode === '10000') {
						getUserLocation(function(locationCode) {
							win.locationCode = locationCode;
							globalVue = newVue();
						})
					} else if(res.data.returnCode === "SYSTEM_ERROR") {
						toError();
					}
				}).catch(function(err) {
					if(err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
						alert('请求超时', function() {}, '领券中心');
					} else {
						alert('服务异常', function() {}, '领券中心');
					}
					try {
						AlipayJSBridge.call('hideLoading');
					} catch(e) {}
				})
			}
			// 检验是否请求全部完成
			function checkLoaded(the_coupon_html) {
				if(the_coupon_html !== '') {
					$('.more,.error').remove();
					$('<div class="more">').text('更多福利，敬请期待......').appendTo('body');
				} else {
					$('.more,.error').remove();
					$('<div class="error">').text('暂无优惠券，敬请期待').appendTo('body');
				}
				/* 开始埋点检测 */
				//				win.index_buired_point && win.index_buired_point();
			}

			//首次加载进行授权操作
			function getUserAuth(authUrl, ajaxType) {
				var urlPath = win.location.href;
				$.ajax({
					url: authUrl,
					type: 'get',
					dataType: 'jsonp',
					jsonp: "callback",
					jsonpCallback: 'authCallBack',
					success: function(result, textStatus, request) {
						var pageUrl = result.data;
						if(result.returnCode === '10000') {
							// ajaxType代表是否重刷页面，true时重刷，false时不重刷只重新请求数据
							if(ajaxType) {
								getUserLocation(function(locationCode) {
									console.log(locationCode);
									win.locationCode = locationCode;
									globalVue = newVue();
								});
							}
							// 通知对应的接口重新请求数据
							else {
								globalVue.sessionValidity = true
							}
						} else {
							// 原写法
							//							win.location.replace(pageUrl);
							// 不再跳转页面，改为提醒用户系统异常
							AlipayJSBridge.call('hideLoading');
							win.Util.confirm('系统异常，请稍候再试', false, function(){});
//							// 跳转返回的错误页面
//							AlipayJSBridge.call('pushWindow', {
//								url: pageUrl,
//								param: {
//									transparentTitle: "none",
//									closeCurrentWindow: true
//								}
//							});
						} 
					},
					error: function(req, status, err) {
						var logParam = {
	                        'userAuthUrl': encodeURIComponent(authUrl)
	                    }
						logParam = qs.stringify(logParam);
						axios.post('/coupon/writelog?ajax=ajax&r=' + Math.random(), logParam);
						toError();
//						alert("authUrl: " + authUrl);
					}
				});
			}

			// 跳开小差页面

			function toError() {
				try {
					var urlParams = encodeURIComponent(win.location.href);
					AlipayJSBridge.call('hideLoading');
					AlipayJSBridge.call('pushWindow', {
						url: '../error/goToSystemError?__webview_options__=transparentTitle%3Dnone&psbizweb_goToCoupon_page=' + urlParams,
						param: {
							closeCurrentWindow: true
						}
					});
				} catch(error) {
					console.log(error.message);
				}
			}

			//地理定位
			function getUserLocation(callback) {
				var locationCode = '000000',
					pageUrl = win.location.href;
				// 根据网址链接中是否存在entry关键字判断是否需要进行定位
				if(pageUrl.indexOf('entry') >= 0) {
					AlipayJSBridge.call('getCurrentLocation', {
						requestType: 2,
						bizType: 'didi'
					}, function(result) {
						// 根据网址链接中是否存在entry关键字判断是否需要进行定位
						if(result.hasOwnProperty('cityAdcode')) {
							locationCode = result.cityAdcode;
							// TODO：这里需要改成110100这样的？？
							provinceCode = parseInt(parseInt(result.cityAdcode) / 10000) * 10000;
							var indexParams_Data = window.Util.localGet('indexParams');
							indexParams_Data = indexParams_Data.key;
							var indexParams_Array = indexParams_Data.split('&');
							var new_indexParams = indexParams_Array[0] + '&' + indexParams_Array[1] +
								'&provinceCode=' + locationCode +
								'&refresh=1';
							window.Util.localSet('indexParams', {
								key: new_indexParams
							});
						} else {
							var this_indexParams = window.Util.localGet('indexParams');
							if(this_indexParams) {
								this_indexParams = this_indexParams.key;
								var province_indexParams = this_indexParams.split('&')[2];
								province_indexParams = province_indexParams.split('=')[1];
								locationCode = province_indexParams;
							}
						}
						// ajax请求根据城市码获取券列表
						callback(locationCode);
					});

				} else {
					locationCode = window.Util.getUrlParam('provinceCode');
					// ajax请求根据城市码获取券列表
					callback(locationCode);
				}
			}

			try {
				// 获取支付宝title的高度设置容器padding-top
				// var isIPhone = win.navigator.appVersion.match(/iphone/gi);
				// var titleHeight = 75;
				// var screenWidth = screen.width;
				// var screenHeight = screen.height;
				// if (isIPhone) {
				//     titleHeight = 75 * win.dpr;
				//     if (screenWidth === 375 && screenHeight === 812) { // iPhoneX
				//         titleHeight += 88;
				//     }
				// } else {
				//     titleHeight = 80;
				// }
				// //在手机支付宝中如果不需要tabbar透明则下列三行代码不需要添加
				// $('.container, .container-error, .container-loading, .float-layer').css({
				//     "padding-top": titleHeight + 'px'
				// });
				AlipayJSBridge.call('setTitleColor', {
					color: 16775138,
					reset: true
				});
				AlipayJSBridge.call("setBarBottomLineColor", {
					color: 14935011
				});

				// 临时改为帮助入口
				AlipayJSBridge.call('setOptionMenu', {
					menus: [{
						title: '帮助',
						redDot: '-1',
						color: '#ff000000'
					}, {
						icon: ossPath + 'help-icon.png',
						redDot: '-1',
						color: '#ff000000'
					}],
					override: true
				});
				AlipayJSBridge.call('showOptionMenu');
				document.addEventListener('optionMenu', function(e) {
					// 点击"帮助"统计
					//					alert('_trackEvent' + window.locationCode + '-领券中心-帮助' + 'clicked' + '首页');
					win._hmt && win._hmt.push(['_trackEvent', window.locationCode + '-领券中心-帮助', 'clicked', '首页']);

					window.Util.localSet('couponid', {
						key: ''
					});
					AlipayJSBridge.call('pushWindow', {
						url: '../userCoupon/showUserCenter?type=help&' + indexParams,
						param: {
							readTitle: true,
							showOptionMenu: false,
							titleBarColor: 16777215,
							pullRefresh: false,
							canPullDown: false
						}
					});
				}, false);
			} catch(error) {
				if("AlipayJSBridge is not defined" !== error.message) {
					console.log(error);
				}
				console.dir(error.message);
			}
		}
	} catch(indexErr) {
		if("AlipayJSBridge is not defined" !== error.message) {
			console.log(error);
		}
		console.dir(error.message);
	}

})(window, $);

// 执行new Vue()构造方法：
function newVue() {
	return new Vue({
		el: '#app',
		components: {
			App
		},
		template: '<App :sessionVal="sessionValidity"/>',
		data: {
			// 接收支付宝回调返回的授权结果，静默授权成功时置true
			sessionValidity: false
		},
	});
}
