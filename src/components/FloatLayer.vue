<template>
	<div class="floatlayer">
		<!--<div class="container-loading" style="z-index: 200;">
			<div class="module_loading" id="module_1">
				<div class="coupon-desc coupon">
					<div class="c-content">
						<div class="c-header"><strong></strong>
							<p></p>
						</div>
						<div class="c-body">
							<div class="top-line"></div>
							<div class="middle-line"></div>
							<div class="bottom-line"></div>
							<div class="last-line"></div>
						</div>
						<div class="c-footer wathet-bg not-use">
							<button class="btn btn-f-blue get-now"></button>
						</div>
					</div>
				</div>
				<div class="coupon-desc coupon">
					<div class="c-content">
						<div class="c-header"><strong></strong>
							<p></p>
						</div>
						<div class="c-body">
							<div class="top-line"></div>
							<div class="middle-line"></div>
							<div class="bottom-line"></div>
							<div class="last-line"></div>
						</div>
						<div class="c-footer wathet-bg not-use">
							<button class="btn btn-f-blue get-now"></button>
						</div>
					</div>
				</div>
			</div>
			<div class="module_loading" id="module_2">
				<div class="coupon-desc coupon">
					<div class="c-content">
						<div class="c-header"><strong></strong>
							<p></p>
						</div>
						<div class="c-body">
							<div class="top-line"></div>
							<div class="middle-line"></div>
							<div class="bottom-line"></div>
							<div class="last-line"></div>
						</div>
						<div class="c-footer wathet-bg not-use">
							<button class="btn btn-f-blue get-now"></button>
						</div>
					</div>
				</div>
				<div class="coupon-desc coupon">
					<div class="c-content">
						<div class="c-header"><strong></strong>
							<p></p>
						</div>
						<div class="c-body">
							<div class="top-line"></div>
							<div class="middle-line"></div>
							<div class="bottom-line"></div>
							<div class="last-line"></div>
						</div>
						<div class="c-footer wathet-bg not-use">
							<button class="btn btn-f-blue get-now"></button>
						</div>
					</div>
				</div>
			</div>
			<div class="module_loading" id="module_3">
				<div class="coupon-desc coupon">
					<div class="c-content">
						<div class="c-header"><strong></strong>
							<p></p>
						</div>
						<div class="c-body">
							<div class="top-line"></div>
							<div class="middle-line"></div>
							<div class="bottom-line"></div>
							<div class="last-line"></div>
						</div>
						<div class="c-footer wathet-bg not-use">
							<button class="btn btn-f-blue get-now"></button>
						</div>
					</div>
				</div>
				<div class="coupon-desc coupon">
					<div class="c-content">
						<div class="c-header"><strong></strong>
							<p></p>
						</div>
						<div class="c-body">
							<div class="top-line"></div>
							<div class="middle-line"></div>
							<div class="bottom-line"></div>
							<div class="last-line"></div>
						</div>
						<div class="c-footer wathet-bg not-use">
							<button class="btn btn-f-blue get-now"></button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="float-layer" style="z-index: 200;">
			<div class="loading-area">
				<div class="loading">
					<div class="loading-line">
						<div class="line"></div>
						<div class="line"></div>
						<div class="line"></div>
						<div class="line"></div>
						<div class="line"></div>
						<div class="line"></div>
					</div>
				</div>
				<h2>正在授权登录,请您稍等……</h2></div>
		</div>-->
	</div>
</template>

<script>
	export default {
		name: 'FloatLayer',
		data() {
			return {
				confirmObj: this.confirmInfo
			}
		},
		props: [
			'loaded'
		],
		methods: {
			preventMove: function(e) {
				e.preventDefault();
			},
			confirmed: function() {
				this.$emit("confirmed", false);
			},
		},
		mounted: function() {}
	}
</script>

