<template>
  <view class="userspace" :class="!totalOrderStatus ? 'userspace-padding' : ''">	
    <!-- 头部 -->
    <u-navbar class="normal_navbar" :leftIconColor="navbarColor"  :rightIconColor="navbarColor" :bgColor="navbarRgba" :title="navbartitle" :rightIcon="shareIcon" @leftClick="navBack" :is-fixed="true" @rightClick="onShareBox" :border-bottom="false"> </u-navbar>
    <scroll-view scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom" @scroll="scroll" :scroll-top="scrollTop" @scrolltoupper="scroll">
      <view class="m-banner-img">
<!--        <view v-if=" teacherList.portraitUrl != '' " class="m-animate-warp" :style="'background:url(' + UserInfo.user_avatar + ');background-size: cover;'"></view>
        <view v-if="teacherList.portraitUrl == ''" class="m-animate-warp"></view> -->
		<img class="m-animate-warp" :src="spaceBg"/>
      </view>
      <!-- 内容区域 -->
      <view class="circle-content">
        <view class="content">
          <view url="../personaldata/personaldata" class="m-user-info">
<!--            <image :src="teacherList.portraitUrl" mode="scaleToFill" /> -->
			<image :src="teacherList.portraitUrl" @error="handleError($event)"/>
            <!-- <text>{{UserInfo.user_nickname}}</text> -->
			<image v-if="teacherList.vflag" class="iconV" :src="iconV" mode="scaleToFill"></image>
          </view>
          <view class="circle-fans">
            <view class="circle-child">
              <view class="fans_num">{{teacherList.customers || '--'}}</view>
              <view class="fans_lable">客户</view>
            </view>
            <view class="circle-child fans-between">
              <view class="fans_num">{{teacherList.fans || '--'}}</view>
              <view class="fans_lable">粉丝</view>
            </view>
            <view class="circle-child">
              <view class="fans_num">{{teacherList.visits || '--'}}</view>
              <view class="fans_lable">访问量</view>
            </view>
          </view>
          <view>
            <view class="teacher-name">{{teacherList.teacherName || '--'}}</view>
            <view class="teacher-desc" @tap="openMore" :class="isOpenMore ? 'openMoreText' : ''">{{teacherList.teacherDesc || '--'}}</view>
            <view class="lable-list">
              <view class="lable" v-for="item in lableList" :key="item">{{ item }}</view>
            </view>
            <view class="filed">
              <view> <text>领域：</text><text>{{teacherList.field || '--'}}</text> </view>
              <view> <text>行业：</text><text>{{teacherList.industry || '--'}}</text> </view>
            </view>
            <view class="btn" :class="UserInfo.IsFollow || options.uid == userInfo.user_id ? '' : 'isChat'">
              <view class="btnFollow" >

				<view  v-if="options.uid != userInfo.user_id">
					<view  @click="onUnFollow" size="mini" class="attention" v-if="UserInfo.IsFollow" :data-user_id="UserInfo.user_id + ''">{{ __('取消关注') }}</view>
					<view  @click="onFollow" size="mini" class="attention follow"  v-if="!UserInfo.IsFollow" :data-user_id="UserInfo.user_id + ''">{{ __('关注') }}</view>
				</view>
				<view clas="attention" v-else>
					<view class="onPosting " v-if="tapindex == 0 && isPosting" @click="onPostStory">
					  <image class="editLable" src="https://qnsp.zcskjy.com/zc_images/findTools/editLable.png"></image>
					  <view>发帖</view>
					</view>
				</view>
              </view>
			  
             <view  class="investment" v-if="UserInfo.IsFollow && options.uid != userInfo.user_id " :data-user_id="UserInfo.user_id + ''" @tap="tochat">
				  <img class="email" :src="emailWhite" />
				   <view class="privateLetter-text">去私信</view>
             </view>
			  <view class="investment look-message" v-if="options.uid == userInfo.user_id" @tapssss="message()">
			  <!-- 		<uni-icons color="#ffffff" type="chatboxes" size="30"></uni-icons> -->
			  			<img class="email" :src="emailWhite" />
			  		<view class="privateLetter-text">查看消息</view>
			  		<messageCenter newsImg="emailWhite" />
			     </view>
            </view>
          </view>
        </view>
      </view>
      <u-sticky bgColor="#fff">
        <u-tabs :list="tabList" :activeStyle="{ color: '#333333',fontWeight: 'bold',transform: 'scale(1.05)',}" :scrollable="false" :current="tapindex" @change="cliTab"></u-tabs>
      </u-sticky>
      <shortVideo v-if="tapindex == 1" ref="shortVideo" :options="options" @showShortVideo="showShortVideo"/>
	  <liveLists ref="liveLists" v-if="tapindex == 2" :page="page" :options="options" />
	  <teacherCourses ref="teacherCourses" class="liveContent" v-if=" tapindex == 3" :page="page" :tapindex="tapindex" :options="options" />
      <policyDecision v-if="tapindex == 4" />
	    <noData noDataText="暂未发布观点" v-if="tapindex == 0 && PostsList.length == 0"></noData>
        <noData noDataText="暂未短视频" v-if="(tapindex == 1 && !showVideo)"></noData>
      <view v-if="tapindex == 0 && PostsList.length != 0" class="rmtz_box_content_box" v-for="(item, i) in PostsList" :key="i">
        <view class='box_title_img'>
          <image class='box_title_image' :src="item.user_avatar"></image>
        </view>
        <view style="display: flex;justify-content: space-between;min-width: 600upx;">
          <view>
            <view class='box_title_name'>{{item.user_nickname}}</view>
            <view class='box_title_name_time'>发布于{{item.story_time_str}}</view>
          </view>
          <view v-if="IsLoginUser && tapindex != 2 && !item.story_enable">
            <image class="examine" src="https://qnsp.zcskjy.com/zc_images/findTools/examine.png"></image>
          </view>
        </view>
        <view class="rmtz_box_content_box2">
		   <view @click="navDetail(item.story_id)">
			<view class="rmtz_box_content_box_text text-over2"><span>{{ item.story_title || item.comment_content }}</span></view>
			<view class="rmtz_box_content_box_content">{{item.story_content}}</view>
		   </view>
          <block v-if="item.story_title ">
              <view class="" @click="navDetailVideo(item.story_id,item.story_enable)" v-if="item.story_type == 4">
                <view :data-url="item.ImgPath" class="rmtz_box_content_Img" :style="'background: url(' + item.story_file[0] + ') center no-repeat; background-size:cover;'"></view>
              </view>
            </navigator>
			<view @click="navDetail(item.story_id,item.story_enable)"  v-if="item.story_type != 4">
				<view class="" v-if="item.story_file[0]" >
				  <view :data-url="item.ImgPath" class="rmtz_box_content_Img" :style="'background: url(' + item.story_file[0] + ') center no-repeat; background-size:cover;'"></view>
				</view>
			</view>
            
          </block>
          <!-- 点赞评论小图标 -->
          <view class="pldz_box">
            <view class="pldz_item rmtz_box_content_box_dz">
              <image class="dz" src="https://qnsp.zcskjy.com/zc_images/findTools/eye.png"></image>
              <span>{{ item.story_collection_count }}</span>
            </view>
            <button class="pldz_item rmtz_box_content_box_pl" hover-class="none" style="padding-left: 22upx" v-if="item.IsFabulous == 1" :data-story_id="item.story_id" open-type="getUserInfo" lang="zh_CN" @click="onUnLike(item,i)">
              <image class="pl" src="https://static.shopsuite.cn/xcxfile/appicon/img/side1_03.png"></image>
              <span style="font-size: 12px">{{ item.story_like_count }}</span>
            </button>
            <button class="pldz_item rmtz_box_content_box_pl" hover-class="none" style="padding-left: 22upx" v-else :data-story_id="item.story_id" open-type="getUserInfo" lang="zh_CN" @click="onLike(item,i)">
              <image class="pl" src="https://static.shopsuite.cn/xcxfile/appicon/img/side1_05.png"></image>
              <span style="font-size: 12px">{{ item.story_like_count }}</span>
            </button>
			<view class="pldz_item rmtz_box_content_box_pl reply" @tap="certificate(item.story_id)">
			  <image class="pl" src="https://qnsp.zcskjy.com/zc_images/findTools/pinglun.png"></image>
			  <span style="font-size: 12px; color: #959593">{{ item.story_comment_count }}</span>
			</view>
            <view v-if="IsLoginUser && tapindex != 2" class="rmtz_box_content_box_sc" :data-id="item.story_id" @tap="DeleteMemberPosts">
              <image class="sc" src="https://static.shopsuite.cn/xcxfile/appicon/img/yhkj_10.png"></image>
            </view>
            <!-- <view v-if="IsLoginUser && tapindex != 2 && !item.story_enable" class="rmtz_box_content_box_sc" :data-id="item.story_id">
              <label>待审核</label>
            </view> -->
          </view>
        </view>

        <block v-if="!item.story_title">
          <span style="color: gray">
            {{ __('帖子已经删除') }}
          </span>
        </block>
      </view>
