<template>
  <div class="business" @click="checkBusinessaCard">
    <div :class="cardClassName">
      <template v-if="cardStyle === '2'">
        <div class="card-content">
          <div class="photo-container">
            <img :src="`${baseInfo.portrait || defaultHead}`" />
          </div>
          <div class="content">
            <div class="content-top">
              <span class="name">{{ baseInfo.userName || '未命名' }}</span>
              <span class="job-name">{{ baseInfo.jobTitle }}</span>
            </div>
            <div class="content-center">
              <div class="company-name">{{ companyName }}</div>
              <p v-if="baseInfo.mobile || informationEmpty" class="phone">
                <img src="~@/assets/images/phone.png" alt="" />
                <span>{{ baseInfo.mobile }}</span>
              </p>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="cardStyle === '3'">
        <div class="card-content">
          <div class="photo-container">
            <img :src="`${baseInfo.portrait || defaultHead}`" />
            <span class="name">{{ baseInfo.userName || '未命名' }}</span>
          </div>
          <div class="content">
            <div class="company-name" v-if="companyName">{{ companyName }}</div>
            <div class="job-name" v-if="baseInfo.jobTitle">{{ baseInfo.jobTitle }}</div>
            <div v-if="baseInfo.mobile || informationEmpty" class="phone">
              <img src="~@/assets/images/phone.png" alt="" />
              <span>{{ baseInfo.mobile }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="photo-container">
          <img :src="`${baseInfo.portrait || defaultHead}`" />
        </div>
        <div class="content">
          <div class="content-top">{{ companyName }}</div>
          <div class="content-center">
            <span class="name">{{ baseInfo.userName || '未命名' }}</span>
            <span class="job-name">{{ baseInfo.jobTitle }}</span>
          </div>
          <div class="bottom">
            <p v-if="baseInfo.mobile || informationEmpty" class="phone">
              <span>{{ baseInfo.mobile }}</span>
              <img src="~@/assets/images/phone.png" alt="" />
            </p>
            <!-- <p class="wechart">
              <span>{{ baseInfo.wechatId }}</span>
              <img src="~@/assets/images/wechart.png" alt="" />
            </p> -->
            <p class="address">
              <span>{{ baseInfo.companyAddr }}</span>
              <img src="~@/assets/images/ads.png" alt="" />
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessCard',
  props: {
    agentInfo: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    defaultHead() {
      if (this.cardStyle === '1') {
        return require('@/assets/businessCard/defaultPhoto.png');
      }
      if (this.cardStyle === '2') {
        return require('@/assets/businessCard/defaultPhoto2.png');
      }
      if (this.cardStyle === '3') {
        return require('@/assets/businessCard/defaultPhoto3.png');
      }
      return require('@/assets/businessCard/defaultPhoto.png');
    },
    cardStyle() {
      const { baseInfo } = this.agentInfo;
      const { cardStyle } = baseInfo || '';
      return cardStyle;
    },
    cardClassName() {
      if (this.cardStyle === '1') {
        return 'business-card-one';
      }
      if (this.cardStyle === '2') {
        return 'business-card-two';
      }
      if (this.cardStyle === '3') {
        return 'business-card-three';
      }
      return 'business-card-one';
    },
    baseInfo() {
      return this.agentInfo.baseInfo || {};
    },
    workInfo() {
      return this.agentInfo.workInfo || {};
    },
    tagList() {
      const tag = this?.agentInfo?.workInfo?.tag || '';
      const workYear = this?.agentInfo?.workInfo?.workYear;
      const workYearFilter = workYear ? workYear + '经验' : workYear;
      const fliterTagList = tag.split('|') || [];
      let concatList = workYearFilter ? [workYearFilter].concat(fliterTagList) : fliterTagList;
      concatList = concatList.filter((item) => {
        return item !== '';
      });
      return concatList;
    },
    isComplete() {
      return this.agentInfo.isComplete || false;
    },
    informationEmpty() {
      const information = this.agentInfo.baseInfo || {};
      if (information.mobile === '' && information.wechatId === '' && information.companyAddr === '') {
        return true;
      } else {
        return false;
      }
    },
    companyName() {
      const company = this?.agentInfo?.baseInfo?.companyName || '';
      const corporation = company.substring(0, 6);
      return corporation;
    },
  },
  mounted() {
    this.setting();
  },
  methods: {
    // 查看名片
    checkBusinessaCard() {
      this.$emit('checkBusinessaCard');
    },
    setting() {
      console.log('setting', window.WeixinJSBridge);
      // document.body.style.webkitTextSizeAdjust = '100%';
      document.body.style.setProperty('text-size-adjust', '100%', 'important');
      if (typeof window.WeixinJSBridge === 'object' && typeof window.WeixinJSBridge.invoke === 'function') {
        handleFontSize();
      } else {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', handleFontSize, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', handleFontSize);
          document.attachEvent('onWeixinJSBridgeReady', handleFontSize);
        }
      }
      function handleFontSize() {
        document.body.style.setProperty('text-size-adjust', '100%', 'important');
        // 设置网页字体为默认大小
        window.WeixinJSBridge.invoke('setFontSizeCallback', {
          fontSize: 0,
        });
        // 重写设置网页字体大小的事件
        window.WeixinJSBridge.on('menu:setfont', function() {
          window.WeixinJSBridge.invoke('setFontSizeCallback', {
            fontSize: 0,
          });
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.business-card-one {
  margin-top: 0.3rem;
  border-radius: 0.16rem;
  position: relative;
  display: flex;
  height: 3.88rem;
  .content {
    flex: 1;
    padding: 0.24rem 0 0.2rem 0.25rem;
    background: url('~@/assets/images/bg-cover.png') no-repeat;
    background-size: 100%;
    position: absolute;
    right: 0;
    top: 0;
    left: 2.5rem;
    right: 0;
    bottom: 0;
    z-index: 10;
    .content-top {
      line-height: 0.3rem;
      color: #333;
      font-size: 0.32rem;
      text-align: right;
      margin: 0 0.18rem 0.2rem 0;
    }
    .content-center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      width: 4rem;
      height: 1.28rem;
      color: #333;
      padding-right: 0.2rem;
      float: right;
      position: absolute;
      right: 0;
      top: 0.7rem;
      .name {
        font-size: 0.42rem;
        font-weight: 500;
        line-height: 0.59rem;
      }
      .job-name {
        font-size: 0.26rem;
        font-weight: 400;
        line-height: 0.3rem;
        margin-top: 0.08rem;
      }
    }
  }
  .bottom {
    margin: 1.6rem 0.2rem 0 0;
    font-size: 0.22rem;
    font-weight: 400;
    color: #333;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
    float: right;
    width: 3.32rem;
    p {
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      text-align: right;
      img {
        transform: scale(0.5);
        width: 18px;
        height: 18px;
      }
    }
    .address {
      display: flex;
      align-items: flex-start;
      span {
        line-height: 20px;
        height: 40px;
        overflow: hidden; //超出文本隐藏
        text-overflow: ellipsis; //溢出省略号显示
        display: -webkit-box; //将对象作为弹性伸缩盒子
        -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式-从上到下垂直排列
        -webkit-line-clamp: 2;
      }
    }
  }
  .photo-container {
    z-index: 0;
    position: absolute;
    left: 0;
    top: 0;
    img {
      z-index: 0;
      width: 3.28rem;
      height: 3.87rem;
      border-top-left-radius: 0.08px;
      border-bottom-left-radius: 0.08px;
      background-size: contain;
      border-radius: 0.16rem 0 0 0.16rem;
    }
    .triangle {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      width: 0;
      height: 0;
      border-top: 2rem solid rgba(255, 255, 255, 1);
      border-right: 0.36rem solid rgba(255, 255, 255, 1);
      border-left: 0.36rem solid rgba(255, 255, 255, 0);
      border-bottom: 2rem solid rgba(255, 255, 255, 0);
    }
  }
}
.business-card-two {
  width: 100%;
  min-height: 5rem;
  border-radius: 8px;
  box-shadow: 0px 3px 10px 0px #f1f1f1;
  background: #fff;
  overflow: hidden;
  .card-content {
    display: flex;
    flex-direction: column;
    img {
      height: 5.6rem;
      width: 100%;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    .content-top {
      margin-top: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      white-space: nowrap;
      .name {
        font-size: 0.38rem;
        padding-left: 0.3rem;
        padding-right: 0.1rem;
        font-weight: bold;
        color: #333333;
      }
      .job-name {
        color: #333333;
        font-size: 0.26rem;
      }
    }
    .content-center {
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      .company-name {
        width: 4rem;
        color: #333333;
        font-size: 0.26rem;
        opacity: 1;
        padding-left: 0.3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        white-space: nowrap;
      }
      .phone {
        color: #333333;
        font-size: 0.26rem;
        opacity: 1;
        padding-left: 0.4rem;
        width: 2.4rem;
        display: flex;
        align-items: center;
        margin: 0;
        span {
          padding-left: 0.1rem;
        }
        img {
          width: 0.22rem;
          height: 0.22rem;
        }
      }
    }
  }
}
.business-card-three {
  .card-content {
    position: relative;
    width: 100%;
    height: 3.87rem;
    border-radius: 8px;
    box-shadow: 0px 3px 10px 0px #f1f1f1;
    background: url('~@/assets/images/classicBg.png');
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    .photo-container {
      height: 2.1rem;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      padding: 0.1rem 0 0.1rem;
      box-sizing: border-box;
      img {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
      }
      .name {
        color: #ffffff;
        margin-top: 0.1rem;
        font-size: 0.34rem;
        opacity: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        white-space: nowrap;
        padding-left: 0.2rem;
        padding-right: 0.2rem;
        width: 100%;
        text-align: center;
        box-sizing: border-box;
        width: 6rem;
      }
    }
    .content {
      display: flex;
      align-items: center;
      flex-direction: column;
      height: 1.77rem;
      width: 6.8rem;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 0.12rem 0 0.1rem;
      div {
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        white-space: nowrap;
        font-size: 0.3rem;
        line-height: 0.5rem;
        height: 0.5rem;
        width: 100%;
        text-align: center;
        box-sizing: border-box;
      }
      .phone {
        color: #333333;
        font-size: 0.3rem;
        opacity: 1;
        display: flex;
        align-items: center;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        white-space: nowrap;
        height: 0.5rem;
        justify-content: center;
        span {
          padding-left: 0.1rem;
          line-height: 0.5rem;
        }
        img {
          width: 0.24rem;
          height: 0.24rem;
        }
      }
    }
  }
}
</style>
