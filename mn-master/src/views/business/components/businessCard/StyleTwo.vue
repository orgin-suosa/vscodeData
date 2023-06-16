<template>
  <div class="BizcardInfo">
    <div class="container">
      <div class="card-header">
        <!-- <div v-if="isFrom === 'app'" class="upload_container">
          <div class="upload_btn" @click="handleClickUploadImage">
            <van-icon :name="$Icons.changePhoto" size="13" />
            <span class="upload_btn_text">选择照片</span>
          </div>
        </div> -->
        <div class="photo_container">
          <img :src="basicInfo.portrait || $Icons.defaultPhoto2" />
        </div>
      </div>
      <div v-if="basicInfo.userName" class="info_container">
        <div class="info_name">
          <span class="user_name">{{ basicInfo.userName || '未命名' }}</span>
          <span class="user_job">{{ basicInfo.jobTitle }}</span>
        </div>
        <div class="info_company">
          <div class="user_company">
            {{ basicInfo.companyName }}
          </div>
          <div class="user_mobile">
            <van-icon size="11px" :name="$Icons.phoneIcon" color="#999" />
            <span class="mobile_text">{{ basicInfo.mobile }}</span>
          </div>
        </div>
      </div>
      <div v-else class="default_style">
        <div class="default_line1" />
        <div class="default_line2">
          <div class="default_bg2" />
          <div class="default_bg3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StyleTwo',
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
  padding: 0 22px;
  .container {
    // position: relative;
    width: 100%;
    min-height: 350px;

    border-radius: 8px;
    // box-shadow: 0px 3px 10px 0px #f1f1f1;
    box-shadow: 0px 3px 17px 0px #f1f1f1;
    .card-header {
      position: relative;
    }
    // .upload_container {
    //   position: absolute;
    //   // top: 250px;
    //   bottom: 10px;
    //   left: 10px;
    //   z-index: 1;
    // }
    // 上传图片按钮
    // .upload_btn {
    //   width: 65px;
    //   height: 19px;
    //   opacity: 0.5;
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
    //   // span {
    //   //   margin-left: 3px;
    //   // }
    // }
    .photo_container {
      // z-index: 0;
      // left: 0;
      // top: 0;
      img {
        z-index: 0;
        width: 100%;
        // height: 280px;
        height: 300px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        // background-size: contain;
        object-fit: cover;
      }
    }
    .info_container {
      z-index: 0;
      // 名片名称职位css
      .info_name {
        display: flex;
        align-items: center;
        // margin-top: 10px;
        padding: 10px 15px 2px 15px;
        height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        white-space: nowrap;
        .user_name {
          max-width: 130px;
          color: $color17;
          // font-size: 19px;
          font-size: 18px;
          // padding-left: 15px;
          padding-right: 5px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
        }
        .user_job {
          max-width: 130px;
          color: $color17;
          // font-size: 13px;
          font-size: 12px;
          opacity: 0.8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          white-space: nowrap;
        }
      }
      // 名片公司电话css
      .info_company {
        // padding-bottom: 10px;
        display: flex;
        padding: 0 15px 10px 15px;
        justify-content: space-between;
        align-items: center;
        .user_company {
          // width: 200px;
          max-width: 170px;
          color: $color17;
          // font-size: 13px;
          font-size: 12px;
          // opacity: 1;
          // padding-left: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          white-space: nowrap;
        }
        .user_mobile {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          color: $color17;
          // font-size: 13px;
          font-size: 12px;
          // opacity: 1;
          // padding-left: 20px;
          padding-left: 10px;
          // width: 120px;
          .mobile_text {
            padding-left: 5px;
          }
        }
      }
    }
  }
  .default_style {
    .default_line1 {
      background-color: $commonColor7;
      width: 80px;
      height: 23px;
      margin-left: 15px;
      margin-top: 10px;
    }
    .default_line2 {
      margin-top: 6px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      .default_bg2 {
        background-color: $commonColor7;
        width: 156px;
        height: 17px;
        margin-left: 15px;
      }
      .default_bg3 {
        background-color: $commonColor7;
        width: 100px;
        height: 17px;
        margin-left: 59px;
      }
    }
  }
}
</style>
