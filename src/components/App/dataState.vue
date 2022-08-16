<template>
  <el-divider>
    <div class="modelState">
      <div class="state-name">{{ state.name }}</div>
      <div class="state-desc">{{ state.desc }}</div>
    </div>
  </el-divider>
  <el-row
    type="flex"
    class="state-container"
    justify="start"
    style="flex-wrap: wrap"
  >
    <el-col :span="24">
      <!-- 输入event -->
      <div class="_params-group">
        <el-row v-if="inEventList(state).length !== 0" class="_title"
          >Input</el-row
        >
        <div class="_items">
          <div
            v-for="modelInEvent in inEventList(state)"
            :key="modelInEvent.eventId"
            class="_item"
          >
            <el-row>
              <!-- event名称 -->
              <el-col :span="11">
                <span class="event-name" :title="modelInEvent.eventName">
                  <span v-show="!modelInEvent.optional" style="color: red"
                    >*</span
                  >
                  {{ modelInEvent.eventName }}
                </span>
              </el-col>
              <!-- 输入框 -->
              <template v-if="modelInEvent.data[0].nodes == undefined">
                <el-col :span="8" :offset="1">
                  <el-input
                    class="model-input"
                    size="small"
                    :value="
                      modelInEvent.tag == undefined
                        ? ''
                        : modelInEvent.tag + '.' + modelInEvent.suffix
                    "
                    :disabled="true"
                  >
                    :id="'datainput'+modelInEvent.eventId"
                  </el-input>
                </el-col>
                <!-- 按钮 -->
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
                        @click="chooseConfig(modelInEvent)"
                      ></el-button>
                    </el-tooltip>
                    <el-button
                      round
                      type="warning"
                      size="mini"
                      :icon="Download"
                      v-show="modelInEvent.tag != undefined"
                      @click="download(modelInEvent)"
                    >
                    </el-button>
                  </div>
                </el-col>
              </template>
            </el-row>

            <!-- 输入数值 -->
            <el-row>
              <el-table
                v-if="modelInEvent.children != undefined"
                :data="modelInEvent.children"
                border
                style="width: 100%"
              >
                <el-table-column prop="eventName" label="Parameter" />
                <el-table-column prop="eventDesc" label="Description" />
                <el-table-column label="Data Type" width="150px">
                  <template v-slot="scope">
                    <el-tag
                      type="info"
                      effect="dark"
                      :disable-transitions="true"
                    >
                      {{ scope.row.eventType }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Value" width="200px">
                  <template v-slot="scope">
                    <el-input
                      class="model-input"
                      size="small"
                      v-model="scope.row.value"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-row>

            <!-- Event的描述信息 -->
            <el-row>
              <p class="event-desc">
                {{ modelInEvent.eventDesc }}
              </p>
            </el-row>
          </div>
        </div>
      </div>
      <!-- 输出event -->
      <div class="_params-group">
        <el-row v-if="outEventList(state).length !== 0" class="_title"
          >Output</el-row
        >
        <div class="_items">
          <div
            v-for="(modelOutEvent, outEventIndex) in outEventList(state)"
            :key="outEventIndex"
            class="_item"
          >
            <el-row>
              <!-- event名称 -->
              <el-col :span="11">
                <span class="event-name" :title="modelOutEvent.eventName">
                  {{ modelOutEvent.eventName }}
                </span>
              </el-col>

              <!-- 输入框 -->
              <el-col :span="10" :offset="1">
                <el-input
                  v-if="!modelOutEvent.multiple"
                  class="model-input"
                  size="small"
                  :value="
                    modelOutEvent.tag == undefined
                      ? ''
                      : modelOutEvent.tag + '.' + modelOutEvent.suffix
                  "
                  :disabled="true"
                >
                </el-input>
              </el-col>
              <!-- 按钮 -->
              <el-col :span="2">
                <div class="_btn-group">
                  <el-tooltip
                    class="box-item"
                    effect="light"
                    content="下载实验结果"
                    placement="bottom"
                  >
                    <el-button
                      round
                      type="warning"
                      size="mini"
                      :icon="Download"
                      @click="download(modelOutEvent)"
                    >
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="box-item"
                    effect="light"
                    content="加入实验室"
                    placement="bottom"
                  >
                    <el-button
                      round
                      type="primary"
                      size="mini"
                      :icon="Plus"
                      @click="loadToLab(modelOutEvent)"
                    >
                    </el-button>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>

            <!-- Event的描述信息 -->
            <el-row>
              <p class="event-desc">
                {{ modelOutEvent.eventDesc }}
              </p>
            </el-row>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>

  <el-dialog
    v-model="dialogDataChoose"
    title="选择实验数据"
    width="50%"
    height="500"
    :before-close="handleClose"
  >
    <el-button
      v-for="data in dataList.filter(
        (item) => item.simularTrait != 'model' && item.simularTrait != 'task'
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
    v-model="addLabVisible"
    title="选择实验数据"
    width="50%"
    height="500"
    :before-close="handleClose"
  >
    <img src="" alt="" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addLabVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { Upload } from "@element-plus/icons-vue";
import { Download, Plus } from "@element-plus/icons-vue";
import ChooseData from "../Model/ChooseData.vue";
import dataAPI from "@/api/user/data";
import { ElMessage } from "element-plus/lib/components";
import { ElLoading } from "element-plus";
import taskApi from "@/api/user/task";
import { Encrypt, Decrypt } from "@/util/codeUtil";

export default {
  name: "DataState",
  props: ["state"],
  data() {
    return {
      task_api: new taskApi(),
      task: JSON.parse(Decrypt(localStorage.getItem("task"))),
      userInfo: JSON.parse(Decrypt(localStorage.getItem("userInfo"))),
      nowChooseConfig: null,
      mdlStatesList: JSON.parse(Decrypt(localStorage.getItem("mdlStatesList"))),
      loading: false,
      fileList: [],
      Upload,
      Download,
      Plus,
      dialogDataChoose: false,
      dataList: JSON.parse(
        Decrypt(localStorage.getItem("task"))
      ).dataList.filter((item) => item.simularTrait != "model"),
      dataApi: new dataAPI(),
      addLabVisible: false,
    };
  },
  methods: {
    chooseConfig(modelInEvent) {
      this.dialogDataChoose = true;
      this.nowChooseConfig = modelInEvent;
    },
    chooseOneData(data) {
      console.log(data);
      if (
        (data.visualType != "dataSet" &&
          (data.fileRelativePath == undefined || data.id == undefined)) ||
        (data.visualType == "dataSet" && data.id == undefined)
      ) {
        this.dialogDataChoose = false;
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
        this.nowChooseConfig.url = data.dataContainerUrl;
        this.nowChooseConfig.tag = data.name.split(".")[0];
        this.nowChooseConfig.suffix = data.name.split(".")[1];
        loading_data.close();
        ElMessage({
          type: "success",
          message: "成功加入数据！",
        });
        this.dialogDataChoose = false;
      } else {
        if (
          data.parentId != null &&
          data.parentId != undefined &&
          data.parentId != ""
        ) {
          this.dataApi
            .sendDataToContainer(data.fileRelativePath, data.id)
            .then((res) => {
              console.log(res.data.data);
              this.nowChooseConfig.tag = data.name.split(".")[0];
              this.nowChooseConfig.suffix = data.name.split(".")[1];
              this.nowChooseConfig.url = res.data.data;
              data.dataContainerUrl = res.data.data;
              for (let i = 0; i < this.task.dataList.length; i++) {
                if (this.task.dataList[i].id == data.id) {
                  this.task.dataList[i].dataContainerUrl = res.data.data;
                  break;
                }
              }
              localStorage.setItem("task", Encrypt(JSON.stringify(this.task)));
              loading_data.close();
              ElMessage({
                type: "success",
                message: "成功加入数据",
              });
              this.dialogDataChoose = false;
            })
            .catch((err) => {
              ElMessage.error("使用数据失败1");
              loading_data.close();
            });
        } else {
          this.dataApi
            .sendResDataToContainer(
              data.fileRelativePath,
              this.task.id,
              data.id,
              this.userInfo.id
            )
            .then((res) => {
              console.log(res.data.data);
              this.nowChooseConfig.tag = data.name.split(".")[0];
              this.nowChooseConfig.suffix = data.name.split(".")[1];
              if (data.visualType == "dataSet") {
                this.nowChooseConfig.suffix = "zip";
              }
              this.nowChooseConfig.url = res.data.data;
              data.dataContainerUrl = res.data.data;
              for (let i = 0; i < this.task.dataList.length; i++) {
                if (this.task.dataList[i].id == data.id) {
                  this.task.dataList[i].dataContainerUrl = res.data.data;
                  break;
                }
              }
              localStorage.setItem("task", Encrypt(JSON.stringify(this.task)));
              loading_data.close();
              ElMessage({
                type: "success",
                message: "成功加入数据",
              });
              this.dialogDataChoose = false;
            })
            .catch((err) => {
              ElMessage.error("使用数据失败2");
              loading_data.close();
            });
        }
      }
    },
    inEventList(state) {
      return state.event.filter((value) => {
        return value.eventType === "response";
      });
    },
    outEventList(state) {
      return state.event.filter((value) => {
        return value.eventType === "noresponse";
      });
    },

    // 留下改进方法，从用户空间选择数据
    checkPersonData() {
      console.log(this.fileList);
    },

    // 选择并上传数据，直接上传，不要加上配置文件
    onSelectChange(file, event) {
      let formData = new FormData();
      // let configContent = "<UDXZip><Name>";
      // configContent += "<add value='" + file.name.split(".")[0] + "' />";
      // configContent += "</Name>";   // 默认是NONE
      // configContent += "<DataTemplate type='none'>";
      // configContent += "</DataTemplate>"
      // configContent += "</UDXZip>";

      // let configFile = new File([configContent], 'config.udxcfg', {
      //     type: 'text/plain',
      // });
      formData.append("datafile", file.raw);
      // formData.append("datafile", configFile);
      formData.append("name", file.name.split(".")[0]);
      formData.append("userId", "1565916523@qq.com"); // 系统没有用户概念，暂时传到固定的用户名下
      formData.append("serverNode", "china");
      formData.append("origination", "SA_Project");

      var loading = this.$loading({
        lock: true,
        text: "Uploading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      var that = this;
      this.$axios
        .post("/SA-back-project/dataManager/uploadMutiFiles", formData)
        .then(function (res) {
          loading.close();
          if (res.data.code == 0) {
            let data = res.data.data;
            data.tag = file.name.split(".")[0];
            data.suffix = file.name.split(".")[1];

            let ipAndPort = data.ipAndPort;
            that.$set(event, "url", "http://" + ipAndPort + "/data/" + data.id);
            that.$set(event, "tag", data.tag);
            that.$set(event, "suffix", data.suffix);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },

    // 下载数据
    download(event) {
      console.log(event.url);
      if (event.url != undefined) {
        this.eventChoosing = event;

        window.open(this.eventChoosing.url);
      } else {
        this.$message.error("请先进行实验");
      }
    },
    loadToLab(event) {
      if (event.url != undefined) {
        this.task_api.addResultToLabAndDataCenter(
          event.url,
          this.userInfo.id,
          this.task.id
        ).then((res)=>{
          if(res.data==null){
            ElMessage.error("出错，可能已存在或无数据" );
          }else{
            let newTask=res.data.data
          console.log(newTask);
          localStorage.setItem("task",Encrypt(JSON.stringify(newTask)))
          ElMessage({ type: "success", message: "成功加入实验室" });
          }
          
        });
        
      } else {
        this.$message.error("请先进行实验");
      }
    },
  },
};
</script>


<style scoped>
.state-container {
  /*border-top: solid 1px #ebeef5;*/
  padding: 1.5rem 0;
}
.leftContainer {
  min-width: 215px;
  width: 23%;
  padding-right: 3%;
}
.modelState {
  width: 100%;
  min-width: 210px;
  /*border: 1px solid #cdf2bb;*/
  background-color: #f0f9eb;
  border-radius: 4px;
  word-wrap: break-word;
  /*padding-left: 4px;*/
  /*padding-right: 4px;*/
  padding: 12px 5px;
  height: auto;
  text-align: center;
}
.state-name {
  font-size: 19px;
  font-weight: bold;
}
.state-desc {
  /* font-style: italic; */
}
.dataContainer {
  width: 72%;
}
._params-group {
  position: relative;
  /* padding-bottom: 1rem; */
}
._params-group > ._title {
  font-style: italic;
  font-size: 16px;
  padding-bottom: 10px;
  padding-top: 10px;
  border-bottom: solid 2px #999;
}
._params-group > ._items > ._item {
  padding: 7px 0;
  border-bottom: dotted 1px #999999;
}
.event-name {
  display: inline-block;
  font-size: 1.1rem;
  white-space: nowrap;
  line-height: 32px;
}
.event-desc {
  font-style: italic;
  padding-left: 10px;
  margin: 10px 0;
  font-family: Helvetica;
  font-size: 14px;
}
._btn-group {
  margin: 2px 10px;
  display: inline-flex;
}
._btn-group > .el-button {
  font-size: 20px;
  margin: 0 5px;
  padding: 0.1rem 0.5rem;
}
.el-upload > .el-button {
  font-size: 20px;
  margin: 0 5px;
  padding: 0.1rem 0.5rem;
}
</style>
