<template>
	<section id="todayrcmt" :style="categoryStyle">
		<!-- v-bind:style="background: 'url(' + categoryInfo.backgroundImageUrl + ') no-repeat'"-->
		<!--<div class="stuff">
		</div>-->
		<div class="typetitle today">
			{{categoryInfo.categoryName}}
		</div>
		<div id="rcmtlist">
			<div class="rcmt" v-cloak v-for="(coupon, index) of todayList">
				<div v-if="coupon.cpiId">
					<div class="cardbag">

					</div>
					<div class="card" v-bind:class="{cardiscover: cpDpList[index]}" @click="displayCouponDesc(index)">

						<div class="divswitch" v-if="coupon.cpiId">
							<div class="switchimg" v-bind:class="{switchoffimg: cpDpList[index]}">
							</div>
						</div>
						<div class="couponmain" :class="{nocouponmain: !coupon.cpiId}" @click="logCp(coupon)">
							<div class="facevalue" v-bind:class="{faceValueStyle: cpDpList[index]}"><span v-if="coupon.couponTypeId===4">兑</span><span class="facevaluespan" v-if="coupon.couponTypeId===1">{{parseInt(coupon.cbiFaceValue)}}</span><span v-if="coupon.couponTypeId===2">{{parseInt(coupon.cbiFaceValue)}}</span><span class="unit" v-if="coupon.couponTypeId === 2">元</span><span class="unit" v-if="coupon.couponTypeId === 1">折</span></div>
							<div class="coupontype" v-bind:class="{couponTypeStyle: cpDpList[index]}" v-if="coupon.cpiId">{{coupon.cpiDesc.slice(0, 3)}}</div>
						</div>
						<div class="coupondesczone" v-if="coupon.cpiId">
							<div class="coupontime" v-show="cpDpList[index]">
								<div class='coupontimetitle'>
									有效期
								</div>
								<div class="coupontimedesc" v-if="coupon.cbiVStartTime">
									{{coupon.cbiVStartTime}}-{{coupon.cbiVEndTime}}
								</div>
							</div>
							<div class="coupondesc" v-show="cpDpList[index]">
								<!--{{coupon.cbiSummary}}-->
								<div>
									<ul>
										<li class="squaredescli" v-for="descitem of coupon.cbiSummary.replace(/&nbsp;/ig, ' ').split('<br/>')">
											{{descitem}}
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="cover" v-show="!cpDpList[index]">
						<div class="centerline">

						</div>
						<div v-if="coupon.cbiServiceMode === 1">
							<div class="btn" :class="{greybtn: !coupon.cpiId}" @click="toLinkUrl(coupon, index)">{{coupon.cpiButtonName}}</div>
						</div>
						<div v-if="coupon.cbiServiceMode === 3">
							<!--<div class="btn" :class="{greybtn: !coupon.cpiId}" @click="receiveCp(index)" v-if="coupon.cbiStatus === 1">{{coupon.cpiButtonName}}</div>-->
							<div class="btn" :class="{greybtn: coupon.cbiStatus === 1}" v-if="coupon.cbiStatus === 1" @click="toLinkUrl(coupon, index)">敬请期待</div>
							<div class="btn" @click="receiveCp(coupon, index)" v-if="coupon.cbiStatus === 2">{{coupon.cpiButtonName}}</div>
							<!--<div class="btn" @click="toExchage(coupon, index)" v-if="coupon.cbiStatus === 2">{{coupon.cpiButtonName}}</div>-->
							<div class="btn" @click="toUse(coupon, index)" v-if="coupon.cbiStatus === 3 && coupon.couponSubTypeId != 2">去使用</div>
							<div class="btn" @click="toExchage(coupon, index)" v-if="coupon.cbiStatus === 3 && coupon.couponSubTypeId == 2">去查看</div>
							<div @click="couponNone(coupon)" class="btn" :class="{greybtn: coupon.cbiStatus === 4}" v-if="coupon.cbiStatus === 4">已抢光</div>
							<div @click="couponUsed(coupon)" class="btn" :class="{greybtn: coupon.cbiStatus === 5}" v-if="coupon.cbiStatus === 5">已使用</div>
						</div>
					</div>
				</div>
				<div class="rcmtwrapper" v-if="!coupon.cpiId">

				</div>
			</div>
		</div>
	</section>
