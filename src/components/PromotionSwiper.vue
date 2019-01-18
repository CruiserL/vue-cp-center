<template>
	<div class="promsecwrapper" v-if="swiperList.length">
		<section id="promsec" v-cloak>
			<div class="typetitle promotion">
				活动专区
			</div>
			<div class="swiperswrapper" :style="{width: swiperWid + 'px'}" v-cloak>
				<div class="wrapper">
					<swiper :options="swiperList.length == 1? swiperOption1 :swiperOption" class="swiper-container" v-if="swiperList.length>0" ref="mySwiper">
						<!-- slides -->
						<swiper-slide data-test="100" class="swiper-item" v-for='item of swiperList' :key='item.mps20181214154906654125'><img class='swiper-img' :src='item.sourceUrl' :alt="item.mpiName" /></swiper-slide>
						<div class="swiper-pagination" slot="pagination"></div>
					</swiper>
				</div>
			</div>
		</section>
		<!--<div class="log">
		查看日志{{error}}
	</div>-->
	</div>
</template>
<script>
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	var clientWid = parseInt(document.documentElement.clientWidth * 92 / 100);
	export default {
		name: 'PromotionSwiper', //es6的写法，相当于data:function(){return{swiperOption:{}}}
		components: {
			swiper,
			swiperSlide
		},
		data() {
			var that = this;
			return {
				swiperOption: { // 参数选项,显示小点
					observer: true,
					notNextTick: true,
					//循环
					loop: true,
					//设定初始化时slide的索引
					initialSlide: 0,
					//自动播放
					autoplay: {
						delay: 1500,
						stopOnLastSlide: false,
						/* 触摸滑动后是否继续轮播 */
						disableOnInteraction: false
					},
					disableOnInteraction:false,
					//滑动速度
					width: clientWid,
					speed: 2000,
					//滑动方向
					direction: 'horizontal',
					on: {
						click: function() {
							that.goToPromUrl(this.realIndex);
						},
					},
					//分页器设置         
					pagination: {
						el: '.swiper-pagination',
						type: "fraction"
					}
				},
				swiperOption1: {
					loop: false,
					//滑动方向
					direction: 'horizontal',
					on: {
						click: function() {
							that.goToPromUrl(this.realIndex);
						},
					},
					//分页器设置         
					pagination: {
						el: '.swiper-pagination',
						type: "fraction"
					}
				},
				swiperList: [],
				error: "",
				promotionUrl: "/coupon/promotions",
				promotionParams: {
					ajax: "ajax",
					entry: window.Util.getUrlParam('entry') || 'icon',
					cpiAreaCode: "020102",
					provinceCode: window.locationCode,
					operatorCode: window.Util.getUrlParam('operatorCode') || ''
				},
				// sessionStatus标识返回页面时的session状态
				sessionStatus: true,
				swiperWid:  clientWid,

			}
		},
		props: [
			'sessionVal'
		],
		watch: {
			// 监听全局session状态
			sessionVal: async function() {
				if(this.sessionVal) {
					if(!this.sessionStatus) {
						console.log("重新加载轮播图列表开始");
//						this.processSesTimeout();
					}
				}
			}
		},
		methods: {
			// 轮播图跳转页面，回来时session失效，等待session成功后执行的逻辑
			processSesTimeout: async function() {
				promotionParam = qs.stringify(this.promotionParams);
				try {
					// promotionRes为后端返回的营销活动列表
					const {
						data: promotionRes
					} = await axios.post(this.promotionUrl + "?r=" + Math.random(), promotionParam);
					console.log(promotionRes);
					var promotionResData = promotionRes.data;
					var carouselList = null;

					if(promotionResData) {
						carouselList = promotionResData.carouselList;
					}
					// 如果轮播图数量大于三张，只取前三张
					if(carouselList) {
						if(carouselList.length > 3) {
							carouselList = carouselList.slice(0, 3);
						}
						this.swiperList = carouselList;
					}
				} catch(err) {
					console.log(err);
					if(err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
						alert('请求超时', function() {}, '领券中心');
					} else {
						alert('服务异常', function() {}, '领券中心');
					}
					AlipayJSBridge.call('hideLoading');
					//				this.error = err;
				}
			},
			goToPromUrl: function(index) {
				this.swiperHidden = true;
				console.log(this.swiperList[index].linkUrl);
				let imageIndex = parseInt(index) + 1;

				let thisTime = new Date().toLocaleString();
//				alert('_trackEvent' + window.locationCode + '-点击-轮播图-第' + imageIndex + '张' + 'exposure' + '首页' + thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-轮播图-第' + imageIndex + '张', 'exposure', '首页', new Date().toLocaleString()]);
				try {
					AlipayJSBridge.call('pushWindow', {
						// TODO: 考虑取不到值的情况
						url: this.swiperList[index].linkUrl,
						param: {
							readTitle: true,
							showOptionMenu: false,
							titleBarColor: 16777215,
							pullRefresh: false,
							canPullDown: false
						}
					});
				} catch(error) {
					console.log(error.message);
				}
			},
		},
		// you can find current swiper instance object like this, while the notNextTick property value must be true
		// 如果你需要得到当前的swiper对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的swiper对象，同时notNextTick必须为true
		computed: {
		},
		mounted() {
			document.addEventListener('resume', async function() {
				if(this.swiperHidden) {
					let promotionParam = {
						ajax: "ajax",
						entry: window.Util.getUrlParam('entry') || 'icon',
						cpiAreaCode: "020102",
						provinceCode: window.locationCode,
						operatorCode: window.Util.getUrlParam('operatorCode') || ''
					}
					promotionParam = qs.stringify(promotionParam);
					try {
						// promotionRes为后端返回的营销活动列表
						let promotionRes = await axios.post(this.promotionUrl + "?r=" + Math.random(), promotionParam);
						if(promotionRes.data.returnCode == 10000) {
							promotionRes = promotionRes.data;
							console.log(promotionRes);
							var promotionResData = promotionRes.data;
							var carouselList = null
							if(promotionResData) {
								carouselList = promotionResData.carouselList;
							}
							// 测试代码
							//				carouselList = carouselList.slice(0, 1);
							// 如果轮播图数量大于三张，只取前三张
							if(carouselList) {
								if(carouselList.length > 3) {
									carouselList = carouselList.slice(0, 3);
								}
								this.swiperList = carouselList;
							}
						} else if(promotionRes.data.returnCode == "USER_NULL") {
							this.sessionStatus = false;
						} else {
							AlipayJSBridge.call('hideLoading');
						}
					} catch(err) {
						console.log(err);
						if(err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
							alert('请求超时', function() {}, '领券中心');
						} else {
							alert('服务异常', function() {}, '领券中心');
						}
						AlipayJSBridge.call('hideLoading');
						//				this.error = err;
					}
					this.swiperHidden = false;
				}
			}.bind(this), false);

			//			document.addEventListener("visibilitychange", async function() {
			//				if(document.hidden == false) {
			//					if(this.swiperHidden) {
			//						// 相当于重走create。与creat方法的代码基本一致。
			//						let promotionParam = {
			//							ajax: "ajax",
			//							entry: window.Util.getUrlParam('entry') || 'icon',
			//							cpiAreaCode: "020102",
			//							provinceCode: window.locationCode,
			//							operatorCode: window.Util.getUrlParam('operatorCode') || ''
			//						}
			//						promotionParam = qs.stringify(promotionParam);
			//						try {
			//							// promotionRes为后端返回的营销活动列表
			//							const {
			//								data: promotionRes
			//							} = await axios.post(this.promotionUrl, promotionParam);
			//							console.log(promotionRes);
			//							this.$emit("loadSuccess", {
			//								promotionSwiper: true
			//							});
			//							var promotionResData = promotionRes.data;
			//							var carouselList = null
			//							if(promotionResData) {
			//								carouselList = promotionResData.carouselList;
			//							}
			//							// 测试代码
			//							//				carouselList = carouselList.slice(0, 1);
			//							// 如果轮播图数量大于三张，只取前三张
			//							if(carouselList) {
			//								if(carouselList.length > 3) {
			//									carouselList = carouselList.slice(0, 3);
			//								}
			//								this.swiperList = carouselList;
			//							}
			//						} catch(err) {
			//							console.log(err);
			//							if(err.message === 'timeout') {
			//								alert('请求超时', function() {}, '领券中心');
			//							} else {
			//								alert('服务异常', function() {}, '领券中心');
			//							}
			//							AlipayJSBridge.call('hideLoading');
			//							//				this.error = err;
			//						}
			//						this.swiperHidden = false;
			//					}
			//				}
			//			}.bind(this));
		},
//		activated() {
//			console.log(this.swiper);
//			this.swiper.update()
//		},
		async created() {
			let promotionParam = {
				ajax: "ajax",
				entry: window.Util.getUrlParam('entry') || 'icon',
				cpiAreaCode: "020102",
				provinceCode: window.locationCode,
				operatorCode: window.Util.getUrlParam('operatorCode') || ''
			}
			promotionParam = qs.stringify(promotionParam);
			try {
				// promotionRes为后端返回的营销活动列表
				const {
					data: promotionRes
				} = await axios.post(this.promotionUrl + "?r=" + Math.random(), promotionParam);
				console.log(promotionRes);
				this.$emit("loadSuccess", {
					promotionSwiper: true
				});
				var promotionResData = promotionRes.data;
				var carouselList = null
				if(promotionResData) {
					carouselList = promotionResData.carouselList;
				}
				// 测试代码
				//				carouselList = carouselList.slice(0, 1);
				// 如果轮播图数量大于三张，只取前三张
				if(carouselList) {
					if(carouselList.length > 3) {
						carouselList = carouselList.slice(0, 3);
					}
					this.swiperList = carouselList;
				}
			} catch(err) {
				console.log(err);
				if(err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
					alert('请求超时', function() {}, '领券中心');
				} else {
					alert('服务异常', function() {}, '领券中心');
				}
				AlipayJSBridge.call('hideLoading');
				//				this.error = err;
			}
		}
	}
