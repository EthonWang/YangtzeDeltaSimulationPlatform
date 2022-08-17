<template>
  <div class="main">
    <div class="search" v-if="searchPage">
      <el-row style="padding-top: 7%">
        <div style="margin: auto; display: flex">
          <h1
            style="
              color: white;
              line-height: 70px;
              font-size: 50px;
              vertical-align: top;
            "
          >
            长三角资源目录 · 检索
          </h1>
          <!-- <img src="../assets/globle.svg" style="width: 70px; margin: 0 25px" /> -->
          <!-- <h1
            style="
              color: white;
              line-height: 70px;
              font-size: 50px;
              vertical-align: top;
            "
          >
            检索
          </h1> -->
        </div>
      </el-row>
      <el-row style="padding-top: 3%">
        <div class="startSearchBox">
          <!-- <el-input
            type="text"
            v-model="searchValue"
            placeholder=" 请输入想要检索的内容..."
            class="startSearchInput"
            size="large"
          /> -->
          <el-autocomplete
            v-model="searchValue"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            placeholder=" 请输入想要检索的内容..."
            @select="handleSelect"
            class="startSearchInput"
            size="large"
          />
          <el-button
            type="primary"
            class="startSearchButton"
            @click="startSearch()"
            >检索</el-button
          >
        </div>
      </el-row>
      <!-- <el-row style="padding-top: 3%">
        <div style="width: 30%; margin: auto; color: white;">
          <h4>热门搜索></h4>
        </div>
      </el-row> -->
    </div>
    <div class="content" v-else>
      <el-row>
        <el-col :span="5">
          <!-- <el-affix :offset="105"> -->
          <div class="tagTree">
            <tag-tree @tagClick="tagClick"></tag-tree>
          </div>
          <!-- </el-affix> -->
        </el-col>
        <el-col :span="19">
          <el-row>
            <div class="indexBox">
              <el-row class="searchBox">
                <div v-if="selectedTag.length > 0" class="selectedTag">
                  当前选择：<span class="selectedTagFont">{{
                    selectedTag[0]
                  }}</span>
                  <span v-if="selectedTag.length > 1" class="selectedTagFont"
                    >\{{ selectedTag[1] }}</span
                  >
                  <Divider type="vertical" style="margin-left: 30px" />
                </div>
                <span class="fontSet" style="font-size: 16px; margin-left: 35px"
                  >数据检索：</span
                >
                <el-input
                  v-model="searchValue"
                  placeholder="请输入内容"
                  class="searchInput"
                ></el-input>

                <el-button class="searchButton" @click="startSearch()"
                  >搜索</el-button
                >
                <el-button class="searchButton" @click="clearSearch()"
                  >重置</el-button
                >
              </el-row>
              <el-row class="sortBox">
                <div class="sortMoudle">
                  <span class="fontSet">排序：</span>
                  <el-link
                    class="sortButton"
                    :underline="false"
                    @click="sortByField('relativity')"
                    >相关度</el-link
                  >
                  <el-divider direction="vertical"></el-divider>
                  <el-link
                    class="sortButton"
                    :underline="false"
                    @click="sortByField('time')"
                    >最新
                    <span v-if="sortField == 'timeDown'">▼</span>
                    <span v-if="sortField == 'timeUp'">▲</span>
                  </el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-link
                    class="sortButton"
                    :underline="false"
                    @click="sortByField('size')"
                    >大小
                    <span v-if="sortField == 'sizeDown'">▼</span>
                    <span v-if="sortField == 'sizeUp'">▲</span>
                  </el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-checkbox v-model="visualChecked" class="sortCheckBox"
                    >仅显示支持可视化的数据</el-checkbox
                  >
                  <!-- <span class="fontSet">仅显示支持可视化的数据</span> -->
                  <el-divider direction="vertical"></el-divider>
                  <el-checkbox v-model="downloadChecked" class="sortCheckBox"
                    >仅显示公开下载的数据</el-checkbox
                  >
                  <!-- <span class="fontSet">仅显示支持下载的数据</span> -->
                </div>
                <div class="sortResult">
                  <span class="fontSet">共检索到 {{ dataNum }} 条数据资源，{{modelNum}}条模型资源</span>
                </div>
              </el-row>
            </div>
          </el-row>
          <el-row>
            <div class="resourceList">
              <resource-list
                :resList="resList"
                v-if="
                  resList.length > 0 &&
                  (selectedTag.length == 0 ||
                    selectedTag[0] == '专题' ||
                    selectedTag[0] == '数据')
                "
              ></resource-list>
              <el-result
                icon="info"
                v-if="
                  resList.length == 0 &&
                  (selectedTag.length == 0 ||
                    selectedTag[0] == '专题' ||
                    selectedTag[0] == '数据')
                "
              >
                <template #title>
                  <p style="color: rgb(131, 124, 124)">没有相关数据资源</p>
                </template>
                <template #sub-title>
                  <p>请联系管理员上传相应的数据资源</p>
                </template>
              </el-result>
              <el-divider v-if="selectedTag.length == 0 || selectedTag[0] == '专题'"></el-divider>
              <resource-list
                :resList="modelList"
                v-if="
                  modelList.length > 0 &&
                  (selectedTag.length == 0 ||
                    selectedTag[0] == '专题' ||
                    selectedTag[0] == '模型')
                "
              ></resource-list>
              <el-result
                icon="info"
                v-if="
                  modelList.length == 0 &&
                  (selectedTag.length == 0 ||
                    selectedTag[0] == '专题' ||
                    selectedTag[0] == '模型')
                "
              >
                <template #title>
                  <p style="color: rgb(131, 124, 124)">没有相关模型资源</p>
                </template>
                <template #sub-title>
                  <p>请联系管理员上传相应的模型资源</p>
                </template></el-result
              >
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { onMounted, ref } from "vue";
import tagTree from "@/components/resource/tagTree.vue";
import resourceList from "@/components/resource/resourceList.vue";
export default {
  name: "Resource",
  props: {},
  components: {
    tagTree,
    resourceList,
  },
  setup(props, ctx) {
    const router = useRouter();
    let searchPage = ref(true);
    let searchValue = ref("");
    let selectedTag = ref([]);
    let questionsSelectValue = ref("");
    let resList = ref([]);
    let modelList = ref([]);
    let sortField = ref("relativity"); //默认相关，共有relativity、timeUp、timeDown、sizeUp、sizeDown五类
    let dataNum = ref(0);
    let modelNum = ref(0);
    let visualChecked = ref(false);
    let downloadChecked = ref(false);
    const restaurants = ref([]);
    const store = useStore();
    const dataServer = store.getters.devIpAddress;
    onMounted(() => {
      getRouteValue();
      getAutocompleteList();
    });
    const getRouteValue = () => {
      let routerValue = router.currentRoute.value.query.searchValue;
      if (routerValue != undefined) {
        searchValue.value = routerValue;
        startSearch();
      }
    };
    let getAutocompleteList = function () {
      let DTO = {
        asc: false,
        page: 1,
        pageSize: 50,
        searchText: "",
        sortField: "createTime",
        tagClass: "problemTags",
        tagName: "",
      };
      axios({
        url: dataServer + "/getResourceDataList",
        method: "post",
        //忽略contentType
        contentType: false,
        //取消序列换 formData本来就是序列化好的
        processData: false,
        dataType: "json",
        data: DTO,
      }).then(
        (res) => {
          let list = res.data.data.content;
          for (let i = 0; i < list.length; i++) {
            restaurants.value.push({
              value: list[i].name,
              label: list[i].name,
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
    };
    const querySearch = (queryString, cb) => {
      const results = queryString
        ? restaurants.value.filter(createFilter(queryString))
        : restaurants.value;
      // call callback function to return suggestions
      cb(results);
    };
    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        );
      };
    };
    let startSearch = function () {
      let tagClass = "problemTags";
      let tagName = "";
      if (selectedTag.value.length == 0) {
        tagClass = "problemTags";
        tagName = "";
      } else if (selectedTag.value[0] == "专题") {
        tagClass = "problemTags";
        if (selectedTag.value.length == 1) {
          tagName = "";
        } else {
          tagName = selectedTag.value[1];
        }
      } else {
        tagClass = "normalTags";
        if (selectedTag.value.length == 1) {
          tagName = "";
        } else {
          tagName = selectedTag.value[1];
        }
      }
      let DTO = {
        asc: false,
        page: 1,
        pageSize: 16,
        searchText: searchValue.value,
        sortField: "createTime",
        tagClass: tagClass,
        tagName: tagName,
      };
      axios({
        url: dataServer + "/getResourceDataList",
        method: "post",
        //忽略contentType
        contentType: false,
        //取消序列换 formData本来就是序列化好的
        processData: false,
        dataType: "json",
        data: DTO,
      }).then(
        (res) => {
          searchPage.value = false;
          resList.value = res.data.data.content;
          dataNum.value = res.data.data.totalElements;
        },
        (err) => {
          console.log(err);
        }
      );
      axios({
        url: dataServer + "/getResourceModelList",
        method: "post",
        //忽略contentType
        contentType: false,
        //取消序列换 formData本来就是序列化好的
        processData: false,
        dataType: "json",
        data: DTO,
      }).then(
        (res) => {
          searchPage.value = false;
          modelList.value = res.data.data.content;
          modelNum.value = res.data.data.totalElements;
        },
        (err) => {
          console.log(err);
        }
      );
    };
    const clearSearch = function () {
      searchValue.value = "";
      visualChecked.value = false;
      downloadChecked.value = false;
      selectedTag.value = [];
      startSearch();
    };
    const tagClick = function (data) {
      selectedTag.value = data;
      startSearch();
    };
    let sortByField = function (type) {
      if (type == "relativity") {
        sortField.value = "relativity";
      } else if (type == "time") {
        if (sortField.value == "timeDown") {
          sortField.value = "timeUp";
        } else if (sortField.value == "timeUp") {
          sortField.value = "relativity";
        } else {
          sortField.value = "timeDown";
        }
      } else if (type == "size") {
        if (sortField.value == "sizeDown") {
          sortField.value = "sizeUp";
        } else if (sortField.value == "sizeUp") {
          sortField.value = "relativity";
        } else {
          sortField.value = "sizeDown";
        }
      }
    };
    return {
      searchPage,
      searchValue,
      startSearch,
      tagClick,
      selectedTag,
      questionsSelectValue,
      dataNum,
      sortField,
      sortByField,
      resList,
      modelList,
      modelNum,
      visualChecked,
      downloadChecked,
      clearSearch,
      querySearch,
    };
  },
};
</script>

<style lang="less" scoped>
.startSearchBox {
  width: 40%;
  height: 50px;
  margin: auto;
}

.startSearchButton {
  margin-left: 2%;
  width: 12%;
  height: 40px;
  font-size: 0.94vw;
  vertical-align: top;
}
.search {
  height: 100%;
  width: 100%;
  // background: url("../assets/night.jpg");
  // background-size: 100% 100%;
}
.main {
  margin-top: 65px;
  height: calc(100vh - 65px);
  background: url("../assets/night.jpg");
  background-size: 100% 100%;
}
.content {
  // background-color: rgba(255, 255, 255, 0.7);
  width: 80vw;
  padding-top: 2%;
  margin: auto;
}
.tagTree {
  // height: 800px;
  border: solid 0px rgb(255, 255, 255);
  // border-radius: 5px !important;
  box-shadow: 2px 4px 12px rgba(255, 255, 255, 0.5);
  // background-color: rgb(239, 143, 17);
  background: hsla(220, 100%, 5%, 0.3);
}
.indexBox {
  background: hsla(220, 100%, 5%, 0.3);
  margin-left: 10px;
  height: 120px;
  width: 100%;
  padding: 10px 0 5px 5px;
  border-bottom: solid 0.1px rgb(176, 174, 174);
  box-shadow: 2px 2px 6px rgba(255, 255, 255, 0.5) !important;
  // background-color: rgb(95, 239, 17);
}
.searchBox {
  height: 50px;
  // background-color: rgb(197, 193, 193);
  display: flex;
  line-height: 50px;
  // align-items: center;
  // justify-content: space-around;
  // flex-direction: column;
}
.searchInput {
  width: 30%;
  margin-top: 9px;
  margin-left: 15px;
}
.searchButton {
  margin-top: 9px;
  margin-left: 10px;
}
.questionsSelect {
  width: 20vw;
}
.sortBox {
  width: 100%;
  height: 50px;
  // background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // flex-direction: column;
}
.sortMoudle {
  height: 50px;
  margin-left: 15px;
}
.sortResult{
  margin-right: 25px;
}
.sortCheckBox {
  margin-left: 10px;
  vertical-align: sub;
  color: white;
}
.fontSet {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  // color: #606266;
  color: white;
  vertical-align: middle;
}
.sortButton {
  width: 60px;
  height: 50px;
  color: white;
}
.resourceList {
  // background-color: rgb(255, 255, 255);
  margin-left: 10px;
  // margin-top: 10px;
  // height: 600px;
  width: 100%;
  // border: solid 1px black;
  // background-color: rgb(17, 239, 213);
}
.selectedTag {
  height: 40px;
  line-height: 50px;
  margin-left: 15px;
  font-weight: 600;
  color: rgb(131, 124, 124);
}
.selectedTagFont {
  font-weight: 550;
  color: rgb(131, 124, 124);
}
/deep/.el-col-19 {
  width: 87%;
  max-width: 87%;
  position: absolute;
  left: 20%;
}
/deep/.el-col-5 {
  max-width: 20.8333333333%;
  flex: 0 0 20.8333333333%;
  margin-left: -5vw;
}
/deep/.el-card {
  // background: hsl(220, 100%, 5%);
  background: hsl(0, 0, 75%);
  // color: white;
  // border:0px;
  box-shadow: 2px 2px 8px rgba(255, 255, 255, 0.5) !important;
}
/deep/.el-link {
  color: rgba(255, 255, 255, 0.8);
}
</style>
<style>
.startSearchInput {
  margin-left: 2%;
  width: 80%;
  height: 40px;
  font-size: 0.94vw;
}
</style>
