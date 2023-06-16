<template>
	<view class="content">
		<button type="primary" @click="debug()">设置debug模式</button>
		<button type="primary" @click="init()">初始化</button>
		<button type="primary" @click="isInitSuccess()">初始化是否成功</button>
		<button type="primary" @click="checkVerifyEnable()">是否支持验证</button>
		<button type="primary" @click="getToken()">获取token</button>
		<button type="primary" @click="preLogin()">一键登录预取号</button>
		<button type="primary" @click="clearPreLoginCache()">清除预取号缓存</button>
		<button type="primary" @click="loginAuth()">请求授权一键登录</button>
		<button type="primary" @click="setCustomUIWithConfig()">自定义授权页面样式</button>
		<button type="primary" @click="setCustomDialog()">自定义弹窗授权页</button>
		<button type="primary" @click="autoLayoutUI()">自动布局授权页</button>
		<button type="primary" @click="getCode()">获取验证码</button>
		<button type="primary" @click="setTimeWithConfig()">设置获取验证码时间间隔</button>
		<view class="msg-box">
			<text class="msg">{{msg}}</text>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	const jv = uni.requireNativePlugin("JG-JVerification");
	// #endif
	export default {
		data() {
			return {
				title: 'Hello',
				msg: "",
				screenwidth:375,
				screenheight:667,
				// #ifdef APP-PLUS
				jv
				// #endif
			}
		},
		async onLoad() {
		   this.msg = "onLoad",
		
		    // uni.getSystemInfoSync().
		    this.screenheight = uni.getSystemInfoSync().windowHeight;
		   this.screenwidth = uni.getSystemInfoSync().windowWidth;
		   await this.setCustomUIWithConfig()
		   this.loginAuth()
		
		  },
		methods: {
			// 设置 debug 模式
			debug: function() {

				plus.push.getClientInfoAsync((info) => {
					let cid = info["clientid"];
					this.msg = cid
					console.log('getClientInfoAsync->cid=',cid)
					//eca6f6d99e4a388139d818b61356f75a
				}, fail => {
					console.log('getClientInfoAsync->fail',fail)
						this.msg = 'getClientInfoAsync->fail'+fail
				});

				// this.jv.setDebugMode(true);
				// let self = this;
				// self.showModal('init',"121321312");
				// uni.setTabBarItem({  
				//     index: 0,  
				// 	text:'测试',
				//     // pagePath: '../../pages/login/login',  
				// });
				
			},
			// 初始化
			init: function() {
				let self = this;
				self.jv.init({
					timeout: 7000,
					isProduction: false,
				}, result => {
					self.msg = JSON.stringify(result)
					self.showModal('init', JSON.stringify(result));
				});
			},
			// 是否初始化成功
			isInitSuccess: function() {
				let self = this;
				self.jv.isInitSuccess(result => {
					self.msg = JSON.stringify(result)
					// self.showModal('isInitSuccess',JSON.stringify(result));
				})
			},
			// 当前网络是否支持认证
			checkVerifyEnable: function() {
				let self = this;
				self.jv.checkVerifyEnable(result => {
					self.msg = JSON.stringify(result)
					// self.showModal('checkVerifyEnable',JSON.stringify(result));
				})
			},
			// 获取认证 token
			getToken: function() {
				let self = this;
				self.jv.getToken(5000, result => {
					self.showModal('getToken', JSON.stringify(result));
				})
			},
			// 一键登录预取号
			preLogin: function() {
				let self = this;
				self.jv.preLogin(5000, result => {
					self.showModal('preLogin', JSON.stringify(result));
				})
			},
			// 清除预取号缓存
			clearPreLoginCache: function() {
				this.jv.clearPreLoginCache();
			},
			// 一键登录
			loginAuth: function() {
				let self = this;
				self.jv.loginAuth({
					autoFinish: true,
					timeout: 5000
				}, result => {
					// self.showModal('loginAuth', JSON.stringify(result));
				}, event => {
					// self.showModal('loginAuth event=', JSON.stringify(event));
					console.log("loginAuthevent:" + JSON.stringify(event));
				})
			},
			// 自定义授权页面 UI 样式
			setCustomUIWithConfig: function() {
				let self = this;
				this.jv.addCustomViewsClickCallback(id => {
					
					self.showModal('customViewclick', "id:" + id);
					
					
				});
				if (uni.getSystemInfoSync().platform == "ios") {
					this.jv.setCustomUIWithConfigiOS({
						navColor: 0xff000000,
						//页面弹窗方式
						modalTransitionStyle: "FlipHorizontal",
						//导航栏是否是透明
						navTransparent: true,
					    //协议页导航栏背景颜色
						agreementNavBackgroundColor: 0xff999999,
					    		
						//logo 设置的参数
						logoImg:'static/images/login/logotop.png',
						logoWidth:200,
						logoHeight:56,
						logoOffsetY:80,
						// logoConstraints:[0,-100,200,56]
						//手机号
						numberSize:25,
						numFieldOffsetY:200,
						// numberColor:0xffFC4B21,
						//slogan
						sloganTextColor:0xffCCCCCC,
						
						//登录按钮
						// logBtnOffsetY:
						logBtnText: "本机号码一键登录",
						logBtnConstraints:[0,0,320,45],
						// logBtnCornerRadius: 22,
						// logBtnBackgroundColor: 0xffFC4B21,
						logBtnImgs:['static/images/login/login_bg.png',
									'static/images/login/login_bg.png',
									'static/images/login/login_bg.png'],
						
						//checkBox
						checkedImg:'static/images/login/checksel.png',
						uncheckedImg:'static/images/login/checkunsel.png',
						//协议按钮 默认选择状态
						privacyState: true,
						isAlertPrivacyVC:true,
						privacyCheckToastMessage:'请勾选协议',
						checkViewConstraints:[-165,290,17,17],
						
						//隐私条款
						privacyConstraints:[0,300,300,36],
						appPrivacyColor: [0xff999999,0xffFC4B21],
						privacyTextFontSize:12,
					    privacyOffsetY:10,
						privacyTextAlignment: "left",
						appPrivacys: [
							"同意",
							["和", "用户服务协议、隐私政策", "https://www.baidu.com/", "内部自定义条款1"],
							// ["、", "自定义条款2", "https://www.baidu.com/", "内部自定义条款2"],
							// ["、", "自定义条款3", "https://www.baidu.com/", "内部自定义条款3"],
							"并授权中财数科获得本机号码"
						],
						addCustomViews: [
							
							{
								type: "button",
								id: "title1",
								width: self.screenwidth,
								height: 20,
								title: "—— 其他登录方式 ——",
								textColor: 0xff666666,
								textFont:14,
								bottom: -280,
								// backgroundColor: 0xff7b68ee,
							},
							{
								type: "button",
								id: "btntag1",
								width: 50,
								height: 50,
								left: 100,
								bottom: -200,
								isFinish: true, //是否在授权页面通过自定义控件button的点击关闭授权页面
								backgroundImagePath: "static/images/login/weixinImg.png", // button正常情况下背景图片路径
								// normalImagePath:"static/bg.jpeg"  // 设置button图片路径
							},
							{
								type: "button",
								id: "btntag2",
								width: 50,
								height: 50,
								right: -100,
								bottom: -200,
								isFinish: true, // 是否在授权页面通过自定义控件button的点击关闭授权页面
								backgroundImagePath: "static/images/login/mobileImg.png", // button正常情况下背景图片路径
								// normalImagePath:"static/bg.jpeg"  // 设置button图片路径
							},
							{
								type: "label",
								width: 100,
								height: 17,
								bottom: -160,
								left: 76,
								text: "微信登录（推荐）",
								textFont: 12,
								textAlignment: 1,
								textColor: 0xff666666,
							},
							{
								type: "label",
								width: 65,
								height: 17,
								bottom: -160,
								right: -90,
								text: "验证码登录",
								textFont: 12,
								textAlignment: 1,
								// backgroundColor: 0xff7b68ee,
								textColor: 0xff666666,
							},
						
						]
					})
				} else {
					this.jv.addCustomViewsClickCallback(id => {
						self.showModal('customViewclick', "id:" + id);
					});
					this.jv.setCustomUIWithConfigAndroid({
						
						setNavColor:0xffffffff,
						setNavTransparent:true,
						///*
						setPrivacyNavColor:0xff999999,
						setNavColor: 0xff000000,
						enableHintToast: true,
						enableHintToastText: '请勾选协议',
						setLoadingViewEnable: true,
						//导航栏透明
						setStatusBarTransparent: true,
						
						//log
						setLogoImgPathFromJs: 'static/images/login/logotop.png',
						// setLogoImgPath:'static/images/login/logotop.png',
						setLogoWidth:200,
						setLogoHeight:56,
						setLogoOffsetY:80,
					    //手机号
						setNumberSize:25,
						setNumFieldOffsetY:200,
						setNumberColor:0xff333333,
						// numberColor:0xffFC4B21,
						//slogan
						setSloganTextColor:0xffCCCCCC,
						setSloganOffsetY:245,
						setSloganTextSize:12,
						
						//登录按钮
						setLogBtnText: "",
						setLogBtnTextColor:0xffFFFFFF,
						// setLogBtnTextColor:0xff666666,
						setLogBtnImgPath:'static/images/login/login_bg.png',
						setLogBtnTextColor:0xff666666,
						setLogBtnWidth:320,
						setLogBtnHeight:45,
						setLogBtnTextSize:16,
						setLogBtnOffsetY:self.screenheight/2,
						
						// //协议按钮 默认选择状态
						enableHintToast:true,
						enableHintToastText:"请勾选协议",				
						//条款	
						setPrivacyState: true,
						// setCheckedImgPathFromJs:'static/images/login/checksel.png',
						// setUncheckedImgPathFromJs:'static/images/login/checkunsel.png',
						
						setPrivacyOffsetX:27,
						setPrivacyText:['同意','并授权中财数科获得本机号码'],
						setAppPrivacyColor: [0xff999999,0xffFC4B21],
						setPrivacyTextSize: 12,
						setPrivacyCheckboxSize: 17,
						setPrivacyTopOffsetY:self.screenheight-80,
						
						setPrivacyNameAndUrlBeanList: [{
							name: "服务协议、隐私条款",
							url: "https://www.jiguang.cn/about",
							beforeName: "和",
							afterName: ","
						}],
						
						addCustomViews: [
							{
								type: "button",
								id: "backBtn",
								width: 20,
								height: 20,
								finishFlag: true, //是否在授权页面通过自定义控件button的点击关闭授权页面
								bgImgPath: "static/images/login/back.png", // button正常情况下背景图片路径
							    bgColor:0xff999999,
								margins: [20, 0, 0, 0],
								align:9,
							},
							{
								type:"image",
								// finishFlag:true,
								id:"id222",
								width:200,
								height:56,
								align:10,
								margins:[100,50,100,0],
								bgImgPath:"static/images/login/logotop.png"
							},
							{
								type: "button",
								id: "loginBtn",
								width: 320,
								height: 45,
								text:'本机号码一键登录',
								textColor:0xffffffff,
								textSize:16,
								finishFlag: true, //是否在授权页面通过自定义控件button的点击关闭授权页面
								bgImgPath: "static/images/login/login_bg.png", // button正常情况下背景图片路径
							    margins: [0, 0, 0, 0],
								align:13,
							},
							{
								type: "text",
								id: "title1",
								width: 150,
								height: 20,
								// bottom: -280,
								align:14,
								margins: [100, 450, 100, 0],
								text: "—— 其他登录方式 ——",
								textFont:14,
								//textColor: 0xff666666,
								textColor: 0xffFC4B21,
								// bgColor: 0xffcccccc,
							},
							{
								type: "button",
								id: "btntag1",
								width: 50,
								height: 50,
								finishFlag: true, //是否在授权页面通过自定义控件button的点击关闭授权页面
								bgImgPath: "static/images/login/weixinImg.png", // button正常情况下背景图片路径
							    margins: [100, 500, 0, 50],
								align: 9,
							},
							{
								type: "button",
								id: "btntag2",
								width: 50,
								height: 50,
								finishFlag: true, // 是否在授权页面通过自定义控件button的点击关闭授权页面
								bgImgPath: "static/images/login/mobileImg.png", // button正常情况下背景图片路径
							    margins: [0, 500, 100, 50],
								align: 11,
							},
							{
								type: "text",
								width: 120,
								height: 17,
								// bottom: -160,
								// left: 76,
								text: "微信登录(推荐)",
								textFont: 12,
								textColor: 0xff666666,
								margins: [76, 570, 0, 160],
								align: 9,
							},
							{
								type: "text",
								width: 80,
								height: 17,
								// bottom: -160,
								// right: -90,
								text: "验证码登录",
								textFont: 12,
								textColor: 0xff666666,
								margins: [0, 570, 80, 160],
								align: 11,
							},
						],
					 
					})
				}
			},
			
			autoLayoutUI: function() { //开发者可以自己布局授权页视图UI控件
				if (uni.getSystemInfoSync().platform == "ios") {
					this.jv.setCustomUIWithConfigiOS({
						navCustom: false,
						autoLayout: true,
						showWindow: false,
						navReturnHidden: false,
						//logo
						logoImg: "static/logo.png",
						logoConstraints: [0, -200, 60, 60],
						//number
						numberConstraints: [0, -132, 200, 14],
						//slogn
						sloganConstraints: [0, -112, 200, 14],
						//登录按钮
						logBtnConstraints: [0, -80, 220, 40],
						logBtnText: "一键登录",
						logBtnTextColor: 0x0000FF,
						privacyConstraints: [0, 180, 200, 40],
						checkViewConstraints: [-108, 180, 10, 10],
						loadingConstraints: [0, 0, 20, 20],
					})
				} else {
					this.jv.setCustomUIWithConfigAndroid({
						// setNavColor:0xff000000,
						// setLogBtnText:" 极光认证测试弹窗 ",
						// setPrivacyState:false,
						// setAppPrivacyColor:[0xff00f000,0xff000000],
						// setDialogTheme:[300, 400, 0, 0, false],
						// setLogoImgPathFromJs:"static/big.jpg",
						// setAuthBGImgPathFromJs:"static/bg.jpeg",
						// setDimAmount: 0.5,
						// privacyNeedClose:true,           //弹窗是否需要关闭按钮 
						// privacyCloseTheme:[10, 60, 0, 0],            //弹窗关闭按钮偏移量 privacyNeedClose为true时，必须设置它的偏移量
					})
				}



			},
			setCustomDialog: function() {
				if (uni.getSystemInfoSync().platform == "ios") {
					this.jv.setCustomUIWithConfigiOS({
						// privacyCheckToastMessage:"请点击同意协议",
						navCustom: true,
						autoLayout: true,
						showWindow: true,
						windowConstraints: [0, 0, 300, 300],
						windowBackgroundAlpha: 0.3,
						//logo
						logoImg: "static/logo.png",
						logoConstraints: [0, -100, 60, 60],
						//number
						numberConstraints: [0, -42, 200, 14],
						//slogn
						sloganConstraints: [0, -20, 200, 14],
						//登录按钮
						logBtnConstraints: [0, 20, 220, 40],
						logBtnText: "一键登录",
						logBtnTextColor: 0x0000FF,
						windowCornerRadius: 10,
						privacyConstraints: [0, 100, 200, 40],
						checkViewConstraints: [-108, 100, 10, 10],
						windowCloseBtnConstraints: [-135, -135, 20, 20],
						loadingConstraints: [0, 0, 20, 20],
						windowCloseBtnImgs: ["static/windowClose", "static/windowClose"],
						windowBackgroundImage: "static/bg.jpeg"
					})
				} else {
					this.jv.setCustomUIWithConfigAndroid({
						setNavColor: 0xff000000,
						setLogBtnText: " 极光认证测试弹窗 ",
						setPrivacyState: false,
						setAppPrivacyColor: [0xff00f000, 0xff000000],
						setDialogTheme: [300, 400, 0, 0, false],
						setLogoImgPathFromJs: "static/big.jpg",
						setAuthBGImgPathFromJs: "static/bg.jpeg",
						setDimAmount: 0.5,
						privacyNeedClose: true, //弹窗是否需要关闭按钮 
						privacyCloseTheme: [10, 60, 0, 0], //弹窗关闭按钮偏移量 privacyNeedClose为true时，必须设置它的偏移量
					})
				}

			},
			showModal: function(title, content) {
				uni.showModal({
					title,
					content,
				});
				this.msg = `${title} :${content}`;
			},
			// 获取验证码
			getCode: function() {
				let self = this;
				self.jv.getCode({
					phoneNumber: "18925241111", //在此替换你的phoneNumber
					signID: "1", //在此替换你的signID
					templateID: "1" //在此替换你的templateID
				}, result => {
					self.showModal('getCode', JSON.stringify(result));
				}, event => {
					console.log("getCodeEvent:" + JSON.stringify(event));
				})
			},
			// 设置前后两次获取验证码的时间间隔
			setTimeWithConfig: function() {
				this.jv.setTimeWithConfig(1000)
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 100rpx;
		margin-top: 20rpx;
	}

	.msg-box {
		display: flex;
	}

	.msg {
		font-size: 25rpx;
		word-break: break-all;
	}

	button {
		margin: 5rpx;
	}
</style>
