<template>
  <div class="about">
    <el-row style="padding-top: 40px">
      <el-col :span="11" :offset="4">
        <div>
          <div style="display: flex">
            <div class="caseImageWrap">
              <el-image class="caseImage" @click="toCase(caseInfo.path)"  :src="baseUrl+caseInfo.thumbnail" fit="fill"></el-image>
              <div class="imageMask">
                <img :src="mdOpenIcon" class="caseIcon">
                <span >查看案例</span>
              </div>

            </div>
            <div>
              <h2 class="case-name">{{caseInfo.name}}</h2>
              <p  class="case-name">{{caseInfo.description[0]}}</p>
            </div>
          </div>
          <h3 class="typeName">案例描述</h3>
          <el-divider ></el-divider>
          <p>{{caseInfo.description[0]}}{{caseInfo.description[0]}}</p>
          <h3 class="typeName">案例数据</h3>
          <el-divider ></el-divider>
            <div class="data-area">
              <template v-for="(item,key) in caseInfo.dataList" :key="key">
                <div class="data-item">
                  <p style="color: #4c4c4c;font-size: 0.9375rem">{{item.name}}</p>
                  <p style="color: #6e6e6e;font-size: 0.8125rem">{{item.type}}</p>
                </div>
              </template>
            </div>
        </div>
      </el-col>
      <el-col :span="4" :offset="1">
        <div class="rightBox1">
          <div><el-button  class="rightButton hvr-shutter-out-horizontal" plain><span>在实验室中打开</span><ArrowDown style="width: 1em"/></el-button></div>
          <div><el-button  class="rightButton hvr-shutter-out-horizontal" plain><span>查看案例</span><ArrowDown style="width: 1em"/></el-button></div>
        </div>
        <div>
          <h3 class="authorInfo">贡献者</h3>
          <p class="font-size-1">
           {{caseInfo.caseAuthor.name}}
          </p>

          <h3 class="authorInfo">作者</h3>
          <p class="font-size-1">
            作者：{{caseInfo.caseAuthor.name}}
          </p>
          <p  class="font-size-1">
            作者单位：{{caseInfo.caseAuthor.workPlace}}
          </p>
          <p  class="font-size-1">
            作者邮箱：{{caseInfo.caseAuthor.email}}
          </p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {ArrowDown} from '@element-plus/icons-vue'
import { useRouter} from "vue-router";
const router = useRouter();
const mdOpenIcon = require("@/assets/img/icon/md-open.png")
const toCase = (path) => {
  router.push("/case/" + path + "/");
}

const caseInfo = ref({})
const baseUrl = ref("http://172.21.213.248:8999")
caseInfo.value = {
  name:"SWMM",
  thumbnail:"/store/themeImg/swmm.62c2a75e443cecf9144a6fb0.png",
  path:"SWMM",
  description:["SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。"],
  dataList:[
    {
      name:"dem.tif",
      type:"tif"
    },{
      name:"土地利用.shp",
      type:"shp"
    },{
      name:"管网数据.shp",
      type:"shp"
    },{
      name:"降水.csv",
      type:"csv"
    },{
      name:"径流量.csv",
      type:"csv"
    }
  ],
  caseAuthor:{
    name:"SWMM team",
    workPlace: "U.S. Environmental Protection Agency",
    email:"123@gmail.com"
  },
}
</script>

<style scoped>
.about {
  top: 7.46vh;
  background-color: white;
  overflow: scroll;
}
.case-name{
  margin-left: 40px;
}
.data-area{
  border-left: solid 1px lightgray;
  width: 100%;
}
.data-item{
  padding-left:24px;
  padding-top: 8px;
  padding-bottom: 8px;
}
.data-item:hover{
  background-color: rgb(248, 248, 248);
}
.caseImageWrap{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  height: 100px;
  width: 160px;
  cursor: pointer;
}

.caseImage{
  height: 100px;
  width: 160px;
}
.imageMask{
  height: 100px;
  width: 160px;
  opacity: 0;
  position: absolute;
  top:0;
  right: 0;
  background-color: rgba(0,0,0,0.7);
  color:white;
  pointer-events: none;
  transition:opacity 200ms linear ;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.caseImageWrap:hover .imageMask{
  opacity: 1;
}
.caseIcon{
  width: 1em;
}

.rightBox1{
  display: flex;
  flex-direction: column;
}
.rightButton{
  width: 100%;
  margin: 0 0 25px 0;
  letter-spacing: 2px;
  color: #0c7dd8;
}
.typeName {
  animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;
  border-left: 8px solid #4ba0ff;
  padding: 0 15px;
  margin-top: 24px;
}
.authorInfo {
  animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;
  border-left: 8px solid #609356;
  padding: 0 15px;
  margin-top: 24px;
}
.font-size-1{
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #6e6e6e;
  padding: 15px 15px 0 20px;
}

/* Shutter Out Horizontal */
.hvr-shutter-out-horizontal {
  display: inline-block;
  vertical-align: middle;
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  background: white;
  transition-property: color;
  transition-duration: 0.4s;
}
.hvr-shutter-out-horizontal:before {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #2098D1;
  transform: scaleX(0);
  transform-origin: 50%;
  transition-property: transform;
  transition-duration: 0.4s;
  transition-timing-function: ease-out;
}
.hvr-shutter-out-horizontal:hover, .hvr-shutter-out-horizontal:focus, .hvr-shutter-out-horizontal:active {
  color: white;
}
.hvr-shutter-out-horizontal:hover:before, .hvr-shutter-out-horizontal:focus:before, .hvr-shutter-out-horizontal:active:before {
  transform: scaleX(1);
}
</style>
