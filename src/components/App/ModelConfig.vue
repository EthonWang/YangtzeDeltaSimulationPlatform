<template>
  <el-row class="modelConfigBox">
    <el-col :span="18" :offset="2">
      <template v-for="(item,index) in MDLStatesInfo" :key="index">
        <data-state :state="item"></data-state>
      </template>
    </el-col>
    <!--    <el-col :span="9" class="mapArea">-->
    <!--      <template v-for="(item,index) in MDLStatesInfo" :key="index">-->
    <!--        <my-data-state :state="item"></my-data-state>-->
    <!--      </template>-->
    <!--    </el-col>-->
  </el-row>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import axios from "axios";
import DataState from "components/App/dataState"
import MyDataState from "components/App/myDataState"

const router=useRouter()//路由直接用router.push(...)
const store=useStore()//vuex直接用store.commit

const MDLStatesInfo = ref([])

const getMDL = () => {
  axios.get("http://172.21.212.63:8999/model/getMdlById/6267987437f9ae3d93c4ecaa").then(res=>{
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
    console.log("MDLStatesInfo",MDLStatesInfo.value)
    console.log("name",MDLStatesInfo.value)
  })
}
getMDL();
</script>

<style lang="less" scoped>
// 兼容css
.modelConfigBox{
  z-index: 999;top: 70px;left: 5px;
  background-color: white;
  width: 100%;
}
.mapArea{
  //background-color: #adc9ce;
}
.config-title {
  //font-size: 18px;
  //font-width: bold;
  margin: 5px 0px;
}
.config-icon{
  width: 20px;
  margin-right: 5px;
  color: #56BBF1
}
.config-card{
  background-color: #EFEFEF;
}
</style>


