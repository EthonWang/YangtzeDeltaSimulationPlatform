<template>
  <div class="about">
    <!-- <ModelTree style=""
      @getCheckData="getCheckData"
      @getCheckChart="getCheckChart"
      @getCheckTif="getCheckTif"
      @getCheckJson="getCheckJson"
    ></ModelTree> -->
    <el-button size="small" @click="switchMap" class="mapSwitchButton"
      ><el-icon><Camera /></el-icon>&nbsp;2D/3D
    </el-button>
    <el-button
      size="small"
      @click="this.router.push('/user/task')"
      class="backButton"
      ><el-icon><ArrowLeftBold /></el-icon>&nbsp;返回
    </el-button>
    <mapbox-view
      :shpShowList="shpList"
      @openTxtEditor="openTxtEditor"
      v-show="mapType == 'mapBox'"
      ref="mapBoxView"
      @getCheckData="getCheckData"
      @getCheckChart="getCheckChart"
      @getCheckTif="getCheckTif"
      @getCheckJson="getCheckJson"
    ></mapbox-view>
    <cesium
      :tifList="tifList"
      :jsonList="jsonList"
      v-show="mapType == 'cesium'"
    />

    <!-- echarts图表 -->
    <div v-for="item in chartList" :key="item.id">
      <chart-template
        style="z-index: 1000"
        v-if="item.mapDataType == 'chart' || item.mapDataType == 'raster'"
        :data="item"
        @closeChart="closeChart"
      />
    </div>
  </div>
  <!-- 富文本编辑器 -->
  <Modal
    v-model="txtEditorModal"
    draggable
    sticky
    scrollable
    :closable="false"
    :mask="false"
    :width="1000"
    v-if="txtEditorModal"
  >
    <template #header>
      <Icon type="md-create" size="18" />
      <span style="margin-left: 5px; font-size: 18px">文本编辑器</span>
      <span style="margin-left: 300px; font-size: 18px">{{
        txtInfo.name
      }}</span>
    </template>
    <txt-editor :txtInfo="txtInfo" @saveTxtHtml="saveTxtHtml"></txt-editor>
    <template #footer>
      <Button @click="handleTxtEditorClose">取消</Button>
      <Button type="primary" @click="handleTxtEditorClose">确认</Button>
    </template>
  </Modal>
  <!-- <el-card class="recommend">
    <div
      class="card-header"
      style="margin-top: 4%; font-size: 25px; font-weight: 600"
    >
      <span>推荐数据</span>
    </div>
    <el-divider
      style="width: 100%; border-color: black !important"
    ></el-divider>
    <div
      class="recommend_item"
      style=""
      v-for="data in dataRecommend"
      :key="data"
    >
      {{ data.name }}
    </div>
  </el-card> -->

  <el-button
    size="small"
    @click="showRecommend"
    style="position: absolute; right: 50px; top: 8vh"
    ><span v-if="recommendList"
      ><el-icon><ArrowUpBold /></el-icon>&nbsp;收起</span
    >
    <span v-else
      ><el-icon><ArrowDownBold /></el-icon>&nbsp;展开</span
    ><strong style="color: hsl(200, 100%, 45%)">数据推荐</strong>
  </el-button>
  <div class="levels">
    <div
      class="level"
      v-for="data in dataRecommend"
      :key="data"
      @click="recommendShow(data)"
    >
      <div class="content">
        {{ data.name.slice(0, 18) + "\n" + data.name.slice(18) }}
      </div>
    </div>
  </div>
  <el-dialog v-model="recommendVisible" title="推荐数据" width="30%">
   <el-descriptions
    class="margin-top"
    title=""
    :column="1"
    :size="'large'"
    border
  >
  <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <user />
          </el-icon>
          数据名称
        </div>
      </template>
      <span>{{ recommendShowOne.name }}</span>
    </el-descriptions-item>
    </el-descriptions>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="recommendVisible = false">取消</el-button>
        <el-button type="primary" @click="addtoLab()">加入本实验</el-button>
      </span>
    </template>
  </el-dialog>

