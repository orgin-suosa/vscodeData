export default {
  namespaced: true,
  state: {
    cur: 1,
    total: 0,
    answerList: [],
  },
  mutations: {
    // 设置当前题目
    setCur(state, val) {
      state.cur = val;
    },
    // 题目总数
    setTotal(state, val) {
      state.total = val;
    },
    // 答题题目列表
    setAnswerList(state, val) {
      const { num, answer } = val;
      if (state.answerList[num - 1] !== undefined) {
        state.answerList[num - 1] = answer;
      } else {
        state.answerList.push(answer);
      }
    },
  },
};
