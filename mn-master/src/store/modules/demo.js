export default {
  namespaced: true,
  state: {
    count: 0,
  },
  mutations: {
    add(state, val = 1) {
      state.count += val;
    },
  },
};
