<template>
	<div id="app">
		<Square @confirm="confirm" @loadSuccess="squareLoaded" :sessionVal="sessionVal"/>
		<PromotionSwiper @loadSuccess="swiperLoaded" :sessionVal="sessionVal"/>
		<Cascade @confirm="confirm" @loadSuccess="cascadeLoaded" :sessionVal="sessionVal"/>
		<FloatLayer :loaded="loaded" v-show="!loaded"/>
		<!--<FloatLayer :loaded="loaded"/>-->
		<Confirm :confirmInfo="cfmInfo" @confirmed="confirmed" ref="cfmPopup"/>
	</div>
</template>

<script>
	import Square from './components/Square'
	import PromotionSwiper from './components/PromotionSwiper'
	import Cascade from './components/Cascade'
	import Confirm from './components/Confirm'
	import FloatLayer from './components/FloatLayer'

	export default {
		name: 'App',
		data() {
			return {
				// 弹框显示信息
				cfmInfo: {
					showConfirm: false,
					confirmText: "这张券太火爆了"
				},
				squareLoading: false,
				swiperLoading: false,
				cascadeLoading: false,
				scrollStatus: true
			}
		},
		props: [
			'sessionVal'
		],
		components: {
			Confirm,
			Square,
			PromotionSwiper,
			Cascade,
			FloatLayer
		},
		async created () {

			let sitedUrl = "/coupon/goGetMDSiteId?r=" + Math.random();
			let cascadeParam = {
				ajax: "ajax"
			};
				cascadeParam = qs.stringify(cascadeParam);

				try { //查询百度埋点相关信息
					const {
						data: sitedRes
					} = await axios.post(sitedUrl, cascadeParam);
//					console.log(sitedRes);
					if(sitedRes.code === "SUCCESS" || sitedRes.returnCode === "SUCCESS"){
						let hm = document.createElement("script");
	   					hm.src = "https://hm.baidu.com/hm.js?" + sitedRes.data;
	   					let s = document.getElementsByTagName("script")[0]; 
	   					s.parentNode.insertBefore(hm, s);
					}
				} catch(err) {
					console.dir(err.message);
					if(err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
						alert('请求超时', function() {}, '领券中心');
					} else {
						alert('服务异常', function() {}, '领券中心');
					}
					// AlipayJSBridge.call('hideLoading');
				}
		},
		mounted () {
			window.addEventListener('scroll', this.scrollDs)
		},
		computed:{
			loaded: function(){
				if(this.squareLoading && this.swiperLoading && this.cascadeLoading){
					document.querySelector(".floatlayer").style.display = "none"
				}
				return this.squareLoading && this.swiperLoading && this.cascadeLoading
			}
		},
		methods: {
			// 收到子组件发起的confirm事件，则唤起confirm弹窗，3s后自动关闭
			confirm: function(param) {
				this.cfmInfo.confirmText = param.confirmText;
				this.cfmInfo.confirmTitle = param.confirmTitle;
				this.cfmInfo.OKText = param.OKText;
				this.cfmInfo.timeout = param.timeout;
				this.cfmInfo.cpInfo = param.cpInfo;
				//				const {cfmInfo} = param;
				//				this.cfmInfo = cfmInfo;
				console.log(this.cfmInfo);
				this.cfmInfo.showConfirm = true;
				param.timeout ? null : this.timer = setTimeout(this.returnOrigin, 3000);
				
			},
			// 自动还原
			returnOrigin: function() {
				this.cfmInfo.showConfirm = false;
			},
			// confirm框点击了确认或关闭
			confirmed: function(param) {
				this.cfmInfo.showConfirm = false;
				clearTimeout(this.timer);
			},
			squareLoaded: function(param) {
				this.squareLoading = param.square;
				console.log("squareLoaded");
			},
			swiperLoaded: function(param) {
				this.swiperLoading = param.promotionSwiper;
				console.log("swiperLoaded");
			},
			cascadeLoaded: function(param) {
				this.cascadeLoading = param.cascade;
				console.log("cascadeLoaded");
			},
			scrollDs() {
				if (this.scrollStatus) {
					let scrollHeight = window.pageYOffset,
                	documentHeight = document.body.offsetHeight,
                	winHeight = document.documentElement.clientHeight;
                	if (scrollHeight + winHeight + 50 >= documentHeight) {
                		this.scrollStatus = false;
                		let thisTime = new Date().toLocaleString();
//              		alert('_trackEvent'+ window.locationCode +'-露出-领券中心-底部更多福利，敬请期待'+ 'exposure'+'首页'+ thisTime);
                		window._hmt && window._hmt.push(['_trackEvent', window.locationCode +'-露出-领券中心-底部更多福利，敬请期待', 'exposure', '首页', new Date().toLocaleString()]);
                	}
				}
            }
		}
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
	}
</style>