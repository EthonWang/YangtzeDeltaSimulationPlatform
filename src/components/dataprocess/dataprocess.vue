<template>
  <Layout>
    <Sider
      class="layout-sider"
      style="width: 100px; min-width: 100px; max-width: 100px"
    >
      <Menu
        mode="vertical"
        theme="light"
        active-name="6117767e61ce444130b1a276"
        @on-select="changeCategory"
        style="width: 50px"
        v-model="searchData.categoryName"
      >
        <div class="layout-logo"></div>
        <div class="layout-nav">
          <MenuItem name="6117767e61ce444130b1a276">
            <Icon type="ios-navigate"></Icon>
            格式转换
          </MenuItem>
          <MenuItem name="6117767e61ce444130b1a277">
            <Icon type="ios-keypad"></Icon>
            数据处理
          </MenuItem>
          <MenuItem name="6117767e61ce444130b1a278">
            <Icon type="ios-analytics"></Icon>
            可视化
          </MenuItem>
        </div>
      </Menu>
    </Sider>
    <Layout class="layout-sider1">
      <Header class="layout-header">
        <Row align="middle">
          <Col flex="1">
            <Select v-model="searchData.curQueryField">
              <Option
                v-for="item in serchOption"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </Col>
          <Col flex="8">
            <Input
              placeholder="输入相关的数据类型或方法"
              search
              enter-button
              @on-search="searchIndexchange()"
              v-model="searchData.searchText"
            />
          </Col>
        </Row>
        <Row align="middle" justify="start">
          <Col
            ><span style="font-weight: 600; font-size: 17px">排序: </span></Col
          >
          <Col
            ><Select
              v-model="searchData.sortField"
              @on-change="searchIndexchange()"
            >
              <Option
                v-for="item in sortlabelOption"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select></Col
          >
          <Col>
            <Select v-model="searchData.asc" @on-change="searchIndexchange()">
              <Option
                v-for="item in sortascOption"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </Col>
        </Row>
      </Header>
      <Content class="layout-content">
        <el-table :data="DataMethodData.list" stripe="true">
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column prop="authorName" label="作者"></el-table-column>
          <el-table-column>
            <template #default="scope">
              <el-button
                link
                size="small"
                type="primary"
                :disabled="scope.row.invokeServices == null"
                @click="invokedrawershow(scope.row)"
                >invoke</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-drawer
          v-model="drawboxdata.show"
          :title="drawboxdata.title"
          direction="rtl"
          size="100%"
        >
          <div class="dataContainer" style="width: 80%; margin: auto">
            <div class="_params-group">
              <el-row class="_title">输入</el-row>
              <div class="_items">
                <el-row v-for="(item, key) in metaDetailData.input" :key="key">
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
                          v-show="item.loadName"
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
                <el-row
                  v-for="(item, key) in metaDetailData.parameter"
                  :key="key"
                >
                  <el-col :span="11" class="_event-desc">
                    <span class="event-name">
                      <span style="color: red">*</span>
                      {{ item.name }}
                    </span>
                  </el-col>
                  <div>
                    <el-input
                      :placeholder="item.description"
                      v-model="item.value"
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
                        :key="item.tag"
                        :label="item.tag + '.' + item.suffix"
                        :value="item.tag + '.' + item.suffix"
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
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="可视化"
                        placement="top"
                      >
                        <el-button
                          plain
                          round
                          type="primary"
                          v-if="applicationdata.method === 'Visualization'"
                          @click="initPicture()"
                        >
                          <i class="fa fa-eye"></i>
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
          <el-dialog
            title="Visualization Show"
            v-model="visualdata.visualization"
            custom-class="customWidth"
            width="80%"
            height="800"
          >
            <span>
              <!--            <img style="display:inline;width: 100%;height: 100%;" :src="visualPath"/>-->
              <iframe
                :src="visualdata.visualPath"
                width="100%"
                height="100%"
              ></iframe>
            </span>
            <el-button @click="visualdata.visualization = false"
              >取消</el-button
            >
            <!--    <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>-->
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
      </Content>
      <Footer class="layout-footer">
        <el-pagination
          layout="prev, pager, next"
          :total="DataMethodData.total"
          v-model:current-page="searchData.page"
          @current-change="getData()"
        />
      </Footer>
    </Layout>
  </Layout>
