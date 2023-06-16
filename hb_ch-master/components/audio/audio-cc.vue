<template>
  <view class="audio-cc">
    <view class="audio-schedule-tab">
      <view class="audio-schedule-time">{{ currentTime }}</view>
      <view>
        <slider
          class="audio-slider"
          activeColor="#F33C34"
          backgroundColor="#E8E8E8"
          block-color="#F33C34"
          block-size="12"
          v-if="show"
          :max="sliderMax"
          :value="sliderCurrent"
          @change="sliderChange"
          @changing="sliderChanging"
        />
      </view>
      <view class="audio-schedule-time">{{ time }}</view>
    </view>
    <view class="audio-schedule-tab">
      <view>
        <view class="audio-title" v-text="title"></view>
        <view class="audio-subtitle" v-text="subtitle" style="font-size: 20rpx"></view>
      </view>
      <view class="play-btn">
        <view class="iconfont icon-shangyishou" style="font-size: 25px" @click="previous()"></view>
        <view v-show="play" @click="pauseAudio()" style="font-size: 30px" class="iconfont icon-zantingbofang"></view>
        <view v-show="!play" @click="playAudio()" style="font-size: 30px" class="iconfont icon-bofang"></view>
        <view class="iconfont icon-xiayishou" style="font-size: 25px" @click="next"></view>
      </view>
    </view>
  </view>
