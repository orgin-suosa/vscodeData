<template>
  <view class="content home-content">
    <uni-nav-bar>
      <view class="search">
        <!--      <template>
		    <input maxlength="20" type="text" value="" confirm-type="search" @confirm="searchStart()" :placeholder="__('请输入关键词搜索')" v-model.trim="searchText" />
		  </template> -->
        <view>
          <!-- #ifdef APP-PLUS-->

          <view class="search-seat"></view>
          <!-- #endif -->
          <image src="https://qnsp.zcskjy.com/zc_images/home/icon-home-1.png" mode="aspectFit" class="search-icon"></image>
          <view class="searchNavigate" @click="searchStart()"></view>
        </view>
        <image v-if="searchText.length > 0" src="https://qnsp.zcskjy.com/zc_images/images/false.png" mode="widthFix" @click="clearSearch()" class="clear-icon"></image>

        <image :class="{ newMessage: isNewMessaaage }" src="https://qnsp.zcskjy.com/zc_images/home/icon-home-7.png" mode="widthFix" @click="message()" class="message-icon"></image>
        <image src="https://qnsp.zcskjy.com/zc_images/home/icon-home-8.png" mode="widthFix" @click="customer(10001)" class="customer-icon"></image>
      </view>
    </uni-nav-bar>
    <scroll-view scroll-y="true">
      <!-- 显示区域 -->
      <!-- <view class="content-scroll liveScroll" :style="{ height: contentScrollHeight + 'px', maxHeight: contentScrollHeight + 'px' }"> -->
      <view class="content-scroll liveScroll">
        <view class="tab-live">
          <view class="list" v-for="(item, index) in navList" :key="index" v-if="tabCurrentIndex === index">
            <view class="list-live">
              <view class="list-live-content bannerList">
                <swiperImages @videoJump="videoJump" :defaultDannerList="defaultNoData" :bannerList="bannerList" :swiperConfigure="swiperConfigure"></swiperImages>
              </view>
            </view>
          </view>
          <view class="nav-curriculum">
            <view v-for="(item, index) in curriculumTypeList" :key="index" class="nav-item" :class="{ hot: index === 3 }" @click="tabcurriCulumType(index)">
              <!-- 	 <image class="nav-curriculum-image" :src="item.image" mode="widthFix"></image> -->
              <view class="nav-curriculum-image"></view>
              <text class="videoLisText">{{ item.text }}</text>
            </view>
          </view>
          <!-- 	大咖直播 -->
          <view class="uni-content">
            <view class="uni-play-history live-play-history">
              <view class="history-title">
                <text class="history-title-key">大咖直播</text>
                <text class="todayDate">更多</text>
              </view>
            </view>
            <view class="">
              <swiperLive @videoJump="videoJump" :bannerList="curriculumList" :swiperConfigure="swiperConfigure" :liveDuration="liveDuration"></swiperLive>
            </view>
            <view class="uni-play-history">
              <view class="history-title">
                <text class="history-title-key">理财智库</text>
                <text class="todayDate">更多</text>
              </view>
            </view>
            <!-- 精品课/训练营/导师课 -->
            <!-- <view class="uni-tabVideo">
            <view v-for="(item, index) in tabVideoList" :key="index" class="nav-item" :class="{ select: videoCurrentIndex === index }" @click="tabVideoClick(index)">
              <text class="videoLisText"> {{ item.text }}</text>
            </view>
          </view> -->
            <subsection
              class="layout-row"
              mode="button"
              :list="sub_selection_list"
              :bold="true"
              activeColor="#333333"
              inactiveColor="#666666"
              fontSize="28rpx"
              bgColor="#F6F7FA"
              :current="videoCurrentIndex"
              @change="changeBtnIndex"
            ></subsection>

            <!-- 显示区域 -->
            <view class="course-area" :class="{ programGuides: videoCurrentIndex === 1 }">
              <courseIntroduction :describeList="describeList" :list="courseIntroductionList" :listTitle="courseIntroductionTitle"></courseIntroduction>
              <!-- 限时秒杀 -->
              <seckill :list="seckillList" :listTitle="seckillTitle"></seckill>
              <!-- 	精彩活动 -->
              <imageList @clickNavigate="clickNavigate" :list="activityList" :listTitle="activityTitle"></imageList>
              <!--猜你喜欢 -->
              <recommend :list="recommendList" :listTitle="recommendTitle"></recommend>
              <imageList class="platform" @clickNavigate="clickNavigate" :list="qualificationsList" :listTitle="qualificationsTitle"></imageList>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import swiperImages from '../../components/swiper-images/index.vue';