</script>

<style scoped>
	.swiper-pagination-fraction {
		color: white;
		font-size: 0.22rem;
		/*font-family: PingFang-SC-Bold;*/
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		/*margin-bottom: 0.12rem;*/
		bottom: 0.12rem;
	}
	
	.swiper-container {
		height: 1.78rem;
	}
	
	.swiper-item {
		height: 1.78rem;
	}
	
	.swiper-img {
		width: 100%;
		height: auto;
		display: block;
	}
	/* 如果没有padding，则promsec区的margin会无法纳入到promsecwrapper中，原因未知*/
	
	.promsecwrapper {
		background: #FFFFFF;
		padding-bottom: 1px;
	}
	
	#promsec {
		text-align: center;
		background-color: #FFFFFF;
		padding-top: 0.34rem;
	}
	
	.promotion {
		margin: 0 auto 0;
		color: rgba(51, 51, 51, 1);
		width: 1.5rem;
		border-left: 1px solid rgba(102, 102, 102, 1);
		border-right: 1px solid rgba(102, 102, 102, 1);
	}
	
	.swiperswrapper {
		margin: 0.2rem 0.3rem 0.5rem;
		/*width: 6.9rem;*/
		height: 1.78rem;
		box-shadow: 0px 4px 6px 0px rgba(164, 164, 164, 0.6)
	}
	
	.swiperimg {
		max-width: 102%;
		height: auto;
	}
	
	.log {
		font-size: 0.3rem;
	}
</style>