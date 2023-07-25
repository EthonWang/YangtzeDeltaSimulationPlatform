<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Row align="middle">
          <Col flex="6">
            <Input
              placeholder="输入相关的数据类型或方法"
              search
              enter-button
              @on-search="searchIndexchange()"
              v-model="searchdata.searchText"
            />
          </Col>
          <Col flex="1"> </Col>
          <Col flex="2">
            <el-button size="large" type="success" @click="uploadclick"
              >上传</el-button
            >
            <el-button size="large" type="primary" @click="manageclick"
              >管理</el-button
            >
          </Col>
        </Row>
      </el-header>
      <el-main>
        <el-table :data="DataMethodData.list" stripe="true">
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column prop="author" label="作者"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                link
                size="small"
                type="primary"
                @click="invokedrawershow(scope.row)"
                >调用
              </el-button>
              <el-button
                link
                size="small"
                type="primary"
                @click="downloadCode(scope.row)"
                >下载
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          v-model="uploaddata.uploaddialogVisible"
          title="上传数据处理源文件"
          width="500px"
        >
          <span>名称</span>
          <el-input v-model="uploaddata.dataMethod.name"></el-input>
          <span>作者</span>
          <el-input v-model="uploaddata.dataMethod.author"></el-input>
          <span>描述</span>
          <el-input
            type="textarea"
            v-model="uploaddata.dataMethod.description"
          ></el-input>
          <span>源码上传</span>
          <div class="uploadbtn">
            <el-upload
              ref="uploadRefCode"
              class="upload-demo"
              action=""
              :before-upload="uploadcodefile"
              :auto-upload="false"
              :limit="1"
              :on-exceed="handleExceedCode"
            >
              <template #trigger>
                <el-button type="primary" size="large" style="font-size: 16px"
                  >代码文件&nbsp;
                  <el-icon style="font-size: 20px"><UploadFilled /></el-icon
                ></el-button>
              </template>

              <!-- <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template> -->
            </el-upload>
            <el-upload
              ref="uploadRefDes"
              class="upload-demo"
              action=""
              :before-upload="uploaddesfile"
              :auto-upload="false"
              :limit="1"
              :on-exceed="handleExceedDes"
            >
              <template #trigger>
                <el-button type="primary" size="large" style="font-size: 16px"
                  >描述文件&nbsp;
                  <el-icon style="font-size: 20px"><UploadFilled /></el-icon
                ></el-button>
              </template>

              <!-- <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template> -->
            </el-upload>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="uploadMethodCancel">取消</el-button>
              <el-button type="primary" @click="uploadMethodConfirm">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
        <el-dialog
          v-model="managedata.manageDialogVisible"
          title="管理您的数据处理方法"
          width="600px"
        >
          <el-table :data="DataMethodDataUser.list" stripe="true">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="author" label="作者"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  link
                  size="small"
                  type="danger"
                  @click="deleteMethodClick(scope.row)"
                  >删除
                </el-button>
                <el-button
                  link
                  size="small"
                  type="warning"
                  @click="modifyMethodClick(scope.row)"
                  >修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <template #footer>
            <span class="dialog-footer">
              <el-pagination
                layout="prev, pager, next"
                :total="DataMethodDataUser.total"
                v-model:current-page="searchdatauser.page"
                @current-change="getUserData()"
              />
              <el-button @click="manageDialogClose">关闭</el-button>
            </span>
          </template>
          <el-dialog
            v-model="deletedata.deleteDialogVisible"
            title="确认要删除该方法吗？"
            width="300px"
          >
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="deletedata.deleteDialogVisible = false"
                  >取消</el-button
                >
                <el-button type="primary" @click="deleteMethod">
                  确定
                </el-button>
              </span>
            </template>
          </el-dialog>
          <el-dialog
            v-model="modifydata.modifyDialogVisible"
            title="修改当前数据处理方法"
            width="500px"
          >
            <span>名称</span>
            <el-input v-model="modifydata.dataMethod.name"></el-input>
            <span>作者</span>
            <el-input v-model="modifydata.dataMethod.author"></el-input>
            <span>描述</span>
            <el-input
              type="textarea"
              v-model="modifydata.dataMethod.description"
            ></el-input>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="modifyMethodCancel">取消</el-button>
                <el-button type="primary" @click="modifyMethodConfirm">
                  确认
                </el-button>
              </span>
            </template>
          </el-dialog>
        </el-dialog>
      </el-main>
      <el-footer>
        <el-pagination
          layout="prev, pager, next"
          :total="DataMethodData.total"
          v-model:current-page="searchdata.page"
          @current-change="getData()"
        />
        <!-- <el-button>上传方法</el-button> -->
      </el-footer>
    </el-container>
    <!-- 调用方法的drawer -->
    <el-drawer
      v-model="drawboxdata.drawerVisible"
      :title="drawboxdata.drawerTitle"
      direction="rtl"
      size="100%"
      @close="closeDrawer()"
    >
      <div class="dataContainer" style="width: 80%; margin: auto">
        <div class="_params-group">
          <el-row class="_title">输入</el-row>
          <div class="_items">
            <el-row v-for="(item, key) in invokeInfodata.InputData" :key="key">
              <el-col :span="11" class="_event-desc">
                <span class="event-name">
                  <span style="color: red">*</span>
                  {{ item.description }}
                </span>
              </el-col>
              <el-col :span="8" :offset="1">
                <el-input
                  class="data-input"
                  placeholder="Input Data"
                  v-model="item.loadName"
                  :disabled="true"
                >
                </el-input>
              </el-col>
              <el-col :span="4">
                <div class="_btn-group">
                  <el-tooltip
                    class="box-item"
                    effect="light"
                    content="选取实验数据"
                    placement="top"
                  >
                    <el-button
                      round
                      type="success"
                      size="mini"
                      :icon="Upload"
                      @click="choosedataShow(item, key)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="box-item"
                    effect="light"
                    content="下载数据至本地"
                    placement="top"
                  >
                    <el-button
                      round
                      type="warning"
                      size="mini"
                      :icon="Download"
                      :disabled="item.loadName == ''"
                      @click="downloadinput(item)"
                    >
                    </el-button>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <p
                title="Input data can be used to run data processing services"
                class="event-desc"
              >
                输入数据，可用于运行数据处理服务
              </p>
            </el-row>
          </div>
        </div>
        <div class="_params-group">
          <el-row class="_title">参数</el-row>
          <div class="_items">
            <el-row v-for="(item, key) in invokeInfodata.Parameters" :key="key">
              <el-col :span="11" class="_event-desc">
                <span class="event-name">
                  <span style="color: red">*</span>
                  {{ item.description }}
                </span>
              </el-col>
              <div>
                <el-input
                  :placeholder="item.description"
                  v-model="item.loadName"
                  :disabled="false"
                ></el-input>
              </div>
            </el-row>
            <el-row>
              <p
                title="Input parameter can be used to run data processing services"
                class="event-desc"
              >
                输入参数，可用于运行数据处理服务
              </p>
            </el-row>
          </div>
        </div>
        <div class="_params-group">
          <el-row class="_title">输出</el-row>
          <div class="_items">
            <el-row>
              <el-col :span="10" class="_event-desc">
                <span class="event-name">
                  <span style="color: red">*</span>
                  输出数据
                </span>
              </el-col>

              <el-col :span="8" style="color: #dedede">
                <span style="margin-right: 20px"
                  >{{ outputdata.list.length }} 输出数据</span
                >
                <el-select
                  v-model="resultdata.name"
                  placeholder="Output Data"
                  no-data-text="No Output Data"
                  @change="selectchange"
                >
                  <el-option
                    v-for="item in outputdata.list"
                    :key="item.fileName"
                    :label="item.fileName"
                    :value="item.fileName"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <div class="_btn-group" v-if="outputdata.list.length !== 0">
                  <el-tooltip
                    class="box-item"
                    effect="light"
                    content="添加数据至实验室"
                    placement="top"
                  >
                    <el-button
                      round
                      type="success"
                      size="mini"
                      :icon="Plus"
                      @click="loadAllToLab()"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="box-item"
                    effect="light"
                    content="下载数据至本地"
                    placement="top"
                  >
                    <el-button
                      round
                      type="warning"
                      size="mini"
                      :icon="Download"
                      @click="downloadoutput()"
                    >
                    </el-button>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <p
                title="Output data, data processing service running result file"
                class="event-desc"
              >
                输出数据，数据处理服务运行结果文件
              </p>
            </el-row>
          </div>
        </div>
      </div>
      <el-dialog
        v-model="dialogDataChoose"
        title="选择实验数据"
        width="50%"
        height="500"
      >
        <el-button
          v-for="data in dataList.filter(
            (item) =>
              item.simularTrait != 'model' && item.simularTrait != 'task'
          )"
          :key="data"
          style="margin: 5px"
          @click="chooseOneData(data)"
          >{{ data.name }}</el-button
        >
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogDataChoose = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" size="large" @click="LoadTestData"
            >加载测试数据</el-button
          >
          <el-button type="primary" size="large" @click="Invoke"
            >运行</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import {
  searchParam,
  DataMethod,
  uploadData,
  manageData,
  deleteData,
  modifyData,
  invokeInfoData,
  drawboxData,
  outputData,
  resultData,
} from "@/type/thirdparty";
import dataAPI from "@/api/user/data";
import taskApi from "@/api/user/task";
import Api from "@/api/user/datamethoduser";
import { reactive } from "vue";
import { ref } from "vue";
import { genFileId, ElMessage, ElLoading } from "element-plus";
import { Encrypt, Decrypt } from "@/util/codeUtil";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { Upload } from "@element-plus/icons-vue";
import { Download, Plus } from "@element-plus/icons-vue";
//api
const api = new Api();
const task_api = new taskApi(); //用于将数据保存至实验室
const dataApi = new dataAPI();
//ref
const uploadRefCode = ref<UploadInstance>();
const uploadRefDes = ref<UploadInstance>();
let dialogDataChoose = ref(false); //选择输入数据的对话框是否显示
let fileOrder = ref(0); //选了第几个结果数据
let currentMethodId = ref("");
//local
const userInfo = reactive(
  JSON.parse(Decrypt(localStorage.getItem("userInfo")))
);
const task = reactive(JSON.parse(Decrypt(localStorage.getItem("task"))));
const dataList = reactive(
  JSON.parse(Decrypt(localStorage.getItem("task"))).dataList.filter(
    (item) => item.simularTrait != "model"
  )
);
//data
const searchdata = reactive(new searchParam());
const searchdatauser = reactive(new searchParam());
const DataMethodData = reactive(new DataMethod());
const DataMethodDataUser = reactive(new DataMethod());
const uploaddata = reactive(new uploadData());
const managedata = reactive(new manageData());
const deletedata = reactive(new deleteData());
const modifydata = reactive(new modifyData());
const invokeInfodata = reactive(new invokeInfoData());
const drawboxdata = reactive(new drawboxData());
const outputdata = reactive(new outputData());
const resultdata = reactive(new resultData()); //结果数据，用于渲染最后的结果
//method
const searchIndexchange = () => {
  searchdata.page = 1;
  getData();
};
const invokedrawershow = (row) => {
  drawboxdata.drawerVisible = true;
  console.log(row);
  currentMethodId.value = row.id;
  drawboxdata.drawerTitle = row.name + "配置与运行";
  api.invokeInfo(row.id).then((res) => {
    console.log(res);
    Object.keys(invokeInfodata).forEach((item) => {
      invokeInfodata[item] = res.data.data[item] ? res.data.data[item] : "";
    });
    invokeInfodata.id = row.id;
  });
  console.log(invokeInfodata);
};
const getData = () => {
  api.getDataMethod(searchdata).then((res) => {
    console.log(res);
    DataMethodData.list = res.data.content;
    DataMethodData.total = res.data.totalElements;
  });
};
const getUserData = () => {
  api.getDataMethodUser(userInfo.id, searchdatauser).then((res) => {
    console.log(res);
    DataMethodDataUser.list = res.data.content;
    DataMethodDataUser.total = res.data.totalElements;
  });
};
getData();
const uploadclick = () => {
  uploaddata.uploaddialogVisible = true;
};
const manageclick = () => {
  getUserData();
  managedata.manageDialogVisible = true;
};
const handleExceedCode: UploadProps["onExceed"] = (files) => {
  uploadRefCode.value.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRefCode.value.handleStart(file);
};
const handleExceedDes: UploadProps["onExceed"] = (files) => {
  uploadRefDes.value.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRefDes.value.handleStart(file);
};
const uploaddesfile = (rowfile) => {
  uploaddata.formdata.append("DesFile", rowfile);
};
const uploadcodefile = (rowfile) => {
  uploaddata.formdata.append("CodeFile", rowfile);
};
const uploadMethodCancel = () => {
  uploaddata.dataMethod.author = "";
  uploaddata.dataMethod.name = "";
  uploaddata.dataMethod.name = "";
  uploaddata.uploaddialogVisible = false;
};
const uploadMethodConfirm = () => {
  uploadRefCode.value.submit();
  uploadRefDes.value.submit();
  uploaddata.formdata.append("author", uploaddata.dataMethod.author);
  uploaddata.formdata.append("name", uploaddata.dataMethod.name);
  uploaddata.formdata.append("description", uploaddata.dataMethod.description);
  api.uploadDataMethod(userInfo.id, uploaddata.formdata).then((res) => {
    console.log(res);
    if (res.code == 0) {
      ElMessage({ message: res.data, type: "success" });
      getData();
    } else {
      ElMessage({ message: res.msg, type: "error" });
    }
    uploaddata.formdata = new FormData();
    uploaddata.dataMethod.author = "";
    uploaddata.dataMethod.name = "";
    uploaddata.dataMethod.description = "";
  });
  uploaddata.uploaddialogVisible = false;
};
const downloadCode = (row) => {
  api.downloadFile(row.id);
};
const manageDialogClose = () => {
  managedata.manageDialogVisible = false;
  getData();
};
const modifyMethodClick = (row) => {
  modifydata.modifyDialogVisible = true;
  modifydata.modifyId = row.id;
  modifydata.dataMethod.author = row.author;
  modifydata.dataMethod.name = row.name;
  modifydata.dataMethod.description = row.description;
};

