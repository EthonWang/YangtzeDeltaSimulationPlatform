<template>
  <div class="about">
    <el-button size="small" @click="switchMap" class="mapSwitchButton"
      >2D/3D
    </el-button>
    <mapbox-view
      :shpShowList="shpList"
      @openTxtEditor="openTxtEditor"
      v-show="mapType == 'mapBox'"
    ></mapbox-view>
    <cesium
      :tifList="tifList"
      :jsonList="jsonList"
      v-show="mapType == 'cesium'"
    />

    <!-- echarts图表 -->
    <div v-for="item in chartList" :key="item.dataSourceId">
      <chart-template
        style="z-index: 1000"
        v-if="item.mapDataType == 'chart'"
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
    :mask="false"
    @on-ok="ok"
    @on-cancel="cancel"
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
    <txt-editor :txtInfo="txtInfo"></txt-editor>
  </Modal>
</template>

<!--<script setup>-->
<script>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { toRaw } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import MapboxView from "../components/Mapbox/MapboxView";
import Cesium from "../components/cesium/cesium.vue";
import chartTemplate from "../components/chartPlugin/chartTemplate.vue";
// import ModelTree from "components/App/ModelTree";
import txtEditor from "../components/Mapbox/labUtils/wangEditorBox.vue";
export default {
  components: {
    // ModelTree,
    MapboxView,
    Cesium,
    chartTemplate,
    txtEditor,
  },
  data() {
    return {
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
    };
  },
  mounted() {
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
        if (this.chartList[i].dataSourceId == value) {
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
      this.chartList = JSON.parse(JSON.stringify(data));
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
    saveTxtHtml(html) {
      // console.log(html);
      this.txtData = html;
    },
    commitTxtChange() {
      console.log(this.txtData);
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
  left: 40px;
  z-index: 1000;
}
</style>

