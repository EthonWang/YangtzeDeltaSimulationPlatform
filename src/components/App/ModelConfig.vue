<template>
  <el-row
    class="modelConfigBox"
    v-loading="loading"
    element-loading-text="模型运行中...（Esc返回）"
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <el-col :span="22" :offset="1">
      <template v-for="(item, index) in MDLStatesInfo" :key="index">
        <data-state :state="item"></data-state>
      </template>
    </el-col>
  </el-row>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps, watch, defineExpose } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage, ElNotification } from "element-plus";
import axios from "axios";
import DataState from "components/App/dataState";
import dataAPI from "@/api/user/data";
import taskAPI from "@/api/user/task";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const dataApi = new dataAPI();
const taskApi = new taskAPI();
const loading = ref(false);

const MDLStatesInfo = ref([]);

const props = defineProps({
  modelId: {
    type: String,
    default: "",
  },
  model: {
    type: Object,
  },
});
watch(props, (props, prevProps) => {
  getMDL();
});

const getMDL = () => {
  // let states = props.model.mdlJson.ModelClass[0].Behavior[0].StateGroup[0].States[0].State;
  //   console.log("state is :",states);
  //   for (let i = 0; i < states.length; i++) {
  //     let state = states[i];
  //     for (let j = 0; j < state.Event.length; j++) {
  //       if (state.Event[j].data != undefined && state.Event[j].type == "response") {
  //         let nodes = state.Event[j].data[0].nodes;
  //         let refName = state.Event[j].data[0].text.toLowerCase();
  //         if (state.Event[j].data[0].externalId != undefined) {
  //           state.Event[j].externalId = state.Event[j].data[0].externalId;
  //         }

  //         if (nodes != undefined && refName != "grid" && refName != "table" && refName != "shapes") {
  //           let children = [];
  //           for (let k = 0; k < nodes.length; k++) {
  //             let node = nodes[k];
  //             let child = {};
  //             child.eventId = node.text;
  //             child.eventName = node.text;
  //             child.eventDesc = node.desc;
  //             child.eventType = node.dataType;

  //             child.child = true;
  //             children.push(child);
  //           }
  //           states[i].Event[j].children = children;
  //         }
  //         else {
  //           states[i].Event[j].data[0].nodes = undefined;
  //         }

  //       }
  //     }
  //   }
  //   MDLStatesInfo.value = states

  axios
    .get("http://172.21.213.44:8999/model/getMdlById/" + props.model.id)
    .then((res) => {
      //对拿到的states再进行一下处理
      let states = res.data.data.mdl.states;
      for (let i = 0; i < states.length; i++) {
        let state = states[i];
        for (let j = 0; j < state.event.length; j++) {
          if (
            state.event[j].data != undefined &&
            state.event[j].eventType == "response"
          ) {
            let nodes = state.event[j].data[0].nodes;
            let refName = state.event[j].data[0].text.toLowerCase();
            if (state.event[j].data[0].externalId != undefined) {
              state.event[j].externalId = state.event[j].data[0].externalId;
            }

            if (
              nodes != undefined &&
              refName != "grid" &&
              refName != "table" &&
              refName != "shapes"
            ) {
              let children = [];
              for (let k = 0; k < nodes.length; k++) {
                let node = nodes[k];
                let child = {};
                child.eventId = node.text;
                child.eventName = node.text;
                child.eventDesc = node.desc;
                child.eventType = node.dataType;

                child.child = true;
                children.push(child);
              }
              states[i].event[j].children = children;
            } else {
              states[i].event[j].data[0].nodes = undefined;
            }
          }
        }
      }
      MDLStatesInfo.value = states;
      localStorage.setItem("mdlStatesList", JSON.stringify(states));
    });
};
getMDL();
const addTestData = (data) => {
  data.forEach((el) => {
    let stateId = el.stateId;
    let eventName = el.eventName;
    let state = MDLStatesInfo.value.find((state) => {
      return state.Id == stateId;
    });
    if (state == undefined) return;
    let event = state.event.find((event) => {
      return event.eventName == eventName;
    });
    event.tag = el.tag;
    event.suffix = el.suffix;
    event.url = el.dataUrl;
    event.visual = el.visual;

    if (event == undefined) return;
    if (el.children.length > 0) {
      if (el.children.length == 1) {
        let children = event.children[0];
        children.value = el.children[0].value;
      } else {
        for (let i = 0; i < el.children.length; i++) {
          let name = el.children[i].eventName;
          let eventChild = event.children.find((child) => {
            return child.eventName == name;
          });
          if (eventChild != null) {
            eventChild.value = el.children[i].value;
          }
        }
      }
    }
  });
};
let prepared = false;
const handleLoadTestData = () => {
  axios
    .get("http://172.21.212.63:8999/model/getModelTestDataSet/" + props.modelId)
    .then((res) => {
      let data = res.data.data.dataSet1;
      prepared = true;  
      addTestData(data);
    });
};

