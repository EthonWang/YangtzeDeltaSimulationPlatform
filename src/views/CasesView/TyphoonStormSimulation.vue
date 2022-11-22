<template>
  <div class="all_content">
    <!-- 标题 -->
    <!-- 内容 -->
    <div class="content-container flex-row-evenly">
      <div class="content-col-1" style="color: #fafafa">
        <dv-border-box-13
          style="width: 100%; height: 58%"
          class="typhoon-contentbox"
        >
          <Typhoon></Typhoon>
        </dv-border-box-13>
        <dv-border-box-12
          style="width: 100%; height: 40%"
          class="typhoon-informationbox"
        >
        </dv-border-box-12>
      </div>
      <div class="content-col-2" style="color: #fafafa">
        <div class="flex-row-center" style="height: 15%">
          <dv-decoration-11 style="width: 400px; height: 75px; color: #fafafa"
            ><h1>长三角台风与风暴潮模拟</h1></dv-decoration-11
          >
          <dv-decoration-5 style="width: 400px; height: 25px" />
        </div>
        <div class="buttonbox">
          <div class="openstorm button">风暴潮</div>
          <div class="openwaterflow button">水流</div>
        </div>
        <dv-border-box-8
          :dur="2"
          style="width: 100%; height: 42%"
          class="storm-contentbox"
        >
          <StormSurgeWater1 v-show="stormshow"></StormSurgeWater1>
          <WaterFlow v-show="waterflowshow"></WaterFlow>
        </dv-border-box-8>

        <dv-border-box-1
          style="width: 100%; height: 38%"
          class="storm-informationbox"
        >
          <dv-decoration-7 style="margin-left: 34%; width: 200px; height: 5%"
            ><h2>风暴潮水位</h2></dv-decoration-7
          >
        </dv-border-box-1>
      </div>
      <div class="content-col-3" style="color: #fafafa">
        <dv-border-box-10 style="width: 100%; height: 38%"></dv-border-box-10>
        <dv-border-box-13 style="width: 100%; height: 60%"></dv-border-box-13>
      </div>
    </div>
  </div>
</template>

