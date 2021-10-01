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
export default {
  methods: {
    tologin() {
      this.$router.push('/');
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
.btn {
  width: 80%;
  margin: 0 auto;
  margin-top: 50px;
}
</style>
