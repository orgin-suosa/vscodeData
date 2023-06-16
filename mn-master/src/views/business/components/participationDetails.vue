<!--  -->
<template>
  <div class="participationDetails">
    <div class="total">
      <p>
        已参与人数<span class="totalNumber">({{ total }})</span>
      </p>
    </div>
    <div class="content" v-if="list.length > 0">
      <van-list v-model="loading" :finished="finished" finished-text="" :immediate-check="false" @load="getList">
        <ul class="userList">
          <li v-for="(item, i) in list" :key="i">
            <div class="userLeft">
              <img v-if="item.headImgUrl" class="defaultAvatar" :src="item.headImgUrl" @error="imgError(item)" alt="" />
              <img v-else class="defaultAvatar" src="@/assets/images/default-avatar.png" @error="imgError(item)" alt="" />
              <div class="userContent">
                <p class="userLabel">
                  <span class="userName">{{ item.nickname }}</span>
                  <span class="default-text nowTime">{{ item.updatedTime }}</span>
                </p>
                <p class="default-text" v-if="item.url !='annuity'">{{ item.mobile }}</p>
              </div>
            </div>
            <div class="userRight">
              <!-- <p class="default-text nowTime">{{ item.updatedTime }}</p> -->
              <div class="userButton">
                <p class="answerButton" v-if="item.url != 'annuity'" @click="showResults(item)"><span>答题情况</span></p>
                <p v-if="item.questionResultId !== '0'" class="EvaluationButton" @click="showEvaluation(item)"><span>测评结果</span></p>
              </div>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
    <Ndata v-else />
    <!-- <popup-answer :result="result" ref="popupResults"></popup-answer> -->
    <popup-answer :result="result" ref="popupResults"></popup-answer>
    <popup-evaluation :getResult="getResult" ref="popupEvaluation"></popup-evaluation>
    <popupAnnuity :getResult="getResult" :isParticipate="true" ref="popupAnnuity" />
  </div>
</template>

<script>
import Ndata from '@/components/ndata.vue';
import popupEvaluation from './popupEvaluation';
import popupAnswer from './popupAnswer';
import popupAnnuity from '../components/popupAnnuity.vue';
export default {
  name: 'ParticipationDetails',
  // 监听属性 类似于data概念
  components: {
    popupEvaluation,
    popupAnswer,
    Ndata,
    popupAnnuity,
  },
  data() {
    // 这里存放数据
    return {
      loading: false,
      finished: false,
      agentId: '',
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
      result: { name: '', questionList: [] },
      autoheight: { maxHeight: 90 },
      getResult: {}, // 测试结果
    };
  },
  watch: {
    result(val) {
      console.log('测评结果 数据处理', val);
    },
    getResult(val) {
      console.log('测评情况 数据处理', val);
    },
  },
  // 监控data中的数据变化
  created() {
    this.agentId = this.$appInterface.getCreateId() || '782994890127572992';
    this.baseInfoId = this.$route.query.baseInfoId;
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
      const params = { pageIndex: this.pageIndex, pageSize: this.pageSize, agentId: this.agentId, baseInfoId: this.baseInfoId };
      this.$store
        .dispatch('challenge/selectPersonRecordList', params)
        .then((res) => {
          console.log(res, 'list ---------------');
          if (res.code == 200 && res.data.list) {
            this.loading = false;
            this.total = res.data.total;
            this.list = this.list.concat(res.data.list ? res.data.list : this.list);
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
          console.log('查询异常', err);
          this.loading = false;
          this.finished = true;
          this.$toast('请求错误！');
        });
    },
    showResults(item) {
      console.log('item:', item);
      const params = { id: item.id };
      this.$store
        .dispatch('challenge/selectPersonOptionAnswerFinishList', params)
        .then((res) => {
          console.log(res, 'list ---------------');
          if (res.code == 200) {
            this.result.questionList = res.data;
            this.result.name = item.nickname;
            this.$refs.popupResults.showFortuneResults = true;
            console.log('result:', this.result);
          }
        })
        .catch((err) => {
          console.log(err, '测评情况');
          this.$toast('请求错误！');
        });
    },
    showEvaluation(params) {
      console.log('showEvaluation-params:', params, this.$store.getters.gettersRecordID);
      if (params.url == "annuity") {
        this.$refs.popupAnnuity.showPopup = true;
        this.getAppResult(params.id);
      } else {
        const param = {
          id: params.id,
          agentId: this.agentId,
          baseInfoId: params.baseInfoId,
        };
        this.$store
          .dispatch('challenge/selectPersonRecordDetail', param)
          .then((res) => {
            if (res.code == 200) {
              this.getResult = res.data;
              this.getResult.name = params.name;
              this.$refs.popupEvaluation.showFortuneEvaluation = true;

              console.log(this.getResult);
            }
          })
          .catch((err) => {
            console.log(err, '测评结果');
            this.$toast('请求错误！');
          });
      }
    },
    getAppResult(recordID) {
      const param = {
        id: recordID
      };
      console.log('getAppResult-param', param);
      this.$store.dispatch('annuity/getAppPensionResult', param).then((res) => {
        console.log('getAppResult', res);
        this.getResult = res.data;
        // this.$store.commit('mutationsRecordDate', res.data);
        this.$store.dispatch('actionsRecordDate', res.data);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// @import '../../components/style/participationDetails.scss';
@import 'style/participationDetails.scss';
.content {
  margin-bottom: 20px;
}
.ndata {
  height: calc(100vh - 1rem);
}
::v-deep .van-overlay {
  position: absolute !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
}
</style>
