<template>
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
        <!--              <el-checkbox></el-checkbox>-->
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
      <span v-else>{{ node.label }}</span>
      <span style="margin-left: 50px" v-show="data.type == 'model'">
        <el-button
          type="primary"
          size="mini"
          @click="modelConfigDialog = true"
          plain
        >
          Config
        </el-button>
        <el-button
          type="info"
          size="mini"
          @click="() => remove(node, data)"
          plain
        >
          Info
        </el-button>
      </span>
    </template>
  </el-tree>
  <el-dialog
    custom-class="dialog_config"
    v-model="modelConfigDialog"
    title="模型配置"
    width="32%"
    draggable
  >
    <el-row class="config-title"
      ><Setting class="config-icon" />数据配置</el-row
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
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineEmits, defineProps } from "vue";
import { toRaw } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Upload, Download, Setting, Document } from "@element-plus/icons-vue";
import axios from "axios";
const emit = defineEmits(["getCheckData","getCheckChart"]);
const props = defineProps({
  checkedData: {},
});

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit

const modelTreeData = ref([]);

const getTreeData = () => {
  axios.get("http://172.21.212.63:8999/model/getModelTree").then((res) => {
    console.log("模型目录树", res.data.data);
    modelTreeData.value = res.data.data;
  });
};
getTreeData();

let dataList = [];
let chartList = []; 

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
  } else if (data.mapDataType == "tif"){
    // tif数据的处理
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
  }
};

const defaultProps = {
  children: "children",
  label: "label",
};
const handleNodeClick = (data) => {};
const remove = (node, data) => {
  console.log(node, data);
};
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
  position: absolute;
  z-index: 88;
  top: 100px;
  left: 60px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 5px !important;
  padding: 8px 13px 8px 8px;
  height: 80vh;
  overflow: scroll;
}
</style>


