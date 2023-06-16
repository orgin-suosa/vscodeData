<template>
  <div :class="isFocus && isAndroid ? 'fromCard isAndroid' : 'fromCard'">
    <div class="fromTable">
      <van-form validate-first @failed="onFailed" :fromTable="fromTable" >
        <!-- 通过 pattern 进行正则校验 -->
        <van-cell-group class="preTaxWages">
            <p class="van-cell-group-left">
              <span class="key">税前月工资 (元)</span>
              <span class="mask" @click="helpTip(0)"></span>
            </p>
            <van-field
            type="number"
            v-model="fromTable.preTaxWages"
            name="fromTable.preTaxWages"
            placeholder="请输入"
            autocomplete='off'
            clearable
            @input="changeAppFormData('preTaxWages',fromTable.preTaxWages)"
            @blur="blurmatter('preTaxWages')"
            :formatter="formatter"
            maxlength="7"
            :rules="[{ required: true, message: '请填写完完整信息' }]"
          />
                  <!-- :rules="[{ pattern, message: '大于0数字;最多支持小数点后2位' }]" -->
        </van-cell-group>
        <van-cell-group>
          <p class="van-cell-group-left">
            <span class="key">本市职工上年度月平均工资 (元)</span>
            <span class="mask" @click="helpTip(1)"></span>
          </p>
          <van-field
          type="number"
          v-model="fromTable.lastAverageWage"
          name="lastAverageWage"
          placeholder="请输入"
          autocomplete='off'
          clearable
          @input="changeAppFormData('lastAverageWage',fromTable.lastAverageWage)"
          @blur="blurmatter('lastAverageWage')"
          :formatter="formatter"
          maxlength="7"
          :rules="[{ required: true, message: '请填写完完整信息' }]"
        />
        </van-cell-group>
        <age
        class="oneselfAge"
        :extend-value="fromTable.oneselfAge"
        name="年龄（岁）"
        field="oneselfAge"
        extend-field="oneselfAge"
        :ageText="fromTable.oneselfAge"
        placeholder="请选择"
        @changeValue="changeAppFormData"
      />
      <retireAge
      class="retireAge"
        :extend-value="fromTable.retireAge"
        name="预计退休年龄（岁）"
        field="retireAge"
        extend-field="retireAge"
        :ageText="retireAge"
        placeholder="请选择"
        @changeValue="changeAppFormData"
      />

        <van-cell-group>
          <p class="van-cell-group-left">
            <span class="key">帐户累积养老金额 (元) </span>
            <span class="mask" @click="helpTip(2)"></span>
          </p>
          <van-field
          v-model="fromTable.accumulatedPension"
          type="number"
          name="accumulatedPension"
          placeholder="请输入"
          autocomplete='off'
          clearable
          @input="changeAppFormData('accumulatedPension',fromTable.accumulatedPension)"
          :formatter="formatter"
          @blur="blurmatter('accumulatedPension')"
          @focus="addInputTop"
          maxlength="7"
          :rules="[{ required: true, message: '请填写完完整信息' }]"
        />
        </van-cell-group>
        <van-cell-group>
          <p class="van-cell-group-left">
            <span class="key">养老金缴费比例%</span>
            <span class="mask" @click="helpTip(3)"></span>
          </p>
          <van-field
          v-model="fromTable.pensionRatio"
          type="number"
          name="pensionRatio"
          placeholder="请输入"
          autocomplete='off'
          clearable
          @input="changeAppFormData('pensionRatio',fromTable.pensionRatio)"
          :formatter="formatter"
          @blur="blurmatter('pensionRatio')"
          @focus="addInputTop"
          maxlength="3"
          :rules="[{ required: true, message: '请填写完完整信息' }]"
        />
        <span class="unit">%</span>
        </van-cell-group>
        <van-cell-group>
          <span class="key">个人工资增长率%</span>
          <van-field
          v-model="fromTable.wageGrowthRate"
          type="number"
          name="wageGrowthRate"
          placeholder="5"
          autocomplete='off'
          clearable
          @input="changeAppFormData('wageGrowthRate',fromTable.wageGrowthRate)"
          :formatter="formatter"
          @blur="blurmatter('wageGrowthRate')"
          @focus="addInputTop"
          maxlength="3"
          :rules="[{ required: true, message: '请填写完完整信息' }]"
        />
        <span class="unit">%</span>
        </van-cell-group>
        <van-cell-group>
          <span class="key">本市职工工资增长率%</span>
          <van-field
          v-model="fromTable.wageGrowthRateCity"
          type="number"
          name="wageGrowthRateCity"
          placeholder="3"
          autocomplete='off'
          clearable
          @input="changeAppFormData('wageGrowthRateCity',fromTable.wageGrowthRateCity)"
          :formatter="formatter"
          @blur="blurmatter('wageGrowthRateCity')"
          @focus="addInputTop"
          maxlength="3"
          :rules="[{ required: true, message: '请填写完完整信息' }]"
        />
        <span class="unit">%</span>
        </van-cell-group>
        <van-cell-group class="retirementSalary">
          <span class="key">期望退休后每月生活水平 (元）</span>
          <van-field
          v-model="fromTable.retirementSalary"
          type="number"
          name="retirementSalary"
          placeholder="请输入"
          autocomplete='off'
          clearable
          @input="changeAppFormData('retirementSalary',fromTable.retirementSalary)"
          :formatter="formatter"
          @blur="blurmatter('retirementSalary')"
          @focus="addInputTop"
          maxlength="7"
          :rules="[{ required: true, message: '请填写完完整信息' }]"
        />
        </van-cell-group>
      </van-form>
    </div>
    <van-popup class="tip-popup" v-model="showTip">
      <div class="tip">
        <p class="tip-title">{{ tipObject[tipIndex].title }}</p>
         <p class="tip-text">{{ tipObject[tipIndex].text }}</p>
      </div>
      <div @click="closeTip" class="tip-button">知道了</div>
    </van-popup>
  </div>
</template>

<script>
import Age from '@/components/insuranceUI/gs-age.vue';
import RetireAge from '@/components/insuranceUI/gs-retireAge.vue';
export default {
  name: 'AppModel',
  components: {
    Age,
    RetireAge,
  },
  props: {
    appModelDate: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      retireAge: null, // 预计退休年龄（岁）
      fromTable: {
        preTaxWages: '', // 税前月工资(元）
        lastAverageWage: '', // 本市职工上年度月平均工资(元）
        oneselfAge: null, // 年龄（岁）
        retireAge: null, // 预计退休年龄（岁）
        accumulatedPension: '', // 帐户累积养老金额
        pensionRatio: '', // 养老金缴费比例
        wageGrowthRate: '5', // 个人工资增长率
        wageGrowthRateCity: '3', // 本市职工工资增长率
        retirementSalary: '', // 期望退休后每月生活水平
      },
      value2: '',
      value3: '',
      templateData: { },
      showTip: false,
      tipIndex: 0,
      pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,
      tipObject: [
        {
          title: '税前月工资',
          text: '建议您按实际社保缴纳基数填写'
        },
        {
          title: '本市职工上年度月平均工资',
          text: '您可通过百度查询所在城市的平均月工资'
        },
        {
          title: '帐户累积养老金额',
          text: '您可到当地社保部门查询具体数额'
        },
        {
          title: '养老金缴费比例',
          text: '个人缴费比例+企业缴费比例'
        },
      ],
      isAndroid: false,
      isFocus: false
    };
  },
  created() {
    console.log("appModelDate:", this.appModelDate, JSON.stringify(this.appModelDate) == '{}');
    this.oldAgePensionCacheCode();
    if (/(Android)/i.test(navigator.userAgent)) {
      this.isAndroid = true;
    }
  },
  methods: {
    oldAgePensionCacheCode() {
      if (JSON.stringify(this.appModelDate) == '{}') return;
      this.fromTable = this.appModelDate;
      console.log("oldAgePensionState:", this.fromTable);
    },
    formatter(val) {
      // 过滤输入的数字
      console.log("过滤输入的数字", val, val == "");
      const len1 = val.substr(0, 1);
      const len2 = val.substr(1, 1);
      const lenLast = val.substr(val.length - 1);
      const number = /^[0-9]+.?[0-9]*$/; // 判断字符串是否为数字
      // 如果第一位是0，第二位不是点，就用数字把点替换掉
      if (val.length > 1 && len1 == 0 && len2 != ".") {
        val = val.substr(1, 1);
      }
      if (number.test(len1) && len2 == "." && val.length > 4) {
        val = val.substr(0, 4);
      }
      // 第一位不能是.
      if (len1 == ".") {
        val = "";
      }
      // 最后一位不能是.
      if (val.length == 8 && lenLast == ".") {
        val = "";
      }
      // 限制只能输入一个小数点
      if (val.indexOf(".") != -1) {
        var str_ = val.substr(val.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
          val = val.substr(0, val.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      // 正则替换
      val = val.replace(/[^\d^\.]+/g, ''); // 保留数字和小数点
      val = val.replace(/\.\d\d\d$/, ''); // 小数点后只能输两位
      return val;
    },
    blurmatter(key) {
      this.isFocus = false;
      console.log("输入完成验证是否为0", this.fromTable.preTaxWages, this.fromTable.preTaxWages == "");
      if (key === "preTaxWages") {
        // 税前月工资(元）
        if (this.fromTable.preTaxWages <= 0 || this.fromTable.preTaxWages == "-") {
          this.fromTable.preTaxWages = "";
        }
        console.log(this.fromTable.preTaxWages, '税前月工资-appModel');
      } else if (key === "lastAverageWage") {
        // 本市职工上年度月平均工资(元）
        if (this.fromTable.lastAverageWage <= 0 || this.fromTable.lastAverageWage == "-") {
          this.fromTable.lastAverageWage = "";
        }
        console.log(this.fromTable.lastAverageWage, '本市职工上年度月平均工资-appModel');
      } else if (key === "accumulatedPension") {
        // 帐户累积养老金额
        if (this.fromTable.accumulatedPension <= 0 || this.fromTable.accumulatedPension == "-") {
          this.fromTable.accumulatedPension = "";
        }
        console.log(this.fromTable.accumulatedPension, '帐户累积养老金额-appModel');
      } else if (key === "pensionRatio") {
        // 养老金缴费比例
        if (this.fromTable.pensionRatio <= 0 || this.fromTable.pensionRatio == "-") {
          this.fromTable.pensionRatio = "";
        }
        console.log(this.fromTable.pensionRatio, '养老金缴费比例-appModel');
      } else if (key === "wageGrowthRate") {
        // 个人工资增长率
        if (this.fromTable.wageGrowthRate <= 0 || this.fromTable.wageGrowthRate == "-") {
          this.fromTable.wageGrowthRate = "";
        }
        this.removeInputTop();
        console.log(this.fromTable.wageGrowthRate, '个人工资增长率-appModel');
      } else if (key === "wageGrowthRateCity") {
        // 本市职工工资增长率
        if (this.fromTable.wageGrowthRateCity <= 0 || this.fromTable.wageGrowthRateCity == "-") {
          this.fromTable.wageGrowthRateCity = "";
        }
        this.removeInputTop();
        console.log(this.fromTable.wageGrowthRateCity, '本市职工工资增长率-appModel');
      } else if (key === "retirementSalary") {
        // 期望退休后每月生活水平
        if (this.fromTable.retirementSalary <= 0 || this.fromTable.retirementSalary == "-") {
          this.fromTable.retirementSalary = "";
        }
        this.removeInputTop();
        console.log(this.fromTable.retirementSalary, '期望退休后每月生活水平-appModel');
      }
    },
    changeAppFormData(key, val) {
      if (key === "oneselfAge") {
        this.fromTable.oneselfAge = val;
        console.log(this.fromTable.oneselfAge, '年龄（岁）-appModel');
      } else if (key === "retireAge") {
        this.fromTable.retireAge = val;
        console.log(this.fromTable.retireAge, '预计退休年龄（岁）-appModel');
      } else {
        console.log("changeAppFormData", val);
        if (val == "" || val == undefined) return;
      }
      console.log(key, val, 'changeAppFormData-appModel');
      console.log("changeAppFormData-fromTable", this.fromTable);
      this.$emit('changeAppFormData', 'fromTable', this.fromTable);
      // this.$store.commit('mutationsReduceOldAgePension', this.fromTable);
    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo);
    },
    closeTip() {
      this.showTip = false;
    },
    helpTip(index) {
      this.tipIndex = index;
      this.showTip = true;
    },
    addInputTop(event) {
      this.isFocus = true;
      const input = event.srcElement;
      // 当前文本框 距离顶部的高度 减去 45即header的高度，当然，这里也可以减去动态计算的高度
      const titleHeight = document.querySelector('.mn-nav-bar').height || 45;
      const LastTop = document.querySelector('.retirementSalary').getBoundingClientRect().top - titleHeight;
      const top = input.getBoundingClientRect().top; // 实时获取当前元素距离窗口距离
      const current = document.querySelector('.container-scroll');
      console.info("addInputTop-top:", top);
      this.$nextTick(() => {
        setTimeout(() => {
          console.info("scrollToBottom-content, top-LastTop:", top, LastTop);
          current.scrollTo(0, top);
          current.scrollTop = top;
        }, 13);
      });
    },
    removeInputTop(event, content) {
      var current = document.querySelector('.container-scroll');
      current.scrollTo(0, 0);
      this.scrollToBottom(current, 0);
    },
    scrollToBottom (content, top) {
      this.$nextTick(() => {
        setTimeout(() => {
          console.log("scrollToBottom-content, top:", content, top);
          content.scrollTo(0, top);
          content.scrollTop = top;
        }, 13);
      });
    }
  },

};
</script>

<style lang="scss" scoped>
.fromCard{
    width: 100%;
    height: 100%;
    .fromTable{
      background-color: #ffffff;
      padding: 10px;
      padding-bottom: 0;
        ::v-deep .van-form{
          .van-cell-group{
            height: 50px;
            line-height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: transparent;
            // border-bottom: 1px solid #eeeeee;
            &-left{
              display: inline-block;
              white-space: nowrap;
              span{
              vertical-align: middle;
              }
            }
            .mask{
                display: inline-block;
                background: url('~@/assets/oldAgePension/mark.png') no-repeat;
                width:22px;
                height: 21px;
                background-size: 18px 18px;
                background-position: center;
                margin-left: 10px;
              }
            &:last-child{
              border-bottom: 0;
            }
            .van-cell{
              // width: 80%;
              padding-left: 0;
              background: transparent;
              .van-field__control{
                font-size: 14px;
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: right;
                color: #333333;
              }
              .van-field__error-message {
                position: absolute;
                 top: 16px;
              }
            }
            .key{
              display: inline-block;
              font-size: 15px;
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              text-align: left;
              color: #333333;
              white-space: nowrap;
            }
            .unit{
              font-size: 14px;
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              text-align: right;
              color: #999999;
            }
          }
          .preTaxWages.van-hairline--top-bottom:first-child::after{
              border-width: 0 0;
            }
        .oneselfAge,.retireAge{
          height: 50px;
          // border-bottom: 1px solid #eeeeee;
        }
        .van-cell::after{
          border-bottom: 0;
        }
     }
    input::-webkit-input-placeholder {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: right;
      color: #999999;
    }
    input:-moz-placeholder {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #999999;
    }
    input::-moz-placeholder {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: right;
      color: #999999;
    }
    input:-ms-input-placeholder {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: right;
      color: #999999;
    }
  }
   ::v-deep .tip-popup {
    width: 288px;
    height: 153px;
    opacity: 1;
    background: #ffffff;
    border-radius: 12px;
    .tip{
      text-align: center;
      &-title{
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 600;
        text-align: center;
        color: #333333;
        padding: 15px 0;
      }
      &-text{
        font-size: 15px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #666666;
      }
      &-button{
        width: 128px;
        height: 41px;
        line-height: 41px;
        margin: 16px auto;
        background: linear-gradient(315deg,#009c64, #29c38c);
        border-radius: 24px;
        box-shadow: 0px 2px 10px 0px rgba(0,156,100,0.30);
        font-size: 15px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
      }
    }
  }
}
.isAndroid{
    padding-bottom: 50px;
}
@media (min-height:790px) {
  .fromCard{
    width: 100%;
    height: 89%;
  }
}
</style>
