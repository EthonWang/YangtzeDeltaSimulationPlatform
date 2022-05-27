<template>
  <div class="tagTreeContent">
    <el-row class="tagContent fontSet" style="font-weight: 600; font-size: 16px;"> 数据分类体系 </el-row>
    <div v-for="(item, index) in tagList" :key="index">
      <el-row class="tagTitle">
        <el-link @click="tagClick(item, 1)" class="clickStyle">{{ item.name }}</el-link>
      </el-row>
      <el-row class="tagContent">
        <span v-for="(i, index) in item.list" :key="index" class="tagSpan">
          <el-link @click="tagClick(item, 2, i)" class="clickStyle">{{ i }}</el-link>
        </span>
      </el-row>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
export default {
  name: "tagTree",
  props: [],
  emits: ["tagClick"],
  setup(props, ctx) {
    let tagList = [
      {
        name: "陆地表层",
        list: [
          "基础地理",
          "土地利用/覆盖",
          "人口",
          "社会经济",
          "地形",
          "地貌",
          "土壤",
          "湖泊",
          "植被",
          "生态系统",
          "灾害",
          "环境",
          "气候",
        ],
      },
      {
        name: "陆地水圈",
        list: ["地表水", "水利工程", "水环境", "水文"],
      },
      {
        name: "大气圈",
        list: ["综合观测"],
      },
      {
        name: "自然资源",
        list: ["土地资源", "农业资源", "旅游资源", "气候资源", "水资源"],
      },
      {
        name: "海洋",
        list: ["基础地理", "土地利用/覆盖", "统计资料"],
      },
      {
        name: "固体地球与古环境",
        list: ["地质", "陆地记录"],
      },
      {
        name: "遥感数据",
        list: ["卫星影像", "反演数据产品"],
      },
      {
        name: "历史数据",
        list: ["历史地图数据"],
      },
    ];
    const tagClick = function (item,level,i2) {
        let emitData = [];
        if(level == 1){
            emitData.push(item.name);
        } else if (level == 2){
            emitData.push(item.name);
            emitData.push(i2)
        }
      ctx.emit("tagClick", emitData);
    };
    return {
      tagList,
      tagClick
    };
  },
};
</script>

<style scoped>
.tagTreeContent {
  margin: auto;
  width: 100%;
}
.tagTitle {
  padding-left: 7px;
  height: 40px;
  line-height: 40px;
  background-color: rgb(181, 213, 241);
  /* border: solid 1px black; */
}
.tagContent {
  padding-left: 7px;
  /* height: 45px; */
  line-height: 40px;
  background-color: white;
  /* border: solid 1px black; */
}
.tagSpan {
  margin-right: 7px;
}
.clickStyle{
    cursor: pointer;
}
.fontSet {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  vertical-align: middle;
}
</style>