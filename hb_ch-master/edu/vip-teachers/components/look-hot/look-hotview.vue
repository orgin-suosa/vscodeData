<template>
	<view class="tab_page2">

		<block v-if="showTeachers.length ==0 ">
			<view class="empty-view">
				<view class="top-view">
					<image style="width: 320rpx;height: 240rpx;margin-bottom: 50rpx;"
						src="https://qnsp.zcskjy.com/zc_images/emptyhot.png" mode="aspectFill"></image>
					<view class="empty-text">
						{{ '你当前还没有关注大咖哦～'}}
					</view>
				</view>
				<view class="find-view" @click="gotoFindDaKa()">
					{{ '去找大咖'}}
				</view>
			</view>
		</block>
		<block v-else>
			<view class="top-hotView" style="">
				<scroll-view scroll-x="true" style="width: 710rpx;height:100%;
				display: flex;flex-direction: row;align-items: center;justify-content: flex-start;white-space: nowrap;">
					<block v-for="(item,index) in showTeachers" :key="index">
						<view class="hot-item" @click="lookHotItemClick(index)">

							<image class="hot-image"
								:style="index%2 == 0 ? 'border-color: #FFF0F0;':'border-color: #FFFFFF;'"
								:src="item.portraitUrl" mode="aspectFill"></image>
							<!-- <text class="hot-Tv-text">{{'直播中'}}</text> -->
							<view class="hot-item-text">{{ item.teacherName }}</view>
						</view>
					</block>
				</scroll-view>
			</view>

			<view class="look-tabview">
				<u-tabs bgColor="#fff" :list="tabData" :current="followCurrentIndex" @click="changeFollowTab"
					lineWidth="40rpx" lineHeight="10rpx" lineColor="#f56c6c"
					itemStyle="padding-left: 30rpx; padding-right: 30rpx;height: 85rpx;background-color:#fff"
					:activeStyle="{
						color: '#333333',
						fontWeight: 'bold',
						transform: 'scale(1.05)',
					}" :inactiveStyle="{
						color: '#666666',
						transform: 'scale(1)'
					}">
				</u-tabs>

				<!-- guandian -->
				<view class="" v-show="followCurrentIndex == 0">
					<!-- v-if="followCurrentIndex==0" -->
					<teacherPost ref='teacherpost' :teacherId="currentTeacherId"></teacherPost>
				</view>
				<!-- zhibo -->
				<view class="" v-show="followCurrentIndex == 1">
					<!-- <hottabview ref='homeList' :list="curriculumList" :requestUrl='videoUrlList' @itemClcik='lookVideoJump'
						:eltmType='2' style="padding:30rpx 12rpx;"></hottabview> -->
					<!-- <scroll-view class="list" scroll-y style="padding:30rpx 12rpx;">
						<view class="waterfall-box h-flex-x h-flex-2">
							<view>
								<helang-waterfall v-for="(item,index) in leftList" :key="index" :itemmodel="item"
									tag="left" :index="index"  @click="onClick"></helang-waterfall>
							</view>
							<view>
								<helang-waterfall v-for="(item,index) in rightList" :key="index" :itemmodel="item"
									tag="right" :index="index" @click="onClick" ></helang-waterfall>
							</view>
						</view>
					</scroll-view> -->
					<waterflowview ref='lookwaterView' :eltmType='2' :list="curriculumList" @itemClick='lookVideoJump'></waterflowview>
					<view class="" style="height: auto;" v-if="curriculumList.length == 0">
						<aempty-view style="margin-top:120rpx;align-self: center;"></aempty-view>
					</view>
				</view>
				<!-- duanshipin -->
				<view class="" v-show="followCurrentIndex == 2">
					<!-- <hottabview ref='videoList' :list="videoItemsArr" :requestUrl='videoUrlList'
						@videoClick='videoItemClick' :eltmType='1' style="padding:30rpx 12rpx;"></hottabview> -->
					<waterflowview ref='videowaterView' :eltmType='1' :list="videoItemsArr" @itemClick='videoItemClick'></waterflowview>		
					<view class="" style="height: auto;" v-if="videoItemsArr.length == 0">
						<aempty-view style="margin-top:120rpx;" showTitle="暂无数据"></aempty-view>
					</view>
				</view>
				<!-- kecheng -->
				<view class="" v-show="followCurrentIndex == 3">
					<block v-if="showCoursePage">
						<courseIntroduction @click="goCourseDetail(product_id,item_id)" class="courseList"
							style="padding: 25rpx 30rpx;background-color: #ffffff;" :list="hotCourseArr">
						</courseIntroduction>
					</block>
					<block v-else>
						<view class="" style="height: auto;">
							<aempty-view style="margin-top:100rpx;" showTitle="暂无数据"></aempty-view>
						</view>
					</block>
				</view>
			</view>
		</block>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import teacherPost from '@/edu/vip-teachers/components/teacher-post/teacher-post.vue';
	import courseIntroduction from '@/components/home/courseIntroduction'
	import hottabview from '@/components/add-new/tabVideo-view.vue'
	import videohotitem from '@/components/add-new/videoHotItem.vue'
	//瀑布流插件
	import helangWaterfall from "@/components/helang-waterfall/helang-waterfall.vue"
    import waterflowview from '@/components/add-new/waterflow-view.vue'
   
   
	export default {
		props: {
			viewHeight: {
				type: Number,
				default: 1000
			}
		},
		components: {
			teacherPost,
			hottabview,
			videohotitem,
			courseIntroduction,
			helangWaterfall,
			waterflowview
		},

		data() {
			return {

				showTeachers: [], //直播
				teachesIdsArr: [], //直播
				tabData: [{
					name: '观点'
				}, {
					name: '直播',
				}, {
					name: '短视频'
				}, {
					name: '课程',
				}],
				followCurrentIndex: 3,
				showCoursePage: true,
				showVideoPage: true,
				//直播数组
				curriculumList: [],
				//热门课程数组
				videoUrlList: '',
				videoItemsArr: [],
				//热门课程数组
				hotCourseArr: [],

				currentTeacherId: '', // 老师观点
				//记录页面索引的数组
				pagesIndexArr: [1, 1, 1, 1],

				indexList: [],
				urls: [
					'https://cdn.uviewui.com/uview/album/1.jpg',
					'https://cdn.uviewui.com/uview/album/2.jpg',
					'https://cdn.uviewui.com/uview/album/3.jpg',
					'https://cdn.uviewui.com/uview/album/4.jpg',
					'https://cdn.uviewui.com/uview/album/5.jpg',
				],

				//瀑布流需要的东西
				leftHeight: 0,
				rightHeight: 0,
				leftList: [],
				rightList: [],
				ajax: {
					// 是否可以加载
					load: true,
					// 加载中提示文字
					loadTxt: '',
					// 每页的请求条件
					rows: 20,
					// 页码
					page: 1,
				}
			}
		},
		// 
		computed: {
			...mapState(['Config', 'hasLogin', 'userInfo']),
		},

		created() {

			let that = this;
			that.setData({
				videoUrlList: this.Config.URL.newsUrl.videolist
			});
			console.info('----UrlList----', that.videoUrlList);

			that.getTeacherList();


			// let ary = [];
			// for (let i = 0, length = that.tabData.length; i < length; i++){
			// 	ary.push({loadPageFlag:false,pageNum:1,totalPage:1,status:'more'});
			// }	
			// that.pagesIndexArr = ary;
		},

		methods: {

			//跳转大咖列表页面
			gotoFindDaKa() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				uni.navigateTo({
					url: '/edu/teacher-more/teacher-more'
				})
			},

			//下拉刷新
			loadRefresh() {

				console.info('--look---this.showTeachers------', this.showTeachers);
				if (this.hasLogin && this.showTeachers.length == 0) {
					console.info('--follow----hasLogin--1111');
					this.getTeacherList();
				}
				if (this.hasLogin == false) {
					this.showTeachers = [];
					return;
				}
				// console.info('--loadRefresh---followCurrentIndex-----',this.followCurrentIndex);
				if (this.followCurrentIndex == 0) {

					if (this.currentTeacherId !== '') {
						this.$refs.teacherpost.loadRefresh(this.currentTeacherId);
					}
				} else if (this.followCurrentIndex == 1) {
					this.pagesIndexArr[1] = 1;
					this.getLiveVideoList(1);
				} else if (this.followCurrentIndex == 2) {
					this.pagesIndexArr[2] = 1;
					this.getMediaList(1);
				} else if (this.followCurrentIndex == 3) {
					this.pagesIndexArr[3] = 1;
					this.getCourseList(1);
				}
			},

			loadmore() {
				if (this.followCurrentIndex == 0) {
					// console.info('--hot---圈子----loadmore-----');
					this.$refs.teacherpost.loadmore(this.currentTeacherId);
				} else if (this.followCurrentIndex == 1) {
					// console.info('--hot---直播----loadmore---000--');
					let pageNum = this.pagesIndexArr[1] + 1;
					this.getLiveVideoList(pageNum);
				} else if (this.followCurrentIndex == 2) {
					// console.info('--hot---短视频----loadmore-----');
					let pageNum = this.pagesIndexArr[2] + 1;
					this.getMediaList(pageNum);
				} else if (this.followCurrentIndex == 3) {
					// console.info('--hot---课堂-----loadmore-----');
					let pageNum = this.pagesIndexArr[3] + 1;
					this.getCourseList(pageNum);
				}
			},

			changeFollowTab(event) {
				let that = this;
				this.followCurrentIndex = event.index;
				// console.log('---changeFollowTab---', event.index, this.followCurrentIndex);
			},

			//看热点老师列表
			lookHotItemClick(index) {
				// console.info('---lookHotItem----index---', index);
				let model = this.showTeachers[index];
				let that = this;
				if (!that.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				this.$.gopage('/community/community/userspace?uid=' + model.teacherId);
			},

			goCourseDetail(product_id, item_id) {

				let again_url = this.$.sprintf("/edu/course/class-detail?product_id=%d&item_id=%d", product_id, item_id);
				uni.navigateTo({
					url: again_url
				})
			},

			getTeacherList() {
				let that = this;
				let uid = that.userInfo.user_id;
				uni.request({
					url: that.Config.teacherListDate,
					methods: 'GET',
					data: {
						userId: uid
					},
					loading: false,
					success: function(res) {
						let teacherData = res?.data?.result;
						that.showTeachers = [];
						that.teachesIdsArr = [];
						teacherData.forEach(function(item, i, array) {
							if (item.focusFlag == true) {
								that.showTeachers.push(item);
								that.teachesIdsArr.push(item.teacherId);
							}
						});

						console.info('---teachesIdsArr---', that.teachesIdsArr);

						if (that.hasLogin) {
							if (that.teachesIdsArr.length > 0) {
								let teacherId = that.teachesIdsArr[0];
								that.setData({
									currentTeacherId: teacherId,
								});
							}
							//直播接口
							that.getLiveVideoList(1);
							//视频列表接口
							that.getMediaList(1);
							// //课程接口
							that.getCourseList(1);
						}
					}
				});
			},

			// getTeacherLiveList: auth + '/v1/live/getTeacherLiveList',
			// getTeacherMediaList: auth + '/v1/mall/getTeacherMediaList',

			//短视频
			getMediaList(pageNum) {
				var that = this;
				uni.request({
					url: that.Config.URL.getTeacherMediaList,
					loading: false,
					method: 'POST',
					data: {
						tidList: that.teachesIdsArr,
						pageNum: pageNum,
						pageSize: 20,
					},
					success: function(res) {
						uni.stopPullDownRefresh();
						let tagList;
						if (res.statusCode === 200) {
							let result = res.data.result;
							//下拉刷新的时候 才重置清空数组
							if (pageNum == 1) {

								that.videoItemsArr = [];
							}
							//修改pagenum
							if (pageNum <= result.totalPage) {
								that.pagesIndexArr[2] = pageNum;
							}
							// console.info('---getMediaList---result-----',result.list);

							that.setData({
								videoItemsArr: that.videoItemsArr.concat(result.list),
							});
                          
                            that.$refs.videowaterView.addList(that.videoItemsArr)
							console.info('---videoItemsArr-----', that.videoItemsArr);

							if (pageNum >= result.totalPage) {
								// uni.showToast({
								// 	icon: 'none',
								// 	title: '暂无更多数据了'
								// })
							}

							if (that.videoItemsArr.length <= 0) {
								that.showVideoPage = false;
							} else {
								that.showVideoPage = true;
							}
						}
					}
				});
			},

			getCourseList(pageNum) {
				var that = this;
				let type = 1;
				//type_id 0-精品课；1-训练营；2-导师课
				let newType = null;
				uni.request({
					url: that.Config.URL.edu.getProductList,
					loading: false,
					data: {
						// type_id: newType,
						category_id: 2025,
						course_category_id: 0,
						store_is_open: 1,
						page: pageNum,
						rows: 50,
						product_state_id: 1001,
						kind_id: 1205,
					},
					// success: function(data, status) {
					success: function(res) {

						// console.info('---getCourseList---data-----', res);
						uni.stopPullDownRefresh();
						let tagList;
						if (res.statusCode === 200) {
							let data = res.data.data;
							//下拉刷新的时候 才重置清空数组
							if (pageNum == 1) {
								that.hotCourseArr = [];
							}
							// console.info('---getCourseList---data--0---', data);
							//修改pagenum
							if (pageNum <= data.total) {
								that.pagesIndexArr[3] = pageNum;
							}

							data.items.forEach(function(item, i, array) {
								tagList = item.product_tag_names;
								if (that.teachesIdsArr.includes(String(item.user_id))) {
									that.hotCourseArr.push({
										classSection: item.chapter.chapterNum,
										className: item.product_name,
										classDescribe: item.product_tips,
										days: '30',
										price: item.item_unit_price,
										image: item.product_image,
										portrait: item.user_avatar,
										speaker: item.user_nickname,
										product_id: item.product_id,
										item_id: item.item_id,
										is_buy: item?.is_buy || false,
										tagList: tagList
									});
									if ((tagList ?? '') == '') return;
								}
							});

							if (pageNum >= data.total) {
								// uni.showToast({
								// 	icon: 'none',
								// 	title: '暂无更多数据了'
								// })
							}

							if (that.hotCourseArr.length <= 0) {
								that.showCoursePage = false;
							} else {
								that.showCoursePage = true;
							}
						}
					}
				});
			},

			getDateDiff(startTime, endTime, diffType = 'minute') {
				//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
				startTime = startTime.replace(/\-/g, "/");
				endTime = endTime.replace(/\-/g, "/");
				//将计算间隔类性字符转换为小写
				diffType = diffType.toLowerCase();
				var sTime = new Date(startTime); //开始时间
				var eTime = new Date(endTime); //结束时间
				//作为除数的数字
				var timeType = 1;
				switch (diffType) {
					case "second":
						timeType = 1000;
						break;
					case "minute":
						timeType = 1000 * 60;
						break;
					case "hour":
						timeType = 1000 * 3600;
						break;
					case "day":
						timeType = 1000 * 3600 * 24;
						break;
					default:
						break;
				}
				return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
			},

			getLiveVideoList(pageNum) {
				const that = this;
				const params = {
					tidList: that.teachesIdsArr,
					pageNum: pageNum,
					pageSize: 20,
				};

				uni.request({
					url: that.Config.URL.getTeacherLiveList,
					method: 'POST',
					dataType: 'jsonp',
					data: params,
					success: (res) => {

						uni.stopPullDownRefresh();

						const result = JSON.parse(res.data).result;
						if (res.statusCode == 200) {

							if (pageNum == 1) {
								that.curriculumList = [];
							}
							if (pageNum <= result.totalPage) {
								that.pagesIndexArr[1] = pageNum;
							}
							let list = result.list;

							list.forEach(function(item, i, array) {

								const startTime = item.alive_start_at;
								let playlengTime = that.getDateDiff(item.alive_start_at, item
									.alive_stop_at);

								let view_num = item.view_num;

								// if (item.alive_state == 0) {
								// 	// 预约
								// 	that.curriculumList.push({
								// 		state: item.alive_state, // 直播状态
								// 		// number: PlaybackLiveTime + startTime.substring(11, 16),
								// 		playlengTime:playlengTime,	
								// 		image: item.img_url,
								// 		isordered: false,
								// 		startTime: startTime.substring(11, 16),
								// 		page_url: item.page_url,
								// 		speaker: userName,
								// 		title: item.title,
								// 	});
								// } else if (item.alive_state == 1) {
								// 直播
								that.curriculumList.push({
									state: item.alive_state, // 直播状态
									number: view_num + '观看',
									image: item.img_url,
									playlengTime: playlengTime,
									startTime: startTime.substring(11, 16),
									page_url: item.page_url,
									portraitUrl: item.portraitUrl,
									teacherName: item.teacherName,
									title: item.title,
									alive_type: item.alive_type,
									summary: item.summary,
									comment_count: item.comment_count,
									comment_user_count: item.comment_user_count,
								});
							});
							
							//改成瀑布流的数据
							that.$refs.lookwaterView.addList(that.curriculumList);
							// console.info('--curriculumList-----', that.curriculumList);
							
							if (pageNum >= result.totalPage) {
								// uni.showToast({
								// 	icon: 'none',
								// 	title: '没有更多数据了！'
								// })
							}
						}
					},
					fail: () => {

					},
					complete: () => {

					},
				});
			},

			//短视频点击item
			videoItemClick(item) {

				console.info('---短视频---video-item--', item);
				uni.navigateTo({
					url: '/ganhuo/recomvideolist/mediaPlay?media_url=' + item.media_url + '&media_name=' + item
						.media_name + '&media_time' + item.media_time
				});
			},

			lookVideoJump(url) {
				let zc_notitle = this.$FT.getUrlKey('zc_notitle', url)
				// console.log('---zc_notitle', zc_notitle);

				let webview_live = '/my/webview/webview_live';
				let webview = '/my/webview/webview';
				if (zc_notitle == 0) {
					this.openWebview(url);
				} else {
					this.webview_live(url);
				}
			},

			webview_live(urls) {

				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				// #ifdef H5
				var e_uid = uni.getStorageSync('e_uid');
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						uni.showToast({
							icon: 'none',
							title: data,
						});
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							window.location.href = target;
						} else {
							window.location.href = urls;
						}

					},
				});
				// #endif
				//#ifdef APP-PLUS
				var e_uid = uni.getStorageSync('e_uid');
				console.log('getEUid=e_uid=', e_uid)
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						console.log('getEUid=xeLogin=', data)
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							uni.navigateTo({
								url: `/my/webview/webview_live?url=${target}`,
							});
						} else {
							uni.navigateTo({
								url: `/my/webview/webview_live?url=${urls}`,
							});
						}
					},
				});
				// #endif
			},

			openWebview(urls, path) {

				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				// #ifdef H5
				var e_uid = uni.getStorageSync('e_uid');
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						uni.showToast({
							icon: 'none',
							title: data,
						});
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							window.location.href = target;
						} else {
							window.location.href = urls;
						}
					},
				});
				// #endif

				//#ifdef APP-PLUS
				var e_uid = uni.getStorageSync('e_uid');
				console.log('getEUid=e_uid=', e_uid)
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						console.log('getEUid=xeLogin=', data)
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							console.log('getEUid=target=', target)
							uni.navigateTo({
								url: `/my/webview/webview?url=${target}`,
							});
						} else {
							uni.navigateTo({
								url: `/my/webview/webview?url=${urls}`,
							});
						}
					},
				});
				// #endif
			},
            
			// 获取数据
			getList() {
				/* 
					无真实数据，当前由 setTimeout 模拟异步请求、
					自行替换 请求方法将数据 传入 addList() 方法中
					自行解决数据格式，自行修改组件内布局和内容绑定
				*/
			   
				// if (!this.ajax.load) {
				// 	return;
				// }
				
				this.ajax.load = false;
				this.ajax.loadTxt = '加载中';
				
				setTimeout(() => {
					// 生成随机数方法
					let random = (min = 0, max) => {
						return Math.floor(Math.random() * max) + min;
					}
					// 待选的图片数据
					let imgs = [];
					// 待选的标题数据
					let titles = [
						'浙江衢州成全国首个限购限售均取消城市2限售均取消个限购限',
						'桃花坞里桃花庵，桃花庵里桃花仙；',
						'桃花仙人种桃树，又摘桃花卖酒钱。',
						'酒醒只在花前坐，酒醉还来花下眠；半醒半醉日复日，花落花开年复年。',
						'但愿老死花酒间，不愿鞠躬车马前；',
						'车尘马足富者趣，酒盏花枝贫者缘。若将富贵比贫贱，',
						'一在平地一在天；若将贫贱比车马，他得驱驰我得闲。',
						'别人笑我太疯癫，我笑他人看不穿；不见五陵豪杰墓，无花无酒锄作田。'
					];
			       						   
					let res = [];
					for (let i = 0; i < 10; i++) {
						res.push({
							cover: `${getApp().globalData.qnUrl}/zc_images/images/video${random(0,2)+1}.png`,
							title: titles[random(0, titles.length)],
							number: random(9, 9999),
							sourceDesc:'同花顺财经',
							url: `${getApp().globalData.qnUrl}/zc_images/images/video${random(0,2)+1}.png`,
							
						})
					}
					this.addList(res)
				}, 1000);
			
			},
			
			addList(res) {
				// 获取到的数据，请注意数据结构
				// console.log('分类的数组--',res[0]);
				
				this.leftHeight = 0;
				this.rightHeight = 0;
				this.leftList = [];
				this.rightList = [];
				
				if(!res || res.length < 1){
					this.ajax.loadTxt = '没有更多了';
					return;
				}
				// 左右列表高度的差
				let differ = this.leftHeight - this.rightHeight;
				// 计算差值，用于确定优先插入那一边
				let differVal = 0;
								
				// 初始化左右列表的数据
				let i = differ > 0 ? 1 : 0;
				let [left, right] = [
					[],
					[]
				];
				
				// 获取插入的方向
				let getDirection = (index)=>{
					/* 左侧高度大于右侧超过 600px 时，则前3条数据都插入到右边 */
					if(differ>= 600 && index < 3){
						differVal = 1;
						return 'right';
					}
					
					/* 右侧高度大于左侧超过 600px 时，则前3条数据都插入到左边 */
					if(differ <= -600 && index < 3){
						differVal = -1;
						return 'left';
					}
					
					/* 左侧高度大于右侧超过 350px 时，则前2条数据都插入到右边 */
					if(differ >= 350 && index < 2){
						return 'right';
					}
					/* 右侧高度大于左侧超过 350px 时，则前2条数据都插入到左边 */
					if(differ <= -350 && index < 2){
						differVal = -1;
						return 'left';
					}
					
					/* 当前数据序号为偶数时，则插入到左边 */
					if ((i+differVal) % 2 == 0) {
						return 'left';
					} else {
						/* 当前数据序号为奇数时，则插入到右边 */
						return 'right';
					}
				}
				
				// 将数据源分为左右两个列表，容错差值请自行根据项目中的数据情况调节
				res.forEach((item, index) => {
					if(getDirection(index) == 'left'){
						//console.log(`差值：${differ},方向：left，序号${index}`)
						left.push(item);
					}else{
						//console.log(`差值：${differ},方向：right，序号${index}`)
						right.push(item);
					}
					i++;
				});
				
				// 将左右列表的数据插入，第一页时则覆盖
				if(this.ajax.page == 1){
					this.leftList = left;
					this.rightList = right;
					uni.stopPullDownRefresh();
				}else{
					this.leftList = [...this.leftList, ...left];
					this.rightList = [...this.rightList, ...right];
				}
			
				this.ajax.load = true;
				this.ajax.loadTxt = '上拉加载更多';
				this.ajax.page++;
				
				// console.log('打印数据');
				// console.log(this.leftList);
				// console.log(this.rightList);
			}	
					
			
		}
	}
