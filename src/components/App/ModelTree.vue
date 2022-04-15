<template>
  <div class="modelTree-config">
    <el-tree
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :default-expand-all='true'
        :expand-on-click-node="false"
        style="width: 380px">
      <template class="custom-tree-node" v-slot="{ node, data }">
                <span v-if="data.type == 'data'">
                  <el-checkbox>{{ node.label }}</el-checkbox>
                </span>
        <span v-else-if="data.type == 'problem'">
                  <Document style="width:18px"/>
                  {{ node.label }}
                </span>
        <span v-else>
                  {{ node.label }}
                </span>
        <span style="margin-left: 50px" v-show="data.type == 'model'">
                <el-button
                    type="primary"
                    size="mini"
                    @click="modelConfigDialog = true" plain>
                  Config
                </el-button>
                <el-button
                    type="info"
                    size="mini"
                    @click="() => remove(node, data)" plain>
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
      <el-row class="config-title"><Setting class="config-icon" />数据配置</el-row>
      <el-card class="config-card" shadow="hover">
        <el-row>
          <template v-for="(item,index) in testModelInput.value.inputData" :key="index">
            <el-col :span="8" :offset="2">
              <span class="input-data-name">{{ item.dataName }}</span><br>
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
                <el-button type="primary" plain style="margin-left: 10px" :icon="Upload">
                </el-button>
              </template>
            </el-upload>
            <el-divider/>
          </template>
        </el-row>
      </el-card>
      <el-row class="config-title"><Setting class="config-icon"/>参数配置</el-row>
      <el-card class="config-card" shadow="hover">
        <el-row>
          <template v-for="(item,index) in testModelInput.value.parameter" :key="index">
            <el-col :span="8" :offset="2">
              <span class="input-data-name">{{ item.paraId }}</span><br>
              <span class="input-data-description">{{ item.description }}</span>
            </el-col>
            <el-col :span="10">
              <el-input class="input-data" placeholder=""></el-input>
            </el-col>
            <el-divider/>
          </template>
        </el-row>
      </el-card>
      <el-row class="config-title"><Setting class="config-icon"/>模拟结果</el-row>
      <el-card class="config-card" shadow="hover">
        <el-row>
          <template v-for="(item,index) in testModelInput.value.outputData" :key="index">
            <el-col :span="8" :offset="2">
              <span class="input-data-name">{{ item.outputDataIa }}</span><br>
              <span class="input-data-description">{{ item.description }}</span>
            </el-col>
            <el-col :span="10">
              <el-input class="input-data" disabled></el-input>
            </el-col>
            <el-button type="primary" plain style="margin-left: 10px" :icon="Download">
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
import {reactive, computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {Upload, Download,Setting,Document} from '@element-plus/icons-vue'


const router = useRouter()//路由直接用router.push(...)
const store = useStore()//vuex直接用store.commit


const data = [
  {
    type: 'problem',
    label: '问题1 ',
    children: [{
      type: "model",
      label: 'GCAM-CA',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }, {
      type: "model",
      label: 'TaiHu_Fvcom',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }]
  }, {
    type: 'problem',
    label: '问题2',
    children: [{
      type: "model",
      label: 'SEIMS',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }, {
      type: "model",
      label: 'DCBAH',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }]
  }, {
    label: '问题3',
    children: [{
      type: "model",
      label: 'SWMM',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }, {
      type: "model",
      label: 'SWAT',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }]
  }];
const defaultProps = {
  children: 'children',
  label: 'label'
};
const handleNodeClick = (data) => {
  console.log(data);
}
const remove = (node, data) => {
  console.log(node, data)
}
const modelConfigDialog = ref(false);

const testModelInput = reactive({});
testModelInput.value = {
  inputData: [
    {
      dataIa: '11',
      dataName: 'class2000/2010.tif',
      description: '土地利用'
    }, {
      dataIa: '22',
      dataName: 'CLAY.tif',
      description: '含粘土比例'
    }
  ],
  parameter: [
    {
      paraId: 'Landuse',
      description: 'Input Landuse'
    }, {
      paraId: 'Soil',
      description: 'Input Soil'
    },
  ],
  outputData: [
    {
      outputDataIa: '1111',
      description: '输出数据1'
    }
  ]
}
const value = ref([])
const options = [
  {
    value: 'class2000/2010.tif',
    label: 'class2000/2010.tif',
  },
  {
    value: 'CLAY.tif',
    label: 'CLAY.tif',
  },
  {
    value: 'dem.tif',
    label: 'dem.tif',
  },
]

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
  margin-left: 10px
}
.input-data{
  //height: 50px;
}
.input-data-name{
  font-weight: bold;
  font-size: 15px;

}
.input-data-description{
  font-style: italic;
  font-size: 13px;
}

/deep/.dialog_config {
  .el-dialog__header{
    background-color: #D1D1D1;
    margin: 0 !important;
    border-radius:10px 10px 0 0;
    text-align: center;
  }
  border-radius: 10px !important;
}
/deep/.el-tree-node__content {
  height: 32px !important;
}
.config-card{
  background-color: #EFEFEF;
}
.el-divider--horizontal{
  margin: 10px 0;
  border-top:1px dotted lightgrey ;
}
.config-icon{
  width: 20px;
  margin-right: 5px;
  color: #56BBF1
}
.modelTree-config{
  position: absolute;
  z-index: 88;
  top: 100px;
  left: 60px;
}
.el-tree{
  border-radius: 10px !important;
  background-color: rgba(255,255,255,0.9);
}
</style>


