<template>
  <div class="form-row">
    <div class="label">
      <span class="key">{{ name }}</span>
      <van-cell-group>
        <van-field v-model="value" readonly :placeholder="placeholder" @click="openBirthday" />
        <van-icon v-if="!isDisable" class="husy" name="arrow" size="0.28rem" />
      </van-cell-group>
    </div>
    <!-- birthday -->
    <van-popup v-model="showBirthday" position="bottom" :style="{ height: '50%' }">
      <div class="borderTwo">
        <van-datetime-picker v-model="currentDate" title="选择日期" type="date" :min-date="minDate" :max-date="maxDate" @confirm="confirmBirthday" @cancel="cancelBirthday" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin';

export default {
  mixins: [mixin],
  data() {
    return {
      showBirthday: false,
      minDate: new Date('1940/01/01'),
      maxDate: new Date(),
      currentDate: new Date(),
      showAge: false,
      columns: [],
      defaultIndex: 12,
      isDisableShow: '',
    };
  },
  watch: {
    value(val) {
      this.currentDate = val ? new Date(val) : new Date();
    },
  },
  created() {
    const curDate = new Date();
    this.currentDate = new Date(curDate.getFullYear() - this.extendValue, curDate.getMonth(), curDate.getDate());
  },
  methods: {
    // 年龄计算
    dateCompute(age, type) {
      const curDate = new Date();
      const month = `0${curDate.getMonth() + 1}`;
      const d = type === 'min' ? `0${curDate.getDate()}` : `0${curDate.getDate() + 1}`;
      const Y = curDate.getFullYear() - age;
      const M = month.substring(month.length - 2, month.length);
      const D = d.substring(d.length - 2, d.length);
      const newDate = new Date(Y, M, D);
      return newDate;
    },
    // 生日区间管控
    birthdaySection() {
      let t = null;
      let objs = null;
      if (this.extendField === 'insuredAge') {
        t = 1;
      } else if (this.extendField === 'applicantAge') {
        t = 0;
      }
      this.controlInfos &&
        this.controlInfos.filter((a) => {
          if (a.insuranceRole === t) {
            objs = a;
            return objs;
          }
        });
      if (!objs) {
        this.minDate = this.dateCompute(81, 'max');
      } else {
        this.maxDate = objs.regionMin === 0 ? new Date() : this.dateCompute(objs.regionMin, 'min');
        this.minDate = this.dateCompute(objs.regionMax + 1, 'max');
      }
      this.$nextTick(() => {
        const curDate = new Date();
        const NM = curDate.getDate() < 10 ? `0${curDate.getDate()}` : curDate.getDate();
        const OM = this.currentDate.getDate() < 10 ? `0${this.currentDate.getDate()}` : this.currentDate.getDate();
        const N = `${curDate.getMonth()}${NM}`;
        const O = `${this.currentDate.getMonth()}${OM}`;
        if (this.currentDate) {
          if (N - O < 0) {
            this.currentDate = new Date(curDate.getFullYear() - this.extendValue - 1, this.currentDate.getMonth(), this.currentDate.getDate());
          } else {
            this.currentDate = new Date(curDate.getFullYear() - this.extendValue, this.currentDate.getMonth(), this.currentDate.getDate());
          }
        } else {
          this.currentDate = new Date(curDate.getFullYear() - this.extendValue, curDate.getMonth(), curDate.getDate());
        }
      });
    },
    // 开启生日弹窗
    openBirthday() {
      if (this.isDisable) return;
      this.birthdaySection();
      this.showBirthday = true;
    },
    // 确定生日
    confirmBirthday(value) {
      const currentDate = this._fmtDate(value);
      let age = this._computedAge(value);

      this.$emit('changeValue', this.field, currentDate);
      this.$emit('changeValue', this.extendField, age);

      this.$nextTick(() => {
        --age;
        this.defaultIndex = age;
      });
      this.showBirthday = false;
    },
    // 取消生日
    cancelBirthday() {
      this.showBirthday = false;
    },
    // 计算年龄
    _computedAge(selDate) {
      const curDate = new Date();
      let age = 0;
      const NM = curDate.getDate() < 10 ? `0${curDate.getDate()}` : curDate.getDate();
      const DM = selDate.getDate() < 10 ? `0${selDate.getDate()}` : selDate.getDate();
      const n = `${curDate.getMonth()}${NM}`;
      const d = `${selDate.getMonth()}${DM}`;
      if (curDate.getFullYear() === selDate.getFullYear()) {
        age = 0;
      } else {
        if (n - d >= 0) {
          age = curDate.getFullYear() - selDate.getFullYear();
        } else {
          age = curDate.getFullYear() - selDate.getFullYear() - 1;
        }
      }
      return age;
    },
    _toDate(str) {
      str = str.replace(/-/g, '/');
      return new Date(str);
    },
    _fmtDate(date) {
      // 北京时间转化成标准格式的 年月日
      // '2018-04-25'
      if (date) {
        const y = date.getFullYear();
        const m = `0${date.getMonth() + 1}`;
        const d = `0${date.getDate()}`;
        return `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`;
      } else {
        return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import './mixin.scss';
.form-row {
  border-bottom: 1px solid $border_color;
}
// 下拉框
.drawdown {
  position: relative;
  text-align: right;
  height: 0.6rem;
  .drawdown_text {
    margin-right: 0.2rem;
  }
  &.calendar {
    display: inline-flex;
    align-items: center;
    // width: 2.24rem;
    justify-content: flex-end;
    color: $input_val_color;
    // border-left: 1px solid $border_color;
    .placeholder {
      color: $input_default_color;
    }
  }
  &.age {
    display: inline-flex;
    align-items: center;
    color: $input_val_color;
    margin-right: 0.3rem;
    .placeholder {
      color: $input_default_color;
    }
  }
  .van-icon {
    color: $input_default_color;
  }
}
/deep/ .van-popup {
  border-radius: 0.24rem 0.24rem 0 0;
}
.label {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
  /deep/ .van-cell-group {
    background-color: #fff;
    display: flex;
    align-items: center;
  }
  /deep/ .van-field__control {
    text-align: right;
  }
}
</style>
