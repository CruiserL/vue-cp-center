<template>
	<div class="confirm" @touchmove="preventMove" v-show="confirmObj.showConfirm" ref="confirmPopup">
		<div class="confirm-box">
			<div class="confirm-title">{{confirmObj.confirmTitle}}</div>
			<div class="confirm-header" @click="confirmed"></div>
			<div class="confirm-body">{{confirmObj.confirmText}}</div>
			<div class="confirm-footer" @click="OKTapped" v-if="confirmObj.OKText">{{confirmObj.OKText}}</div>
			<div class="confirm-footer" @click="confirmed" v-else>确定</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Confirm', //es6的写法，相当于data:function(){return{swiperOption:{}}}

		data() {
			return {
				confirmObj: this.confirmInfo
			}
		},
		props: [
			'confirmInfo',
			'confirmText'
		],
		methods: {
			preventMove: function(e) {
				e.preventDefault();
			},
			confirmed: function() {
				this.$emit("confirmed", false);
			},
			OKTapped: function() {
				console.log(this.confirmObj.cpInfo.outCouponId);
//				let indexParams = window.Util.localGet('indexParams');
//				indexParams = indexParams.key;
				AlipayJSBridge.call('pushWindow', {
					// 考虑没有outCouponId的情况
					url: 'https://render.alipay.com/p/s/mygrace/ndetail.html?__webview_options__=sms%3DYES%26pd%3DNO&type=VOUCHER&id=' + this.confirmObj.cpInfo.outCouponId,
					param: {
						readTitle: true,
						showOptionMenu: false,
						titleBarColor: 16777215,
						pullRefresh: false,
						canPullDown: false
					}
				});
				this.$emit("confirmed", false);
			},
		},
		mounted: function() {}
	}
</script>

<style scoped>
	.confirm {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		background-color: rgba(0, 0, 0, 0.4);
		text-align: center;
	}
	
	.confirm .confirm-box {
		position: absolute;
		left: 1.05rem;
		top: 4.73rem;
		width: 5.4rem;
		background-color: #fff;
		border-radius: 0.2rem;
		font-size: .36rem;
	}
	
	.confirm .confirm-header {
		position: absolute;
		right: .3rem;
		top: .3rem;
		width: .3rem;
		height: .3rem;
	}
	
	.confirm .confirm-header::after,
	.confirm .confirm-header::before {
		position: absolute;
		top: 50%;
		left: -0.06rem;
		content: '';
		display: block;
		width: .42rem;
		height: 2px;
		background-color: #ddd;
	}
	
	.confirm .confirm-header::after {
		transform: rotateZ(45deg);
	}
	
	.confirm .confirm-header::before {
		transform: rotateZ(-45deg);
	}
	
	.confirm .confirm-title {
		position: absolute;
		top: .24rem;
		left: 0;
		width: 100%;
		text-align: center;
	}
	
	.confirm .confirm-body {
		height: 2.7rem;
		padding-top: 1.35rem;
		padding-left: .55rem;
		padding-right: .55rem;
		color: #333;
	}
	
	.confirm .confirm-footer {
		height: 1rem;
		line-height: 1rem;
		color: #108EE9;
		border-top: 1px solid #ddd;
	}
</style>