import swiperLive from '../../components/swiper-images/live.vue';
import quickcompview from '../../components/asecheader-view/quickcompview';
import courseIntroduction from '../../components/home/courseIntroduction';
import seckill from '../../components/home/seckill.vue';
import imageList from '../../components/home/list.vue';
import recommend from '../../components/home/recommend.vue';
// import countdown from '../../components/home/countdown.vue';
import { mapState, mapMutations } from 'vuex';
import subsection from '@/uni_modules/uview-ui/components/u-subsection/u-subsection.vue';
var intervalCt;
export default {
  components: {
    swiperImages,
    swiperLive,
    quickcompview,
    courseIntroduction,
    seckill,
    imageList,
    recommend,
    subsection,
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  data() {
    return {
      BgConfig: { BackgroundObj: { type: 1, bgColor: '#ffffff', pathColor: '#f8f8f8', path: '' } },
      PageNav: { window: { navigationBarBackgroundColor: '#ffffff', navigationBarTextStyle: 'black', navigationBarTitleText: '', backgroundColor: '#f8f8f8', backgroundTextStyle: 'dark' } },
      rightFlag: true,
      leftWidth: '150',
      isNewMessaaage: true,
      tabCurrentIndex: 0,
      videoCurrentIndex: 1,
      tabcurriCulumIndex: 0,
      toastText: '',
      isToast: false,
      isUniToast: false,
      courseIntroductionTitle: '理财智库',
      seckillTitle: '限时秒杀',
      activityTitle: '精彩活动',
      qualificationsTitle: '平台资质',
      recommendTitle: '猜你喜欢',
      defaultNoData: [
        {
          image: `${getApp().globalData.qnUrl}/zc_images/findPage/banner0.png`,
        },
      ],
      bannerList: [], // 顶部轮播图列表
      navList: [
        {
          //state为切换内容
          //state: 0,
          text: '直播',
        },
        {
          //state为切换内容
          //state: 0,
          text: '干货',
        },
        // {
        //   //state为切换内容
        //   //state: 0,
        //   text: '工具',
        // },
      ],
      curriculumTypeIndex: 0,
      curriculumTypeList: [
        {
          text: '精品课',
          image: `${getApp().globalData.qnUrl}/zc_images/home/icon-tab1.png`,
        },
        {
          text: '训练营',
          image: `${getApp().globalData.qnUrl}/zc_images/home/icon-tab3.png`,
        },
        {
          text: '导师课',
          image: `${getApp().globalData.qnUrl}/zc_images/home/icon-tab4.png`,
        },
        {
          text: '大咖秀',
          image: `${getApp().globalData.qnUrl}/zc_images/home/icon-tab2.png`,
        },
      ],
      tabVideoList: [
        {
          text: '精品课',
        },
        {
          text: '训练营',
        },
        {
          text: '导师课',
        },
      ],
      sub_selection_list: [
        { name: '精品课', show_fg: 1 },
        { name: '训练营', show_fg: 0 },
        { name: '导师课', show_fg: 0 },
      ],
      wonderfulPlayback: [],
      playbackReverse: [],
      playbackJust: [],
      /*
	  直播状态：-1全部；0未开始；1直播中；2已结束
	  */
      playbackAreaList: [],
      describeList: [],
      courseIntroductionList: [
        // {
        // 	classSection: '30',
        // 	className: '寻找好基金',
        // 	classDescribe: '一门课带你建立基金投资体系',
        // 	days: '7',
        // 	price: '¥ 1899.10',
        // 	image: `${getApp().globalData.qnUrl}/zc_images/home/fundImage5.png`,
        // 	portrait:`${getApp().globalData.qnUrl}/zc_images/home/fundImage5.png`,
        // 	speaker:'杨如意',
        //    }
      ],
      seckillList: [
        // 	{
        // 		className: '基金投资训练营',
        // 		classDescribe: '从入门到精通的基金实操课',
        // 		days: '7',
        // 		hour:'00',
        // 		minute:'14',
        // 		second:'32',
        // 		studentsNumber: '2.57',
        // 		price: '39.9',
        // priceSpike:'1.9',
        // 		image: `${getApp().globalData.qnUrl}/zc_images/home/fundImage3.png`,
        //   },
      ],
      activityList: [
        {
          image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage6.png`,
        },
        // {
        //   image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage3.png`,
        // },
        {
          image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage7.png`,
        },
        // {
        //   image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage1.png`,
        // },
      ],
      qualificationsList: [
        {
          image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage4.png`,
        },
        {
          image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage5.png`,
        },
      ],
      recommendList: [
        // {
        //   classSection: '30',
        //   className: '寻找好基金',
        //   classDescribe: '一门课学会价值投资',
        //   days: '7',
        //   studentsNumber: '2.57',
        //   price: '¥ 1899.10',
        //   image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage8.png`,
        //   }
      ],
      /*
	  今日热播
	  state:直播状态：-1全部；0预约/未开始；1直播中；2回放/已结束
	  */
      curriculumList: [],
      viewersNumber: '7.9w',
      todayDate: '5月11日',
      toyeardayDate: '2022-05-05',
      timer: null,
      contentScrollHeight: '550rpx',
      currentbrand: 0,
      brandList: [
        {
          text: '长乘学堂',
        },
        {
          text: '淳石集团',
        },
        {
          text: '变量中国',
        },
      ],
      liveData: [],
      screenTimeStamp: '', //当前记录的时间戳
      swiperConfigure: {
        current: 0, //当前图片
        indicatorDots: false, //是否显示面板指示点
        autoplay: true, //是否自动切换
        interval: 4000, //自动切换时间间隔
        duration: 0, //滑动动画时长
        circular: true, //是否采用衔接滑动，即播放到末尾后重新回到开头
        previousMargin: '10px', //前边距
        nextMargin: '10px', //后边距
        isTitle: false,
      },
      swiperConfigure2: {
        current: 0, //当前图片
        indicatorDots: false, //是否显示面板指示点
        autoplay: true, //是否自动切换
        interval: 4000, //自动切换时间间隔
        duration: 0, //滑动动画时长
        circular: true, //是否采用衔接滑动，即播放到末尾后重新回到开头
        previousMargin: '10px', //前边距
        nextMargin: '10px', //后边距
        isTitle: true,
      },
      liveConfigure: {
        current: 0, //当前图片
        indicatorDots: true, //是否显示面板指示点
        autoplay: true, //是否自动切换
        interval: 4000, //自动切换时间间隔
        duration: 0, //滑动动画时长
        circular: true, //是否采用衔接滑动，即播放到末尾后重新回到开头
        previousMargin: '0px', //前边距
        nextMargin: '0px', //后边距
        isTitle: true,
      },
      liveDuration: 20000,
      searchText: '',
      intervalCt: '',
      days: '',
      hours: '',
      minutes: '',
      seconds: '',
    };
  },

  watch: {
    courseIntroductionList: {
      handler(newName, oldName) {
        this.courseIntroductionList = newName;
        // console.log('节目单seckillList -', newName, this.seckillList);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    seckillList: {
      handler(newName, oldName) {
        this.seckillList = newName;
        console.log('seckillList -', newName, this.seckillList);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    activityList: {
      handler(newName, oldName) {
        this.activityList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    recommendList: {
      handler(newName, oldName) {
        this.recommendList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    qualificationsList: {
      handler(newName, oldName) {
        this.qualificationsList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  onLoad() {
    console.info('home-版本0.1.1');
    this.getTodayDate();
    this.getDateWeek();
    // this.contentScroll();
    if (this.timer) {
      //注销定时器
      console.log('注销定时器');
      clearTimeout(this.timer);
      this.timer = null;
    }
    const data = {
      tag: '',
      riqi: '', // this.toyeardayDate,
      alive_state: -1,
      page_num: 1,
      page_size: 10,
      rank_type: 0,
    };
    this.getList(data);
    this.init();
  },
  onUnload() {
    clearInterval(intervalCt);
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'setCartNum']),
    async init() {
      const that = this;
      // 理财智库
      const data = {
        /**
				* 平台商品分类   category_id: 固定 2025
				  教育商品类型   kind_id:  value = "订单种类(ENUM): 1201-实物 ; 1202-虚拟  ; 1203-电子卡券  ; 1204-外卖订单;1005-教育"
				  商品状态 product_state_id:   value = "商品状态:1001-正常;1002-下架仓库中;1003-待审核; 1000-违规禁售"˚
				*/
        page: 1,
        rows: 10,
        //type_id	课程类型(ENUM) : 0-精品课；1-训练营；2-导师课
        type_id: that.videoCurrentIndex,
        category_id: 2025,
        kind_id: 1205,
        product_state_id: 1001,
      };
      await this.getBanner();
      await this.getCourse(data);
      await this.getGuessULike();
      await this.getSecKill();
    },
    tabcurriCulumType(index) {
      this.tabcurriCulumIndex = index;
      console.log('课程切换-index', index, index == 3);
      if (index == 3) {
        console.log('课程切换-index-22', index, index == 3);
        uni.switchTab({
          url: '/pages/findPage/index',
          success(res) {
            console.log('成功啦', res);
          },
          fail(err) {
            console.log('失败啦', err);
          },
        });
      }
    },

    changeBtnIndex(type) {
      var Lst = [];
      if (type == 0) {
        Lst = [
          { name: '精品课', show_fg: 0 },
          { name: '训练营', show_fg: 1 },
          { name: '导师课', show_fg: 0 },
        ];
      }

      if (type == 1) {
        Lst = [
          { name: '精品课', show_fg: 1 },
          { name: '训练营', show_fg: 0 },
          { name: '导师课', show_fg: 0 },
        ];
      }

      if (type == 2) {
        Lst = [
          { name: '精品课', show_fg: 1 },
          { name: '训练营', show_fg: 0 },
          { name: '导师课', show_fg: 0 },
        ];
      }

      if (type == 3) {
        Lst = [
          { name: '全部', show_fg: 1 },
          { name: '精品课', show_fg: 1 },
          { name: '训练营', show_fg: 0 },
          { name: '导师课', show_fg: 0 },
        ];
      }
      this.sub_selection_list = Lst;
      this.videoCurrentIndex = type;
      console.log('理财智库-index:', type);
      this.clearArr(this.courseIntroductionList);
      this.clearArr(this.describeList);

      // 理财智库
      const data = {
        /**
				* 平台商品分类   category_id: 固定 2025
				  教育商品类型   kind_id:  value = "订单种类(ENUM): 1201-实物 ; 1202-虚拟  ; 1203-电子卡券  ; 1204-外卖订单;1005-教育"
				  商品状态 product_state_id:   value = "商品状态:1001-正常;1002-下架仓库中;1003-待审核; 1000-违规禁售"˚
				*/
        page: 1,
        rows: 10,
        //type_id	课程类型(ENUM) : 0-精品课；1-训练营；2-导师课
        type_id: type,
        category_id: 2025,
        kind_id: 1205,
        product_state_id: 1001,
      };
      this.getCourse(data);
    },
    tabVideoClick(index) {
      this.videoCurrentIndex = index;
      console.log('理财智库-index:', index);
      this.clearArr(this.courseIntroductionList);
      // 理财智库
      const data = {
        /**
				* 平台商品分类   category_id: 固定 2025
				  教育商品类型   kind_id:  value = "订单种类(ENUM): 1201-实物 ; 1202-虚拟  ; 1203-电子卡券  ; 1204-外卖订单;1005-教育"
				  商品状态 product_state_id:   value = "商品状态:1001-正常;1002-下架仓库中;1003-待审核; 1000-违规禁售"˚
				*/
        page: 1,
        rows: 10,
        //type_id	课程类型(ENUM) : 0-精品课；1-训练营；2-导师课
        type_id: index,
        category_id: 2025,
        kind_id: 1205,
        product_state_id: 1001,
      };
      this.getCourse(data);
    },
    searchStart: function () {
      uni.navigateTo({
        url: '/home/searchPage/search',
      });
    },
    message() {
      console.log('消息中心');
      uni.navigateTo({
        url: '/member/member/message',
      });
    },
    customer(e) {
      let chat_url = this.$.sprintf('/im/chat/chat?uid=%s', e);
      uni.navigateTo({
        url: chat_url,
        success(res) {
          console.log('客服跳转-成功啦', res);
        },
        fail(err) {
          console.log('客服跳转-失败啦', err);
        },
      });
    },
    clickNavigate(i, listTitle) {
      console.log('clickNavigate', i, listTitle);
      if (listTitle == '精彩活动') {
        if (i == 1) {
          uni.navigateTo({
            url: '/home/shareEarnCommission',
          });
        }
      } else if (listTitle == '平台资质') {
        if (i == 0) {
          // 长乘资质
          console.log('clickNavigate', '长乘资质');
          uni.navigateTo({
            url: '/home/ccxy_introduce',
          });
        } else if (i == 1) {
          // 明星师资：
          uni.navigateTo({
            url: '/home/teachers_introduce',
          });
        }
      }

      // 5.长乘资质：h5/pages/home/ccxy_introduce
      // 6.明星师资：h5/pages/home/teachers_introduce
    },
    clearArr(arr) {
      arr.length = 0;
      arr.splice(0, 0);
    },
    getBanner() {
      /**
       * 获取首页banner，返回参数中 page_code 这个list是banner数据,eltType
       * 可全局搜索 that.Config.URL.index_app 查看使用
       */
      const that = this;
      var params = {
        eltmType: 7,
      };
      that.$.request({
        url: that.Config.URL.index_app,
        data: params,
        dataType: 'json',
        success: function (data, status, msg, code) {
          // console.log('获取首页banner:data, status, msg, code', data, status, msg, code);
          if (status == 200) {
            const page_code = JSON.parse(data.page_code);
            // console.log('获取首页banner-data.page_code', page_code);
            // const pageData = JSON.parse(page_code.eltm3.data);
            //   console.log('获取首页banner-data.pageData',pageData);
            // that.bannerList.push({
            //   image: data.index_pop_wap_img,
            // });
            page_code.forEach(function (item, i, array) {
              // console.log('获取首页-forEach-1111', item, i, array);
              if (parseInt(item.eltmType) != 3) return;

              // console.log('获取首页-pageData', item.eltm3.data);
              item.eltm3.data.forEach(function (item, i, array) {
                // console.log('获取首页-forEach-22222-page_code', item, i, array);
                that.bannerList.push({
                  image: item.path,
                  page_url: item.page_url,
                });
              });
            });

            // console.log('获取首页banner:that.bannerList', that.bannerList);
            // that.setData({
            // 	responseData: data,
            // 	//banner数据
            // 	PageContent: JSON.parse(data.page_code),
            // });
          }
        },
      });
    },
    // 理财智库
    getCourse(data) {
      const that = this;
      that.$.request({
        url: this.Config.URL.edu.getProductList,
        method: 'get',
        data: data,
        dataType: 'json',
        success: function (data, status, msg, code) {
          console.log('理财智库:data, status, msg, code', data, status, msg, code);
          let tagList;
          if (status == 200) {
            data.items.forEach(function (item, i, array) {
              tagList = item.product_tag_names;
              console.log('理财智库', item, i, array);
              if (i > 2) return;
              that.courseIntroductionList.push({
                classSection: item.chapter.chapterNum,
                className: item.product_name,
                classDescribe: item.product_tips,
                days: '30',
                price: item.item_unit_price,
                image: item.product_image,
                portrait: item.user_avatar,
                speaker: item.user_nickname,
              });
              console.log('理财智库-product_tag_names-111', item.product_tag_names);
              if ((tagList ?? '') == '') return;
              tagList.forEach(function (item, i, array) {
                console.log('理财智库-product_tag_names.', item, i, array);
                if (that.describeList.length > 2) return;
                that.describeList.push(item);
              });
            });
            console.log('理财智库-banner:courseIntroductionList', that.courseIntroductionList);

            // that.setData({
            // 	responseData: data,
            // 	//banner数据
            // 	PageContent: JSON.parse(data.page_code),
            // });
          }
        },
      });
    },
    // 限时秒杀
    getSecKill() {
      console.log('限时秒杀');
      const that = this;
      const params = {
        activity_type_ids: '1103',
      };
      that.$.request({
        url: that.Config.URL.store.product,
        method: 'get',
        dataType: 'json',
        data: params,
        // data: that.post,
        // ajaxCache: {
        // 	timeout: that.Config.CACHE_EXPIRE
        // },
        success: function (data, status) {
          console.log('限时秒杀:data, status', data, status);
          if (status === 200) {
            data.items.forEach(function (item, i, array) {
              console.log('限时秒杀', item, i, array);
              console.log('限时秒杀-product_sale_time', item.product_sale_time);
              let days = '00',
                hours = '00',
                minutes = '00',
                seconds = '';
              let endtime = '',
                end_diff_time = '';
              let priceSpike = item.item_color[0].item_sale_price;
              // console.log("activity_item_row", item.activity_item_row.activity_endtime)
              if (!item.activity_item_row) return;
              if (item.activity_item_row) {
                endtime = item?.activity_item_row?.activity_endtime;
                end_diff_time = new Date(endtime.replace(/-/g, '/')).getTime() - new Date().getTime();
                console.log('限时秒杀-end_diff_time-1', end_diff_time);
                const n = (end_diff_time -= 1e3);
                if (n < 0) {
                  days = '00';
                  (hours = '00'), (minutes = '00'), (seconds = '00');
                } else {
                  days: that.$.doubleNum(Math.floor(n / 1e3 / 60 / 60 / 24)),
                    (hours = that.$.doubleNum(Math.floor(n / 1e3 / 60 / 60))),
                    (minutes = that.$.doubleNum(Math.floor((n / 1e3 / 60) % 60))),
                    (seconds = that.$.doubleNum(Math.floor((n / 1e3) % 60)));
                }
              } else {
                days = '00';
                (hours = '00'), (minutes = '00'), (seconds = '00');
              }

              that.seckillList.push({
                className: item.product_name,
                classDescribe: item.product_tips,
                days: parseInt(days),
                hour: parseInt(hours),
                minute: parseInt(minutes),
                second: parseInt(seconds),
                studentsNumber: item.v_buy_course_num,
                price: item.item_unit_price,
                priceSpike: priceSpike, // 折扣价
                image: item.product_image,
                studentsNumber: item?.buy_num,
              });
            });
          }
        },
      });
    },
    // 猜你喜欢
    getGuessULike() {
      const that = this;
      const params = {
        category_id: 2025,
        store_is_open: 1,
        page: 1,
        rows: 5,
        product_state_id: 1001,
        kind_id: 1205,
        curpage: 1,
      };
      that.$.request({
        url: that.Config.URL.edu.getProductList,
        loading: false,
        data: params,
        success: function (data, status) {
          console.log('猜你喜欢:data, status', data, status);
          if (status === 200) {
            data.items.forEach(function (item, i, array) {
              console.log('猜你喜欢', item, i, array);
              if (i > 1) return;
              that.recommendList.push({
                classSection: item.chapter.chapterNum,
                className: item.product_name,
                classDescribe: item.product_tips,
                price: item.item_unit_price,
                image: item.product_image,
                studentsNumber: item.buy_num,
                // speaker:item.user_nickname ,
              });
            });
          }
        },
      });
    },
    clearSearch() {
      const _this = this;
      this.searchText = '';
    },
    getList(data, type = 'all') {
      const that = this;
      uni.request({
        url: that.Config.liveList,
        method: 'POST',
        dataType: 'jsonp',
        data: data,
        success: (res) => {
          const result = JSON.parse(res.data).result;
          // console.log('getList-res', result);
          if (res.statusCode == 200) {
            uni.stopPullDownRefresh();

            result.forEach(function (item, i, array) {
              // console.log('result-forEach', item, i, array);
              let lastStartTime = '';
              if (i != 0) {
                lastStartTime = array[i - 1].alive_start_at;
              }

              const startTime = item.alive_start_at;
              const PlaybackLiveTime = startTime.substring(5, 7) + '月' + startTime.substring(8, 10) + '日 ';
              let userName = '';
              if (item.guest_list.length != 0) {
                // console.log('prototype-guest_list:', Object.prototype.toString.call(Array.from(item.guest_list)));
                userName = item.guest_list
                  .map((item) => {
                    return item.user_name;
                  })
                  .toString();
              }
              let view_num = item.view_num;
              if (type == 'all' || type == 'curriculumList') {
                if (i < 5) {
                  if (item.alive_state == 0) {
                    // 预约
                    that.curriculumList.push({
                      state: item.alive_state, // 直播状态
                      number: PlaybackLiveTime + startTime.substring(11, 16),
                      image: item.img_url,
                      isordered: false,
                      startTime: startTime.substring(11, 16),
                      page_url: item.page_url,
                      speaker: userName,
                      title: item.title,
                    });
                  } else if (item.alive_state == 1) {
                    // 直播
                    that.curriculumList.push({
                      state: item.alive_state, // 直播状态
                      number: view_num + '观看',
                      image: item.img_url,
                      startTime: startTime.substring(11, 16),
                      page_url: item.page_url,
                      speaker: userName,
                      title: item.title,
                    });
                  } else {
                    that.curriculumList.push({
                      state: item.alive_state,
                      number: PlaybackLiveTime + view_num + '观看',
                      image: item.img_url,
                      startTime: startTime.substring(11, 16),
                      page_url: item.page_url,
                      speaker: userName,
                      title: item.title,
                    });
                  }
                }
              }
            });
            console.log('bannerList', that.bannerList);
            console.log('curriculumList', that.curriculumList);
          }
        },
        fail: () => {},
        complete: () => {
          // this.contentScroll();
        },
      });
    },
    videoJump(url, state) {
      // uni.navigateTo({
      // 	url: `/pages/findPage/webview?url=${url}`
      // })
      console.log('videoJump-url, state', url, state, state != 0);
      // 新开窗口
      // window.open(url, '_blank');
      this.openWebview(url);
    },
    openWebview(urls) {
      if (!this.hasLogin) {
       uni.navigateTo({
       	url:'/pages/login/login'
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
        success: function (data, status) {
          uni.showToast({
            icon: 'none',
            title: data,
          });
          const target = data.data.result.login_url;
          window.location.href = target;
          // // #ifdef APP-PLUS
          // plus.runtime.openURL(target) //这里默认使用外部浏览器打开而不是内部web-view组件打开
          // // #endif
        },
      });
      // #endif

      //#ifdef APP-PLUS
      var e_uid = uni.getStorageSync('e_uid');
      uni.request({
        method: 'POST',
        url: this.Config.xeLogin,
        data: {
          user_id: e_uid,
          redirect_uri: urls,
          login_type: 2,
        },
        success: function (data, status) {
          uni.showToast({
            icon: 'none',
            title: data,
          });
          const target = data.data.result.login_url;
          uni.navigateTo({
            url: `/my/webview/webview_live?url=${target}`,
          });
        },
      });
      // #endif
    },
    contentScroll() {
      let h = document.querySelector('.search').getBoundingClientRect().height;
      this.contentScrollHeight = document.body.clientHeight - h + 'px';
      console.info('contentScroll', this.contentScrollHeight, h);
    },
    changeTab(e) {
      this.tabCurrentIndex = e.target.current;
    },
    //顶部tab点击
    tabClick(index) {
      this.tabCurrentIndex = index;
    },
    tabBrandClick(index, text) {
      console.log('tabBrandClick', text);
      this.currentbrand = index;
      const data = {
        tag: text,
        riqi: '2022-05-05', // this.toyeardayDate,
        alive_state: -1,
        page_num: 1,
        page_size: 10,
      };
      this.getList(data);
    },

    getTodayDate() {
      let nowDate = new Date();
      let date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
      };

      if (parseInt(date.date) < 10) {
        date.date = '0' + date.date;
      }
      this.todayDate = date.month + '月' + date.date + '日';
      this.toyeardayDate = date.year + '-' + date.month + '-' + date.date;
      // this.todayDate = date.getMonth() + date.getDate();
      console.log('todayDate:', this.todayDate);
    },
    getWeek(date) {
      let weekArray = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');

      let week = weekArray[new Date(date).getDay()]; //注意此处必须是先new一个Date

      return week;
    },
    getDateWeek() {
      /* 得到当前日期的时间戳 */
      const timestamp = Date.now();
      // const timestamp = new Date(2019, 7, 30, 0, 0, 0, 0).getTime()
      const dateWeek = Array.from(new Array(7)).map((_, i) => {
        /* 得到当前周每一天的时间戳 */
        const weekTimestamp = new Date(timestamp + i * 24 * 60 * 60 * 1000);

        const date = String(weekTimestamp.getMonth() + 1).padStart(2, '0') + '.' + String(new Date(weekTimestamp).getDate()).padStart(2, '0');
        const value = JSON.stringify(i);
        /* 得到周几后转换 */
        let label = weekTimestamp.getDay();

        switch (label) {
          case 0:
            label = '周日';
            break;
          case 1:
            label = '周一';
            break;
          case 2:
            label = '周二';
            break;
          case 3:
            label = '周三';
            break;
          case 4:
            label = '周四';
            break;
          case 5:
            label = '周五';
            break;
          case 6:
            label = '周六';
            break;
        }
        console.log('label', label);
        return {
          value,
          date,
          label,
        };
      });
      dateWeek[0].label = '今天';
      dateWeek[1].label = '明天';
      this.programOptions = dateWeek;
      console.log('dateWeek：', this.programOptions, this.programOptions[0].label);
    },
    bookCourse(index, url) {
      window.open(url, '_blank');
      // this.showToast('预约成功，您将收到开播提醒');
      // this.playbackAreaList[index].isordered = true;
      // console.log('bookCourse', this.playbackAreaList[index].isordered);
    },
    orderToday(i, url) {
      window.open(url, '_blank');
      // this.showToast('预约成功，您将收到开播提醒');
      // this.curriculumList[i].isordered = true;
    },
    showToast(title) {
      this.toastText = title;
      this.isToast = true;
      this.timer = setTimeout(() => {
        this.isToast = false;
      }, 1000);
      console.log('showToast', this.$refs.uniToast, title);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/findPage/discoveryPage.scss';
@import '@/styles/home/home.scss';
.platform {
  padding-bottom: 30upx;
}

// ::v-deep .banner-wrap{
// 	.banner-swiper{
// 		.banner-swiper-item{
// 			.banner-swiper-img{
// 				width: 680upx;
// 				height: 230upx;
// 			}

// 		}
// 		.banner-swiper-img.active{
// 			height: 260upx;
// 		}
// 	}
// }
</style>