<!-- 
      <view class="m-loading-box">
        <block v-if="ispage">
          <view class="u-loadmore">
            <label class="u-loading"></label>
            <text class="u-loadmore-tips">{{ __('正在加载') }}</text>
          </view>
          <view>
            <text></text>
            <canvas />
          </view>
        </block>
        <block v-else>
          <view class="u-loadmore u-loadmore-line">
            <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
          </view>
        </block>
      </view> -->
      <!-- 帖子 -->
    </scroll-view>

    <view :class="[animation ? '' : 'zhezhaoceng']">
      <movable-area class="movableArea">
        <movable-view class="movableView" @touchmove.stop.prevent="doNothing" direction="all" :x="initX" :y="initY">
          <view class="u-top" v-if="isnav">
            <!-- <image @click="nav" class="quicknav" src="https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_icon_nav.png"></image> -->
            <!-- <image class="quicknav" src="https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_post.png" @click="onPostStory"></image> -->
  <!--          <view class="quicknav1" v-if="tapindex == 0 && isPosting" @click="onPostStory">
              <image style="width: 40rpx;height: 40rpx;" src="https://qnsp.zcskjy.com/zc_images/findTools/editLable.png"></image>
              <view>发帖</view>
            </view> -->
            <image @click="returnTop" :class="'quicknav ' + (isquicknav ? '' : 'hide')" src="https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_gotop.png"></image>
          </view>
          <view @click="outnav" v-else>
            <view class="u-top1">
              <navigator :class="animation ? 'navtext1' : 'navtext'" open-type="switchTab" url="/pages/index/image">
                <text>{{ __('社区首页') }}</text>
                <image class="quicknav" src="https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_comnityhome.png"></image>
              </navigator>
              <button :class="animation ? 'navtext1' : 'navtext'" open-type="share" style="padding: 0; background: none; width: none">
                <text>{{ __('分享') }}</text>
                <image class="quicknav" src="https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_share.png"></image>
              </button>
              <navigator :class="animation ? 'navtext1' : 'navtext'" url="/community/community/userspace">
                <text>{{ __('我的帖子') }}</text>
                <image class="quicknav" src="https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_my_post.png"></image>
              </navigator>
              <navigator :class="animation ? 'navtext1' : 'navtext'" open-type="switchTab" url="../../pages/index/index">
                <text>{{ __('商城首页') }}</text>
                <image class="quicknav" src="https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_home.png"></image>
              </navigator>
              <view class="navtext">
                <image class="quicknav" src="https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_icon_close.png"></image>
              </view>
              <navigator class="navtext" url="/community/community/post">
                <image class="quicknav" src="https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_post.png"></image>
              </navigator>
            </view>
          </view>
        </movable-view>
      </movable-area>
    </view>
		
