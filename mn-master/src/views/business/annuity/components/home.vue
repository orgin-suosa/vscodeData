<template>
  <div class="home_container">
    <p class="appModelTitle">测算我的养老金</p>
    <appModel class="appModel" :appModelDate="appModelDate" @changeAppFormData="changeAppFormData"/>
      <div class="btn-wrapper" v-if="isOriginHei">
      <div class="share-btn btn" @click="onShare">立刻分享</div>
      <div class="start-btn btn" @click="onTest">开始测评</div>
    </div>

    <!-- 填写报名信息 -->
    <van-overlay :show="showDialog">
      <signup-dialog :user-id="agentId" :wx-user-info="wxUserInfo" :type="type" @onConfirm="signUp" @onCancel="onCancel" />
    </van-overlay>
    <Guide v-if="isGuide" @onHide="onHide" />
  </div>
</template>

<script>
import { shareClick } from '@/utils/wechatAuth';
import Guide from '@/components/guide';
// import { getFirstMainId } from '@/api/acquisition';
import { selectIsSignUp } from '@/api/character';
import sharePic from '@/assets/FPAptitude/character.png';
import SignupDialog from '@/components/signupDialog';
import appModel from '../components/appModel.vue';
export default {
  name: 'Home',
  components: {
    Guide,
    SignupDialog,
    appModel
  },
  props: {
    openId: {
      type: String,
      default: '',
    },
    agentId: {
      type: String,
      default: '',
    },
    isWeChart: {
      type: Boolean,
      default: false,
    },
    infoShare: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      default: '',
    },
    wxUserInfo: {
      type: Object,
      default: () => {},
    },
    userId: {
      type: String,
      default: '',
    },
    baseInfoId: {
      type: String,
      default: '',
    },
    hasMobile: {
      type: String,
      default: '',
    },
    isFirstSignUp: {
      type: Boolean,
    },
    infoDetail: {
      type: Object,
      default: () => {},
    },
    appModelDate: {
      type: Object,
      default: () => {},
    },
    dealData: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      firstPk: true,
      showDialog: false, // 是否显示填写报名信息 -
      buttonType: false,
      isGuide: false,
      wxUserId: '',
      type: 400, // 测评类型（100：财富金矿；200：性向测试；300：性格色彩测试；400：展业工具测评；500：展业工具问卷）
      sharePic,
      fromTable: {},
      recordID: '',
      recordDate: {},
      isOriginHei: true,
      screenHeight: document.documentElement.clientHeight, // 实时屏幕高度
      originHeight: document.documentElement.clientHeight, // 原始屏幕高度
    };
  },
  computed: {
    recordDatelist: function() {
      return this.$store.getters.gettersRecordDate;
    },
    getRecordID: function() {
      return this.$store.getters.gettersRecordID;
    }
  },
  watch: {
    screenHeight (val) {
      if (this.originHeight > val + 100) { // 加100为了兼容华为的返回键
        this.isOriginHei = false;
        console.log("键盘弹起");
      } else {
        this.isOriginHei = true;
        console.log("键盘收起");
      }
    }
  },
  created() {},
  mounted() {
    const that = this;
    window.onresize = function() {
      return (function() {
        that.screenHeight = document.documentElement.clientHeight;
      })();
    };
  },
  methods: {
    // 开始评估
    onTest() {
      console.log('onTest-home-fromTable', this.fromTable);
      this.$store.commit('mutationsOldAgePensionState', this.fromTable);
      if (JSON.stringify(this.fromTable) == '{}') {
        this.$toast('请填写全部测算\n信息后开始测评');
        return;
      }
      if (this.fromTable.preTaxWages.replace(/\s*/g, "") === "" || this.fromTable.lastAverageWage?.replace(/\s*/g, "") == "" || this.fromTable.oneselfAge == null || this.fromTable.retireAge === null || this.fromTable.accumulatedPension?.replace(/\s*/g, "") === "" || this.fromTable.pensionRatio?.replace(/\s*/g, "") === "" || this.fromTable.wageGrowthRate?.replace(/\s*/g, "") === "" || this.fromTable.wageGrowthRateCity?.replace(/\s*/g, "") === "" || this.fromTable.retirementSalary?.replace(/\s*/g, "") === "") {
        this.$toast('请填写全部测算\n信息后开始测评');
        return;
      }
      this.$gdp('acquisition_tools_start_evaluation', {tabName: document.title });
      console.info("开始评估", this.isWeChart);
      if (!this.isWeChart) {
        this.saveAppAnnuity();
      } else {
        this.WXsaveAnnuity();
      }
    },
    testJump() {
      if (this.$appInterface.getCreateId()) {
        const getParams = { status: '3' };
        console.log('开始评估-调用父组件-dealData-1111:', getParams);
        this.dealData(getParams, 'signUp');
        return;
      }
      if (!this.$appInterface.getCreateId() && this._props.hasMobile) {
        const getParams = { status: '2' };
        console.log('开始评估-调用父组件-dealData-22222:', getParams);
        this.dealData(getParams, 'signUp');
      } else {
        console.log('开始评估-是否第一次登录-isFirstSignUp:', this.isFirstSignUp);
        // 避免本地需要登录
        console.log('开始评估-微信是否授权-openid - isWeChart:', this.wxUserInfo.openid, this.isWeChart);
        console.log('开始评估-微信是否授权:', !this.wxUserInfo.openid && this.isWeChart);
        if (!this.wxUserInfo.openid && this.isWeChart) {
          // this.$toast('请授权后,开始测算！');
          console.info("用户未授权");
          return;
        } else {
        // 避免本地需要登录
          const getParams = { status: '3' };
          console.log('开始评估-------非第一次答题:', getParams);
          this.dealData(getParams, 'signUp');
        }
        console.log("开始评估-openid", this.wxUserInfo.openid, !this.wxUserInfo.openid);
      }
    },
    // 提交报名信息
    signUp(data, mobile) {
      console.log('提交报名信息');
      this.$emit('getMobile', mobile);
      this.mobile = mobile;
      if (data) {
        console.log('提交报名信息-data', data);
        this.showDialog = false;
        const getParams = { status: '3' };
        console.log('提交报名信息-getParams', getParams);
      }
    },
    // 取消
    onCancel() {
      this.showDialog = false;
    },
    // 微信用户是否是第一次答题
    isFirstTest(params) {
      console.log(params, '微信用户是否是第一次答题-params');
      return new Promise((resolve, reject) => {
        selectIsSignUp(params)
          .then((res) => {
            console.log(res, '微信用户第一次答题');
            resolve(res.data);
          })
          .catch((err) => {
            console.log(err, '微信用户答过题报错');
          });
      });
    },
    // 邀请好友测试
    onShare() {
      this.$gdp('acquisition_tools_quick_share', {tabName: document.title });
      if (this.isWeChart) {
        this.onGuide();
        return;
      }
      this.$emit('getExhibitionList', 1);
      const param = {
        title: '养老金测算器',
        content: '蛮牛伙伴帮助您测算养老金',
        picture: process.env.VUE_APP_OSS_CS_URL + '/h5-agent-business/annuity.png',
        url: shareClick('/annuity', { agentId: this.agentId, id: this.$route.query.id }) || '',
      };
      this.$appInterface.shareUrl(param);
    },
    // 引导用户用微信的转发
    onGuide() {
      this.isGuide = true;
    },
    onHide() {
      this.isGuide = false;
    },
    blank() {
      if (!this.wxUserInfo.openid) {
        this.$appInterface.goToH5Page({
          urlPath: this.infoDetail.bibliographyHost,
          navigation: true,
        });
      } else {
        window.location.href = this.infoDetail.bibliographyHost;
      }
    },
    changeAppFormData(key, val,) {
      this.fromTable = val;
      console.log(key, val, 'changeAppFormData-home');
      this.$emit('changeAppFormData', key, val);
    },
    WXsaveAnnuity() {
      console.log("微信用户-wxUserInfo", this.wxUserInfo);
      const that = this;
      const param = {
        agentId: this.agentId,
        baseInfoId: this.baseInfoId,
        openId: this.wxUserInfo.openid,
        nickname: this.wxUserInfo.nickname,
        headImgUrl: this.wxUserInfo.headimgurl,
        personType: '100', // 操作人类型（100：用户）
        monthSalaryByPreTax: this.fromTable?.preTaxWages, // 税前月工资
        monthSalaryByAverage: this.fromTable?.lastAverageWage, // 本市职工上年度月平均工资
        age: this.fromTable?.oneselfAge, // 年龄（岁）
        retirementAge: this.fromTable?.retireAge, // 预计退休年龄
        annuityTotalMoney: this.fromTable?.accumulatedPension, // 累计养老金金额
        annuityPayRatio: this.fromTable?.pensionRatio, // 养老金缴费比例
        wageIncreaseRateByPerson: this.fromTable?.wageGrowthRate, // 个人工资增长率
        wageIncreaseRateByCityEmployee: this.fromTable?.wageGrowthRateCity, // 本市职工工资增长率
        monthRetireMoneyByExpect: this.fromTable?.retirementSalary, // 期望退休后每月生活水平
      };
      console.log("养老金信息保存-wx'-入参:", param, this.fromTable?.preTaxWages);
      this.$store.dispatch('annuity/saveAnnuity', param).then((res) => {
        console.log('养老金信息保存-wx', res, res.data);
        this.recordID = res.data;
        // this.$store.dispatch('actionsRecordID', res.data);
        if (res.code == 200) {
          that.WXGetPensionResult(res.data);
          this.testJump();
        } else {
          return;
        }
      });
    },
    WXGetPensionResult(recordID) {
      const param = {
        id: recordID
      };
      console.log('getPensionResult-param', param);
      this.$store.dispatch('annuity/getPensionResult', param).then((res) => {
        console.log("测评报告-getPensionResult-home:", res);
        this.recordDate = res.data;
        this.$emit('changeAppFormData', 'resultText', res.data);
        this.$store.dispatch('actionsRecordDate', res.data);
      });
    },
    saveAppAnnuity() {
      const that = this;
      const param = {
        agentId: this.agentId,
        baseInfoId: this.baseInfoId,
        personType: '200', // 操作人类型（200：代理人）
        monthSalaryByPreTax: this.fromTable?.preTaxWages, // 税前月工资
        monthSalaryByAverage: this.fromTable?.lastAverageWage, // 本市职工上年度月平均工资
        age: this.fromTable?.oneselfAge, // 年龄（岁）
        retirementAge: this.fromTable?.retireAge, // 预计退休年龄
        annuityTotalMoney: this.fromTable?.accumulatedPension, // 累计养老金金额
        annuityPayRatio: this.fromTable?.pensionRatio, // 养老金缴费比例
        wageIncreaseRateByPerson: this.fromTable?.wageGrowthRate, // 个人工资增长率
        wageIncreaseRateByCityEmployee: this.fromTable?.wageGrowthRateCity, // 本市职工工资增长率
        monthRetireMoneyByExpect: this.fromTable?.retirementSalary, // 期望退休后每月生活水平
      };
      console.log("养老金信息保存-app'-入参:", param, this.fromTable?.preTaxWages);
      this.$store.dispatch('annuity/saveAppAnnuity', param).then((res) => {
        console.log('养老金信息保存-app', res, res.data);
        this.recordID = res.data;
        this.$store.dispatch('actionsRecordID', res.data);
        if (res.code == 200) {
          that.getAppResult(res.data);
          this.testJump();
        } else {
          return;
        }
      });
    },
    getAppResult(recordID) {
      const that = this;
      const param = {
        id: recordID
      };
      console.log('getAppResult-param', param);
      this.$store.dispatch('annuity/getAppPensionResult', param).then((res) => {
        console.log('getAppResult', res);
        that.recordDate = res.data;
        this.$emit('changeAppFormData', 'resultText', res.data);
        // this.$store.commit('mutationsRecordDate', res.data);
        this.$store.dispatch('actionsRecordDate', res.data);
      });
    },
  },
};
</script>