const structXML = (children) => {
  let formData = new FormData();
  let configContent = "<Dataset> ";
  let kpi = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    if (child.value != null && child.value != undefined) {
      kpi++;
      configContent +=
        "<XDO name='" +
        child.eventName +
        "' kernelType='" +
        child.eventType.toLowerCase() +
        "' value='" +
        child.value +
        "' /> ";
    }
  }
  if (kpi == 0) {
    return new Promise((resolve, reject) => {
      resolve("abandon");
      reject("abandon");
    });
  }

  configContent += " </Dataset>";
  let configFile = new File([configContent], "config.udxcfg", {
    type: "text/plain",
  });
  console.log("content is :", configContent);
  console.log("file is :", configFile);
  formData.append("xmlData", configFile);
  return dataApi.sendXMLToContainer(formData);

  // let configContent = "<UDXZip><Name>";
  // for (let index in this.uploadFiles) {
  //   configContent += "<add value='" + this.uploadFiles[index].name + "' />";
  //   formData.append("ogmsdata", this.uploadFiles[index].raw);
  // }
  // configContent += "</Name>";
  // if (this.selectValue != null && this.selectValue != "none") {
  //   configContent += "<DataTemplate type='id'>";
  //   configContent += this.selectValue;
  //   configContent += "</DataTemplate>";
  // } else {
  //   configContent += "<DataTemplate type='none'>";
  //   configContent += "</DataTemplate>";
  // }
  // configContent += "</UDXZip>";
  // // console.log(configContent)
  // let configFile = new File([configContent], "config.udxcfg", {
  //   type: "text/plain",
  // });
  // formData.append("ogmsdata", configFile);
  // formData.append("name", this.uploadName);
  // formData.append("userId", this.uid);
  // formData.append("serverNode", "china");
  // formData.append("origination", "portal");
};

