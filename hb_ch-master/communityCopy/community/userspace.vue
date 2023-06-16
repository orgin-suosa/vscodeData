<template>
    <view>
        <scroll-view scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom" @scroll="scroll"
                     :scroll-top="scrollTop" @scrolltoupper="scroll">
            <view class="m-banner-img">

                <view class="m-animate-warp" :style="'background:url(' + UserInfo.user_avatar + ');background-size: cover;'">
                    <view class="m-animate-img"
                          :style="'background:url(' + UserInfo.user_avatar + ');background-size: cover;'"></view>
                </view>
                <view url="../personaldata/personaldata" class="m-user-info">
                    <image :src="UserInfo.user_avatar" mode="scaleToFill"/>
                    <text>{{UserInfo.user_nickname}}</text>
                </view>
                <view class='gzfs_box'>
                    <view class='gz' @tap='guanzhu'>{{__('关注')}} {{UserInfo.user_friend || 0}}</view>
                    <view class='tc'></view>
                    <view class='fs' @tap='fensi'>{{__('粉丝')}} {{UserInfo.user_fans || 0}}</view>
                </view>
                <view class='gxqm_box'>
                    <image class='xgqm' @tap='xiugaiqianming' src='https://static.shopsuite.cn/xcxfile/appicon/img/wt01.png' v-if="IsLoginUser"></image>
                    <view class='gxqm' @tap='xiugaiqianming' v-if="xgqy">{{UserInfo.user_sign}}
                    </view>
                    <input v-else focus="focus" class='xgqm_input' maxlength="45" v-model="user_sign"
                           confirm-type="done" @blur="editSign" placeholder-style='color:#fff'
                           placeholder='编辑个性签名'></input></view>
                <navigator v-if="IsLoginUser" url='/member/member/message'>
                    <image class='xx' src='https://static.shopsuite.cn/xcxfile/appicon/img/wt02.png'></image>
                </navigator>


                <button @click="onUnFollow" style="line-height: 38rpx;" hover-class='none' open-type="getUserInfo" lang="zh_CN"
                         class='box_title_guanzhu_text' v-else-if="UserInfo.IsFollow"
                        :data-user_id="UserInfo.user_id + ''">{{__('取消关注')}}
                </button>
                <button @click="onFollow" hover-class='none' style="line-height: 38rpx;" open-type="getUserInfo" lang="zh_CN"
                         class='box_title_guanzhu_text' v-else
                        :data-user_id="UserInfo.user_id + ''">{{__('关注')}}
                </button>
            </view>
            <view class='tobar_box'>
                <view :class="['tobar', tapindex==1?'borred':'']" @tap='tiezi'>
                    <view class='tobar_num'>{{UserInfo.user_story}}</view>
                    <view class='tobar_name'>{{__('帖子')}}</view>
                </view>
                <view :class="['tobar', tapindex==2?'borred':'']"
                      style='border-left:1rpx solid #d9d9d9;border-right:1rpx solid #d9d9d9;' @tap='pinglun'>
                    <view class='tobar_num'>{{UserInfo.user_story_comment}}</view>
                    <view class='tobar_name'>{{__('评论')}}</view>
                </view>
                <view :class="['tobar', tapindex==3?'borred':'']" @tap='shoucang'>
                    <view class='tobar_num'>{{UserInfo.user_story_collection}}</view>
                    <view class='tobar_name'>{{__('收藏')}}</view>
                </view>
            </view>

            <view class='rmtz_box_content_box' v-for="(item, i) in PostsList" :key="i">
                <view class='rmtz_box_content_box2'>
                    <navigator :url="'/community/community/detail?id=' + item.story_id">
                        <view class='rmtz_box_content_box_text text-over2'><span>{{item.story_title || item.comment_content}}</span></view>
                    </navigator>
                    <view class='pldz_box'>
                        <view class='rmtz_box_content_box_dz'>
                            <image class='dz' src='https://static.shopsuite.cn/xcxfile/appicon/img/yhkj_03.png'></image>
                            <span>{{item.story_collection_count}}</span></view>
                        <view class='rmtz_box_content_box_pl'>
                            <image class='pl' src='https://static.shopsuite.cn/xcxfile/appicon/img/tzxq_05.png'></image>
                            <span style="font-size: 12px;color: #959593;">{{item.story_comment_count}}</span></view>
                        <button hover-class='none' style='padding-left:22upx;' v-if="item.IsFabulous == 1"
                                class='rmtz_box_content_box_pl' :data-story_id='item.story_id' open-type="getUserInfo" lang="zh_CN"
                                @click="onUnLike">
                            <image class='pl' src='https://static.shopsuite.cn/xcxfile/appicon/img/side1_03.png'></image>
                            <span style="font-size:12px">{{item.story_like_count}}</span></button>
                        <button hover-class='none' style='padding-left:22upx;' class='rmtz_box_content_box_pl' v-else
                                :data-story_id='item.story_id' open-type="getUserInfo" lang="zh_CN" @click="onLike">
                            <image class='pl' src='https://static.shopsuite.cn/xcxfile/appicon/img/side1_05.png'></image>
                            <span style='font-size:12px;'>{{item.story_like_count}}</span>
                        </button>
                        <view v-if="IsLoginUser && tapindex!=2" class='rmtz_box_content_box_sc'
                              :data-id="item.story_id" @tap='DeleteMemberPosts'>
                            <image class='sc' src='https://static.shopsuite.cn/xcxfile/appicon/img/yhkj_10.png'></image>
                        </view>
                        <view v-if="IsLoginUser && tapindex!=2 && !item.story_enable" class='rmtz_box_content_box_sc'
                              :data-id="item.story_id">
                            <label>待审核</label>
                        </view>
                    </view>
                </view>

				<block v-if="item.story_title">
					<navigator :url="'/community/community/video?id=' + item.story_id" v-if="item.story_type == 4">
						<view class=''>
							<view :data-url='item.ImgPath' class='rmtz_box_content_Img'
								  :style="'background: url(' + item.story_file[0] + ') center no-repeat ;background-size:cover;'"></view>
						</view>
					</navigator>

					<navigator :url="'/community/community/detail?id=' + item.story_id" v-if="item.story_type != 4">
						<view class=''>
							<view :data-url='item.ImgPath' class='rmtz_box_content_Img'
								  :style="'background: url(' + item.story_file[0] + ') center no-repeat ;background-size:cover;'"></view>
						</view>
					</navigator>
				</block>
				<block v-if="!(item.story_title)">
					<span style="color:gray;">
						{{__('帖子已经删除')}}
					</span>
				</block>
            </view>


            <view class="m-loading-box">
                <block v-if="ispage">
                    <view class="u-loadmore">
                        <label class="u-loading"></label>
                        <text class="u-loadmore-tips">{{__('正在加载')}}</text>
                    </view>
                    <view>
                        <text></text>
                        <canvas/>
                    </view>
                </block>
                <block v-else>
                    <view class="u-loadmore u-loadmore-line">
                        <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
                    </view>
                </block>
            </view>
        </scroll-view>

		<view :class="[animation ? '' : 'zhezhaoceng']">
		<movable-area class="movableArea">
			<movable-view class="movableView" @touchmove.stop.prevent="doNothing" direction="all" :x="initX" :y="initY">
				<view class="u-top" v-if="isnav">
					<image @click='nav' class='quicknav' src='https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_icon_nav.png'></image>
					<image class='quicknav' src='https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_post.png' @click="onPostStory"></image>
					<image @click="returnTop" :class='"quicknav " + (isquicknav?"":"hide")' src='https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_gotop.png'></image>
				</view>
				<view @click='outnav' v-else>
					<view class="u-top1">
						<navigator :class='animation?"navtext1":"navtext"' open-type='switchTab' url='/pages/index/image'>
							<text>{{__('社区首页')}}</text>
							<image class='quicknav' src='https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_comnityhome.png'></image>
						</navigator>
						<button :class='animation?"navtext1":"navtext"' open-type='share'
								style='padding:0;background:none;width:none'>
							<text>{{__('分享')}}</text>
							<image class='quicknav'
								   src='https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_share.png'></image>
						</button>
						<navigator :class='animation?"navtext1":"navtext"' url='/community/community/userspace'>
							<text>{{__('我的帖子')}}</text>
							<image class='quicknav'
								   src='https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_my_post.png'></image>
						</navigator>
						<navigator :class='animation?"navtext1":"navtext"' open-type='switchTab'
								   url='../../pages/index/index'>
							<text>{{__('商城首页')}}</text>
							<image class='quicknav'
								   src='https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_home.png'></image>
						</navigator>
						<view class='navtext'>
							<image class='quicknav'
								   src='https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_icon_close.png'></image>
						</view>
						<navigator class='navtext' url='/community/community/post'>
							<image class='quicknav'
								   src='https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_post.png'></image>
						</navigator>
					</view>
				</view>
			</movable-view>
		</movable-area>
		</view>
    </view>