<style scoped lang="scss">
$navbar-height: 44px;
$appModel-title-height: 55px;
$bottom-height: 95px;
$scroll-height: 0px;
.home_container {
  padding-bottom: 100px;
  background: #f7f8f9;
  .appModelTitle{
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 600;
    text-align: left;
    color: #333333;
    padding: 15px;
  }
}
.weChart{
  height: calc(100% - #{$bottom-height});
  max-height:calc(100%  - #{$bottom-height});
}
.btn-wrapper {
  height: 95px;
  position: absolute;
  left: 0;
  top:  calc(100vh - #{$bottom-height});
  // bottom: 0;
  width: 100%;
  padding: 10px 15px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background-color: #ffffff;
  z-index: 2;
  box-shadow: 0px -3px 20px 0px #f1f1f1;
  .share-btn {
    color: #009c64;
    border: 1px solid #009c64;
    border-radius: 22px;
  }
  .start-btn {
    color: #ffffff;
    background: linear-gradient(315deg,#009c64, #29c38c);
    box-shadow: 0px 2px 10px 0px rgba(0,156,100,0.30);
  }
  .btn {
    width: 143px;
    height: 41px;
    line-height: 41px;
    border-radius: 25px;
    font-size: 15px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    display: flex;
    justify-content: center;
    align-content: center;
  }
}
.btn-center {
  justify-content: center;
}
::v-deep .van-overlay {
  z-index: 9;
}
</style>
