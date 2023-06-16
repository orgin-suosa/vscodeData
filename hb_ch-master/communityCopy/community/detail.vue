<template>
	<view>
        <scroll-view @scroll="scrolltoupper" @scrolltolower="scrollbottom" class="m-orderlist" :scroll-top="scposition"
                     scroll-y="true" style='height:100%;position:absolute;top:0' v-if="isdata">
            <view class="wrap-box">
                <view @click='textblock' class='hidden_box' v-if="ishidden"></view>
                <view class='hidden_box_Input' v-if="ishidden">
                    <view class='hidden_box_Input_box'>
                        <view class='hidden_box_input'>
                    <textarea class='input_box_input_input' cursor-spacing="110"
                              disabled="true" fixed="true"
                              maxlength="300"
                              :placeholder="__('禁言')"
                              placeholder-style="color:#666;font-size:30rpx"
                              :show-confirm-bar="barbar"
                              style='background-colo:#fff;color:#f6f6f6;font-size:30rpx'
                              v-if="datauser.IsComment"/>

                            <textarea
                                    @input="textareavalue"
                                    class='input_box_input_input'
                                    cursor-spacing="45"
                                    fixed="true"
                                    :focus="focus"
                                    maxlength="150"
                                    :placeholder="huifuvalue"
                                    placeholder-style="color:#939ca9;font-size:30rpx"
                                    show-confirm-bar="bar"
                                    style='background-colo:#fff'
                                    v-model="value2"
                                    v-else/>
                        </view>
                    </view>
                    <view class='hidden_box_Input_but'><span class='hidden_box_Input_button'
                                                             v-if="datauser.IsComment==true|| value==''">{{__('发送')}}</span>
                        <button @click="onComment" class='hidden_box_Input_button' hover-class='none'
                                lang="zh_CN"
                                open-type="getUserInfo"
                                style="background-color:#DB384C;line-height:40rpx" v-else>{{__('发送')}}
                        </button>
                    </view>
                </view>
                <view class='box_box'>
                    <view class='box_title'>
                        <view @click='gerenzhongxin' style='display:flex;float:left'>
                            <view class='box_title_img'>
                                <image class='box_title_image' :src='datauser.user_avatar'></image>
                            </view>
                            <view class='box_title_name'>
                                <view class='user_nickname_box'>
                                    <view class="user_nickname">{{datauser.user_nickname}}</view>
                                    <view class="louzhu"><span>{{__('楼主')}}</span></view>
                                    <view class='zhiding' v-if="datauser.story_is_top">{{__('置顶')}}</view>
                                </view>
                                <view class='box_title_name'><span style="display:block;">{{datauser.story_time_str}}</span>
                                </view>
                            </view>
                        </view>
                        <view v-if="isbenren"></view>
                        <view class='box_title_guanzhu' v-else>
                            <button @click="onUnFollow" class='box_title_guanzhu_text' hover-class='none'
                                    :data-user_id='datauser.user_id'
                                    lang="zh_CN" open-type="getUserInfo" v-if="dataContent.IsFollow">
                                {{__('取消关注')}}
                            </button>
                            <button @click="onFollow" class='box_title_guanzhu_text' hover-class='none'
                                    :data-user_id='datauser.user_id'
                                    lang="zh_CN" open-type="getUserInfo" v-else>{{__('关注')}}
                            </button>
                        </view>
                    </view>
                    <view class='box'>
                        <view class="box_text">
                            <view class='box_text_title'>{{datauser.story_title}}
                            </view>
                            <view class="onReply">
                                <block v-if="datauser.story_content">
									<wxParse :content="htmlString || __('内容为空')" />
                                </block>
                            </view>
                        </view>
                        <view class='newsimg_box'>
                            <view class='newsimg_box_img'>
                                <block v-for="(item, idx) in datauser.story_file" :key="idx">
                                    <view @click='yulan' class='newsimg_box_image3' :data-url='item'
                                          :style='"background: url("+item+") center no-repeat ;background-size:cover;"'></view>
                                </block>
                            </view>
                        </view>
                        <view class=''>
                            <navigator class='time' hover-class="none" open-type="navigate"
                                       style='float:right'
                                       :url="sprintf('../jubao/jubao?id=%s&userid=%s&content=%s&type=1&tzid=%s', datauser.Id, datauser.user_id, datauser.story_title, datauser.Id)">
                                {{__('举报')}}
                            </navigator>
                        </view>
                        <view class='givealike_box'>
                            <view class='box_title_image2_box'>
                                <view v-if="isshowdzphoto">
                                    <view class='box_title_image2_box_box'>
                                        <view style='display:flex;'>
                                            <block v-for="(item, idx) in dataContent.like_list" :key="idx">
                                                <image class='box_title_image2' :src='item.user_avatar'></image>
                                            </block>
                                            <view class='like_user_total'>{{dataContent.like_user_total}}{{__('个赞')}}
                                            </view>
                                        </view>
                                    </view>
                                </view>
                                <view class="myz" v-else><span>{{__('此帖现在还没有赞哦')}}</span></view>
                                <button @click="onUnLike" class='dzys' :data-story_id='datauser.story_id' lang="zh_CN"
                                        open-type="getUserInfo"
                                        style="background: #fff;padding-left: 0"
                                        v-if="dataContent.IsFabulous == true">
                                    <image class='dzys_img'
                                           src='https://static.shopsuite.cn/xcxfile/appicon/img/side1_03.png'></image>
                                </button>
                                <button @click="onLike" class='dzys' :data-story_id='datauser.story_id'
                                        hover-class='none'
                                        lang="zh_CN" open-type="getUserInfo" style='background:#fff;padding-left: 0'
                                        v-else>
                                    <image class='dzys_img'
                                           src='https://static.shopsuite.cn/xcxfile/appicon/img/side1_05.png'></image>
                                </button>
                            </view>
                        </view>
                        <view style='width:100%;background-color:#f6f6f6;height:20rpx;'></view>
                        <view class='commodity' v-if="dataContent.ProList.length>0">
                            <view class='commodity_box'>
                                <image class='commodity_img'
                                       src='https://static.shopsuite.cn/xcxfile/appicon/img/tzxq_07.png'></image>
                                <span class='commodity_text'>{{__('推荐商品')}}</span></view>
                            <view style='margin:-10rpx 0 30rpx 0'>
                                <view class='commodity_shop' v-for="(item, idx) in dataContent.ProList" :key="idx">
                                    <navigator hover-class="none"
                                               :url='"/pages/product/detail?pid=" + item.item_id'>
                                        <view class='commodity_shopImg'>
                                            <view class='commodity_shopImg'
                                                  :style='"background: url(" + item.product_image + ") center no-repeat ;background-size:cover;"'></view>
                                        </view>
                                        <view class='commodity_shop_name'><span class='commodity_shop_nametext'>{{item.product_item_name}}</span>
                                        </view>
                                        <view class='commodity_shop_pic'><span>{{sprintf(__('￥%s'), item.product_unit_price)}}</span></view>
                                    </navigator>
                                </view>
                            </view>
                        </view>

                        <view class='rmtz_box'>
                            <view style='background-color:#fff;' v-if="story_hot_rows.length>0">
                                <image class='rmtz_box_title'
                                       src='https://static.shopsuite.cn/xcxfile/appicon/img/tzxq_06.png'></image>
                                <block v-for="(item, idx) in story_hot_rows" :key="idx">
                                    <view class='rmtz_box_content_box'>
                                        <view class='rmtz_box_content_box2'>
                                            <view @click='remen' class='rmtz_box_content_box_text'
                                                  :data-id="item.story_id"><span>{{item.story_title}}</span></view>
                                            <view class='pldz_box'>
                                                <view class='rmtz_box_content_box_dz'>
                                                    <image class='dz'
                                                           src='https://static.shopsuite.cn/xcxfile/appicon/img/tzxq_03.png'></image>
                                                    <span>{{item.story_brower_count}}</span></view>
                                                <view class='rmtz_box_content_box_pl'>
                                                    <image class='pl'
                                                           src='https://static.shopsuite.cn/xcxfile/appicon/img/tzxq_05.png'></image>
                                                    <span style='font-size:12px'>{{item.story_comment_count}}</span></view>
                                                <button @click="onUnLike"
                                                        class='rmtz_box_content_box_pl' :data-story_id='item.story_id'
                                                        lang="zh_CN" open-type="getUserInfo"
                                                        style='padding-left:22rpx;margin-left:0'
                                                        v-if="item.IsFabulous == 1">
                                                    <image class='pl'
                                                           src='https://static.shopsuite.cn/xcxfile/appicon/img/side1_03.png'></image>
                                                    <span style='font-size:12px'>{{item.story_like_count}}</span></button>
                                                <button @click="onLike" class='rmtz_box_content_box_pl'
                                                        :data-story_id='item.story_id' lang="zh_CN"
                                                        open-type="getUserInfo" style='padding-left:22rpx;margin-left:0'
                                                        v-else>
                                                    <image class='pl'
                                                           src='https://static.shopsuite.cn/xcxfile/appicon/img/side1_05.png'></image>
                                                    <span style='font-size:12px'>{{item.story_like_count}}</span></button>
                                            </view>
                                        </view>
                                        <view @click='remen' class='rmtz_box_content_img' :data-id="item.story_id">
                                            <view class='rmtz_box_content_Img'
                                                  :style='"background: url(" + item.ImgPath + ") center no-repeat ;background-size:cover;"'></view>
                                        </view>
                                    </view>
                                </block>
                            </view>
                            <view style='width:100%;background-color:#f6f6f6;height:20rpx;'></view>
                        </view>
                        <view class='rmtz_box' v-if="!datauser.IsComment">
                            <view class='commentaries_box'>
                                <view class='commentaries2'>
                                    <view class='commentaries'><span class="commentaries_tzpl">{{__('帖子评论')}}</span><span
                                            class="all_pl"
                                            v-if="dataComment.length>0">{{sprintf(__('共%d条评论'), datauser.story_comment_count)}}</span><span
                                            class="all_pl" v-else>{{sprintf(__('共%d条评论'), 0)}}</span></view>
                                </view>
                                <view v-if="dataComment.length>0">
                                    <view class='h_box' v-for="(item, index) in dataComment" :key="index">
                                        <view class='h_box_touxiang'>
                                            <image class='h_box_touxiang' :src='item.user_avatar'></image>
                                        </view>
                                        <view class='h_box_neirong'>
                                            <view class='neirong_name'>{{item.user_nickname}}</view>
                                            <view class='neirong_text'>{{item.comment_content}}</view>
                                            <view class='neirong_time'>
                                                <view class='neirong_time_time'><span>{{item.comment_time_str}}</span></view>
                                                <view class='tupianbox'>
                                                    <view @click="onCommentLike" class='tupianbox_img'
                                                          :data-comment_id='item.comment_id'
                                                          lang="zh_CN" open-type="getUserInfo"
                                                          style="background: #fff;" v-if="item.IsFabulous == 0">
                                                        <image class='commentaries_text_time_img'
                                                               src='https://static.shopsuite.cn/xcxfile/appicon/img/side1_05.png'></image>
                                                        {{item.comment_like_count}}
											</view>
                                                    <view @click='onUnCommentLike' class='tupianbox_img' :data-comment_id='item.comment_id' v-else>
                                                        <image class='commentaries_text_time_img'
                                                               src='https://static.shopsuite.cn/xcxfile/appicon/img/side1_03.png'></image>
                                                        {{item.comment_like_count}}
                                                    </view>
                                                    <view @click="onReply" class="time_aa" :data-id='item.comment_id' :data-type="1">
                                                        <image class='ddd' src='https://static.shopsuite.cn/xcxfile/appicon/img/ddd_03.png'></image>
                                                        <view @click.stop='hiddend' class='hidden_ddd'
                                                              v-if="hiddenddd"></view>
                                                        <view class="triangle_border_right01"
                                                              v-if="datauser.IsComment&&item.IsShow"></view>
                                                        <view :class="!datauser.IsComment?'hidden_time_aa':'falhidden_time_aa'"
                                                              :data-comment_id='item.comment_id' v-if="item.IsShow">
                                                            <view @click.stop='ahuifu' class="hidden_time_bb"
                                                                  :data-comment_id='item.comment_id'
                                                                  :data-comment_reply_id="item.comment_reply_id"
                                                                  :data-user_id='item.user_id'
                                                                  :data-user_nickname="item.user_nickname"
                                                                  v-if="!datauser.IsComment">{{__('回复')}}
                                                            </view>
                                                            <navigator class='hidden_time_cc' hover-class="none"
                                                                       open-type="navigate"
                                                                       :url="sprintf('../jubao/jubao?id=%s&userid=%s&content=%s&type=2&tzid=%s', item.Id, item.user_id, item.CommentContent, datauser.Id)">
                                                                {{__('举报')}}
                                                            </navigator>
                                                        </view>
                                                    </view>
                                                </view>
                                            </view>
                                            <view :class="'zihuifu_box ' + (item.comment_id==comment_id?'':'circle')" :data-id='item.comment_id'>
                                                <block v-for="(items, indexs) in item.commentList" :key="indexs">
                                                    <view class='z_title_box'>
                                                        <view class='z_box_touxiang'>
                                                            <image class='z_box_touxiang'
                                                                   :src='items.user_avatar'></image>
                                                        </view>
                                                        <view class='zihuifu_name uni-ellipsis'>
                                                            <span>{{items.user_nickname}}</span><span
                                                                v-if="items.user_id==datauser.user_id && false">{{__('(楼主)')}}</span><span>@</span><span>{{items.user_nickname_to}}</span><span
                                                                v-if="items.user_id_to==datauser.user_id && false">{{__('(楼主)')}}</span>
                                                        </view>
                                                    </view>
                                                    <view class='zihuifu_text'>{{items.comment_reply_content}}</view>
                                                    <view class='neirong_time'>
                                                        <view class='z_neirong_time_time'>
                                                            <span>{{items.comment_reply_time_str}}</span>
                                                        </view>
                                                        <view class='tupianbox'>
                                                            <view @click='onLikeCommentReply' class='tupianbox_img'
                                                                  :data-index='index' :data-comment_reply_id='items.comment_reply_id'
                                                                  v-if="items.IsFabulous == 0">
                                                                <image class='commentaries_text_time_img'
                                                                       src='https://static.shopsuite.cn/xcxfile/appicon/img/side1_05.png'></image>
                                                                {{items.comment_reply_helpful_num}}
                                                            </view>
                                                            <view @click='onUnLikeCommentReply' class='tupianbox_img'
                                                                  :data-index='index'
                                                                  :data-comment_reply_id='items.comment_reply_id' v-else>
                                                                <image class='commentaries_text_time_img'
                                                                       src='https://static.shopsuite.cn/xcxfile/appicon/img/side1_03.png'></image>
                                                                {{items.comment_reply_helpful_num}}
                                                            </view>
                                                            <view @click="onReply" class="time_a" :data-id="items.comment_reply_id"
                                                                  :data-type="2">
                                                                <image class='ddd'
                                                                       src='https://static.shopsuite.cn/xcxfile/appicon/img/ddd_03.png'></image>
                                                                <view class="triangle_border_right01"
                                                                      v-if="datauser.IsComment&&items.IsShow"></view>
                                                                <view :class="!datauser.IsComment?'hidden_time_a':'falhidden_time_a'"
                                                                      v-if="items.IsShow">
                                                                    <view @click.stop='ahuifu' class='hidden_time_b'
                                                                          :data-comment_id="items.comment_id"
                                                                          :data-comment_reply_id="items.comment_reply_id"
                                                                          :data-user_id="items.user_id"
                                                                          :data-user_nickname="items.user_nickname"
                                                                          v-if="!datauser.IsComment">{{__('回复')}}
                                                                    </view>
                                                                    <navigator class='hidden_time_c'
                                                                               hover-class="none"
                                                                               :url="sprintf('../jubao/jubao?id=%s&userid=%s&content=%s&type=2&tzid=%s', items.comment_id, items.user_id, items.CommentContent, datauser.Id)">


                                                                        {{__('举报')}}
                                                                    </navigator>
                                                                </view>
                                                            </view>
                                                        </view>
                                                    </view>
                                                </block>
                                                <view @click='commenTarieHidden' class='shouqi'><span
                                                        style="padding-left:99px;">{{__('收起所有回复')}}</span>
                                                    <image class='top'
                                                           src='https://static.shopsuite.cn/xcxfile/appicon/img/top.png'></image>
                                                </view>
                                            </view>
                                            <view @click='commentari' class='zihuifu_box' :data-id='item.comment_id' v-if="item.commentList.length>0&&item.comment_id!=comment_id">
                                                <span class="zihuifu_dengr">{{sprintf(__('%s等人'), item.reply_name_str)}}</span>
												<span class="gonghuifu">{{sprintf(__('共%s条回复'), item.commentList.length)}}</span>
											</view>
                                        </view>
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
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view v-if="!datauser.IsComment">
                            <view class='tianchong' v-if="dataComment.length>0">
                                {{sprintf(__('全部%s条评论'), datauser.story_comment_count)}}
                            </view>
                            <view class='tianchong' v-else>{{__('就等您来抢楼了!')}}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view style='height:87rpx' v-if="!datauser.IsComment"></view>
            <view class='input_box' v-if="!datauser.IsComment">
                <view @click='texthidden' class='input_box_input'>
                    <image class='xiepinglun' src='https://static.shopsuite.cn/xcxfile/appicon/img/xq_03.png'></image>
                    <span>{{__('写下看法，参与讨论')}}</span><span style="margin-left:104rpx;" v-if="dataComment.length>0">
        {{sprintf(__('%s人已回复'), datauser.story_comment_count)}}
      </span><span style="margin-left:104rpx;" v-else>{{sprintf(__('%s人已回复'), 0)}}
      </span></view>
                <view class='input_box_fs' v-if="dataContent.IsCollection">
                    <image @click="onUnCollection" class='xiepinglun' :data-story_id='datauser.story_id'
                           src='https://static.shopsuite.cn/xcxfile/appicon/img/tzxq_10.png'></image>
                </view>
                <view class='input_box_fs' v-else>
                    <image @click="onCollection" class='xiepinglun' :data-story_id='datauser.story_id'
                           src='https://static.shopsuite.cn/xcxfile/appicon/img/xq_05.png'></image>
                </view>
            </view>
			
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
        </scroll-view>
        <view v-else>
            <block>
                <navigator hover-class="none" url="/pages/index/community" open-type='switchTab' class="m-nullpage">
                    <view class="m-nullpage-middle">
                        <view class="m-null-tip">
                            <text>{{__('当前帖子不存在！')}}</text>
                            <text style='color:#DB384C;'>{{__('社区首页')}}</text>
                        </view>
                    </view>
                </navigator>
            </block>
        </view>
    </view>
