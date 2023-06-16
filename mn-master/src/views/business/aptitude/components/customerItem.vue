<template>
  <div class="custormer-rows">
    <div class="tag">{{ info.optionValueName }}-{{ info.title }}人格</div>
    <div class="time">
      {{ info.compeleteTime }}
    </div>
    <div class="content">
      <div class="avatar">
        <img class="avatar-icon" :src="info.headImgUrl ? info.headImgUrl : portrait_icon" alt="" />
      </div>
      <div class="info">
        <div class="name">
          {{ info.name }}
        </div>
        <div class="phone">
          {{ info.mobile }}
        </div>
      </div>

      <div class="right">
        <img class="phone-icon" src="@/assets/images/phone-icon.png" alt="" @click="callCustomer(info.mobile)" />
      </div>
    </div>
  </div>
</template>

<script>
import portrait_icon from '@/assets/images/default-avatar.png';
export default {
  name: 'CustomerItem',
  filters: {
    timeFormate(val) {
      if (val) return val.substring(0, 10);
    },
  },
  props: {
    info: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  data() {
    return {
      isExpansion: false,
      defaultAvatarW: '',
      currentId: '',
      status: '',
      clickFlag: true,
      portrait_icon: portrait_icon,
    };
  },
  methods: {
    callCustomer(phone) {
      console.log('call', phone);
      this.$appInterface.callPhone(phone);
    },
  },
};
</script>

<style lang="scss" scoped>
.custormer-rows {
  width: 345px;
  height: 100px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 3px 20px 0px #f1f1f1;
  display: flex;
  flex-flow: column nowrap;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 10px;
  .tag {
    padding: 2px 12px;
    height: 20px;
    background: linear-gradient(130deg, #ffe3c2 4%, #f3ab53 96%);
    border-radius: 8px 0px 18px 0px;
    position: absolute;
    top: 0;
    left: 0;
    font-size: 11px;
    font-weight: 500;
    text-align: left;
    color: #89510c;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .time {
    margin-right: 10px;
    text-align: right;
    font-size: 11px;
    color: #b0b5c0;
    white-space: nowrap;
  }
  .content {
    display: flex;
    align-items: center;
    padding-top: 6px;
    .avatar {
      .avatar-icon {
        height: 44px;
        width: 44px;
        border-radius: 50%;
      }
    }
    .info {
      padding-left: 10px;
      padding-right: 10px;
      .name {
        font-size: 16px;
        font-weight: 500;
        text-align: left;
        color: #333333;
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 220px;
      }
      .phone {
        font-size: 12px;
        color: #999999;
      }
    }
    .right {
      position: absolute;
      right: 20px;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
