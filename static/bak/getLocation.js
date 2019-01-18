try {
	// 获取支付宝title的高度设置容器padding-top
	var isIPhone = win.navigator.appVersion.match(/iphone/gi);
	var titleHeight = 75;
	var screenWidth = screen.width;
	var screenHeight = screen.height;
	// if(isIPhone){
	//     if(screenWidth === 375 && screenHeight === 812){ // iPhoneX
	//         titleHeight += 188;
	//     }else if(screenHeight === 414 && screenHeight === 736){ // plus
	//         titleHeight += 125;
	//     }else{
	//         titleHeight += 55;
	//     }
	// }else{
	//     titleHeight += 0;
	// }
	if(isIPhone) {
		titleHeight = 75 * win.dpr;
		if(screenWidth === 375 && screenHeight === 812) { // iPhoneX 
			titleHeight += 88;
		}
	} else {
		titleHeight = 80;
	}
	//在手机支付宝中如果不需要tabbar透明则下列三行代码不需要添加
	//          $('.container, .container-error, .container-loading, .float-layer').css({
	//              "padding-top": titleHeight + 'px'
	//          });
	AlipayJSBridge.call('setTitleColor', {
		color: 16775138,
		reset: true
	});
	AlipayJSBridge.call("setBarBottomLineColor", {
		color: 14935011
	});

	// AlipayJSBridge.call('setOptionMenu', {
	//     menus: [{
	//         title: '我的',
	//         retDot: '-1',
	//         color: '#ff000000'
	//     }, {
	//         icon: ossPath+'user-icon.png',
	//         redDot: '-1',
	//         color: '#ff000000'
	//     }],
	//     override: true
	// });
	// AlipayJSBridge.call('showOptionMenu');
	// document.addEventListener('optionMenu', function(e) {
	//     // 点击"我的"统计
	//     win._hmt && win._hmt.push(['_trackEvent', provinceCode + '-领券中心-个人中心', 'clicked', '首页']);
	//     AlipayJSBridge.call('pushWindow', {
	//         url: '../userCoupon/showUserCenter?type=main&'+indexParams,
	//         param: {
	//             readTitle: true,
	//             showOptionMenu: false,
	//             titleBarColor: 16777215,
	//             pullRefresh: false,
	//             canPullDown: false
	//         }
	//     });
	// }, false);

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
		win._hmt && win._hmt.push(['_trackEvent', provinceCode + '-领券中心-帮助', 'clicked', '首页']);

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
	if("AlipayJSBridge is not defined" !== error.message){
		alert(error);
	}
	console.dir(error.message);
}


// 获取定位，设置顶部透明等
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
				// locationCode = '650100';  //测试代码，测试结束后需要删除
				provinceCode = parseInt(parseInt(result.cityAdcode) / 10000) * 10000;
				// provinceCode = parseInt(parseInt('650100')/10000)*10000;//测试代码，测试结束后需要删除
				var indexParams_Data = window.Util.localGet('indexParams');
				indexParams_Data = indexParams_Data.key;
				var indexParams_Array = indexParams_Data.split('&');
				var new_indexParams = indexParams_Array[0] + '&' + indexParams_Array[1] +
					'&provinceCode=' + locationCode +
					'&refresh=1';
				window.Util.localSet('indexParams', {
					key: new_indexParams
				});
			}
			// else if (result.hasOwnProperty('error')) {
			else {
				var this_indexParams = window.Util.localGet('indexParams');
				if(this_indexParams) {
					this_indexParams = this_indexParams.key;
					var province_indexParams = this_indexParams.split('&')[2];
					province_indexParams = province_indexParams.split('=')[1];
					locationCode = province_indexParams;
				}
			}
			callback(locationCode);
		});

	} else {
		locationCode = window.Util.getUrlParam('provinceCode');
		callback(locationCode);
	}
}