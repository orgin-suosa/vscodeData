export default {
  actionsRecordDate(context, n) {
    console.log(context);
    return context.commit('mutationsRecordDate', n);
  },
  actionsRecordID(context, n) {
    console.log(context);
    return context.commit('mutationsRecordID', n);
  },

};
