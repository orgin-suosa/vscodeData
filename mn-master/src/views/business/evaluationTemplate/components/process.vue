<!-- Process -->
<template>
  <div class="process">
    <div class="process-info">
      <div class="process-name">测评进度:</div>
      <div class="process-count-wrapper">
        <div class="process-cur">{{ cur }}</div>
        <div class="process-total">/{{ total }}</div>
      </div>
    </div>
    <div class="process-bar">
      <div class="process-completed" :style="{ width: process + '%' }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Process',
  props: {
    currentNum: {
      type: Number,
      default: 1,
    },
    totalNum: {
      type: Number,
      default: 1,
    },
    questionArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      process: 0,
    };
  },
  computed: {
    cur() {
      return this.currentNum;
    },
    total() {
      return this.totalNum;
    },
    answerList() {
      return this.questionArr;
    },
  },
  watch: {
    cur(val, oldVal) {
      console.log('process:val, oldVal', val, oldVal);
      if (val !== oldVal && this.total != 0) {
        this.process = parseInt((val / this.total) * 100);
        console.log(this.process, 'process:');
        if (val === this.total && this.answerList.length === this.total) {
          this.process = 100;
        }
      }
    },
    total(val, oldVal) {
      if (val !== oldVal && this.total != 0) {
        this.process = parseInt((this.cur / val) * 100);
      }
    },
    answerList: {
      handler() {
        console.log(this.answerList, 'watchList');
        if (this.cur === this.total && this.answerList.length === this.total) {
          this.process = 100;
        }
      },
      deep: true,
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
$bar-height: 8px;
.process {
  .process-info {
    font-size: 15px;
    font-weight: 500;
    height: 21px;
    line-height: 21px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    display: flex;
    .process-name {
      color: #666666;
    }
    .process-count-wrapper {
      display: flex;
      margin-left: 4px;
      .process-cur {
        color: #039d66;
      }
      .process-total {
        color: #343434;
      }
    }
  }
  .process-bar {
    height: $bar-height;
    width: 100%;
    border-radius: $bar-height/2;
    background-color: #fff;
    position: relative;
    margin-top: 10px;
    // border: 1px solid #eeeeee;
    .process-completed {
      position: absolute;
      top: 0;
      left: 0;
      max-width: 100%;
      height: $bar-height;
      border-radius: $bar-height/2;
      background: linear-gradient(270deg, #29c38c, #009c64);
      transition: width 0.8s linear;
    }
  }
}
</style>
