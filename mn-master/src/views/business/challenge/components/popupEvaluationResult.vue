<template>
  <div>
    <div class="closeBox" v-if="showPopupEvaluationResult" @click="closeClick">
      <!-- <img class="icon-delete" :src="iconDelete" alt="" /> -->
      <i class="icon-delete"></i>
      <p class="icon-react"></p>
    </div>
    <van-popup class="van-popup-results" v-model="showPopupEvaluationResult">
      <result ref="result"></result>
    </van-popup>
  </div>
</template>

<script>
import Result from './resultText';
export default {
  name: 'PopupEvaluationResult',
  components: {
    Result,
  },
  props: {
    baseInfoId: {
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
    return {
      showPopupEvaluationResult: false,
      iconDelete: require('@/assets/images/delete.png'),
      form: {
        name: '',
        addressBookNumber: '',
        employeeNumber: '',
        realEstateArea: '',
        fiftyThousand: '',
        fiftyToHundredThousand: '',
        hundredToThreeHundredThousand: '',
        threeHundredThousand: '',
        changeJob: '',
      },
    };
  },
  created() {
    console.log('测评结果-agentId:', this.agentId);
    console.log('测评结果-id:', this.id);
  },
  mounted() {},
  methods: {
    closeClick() {
      this.showPopupEvaluationResult = false;
    },
    selectPersonRecordDetail(openId, agentId, baseInfoId, id) {
      // this.$refs.result.getResult(openId, agentId, baseInfoId, id);
      this.$nextTick(() => {
        this.$refs.result.getResult(openId, agentId, baseInfoId, id);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.van-popup-results {
  min-height: 80%;
  max-height: 80%;
  top: 10%;
  transform: translate3d(-50%, 0%, 0);
  /deep/.result-container {
    min-height: calc(100vh - 32vh);
    .result_header,
    .result_content {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
    .text_title,
    .content_text {
      span {
        margin-right: 0.1rem;
      }
    }
    .test-time {
      margin-top: 0.15rem;
    }
  }
}
/deep/.closeBox {
  position: fixed;
  right: 10.5%;
  top: 0%;
  text-align: center;
  z-index: 9999;
  text-align: center;
  .icon-delete {
    width: 0.45rem;
    height: 0.45rem;
    display: inline-block;
    background-image: url('~@/assets/images/delete.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .icon-react {
    width: 0.02rem;
    height: 0.5rem;
    background-color: #ffffff;
    position: absolute;
    top: 78%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
