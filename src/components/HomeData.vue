<template>
  <div class="wrapper">
    <div class="nullview"></div>
    <div class="header-wrapper">
      <div class="header-title">
        <span>空气状况-{{ airText }}</span>
        <span>{{ city }}</span>
      </div>
      <div class="header-text">
        <span>{{ win }}:{{ winSpeed }}</span>
        <span>{{ weather }}</span>
      </div>
      <div class="weather-advice">{{ weatherAdvice }}</div>
    </div>
    <div class="body-wrapper">
      <div class="body">
        <div class="data-wrapper">
          <div class="data">
            <img class="data-logo" src="../static/images/wendu.png" />
            <div class="data-text">
              <div class="data-title">温度</div>
              <div class="data-value">{{ tem }}℃</div>
            </div>
          </div>
          <div class="data">
            <img class="data-logo" src="../static/images/shidu.png" />
            <div class="data-text">
              <div class="data-title">湿度</div>
              <div class="data-value">{{ hum }}%</div>
            </div>
          </div>
        </div>
        <div class="data-wrapper">
          <div class="ddd">
            <div class="data-text">控制温度</div>
            <van-slider v-model="temSlide" active-color="#0fbddb"  @change="temChange">
              <template #button>
                <div class="custom-box">
                  <div class="custom-button">{{ temSlide }}</div>
                </div>
              </template>
            </van-slider>
          </div>
        </div>
        <div class="data-wrapper">
          <div class="ddd">
            <div class="data-text">控制湿度</div>
            <van-slider v-model="humSlide" active-color="#0fbddb"  @change="humChange">
              <template #button>
                <div class="custom-box">
                  <div class="custom-button">{{ humSlide }}</div>
                </div>
              </template>
            </van-slider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// const api = new OneNetApi(apikey); // 实例化oneNet api

export default {
  created() {
    const that = this;
    const mykey = '161cff18337a40f7a811b267a8727712';
    // 从onenet平台获取数据
    that.$oneNetApi.getDataStreams(that.$devicesid).done(function(data) {
      // console.log('数据请求成功，服务器返回data为：', data);
      if (data.errno === 100) {
        that.$toast.fail('网络超时！');
        throw new Error('网络超时');
      }
      const tempdatas = data.data[0];
      const humdatas = data.data[2];
      const luxdatas = data.data[1];
      // vue 给data函数return的里面的内容赋值
      that.tem = tempdatas.current_value;
      that.hum = humdatas.current_value;
      that.temSlide = tempdatas.current_value;
      that.humSlide = humdatas.current_value;
      that.lux = parseInt(luxdatas.current_value);
    });
    async function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const res = await that.$axios({
        url: `https://geoapi.heweather.net/v2/city/lookup?location=${longitude},${latitude}&key=${mykey}`, // 和风天气api
        method: 'get'
      });
      const cityid = res.data.location[0].id;
      const { data } = await that.$axios({
        url: `https://v0.yiketianqi.com/api?version=v61&appid=31143983&appsecret=VisL2wEO&cityid=${cityid}`, // 天气api
        method: 'get'
      });

      that.city = data.city;
      that.airText = data.air_level;
      that.airValue = data.air;
      that.weather = data.wea;
      that.weatherAdvice = data.air_tips;
      that.win = data.win;
      that.winSpeed = data.win_speed;
    };
    function error() {
      that.$toast.fail('无法获取您的位置');
      console.log('无法获取您的位置');
    };
    navigator.geolocation.getCurrentPosition(success, error); // 获取地理位置
  },
  data() {
    return {
      // 请求结果返回的数据

      city: '请求中', // 城市
      airText: '请求中', // 空气优良
      airValue: '', // 空气指数
      weather: '请求中', // 天气
      weatherAdvice: '请求中', // 天气建议
      win: '请求中', // 风向
      winSpeed: '请求中', // 风力等级
      tem: '...', // 温度
      hum: '...', // 湿度
      temSlide: 0, // 温度滑块值
      humSlide: 0, // 湿度滑块值
    };
  },
  methods: {
    // 温度滑块onchange事件
    temChange() {
      const that = this;
      // const api = new OneNetApi(that.apikey);
      that.$oneNetApi.sendCommand(that.$devicesid, `{"type":"tem","value":${that.temSlide}}`).done(function(data) {
        // console.log('api调用完成，服务器返回data为：', data);
        if (data.errno === 100) {
          that.$toast.fail('网络超时！');
          throw new Error('网络超时');
        }
        if (data.errno === 10) {
          that.$dialog.alert({
            message: '设备不在线'
          });
          that.temSlide = that.tem;
        } else {
          that.$toast.success('发送成功');
        }
      });
    },
    // 湿度滑块onchange事件
    humChange() {
      const that = this;
      // const api = new OneNetApi(that.apikey);
      that.$oneNetApi.sendCommand(that.$devicesid, `{"type":"tem","value":${that.humSlide}}`).done(function(data) {
        // console.log('api调用完成，服务器返回data为：', data);
        if (data.errno === 100) {
          that.$toast.fail('网络超时！');
          throw new Error('网络超时');
        }
        if (data.errno === 10) {
          that.$dialog.alert({
            message: '设备不在线'
          });
          that.humSlide = that.hum;
        } else {
          that.$toast.success('发送成功');
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  height: 600px;
  padding: 15px;
  .nullview {
    height: 30px;
    width: 100%;
  }
  .header-wrapper {
    height: 28%;
    background: linear-gradient(to top, #BEEDC7, #8CC7B5, #19CAAD);
    border-radius: 20px;
    color: #fff;
    box-shadow: #d6d6d6 0px 0px 5px;
    padding: 15px 30px;
    .header-title {
      font-size: 22px;
      display: flex;
      justify-content: space-between;
    }
    .header-text {
      margin-top: 10px;
      font-size: 22px;
      font-weight: 400;
      display: flex;
      justify-content: space-between;
    }
    .weather-advice {
      margin-top: 15px;
      font-size: 18px;
    }
  }
  .data-wrapper {
    height: 20%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .ddd{
      background-color: #fff;
      box-shadow: #d6d6d6 0px 0px 5px;
      border-radius: 20px;
      padding: 20px;
      width: 100%;
      height: 40px;
      .data-text {
        margin-bottom: 10px;
        color: #7f7f7f;
        text-align: center;
      }
    }
    .data {
      background-color: #fff;
      width: 43%;
      height: 80px;
      border-radius: 20px;
      display: flex;
      justify-content: space-around;
      padding: 0 8px;
      box-shadow: #d6d6d6 0px 0px 5px;
      .data-logo {
        height: 45px;
        width: 40px;
        margin-top: 15px;
      }
      .data-text {
        margin-top: 10px;
        color: #7f7f7f;
        text-align: center;
        .data-value {
          margin-top: 5px;
          font-size: 18px;
        }
      }
    }
  }
  .van-slider{
    height: 8px;
  }
  .custom-box{
    display: flex;
    background-color: #ededed;
    box-shadow: #999898 0px 2px 4px 1px;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 100px;
  }
  .custom-button {
    margin: auto;
    width: 26px;
    height: 26px;
    color: #fff;
    font-size: 12px;
    line-height: 26px;
    text-align: center;
    background-color: #0fbddb;
    border-radius: 100px;
  }
}
</style>