</template>

<script>
    import diy from '../../components/themes/diy.vue'
    import dateUtil from "../../helpers/util_date";

    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data: function() {
            return {
                options:{},
                uid: 0,
                tapindex: 1,
                UserInfo: [],
                page: 1,
                ispage: !0,
                flag: !0,
                PostsList: [],
				scrollTop: 0,
                scposition: -1,
                oldscposition: 0,
                isquicknav: !1,
                opacity: 1,
                background: "f1f1f1",
                user_sign: "",
                screenHeight  : 0,
                IsLoginUser : !1,
                xgqy : 1,
                isdata : !1,
                isnav: !0,
                animation: !0,
				initX: '690',
				initY: '1336',
				timer: null,
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        components: {
            diy
        },
		
		mounted() {
			let view = uni.createSelectorQuery().in(this).select(".movableArea");
			let that = this;
			
			view.fields({
			  size: true,
			  scrollOffset: true
			}, data => {
				if (data) {
					that.setData({
						initX: data.width,
						initY: data.height - 100,
					});
				}
			}).exec();
		},
		
        onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('用户空间')
            });

            var that = this;

            that.$.getSystemInfo({
                success: function (a) {
                    that.setData({screenHeight: a.screenHeight})
                }
            });


            that.setData({uid: options.uid || that.userInfo.user_id});
            this.uid == that.userInfo.user_id && that.setData({IsLoginUser: !0});

            //如果没有用户id，且未登录
            if (that.$.isUndefined(that.uid))
            {
                that.forceUserInfo(function(user) {

                    that.setData({
                        uid: user.user_id,
                        IsLoginUser: !0
                    });

                    that.GetUserSpace();
                    that.GetMemberPostsByUserId()
                })
            }
            else
            {
                that.GetUserSpace();
                that.GetMemberPostsByUserId()
            }
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
            let that = this;
        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function() {
            // 离开页面，注销事件
        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function() {
        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function() {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function() {
            return {
                title: this.ShareTitle,
                imageUrl: this.ShareImg,
                path: "/pages/index/index?uid=" + this.userInfo.user_id
            }
        },

        /**
         * 页面滚动触发事件的处理函数
         */
        onPageScroll: function() {},

        methods: {
            ...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo']),

            getPostsList: function () {
                let that = this;
                var params = {page: this.page};

                that.$.request({
                    url: this.Config.URL.sns.story_lists,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (data.items.length > 0) {
                            for (var r = 0; r < data.items.length; r++) {
                                data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data.items[r]['story_time']));
                            }

                            if (data.page >= data.total) {
                                that.setData({
                                    PostsList: that.PostsList.concat(data.items),
                                    flag: !1,
                                    ispage: !1
                                });
                            } else {
                                that.setData({
                                    PostsList: that.PostsList.concat(data.items),
                                    flag: !0,
                                    ispage: !0
                                })
                            }

                        } else {
                            that.setData({flag: !1, ispage: !1})
                        }

                        that.$.stopPullDownRefresh()
                        that.$.hideLoading();
                    }
                });
            },

            editSign: function () {
                var that = this, params = {
                    UserId: that.userInfo.user_id,
                    OperateId: that.cf.storeId,
                    user_sign: this.user_sign
                };

                that.$.request({
                    url: this.Config.URL.account.edit_user_sign,
                    data: params,
                    success: function (data, status, msg, code) {
                        that.setData({xgqy: !0}), that.GetUserSpace()
                    }
                });
            },
            DeleteMemberPosts: function (a) {
                var that = this;
                if (1 == that.tapindex)
                {
                    var params = {story_id: a.currentTarget.dataset.id};
                    that.$.confirm(that.__("是否删除帖子?"), function (a) {
                        if (a.confirm)
                        {
                            that.$.request({
                                url: that.Config.URL.sns.story_remove,
                                data: params,
                                success: function (data, status, msg, code) {
                                    if (200 == status) {
                                        that.setData({PostsList: []});
                                        that.GetUserSpace();
                                        that.GetMemberPostsByUserId()
                                    } else {
                                    }
                                }
                            });
                        }
                    }, !0)
                }
                else
                {
                    params = {
                        userId: that.userInfo.user_id,
                        story_id: a.currentTarget.dataset.id,
                        operateId: that.cf.storeId
                    };

                    that.$.confirm(that.__("是否取消收藏帖子?"), function (a) {
                        if (a.confirm)
                        {
                            that.$.request({
                                url: that.Config.URL.sns.story_collection_remove,
                                data: params,
                                success: function (data, status, msg, code) {
                                    if (200 == status) {
                                        that.setData({PostsList: []});
                                        that.GetUserSpace();
                                        that.loaddata()
                                    } else {
                                    }
                                }
                            });
                        }
                    }, !0)
                }
            },
            onPostStory: function (a) {
                let that = this;
                that.forceUserInfo(function(user) {
                    that.$.navigateTo({url: "/community/community/post"})
                })
            },
            GetUserSpace: function () {
                var that = this, params = {
                    UserId: that.userInfo.user_id,
                    user_id: that.uid,
                    operateId: that.cf.storeId
                };

				that.$.request({
				    url: this.Config.URL.sns.user_space,
				    data: params,
				    success: function (data, status, msg, code) {
				        that.setData({UserInfo: data, user_sign: data.user_sign})
				    }
				});
            },
            GetMemberPostsByUserId: function () {
                var that = this, params = {
					user_id: that.uid, 
					page: that.page, 
					'sidx':'story_time', 
					'sord':'DESC',
					};
                    // 1 == that.page && that.setData({PostsList: []});

				that.$.request({
				    url: this.Config.URL.sns.user_story,
				    data: params,
				    success: function (data, status, msg, code) {

				        if (data.items.length > 0) {
				            for (var r = 0; r < data.items.length; r++) {
				                data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data.items[r]['story_time']));
				            }

				            if (data.page >= data.total) {
				                that.setData({
				                    PostsList: that.PostsList.concat(data.items),
				                    flag: !1,
				                    ispage: !1,
						        isdata: !1
				                });
				            } else {
				                that.setData({
				                    PostsList: that.PostsList.concat(data.items),
				                    flag: !0,
				                    ispage: !0,
						        isdata: !1
				                })
				            }

				        } else {
				            that.setData({flag: !1, ispage: !1,
						        isdata: !1})
				        }
				    }
				});
            },
            GetCommentPostsByUserId: function () {
                var that = this;
                let params = {user_id: that.uid, page: that.page};
                1 == that.page && that.setData({PostsList: []});

                that.$.request({
                    url: this.Config.URL.sns.user_comment_story,
                    data: params,
                    success: function (data, status, msg, code) {

                        if (data.items.length > 0) {
                            for (var r = 0; r < data.items.length; r++) {
                                data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data.items[r]['story_time']));
                            }

                            if (data.page >= data.total) {
                                that.setData({
                                    PostsList: that.PostsList.concat(data.items),
                                    flag: !1,
                                    ispage: !1,
                                    isdata: !1
                                });
                            } else {
                                that.setData({
                                    PostsList: that.PostsList.concat(data.items),
                                    flag: !0,
                                    ispage: !0,
                                    isdata: !1
                                })
                            }

                        } else {
                            that.setData({flag: !1, ispage: !1,
                                isdata: !1})
                        }
                    }
                });
            },
            xiugaiqianming: function () {
                var a = this;

				if (a.userInfo.user_id == a.uid)
				{
					0 == a.xgqy ? a.setData({xgqy: !0, focus: !1}) : a.setData({xgqy: !1, focus: !0})
				}
				else
				{

				}

            },
            GetCollectionPostsByUserId: function () {
                var that = this;
                let params = {user_id: that.uid, page: that.page};
                1 == that.page && that.setData({PostsList: []});

                that.$.request({
                    url: this.Config.URL.sns.user_collect_story,
                    data: params,
                    success: function (data, status, msg, code) {

                        if (data.items.length > 0) {
                            for (var r = 0; r < data.items.length; r++) {
                                data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data.items[r]['story_time']));
                            }

                            if (data.page >= data.total) {
                                that.setData({
                                    PostsList: that.PostsList.concat(data.items),
                                    flag: !1,
                                    ispage: !1,
                                    isdata: !1
                                });
                            } else {
                                that.setData({
                                    PostsList: that.PostsList.concat(data.items),
                                    flag: !0,
                                    ispage: !0,
                                    isdata: !1
                                })
                            }

                        } else {
                            that.setData({flag: !1, ispage: !1,
                                isdata: !1})
                        }
                    }
                });
            },
            tiezi: function () {
                1 != this.tapindex && (this.setData({tapindex: 1, page: 1}), this.GetMemberPostsByUserId())
            },
            pinglun: function () {
                2 != this.tapindex && (this.setData({tapindex: 2, page: 1}), this.GetCommentPostsByUserId())
            },
            shoucang: function () {
                3 != this.tapindex && (this.setData({tapindex: 3, page: 1}), this.GetCollectionPostsByUserId())
            },
            
            loaddata: function () {
                1 == this.tapindex ? this.GetMemberPostsByUserId() : 2 == this.tapindex ? this.GetCommentPostsByUserId() : this.GetCollectionPostsByUserId()
            },

            guanzhu: function () {
                wx.navigateTo({url: "../attention/attention?id=" + this.UserInfo.user_id + ''})
            },
            fensi: function () {
                wx.navigateTo({url: "../fans/fans?id=" + this.UserInfo.user_id + ''})
            },


            onFollow: function (a) {
                let that = this;
                that.forceUserInfo(function(user) {
                    that.AddFollow(a.currentTarget.dataset.user_id)
                });
            },
            AddFollow: function (friend_id) {
                var that = this, params = {
                    /*user_id: that.userInfo.user_id,
                    OperateId: that.shopInfo.store_id,*/
                    friend_id: friend_id
                };

                that.$.request({
                    url: this.Config.URL.user.friend_agree,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status) {
							that.$.showToast({title: that.__("关注成功"), icon: "success", duration: 2e3}), clearTimeout(t);
							var t = setTimeout(function () {
								that.GetUserSpace();
							}, 1500)
                        } else {
                        }
                    }
                });
            },
            onUnFollow: function (a) {

                let that = this;
                that.forceUserInfo(function(user) {
                    that.cancelFollow(a.currentTarget.dataset.user_id)
                });
            },
            cancelFollow: function (friend_id) {
                var that = this;
                that.$.confirm(that.__("是否取消关注?"), function (a) {
                        if (a.confirm)
                        {
                            var params = {
                                friend_id: friend_id
                            };

                            that.$.request({
                                url: that.Config.URL.user.friend_refuse,
                                data: params,
                                success: function (data, status, msg, code) {
                                    if (200 == status) {
										that.$.showToast({title: that.__("取消关注成功"), icon: "success", duration: 2e3}), clearTimeout(t);
										var t = setTimeout(function () {
											that.GetUserSpace();
										}, 1500)
                                    } else {
                                    }
                                }
                            });
                        }
                    },
                    !0)
            },

            onLike: function (a) {
                let that = this;
                that.forceUserInfo(function(user) {
                    that.dianzan(a.currentTarget.dataset.story_id)
                });
            },
            dianzan: function (story_id) {
                var that = this, params = {
                    story_id: story_id
                };

                that.$.request({
                    url: this.Config.URL.sns.story_like_add,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status) {
                            //that.getPostsList()

                            //修正当前记录数据
                            for (var r = 0; r < that.PostsList.length; r++) {
                                if (story_id == that.PostsList[r]['story_id'])
                                {
                                    that.PostsList[r]['IsFabulous'] = 1;
                                }
                            }
                        } else {
                        }
                    }
                });
            },
            onUnLike: function (a) {
                let that = this;
                that.forceUserInfo(function(user) {
                    that.canceldianzan(a.currentTarget.dataset.story_id)
                });
            },
            canceldianzan: function (story_id) {
                var that = this, params = {
                    story_id: story_id
                };

                that.$.request({
                    url: this.Config.URL.sns.story_like_remove,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status) {
                            //修正当前记录数据
                            for (var r = 0; r < that.PostsList.length; r++) {
                                if (story_id == that.PostsList[r]['story_id'])
                                {
                                    that.PostsList[r]['IsFabulous'] = 0;
                                }
                            }
                        } else {
                        }
                    }
                });
            },

            scroll: function (t) {
            	let that = this;
            	
            	that.setData({oldscposition: t.detail.scrollTop});
            	
            	if (100 < t.detail.scrollTop) {
            		that.setData({
						opacity: 1, 
						background: "f8f8f8",
					});
            	} else {
            		that.setData({
            		    opacity: 0,
            		    background: "fff"
            		})
            	}
            	if (t.detail.scrollTop >= this.screenHeight) {
            		this.setData({isquicknav: !0})
            	} else {
            		this.setData({isquicknav: !1})
            	}
            },
			scrollbottom: function (a) {
			    var t = this;
			    if (this.flag)
			    {
			        this.setData({flag: !1}), clearTimeout(e);
			        var e = setTimeout(function () {
			            t.setData({page: parseInt(t.page) + 1}), t.loaddata()
			        }, 500)
			    }
			},
            returnTop: function () {
				let that = this;
				// 清除上一次的定时器
				if (that.timer !== null) {
					clearInterval(that.timer);
				}
				that.scrollTop = that.oldscposition
			
				that.timer = setInterval(function(){
					let speed = that.scrollTop / 4;
					speed = Math.ceil(speed);
					if(that.scrollTop <= 0 || !that.scrollTop){
						clearInterval(that.timer);
					}
					that.scrollTop = that.scrollTop - speed
				}, 30);
				this.setData({isquicknav: !1});
            },
            nav: function () {
                this.setData({isnav: !1, animation: !1})
            },
            outnav: function () {
                var a = this;
                this.setData({animation: !0}), setTimeout(function () {
                    a.setData({isnav: !0})
                }, 400)
            },
			doNothing:function(){}

        }
    };
