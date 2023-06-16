<template>
	<view>
		<!-- v-if="chapter.file_type === 1" -->
		<view class="play-box" >
			<block>
				<video id="myVideo" :initial-time="initVideoTime" object-fit="contain"
					vslide-gesture-in-fullscreen="true" :autoplay="true" :src="chapter.course_url" poster=""
					show-play-btn="true" :title="chapter.chapter_name" @play="playerPlay" @timeupdate="timeupdate"
					@seeked="seeked" ref="video" @ended="playEnd"></video>
			</block>
			<cover-image style="width: 50rpx;height: 50rpx;position: absolute;right: 30rpx;top: 30rpx;"
				src="../../../static/images/zc_menu.png" @click="hideControl"></cover-image>
			<cover-image
				style="width: 70rpx;height: 70rpx;position: absolute;left: 160rpx;margin:auto;top: 0;bottom: 0;"
				:src="icon_pre_src" @click="pagePrevious"></cover-image>
			<cover-image
				style="width: 70rpx;height: 70rpx;position: absolute;right: 160rpx;margin:auto;top: 0;bottom: 0;"
				:src="icon_next_src" @click="pageNext"></cover-image>
			<cover-image
				style="width: 70rpx;height: 70rpx;position: absolute;margin:auto;top: 0;bottom: 0;left: 0;right: 0;"
				:src="icon_start" @click="changePlayState"></cover-image>
			<cover-view
				style="height: 50rpx;position: absolute;top: 0;bottom: 0;right: 0;text-align:center;color: #fff;width: 150rpx;margin: auto;background-image: '../../../static/images/zc_start.png';"
				@click="changeRates">
				{{rateText}}
			</cover-view>
		</view>
		
		<!-- v-if="chapter.file_type === 1" -->
		<view style="width: 100%;padding: 20rpx 30rpx;clear:both;line-height: 45rpx;font-size: 32rpx;color:#333333;font-weight: 600; border: 1px solid #F5F5F5;">
			课程列表</view>
		<!-- v-if="chapter.file_type === 1" -->
		<view class="course-video">
			<!-- 视频区 -->

			<!-- 课程介绍 -->
			<view class="flex-col-title" v-for="(item, index) in chapters" :key="item.chapter_id">
				<view class="flex-col-content"
					@click="checkChapterId = checkChapterId === item.chapter_id ? '' : item.chapter_id">
					<view class="col-content-title">{{ item.chapter_name }}</view>
					<view v-show="checkChapterId === item.chapter_id" class="iconfont icon-jiantoushang"
						style="padding: 8rpx 35rpx;font-size: x-small;color: #666666;"></view>
					<view v-show="checkChapterId !== item.chapter_id" class="iconfont icon-jiantouxia"
						style="padding: 8rpx 35rpx;font-size: x-small;color: #666666;"></view>
				</view>

				<view class="content-list-items"
					v-if="item.children.length > 0 && (!item.children.children || item.children.children.length === 0)">
					<view class="content-list-item" v-for="item2 in item.children" :key="item2.chapter_id"
						v-show="checkChapterId === item2.chapter_pid">
						
						<view v-if="item2.children.length > 0 ">
							<view class="flex-col-content"  @click="checkTwoChapterId = (checkTwoChapterId === item2.chapter_id? '':item2.chapter_id)"
								>
								<view class="col-son-title">{{item2.chapter_name}}</view>
								<view v-show="checkTwoChapterId === item2.chapter_id" class="iconfont icon-jiantoushang"
									style="padding: 8rpx 35rpx;font-size: x-small"></view>
								<view v-show="checkTwoChapterId !== item2.chapter_id" class="iconfont icon-jiantouxia"
									style="padding: 8rpx 35rpx;font-size: x-small"></view>
								<!-- <view class="iconfont icon-jiantouxia" style="padding: 8rpx 35rpx;font-size: x-small"></view> -->
							</view>
							
							<view class="content-list-item" v-for="(item3, index3) in item2.children" :key="item3.chapter_id"
									v-show="checkTwoChapterId === item3.chapter_pid" >
									
									<view :class="{'checked-item':item3.chapter_id === chapter.chapter_id}"
										style="display: flex;flex-direction:row;padding: 10rpx 0;justify-content: space-between;align-items: center"
										@click="toThreeCourseDetail(item,item2,item3)">
										
										<view style="display: flex;flex-direction: column">
											<text style="font-size: 24rpx"
												:class="{'un-checked-item':item3.chapter_id !== chapter.chapter_id,'content-list-name': true}">{{item3.chapter_name}}</text>
											<view style="font-size: x-small;display: flex;flex-direction: row;">
												<u-icon v-if="item3.file_type === 1" labelSize="20rpx" size="28rpx"
													style="padding-right: 10rpx;"
													:name="item3.chapter_id !== chapter.chapter_id?'https://qnsp.zcskjy.com/zc_images/edu_pic/zxvideo.png':'https://qnsp.zcskjy.com/zc_images/edu_pic/edu_23.png'"
													>
												</u-icon>
												<!-- <text class="iconfont icon-shipin" v-if="item2.file_type === 1"></text> -->
												<text class="iconfont icon-a-ziyuan11" v-if="item3.file_type === 2"></text>
												<text class="iconfont icon-yinpin"
													v-if="item3.file_type === 3 || item3.file_type === 4"></text>
												<text v-if="item3.file_type === 5" v-text="'共'+item3.topic_num+'题'"></text>
												<text v-else>{{chapterTypeInfo(item3)}}</text>
											</view>
										</view>
										<view>
											<!-- 当前 -->
											<text v-if="item3.chapter_id === chapter.chapter_id"
												style="background-color: #FFF4F3;padding: 6rpx 38rpx;border-radius: 50rpx;">
												<text class="iconfont icon-yinpinbofangqizhongzhuangtai"></text>
												<text
													style="font-size: smaller;font-weight: 500;font-size: 24rpx;color:#F43D3E">学习中</text>
											</text>
											<!-- 收费 -->
											<text v-else-if="course.course_free === 0 && item_row.item_unit_price !== 0">
												<!-- 购买 -->
												<text v-if="course.is_buy">
													<!-- 已学习 -->
													<text v-if="item3.chapter_schedule">
														<text
															style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
															<text v-if="item3.file_type !== 5" style="color: #CCCCCC;"
																class="iconfont icon-bofang"></text>
															<text v-else style="color: #CCCCCC;"
																class="iconfont icon-bianji"></text>
															<text v-if="item3.file_type !== 5"
																style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("已学习")}}</text>
															<text v-else
																style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("已完成")}}</text>
														</text>
													</text>
													<!-- 待学习 -->
													<text v-else>
														<!-- 自由模式 -->
														<text v-if="course.chapter_unlock_model === 0">
															<text
																style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
																<text v-if="item3.file_type !== 5" style="color: #CCCCCC;"
																	class="iconfont icon-suoding"></text>
																<text v-else style="color: #CCCCCC;"
																	class="iconfont icon-bianji"></text>
																<text v-if="item3.file_type !== 5"
																	style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("待学习")}}</text>
																<text v-else
																	style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("写作业")}}</text>
															</text>
														</text>
														<!-- 闯关模式 -->
														<text v-else>
															<!-- 已解锁 -->
															<text v-if="item3.chapter_unlock">
																<text
																	style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
																	<text v-if="item3.file_type !== 5"
																		style="color: #CCCCCC;"
																		class="iconfont icon-suoding"></text>
																	<text v-else style="color: #CCCCCC;"
																		class="iconfont icon-bianji"></text>
																	<text v-if="item3.file_type !== 5"
																		style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("待学习")}}</text>
																	<text v-else
																		style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("写作业")}}</text>
																</text>
															</text>
															<!-- 未解锁 -->
															<text v-else>
																<text
																	style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
																	<text style="color: #CCCCCC;"
																		class="iconfont icon-jiesuo"></text>
																	<text v-if="item3.file_type !== 5"
																		style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("待学习")}}</text>
																	<text v-else
																		style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("写作业")}}</text>
																</text>
															</text>
														</text>
													</text>
												</text>
												<!-- 未购买 -->
												<text v-else>
													<text v-if="item3.chapter_try_see"
														style="border: 1px solid #999999;padding: 6rpx 36rpx;border-radius: 50rpx">
														<text class="iconfont icon-bofang"></text>
														<text v-if="item3.file_type === 1 || item3.file_type === 2"
															style="font-size: smaller;font-weight: 400;">{{ __('免费试看') }}</text>
														<text v-else-if="item3.file_type === 3 || item3.file_type === 4"
															style="font-size: smaller;font-weight: 400;">{{ __('免费试听') }}</text>
													</text>
													<text v-else>
														<image style="width: 28rpx;height: 32rpx;padding: 8rpx 33rpx"
															src="https://qnsp.zcskjy.com/zc_images/edu_pic/un_lock.png">
														</image>
													</text>
												</text>
											</text>
											<!-- 免费 -->
											<text v-else>
												<!-- 添加 -->
												<text v-if="course.is_buy">
													<!-- 已学习 -->
													<text v-if="item3.chapter_schedule">
														<text
															style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
															<text v-if="item3.file_type !== 5" style="color: #CCCCCC;"
																class="iconfont icon-bofang"></text>
															<text v-else style="color: #CCCCCC;"
																class="iconfont icon-bianji"></text>
															<text v-if="item3.file_type !== 5"
																style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("已学习")}}</text>
															<text v-else
																style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("已完成")}}</text>
														</text>
													</text>
													<text v-else>
														<text
															style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
															<text v-if="item3.file_type !== 5" style="color: #CCCCCC;"
																class="iconfont icon-bofang"></text>
															<text v-else style="color: #CCCCCC;"
																class="iconfont icon-bianji"></text>
															<text v-if="item3.file_type !== 5"
																style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("待学习")}}</text>
															<text v-else
																style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("写作业")}}</text>
														</text>
													</text>
												</text>
												<!-- 未添加 -->
												<text v-else>
													<image style="width: 44rpx;height: 44rpx;padding: 8rpx 24rpx"
														src="https://qnsp.zcskjy.com/zc_images/edu_pic/edu_21.png">
													</image>
												</text>
											</text>
										</view>
									</view>
								</view>
						</view> 
						<view v-else>
							<view :class="{ 'checked-item': item2.chapter_id === chapter.chapter_id }"
								style="display: flex;flex-direction:row;padding: 10rpx 0;justify-content: space-between;align-items: center"
								@click="toCourseDetail(item, item2)">
								<view style="display: flex;flex-direction: column">
									<text class="content-list-name"
										style="font-size: 24rpx;">{{ item2.chapter_name }}</text>
									<view style="font-size: x-small;display: flex;flex-direction: row;">
										<u-icon v-if="item2.file_type === 1" labelSize="20rpx" size="28rpx"
											style="padding-right: 10rpx;"
											:name="item2.chapter_id !== chapter.chapter_id?'https://qnsp.zcskjy.com/zc_images/edu_pic/zxvideo.png':'https://qnsp.zcskjy.com/zc_images/edu_pic/edu_23.png'">
										</u-icon>
										<text class="iconfont icon-a-ziyuan11" v-if="item2.file_type === 2"></text>
										<text class="iconfont icon-yinpin"
											v-if="item2.file_type === 3 || item2.file_type === 4"></text>
										<text v-if="item2.file_type === 5" v-text="'共' + item2.topic_num + '题'"></text>
										<text v-else>{{ chapterTypeInfo(item2) }}</text>
									</view>
								</view>

								<!-- 当前 -->
								<text v-if="item2.chapter_id === chapter.chapter_id"
									style="background-color: #FFF4F3;padding: 0 38rpx;border-radius: 50rpx;">
									<text class="iconfont icon-yinpinbofangqizhongzhuangtai"></text>
									<text
										style="font-size: smaller;font-weight: 500;font-size: 24rpx;color:#F43D3E">学习中</text>
								</text>
								<!-- 收费 -->
								<text v-else-if="course.course_free === 0 && item_row.item_unit_price !== 0">
									<!-- 购买 -->
									<text v-if="course.is_buy">
										<!-- 已学习 -->
										<text v-if="item2.chapter_schedule">
											<text
												style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
												<text v-if="item2.file_type !== 5" style="color: #CCCCCC;"
													class="iconfont icon-bofang"></text>
												<text v-else style="color: #CCCCCC;" class="iconfont icon-bianji"></text>
												<text v-if="item2.file_type !== 5"
													style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("已学习")}}</text>
												<text v-else
													style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("已完成")}}</text>
											</text>
										</text>
										<!-- 待学习 -->
										<text v-else>
											<!-- 自由模式 -->
											<text v-if="course.chapter_unlock_model === 0">
												<text
													style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
													<text v-if="item2.file_type !== 5" style="color: #CCCCCC;"
														class="iconfont icon-suoding"></text>
													<text v-else style="color: #CCCCCC;"
														class="iconfont icon-bianji"></text>
													<text v-if="item2.file_type !== 5"
														style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("待学习")}}</text>
													<text v-else
														style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("写作业")}}</text>
												</text>
											</text>
											<!-- 闯关模式 -->
											<text v-else>
												<!-- 已解锁 -->
												<text v-if="item2.chapter_unlock">
													<text
														style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
														<text v-if="item2.file_type !== 5" style="color: #CCCCCC;"
															class="iconfont icon-suoding"></text>
														<text v-else style="color: #CCCCCC;"
															class="iconfont icon-bianji"></text>
														<text v-if="item2.file_type !== 5"
															style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("待学习")}}</text>
														<text v-else
															style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("写作业")}}</text>
													</text>
												</text>
												<!-- 未解锁 -->
												<text v-else>
													<text
														style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
														<text style="color: #CCCCCC;" class="iconfont icon-jiesuo"></text>
														<text v-if="item2.file_type !== 5"
															style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("待学习")}}</text>
														<text v-else
															style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("写作业")}}</text>
													</text>
												</text>
											</text>
										</text>
									</text>
									<!-- 未购买 -->
									<text v-else>
										<text v-if="item2.chapter_try_see"
											style="border: 1px solid #999999;padding: 6rpx 36rpx;border-radius: 50rpx">
											<text class="iconfont icon-bofang"></text>
											<text v-if="item2.file_type === 1 || item2.file_type === 2"
												style="font-size: smaller;font-weight: 400;">{{ __('免费试看') }}</text>
											<text v-else-if="item2.file_type === 3 || item2.file_type === 4"
												style="font-size: smaller;font-weight: 400;">{{ __('免费试听') }}</text>
										</text>
										<text v-else>
											<image style="width: 28rpx;height: 32rpx;padding: 8rpx 33rpx"
												src="https://qnsp.zcskjy.com/zc_images/edu_pic/un_lock.png">
											</image>
										</text>
									</text>
								</text>
								<!-- 免费 -->
								<text v-else>
									<!-- 添加 -->
									<text v-if="course.is_buy">
										<!-- 已学习 -->
										<text v-if="item2.chapter_schedule">
											<text
												style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
												<text v-if="item2.file_type !== 5" style="color: #CCCCCC;"
													class="iconfont icon-bofang"></text>
												<text v-else style="color: #CCCCCC;" class="iconfont icon-bianji"></text>
												<text v-if="item2.file_type !== 5"
													style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("已学习")}}</text>
												<text v-else
													style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("已完成")}}</text>
											</text>
										</text>
										<text v-else>
											<text
												style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
												<text v-if="item2.file_type !== 5" style="color: #CCCCCC;"
													class="iconfont icon-bofang"></text>
												<text v-else style="color: #CCCCCC;" class="iconfont icon-bianji"></text>
												<text v-if="item2.file_type !== 5"
													style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("待学习")}}</text>
												<text v-else
													style="font-size: smaller;font-weight: 400;color:#CCCCCC;font-size: 24rpx">{{__("写作业")}}</text>
											</text>
										</text>
									</text>
									<!-- 未添加 -->
									<text v-else>
										<image style="width: 44rpx;height: 44rpx;padding: 8rpx 24rpx"
											src="https://qnsp.zcskjy.com/zc_images/edu_pic/edu_21.png">
										</image>
									</text>
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 图文区 -->
		<view v-if="chapter.file_type === 2 || chapter.file_type === 3 ||chapter.file_type === 4" v-show="false" class="article-page">
			<view class="article-content">
				<view class="article-title">{{ chapter.chapter_name }}</view>
				<rich-text class="article-html" :nodes="html(chapter.course_content)"
					style="font-size: 14px;line-height: 1.8;color:#333"></rich-text>
			</view>
			<view></view>
			<view v-if="chapter.file_type === 2" class="article-foot">
				<button :disabled="!hasPrevious(chapter.chapter_id)" class="article-foot-button" type="default"
					@click="pagePrevious()">上一篇</button>
				<button :disabled="!hasNext(chapter.chapter_id)" class="article-foot-button" type="default"
					@click="pageNext()">下一篇</button>
			</view>
			<view v-if="chapter.file_type === 3 || chapter.file_type === 4" class="article-audio-foot">
				<view class="article-audio-foot">
					<view class="iconfont icon-guanbi" @click="showplay()"></view>
					<audio-cc ref="player" :duration="getDuration()" :title="pchapter.chapter_name"
						:subtitle="chapter.chapter_name" :src="chapter.course_url ? chapter.course_url : ''"
						@next="playNext()" @timeupdate="playTimeupdate" @previous="playPrevious()"></audio-cc>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import htmlParser from '@/helpers/plugins/html-parser.js';
	import audioCc from '@/components/audio/audio-cc.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				initVideoTime: 0,
				timeStamp: 11841,
				
				checkChapterId: '', // 当前展开的目录
				checkTwoChapterId: '', // 当前展开的二级列表的目录
				
				chapter_id: '', // 当前播放小节
				item_row: {},
				item_id: '',
				icon_next_src: '',
				icon_pre_src: '',
				icon_start: '',
				playShow: false,
				showControl: false,
				course: {}, // 课程对象
				
				pchapter: {}, // 当前父节点
				mchapter:{},  // 三级列表 中间层级章节
				chapter: {}, // 当前选择的小节
				cchapter: {}, // 当前选择的小节
				
				chapters: [], // 小节树列表
				
				chapterChildrens: [], // 小节类列表
				playOptions: [],
				rateText: '',
				videoContext: null,
				playbackRate: 2,
				rate: [0.5, 0.8, 1.0, 1.25, 1.5],
				ratePos: 2,
				enterTime: '', // 页面进入时间
				// stayTime: 0, // 页面隐藏时间毫秒
				scheduleTimer: {}, // 更新课程进度定时器
				// 视频
				video: {
					startTime: '',
					state: false
				},
				// 图文
				graphics: {
					startTime: ''
				},
				timer: null
			};
		},
		components: {
			audioCc
		},
		filters: {
			// durationForHuman(data) {
			// 	return this.durationForHuman(data)
			// }
		},
		mounted() {
			this.videoContext = uni.createVideoContext('myVideo', this)
			this.initTimer();
		},
		//实例销毁之前调用。在这一步，实例仍然完全可用。
		beforeDestroy() {
			this.scheduleTimer.destroy();
		},
		onLoad: function(options) {
			// this.videoContext = uni.createVideoContext('myVideo', this)
			// this.playbackRate = 2
			// this.videoContext.playbackRate(1.0)
            this.addFlags();
			this.graphics.startTime = new Date();
			let item_id = this.item_id;
			if (item_id) {
				this.getProductItem(item_id);
			} else {
				this.chapter_id = Number(options.chapter_id);
				this.item_id = options.item_id
				this.getProductItem(options.item_id);
			}
		},
		onHide() {},
		onUnload() {
			if (this.isTrySee()) {
				return
			}

			let fileType = this.chapter.file_type;
			if (fileType === 4) {
				this.$refs.player.stopAudio();
			}

			if (fileType === 1) {
				this.playerPause();
				return;
			}

			if (fileType === 2 || fileType === 4) {
				this.saveGraphicsSchedule();
			}
		},
		computed: {
			...mapState(['Config'])
		},
		watch: {
			chapter: {
				handler(newVal, oldVal) {
					if (newVal) {
						// 课件类型（0:无，1:视频，2:图文，3:音频，4:图文音频）
						let file_type = newVal.file_type;
						if (file_type === 2 || file_type === 4) {
							let params = {
								chapter_current_time: 0,
								chapter_history_time: 0,
								chapter_learn_time: 0,
								chapter_time: 0
							};
							this.saveChapterStock(params);
						}
					}
				},
				immediate: true
			}
		},
		methods: {
			 // 禁止截屏
			    addFlags() {
			        // #ifdef APP-PLUS
			        let osname = plus.os.name
			        if (osname == "Android") {
			            var activity = plus.android.runtimeMainActivity()
			            console.log(activity);
			            console.log('开启防截屏');
			            plus.android.invoke(plus.android.invoke(activity, "getWindow"), "addFlags", 0x00002000)
			        }
			        // #endif
			    },
			    //  允许截屏  
			    clearFlags() {
			        // #ifdef APP-PLUS
			        let osname = plus.os.name
			        if (osname == "Android") {
			            var activity = plus.android.runtimeMainActivity()
			            console.log('关闭防截屏');
			            plus.android.invoke(plus.android.invoke(activity, "getWindow"), "clearFlags", 0x00002000)
			        }
			        // #endif
			    },
			saveGraphicsSchedule() {
				let outTime = new Date();
				//停留时间(毫秒)
				let stayTime = outTime.getTime() - this.graphics.startTime.getTime();
				let study_time = Math.round(stayTime / 1000);
				let params = {
					product_id: this.course.product_id,
					chapter_id: this.chapter.chapter_id,
					chapter_current_time: 0,
					chapter_history_time: 0,
					chapter_learn_time: study_time,
					chapter_time: 0
				};
				this.saveSchedule(params);
				this.graphics.startTime = outTime;
			},
			saveChapterStock(e) {
				let params = {
					product_id: this.course.product_id,
					chapter_id: this.chapter.chapter_id,
					chapter_current_time: e.chapter_current_time,
					chapter_history_time: e.chapter_history_time,
					chapter_learn_time: e.chapter_learn_time,
					chapter_time: e.chapter_time
				};
				this.saveSchedule(params);
			},
			showplay() {
				this.playShow = false
				this.$refs.player.pauseAudio()
			},
			// 解析富文本 html字符串
			html(strHtml) {
				if (!strHtml) return '';
				strHtml = '<div>' + strHtml + '</div>';
				/*
					let nodes = htmlParser(strHtml)
					if(!nodes || nodes.length == 0) return ""

					let div = nodes[0]
					let childrens = div.children
					console.log(nodes) */

				strHtml = strHtml
					.replace(/\<img/gi,
						"<img style='vertical-align: top;max-width: 100%; border-radius: 6px; background-color: #eee;'")
					.replace(/\<p/gi,
						"<p style='margin: 0;min-height: 30px;margin-left: 0px;margin-bottom: 30px;font-weight: 400;font-size: 17px;line-height: 30px;color: #353535;'"
					);

				return htmlParser(strHtml);
			},
			isIos() {
				let info = uni.getSystemInfoSync();
				return info.platform === 'ios';
			},
			durationForHuman() {
				let minutes = parseInt(duration / 60);
				let seconds = duration % 10;
				if (minutes.length === 0) {
					minutes = '0' + minutes.toString();
				}
				if (seconds.length === 0) {
					seconds = '0' + seconds.toString();
				}
				return minutes + '分钟' + seconds + '秒';
			},
			getProductItem(item_id) {
				var that = this;
				that.$.request({
					url: that.Config.URL.edu.getProductItem,
					data: {
						item_id: item_id
					},
					loading:false,
					success: function(data, status) {
						if (status === 200 && data.item_row) {
							that.item_row = data.item_row;

							if (data.item_row.course) {
								that.course = data.item_row.course;
							
								that.chapter = data.item_row.course.chapter;
								that.chapters = data.item_row.course.chapter.chapterTree;
								that.chapterChildrens = data.item_row.course.chapter.children;
							}
							
							
							// if(!that.mchapter){
							// 	let mchapter = data.item_row.course.chapter.children[0];
							// 	if(mchapter.children.length >0){
							// 		that.mchapters = mchapter
							// 	 }	
							// }
							
							if (that.chapter_id) {
								that.getChapter(that.course.product_id, that.chapter_id);
							}
						}
					}
				});
			},
			// 设置当前选择小节
			setChapter(chapters, chapter_id) {
				//
				console.info('---setChapter-----',chapters, chapter_id);
				
				this.getChapter(product_id, chapter2.chapter_id);
				let chapter = chapters.find(item => item.chapter_id === chapter_id);
				if (chapter) {
					this.chapter = chapter;
					this.checkChapterId = chapter.chapter_pid;
				}
			},
			
			changeRate(rate, index) {
				this.playbackRate = index;
				this.videoContext.playbackRate(this.rate[this.playbackRate]);
			},
			// 下一首
			playNext() {
				let index = this.chapterChildrens.findIndex(item => item.chapter_id === this.chapter.chapter_id);
				if (index === this.chapterChildrens.length) {} else {
					let chapter = this.chapterChildrens[index + 1];
					if (chapter && chapter.course_url) {
						this.saveGraphicsSchedule();
						let product_id = this.course.product_id;
						this.getChapter(product_id, chapter.chapter_id);
						this.setPchapter();
					}
				}
			},
			changePlayState() {
				if (!this.showControl) {
					return
				}
				this.hideDelay()
				if (this.state) {
					this.videoContext.pause()
					this.state = false
					this.icon_start = '../../../static/images/zc_start.png'
				} else {
					this.videoContext.play()
					this.state = true
					this.icon_start = '../../../static/images/zc_pause.png'
				}
			},
			
			playTimeupdate(e) {
				// let params = {
				//   product_id: this.course.product_id,
				//   chapter_id: this.chapter.chapter_id,
				//   chapter_current_time: e.current,
				//   chapter_history_time: e.current,
				//   chapter_learn_time: e.time,
				//   chapter_time: e.duration,
				// }
				// this.saveSchedule(params)
			},
			
			//  图文的样式  上一首
			playPrevious() {
				let index = this.chapterChildrens.findIndex(item => item.chapter_id === this.chapter.chapter_id);
				if (index === 0) {} else {
					let chapter = this.chapterChildrens[index - 1];
					if (chapter && chapter.course_url) {
						this.saveGraphicsSchedule();
						let product_id = this.course.product_id;
						this.getChapter(product_id, chapter.chapter_id);
						this.setPchapter();
					}
				}
			},
			
			toNext() {
				
				// let index = this.chapterChildrens.findIndex(item => item.chapter_id === this.chapter.chapter_id);
				let index = 0;
				let that = this;
				
				//三级列表的情况
				if(this.mchapter.chapter_id == this.chapter.chapter_pid){
					
					index = this.chapterChildrens.findIndex(item => item.chapter_id === this.mchapter.chapter_id);
					let mindex = this.mchapter.children.findIndex(item => item.chapter_id === this.chapter.chapter_id);
					
					//index 是第二等级的索引  mindex 是第三等级的索引
					if (index === this.chapterChildrens.length - 1 &&  mindex === this.mchapter.children.length - 1){
						
						uni.showToast({
							icon: 'none',
							title: '当前已是最后一节'
						})
					}else if (mindex === this.mchapter.children.length - 1) {
						
						//假设存在的是 中间等级的章节数据
						let chapter = this.chapterChildrens[index + 1];
						if(chapter){
							
							let chapter_id;
							if(chapter.children.length >0){
								that.mchapter = chapter;
								that.chapter = chapter.children[0];
								chapter_id = chapter.children[0].chapter_id;
							}else{
								chapter_id = chapter.chapter_id;
							}	
							this.saveGraphicsSchedule();
							let product_id = this.course.product_id;
							this.getChapter(product_id, chapter_id);
						}
						
					} else{
						
						let chapter = this.mchapter.children[mindex + 1];
						if(chapter){
							this.saveGraphicsSchedule();
							let product_id = this.course.product_id;
							this.getChapter(product_id, chapter.chapter_id);
						}
					}
					
					let rate = this.rate[this.ratePos % 5]
				
					setTimeout(() => {
						this.videoContext.playbackRate(rate);
					}, 1000)
					
				}else{
					//二级列表的情况
					index = this.chapterChildrens.findIndex(item => item.chapter_id === this.chapter.chapter_id);
					if (index === this.chapterChildrens.length - 1) {
						uni.showToast({
							icon: 'none',
							title: '当前已是最后一节'
						})
					} else {
						let chapter = this.chapterChildrens[index + 1];
						if (chapter) {
							this.saveGraphicsSchedule();
							let product_id = this.course.product_id;
							this.getChapter(product_id, chapter.chapter_id);
						}
					}
					let rate = this.rate[this.ratePos % 5]
					console.info('rate=', rate)
					setTimeout(() => {
						this.videoContext.playbackRate(rate);
					}, 1000)	
				}
				
			},
			
			// 下一页
			pageNext() {
				
				if (!this.showControl) {
					return
				}
				
				this.hideDelay()
				let rate = this.rate[this.ratePos % 5]
				this.rateText = `倍速 ${rate}`
				this.videoContext.playbackRate(rate);
				this.toNext()
			},
			
			// 上一页
			pagePrevious() {
				
				if (!this.showControl) {
					return
				}
				
				this.hideDelay()
			    
				let index = 0;
			    let that = this;
				//三级列表的情况
				if(this.mchapter.chapter_id == this.chapter.chapter_pid){
					
					index = this.chapterChildrens.findIndex(item => item.chapter_id === this.mchapter.chapter_id);
					let mindex = this.mchapter.children.findIndex(item => item.chapter_id === this.chapter.chapter_id);
					//index 是第二等级的索引  mindex 是第三等级的索引
					if (index === 0 &&  mindex === 0){
						uni.showToast({
							icon: 'none',
							title: '当前已是第一节'
						})
					}else if (mindex === 0) {
						
						//假设存在的是 中间等级的章节数据
						let chapter = this.chapterChildrens[index - 1];
						if(chapter){
							let chapter_id;
							if(chapter.children.length >0){
								that.mchapter = chapter;
								// that.chapter = chapter.children[0];
								// chapter_id = chapter.children[0].chapter_id;
								that.chapter = chapter.children[chapter.children.length-1];
								chapter_id = that.chapter.chapter_id;
							}else{
								chapter_id = chapter.chapter_id;
							}	
							this.saveGraphicsSchedule();
							let product_id = this.course.product_id;
							this.getChapter(product_id, chapter_id);
						}
						
					} else{
						
						let chapter = this.mchapter.children[mindex - 1];
						if(chapter){
							this.saveGraphicsSchedule();
							let product_id = this.course.product_id;
							this.getChapter(product_id, chapter.chapter_id);
						}
					}
					
				}else{
					//二级列表的情况
					index = this.chapterChildrens.findIndex(item => item.chapter_id === this.chapter.chapter_id);
					if (index === 0) {
						uni.showToast({
							icon: 'none',
							title: '当前已是第一节'
						})
					} else {
						let chapter = this.chapterChildrens[index - 1];
						if (chapter) {
							this.saveGraphicsSchedule();
							let product_id = this.course.product_id;
							this.getChapter(product_id, chapter.chapter_id);
						}
					}
				}
				
				
				this.rateText = `倍速 ${this.rate[this.ratePos%5]}`
				let rate = this.rate[this.ratePos % 5]
				setTimeout(() => {
					this.videoContext.playbackRate(rate);
				}, 1000)
			},
			
			//设置父章节 
			setPchapter() {
				let chapter = this.chapter;
				let chapters = this.chapters;
				let chapter_pid = chapter.chapter_pid;

				this.pchapter = this.getPchapter(chapters, chapter_pid);
			},
			
			// 获取父章节 
			getPchapter(chapters, chapter_pid) {
				let pchapter = {};
				for (let i = 0; i < chapters.length; i++) {
					let chapter = chapters[i];
					let children = chapter.children;
					if (chapter.chapter_id === chapter_pid) {
						return chapter;
					} else if (children && children.length > 0) {
						pchapter = this.getPchapter(children, chapter_pid);
					}
					if (pchapter) {
						return pchapter;
					}
				}
			},
			
			chapterTypeInfo(chapter) {
				let file_type = chapter.file_type;
				let video_duration = chapter.video_duration;
				switch (file_type) {
					case 1:
						return '视频 ｜ ' + video_duration;
					case 2:
						return '图文';
					case 3:
						return '音频 ｜ ' + video_duration;
					case 4:
						return '图文音频 ｜ ' + video_duration;
				}
			},
			
			// chapter1 是第一层级   chapterM 是第二层级   chapter2是第三层级 
			toThreeCourseDetail(chapter1, chapterm, chapter2) {
				
				// 可以试看
				let chapter_try_see = chapter2.chapter_try_see
				
				let is_buy = this.course.is_buy;
				let can_study = this.course.can_study;
				if (chapter_try_see !== 1) {
					let course_free = this.course.course_free;
					let item_unit_price = this.item_row.item_unit_price
					if (!is_buy && course_free !== 1 && item_unit_price !== 0) {
						this.showPayDialogText = '您暂未购买课程，无法进行课程学习，请先购买课程后进行学习'
						this.showPayDialog = true
						return;
					}
					if(!can_study){
						this.showPayDialogText = '课程已到期，无法进行课程学习'
						this.showPayDialog = true
						this.closeDialog = true
						return;
					}
			
					if (is_buy) {
						// 判断是否关联班期
						let classes_cycle_id = this.course.classes_cycle_id
						if (classes_cycle_id) {
							// 判断是否添加私教
							let course_state = this.course.course_state;
							if (course_state === 1001) {
								// this.$.alert("请先添加私教！")
								this.showAddLecturerDialog = true
								return;
							}
			
							// 判断是否领取通知书
							if (course_state === 1002) {
								// this.$.alert("请先领取通知书！")
								this.showReceiveNoticeDialog = true
								return;
							}
						}
			
						// 闯关模式
						let unlockModel = this.course.chapter_unlock_model;
						if (unlockModel === 1) {
							// 判断课程解锁模式是否闯关模式和是否解锁
							let unlock = chapter2.chapter_unlock;
							if (!unlock) {
								this.$.alert("该章节未解锁！")
								return
							}
						}
					}
				}
			
				// 做题目
				let file_type = chapter2.file_type
				if (file_type === 5) {
					let classes_cycle_id = this.course.classes_cycle_id
					let childrens = this.chapterChildrens;
					let toFinalExam = classes_cycle_id && childrens && childrens.length > 0 && childrens[childrens.length -
						1].chapter_id === chapter2.chapter_id
			
					uni.navigateTo({
						url: '/edu/course/exam/practice-page?course_id=' + chapter2.product_id + '&chapter_id=' +
							chapter2.chapter_id + '&item_id=' + this.item_id
					});
					return;
				}
			
				// 音频
				let product_id = this.course.product_id;
				this.pchapter = chapter1;
				this.mchapter = chapterm;
				this.chapter = chapter2;
				
				console.info('---pchapter---mchapter--chapter---',this.pchapter,this.mchapter,this.chapter);
				
				uni.setNavigationBarTitle({
					title: chapter2.chapter_name
				})
				
				this.getChapter(product_id, chapter2.chapter_id);
			},
			
			toCourseDetail(chapter1, chapter2) {

				// 是否试看
				let chapter_try_see = chapter2.chapter_try_see
				let is_buy = this.course.is_buy;
				if (chapter_try_see !== 1 && is_buy) {
					// 判断是否关联班期
					let classes_cycle_id = this.course.classes_cycle_id;
					if (classes_cycle_id) {
						// 判断是否添加私教
						let course_state = this.course.course_state;
						if (course_state === 1001) {
							this.$.alert('请先添加私教！');
							return;
						}

						// 判断是否领取通知书
						if (course_state === 1002) {
							this.$.alert('请先领取通知书！');
							return;
						}
					}

					// 闯关模式
					let unlockModel = this.course.chapter_unlock_model;
					if (unlockModel === 1) {
						// 判断课程解锁模式是否闯关模式和是否解锁
						let unlock = chapter2.chapter_unlock;
						if (!unlock) {
							this.$.alert('该章节未解锁！');
							return;
						}
					}
				}

				// 更新视频进度
				if (this.chapter.file_type === 1 && this.chapter.chapter_id !== chapter2.chapter_id) {
					this.videoContext.pause();
				}

				// 做题目
				let file_type = chapter2.file_type
				if (file_type === 5) {
					let classes_cycle_id = this.course.classes_cycle_id
					let childrens = this.chapterChildrens;
					let toFinalExam = classes_cycle_id && childrens && childrens.length > 0 && childrens[childrens.length -
						1].chapter_id === chapter2.chapter_id

					uni.navigateTo({
						url: '/edu/course/exam/practice-page?course_id=' + chapter2.product_id + '&chapter_id=' +
							chapter2.chapter_id + '&item_id=' + this.item_id
					});
					return;
				}

				uni.setNavigationBarTitle({
					title: chapter2.chapter_name
				})

				this.pchapter = chapter1;
				this.chapter = chapter2;
				
				console.info('---pchapter--chapter---',this.pchapter,this.chapter);
				
				let product_id = this.course.product_id;
				this.getChapter(product_id, chapter2.chapter_id);
			},
			
			getChapter(product_id, chapter_id) {
				let that = this;
				that.$.request({
					url: that.Config.URL.edu.getChapter,
					data: {
						product_id: product_id,
						chapter_id: chapter_id
					},
					loading: false,
					success: function(data, status, msg) {
						
						if (status === 200) {
							// 可以播放
							if (data.can_watch) {
								that.chapter = data.chapter;
							     
								if(!that.mchapter.chapter_id){
									
								    // let pChapter = getPchapter(that.chapterChildrens, data.chapter.chapter_pid);
									// console.info('--pChapter----',pChapter);
									// if(pChapter){
									// 	if(pChapter.children.length >0){
									// 		that.mchapter = pChapter;
									// 	}
									// }
									
									for (let mchapter of that.chapterChildrens) {
										if(mchapter.chapter_id == that.chapter.chapter_pid){
											if(mchapter.children.length >0){
												that.mchapter = mchapter;
											}
									    }	
									}
								}
								
								//如果中间等级的 chapter 
								if(that.mchapter.chapter_id ==  data.chapter.chapter_pid){
									that.checkChapterId = that.mchapter.chapter_pid;
									that.checkTwoChapterId =  data.chapter.chapter_pid;
								}else{
									that.checkChapterId = data.chapter.chapter_pid;
								}
								uni.setNavigationBarTitle({
									title: data.chapter.chapter_name
								})
							} else {
								that.$.alert(data.msg);
							}
						}
					}
				});
			},
			playerPause(e) {
				console.log('暂停播放');
				if (this.isTrySee()) {
					return
				}
				this.video.state = false;
				// 暂停时更新课程进度 并关闭定时器
				this.scheduleTimer.destroy();
				let startTime = this.video.startTime;
				let stopTime = new Date();
				//停留时间(毫秒)
				let stayTime = stopTime.getTime() - startTime.getTime();
				let params = {
					product_id: this.course.product_id,
					chapter_id: this.chapter.chapter_id,
					chapter_current_time: this.video.current,
					chapter_history_time: this.video.current,
					chapter_learn_time: Math.round(stayTime / 1000),
					chapter_time: this.video.duration
				};
				this.saveSchedule(params);
			},
			playerPlay(e) {
				console.log('开始播放');
				if (this.isTrySee()) {
					return
				}
				this.video.startTime = new Date(); // 开始时间
				this.state = true; // 视频播放状态
				this.scheduleTimer.start();
				if (this.showControl) {
					this.icon_start = '../../../static/images/zc_pause.png'
				} else {
					this.icon_start = ''
				}
			},
			timeupdate(e) {
				this.video.current = e.detail.currentTime; // 视频观看时长
				this.video.duration = e.detail.duration; // 视频总长
				// 试看视频
				this.handleTrySee()
				// this.video.time =  1000 * 60 * 3;  // 学习时长（定时器时长）
			},
			
			seeked(e) {
				this.handleTrySee()
			},
			handleTrySee() {
				let current = this.video.current; // 视频观看时长
				// 试看视频
				let is_buy = this.course.is_buy
				let chapter_try_see = this.chapter.chapter_try_see
				let chapter_try_see_time = this.chapter.chapter_try_see_time
				if (chapter_try_see === 1 && chapter_try_see_time && chapter_try_see_time > 0 && !is_buy) {
					if (chapter_try_see_time * 60 <= current) {
						this.videoContext.pause();
						this.videoContext.exitFullScreen();
						this.videoContext.seek(0);
						this.$.alert("试看结束,要想看完整版请先购买！");
						return true
					}
				}
				return false;
			},
			isTrySee() {
				let is_buy = this.course.is_buy
				let chapter_try_see = this.chapter.chapter_try_see
				if (!is_buy && chapter_try_see === 1) {
					return true
				}
				return false
			},
			playEnd(e) {
				this.toNext()
			},
			controlstoggle(e) {
				console.info('controlstoggle', e.detail.show)
			},
			saveSchedule(params) {
				
				// console.info('-----saveSchedule----',this.isTrySee());
				// 试看免费的不保存
				if (this.isTrySee()) {
					return
				}

				let that = this;
				that.$.request({
					url: that.Config.URL.edu.saveChapterStock,
					method: 'POST',
					data: params,
					loading: false,
					success: function(data, status) {
						if (status === 200) {
							console.log('更新结果', data);
							if (data.unlock_next) {
								// that.chapters = data.chapters;
							}
						}
					}
				});
			},

			// 初始化定时器
			initTimer() {
				let that = this;
				this.scheduleTimer = {
					timer: '',
					destroy: function() {
						clearInterval(this.timer);
					},
					start: function() {
						if (this.timer) {
							this.destroy();
						}
						this.timer = setInterval(() => {
							// 每三分钟更新 音视频进度

							that.video.startTime = new Date();
							let params = {
								product_id: that.course.product_id,
								chapter_id: that.chapter.chapter_id,
								chapter_current_time: that.video.current,
								chapter_history_time: that.video.current,
								chapter_learn_time: 30,
								chapter_time: that.video.duration
							};
							that.saveSchedule(params);
							// this.start()
						}, 1000 * 30 /* * 60 * 3*/ );
					}
				};
			},
			// 有上一节
			hasPrevious(chapter_id) {
				let index = this.getChapterIndex(chapter_id);
				//如果是第一页
				if (index === 0) {
					return 0;
				}
				return this.getIsNotFirstPage(index);
			},
			// 有下一节
			hasNext(chapter_id) {
				let chapters = this.chapterChildrens
				let index = this.getChapterIndex(chapter_id);
				if (index >= chapters.length - 1) {
					return 0;
				}
				//如果是考试则不返回
				if (chapters[index + 1].file_type === 5) {
					return 0;
				}
				return index < chapters.length - 1
			},
			changeRates() {
				//支持的倍率有 0.5/0.8/1.0/1.25/1.5
				if (!this.showControl) {
					return
				}
				this.hideDelay()
				let pos = this.ratePos + 1
				this.ratePos = pos
				this.videoContext.playbackRate(this.rate[pos % 5]);
				this.rateText = `倍速 ${this.rate[pos%5]}`
			},
			
			hideDelay() {
				if (this.timer)
					clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.showControl = false,
						this.icon_next_src = '',
						this.icon_pre_src = '',
						this.icon_start = '',
						this.rateText = ''
				}, 5000)
			},
			hideControl() {
				this.hideDelay()
				this.showControl = !this.showControl
				if (!this.showControl) {
					this.icon_next_src = '',
					this.icon_pre_src = ''
					this.icon_start = '',
					this.rateText = ''
				} else {
					this.rateText = `倍速 ${this.rate[this.ratePos%5]}`
					this.icon_next_src = '../../../static/images/zc_next.png',
					this.icon_pre_src = '../../../static/images/zc_pre.png'
					if (this.state) {
						this.icon_start = '../../../static/images/zc_pause.png'
					} else {
						this.icon_start = '../../../static/images/zc_start.png'
					}
				}
			},
			getChapterIndex(chapter_id) {
				let chapters = this.chapterChildrens
				let chapter = chapters.find(s => s.chapter_id === chapter_id);
				return chapters.indexOf(chapter)
			},
			getIsNotFirstPage(index) {
				let chapters = this.chapterChildrens
				//只找当前页之前的数据
				for (let i = index; i < chapters.length; i--) {
					if (chapters[i].file_type === 2 || chapters[i].file_type === 4) {
						return true;
					}
				}
				return false;
			},
			getDuration() {
				// 课程免费
				let course_free = this.course.course_free
				let video_duration = this.chapter.video_duration
				let is_buy = this.course.is_buy
				if (course_free === 1 || is_buy) {
					if (video_duration) {
						let duration = video_duration.split(":")
						return Number(duration[0]) * 60 + Number(duration[1])
					}
					return 0
				}

				// 试看
				let chapter_try_see = this.chapter.chapter_try_see
				let chapter_try_see_time = this.chapter.chapter_try_see_time
				if (chapter_try_see === 1) {
					if (chapter_try_see_time) {
						let duration = video_duration.split(":")
						return Math.min(chapter_try_see_time * 60, Number(duration[0]) * 60 + Number(duration[1]))
					} else {
						return 0
					}
				}
			},
		}
	};