</template>

<script>


    import diy from '../../components/themes/diy.vue'
	import wxParse from '@/components/u-parse/u-parse.vue'
    import dateUtil from "../../helpers/util_date";
    import {mapMutations, mapState} from 'vuex'

    let CommentVal = {};

    export default {
        data: function () {
            return {
                options: {},
                isbenren: !1,
                isshowdzphoto: !1,
                ishidden: !1,
                value: "",
                focus: !1,
                bar: !1,
                commentariehidden: !1,
                timea: !1,
                story_id: 0,
                htmlString: "<div>loading....<div>",
                datauser: {},
                dataContent: {ProList:[]},
                dataComment: [],
                huifuvalue: "写评论...",
                timeaid: 0,
                IsShow: !1,
                commentList: [],
                userid: 0,
                ispage: !0,
                flag: !0,
                scposition: "",
                pageIndex: 1,
                hiddenddd: !1,
                autoheight: !0,
                cursorspacing: 50,
                isdata: !0,
                uid: 0,
                story_hot_rows: [],
                commentList2: [],
                value2: "",
                isnav: !0,
				animation: !0,
                screenHeight: 0,
                isquicknav: !1,
                refresh: false,
                comment_id:0,
				initX: '690',
				initY: '1336',
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        components: {
            diy,wxParse
        },
        onLoad: function (options) {
            uni.setNavigationBarTitle({
                title:this.__('帖子详情')
            });


            var that = this;
            that.setData({story_id: options.id, uid: options.uid || 0});

			that.GetMemberPostsInfo();
			that.GetPostsCommentByPostsId()

            this.setData({
                options: options
            });

            var h = that.$.getSystemInfoSync().windowHeight;
            that.setData({
                screenHeight: h
            })

            this.huifuvalue = this.__('写评论...');
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

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
            let that = this;

            this.refresh || this.setData({
                refresh: !0
            })
        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {
            // 离开页面，注销事件
            var that = this
            this.notice.removeNotification("RefreshProduct", that);
        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {
            this.initData(true)
        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {
            return {
                title: this.ShareTitle,
                imageUrl: this.ShareImg,
                path: "/pages/index/index?uid=" + this.userInfo.user_id
            }
        },

        /**
         * 页面滚动触发事件的处理函数
         */
        onPageScroll: function () {
        },

        methods: {
            ...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo']),
            texthidden: function () {
                var that = this;

                if (!that.datauser.IsComment)
                {
                    CommentVal = {
                        user_id: that.userInfo.user_id,
                        story_id: that.datauser.story_id,
                        comment_content: that.value,/*
                    createNiceName: app.globalData.UserInfo.NickName,
                    createPhotoPath: app.globalData.UserInfo.Photo,
                    operateId: that.shopInfo.store_id,*/
                        comment_reply_id: 0,
                        comment_id: 0,
                        to_user_id: that.datauser.user_id
                    };

                    that.setData({focus: !0, huifuvalue: that.__("写评论...")})
                }

                that.textblock()
            },
            textblock: function () {
                var a = this;
                1 == a.ishidden ? a.setData({ishidden: !1, value: ""}) : a.setData({ishidden: !0})
            },
			doNothing: function(){
				
			},
            onComment: function (a) {
                let that = this;
                that.forceUserInfo(function(user) {
                    that.AddComment()
                });

            },
            AddComment: function () {
                var that = this;

                if (that.datauser.IsComment)
                {
                    that.$.alert(that.__("该帖禁止评论!"))
                }
                else
                {
                    CommentVal.comment_content = that.value;


                    var that = this, params = CommentVal;

                    that.$.request({
                        url: this.Config.URL.sns.story_comment_add,
                        data: params,
                        success: function (data, status, msg, code) {
                            if (200 == status) {
                                that.textblock();
                                that.setData({
                                    pageIndex: 1,
                                    dataComment: []
                                });
                                that.GetPostsCommentByPostsId()
                            } else {
                                that.$.alert(msg)
                            }
                        }
                    });
                }
            },
            textareavalue: function (a) {
                this.setData({value: a.detail.value}), "" == this.value ? this.setData({cursorspacing: 50}) : this.setData({cursorspacing: 0})
            },
            sousuobind: function (a) {
                this.setData({value2: this.value})
            },
            onPostStory: function (a) {
                let that = this;
                that.forceUserInfo(function(user) {
                    that.$.navigateTo({url: "/community/community/post"})
                })
            },
            txt_book: function () {
                let that = this;
                that.$.navigateTo({url: "../../community/Publishedarticles/Publishedarticles"})
            },
            qwe: function () {
            },
            commentari: function (a) {
                this.setData({comment_id: a.currentTarget.dataset.id, commentariehidden: !0})
            },
            commenTarieHidden: function (a) {
                this.setData({comment_id: -1, commentariehidden: !1})
            },
            GetMemberPostsInfo: function () {
                var that = this, params = {user_id: that.userInfo.user_id, story_id: that.story_id};

                that.$.request({
                    url: this.Config.URL.sns.story_get,
                    data: params,
                    loading: true,
                    success: function (data, status, msg, code) {
                        if (200 == status)
                        {
                            data['story_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data['story_time']));

                            that.setData({
                                datauser: data,
                                isdata: !0
                            });

                            that.userInfo.user_id == that.datauser.user_id ? that.setData({isbenren: !0}) : that.setData({isbenren: !1});
							that.htmlString = that.datauser.story_content.replace(/\\/g, "");
                            that.GetMemberPostsServerData();
                        }
                        else
                        {

                            that.setData({isdata: !1});
                            clearTimeout(t);
                            var t = setTimeout(function () {
                                },
                                1500)
                        }
                    }
                });
            },
            GetMemberPostsServerData: function () {
                var that = this, params = {
                    story_id: that.story_id,
                    user_id: that.userInfo.user_id,
                    to_user_id: that.datauser.user_id,
                    /* operateId: that.shopInfo.store_id*/
                };

                that.$.request({
                    url: this.Config.URL.sns.story_rel_data,
                    data: params,
                    loading: false,
                    success: function (data, status, msg, code) {
                        that.setData({
                            dataContent: data,
                            story_hot_rows: data.story_hot_rows
                        });

                        0 < that.dataContent.like_user_total ? that.setData({isshowdzphoto: !0}) : that.setData({isshowdzphoto: !1});
                    }
                });
            },
            GetPostsCommentByPostsId: function () {
                var that = this,
                    params = {story_id: that.story_id, user_id: that.userInfo.user_id, pageIndex: that.pageIndex};

                that.$.request({
                    url: this.Config.URL.sns.story_comment_lists,
                    data: params,
                    loading: false,
                    success: function (data, status, msg, code) {
                        if (data.items.length > 0) {

                            for (var r = 0; r < data.items.length; r++) {
                                //that.dataComment[r]['comment_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(that.dataComment[r]['comment_time']));

								data.items[r]['comment_time_str'] = data.items[r]['comment_time'];

								data.items[r]['reply_name_str'] = '';

                                for (var j = 0; j < data.items[r]['commentList'].length; j++) {
                                    data.items[r]['commentList'][j]['comment_reply_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data.items[r]['commentList'][j]['comment_reply_time']));

                                    //data.items[r]['commentList'][j]['comment_reply_time_str'] = data.items[r]['commentList'][j]['comment_reply_time'];

									data.items[r]['reply_name_str'] = data.items[r]['commentList'][j]['user_nickname'];
                                }
                            }

                            if (data.page >= data.total) {
                                that.setData({
                                    dataComment: that.dataComment.concat(data.items),
                                    flag: !1,
                                    ispage: !1
                                });
                            } else {
                                that.setData({
                                    dataComment: that.dataComment.concat(data.items),
                                    flag: !0,
                                    ispage: !0
                                })
                            }
                        } else {
                            that.setData({flag: !1, ispage: !1})
                        }
                    }
                });
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
                            that.GetMemberPostsInfo()
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
                                        that.GetMemberPostsInfo()
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
                            that.GetMemberPostsInfo()
                            //修正当前记录数据
                            for (var r = 0; r < that.story_hot_rows.length; r++) {
                                if (story_id == that.story_hot_rows[r]['story_id'])
                                {
                                    that.story_hot_rows[r]['IsFabulous'] = 1;
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
                            that.GetMemberPostsInfo()

                            //修正当前记录数据
                            for (var r = 0; r < that.story_hot_rows.length; r++) {
                                if (story_id == that.story_hot_rows[r]['story_id'])
                                {
                                    that.story_hot_rows[r]['IsFabulous'] = 0;
                                }
                            }
                        } else {
                        }
                    }
                });
            },
            onCollection: function (a) {
                var that = this, params = {
                    story_id: a.currentTarget.dataset.story_id
                };


                that.$.request({
                    url: this.Config.URL.sns.story_collection_add,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status) {
                            that.GetMemberPostsInfo()
                        } else {
                        }
                    }
                });
            },
            onUnCollection: function (a) {
                var that = this, params = {
                    story_id: a.currentTarget.dataset.story_id
                };
                that.$.request({
                    url: this.Config.URL.sns.story_collection_remove,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status) {
                            that.GetMemberPostsInfo()
                        } else {
                        }
                    }
                });
            },
            onCommentLike: function (a) {
                let that = this;
                that.forceUserInfo(function(user) {
                    that.zan(a.currentTarget.dataset.comment_id)
                });
            },
            zan: function (comment_id) {
                var that = this, params = {
                    user_id: that.userInfo.user_id,
                    /*operateId: that.shopInfo.store_id,*/
                    comment_id: comment_id
                };

                that.$.request({
                    url: this.Config.URL.sns.story_comment_like_add,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status) {
                            for (var t = [], e = 0; e < that.dataComment.length; e++)
                            {
                                if (that.dataComment[e].comment_id == comment_id)
                                {
                                    var o = that.dataComment[e];
                                    0 == that.dataComment[e].IsFabulous ? (o.IsFabulous = 1, o.comment_like_count = o.comment_like_count + 1) : (o.IsFabulous = 0, o.comment_like_count = o.comment_like_count - 1), t.push(o)
                                }
                                else
                                {
                                    t.push(that.dataComment[e]);
                                }
                            }

                            that.setData({dataComment: t})
                        } else {
                        }
                    }
                });
            },
            onLikeCommentReply: function (d) {
                let that = this;
                that.forceUserInfo(function(user) {

                    var params = {
                        user_id: that.userInfo.user_id,
                        /*operateId: that.shopInfo.store_id,*/
                        comment_reply_id: d.currentTarget.dataset.comment_reply_id
                    };

                    that.$.request({
                        url: that.Config.URL.sns.story_comment_reply_like_add,
                        data: params,
                        success: function (data, status, msg, code) {
                            if (200 == status) {

                                for (var t = d.currentTarget.dataset.index, e = that.dataComment[t].commentList, o = that.dataComment, n = [], s = 0; s < e.length; s++)
                                {
                                    if (e[s].comment_reply_id == d.currentTarget.dataset.comment_reply_id)
                                    {
                                        var r = e[s];
                                        0 == e[s].IsFabulous ? (r.IsFabulous = 1, r.comment_reply_helpful_num = r.comment_reply_helpful_num + 1) : (r.IsFabulous = 0, r.comment_reply_helpful_num = r.comment_reply_helpful_num - 1), n.push(r)
                                    }
                                    else
                                    {
                                        n.push(e[s]);
                                    }
                                }
                                o[t].commentList = n, that.setData({dataComment: o})
                            } else {
                            }
                        }
                    });
                });
            },
            onUnLikeCommentReply: function (d) {

                let that = this;
                that.forceUserInfo(function(user) {

                    var params = {
                        comment_reply_id: d.currentTarget.dataset.comment_reply_id
                    };

                    that.$.request({
                        url: that.Config.URL.sns.story_comment_reply_like_remove,
                        data: params,
                        success: function (data, status, msg, code) {
                            if (200 == status) {

                                for (var t = d.currentTarget.dataset.index, e = that.dataComment[t].commentList, o = that.dataComment, n = [], s = 0; s < e.length; s++)
                                {
                                    if (e[s].comment_reply_id == d.currentTarget.dataset.comment_reply_id)
                                    {
                                        var r = e[s];
                                        0 == e[s].IsFabulous ? (r.IsFabulous = 1, r.comment_reply_helpful_num = r.comment_reply_helpful_num + 1) : (r.IsFabulous = 0, r.comment_reply_helpful_num = r.comment_reply_helpful_num - 1), n.push(r)
                                    }
                                    else
                                    {
                                        n.push(e[s]);
                                    }
                                }
                                o[t].commentList = n, that.setData({dataComment: o})
                            } else {
                            }
                        }
                    });
                });
            },
            onUnCommentLike: function (n) {
                let that = this;
                that.forceUserInfo(function(user) {

                    var params = {
                        comment_id: n.currentTarget.dataset.comment_id
                    };

                    that.$.request({
                        url: that.Config.URL.sns.story_comment_like_remove,
                        data: params,
                        success: function (data, status, msg, code) {
                            if (200 == status) {
                                for (var t = [], e = 0; e < that.dataComment.length; e++)
                                {
                                    if (that.dataComment[e].comment_id == n.currentTarget.dataset.comment_id)
                                    {
                                        var o = that.dataComment[e];
                                        0 == that.dataComment[e].IsFabulous ? (o.IsFabulous = 1, o.comment_like_count = o.comment_like_count + 1) : (o.IsFabulous = 0, o.comment_like_count = o.comment_like_count - 1), t.push(o)
                                    }
                                    else
                                    {
                                        t.push(that.dataComment[e]);
                                    }
                                }
                                that.setData({dataComment: t})
                            } else {
                            }
                        }
                    });
                });
            },
            onReply: function (a) {
                let that = this, dc = that.dataComment;
                for (var i = 0; i < that.dataComment.length; i++)
                {
                    for (var n = 0; n < that.dataComment[i].commentList.length; n++)
                    {
                        a.currentTarget.dataset.id == that.dataComment[i].commentList[n].comment_reply_id ? 1 == that.dataComment[i].commentList[n].IsShow ? dc[i].commentList[n].IsShow = !1 : dc[i].commentList[n].IsShow = !0 : dc[i].commentList[n].IsShow = !1;
                    }

                    a.currentTarget.dataset.id == that.dataComment[i].comment_id ? 1 == that.dataComment[i].IsShow ? dc[i].IsShow = !1 : dc[i].IsShow = !0 : dc[i].IsShow = !1
                }

                that.setData({dataComment: dc});
                1 == that.hiddenddd ? that.setData({hiddenddd: !1}) : that.setData({hiddenddd: !0})
            },
            hiddend: function () {
                var a = this;
                1 == a.hiddenddd && a.setData({hiddenddd: !1});
                for (var t = a.dataComment, e = 0; e < a.dataComment.length; e++)
                {
                    for (var o = 0; o < a.dataComment[e].commentList.length; o++)
                    {
                        t[e].commentList[o].IsShow = !1;
                    }
                    t[e].IsShow = !1
                }
                a.setData({dataComment: t})
            },
            ahuifu: function (a) {
                var that = this;
                that.setData({hiddenddd: !1});

                if (that.datauser.IsComment)
                {
                    that.setData({
                        focus: !1,
                        huifuvalue: "禁言"
                    })
                }
                else
                {
                    this.setData({
                        focus: !0,
                        huifuvalue: this.$.sprintf(this.__("回复@%s："), a.target.dataset.user_nickname)
                    });

                    CommentVal = {
                        user_id: that.userInfo.user_id,
                        story_id: that.datauser.story_id,/*
                        comment_content: that.value,
                        createNiceName: app.globalData.UserInfo.NickName,
                        createPhotoPath: app.globalData.UserInfo.Photo,
                        operateId: that.shopInfo.store_id,*/
                        comment_id: a.target.dataset.comment_id,
                        comment_reply_id: a.target.dataset.comment_reply_id,
                        to_user_id: a.target.dataset.user_id,
                        to_user_nickname: a.target.dataset.user_nickname
                    }
                }

                that.textblock();

                for (var e = that.dataComment, o = 0; o < that.dataComment.length; o++)
                {
                    for (var n = 0; n < that.dataComment[o].commentList.length; n++)
                    {
                        a.currentTarget.dataset.id == that.dataComment[o].commentList[n].Id && that.dataComment[o].commentList[n].IsShow, e[o].commentList[n].IsShow = !1;
                    }

                    a.currentTarget.dataset.id == that.dataComment[o].Id && that.dataComment[o].IsShow, e[o].IsShow = !1
                }
                that.setData({dataComment: e})
            },
            scrollbottom: function (a) {
                if (this.flag && this.ispage)
                {
                    var t = this;
                    t.setData({flag: !1}), clearTimeout(e);
                    var e = setTimeout(function () {
                            t.setData({pageIndex: parseInt(t.pageIndex) + 1}), t.GetPostsCommentByPostsId()
                        },
                        500)
                }
            },
            gerenzhongxin: function () {
                let that = this;
                that.$.navigateTo({url: "/community/community/userspace?uid=" + this.datauser.user_id})
            },
            yulan: function (a) {
                let that = this;

				let url = "/community/community/video?id="+this.story_id;

				if (this.datauser['story_type'] == 4)
				{
					this.$.gopage(url);
				}
				else
				{
                    for (var t = [], e = 0; e < this.datauser.story_file.length; e++)
                    {
                        //2 == this.datauser.story_file[e].ContentType && t.push(this.datauser.story_file[e].ImgPath);
                        t.push(this.datauser.story_file[e]);
                    }

                    that.$.previewImage({current: a.currentTarget.dataset.url, urls: t})
				}
            },
            onShareAppMessage: function () {
                return {
                    title: this.datauser.story_title,
                    path: "/community/community/detail?id=" + this.datauser.Id + "&uid=" + that.userInfo.user_id
                }
            },
            remen: function (a) {
                let that = this;
                that.$.navigateTo({
                    url: "/community/community/detail?id=" + a.currentTarget.dataset.id, success: function (a) {
                    },
                    fail: function (a) {
                    },
                    complete: function (a) {
                    }
                })
            },
            scrolltoupper: function (a) {
                a.detail.scrollTop >= this.screenHeight ? this.setData({isquicknav: !0}) : this.setData({isquicknav: !1})
            },
            returnTop: function () {
                this.setData({scposition: 0})
            },
            nav: function () {
                this.setData({isnav: !1, animation: !1})
            },
            outnav: function () {
                var a = this;
                this.setData({animation: !0}), setTimeout(function () {
                        a.setData({isnav: !0})
                    },
                    400)
            }
        }
    };
