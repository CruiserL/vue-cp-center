<template>
	<section id="cascadeflow">
		<div class="subtypeswrapper">
			<div class="subtype">
				<div class="subtypeicon"><img class="subtypeimg" src="./../../static/img/grab.png" /></div>
				<div class="subtypename">必抢券</div>
			</div>
		</div>
		<div class="couponlistwrapper">
			<Coupon v-for="(cp, cpIdx) of cascadeList" :key="cp.cpiId" :couponInfo="cp" :sessionVal="sessionVal" :cpdescwrapperbool.sync="cpDisplayList[cpIdx]" :cpIndex="cpIdx" @descDisplay="showDesc" @confirm="confirm" @cascadePushWin="pushWd"></Coupon>
		</div>
		<div class="more">
			<div class="tapbar">

				<!--{{cascadeList.length == 0? '暂无优惠券，敬请期待': "更多福利，敬请期待......"}}-->
				<span class="commonques" @click="toQuestion">常见问题</span><span class="separator">
				
			</span><span class="colabration" @click="toColaborate">商务合作</span>
			</div>
			<div class="servicename">
				- 北京高阳捷迅信息技术有限公司 提供服务 -
			</div>
		</div>
	</section>
</template>

<script>
	import Coupon from './Coupon'

	export default {
		name: 'Cascade', //es6的写法，相当于data:function(){return{swiperOption:{}}}
		components: {
			Coupon
		},
		props: [
			'sessionVal'
		],
		data() {
			return {
				moreText: "更多福利，敬请期待......",
				cascadeList: [],

				cpDisplayList: [

				],
				hr: 12,
				min: 60,
				sec: 60,
				cbiCountDown: true,
				cpIdxTemp: -1,
				showCD: true,
				cpListUrl: "/coupon/getCouponListByArea",
				cpFinalListUrl: "/coupon/getAllCouponFinalStatus",
				cascadeHidden: false,
			}
		},

		computed: {
			dashOffsetCircle: function() {
				return this.percent();
			},
			//			cascadeListCmpt: function(){
			//				this.cascadeList
			//			},
			//			cbiCountDown: function{
			//				return 
			//			}
		},
		//		watch:{
		//			cascadeList: function(){
		//				console.log(this.cascadeList);
		//			}
		//		},
		mounted() {},
		methods: {
			pushWd: function() {
				this.cascadeHidden = true;
			},
			percent: function(percent) {
				return 134 - 134 * percent / 100;
			},
			showDesc: function(cpIdx) {
				// idx才是获得的券的index值
				var idx = cpIdx.couponIdx;
				if(idx !== this.cpIdxTemp) {
					this.cpDisplayList = [];
					Vue.set(this.cpDisplayList, idx, true);
				} else {
					Vue.set(this.cpDisplayList, idx, !this.cpDisplayList[idx]);
				}
				this.cpIdxTemp = idx;
			},

			confirm: function(param) {
				this.$emit("confirm", param);
			},
			async reloadCouponStatus() {
				console.log(163);

			},
			// 点击常见问题
			toQuestion: function() {
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-领券中心-常见问题', 'clicked', '首页']);
				window.Util.localSet('couponid', {
					key: ''
				});
				AlipayJSBridge.call('pushWindow', {
					url: '../userCoupon/showUserCenter?type=help',
					param: {
						readTitle: true,
						showOptionMenu: false,
						titleBarColor: 16777215,
						pullRefresh: false,
						canPullDown: false
					}
				});
			},
			// 点击商务合作
			toColaborate: function() {
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-领券中心-商务合作', 'clicked', '首页']);
				AlipayJSBridge.call('pushWindow', {
					url: '../userCoupon/showUserCenter?type=back',
					param: {
						readTitle: true,
						showOptionMenu: false,
						titleBarColor: 16777215,
						pullRefresh: false,
						canPullDown: false
					}
				});
			}
		},
		async created() {
			let cascadeParam = {
				ajax: "ajax",
				entry: window.Util.getUrlParam('entry') || 'icon',
				cpiAreaCode: "020101",
				provinceCode: window.locationCode,
				operatorCode: window.Util.getUrlParam('operatorCode') || ''
			};
			cascadeParam = qs.stringify(cascadeParam);

			try {
				// cpListRes为券列表信息返回结果
				// console.log(cpListRes);
				const {
					data: cpListRes
				} = await axios.post(this.cpListUrl + "?r=" + Math.random(), cascadeParam);
				// TODO：测试代码，记得删除
				//				cpListRes.returnCode = "NO_DATA";

				if(cpListRes.returnCode == "10000") {
					// 数据请求正常，可以正常渲染页面
					this.cascadeList = cpListRes.data;
					// 列表返回即通知父组件此组件渲染完成
					this.$emit("loadSuccess", {
						cascade: true
					});
					// 此后再执行查询最终状态操作，如果此步骤中出错，直接弹窗系统异常
					const {
						data: cpFinalListRes
					} = await axios.post(this.cpFinalListUrl + "?r=" + Math.random(),
						cpListRes.data
					);
					if(cpFinalListRes.data) {
						//						var testArr = cpFinalListRes.data;
						//						var testArr = testArr.slice(0, cpFinalListRes.length-1);
						this.cascadeList = cpFinalListRes.data;
						//						this.cascadeList = this.cascadeList.filter(function(element, index, array){
						//							return (element.cbiStatus != null);
						//						});
					}
				} else if(cpListRes.returnCode == "NO_DATA") {
					// 返回结果为NO_DATA，则直接使用空数组来渲染页面，且通知父组件此组件渲染完成
					this.$emit("loadSuccess", {
						cascade: true
					});
				}
			} catch(err) {
				if(err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
					alert('请求超时', function() {}, '领券中心');
				} else {
					alert('服务异常', function() {}, '领券中心');
				}
				AlipayJSBridge.call('hideLoading');
			}
		}
	}
