<template>
	<view class="page">
		<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
		<view class="course_nav">
			<view class="course_nav_left" @click="goback">
				<text class="iconfont icon-fanhui" style="font-size: 32rpx"></text>
			</view>
			<view class="course_nav_right" @click="onShareBox">
				<text>分享立赚<span style="color:#FFBF00">{{item_row.item_fx_cps}}</span>元</text>
				<text class="iconfont icon-zhuanfa" style="font-size: 30rpx;color: #FFFFFF;margin-left: 15rpx;"></text>
			</view>
		</view>
		<!-- 课程头部 -->
		<view class="course-thumb">
			<image class="course-img" :src="course.product_image">
				<view class="course-title">{{item_row.product_name}}</view>
		</view>
		<view class="course-info">
			<view class="info-item">
				<text
					style="margin-top: 10rpx;line-height: 30rpx;max-height: 100rpx;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{item_row.product_tips}}</text>
				<view class="info_tag" v-if="!course.is_buy">
					<view class="tag-text" v-for="(tag,index) in item_row.product_tag_names" :key="index">
						{{tag}}
					</view>
				</view>
				<view class="info-type">
					<view class="info-type-label">
						<!-- <text v-if="course.course_file_type === 0" class="iconfont icon-shipin"></text> -->
						<image style="width: 23rpx;height: 23rpx;margin-top: 15rpx;"
							src="https://qnsp.zcskjy.com/zc_images/edu_pic/detail_video.png"
							v-if="course.course_file_type === 0">
						</image>
						<text v-else-if="course.course_file_type === 1" class="iconfont icon-a-ziyuan11"
							style="font-size: small;padding-right: 10rpx"></text>
						<text v-else class="iconfont icon-yinpin" style="font-size: small;padding-right: 10rpx"></text>
						<view class="type-num">{{courseTypeInfo}}</view>
					</view>
					<view class="type-price" v-if="!course.is_buy && course.course_free !== 1">
						￥<text class="price-num"
							v-if="item_row.item_sale_price===undefined">{{item_row.item_unit_price}}</text>
						<text class="price-nums" v-else>原价:{{item_row.item_unit_price}}</text>
					</view>
					<view class="type-price" v-if="!course.is_buy && course.course_free === 1">
						<text class="price-num">{{__("免费")}}</text>
					</view>
				</view>
				<view v-if="course.is_buy">
					<view class="study_progress">学习进度</view>
					<view class="progress_item">
						<view class="progress-box">
							<!-- <progress :percent="course.is_buy?course.course_schedule:0" stroke-width="5"
								color="#F43D3E" /> -->
							<u-line-progress :percentage="course.is_buy?course.course_schedule:0" activeColor="red"
								height="8" :showText="false" :height="5"></u-line-progress>
						</view>
					</view>
					<view class="progress_num"
						style="color: #F43D3E;float: right;margin-top: 18rpx;font-weight: 600;font-size: 26rpx;">
						{{(course.is_buy?course.course_schedule:0)+"%"}}
					</view>
				</view>

			</view>

		</view>
		<view class="info-teacher" v-if="!course.is_buy">
			<view class="teacher-detail">
				<image class="teacher-img" :src="course.user_avatar" mode=""></image>
				<view class="teacher-name">{{course.user_nickname}}</view>
			<!-- 	<navigator :url="'/edu/lecturer/detail?userId='+ (course.user_id)" class="teacher-desc">简介详情 >
				</navigator> -->
				<navigator :url="'/community/community/userspace?uid=' +  (course.user_id)" class="teacher-desc">简介详情 >
				</navigator>
				
			</view>
		</view>
		<view class="class-jindu" v-if="course.is_buy && course.classes_cycle_id">
			<view :class="['class-num', course.course_state>=1001?'class-num-check':'']">
				1
			</view>
			<view :class="['class-xian', course.course_state>=1002?'class-xian-check':'']">

			</view>
			<view :class="['class-num', course.course_state>=1002?'class-num-check':'']">
				2
			</view>
			<view :class="['class-xian', course.course_state>=1003?'class-xian-check':'']">

			</view>
			<view :class="['class-num', course.course_state>=1003?'class-num-check':'']">
				3
			</view>
			<view :class="['class-xian', course.course_state>=1004?'class-xian-check':'']">

			</view>
			<view :class="['class-num', course.course_state>=1004?'class-num-check':'']">
				4
			</view>
		</view>
		<view class="info-teacher" v-if="course.is_buy && course.classes_cycle_id">
			<view :class="['study_step', course.course_state !== 1001?'step_check':'']" @click="showAddTeacher"
				v-text="course.course_state > 1001?'已添私教':'添加私教'"></view>
			<view @click="toAddNotice" :class="['study_step', course.course_state !== 1002?'step_check':'']"
				v-text="course.course_state > 1002?'已领通知书':'领通知书'"></view>
			<view :class="['study_step', course.course_state !== 1003?'step_check':'']"
				v-text="course.course_state > 1003?'已学习':'待学习'"></view>
			<view @click="jumpExam()" :class="['study_step', course.course_state !== 1004?'step_check':'']"
				v-text="course.course_state > 1004?'已考试':'期末考试'">
			</view>
		</view>


		<view v-if="course.is_buy" style="background-color: #ffffff;margin-top: 20rpx;width: 100%;">
			<!-- 选项卡 -->
			<view
				style="width: 92%;padding: 20rpx 30rpx;clear:both;line-height: 45rpx;font-size: 32rpx;color:#333333;font-weight: 600; border-bottom: 1px solid #F5F5F5;">
				课程表
			</view>
			<view class="swiper-no-swiping">
				<view class="flex-col" style="height: 100%;overflow: scroll;">

					<view class="flex-col-title" v-for="(item, index) in chapter.chapterTree" :key="item.chapter_id">
						<!-- @click="checkChapterId = (checkChapterId === item.chapter_id?'':item.chapter_id)" -->
						<!-- @click="firstlist(index)" -->
						<view class="flex-col-content"
							@click="checkChapterId = (checkChapterId === item.chapter_id?'':item.chapter_id)">
							<view class="col-content-title">{{item.chapter_name}}</view>
							<view v-show="checkChapterId === item.chapter_id" class="iconfont icon-jiantoushang"
								style="padding: 8rpx 35rpx;font-size: x-small"></view>
							<view v-show="checkChapterId !== item.chapter_id" class="iconfont icon-jiantouxia"
								style="padding: 8rpx 35rpx;font-size: x-small"></view>
						</view>

						<view class="content-list-items"
							v-if="item.children.length > 0 && (!item.children.children || item.children.children.length === 0)">

							<view class="content-list-item" v-for="(item2, index2) in item.children"
								:key="item2.chapter_id" v-show="checkChapterId === item2.chapter_pid">

								<view class="" v-if="item2.children.length > 0 ">

									<!-- @click="twolist(item,item2)" -->
									<view class="flex-col-content"
										@click="checkTwoChapterId = (checkTwoChapterId === item2.chapter_id? '':item2.chapter_id)">
										<view class="col-son-title">{{item2.chapter_name}}</view>
										<view v-show="checkTwoChapterId === item2.chapter_id"
											class="iconfont icon-jiantoushang"
											style="padding: 8rpx 35rpx;font-size: x-small"></view>
										<view v-show="checkTwoChapterId !== item2.chapter_id"
											class="iconfont icon-jiantouxia"
											style="padding: 8rpx 35rpx;font-size: x-small"></view>
										<!-- <view class="iconfont icon-jiantouxia" style="padding: 8rpx 35rpx;font-size: x-small"></view> -->
									</view>

									<!-- v-show="checkChapterId === item3.chapter_pid" -->
									<view class="content-list-item" v-for="(item3, index3) in item2.children"
										:key="item3.chapter_id" v-show="checkTwoChapterId === item3.chapter_pid">

										<view :class="{'checked-item':item3.chapter_id === cchapter.chapter_id}"
											style="display: flex;flex-direction:row;padding: 10rpx 0;justify-content: space-between;align-items: center"
											@click="toThreeCourseDetail(item,item2,item3)">

											<view style="display: flex;flex-direction: column">
												<text style="font-size: 24rpx"
													:class="{'un-checked-item':item3.chapter_id !== cchapter.chapter_id,'content-list-name': true}">{{item3.chapter_name}}</text>
												<view style="font-size: x-small;display: flex;flex-direction: row;">
													<u-icon v-if="item3.file_type === 1" labelSize="20rpx" size="28rpx"
														style="padding-right: 10rpx;"
														:name="item3.chapter_id !== cchapter.chapter_id?'https://qnsp.zcskjy.com/zc_images/edu_pic/zxvideo.png':'https://qnsp.zcskjy.com/zc_images/edu_pic/edu_23.png'">
													</u-icon>
													<!-- <text class="iconfont icon-shipin" v-if="item2.file_type === 1"></text> -->
													<text class="iconfont icon-a-ziyuan11"
														v-if="item3.file_type === 2"></text>
													<text class="iconfont icon-yinpin"
														v-if="item3.file_type === 3 || item3.file_type === 4"></text>
													<text v-if="item3.file_type === 5"
														v-text="'共'+item3.topic_num+'题'"></text>
													<text v-else>{{chapterTypeInfo(item3)}}</text>
												</view>
											</view>
											<view>
												<!-- 当前 -->
												<text v-if="item3.chapter_id === cchapter.chapter_id"
													style="background-color: #FFF4F3;padding: 6rpx 38rpx;border-radius: 50rpx;">
													<text class="iconfont icon-yinpinbofangqizhongzhuangtai"></text>
													<text
														style="font-size: smaller;font-weight: 500;font-size: 24rpx;color:#F43D3E">学习中</text>
												</text>
												<!-- 收费 -->
												<text
													v-else-if="course.course_free === 0 && item_row.item_unit_price !== 0">
													<!-- 购买 -->
													<text v-if="course.is_buy">
														<!-- 已学习 -->
														<text v-if="item3.chapter_schedule">
															<text
																style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
																<text v-if="item3.file_type !== 5"
																	style="color: #CCCCCC;"
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
															<text
																v-else-if="item3.file_type === 3 || item3.file_type === 4"
																style="font-size: smaller;font-weight: 400;">{{ __('免费试听') }}</text>
														</text>
														<text v-else>
															<image
																style="width: 28rpx;height: 32rpx;padding: 8rpx 33rpx"
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
																<text v-if="item3.file_type !== 5"
																	style="color: #CCCCCC;"
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
																<text v-if="item3.file_type !== 5"
																	style="color: #CCCCCC;"
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
								<view class="" v-else>
									<view :class="{'checked-item':item2.chapter_id === cchapter.chapter_id}"
										style="display: flex;flex-direction:row;padding: 10rpx 0;justify-content: space-between;align-items: center"
										@click="toCourseDetail(item,item2)">

										<view style="display: flex;flex-direction: column">
											<text style="font-size: 24rpx"
												:class="{'un-checked-item':item2.chapter_id !== cchapter.chapter_id,'content-list-name': true}">{{item2.chapter_name}}</text>
											<view style="font-size: x-small;display: flex;flex-direction: row;">
												<u-icon v-if="item2.file_type === 1" labelSize="20rpx" size="28rpx"
													style="padding-right: 10rpx;"
													:name="item2.chapter_id !== cchapter.chapter_id?'https://qnsp.zcskjy.com/zc_images/edu_pic/zxvideo.png':'https://qnsp.zcskjy.com/zc_images/edu_pic/edu_23.png'">
												</u-icon>
												<!-- <text class="iconfont icon-shipin" v-if="item2.file_type === 1"></text> -->
												<text class="iconfont icon-a-ziyuan11"
													v-if="item2.file_type === 2"></text>
												<text class="iconfont icon-yinpin"
													v-if="item2.file_type === 3 || item2.file_type === 4"></text>
												<text v-if="item2.file_type === 5"
													v-text="'共'+item2.topic_num+'题'"></text>
												<text v-else>{{chapterTypeInfo(item2)}}</text>
											</view>
										</view>
										<view>
											<!-- 当前 -->
											<text v-if="item2.chapter_id === cchapter.chapter_id"
												style="background-color: #FFF4F3;padding: 6rpx 38rpx;border-radius: 50rpx;">
												<text class="iconfont icon-yinpinbofangqizhongzhuangtai"></text>
												<text
													style="font-size: smaller;font-weight: 500;font-size: 24rpx;color:#F43D3E">学习中</text>
											</text>
											<!-- 收费 -->
											<text
												v-else-if="course.course_free === 0 && item_row.item_unit_price !== 0">
												<!-- 购买 -->
												<text v-if="course.is_buy">
													<!-- 已学习 -->
													<text v-if="item2.chapter_schedule">
														<text
															style="border: 1px solid #CCCCCC;padding: 6rpx 36rpx;border-radius: 50rpx;">
															<text v-if="item2.file_type !== 5" style="color: #CCCCCC;"
																class="iconfont icon-bofang"></text>
															<text v-else style="color: #CCCCCC;"
																class="iconfont icon-bianji"></text>
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
																<text v-if="item2.file_type !== 5"
																	style="color: #CCCCCC;"
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
																	<text v-if="item2.file_type !== 5"
																		style="color: #CCCCCC;"
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
																	<text style="color: #CCCCCC;"
																		class="iconfont icon-jiesuo"></text>
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
															<text v-else style="color: #CCCCCC;"
																class="iconfont icon-bianji"></text>
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
															<text v-else style="color: #CCCCCC;"
																class="iconfont icon-bianji"></text>
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
				</view>
			</view>
		</view>

		<!-- 选项卡 -->
		<!-- #ifdef APP-PLUS -->
		<u-sticky offset-top="20">
			<!-- #endif -->
			<view class="course-tabs" v-if="!course.is_buy">
				<u-tabs ref="uTabs"
					itemStyle="width:50%;padding:0px;height:100rpx;line-height:100rpx;background:#ffffff;margin-top:20upx;border-bottom:1px solid #e1e1e1"
					:activeStyle="{ color: '#000000', fontWeight: 'bold' }" lineColor="#F43D3E" lineHeight="5"
					:list="list" :current="current" @change="tabsChange" swiperWidth="750"></u-tabs>
			</view>
			<!-- #ifdef APP-PLUS -->
		</u-sticky>
		<!-- #endif -->
		<view duration="200" v-if="!course.is_buy" class="swiper-no-swiping">
			<view v-if="swiperCurrent==0" class="flex-col"
				style="height: 100%;overflow-y:scroll;padding: 40rpx 30rpx 0;padding-bottom: 85px;box-sizing: border-box;">
				<rich-text class="article-html" :nodes="html(item_row.product_detail)"
					style="font-size: 14px;line-height: 1.8;color:#333;">
				</rich-text>
			</view>
			<view v-if="swiperCurrent==1" class="flex-col" style="height: 100%;overflow: scroll;margin-bottom: 220rpx;">
				<view class="flex-col-title" v-for="item in chapter.chapterTree" :key="item.chapter_id">
					<view class="flex-col-content"
						@click="checkChapterId = (checkChapterId === item.chapter_id?'':item.chapter_id)">
						<view class="col-content-title">{{item.chapter_name}}</view>
						<view v-show="checkChapterId === item.chapter_id" class="iconfont icon-jiantoushang"
							style="padding: 8rpx 35rpx;font-size: x-small"></view>
						<view v-show="checkChapterId !== item.chapter_id" class="iconfont icon-jiantouxia"
							style="padding: 8rpx 35rpx;font-size: x-small"></view>
					</view>

					<view class="content-list-items"
						v-if="item.children.length > 0 && (!item.children.children || item.children.children.length === 0)">
						<view class="content-list-item" v-for="item2 in item.children" :key="item2.chapter_id"
							v-show="checkChapterId === item2.chapter_pid">

							<view class="" v-if="item2.children.length > 0 ">

								<!-- @click="twolist(item,item2)" -->
								<view class="flex-col-content"
									@click="checkTwoChapterId = (checkTwoChapterId === item2.chapter_id? '':item2.chapter_id)">
									<view class="col-son-title">{{item2.chapter_name}}</view>
									<view v-show="checkTwoChapterId === item2.chapter_id"
										class="iconfont icon-jiantoushang"
										style="padding: 8rpx 35rpx;font-size: x-small"></view>
									<view v-show="checkTwoChapterId !== item2.chapter_id"
										class="iconfont icon-jiantouxia" style="padding: 8rpx 35rpx;font-size: x-small">
									</view>
									<!-- <view class="iconfont icon-jiantouxia" style="padding: 8rpx 35rpx;font-size: x-small"></view> -->
								</view>

								<!-- v-show="checkChapterId === item3.chapter_pid" -->
								<view class="content-list-item" v-for="(item3, index3) in item2.children"
									:key="item3.chapter_id" v-show="checkTwoChapterId === item3.chapter_pid">

									<view :class="{'checked-item':item3.chapter_id === cchapter.chapter_id}"
										style="display: flex;flex-direction:row;padding: 10rpx 0;justify-content: space-between;align-items: center"
										@click="toThreeCourseDetail(item,item2,item3)">

										<view style="display: flex;flex-direction: column">
											<text style="font-size: 24rpx"
												:class="{'un-checked-item':item3.chapter_id !== cchapter.chapter_id,'content-list-name': true}">{{item3.chapter_name}}</text>
											<view style="font-size: x-small;display: flex;flex-direction: row;">
												<u-icon v-if="item3.file_type === 1" labelSize="20rpx" size="28rpx"
													style="padding-right: 10rpx;"
													:name="item3.chapter_id !== cchapter.chapter_id?'https://qnsp.zcskjy.com/zc_images/edu_pic/zxvideo.png':'https://qnsp.zcskjy.com/zc_images/edu_pic/edu_23.png'">
												</u-icon>
												<!-- <text class="iconfont icon-shipin" v-if="item2.file_type === 1"></text> -->
												<text class="iconfont icon-a-ziyuan11"
													v-if="item3.file_type === 2"></text>
												<text class="iconfont icon-yinpin"
													v-if="item3.file_type === 3 || item3.file_type === 4"></text>
												<text v-if="item3.file_type === 5"
													v-text="'共'+item3.topic_num+'题'"></text>
												<text v-else>{{chapterTypeInfo(item3)}}</text>
											</view>
										</view>
										<view>
											<!-- 当前 -->
											<text v-if="item3.chapter_id === cchapter.chapter_id"
												style="background-color: #FFF4F3;padding: 6rpx 38rpx;border-radius: 50rpx;">
												<text class="iconfont icon-yinpinbofangqizhongzhuangtai"></text>
												<text
													style="font-size: smaller;font-weight: 500;font-size: 24rpx;color:#F43D3E">学习中</text>
											</text>
											<!-- 收费 -->
											<text
												v-else-if="course.course_free === 0 && item_row.item_unit_price !== 0">
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
							<view class="" v-else>
								<view :class="{'checked-item':item2.chapter_id === cchapter.chapter_id}"
									style="display: flex;flex-direction:row;padding: 10rpx 0;justify-content: space-between;align-items: center"
									@click="toCourseDetail(item,item2)">
									<view style="display: flex;flex-direction: column">
										<text style="font-size: 24rpx;"
											:class="{'un-checked-item':item2.chapter_id !== cchapter.chapter_id,'content-list-name': true}">{{item2.chapter_name}}</text>
										<view style="font-size: x-small;display: flex;flex-direction: row;">
											<u-icon v-if="item2.file_type === 1" labelSize="20rpx" size="28rpx"
												style="padding-right: 10rpx;"
												:name="item2.chapter_id !== cchapter.chapter_id?'https://qnsp.zcskjy.com/zc_images/edu_pic/zxvideo.png':'https://qnsp.zcskjy.com/zc_images/edu_pic/edu_23.png'">
											</u-icon>
											<text class="iconfont icon-a-ziyuan11" v-if="item2.file_type === 2"></text>
											<text class="iconfont icon-yinpin"
												v-if="item2.file_type === 3 || item2.file_type === 4"></text>
											<text v-if="item2.file_type === 5" v-text="'共'+item2.topic_num+'题'"></text>
											<text v-else>{{chapterTypeInfo(item2)}}</text>
										</view>
									</view>
									<view>
										<!-- 当前 -->
										<text v-if="item2.chapter_id === cchapter.chapter_id"
											style="background-color: #FFF4F3;padding: 6rpx 38rpx;border-radius: 50rpx;">
											<text class="iconfont icon-yinpinbofangqizhongzhuangtai"></text>
											<text
												style="font-size: smaller;font-weight: 500;font-size: 24rpx;color:#F43D3E">学习中</text>
										</text>
										<!-- 收费 -->
										<text v-else-if="course.course_free === 0 && item_row.item_unit_price !== 0">
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
										<!-- 免费 -->
										<text v-else>
											<image style="width: 44rpx;height: 44rpx;padding: 8rpx 24rpx"
												src="https://qnsp.zcskjy.com/zc_images/edu_pic/edu_21.png">
											</image>
										</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<!-- <navigator :url="'/edu/course/audio/index?type=' + (ii+1)" class="col-content-list"
						v-if="item.is_show" v-for="(item_list, ii) in item.content_list" :key="ii">
						<view :class="['content-list-left', item_list.is_check?'is_check':'']">
							<view class="content-list-name">{{item_list.list_name}}</view>
							<view class="content-list-num">
								<u-icon name="play-circle-fill" style="float:left;margin-top: 3rpx;margin-right: 5rpx;"
									size="15"></u-icon>
								{{item_list.list_type}} | {{item_list.list_time}}
							</view>
						</view>
						<view :class="['content-list-right', item_list.is_check?'is_check':'']">
							<u-icon name="play-circle-fill" style="float:left;margin-top: 30rpx;margin-right: 5rpx;"
								size="20"></u-icon>
						</view>
					</navigator> -->
				</view>
			</view>
		</view>

		<!--    <view v-if="course.course_file_type == 2 && chapter.chapter_id" class="article-audio-foot">-->
		<view class="article-audio-foot" v-show="playShow">
			<view class="iconfont icon-guanbi" @click="showplay()"></view>
			<!--:duration="50" -->
			<audio-cc ref="player" :duration="getDuration()" :title="pchapter.chapter_name" :autoplay="true"
				:subtitle="cchapter.chapter_name"
				:src="cchapter.course_url && cchapter.file_type === 3?cchapter.course_url:''" @next="playNext()"
				@timeupdate="timeupdate" @previous="playPrevious()" @pauseAudio="playPause">
			</audio-cc>
		</view>

		<!--  弹框  -->
		<view style="height: 100%;width: 100%;" @click="showPayDialog = false">
			<view class="class-detail-order-dialog" v-show="showPayDialog">
				<view class="box">
					<text class="box-title">{{__("温馨提示")}}</text>
					<view class="box-evaluation-font">{{showPayDialogText}}</view>
					<view class="box-btn-group">
						<a class="box-btn-pay" @click="showPayDialog = false" v-if="closeDialog">{{__("我知道了")}}</a>
						<a class="box-btn-pay" @click="toAddOrder(item_row.item_id)" v-else>{{__("立即购买")}}</a>
					</view>
				</view>
			</view>
		</view>

		<view style="height: 100%;width: 100%;" @click="showAddLecturerDialog = false">
			<view class="class-detail-order-dialog" v-show="showAddLecturerDialog">
				<view class="box">
					<text class="box-title">{{__("温馨提示")}}</text>
					<view class="box-evaluation-font">{{__("请先添加私教")}}</view>
					<view class="box-btn-group">
						<a class="box-btn-pay" @click="showAddLecturerDialog = false">{{__("知道了")}}</a>
					</view>
				</view>
			</view>
		</view>

		<view style="height: 100%;width: 100%;" @click="showReceiveNoticeDialog = false">
			<view class="class-detail-order-dialog" v-show="showReceiveNoticeDialog">
				<view class="box">
					<text class="box-title">{{__("温馨提示")}}</text>
					<view class="box-evaluation-font">{{__("请先领取通知书")}}</view>
					<view class="box-btn-group">
						<a class="box-btn-pay" @click="showReceiveNoticeDialog = false">{{__("知道了")}}</a>
					</view>
				</view>
			</view>
		</view>

		<!--  添加私教弹框  -->
		<view class="add-class-dialog" v-show="showAddTeacherDialog">
			<view class="box">
				<view class="add-class-top">
					<image style="width:32rpx;height:20rpx;"
						src="https://qnsp.zcskjy.com/zc_images/edu_pic/top_left.png">

					</image>
					<text style="font-size: 38rpx;color: #FFFFFF;padding:0 20rpx;">请添专属班班</text>
					<image style="width:32rpx;height:20rpx;"
						src="https://qnsp.zcskjy.com/zc_images/edu_pic/top_right.png">

					</image>
				</view>

				<view style="color: #FFFFFF;padding: 10rpx;font-size: 26rpx;">添加班班进行激活才能参加学习</view>
				<view class="step-box">
					<view class="step-bot-item">
						<text class="round">1</text>
						<text class="font">点击下方按钮前往微信</text>
					</view>
					<view class="step-bot-item">
						<text class="round">2</text>
						<text class="font">授权后，识别二维码</text>
					</view>
					<view class="step-bot-item">
						<text class="round">3</text>
						<text class="font">添加班班企业微信</text>
					</view>
				</view>
				<view class="class-info">
					<view>{{"分配班级：" + (course.classes_name?course.classes_name:'')}}</view>
				</view>
				<view class="bnt" @click="getUrl()">
					<view class="view">前往微信</view>
				</view>
				<view @click="showAddTeacherDialog = false"
					style="position: absolute;bottom: -18%;left:38%;font-size: 45px;color: #ffffff"
					class="iconfont icon-guanbi2"></view>
			</view>

		</view>

		<!-- 底部按钮 -->
		<view v-show="showPage">
			<view class="course-bottom" v-show="!course.is_buy && payShow ">
				<!--			<view v-if="classDetail.class_status===1" class="course-bottom-button">加入学习</view>-->
				<view v-if="this.course.course_free !== 1 && item_row.item_sale_price!==undefined"
					class="course-bottom-button" @click="toAddOrder(item_row.item_id)">
					活动价:{{"￥"+ item_row.item_sale_price +" 立即购买"}}
				</view>
				<view v-else-if="this.course.course_free !== 1 && item_row.item_sale_price===undefined"
					class="course-bottom-button" @click="toAddOrder(item_row.item_id)">
					{{"￥"+ item_row.item_unit_price +" 立即购买"}}
				</view>
				<view v-else class="course-bottom-button" @click="saveCourseStock(item_row.product_id)">
					{{"加入学习"}}
				</view>

			</view>
		</view>

		<view class="course-ms-bottom" v-if="false">
			<view class="ms-bottom-left">
				<view class="bottom-price">
					原价￥2899.00 | 已售1023件
				</view>
				<view class="bottom-sale-price">
					限时优惠 ￥ <text
						style="font-size: 40rpx;font-family: DINAlternate-Bold, DINAlternate;font-weight: bold;">899.00</text>
				</view>
			</view>
			<view class="ms-bottom-right">
				<view class="bottom-desc">
					立即参加秒杀活动
				</view>
				<view class="bottom-time">
					<view class="endTime">
						<text class="iconfont icon-fanhui" style="font-size: 32rpx"></text>
						{{__('限时秒杀')}}
					</view>
					<view class="Time">
						<text class="time">{{hours}}</text>
						<text class="time-tip">:</text>
						<text class="time">{{minutes}}</text>
						<text class="time-tip">:</text>
						<text class="time">{{seconds}}</text>
					</view>
				</view>
			</view>
		</view>
		<view :class="'m-panel-sp ' + (shareBoxFlag==0?'hide':'') " @click.stop="closeNativeShare">
			<view :class="'m-panel-sp-content ' + (shareContetnFlag==0?'bounceOutDown animated':'bounceInUp animated')"
				@click.stop>
				<view class="page-body">
					<!-- #ifdef APP-PLUS -->
					<view class="btn-area" v-if="1">
						<block v-for="(value,index) in providerList" :key="index">
							<button type="primary" v-if="value" :disabled="shareType === 5 && value.name !== '分享到微信好友'"
								@tap="share(value)">{{value.name}}</button>
						</block>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<view class="btn-area">
						<button type="primary" open-type="share">{{__('分享')}}</button>
					</view>
					<!-- #endif -->

					<view class="uni-icon uni-icon-closeempty m-panel-sp-icon" color="#888" @click="closeNativeShare">
					</view>
				</view>
			</view>
		</view>

		<!-- #ifdef APP-PLUS -->
		<shareGApp :shareDataDefault="shareData" ref="shareGApp" />
		<!-- <share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app> -->
		<!-- #endif -->

		<!-- #ifdef H5 -->
		<share-box-h5 :shareDataDefault="shareData" ref="shareBoxH5"></share-box-h5>
		<!-- #endif -->

		<!-- #ifndef APP-PLUS -->
		<share-box-mp :shareDataDefault="shareData" @cancelShare="cancelShare" @showCodeImg="showCodeImg"
			@shareQRCode="shareQRCode" @saveImg="saveImg" ref="shareBoxMp"></share-box-mp>
		<!-- #endif -->
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'


	import audioCc from '@/components/audio/audio-cc.vue'
	import htmlParser from '@/helpers/plugins/html-parser.js'
	import shareBoxMp from '../../components/share-box-mp.vue'
	import shareBoxApp from '../../components/share-box-app.vue'
	import shareBoxH5 from '../../components/share-box-h5.vue'
	import statusBar from '../../components/status-bar.vue'
	import shareGApp from '../../components/share-g-app';

	var that; // 当前页面对象
	export default {
		data() {
			return {
				showAddTeacherDialog: false,
				showPayDialog: false,
				showPayDialogText: '',
				closeDialog: false,
				showAddLecturerDialog: false,
				showReceiveNoticeDialog: false,
				item_row: {},
				course: {},
				payShow: true,
				playShow: false,
				showPage: false,
				checkChapterId: '', // 当前展开的目录
				checkTwoChapterId: '', // 当前展开的二级列表的目录


				chapter: {},
				item_id: 0,
				share_uid:0,
				pchapter: {}, // 当前播放父章节
				mchapter: {}, // 三级列表 中间层级章节
				cchapter: {}, // 当前播放章节

				chapters: [], // 树型章节类表
				chapterChildrens: [], // 小节列表
				classDetail: {
					class_status: 1 //课程状态 1免费直接报名 ，2需要付费，3已付费
				},
				step_type: 1, //步骤状态 1添加私教 2领取通知单 3期末考试 4毕业证书
				list: [{
					name: '简介'
				}, {
					name: '目录'
				}],
				swiperCurrent: 0,
				current: 0,

				shareData: {
					shareText: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
					shareTitle: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
					href: "https://www.suteshop.com",
					image: '',
					price: 0
				},

				shareText: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
				shareTitle: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
				href: "https://www.suteshop.com",
				image: '',
				share_flag: !1,

				shareBoxFlag: 0,
				shareContetnFlag: 0,
				hours: "01",
				minutes: "01",
				seconds: "01",
				shareType: 0,
				providerList: [],
				PageNav: {
					window: {
						"navigationBarBackgroundColor": "#3B7DA3",
						"navigationBarTextStyle": "black",
						"navigationBarTitleText": "",
						"backgroundColor": "#f8f8f8",
						"backgroundTextStyle": "dark"
					}
				},
				hasOnShow: false,
				learnStateLock: false,
			}
		},
		components: {
			audioCc,
			shareBoxMp,
			shareBoxApp,
			shareBoxH5,
			statusBar,
			shareGApp
		},
		// 函数
		computed: {
			...mapState(['Config', 'userInfo', 'hasLogin', 'logout']),
			courseTypeInfo() {
				let course_file_type = this.course.course_file_type;
				let chapterNum = this.chapter.chapterNum
				switch (course_file_type) {
					case 0:
						return "视频 ｜ 共" + chapterNum + "节"
					case 1:
						return "图文 ｜ 共" + chapterNum + "节"
					case 2:
						return "音频 ｜ 共" + chapterNum + "节"
					case 3:
						return "图文音频 ｜ 共" + chapterNum + "节"
				}
			},
		},
		onShow: function() {
			// if(this.learnStateLock){
			// 	this.getProductItem(this.item_id)
			// }
			let item_id = this.item_id
			if (item_id) {
				this.getProductItem(item_id)
			}
		},
		onLoad: function(options) {
			this.checkChapterId = "";
			// this.getCourse(product_id);
			this.item_id = options.item_id;
			this.share_uid = options.uid;
			this.getProductItem(options.item_id)
		},
		onBackPress: function() {
			// #ifdef APP-PLUS
			// if (this.$refs.shareBoxApp.showBoxView) {
			// 	this.$refs.shareBoxApp.cancel();
			// 	return true;
			// }
			// #endif


			// #ifdef H5
			if (this.$refs.shareBoxH5.showBoxView) {
				this.$refs.shareBoxH5.cancel();
				return true;
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
				return true;
			}
			// #endif
		},
		onUnload() {

			// #ifdef APP-PLUS
			// if (this.$refs.shareBoxApp.showBoxView) {
			// 	this.$refs.shareBoxApp.cancel();
			// }
			// #endif

			// #ifdef H5
			if (this.$refs.shareBoxH5.showBoxView) {
				this.$refs.shareBoxH5.cancel();
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
			}
			// #endif
		},
		watch: {
			play(newVal, oldVal) {
				// console.info(`play: ${val}`);
				this.payShow = !newVal
			},
		},
		methods: {
			showAddTeacher() {
				let course_state = this.course.course_state
				let product_id = this.course.product_id;
				let classes_cycle_id = this.course.classes_cycle_id;
				let that = this
				if (course_state >= 1001) {
					that.$.request({
						url: that.Config.URL.edu.userAddClass,
						method: "POST",
						loading: false,
						data: {
							product_id: product_id,
							classes_cycle_id: classes_cycle_id,
						},
						success: function(data, status, msg) {
							if (status === 200) {
								that.course.classes_name = data.classes_name
								that.course.classes_cycle_class_start = data.classes_cycle_class_start
								that.showAddTeacherDialog = true
							} else {
								that.$.alert(msg);
							}
						}
					})
				}
			},
			toAddNotice() {
				let course_state = this.course.course_state
				if (course_state >= 1002) {
					let url = this.$.sprintf("/edu/course/notice?product_id=%d&classes_id=%d&item_id=%d", this.course
						.product_id, this
						.course.classes_id, this.item_id);
					uni.navigateTo({
						url: url
					})
				}
			},
			getUrl() {
				// let user_id = this.course.user_id;
				// let product_id = this.course.product_id;
				// this.showAddTeacherDialog = false
				// let url = this.$.sprintf("/edu/course/teacher-poster?user_id=%s&product_id=%s", user_id, product_id);
				// uni.navigateTo({
				// 	url: url
				// })
				// this.learnStateLock = true;


				// console.info('--info---',this.userInfo.user_mobile);
				let typeIndex;
				// type_id	课程类型(ENUM) : 0-精品课；1-训练营；2-导师课
				if (this.course.course_type == 2) {
					typeIndex = 2;
				} else if (this.course.course_type == 1) {
					typeIndex = 1;
				} else if (this.course.course_type == 0) {
					typeIndex = 0;
				} else {
					typeIndex = 0;
				}

				let wxOriginId = uni.getStorageSync('wxOriginId') ?? 'gh_77e0924a5066';
				let wxMiniPath = uni.getStorageSync('wxMiniPath') ?? 'pages/index/index';
				let path = wxMiniPath + '?typeIndex=' + typeIndex + '&courseType=' + model.course_type +
					'&userId=' + model.user_id + '&productId=' + model.product_id + '&mobile=' + this.userInfo.user_mobile;
				this.pushMiniApp(path, wxOriginId);
			},

			//跳转微信小程序
			pushMiniApp(pathUrl, wxOriginId) {

				console.log('---log---', pathUrl);
				// #ifdef APP-PLUS
				// 跳转微信小程序 
				plus.share.getServices(
					res => {
						console.log('---res---', res);
						let sweixin = '';
						for (var i = 0; i < res.length; i++) {
							let t = res[i];
							if (t.id == 'weixin') {
								sweixin = t;
							}
						}
						if (sweixin) {
							sweixin.launchMiniProgram({
									// id: 'gh_915c2ca533a7',  //汽车的原始ID
									// id: 'gh_306945fe14bd',
									id: wxOriginId,
									// path: 'pages/views/home/home/home?', //  可带参数	             
									// path: 'pages/index/index?typeIndex=0&user_id='+user_id', //  可带参数	  
									path: pathUrl,
									type: 0 // 微信小程序版本类型可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
								},
								// 目标小程序点击返回App后执行的回调，在此接收微信小程序传递的参数
								res2 => {
									console.log('-----res2----', res2)
								},
								err2 => {
									console.log(err2)
								}
							);
						} else {
							uni.showToast({
								icon: 'none',
								title: '当前环境不支持微信操作!'
							})
						}
					},
					err => {
						console.log('---err-----', err)
					}
				)
				// #endif

				// #ifdef MP-WEIXIN
				uni.navigateToMiniProgram({
					appId: 'wx1935506901780516', // 此为生活缴费appid
					// path:'pages/index/index?typeIndex=0&user_id='+user_id,
					path: pathUrl,
					envVersion: "release",
					success: res => {
						// 打开成功
						console.log("打开成功", res);
					},
					fail: err => {
						console.log(err);
					}
				});
				// #endif
			},


			showplay() {
				this.playShow = false
				this.$refs.player.pauseAudio()
			},
			// 下一首
			playNext() {
				let index = this.chapterChildrens.findIndex((item) => item.chapter_id === this.cchapter.chapter_id)
				if (index === this.chapterChildrens.length - 1) {} else {
					let chapter = this.chapterChildrens[index + 1]
					if (chapter && chapter.course_url) {
						this.cchapter = chapter
						this.setPchapter()
					}
				}
			},
			// 上一首
			playPrevious() {
				let index = this.chapterChildrens.findIndex((item) => item.chapter_id === this.cchapter.chapter_id)
				if (index === 0) {} else {
					let chapter = this.chapterChildrens[index - 1]
					if (chapter && chapter.course_url) {
						this.cchapter = chapter
						this.setPchapter()
					}
				}
			},
			// 暂停
			playPause() {},

			getDuration() {
				// 课程免费
				let course_free = this.cchapter.course_free
				let video_duration = this.cchapter.video_duration
				let is_buy = this.cchapter.is_buy
				if (course_free === 1 || is_buy) {
					if (video_duration) {
						let duration = video_duration.split(":")
						return Number(duration[0]) * 60 + Number(duration[1])
					}
					return 0
				}

				// 试看
				let chapter_try_see = this.cchapter.chapter_try_see
				let chapter_try_see_time = this.cchapter.chapter_try_see_time
				if (chapter_try_see === 1) {
					if (chapter_try_see_time) {
						let duration = video_duration.split(":")
						return Math.min(chapter_try_see_time * 60, Number(duration[0]) * 60 + Number(duration[1]))
					} else {
						return 0
					}
				}
			},
			timeupdate(e) {
				// console.log("音频信息", e);
				var that = this
				let params = {
					product_id: this.course.product_id,
					chapter_id: this.cchapter.chapter_id,
					chapter_current_time: e.current,
					chapter_history_time: e.current,
					chapter_learn_time: e.time,
					chapter_time: e.duration,
				}
				that.$.request({
					url: that.Config.URL.edu.saveChapterStock,
					method: "POST",
					data: params,
					loading: false,
					success: function(data, status) {
						if (status === 200) {
							if (data.course_schedule) {
								that.course.course_schedule = data.course_schedule
							}
							if (data.course_state) {
								that.course.course_state = data.course_state
							}
							if (data.unlock_next) {
								that.chapters = data.chapters
							}
						}
					}
				})
			},
			// tabs通知swiper切换
			tabsChange(item) {
				this.swiperCurrent = item.index;
			},
			getProductItem(item_id) {
				var that = this
				that.$.request({
					url: that.Config.URL.edu.getProductItem,
					data: {
						item_id: item_id,
					},
					loading: false,
					success: function(data, status) {
						if (status === 200 && data.item_row) {
							that.item_row = data.item_row
							that.item_id = data.item_row.item_id

							// console.info('---1--data--',data.item_row.course.chapter);
							if (data.item_row.course) {
								that.course = data.item_row.course
							}
							if (that.course) {
								that.chapter = data.item_row.course.chapter
								that.chapters = data.item_row.course.chapter.chapterTree
								that.chapterChildrens = data.item_row.course.chapter.children
							}
						}
						that.showPage = true
					}
				})
			},
			cleanCache: function(e) {
				var that = this
				that.$.request({
					url: that.Config.URL.logout,
					success: function(data, status, msg, code) {
						// #ifdef APP-PLUS
						plus.navigator.removeAllCookie();
						// #endif

						// #ifdef H5
						var date = new Date();
						date.setTime(date.getTime() - 10000);
						var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
						if (keys) {
							for (var i = keys.length; i--;)
								document.cookie = keys[i] + "=0; expire=" + date
								.toGMTString() + "; path=/";
						}
						// #endif
						that.$.storage.removeItem('uid');
						that.$.storage.removeItem('ukey');

						const language = uni.getStorageSync('language')

						// var app_already = uni.getStorageSync('app_already');
						// var check_state = uni.getStorageSync('check_state');

						that.$.storage.clear();
						//如果不在允许的语言内，可重置
						uni.setStorageSync('language', language);


						// #ifdef MP-WEIXIN
						var info = that.$.storage.info();

						that.setData({
							currentSize: Math.round(info.currentSize * 100) / 100,
							limitSize: Math.round((info.limitSize / 1024) * 100) /
								100
						});
						// #endif

						$cookies.remove('uid');
						$cookies.remove('ukey');

						uni.navigateTo({
							url: '/pages/login/login'
						})
						//退出登录
						that.logout(false);
					}
				})
			},


			// chapter1 是第一层级   chapterM 是第二层级   chapter2是第三层级 
			toThreeCourseDetail(chapter1, chapterm, chapter2) {

				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				// #ifdef H5
				if (this.$.isWeixin()) {
					if (this.userInfo.isBindWeiXin !== 1) {
						this.cleanCache()
						return;
					}
				}
				// #endif
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
					if (!can_study) {
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
				let product_id = this.course.product_id
				this.pchapter = chapter1
				this.mchapter = chapterm
				this.cchapter = chapter2

				if (file_type === 3) {
					this.getChapter(product_id, chapter2.chapter_id)
					return;
				}

				this.showplay();

				// 视频/图文音频
				let url = this.$.sprintf("/edu/course/audio/index?chapter_id=%s&item_id=%s", chapter2.chapter_id,
					this.item_row.item_id);
				uni.navigateTo({
					url: url
				})
			},


			toCourseDetail(chapter1, chapter2) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				// #ifdef H5
				if (this.$.isWeixin()) {
					if (this.userInfo.isBindWeiXin !== 1) {
						this.cleanCache()
						return;
					}
				}
				// #endif
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
					if (!can_study) {
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

				let product_id = this.course.product_id
				this.pchapter = chapter1
				this.cchapter = chapter2

				if (file_type === 3) {
					this.getChapter(product_id, chapter2.chapter_id)
					return;
				}

				this.showplay();

				// 视频/图文音频
				let url = this.$.sprintf("/edu/course/audio/index?chapter_id=%s&item_id=%s", chapter2.chapter_id,
					this.item_row.item_id);
				uni.navigateTo({
					url: url
				})

			},

			chapterTypeInfo(chapter) {
				let file_type = chapter.file_type;
				let video_duration = chapter.video_duration;
				switch (file_type) {
					case 1:
						return "视频 ｜ " + video_duration
					case 2:
						return "图文"
					case 3:
						return "音频 ｜ " + video_duration
					case 4:
						return "图文音频 ｜ " + video_duration
				}
			},

			jumpExam() {
				let course = this.course
				let course_state = course.course_state
				if (course_state >= 1004) {
					uni.navigateTo({
						url: '/edu/course/exam/chapter-test?classes_id=' + course.classes_id + '&product_id=' +
							course
							.product_id
					});
				}

			},

			// 保留此方法,如果不进入考试列表页的话请打开下面的注释
			// jumpExam(course) {
			// 	var that = this;
			// 	let course_state = this.course.course_state
			// 	if (course_state === 1004){
			// 		that.$.request({
			// 			url: that.Config.URL.edu.getExamByClassesId,
			// 			data: {
			// 				'classes_id': course.classes_id,
			// 			},
			// 			dataType: 'json',
			// 			success: function(data, status, msg, code) {
			// 				uni.navigateTo({
			// 					url: '/edu/course/exam/practice-page?paper_id=' + data.data.paper_id + '&course_id=' + course.product_id + '&exam_id=' + data.data.exam_id
			// 				});
			// 			}
			// 		});
			// 	}
			// },
			getChapter(product_id, chapter_id) {
				let that = this
				that.$.request({
					url: that.Config.URL.edu.getChapter,
					data: {
						product_id: product_id,
						chapter_id: chapter_id,
					},
					loading: false,
					success: function(data, status, msg) {
						if (status === 200) {
							// 可以播放
							if (data.can_watch) {
								that.cchapter = data.chapter
								that.playShow = true
							} else {
								that.$.alert(msg);
							}
						}
					}
				})
			},

			setPchapter() {
				let chapter = this.cchapter;
				let chapters = this.chapters;
				let chapter_pid = chapter.chapter_pid;

				this.pchapter = this.getPchapter(chapters, chapter_pid)
			},
			getPchapter(chapters, chapter_pid) {
				let pchapter = {}
				for (let i = 0; i < chapters.length; i++) {
					let chapter = chapters[i];
					let children = chapter.children;
					if (chapter.chapter_id === chapter_pid) {
						return chapter;
					} else if (children && children.length > 0) {
						pchapter = this.getPchapter(children, chapter_pid)
					}
					if (pchapter) {
						return pchapter
					}
				}
			},
			goback() {
				// #ifdef APP-PLUS
				uni.navigateBack({
					delta: 1
				})
				// #endif

				// #ifdef H5
				let back = getCurrentPages()
				if (back && back.length > 1) {
					uni.navigateBack({
						delta: 1
					})
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
				// #endif
			},

			onShareBox: function(e) {
				let that = this;
				var $href = that.$.sprintf('%s/tmpl/product_detail.html?item_id=%d&FX=%d', this.Config.WapSiteUrl, this
					.skuid, this.userInfo
					.user_id);

				$href = that.$.sprintf('%s/h5/edu/course/class-detail?product_id=%d&item_id=%d&uid=%d', that.Config
					.SiteUrl, this.item_row.product_id, this
					.item_id, this.userInfo.user_id);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS

				// #endif

				// #ifdef MP-WEIXIN
				$href = "/edu/course/class-detail?product_id=" + this.course.product_id + "&uid=" + this.userInfo
					.user_id + "&item_id=" + this.item_id;
				// #endif

				this.setData({
					shareData: {
						shareTitle: this.item_row.product_name,
						shareText: this.item_row.product_tips,
						href: $href,
						image: this.course.product_image,
						price: this.number_format(this.item_row.item_unit_price, 2)
					}
				});

				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				// this.$refs.shareBoxApp.show();
				this.$refs.shareGApp.show();
				// #endif

				//海报
				if (e == 3) {
					// #ifndef APP-PLUS
					this.$refs.shareBoxMp.show();
					// #endif
				} else {
					// #ifdef H5
					if (that.$.ifUniApp()) {
						this.$refs.shareBoxH5.show();
					} else {
						this.$refs.shareBoxMp.show();
					}
					// #endif
				}
			},

			closeNativeShare: function() {
				var that = this;
				that.setData({
					shareContetnFlag: 0,
					share_flag: !1
				});

				setTimeout(function() {
					that.setData({
						shareBoxFlag: 0
					})
				}, 1e2)
			},

			html(strHtml) {
				if (!strHtml) return ""
				strHtml = "<div>" + strHtml + "</div>"
				strHtml = strHtml
					.replace(/\<img/gi,
						"<img style='vertical-align: top;max-width: 100%; border-radius: 6px; background-color: #eee;'")
					.replace(/\<p/gi,
						"<p style='margin: 0;min-height: 30px;margin-left: 0px;font-weight: 400;font-size: 15px;line-height: 30px;color: #353535;'"
					)

				return htmlParser(strHtml)
			},
			toAddOrder(item_id) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				// #ifdef H5
				if (this.$.isWeixin()) {
					if (this.userInfo.isBindWeiXin !== 1) {
						this.cleanCache()
						return;
					}
				}
				// #endif
				this.showPayDialogText = '您暂未购买课程，无法进行课程学习，请先购买课程后进行学习'
				this.showPayDialog = false
				uni.navigateTo({
					// url: "/edu/order/checkout?cart_id=" + item_id + "|" + 1,
					url: "/edu/order/checkout?cart_id=" + item_id + "|" + 1+"&distributor_user_id="+this.share_uid,
				})
			},
			wxAuth() {
				var prePage = getCurrentPages()[getCurrentPages().length - 1];
				if (prePage) {
					that.$.setStorageSync('pre_route', prePage.route);
					if (prePage.options) {
						that.$.setStorageSync('pre_options', prePage.options);
					}
				}
				window.location.href = that.Config.URL.wx.mplogin + '?callback=' + encodeURIComponent(that
					.Config.CONFIG.base_url + '/h5/pages/login/login'); //暂时注释
			},
			saveCourseStock(product_id) {
				let that = this
				that.$.request({
					url: that.Config.URL.edu.saveCourseStock,
					data: {
						product_id: product_id,
					},
					loading: false,
					method: "POST",
					success: function(data, status, msg) {
						if (status === 200) {
							that.getProductItem(that.item_row.item_id)
							that.$u.toast("您已经加入学习课程！")
						} else {
							that.$.alert(msg);
						}
					}
				})
			},
			getDiploma() {
				var that = this
				that.$.request({
					url: that.Config.URL.edu.getDiploma,
					data: {
						product_id: 232323,
					},
					loading: false,
					success: function(data, status) {
						if (status === 200 && data.item_row) {

						}
					}
				})
			},
		}
	}
</script>
<style lang="scss">
	@import '@/components/audio/font/iconfont.css';

	.page {
		width: 100%;
		height: auto;
		font-family: PingFangSC-Regular, PingFang SC;

		.shareMsk {
			z-index: 101;
		}

		.course_nav {
			position: absolute;
			width: 100%;
			height: 50rpx;
			z-index: 999;
			padding: 0rpx 30rpx;
			margin-top: 20rpx;
			box-sizing: border-box;

			.course_nav_left {
				float: left;
				color: #ffffff;
			}

			.course_nav_right {
				float: right;
				width: 260rpx;
				height: 50rpx;
				border-radius: 25rpx;
				background: rgba(0, 0, 0, 0.3);
				line-height: 50rpx;
				font-size: 24rpx;
				text-align: center;
				margin: 5rpx;
				color: #FFFFFF;
			}
		}

		.info-type-label .iconfont {
			padding-left: 0px;
		}

		.course-thumb {
			position: relative;
			background-color: #3B7DA3;
			height: 170rpx;
			padding: 0 30rpx;

			.course-img {
				position: absolute;
				width: 180rpx;
				height: 220rpx;
				border-radius: 10rpx;
				margin-top: 105rpx;
				z-index: 100;
			}

			.course-title {
				padding-top: 105rpx;
				margin-left: 210rpx;
				color: #ffffff;
				font-weight: 500;
				font-size: 36rpx;
				height: 50rpx;
			}
		}

		.course-info {
			border-radius: 15px 15px 0 0;
			display: flex;
			background-color: #ffffff;
			position: relative;
			z-index: 99;

			.info-item {
				width: 100%;
				padding-left: 240rpx;
				color: #666666;
				font-size: 24rpx;
				line-height: 50rpx;
				padding-right: 30rpx;
				margin-bottom: 20rpx;

				text {}

				.info_tag {
					height: 38rpx;
					margin-bottom: 30rpx;
					margin-top: 10rpx;

					.tag-text {
						float: left;
						margin-right: 10rpx;
						padding: 0 20rpx;
						color: #FFA312;
						background-color: #FFF5ED;
						border-radius: 5upx;
					}
				}

				.study_progress {
					clear: both;
					float: left;
					margin-top: 15rpx;
					font-size: 24rpx;
					color: #666666;
					font-weight: 400;
				}

				.progress_item {
					float: left;
					width: 270rpx;
					margin-top: 38rpx;
					margin-left: 36rpx;

				}

				.info-type {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					font-size: 24rpx;

					.type-num {
						color: #999999;
						margin-left: 20rpx;
						margin-top: 0rpx;
						float: left;
					}

					.type-price {
						float: right;
						margin-top: -12rpx;
						text-align: right;
						color: #F43D3E;

						.price-num {
							font-weight: 600;
							font-size: 30rpx;
						}

						.price-nums {
							font-weight: 600;
							font-size: 30rpx;
							text-decoration: line-through;
						}
					}
				}
			}
		}

		.class-jindu {
			width: 100%;
			height: 50rpx;
			background: #ffffff;
			padding: 0 50rpx;
			color: #D8D8D8;
			box-sizing: border-box;

			.class-num {
				float: left;
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				border: 1px solid #D8D8D8;
				text-align: center;
				line-height: 40rpx;
			}

			.class-xian {
				width: 155rpx;
				float: left;
				border: 1rpx solid #D8D8D8;
				margin-top: 19rpx;
			}

			.class-num-check {
				color: #fff;
				background: -webkit-linear-gradient(to right, #FF6161, #FF9661);
				/* Safari 5.1-6.0 */
				background: -o-linear-gradient(to right, #FF6161, #FF9661);
				/* Opera 11.1-12.0 */
				background: -moz-linear-gradient(to right, #FF6161, #FF9661);
				/* Firefox 3.6-15 */
				background: linear-gradient(to right, #FF6161, #FF9661);
				/* 标准语法 */
				border-color: #FF7161;
			}

			.class-xian-check {
				border: 1rpx solid #FF7161;
			}
		}

		.info-teacher {
			height: 100rpx;
			background-color: #ffffff;
			line-height: 100rpx;

			.study_step {
				width: 20%;
				float: left;
				height: 55rpx;
				line-height: 55rpx;
				text-align: center;
				border-radius: 30rpx;
				margin: 2.5%;
				color: #ffffff;
				background: linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
				font-size: 22rpx;
			}

			.step_check {
				color: #666666;
				font-size: 24rpx;
				background: #F4F4F4;
			}

			.teacher-detail {
				margin: 0 30upx;
				border-top: 1px solid #eeeeee;
				padding: 20upx 0;
				line-height: 60rpx;
				font-size: 23rpx;

				.teacher-img {
					width: 60upx;
					height: 60upx;
					border-radius: 60upx;
					float: left;
				}

				.teacher-name {
					color: #666666;
					float: left;
					margin-left: 25rpx;
					font-size: 24rpx;
					height: 33rpx;
				}

				.teacher-desc {
					color: #4C6FE9;
					float: right;
				}
			}
		}

		.swiper-no-swiping {
			min-height: 1000rpx;
			width: 100%;

			.flex-col {
				background: #ffffff;

				.flex-col-content {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
				}

				.flex-col-title {
					clear: both;
					padding: 24rpx 30rpx 0;
					//line-height: 80rpx;
					font-size: 30rpx;
					color: #333333;

					.col-content-title {
						padding: 10rpx 0;
						font-weight: 600;
						float: left;
					}

					.col-son-title {
						padding: 20rpx 0;
						font-weight: 600;
						font-size: 27rpx;
						float: left;
					}

					.col-content-name {
						float: left;
						margin-left: 20upx;
					}
				}

				.col-content-list {
					clear: both;
					height: 100rpx;
					margin: 20rpx 0;
					font-size: 22rpx;
					color: #666666;
					font-weight: 500;
					border-bottom: 1px solid #e1e1e1;

					.content-list-left {
						line-height: 40rpx;
						float: left;
					}

					.is_check {
						color: #FB685F;
					}

					.content-list-right {
						float: right;
					}
				}
			}
		}

		.course-bottom {
			position: fixed;
			bottom: 0;
			height: 160rpx;
			width: 100%;
			background: #ffffff;

			.course-bottom-button {
				font-size: larger;
				font-weight: 500;
				color: #ffffff;
				margin: 35rpx 30rpx;
				padding: 20rpx 0;
				text-align: center;
				background: -webkit-linear-gradient(to right, #FF6161, #FF9661);
				/* Safari 5.1-6.0 */
				background: -o-linear-gradient(to right, #FF6161, #FF9661);
				/* Opera 11.1-12.0 */
				background: -moz-linear-gradient(to right, #FF6161, #FF9661);
				/* Firefox 3.6-15 */
				background: linear-gradient(to right, #FF6161, #FF9661);
				/* 标准语法 */
				border-radius: 50rpx;
			}
		}

		.course-ms-bottom {
			position: fixed;
			bottom: 0;
			height: 160rpx;
			width: 100%;
			background: #ffffff;

			.ms-bottom-left {
				width: 52%;
				float: left;
				height: 100%;
				padding: 25rpx;
				box-sizing: border-box;

				.bottom-price {
					height: 33rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					line-height: 33rpx;
				}

				.bottom-sale-price {
					margin-top: 20rpx;
					height: 40rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FF1A32;
					line-height: 40rpx;
				}
			}

			.ms-bottom-right {
				width: 48%;
				height: 100%;
				float: left;
				padding: 25rpx;
				box-sizing: border-box;
				background: #FF1A32 linear-gradient(90deg, #FF6161 0%, #FF9661 100%);

				.bottom-desc {
					height: 45rpx;
					font-size: 32rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 45rpx;
					letter-spacing: 2rpx;
					text-align: center;
				}

				.bottom-time {
					margin-top: 15rpx;

					.endTime {
						float: left;
						height: 40rpx;
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 40rpx;
					}

					.Time {
						margin-left: 22rpx;
						float: left;
						height: 40rpx;
						line-height: 40rpx;
						color: #ffffff;

						.time {
							width: 40rpx;
							height: 40rpx;
							background: #FFAE86;
							border-radius: 8rpx;
							line-height: 40rpx;
							text-align: center;
							font-size: 24rpx;
							display: block;
							float: left;
						}

						.time-tip {
							float: left;
							display: block;
							margin: 0 5rpx;
						}
					}
				}
			}
		}
	}

	.content-list-item {
		border-bottom: 1px solid #F5F5F5;
	}

	.content-list-item .iconfont {
		padding-right: 10rpx;
		font-size: x-small;
	}

	.info-type-label {
		display: flex;
		flex-direction: row;
	}

	.info-type-label .iconfont {
		padding-left: 10rpx;
	}

	.playChapter {
		color: #FF6462;
	}

	.article-audio-foot {
		z-index: 9999;
		width: 100%;
		padding: 0 30rpx;
		position: fixed;
		box-sizing: border-box;
		transform: translateZ(0);
		opacity: 0.7;
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

	.checked-item {
		color: #FA685F !important;
	}

	.un-checked-item {
		color: #666666;
	}

	.class-detail-order-dialog {
		position: fixed;
		display: flex;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		text-align: center;
		z-index: 2002;
		background: rgba(0, 0, 0, 0.5);
		justify-content: center;
		align-items: center;
	}

	.class-detail-order-dialog .box {
		margin-top: -24%;
		height: 20%;
		width: 75%;
		background-color: #FFFFFF;
		border-radius: 10rpx;

	}

	.class-detail-order-dialog .box-title {
		display: inline-block;
		padding: 35rpx 0 15rpx 0;
		color: #333333;

	}

	.class-detail-order-dialog .box-evaluation-font {
		padding: 0 60rpx 35rpx;
		color: rgba(51, 51, 51, 0.56);
	}

	.box-btn-group {
		bottom: 0;
		float: bottom;
	}

	.box-btn-pay {
		color: #F43D3E;
		background: #FFFFFF;
		display: block;
		padding: 20rpx 0;
		border-bottom-left-radius: 15rpx;
		border-bottom-right-radius: 15rpx;
		border-top: 1.75rpx solid #f5f5f5;
		font-weight: bold;
	}

	.add-class-dialog {
		position: fixed;
		display: flex;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		text-align: center;
		z-index: 2002;
		background: rgba(0, 0, 0, 0.5);
		justify-content: center;
		align-items: center;
	}

	.add-class-dialog .box {
		display: flex;
		flex-direction: column;
		background-color: #FE494E;
		border-radius: 10rpx;
		padding: 45rpx;
		position: relative;
	}

	.add-class-dialog .round {
		padding: 10rpx;
		text-align: center;
		line-height: 40rpx;
		display: inline-block;
		height: 40rpx;
		width: 40rpx;
		border-radius: 50%;
		color: #FFFFFF;
		background: -webkit-linear-gradient(to top, #FF6161, #FF9661);
		/* Safari 5.1-6.0 */
		background: -o-linear-gradient(to top, #FF6161, #FF9661);
		/* Opera 11.1-12.0 */
		background: -moz-linear-gradient(to top, #FF6161, #FF9661);
		/* Firefox 3.6-15 */
		background: linear-gradient(to top, #FF6161, #FF9661);
		/* 标准语法 */
	}

	.add-class-dialog .step-box {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		text-align: start;
	}

	.add-class-dialog .step-box .step-bot-item {
		background-color: #F9F9F9;
		padding: 20rpx;
		margin: 15rpx 0;
		border-radius: 20rpx;
	}

	.add-class-dialog .step-box .step-bot-item .font {
		color: #FA6029;
		padding: 0 30rpx;
		font-size: 30rpx;
	}

	.add-class-dialog .bnt {
		background: linear-gradient(152deg, #FFF384 0%, #FFDA49 100%);
		border-radius: 50rpx;
		margin: 10rpx 0;
	}

	.add-class-dialog .bnt .view {
		display: inline-block;
		padding: 20rpx 0;
		color: #773800;
		font-size: larger;
		font-width: 500;
	}

	.add-class-dialog .class-info {
		color: #FFFFFF;
		padding: 30rpx 0;
		font-size: 26rpx;
	}

	.add-class-top {
		display: flex;
		text-align: center;
		// justify-content: space-around;
		align-items: center;
		padding: 0 86rpx;
	}

	.content-list-name {
		width: 450rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
		white-space: nowrap;
	}

	.progress-box /deep/ .u-line-progress .u-line-progress__line {
		background: -webkit-linear-gradient(to right, #FF6161, #FF9661);
		/* Safari 5.1-6.0 */
		background: -o-linear-gradient(to right, #FF6161, #FF9661);
		/* Opera 11.1-12.0 */
		background: -moz-linear-gradient(to right, #FF6161, #FF9661);
		/* Firefox 3.6-15 */
		background: linear-gradient(to right, #FF6161, #FF9661);
		transition: none;
	}
</style>
