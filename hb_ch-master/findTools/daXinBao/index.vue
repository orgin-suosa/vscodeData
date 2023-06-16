<template>
  <view class="content">
    <view class="statusBarHeight" :style="{ height: statusBarHeight + 'px' }"></view>
    <status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
    <scroll-view class="articleDetail-scroll" :style="{ height: scrollHeight + 'rpx' }" scroll-y="true"  >
      <toolTemplate
        :title="title"
        :topNavList="topNavList"
		:firstTabIndex="firstTabIndex"
        :subsectionIndex="videoCurrentIndex"
        :subsectionList="selectionList"
		@firstTabChange="firstTabChange"
        @changeBtnIndex="changeBtnIndex"
        @upper="upper" 
		@toLower="toLower"
        @listScroll="listScroll"
      >
        <template slot="conten-center">
			<view v-if="firstTabIndex == 0">
				<playingNewShares :subsectionIndex="videoCurrentIndex"> </playingNewShares>
			</view>
			<view v-if="firstTabIndex == 1">
				<playingNewShares :subsectionIndex="videoCurrentIndex"> </playingNewShares>
<!-- 				<playingNewDebt :subsectionIndex="videoCurrentIndex"> </playingNewDebt> -->
			</view>
			<view v-if="firstTabIndex == 2">
				<dozenNewDase :subsectionIndex="videoCurrentIndex"> </dozenNewDase>
			</view>
        </template>
      </toolTemplate>
    </scroll-view>
	<view class="onlineAccount">在线开户</view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import toolTemplate from '../toolTemplate/index.vue';
import playingNewShares from '../components/daXinBao/playingNewShares.vue';
import playingNewDebt from '../components/daXinBao/playingNewDebt.vue';
import dozenNewDase from '../components/daXinBao/dozenNewDase.vue';
export default {
  components: {
    toolTemplate,
	playingNewShares,
	playingNewDebt,
	dozenNewDase
  },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum', 'Lang']),
    scrollHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    },
  },
  data() {
    return {
      title: '打新宝',
	  firstTabIndex:0,
	  subsectionIndex:0,
      statusBarHeight: 0,
      navBarHeight: 0,
      PageNav: {
        window: {
          navigationBarBackgroundColor: '#ffffff',
          navigationBarTextStyle: 'black',
          navigationBarTitleText: '',
          backgroundColor: '#f8f8f8',
          backgroundTextStyle: 'dark',
        },
      },
      topNavList: [
        {
          name: '打新股',
        },
        {
          name: '打新债',
        },
        {
          name: '打新基',
        },
      ],
      videoCurrentIndex: 0,
      selectionList: [
        {
          name: '赚钱效应',
          show_fg: 0,
        },
        {
          name: '待申购',
          show_fg: 1,
        },
        {
          name: '待上市',
          show_fg: 1,
        },
        {
          name: '今日新股',
          show_fg: 0,
        },
      ],

    };
  },
  onLoad() {
    this.init();
  },
  onUnload() {},
  methods: {
    init() {
      this.getSystemInf();
    },
	upper: function (e) {
	  console.log('打新宝upper:', e);
	},
    toLower(e) {
      console.log('打新宝-toLower:', e);
    },
    listScroll(e) {
      // console.log('打新宝-scroll:', e, this.tableList.theadList[0]);
    },
	firstTabChange(data) {
	   console.log('打新宝-一级tab:',data);
		this.firstTabIndex = data;
		if(data == 0){
			this.selectionList = [
			  {
			    name: '赚钱效应',
			    show_fg: 0,
			  },
			  {
			    name: '待申购',
			    show_fg: 1,
			  },
			  {
			    name: '待上市',
			    show_fg: 1,
			  },
			  {
			    name: '今日新股',
			    show_fg: 0,
			  },
			]
		} else if(data == 1){
			this.selectionList = [
			  {
			    name: '赚钱效应',
			    show_fg: 0,
			  },
			  {
			    name: '待申购',
			    show_fg: 1,
			  },
			  {
			    name: '待上市',
			    show_fg: 1,
			  },
			  {
			    name: '今日新债',
			    show_fg: 0,
			  },
			]
		}else if(data == 2){
			this.selectionList = [
			  {
			    name: '全部参与基金',
			    show_fg: 0,
			  },
			  {
			    name: '已申报基金',
			    show_fg: 1,
			  },
			  {
			    name: '已获配基金',
			    show_fg: 0,
			  }
			]
		}
		this.videoCurrentIndex = 0;
		this.subsectionIndex= 0;
	},
    changeBtnIndex(data) {
	   console.log('打新宝-subsec-切换:',data);
		this.videoCurrentIndex= data;
	},
    getSystemInf() {
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
    uniRequest(data) {
      const that = this;
      uni.request({
        url: this.Config.URL.edu.getProductList,
        method: 'get',
        data: data,
        dataType: 'json',
        success: (res) => {
          const data = res.data.data;
          console.log('getList-res', res);
          if (res.statusCode == 200) {
            uni.stopPullDownRefresh();
            result.forEach(function (item, i, array) {
              // console.log('result-forEach', item, i, array);
            });
          }
        },
        fail: () => {},
        complete: () => {
          // this.contentScroll();
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/findPage/daXinBao.scss';
@import '@/styles/home/pushModal.scss';
</style>
