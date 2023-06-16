<template>
	<view>
		<web-view :src="loginUrl"></web-view>
	</view>
</template>

<script>
		var that;
	export default {
		data() {
			return {
				loginUrl: "",
			}
		},
		onLoad(e) {
			plus.navigator.setUserAgent(plus.navigator.getUserAgent()+" XiaoeEmbed")
			// 获取传递过来的链接
			this.loginUrl = e.url;
			// that = this
			// var url ="https://appu1xj9ycr8795.h5.xiaoeknow.com/content_page/eyJ0eXBlIjoiMiIsInJlc291cmNlX3R5cGUiOjQsInJlc291cmNlX2lkIjoibF82MjY2NjJjYmU0YjA5ZGRhMTI2MDAyNTUiLCJhcHBfaWQiOiJhcHB1MXhqOXljcjg3OTUiLCJwcm9kdWN0X2lkIjoiIn0"
			// this.getLoginUrl(url)
			// this.getLoginUrl(e.url)
			// this.userAgent = plus.navigator.getUserAgent()
		
		},
		methods: {
			getLoginUrl(urls) {
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						"user_id": 'u_api_625632ee77d25_LjHiieLLEr',
						// "redirect_uri": "https://appu1xj9ycr8795.h5.xiaoeknow.com/content_page/eyJ0eXBlIjoiMiIsInJlc291cmNlX3R5cGUiOjQsInJlc291cmNlX2lkIjoibF82MjY2NjJjYmU0YjA5ZGRhMTI2MDAyNTUiLCJhcHBfaWQiOiJhcHB1MXhqOXljcjg3OTUiLCJwcm9kdWN0X2lkIjoiIn0",
						"redirect_uri": urls,
						"login_type": 2
					},
					success: function(data, status) {
						that.loginUrl = data.data.result.login_url
						console.log(that.loginUrl)
						let curwebview = this.$mp.page.$getAppWebview();
						this.webview = plus.webview.open(that.loginUrl, '',{top:'246px',bottom:'100px'});
						curwebview.append(this.webview);
						this.webview.show();
					}
				})
			}
		}
	}
</script>

<style>

</style>
