<template>
	<div class="couponinfowrapper" v-if="cp.cbiStatus !== 5">
		<div class="vuecouponwrapper">
			<div class="vuecouponinfo">
				<div class="scriptbar">
						<div class="couponlabel" v-if="cp.cpiSuperscript">
							{{cp.cpiSuperscript}}
						</div>
					</div>
				<div class="facevaluezone">
					
					<div class="facevaluediv" @click="logCp(cp)">
						<div class="couponfacevalue" v-if="cp.couponTypeId === 2 || cp.couponTypeId === 1">{{cp.cbiFaceValue}}</div><span class="unit" v-if="cp.couponTypeId === 2">元</span><span class="unit" v-if="cp.couponTypeId === 1">折</span>
						<div class="couponfacevalue" v-if="cp.couponTypeId === 4">兑</div>
						<div class="couponfacevalue" v-if="cp.couponTypeId === 3">特</div>
					</div>
				</div>
				<div class="contentzone">
					<div class="cpname">
						{{cp.cpiDesc}}
					</div>
					<div class="cpsubdesc">
						{{cp.cpiSubDesc}}
					</div>
					<div class="cptime">
						有效期：{{cp.cbiVStartTime}}-{{cp.cbiVEndTime}}
						<!--有效期：{{cp.cbiVStartTime? cp.cbiVStartTime: "2018.12-13"}}-{{cp.cbiVEndTime?cp.cbiVEndTime: "2018.12-13"}}-->
					</div>
					<div class="cpdesc">
						<div class="cpdesctitle" @click="displayDesc">
							<span class="cpdesctitlename">
									详细信息	
								</span>
							<span class="cpdesctitlenameimg"><img v-show="!cpdescwrapperbool" src="../../static/img/down.png"/><img v-show="cpdescwrapperbool" src="../../static/img/up.png"/></span>
						</div>
					</div>
				</div>
				<div class="receivezone" v-if="cp.cbiServiceMode === 3">
					<div class="receiveicon" :class="{countdowndiv: cp.cbiStatus === 1 || cp.cbiStatus === 4}">
						<div class="countdownwrapper" v-if="cp.cbiStatus===1">
							<div class="countdownline1">
								距开抢还剩
							</div>
							<div class="countdownline2">
								<!--10:20:59-->
								<span class="hour">{{hr}}</span><span class="colon">:</span><span class="hour">{{min}}</span><span class="colon">:</span><span class="hour">{{sec}}</span>
							</div>
							<div class="countdownline3">
								限量<span>{{cp.limitedQuantity}}</span>张
							</div>
							<div class="countdownline4" @click="waitToGet(cp)">
								等待开抢
							</div>
						</div>
						<div class="circlebar" v-if="cp.cbiStatus===2">
							<svg viewBox="0 0 100 100">
								<circle cx="50" cy="50" r="32" fill="none" stroke="#CFDFFF" stroke-width="6" stroke-dasharray="134 200" stroke-linecap="round" />
								<circle cx="50" cy="50" r="32" fill="none" stroke="#1A60ED" stroke-width="6" stroke-dasharray="134 2000" :stroke-dashoffset="134-134*parseInt(cp.remainQuantity)/100" stroke-linecap="round" />
							</svg>
							<div class="residue">
								<div class="residue_title">剩余</div>
								<div class="residue_num">
									{{cp.remainQuantity? cp.remainQuantity : "100%"}}
								</div>
							</div>
						</div>
						<!--<img v-if="cp.cbiStatus===1" src="./../../static/img/seizing.png">-->
						<img v-if="cp.cbiStatus===3" src="./../../static/img/received.png">
						<!-- @click="receiveCp(cpIndex)"-->
						<img v-bind:class="{seizeover: cp.cbiStatus===4}" v-if="cp.cbiStatus===4" src="./../../static/img/seizeover.png">
						<!--<CountDown :cpiEndTime="cp.cpiEndTime" :cpIdx="cpIdx" v-if="cp.cbiStatus===5 && !cp.showCD" @countdown="getCountDown"></CountDown>-->
						<!--// 4 新用户-->

						<!--<img v-if="cp.cbiStatus===4" src="./../../static/img/newuser.png">-->

					</div>
					<!--<div class="receivebtn" v-bind:class="{newuser: cp.cbiStatus === 4}" v-if="cp.cbiStatus!==3 && cp.cbiStatus !==5">
						{{cp.cpiButtonName}}
					</div>-->
					<!--<div class="receivebtn" @click="receiveCp(index)" v-if="cp.cbiStatus === 1">{{cp.cpiButtonName}}</div>-->
					<div class="receivebtn" :class="{greybtn: !cp.cpiId}" @click="receiveCp(cpIndex)" v-if="cp.cbiStatus === 2">{{cp.cpiButtonName}}</div>
					<div class="receivebtn" :class="{greybtn: !cp.cpiId}" @click="toUse(cp)" v-if="cp.cbiStatus === 3 && cp.couponSubTypeId !== 2">去使用</div>
					<div class="receivebtn" @click="toExchage(cp)" v-if="cp.cbiStatus === 3 && cp.couponSubTypeId == 2">去查看</div>
					<!--<div class="receivebtn" :class="{greybtn: cp.cbiStatus === 4}" v-if="cp.cbiStatus === 4">已抢完</div>-->

				</div>
				<div class="receivezone" v-if="cp.cbiServiceMode === 1">
					<div class="receiveicon">
						<img :src="cp.cpiIconUrl" />
					</div>
					<div class="receivebtn" v-if="cp.cbiServiceMode === 1" @click="toLinkUrl(cp,cp.cbiLinkUrl)">{{cp.cpiButtonName}}</div>
				</div>
			</div>
		</div>
		<div class="cpdescwrapper" v-bind:class="{cpdescwrapperon: cpdescwrapperbool}">
			<div class="cpdesczone">
				<ul class="descul">
					<li class="descli" v-for="descitem of cp.cbiSummary.replace(/&nbsp;/ig, ' ').split('<br/>')">
						{{descitem}}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Coupon', //es6的写法，相当于data:function(){return{swiperOption:{}}}
		props: [
			'couponInfo',
			"cpdescwrapperbool",
			'cpIndex',
			'sessionVal'
		],
		data() {
			return {
				cpiCountEndTime: this.cpiEndTime,
				hr: 12,
				min: 60,
				sec: 60,
				cbiCountDown: false,
				cp: this.couponInfo,
				cpdescbool: this.cpdescwrapperbool,
				indexParams: window.Util.localGet('indexParams').key,
				// 标识方块区是否有某个券领取失败
				receiveStatus: false,
				// 标识从外部页面返回时是否session失效
				outStatus: false,
				/* 标识瀑布流显示状态，为true时此券（瀑布流被隐藏），为false时未隐藏,
				 * 此外，如果出现了添加卡包，也一样会使此值置true
				 * 这种情况下，如果出现了添加卡包然而没有点击添加，则后续再点击其他券添加卡包后再返回，会重新请求此券状态。
				*/
				cascadeHidden: false,
				cpListUrl: "/coupon/getCouponListByArea",
				cpFinalListUrl: "/coupon/getAllCouponFinalStatus",
			}
		},
		watch: {
			sessionVal: function() {
				console.log("session状态改变");
				if(this.sessionVal) {
					console.log("重新加载券开始");
					if(this.receiveStatus) {
						this.processSesTimeout();
						this.receiveStatus = false;
					} else if(this.outStatus) {
						this.processSesTimeout();
						this.outStatus = false;
					}
				}
			},
			couponInfo: function(){
				this.cp = this.couponInfo;
				if(this.cp.cbiStatus === 1) {
					this.countdown()
				}
			}
		},
		methods: {
			// 领券时session失效或页面跳转回来时session失效，等待session成功后执行的逻辑
			processSesTimeout: async function() {
				try {
					// 重新加载此券
					let cpSrc = this.cp;
					try {

						// 仅更新领券事件源coupon
						// cpFinalList为获取的最终券列表，包含券的状态
						let cpSrcList = [cpSrc];
						const {
							data: cpFinalListRes
						} = await axios.post(this.cpFinalListUrl + "?r=" + Math.random(),
							cpSrcList
						);
						if(cpFinalListRes.returnCode == "10000") {
							// finalCp为返回的最终券结果
							let finalCp = cpFinalListRes.data[0];
							// 如果券状态有更新，则重新渲染该券，如果没有更新，不做操作。
							if(finalCp.remainQuantity !== cpSrc.remainQuantity || finalCp.cbiStatus !== cpSrc.cbiStatus) {
								this.cp = finalCp;
							} else {
								console.log("券状态没有更新");
							}
						}
					} catch(err) {
						console.dir(err.message);
						if(err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
							alert('请求超时', function() {}, '领券中心');
						} else {
							alert('服务异常', function() {}, '领券中心');
						}
					}
					AlipayJSBridge.call('hideLoading');
				} catch(error) {
					if(error.message !== "AlipayJSBridge is not defined") {
						console.log(error);
					}
				}
			},
			waitToGet: function(coupon) {
				let thisTime = new Date().toLocaleString();
//				alert('_trackEvent'+ window.locationCode + '-点击-等待开抢' + 'cbiID=' + coupon.cbiId + 'clicked' + '首页' + thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-等待开抢' , 'cbiID=' + coupon.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
			},
			toExchage: function(coupon) {
				let exchangeLinkUrl = '../userCoupon/showUserCenter?type=cdkey&' + this.indexParams + '&uciId=' + coupon.uciId + '&cbiLinkUrl=' + encodeURIComponent(coupon.cbiLinkUrl);
				this.toUrl(exchangeLinkUrl)

				let thisTime = new Date().toLocaleString();
//				alert('_trackEvent'+window.locationCode + '-点击-去查看' + 'cbiID=' + this.cp.cbiId + 'clicked' + '首页' + thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-去查看' , 'cbiID=' + this.cp.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
			},
			countdown: function() {
				var arr = this.cp.cpiStartTime.split(/[- :]/),
					end = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]),
					now = Date.parse(new Date()),
					msec = end - now;
				if(msec < 1000) {
					this.cp.cbiStatus = 2;
					return;
				}
				let hr = parseInt(msec / 1000 / 60 / 60)
				let min = parseInt(msec / 1000 / 60 % 60)
				let sec = parseInt(msec / 1000 % 60)
				this.hr = hr > 9 ? hr : '0' + hr
				this.min = min > 9 ? min : '0' + min
				this.sec = sec > 9 ? sec : '0' + sec
				setTimeout(function() {
					this.countdown()
				}.bind(this), 1000)
			},
			displayDesc: function() {
				this.$emit("descDisplay", {
					couponIdx: this.cpIndex
				})
				//				var cpDisList = this.cpDisplayList;
				//				Vue.set(cpDisList, cpIdx, !cpDisList[cpIdx]);
				//				if(cpIdx !== this.cpIdxTemp){
				//					this.cpDisplayList = [];
				//					Vue.set(this.cpDisplayList, cpIdx, true);
				//				}else{
				//					Vue.set(this.cpDisplayList, cpIdx, !this.cpDisplayList[cpIdx]);			
				//				}
				//				this.cpIdxTemp = cpIdx;
			},
			toUrl: function(linkUrl) {
				this.$emit("cascadePushWin", this.cp);
				this.cascadeHidden = true;
				try {
					AlipayJSBridge.call('pushWindow', {
						url: linkUrl,
						param: {
							readTitle: true,
							transparentTitle: 'none'
						}
					});
				} catch(error) {
					console.log(error.message);
					console.log(linkUrl)
				}

			},
			// 自营券去使用
			toUse: function(coupon) {
				this.toUrl(coupon.cbiVerifUrl);

				let thisTime = new Date().toLocaleString();
//				alert('_trackEvent' + window.locationCode + '-点击-去使用' + 'cbiID=' + coupon.cbiId + 'clicked' + '首页' + thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-去使用' , 'cbiID=' + coupon.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
			},
			// 外部券跳转外部链接
			toLinkUrl: function(coupon,cbiLinkUrl) {
				let thisTime = new Date().toLocaleString();
//				alert('_trackEvent' + window.locationCode + '-点击-' + coupon.cpiButtonName + 'cbiID=' + coupon.cbiId + 'clicked' + '首页'+ thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-' + coupon.cpiButtonName, 'cbiID=' + coupon.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
				this.toUrl(cbiLinkUrl);
			},
			async receiveCp(index) {
				console.log(this);
				console.log(this.cp.cpiId);
				//				let receiveUrl = "http://172.30.82.82:8083/userCoupon/receiveCoupon";
				let receiveUrl = "/userCoupon/receiveCoupon";
				let receiveParam = {
					// TODO：考虑取不到值的情况
					ajax: "ajax",
					cpiId: this.cp.cpiId
				}
				receiveParam = qs.stringify(receiveParam);
				try {
					const {
						data: receiveRes
					} = await axios.post(receiveUrl + "?r=" + Math.random(), receiveParam);
					console.log(receiveRes);
					let returnCode = receiveRes.returnCode;
					//					receiveRes.outCouponId = "laerla";
					// 测试代码
					//					returnCode = "10000";
					if(returnCode === "10000") {
						// 领取成功，将领取完成的券信息绑定至当前券
						this.cp.cbiStatus = 3;
						this.cp.uciId = receiveRes.uciId;
						this.cp.csiId = receiveRes.csiId;
						this.cp.outCouponId = receiveRes.outCouponId;
						// 领取成功后判断outCouponId这个参数是否为空，如果为空则不弹添加到卡包的弹窗，按钮直接变为“去使用”，如果不为空的话则弹出添加到卡包的弹窗。
						let outCouponId = receiveRes.outCouponId;
						if(outCouponId) {
							this.cascadeHidden = true;
							this.$emit("confirm", {
								confirmTitle: "领取成功",
								confirmText: "添加优惠券到我的卡包中方便使用呦!",
								OKText: "添加卡包",
								timeout: true,
								cpInfo: {
									outCouponId: outCouponId
								}
							})
						}
					} else if(returnCode === "31023") {
						// TODO：弹窗今日已抢完
						this.$emit("confirm", {
							confirmText: "今日已抢完"
						})
						this.cp.cbiStatus = 4;
					} else if(returnCode === "USER_NULL") {
						AlipayJSBridge.call('showLoading', {
							text: '加载中',
						});
						this.receiveStatus = true;
					} else {
						// 其他情况，一律弹框“这张券太火爆了，请稍后”，页面依然显示立即领取
						this.$emit("confirm", {
							confirmText: "这张券太火爆了，请稍候"
						})
					}
				} catch(err) {
					// 其他情况，一律弹框“这张券太火爆了，请稍后”，页面依然显示立即领取
					this.$emit("confirm", {
						confirmText: "这张券太火爆了，请稍候"
					})
				}
				
				let thisTime = new Date().toLocaleString();
//				alert('_trackEvent' + window.locationCode + '-点击-' + this.cp.cpiButtonName + 'cbiID=' + this.cp.cbiId + 'clicked' + '首页' + thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-' + this.cp.cpiButtonName, 'cbiID=' + this.cp.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
			},
			// 测试用
			logCp: function(cp) {
//				console.log(this.session)
//				console.dir(this.couponInfo)
			}
		},
		mounted() {
			// resume时重新更新本券
			document.addEventListener('resume', async function() {
				if(this.cascadeHidden) {
					let cpSrc = this.cp;
					let cpSrcList = [cpSrc];
					try {
						const {
							data: cpFinalListRes
						} = await axios.post(this.cpFinalListUrl + "?r=" + Math.random(), cpSrcList);
						console.log(cpFinalListRes);
						let returnCode = cpFinalListRes.returnCode;
						if(returnCode === "USER_NULL") {
							// 标识跳出页面后回来时session失效
							// session更新之后会在watch中处理逻辑
							this.outStatus = true;
							AlipayJSBridge.call('showLoading', {
								text: '加载中',
							});
						} else if(returnCode == 10000) {
							// finalCp为返回的最终券结果
							let finalCp = cpFinalListRes.data[0];
							// 如果券状态有更新，则重新渲染该券，如果没有更新，不做操作。
							if(finalCp.remainQuantity !== cpSrc.remainQuantity || finalCp.cbiStatus !== cpSrc.cbiStatus) {
								this.cp = finalCp
							}
						}
					} catch(err) {
						console.dir(err.message);
						if(err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
							alert('请求超时', function() {}, '领券中心');
						} else {
							alert('服务异常', function() {}, '领券中心');
						}
					}
					this.cascadeHidden = false;
				}
			}.bind(this), false);
		},
	}