</template>

<script setup lang="ts">
import dataAPI from "@/api/user/data";
import taskApi from "@/api/user/task";
import api from "@/api/user/model";
import { Upload } from "@element-plus/icons-vue";
import { Download, Plus } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus/lib/components";
import { ElLoading } from "element-plus";
import { Encrypt, Decrypt } from "@/util/codeUtil";
import {
  searchParam,
  options,
  DataMetnod,
  invokeService,
  drawboxparam,
  metaDetail,
  testData,
  applicationData,
  resultData,
  outputData,
  visualData,
} from "@/type/dataprocess";
import {
  getDataMethodList,
  getMethodServiceInfo,
  getMethodServiceParameter,
} from "@/api/portal/dataMethod";
//一些API
const Api = new api(); //modelApi,这个主要是用来调用datamethod
const task_api = new taskApi(); //用于将数据保存至实验室
const dataApi = new dataAPI();

//渲染查找的selector
const serchOption = reactive(new options().serchOption); //查找选项(按照名称、作者查找等等)
const sortascOption = reactive(new options().sortascOption); //排序选项（升降序）
const sortlabelOption = reactive(new options().sortlabelOption); //排序选项(点击量、名称等等)
//一些data
const drawboxdata = reactive(new drawboxparam()); //控制drawer的标题与显示
const DataMethodData = reactive(new DataMetnod()); //用于接收后端返回的数据方法
const searchData = reactive(new searchParam()); //查找时返回给后台的数据
const testdata = reactive(new testData()); //测试数据
const applicationdata = reactive(new applicationData()); //接收数据应用，（每个数据方法不一定有应用，封装过后才有应用，也可以叫做服务）
const resultdata = reactive(new resultData()); //结果数据，用于渲染最后的结果
const invokeServiceData = reactive(new invokeService()); //数据服务的数据，里面包括服务的很多信息
const outputdata = reactive(new outputData()); //输出的所有数据都在这个里面
const visualdata = reactive(new visualData()); //如果可以可视化，那就有这个数据
let metaDetailData = reactive(new metaDetail()); //metadata，记录了方法的依赖、描述、输入与输出
//从localstorage里面获取的数据
const task = reactive(JSON.parse(Decrypt(localStorage.getItem("task"))));
const dataList = reactive(
  JSON.parse(Decrypt(localStorage.getItem("task"))).dataList.filter(
    (item) => item.simularTrait != "model"
  )
);
const userInfo = reactive(
  JSON.parse(Decrypt(localStorage.getItem("userInfo")))
);