</script>

<style lang="scss" scoped>
	.tab_page2 {
		width: 100%;
		// height: auto;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		// background-color: #F7F7F7;

		.look-tabview {
			margin-top: 10rpx;
			width: 100%;
			height: 85rpx;
			background-color: #fff;

			.nocontent {
				color: #999;
				text-align: center;
				width: 650rpx;
				margin-left: 20rpx;
				font-size: 26rpx;
				margin-top: 100rpx;
				margin-bottom: 60rpx;
			}

			.waterfall-box {
				// padding: 10rpx 10rpx;
				box-sizing: border-box;
				height: auto;
				>view {
					// padding: 0 10rpx;
				}
			}
			.h-flex-x {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: flex-start;
				align-content: flex-start;
				&.h-flex-2 {
					>view {
						width: 50%;
					}
				}
			}
		}

		.top-hotView {
			width: 710rpx;
			height: 150rpx;
			background-color: #ffffff;
			padding: 40rpx 20rpx 20rpx;
			// display: flex;
			// overflow-x: scroll;
			// flex-direction: row;
			//  align-items: center;
			// justify-content: flex-start;			

			.hot-item {
				margin: 0 30rpx;
				width: 110rpx;
				height: 100%;
				display: inline-block;
				position: relative;
				// display: flex;
				// flex-direction: row;
				// align-items: center;
				// justify-content: flex-start;	

				.hot-image {
					width: 100rpx;
					height: 100rpx;
					background-color: #ffffff;
					border-radius: 50%;
					border-style: solid;
					border-width: 5rpx;
					border-color: #ffffff;
					z-index: 1;
					position: absolute;
					left: 0;
					top: 0;
				}

				.hot-Tv-text {
					background-color: #FF5151;
					color: #FFFFFF;
					width: 68rpx;
					height: 28rpx;
					font-size: 20rpx;
					text-align: center;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 28rpx;
					position: absolute;
					top: 80rpx;
					// left: 0;
					z-index: 99;
					border-radius: 4rpx;
					overflow: hidden;
					margin-left: 20rpx;
					margin-right: 20rpx;
				}

				.hot-item-text {
					position: absolute;
					// z-index: 99;
					bottom: 0rpx;
					color: #3F3F3F;
					line-height: 33rpx;
					height: 33rpx;
					text-align: center;
					width: 100%;
					font-size: 24rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}

			}
		}

		.empty-view {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;

			.top-view {
				width: 100%;
				height: 330rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-start;
				margin-bottom: 180rpx;

				.empty-text {
					color: #999999;
					line-height: 33rpx;
					// margin-left: 4rpx;
					text-align: center;
					font-size: 24rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}
			}

			.find-view {
				width: 300rpx;
				height: 80rpx;
				background: #F64D54;
				border-radius: 40rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 30rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
			}

		}

	}
</style>
