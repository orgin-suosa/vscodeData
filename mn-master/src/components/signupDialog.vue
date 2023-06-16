<template>
  <div class="dialog_container">
    <div class="content">
      <div class="title">
        填写报名信息
      </div>
      <van-field v-model="userInfo.userName" label="姓名" placeholder="请输入您的姓名" :maxlength="30" />
      <van-field v-model="userInfo.mobile" type="number" label="手机号" placeholder="请输入您的手机号" :maxlength="11" @blur="validatePhoneNum(userInfo.mobile)" />
      <van-field v-model="userInfo.imgCode" type="number" label="图形验证码" placeholder="输入图形验证码" :maxlength="4">
        <template #button>
          <img class="pic_code" :src="imgCodeSrc" alt @click="getImgCode" />
        </template>
      </van-field>
      <van-field v-model="userInfo.msgCode" center type="number" label="验证码" placeholder="请输入验证码" :maxlength="6">
        <template #button>
          <van-button :class="{ 'btn-code': timer }" round size="small" type="primary" :loading="getCodeBtn" @click="getCode">
            {{ btnText }}
          </van-button>
        </template>
      </van-field>

      <div class="dialog_footer">
        <van-button class="btn_cancel" @click="onCancel">
          取消
        </van-button>
        <van-button class="btn_confirm" :loading="loading" @click="onConfirm">
          确定
        </van-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SignupDialog',
  props: {
    userId: {
      type: String,
      default: '',
    },
    wxUserInfo: {
      type: Object,
      default: () => {
        return {
          openid: '',
        };
      },
    },
    type: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      userInfo: {
        userName: '',
        mobile: '',
        msgCode: '', // 短信验证码
        imgCode: '', // 图形验证码
        randomStr: '',
        openid: '', // 微信openId
        portrait: '', // 微信头像
      },
      imgCodeSrc:
        'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAoAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9CLOGtCzhqvZw1egj2xtn0oAvWcNaFnDWXZqK0LRRmgDUs4a0LMx+b5f/AC0rLtFGa0rNV3cjn19KANazhrQs4ay7NRmtC0UZoA2LOGtCzhrLs1FaFoozQBsWcNaFnDWXZqK0LRRmgC8sPFFNVVx/9aigD5Hs4auCPbbtVezhq88P+hv+dAC2Z/2a0LM/7NZlm/8AvVo2bc/xUAaVmf8AZrTsy237vy1lWbc/xVp2bY/56f0oA07M/wCzWhZn/ZrNs3/3q0LNuf4qANazP+zWhZn/AGazLN/96tGzbn+KgDWsz/s1oWZ/2azLN/8AerRs25/ioAuKePu0Uitx/FRQB8p2cNWpUMdlIR9P1oooAjs0NaFmhoooA0LNDWpZKcfe/wCA0UUAaFmhrQs0NFFAGpZoa0LNDRRQBqWaGtCzQ0UUAW1U4ooooA//2Q==', // 图形验证码base64
      btnText: '获取验证码',
      getCodeBtn: false,
      count: -1,
      loading: false,
      timer: null,
    };
  },
  created() {
    console.log('SignupDialog-userId', this.userId);
    console.log('SignupDialogwx-UserInfo', this.wxUserInfo, this.wxUserInfo);
    console.log('SignupDialog-type', this.type);
    this.getImgCode();
  },
  methods: {
    // 手机号校验
    validatePhoneNum(value) {
      if (!value) {
        this.$toast('请输入手机号');
        return false;
      }
      if (value) {
        var phone = value.replace(/\s/g, ''); // 去除空格
        const reg = /^[1][3456789][0-9]{9}$/;
        if (reg.test(phone)) {
          return true;
        } else {
          this.$toast('请输入正确的手机号');
          return false;
        }
      }
    },
    // 获取图形验证码
    getImgCode() {
      this.userInfo.randomStr = Math.random()
        .toString()
        .slice(-6);
      const params = {
        randomStr: this.userInfo.randomStr,
      };
      console.log('随机数', params);
      this.$store.dispatch('business/getImgCode', params).then((res) => {
        console.log(res, 'res');
        this.imgCodeSrc = res.data || '';
        console.log('img', res, this.imgCodeSrc);
      });
    },
    // 获取短信验证码
    getCode() {
      if (this.btnText === '获取验证码') {
        let hasImgCode = 'true';
        if (!this.userInfo.imgCode) {
          this.$toast('请填写图形验证码');
          hasImgCode = 'false';
          return;
        }
        const isTrue = this.validatePhoneNum(this.userInfo.mobile);
        console.log('获取验证码----------->', isTrue);
        if (JSON.stringify(isTrue) === 'true' && hasImgCode === 'true') {
          this.getCodeBtn = true;
          const param = {
            phone: this.userInfo.mobile,
            type: this.type, // 测评类型（100：财富金矿；200：性向测试；300：性格色彩测试；400：展业工具测评；500：展业工具问卷）
            randomStr: this.userInfo.randomStr,
            imageVerifyCode: this.userInfo.imgCode,
          };
          console.log(param, '获取短信验证码-param');
          this.$store
            .dispatch('business/getCode', param)
            .then((res) => {
              console.log(res, '获取短信验证码-res');
              if (res.code === 200) {
                if (res.data) {
                  if (res.data === true) {
                    this.getCodeBtn = false;
                    this.timeCount();
                  } else {
                    this.$toast('请稍后重试');
                    // 获取图形验证码
                    setTimeout(() => {
                      this.getCodeBtn = false;
                      this.getImgCode();
                      this.userInfo.imgCode = '';
                    }, 1000);
                  }
                }
              }
            })
            .catch((err) => {
              console.log('获取手机验证码异常', err);
              this.$toast(err.data.message);
              // 获取图形验证码
              setTimeout(() => {
                this.getCodeBtn = false;
                this.getImgCode();
                this.userInfo.imgCode = '';
              }, 1000);
            });
        }
      }
    },
    // 按钮倒计时
    timeCount() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        // this.btnText = `${this.count}s后再获取`;
        this.btnText = this.count + 's后再获取';
        this.timer = setInterval(() => {
          this.count--;
          if (this.count > 0 && this.count <= TIME_COUNT) {
            // this.btnText = `${this.count}s后再获取`;
            this.btnText = this.count + 's后再获取';
          } else {
            clearInterval(this.timer);
            this.timer = null;
            this.btnText = '获取验证码';
          }
        }, 1000);
      } else {
        this.btnText = '获取验证码';
      }
    },
    // 取消
    onCancel() {
      this.userInfo = {
        userName: '',
        mobile: '',
        msgCode: '', // 短信验证码
        imgCode: '', // 图形验证码
        randomStr: '',
        openid: '', // 微信openId
        portrait: '', // 微信头像
      };
      this.$emit('onCancel');
    },
    // 确认报名
    onConfirm() {
      this.loading = true;
      const validateVal = this.onBeforeClose();
      if (JSON.stringify(validateVal) !== 'true') {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
        return;
      }
      const data = {
        type: this.type, // 测评类型（100：财富金矿；200：性向测试）
        sharePersonId: this.userId || '',
        name: this.userInfo.userName,
        phone: this.userInfo.mobile,
        headImgUrl: this.wxUserInfo.headimgurl || '',
        validCode: this.userInfo.msgCode,
        openId: this.wxUserInfo.openid || 'openid',
        randomStr: this.userInfo.randomStr, // 随机字符串
        imageVerifyCode: this.userInfo.imgCode, // 图形验证码
      };
      const param = Object.assign({}, data);
      console.log('确认报名-param', param);
      this.$store
        .dispatch('business/submitInfo', param)
        .then((res) => {
          console.log('确认报名-res', res);
          if (res.code === 200) {
            this.$emit('onConfirm', res.data, this.userInfo.mobile || '');
            setTimeout(() => {
              this.count = -1;
              clearInterval(this.timer);
              this.btnText = '获取验证码';
              this.userInfo = {
                userName: '',
                mobile: '',
                msgCode: '', // 短信验证码
                imgCode: '', // 图形验证码
                randomStr: '',
                openid: '', // 微信openId
                portrait: '', // 微信头像
              };
              this.loading = false;
            }, 500);
          } else {
            console.log('报名异常-message', res?.message || res.data?.message);
            this.$toast(res?.message || res.data?.message || '请稍后重试');
            console.log('报名异常-res', res);
            setTimeout(() => {
              this.getImgCode();
              this.userInfo.imgCode = '';
              this.loading = false;
            }, 500);
          }
        })
        .catch((err) => {
          console.log('报名异常-catch', err);
          this.$toast(err?.message || err.data?.message || '请稍后重试');
          setTimeout(() => {
            this.getImgCode();
            this.userInfo.imgCode = '';
            this.loading = false;
          }, 200);
        });
    },
    // 阻止关闭弹出层
    onBeforeClose() {
      console.log('阻止关闭弹出层-userInfo', this.userInfo);
      if (!this.userInfo.userName) {
        this.$toast('请填写姓名');
        return false;
      } else {
        if (this.userInfo.userName.length > 30) {
          this.$toast('姓名不能超过30个字符');
          return false;
        }
      }
      if (!this.userInfo.mobile) {
        this.$toast('请填写手机号');
        return false;
      }
      if (!this.userInfo.imgCode) {
        this.$toast('图形验证码不可为空');
        return false;
      }
      const isTrue = this.validatePhoneNum(this.userInfo.mobile);
      if (JSON.stringify(isTrue) !== 'true') {
        return false;
      }
      if (!this.userInfo.msgCode) {
        console.log('阻止关闭弹出层-.msgCode', this.userInfo.msgCode);
        this.$toast('验证码不可为空');
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  .content {
    width: 300px;
    background: #ffffff;
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 10px;
    .title {
      font-size: 22px;
      text-align: center;
      padding-top: 24px;
      padding-bottom: 15px;
      border-bottom: 0.6px solid RGB(240, 240, 240, 0.7);
    }
    .pic_code {
      width: 60px;
      border-radius: 6px;
      vertical-align: middle;
    }
    .btn-code {
      width: 100px;
    }
    .dialog_footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin-top: 40px;
      border-top: 0.6px solid RGB(240, 240, 240, 0.7);
      .btn_cancel {
        text-align: center;
        width: 50%;
        border-right: 0.6px solid RGB(240, 240, 240, 0.7);
        font-size: 16px;
      }
      .btn_confirm {
        text-align: center;
        width: 50%;
        font-size: 16px;
        color: #009c64;
      }
    }
  }
}
::v-deep .van-button--default {
  border: none;
  color: #999999;
}
::v-deep .van-field__button {
  padding-left: 0px;
}
::v-deep .van-cell {
  flex-direction: row;
  align-items: center;
  padding: 10px 8px;
}

::v-deep .van-button--info {
  width: 200px;
  height: 45px;
  box-shadow: 0px 1px 5px #ffffff;
  font-size: 14px;
}
::v-deep .van-button--primary {
  color: #009c64;
  border: 1px solid #009c64;
  background-color: #ffffff;
}
::v-deep .van-field__label {
  margin-right: 0;
}
</style>
