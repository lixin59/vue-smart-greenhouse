<template>
  <div class="box">
    <div class="nullview"></div>
    <van-form style="border-bottom:solid 1px #c4c4c4;">
      <van-field
        v-model="dataNum"
        center
        label="数据数量"
        clearable
        placeholder="0 ~ 6000"
        :rules="[{ pattern, message: '请输入正确的数字', trigger: 'onBlur' }]"
      >
      </van-field>
      <van-field
        v-model="value"
        center
        label="开始时间"
        clearable
        placeholder="2021-05-01"
      >
        <template #button>
          <van-button size="small" type="primary" @click="selectData"
            >查询</van-button
          >
        </template>
      </van-field>
    </van-form>
    <van-tabs color="#888686" @click="tabClick">
      <van-tab title="温度">
        <div class="line">
          <div id="main"  style="width: 100%; height: 400px"></div>
          <van-empty v-show="temShowErr" class="data-null" image="error" description="历史数据加载失败" />
        </div>
      </van-tab>
      <van-tab title="湿度">
        <div class="line">
          <div id="main1" style="width: 100%; height: 400px"></div>
          <van-empty v-show="humShowErr" class="data-null" image="error" description="历史数据加载失败" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
const echarts = require('echarts'); // 引入Echart库

export default {
  created() {
    // 获取温度的数据节点
    // console.log('created');
    this.getCharts('temperature', '温度', '#F60', 'main');
  },
  data() {
    return {
      value: '2021-10-01',
      dataNum: '',
      temShowErr: true,
      humShowErr: true,
      limit: 6000,
      startTime: '2020-12-01T08:00:35',
      dataH: null,
      dataT: null,
      pattern: /^([1-9]|[1-9]\d|[1-9]\d{2}|[1-5]\d{3}|6000)$/
    };
  },
  mounted() {
  },
  beforeUpdate() {
    // console.log('beforeUpdate');
    // console.log(JSON.stringify(this.dataT));
  },
  updated() {
    // console.log('Update');
    // const myChart = echarts.init(document.getElementById('main'));
    // myChart.setOption(this.dataT, true);
  },
  methods: {
    tabClick(title) {
      if (title === 0) {
        this.getCharts('temperature', '温度', '#F60', 'main');
      } else if (title === 1) {
        this.getCharts('humidity', '湿度', '#1be0e0', 'main1');
      }
    },
    selectData() {
      // 查询按钮
      const that = this;
      const dataNums = Number(that.dataNum);
      that.limit = dataNums;
      that.startTime = that.value + 'T08:00:35';
      that.getCharts('temperature', '温度', '#F60', 'main');
      that.getCharts('humidity', '湿度', '#1be0e0', 'main1');
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
            // console.log('api调用完成，服务器返回data为：', data);
            if (data.errno === 100) {
              that.$toast.fail('网络超时！');
              throw new Error('网络超时');
            }
            const tdatatime = [];
            const tvalue = [];
            const datas = data.data.datastreams[0].datapoints;
            for (const i in datas) {
              datas[i].at = datas[i].at.slice(5, -4); // 去掉时间，保留日期
              tdatatime.push(datas[i].at);
              tvalue.push(datas[i].value);
            };
            const option = {
              backgroundColor: '#f2f2f2',
              legend: {
                data: [title]
              },
              tooltip: {},
              toolbox: {
                feature: {
                // 动态类型切换,切换图表
                  magicType: {
                    type: ['line', 'bar']
                  },
                  // 数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
                  dataView: {
                    show: true, // 是否显示 数据示图
                    readOnly: false // 是否 直接可以编辑数据。
                  },
                  // 保存为图片的配置
                  saveAsImage: {
                    show: true
                  },
                  // 配置项还原
                  restore: { show: true }
                }
              },
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
.box {
  width: 100%;
  height: 100%;
  .nullview {
    width: 100%;
    height: 50px;
  }
  .line {
    width: 100%;
    height: 400px;
    margin-top: 20px;
    // color: #888686;
  }
  .data-null{
    position: absolute;
    top: 42px;
    width: 100%;
  }
}
</style>
