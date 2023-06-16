<template>
	<view class="article" v-if="loadPageFlag">

		<view class="loading-view" v-if="!loadPageFlag">{{ noData }}</view>
		<!-- <u-navbar :is-fixed="true" title="资讯详情" @rightClick="onShareBox" :rightIcon="shareIcon" :border-bottom="false" /> -->

		<view class="header-view" style="background-color: #ffffff">
			<view class="article-title">{{ title }}</view>
			<view class="source-view">
				<view class="left-view">{{ source }}</view>
				<view class="right-view">{{ '发布时间: '+time }}</view>
			</view>
		</view>

		<scroll-view scroll-y="true">
			<view class="article-content" style="background-color: #ffffff">
				<rich-text class="richText" :nodes="content"
					:style="'font-size:' + fontSize + 'rpx; line-height: '+ (fontSize + 28) +'rpx;'" style="">
				</rich-text>
			</view>
			<aexplan-view style=""></aexplan-view>
		</scroll-view>

		<!-- <uni-popup ref="share" type="share" safeArea backgroundColor="#fff">
			<view class="share-content">
				<view class="share-content-channel">
					<view class="titleBox" style="">
						<view style="font-size: 25rpx">小</view>
						<view style="font-size: 30rpx">标准</view>
						<view style="font-size: 40rpx">大</view>
					</view>
					<view style="width: 85%; height: 30rpx">
						<slider backgroundColor="#333333" activeColor="#333333" min="2" max="4" :value="fontValue"
							block-color="#F0AD4E" @change="sliderChange" step="1" />
					</view>
				</view>
				<view class="cancel" @click="closeShare">取消</view>
			</view>
		</uni-popup> -->

        <!-- <share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app> -->

	</view>
</template>

