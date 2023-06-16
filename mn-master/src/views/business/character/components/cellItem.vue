<template>
  <div class="item-container">
    <div class="title">
      {{ currentItem.title }}
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
            <span class="custom-title" :style="{ color: item.id === currentItem.answer ? '#00C5CD' : '#333333' }">{{ item.content }} </span>
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
import { debounce } from '@/utils/util';
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
    };
  },
  methods: {
    // 选择答案
    choseAnswer(val) {
      console.log(val.num, '选择答案-val', val.questionId, val);
      if (val.num) {
        this.currentItem.answer = val.id;
        if (!this.wxUserInfo.openid) {
          if (this.currentItem.answer) {
            setTimeout(() => {
              if (this.currentItem.answer) {
                this.$emit('autoJump', val);
              }
              // else {
              //   this.$toast('请选择一个选项');
              // }
            }, 200);
          } else {
            this.$toast('请选择一个选项');
            return;
          }
        } else {
          if (this.questionArr.length === this.currentNum && val.id === this.lastVal.id) {
            return;
          }
          debounce(() => {
            const param = {
              agentId: this.agentId,
              baseInfoId: this.id,
              openId: this.wxUserInfo.openid || 'o6Bw_v1kZJ3dL3FkhSHSjQAaEKws',
              nickname: this.wxUserInfo.nickname || '11',
              headImgUrl: this.wxUserInfo.headimgurl || 'https://thirdwx.qlogo.cn/mmopen/vi_32/s6ZNWibMsQIxO5Clxe3pX52njZrVoIicQy0O90d2Unxog2fz1uA5Hz0hs1M4IKYBCcl4EibvsQDb5IPgzlsSTqIdg/132',
              questionId: val.questionId + '',
              questionOptionsId: val.id,
            };
            console.log('选择答案-param', param);
            this.$store.dispatch('character/saveUserAnswerQuestion', param).then((res) => {
              if (res.code === 200 && res.data) {
                console.log('当前题目', this.currentItem);
                if (this.currentItem.answer) {
                  this.$emit('autoJump', val);
                } else {
                  this.$toast('请选择一个选项');
                  return;
                }
              } else {
                console.log('保存失败');
              }
            });
            this.lastVal = val;
          }, 300)();
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
    font-size: 22px;
    color: #333333;
    font-weight: 400;
    padding-left: 20px;
    margin-bottom: 15px;
  }
  .cellStyle {
    color: #00c5cd;
    background-color: #f0fcfc !important;
  }
}
::v-deep .van-cell {
  min-height: 60px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  .van-cell__title {
    font-size: 15px;
    color: #333333;
    opacity: 1;
  }
  .van-radio__icon--checked .van-icon {
    background-color: #00c5cd;
    border-color: #00c5cd;
  }
}
</style>