const deleteMethodClick = (row) => {
  deletedata.deleteDialogVisible = true;
  deletedata.deleteId = row.id;
};
const deleteMethod = () => {
  api.deleteMethod(deletedata.deleteId).then((res) => {
    console.log(res);
    if (res.data.code == 0) {
      ElMessage({ message: res.data.data, type: "success" });
      getUserData();
    } else {
      ElMessage({ message: res.data.msg, type: "error" });
    }
    deletedata.deleteDialogVisible = false;
  });
};
const modifyMethodCancel = () => {
  modifydata.modifyDialogVisible = false;
  modifydata.dataMethod.author = "";
  modifydata.dataMethod.name = "";
  modifydata.dataMethod.description = "";
  modifydata.modifyId = "";
};
const modifyMethodConfirm = () => {
  modifydata.formdata.append("author", modifydata.dataMethod.author);
  modifydata.formdata.append("name", modifydata.dataMethod.name);
  modifydata.formdata.append("description", modifydata.dataMethod.description);
  api.modifyMethod(modifydata.modifyId, modifydata.formdata).then((res) => {
    console.log(res);
    if (res.code == 0) {
      ElMessage({ message: res.data, type: "success" });
      getUserData();
    } else {
      ElMessage({ message: res.msg, type: "error" });
    }
  });
  modifydata.modifyDialogVisible = false;
};
const choosedataShow = (item, key) => {
  dialogDataChoose.value = true;
  fileOrder.value = key;
};
const downloadinput = (item) => {
  api.downloadInputFile(item.userDataId);
};
//将所有结果数据加载至实验室中
const loadAllToLab = () => {
  let outUrlList = [];
  for (let i in outputdata.list) {
    outUrlList.push(outputdata.list[i].dataContainerUrl);
  }
  if (outputdata.list[0].dataContainerUrl != undefined) {
    task_api
      .addResultToLabAndDataCenter(outUrlList, userInfo.id, task.id)
      .then((res) => {
        if (res.data == null) {
          ElMessage.error("出错，可能已存在或无数据");
        } else {
          let newTask = res.data;
          console.log(res);
          localStorage.setItem("task", Encrypt(JSON.stringify(newTask)));
          ElMessage({
            type: "success",
            message: "成功加入" + outUrlList.length + "条数据",
          });
          let loading = ElLoading.service({
            lock: true,
            text: "装载数据中...",
            background: "rgba(0, 0, 0, 0.7)",
          });
          setTimeout(() => {
            location.reload();
          }, 750);
        }
      })
      .catch((err) => {
        ElMessage.error("出错，未返回数据");
      });
  } else {
    ElMessage.error("请先进行实验");
  }
};
//选择的结果数据出现变化
const selectchange = (val) => {
  for (let i = 0; i < outputdata.list.length; i++) {
    if (val == outputdata.list[i].fileName) {
      console.log(111);
      resultdata.dataContainerUrl = outputdata.list[i].dataContainerUrl;
      // resultdata.visualUrl = outputdata.list[i].visualUrl;
    }
  }
};
//加载测试数据
const LoadTestData = () => {};
//下载输出数据
const downloadoutput = () => {
  if (resultdata.dataContainerUrl != "") {
    window.open(resultdata.dataContainerUrl);
  } else {
    ElMessage.error("请先进行实验");
  }
};
const chooseOneData = (data) => {
  console.log(data);
  if (data.fileRelativePath) {
    invokeInfodata.InputData[fileOrder.value].loadName = data.name;
    invokeInfodata.InputData[fileOrder.value].url = data.fileRelativePath;
    invokeInfodata.InputData[fileOrder.value].userDataId = data.id;
    dialogDataChoose.value = false;
  } else {
    ElMessage({ message: "请重新选择数据", type: "error" });
    dialogDataChoose.value = false;
  }
};
const Invoke = () => {
  //判断参数是否已填
  if (invokeInfodata.InputData.length != 0) {
    for (let i = 0; i < invokeInfodata.InputData.length; i++) {
      if (null == invokeInfodata.InputData[i].loadName) {
        ElMessage({
          type: "error",
          message: "Please import data",
        });
        return;
      }
    }
  }
  if (invokeInfodata.Parameters.length != 0) {
    for (let i = 0; i < invokeInfodata.Parameters.length; i++) {
      if (null == invokeInfodata.Parameters[i].value) {
        ElMessage({
          type: "error",
          message: "Please improve the parameters!",
        });
        return;
      }
    }
  }

  let loading = ElLoading.service({
    lock: true,
    text: "The data service is running, please do not close this page",
    background: "rgba(0, 0, 0, 0.7)",
  });
  let formData = new FormData();
  let parameters: string[] = [];
  let parametersPre: string[] = [];
  let inputdata: string[] = [];
  let inputdataPre: string[] = [];
  let pylibs: string[] = [];
  let pyVersion: string = "";
  let OutputData: string[] = [];
  for (let i = 0; i < invokeInfodata.Parameters.length; i++) {
    parameters.push(invokeInfodata.Parameters[i].loadName);
  }
  for (let i = 0; i < invokeInfodata.Parameters.length; i++) {
    parametersPre.push(invokeInfodata.Parameters[i].value);
  }
  for (let i = 0; i < invokeInfodata.InputData.length; i++) {
    inputdataPre.push(invokeInfodata.InputData[i].value);
  }
  for (let i = 0; i < invokeInfodata.InputData.length; i++) {
    inputdata.push(invokeInfodata.InputData[i].userDataId);
  }
  for (let i = 0; i < invokeInfodata.PythonLibs.length; i++) {
    pylibs.push(invokeInfodata.PythonLibs[i].value);
  }
  for (let i = 0; i < invokeInfodata.OutputData.length; i++) {
    OutputData.push(invokeInfodata.OutputData[i].value);
  }

  pyVersion = invokeInfodata.PythonVersion[0].value;
  // formData.append("dataMethodId", invokeInfodata.id);
  formData.append("inputData", inputdata);
  formData.append("params", parameters);
  formData.append("pylibs", pylibs);
  formData.append("pyVersion", pyVersion);
  formData.append("inputdataPre", inputdataPre);
  formData.append("parametersPre", parametersPre);
  formData.append("OutputData", OutputData);
  formData.append("userId", userInfo.id);
  formData.append("userName", userInfo.name);
  api.invokeDataMethod(invokeInfodata.id, formData).then((res) => {
    console.log(res);
    if (res.code == 0) {
      if (res.data == null) {
        loading.close();
        ElMessage({
          type: "error",
          message: "调用失败!",
        });
      } else {
        // Object.keys(outputdata).forEach((item) => {
        //   outputdata[item] = json.data.task.outputs[item]
        //     ? json.data.task.outputs[item]
        //     : "";
        // });
        // for (let i = 0; i < res.data; i++) {
        //   outputdata.list[i] = res.data.task.outputs[i];
        // }
        outputdata.list = res.data;
        // let str = outputdata.list[0].tag + "." + outputdata.list[0].suffix;
        resultdata.name = outputdata.list[0].fileName;
        resultdata.dataContainerUrl = outputdata.list[0].dataContainerUrl;
        // resultdata.visualUrl = outputdata.list[0].visualUrl;
        loading.close();
        ElMessage({
          type: "success",
          message: "Invoke Success!",
        });
      }
    }
  });
};
const closeDrawer = () => {
  let formdata = new FormData();
  formdata.append("userId", userInfo.id);
  api.closeDrawer(currentMethodId.value, formdata);
  resultdata.name = "";
  resultdata.dataContainerUrl = "";
  resultdata.visualUrl = "";
};
</script>

