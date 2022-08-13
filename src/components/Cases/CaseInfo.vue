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
              <p style="font-size: 1.1em;margin-left: 40px"
                 v-if="caseInfo.introduction == null || caseInfo.introduction == ''"
              >暂无简介</p>
              <p v-else style="font-size: 1.1em;margin-left: 40px">{{caseInfo.introduction}}</p>
            </div>
          </div>
          <h3 class="typeName">案例描述</h3>
          <el-divider ></el-divider>
          <div class="descriptionBlock" v-if="caseInfo.description.length != 0">
            <template
                v-for="(item, key) in caseInfo.description"
                :key="key"
            >
              <p v-if="item.type == 'text'" class="descriptionText">
                {{ item.value }}
              </p>
              <el-image
                  class="imageBlock"
                  v-if="item.type == 'image'"
                  :src="baseUrl + item.value"
              ></el-image>
            </template>
          </div>
          <div v-else>暂无描述</div>
          <h3 class="typeName">案例数据</h3>
          <el-divider ></el-divider>
          <template v-if="caseInfo.resourceDataList != null">
              <div style="display: flex;align-items: center;width: 100%;flex-wrap: wrap;" v-if="caseInfo.resourceDataList.length != 0">
                <template v-for="(item, key) in resourceDataList" :key="key">
                  <div class="caseCard">
                    <div class="caseImageWrap">
                      <el-image
                          class="caseImage"
                          @click="startSearch(item.name)"
                          :src="dataServer + item.imgWebAddress"
                          fit="fill"
                      ></el-image>
                      <div class="imageMask">
                        <img :src="mdOpenIcon" class="caseIcon"/>
                        <span>查看数据</span>
                      </div>
                    </div>
                    <div class="cardText">
                      <el-tooltip :content="item.name" placement="bottom">
                        <h4 class="font-size-case">{{ item.name }}</h4>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
              </div>
            <div v-else>暂无数据</div>
          </template>
          <div v-else>暂无数据</div>
          <h3 class="typeName">相关资料</h3>
          <el-divider ></el-divider>
          <template v-if="caseInfo.relatedResource != null">
            <div class="data-area"  v-if="caseInfo.relatedResource.length != 0">
              <template v-for="(item,key) in caseInfo.relatedResource" :key="key">
                <div class="data-item">
                  <el-link  style="font-size: 0.9375rem" :href="item.url" type="primary" target="_blank">{{item.name}}<el-icon><Link></Link></el-icon></el-link>
                  <p style="color: #6e6e6e;font-size: 0.8125rem">{{item.description}}</p>
                </div>
              </template>
            </div>
            <div v-else>暂无描述</div>
          </template>
          <div v-else>暂无描述</div>
        </div>
      </el-col>
      <el-col :span="4" :offset="1">
        <div class="rightBox1">
          <div><el-button  class="rightButton hvr-shutter-out-horizontal" plain><span>在实验室中打开</span><ArrowDown style="width: 1em"/></el-button></div>
          <div><el-button  class="rightButton hvr-shutter-out-horizontal" @click="toCase(caseInfo.path)" plain><span>查看案例</span><ArrowDown style="width: 1em"/></el-button></div>
          <div><el-button  class="rightButton hvr-shutter-out-horizontal" @click="editCases" plain><span>编辑案例</span><ArrowDown style="width: 1em"/></el-button></div>
          <edit-case-draw
              ref="editCaseRef"
              title="编辑--案例"
              :editing-case-info="updateCases"
              @saveCase="saveCase"
              @cancelCase ="cancelCase"
              theme=""
          ></edit-case-draw>
        </div>
        <div>
          <h3 class="authorInfo">作者</h3>
          <template v-if="caseInfo.caseAuthor.length != 0">
            <template v-for="(item,key) in caseInfo.caseAuthor" :key="key">
              <p class="font-size-1">
                作者：{{item.name}}
              </p>
              <p  class="font-size-1">
                作者单位：{{item.workPlace}}
              </p>
              <p  class="font-size-1">
                作者邮箱：{{item.email}}
              </p>
            </template>
          </template>
          <p v-else class="font-size-1">暂无作者信息</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {ArrowDown,Plus,Upload,Link} from '@element-plus/icons-vue'
import { useRouter,useRoute} from "vue-router";
import {post ,get} from "@/request/request_backup";
import {ElNotification} from "element-plus";
import EditCaseDraw from "components/Cases/editCaseDraw";
import {useStore} from "vuex";
const router = useRouter();
const route = useRoute();
const store = useStore();

const mdOpenIcon = require("@/assets/img/icon/md-open.png")
const toCase = (path) => {
  router.push("/case/" + path + "/");
}
const caseInfo = ref({})
const baseUrl = store.state.devBackIp;
const dataServer = store.getters.devIpAddress;