</script>

<style lang="scss">
	@import '@/components/audio/font/iconfont.css';

	page {
		background-color: #fff !important;
		min-height: 100% !important;
		height: 100% !important;
	}
	.audioContent{
		width: 750rpx;
		position: fixed;
		overflow: hidden;
	}
	.article-page {
		background-color: #ffffff;
	}

	.play-box {
		position: relative;
		width: 100%;
		height: 210px;
		float: left;
		background-color: rgba(0, 0, 0, 1);
		overflow: hidden;
	}

	.play-box>video {
		width: 100%;
		height: 210px;
		float: left;
	}

	.play-box>.no-auth {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding-left: 30px;
		padding-right: 30px;
	}

	.play-box>.no-auth>.btn {
		display: inline-block;
		width: 100%;
		height: 42px;
		line-height: 42px;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.9);
		color: #ff4b4b;
		border: 1px solid #ff4b4b;
		border-radius: 21px;
		margin-top: 70px;
	}

	.course-info {
		position: relative;
		width: 100%;
		min-height: 70rpx;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 15rpx;

		.course-title {
			font-size: 32rpx;
			font-weight: 800;
			color: #000000;
			padding: 10rpx 30rpx;
			border-bottom: 1px solid #f5f5f5;
		}

		.course-desc {
			margin: 20rpx 0;
			color: #555555;
			font-size: 28rpx;
			text-align: justify;
			overflow: hidden;
			display: -webkit-box;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
	}

	.article-title {
		margin: 0;
		padding: 30rpx 42rpx 0 38rpx;
		color: #353535;
		font-weight: 700;
		line-height: 60rpx;
		font-size: 44rpx;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.article-content {
		padding: 30rpx;
		font-size: 30rpx;
		overflow: hidden;
		padding-bottom: 200rpx;
	}

	.article-foot {
		width: 100%;
		bottom: 0rpx;
		padding: 30rpx 0rpx;
		position: fixed;
		background: #ffffff;
		transform: translateZ(0);
		bottom: env(safe-area-inset-bottom);
		box-shadow: 0rpx -5rpx 14rpx #e3e6e6;
		bottom: constant(safe-area-inset-bottom);
		display: flex;
	}

	.article-audio-foot {
		width: 100%;
		padding: 0 30rpx;
		position: fixed;
		box-sizing: border-box;
		transform: translateZ(0);
		margin-left: -2%;
		opacity: 0.85;
		bottom: calc(30rpx + constant(safe-area-inset-bottom));
		bottom: calc(30rpx + env(safe-area-inset-bottom));
	}

	/deep/ .article-foot-button {
		width: 40%;
		border-radius: 50rpx;
	}

	.article-audio-foot>.iconfont {
		position: absolute;
		top: -60rpx;
		right: 0;
	}

	.course-chapter {
		height: 0;
		overflow: hidden;
	}

	.course-menu-item {
		padding: 0 30rpx;
	}

	.course-menu-item-title {
		padding: 15rpx 0;
	}

	.course-menu-item:hover>.course-chapter {
		height: 100%;
	}

	.course-chapter-item-title {
		padding: 15rpx 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.chapter-text {
		display: inline-block;
		padding-left: 5rpx;
	}

	.flex-col-title {
		clear: both;
		padding: 0 20rpx;
		//line-height: 80rpx;
		font-size: 32rpx;
		color: #333333;

		.col-content-title {
			padding: 10rpx 0;
			font-weight: 600;
			float: left;
		}

		.col-content-name {
			float: left;
			margin-left: 20upx;
		}
		
		.col-son-title {
			padding: 20rpx 0;
			font-weight: 600;
			font-size: 27rpx;
			float: left;
		} 
	}

	.flex-col-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.content-list-item {
		border-bottom: 1px solid #F5F5F5;
	}

	.content-list-item .iconfont {
		padding-right: 10rpx;
		font-size: x-small;
	}

	.checked-item {
		color: #fa685f;
	}

	.content-list-name {
		width: 490rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