</template>

<script>
	export default {
		name: 'Square',
		data() {
			return {
				// 今日好券推荐列表
				todayList: [],

				faceValueStyle: {

				},

				couponTypeStyle: {

				},
				// 主类目信息
				categoryInfo: {},
				// 控制券列表显示
				cpDpList: [

				],
				// 当前展开的券index
				idxTemp: -1,
				indexParams: window.Util.localGet('indexParams').key,
				catUrl: "/coupon/promotionArea",
				cpListUrl: "/coupon/getCouponListByArea",
				cpFinalListUrl: "/coupon/getAllCouponFinalStatus",
				// 标识跳出页面时是点击了哪张券
				couponOut: {},
				couponOutIdx: -1,
				// 标识领券时session超时是点击了哪张券
				receiveErrorCp: {},
				receiveErrorCpIdx: {},

				// 标识session是否有效。
				sessionValidity: true,
				// 标识方块区是否有某个券领取失败
				receiveStatus: false,
				// 标识从外部页面返回时是否session失效
				outStatus: false,
				squareParams: {
					ajax: "ajax",
					entry: window.Util.getUrlParam('entry') || 'icon',
					cpiAreaCode: "020103",
					provinceCode: window.locationCode,
					operatorCode: window.Util.getUrlParam('operatorCode') || ''
				},
				//				categoryStyle: {
				//					backgroundImage: 'url(' + this.categoryInfo + ')',
				//				}
			}
		},
		props: [
			'sessionVal'
		],
		watch: {
			// 监听全局session状态
			sessionVal: async function() {
				if(this.sessionVal) {
					console.log("重新加载券开始");
					// 如果是领券失败，则执行这部分逻辑
					if(this.receiveStatus) {
						// 领券失败，重新请求
						try {
							// 重新加载此券
							let receiveErrSrc = this.receiveErrorCp;
							let squareParam = this.squareParams;
							squareParam = qs.stringify(squareParam);
							try {
								// 仅更新领券事件源coupon
								// cpFinalList为获取的最终券列表，包含券的状态
								let squareCpList = [receiveErrSrc];
								const {
									data: cpFinalListRes
								} = await axios.post(this.cpFinalListUrl + "?r=" + Math.random(),
									squareCpList
								);
								//								alert("cpFinalListRes 方块区领取失败" + JSON.stringify(cpFinalListRes));
								// finalCp为返回的最终券结果
								if(cpFinalListRes.returnCode == "10000") {
									let finalCp = cpFinalListRes.data[0];
									// 如果券状态有更新，则重新渲染该券，如果没有更新，不做操作。
									if(finalCp.remainQuantity !== receiveErrSrc.remainQuantity || finalCp.cbiStatus !== receiveErrSrc.cbiStatus) {
										Vue.set(this.todayList, this.couponOutIdx, finalCp);
									} else {
										console.log("券状态没有更新");
									}
									this.receiveStatus = false;
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
					} else if(this.outStatus) {
						// 页面跳转回来session失效，
						try {
							// 重新加载此券
							let couponOut = this.couponOut;
							let squareParam = this.squareParams;
							squareParam = qs.stringify(squareParam);
							try {
								// 仅更新页面跳转事件源coupon
								// cpFinalList为获取的最终券列表，包含券的状态
								let squareCpList = [couponOut];
								const {
									data: cpFinalListRes
								} = await axios.post(this.cpFinalListUrl + "?r=" + Math.random(),
									squareCpList
								);
								//								alert("cpFinalListRes 方块区跳转回来时授权失败" + JSON.stringify(cpFinalListRes));
								// finalCp为返回的最终券结果
								if(cpFinalListRes.returnCode == "10000") {
									let finalCp = cpFinalListRes.data[0];
									// 如果券状态有更新，则重新渲染该券，如果没有更新，不做操作。
									if(finalCp.remainQuantity !== couponOut.remainQuantity || finalCp.cbiStatus !== couponOut.cbiStatus) {
										Vue.set(this.todayList, this.couponOutIdx, finalCp);
									} else {
										console.log("券状态没有更新");
									}
									this.outStatus = false;
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
					}
				}
			}
		},
		methods: {
			processSesTimeout: async function() {
				try {
					// 重新加载此券
					let receiveErrSrc = this.receiveErrorCp;
					let squareParam = this.squareParams;
					squareParam = qs.stringify(squareParam);
					try {
						// 仅更新领券事件源coupon
						// cpFinalList为获取的最终券列表，包含券的状态
						let squareCpList = [receiveErrSrc];
						const {
							data: cpFinalListRes
						} = await axios.post(this.cpFinalListUrl + "?r=" + Math.random(),
							squareCpList
						);
						// finalCp为返回的最终券结果
						let finalCp = cpFinalListRes.data[0];
						// 如果券状态有更新，则重新渲染该券，如果没有更新，不做操作。
						if(finalCp.remainQuantity !== receiveErrSrc.remainQuantity || finalCp.cbiStatus !== receiveErrSrc.cbiStatus) {
							Vue.set(this.todayList, this.couponOutIdx, finalCp);
						} else {
							console.log("券状态没有更新");
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

			displayCouponDesc: function(index) {
				// idx才是获得的券的index值
				if(index !== this.idxTemp) {
					this.cpDpList = [];
					Vue.set(this.cpDpList, index, true);
				} else {
					Vue.set(this.cpDpList, index, !this.cpDpList[index]);
				}
				this.idxTemp = index;
			},
			couponNone: function (coupon) {

				let thisTime = new Date().toLocaleString();
//				alert( '_trackEvent' + window.locationCode + '-点击-已抢光' + 'cbiID=' + coupon.cbiId + 'clicked' + '首页' + thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-已抢光' , 'cbiID=' + coupon.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
			},
			couponUsed: function (coupon) {
				let thisTime = new Date().toLocaleString();
//				alert('_trackEvent' + window.locationCode + '-点击-已使用' + 'cbiID=' + coupon.cbiId + 'clicked' + '首页' + thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-已使用' , 'cbiID=' + coupon.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
			},
			async receiveCp(coupon, index) {
				// 测试代码，记得删除
				//				coupon.cbiStatus = 3;
				var receiveCpUrl = "/userCoupon/receiveCoupon";
				let receiveParam = {
					// TODO：考虑取不到值的情况
					ajax: "ajax",
					cpiId: coupon.cpiId
				}
				receiveParam = qs.stringify(receiveParam);
				try {
					let receiveRes = await axios.post(receiveCpUrl + "?r=" + Math.random(), receiveParam);
					console.log(receiveRes);
					receiveRes = receiveRes.data;
					let returnCode = receiveRes.returnCode;
					// 测试代码
					//					returnCode = 10000;
					if(returnCode === "10000") {
						console.log("领取成功")
						this.receiveStatus = false;
						// 注意此处直接传入coupon，可以方便的实现改变组件状态。
						coupon.cbiStatus = 3;
						coupon.uciId = receiveRes.uciId;
						coupon.csiId = receiveRes.csiId;
						coupon.outCouponId = receiveRes.outCouponId;
						let outCouponId = receiveRes.outCouponId;
						if(outCouponId) {
							this.couponOut = coupon;
							this.couponOutIdx = index;
							// 出现添加卡包时，由于无法跟踪去使用也认为跳出了页面
							this.squareHidden = true;
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
						this.$emit("confirm", {
							confirmText: "今日已抢完"
						})
						coupon.cbiStatus = 4;
					} else if(returnCode === "USER_NULL") {
						// 标识有某个券领取失败
						// session更新之后会在watch中处理逻辑
						this.receiveStatus = true;
						this.receiveErrorCp = coupon;
						this.receiveErrorCpIdx = index;
						AlipayJSBridge.call('showLoading', {
							text: '加载中',
						});
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
//				alert('_trackEvent' + window.locationCode + '-点击-' + coupon.cpiButtonName + 'cbiID=' + coupon.cbiId + 'clicked' + '首页'+ thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-' + coupon.cpiButtonName, 'cbiID=' + coupon.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
			},
			// 跳转页面方法
			toUrl: function(linkUrl, coupon, index) {
				this.couponOut = coupon;
				this.couponOutIdx = index;
				this.squareHidden = true;
				this.outStatus = true;
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
			// 外部券跳转外部链接
			toLinkUrl: function(coupon, index) {
				let thisTime = new Date().toLocaleString();
//				alert('_trackEvent' + window.locationCode + '-点击-' + coupon.cpiButtonName + 'cbiID=' + coupon.cbiId + 'clicked' + '首页'+ thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-' + coupon.cpiButtonName, 'cbiID=' + coupon.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
				this.toUrl(coupon.cbiLinkUrl, coupon, index);
			},
			// 用户点击去使用
			toUse: function(coupon, index) {
				this.toUrl(coupon.cbiVerifUrl, coupon, index);
				console.log(coupon.cbiVerifUrl);

				let thisTime = new Date().toLocaleString();
//				alert('_trackEvent' + window.locationCode + '-点击-去使用' + 'cbiID=' + coupon.cbiId + 'clicked' + '首页' + thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-去使用' , 'cbiID=' + coupon.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
			},
			// 用户点击去兑换
			toExchage: function(coupon, index) {
				let exchangeLinkUrl = '../userCoupon/showUserCenter?type=cdkey&' + this.indexParams + '&uciId=' + coupon.uciId + '&cbiLinkUrl=' + encodeURIComponent(coupon.cbiLinkUrl);
				this.toUrl(exchangeLinkUrl, coupon, index);

				let thisTime = new Date().toLocaleString();
//				alert('_trackEvent' + window.locationCode + '-点击-去查看' + 'cbiID=' + coupon.cbiId + 'clicked' + '首页' + thisTime);
				window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-点击-去查看' , 'cbiID=' + coupon.cbiId, 'clicked', '首页', new Date().toLocaleString()]);
			},
			// 测试用
			logCp: function(cp) {
//				console.dir(cp)
			},
			toBaidu: function() {
//				location.href = "http://www.baidu.com";
			}
		},
		computed: {
			categoryStyle: function() {
				return {
					backgroundImage: 'url(' + this.categoryInfo.backgroundImageUrl + ')'
				}
			},
			sessionValid: function() {
				// 如果接到通知sessionValidity重新可用，则重新发送对应的请求
				if(this.sessionValidity) {

				}
				return this.sessionValidity;
			}
		},

		async created() {
			let thisTime = new Date().toLocaleString();
//			alert('_trackEvent' + window.locationCode + '-露出-领券中心-顶部' + 'exposure' + '首页' + thisTime);
			window._hmt && window._hmt.push(['_trackEvent', window.locationCode + '-露出-领券中心-顶部', 'exposure', '首页', new Date().toLocaleString()]);
			let squareParam = {
				ajax: "ajax",
				entry: window.Util.getUrlParam('entry') || 'icon',
				cpiAreaCode: "020103",
				provinceCode: window.locationCode,
				operatorCode: window.Util.getUrlParam('operatorCode') || ''
			}
			squareParam = qs.stringify(squareParam);
			try {
				// 请求主类目信息				
				// catRes为主类目信息返回结果
				const {
					data: catRes
				} = await axios.post(this.catUrl + "?r=" + Math.random(), squareParam);
				
				// 当前块只影响当前块
				this.categoryInfo = catRes.data;
				// 请求方块区券列表
				// cpListRes为方块区返回的券列表
				const {
					data: cpListRes
				} = await axios.post(this.cpListUrl + "?r=" + Math.random(), squareParam);
				console.log(cpListRes);
				// cpFinalList为获取的最终券列表，包含券的状态
				var squareCpList = [];
				// TODO：测试代码，记得删除
//				cpListRes.returnCode = "NO_DATA";
				if(cpListRes.returnCode == "10000") {
					// 数据正常，可以正常渲染页面
					squareCpList = cpListRes.data;
					// 如果方块区数量大于三张，只取前三张
					squareCpList = squareCpList.slice(0, 3);
					cpListRes.data = cpListRes.data.slice(0, 3);
					// 如果方块区券数量不足三张，使用占位空白券补足
					while(squareCpList.length < 3) {
						squareCpList.push({})
					}
					this.todayList = squareCpList;
					// 列表返回即通知父组件此组件渲染完成
					this.$emit("loadSuccess", {
						square: true
					});
					// 此后再执行查询最终状态操作，如果此步骤中出错，直接弹窗系统异常
					if(cpListRes.data.length > 0){
						const {
							data: cpFinalListRes
						} = await axios.post(this.cpFinalListUrl + "?r=" + Math.random(),
							cpListRes.data
						);
						if(cpFinalListRes.data){
							// 如果正常得到结果，重新渲染方块区
							squareCpList = cpFinalListRes.data;
							// 如果方块区券数量不足三张，使用占位空白券补足
							while(squareCpList.length < 3) {
								squareCpList.push({})
							}
							this.todayList = squareCpList;
						}
					}
				}else if(cpListRes.returnCode == "NO_DATA"){
					// 如果方块区无券，则展示三个敬请期待，并通知父元素渲染完成
					this.todayList = [{},{},{}];
					this.$emit("loadSuccess", {
						square: true
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
		},

		mounted: function() {
			document.addEventListener('resume', async function() {
				if(this.squareHidden) {
					let couponOutSrc = this.couponOut;
					let squareParam = {
						ajax: "ajax",
						entry: window.Util.getUrlParam('entry') || 'icon',
						cpiAreaCode: "020103",
						provinceCode: window.locationCode,
						operatorCode: window.Util.getUrlParam('operatorCode') || ''
					}
					squareParam = qs.stringify(squareParam);
					try {
						// 仅更新页面跳转事件源coupon
						// cpFinalList为获取的最终券列表，包含券的状态
						let squareCpList = [couponOutSrc];
						const {
							data: cpFinalListRes
						} = await axios.post(this.cpFinalListUrl + "?r=" + Math.random(),
							squareCpList
						);
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
							if(finalCp.remainQuantity !== couponOutSrc.remainQuantity || finalCp.cbiStatus !== couponOutSrc.cbiStatus) {
								Vue.set(this.todayList, this.couponOutIdx, finalCp);
							}
						} else {
							AlipayJSBridge.call('hideLoading');
						}
					} catch(err) {
						console.dir(err.message);
						if(err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
							alert('请求超时', function() {}, '领券中心');
						} else {
							alert('服务异常', function() {}, '领券中心');
						}
						AlipayJSBridge.call('hideLoading');
					}
					this.squareHidden = false;
				}
			}.bind(this), false);
			//			document.addEventListener("visibilitychange", async function() {
			//				if(document.hidden == false) {
			//					if(this.squareHidden) {
			//						let squareParam = {
			//							ajax: "ajax",
			//							entry: window.Util.getUrlParam('entry') || 'icon',
			//							cpiAreaCode: "020103",
			//							provinceCode: window.locationCode,
			//							operatorCode: window.Util.getUrlParam('operatorCode') || ''
			//						}
			//						squareParam = qs.stringify(squareParam);
			//						try {
			//							// catRes为主类目信息返回结果
			//							const {
			//								data: catRes
			//							} = await axios.post(this.catUrl, squareParam);
			//							console.log(catRes);
			//							// 当前块只影响当前块
			//							this.categoryInfo = catRes.data;
			//							// cpListRes为方块区返回的券列表
			//							const {
			//								data: cpListRes
			//							} = await axios.post(this.cpListUrl, squareParam);
			//							// cpFinalList为获取的最终券列表，包含券的状态
			//							var squareCpList = [];
			//							if(cpListRes.data) {
			//								const {
			//									data: cpFinalListRes
			//								} = await axios.post(this.cpFinalListUrl,
			//									cpListRes.data
			//								);
			//								squareCpList = cpFinalListRes.data;
			//							}
			//							this.$emit("loadSuccess", {
			//								square: true
			//							});
			//							// 如果方块区数量大于三张，只取前三张
			//							if(squareCpList.length > 3) {
			//								squareCpList = squareCpList.slice(0, 3);
			//							}
			//							// 如果方块区券数量不足三张，使用占位空白券补足
			//							while(squareCpList.length < 3) {
			//								squareCpList.push({})
			//							}
			//							this.todayList = squareCpList;
			//						} catch(err) {
			//							console.dir(err.message);
			//							if(err.message === 'timeout') {
			//								alert('请求超时', function() {}, '领券中心');
			//							} else {
			//								alert('服务异常', function() {}, '领券中心');
			//							}
			//							AlipayJSBridge.call('hideLoading');
			//						}
			//						this.squareHidden = false;
			//					}
			//				}
			//			}.bind(this));
		}
	}
</script>

<style scoped>
	/* 方块区 start */
	
	#todayrcmt {
		background-size: 100%;
		background-repeat: round;
		color: white;
		text-align: center;
		height: 4.88rem;
		background-color: #FFFFFF;
		padding-top: 1.58rem;
		font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
	}
	
	.typetitle {
		height: 0.28rem;
		/*font-family: PingFang-SC-Bold;*/
		font-size: 0.28rem;
		font-weight: bold;
		line-height: 0.28rem;
		letter-spacing: 0rem;
		color: white;
	}
	
	.today {
		margin: 0 auto;
		width: 2.1rem;
		border-left: 1px solid #FFFFFF;
		border-right: 1px solid #FFFFFF;
	}
	
	.stuff {
		height: 1.2rem;
	}
	
	.rcmt {
		height: 2.26rem;
		width: 1.92rem;
		float: left;
		text-align: center;
	}
	
	.rcmt:first-child {
		margin-right: 0.57rem;
	}
	
	.rcmt:last-child {
		float: right;
	}
	
	#rcmtlist {
		overflow: hidden;
		margin: 0.28rem 0.3rem;
		position: relative;
	}
	
	.coupondesczone {
		position: absolute;
		bottom: 0.06rem;
		text-align: left;
		padding: 0 0.06rem;
		
	}
	
	.coupondesc {
		width: 1.60rem;
		height: 0.70rem;
		line-height: 0.24rem;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
	}
	
	.cardbag {
		margin-top: 0.51rem;
		width: 1.92rem;
		height: 1.75rem;
		background: rgba(255, 240, 209, 1);
		border-radius: 0.2rem;
	}
	
	.card {
		width: 1.72rem;
		height: 2.15rem;
		position: absolute;
		background: rgba(254, 251, 243, 1);
		top: 0;
		margin: 0.1rem 0.1rem 0rem;
		border-radius: 0.2rem;
		text-align: center;
		padding-top: 0.08rem;
		box-shadow: -1px 0px 4px 0px rgba(11, 8, 137, 0.5);
		padding-top: 0;
		transition: margin-top 0.3s;
		/*font-family: PingFang-SC-Regular;*/
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
		font-size: .16rem;
	}
	
	.nocouponmain {
		margin-top: 0.5rem;
	}
	
	.facevalue {
		width: 1rem;
		height: 0.47rem;
		line-height: 0.47rem;
		font-size: 0.60rem;
		/*font-family: PingFang-SC-Heavy;*/
		font-weight: 800;
		color: rgba(26, 96, 237, 1);
		margin: 0 auto 0.13rem;
		/*overflow: hidden;*/
	}
	
	.coupontype {
		width: 1.15rem;
		height: 0.34rem;
		line-height: 0.34rem;
		background: rgba(253, 247, 203, 1);
		border-radius: 0.17rem;
		font-size: 0.26rem;
		/*font-family: PingFang-SC-Medium;*/
		font-weight: 500;
		color: rgba(236, 151, 58, 1);
		margin: 0 auto;
	}
	
	.cover {
		position: absolute;
		bottom: 0;
		text-align: center;
		width: 1.92rem;
		height: 0.87rem;
		border-bottom-left-radius: 0.2rem;
		border-bottom-right-radius: 0.2rem;
		box-shadow: 0px -1px 1px 0px rgba(207, 224, 255, 0.5);
		background: rgba(255, 240, 208, 1);
	}
	
	.centerline {
		position: absolute;
		top: -2px;
		width: 0;
		height: 0.2rem;
		margin: 0 auto;
		border-left: 1px solid rgba(255, 255, 255, 1);
	}
	
	.centerline:before {
		content: '';
		width: 0.4rem;
		height: 0.2rem;
		z-index: 100;
		border-radius: 0 0 0.2rem 0.2rem;
		position: absolute;
		border-bottom: none;
		top: 0px;
		left: 0.76rem;
		background: #FEFBF3;
	}
	
	.centerline:after {
		background-color: #000000;
		border-radius: 0 0 0.2rem 0.2rem;
	}
	
	.btn {
		width: 1.27rem;
		height: 0.41rem;
		margin: 0.3rem auto 0.1rem;
		background: rgba(40, 101, 255, 1);
		border-radius: 0.20rem;
		/*font-family: PingFang-SC-Bold;*/
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		line-height: 0.41rem;
		font-size: 0.24rem;
	}
	
	.greybtn {
		background: linear-gradient(0deg, rgba(127, 127, 127, 1) 0%, rgba(215, 215, 215, 1) 100%);
	}
	
	.divswitch {
		height: 0.24rem;
		position: relative;
	}
	
	.switchimg {
		position: absolute;
		right: 0rem;
		margin: 0.1rem 0.1rem 0 0;
		width: 0.16rem;
		height: 0.16rem;
		background: url(../../static/img/info.png) no-repeat;
		background-size: 100% 100%;
	}
	
	.switchoffimg {
		background: url(../../static/img/close.png) no-repeat;
		background-size: 100% 100%;
	}
	
	.unit {
		font-size: 10px;
		font-weight: 600;
	}
	
	.cardiscover {
		transition: margin-top 0.3s;
		margin-top: 0rem;
	}
	
	.faceValueStyle {
		float: left;
	}
	
	.couponTypeStyle {
		float: right;
		white-space: nowrap;
		margin: 0;
		width: 0.65rem;
		margin-top: 0.2rem;
		margin-right: 0.06rem;
		font-size: 0.20rem;
	}
	
	.coupontime {
		clear: both;
		/*color:rgba(102,102,102,1);*/
	}
	
	.coupontimedesc {
		white-space: nowrap;
		width: 1.60rem;
		overflow: hidden;
		letter-spacing: -0.5px;
	}
	
	.rcmtwrapper {
		height: 100%;
		background: url(https://psbizweb-prod.oss-cn-hangzhou.aliyuncs.com/static/images/comingsoon.png) round;
	}
	
	.facevaluespan{
		letter-spacing: -0.03rem;
	}
	
	.squaredescli{
		letter-spacing: -0.5px;
	}
	
	/* 方块区end  */
</style>