//编辑案例信息
const editCaseRef = ref();
const updateCases = ref({})
const editCases = () => {
  editCaseRef.value.showCase();
  updateCases.value = JSON.parse(JSON.stringify(caseInfo.value));
}
const saveCase = (data) => {
  post("/case/updateCase/"+caseId,data).then(res=>{
    ElNotification({
      message: '案例已更新！',
      type: "success",
    });
    //重新查询更新后的案例信息
    getCaseInfo();
    cancelCase();
  })
}
const cancelCase = () => {
  editCaseRef.value.cancelCase();
}

let caseId;

const getCaseInfo = () => {
  caseId = route.query.caseId;
  get("/case/getCaseById/"+caseId).then(res=>{
    caseInfo.value = res.data.data;
    getResourceDataById(caseInfo.value.resourceDataList);
  })
}
onMounted(()=>{
  getCaseInfo();
})

//获取案例包含的数据
const resourceDataList = ref([])
const getResourceDataById = (idList) => {
  resourceDataList.value = [];
  let body = {
    ids:idList
  }
  post("/case/getResourceDataListInfo",body).then(res=>{
    resourceDataList.value = res.data;
  })
}
//根据数据名称查询数据
const startSearch = function (searchValue) {
  router.push({
    path: "/resourse",
    query: {searchValue},
  });
};
caseInfo.value = {
  name:"案例飞走了",
  thumbnail:"/store/themeImg/swmm.62c2a75e443cecf9144a6fb0.png",
  introduction:"",
  path:"SWMM",
  problem:["洪涝水环境灾害","地表地下水耦合"],
  description:[],
  dataList:[],
  caseAuthor:[],
  resourceDataList:[],
  relatedResource:[
    {
      name:"SWMM官网",
      url:"https://geomodeling.njnu.edu.cn/",
      description: "OpenGMS supports sharing of your modeling and simulation resources for geographic applications. Also, this platform provides a virtual community for collaboration among researchers from various domains. Through open web-distributed resource sharing and collaboration, this platform further contributes to open geographic modelling and simulation to enable broader participation and exploration.",
    },
    {
      name:"泛在",
      url:"http://www.geofuturelab.com/ubiquitous-geoinformation/platform-help",
      description: "收集散布于互联网中的文本、图表、图像、地图、音频、视频数据（“原数据”）， 提取其类型、结构、内容等信息（“标签”），并挖掘这些标签关联的高层信息（“七要素”）。 为此，客户端提供了数据资源、信息标签、信息检索、信息溯源模块。在这些模块中，用户可以从不同的角度查询、 检索原数据、标签、语义等内容。"
    },
  ]
}
</script>

<style lang="less" scoped>
.about {
  top: 65px;
  background-color: white;
  overflow: scroll;
  margin-bottom: 70px;
}
.case-name{
  font-size: 1.8em;
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
/*.caseImageWrap{*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*  flex-wrap: wrap;*/
/*  position: relative;*/
/*  height: 120px;*/
/*  width: 192px;*/
/*  cursor: pointer;*/
/*}*/

/*.caseImage{*/
/*  height: 120px;*/
/*  width: 192px;*/
/*}*/
/*.imageMask{*/
/*  height: 120px;*/
/*  width: 192px;*/
/*  opacity: 0;*/
/*  position: absolute;*/
/*  top:0;*/
/*  right: 0;*/
/*  background-color: rgba(0,0,0,0.7);*/
/*  color:white;*/
/*  pointer-events: none;*/
/*  transition:opacity 200ms linear ;*/
/*  z-index: 100;*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*}*/
/*.caseImageWrap:hover .imageMask{*/
/*  opacity: 1;*/
/*}*/
/*.caseIcon{*/
/*  width: 1em;*/
/*}*/

@imageHeight: 100px;
@imageWidth:160px;
.caseImageWrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  height: @imageHeight;
  width: @imageWidth;
  cursor: pointer;
}

.caseImage {
  height: 100px;
  width: 160px;
  border-bottom: 1px solid lightgray;
}

.imageMask {
  height: 100px;
  width: 160px;
  opacity: 0;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  pointer-events: none;
  transition: opacity 200ms linear;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.caseImageWrap:hover .imageMask {
  opacity: 1;
}

.caseIcon {
  width: 1em;
}

.font-size-case {
  line-height: 1.5;
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cardText{
  padding: 0.5rem;
  text-align: center;
  width:160px;
}

.caseCard {
  margin-right: 20px;
  margin-bottom: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
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
.descriptionBlock {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.2em;
}

.descriptionText {
  text-indent: 2em;
}
.imageBlock {
  width: 16vw;
  margin-top: 15px;
  margin-bottom: 15px;
  animation: scale-in-center 0.5s both;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
@keyframes scale-in-center {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.editDialogRow {
  align-items: center;
  margin-bottom: 15px;
  margin-top: 15px;
  justify-content: center;
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
