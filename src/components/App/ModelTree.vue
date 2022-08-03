<template>
  <div class="model-tree">
    <!-- <h3>模型列表</h3> -->
    <el-tree
      ref="treeRef"
      :data="modelTreeData"
      :props="defaultProps"
      @node-click="handleNodeClick"
      :default-expand-all="true"
      :expand-on-click-node="false"
      style=""
    >
      <template class="custom-tree-node" v-slot="{ node, data }">
        <span v-if="data.type == 'dataSet'">
          {{ node.label }}
        </span>
        <span v-else-if="data.type == 'problem'">
          {{ node.label }}
        </span>
        <span v-else-if="data.type == 'data'">
          <el-checkbox
            :key="data.dataSourceId"
            @change="(checked) => getCheckedNodes(checked, data)"
            >{{ node.label }}</el-checkbox
          >
        </span>
        <span v-else>{{ data.name }} 模型</span>
        <span style="position: absolute; right: 26px; margin-left: 50px">
          <el-button
            style=""
            type="primary"
            size="small"
            @click="openModelConfig(data.label, data.modelId, data)"
          >
            配置
          </el-button>
          <!-- <el-button type="info" size="mini" @click="drawer = true" plain>
          Info
        </el-button> -->
        </span>
      </template>
    </el-tree>
    <el-drawer
      v-model="drawer"
      :title="drawerTitle"
      direction="rtl"
      size="100%"
      @open="handleOpenDraw"
    >
      <ModelConfig
        :modelId="modelId"
        :model="model"
        ref="refModelConfig"
      ></ModelConfig>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="btnLoadTestData"
            >获取上次实验结果</el-button
          >
          <el-button type="primary" @click="InvokeModel">运行模型</el-button>
        </div>
      </template>
    </el-drawer>
    <el-dialog
      custom-class="dialog_config"
      v-model="modelConfigDialog"
      title="模型配置"
      width="32%"
      draggable
    >
      <el-card class="config-card" shadow="hover">
        <el-row>
          <template
            v-for="(item, index) in testModelInput.value.inputData"
            :key="index"
          >
            <el-col :span="8" :offset="2">
              <span class="input-data-name">{{ item.dataName }}</span
              ><br />
              <span class="input-data-description">{{ item.description }}</span>
            </el-col>
            <el-col :span="10">
              <el-select
                v-model="value"
                style="width: 100%"
                placeholder=" "
                filterable
                allow-create
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-upload>
              <template #trigger>
                <el-button
                  type="primary"
                  plain
                  style="margin-left: 10px"
                  :icon="Upload"
                >
                </el-button>
              </template>
            </el-upload>
            <el-divider />
          </template>
        </el-row>
      </el-card>
      <el-row class="config-title"
        ><Setting class="config-icon" />参数配置</el-row
      >
      <el-card class="config-card" shadow="hover">
        <el-row>
          <template
            v-for="(item, index) in testModelInput.value.parameter"
            :key="index"
          >
            <el-col :span="8" :offset="2">
              <span class="input-data-name">{{ item.paraId }}</span
              ><br />
              <span class="input-data-description">{{ item.description }}</span>
            </el-col>
            <el-col :span="10">
              <el-input class="input-data" placeholder=""></el-input>
            </el-col>
            <el-divider />
          </template>
        </el-row>
      </el-card>
      <el-row class="config-title"
        ><Setting class="config-icon" />模拟结果</el-row
      >
      <el-card class="config-card" shadow="hover">
        <el-row>
          <template
            v-for="(item, index) in testModelInput.value.outputData"
            :key="index"
          >
            <el-col :span="8" :offset="2">
              <span class="input-data-name">{{ item.outputDataIa }}</span
              ><br />
              <span class="input-data-description">{{ item.description }}</span>
            </el-col>
            <el-col :span="10">
              <el-input class="input-data" disabled></el-input>
            </el-col>
            <el-button
              type="primary"
              plain
              style="margin-left: 10px"
              :icon="Download"
            >
            </el-button>
          </template>
        </el-row>
      </el-card>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="modelConfigDialog = false">取消</el-button>
          <el-button type="primary" @click="modelConfigDialog = false"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineEmits, defineProps } from "vue";
import { toRaw } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Upload, Download, Setting, Document } from "@element-plus/icons-vue";
import ModelConfig from "components/App/ModelConfig";

import axios from "axios";
const emit = defineEmits(["getCheckData", "getCheckChart"]);
const props = defineProps({
  checkedData: {},
});

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit

const drawer = ref(false);
const drawerTitle = ref("");
const modelId = ref("62d0167ca5c5e9a1ecf975fa");
const model = ref({});
// model.value=JSON.parse(localStorage.getItem('task')).dataList[1]
let tempModelId = "";
const refModelConfig = ref();
const openModelConfig = (modelName, dataModelId, data) => {
  drawer.value = true;
  model.value = data;//传到modelconfig
  drawerTitle.value = data.name + "模型 配置与运行";
  tempModelId = dataModelId;
};
const handleOpenDraw = () => {
  modelId.value = tempModelId;
  console.log("model id update :", modelId.value);
};

// 加载测试数据函数
const btnLoadTestData = () => {
  refModelConfig.value.handleLoadTestData();
};

//调用模型代码
const InvokeModel = () => {
  refModelConfig.value.handleInvoke();
};
const modelTreeData = ref([]);
const task = JSON.parse(localStorage.getItem("task"));
const getTreeData = () => {
  for (let i = 0; i < task.dataList.length; i++) {
    console.log(task.dataList[i]);
    if (task.dataList[i].simularTrait == "model") {
      task.dataList[i]["index"] = i;
      modelTreeData.value.push(task.dataList[i]);
    }
  }
};
getTreeData();

