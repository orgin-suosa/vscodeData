<template>
  <div class="form-row form-age">
    <van-cell-group class="label">
      <span class="key">{{ name }}</span>
      <div class="value">
        <div class="age drawdown" @click="openAge">
          <!-- <span class="drawdown_text"> {{ extendValue }} </span> -->
          <van-field v-model="ageValue" :placeholder="placeholder" readonly />
          <!-- <span class="unit">岁</span> -->
          <van-icon v-if="!isDisable" :class="{ act: showAge }" name="arrow" size="0.28rem" />
        </div>
      </div>
    </van-cell-group>

    <!-- age -->
    <van-popup v-model="showAge" position="bottom" :style="{ height: '50%' }">
      <div class="borderTwo"><van-picker show-toolbar title="选择年龄" :columns="columns" value-key="text" :default-index="defaultIndex" @confirm="confirmAge" @cancel="cancelAge" /></div>
    </van-popup>
  </div>
</template>
<script>
export default {
  name: "Age",
  props: {
    name: {
      type: String,
      default: '',
    },
    extendField: {
      type: String,
      default: '',
    },
    extendValue: {
      type: Number,
      default: 0,
    },
    placeholder: {
      type: String,
      default: '',
    },
    isDisable: {
      type: Boolean,
    },

  },
  data() {
    return {
      currentDate: null,
      showAge: false,
      columns: [],
      defaultIndex: 12,
      ageValue: this.extendValue,
    };
  },
  watch: {
    ageValue(val) {
      this.ageValue = val;
    },
  },
  created() {
    this.ageValue = this.extendValue;
    console.log("extendField", this.extendField, "extendValue", this.extendValue);
    // this.ageText = this.defaultAge;
    const columnsLength = 65;
    const columns = [];
    for (let i = 18; i <= columnsLength; i++) {
      const obj = {
        text: i + '岁',
        age: i,
      };
      columns.push(obj);
    }
    this.columns = columns;
  },
  methods: {
    // 提交年龄
    confirmAge(row) {
      // val += 1;
      console.log("提交年龄:", row);
      console.log("提交年龄:", this.extendField, row.age);
      this.ageValue = row.age;
      this.$emit('changeValue', this.extendField, row.age);
      // this.$store.commit('mutationsReduceOneselfAge', row.age);
      this.showAge = false;
    },
    // 开启年龄弹窗
    openAge() {
      if (this.isDisable) return;
      //   this.ageSection();
      for (const k in this.columns) {
        if (this.columns[k].age === this.extendValue) {
          this.defaultIndex = k;
        }
      }
      // this.defaultIndex = this.extendValue;
      this.showAge = true;
    },
    // 取消年龄
    cancelAge() {
      this.showAge = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import './mixin.scss';
// 下拉框
.drawdown {
  position: relative;
  text-align: right;
  height: 0.6rem;
  .drawdown_text {
    margin-right: 0.2rem;
  }
  &.age {
    display: inline-flex;
    align-items: center;
    color: $input_val_color;
    .placeholder {
      color: $input_default_color;
    }
  }
  .van-icon {
    color: $input_default_color;
  }
}
.unit {
  position: relative;
  top: -0.02rem;
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