</script>

<style scoped>
	/* 瀑布区 start */
	
	.cascadeflow {}
	
	.subtypeswrapper {
		padding: 0 0.3rem;
		overflow-x: hidden;
		background: #FFFFFF;
	}
	
	.subtype {
		display: inline-block;
		line-height: 0.54rem;
		float: left;
		padding: 0.08rem 0;
		border-bottom: 0.06rem solid rgba(26, 96, 237, 1);
	}
	
	.subtypeicon {
		background: url(../../static/img/square.png) center center no-repeat;
		background-size: 90% 90%;
		height: 0.28rem;
		width: 0.28rem;
		line-height: 0.28rem;
		float: left;
	}
	
	.subtypeimg {
		width: 100%;
		height: 100%;
		display: block;
	}
	
	.subtypename {
		float: left;
		width: 0.9rem;
		height: 0.28rem;
		font-size: 0.28rem;
		line-height: 0.28rem;
		/*font-family: PingFang-SC-Bold;*/
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
		font-weight: bold;
		color: rgba(26, 96, 237, 1);
		/*line-height: 0.90rem;*/
	}
	
	.couponlistwrapper {
		padding: 0.1rem 0.2rem;
		background: rgba(241, 241, 241, 1);
	}
	
	.activebar {
		clear: both;
		height: 0.06rem;
	}
	
	.more {
		/*height: 0.6rem;*/
		text-align: center;
		font-size: 0.2rem;
		color: #999;
		margin-top: 1.14rem;
		margin-bottom: 0.52rem;
		letter-spacing: 1px;
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
	}
	
	.colabration {
		color: #108EE9;
		display: inline-block;
		width: 1.5rem;
		/*margin: 0 auto;*/
		/*border-left: 1px solid #108EE9;*/
	}
	
	.commonques {
		color: #108EE9;
		width: 1.5rem;
		display: inline-block;
		/*margin: 0 auto;*/
	}
	
	.separator {
		border-left: 1px solid #108EE9;
	}
	
	.tapbar {
		display: flex;
		justify-content: center;
	}
	/* 瀑布区 end */
</style>