<!-- 	<view style="z-index: 999;">
		<priceBottom  @priceClick="priceClick" :totalOrderStatus="totalOrderStatus"
			:totalDiscountPrice="totalDiscountPrice" :totalOriginalPrice="totalOriginalPrice"
			:buttonList="buttonList"></priceBottom>
	</view> -->
	<shareGApp :shareDataDefault="shareData" ref="shareGApp" />
  </view>
</template>

<script>
import shortVideo from '../../components/short-video/index.vue'
import list from './list.vue';
import diy from '../../components/themes/diy.vue';
import dateUtil from "../../helpers/util_date";
import teacherCourses from "../../components/community/teacherCourses.vue";
import ahomeview from "../../components/add-new/ahome-view.vue";
import { mapState, mapMutations } from 'vuex';
import policyDecision from "../../components/community/policyDecision.vue";
import shareGApp from '@/components/share-g-app';
import priceBottom from '../../findTools/components/priceBottom';
import noData from '@/components/no-data/index.vue';
import liveLists from './live-lists.vue';
import messageCenter from '@/components/messageTip.vue';
export default {
  name: "userspace",
  components: {
    diy,
    shortVideo,
    list,
    dateUtil,
    teacherCourses,
    ahomeview,
    policyDecision,
	shareGApp,
	priceBottom,
	noData,
	liveLists,
	messageCenter
  },
  data: function () {
    return {
      showVideo:false,
      shareIcon:'',
      tabList: [
        {
          name: '动态',
        },
        {
          name: '视频',
        },
        {
          name: '直播',
        },
        {
          name: '课程',
        },
        {
          name: '决策',
        },
      ],
      teacherList: {},
      lableList: [],
      options: null,
      uid: 0,
      tapindex: 0,
      UserInfo: [],
      page: 1,
      ispage: !0,
      flag: !0,
      PostsList: [],
      scrollTop: 0,
      scposition: -1,
      oldscposition: 0,
      isquicknav: !1,
      opacity: 0,
      background: 'f1f1f1',
      user_sign: '',
      screenHeight: 0,
      IsLoginUser: !1,
      xgqy: 1,
      isdata: !1,
      isnav: !0,
      animation: !0,
      initX: '690',
      initY: '1336',
      timer: null,
      videoUrlList: '',
      shareData: {},
	  email: `${getApp().globalData.qnUrl}/zc_images/community/email.png` + this.$FT.versionKey(),
	  love: `${getApp().globalData.qnUrl}/zc_images/findTools/love.png` + this.$FT.versionKey(),
	  emailWhite: `${getApp().globalData.qnUrl}/zc_images/community/email-white.png` + this.$FT.versionKey(),
	  WXshare:`${getApp().globalData.qnUrl}/zc_images/WXshare.jpg` + this.$FT.versionKey(),
	  spaceBg:`${getApp().globalData.qnUrl}/zc_images/images/spaceBg.png`+ this.$FT.versionKey(),
	  navbarColor:'#ffffff',
	  navbarRgba:'rgba(255, 255, 255,0)',
	  navbartitle:'',
	  iconV:`${getApp().globalData.qnUrl}/zc_images/community/icon_v.png`+ this.$FT.versionKey(),
	  totalOrderStatus: true,
	  totalDiscountPrice: '--',
	  totalOriginalPrice: '',
	  productId: '',
	  itemId: '',
	  buttonList: [{
			text: '开通私人定制',
		}],
	  lectureList:[],
	  isPosting:false,// 是否可以发帖
	  isChat:false,// 是否可以私信
	  isOpenMore:false
    };
  },
  computed: {
  	...  mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin','refreUserspace']),
  },
  created() {
	this.initShareBox();
	// this.getLecturerList();
	// this.getFriendsInfo();
   },
  mounted () {
    let view = uni.createSelectorQuery().in(this).select('.movableArea');
    let that = this;

    view
      .fields(
        {
          size: true,
          scrollOffset: true,
        },
        (data) => {
          if (data) {
            that.setData({
              initX: data.width,
              initY: data.height - 100,
            });
          }
        },
      )
      .exec();
  },
  onLoad: function (options) {
	  if(this.userInfo.user_id == options.uid ){
		  this.isPosting = true;
	  }else{
		  this.isPosting = false;
	  }
	  this.options = options;
	  let that = this;
      this.init(options);
	  
  },
  // mounted(){
  //   this.getTeacherInfo()
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  let that = this;
    // this.initSpace();
	// uni.addInterceptor('navigateBack', {
	// 	//监听返回
	// 	success(e) {
	// 		console.log("监听返回",options)
	// 		var pages = getCurrentPages(); //获取所有页面的数组对象
	// 		var currPage = pages[pages.length - 1]; //当前页面
	// 		console.log("监听返回-currPage",currPage)
	// 		uni.redirectTo({
	// 			url: currPage.route
	// 		})
	// 	}
	// })

	if (that.refreUserspace) {
		console.log("--------刷新动态",that.refreUserspace)
	  	that.$store.commit('updateRefreUserspace',false);
		that.page = 1;
		that.$FT.clearArr(that.PostsList);
	    // that.init(that.options);
		that.initSpace();
	  
	}
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 离开页面，注销事件
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.ShareTitle,
      imageUrl: this.ShareImg,
      path: '/pages/index/index?uid=' + this.userInfo.user_id,
    };
  },

  /**
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function () { },
  methods: {
    ...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo','updateRefreUserspace']),
    showShortVideo(val){
    this.showVideo = val
  },
	async init(options){
		await this.getTeacherInfo(this.options.uid)

		console.log('----------', this.options.uid);
		uni.setNavigationBarTitle({
		  title: this.__('大咖主页'),
		});
		//  #ifdef  APP-PLUS
		this.shareIcon = 'share-square';
		//  #endif
		var that = this;
		
		that.$.getSystemInfo({
		  success: function (a) {
		    that.setData({ screenHeight: a.screenHeight });
		  },
		});
		
		that.setData({
		  uid: that.options.uid || that.userInfo.user_id,
		  // uid: that.userInfo.user_id || options.uid,
		  videoUrlList: this.Config.URL.newsUrl.videolist,
		});
		this.uid == that.userInfo.user_id && that.setData({ IsLoginUser: !0 });
		
		//如果没有用户id，且未登录
		if (that.$.isUndefined(that.uid)) {
		  that.forceUserInfo(function (user) {
		    that.setData({
		      uid: user.user_id,
		      IsLoginUser: !0,
		    });
		

		  });
		}
		this.initSpace();
	},
	async initSpace(){
		let that = this;
		await that.GetUserSpace();
		await that.GetMemberPostsByUserId();
	},
	reload(options) {
	        // 页面重载
			console.log("页面重载")
	        const pages = getCurrentPages()
	        // 声明一个pages使用getCurrentPages方法
	        const curPage = pages[pages.length - 1]
	        // 声明一个当前页面
	        curPage.onLoad(options) // 传入参数
	        curPage.onShow()
	        curPage.onReady()
	        // 执行刷新
	},
    navBack () {
		// let pages = getCurrentPages(); //获取所有页面栈实例列表
		// let nowPage = pages[pages.length - 1]; //当前页页面实例
		// let prevPage = pages[pages.length - 2]; //上一页页面实例
		// prevPage.$vm.detailList.receive = item; //修改上一页data里面的地址
		// console.log("prevPage",prevPage)
      //  console.log('盘中宝-back');
      //  #ifdef  APP-PLUS
      uni.navigateBack();
      //  #endif

      //  #ifdef  H5
      history.back();
      //  #endif
    },
	
	priceClick(text) {
		const that = this;
		if (!this.hasLogin) {
			uni.navigateTo({
				url: '/pages/login/login',
			});
			return;
		}
		uni.navigateTo({
			url: '/edu/order/checkout?cart_id=' + that.itemId + '|' + 1,
		});
		
		//这一步直接跳立即购买checkout页面
	},
	initShareBox(){
		let that = this;
		let $href = that.$.sprintf(`/h5/community/community/userspace?uid=${that.options.uid}`);
		
		// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
		// #ifdef APP-PLUS
		$href = that.$.sprintf(`/h5/community/community/userspace?uid=${that.options.uid}`);
		// #endif
		// #ifdef MP-WEIXIN
		$href = `/h5/community/community/userspace?uid=${that.options.uid}`;
		// #endif
		that.setData({
		  shareData: {
		    shareTitle: '我在长乘学堂发现一个大咖，观点独到，快来看看吧！',
		    shareText: '免费看视频，学习理财知识',
		    href: $href,
		    image: that.WXshare,
		  },
		});
		console.log('分享入参：', that.shareData);
	},
    onShareBox () {

	  // #ifndef  MP-WEIXIN
	  this.$refs.shareGApp.show();
	  // #endif
    },
	
    getTeacherInfo (uid) {
      let params = {
        teacherId: uid
      }
      uni.request({
        url: this.Config.circleTeacher,
        methods: 'GET',
        data: params,
        dataType: 'json',
        success: (res) => {
          let teacherLabel = res.data.result.teacherLabel;
          // console.log('getTeacherInfo--res', res);
          this.teacherList = res.data.result;
          // console.log('teacherLabel', teacherLabel);
          if (teacherLabel != null && teacherLabel != '' && teacherLabel != undefined) {
            this.lableList = teacherLabel.split('，')
          } else {
            this.lableList = [];
          }

          // console.log('res.data.result.teacherLabel', this.lableList);

        }
      })
    },
    getSystemInf () {
      // 获取手机系统信息
      const info = uni.getSystemInfoSync();
      // 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
      this.statusBarHeight = info.statusBarHeight;
      // 除了h5 app mp-alipay的情况下执行
      // #ifndef H5 || APP-PLUS || MP-ALIPAY
      // 获取胶囊的位置
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
      // (胶囊底部高度 - 状态栏的高度) + (胶囊顶部高度 - 状态栏内的高度) = 导航栏的高度
      this.navBarHeight = menuButtonInfo.bottom - info.statusBarHeight + (menuButtonInfo.top - info.statusBarHeight);

      // #endif
    },
    // 点击切换tab
    cliTab (item) {
      console.log('点击切换tab', item);
      let index = item.index;
      this.tapindex = index;
	  this.page = 1;
      if (index == 0) {
        this.tiezi();
      } else if (index == 1) {
        this.tabVideo();
      } else if (index == 2) {
        this.tabLive();
      } else if (index == 2) {
        this.tabCurriculum();
      } else if (index == 3) {
        this.tabPolicy();
      }

    },
    getPostsList: function () {
      let that = this;
      var params = { page: this.page };

      that.$.request({
        url: this.Config.URL.sns.story_lists,
		loading: false,
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
              });
            } else {
              that.setData({
                PostsList: that.PostsList.concat(data.items),
                flag: !0,
                ispage: !0,
              });
            }
          } else {
            that.setData({ flag: !1, ispage: !1 });
          }

          that.$.stopPullDownRefresh();
          that.$.hideLoading();
        },
      });
    },

    editSign: function () {
      var that = this,
        params = {
          UserId: that.userInfo.user_id,
          OperateId: that.cf.storeId,
          user_sign: this.user_sign,
        };

      that.$.request({
        url: this.Config.URL.account.edit_user_sign,
		loading: false,
        data: params,
        success: function (data, status, msg, code) {
          that.setData({ xgqy: !0 }), that.GetUserSpace();
        },
      });
    },
	certificate: function (id) {
	  let that = this;
	  that.$.request({
	  	url: that.Config.URL.account.certificate.replace(/typ=e/, "typ=json"),
		loading: false,
	  	data: {},
	  	success: function(data, status, msg, code) {
	  		console.log('---实名验证ss----',data, status, msg, code, that.options);
	  		if (status == 200) {
	  			
				if(data.user_certification  !== 1){
					that.__("请先实名后评论")
				    that.$.navigateTo({ url: "/my/setting/certification" })
				}else{
					uni.navigateTo({
						// url: `/community/community/detail?id=${id}`
						url: '/community/community/detail?id=' + id + '&uid=' + that.options.uid
						// url: '/pages/setSeal/index?seal=' + encodeURIComponent(JSON.stringify(seal)) + '&cStorageModel' + encodeURIComponent(JSON.stringify(cStorageModel)) 
					})
				}
	  		} else {
	  		}
	  	},
	  })
	},
	navDetailVideo(id,storyEnable){
		if(storyEnable){
			uni.navigateTo({
				url: '/community/community/video?id=' + id + '&uid=' + this.options.uid
			})
		}else{
			 uni.showModal({
				title: this.__('提示'),
				content:  this.__("请审核成功后预览"),
				showCancel:false,
				confirmColor:'#F43D3E',
				success: (res) => {
					
				}
			})
		}
	},
	navDetail(id,storyEnable){
	uni.navigateTo({
		url: '/community/community/detail?id=' + id + '&uid=' + this.options.uid
	})
		
	},
    DeleteMemberPosts: function (a) {
      var that = this;
      if (0 == that.tapindex) {
        var params = { story_id: a.currentTarget.dataset.id };
        that.$.confirm(
          that.__('是否删除帖子?'),
          function (a) {
            if (a.confirm) {
              that.$.request({
                url: that.Config.URL.sns.story_remove,
                data: params,
				loading: false,
                success: function (data, status, msg, code) {
					console.log("删除帖子",data)
                  if (200 == status) {
                    // that.setData({ PostsList: [] });
                    that.GetUserSpace();
                    that.GetMemberPostsByUserId();
                  } else {
                  }
                },
              });
            }
          },
          !0,
        );
      } else {
        params = {
          userId: that.userInfo.user_id,
          story_id: a.currentTarget.dataset.id,
          operateId: that.cf.storeId,
        };

        that.$.confirm(
          that.__('是否取消收藏帖子?'),
          function (a) {
            if (a.confirm) {
              that.$.request({
                url: that.Config.URL.sns.story_collection_remove,
                data: params,
				loading: false,
                success: function (data, status, msg, code) {
                  console.log("删除-success：", data, status, msg, code)
                  if (200 == status) {
                    that.setData({ PostsList: [] });
                    that.GetUserSpace();
                    that.loaddata();
                  } else {
                    // that.$.alert(msg);
                  }
                },
                fail: function (ata, status, msg, code) {
                  console.log("删除-fail：", msg)
                }
              });
            }
          },
          !0,
        );
      }
    },
    onPostStory: function (a) {
      let that = this;
      console.log("onPostStory", that.userInfo.user_id)
      that.forceUserInfo(function (user) {
        that.$.navigateTo({ url: '/community/community/post?uid=' + that.uid });
      });
    },
    GetUserSpace: function () {
      var that = this,
        params = {
          UserId: that.userInfo.user_id,
          user_id: that.uid,
          operateId: that.cf.storeId,
        };

      that.$.request({
        url: this.Config.URL.sns.user_space,
        data: params,
		loading: false,
        success: function (data, status, msg, code) {
			// console.log("获取关注情况-user_space",data)
          that.setData({ UserInfo: data, user_sign: data.user_sign });
        },
      });
    },
	
	getFriendsInfo: function () {
	  var that = this,
	    params = {
	      UserId: that.userInfo.user_id,
	      user_id: that.uid,
	      operateId: that.cf.storeId,
	    };
	
	  that.$.request({
	    url: this.Config.URL.sns.getFriendsInfo,
		loading: false,
	    // data: params,
	    success: function (data, status, msg, code) {
			console.log("关注列表",data);
			if(data.friend[0].list.length == 0 ) return;
			that.isChat = true;
			console.log("关注列表-1111111",data.friend[0].list.length,	that.isChat);
	    },
	  });
	},
	contains(arr, val) {
	    return arr.some(item => item.teacherId == val);
	},
	getLecturerList() {
		var that = this;
		uni.request({
			url: that.Config.teacherListDate,
			methods:'GET',
			loading: false,
			success: function(res) {
				console.log("getLecturerList",res)
				that.lectureList  = res?.data?.result;
				
			
				
			},
			fail: () => {},
			complete: () => {
				this.isPosting = this.contains(this.lectureList,this.userInfo.user_id);
				console.log("是否发帖",this.isPosting,this.lectureList);
			},
		});
	},
	
    GetMemberPostsByUserId: function () {
		/* story_privacy:动态权限 ：
		0:所有人
		1:好友可见
		2:仅自己可见
		*/
      var that = this,
        params = { 	
			user_id: that.uid,  
			page: that.page, 
			sidx: 'story_time', 
			sord: 'DESC' ,
		};
      1 == that.page && that.setData({ PostsList: [] });

      that.$.request({
        url: this.Config.URL.sns.user_story,
        data: params,
		loading: false,
        success: function (data, status, msg, code) {
          // console.log('22222222222222列表', data);
          if (data.items.length > 0) {
            for (var r = 0; r < data.items.length; r++) {
              data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data.items[r]['story_time']));
            }

            if (data.page >= data.total) {
              that.setData({
                PostsList: that.PostsList.concat(data.items),
                flag: !1,
                ispage: !1,
                isdata: !1,
              });
            } else {
              that.setData({
                PostsList: that.PostsList.concat(data.items),
                flag: !0,
                ispage: !0,
                isdata: !1,
              });
            }
          } else {
            that.setData({
              flag: !1,
              ispage: !1,
              isdata: !1,
            });
          }
        },
      });
    },
    GetCommentPostsByUserId: function () {
      var that = this;
      let params = { user_id: that.uid, page: that.page };
      1 == that.page && that.setData({ PostsList: [] });

      that.$.request({
        url: this.Config.URL.sns.user_comment_story,
        data: params,
		loading: false,
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
                isdata: !1,
              });
            } else {
              that.setData({
                PostsList: that.PostsList.concat(data.items),
                flag: !0,
                ispage: !0,
                isdata: !1,
              });
            }
          } else {
            that.setData({
              flag: !1,
              ispage: !1,
              isdata: !1,
            });
          }
        },
      });
    },
    xiugaiqianming: function () {
      var a = this;

      if (a.userInfo.user_id == a.uid) {
        0 == a.xgqy ? a.setData({ xgqy: !0, focus: !1 }) : a.setData({ xgqy: !1, focus: !0 });
      } else {
      }
    },
    GetCollectionPostsByUserId: function () {
      var that = this;
      let params = { user_id: that.uid, page: that.page };
      1 == that.page && that.setData({ PostsList: [] });

      that.$.request({
        url: this.Config.URL.sns.user_collect_story,
        data: params,
		loading: false,
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
                isdata: !1,
              });
            } else {
              that.setData({
                PostsList: that.PostsList.concat(data.items),
                flag: !0,
                ispage: !0,
                isdata: !1,
              });
            }
          } else {
            that.setData({
              flag: !1,
              ispage: !1,
              isdata: !1,
            });
          }
        },
      });
    },
    GetVideoByUserId () {

    },
    GetLiveByUserId () {

    },
    GetCurriculumByUserId () { },
    GetPolicyByUserId () { },
    tiezi: function () {
      0 != this.tapindex && (this.setData({ tapindex: 0, page: 0 }), this.GetMemberPostsByUserId());

    },
    tabVideo: function () {
      // 1 != this.tapindex && (this.setData({ tapindex: 1, page: 1 }), this.GetVideoByUserId());

    },
    tabLive: function () {
      // 2 != this.tapindex && (this.setData({tapindex: 2, page: 2}), this.GetLiveByUserId())

    },
    tabCurriculum: function () {
      // 3 != this.tapindex && (this.setData({tapindex: 3, page: 3}), this.GetCurriculumByUserId())

    },
    tabPolicy: function () {
      // 4 != this.tapindex && (this.setData({tapindex: 4, page: 4}), this.GetPolicyByUserId())
    },
    pinglun: function () {
      2 != this.tapindex && (this.setData({ tapindex: 2, page: 1 }), this.GetCommentPostsByUserId());
    },
    shoucang: function () {
      3 != this.tapindex && (this.setData({ tapindex: 3, page: 1 }), this.GetCollectionPostsByUserId());
    },

    loaddata: function () {
      1 == this.tapindex ? this.GetMemberPostsByUserId() : 2 == this.tapindex ? this.GetCommentPostsByUserId() : this.GetCollectionPostsByUserId();
    },

    guanzhu: function () {
      wx.navigateTo({ url: '../attention/attention?id=' + this.UserInfo.user_id + '' });
    },
    fensi: function () {
      wx.navigateTo({ url: '../fans/fans?id=' + this.UserInfo.user_id + '' });
    },

    onFollow: function (a) {
      let that = this;
      that.forceUserInfo(function (user) {
        that.AddFollow(that.uid);
      });
    },
    AddFollow: function (friend_id) {
      var that = this,
        params = {
          /*user_id: that.userInfo.user_id,
        OperateId: that.shopInfo.store_id,*/
          friend_id: friend_id,
        };

      that.$.request({
        url: this.Config.URL.user.friend_agree,
        data: params,
		loading: false,
        success: function (data, status, msg, code) {
          if (200 == status) {
            that.$.showToast({ title: that.__('关注成功'), icon: 'success', duration: 2e3 }), clearTimeout(t);
            var t = setTimeout(function () {
              that.GetUserSpace();
            }, 1500);
          } else {
          }
        },
      });
    },
    onUnFollow: function (a) {
      let that = this;
      that.forceUserInfo(function (user) {
        that.cancelFollow(that.uid);
      });
    },
    cancelFollow: function (friend_id) {
      var that = this;
      that.$.confirm(
        that.__('是否取消关注?'),
        function (a) {
          if (a.confirm) {
            var params = {
              friend_id: friend_id,
            };

            that.$.request({
              url: that.Config.URL.user.friend_refuse,
              data: params,
			  loading: false,
              success: function (data, status, msg, code) {
                if (200 == status) {
                  that.$.showToast({ title: that.__('取消关注成功'), icon: 'success', duration: 2e3 }), clearTimeout(t);
                  var t = setTimeout(function () {
                    that.GetUserSpace();
                  }, 1500);
                } else {
                }
              },
            });
          }
        },
        !0,
      );
    },

    onLike: function (item,i) {
      let that = this;
	 console.log("onLike",item.story_like_count,item.story_id, that.PostsList[i].story_like_count)

      that.forceUserInfo(function (user) {
        that.dianzan(item.story_id,i);
      });
    },
    dianzan: function (story_id,i) {
      var that = this,
        params = {
          story_id: story_id,
        };

      that.$.request({
        url: this.Config.URL.sns.story_like_add,
        data: params,
		loading: false,
        success: function (data, status, msg, code) {
          if (200 == status) {
			console.log("点赞：s",data)
		  // that.GetUserSpace();
		  // that.GetMemberPostsByUserId();
			that.PostsList[i].story_like_count +=1;
            //修正当前记录数据
            for (var r = 0; r < that.PostsList.length; r++) {
              if (story_id == that.PostsList[r]['story_id']) {
                that.PostsList[r]['IsFabulous'] += 1;
              }
            }
          } else {
          }
        },
      });
    },
    onUnLike: function (item,i) {
      let that = this;
	  console.log("onLike",item.story_like_count,item.story_id, that.PostsList[i].story_like_count)

      that.forceUserInfo(function (user) {
        that.canceldianzan(item.story_id,i);
      });
    },
    canceldianzan: function (story_id,i) {
      var that = this,
        params = {
          story_id: story_id,
        };

      that.$.request({
        url: this.Config.URL.sns.story_like_remove,
        data: params,
		loading: false,
        success: function (data, status, msg, code) {
			console.log("取消点赞：s",data)
		  // that.GetUserSpace();
		  // that.GetMemberPostsByUserId();
          if (200 == status) {
            //修正当前记录数据
				that.PostsList[i].story_like_count -=1;
            for (var r = 0; r < that.PostsList.length; r++) {
              if (story_id == that.PostsList[r]['story_id']) {
                that.PostsList[r]['IsFabulous'] = 0;
              }
            }
          } else {
          }
        },
      });
    },

    scroll: function (t) {
      let that = this;

      that.setData({ oldscposition: t.detail.scrollTop });

      if (100 < t.detail.scrollTop) {
        that.setData({
          opacity: 1,
          background: 'f8f8f8',
		  navbarColor:null,
		  navbarRgba:'rgba(255, 255, 255,1)',
		  navbartitle:'大咖主页',
        });

      } else {
        that.setData({
          opacity: 0,
          background: 'fff',
		  navbarColor:'#ffffff',
		  navbarRgba:'rgba(255, 255, 255,0)',
		  navbartitle:'',
        });
      }
      if (t.detail.scrollTop >= this.screenHeight) {
        this.setData({ isquicknav: !0 });
      } else {
        this.setData({ isquicknav: !1 });
      }
    },
    scrollbottom: function (a) {
      var t = this;
      if (this.flag) {
        this.setData({ flag: !1 }), clearTimeout(e);
        var e = setTimeout(function () {
          t.setData({ page: parseInt(t.page) + 1 }), t.loaddata();
        }, 100);
      }
      t.page++;
      if(this.tapindex == 0){
        t.GetMemberPostsByUserId()
      }else if(this.tapindex == 1){
        if(this.$refs.shortVideo.page < this.$refs.shortVideo.totalPage){
          this.$refs.shortVideo.pageNum++
          this.$refs.shortVideo.getShortVideo()
        }
      }else if(this.tapindex == 2){
		    t.$refs.liveLists.getTeacherLiveList(t.page);  
		}
		else if(this.tapindex == 3){
			t.$refs.teacherCourses.getCourseList(t.page);  
		}
	
    },
    returnTop: function () {
      let that = this;
      // 清除上一次的定时器
      if (that.timer !== null) {
        clearInterval(that.timer);
      }
      that.scrollTop = that.oldscposition;

      that.timer = setInterval(function () {
        let speed = that.scrollTop / 4;
        speed = Math.ceil(speed);
        if (that.scrollTop <= 0 || !that.scrollTop) {
          clearInterval(that.timer);
        }
        that.scrollTop = that.scrollTop - speed;
      }, 30);
      this.setData({ isquicknav: !1 });
    },
    nav: function () {
      this.setData({ isnav: !1, animation: !1 });
    },
    tochat (id) {
      uni.navigateTo({
        url: "/im/chat/chat?uid=" + this.options.uid || this.userInfo.user_id,
      })
    },
    outnav: function () {
      var a = this;
      this.setData({ animation: !0 }),
        setTimeout(function () {
          a.setData({ isnav: !0 });
        }, 400);
    },
	handleError(e){
		console.log("图片加载失败",e)
		this.teacherList.portraitUrl="https://qnsp.zcskjy.com/zc_images/WXshare.jpg"
	},
	message() {
		console.log('消息中心');
		uni.navigateTo({
			url: '/member/member/message',
		});
	},
	openMore: function () { 
		this.isOpenMore = true;
	},
    doNothing: function () { },
  },
};
</script>

