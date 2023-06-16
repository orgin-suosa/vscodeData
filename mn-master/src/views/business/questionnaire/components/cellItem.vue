<template>
  <div class="item-container">
    <div :class="currentItem.type == 1 ? 'questionList singleChoice' : 'questionList'" v-if="currentItem.type == 1">
      <div class="title">
        <span>{{ indexNumber + 1 }}、</span>
        <span> {{ currentItem.title }}</span>
        <span class="topicType">(单选)</span>
      </div>
      <van-radio-group v-model="currentItem.answer">
        <van-cell-group>
          <van-cell v-for="(item, index) in currentItem.options" :key="index" :class="{ cellStyle: item.id === currentItem.answer }" clickable disabled @click="choseAnswer(item, index)">
            <template #right-icon>
              <van-radio :name="`${item.id}`" />
            </template>
            <template #title>
              <!-- <span class="custom-title" :style="{ color: item.id === currentItem.answer ? '#009c64' : '#333333' }">{{ item.content }} </span> -->
              <span class="custom-title">{{ item.content }} </span>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div :class="currentItem.erroreMssage.replace(/ /g, '') == '' ? 'erroreMssage displayNone' : 'erroreMssage'">{{ currentItem.erroreMssage }}</div>
    </div>
    <div :class="currentItem.type == 2 ? 'questionList multipleChoice' : 'questionList'" v-if="currentItem.type == 2">
      <div class="title">
        <span>{{ indexNumber + 1 }}、</span>
        <span> {{ currentItem.title }}</span>
        <span class="topicType">(多选)</span>
      </div>
      <van-checkbox-group v-model="currentItem.result">
        <van-cell-group>
          <van-cell v-for="(item, index) in currentItem.list" :key="index" :class="{ cellStyle: item.id === currentItem.answer }" clickable disabled @click="multipleAnswer(item, index)">
            <template #right-icon>
              <van-checkbox :name="item" ref="checkboxes" shape="square" :label-disabled="false" />
            </template>
            <template #title>
              <span class="custom-title">{{ currentItem.listTitle[index] }} </span>
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <div :class="currentItem.erroreMssage.replace(/ /g, '') == '' ? 'erroreMssage displayNone' : 'erroreMssage'">{{ currentItem.erroreMssage }}</div>
    </div>
    <div :class="currentItem.type == 3 ? 'questionList questionImgList' : 'questionList'" v-if="currentItem.type == 3">
      <div class="title">
        <span>{{ indexNumber + 1 }}、</span>
        <span> {{ currentItem.title }}</span>
        <span class="topicType">(多选)</span>
      </div>
      <van-checkbox-group v-model="currentItem.result">
        <van-cell-group>
          <van-cell v-for="(item, index) in currentItem.list" :key="index" :class="{ cellStyle: item.id === currentItem.answer }" clickable disabled @click="multipleAnswer(item, index)">
            <template #right-icon>
              <van-checkbox :name="item" ref="checkboxes" shape="square" />
            </template>
            <template #title>
              <div class="listImgContent">
                <img :src="currentItem.listImg[index]" alt="" srcset="" />
                <span class="custom-title">{{ currentItem.listTitle[index] }} </span>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <div :class="currentItem.erroreMssage.replace(/ /g, '') == '' ? 'erroreMssage displayNone' : 'erroreMssage'">{{ currentItem.erroreMssage }}</div>
    </div>
    <div class="questionList" v-if="currentItem.type == 4">
      <div class="title">
        <span>{{ indexNumber + 1 }}、</span>
        <span> {{ currentItem.title }}</span>
        <span class="topicType">(填空)</span>
      </div>
      <van-field class="editContent" v-model="currentItem.answer" rows="1" autosize label="" type="textarea" maxlength="200" placeholder="最多可输入200字" @change="changeText($event)" />
      <div :class="currentItem.erroreMssage.replace(/ /g, '') == '' ? 'erroreMssage displayNone' : 'erroreMssage'">{{ currentItem.erroreMssage }}</div>
    </div>
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
    indexNumber: {
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
      topicList: [{ list: ['a', 'b', 'c', 'd'], result: [] }],
      selectedAnswer: [],
    };
  },
  methods: {
    // 选择答案
    choseAnswer(val) {
      console.log('num', val.num, '选择答案-questionId', val.questionId, 'val:', val);
      console.log('选择答案-choseAnswer-result', this.currentItem.result);
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
    multipleAnswer(val, index) {
      const num = this.currentItem.options[index].num;
      const thatOption = this.currentItem.options[index];
      console.log('选择答案-多选-val', val, 'index:', index, 'currentItem:', this.currentItem, 'id:', this.currentItem.id);
      console.log('选择答案-多选-num', num, 'type', parseInt(this.currentItem.type), parseInt(this.currentItem.type) != 1);
      console.log('当前选项-thatOption：', thatOption);
      console.log('已选答案列表-selectedAnswer:', this.selectedAnswer);
      if (parseInt(this.currentItem.type) != 1) {
        this.$refs.checkboxes[index].toggle();
        console.log('checkboxes:', !this.$refs.checkboxes[index].checked);
        if (!this.$refs.checkboxes[index].checked) {
          this.selectedAnswer.push(this.currentItem.options[index]);
        } else {
          this.selectedAnswer.splice(
            this.selectedAnswer.findIndex((item) => item.id === this.currentItem.options[index].id),
            1,
          );
        }
      }
      if (num) {
        this.currentItem.answer = this.currentItem.id;
        if (!this.wxUserInfo.openid) {
          if (this.currentItem.answer) {
            setTimeout(() => {
              if (this.currentItem.answer) {
                this.$emit('autoJump', this.selectedAnswer);
              }
              // else {
              //   this.$toast('请选择一个选项');
              // }
            }, 200);
          } else {
            this.$toast('请选择一个选项2');
            return;
          }
        } else {
          if (this.questionArr.length === this.currentNum && thatOption.id === this.lastVal.id) {
            return;
          }
          debounce(() => {
            const param = {
              agentId: this.agentId,
              baseInfoId: this.id,
              openId: this.wxUserInfo.openid || 'o6Bw_v1kZJ3dL3FkhSHSjQAaEKws',
              nickname: this.wxUserInfo.nickname || '11',
              headImgUrl: this.wxUserInfo.headimgurl || 'https://thirdwx.qlogo.cn/mmopen/vi_32/s6ZNWibMsQIxO5Clxe3pX52njZrVoIicQy0O90d2Unxog2fz1uA5Hz0hs1M4IKYBCcl4EibvsQDb5IPgzlsSTqIdg/132',
              questionId: thatOption.questionId + '',
              questionOptionsId: thatOption.id,
            };
            console.log('选择答案-param', param);
            this.$store.dispatch('character/saveUserAnswerQuestion', param).then((res) => {
              if (res.code === 200 && res.data) {
                console.log('当前题目', this.currentItem);
                if (this.currentItem.answer) {
                  this.$emit('autoJump', this.selectedAnswer);
                } else {
                  this.$toast('请选择一个选项3');
                  return;
                }
              } else {
                console.log('保存失败');
              }
            });
            this.lastVal = thatOption;
          }, 300)();
        }
      } else {
        this.$toast('请选择一个选项1');
        return;
      }
    },
    changeText(e) {
      var val = e.target.value;
      console.log(val, this.currentItem);
      this.$emit('autoJump', val);
    },
  },
};
</script>
<style lang="scss" scoped>
.item-container {
  width: 6.9rem;
  margin: 0 auto;
  .title {
    font-size: 0.3rem;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #333333;
    padding-top: 0.4rem;
    padding-bottom: 0.2rem;
    .topicType {
      color: #999999;
      padding-left: 0.15rem;
    }
  }

  .titleText {
    display: inline-block;
    width: 6.9rem;
    font-size: 0.3rem;
    margin: 0 auto;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #666666;
  }
  .cellStyle {
    // color: #009c64;
    // background-color: #f0fcfc !important;
  }
  .custom-title {
    word-break: break-all;
    word-wrap: break-word;
  }
  ::v-deep .van-radio-group,
  ::v-deep .van-cell-group,
  ::v-deep .van-checkbox-group {
    width: 6.9rem;
    background: #ffffff;
    border: 0.02rem solid #eeeeee;
    border-radius: 0.18rem;
    overflow: hidden;
  }
}
.editContent {
  border: 0.02rem solid #eeeeee;
}
::v-deep .van-field__control {
  height: auto !important;
}
::v-deep .van-cell-group {
  .van-cell {
    min-height: 60px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    border-bottom: 0.01rem solid #eeeeee;
    overflow: hidden;
    .van-cell__title {
      font-size: 15px;
      color: #333333;
      opacity: 1;
      width: 84%;
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
  }
  .van-cell:last-child {
    border-bottom: 0;
  }
  .van-icon-success::before {
    content: '';
  }
}
.questionImgList {
  ::v-deep .van-cell-group {
    display: flex;
    flex-wrap: wrap;
    .van-cell {
      min-height: 1.2rem;
      width: 50%;
      padding-top: 0;
      padding-bottom: 0.24rem;
      border-bottom: 0;
      .van-cell__title {
        position: relative;
        left: 0;
        top: inherit;
        transform: translateY(0%);
      }
      .listImgContent {
        img {
          width: 2.8rem;
          height: auto;
          border-radius: 0.25rem;
          overflow: hidden;
        }
      }
      .van-radio__icon--checked .van-icon,
      .van-checkbox__icon--checked .van-icon {
        background-color: rgba(0, 156, 100, 0.5);
        border-color: rgba(0, 156, 100, 0.5);
      }

      .van-radio__icon--checked .van-icon,
      .van-checkbox__icon .van-icon {
        position: absolute;
        left: 0%;
        top: 50%;
        transform: translateY(-68%);
        width: 2.8rem;
        height: 1.4rem;
        border-radius: 0.25rem;
        border: 0;
        overflow: hidden;
      }
      .van-icon::before {
        display: inline-block;
        position: absolute;
        left: 50%;
        top: 12%;
        transform: translate(-40%);
        font-size: 0.9rem;
      }
    }
  }
}
.erroreMssage {
  width: 6.9rem;
  height: 0.72rem;
  line-height: 0.72rem;
  background: rgba(240, 58, 78, 0.14);
  font-size: 0.26rem;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #f03a4e;
  text-indent: 1.4em;
  border-radius: 0.14rem;
  margin-top: 0.18rem;
  display: block;
}
.displayNone {
  display: none;
}
.multipleChoice {
  ::v-deep .van-cell {
    .van-checkbox__icon .van-icon {
      border-radius: 0.1rem;
    }
  }
}
</style>