<el-button style="position: absolute;z-index: 100;top: 50%;left: 50%;" @click="myDataVisible=true">打开我的数据</el-button>
<el-dialog v-model="myDataVisible" title="我的数据" width="80%" draggable>
   <div style="height: 60vh;width: 80vw;">
<DataCenter></DataCenter>
   </div>
   
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="myDataVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  
</template>

<!--<script setup>-->
<script>
//采用vue2写法的话把setup去掉，
import axios from "axios";
import { reactive, computed, ref } from "vue";
import { toRaw } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import MapboxView from "../components/Mapbox/MapboxView";
import Cesium from "../components/cesium/cesium.vue";
import chartTemplate from "../components/chartPlugin/chartTemplate.vue";
import ModelTree from "components/App/ModelTree";
import txtEditor from "../components/Mapbox/labUtils/wangEditorBox.vue";
import taskApi from "@/api/user/task";
import { ElMessageBox, ElMessage } from "element-plus";
import graphAPI from "@/api/user/graph";
import DataCenter from "@/components/User/UserFunctionCollection/DataCenter.vue";

export default {
  components: {
    // ModelTree,
    MapboxView,
    Cesium,
    chartTemplate,
    txtEditor,
    DataCenter,
  },
  data() {
    return {
      task_api: new taskApi(),
      recommendShowOne: {},
      recommendList: true,
      recommendVisible: false,
      myDataVisible:false,
      res_list: JSON.parse(localStorage.getItem("task")).dataList,
      mapType: "mapBox",
      //使用mapbox-view组件需要传递的参数
      shpList: [], //格式参考[{name: "111", type: "circle", nameId: "111_123"}]
      checkedData: [],
      //使用chart组件需要传递的参数
      fileDate: "null",
      tifList: [],
      chartList: [],
      jsonList: [],
      txtEditorModal: false,
      txtData: "",
      isTxtContent: false,
      dataServer: useStore().state.devIpAddress,
      graphapi: new graphAPI(),
      user_info: JSON.parse(localStorage.getItem("userInfo")),
      router: useRouter(),
      dataRecommend: [],
    };
  },
  mounted() {
    if (this.user_info != undefined) {
      setTimeout(() => {
        // this.graphapi.initGraph(this.user_info.id).then((res) => {
        let haveData = [];
        for (let i = 0; i < this.res_list.length; i++) {
          let name = this.res_list[i].name;
          haveData.push(name);
        }
        console.log(haveData);
        this.dataRecommend = this.graphapi.giveRecommend(haveData);
        console.log("推荐", this.dataRecommend);
        // });
      }, 800);
    }

    let mapType = this.getURLParameter("mapType");
    if (mapType != null) {
      if (mapType == "cesium") {
        this.mapType = "cesium";
      } else if (mapType == "mapBox") {
        this.mapType = "mapBox";
      }
    }
  },

  methods: {
    recommendShow(data) {
      this.recommendVisible = true;
      this.recommendShowOne = data;
    },
    showRecommend() {
      let dom = document.getElementsByClassName("level");

      if (this.recommendList) {
        document.getElementsByClassName("levels")[0].style.pointerEvents =
          "none";
        // document.getElementsByClassName("level")[0].style.opacity="0.5"
        for (
          let i = 0;
          i < document.getElementsByClassName("level").length;
          i++
        ) {
          if (i == 0) {
            continue;
          }
          let ele = document.getElementsByClassName("level")[i];
          ele.style.marginTop = "-50px";
          ele.style.opacity = "0.75";
        }
      } else {
        document.getElementsByClassName("levels")[0].style.pointerEvents =
          "auto";
        // document.getElementsByClassName("level")[0].style.opacity="0.95"
        for (
          let i = 0;
          i < document.getElementsByClassName("level").length;
          i++
        ) {
          if (i == 0) {
            continue;
          }
          let ele = document.getElementsByClassName("level")[i];
          ele.style.marginTop = "-25px";
          ele.style.opacity = "0.95";
        }
      }

      this.recommendList = !this.recommendList;
    },
    addtoLab() {
      if ("id_backup" in this.recommendShowOne) {
        this.recommendShowOne["id"] = this.recommendShowOne["id_backup"];
        delete this.recommendShowOne["id_backup"];
      }

      let newTask = JSON.parse(localStorage.getItem("task"));

      this.task_api.addData(newTask, [this.recommendShowOne]);
      newTask.dataList.push(this.recommendShowOne);
      localStorage.setItem("task", JSON.stringify(newTask));
      this.recommendVisible = false;
      location.reload();
    },
    switchMap() {
      if (this.mapType == "mapBox") {
        this.mapType = "cesium";
        this.changeURLParameter("cesium");
      } else {
        this.mapType = "mapBox";
        this.changeURLParameter("mapBox");
      }
    },
    closeChart(value) {
      for (let i = 0; i < this.chartList.length; i++) {
        if (this.chartList[i].id == value) {
          this.chartList.splice(i, 1);
          // 与modelTree组件通讯，修改check
        }
      }
    },
    getCheckData(data) {
      //将选中的目录树的data值覆给shpList
      this.mapType = "mapBox";
      this.changeURLParameter("mapBox");
      this.shpList = JSON.parse(JSON.stringify(data));
      console.log("this.shpList: ", toRaw(this.shpList));
    },
    getCheckTif(data) {
      //tifList
      this.mapType = "cesium";
      this.changeURLParameter("cesium");
      this.tifList = JSON.parse(JSON.stringify(data));
      console.log("this.tifList: ", toRaw(this.tifList));
    },
    getCheckChart(data) {
      this.chartList.push(data);
      console.log("this.chartList: ", toRaw(this.chartList));
    },
    getCheckJson(data) {
      this.mapType = "cesium";
      this.changeURLParameter("cesium");
      this.jsonList = JSON.parse(JSON.stringify(data));
      console.log("this.jsonList: ", toRaw(this.jsonList));
    },
    getURLParameter(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    changeURLParameter(name) {
      window.history.replaceState(null, null, "/model?mapType=" + name);
    },
    openTxtEditor(info) {
      this.txtInfo = info;
      this.txtEditorModal = !this.txtEditorModal;
    },
    saveTxtHtml(html, isTxtContent) {
      let tempTxt = html;
      tempTxt = tempTxt.toString().replace(/<\/.*?>/g, "\r\n");
      tempTxt = tempTxt.toString().replace(/<.*?>/g, "");
      this.txtData = tempTxt;
      this.isTxtContent = isTxtContent;
    },
    handleTxtEditorClose() {
      if (this.isTxtContent) {
        ElMessageBox.confirm("是否保存更改?", "文本编辑器", {
          confirmButtonText: "保存",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.commitTxtChange();
            this.txtEditorModal = false;
          })
          .catch(() => {
            this.txtEditorModal = false;
          });
      } else {
        this.txtEditorModal = false;
      }
    },
    confirmUpdateTxtFile() {
      this.confirmUpdateTxtFileModal = true;
      // this.commitTxtChange();
    },
    commitTxtChange() {
      let formData = new FormData();
      formData.append("txtData", this.txtData);
      formData.append("fileRelativePath", this.txtInfo.data.fileRelativePath);
      formData.append("visualType", this.txtInfo.data.visualType);
      formData.append("fileStoreName", this.txtInfo.data.fileStoreName);
      formData.append("id", this.txtInfo.data.id);
      formData.append("taskId", JSON.parse(localStorage.getItem("task")).id);
      axios
        .post(this.dataServer + "/LabTask/updateLabTxtFile", formData)
        .then((res) => {
          if (res.data.code == 0) {
            console.log(res.data.data);
            localStorage.setItem("task", JSON.stringify(res.data.data));
            this.$refs.mapBoxView.updateTxtInfo(res.data.data);
            ElMessage({
              type: "success",
              message: "修改成功！",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
</script>

<style lang="less" scoped>
// 兼容css
.about {
  position: relative;
  height: 100vh;
}
.mapSwitchButton {
  position: absolute;
  top: 75px;
  left: 215px;
  z-index: 1000;
}
.backButton {
  position: absolute;
  top: 75px;
  left: 29px;
  z-index: 1000;
}
.recommend {
  position: fixed;
  right: 100px;
  top: 100px;
  width: 13vw;
  height: fit-content;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  border: 0px !important;
  background: #e7e7e7;
  box-shadow: inset 3px 3px 3px #474747, inset -4px -4px 3px #ffffff !important;
  .recommend_item {
    text-align: center;
    margin: 0;
    font-size: 20px;
    cursor: pointer;
    border-radius: 5px;
    width: 100%;
    padding: 10px;
    &:hover {
      background: #474747;
      color: #e7e7e7;
    }
  }
}
</style>
<style lang="css">
:root {
  --fontColor: #ffffff;
  --three1: #bd7be8;
  --three2: #8063e1;
  --two1: #7f94fc;
  --two2: #3f58e3;
  --one1: #21bbfe;
  --one2: #2c6fd1;
  --four1: #415197;
  --four2: #352f64;
  --levelShadow: #22325480;
}
.levels {
  position: absolute;
  top: 15%;
  right: 3%;
  margin-left: -140px;
  margin-top: 0px;
  transform-style: preserve-3d;
  user-select: none;
}
.levels .level {
  filter: brightness(120%);
  /* filter:  */
  display: flex;
  justify-content: center;
  align-items: flex-end;
  justify-items: center;
  width: 140px;
  min-height: 60px;
  padding: 5%;
  border-radius: 5px;
  color: var(--fontColor);
  cursor: pointer;
  transition: all 0.4s ease;
  transform: rotateX(45deg) rotateY(-15deg) rotate(25deg);
  opacity: 0.95;
  margin-top: -25px;
  table-layout: fixed;
  word-wrap: break-all;
  word-break: normal;
}
.levels .level:nth-child(4n + 1) {
  background: linear-gradient(135deg, var(--one1), var(--one2));
  box-shadow: 20px 20px 60px var(--levelShadow), 1px 1px 0px 1px var(--one2);
  z-index: 4;
}
.levels .level:nth-child(4n + 2) {
  background: linear-gradient(135deg, var(--two1), var(--two2));
  box-shadow: 20px 20px 60px var(--levelShadow), 1px 1px 0px 1px var(--two2);
  z-index: 3;
}
.levels .level:nth-child(4n + 3) {
  background-image: linear-gradient(135deg, var(--three1), var(--three2));
  box-shadow: 20px 20px 60px var(--levelShadow), 1px 1px 0px 1px var(--three2);
  z-index: 2;
}
.levels .level:nth-child(4n + 4) {
  background-image: linear-gradient(135deg, var(--four1), var(--four2));
  box-shadow: 20px 20px 60px var(--levelShadow), 1px 1px 0px 1px var(--four2);
  z-index: 1;
}
.levels .level .title {
  position: absolute;
  top: 8px;
  font-weight: 700;

  left: 15px;
  font-size: 16px;
}
.levels .level .content {
  /* position: absolute; */
  /* top: 22px; */

  /* left: 15px; */
  line-height: 100%;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
  width: 100%;
  table-layout: fixed;
  word-wrap: break-all;
  word-break: normal;
  filter: brightness(200%);
  overflow-x: hidden;
}
.levels .level:hover {
  filter: brightness(130%);
  transform: rotateX(30deg) rotateY(0deg) rotate(0deg) translate(-40px, 10px);
  z-index: 100;
  opacity: 1;
  border:1px solid rgb(153, 153, 153)
}
.levels .level:hover:after {
  transform: translateX(100%);
  transition: all 1.2s ease-in-out;
}
/* .levels .level::after {
  content: '';
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateX(-100%);
  background: linear-gradient(60deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.1), rgba(255,255,255,0) 80%);
} */
</style>
