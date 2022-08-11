<template>
  <el-row>
    <el-col :span="6" v-for="(item, index) in props.resList" :key="index">
      <el-card class="resListCard">
        <div class="imageBox">
          <el-image
            :src="dataServer + item.imgWebAddress"
            class="image"
            :fit="contain"
          ></el-image>
        </div>
        <div style="padding: 7px">
          <span class="cardTitle" :title="item.name">{{ item.name }}</span>
          <el-button
            class="downloadButton"
            style="margin-left: 2px"
            type="info"
            @click="showMapCard(item)"
            >查看</el-button
          >
          <el-button class="downloadButton" @click="downloadRes(item)"
            >下载</el-button
          >
          <div class="fontSet" style="margin: 5px 0" v-if="'fileSize' in item">
            <span>{{ filterSizeType(item.fileSize) }}</span
            ><br />
            <span>{{ item.userEmail }}</span>
            <span style="float: right">{{
              item.createTime.split(" ")[0]
            }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="resListPagination">
    <el-pagination background layout="prev, pager, next" :total="5">
    </el-pagination>
  </el-row>
  <el-dialog
    v-model="mapCardDialogVisible"
    :title="selectedRes.name"
    width="60%"
    custom-class="mapboxCardDialog"
  >
    <mapbox-card :jsonData="selectedRes"></mapbox-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="show_task = true"
          >添加到个人实验室</el-button
        >
        <el-button @click="mapCardDialogClose()">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="show_task"
    title="添加到实验室"
    width="30%"
    :before-close="handleClose"
  >
    <h3 style="margin-bottom: 15px">选择要添加的资源</h3>
    <el-scrollbar max-height="35vh">
      <el-checkbox-group
        v-model="selectedVisualDataItems"
        @change="selectedVisualDataItemsRangeChangeBefore"
      >
        <el-checkbox
          :label="item.name"
          v-for="(item, index) in selectedRes.visualDataItems"
          :key="index"
        />
      </el-checkbox-group>
    </el-scrollbar>
    <div
      class="slider-demo-block"
      v-if="
        selectedRes.visualDataItems.length >= 30 &&
        selectedVisualDataItems.length >= 1
      "
    >
      <span class="demonstration" v-if="selectedVisualDataItems.length == 1"
        >快速选择</span
      >
      <span class="demonstration" v-else
        >已选择 {{ selectedVisualDataItemsRange[0] }} -
        {{ selectedVisualDataItemsRange[1] }}</span
      >
      <el-slider
        v-model="selectedVisualDataItemsRange"
        range
        :marks="guideMarks"
        :max="selectedRes.visualDataItems.length"
        @change="selectedVisualDataItemsRangeChange"
      />
    </div>
    <el-divider border-style="dashed" />
    <el-checkbox
      v-if="selectedVisualDataItems.length >= 1"
      v-model="setSelectedVisualDataItemsDataSet"
      label="设置为数据集"
      title="选中后，将会把所选择要添加的资源打包成一个数据集，添加到实验室中"
      size="large"
      style="margin-bottom: 15px"
    />
    <h3 style="margin-bottom: 15px">选择要添加到的实验室</h3>
    <el-button
      v-for="task in task_list"
      :key="task"
      @click="addDataToTask(task)"
    >
      <el-icon><Monitor /></el-icon> &nbsp; {{ task.name }}</el-button
    >
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show_task = false">取消</el-button>
        <!-- <el-button type="primary" @click="show_task = false">完成</el-button> -->
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, defineProps, computed } from "vue";
import { ElMessageBox } from "element-plus";
import MapboxCard from "../Mapbox/MapboxCard.vue";
import { ElMessage } from "element-plus";
import taskApi from "@/api/user/task";
import { useStore } from "vuex";
import { randomInt } from "d3-random";

const store = useStore();
const dataServer = store.getters.devIpAddress;
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const task_api = new taskApi();
const show_task = ref(false);
const task_list = ref([]);
const selectedVisualDataItems = ref([]);
const selectedVisualDataItemsRange = ref([0, 0]);
const setSelectedVisualDataItemsDataSet = ref(false);
const mapCardDialogVisible = ref(false);
const selectedRes = ref({});
task_api.getTaskList(userInfo.id).then((res) => {
  for (let i in res.data.data) {
    task_list.value.push(res.data.data[i]);
  }
});

