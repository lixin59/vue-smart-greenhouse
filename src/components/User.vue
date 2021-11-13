<template>
  <div>
    <div class="nullview"></div>
    <div class="aboutme">
      <van-contact-card
        type="edit"
        name="XX"
        tel="180xxxxxxxxxxxx"
        :editable="false"
      />
    </div>
    <div class="swiper">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <img class="swipe-img" src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00514-3679.jpg" alt="">
        </van-swipe-item>
        <van-swipe-item>
          <img class="swipe-img" src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00034-3959.jpg" alt="">
        </van-swipe-item>
        <van-swipe-item>
          <img class="swipe-img" src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00650-131.jpg" alt="">
        </van-swipe-item>
        <van-swipe-item>
          <img class="swipe-img" src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00299-2297.jpg" alt="">
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="device">
      <div class="device-title">
        <span>我的设备</span>
        <van-button class="addBtn" icon="plus" type="primary"  @click="addDevice"/>
      </div>
      <van-divider  :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }" />
      <table class="d-table">
        <tr class="device-tr">
          <th>设备id</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        <tr class="device-tr" v-for="i in deviceList" :key="i.id" >
          <td>{{i.id}}</td>
          <td>{{i.status}}</td>
          <td><van-button class="deleteBtn" type="danger" @click="deleteDevice(i.id)">删除</van-button></td>
        </tr>
      </table>
      <van-dialog v-model="show" title="添加新的设备" show-cancel-button @confirm="getDevice">
        <van-field v-model="deviceId" label="设备id" placeholder="请输入设备id" />
        <van-field v-model="apiKey" label="设备apikey" placeholder="请输入设备apikey" />
      </van-dialog>
    </div>
    <div class="btn">
      <van-button
        color="linear-gradient(to right, #0e5779, #023349)"
        round
        block
        type="info"
        @click="tologin"
      >
        切换用户
      </van-button>
    </div>
  </div>
</template>

<script>
import '../assets/js/sdk';
import Vue from 'vue';
export default {
  data() {
    return {
      deviceId: '',
      apiKey: '',
      show: false,
      deviceList: Vue.prototype.$deviceList
    };
  },
  methods: {
    tologin() {
      this.$router.push('/');
    },
    addDevice() {
      this.show = true;
    },
    deleteDevice(id) {
      const { deviceList } = this;
      const result = deviceList.filter(e => e.id !== id);
      this.deviceList = result;
      Vue.prototype.$deviceList = result;
      Vue.prototype.$devicesid = '';
      Vue.prototype.$oneNetApi = new OneNetApi('mY81iO40=H7=dCbFdjeEc33');
    },
    getDevice() {
      const that = this;
      const { deviceId, apiKey, deviceList } = that;
      if (!deviceId) {
        this.$toast.fail('设备id不能为空');
        console.log('不能为空');
        return;
      }
      if (!apiKey) {
        this.$toast.fail('设备apikey不能为空');
        return;
      }
      const api = new OneNetApi(apiKey);
      api.sendCommand(deviceId, 'test').done(function(data) {
        // console.log('数据请求成功，服务器返回data为：', data);
        if (data.errno === 10) {
          Vue.prototype.$deviceList.push({ id: deviceId, status: '离线' });
          that.$toast.fail(data.error);
        }
        if (data.errno === 0) {
          Vue.prototype.$deviceList.push({ id: deviceId, status: '在线' });
        }
        if (data.errno !== 0) {
          that.$toast.fail(data.error);
          return;
        }
      });
      Vue.prototype.$devicesid = deviceId;
      Vue.prototype.$oneNetApi = new OneNetApi(apiKey);
    }
  }
};
</script>

<style lang="less" scoped>
.nullview {
  width: 100%;
  height: 50px;
}
.aboutme {
  height: 100px;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 25px;
  border-radius: 10px;
  border: 1px solid #000;
  box-shadow: #8f9996 0px 0px 2px 1px;
  .van-contact-card {
    width: 80%;
    margin: 0 auto;
  }
}
.swiper {
  width: 90%;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: #8f9996 1px 5px 20px 4px;
  .my-swipe {
    color: #fff;
    font-size: 18px;
    line-height: 150px;
    text-align: center;
    .swipe-img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.device{
  width: 90%;
  margin: 0 auto;
  margin-top: 20px;
  padding-bottom: 20px;
  box-shadow: #d6d6d6 0px 0px 5px;
  border-radius: 12px;
  .device-title{
    display: flex;
    justify-content: space-around;
    padding-top: 10px;
    .addBtn{
      height: 20px;
    }
  }
  .d-table{
    width: 100%;
    .device-tr{
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      .deleteBtn{
        height: 20px;
      }
  }
  }
}
.btn {
  width: 80%;
  margin: 0 auto;
  margin-top: 50px;
}
</style>
