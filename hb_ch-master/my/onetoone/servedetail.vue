
<template>
	<view class="page">
		
		<view class="m-bg-img" style="">
			<view class="m-content-top" >
				<view class="m-top-title" > {{ '长乘学堂' }}</view>
			</view>	
			<view class="m-content-center"> 
				<view class="m-center-top flexCol">	
					<view class="m-center-title" > {{ titleStr }}</view>
					<view class="m-center-destitle" >{{'您将享受以下服务'}}</view>
					<view class="m-center-menu">
						<block v-for="(item,index) in showArr" :key="index" >
							<view class="m-menu-item">
								<image class="m-menu-photo" style="" :src='item.imagepath' ></image>
								<view class="m-menu-title" >{{item.title }}</view>
							</view>
						</block>
						<!-- <view class="m-menu-item">
							<image class="m-menu-photo" style="" src='/static/teacher1.png' ></image>
							<view class="m-menu-title" >{{'赠送藏宝图'}}</view>
						</view>
						<view class="m-menu-item">
							<image class="m-menu-photo" style="" src='/static/teacher2.png' ></image>
							<view class="m-menu-title" >{{'陪伴式学习'}}</view>
						</view>
						<view class="m-menu-item">
							<image class="m-menu-photo" style="" src='/static/teacher3.png' ></image>
							<view class="m-menu-title" >{{'开课专属礼包'}}</view>
						</view> -->
					</view>
				    
					<view class="m-radio" style="width: 50rpx;height: 50rpx;
					position: absolute;left: -25rpx;bottom: -25rpx;border-radius: 100%;background-color: #FE4C4B;"></view>
				    <view class="m-radio" style="width: 50rpx;height: 50rpx;
				    position: absolute;right: -25rpx;bottom: -25rpx;border-radius: 100%;background-color: #FE4C4B;"></view>		
				</view>
				<view class="m-center-center" >
					<!-- <image class="m-code-image" show-menu-by-longpress :src="cordImgUrl ? cordImgUrl:''" ></image> -->
				    <img class="m-code-image" show-menu-by-longpress :src="cordImgUrl ? cordImgUrl:''" ></img>
				</view>
				<view class="m-center-bottom" >
					<label class="des-title">{{'长按识别二维码立即添加'}}</label>
				</view>
			</view>
		</view>
	 </view>
</template>

<script>
	
	export default {

		data() {
			return {
			   cordImgUrl:'',
			   typeIndex:0, //默认的索引  私人管家
			   user_id:'0', //用户的uid 数据
			   product_id:'', //课程id 
			   titleStr:'', //默认的索引 
			   showArr:[
				   {
					   title:'专属VIP服务',
					   imagepath:'/static/personImg1.png'
				   },{
					   title:'精读脱水研报',
					   imagepath:'/static/personImg2.png'
				   },{
					   title:'智能炒股工具',
					   imagepath:'/static/personImg3.png'
				   }
			   ],
			   //0 专属客服私人管家    1班班     2一对一导师
			   menusArr:[
				   [
					   {
						   title:'专属VIP服务',
						   imagepath:'/static/personImg1.png'
					   },{
						   title:'精读脱水研报',
						   imagepath:'/static/personImg2.png'
					   },{
						   title:'智能炒股工具',
						   imagepath:'/static/personImg3.png'
					   }
				   ],
				   [
					   {
						   title:'赠送藏宝图',
						   imagepath:'/static/teacher1.png'
					   },{
						   title:'陪伴式学习',
						   imagepath:'/static/teacher2.png'
					   },{
						   title:'开课专属礼包',
						   imagepath:'/static/teacher3.png'
					   }
				   ],  
				   [
					   {
						   title:'1V1陪伴学习',
						   imagepath:'/static/oneImg1.png'
					   },{
						   title:'精品导师课程',
						   imagepath:'/static/oneImg2.png'
					   },{
						   title:'智能炒股工具',
						   imagepath:'/static/oneImg3.png'
					   }
				   ]
			   ]
			}
		},
		
		methods: {
			
			initPageData: function() {
				let that = this;
				
				//请求具体的列表的数据
				that.loadRequest()
			},

			// 请求列表数据
			loadRequest() {
                let that = this;
				var params;
				if(this.product_id){
					params = {
						uid: this.user_id,
						type:this.typeIndex,
						product_id:this.product_id,
					};
				}else{
					params = {
						uid: this.user_id,
						type:this.typeIndex,
					};
				}
				uni.request({
				    method: 'GET',
				    data: params,
				    url:  that.Config.URL.config.qrCode,
				    success: function (data, status) {
						console.log('--data---1-', data);
						if (data.statusCode == 200) {
						    let qrCodeUrl = data.data.result.qrCodeUrl;
						    if (qrCodeUrl) {
							//页面是否加载完成
								that.setData({
								  cordImgUrl: qrCodeUrl,
								});
							}
						} else {
						    that.setData({
						        cordImgUrl: 'https://qnsp.zcskjy.com/img/hmgj_default.png',
						    });
						}
				    },
					fail: function(data) {
						that.setData({
						    cordImgUrl: 'https://qnsp.zcskjy.com/img/hmgj_default.png',
						});
					}
				});
			},
		},

		onLoad: function(options) {
			console.log('---opt---',options)
			//页面数据初始化
			let that = this;
			if(options.typeIndex){
				that.typeIndex = options.typeIndex;
				that.user_id = options.user_id;
				that.showArr = that.menusArr[that.typeIndex]; 
				if(options.product_id){
					that.product_id = options.product_id;
				}
			}
			
			console.log('---type---',that.typeIndex);
			if(that.typeIndex == 0){
				console.log('---type-0--');
				this.titleStr ='添加您的专属顾问';
			}else if(that.typeIndex == 1){
				console.log('---type-1--');
				this.titleStr ='请您添加班主任';
			}else{
				console.log('---type-2--');
				this.titleStr ='添加您的专属顾问';
			}
			
			this.initPageData();
		},

		onShow: function(opt) {},

		onReady: function() {},
	
	}
	