</script>


<style lang="scss">
    @import "../../styles/_variables";

    @import '../../styles/layout.scss';

    .m-banner-img {
        width: 100%;
        vertical-align: top;
        position: relative;
        height: 240rpx;
        padding: 0 30rpx;
        color: #fff;
        display: flex;
        overflow: hidden;
        box-sizing: border-box;
    }

    .m-user-info {
        margin-top: 26rpx;
        height: 160rpx;
        text-align: center;
        left: 15%;
        z-index: 3;
        color: #fff;
    }

    .m-user-info image {
        width: 130rpx;
        height: 130rpx;
        border-radius: 130rpx;
        border: 1px solid #fff;
        vertical-align: middle;
        box-shadow: 0px 2rpx 15rpx rgba(0, 0, 0, 0.35);
    }

    .m-user-info text {
        ine-height: 70rpx;
        display: block;
        font-size: 32rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: absolute;
        top: 42rpx;
        left: 188rpx;
    }

    .m-od-tab {
        font-size: 12px;
        text-align: center;
        background-color: #fff;
        line-height: 20px;
        box-shadow: 0px 0rpx 10rpx rgba(0, 0, 0, 0.35);
        color: #888;
    }

    .i-type {
        font-size: 40rpx;
    }

    .m-cell-hd {
        text-align: center;
        line-height: 56rpx;
    }

    .m-od-tab .g-flex-item {
        padding: 20rpx 0;
    }

    .m-od-tab .g-flex-item:active {
        background-color: #ececec;
    }

    .my_od {
        border-left: 1px solid #dfdfdf;
    }

    .all_order {
        position: relative;
        display: block;
    }

    .m-panel-bd {
        margin-top: 40rpx;
    }

    .m-panel-bd label {
        vertical-align: middle;
        font-size: 50rpx;
        margin: 0rpx 10rpx;
    }

    .m-cell-primary {
        font-size: 14px;
    }

    .m-animate-img {
        width: 100%;
        height: 410rpx;
        overflow: hidden;
        -webkit-animation: imageAnimation 15s linear infinite alternate;
        animation: imageAnimation 15s linear infinite alternate;
        webkit-backface-visibility: hidden;
        -webkit-filter: blur(5px);
        filter: blur(5px);
        margin-top: -20px;
    }

    .m-animate-warp {
        overflow: hidden;
        height: 370rpx;
        width: 100%;
        -webkit-animation: imageAnimation 15s linear infinite alternate;
        animation: imageAnimation 15s linear infinite alternate;
        position: absolute;
        top: 0;
        left: 0;
    }

    @-webkit-keyframes imageAnimation {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 0 100%;
        }
    }

    @keyframes imageAnimation {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 0 100%;
        }
    }

    .asd {
        width: 40rpx;
        height: 40rpx;
        margin-left: 14rpx;
        margin-top: 15rpx;
    }

    .img_box {
        width: 70rpx;
        height: 58rpx;
        text-align: center;
    }

    .img_box_img {
        width: 36rpx;
        height: 36rpx;
        margin-top: 9rpx;
    }

    .img_box_img1 {
        width: 38rpx;
        height: 38rpx;
        margin-top: 8rpx;
    }

    .gzfs_box {
        position: absolute;
        color: #fff;
        top: 107rpx;
        display: flex;
        font-size: 30rpx;
        text-align: left;
        left: 188rpx;
        width: 60%;
    }

    .tc {
        width: 3rpx;
        height: 20rpx;
        background-color: #fff;
        margin: 8rpx 20rpx 0 20rpx;
    }

    .gz {
        text-align: right;
    }

    .fs {
        text-align: left;
    }

    .gxqm_box {
        color: #fff;
        margin-top: 181rpx;
        display: flex;
        font-size: 26rpx;
        text-align: left;
        margin-left: -112rpx;
        padding-bottom: 17rpx;
    }

    .gxqm {
        width: 100%;
        position: relative;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        text-align: left;
        padding-left: 8rpx;
        word-wrap: break-word;
        word-break: break-all;
        color: #ececec;
    }

    .xgqm {
        width: 30rpx;
        height: 27rpx;
        margin-top: 3rpx;
        z-index: 99;
    }

    .tobar_box {
        width: 100%;
        height: 125rpx;
        display: flex;
        background-color: #fff;
        margin-bottom: 20rpx;
    }

    .tobar {
        width: 33.333%;
        height: 125rpx;
        font-size: 30rpx;
        text-align: center;
        position: relative;
    }

    .tobar_num {
        padding: 18rpx 0 15rpx 0;
        color: #878787;
		line-height: 1.4;
    }

    .borred {
        border-bottom: 6rpx solid #db384c;
    }

    .rmtz_box_title {
        width: 750rpx;
        height: 86rpx;
    }

    .rmtz_box {
        background-color: #f6f6f6;
        padding: 20rpx 0 0 0;
    }

    .rmtz_box_content_box2 {
        width: 520rpx;
        float: left;
    }

    .rmtz_box_content_img {
        width: 171rpx;
        height: 171rpx;
        float: right;
    }

    .rmtz_box_content_Img {
        width: 171rpx;
        height: 171rpx;
        margin-left: 14rpx;
    }

    .rmtz_box_content_box {
        background-color: #fff;
        padding: 27rpx 23rpx;
        height: 171rpx;
        position: relative;
        display: flex;
    }

    .rmtz_box_content_box_text {
        width: 506rpx;
        float: left;
        font-size: 30rpx;
        height: 101rpx;
    }

    .rmtz_box_content_box_dz {
        float: left;
        padding-right: 20rpx;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .rmtz_box_content_box_dz span {
        padding: 0 10rpx;
    }

    .rmtz_box_content_box_pl span {
        padding: 0 10rpx;
    }

    .rmtz_box_content_box_pl {
        float: left;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .rmtz_box_content_box_sc {
        float: left;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        padding-left: 20rpx;
    }

    .xx {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        width: 40rpx;
        height: 40rpx;
    }

    .rmtz_box_content_box::before {
        content: " ";
        position: absolute;
        left: 30rpx;
        top: 168rpx;
        right: 0rpx;
        height: 1px;
        border-top: 1px solid #d9d9d9;
        color: #d9d9d9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .commentaries2 {
        padding: 22rpx 30rpx;
        position: relative;
    }

    .time_box_dz {
        width: 136rpx;
        height: 100rpx;
        line-height: 123rpx; /* float: left */
    }

    .time_box_dz_img2 {
        width: 37rpx;
        height: 40rpx;
        margin-top: 17rpx;
        margin-left: 20rpx;
    }

    .time_box_dz_img {
        width: 37rpx;
        height: 40rpx;
        margin-top: 1rpx;
        margin-left: 90rpx;
    }

    .time_box_fx_img {
        width: 30rpx;
        height: 35rpx;
        margin-left: 65rpx;
    }

    .dz {
        width: 35rpx;
        height: 35rpx;
        vertical-align: text-top;
    }

    .pl {
        width: 35rpx;
        height: 35rpx;
        vertical-align: text-top;
    }

    .sc {
        width: 28rpx;
        height: 33rpx;
        vertical-align: text-top;
    }

    .rmtz_box_content_box_dz {
        float: left;
        padding-right: 20rpx;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .rmtz_box_content_box_dz span {
        padding: 0 10rpx;
    }

    .rmtz_box_content_box_pl span {
        padding: 0 10rpx;
    }

    .rmtz_box_content_box_pl {
        float: left;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .rmtz_box_content_box::before {
        content: " ";
        position: absolute;
        left: 30rpx;
        top: 219rpx;
        right: 0rpx;
        height: 1px;
        border-top: 1px solid #d9d9d9;
        color: #d9d9d9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .pldz_box {
        float: left;
        color: #828282;
        font-size: 28rpx;
        height: 32rpx;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        padding-top: 37rpx;
    }

    .tobar::before {
        content: " ";
        position: absolute;
        left: 30rpx;
        top: 0rpx;
        right: 0rpx;
        height: 1px;
        border-left: 1px solid #d9d9d9;
        color: #d9d9d9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .box_title_guanzhu_text {
        top: 20rpx;
        right: 0; /* padding: 0rpx 30rpx; border-radius: 35rpx; background-color: #db384c; text-align: center; color: #fff; font-size: 30rpx; line-height: 59rpx; align-content: center;*/
        position: absolute;
        padding: 15rpx 0rpx; /* line-height: 56rpx; */
        border-radius: 35rpx 0 0 35rpx;
        margin-top: 49rpx;
        background-color: #db384c;
        color: #fff;
        font-size: 25rpx;
        align-content: center;
        align-items: center;
        text-align: center;
        width: 144rpx;
    }

    .xgqm_input {
        width: 300px;
        height: 38rpx;
        margin: 0;
        border: 1rpx solid #d9d9d9;
        border-radius: 30rpx;
        color: white;
        margin-top: -9rpx;
        margin-left: 17rpx;
        padding-left: 10rpx;
    }

    navigator {
    }

    .u_top {
        width: 80rpx;
        height: 80rpx;
    }

    .m-orderlist {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    @keyframes mymove1 {
        from {
            bottom: 120rpx;
            opacity: 0
        }
        to {
            bottom: 520rpx;
            opacity: 1
        }
    }

    @keyframes mymove2 {
        from {
            bottom: 120rpx;
            opacity: 0
        }
        to {
            bottom: 420rpx;
            opacity: 1
        }
    }

    @keyframes mymove3 {
        from {
            bottom: 120rpx;
            opacity: 0
        }
        to {
            bottom: 320rpx;
            opacity: 1
        }
    }

    @keyframes mymove4 {
        from {
            bottom: 120rpx;
            opacity: 0
        }
        to {
            bottom: 220rpx;
            opacity: 1
        }
    }

    @keyframes mymove5 {
        from {
            bottom: 520rpx;
            opacity: 1
        }
        to {
            bottom: 110rpx;
        }
    }

    @keyframes mymove6 {
        from {
            bottom: 420rpx;
            opacity: 1
        }
        to {
            bottom: 110rpx;
            opacity: 0
        }
    }

    @keyframes mymove7 {
        from {
            bottom: 320rpx;
            opacity: 1
        }
        to {
            bottom: 110rpx;
            opacity: 0
        }
    }

    @keyframes mymove8 {
        from {
            bottom: 220rpx;
            opacity: 1
        }
        to {
            bottom: 110rpx;
            opacity: 0
        }
    }
</style>