<style lang="less" scoped>
.el-pagination {
  justify-content: center; //居中
  //float: left;居左
  //float: right;居右
}
.uploadbtn {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 10px;
}
@bg-config: rgba(39, 39, 39, 0.95);
/deep/.el-drawer {
  background-color: @bg-config;
}
/deep/.el-drawer__header {
  background-color: @bg-config;
  color: #dedede;
  font-size: 23px;
}
/deep/.el-drawer__body {
  background-color: @bg-config;
}
._title {
  font-size: 20px;
  // padding: 0px 0px 30px 0px;
  color: #dedede;
  border-bottom: solid 2px #999;
  font-style: italic;
  padding-bottom: 10px;
  padding-top: 10px;
}
._items {
  width: 100%;
}
.event-name {
  color: #dedede;
  display: inline-block;
  font-size: 18px;
  white-space: nowrap;
  line-height: 32px;
}
.event-desc {
  color: #dedede;
  font-style: italic;
  padding-left: 10px;
  margin: 10px 0;
  font-family: Helvetica;
  font-size: 16px;
}
._params-group {
  padding-bottom: 30px;
}
/deep/.el-row {
  margin-top: 8px;
}
._btn-group {
  margin: 2px 10px;
  display: inline-flex;
}
._btn-group > .el-button {
  font-size: 20px;
  // margin: 0 5px;
  // padding: 0.1rem 0.5rem;
}
</style>