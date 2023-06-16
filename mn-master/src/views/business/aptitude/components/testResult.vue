<template>
  <div class="bg">
    <div class="result-container">
      <div class="result_header">
        <div class="top">
          <div class="text">
            <div class="text_tip">
              <img class="tip-icon" src="@/assets/images/result-tip-icon.png" alt="" />
              <span>根据你的回答得出你属于：</span>
            </div>
            <div class="text_title">{{ optionValue }}</div>
          </div>
          <img class="cow-img" src="@/assets/images/cow-icon.png" alt />
        </div>
        <div class="test-time">评估时间：{{ resultLlist[0] ? resultLlist[0].compeleteTime : '' }}</div>
      </div>
      <div class="result_content">
        <div class="content_title">
          <img class="title-icon" src="@/assets/images/result-icon.png" alt="" />
          <span>性格特征分析：</span>
        </div>
        <div class="result_list" v-for="(item, index) in result" :key="index">
          <div class="result_text">{{ item.title }}</div>
          <li class="result_type" v-for="(itm, ind) in item.list" :key="ind">{{ itm }}</li>
        </div>
      </div>
    </div>
    <div class="result_footer">
      <div class="share_btn" @click="onShare">立即分享</div>
      <div class="text_btn" @click="onTest">再测一次</div>
    </div>
    <Guide v-if="isGuide" @onHide="onHide" />
  </div>
</template>
<script>
import Guide from '@/components/guide';
import { shareClick } from '@/utils/wechatAuth';
export default {
  name: 'WxTestResult',
  components: {
    Guide,
  },
  filters: {},
  props: {
    mobile: {
      type: String,
      default: '',
    },
    agentId: {
      type: String,
      default: '',
    },
    resultParams: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      resultLlist: [],
      optionValue: '',
      isGuide: false,
      result: [
        {
          title: '喜欢：',
          list: [],
        },
        {
          title: '讨厌：',
          list: [],
        },
        {
          title: '建议需要学会：',
          list: [],
        },
      ],
    };
  },
  mounted() {
    // if (this.$appInterface.getCreateId()) {
    this.resultLlist = this.resultParams;
    this.getList();
    // } else {
    // this.getResult();
    // }
    console.log('this.resultLlist', this.resultLlist);
    console.log('resultParams', this.resultParams);
  },
  methods: {
    getResult() {
      const param = {
        agentId: this.agentId,
        mobile: this.mobile,
      };
      this.$store.dispatch('sexual/queryAnswerRecord', param).then((res) => {
        console.log(res, '结果');
        if (res.code === 200 && res.data.resultLlist) {
          this.resultLlist = res.data.resultLlist;
          this.getList();
        }
      });
    },
    getList() {
      this.resultParams.map((item) => {
        if (item.optionValue === 1) {
          this.optionValue = 'D型_' + item.title + '人格';
        } else if (item.optionValue === 2) {
          this.optionValue = 'I型_' + item.title + '人格';
        } else if (item.optionValue === 3) {
          this.optionValue = 'S型_' + item.title + '人格';
        } else if (item.optionValue === 4) {
          this.optionValue = 'C型_' + item.title + '人格';
        }
        if (item.type === 1) {
          this.result[0].list.push(item.showOptionName);
        } else if (item.type === 2) {
          this.result[1].list.push(item.showOptionName);
        } else if (item.type === 3) {
          this.result[2].list.push(item.showOptionName);
        }
      });
    },
    // 再测一次
    onTest() {
      const getParams = { status: '3' };
      this.$parent.dealData(getParams, 'nextText');
    },
    // 立即分享
    onShare() {
      this.$emit('getExhibitionList', 1);
      if (!this.$appInterface.getCreateId()) {
        this.onGuide();
        return;
      }
      const param = {
        title: '带你了解更真实的自己',
        content: '测一测最真实的自己，或许可以了解到一个不为人知的你',
        picture: process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/aptitude.png',
        url: shareClick('/aptitude', { agentId: this.agentId, id: this.$route.query.id }) || '',
      };
      this.$appInterface.shareUrl(param);
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
<style lang="scss" scoped>
* {
  li {
    list-style: none;
  }
}
.bg {
  width: 100%;
  height: 100%;
  background: #fff;
}
.result-container {
  width: 343px;
  min-height: calc(100vh - 100px);
  margin: 0 auto;
  padding-bottom: 100px;
  .result_header {
    width: 100%;
    height: 111px;
    padding-top: 8px;
    border-bottom: 1px dashed #d8d8d8;
    .top {
      display: flex;
      justify-content: space-between;
      .text {
        .text_tip {
          display: flex;
          align-items: center;
          img {
            width: 11px;
            height: 13px;
          }
          span {
            font-size: 15px;
            font-weight: 500;
            color: #ffaf1a;
            margin-left: 5px;
          }
        }
        .text_title {
          font-size: 28px;
          font-weight: 400;
          color: #333333;
          margin-top: 6px;
        }
      }
      .cow-img {
        width: 72px;
        height: 72px;
      }
    }
    .test-time {
      font-size: 11px;
      font-weight: 400;
      color: #b3b3b3;
    }
  }
  .result_content {
    margin-top: 24px;
    .content_title {
      display: flex;
      align-items: center;
      img {
        width: 14px;
        height: 14px;
      }
      span {
        font-size: 15px;
        font-weight: 500;
        color: #00c5cd;
        margin-left: 5px;
      }
    }
    .result_list {
      font-size: 14px;
      color: #333333;
      margin-top: 6px;
      padding-bottom: 20px;
      border-bottom: 1px dashed #d8d8d8;
      .result_type {
        margin-top: 10px;
      }
    }
    .result_list:last-child {
      border-bottom: 0;
    }
  }
}
.result_footer {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  .text_btn,
  .share_btn {
    width: 148px;
    height: 45px;
    line-height: 45px;
    opacity: 1;
    background: linear-gradient(90deg, #00dddd, #00c5cd);
    border-radius: 24px;
    text-align: center;
    color: #ffffff;
    font-size: 15px;
  }
}
</style>
