<template>
  <el-row>
    <el-col :span="6" v-for="(item, index) in resList" :key="index">
      <el-card class="resListCard">
        <div class="imageBox">
          <el-image :src="item.src" class="image" :fit="contain"></el-image>
        </div>
        <div style="padding: 7px">
          <span class="cardTitle" :title="item.name">{{ item.name }}</span>
          <el-button class="downloadButton" style="margin-left: 2px;" type="info">查看</el-button>
          <el-button class="downloadButton">下载</el-button>
          <div class="fontSet" style="margin: 5px 0">
            <span>{{ item.fileSize }}</span
            ><br />
            <span>南京师范大学地理科学学院</span>
            <span style="float: right">2022-5-11</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="resListPagination">
    <el-pagination background layout="prev, pager, next" :total="5">
    </el-pagination>
  </el-row>
</template>

<script>
import { onMounted, ref } from "vue";
export default {
  name: "resourceList",
  props: [],
  emits: [],
  setup(props, ctx) {
    let resList = [
      {
        id: "111",
        name: "nanjing DEM",
        src: require("@/assets/map/land1_2855_3514.jpg"),
        fileSize: "23.72MB",
      },
      {
        id: "222",
        name: "shanghai DEM",
        src: require("@/assets/map/map_1_3697_8171.jpg"),
        fileSize: "49.2MB",
      },
      {
        id: "333",
        name: "shanghai landuse",
        src: require("@/assets/map/v2-cd0df2d77622805c422b8c2fbdb02823_720w_7778.jpg"),
        fileSize: "23.72MB",
      },
      {
        id: "444",
        name: "shanghai Soil",
        src: require("@/assets/map/v2-d36ccca3213e09091d17ec71e902cecc_720w_654.jpg"),
        fileSize: "1.66MB",
      },
      {
        id: "555",
        name: "长三角1:1000万自然人文地理",
        src: require("@/assets/map/v2-d36ccca3213e09091d17ec71e902cecc_720w_7034.jpg"),
        fileSize: "2.15GB",
      },
      {
        id: "111",
        name: "nanjing DEM",
        src: require("@/assets/map/land1_2855_3514.jpg"),
        fileSize: "23.72MB",
      },
      {
        id: "222",
        name: "shanghai DEM",
        src: require("@/assets/map/map_1_3697_8171.jpg"),
        fileSize: "49.2MB",
      },
      {
        id: "333",
        name: "shanghai landuse",
        src: require("@/assets/map/v2-cd0df2d77622805c422b8c2fbdb02823_720w_7778.jpg"),
        fileSize: "23.72MB",
      },
      {
        id: "444",
        name: "shanghai Soil",
        src: require("@/assets/map/v2-d36ccca3213e09091d17ec71e902cecc_720w_654.jpg"),
        fileSize: "1.66MB",
      },
      {
        id: "555",
        name: "长三角1:1000万自然人文地理",
        src: require("@/assets/map/v2-d36ccca3213e09091d17ec71e902cecc_720w_7034.jpg"),
        fileSize: "2.15GB",
      },
      {
        id: "111",
        name: "nanjing DEM",
        src: require("@/assets/map/land1_2855_3514.jpg"),
        fileSize: "23.72MB",
      },
      {
        id: "222",
        name: "shanghai DEM",
        src: require("@/assets/map/map_1_3697_8171.jpg"),
        fileSize: "49.2MB",
      },
      {
        id: "333",
        name: "shanghai landuse",
        src: require("@/assets/map/v2-cd0df2d77622805c422b8c2fbdb02823_720w_7778.jpg"),
        fileSize: "23.72MB",
      },
      {
        id: "444",
        name: "shanghai Soil",
        src: require("@/assets/map/v2-d36ccca3213e09091d17ec71e902cecc_720w_654.jpg"),
        fileSize: "1.66MB",
      },
      {
        id: "555",
        name: "长三角1:1000万自然人文地理",
        src: require("@/assets/map/v2-d36ccca3213e09091d17ec71e902cecc_720w_7034.jpg"),
        fileSize: "2.15GB",
      },
    ];
    return {
      resList,
    };
  },
};
</script>

<style lang="less" scoped>
.resListCard {
  margin: 15px;
}
.imageBox {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 70%;
}
.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.resListPagination {
  display: flex;
  align-items: center;
  justify-content: space-around;
  // flex-direction: column;
  margin-bottom: 20px;
}
.cardTitle {
  height: 30px;
  line-height: 30px;
  width: 62%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.downloadButton {
  width: 15%;
  float: right;
  height: 30px;
}
.fontSet {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #606266;
  vertical-align: middle;
}
.el-card {
  --el-card-padding: 0px;
}
</style>