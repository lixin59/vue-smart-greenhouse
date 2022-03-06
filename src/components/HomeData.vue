<template>
  <div class="wrapper">
    <div class="nullview"></div>
    <div class="header-wrapper">
<!--      <div class="header-title">-->
<!--        <span>空气状况-{{ airText }}</span>-->
<!--        <span>{{ city }}</span>-->
<!--      </div>-->
<!--      <div class="header-text">-->
<!--        <span>{{ win }}:{{ winSpeed }}</span>-->
<!--        <span>{{ weather }}</span>-->
<!--      </div>-->
<!--      <div class="weather-advice">{{ weatherAdvice }}</div>-->
      <div id="main"  style="width: 100%; height: 100%"></div>
      <van-empty v-show="temShowErr" class="data-null" image="error" description="水位历史数据加载失败" />
    </div>
    <div class="body-wrapper">
      <div class="body">
        <div class="data-wrapper">
          <div class="data">
            <img class="data-logo" src="../static/images/device.png" />
            <div class="data-text">
              <div class="data-title">设备在线状态</div>
              <div class="data-value">{{ isOnline ? '在线' : '离线' }}</div>
            </div>
          </div>
          <div class="data">
            <img class="data-logo" src="../static/images/管网水位监测.png" />
            <div class="data-text">
              <div class="data-title">漏水监控</div>
              <div class="data-value">{{ isWarn ? '有漏水' : '正常'}}</div>
            </div>
          </div>
        </div>
        <div class="data-wrapper">
          <div class="data">
            <img class="data-logo" src="../static/images/famen.png" />
            <div class="data-text">
              <div class="data-title">阀门状态</div>
              <div class="data-value">{{ isOpenFaMen ? '开' : '关'}}</div>
            </div>
          </div>
          <div class="data">
            <img class="data-logo" src="../static/images/bee.png" />
            <div class="data-text">
              <div class="data-title">蜂鸣器状态</div>
              <div class="data-value">{{ isOpenBee ? '开' : '关' }}</div>
            </div>
          </div>
        </div>
        <div class="data-wrapper">
          <div class="ddd">
            <div class="data-text">水位控制</div>
            <van-slider v-model="temSlide" active-color="#0fbddb"  @change="temChange">
              <template #button>
                <div class="custom-box">
                  <div class="custom-button">{{ temSlide }}</div>
                </div>
              </template>
            </van-slider>
          </div>
        </div>
        <div class="data-wrapper" style="margin-bottom: 50px">
          <div class="ddd">
            <div class="data-text">数据上传时间间隔</div>
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

const echarts = require('echarts'); // 引入Echart库