</script>

<style lang="scss" scoped>
	
	.flexCol{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
	
	.flexRow{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	
	.page {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		// right: 0;
		width: 100%;
		// height: 100%;
		// min-height: 100%; 
		// background-color: #FF0000;
		// background-size: cover !important;
		// background-position: top center !important;
		// margin-bottom: var(--window-bottom);
		
		background:-wbkit-linear-gradient(to bottom,#FE4C4B,#FF484F);
		background:linear-gradient(to bottom,#FE4C4B,#FF484F);
		
	}
	
	.m-image-img{
		width: 100%;
		height: 100%;
		border: 0;
		// background-color: #007AFF;
	}
	

	.m-bg-img {
		
		width: 100%;
		height: 100%;
		// min-height: 100% !important;
		// background: url(@/static/bgImg1.png) no-repeat;
		// background: url(https://qnsp.zcskjy.com/zc_images/images/my/my-topbgimg.png) no-repeat;
		background-size:100% 100%;
	    // background-size:cover;
		// background-attachment:fixed;
		background:-wbkit-linear-gradient(to bottom,#FE4C4B,#FF484F);
		background:linear-gradient(to bottom,#FE4C4B,#FF484F);
		position: relative;
		
		.m-content-top{
			// position: absolute;
			// top: 0;
			// left: 0;
			padding-top:40rpx;
			height: 60rpx;
			text-align: center;
			width: auto;
			color: #FFFFFF;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			
			.m-top-title{
				width: auto;
				height: 60rpx;
				font-size: 40rpx;
				font-weight: 400;
				font-family: PingFangSC-Medium, PingFang SC;
			}
		}
		
		.m-content-center {
	       
			background-color: #FFFFFF;
			text-align: center;
			margin-left: 45rpx;
			margin-right: 45rpx;
			margin-top: 50rpx;
			margin-bottom: 50rpx;
			width: 660rpx;
			border-radius: 10rpx;
			position: absolute;
			top: 100rpx;
			bottom: 50rpx;
			
			.m-center-top{
				position: relative;
				// border-radius: 10rpx 10rpx 0 0;
				padding-top: 45rpx;
				padding-bottom: 45rpx;
				width: 100%;
				border-bottom: 2rpx #FF8163 dashed;
				// background:-wbkit-linear-gradient(to bottom,#F8E4D2,#F6D8BE);
				// background:linear-gradient(to bottom,#F8E4D2,#F6D8BE);
				
				.m-center-menu{
					
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					// background-color: #F0AD4E;
					margin:40rpx 40rpx 20rpx;
					// width: 100%;
					width: 580rpx;
				
					.m-menu-item{
						
						width: 175rpx;
						// background-color: #F0AD4E;
						.m-menu-photo{
							width: 100rpx;
							height: 100rpx;
						}
						.m-menu-title{
							
							color: #666666;
							line-height: 50rpx;
							height: 50rpx;
							// width: 260rpx;
							margin-top: 14rpx;
							text-align: center;
							font-size: 28rpx;
							font-weight: 400;
							font-family: PingFangSC-Regular, PingFang SC;
						}
					}
					
				}
				
				.m-center-title{
					color: #FF4C4C;
					// width: 300rpx;
					// margin-top: 15rpx;
					text-align: center;
					height: 34rpx;
					line-height: 34rpx;
					font-size: 50rpx;
					font-weight: 600;
					font-family: PingFangSC-bold, PingFang SC;
				}
				
				.m-center-destitle{
					
					color: #666666;
					text-align: center;
					height: 34rpx;
					line-height: 34rpx;
					margin-top: 20rpx;
					font-size: 34rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}
				
				.m-user-photo {
					width:120rpx;
					height: 120rpx;
					border-radius: 63rpx;
					background-color: #007AFF;
					border: #FFFFFF 6rpx solid;
				}
				
			}
			
			.m-center-center{
				
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				position: absolute;
				top: 400rpx;
				bottom: 100rpx;
				left: 0;
				right: 0;
				// background-color: #007AFF;
				
				.m-code-image{
					
					// margin: auto;
					width: 320rpx;
					height: 320rpx;
					// padding: 15rpx 20rpx;
					border-radius: 15rpx;
					border: 20rpx #F9F9F9 solid;
					// background-color: #F0AD4E;
				}
				
			}
			
			.m-center-bottom{
				background-color: #FFEDE9;
				position: absolute;
				left: 0;
				bottom: 0;
				border-radius: 0 0 10rpx 10rpx;
				color: #FF352D;
				line-height: 100rpx;
				height: 100rpx;
				width: 100%;
				text-align: center;
				font-size: 32rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}
		}
	}
			
</style>			
			