</script>


<style lang="scss">
    @import "../../styles/_variables";
    @import '../../styles/layout.scss';

    page {
        background-color: #fff;
    }

    .wrap-box {
        position: relative;
        width: 750upx;
    }

    .like_user_total {
        font-size: 30upx;
        line-height: 88upx;
        display: inline-block;
        padding-left: 40upx;
    }

    .success {
        display: block;
    }

    .circle {
        display: none;
    }

    .box_title {
        /* height: 157rpx; */
        /* display: flex; */
        position: relative;
        padding: 0 30upx;
    }

    .box_title_img {
        width: 75upx;
        height: 75upx;
        padding: 40upx 17upx 40upx 0upx;
        /* float: left; */
    }

    .box_title_image {
        width: 73upx;
        height: 73upx;
        border-radius: 100%;
        overflow: hidden;
    }

    .box_title_image2 {
        width: 53upx;
        height: 53upx;
        border-radius: 100%;
        border: 1upx solid #fff;
        overflow: hidden;
        margin: 17rpx -5rpx;
    }

    .box_title_name {
        min-width: 59px;
        /* float: left; */
        font-size: 24upx;
        height: 112upx;
        color: #959593;
    }

    .box_title_guanzhu {
        /* float: left; */
        width: 144upx;
        text-align: center;
        float: right;
    }

    .box_title_guanzhu_text {
        padding: 15upx 0upx;
        /* line-height: 56rpx; */
        border-radius: 35upx;
        margin-top: 49upx;
        background-color: #DB384C;
        color: #fff;
        font-size: 25upx;
        align-content: center;
        align-items: center;
        text-align: center;
        line-height: 18px;
    }

    button::after {
        border: none;
    }

    input {
        outline: none;
        border: none;
        list-style: none;
    }

    .box {
        /* float: left; */
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        background-color: #fff;
        clear: both;
    }

    .box_text {
        font-size: 30upx;
        line-height: 55upx;
        box-sizing: border-box;
        position: relative;

        label {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
        }
    }

    .onReply {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        padding: 0 30upx 20upx 30upx;
        color: #606060;
    }

    .bbb {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        padding: 0 28upx;
    }

    .quanbu {
        color: #5f9ee3;
        font-size: 36upx;
        line-height: 100upx;
        padding: 0 28upx;
    }

    .time {
        color: #767676;
        font-size: 26upx;
        padding: 26upx 30upx;
    }

    .newsimg_box {
    }

    .newsimg_box_img {
        padding: 0upx 23upx;
    }

    .newsimg_box_image2 {
        width: 333upx;
        height: 333upx;
        padding: 0 14upx;
        /* float: left; */
    }

    .time_box {
        width: 532upx;
        height: 100upx;
        /* float: left */
    }

    .time_box_dz {
        width: 136upx;
        height: 100upx;
        line-height: 123upx;
        /* float: left */
    }

    .time_box_dz_img2 {
        width: 37upx;
        height: 40upx;
        margin-top: 17upx;
        margin-left: 20upx;
    }

    .time_box_dz_img {
        width: 37upx;
        height: 40upx;
        margin-top: 1upx;
        margin-left: 90upx;
    }

    .time_box_fx_img {
        width: 30upx;
        height: 35upx;
        margin-left: 65upx;
    }

    .box_box::before {
        content: " ";
        position: absolute;
        left: 28upx;
        top: 0;
        right: 28upx;
        height: 1px;
        border-top: 1px solid #d9d9d9;
        color: #d9d9d9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .box_title_guanzhu span {
        line-height: 156upx;
        font-size: 30upx;
        color: #ff6000;
    }

    .newsimg_box_image1 {
        width: 694upx;
        height: 342upx;
        padding: 0 14upx;
    }

    .newsimg_box_image3 {
        width: 220upx;
        height: 220upx;
        margin: 0upx 6upx 0upx 9upx;
        display: inline-block;
    }

    .givealike_box {
        position: relative;
        margin: 0upx 30upx;
        display: flex;
        clear: both;
    }

    .up {
        height: 22upx;
        width: 26upx;
        position: absolute;
        top: -21rpx;
        left: 29upx;
    }

    .box_title_image2_box {
        /* max-width: 319rpx; */
        width: 100%;
        display: flex;
        position: relative;
        height: 127upx;
    }

    .dzys {
        height: 61upx;
        border-left: 1upx solid #e8e8e8;
        margin-top: 37upx;
    }

    .dzys_img {
        width: 40upx;
        height: 40upx;
        margin: 8upx 0 0 28upx;
    }

    .commentaries {
        vertical-align: text-top;
        font-size: 30upx;
        border-left: 4upx solid #ed2b43;
        padding-left: 20upx;
        /* position: relative; */
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .all_pl {
        /* position: absolute; */
        /* top: -2rpx; */
        color: #3d3d3d;
        font-size: 28upx;
        width: 543upx;
        text-align: right;
    }

    .commentaries_title {
        display: flex;
    }

    .touxiang_box2 {
        width: 60upx;
        height: 60upx;
        padding: 0upx 25upx 0upx 0upx;
        float: left;
    }

    .commentaries_title_img {
        width: 60upx;
        height: 60upx;
        padding: 29upx 25upx 29upx 25upx;
    }

    .commentaries_tzpl {
        color: #d23349;
    }

    .commentaries_title_image {
        width: 60upx;
        height: 60upx;
        border-radius: 100%;
        overflow: hidden;
    }

    .commentaries_title_name {
        font-size: 30upx;
        margin: 30upx 25upx 25upx 0upx;
        padding-left: 28upx;
        width: 620upx;
        height: 66upx;
        background-color: #f4f8fb;
        line-height: 66upx;
    }

    .commentaries_text_box {
        margin: 0 25upx 0 85upx;
        clear: both;
    }

    .commentaries_text {
        font-size: 32upx;
        line-height: 50upx;
    }

    .commentaries_text_time {
        font-size: 26upx;
        padding: 29upx 0;
        color: #9aa1ae;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .commentaries_text_img {
        width: 24upx;
        height: 24upx;
        margin: 6upx 0 0 10upx;
    }

    .commentaries_text_revert_box {
        background-color: #f4f8fb;
        font-size: 32upx;
    }

    .commentaries_text_revert {
        padding: 13upx 0upx 0 28upx;
    }

    .commentaries_text_revert_name {
        color: #9aa1ae;
        font-size: 28upx;
    }

    .commentaries_text_revert_name_img {
        width: 24upx;
        height: 18upx;
    }

    .commentaries_text_revert_name_box {
    }

    .allcommentaries {
        font-size: 30upx;
        color: #9aa1ae;
        text-align: center;
        margin: 75upx 0 100upx 0;

        span {
            padding: 17upx 40upx;
            border: 1upx solid #9aa1ae;
            border-radius: 40upx;
        }
    }

    .input_box {
        width: 100%;
        height: 87upx;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #fff;
        z-index: 1;
        display: flex;
        border-top: 1upx solid #f6f6f6;
    }

    .input_box_img {
        width: 55upx;
        height: 55upx;
        padding: 16upx 15upx 16upx 23upx;
    }

    .input_box_image {
        width: 55upx;
        height: 55upx;
        border-radius: 100%;
        overflow: hidden;
    }

    .input_box_input {
        width: 587upx;
        height: 65upx;
        background-color: #f6f6f6;
        margin: 12upx 0upx 14upx 22upx;
        border-radius: 5upx;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;

        span {
            font-size: 26upx;
            margin-left: 20upx;
            color: #a4a4a4;
            line-height: 55upx;
        }
    }

    .top_box {
        display: inline-block;
    }

    .input_box_fs {
        text-align: center;
        font-size: 30upx;
        color: #939ca9;
        line-height: 70upx;
        width: 113upx;
    }

    .tianchong {
        width: 100%;
        height: 144upx;
        background-color: #fff;
        line-height: 144upx;
        color: #9aa1ae;
        text-align: center;
        font-size: 30upx;
        clear: both;
    }

    .input_box_input_input {
        width: 690upx;
        margin: 0upx 10upx;
        background-color: #fff;
        height: 64upx;
    }

    .input_box_input_input2 {
        width: 690upx;
        margin: 20upx 10upx;
        height: 160upx;
        background-color: #fff;
        color: #666;
        font-size: 30upx;
    }

    .hidden_box {
        background-color: #000;
        position: fixed;
        height: 100%;
        width: 100%;
        opacity: 0.6;
        z-index: 2;
    }

    .hidden_box_Input {
        width: 100%;
        position: fixed;
        bottom: 0;
        z-index: 3;
        background-color: #fff;
    }

    .hidden_box_Input_box {
        margin: 30upx 20upx 20upx 20upx;
        border: 1upx solid #d9d9d9;
        border-radius: 5upx;
    }

    .hidden_box_input {
    }

    .hidden_box_Input_but {
        padding: 0 20upx;
    }

    .hidden_box_Input_button {
        padding: 10upx 20upx;
        background-color: #d9d9d9;
        font-size: 28upx;
        border-radius: 5upx;
        color: #fff;
        float: right;
        margin-bottom: 20upx;
    }

    .box_title::before {
        content: " ";
        position: absolute;
        left: 40upx;
        top: 150upx;
        right: 30upx;
        height: 1px;
        border-top: 1px solid #ebebe7;
        color: #ebebe7;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .box_text_title {
        font-size: 34upx;
        padding: 26upx 30upx 17upx 30upx;
        color: #000;
    }

    .commentaries_box {
        background-color: #fff;
    }

    .commodity_box {
        padding: 25upx 30upx 0upx 30upx;
        display: flex;
        position: relative;
    }

    .commodity_img {
        width: 36upx;
        height: 36upx;
        margin: 0;
        padding: 0;
    }

    .commodity_text {
        font-size: 30upx;
        margin-left: 17upx;
        color: #d23349;
    }

    .commodity_shop {
        margin: 30upx 30upx 0upx 30upx;
        background-color: #fbfbfb;
        width: 690upx;
        height: 160upx;
        display: flex;
    }

    .commodity_shopImg {
        width: 160upx;
        height: 160upx;
        float: left;
    }

    .commodity_shop_name {
        padding: 22upx 40upx 0 21upx;
        font-size: 30upx;
        height: 74upx;
        float: left;
        width: 468upx;
    }

    .commodity_shop_nametext {
        color: #323232;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .commodity_shop_pic {
        font-size: 30upx;
        color: #d23349;
        padding: 0 0 0 21upx;
        height: 76upx;
        line-height: 76upx;
        float: left;
    }

    .commodity {
        position: relative;
        margin-bottom: 30upx;
        clear: both;

        &::before {
            content: " ";
            position: absolute;
            left: 30upx;
            top: 0upx;
            right: 30upx;
            height: 1px;
            border-top: 1px solid #ebebe7;
            color: #ebebe7;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
        }
    }

    .box_title_image2_box::before {
        content: " ";
        position: absolute;
        left: 0upx;
        top: 0upx;
        right: 0upx;
        height: 1px;
        border-top: 1px solid #ebebe7;
        color: #ebebe7;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .box_title_image2_box_box {
        width: 602upx;
        margin: 20upx 0 20upx 20upx;

        span {
            font-size: 28upx;
            color: #5c5c5c;
            line-height: 88upx;
            width: 120upx;
            text-align: right;
        }
    }

    .rmtz_box_title {
        width: 750upx;
        height: 86upx;
    }

    .rmtz_box {
        background-color: #fff;
    }

    .rmtz_box_content_box2 {
        width: 540upx;
        float: left;
    }

    .rmtz_box_content_img {
        width: 149upx;
        height: 149upx;
        float: right;
    }

    .rmtz_box_content_Img {
        width: 149upx;
        height: 149upx;
    }

    .rmtz_box_content_box {
        background-color: #fff;
        padding: 10upx 23upx;
        height: 150upx;
        position: relative;
    }

    .rmtz_box_content_box_text {
        width: 540upx;
        float: left;
        font-size: 30upx;
        padding-top: 15upx;
        height: 101upx;
    }

    .pldz_box {
        width: 540upx;
        float: left;
        font-size: 24upx;
        height: 32upx;
        color: #959593;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .dz {
        width: 30upx;
        height: 24upx;
        vertical-align: text-top;
    }

    .pl {
        width: 30upx;
        height: 30upx;
        vertical-align: text-top;
    }

    .rmtz_box_content_box_dz {
        float: left;
        padding-right: 20upx;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;

        span {
            padding: 0 10upx;
            font-size: 24rpx;
        }
    }

    .rmtz_box_content_box_pl {
        span {
            padding: 0 10upx;
            margin-top: 2upx;
            font-size: 24rpx;
        }

        float: left;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        float: left;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        padding-left: 0px;
        padding-right: 0px;
        font-size: 0px;
        background-color: #fff;
        line-height: 1.8;
    }

    .neirong_time {
        display: flex;
        padding: 0upx 0;
    }

    .rmtz_box_content_box::before {
        content: " ";
        position: absolute;
        left: 30upx;
        top: 168upx;
        right: 0upx;
        height: 1px;
        border-top: 1px solid #ebebe7;
        color: #ebebe7;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .commentaries2 {
        padding: 20upx 30upx;
        position: relative;
    }

    .right {
        width: 20upx;
        height: 27upx;
        float: right;
    }

    .right2 {
        width: 20upx;
        height: 27upx;
    }

    .commentaries_title_box_box {
        margin: 25upx 0 0 0;
        background-color: #fff;
    }

    .commentaries2::before {
        content: " ";
        position: absolute;
        left: 30upx;
        top: 80upx;
        right: 0upx;
        height: 1px;
        border-top: 1px solid #ebebe7;
        color: #ebebe7;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .touxiang_box {
        padding: 0 25upx;
    }

    .name_box3 {
        height: 74upx;
        width: 490upx;
        line-height: 66upx;
        float: left;
        font-size: 30upx;
    }

    .name_box2 {
        height: 40upx;
        width: 615upx;
        float: left;
        font-size: 30upx;
    }

    .conton_box2 {
        width: 615upx;
        float: left;
        font-size: 32upx;
        line-height: 45upx;
        padding: 20upx 0;
    }

    .conton_box {
        padding: 10upx 28upx 0 0;
        font-size: 30upx;
    }

    .commentaries_text_time_img {
        width: 30upx;
        height: 33upx;
        vertical-align: text-top;
    }

    .commentaries_text_time_Img {
        margin-left: 13upx;
        margin-right: 30upx;
        color: #000;
        font-size: 30upx;
    }

    .commentaries_text_time_tome {
        width: 466upx;
    }

    .time_a, .time_aa {
        font-size: 40upx;
        font-weight: bold;
        color: #000;
        position: relative;
        display: inline-block;
    }

    .hidden_time_a {
        width: 244upx;
        height: 68upx;
        position: absolute;
        background: url(https://static.shopsuite.cn/xcxfile/appicon/reply_bg.png) center no-repeat;
        background-size: 100%;
        right: 38upx;
        top: -10rpx;
        z-index: 99;
    }

    .falhidden_time_a {
        height: 68upx;
        position: absolute;
        background: url(https://static.shopsuite.cn/xcxfile/appicon/reply_bg.png) center no-repeat;
        background-size: 100% 100%;
        right: 38upx;
        top: -10rpx;
        z-index: 99;
    }

    .hidden_time_aa {
        width: 244upx;
        height: 68upx;
        position: absolute;
        background: url(https://static.shopsuite.cn/xcxfile/appicon/reply_bg.png) center no-repeat;
        background-size: 100%;
        right: 38upx;
        top: -10rpx;
        z-index: 999;
    }

    .falhidden_time_aa {
        height: 68upx;
        position: absolute;
        background: url(https://static.shopsuite.cn/xcxfile/appicon/reply_bg.png) center no-repeat;
        background-size: 100% 100%;
        right: 38upx;
        top: -10rpx;
        z-index: 999;
    }

    .zghf {
        clear: both;
        font-size: 30upx;
        margin: 0upx 0upx 0upx 110upx;
        padding-left: 28upx;
        width: 620upx;
        height: 66upx;
        background-color: #f4f8fb;
        line-height: 66upx;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .zghf_lanse {
        color: #446fcd;
    }

    .hidden_time_b {
        font-size: 28upx;
        color: #fff;
        border-right: 1upx solid #fff;
        line-height: 33upx;
        height: 30upx;
        margin: 19upx 0;
        width: 124upx;
        text-align: center;
        display: inline-block;
        z-index: 99;
    }

    .hidden_time_bb {
        font-size: 28upx;
        color: #fff;
        border-right: 1upx solid #fff;
        line-height: 33upx;
        height: 30upx;
        margin: 19upx 0;
        width: 124upx;
        text-align: center;
        display: inline-block;
    }

    .hidden_time_c, .hidden_time_cc {
        font-size: 28upx;
        color: #fff;
        line-height: 33upx;
        height: 30upx;
        margin: 19upx 0;
        width: 107upx;
        text-align: center;
        display: inline-block;
    }

    .xiepinglun {
        width: 50upx;
        height: 50upx;
        text-align: center;
        vertical-align: text-top;
        margin-left: 15upx;
    }

    .myz {
        font-size: 30upx;
        color: #767676;
        text-align: center;
        width: 619upx;
        line-height: 127upx;
    }

    .louzhu {
        font-size: 23upx;
        border: 1upx solid #DB384C;
        color: #d23349;
        border-radius: 46upx;
        margin-left: 20upx;
        height: 34upx;
        width: 79upx;
        text-align: center;
        line-height: 32upx;
        display: inline-block;
        /* align-items:center; */
    }

    .user_nickname_box {
        margin-top: 35upx;
        margin-bottom: 10upx;
        display: flex;
        align-items: center;
    }

    .user_nickname {
        height: 36upx;
        font-size: 28upx;
        color: #333;
        max-width: 224upx;
        overflow: hidden;
        float: left;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }

    .ddd {
        width: 50upx;
        height: 28upx;
    }

    .h_box {
        padding: 30upx 30upx 0 30upx;
        display: flex;
    }

    .h_box_touxiang {
        width: 58upx;
        height: 58upx;
        border-radius: 100%;
    }

    .h_box_neirong {
        margin-left: 16upx;
        width: 100%;
    }

    .neirong_name {
        font-size: 30upx;
        color: #5b5b5b;
    }

    .neirong_text {
        font-size: 28upx;
        color: #000;
        line-height: 50upx;
        word-wrap: break-word;
        word-break: break-all;
    }

    .tupianbox {
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        width: 156upx;
    }

    .neirong_time_time {
        width: 473upx;
        font-size: 24upx;
        color: #959593;
        display: flex;
        align-items: center;
    }

    .z_neirong_time_time {
        width: 388upx;
        font-size: 24upx;
        color: #7e7e7e;
        display: flex;
        align-items: center;
        padding-left: 60upx;
    }

    .tupianbox_img {
        width: 100upx;
        font-size: 30upx;
        color: #7e7e7e;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .zihuifu_box {
        background-color: #f4f8fb;
        padding: 16upx 0 16upx 25upx;
        font-size: 30upx;
    }

    .zihuifu_dengr {
        color: #4e4f51;
    }

    .gonghuifu {
        color: #387fd1;
    }

    .z_box_touxiang {
        width: 47upx;
        height: 47upx;
        border-radius: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .z_title_box {
        display: flex;
        align-items: center;
        padding: 0 0 10upx 0;
    }

    .zihuifu_name {
        font-size: 24upx;
        color: #333;
        display: inline-block;
        padding: 0 10upx;

        width: 500upx;

        span {
            padding: 0 3upx;
        }
    }

    .zihuifu_text {
        font-size: 26upx;
        color: #3a3b3d;
        line-height: 50upx;
        padding-left: 60upx;
    }

    .shouqi {
        color: #9aa1ae;
        text-align: center;
        font-size: 28upx;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .shouqi_box {
    }

    .top {
        width: 30upx;
        height: 25upx;
        vertical-align: text-top;
    }

    .circle {
        display: none;
    }

    .zhiding {
        padding: 0upx 30upx;
        text-align: right;
        color: #DB384C;
        font-size: 32upx;
        display: inline-block;
    }

    .hidden_ddd {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 2;
        top: 0;
        left: 0;
    }

    .u-tap-btn {
        position: fixed;
        right: 20upx;
        bottom: 230upx;
        z-index: 9999;
    }

    .u-go-home {
        border-radius: 100%;
        width: 80upx;
        height: 80upx;
        font-size: 20upx;
        text-align: center;
        background-color: #fff;
        box-shadow: 0px 4upx 8upx rgba(0, 0, 0, 0.35);
        z-index: 9999;
        opacity: 0.8;
        line-height: 80upx;
        margin-bottom: 20upx;

        .iconfont {
            font-size: 50upx;
        }

        &::after {
            border: none !important;
        }
    }

    @keyframes mymove1 {
        from {
            bottom: 120upx;
            opacity: 0;
        }

        to {
            bottom: 520upx;
            opacity: 1;
        }
    }


    @keyframes mymove2 {
        from {
            bottom: 120upx;
            opacity: 0;
        }

        to {
            bottom: 420upx;
            opacity: 1;
        }
    }


    @keyframes mymove3 {
        from {
            bottom: 120upx;
            opacity: 0;
        }

        to {
            bottom: 320upx;
            opacity: 1;
        }
    }


    @keyframes mymove4 {
        from {
            bottom: 120upx;
            opacity: 0;
        }

        to {
            bottom: 220upx;
            opacity: 1;
        }
    }


    @keyframes mymove5 {
        from {
            bottom: 520upx;
            opacity: 1;
        }

        to {
            bottom: 110upx;
        }
    }


    @keyframes mymove6 {
        from {
            bottom: 420upx;
            opacity: 1;
        }

        to {
            bottom: 110upx;
            opacity: 0;
        }
    }


    @keyframes mymove7 {
        from {
            bottom: 320upx;
            opacity: 1;
        }

        to {
            bottom: 110upx;
            opacity: 0;
        }
    }


    @keyframes mymove8 {
        from {
            bottom: 220upx;
            opacity: 1;
        }

        to {
            bottom: 110upx;
            opacity: 0;
        }
    }

    .triangle_border_right, .triangle_border_right01 {
        width: 0;
        height: 0;
        border-width: 6px 0 6px 6px;
        border-style: solid;
        border-color: transparent transparent transparent rgb(54, 53, 53);
        margin: 40px auto;
        position: absolute;
        top: -69rpx;
        right: 64%;
        z-index: 1;
    }
</style>
