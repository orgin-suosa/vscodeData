<template>
  <div class="results">
    <div class="result_content">
      <div class="content_pk">
        <div class="header">
          <div class="portrait">
            <img v-if="getresult.pkResult !== 100" class="win_icon" src="@/assets/images/win_icon.png" alt="" />
            <img class="header_icon" :src="getresult.iavatar ? getresult.iavatar : defaultIcon" alt="" />
          </div>
          <div class="slider">
            <div class="money">
              <p>{{ getresult.isecondPay }}<span>元</span></p>
              <p>{{ getresult.itSecondPay }}<span>元</span></p>
            </div>
            <div class="box">
              <p :style="{ width: agentWidth + 'px' }" class="box_agent"></p>
              <p :style="{ width: userWidth + 'px' }" class="box_user"></p>
            </div>
          </div>
          <div class="portrait">
            <img v-if="getresult.pkResult !== 200" class="win_icon" src="@/assets/images/win_icon.png" alt="" />
            <img v-if="!isWeChart" class="header_icon" :src="getresult.itAvatar ? getresult.itAvatar : defaultImg" alt="" />
            <img v-if="isWeChart" class="header_icon" :src="getresult.itAvatar ? getresult.itAvatar : defaultIcon" alt="" />
          </div>
        </div>
        <div class="content_name">
          <p>{{ getresult.inickName }}</p>
          <p>{{ getresult.itNickName || '我是一只小蛮牛' }}</p>
        </div>
      </div>
      <div class="line"></div>
      <div class="content_text">
        <div class="text_result">
          <p>PK结果:</p>
          <span>{{ resultPK }}</span>
        </div>
        <div class="paragraph" v-html="getresult.conclusion"></div>
      </div>
    </div>
    <div class="result_button">
      <img v-if="result === 'loser' && isWeChart" src="@/assets/images/increase_button.png" alt="" @click="onCard" />
      <img src="@/assets/images/share_button.png" alt="" @click="onShare" />
    </div>
    <Dialog v-if="isCard" @onClose="onClose" />
    <Guide v-if="isGuide" @onHide="onHide" />
  </div>
</template>

<script>
import { shareClick } from '@/utils/wechatAuth';
import Dialog from './dialog';
import Guide from './guide';
export default {
  name: 'EvaluationResults',
  components: {
    Dialog,
    Guide,
  },
  props: {
    getresult: {
      type: Object,
      default: () => {
        return {};
      },
    },
    agentId: {
      type: String,
      default: '',
    },
    isWeChart: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      result: 'loser', // winer赢，loser输
      defaultImg: require('@/assets/images/default.png'),
      defaultIcon: require('@/assets/images/defaultIncon.png'),
      isCard: false,
      isGuide: false,
    };
  },
  computed: {
    agentWidth: function() {
      // 我盒子宽度
      return (this.getresult.isecondPay / (this.getresult.itSecondPay + this.getresult.isecondPay)) * 182;
    },
    userWidth: function() {
      // 代理人盒子高度
      return (this.getresult.itSecondPay / (this.getresult.itSecondPay + this.getresult.isecondPay)) * 182;
    },
    resultPK: function() {
      if (this.getresult.pkResult === 100) {
        return '负';
      } else if (this.getresult.pkResult === 200) {
        return '胜';
      } else if (this.getresult.pkResult === 300) {
        return '旗鼓相当';
      } else {
        return '';
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 分享PK结果
    onShare() {
      console.log(this.isWeChart, 'this.isWeChart');
      if (this.isWeChart) {
        this.onGuide();
        return;
      }
      this.$emit('getExhibitionList', 1);
      const param = {
        title: '每秒薪资大pk',
        content: '快来比一比，看看谁是朋友圈里的秒薪大佬',
        picture: process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/salary.png',
        url: shareClick('/salary', { agentId: this.agentId, id: this.$route.query.id }) || '',
      };
      console.log(param);
      this.$appInterface.shareUrl(param);
    },
    // 跳转名片
    onCard() {
      this.isCard = true;
    },
    onClose() {
      this.isCard = false;
    },
    // 引导用户用微信的转发
    onGuide() {
      this.isGuide = true;
      console.log('去点击微信的转发');
    },
    onHide() {
      this.isGuide = false;
    },
  },
};
</script>

<style scoped lang="scss">
.results {
  width: 100%;
  height: 100vh;
  background: url('~@/assets/images/result_bg.png') center/100% 100% no-repeat;
  overflow-y: scroll;
  position: relative;
  .result_content {
    width: 346px;
    height: 350px;
    background: url('~@/assets/images/answer_bg.png') center/100% 100% no-repeat;
    position: relative;
    margin: 0 auto;
    margin-top: 17vh;
    .content_pk {
      height: 20.6vh;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 5vh 17px 1.8vh 17px;
        .portrait {
          .win_icon {
            width: 43px;
            height: 23px;
            margin-bottom: -5px;
          }
          .header_icon {
            width: 38px;
            height: 38px;
            border-radius: 50%;
          }
        }
        .slider {
          .money {
            width: 200px;
            display: flex;
            justify-content: space-between;
            p {
              font-size: 22px;
              color: #fff;
              span {
                font-size: 16px;
                padding-left: 2px;
              }
            }
          }
          .box {
            width: 182px;
            height: 6px;
            margin: 0 auto;
            margin-top: 9px;
            border-radius: 3px;
            display: flex;
            .box_agent {
              height: 6px;
              background: linear-gradient(#eb646d 0%, #ef9c6d 100%);
              border-radius: 3px 0px 0px 3px;
            }
            .box_user {
              height: 6px;
              background: linear-gradient(#5084f6 0%, #62b8f0 100%);
              border-radius: 0px 3px 3px 0px;
            }
          }
        }
      }
      .content_name {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        text-align: left;
        color: #ffffff;
        line-height: 21px;
        letter-spacing: 1px;
        padding: 0 15px 0 17px;
      }
    }
    .line {
      width: 303px;
      height: 1px;
      background: #fff7f8;
      border-radius: 1px;
      margin-left: 25px;
      opacity: 0.6;
    }
    .content_text {
      height: 26vh;
      padding: 1.2vh 20px 0 29px;
      .text_result {
        p {
          font-size: 22px;
          color: #fff;
          display: inline-block;
        }
        span {
          font-size: 35px;
          color: #fff;
          padding-left: 16px;
        }
      }
      .paragraph {
        width: 78vw;
        font-size: 16px;
        color: #fff;
        line-height: 23px;
        letter-spacing: 0.3px;
        margin-top: 0.5vh;
        // span {
        //   color: #eb686d;
        //   font-size: 18px;
        // }
      }
    }
  }
  .result_button {
    display: flex;
    justify-content: space-around;
    margin-top: 10vh;
    img {
      width: 155px;
      height: 50px;
    }
  }
}
</style>