const props = defineProps({
  resList: Array,
});
const addDataToTask = (task) => {
  console.log(selectedRes.value);
  if ("mdl" in selectedRes.value) {
    // console.log(234);
    let data = selectedRes.value;
    data["simularTrait"] = "model";
    task_api.addData(task, [data]);
  } else {
    let dataList = [];
    console.log(selectedVisualDataItems.value);
    if (setSelectedVisualDataItemsDataSet.value) {
      //设置集
      let dataSet = {};
      dataSet.createTime = selectedRes.value.createTime;
      dataSet.description = selectedRes.value.description;
      dataSet.id =
        selectedRes.value.id + Math.floor(Math.random() * 10 + 1).toString();
      dataSet.name = selectedRes.value.name + "_dataSet";
      dataSet.normalTags = selectedRes.value.normalTags;
      dataSet.problemTags = selectedRes.value.problemTags;
      dataSet.publicBoolean = selectedRes.value.publicBoolean;
      dataSet.type = selectedRes.value.type;
      dataSet.visualType = "dataSet";
      dataSet.visualizationBoolean = selectedRes.value.visualizationBoolean;
      dataSet.dataSetList = [];
      for (let i in selectedVisualDataItems.value) {
        let dataName = selectedVisualDataItems.value[i];
        for (let j in selectedRes.value.visualDataItems) {
          let data = selectedRes.value.visualDataItems[j];
          if (dataName == data.name) {
            dataSet.dataSetList.push(data);
            dataSet.visualWebAddress = data.visualWebAddress;
          }
        }
      }
      dataSet["simularTrait"] = "data";
      dataList.push(dataSet);
      // console.log(dataSet);
    } else {
      for (let i in selectedVisualDataItems.value) {
        let dataName = selectedVisualDataItems.value[i];
        for (let j in selectedRes.value.visualDataItems) {
          let data = selectedRes.value.visualDataItems[j];
          if (dataName == data.name) {
            console.log(1);
            data["simularTrait"] = "data";
            dataList.push(data);
          }
        }
      }
      selectedVisualDataItemsRange.value = [0, 0];
      selectedVisualDataItems.value = [];
    }
    task_api.addData(task, dataList);
  }
  show_task.value = false;
  mapCardDialogVisible.value = false;
};

const handleClose = function (done) {
  ElMessageBox.confirm("确定关闭此窗口?")
    .then(() => {
      selectedVisualDataItemsRange.value = [0, 0];
      selectedVisualDataItems.value = [];
      done();
    })
    .catch(() => {
      // catch error
    });
};
const mapCardDialogClose = function () {
  selectedVisualDataItemsRange.value = [0, 0];
  selectedVisualDataItems.value = [];
  mapCardDialogVisible.value = false;
};
const showMapCard = function (info) {
  // if (info.visualizationBoolean) {
  selectedRes.value = info;
  mapCardDialogVisible.value = true;
};
const downloadRes = function (item) {
  if (item.publicBoolean) {
    window.location.href =
      dataServer + "/script/downloadPic?path=" + item.fileRelativePath;
  } else {
    // this.$Message.warning("该资源未开放下载权限，详情请联系网站管理员！");
    ElMessage({
      message: "该资源未开放下载权限，详情请联系网站管理员！",
      type: "warning",
    });
  }
};
const go2Model = function () {
  location.href = "/model";
};
const filterSizeType = function (value) {
  if (value === 0) return "0 B";
  let k = 1024;
  let sizes = ["B", "KB", "MB", "GB"];
  let i = Math.floor(Math.log(value) / Math.log(k));
  return (value / Math.pow(k, i)).toPrecision(4) + " " + sizes[i];
};
const selectedVisualDataItemsRangeChangeBefore = function (value) {
  if (selectedRes.value.visualDataItems.length >= 30) {
    let min = selectedVisualDataItemsRange.value[0];
    let max = selectedVisualDataItemsRange.value[1];
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < selectedRes.value.visualDataItems.length; j++) {
        if (value[i] == selectedRes.value.visualDataItems[j].name) {
          if (value.length == 1) {
            min = max = j;
          } else {
            //判断增减
            if (min >= j) {
              min = j;
            } else if (max <= j) {
              max = j;
            }
          }
        }
      }
    }
    selectedVisualDataItemsRange.value = [min, max];
    selectedVisualDataItemsRangeChange([min, max]);
  }
};
const selectedVisualDataItemsRangeChange = function (value) {
  selectedVisualDataItems.value = [];
  for (let j = 0; j < selectedRes.value.visualDataItems.length; j++) {
    if (j >= value[0] && j <= value[1]) {
      selectedVisualDataItems.value.push(
        selectedRes.value.visualDataItems[j].name
      );
    }
  }
};
const guideMarks = computed(() => {
  let marks = {};
  if (selectedRes.value.visualDataItems.length < 500) {
    for (let i = 0; i <= 1000; i++) {
      if (i % 50 == 0) {
        marks[i] = i + "";
      } else if (i % 10 == 0) {
        marks[i] = {
          style: {
            color: "#ccc",
          },
          label: "",
        };
      }
    }
  } else if (selectedRes.value.visualDataItems.length < 1000) {
    for (let i = 0; i <= 1000; i++) {
      if (i % 100 == 0) {
        marks[i] = i + "";
      } else if (i % 20 == 0) {
        marks[i] = {
          style: {
            color: "#ccc",
          },
          label: "",
        };
      }
    }
  }

  return marks;
});
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
  padding-top: 10px;
  border-top: solid 0.1px rgba(176, 174, 174, 0.445);
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
<style lang="less">
.mapboxCardDialog .el-dialog__body {
  padding: 10px;
}
.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 32px;
}
.slider-demo-block .demonstration {
  font-size: 14px;
  // color: var(--el-text-color-secondary);
  line-height: 44px;
  // flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
.slider-demo-block .el-slider {
  flex: 0 0 75%;
}
</style>