</template>
<script>
// import './font/iconfont.css'
//GEP默认音频播放组件模块
const audioContainer = {};
export default {
  name: 'audio-cc',
  // 此处定义传入的数据
  props: {
    //音频地址
    src: {
      type: String,
      value: '',
    },
    //标题
    title: {
      type: String,
      value: '',
    },
    subtitle: {
      type: String,
      value: '',
    },
    //是否自动播放
    autoplay: {
      type: Boolean,
      value: false,
    },
    //是否循环播放
    loop: {
      type: Boolean,
      value: false,
    },
    playImg: {
      type: String,
      value: '${getApp().globalData.qnUrl}/zc_images/audio-play.png',
    },
    pauseImg: {
      type: String,
      value: '${getApp().globalData.qnUrl}/zc_images/audio-stop.png',
    },
    duration: {
      type: Number,
      defalut: 0,
    },
  },
  data() {
    return {
      uuid: 0,
      max: 0,
      current: 0,
      play: false,
      stop: false,
      innerAudioContext: uni.createInnerAudioContext(),
      accuracy: 3000,
      ready: true,
      scheduleTimer: {}, // 定时器
      startTime: '',
    };
  },
  //在实例创建完成后被立即调用。
  mounted() {
    this.createUuid();
    this.audioInit();
    this.initTimer();
  },
  //实例销毁之前调用。在这一步，实例仍然完全可用。
  beforeDestroy() {
    // console.info('实例销毁;播放状态切换：停止');
    this.innerAudioContext.stop();
    this.innerAudioContext.destroy();
    audioContainer[this.uuid] = null;
    this.scheduleTimer.destroy();
  },
  watch: {
    play(val) {
      // console.info(`play: ${val}`);
      if (this.src.length > 0) {
        if (val) {
          // console.info(`uuid：${this.uuid};播放状态切换：播放`);
          this.innerAudioContext.play();
          this.scheduleTimer.start();
          this.startTime = new Date();
        } else {
          // console.info(`uuid：${this.uuid};播放状态切换：暂停`);
          this.innerAudioContext.pause();
          this.scheduleTimer.destroy();

          //播放时间(毫秒)
          let stopTime = new Date();
          let studyTime = stopTime.getTime() - this.startTime.getTime();

          let obj = {
            current: this.current,
            duration: this.max,
            time: Math.round(studyTime / 1000), // 音频播放时间
          };
          this.$emit('timeupdate', obj);
        }
      } else {
        this.innerAudioContext.pause();
      }
    },
    stop(val) {
      if (val) {
        // console.info(`uuid：${this.uuid};播放状态切换：停止`);
        this.current = 0;
        this.innerAudioContext.stop();
        this.play = false;
        this.stop = false;
      }
    },
    src(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.audioInit();
      }
    },
  },
  computed: {
    currentImg() {
      if (this.play) {
        return this.pauseImg;
      } else {
        return this.playImg;
      }
    },
    currentTime() {
      if (this.max > 0) {
        let end = this.current,
          minute = parseInt(end / 60),
          second = parseInt(end % 60);

        if (minute < 10) {
          minute = `0${minute}`;
        }

        if (second < 10) {
          second = `0${second}`;
        }

        return `${minute}:${second}`;
      } else {
        return '00:00';
      }
    },
    time() {
      if (this.max > 0) {
        let end = this.max,
          minute = parseInt(end / 60),
          second = parseInt(end % 60);
        if (minute < 10) {
          minute = `0${minute}`;
        }
        if (second < 10) {
          second = `0${second}`;
        }
        return `${minute}:${second}`;
      } else {
        return '00:00';
      }
    },
    /*time() {
							if (this.max > 0) {
								let end = this.max - this.current,
									minute = parseInt(end / 60),
									second = parseInt(end % 60);

								if (minute < 10) {
									minute = `0${minute}`;
								}

								if (second < 10) {
									second = `0${second}`;
								}

								return `${minute}:${second}`;
							} else {
								return '00:00';
							}
						},*/
    show() {
      return this.max > 0;
    },
    sliderMax() {
      return this.max > 0 ? parseInt(this.max * this.accuracy) : 0;
    },
    sliderCurrent() {
      return this.current > 0 ? parseInt(this.current * this.accuracy) : 0;
    },
  },
  methods: {
    changeState() {
      if (this.ready) {
        this.play = !this.play;
      } else {
        uni.showToast({
          title: '音频加载失败请更换源',
        });
      }
    },
    //音频初始化
    audioInit() {
      let _self = this,
        //是否单独播放
        alone = true;

      if (this.src.length > 0) {
        let time = parseInt(Date.parse(new Date()) / (1000 * 60 * 30)),
          src = `${this.src}?v=${time}`;
        // console.info(`uuid：${this.uuid}`);
        // console.info(`加载音频地址：${src}`);
        _self.play = _self.autoplay;

        _self.innerAudioContext.src = src;
        _self.innerAudioContext.autoplay = _self.autoplay;
        _self.innerAudioContext.loop = _self.loop;
        _self.innerAudioContext.currentTime = _self.current;

        audioContainer[_self.uuid] = _self.innerAudioContext;
      }

      //初始化加载事件
      this.innerAudioContext.onCanplay(() => {
        // console.info('初始化加载事件');
        _self.innerAudioContext.duration;
        setTimeout(function () {
          let duration = _self.duration;
          if (duration) {
            _self.max = duration;
          } else {
            _self.max = _self.innerAudioContext.duration;
          }

          // console.info(`max: ${_self.max};src: ${_self.innerAudioContext.src}`);
        }, 500);
        _self.ready = true;

        // console.info(_self.ready, '_self.ready');
      });

      //开始播放事件
      this.innerAudioContext.onPlay(() => {
        // console.info('开始播放', `是否单独播放${alone}`);
        if (alone) {
          for (let uuid in audioContainer) {
            if (this.uuid !== uuid) {
              audioContainer[uuid] && audioContainer[uuid].pause();
            }
          }
        }
      });

      //音频播放进度更新事件
      this.innerAudioContext.onTimeUpdate(() => {
        let duration = _self.duration;
        if (duration && duration <= _self.innerAudioContext.currentTime) {
          _self.pauseAudio();
          return;
        }

        // console.info(`当前播放进度: ${_self.innerAudioContext.currentTime}`);
        if (this.max <= 0) {
          setTimeout(function () {
            let duration = _self.duration;
            if (duration) {
              _self.max = duration;
            } else {
              _self.max = _self.innerAudioContext.duration;
            }

            // console.info(`max: ${_self.max};src: ${_self.innerAudioContext.src}`);
          }, 200);
        } else {
          _self.current = _self.innerAudioContext.currentTime;
        }
      });

      //音频暂停事件
      this.innerAudioContext.onPause((e) => {
        // console.info(`播放暂停`, e);
        if (_self.play) {
          _self.pauseAudio();
        }
      });

      //音频停止事件
      this.innerAudioContext.onStop((e) => {
        // console.info(`播放停止`, e);
      });

      //音频自然播放结束事件
      this.innerAudioContext.onEnded((e) => {
        // console.info(`播放结束`, e);
        _self.stopAudio();
      });

      //异常监听
      this.innerAudioContext.onError((err) => {
        _self.ready = false;
        let errorMap = {
          10001: '系统错误',
          10002: '网络错误',
          10003: '文件错误',
          10004: '格式错误',
          '-1': '未知错误',
        };
        let errorMsg = errorMap[err.errCode] || '网络故障请稍后重试';

        uni.showToast({
          title: errorMsg,
        });

        // console.info(err);
      });
    },
    // 初始化定时器
    initTimer() {
      let that = this;
      this.scheduleTimer = {
        timer: '',
        destroy: function () {
          clearInterval(this.timer);
        },
        start: function () {
          if (this.timer) {
            this.destroy();
          }
          this.timer = setInterval(() => {
            // 每两分钟更新 音视频进度
            let obj = {
              current: that.current,
              duration: that.max,
              time: 30 * 1, // 学习时长三分钟（定时器时长）
            };
            that.$emit('timeupdate', obj);
            that.startTime = new Date();
            // this.start()
            // 1000* 60 * 2
          }, 1000 * 30 * 1); // 三分钟跟新一次学习进度
        },
      };
    },
    //播放
    playAudio() {
      let duration = this.duration;
      if (duration && duration <= this.innerAudioContext.currentTime) {
        this.current = 0;
        this.innerAudioContext.currentTime = 0;
      }
      this.play = true;
    },
    //暂停
    pauseAudio() {
      this.play = false;
      this.$emit('pauseAudio');
    },
    //停止
    stopAudio() {
      this.stop = true;
    },
    previous() {
      // this.destroy();
      this.$emit('previous');
    },
    next() {
      // this.destroy();
      this.$emit('next');
    },
    initPlay() {
      this.createUuid();
      this.audioInit();
    },
    //快进到指定位置
    seek(index) {
      this.innerAudioContext.seek(index / this.accuracy);
    },
    //快进到指定位置,并播放
    seekAndPlay(index) {
      setTimeout(() => {
        this.seek(index);
        this.playAudio();
      }, 200);
    },
    //进度改变
    sliderChange(e) {
      this.pauseAudio();
      this.seekAndPlay(e.detail.value);
    },
    //进度连续改变
    sliderChanging(e) {
      this.pauseAudio();
    },
    //创建唯一uuid
    createUuid() {
      let s = [],
        hexDigits = '0123456789abcdef',
        i;

      for (i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }

      s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-';

      this.uuid = s.join('');
    },
  },
};
</script>

<style lang="scss">
@import '@/components/audio/font/iconfont.css';
.audio-cc {
  padding: 30rpx 0rpx;
  border-radius: 10rpx;
  position: relative;
  background: #000000;
  box-shadow: 0rpx -1rpx 16rpx 0rpx rgba(173, 173, 173, 0.5);
}

.audio-schedule-tab {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}

.audio-schedule-time {
  font-size: 24rpx;
  padding: 0 20rpx;
  color: #ffffff;
  text-align: center;
}

.audio-slider {
  width: 460rpx;
  margin: 0px;
}

.audio-title {
  padding: 0 20rpx;
  color: #ffffff;
  font-size: 26rpx;
}

.audio-subtitle {
  padding: 0 20rpx;
  color: #ffffff;
  font-size: 20rpx;
}

.play-btn {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.play-btn .iconfont {
  padding: 0 20rpx;
  color: #ffffff;
  font-size: x-large;
}

.play-btn .icon-zantingbofang {
  padding: 0 20rpx;
  color: #ffffff;
  font-size: xx-large;
}
</style>
