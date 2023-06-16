<template>
  <div class="BizcardInfo">
    <div class="container">
      <!-- <div v-if="isFrom === 'app'" class="upload-container">
        <div class="upload-btn" @click="handleClickUploadImage">
          <van-icon :name="$Icons.changePhoto" size="13" />
          <span>选择照片</span>
        </div>
      </div> -->
      <div class="photo-container">
        <!-- :style="{ background: `url(${basicInfo.portrait || $Icons.defaultPhoto}) 100% 100%/100% 100% no-repeat` }" -->
        <img :src="basicInfo.portrait || $Icons.defaultPhoto">
      </div>

      <div v-if="basicInfo.userName" class="info-container">
        <!-- <p class="normal-text">
          {{ _companyName }}
        </p> -->
        <div class="normal-text">{{ _companyName }}</div>
        <div class="name-container">
          <div class="title">{{ basicInfo.userName || '未命名' }}</div>
          <div class="text">{{ basicInfo.jobTitle }}</div>
          <!-- <p class="title">
            {{ basicInfo.userName }}
          </p>
          <p class="text">
            {{ basicInfo.jobTitle }}
          </p> -->
        </div>
        <div class="card-footer">
          <div class="small-text first-child">
            <span class="show-dom">
              {{ basicInfo.mobile }}
            </span>
            <van-icon size="11px" :name="$Icons.phoneIcon" color="#999" />
          </div>
          <div class="small-text addr-box">
            <span class="show-dom">{{ basicInfo.companyAddr }}</span>
            <van-icon size="11px" :name="$Icons.locationIcon" color="#999" />
          </div>
        </div>
      </div>
      <div v-else class="default_right">
        <div class="default_bg1" />
        <div class="default_bg2" />
        <div class="default_bg3" />
        <div class="default_bg4" />
        <div class="default_bg6" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoCommon',
  props: {
    basicInfo: {
      default: () => {},
      type: Object,
    },
    isFrom: {
      default: '',
      type: String,
    },
  },
  computed: {
    _companyName() {
      if (this.basicInfo?.companyName) {
        const str = this.basicInfo?.companyName?.length > 11 ? this.basicInfo?.companyName?.slice(0, 11) + '...' : this.basicInfo?.companyName;
        return str;
      } else {
        return '';
      }
    },
  },
  mounted() {},
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  // width: 342px;
  margin: 0 auto;
  width: 100%;
  // height: 194px;
  height: 171px;

  border-radius: 8px;
  // box-shadow: 0px 3px 10px 0px #f1f1f1;
  .upload-container {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 1;
  }
  // .upload-btn {
  //   opacity: 0.5;
  //   background: #000000;
  //   border-radius: 9px;
  //   display: flex;
  //   align-items: center;
  //   color: $colorWhite;
  //   font-size: 12px;
  //   padding: 2px 5px;
  //   span {
  //     margin-left: 3px;
  //   }
  // }
  .photo-container {
    z-index: 1;
    position: absolute;
    left: 0;
    top: 1px;
    width: 171px;
    height: 170px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    overflow: hidden;
    // width: 144px;
    // height: 0;
    // // border-radius: 8px 0 0 8px;
    // border-width: 0px 27px 171px 0px;
    // border-style: none solid solid;
    // border-color: transparent transparent rgba(0, 0, 0, 0.6);
    // overflow: hidden;
    img {
      z-index: 1;
      // width: 180px;
      // height: 194px;
      width: 171px;
      height: 171px;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      background-size: contain;
    }
  }
  .info-container {
    z-index: 1; // 需要比 photo-container 层级高。
    position: absolute;
    right: 0px;
    text-align: right;
    font-size: 16px;
    line-height: 15px;
    font-weight: 400;
    color: $color17;
    width: 191.6px;
    height: 171px;
    background: url('~@/assets/businessCard/cardInfoBg.png') 100% 100%/100% 100% no-repeat;
    // background-size: 100% 100%;
    // 名片标题css
    .normal-text {
      font-size: 13px;
      height: 17px;
      padding: 11px 15px 11px 0;
      // min-height: 16px;
      // padding: 12px 10px 10px 0;
    }
    // 名片电话地址css
    .small-text {
      // padding-right: 10px;
      font-size: 11px;
      // min-height: 11px;
      display: flex;
      justify-content: flex-end;
      // margin-top: 6px;
      .show-dom {
        width: 150px;
        margin-right: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        display:-webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
    .first-child {
      height: 15px;
      align-items: center;
    }
    .addr-box {
      margin-top: 5px;
      height: 30px;
      ::v-deep .van-icon__image {
        margin-top: 2px;
      }
    }
    // .small-text.first-child {
    //   margin-top: 10px;
    // }
    // .small-text.second-child {
    //   span {
    //     // width: 150px;
    //     margin-right: 5px;
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    //     display:-webkit-box;
    //     -webkit-box-orient: vertical;
    //     -webkit-line-clamp: 1;
    //   }
    // }
    // 名片人名称职位css
    .name-container {
      // min-height: 70px;
      padding: 6px 0;
      // width: 212.522px;
      // padding: 6px 10px 10px 0;
      box-sizing: border-box;
      .title {
        // font-size: 18px;
        font-size: 19px;
        // line-height: 30px;
        line-height: 27px;
        color: $color17;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        white-space: nowrap;
        // margin-left: 15px;
        padding: 0 15px;
        height: 27px;
      }
      .text {
        // font-size: 13px;
        font-size: 15px;
        color: $color17;
        // margin-left: 20px;
        padding: 0 15px 0 20px;
        // line-height: 18px;
        line-height: 23px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        white-space: nowrap;
        height: 23px;
      }
    }
    // card底部信息css
    .card-footer {
      height: 48px;
      padding: 11px 15px 11px 25px;
    }
  }
  .default_right {
    position: absolute;
    right: 0px;
    text-align: right;
    z-index: 0;
    height: 194px;
    width: 219px;
    background: url('~@/assets/businessCard/cardRightBgDefault.png') no-repeat;
    .default_bg1 {
      background-color: $commonColor7;
      width: 103px;
      height: 15px;
      margin-top: 10px;
      margin-left: 105px;
    }
    .default_bg2 {
      background-color: $commonColor7;
      width: 64px;
      height: 21px;
      margin-top: 20px;
      margin-left: 144px;
    }
    .default_bg3 {
      background-color: $commonColor7;
      width: 84px;
      height: 17px;
      margin-top: 6px;
      margin-left: 124px;
    }
    .default_bg4 {
      background-color: $commonColor7;
      width: 84px;
      height: 13px;
      margin-top: 29px;
      margin-left: 124px;
    }
    .default_bg6 {
      background-color: $commonColor7;
      width: 140px;
      height: 13px;
      margin-top: 11px;
      margin-left: 68px;
    }
  }
}
</style>