<style lang="scss">
@import "../../styles/_variables";

@import "../../styles/layout.scss";
@import "../../styles/circle.scss";

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
  position: absolute;
  top: -53rpx;
  left: 33rpx;
  // margin-top: 0rpx;
  // height: 160rpx;
  // text-align: center;
  // left: 15%;
  // z-index: 3;
  // color: #fff;
}

.m-user-info image {
  width: 146rpx;
  height: 146rpx;
  border-radius: 130rpx;
  border: 1px solid #fff;
  vertical-align: middle;
  box-shadow: 0px 2rpx 15rpx rgba(0, 0, 0, 0.35);
}

.m-user-info text {
  line-height: 70rpx;
  display: block;
  font-size: 32rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
  top: 42rpx;
  left: 188rpx;
}
.m-user-info .iconV{
	width: 50rpx;
	height: 50rpx;
	position: absolute;
	bottom: 0;
	right: 0;
	border: 0;
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
  // -webkit-animation: imageAnimation 15s linear infinite alternate;
  // animation: imageAnimation 15s linear infinite alternate;
  webkit-backface-visibility: hidden;
  -webkit-filter: blur(5px);
  filter: blur(5px);
  margin-top: -20px;
}

.m-animate-warp {
  overflow: hidden;
  height: 370rpx;
  width: 100%;

  // background: url("https://qnsp.zcskjy.com/zc_images/images/spaceBg.png");
  // background-position: center;
  // background-repeat: no-repeat;
  // -webkit-animation: imageAnimation 15s linear infinite alternate;
  // animation: imageAnimation 15s linear infinite alternate;
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
  // width: 520rpx;
  // float: left;
  margin-left: 94upx;
}