<style scoped>
	.preload-1,
	.preload-2,
	.preload-3,
	.preload-4,
	.preload-5 {
		height: 0
	}
	
	@media (max-device-pixel-ratio: 1.5),
	screen and (-webkit-max-device-pixel-ratio: 1.5) {
		.wathet-bg {
			background-image: url(https://psbizweb-prod.oss-cn-hangzhou.aliyuncs.com/static/images/Wathet@1x.png)
		}
	}
	
	@media (max-device-pixel-ratio: 2.5),
	(min-device-pixel-ratio: 1.6) and (-webkit-max-device-pixel-ratio: 2.5),
	screen and (-webkit-min-device-pixel-ratio: 1.6) {
		.wathet-bg {
			background-image: url(https://psbizweb-prod.oss-cn-hangzhou.aliyuncs.com/static/images/Wathet@2x.png)
		}
	}
	
	@media (min-device-pixel-ratio: 2.6),
	screen and (-webkit-min-device-pixel-ratio: 2.6) {
		.wathet-bg {
			background-image: url(https://psbizweb-prod.oss-cn-hangzhou.aliyuncs.com/static/images/Wathet@3x.png)
		}
	}
	
	.container-loading {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
		border-top: 1px solid transparent;
		padding-bottom: 0;
		padding-left: .1rem;
		padding-right: .1rem;
		height: 100%;
		overflow-y: hidden;
		background: #f1f1f1
	}
	
	.container-loading .module_loading h2 {
		display: block;
		margin: .3rem;
		width: 0.98rem;
		height: .3rem;
		background: #e5e5e5;
		border-radius: .15rem
	}
	
	.container-loading .module_loading .coupon-desc {
		margin-bottom: .3rem
	}
	
	.container-loading .module_loading .coupon-desc .c-content .c-header {
		width: 1.85rem
	}
	
	.container-loading .module_loading .coupon-desc .c-content .c-header strong {
		display: block;
		margin: .54rem .4rem .32rem .49rem;
		padding: 0;
		width: 0.96rem;
		height: .6rem;
		background: #d1ebff
	}
	
	.container-loading .module_loading .coupon-desc .c-content .c-header p {
		display: block;
		margin: 0 .3rem 0 .42rem;
		width: 0.96rem;
		height: .3rem;
		background: #d1ebff
	}
	
	.container-loading .module_loading .coupon-desc .c-content .c-body {
		width: 3.19rem;
		padding: 0
	}
	
	.container-loading .module_loading .coupon-desc .c-content .c-body .top-line {
		margin: .3rem 0 0;
		width: 2.74rem;
		height: .3rem;
		background: #f5f5f5
	}
	
	.container-loading .module_loading .coupon-desc .c-content .c-body .middle-line {
		margin: .26rem 0 0;
		width: 0.87rem;
		height: .3rem;
		background: #f5f5f5
	}
	
	.container-loading .module_loading .coupon-desc .c-content .c-body .bottom-line {
		margin: .09rem 0 0;
		width: 2.93rem;
		height: .3rem;
		background: #f5f5f5
	}
	
	.container-loading .module_loading .coupon-desc .c-content .c-body .last-line {
		margin: .2rem 0 0;
		width: 1.26rem;
		height: .3rem;
		background: #f5f5f5
	}
	
	.container-loading .module_loading .coupon-desc .c-content .c-footer button {
		margin: 1.44rem .33rem .36rem;
		width: 1.2rem;
		height: .3rem;
		background: hsla(0, 0%, 100%, .4);
		border-radius: .2rem
	}
	
	.float-layer {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 2;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, .4);
		transition: all 1.2s ease-in-out
	}
	
	.float-layer .human-animation {
		position: fixed;
		top: 48vh;
		left: .65rem;
		margin: 0 auto;
		width: 6.2rem;
		height: auto;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%)
	}
	
	.float-layer .human-animation .racing-container {
		width: auto;
		height: 2.44rem
	}
	
	.float-layer .human-animation .racing-container #racing-background {
		width: 100%;
		height: 2.24rem
	}
	
	.float-layer .human-animation .racing-container #racing {
		position: relative;
		top: -1.42rem;
		width: 20%;
		height: auto
	}
	
	.float-layer .human-animation .loading-percentage {
		width: 100%;
		height: .42rem;
		border-radius: .22rem;
		background: #fff
	}
	
	.float-layer .human-animation .loading-percentage .percentage {
		padding-right: 1.5%;
		width: 8%;
		min-width: 8%;
		height: .42rem;
		border-radius: .22rem;
		background: #b8f2ff;
		line-height: .42rem;
		text-align: right;
		font-size: .24rem;
		color: #00a2c6
	}
	
	.float-layer .human-animation h2 {
		margin-top: .66rem;
		width: 100%;
		font-size: .3rem;
		color: #fff;
		text-align: center
	}
	
	.float-layer .loading-area {
		position: fixed;
		top: 50vh;
		left: 0;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
		width: 100vh;
		z-index: 3
	}
	
	.float-layer .loading {
		margin: .34rem 50vw .16rem;
		-webkit-transform: translateX(-1.7%);
		transform: translateX(-1.7%)
	}
	
	.float-layer .loading,
	.float-layer .loading .loading-line {
		width: 1.24rem;
		height: 1.24rem
	}
	
	.float-layer .loading .loading-line .line:after,
	.float-layer .loading .loading-line .line:before {
		display: block;
		content: "";
		height: 50%;
		background: #fff;
		border-radius: .04rem
	}
	
	.float-layer .loading .loading-line .line:before {
		margin-top: -.32rem
	}
	
	.float-layer .loading .loading-line .line:after {
		margin-top: .64rem
	}
	
	.float-layer .loading .loading-line .line {
		position: absolute;
		left: 0;
		top: 0;
		width: .08rem;
		height: .6rem
	}
	
	.float-layer .loading .loading-line .line:nth-child(2) {
		-webkit-transform: rotate(30deg)
	}
	
	.float-layer .loading .loading-line .line:nth-child(3) {
		-webkit-transform: rotate(60deg)
	}
	
	.float-layer .loading .loading-line .line:nth-child(4) {
		-webkit-transform: rotate(90deg)
	}
	
	.float-layer .loading .loading-line .line:nth-child(5) {
		-webkit-transform: rotate(120deg)
	}
	
	.float-layer .loading .loading-line .line:nth-child(6) {
		-webkit-transform: rotate(150deg)
	}
	
	.float-layer .loading .loading-line .line:first-child:before {
		-webkit-animation: a 1.2s linear 0s infinite;
		animation: a 1.2s linear 0s infinite
	}
	
	.float-layer .loading .loading-line .line:nth-child(2):before {
		-webkit-animation: a 1.2s linear .1s infinite;
		animation: a 1.2s linear .1s infinite
	}
	
	.float-layer .loading .loading-line .line:nth-child(3):before {
		-webkit-animation: a 1.2s linear .2s infinite;
		animation: a 1.2s linear .2s infinite
	}
	
	.float-layer .loading .loading-line .line:nth-child(4):before {
		-webkit-animation: a 1.2s linear .3s infinite;
		animation: a 1.2s linear .3s infinite
	}
	
	.float-layer .loading .loading-line .line:nth-child(5):before {
		-webkit-animation: a 1.2s linear .4s infinite;
		animation: a 1.2s linear .4s infinite
	}
	
	.float-layer .loading .loading-line .line:nth-child(6):before {
		-webkit-animation: a 1.2s linear .5s infinite;
		animation: a 1.2s linear .5s infinite
	}
	
	.float-layer .loading .loading-line .line:first-child:after {
		-webkit-animation: a 1.2s linear .6s infinite;
		animation: a 1.2s linear .6s infinite
	}
	
	.float-layer .loading .loading-line .line:nth-child(2):after {
		-webkit-animation: a 1.2s linear .7s infinite;
		animation: a 1.2s linear .7s infinite
	}
	
	.float-layer .loading .loading-line .line:nth-child(3):after {
		-webkit-animation: a 1.2s linear .8s infinite;
		animation: a 1.2s linear .8s infinite
	}
	
	.float-layer .loading .loading-line .line:nth-child(4):after {
		-webkit-animation: a 1.2s linear .9s infinite;
		animation: a 1.2s linear .9s infinite
	}
	
	.float-layer .loading .loading-line .line:nth-child(5):after {
		-webkit-animation: a 1.2s linear 1s infinite;
		animation: a 1.2s linear 1s infinite
	}
	
	.float-layer .loading .loading-line .line:nth-child(6):after {
		-webkit-animation: a 1.2s linear 1.1s infinite;
		animation: a 1.2s linear 1.1s infinite
	}
	
	.float-layer h2 {
		width: 100vw;
		font-size: .4rem;
		color: #fff;
		text-align: center
	}
	
	@-webkit-keyframes a {
		0% {
			opacity: 0
		}
		to {
			opacity: 1
		}
	}
	
	@keyframes a {
		0% {
			opacity: 0
		}
		to {
			opacity: 1
		}
	}
	
	.float-layer-animation {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 3;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, .4);
		transition: all 1.2s ease-in-out
	}
	
	.float-layer-animation .human-animation {
		margin: 46vh auto;
		width: 6.2rem;
		height: auto;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%)
	}
	
	.float-layer-animation .human-animation img {
		width: 100%;
		height: 100%
	}
	
	.float-layer-animation .human-animation .loading-percentage {
		width: 100%;
		height: .42rem;
		border-radius: .22rem;
		background: #fff
	}
	
	.float-layer-animation .human-animation .loading-percentage .percentage {
		padding-right: 1.5%;
		width: 8%;
		min-width: 8%;
		height: .42rem;
		border-radius: .22rem;
		background: #b8f2ff;
		line-height: .42rem;
		text-align: right;
		font-size: .24rem;
		color: #00a2c6
	}
	
	.float-layer-animation .human-animation h2 {
		margin-top: .66rem;
		width: 100%;
		font-size: .3rem;
		color: #fff;
		text-align: center
	}
	
	.container-error {
		border-top: 1px solid transparent;
		padding-bottom: 0;
		padding-left: 0;
		padding-right: 0
	}
	
	.module_loading>h2 {
		display: none;
		padding: 0 .2rem;
		margin-top: .44rem;
		margin-bottom: .2rem;
		height: .42rem;
		line-height: .42rem;
		font-size: .3rem;
		color: #666
	}
	
	.module_loading:first-child h2 {
		margin-top: 0
	}
	
	.c-header {
		float: left;
		width: 1.92rem;
		height: 2.2rem;
		color: #4ab3ff;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-size: contain;
		background-repeat: no-repeat;
		background-size: 100% 100%
	}
	
	.coupon {
		margin-bottom: .2rem;
		width: 7.3rem;
		min-height: 2.2rem;
		display: block
	}
</style>