export default {
  created() {
    this.getCharts('water', '水位', '#0a9fef', 'main');
    this.deviceStatus();
    const that = this;
    that.$oneNetApi.getDataStreams(that.$devicesid).done(function(data) {
      // console.log('所有数据请求成功，服务器返回data为：', data);
      // console.log(data);
      if (data.errno === 100) {
        that.$toast.fail('网络超时！');
        that.$dialog.alert({
          message: '如果没有设备，请到我的页面添加设备'
        });
        throw new Error('网络超时');
      }
      const buzzer = data.data.find(e => e.id === 'buzzer'); // 蜂鸣器数据
      const waterleakage = data.data.find(e => e.id === 'water_leakage'); // 是否漏水
      const famen = data.data.find(e => e.id === 'famen'); // 阀门
      // vue 给data函数return的里面的内容赋值
      that.isOpenBee = buzzer.current_value;
      that.isWarn = waterleakage.current_value;
      that.isOpenFaMen = famen.current_value;
      // that.isOnline = true;
    });
  },
  data() {
    return {
      // 请求结果返回的数据

      // city: '请求中', // 城市
      // airText: '请求中', // 空气优良
      // airValue: '', // 空气指数
      // weather: '请求中', // 天气
      // weatherAdvice: '请求中', // 天气建议
      // win: '请求中', // 风向
      // winSpeed: '请求中', // 风力等级
      temShowErr: true,
      chartData: [],
      isOnline: false, // 在线状态
      isWarn: false, // 是否漏水
      isOpenFaMen: false, // 阀门状态
      isOpenBee: false, // 是否漏水
      temSlide: 0, // 温度滑块值
      humSlide: 0, // 湿度滑块值
      limit: 6000,
      startTime: '2020-12-01T08:00:35',
    };
  },
  methods: {
    // 水位滑块onchange事件
    temChange() {
      const that = this;
      // const api = new OneNetApi(that.apikey);
      that.$oneNetApi.sendCommand(that.$devicesid, `{"type":"WL_threshold","value":${that.temSlide}}`).done(function(data) {
        // console.log('api调用完成，服务器返回data为：', data);
        if (data.errno === 100) {
          that.$toast.fail('网络超时！');
          throw new Error('网络超时');
        } else if (data.errno === 0) {
          that.$toast.success('发送成功');
        } else if (data.errno === 10) {
          that.$dialog.alert({
            message: '设备不在线'
          });
          that.temSlide = that.tem;
        } else {
          that.$toast.fail(data.error);
          that.temSlide = 0;
          throw new Error(data.error);
        }
      });
    },
    // 上传时间滑块onchange事件
    humChange() {
      const that = this;
      // const api = new OneNetApi(that.apikey);
      that.$oneNetApi.sendCommand(that.$devicesid, `{"type":"upload_time","value":${that.humSlide}}`).done(function(data) {
        // console.log('api调用完成，服务器返回data为：', data);
        if (data.errno === 100) {
          that.$toast.fail('网络超时！');
          throw new Error('网络超时');
        } else if (data.errno === 0) {
          that.$toast.success('发送成功');
        } else if (data.errno === 10) {
          that.$dialog.alert({
            message: '设备不在线'
          });
          that.humSlide = that.hum;
        } else {
          that.$toast.fail(data.error);
          that.humSlide = 0;
          throw new Error(data.error);
        }
      });
    },
    deviceStatus() {
      const that = this;
      // const api = new OneNetApi(that.apikey);
      that.$oneNetApi.getDeviceStatus(that.$devicesid).done(function(data) {
        // console.log('状态api调用完成，服务器返回data为：', data.data);
        if (data.errno === 100) {
          that.$toast.fail('网络超时！');
          throw new Error('网络超时');
        } else if (data.errno === 0) {
          // that.$toast.success('设备在线');
          that.isOnline = data.data.online;
        } else if (data.errno === 10) {
          // that.$dialog.alert({
          //   message: '设备不在线'
          // });
          that.isOnline = false;
        } else {
          that.$toast.fail(data.error);
          throw new Error(data.error);
        }
      });
    },
    getCharts(id, title, color, htmlElement) {
      // 实例化图表
      const that = this;
      try {
        that.$oneNetApi
          .getDataPoints(that.$devicesid, {
            datastream_id: id,
            start: that.startTime,
            limit: that.limit
          })
          .done(function(data) {
            console.log('图表数据调用完成，服务器返回data为：', data);
            if (data.errno === 100) {
              that.$toast.fail('网络超时！');
              that.temShowErr = true;
              throw new Error('网络超时');
            }
            that.temShowErr = false;
            const tdatatime = [];
            const tvalue = [];
            const resData = data.data.datastreams[0].datapoints;
            const datas = resData || that.chartData;
            for (const i in datas) {
              datas[i].at = datas[i].at.slice(5, -4); // 去掉时间，保留日期
              tdatatime.push(datas[i].at);
              tvalue.push(datas[i].value);
            };
            const option = {
              // backgroundColor: '#f2f2f2',
              legend: {
                data: [title]
              },
              tooltip: {},
              // toolbox: {
              //   feature: {
              //     // 动态类型切换,切换图表
              //     magicType: {
              //       type: ['line', 'bar']
              //     },
              //     // 数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
              //     dataView: {
              //       show: true, // 是否显示 数据示图
              //       readOnly: false // 是否 直接可以编辑数据。
              //     },
              //     // 保存为图片的配置
              //     saveAsImage: {
              //       show: true
              //     },
              //     // 配置项还原
              //     restore: { show: true }
              //   }
              // },
              xAxis: [
                {
                  data: tdatatime,
                  // 字数超过n个时省略
                  axisLabel: {
                    formatter: function(value, index) {
                      const v = value.substring(0, 5) + '...';
                      return value.length > 5 ? v : value;
                    }
                  }
                }
              ],
              yAxis: {},
              series: [
                {
                  name: title,
                  type: 'line',
                  data: tvalue,
                  itemStyle: {
                    // 图形的颜色。默认指向全局的option.color
                    color: color
                  }
                }
              ]
            };
            if (id === 'temperature') {
              // console.log('温度');
              that.dataT = option;
              that.temShowErr = false;
            }
            if (id === 'humidity') {
              // console.log('湿度');
              that.dataH = option;
              that.humShowErr = false;
            }
            // 基于准备好的dom，初始化echarts实例
            // 绘制图表
            const myChart = echarts.init(document.getElementById(htmlElement));
            myChart.setOption(option, true);
          });
      } catch (error) {
        console.log(error);
      }
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
    height: 40%;
    //background: linear-gradient(to top, #BEEDC7, #8CC7B5, #19CAAD);
    border-radius: 20px;
    color: #fff;
    box-shadow: #d6d6d6 0px 0px 5px;
    padding: 15px 4px;
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
  .data-null{
    position: absolute;
    top: 42px;
    width: 100%;
  }
}
</style>
