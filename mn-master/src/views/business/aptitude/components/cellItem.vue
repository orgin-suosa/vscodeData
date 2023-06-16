<template>
  <div class="item-container">
    <div class="title">
      {{ currentItem.title }}
    </div>
    <van-radio-group v-model="currentItem.answer">
      <van-cell-group>
        <van-cell v-for="(item, index) in currentItem.options" :key="index" :class="{ cellStyle: item.num === currentItem.answer }" clickable @click="choseAnswer(item.num)">
          <template #title>
            <span class="custom-title" :style="{ color: item.code === currentItem.answer ? '#00C5CD' : '#333333' }"> {{ item.code }} &nbsp;{{ item.content }} </span>
          </template>
          <template #right-icon>
            <van-radio :name="`${item.num}`" />
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
          problemsId: '',
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
    mobile: {
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
  },
  data() {
    return {};
  },
  methods: {
    // 选择答案
    choseAnswer(val) {
      if (val) {
        this.currentItem.answer = val;
        console.log(val, this.currentItem);
        if (this.$appInterface.getCreateId()) {
          if (this.currentItem.answer) {
            setTimeout(() => {
              if (this.currentItem.answer) {
                this.$emit('autoJump', this.currentItem);
              }
              // else {
              //   this.$toast('请选择一个选项');
              //   return;
              // }
            }, 200);
          } else {
            this.$toast('请选择一个选项');
            return;
          }
          return;
        } else {
          // if (this.questionArr.length === this.currentNum && val.id === this.lastVal.id) {
          //   return;
          // }
          debounce(() => {
            const param = {
              mobile: this.mobile,
              agentId: this.agentId,
              id: this.id,
              list: [{ questionSequence: this.currentNum, optionResult: Number(val) }],
            };
            this.$store.dispatch('sexual/saveExamRecord', param).then((res) => {
              console.log(res);
              if (res.code === 200 && res.data) {
                console.log('当前题目', this.currentItem);
                if (this.currentItem.answer) {
                  this.$emit('autoJump', this.currentItem);
                } else {
                  this.$toast('请选择一个选项');
                  return;
                }
              } else {
                console.log('保存失败');
              }
            });
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
    background-color: #f0fcfc;
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