<script>
	
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import shareBoxApp from '@/components/share-box-app.vue';
	
	export default {
		data() {
			return {
				// 页面是否展示的判断
				loadPageFlag: false,
				id: '',
				articleId:'',
				fromType:'',
				title: '',
				time: '15:23',
				img: '',
				source: '',
				summaryTitle: '',
				summary: '',
				content: '',
				noData: '<p style="text-align:center;color:#666">详情加载中...</p>',
				model: Object,
				//字体大小的文字
				fontValue: 3,
				fontSize: 30,
				shareIcon: '',
				//分享数组
				shareData: {},
				shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg`,
			};
		},

		components: {
			shareBoxApp
		},

		computed: {

			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'userInfo', 'hasLogin']),
			//拼接where条件
			//查询条件 ,更多详见 ：https://uniapp.dcloud.net.cn/uniCloud/uni-clientDB?id=jsquery
			where() {
				console.log(this.articleId);
				return `_id =="${this.id}"`;
			},
		},
		onLoad(event) {

			//  #ifdef  APP-PLUS
			this.shareIcon = 'share-square';
			//  #endif
			
			console.info('----12----' ,event);
			
			//获取真实新闻id，通常 id 来自上一个页面
			if (event.articleId) {
				console.info('----13----' ,event);
				this.articleId = event.articleId;
				this.fromType = event.fromType;
				this.requestData();
			}
		},
		onReady() {
			// 开始加载数据，修改 where 条件后才开始去加载 clinetDB 的数据 ，需要等组件渲染完毕后才开始执行 loadData，所以不能再 onLoad 中执行
			if (this.articleId) {
				// ID 不为空，则发起查询
				
			} else {
				uni.showToast({
					icon: 'none',
					title: '出错了，新闻ID为空',
				});
			}
		},
		methods: {

			onShareBox() {
				let that = this;
				console.log('--model-id---', this.id);	
				let $href = that.$.sprintf('%s/h5/ganhuo/newslistpage/newdetail?id=%s', that.Config.SiteUrl, this.id);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				$href = that.$.sprintf('%s/h5/ganhuo/newslistpage/newdetail?id=%s', that.Config.SiteUrl, this.id);
				// #endif
				// #ifdef MP-WEIXIN
				$href = '/h5/ganhuo/newslistpage/newdetail?id=%s' + this.id;
				// #endif
               
				var title, shareText;
				title = that.title;
				shareText = that.source;
				console.log('$href-----2-----', $href);
				this.setData({
					shareData: {
						shareTitle: title,
						shareText: shareText,
						href: $href,
						image: that.shareLogo,
					},
				});
				console.log('分享入参：', that.shareData);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif
			},


			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
            
			//来源展示
		
			
			sliderChange(e) {
				console.log('value 发生变化：' + e.detail.value);
				this.$store.commit('setScaleFontSize', e.detail.value);
				this.fontValue = e.detail.value;
				if (e.detail.value == 4) {
					this.fontSize = 42;
				} else if (e.detail.value == 3) {
					this.fontSize = 30;
				} else if (e.detail.value == 2) {
					this.fontSize = 25;
				}
			},

			onNavigationBarButtonTap(e) {
				
				console.log('e---', e.index);
				if(e.index === 0 ){
					this.$refs.share.open();
				}else{
					this.onShareBox();
				} 							
			},
			closeShare() {
				this.$refs.share.close();
			},
			
			// 请求页面详情数据
			requestData() {
				var that = this;
				let params = {};
				params.articleId = this.articleId;
			    params.fromType = this.fromType;
				console.info('------params----', params);

				uni.request({
					method: 'GET',
					data: params,
					url: this.Config.URL.newsUrl.getNewsDetail,
					success: function(data, status) {
						console.info('--121-data----', data);
						let result = data.data.result;
						if (data.statusCode == 200) {
							//设置标题
							console.info('--result.content---', result.content);
							if (result.content === null) {
								//页面是否加载完成
								that.setData({
									loadPageFlag: true,
								});
								uni.showToast({
									title: `返回数据为null `,
									icon: 'none',
								});
							} else {
								// 调用.replace替换方法
								// let contentStr = result.content.replace(/\<img/gi, '<img style=max-width:100%;height:auto;margin-top:30rpx;margin-bottom:30rpx');

								let strArr = result.content.split('<img ');
								let resultArr = [];
								resultArr.unshift(strArr[0]);

								for (var i = 1; i < strArr.length; i++) {
									let srcStr = strArr[i];
									srcStr = srcStr.replace(/amp;/g, '');
									resultArr.push('<img ' + srcStr);
								}
								let contentStr = resultArr.join('').replace(/\<img/gi,
									'<img style=max-width:100%;height:auto;margin-top:30rpx;margin-bottom:30rpx'
									);
                                
								//
								var sourceStr = result.source;
								if(!result.source.includes('来源')){
									sourceStr = '来源: '+ sourceStr;
								}
							
								//页面是否加载完成
								that.setData({
									loadPageFlag: true,
									// model: result,
									title: result.title,
									time: result.publishTime,
									img: result.img,
									source: sourceStr,
									summaryTitle: result.summaryTitle,
									summary: result.summary,
									content: contentStr,
								});
							}

						} else {
							that.$.confirm(msg);
						}
					},
				});
			},

			loadData(data) {
				console.log('---data----111-', data);
				//如果上一页未传递标题过来（如搜索直达详情），则从新闻详情中读取标题
				if (this.title == '' && data.title) {
					this.title = data.title;
					uni.setNavigationBarTitle({
						title: data.title,
					});
				}
			},
		},
	};
</script>

<style lang="scss">
	/* 标题 */
	.uni-title {
		display: flex;
		margin-bottom: 5px;
		font-size: 14px;
		font-weight: bold;
		color: #3b4144;
	}

	.footer {
		display: flex;
		align-items: center;
	}

	.footer-button {
		display: flex;
		align-items: center;
		font-size: 12px;
		height: 30px;
		color: #fff;
		background-color: #ff5a5f;
	}

	// .ban-title {
	// 	display: flex;
	// 	align-items: center;
	// 	position: absolute;
	// 	padding: 0 15px;
	// 	width: 100%;
	// 	bottom: 0;
	// 	height: 30px;
	// 	font-size: 14px;
	// 	color: #fff;
	// 	background: rgba(0, 0, 0, 0.4);
	// 	overflow: hidden;
	// 	box-sizing: border-box;
	// }

	.uni-ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.header-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 30rpx 48rpx;

		.article-title {
			height: auto;
			padding-bottom: 8rpx;
			line-height: 60rpx;
			text-align: left;
			font-weight: bold;
			font-size: 40rpx;
			color: #333333;
			// overflow: hidden;
			white-space: wrap;
			// text-overflow: ellipsis;
		}

		.source-view {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			width: 100%;

			.left-view {
				width: auto;
				line-height: 42rpx;
				text-align: left;
				font-size: 30rpx;
				color: #333333;
				// background-color: #1AAD19;
			}

			.right-view {
				// background-color: #FFFFFF;
				// padding-left:15rpx ;
				width: auto;
				line-height: 33rpx;
				text-align: right;
				font-size: 24rpx;
				color: #999999;
			}
		}
	}

	.article-content {
		padding: 15px;
		font-size: 16px;
		overflow: hidden;


		.richText {
			font-size: 16px;
			line-height: 48rpx;
			// line-height: 1.5rem;
			color: #333;
		}

	}

	.share-content {
		position: fixed;
		bottom: 0;
		text-align: center;

		&-channel {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			width: 750rpx;
			height: 150rpx;
			padding-bottom: 60rpx;
			background: #f5f5f5;
			overflow: hidden;
			border-radius: 16rpx 16rpx 0px 0px;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			// padding-bottom: 50rpx;

			.titleBox {
				width: 80%;
				height: 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				// margin: 30upx 0;
				// margin-left: 5%;
				// padding-top: 10rpx;
				margin: auto;
				// background-color: #0077AA;
			}
		}

		.channelChild {
			width: 96upx;
			text-align: center;
			margin-right: 64upx;
		}

		uni-image {
			width: 96upx;
			height: 96upx;
		}
		.cancel {
			width: 750upx;
			height: 114upx;
			line-height: 114upx;
			background: #ffffff;
			font-size: 36upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			text-align: center;
		}
	}
</style>