const handleInvoke = () => {
  const amap = new Promise((resolve, reject) => {
    let i = 1;
    let j = 1;
    MDLStatesInfo.value.forEach((state) => {
      let statename = state.name;
      state.event.forEach((el) => {
        i++;
        let event = el.eventName;
        let tag = el.tag;
        let url = el.url;
        let suffix = el.suffix;
        let templateId = el.externalId;
        if (templateId != null) templateId = templateId.toLowerCase();
        let children = el.children;
        if (children != null && children != undefined) {
          structXML(children)
            .then((res) => {
              if (res != "abandon") {
                console.log("xml res is:", res);
                url = res.data;
                el.url = res.data;
              }
            })
            .catch((err) => {});
        }
      });
    });
    setTimeout(() => {
      resolve("success");
    }, 100 * i);
  });
  amap.then((res) => {
    console.log("xml的url配置完毕");
    handleInvokeNext();
  });
};
const handleInvokeNext = () => {
  let task = JSON.parse(localStorage.getItem("task"));
  taskApi.editTask(task).then((res) => {});
  prepared = true;
  if (prepared) {
    //loading部分代码
    let json = {
      oid: props.model.id,
      ip: "172.21.213.105",
      port: "8061",
      inputs: [],
    };
    try {
      console.log("MDLStatesInfo.value is :", MDLStatesInfo.value);
      MDLStatesInfo.value.forEach((state) => {
        let statename = state.name;
        state.event.forEach((el) => {
          let event = el.eventName;
          let tag = el.tag;
          let url = el.url;
          let suffix = el.suffix;
          let templateId = el.externalId;
          if (templateId != null) templateId = templateId.toLowerCase();
          let children = el.children;

          if (el.eventType == "response") {
            if (el.optional) {
              if (url === null || url === undefined) {
                console.log("");
              } else {
                json.inputs.push({
                  statename,
                  event,
                  url,
                  tag,
                  suffix,
                  templateId,
                  children,
                });
              }
            } else {
              if (url === null || url === undefined) {
                console.log("这个出问题了", el);
                ElNotification({
                  title: "Error",
                  message: "Some input data are not provided",
                  type: "error",
                });
                throw new Error("Some input data are not provided");
              }
              json.inputs.push({
                statename,
                event,
                url,
                tag,
                suffix,
                templateId,
                children,
              });
            }
          }
        });
      });
    } catch (e) {
      return;
    }
    //请求接口调用模型
    loading.value = true;
    console.log("json is :", json);
    axios.post("http://172.21.213.44:8999/model/invoke", json).then((res) => {
      console.log("模型运行结果", res.data);
      let data = res.data.data;
      let msg = res.data.msg;
      let code = res.data.code;
      if (code == -1) {
        ElNotification({
          title: "Error",
          message: msg,
          type: "error",
        });
        return;
      }
      if (code == -2) {
        ElNotification({
          title: "Error",
          message: msg,
          type: "error",
        });
        return;
      }
      if (data != null) {
        
        let taskBody = {
          ip: "172.21.213.105",
          port: "8061",
          tid: data.tid,
        };
        task.dataList.push({
          'simularTrait':'task',
          'taskBody':taskBody
        })
        localStorage.getItem('taskResultList')
        localStorage.setItem('taskResult',JSON.stringify(taskBody))
        let interval = setInterval(() => {
          axios
            .post("http://172.21.213.44:8999/task/taskResult", taskBody)
            .then((res) => {
              let data = res.data.data.data;
              let code = res.data.data.data.code;
              let msg = res.data.data.data.msg;
              console.log("status", data.status, res.data.data);
              if (code === -1) {
                // loading.value = false;
                clearInterval(interval);
                ElNotification({
                  title: "Error",
                  message: msg,
                  type: "error",
                });
              }
              if (data.status === -1) {
                // loading.value = false;
                clearInterval(interval);
                ElNotification({
                  title: "Error",
                  message: "Some error occured when the model running!",
                  type: "error",
                });
              } else if (data.status === 2) {
                clearInterval(interval);
                ElNotification({
                  title: "Success",
                  message: "模型运行成功",
                  type: "success",
                  duration: 10000,
                });
                loading.value = false;
                let outputs = data.outputdata;

                outputs.forEach((el) => {
                  let statename = el.statename;
                  let eventName = el.event;
                  let state = MDLStatesInfo.value.find((state) => {
                    return state.name == statename;
                  });
                  if (state == undefined) return;
                  let event = state.event.find((event) => {
                    return event.eventName == eventName;
                  });
                  if (event == undefined) return;
                  event.tag = el.tag;
                  event.suffix = el.suffix;
                  event.url = el.url;
                  event.multiple = el.multiple;
                });
              } else {
                console.log("");
                loading.value = false;
              }
            });
        }, 5000);
      } else {
        loading.value = false;
        ElNotification({
          title: "Error",
          message: "Inner error happened !",
          type: "error",
        });
      }
    });
  } else {
    ElNotification({
      title: "Error",
      message: "Data is not prepared !",
      type: "error",
    });
  }
};
defineExpose({ handleLoadTestData, handleInvoke });
</script>

<style lang="less" scoped>
// 兼容css
.modelConfigBox {
  z-index: 99999;
  left: 5px;
  background-color: white;
  width: 100%;
}
/deep/.el-loading-spinner {
  position: fixed;
  z-index: 1001;
  top: 48%;
  left: 0%;
  //.circular{
  //  top:45vh;
  //  position: fixed;
  //}
  //.el-loading-text{
  //  top:50vh;
  //  position: fixed;
  //  right: 12%;
  //}
}
/deep/.el-loading-mask {
  position: fixed;
  z-index: 2000;
  background-color: var(--el-mask-color);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  transition: opacity var(--el-transition-duration);
}
</style>


