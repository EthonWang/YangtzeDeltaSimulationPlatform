<template>
  <div class="all_content">
    <!-- 标题 -->
    <div class="flex-row-center">
      <dv-decoration-11 style="width: 400px; height: 75px; color: #fafafa"
        ><h1>长三角台风与风暴潮模拟</h1></dv-decoration-11
      >
      <dv-decoration-5 style="width: 400px; height: 25px" />
    </div>
    <!-- 内容 -->
    <div class="content-container flex-row-evenly">
      <div class="content-col-1" style="color: #fafafa">
        <dv-border-box-13
          style="width: 100%; height: 60%"
          class="typhoon-contentbox"
        >
        </dv-border-box-13>
        <dv-border-box-12
          style="width: 100%; height: 30%"
          class="typhoon-informationbox"
        >
        </dv-border-box-12>
      </div>
      <div class="content-col-2" style="color: #fafafa">
        <dv-border-box-8
          :dur="2"
          style="width: 100%; height: 45%"
          class="storm-contentbox"
        ></dv-border-box-8>
        <dv-border-box-1
          style="width: 100%; height: 45%"
          class="storm-informationbox"
        ></dv-border-box-1>
      </div>
      <div class="content-col-3" style="color: #fafafa">
        <dv-border-box-10 style="width: 100%; height: 30%"></dv-border-box-10>
        <dv-border-box-13 style="width: 100%; height: 60%"></dv-border-box-13>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.all_content {
  background-image: url("../../assets/img/rainForecast_back.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100% !important;
}
.flex-row-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.content-container {
  height: calc(100% - 100px);
  width: 100%;
}
.content-col-1 {
  /*height: calc(100vh - 60px);*/
  height: 100%;
  width: 33%;
}

.content-col-2 {
  /*height: calc(100vh - 60px);*/
  height: 100%;
  width: 33%;
}

.content-col-3 {
  /*height: calc(100vh - 60px);*/
  height: 100%;
  width: 33%;
}
.flex-row-evenly {
  display: flex;
  justify-content: space-evenly;
}
</style>