let dataList = [];
let tifList = [];
let chartList = [];
let jsonList = [];

const getCheckedNodes = (checked, data) => {
  // 要区分tif、shp、chart数据，利用mapDataType
  // 在这里还要选择地图类型： shp数据使用mapBox，tif数据使用cesium
  if (data.mapDataType == "shp") {
    if (checked == true) {
      dataList.push(toRaw(data));
    } else {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].dataSourceId == data.dataSourceId) {
          dataList.splice(i, 1);
        }
      }
    }
    emit("getCheckData", dataList);
  } else if (data.mapDataType == "tif") {
    // tif数据的处理
    if (checked == true) {
      tifList.push(toRaw(data));
    } else {
      for (let i = 0; i < tifList.length; i++) {
        if (tifList[i].dataSourceId == data.dataSourceId) {
          tifList.splice(i, 1);
        }
      }
    }
    emit("getCheckTif", tifList);
  } else if (data.mapDataType == "chart") {
    // 图表数据
    if (checked == true) {
      chartList.push(toRaw(data));
    } else {
      for (let i = 0; i < chartList.length; i++) {
        if (chartList[i].dataSourceId == data.dataSourceId) {
          chartList.splice(i, 1);
        }
      }
    }
    emit("getCheckChart", chartList);
  } else if (data.mapDataType == "json") {
    // 图表数据
    if (checked == true) {
      jsonList.push(toRaw(data));
    } else {
      for (let i = 0; i < jsonList.length; i++) {
        if (jsonList[i].dataSourceId == data.dataSourceId) {
          jsonList.splice(i, 1);
        }
      }
    }
    emit("getCheckJson", jsonList);
  }
};

const defaultProps = {
  children: "children",
  label: "label",
};
const handleNodeClick = (data) => {};

const modelConfigDialog = ref(false);

const testModelInput = reactive({});
testModelInput.value = {
  inputData: [
    {
      dataIa: "11",
      dataName: "DEM",
      description: "土地利用",
    },
    {
      dataIa: "22",
      dataName: "LandUse",
      description: "含粘土比例",
    },
  ],
  parameter: [
    {
      paraId: "",
      description: "Input Landuse",
    },
    {
      paraId: "Soil",
      description: "Input Soil",
    },
  ],
  outputData: [
    {
      outputDataIa: "1111",
      description: "输出数据1",
    },
  ],
};
const value = ref([]);
const options = [
  {
    value: "class2000/2010.tif",
    label: "class2000/2010.tif",
  },
  {
    value: "CLAY.tif",
    label: "CLAY.tif",
  },
  {
    value: "dem.tif",
    label: "dem.tif",
  },
];
</script>

<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 5px;
  padding-right: 8px;
}
.config-title {
  font-size: 18px;
  font-width: bold;
  margin: 5px 0px;
}
.fileIcon {
  height: 25px;
  margin-left: 10px;
}
.input-data {
  //height: 50px;
}
.input-data-name {
  font-weight: bold;
  font-size: 15px;
}
.input-data-description {
  font-style: italic;
  font-size: 13px;
}

/deep/.dialog_config {
  .el-dialog__header {
    background-color: #d1d1d1;
    margin: 0 !important;
    border-radius: 10px 10px 0 0;
    text-align: center;
  }
  border-radius: 10px !important;
}
/deep/.el-tree-node__content {
  height: 32px !important;
}
.config-card {
  background-color: #efefef;
}
.el-divider--horizontal {
  margin: 10px 0;
  border-top: 1px dotted lightgrey;
}
.config-icon {
  width: 20px;
  margin-right: 5px;
  color: #56bbf1;
}

.el-tree {
  width: 100%;
  margin-left: -8px;
  margin-top: 8px;
  background-color: rgba(255, 255, 255, 0);
  // border-radius: 5px !important;
  // padding: 8px 8px 8px 8px;
  height: auto;
  overflow: scroll;
}
.model-tree {
  position: relative;
  z-index: 1002;
  // top: 110px;
  // left: 400px;
  width: 100px;
  height: 150px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 5px !important;
  padding: 2px;
  transform-origin: 100% 20%;
  transition: all 0.5s;
}

@bg-config: rgba(39, 39, 39, 0.95);
@color-config: rgb(235, 235, 235);
/deep/.el-drawer {
  background-color: @bg-config;
  .el-drawer__header {
    color: #dedede;
    font-size: 20px;
  }

  .el-drawer__body {
    .el-table {
      --el-table-border-color: #7e7e7e8a;
    }
    background: transparent !important;
    .el-input__inner {
      background-color: #414141;
      color: #ebebeb;
      border-radius: 5px;
      border: auto;
    }
    [data-v-29467f59] .el-input.is-disabled .el-input__inner {
      background-color: #414141;
      color: #ebebeb;
      box-shadow: auto;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
      background-color: rgb(51, 51, 51);
    }
    .modelConfigBox[data-v-3b81a03d] {
      background-color: transparent;
      color: @color-config;
    }
    .el-table__body-wrapper:hover {
      background: #3f3f3f !important;
    }
    .el-table tr {
      background-color: @bg-config;
      .cell {
        color: @color-config;
      }
    }
    .el-table th.el-table__cell {
      background-color: @bg-config;
    }
    .el-table thead {
      color: @color-config;
      background: @bg-config;
    }
    .el-input.is-disabled .el-input__inner {
      background-color: @bg-config;
      color: @color-config;
    }
    .el-divider__text {
      color: @color-config;
      background: @bg-config;
      border: 1px solid @color-config;
      .modelState[data-v-7f800fce] {
        background: @bg-config;
      }
    }
  }
}
</style>