.rmtz_box_content_img {
  width: 315rpx;
  height: 420rpx;
  float: right;
   border-radius: 12rpx;
}
.rmtz_box_content_box {
  background-color: #fff;
  padding: 0 23rpx;
  padding-bottom: 13rpx;
  // height: 171rpx;
  position: relative;
  border-bottom: 1rpx solid #F5F5F5;
  margin-bottom: 40rpx;
  // margin-left: 121upx;
  // display: flex;
}

.rmtz_box_content_box_text {
  width: 506rpx;
 font-size: 36rpx;
 font-family: PingFangSC-Medium, PingFang SC;
 font-weight: 500;
 color: #333333;
  // float: left;
  // height: 101rpx;
}
.rmtz_box_content_box_content {
  font-size: 28upx;
  font-weight: 400;
  color: #666666;
  margin-bottom: 16rpx;
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

// .text-over2::after {
//   content: " ";
//   position: absolute;
//   left: 30rpx;
//   top: 168rpx;
//   right: 0rpx;
//   height: 1px;
//   border-top: 1px solid red;
//   color: #d9d9d9;
//   -webkit-transform-origin: 0 0;
//   transform-origin: 0 0;
//   -webkit-transform: scaleY(0.5);
//   transform: scaleY(0.5);
// }

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

// .pldz_box::before {
//   content: " ";
//   position: absolute;
//   left: 30rpx;
//   top: 219rpx;
//   right: 0rpx;
//   height: 1px;
//   border-top: 1px solid #d9d9d9;
//   color: #d9d9d9;
//   -webkit-transform-origin: 0 0;
//   transform-origin: 0 0;
//   -webkit-transform: scaleY(0.5);
//   transform: scaleY(0.5);
// }

.pldz_box {
  // float: left;
  color: #828282;
  font-size: 28rpx;
  height: 32rpx;
  position: relative;
  display: inline-flex;
  align-items: center;
  padding-top: 32rpx;
  width: 100%;
  .pldz_item{
	width: 25%;
	background: transparent;
  }
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
  background: #ffffff;
}

@keyframes mymove1 {
  from {
    bottom: 120rpx;
    opacity: 0;
  }
  to {
    bottom: 520rpx;
    opacity: 1;
  }
}

@keyframes mymove2 {
  from {
    bottom: 120rpx;
    opacity: 0;
  }
  to {
    bottom: 420rpx;
    opacity: 1;
  }
}

@keyframes mymove3 {
  from {
    bottom: 120rpx;
    opacity: 0;
  }
  to {
    bottom: 320rpx;
    opacity: 1;
  }
}

@keyframes mymove4 {
  from {
    bottom: 120rpx;
    opacity: 0;
  }
  to {
    bottom: 220rpx;
    opacity: 1;
  }
}

@keyframes mymove5 {
  from {
    bottom: 520rpx;
    opacity: 1;
  }
  to {
    bottom: 110rpx;
  }
}

@keyframes mymove6 {
  from {
    bottom: 420rpx;
    opacity: 1;
  }
  to {
    bottom: 110rpx;
    opacity: 0;
  }
}

@keyframes mymove7 {
  from {
    bottom: 320rpx;
    opacity: 1;
  }
  to {
    bottom: 110rpx;
    opacity: 0;
  }
}

@keyframes mymove8 {
  from {
    bottom: 220rpx;
    opacity: 1;
  }
  to {
    bottom: 110rpx;
    opacity: 0;
  }
}
.box_title_img {
  width: 75upx;
  height: 75upx;
  padding: 0 17upx 15upx 0upx;
  float: left;
  display: inline-block;
}
.box_title_image {
  width: 73upx;
  height: 73upx;
  border-radius: 100%;
  overflow: hidden;
}
.box_title_name {
  font-size: 30upx;
  font-weight: 500;
  color: #333333;
}
.box_title_name_time {
  // position: absolute;
  // top: 41upx;
  // left: 93upx;
  // min-width: 200upx;
  // line-height: 95upx;
  /* float: left; */
  color: #959593;
  font-size: 22upx;
  font-weight: 400;
  color: #999999;
}
.examine {
  width: 100upx;
  height: 100upx;
  margin-top: 19upx;
  margin-right: 25upx;
}

</style>
<style lang="scss" scoped>
@import "@/styles/community/userspace.scss";

</style>