let dialogDataChoose = ref(false); //选择输入数据的对话框是否显示
let fileOrder = ref(0); //选了第几个结果数据
//获取所有数据方法的函数
const getData = () => {
  console.log(userInfo);
  getDataMethodList(searchData).then((res) => {
    DataMethodData.list = res.data.list;
    DataMethodData.total = res.data.total;
  });
};
getData();
//搜索方法时排序字段、升降序以及搜索事件发生时触发
const searchIndexchange = () => {
  searchData.page = 1;
  getData();
};
//更换条目是触发：数据处理、格式转换、可视化
const changeCategory = (name) => {
  searchData.page = 1;
  searchData.categoryName = name;
  getData();
};
//点击某个数据方法时跳出配置与运行drawer
const invokedrawershow = (row) => {
  drawboxdata.show = true;
  Object.keys(invokeServiceData).forEach((item) => {
    invokeServiceData[item] = row.invokeServices[0][item]
      ? row.invokeServices[0][item]
      : "";
  });
  drawboxdata.title = invokeServiceData.name + "配置与运行";
  getMethodServiceInfo(row.id, invokeServiceData.serviceId).then((res) => {
    console.log(res.data.data.application.method);

    Object.keys(applicationdata).forEach((item) => {
      applicationdata[item] = res.data.data.application[item]
        ? res.data.data.application[item]
        : "";
    });
    for (let i = 0; i < res.data.data.testData.length; i++) {
      testdata.list[i] = res.data.data.testData[i];
    }
  });
  getMethodServiceParameter(row.id, invokeServiceData.serviceId).then((res) => {
    if (res.status === 200) {
      console.log(res.data);
      Object.keys(metaDetailData).forEach((item) => {
        metaDetailData[item] = res.data.data.capability.data.metaDetail[item]
          ? res.data.data.capability.data.metaDetail[item]
          : "";
      });
    }
  });
};
//从实验室中选择一个数据
const chooseOneData = (data) => {
  console.log(data);
  if (
    (data.visualType != "dataSet" &&
      (data.fileRelativePath == undefined || data.id == undefined)) ||
    (data.visualType == "dataSet" && data.id == undefined)
  ) {
    dialogDataChoose.value = false;
    ElMessage.error("加入数据失败");
    return;
  }

  let loading_data = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  console.log("have url=", data.dataContainerUrl);
  if (
    data.dataContainerUrl != null &&
    data.dataContainerUrl != undefined &&
    data.dataContainerUrl != ""
  ) {
    metaDetailData.input[fileOrder.value].loadName = data.name;
    metaDetailData.input[fileOrder.value].url = data.dataContainerUrl;
    loading_data.close();
    ElMessage({
      type: "success",
      message: "成功加入数据！",
    });
    dialogDataChoose.value = false;
  } else {
    if (
      data.parentId != null &&
      data.parentId != undefined &&
      data.parentId != ""
    ) {
      //发送数据（非集）获取url
      dataApi
        .sendDataToContainer(data.fileRelativePath, data.id)
        .then((res) => {
          console.log(res.data.data);
          data.dataContainerUrl = res.data.data;
          metaDetailData.input[fileOrder.value].loadName = data.name;
          metaDetailData.input[fileOrder.value].url = data.dataContainerUrl;
          for (let i = 0; i < task.dataList.length; i++) {
            if (task.dataList[i].id == data.id) {
              task.dataList[i].dataContainerUrl = res.data.data;
              break;
            }
          }
          localStorage.setItem("task", Encrypt(JSON.stringify(task)));
          loading_data.close();
          ElMessage({
            type: "success",
            message: "成功加入数据",
          });
          dialogDataChoose.value = false;
        })
        .catch((err) => {
          ElMessage.error("使用数据失败1");
          loading_data.close();
        });
    } else {
      //发送数据集 获取url
      dataApi
        .sendResDataToContainer(
          data.fileRelativePath,
          task.id,
          data.id,
          userInfo.id
        )
        .then((res) => {
          console.log(res.data.data);
          data.dataContainerUrl = res.data.data;
          metaDetailData.input[fileOrder.value].loadName = data.name;
          metaDetailData.input[fileOrder.value].url = data.dataContainerUrl;
          for (let i = 0; i < task.dataList.length; i++) {
            if (task.dataList[i].id == data.id) {
              task.dataList[i].dataContainerUrl = res.data.data;
              break;
            }
          }
          localStorage.setItem("task", Encrypt(JSON.stringify(task)));
          loading_data.close();
          ElMessage({
            type: "success",
            message: "成功加入数据",
          });
          dialogDataChoose.value = false;
        })
        .catch((err) => {
          ElMessage.error("使用数据失败2");
          loading_data.close();
        });
    }
  }
};
//选择数据的对话框显示，这里直接用key即可
const choosedataShow = (item, key) => {
  dialogDataChoose.value = true;
  fileOrder.value = key;
};
//点击调用
const Invoke = () => {
  //判断参数是否已填
  if (null == metaDetailData.input[0].loadName) {
    ElMessage({
      type: "error",
      message: "No data loaded",
    });
    return;
  }
  if (metaDetailData.parameter.length != 0) {
    for (let i = 0; i < metaDetailData.parameter.length; i++) {
      if (null == metaDetailData.parameter[i].value) {
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
  let parameters: string[];
  for (let i = 0; i < metaDetailData.parameter.length; i++) {
    parameters.push(metaDetailData.parameter[i].value);
  }
  formData.append("dataMethodId", applicationdata.id);
  formData.append("serviceId", invokeServiceData.serviceId);
  formData.append("serviceName", invokeServiceData.name);
  formData.append("params", parameters);
  // formData.append("dataType",this.dataType);//标识那三种数据来源，测试数据、上传容器数据（数据容器返回的数据id）以及数据url（目前是数据容器的url）

  // if(this.dataType!='localData'){
  formData.append("selectData", JSON.stringify(metaDetailData.input)); //此项为可选，可有可无
  // }
  Api.invokeDataMethod(formData).then((json) => {
    console.log(json);
    if (json.code === -1) {
      window.location.href = "/user/login";
    } else if (json.code === 0) {
      console.log(json);
      // that.resultData = json.data.invokeService;
      if (json.data == null) {
        loading.close();
        ElMessage({
          type: "error",
          message: "Invoke failed!",
        });
      } else {
        // Object.keys(outputdata).forEach((item) => {
        //   outputdata[item] = json.data.task.outputs[item]
        //     ? json.data.task.outputs[item]
        //     : "";
        // });
        for (let i = 0; i < json.data.task.outputs.length; i++) {
          outputdata.list[i] = json.data.task.outputs[i];
        }
        let str = outputdata.list[0].tag + "." + outputdata.list[0].suffix;
        resultdata.name = str;
        resultdata.url = outputdata.list[0].url;
        resultdata.visualUrl = outputdata.list[0].visualUrl;
        loading.close();
        ElMessage({
          type: "success",
          message: "Invoke Success!",
        });
      }
    } else if (json.code === 1) {
      loading.close();
      ElMessage({
        type: "error",
        message: "Invoke failed, Service Node Is Error!",
      });
    } else if (json.code === -2) {
      loading.close();
      ElMessage({
        type: "error",
        message: "Invoke failed, SDK Is Error!",
      });
    }
  });
};
//显示可视化的图片
const initPicture = () => {
  visualdata.visualPath = resultdata.visualUrl;
  visualdata.visualization = true;
};
//将所有结果数据加载至实验室中
const loadAllToLab = () => {
  let outUrlList = [];
  for (let i in outputdata.list) {
    outUrlList.push(outputdata.list[i].url);
  }
  if (outputdata.list[0].url != undefined) {
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
    if (val == outputdata.list[i].tag + "." + outputdata.list[i].suffix) {
      console.log(111);
      resultdata.url = outputdata.list[i].url;
      resultdata.visualUrl = outputdata.list[i].visualUrl;
    }
  }
};
//加载测试数据
const LoadTestData = () => {};
//下载输入数据
const downloadinput = (item) => {
  console.log(item.url);
  if (item.url != undefined) {
    window.open(item.url);
  } else {
    ElMessage.error("请先进行实验");
  }
};
//下载输出数据
const downloadoutput = () => {
  if (resultdata.url != "") {
    window.open(resultdata.url);
  } else {
    ElMessage.error("请先进行实验");
  }
};

// setvalue(nowChooseConfig, item);
</script>

<style scoped lang="less">
/deep/.layout-header {
  height: 150px;
  padding: 0px;
  background-color: #fff;
}
/deep/.layout-sider {
  //   min-width: 50px !important;
  //   width: 50px !important;
  //   max-width: 150px;
  background-color: #fff;
}
// /deep/.layout-sider1 {
//   width: 500px;
// }

.el-pagination {
  justify-content: center; //居中
  //float: left;居左
  //float: right;居右
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