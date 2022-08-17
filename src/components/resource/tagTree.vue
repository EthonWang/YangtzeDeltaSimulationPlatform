<template>
  <div class="tagTreeContent">
    <el-row
      class="tagContent fontSet"
      style="font-weight: 800; font-size: 20px"
    >
      资源分类 （
      <a @click="clearTagClick()" style="cursor: pointer; color: gray">全部</a>
      ）
    </el-row>
    <!-- <el-divider style="margin: 5px 0 5px 5px;width: 95%;opacity: 0.75;"></el-divider> -->
    <div v-for="(item, index) in tagList" :key="index">
      <el-row class="tagTitle">
        <el-link @click="tagClick(item, 1)" class="clickStyle clickTitle">{{
          item.name
        }}</el-link>
      </el-row>
      <el-row class="tagContent">
        <span v-for="(i, index) in item.list" :key="index" class="tagSpan">
          <el-link @click="tagClick(item, 2, i)" class="clickStyle">{{
            i
          }}</el-link>
        </span>
      </el-row>
    </div>
    <el-row
      class="tagContent fontSet"
      style="font-weight: 600; font-size: 16px; margin-top: 10px"
    >
      历史搜索
    </el-row>

    <el-row
      class="tagContent fontSet"
      style="font-weight: 600; font-size: 16px; margin-top: 10px"
    >
      更多操作
    </el-row>
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
        name: "专题",
        list: [
          "流域水循环及其驱动机制",
          "全球变化与区域环境演化",
          "长三角灾害响应与治理",
          "长三角城市化与人地关系协调发展",
        ],
      },
      {
        name: "数据",
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
          "水文",
          "农业",
        ],
      },
      {
        name: "模型",
        list: ["水文模型", "土壤模型", "大气模型", "生态模型", "社会经济模型", "其他模型"],
      },
      {
        name: "其他",
        list: ["学术研究","说明文档"],
      },
    ];
    const clearTagClick = function () {
      let emitData = [];
      ctx.emit("tagClick", emitData);
    };
    const tagClick = function (item, level, i2) {
      let emitData = [];
      if (level == 1) {
        emitData.push(item.name);
      } else if (level == 2) {
        emitData.push(item.name);
        emitData.push(i2);
      }
      ctx.emit("tagClick", emitData);
    };
    return {
      tagList,
      clearTagClick,
      tagClick,
    };
  },
};
</script>

<style scoped>
.tagTreeContent {
  margin: auto;
  width: 100%;
  border-radius: 15px;
}
.tagTitle {
  padding-left: 7px;
  height: 40px;
  line-height: 40px;
  background-color: rgba(70, 85, 97,0.2);
  border-top:1px solid rgba(255, 255, 255,0.5);
}
.tagContent {
  padding-left: 7px;
  /* height: 45px; */
  line-height: 40px;
  background: hsla(220, 100%, 5%,0);
  /* background-color: white; */
  /* border: solid 1px black; */
}
.tagSpan {
  margin-right: 7px;
}
.clickStyle {
  cursor: pointer;
}
.clickTitle{
  font-size: 18px !important;
  font-weight: 500;
}
.fontSet {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #bec2ca;
  vertical-align: middle;
}
</style>