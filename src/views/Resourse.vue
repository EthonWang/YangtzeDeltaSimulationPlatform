<template>
  <div class="main">
    <div class="content">
      <el-row>
        <el-col :span="5">
          <div class="tagTree">
            <tag-tree @tagClick="tagClick"></tag-tree>
          </div>
        </el-col>
        <el-col :span="19">
          <el-row>
            <div v-if="selectedTag.length > 0" class="selectedTag">
              当前选择：<span class="selectedTagFont">{{
                selectedTag[0]
              }}</span>
              <span v-if="selectedTag.length > 1" class="selectedTagFont"
                >\{{ selectedTag[1] }}</span
              >
            </div>
          </el-row>
          <el-row>
            <div class="indexBox">
              <el-row class="searchBox">
                <span class="fontSet" style="font-size: 16px">数据检索：</span>
                <el-input
                  v-model="searchInputValue"
                  placeholder="请输入内容"
                  class="searchInput"
                ></el-input>
                <span class="fontSet" style="font-size: 16px"
                  >涉及问题选择：</span
                >
                <el-select
                  v-model="questionsSelectValue"
                  placeholder="请选择"
                  class="questionsSelect"
                >
                  <el-option
                    v-for="item in questionsSelectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-button>搜索</el-button>
                <el-button>重置</el-button>
              </el-row>
              <el-row class="sortBox">
                <div class="sortMoudle">
                  <span class="fontSet">排序：</span>
                  <el-link class="sortButton" :underline="false"  @click="sortByField('relativity')"
                    >相关度</el-link
                  >
                  <el-divider direction="vertical"></el-divider>
                  <el-link class="sortButton" :underline="false" @click="sortByField('time')">最新
                    <span v-if="sortField == 'timeDown'">▼</span>
                    <span v-if="sortField == 'timeUp'">▲</span>
                  </el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-link class="sortButton" :underline="false" @click="sortByField('size')">大小
                    <span v-if="sortField == 'sizeDown'">▼</span>
                    <span v-if="sortField == 'sizeUp'">▲</span>
                  </el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-checkbox v-model="checked" class="sortCheckBox"
                    >仅显示支持可视化的数据</el-checkbox
                  >
                  <!-- <span class="fontSet">仅显示支持可视化的数据</span> -->
                  <el-divider direction="vertical"></el-divider>
                  <el-checkbox v-model="checked1" class="sortCheckBox"
                    >仅显示公开下载的数据</el-checkbox
                  >
                  <!-- <span class="fontSet">仅显示支持下载的数据</span> -->
                </div>
                <div>
                  <span class="fontSet">共 {{ dataNum }} 条数据</span>
                </div>
              </el-row>
            </div>
          </el-row>
          <el-row>
            <div class="resourceList">
              <resource-list></resource-list>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import tagTree from "@/components/resource/tagTree.vue";
import resourceList from "@/components/resource/resourceList.vue";
export default {
  name: "resource",
  props: {},
  components: {
    tagTree,
    resourceList,
  },
  setup(props, ctx) {
    let selectedTag = ref([]);
    let searchInputValue = ref("");
    let questionsSelectValue = ref("");
    let sortField = ref("relativity"); //默认相关，共有relativity、timeUp、timeDown、sizeUp、sizeDown五类
    let dataNum = 5;
    let questionsSelectOptions = [
      {
        value: "选项1",
        label: "流域水循环及其驱动机制",
      },
      {
        value: "选项2",
        label: "全球变化与区域环境演化",
      },
      {
        value: "选项3",
        label: "长三角灾害响应与治理",
      },
      {
        value: "选项4",
        label: "长三角城市化与人地关系协调发展",
      },
    ];
    const tagClick = function (data) {
      selectedTag.value = data;
    };
    let sortByField = function(type) {
      if(type == "relativity"){
        sortField.value = "relativity";
      } else if (type == "time"){
        if(sortField.value == "timeDown"){
          sortField.value = "timeUp"
        } else if(sortField.value == "timeUp"){
          sortField.value = "relativity"
        } else {
          sortField.value = "timeDown"
        }
      } else if (type == "size"){
        if(sortField.value == "sizeDown"){
          sortField.value = "sizeUp"
        } else if(sortField.value == "sizeUp"){
          sortField.value = "relativity"
        } else {
          sortField.value = "sizeDown"
        }
      }
    };
    return {
      tagClick,
      selectedTag,
      searchInputValue,
      questionsSelectValue,
      questionsSelectOptions,
      dataNum,
      sortField,
      sortByField,
    };
  },
};
</script>

<style lang="less" scoped>
.main {
  margin-top: 4%;
  // height: 96%;
  background-color: white;
}
.content {
  width: 80vw;
  padding-top: 2%;
  margin: auto;
}
.tagTree {
  // height: 800px;
  border: solid 1px black;
  // background-color: rgb(239, 143, 17);
}
.indexBox {
  margin-left: 10px;
  height: 100px;
  width: 100%;
  border: solid 1px black;
  // background-color: rgb(95, 239, 17);
}
.searchBox {
  height: 50px;
  background-color: rgb(197, 193, 193);
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}
.searchInput {
  width: 16vw;
}
.questionsSelect {
  width: 20vw;
}
.sortBox {
  height: 50px;
  display: flex;
  align-items: center;
  // justify-content: space-around;
  // flex-direction: column;
}
.sortMoudle {
  width: 90%;
  height: 50px;
  margin-left: 15px;
}
.sortCheckBox {
  margin-left: 10px;
  vertical-align: sub;
}
.fontSet {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  vertical-align: middle;
}
.sortButton {
  width: 60px;
  height: 50px;
}
.resourceList {
  margin-left: 10px;
  margin-top: 10px;
  // height: 600px;
  width: 100%;
  // border: solid 1px black;
  // background-color: rgb(17, 239, 213);
}
.selectedTag {
  height: 40px;
  line-height: 40px;
  margin-left: 15px;
  font-weight: 600;
}
.selectedTagFont {
  font-weight: 550;
  color: rgb(131, 124, 124);
}
</style>