</script>

<style scoped>
	.vuecouponwrapper {
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
		height: 2.0rem;
		width: 7.1rem;
		margin: 0.2rem 0 0;
		border: 0.1rem solid rgba(207, 223, 255, 1);
		border-radius: 0.2rem;
		background: rgba(255, 255, 255, 1);
	}
	
	.facevaluediv {
		font-size: 0.6rem;
	}
	
	.facevaluezone {
		text-align: center;
		float: left;
		height: 1.8rem;
		width: 1.7rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.scriptbar {
		height: 0.37rem;
		position: absolute;
	}
	
	.couponfacevalue {
		font-size: 0.6rem;
		/*font-family: PingFang-SC-Heavy;*/
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
		font-weight: 800;
		color: rgba(26, 96, 237, 1);
		line-height: 0.60rem;
		/*height: 1.8rem;*/
		display: inline;
		overflow-x: hidden;
	}
	
	.unit {
		margin-top: 0.34rem;
		font-family: PingFang-SC-Heavy;
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
		font-size: .28rem;
		font-weight: normal;
		letter-spacing: -1px;
		color: #1a60ed;
		display: inline;
	}
	
	.couponlabel {
		background: url(../../static/img/jiao.png) no-repeat top center;
		background-size: 100% 100%;
		width: 1.1rem;
		margin: -2px 0.3rem 0 0.3rem;
		height: .37rem;
		font-family: SourceHanSansCN-Normal;
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
		font-size: .26rem;
		font-weight: normal;
		font-stretch: normal;
		line-height: .36rem;
		letter-spacing: 0px;
		color: #ffffff;
	}
	
	.contentzone {
		float: left;
		letter-spacing: -1px;
		height: 1.8rem;
		margin-left: .24rem;
		text-align: left;
		width: 2.94rem;
	}
	
	.cpname {
		/*font-family: PingFang-SC-Medium;*/
		font-size: 0.32rem;
		font-weight: normal;
		font-stretch: normal;
		line-height: 0.62rem;
		color: #333333;
		height: 0.62rem;
		overflow: hidden;
	}
	
	.cpsubdesc {
		/*font-family: PingFang-SC-Medium;*/
		font-size: 0.28rem;
		font-weight: normal;
		font-stretch: normal;
		line-height: 0.32rem;
		color: #666666;
		width: 2.94rem;
		height: 0.32rem;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.cptime {
		/*font-family: PingFang-SC-Regular;*/
		font-size: .20rem;
		font-weight: normal;
		font-stretch: normal;
		line-height: 0.5rem;
		letter-spacing: 0;
		color: #999999;
		width: 2.94rem;
		white-space: nowrap;
	}
	
	.cpdesctitle {
		font-family: PingFang-SC-Medium;
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
		font-size: .22rem;
		font-weight: normal;
		font-stretch: normal;
		line-height: .22rem;
		letter-spacing: 0px;
		color: #999999;
		display: flex;
		width: 1.14rem;
		align-items: center;
		justify-content: space-between;
	}
	
	.cpdesctitlenameimg img {
		max-width: 0.2rem;
		height: auto;
		display: block;
	}
	/*.cpdesctitlenameimg{
		background: url(../../dist/static/img/down.png) center center no-repeat;
		background-size: 90% 90%;
		width: 0.32rem;
		height: 0.32rem;
		display: inline-block;
	}*/
	
	.receivezone {
		float: right;
		height: 1.4rem;
		width: 1.59rem;
		margin: 0 0.2rem;
		text-align: center;
	}
	
	.receiveicon {
		width: 1.59rem;
		height: 1.1rem;
		margin-bottom: 0.02rem;
		overflow: hidden;
	}
	
	.receiveicon img {
		width: 1.14rem;
		height: auto;
		display: block;
		margin: 0.18rem 0.23rem 0.04rem;
	}
	
	.receivebtn {
		width: 1.60rem;
		height: 0.48rem;
		background: linear-gradient(0deg, rgba(0, 87, 206, 1) 0%, rgba(40, 101, 255, 1) 100%);
		border-radius: 0.24rem;
		font-size: .30rem;
		/*font-family: PingFang-SC-Medium;*/
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: .48rem;
	}
	
	.newuser {
		background: linear-gradient(0deg, rgba(247, 36, 78, 1) 0%, rgba(252, 108, 55, 1) 100%);
	}
	
	.cpdescwrapper {
		overflow: hidden;
		transition: max-height 0.5s ease-in-out;
		max-height: 0rem;
		clear: both;
		margin: 0 0.3rem;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 4px 10px 0px rgba(78, 122, 209, 0.4);
		text-align: left;
	}
	
	.cpdescwrapperon {
		max-height: 8rem;
		transition: max-height 1s;
	}
	
	.cpdesczone {
		padding: 0.17rem 0.2rem 0.22rem;
	}
	
	.descli {
		font-size: .22rem;
		/*font-family: PingFang-SC-Regular;*/
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
		line-height: .35rem;
		word-break: break-all;
	}
	
	.descli:before {
		margin-top: -.04rem;
		margin-right: .1rem;
		content: "";
		height: 0;
		overflow: hidden;
		width: .12rem;
		height: .12rem;
		border-radius: 50%;
		background: #ddd;
		display: inline-block;
		vertical-align: middle
	}
	
	img.seizeover {
		margin-top: 0.33rem;
	}
	
	svg {
		-webkit-transform: rotate(-210deg);
		transform: rotate(-210deg);
	}
	
	.circlebar {
		height: 1.14rem;
		margin-top: -0.04rem;
		position: relative;
	}
	
	.residue {
		font-size: 0.22rem;
		/*font-family: SourceHanSansCN-Bold;*/
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
		font-weight: bold;
		color: rgba(26, 96, 237, 1);
		line-height: 0.3rem;
		position: absolute;
		width: 1.59rem;
		height: 0.64rem;
		top: 0;
		margin: 0.48rem auto 0;
	}
	
	.countdownwrapper {
		/*font-family: PingFang-SC-Medium;*/
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
		font-weight: 500;
		color: rgba(26, 96, 237, 1);
	}
	
	.countdowndiv {
		height: 1.8rem;
		;
	}
	
	.countdownline1 {
		margin-top: 0.1rem;
		line-height: 0.45rem;
		font-size: 0.26rem;
		height: 0.45rem;
	}
	
	.countdownline2 {
		margin-top: 0.05rem;
		font-size: 0.26rem;
		line-height: 0.32rem;
	}
	
	.countdownline3 {
		/*margin: 0.1rem 0;*/
		font-size: 0.22rem;
		line-height: 0.4rem;
	}
	
	.countdownline4 {
		font-size: 0.30rem;
	}
	
	.colon {
		font-size: 0.26rem;
	}
	
	.hour {
		display: inline-block;
		width: 0.32rem;
		height: 0.32rem;
		font-size: 0.26rem;
		background: rgba(36, 99, 250, 1);
		color: #FFFFFF;
		border-radius: 4px;
	}
</style>