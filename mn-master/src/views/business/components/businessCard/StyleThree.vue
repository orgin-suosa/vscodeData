<template>
  <div class="BizcardInfo">
    <div v-if="basicInfo && basicInfo.userName" class="container">
      <div class="card-header" :style="cardBg">
        <!-- <div v-if="isFrom === 'app'" class="upload_container">
          <div class="upload_btn" @click="handleClickUploadImage">
            <van-icon :name="$Icons.changePhoto" size="13" />
            <span class="upload_btn_text">选择照片</span>
          </div>
        </div> -->
        <div class="photo_container">
          <van-image class="photo_container_img" round width="72px" height="72px" :src="basicInfo.portrait || $Icons.defaultPhoto3" />
          <div class="user_name">
            {{ basicInfo.userName || '未命名' }}
          </div>
        </div>
      </div>
      <div class="info_container">
        <div class="info_box user_company">
          {{ basicInfo.companyName }}
        </div>
        <div class="info_box user_job">
          {{ basicInfo.jobTitle }}
        </div>
        <div class="info_box user_mobile">
          <van-icon size="11px" :name="$Icons.phoneIcon" color="#999" />
          <span class="mobile_text">{{ basicInfo.mobile }}</span>
        </div>
      </div>
    </div>
    <div v-else class="container_default">
      <!-- <div v-if="isFrom === 'app'" class="upload_container">
        <div class="upload_btn" @click="handleClickUploadImage">
          <van-icon :name="$Icons.changePhoto" size="13" />
          <span>选择照片</span>
        </div>
      </div> -->
      <div class="photo_container">
        <div class="avatar_container">
          <van-image round width="50px" height="50px" :src="$Icons.defaultPhoto3" />
        </div>
        <div class="user_name" />
      </div>
      <div class="info_container">
        <div class="user_company" />
        <div class="user_job" />
        <div class="user_mobile" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StyleThree',
  props: {
    basicInfo: {
      default: () => {},
      type: Object,
    },
    isFrom: {
      type: String,
      default: '',
    },
  },
  computed: {
    // 背景图片
    cardBg() {
      const u = require('@/assets/businessCard/cardThreeBg.png');
      return `background:url(${u}) 100% 100% / 100% 100% no-repeat`;
    },
  },
  methods: {
    // 切换风格
    changeStyle() {
      console.log('切换风格');
    },
  },
};
</script>

<style lang="scss" scoped>
.BizcardInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  .container {
    // position: relative;
    width: 100%;
    // height: 194px;
    // height: 229px;
    border-radius: 8px;
    // background: url("~@/assets/img/partner/classicBgTiny.png");
    background-size: 100% 100%;
    box-shadow: 0px 3px 10px 0px #f1f1f1;
    // 头像样式
    .card-header {
      position: relative;
      padding: 20px 0;
    }
    // .upload_container {
    //   position: absolute;
    //   // top: 80px;
    //   left: 10px;
    //   bottom: 10px;
    //   z-index: 1;
    // }
    // 上传图片按钮
    // .upload_btn {
    //   width: 65px;
    //   height: 19px;
    //   opacity: 0.9;
    //   background: #000000;
    //   border-radius: 9px;
    //   display: flex;
    //   align-items: center;
    //   color: $colorWhite;
    //   font-size: 12px;
    //   // padding: 2px 5px;
    //   padding: 0 4px;
    //   &_text {
    //     display: block;
    //     line-height: 19px;
    //     margin-left: 3px;
    //   }
    // span {
    //   margin-left: 3px;
    // }
  }
  .photo_container {
    // z-index: 0;
    // position: absolute;
    // left: 0;
    // top: 15px;
    // right: 0;
    text-align: center;
    &_img {
      border: 2px solid #ffffff;
    }
    .user_name {
      max-width: 170px;
      color: $colorWhite;
      margin: 8px auto 0 auto;
      font-size: 17px;
      opacity: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      white-space: nowrap;
      // padding-left: 12px;
      // padding-right: 10px;
    }
  }
  // 名片基本信息
  .info_container {
    // position: absolute;
    // top: 112px;
    // width: 350px;
    display: flex;
    padding: 10px 15px;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    // text-align: center;
    .info_box {
      max-width: 315px;
      font-size: 15px;
      color: $color17;
      opacity: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      white-space: nowrap;
    }
    .info_box + .info_box {
      margin-top: 3px;
    }
    // .user_company {
    //   padding-left: 15px;
    //   padding-right: 15px;
    //   padding-bottom: 5px;
    //   font-size: 15px;
    //   color: $color17;
    //   opacity: 1;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   -webkit-box-orient: vertical;
    //   white-space: nowrap;
    // }
    // .user_job {
    //   padding-left: 15px;
    //   padding-right: 15px;
    //   padding-bottom: 5px;
    //   font-size: 15px;
    //   color: $color17;
    //   opacity: 1;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   -webkit-box-orient: vertical;
    //   white-space: nowrap;
    // }
    .user_mobile {
      // padding-left: 15px;
      // padding-right: 15px;
      // padding-bottom: 5px;
      // font-size: 15px;
      // color: $color17;
      // opacity: 1;
      .mobile_text {
        padding-left: 5px;
      }
    }
  }
}
.container_default {
  position: relative;
  height: 194px;
  width: 100%;
  border-radius: 8px;
  // .upload_container {
  //   position: absolute;
  //   top: 80px;
  //   left: 10px;
  //   z-index: 1;
  // }
  // .upload_btn {
  //   opacity: 0.9;
  //   background: #333333;
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
  .photo_container {
    z-index: 0;
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    height: 105px;
    background-color: $commonColor7;
    .avatar_container {
      margin-top: 15px;
    }
    .user_name {
      margin: 5px auto;
      background-color: $colorWhite;
      width: 58px;
      height: 19px;
    }
  }
  .info_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    margin-top: 115px;
    .user_company {
      text-align: center;
      width: 156px;
      height: 19px;
      background-color: $commonColor7;
    }
    .user_job {
      width: 90px;
      height: 19px;
      background-color: $commonColor7;
      margin-top: 5px;
    }
    .user_mobile {
      width: 110px;
      height: 19px;
      background-color: $commonColor7;
      margin-top: 5px;
    }
  }
}
</style>
