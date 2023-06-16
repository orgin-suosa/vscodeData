<!--  -->
<template>
  <div class="fortuneTestContent">
    <div class="total">
      <p>
        已参与人数<span>({{ total }})</span>
      </p>
    </div>
    <div class="content" v-if="list.length > 0">
      <van-list v-model="loading" :finished="finished" finished-text="" :immediate-check="false" @load="getList">
        <ul class="userList">
          <li v-for="(item, i) in list" :key="i">
            <div class="userLeft">
              <img v-if="item.headImgUrl" class="defaultAvatar" :src="item.headImgUrl" @error="imgError(item)" alt="" />
              <img v-else class="defaultAvatar" src="@/assets/images/default-avatar.png" @error="imgError(item)" alt="" />
              <div>
                <p>{{ item.name }}</p>
                <p class="default-text">{{ item.mobile }}</p>
              </div>
            </div>
            <div class="userRight">
              <p class="default-text nowTime">{{ item.updatedTime }}</p>
              <div class="userButton">
                <p class="resultsButton" @click="showResults(item.id)"><span>测评结果</span></p>
                <p class="EvaluationButton" @click="showEvaluation(item.id)"><span>测评情况</span></p>
              </div>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
    <Ndata v-else />
    <popup-results :result="result" ref="popupResults"></popup-results>
    <popup-evaluation :form="form" ref="popupEvaluation"></popup-evaluation>
  </div>
</template>

<script>
import { getGoldInfoList, getGoldwPopupEvaluation, getGoldPopupResult } from '@/api/fortune';
import Ndata from '@/components/ndata.vue';
import PopupEvaluation from './popupEvaluation';
import PopupResults from './popupResults';
export default {
  name: 'FortuneTest',
  // 监听属性 类似于data概念
  components: {
    PopupEvaluation,
    PopupResults,
    Ndata,
  },
  data() {
    // 这里存放数据
    return {
      loading: false,
      finished: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      list: [],
      showAsyncResults: false,
      showAsyncEvaluation: false,
      form: {
        addressBookNumber: '',
        employeeNumber: '',
        realEstateArea: '',
        fiftyThousand: '',
        fiftyToHundredThousand: '',
        hundredToThreeHundredThousand: '',
        threeHundredThousand: '',
        changeJob: '',
      },
      result: {
        name: '',
        referrerName: '',
        incomePersonage: '',
        incomeCompany: '',
        a: '',
        b: '',
        c: '',
        e: '',
        allowanceAward: '',
        dcompany: '',
        dpersonage: '',
      },
      autoheight: { maxHeight: 90 },
    };
  },
  watch: {
    result(val) {
      console.log('测评结果 数据处理', val);
    },
    form(val) {
      console.log('测评情况 数据处理', val);
    },
  },
  // 监控data中的数据变化
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    imgError(item) {
      console.log('imgError,', item);
      item.headImgUrl = require('@/assets/images/default-avatar.png');
    },
    getList() {
      this.loading = true;
      this.finished = false;
      const params = { pageIndex: this.pageIndex, pageSize: this.pageSize };
      getGoldInfoList(params)
        .then((res) => {
          console.log(res, 'list ---------------');
          if (res.code == 200 && res.data.list) {
            this.loading = false;
            this.total = res.data.total;
            this.list = this.list.concat(res.data.list ? res.data.list : []);
            if (this.pageSize * this.pageIndex >= this.total) {
              this.finished = true;
            } else {
              this.pageIndex += 1;
            }
          } else {
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err, '财富金矿分页错误');
          this.loading = false;
          this.finished = true;
          this.$toast('请求错误！');
        });
    },
    showResults(id) {
      console.log('id:', id);
      this.$refs.popupResults.showFortuneResults = true;
      const params = { id: id };
      getGoldPopupResult(params)
        .then((res) => {
          console.log(res, 'list ---------------');
          if (res.code == 200) {
            this.result = res.data;
          }
        })
        .catch((err) => {
          console.log(err, '测评结果');
          this.$toast('请求错误！');
        });
    },
    showEvaluation(id) {
      console.log('id:', id);
      this.$refs.popupEvaluation.showFortuneEvaluation = true;

      const params = { id: id };
      getGoldwPopupEvaluation(params)
        .then((res) => {
          console.log(res, 'list ---------------');
          if (res.code == 200) {
            this.form = res.data;
          }
        })
        .catch((err) => {
          console.log(err, '测评情况');
          this.$toast('请求错误！');
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../style/fortuneTest.scss';
.total {
  width: 100%;
  height: 8vh;
  padding: 0 15px;
  box-sizing: border-box;
  background: #fff;
  margin-bottom: 10px;
  position: fixed;
  top: 0;
  left: 0;
  p {
    padding-top: 3.3vh;
    color: #333;
    font-size: 14px;
  }
}
.content {
  margin-bottom: 20px;
}
</style>
