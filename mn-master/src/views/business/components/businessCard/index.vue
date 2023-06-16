<template>
  <div class="businessCard" @click="checkBusinessaCard">
    <style-one v-show="cardStyle && cardStyle === '1'" :basic-info="basicInfo" />
    <style-two v-show="cardStyle && cardStyle === '2'" :basic-info="basicInfo" />
    <style-three v-show="cardStyle && cardStyle === '3'" :basic-info="basicInfo" />
  </div>
</template>
<script>
// import StyleOne from './StyleOne';
import StyleOne from './StyleOneCopy';
import StyleTwo from './StyleTwo';
import StyleThree from './StyleThree';
export default {
  components: {
    StyleOne,
    StyleTwo,
    StyleThree,
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => {},
    },
    showEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    cardStyle() {
      return this?.basicInfo?.cardStyle || '1';
    },
  },
  created() {
    console.log("展业名片-businessCard：", this.basicInfo);
  },
  methods: {
    checkBusinessaCard() {
      this.$emit('checkBusinessaCard');
    },
  },
};
</script>
