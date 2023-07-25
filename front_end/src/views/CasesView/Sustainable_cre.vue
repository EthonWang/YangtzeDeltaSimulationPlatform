<template>
  <div id="app">
    <!--背景-->
    <div class="background">
      <el-image
        style="width: 100%; height: 100%"
        :src="backgroundUrl_cr"
      ></el-image>
    </div>
    <!-- 案例标题
        <el-row style="width: 100%">
        <el-menu
                class="data-show-header"
                mode="horizontal"
                background-color="#001529"
                style="height:8vh;border:0"
        >
          <el-row>
              <el-col :span="2" >
                  <el-image
                          style="margin:10%;"
                          :src="OpenGMSUrl"
                          :fit="contain">
                  </el-image>
              </el-col>
              <el-col :span="10" :offset="1">
                  <h2 style="color:#ffffff;margin:0;height:8vh;line-height:8vh;font-size:3vh">基于可持续发展情景下的丝绸之路土地利用模拟及分析案例</h2>
              </el-col>
              <el-col :span="1" :offset="10">
                  <el-link href="https://geomodeling.njnu.edu.cn/repository/thematic" >
                      <div style="color:#ffffff;height:8vh;line-height:8vh;font-size:2.1vh">
                          返回
                      </div>
                  </el-link>
              </el-col>
          </el-row>
        </el-menu>
      </el-row> -->
    <!--故事线-->
    <div
      class="layer"
      style="
        height: 5%;
        width: 90%;
        margin-left: 5%;
        margin-top: 1%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 6px rgba(0, 0, 0, 0.4);
      "
    >
      <el-steps :active="StepActive" simple>
        <el-step title="位置选取" icon="el-icon-edit"></el-step>
        <el-step title="体系设置" icon="el-icon-map-location"></el-step>
        <el-step title="数据载入" icon="el-icon-upload"></el-step>
        <el-step title="结果展示" icon="el-icon-connection"></el-step>
        <!-- <el-step title="结果展示" icon="el-icon-picture"></el-step> -->
        <!-- <el-step title="结果分析" icon="el-icon-s-platform"></el-step> -->
      </el-steps>
    </div>

    <div
      class="layer"
      style="
        height: 82%;
        width: 90%;
        margin-left: 5%;
        margin-top: 1%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 6px rgba(0, 0, 0, 0.4);
        overflow: auto;
      "
    >
      <router-view></router-view>
    </div>
    <div
      class="layer"
      style="height: 5%; width: 90%; margin-left: 5%; padding-top: 20px"
    >
      <el-button
        v-if="StepActive !== 3"
        style="float: right"
        type="success"
        plain
        @click="next"
        >下一步</el-button
      >
      <el-button
        v-if="StepActive !== 0"
        style="float: right; margin-right: 2%"
        type="primary"
        plain
        @click="prev"
        >上一步</el-button
      >
    </div>
  </div>
</template>
  
  <script>
import Global from "../../../public/case/sustainable/Global";
export default {
  name: "App",
  data() {
    return {
      //图片Url
      OpenGMSUrl: require("../../../public/case/sustainable/pic/logo.png"),
      backgroundUrl_cr: require("../../../public/case/sustainable/pic/background3.jpg"),
      //表示步骤状态
      StepActive: 0,
      RouterPath: ["Map", "Table", "Data", "Visual"],
    };
  },
  methods: {
    prev() {
      if (this.StepActive > 0) {
        this.StepActive--;
        this.$router.push(this.RouterPath[this.StepActive]);
      }
    },
    next() {
      if (this.StepActive < 4) {
        if (this.StepActive == 1) {
          if (Global.crTableFlag == true) {
            this.StepActive++;
            this.$router.push(this.RouterPath[this.StepActive]);
            Global.crTableFlag = false;
          } else {
            this.$message({
              message: "你好！请先点击保存数据。",
              type: "warning",
            });
          }
        } else if (this.StepActive == 0) {
          if (Global.MapClickName == false) {
            this.$message({
              message: "你好！请先选择区域。",
              type: "warning",
            });
          } else {
            this.StepActive++;
            this.$router.push(this.RouterPath[this.StepActive]);
          }
        } else {
          this.StepActive++;
          this.$router.push(this.RouterPath[this.StepActive]);
        }
      }
    },
  },
};
</script>
  
  <style scoped>
/*调整布局使页边距消失*/
/* html,
body,
#app {
  margin: 0;
  height: 100%;
  width: 100%;
} */
.background {
  width: 100%;
  height: 100%; /**宽100%是为了图片外框铺满屏幕,高度由内联表示 */
  background-color: white;
  z-index: 0;
  position: absolute;
}
.layer {
  z-index: 1;
  position: relative;
}
</style>
  