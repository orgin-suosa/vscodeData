import Vue from 'vue';
import SkeletonHome from './components/SkeletonHome';

export default new Vue({
  components: {
    SkeletonHome,
  },
  render() {
    return (
      <div class='SkeletonContent'>
        <SkeletonHome id='SkeletonHome' style={{ display: 'none' }} />
      </div>
    );
  },
});
