<template>
  <el-row class="modelConfigBox"
          v-loading="loading"
          element-loading-text="The Model is Running..."
          element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <el-col :span="22" :offset="1">
      <template v-for="(item,index) in MDLStatesInfo" :key="index">
        <data-state :state="item"></data-state>
      </template>
    </el-col>
  </el-row>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import {reactive, computed, ref, defineProps, watch,defineExpose} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import { ElMessage,ElNotification } from "element-plus";
import axios from "axios";
import DataState from "components/App/dataState"

const router=useRouter()//路由直接用router.push(...)
const store=useStore()//vuex直接用store.commit

const loading  = ref(false)

const MDLStatesInfo = ref([])

const props = defineProps({
  modelId: {
    type:String,
    default:''
  },
});
watch(props,(props,prevProps)=>{
  getMDL();
})

const getMDL = () => {
  axios.get("http://172.21.212.63:8999/model/getMdlById/"+props.modelId).then(res=>{
    //对拿到的states再进行一下处理
    let states = res.data.data.mdl.states;
    for (let i = 0; i < states.length; i++) {
      let state = states[i];
      for (let j = 0; j < state.event.length; j++) {
        if (state.event[j].data != undefined && state.event[j].eventType == "response") {
          let nodes = state.event[j].data[0].nodes;
          let refName = state.event[j].data[0].text.toLowerCase();
          if (state.event[j].data[0].externalId != undefined) {
            state.event[j].externalId = state.event[j].data[0].externalId;
          }

          if (nodes != undefined && refName != "grid" && refName != "table" && refName != "shapes") {
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
          }
          else {
            states[i].event[j].data[0].nodes = undefined;
          }

        }
      }
    }
    MDLStatesInfo.value = states
  })
}
getMDL();
const addTestData = (data) => {
  data.forEach(el => {
    let stateId = el.stateId;
    let eventName = el.eventName;
    let state = MDLStatesInfo.value.find(state => {
      return state.Id == stateId;
    });
    if (state == undefined) return;
    let event = state.event.find(event => {
      return event.eventName == eventName;
    });
    event.tag = el.tag;
    event.suffix = el.suffix;
    event.url = el.dataUrl;
    event.visual = el.visual

    if (event == undefined) return;
    if (el.children.length > 0) {
      if (el.children.length == 1) {
        let children = event.children[0]
        children.value = el.children[0].value
      }
      else {
        for (let i = 0; i < el.children.length; i++) {
          let name = el.children[i].eventName
          let eventChild = event.children.find(child => {
            return child.eventName == name;
          })
          if (eventChild != null) {
            eventChild.value = el.children[i].value
          }
        }
      }
    }
  })
}
let prepared = false;
const handleLoadTestData = () =>{
  axios.get("http://172.21.212.63:8999/model/getModelTestDataSet/"+props.modelId).then(res=>{
    let data = res.data.data.dataSet1;
    prepared = true;
    addTestData(data);
  })
}
const handleInvoke = () =>{
  //判断数据是否准备完成
  // let states = MDLStatesInfo.value;
  // for (let i = 0; i < states.length; i++) {
  //   let events = states[i].event;
  //   for (let j = 0; j < events.length; j++) {
  //     let event = events[j];
  //     if (event.eventType == "response" && event.optional == false && event.children != undefined) {
  //       for (let k = 0; k < event.children.length; k++) {
  //         let child = event.children[k];
  //         if (child.value == undefined || child.value.trim() == "") {
  //           ElNotification({
  //             title: 'Error',
  //             message: 'Some input parameters are not set',
  //             type: 'error',
  //           })
  //           // throw new Error("Some input parameters are not set");
  //           return;
  //         }
  //       }
  //     }
  //   }
  // }
  if(prepared){
    //loading部分代码
    let json = {
      oid: props.modelId,
      ip: "172.21.213.105",
      port: "8061",
      inputs: []
    };
    try {
      MDLStatesInfo.value.forEach(state => {
        let statename = state.name;
        state.event.forEach(el => {
          let event = el.eventName;
          let tag = el.tag;
          let url = el.url;
          let suffix = el.suffix;
          let templateId = el.externalId;
          if(templateId!=null) templateId=templateId.toLowerCase();
          let children = el.children;
          if (el.eventType == "response") {
            if (el.optional) {
              if (url === null || url === undefined) {
                console.log("")
              } else {
                json.inputs.push({
                  statename,
                  event,
                  url,
                  tag,
                  suffix,
                  templateId,
                  children
                });
              }
            } else {
              if (url === null || url === undefined) {
                ElNotification({
                  title: 'Error',
                  message: 'Some input data are not provided',
                  type: 'error',
                })
                throw new Error("Some input data are not provided");
              }
              json.inputs.push({
                statename,
                event,
                url,
                tag,
                suffix,
                templateId,
                children
              });
            }
          }
        });
      });
    } catch (e) {
      return;
    }
    //请求接口调用模型

    axios.post("http://172.21.212.63:8999/model/invoke",json).then(res=>{
      let data = res.data.data;
      let msg = res.data.msg;
      let code = res.data.code;
      if (code == -1) {
        ElNotification({
          title: 'Error',
          message: msg,
          type: 'error',
        })
        return;
      };
      if (code == -2) {
        ElNotification({
          title: 'Error',
          message: msg,
          type: 'error',
        })
        return;
      };
      if(data != null){
        loading.value = true
        let taskBody = {
          ip: "172.21.213.105",
          port: "8061",
          tid:data.tid
        }
        let interval = setInterval(() =>{
          axios.post("http://172.21.212.63:8999/task/taskResult",taskBody).then(res=>{
            let data = res.data.data.data;
            let code = res.data.data.data.code;
            let msg = res.data.data.data.msg;
            console.log("status",data.status,res.data.data)
            if (code === -1) {
              clearInterval(interval);
              ElNotification({
                title: 'Error',
                message: msg,
                type: 'error',
              });
            }
            if (data.status === -1) {
              clearInterval(interval);
              ElNotification({
                title: 'Error',
                message:"Some error occured when the model running!",
                type: 'error',
              })
            } else if (data.status === 2) {
              clearInterval(interval);
              ElNotification({
                title: 'Success',
                message: 'The model has run successfully!',
                type: 'success',
              })
              loading.value = false;

              let outputs = data.outputdata;

              outputs.forEach(el => {
                let statename = el.statename;
                let eventName = el.event;
                let state = MDLStatesInfo.value.find(state => {
                  return state.name == statename;
                });
                if (state == undefined) return;
                let event = state.event.find(event => {
                  return event.eventName == eventName;
                });
                if (event == undefined) return;
                event.tag = el.tag;
                event.suffix = el.suffix;
                event.url = el.url;
                event.multiple = el.multiple;
              });
            }else {
              console.log("")
            }
          })
        },5000)
      }else {
        ElNotification({
          title: 'Error',
          message: 'Inner error happened !',
          type: 'error',
        })
      }

    })
  }else {
    ElNotification({
      title: 'Error',
      message: 'Data is not prepared !',
      type: 'error',
    })
  }
}
defineExpose({ handleLoadTestData,handleInvoke});
</script>

<style lang="less" scoped>
// 兼容css
.modelConfigBox{
  z-index: 999;left: 5px;
  background-color: white;
  width: 100%;
}
/deep/.el-loading-spinner{
  top:40vh;
}
</style>