<script>
import Typhoon from "../CasesView/Typhoon.vue";
import StormSurgeWater1 from "../CasesView/StormSurgeWater1.vue";
import WaterFlow from "../CasesView/waterflow.vue";
export default {
  components: {
    Typhoon,
    StormSurgeWater1,
    WaterFlow,
  },
  data() {
    return {
      stormshow: true,
      waterflowshow: true,
    };
  },
  methods: {
    showstorm() {},
    showflow() {},
  },
  mounted() {
    let chartfather = document.querySelector(".typhoon-informationbox");
    let chart = document.querySelector(".dataTable");

    let barfather = document.querySelector(".storm-informationbox");
    let bar = document.querySelector(".info-card");
    // this.btnIsPlay = true;
    barfather.appendChild(bar);
    chartfather.appendChild(chart);

    let button1 = document.querySelector(".openstorm");
    let button2 = document.querySelector(".openwaterflow");
    let map_storm = document.querySelector("#map1");
    let map_waterflow = document.querySelector("#map3");
    let that = this;
    console.log(button1);
    button1.addEventListener("click", function () {
      button1.style.background = `linear-gradient(123.92deg, rgb(79, 43, 143) 3.41%, rgb(40, 78, 162) 100%) border-box border-box`;
      button2.style.background = `linear-gradient(104.09deg, rgba(0, 151, 105, 0.15) -40.58%, rgba(45, 135, 200, 0.15) 135.07%) border-box border-box`;
      map_storm.style.zIndex = 5;
      map_waterflow.style.zIndex = 4;
      // this.showstorm();
    });
    button2.addEventListener("click", function () {
      button1.style.background = `linear-gradient(128.16deg, rgba(97, 129, 255, 0.15) -0.31%, rgba(112, 0, 255, 0.15) 103%) border-box`;
      button2.style.background = `linear-gradient(101.69deg, rgb(7, 117, 164) 0.11%, rgb(15, 133, 118) 99.84%) border-box border-box`;
      map_storm.style.zIndex = 4;
      map_waterflow.style.zIndex = 5;
      // this.showflow();
    });
  },
};
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
  height: 100%;
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
/deep/.dataTable {
  //   width: 100%;
  top: 4%;
  width: 96%;
  height: 92%;
  //   right: 2px;
  left: 2%;
  background-color: rgba(0, 0, 0, 0);
  .el-card {
    background-color: rgba(9, 19, 31, 0.8);
    border: 0px;
    .el-select {
      --el-select-input-color: rgba(44, 191, 196, 0.5);
      .el-input__wrapper {
        background-color: #17233d;
        box-shadow: 0 0 0 2px rgba(47, 94, 147, 0.9);
        --el-input-text-color: rgba(44, 191, 196, 1);
        .el-input__inner::placeholder {
          color: rgb(44, 191, 196);
          text-align: center;
        }
      }
    }
  }
}
// /deep/.el-select-dropdown {
//   background-color: black;
// }
// /deep/.el-select-dropdown__item:hover {
//   background-color: black;
// }
/deep/.el-table {
  --el-table-border-color: #17233d;
  --el-table-border: 1pxsolidvar (--el-table-border-color);
  --el-table-text-color: rgb(255, 255, 255);
  --el-table-header-text-color: white;
  --el-table-row-hover-bg-color: rgb(11, 27, 79);
  --el-table-current-row-bg-color: #808695;
  --el-table-header-bg-color: rgb(72, 70, 199);
  --el-table-fixed-box-shadow: var(--el-box-shadow-light);
  --el-table-bg-color: #17233d;
  --el-table-tr-bg-color: rgb(11, 27, 79);
  --el-table-expanded-cell-bg-color: #14d4ed !important;
  --el-table-fixed-left-column: inset 10px 0 10px -10px rgba (0, 0, 0, 0.15);
  --el-table-fixed-right-column: inset -10px 0 10px -10px rgba (0, 0, 0, 0.15);
}
/deep/.el-table--striped
  .el-table__body
  tr.el-table__row--striped
  td.el-table__cell {
  background: rgb(9, 13, 52);
}
/deep/.content-col-1 #map {
  width: 93% !important;
  height: 93% !important;
  margin-left: 4%;
  margin-top: 3%;
}
/deep/.el-table--fit {
  height: 75% !important;
}
/deep/.dataTable .el-card {
  height: 25%;
}
/deep/ .content-col-2 #map1 {
  position: absolute;
  width: 98% !important;
  height: 97% !important;
  margin-left: 1%;
  margin-top: 1%;
  // z-index: 1000;
}
/deep/ .content-col-2 #map3 {
  position: absolute;
  width: 98% !important;
  height: 97% !important;
  margin-left: 1%;
  margin-top: 1%;
}
/deep/ .play-card {
  display: none;
}
/deep/ .info-card {
  //   position: relative;
  //   display: block;
  //   position: none;
  left: 2%;
  top: 10%;
  width: 95% !important;
  height: 86% !important;
  //   margin-left: 1%;
  //   margin-top: 1%;
}
/deep/ .chart-card {
  width: 100% !important;
  height: 100% !important;
}
/deep/.info-card .el-card {
  --el-card-border-color: rgba(2, 23, 58, 0.8);
  --el-card-border-radius: 4px;
  //   --el-card-padding: 20px;
  //   padding-top: 5%;
  padding-bottom: 4%;
  --el-card-bg-color: rgb(2, 23, 58);
}
.buttonbox {
  height: 4%;
  display: flex;
  .openstorm {
    color: #e7e7e7;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 12%;
    background: linear-gradient(
        128.16deg,
        rgba(97, 129, 255, 0.15) -0.31%,
        rgba(112, 0, 255, 0.15) 103%
      )
      border-box;
    cursor: pointer;

    border-radius: 4px;
  }
  .openwaterflow {
    color: #e7e7e7;
    font-weight: 600;
    display: flex;
    // line-height: 100%;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 12%;
    border-radius: 4px;
    background: linear-gradient(
        104.09deg,
        rgba(0, 151, 105, 0.15) -40.58%,
        rgba(45, 135, 200, 0.15) 135.07%
      )
      border-box border-box;
    cursor: pointer;
  }
  // .openwaterflow:active {
  //   width: 13%;
  // }
}
</style>