<template>
  <div class="item-container">
    <div class="title">
      <span>{{ currentNum }}、 </span> {{ currentItem.title }}
    </div>
    <van-radio-group v-model="currentItem.answer">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in currentItem.options"
          :key="index"
          :style="{ background: backgroundColor ? backgroundColor : '#ffffff' }"
          :class="{ cellStyle: item.id === currentItem.answer }"
          clickable
          @click="choseAnswer(item)"
        >
          <template #title>
            <span class="custom-title" :style="{ color: item.id === currentItem.answer ? '#009c64' : '#333333' }">{{ item.content }} </span>
          </template>
          <template #right-icon>
            <van-radio :name="`${item.id}`" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </div>
</template>
<script>
// import { debounce } from '@/utils/util';
export default {
  name: 'CellItem',
  props: {
    currentItem: {
      type: Object,
      default: () => {
        return {
          id: '',
          answer: '',
          title: '',
          options: [],
        };
      },
    },
    currentNum: {
      type: Number,
      default: 1,
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    agentId: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    wxUserInfo: {
      type: Object,
      default: () => {},
    },
    questionArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      lastVal: {},
      timer: null,
    };
  },
  created() {},
  methods: {
    isAPP(val) {
      const that = this;
      if (this.currentItem.answer) {
        if (this.questionArr.length === this.currentNum && val.id === this.lastVal.id) {
          return;
        }
        if (this.questionArr.length === this.currentNum && val.id === this.lastVal.id) {
          return;
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(function() {
          const param = {
            agentId: that.agentId,
            baseInfoId: that.id,
            questionId: val.questionId + '',
            questionOptionsId: val.id,
          };

          console.log('选择答案-param', param);
          that.$store.dispatch('challenge/saveAppAnswerQuestion', param).then((res) => {
            if (res.code === 200 && res.data) {
              console.log('当前题目-isAPP', that.currentItem);
              if (that.currentItem.answer) {
                that.$emit('autoJump', val);
              }
            } else {
              console.log('保存失败');
            }
          });
          that.lastVal = val;
        }, 400);
      } else {
        this.$toast('请选择一个选项');
        return;
      }
    },
    isWx(val) {
      if (this.questionArr.length === this.currentNum && val.id === this.lastVal.id) {
        return;
      }
      const that = this;
      clearTimeout(this.timer);
      this.timer = setTimeout(function() {
        const param = {
          agentId: that.agentId,
          baseInfoId: that.id,
          openId: that.wxUserInfo.openid || '',
          nickname: that.wxUserInfo.nickname || '',
          headImgUrl: that.wxUserInfo.headimgurl || 'https://thirdwx.qlogo.cn/mmopen/vi_32/s6ZNWibMsQIxO5Clxe3pX52njZrVoIicQy0O90d2Unxog2fz1uA5Hz0hs1M4IKYBCcl4EibvsQDb5IPgzlsSTqIdg/132',
          questionId: val.questionId + '',
          questionOptionsId: val.id,
        };
        console.log('选择答案-param', param);
        that.$store.dispatch('challenge/saveUserAnswerQuestion', param).then((res) => {
          if (res.code === 200 && res.data) {
            console.log('当前题目-isWx', that.currentItem);
            if (that.currentItem.answer) {
              that.$emit('autoJump', val);
            } else {
              that.$toast('请选择一个选项');
              return;
            }
          } else {
            console.log('保存失败');
          }
        });
        that.lastVal = val;
      }, 400);
    },
    // 选择答案
    choseAnswer(val) {
      console.log(val.num, '选择答案-val', val.questionId, val);
      if (val.num) {
        this.currentItem.answer = val.id;
        if (!this.wxUserInfo.openid) {
          this.isAPP(val);
        } else {
          this.isWx(val);
        }
      } else {
        this.$toast('请选择一个选项');
        return;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.item-container {
  .title {
    font-size: 0.3rem;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #333333;
    padding-left: 20px;
    margin-bottom: 15px;
  }
  .cellStyle {
    color: rgba(0, 156, 100, 1);
    background-color: rgba(0, 156, 100, 0.1) !important;
  }
}
::v-deep .van-radio-group {
  width: 6.9rem;
  margin: 0 auto;
  background: #ffffff;
  border: 0.02rem solid #eeeeee;
  border-radius: 0.18rem;
  overflow: hidden;
  .van-cell {
    min-height: 60px;
    display: flex;
    align-items: center;
    padding: 0.25rem 0.3rem;
    border-bottom: 0.01rem solid #eeeeee;
    .van-cell__title {
      font-size: 15px;
      color: #333333;
      opacity: 1;
      width: 91%;
      margin-left: 0.7rem;
    }
    .van-radio {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      margin: 0 0.3rem;
    }
    .van-radio__icon--checked .van-icon,
    .van-checkbox__icon--checked .van-icon {
      background-color: #ffffff;
      border-color: #009c64;
      border: 0.12rem solid #009c64;
    }
    &::after {
      border-bottom: 0 solid #ebedf0;
    }
  }
  .van-cell:last-child {
    border-bottom: 0;
  }
  .van-icon-success::before {
    content: '';
  }
}
</style>
