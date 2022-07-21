<template>
  <div class="about">
    <el-row style="margin-top: 5vh">
      <el-col :offset="2" :span="4">
        <el-card>
          <template #header>
            <span>专题分类</span>
          </template>
          <el-tree
              ref="treeRef"
              :data="modelTreeData"
              node-key="label"
              @node-click="handleNodeClick"
              :default-expand-all='true'
              :highlight-current="true"
          >
            <template class="custom-tree-node" v-slot="{ node, data }">
              <span @click="(checked) => getCurrentNode(checked, data)">{{
                node.label
              }}</span>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :offset="1" :span="15">
        <el-card style="padding-bottom: 40px">
          <el-row style="align-items: center;justify-content: space-between">
            <h2 class="thematicName">{{thematicName}}</h2>
            <el-icon :size="60" color="#246abd" style="cursor: pointer;margin-right: 15px">
              <el-tooltip content="编辑专题" placement="top" effect="light">
                <Edit @click="editThematic">编辑专题</Edit>
              </el-tooltip>
              <el-tooltip content="添加案例" placement="top" effect="light">
                <CirclePlus @click="outNewCases"/>
              </el-tooltip>
            </el-icon>
          </el-row>
          <el-row>
            <p class="descriptionText">{{ thematicItem.introduction }}</p>
          </el-row>
          <div>
            <h3 class="typeName">相关案例</h3>
            <el-divider ></el-divider>
            <div style="display: flex;align-items: center;width:100%;flex-wrap: wrap">
              <template v-for="(item,key) in thematicItem.relatedCases" :key="key">
                <div  class="caseCard">
                  <div class="caseImageWrap">
                    <el-image class="caseImage" @click="toCase(item.path)"  :src="'/back'+item.thumbnail" fit="fill"></el-image>
                    <div class="imageMask">
                      <img :src="mdOpenIcon" class="caseIcon">
                      <span >打开案例</span>
                    </div>
                  </div>
                  <div style="display: flex;justify-content: center;padding: 0.5rem;">
                    <el-tooltip effect="light"
                                placement="bottom"
                                content="查看案例详情">
                      <h4 class="font-size-1" style="cursor: pointer" @click="goCaseInfo()">{{item.name}}</h4>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </div>
            <div class="dataBlock">
              请在此处创建与该专题相关的案例
              <el-button :icon="Plus" size="large" @click="outNewCases"  class="hvr-grow" plain></el-button>
              <el-dialog
                  v-model="newCasesVisible"
                  title="新增案例"
                  width="35%"
              >
                  <el-row class="editDialogRow"><span>案例名称:</span><el-col :span="20" :offset="1"><el-input v-model="editingCases.name"  placeholder="请输入案例名称"></el-input></el-col></el-row>
                  <el-row class="editDialogRow"><span>案例描述:</span><el-col :span="20" :offset="1"><el-input v-model="editingCases.description" placeholder="请输入案例描述"></el-input></el-col></el-row>
                  <el-row class="editDialogRow"><span>Path名称:</span><el-col :span="20" :offset="1"><el-input v-model="editingCases.path" placeholder="案例在系统对应的vue文件名"></el-input></el-col></el-row>
                  <el-row class="editDialogRow"><span>缩略图片:</span>
                    <el-col style="display: flex;flex-direction: row" :span="20" :offset="1"><el-input placeholder="请上传案例缩略图" v-model="editingCases.imageName"  style="width: 100%;"></el-input>
                      <el-upload
                          ref="upload"
                          class="upload-demo"
                          style="width: 30%"
                          action="/back/uploadThemeImg"
                          :limit="1"
                          method="post"
                          :on-success="handleSuccess"
                          :on-exceed="handleExceed"
                          :auto-upload="true"
                          :show-file-list="false"
                      >
                        <template #trigger>
                          <el-button :icon="Upload"  type="success" plain>上传图片</el-button>
                        </template>
                      </el-upload>
                    </el-col>
                  </el-row>
                  <el-row class="editDialogRow">
                      <el-button type="warning" size="default" @click="outCancelCases">取消</el-button>
                      <el-button type="success" size="default" @click="outSubmitCases">保存</el-button>
                  </el-row>
              </el-dialog>
            </div>
          </div>
          <div>
            <h3 class="typeName">相关数据</h3>
            <el-divider ></el-divider>
            <div style="display: flex;align-items: center;width:100%;flex-wrap: wrap">
              <template v-for="(item,key) in relatedData" :key="key">
                <div  class="caseCard">
                  <div class="caseImageWrap">
                    <el-image class="caseImage" @click="startSearch(item.name)"  :src="dataServer+item.imgWebAddress" fit="fill"></el-image>
                    <div class="imageMask">
                      <img :src="mdOpenIcon" class="caseIcon">
                      <span >查看数据</span>
                    </div>
                  </div>
                  <div style="display: flex;justify-content: center;padding: 0.5rem;">
                    <h4 class="font-size-1">{{item.name}}</h4>
                  </div>
                </div>
              </template>
            </div>
            <div class="dataBlock">
              请在此处上传与该专题相关的数据
              <el-button
                :icon="Plus"
                @click="router.push('/user/data')"
                size="large"
                class="hvr-grow"
                plain
              ></el-button>
            </div>
          </div>
          <div>
            <h3 class="typeName">问题描述</h3>
            <el-divider></el-divider>
            <div class="descriptionBlock">
              <template
                v-for="(item, key) in thematicItem.description"
                :key="key"
              >
                <p v-if="item.type == 'text'" class="descriptionText">
                  {{ item.value }}
                </p>
                <div class="imageBlock">
                  <el-image v-if="item.type == 'image'" :src="'/back'+item.value"></el-image>
                </div>
              </template>
            </div>
          </div>
          <el-divider></el-divider>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
        v-model="editDialogVisible"
        title="编辑问题信息"
        width="35%"
    draggable>
        <el-divider>问题简介</el-divider>
        <el-row class="editDialogRow"><span>问题名称:</span><el-col :span="20" :offset="1"><el-input disabled :placeholder="thematicName"></el-input></el-col></el-row>
        <el-row class="editDialogRow"><span>问题简介:</span><el-col :span="20" :offset="1"><el-input v-model="editThemeItem.introduction" type="textarea" placeholder="请输入问题简介" :autosize="{ minRows: 2, maxRows: 4 }"></el-input></el-col></el-row>
        <el-divider>相关案例</el-divider>
        <div style="display: flex;align-items: center;flex-wrap: wrap;margin-bottom: 10px">
          <template v-for="(item,key) in relatedCases" :key="key">
            <el-card :body-style="{ padding: '0px'}" style="margin-left: 10px" >
              <el-image class="caseImage"  :src="'/back'+item.thumbnail" fit="fill"></el-image>
              <div style="display: flex;flex-direction: column;align-items: flex-start;padding:0 10px 10px 10px">
                <p style="line-height: 2">{{item.name}}</p>
                <div style="">
                  <el-button size="small" @click="handleEditCases(item,key)">编辑</el-button>
                  <el-button size="small" @click="deleteCases(key)">删除</el-button>
                </div>
              </div>
            </el-card>
          </template>
        </div>
        <el-row style="justify-content: center;margin-bottom: 10px"><el-button :icon="Plus" size="large" @click="newCases"   plain>添加专题相关案例</el-button></el-row>
        <el-row v-show="editOrNew == 'new' || editOrNew == 'edit'" style="align-items: center;margin-bottom: 10px;">
          <el-card style="width: 100%;margin-right:10px;">
            <el-row class="editDialogRow"><span>案例名称:</span><el-col :span="20" :offset="1"><el-input v-model="editingCases.name"  placeholder="请输入案例名称"></el-input></el-col></el-row>
            <el-row class="editDialogRow"><span>案例描述:</span><el-col :span="20" :offset="1"><el-input v-model="editingCases.description" placeholder="请输入案例描述"></el-input></el-col></el-row>
            <el-row class="editDialogRow"><span>Path名称:</span><el-col :span="20" :offset="1"><el-input v-model="editingCases.path" placeholder="案例在系统对应的vue文件名"></el-input></el-col></el-row>
            <el-row class="editDialogRow"><span>缩略图片:</span>
              <el-col style="display: flex;flex-direction: row" :span="20" :offset="1"><el-input placeholder="请上传案例缩略图" v-model="editingCases.imageName"  style="width: 100%;"></el-input>
                <el-upload
                    ref="upload"
                    class="upload-demo"
                    style="width: 30%"
                    action="/back/uploadThemeImg"
                    :limit="1"
                    method="post"
                    :on-success="handleSuccess"
                    :on-exceed="handleExceed"
                    :auto-upload="true"
                    :show-file-list="false"
                >
                  <template #trigger>
                    <el-button :icon="Upload"  type="success" plain>上传图片</el-button>
                  </template>
                </el-upload>
              </el-col>
            </el-row>
            <el-row class="editDialogRow">
              <template v-if="editOrNew == 'new'">
                <el-button type="warning" size="default" @click="cancelEdit">取消</el-button>
                <el-button type="success" size="default" @click="submitNewCases">保存</el-button>
              </template>
              <template v-else>
                <el-button type="warning" size="default" @click="cancelEdit">取消</el-button>
                <el-button type="success" size="default" @click="saveEditCases">保存</el-button>
              </template>
            </el-row>
          </el-card>
        </el-row>
        <el-divider>问题描述</el-divider>
        <el-row style="justify-content: space-around;margin-bottom: 10px">
          <el-button :icon="Plus" size="large" @click="newDescription('text')"   plain>添加文字描述</el-button>
          <el-button :icon="Plus" size="large" @click="newDescription('image')"   plain>添加图片描述</el-button>
        </el-row>
        <template v-for="(item,key) in description" :key="key">
          <el-row v-if="item.type == 'text'" class="editDialogRow">
            <span>问题描述:</span>
            <el-col :span="20" :offset="1" style="align-items: center">
              <el-input style="width: 94%;" v-model="item.value" type="textarea" placeholder="请输入问题描述" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
              <el-icon style="cursor: pointer;margin-left: 2%" @click="deleteDescription('text',key)" :size="20"><Delete/></el-icon>
            </el-col>
          </el-row>
          <el-row v-if="item.type == 'image'" class="editDialogRow">
            <span>相关图片:</span>
            <el-col style="display: flex;flex-direction: row" :span="20" :offset="1"><el-input placeholder="请上传案例缩略图" v-model="item.imageName"  style="width: 94%;"></el-input>
              <el-upload
                  ref="upload"
                  class="upload-demo"
                  action="/back/uploadThemeImg"
                  :limit="1"
                  method="post"
                  :on-success="uploadDescImg"
                  :on-exceed="handleExceed"
                  :auto-upload="true"
                  :show-file-list="false"
              >
                <template #trigger>
                  <el-button :icon="Upload" @click="addImage(key)" type="success"  plain>上传图片</el-button>
                </template>
              </el-upload>
              <el-icon style="cursor: pointer;margin-left: 2%" @click="deleteDescription('image',key)" :size="20"><Delete/></el-icon>
            </el-col>
          </el-row>
        </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel">取消</el-button>
          <el-button type="primary" @click="editOK"
          >提交修改</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script  setup>
import {ref,onMounted} from 'vue';
import {useStore} from "vuex";
import {Plus,Edit,Upload,Delete,Select,CirclePlus} from '@element-plus/icons-vue'
import { ElNotification,ElMessageBox,ElMessage} from "element-plus";
import { useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
const store = useStore();
const dataServer = store.getters.devIpAddress;

const mdOpenIcon = require("@/assets/img/icon/md-open.png")

onMounted(()=>{
  thematicName.value = "流域生态环境演变";
  getThemeInfo("流域生态环境演变");
})
const thematicName = ref("");
const thematicItem = ref({});
const editThemeItem = ref({});
const relatedData = ref([]);

const startSearch = function (searchValue) {
  router.push({
    path:"/resourse",
    query:{searchValue}
  })
};

let tagClass = "problemTags";

const getThemeInfo = (thematicName,tagName) => {
  axios.get("/back/getTheme/"+thematicName).then(res=>{
    let themeInfo = res.data.data;
    if(themeInfo != null){
      thematicItem.value = themeInfo;
    }else {
      thematicItem.value = {}
      relatedCases.value = [];
      description.value = []
    }
  });

  let DTO = {
    asc: false,
    page: 1,
    pageSize: 16,
    searchText: "",
    sortField: "createTime",
    tagClass: tagClass,
    tagName: tagName,
  };
  axios({
    url: dataServer +  "/getResourceDataList",
    method: "post",
    //忽略contentType
    contentType: false,
    //取消序列换 formData本来就是序列化好的
    processData: false,
    dataType: "json",
    data: DTO,
  }).then(
      (res) => {
        relatedData.value =  res.data.data.content;
        console.log("caseValue",relatedData.value)
      },
      (err) => {
        console.log(err);
      }
  );
}
const toCase = (path) => {
  router.push("/case/" + path + "/");
}
const goCaseInfo = () => {
  router.push("/caseinfo/")
}
const editDialogVisible = ref(false);
const editThematic = () => {
  editDialogVisible.value = true;
  editThemeItem.value =JSON.parse(JSON.stringify(thematicItem.value)) ;
  if(editThemeItem.value.relatedCases != null){
    relatedCases.value = [];
    editThemeItem.value.relatedCases.map(item=>{
      relatedCases.value.push(item)
    })
  }else {
    relatedCases.value = []
  }
  if(editThemeItem.value.description != null){
    description.value = []
    editThemeItem.value.description.map(item=>{
      description.value.push(item)
    })
  }else {
    description.value = []
  }
}

const newCasesVisible = ref(false);
const outNewCases = () => {
  newCasesVisible.value = true ;
  editingCases.value = {};
}
const outCancelCases = () => {
  newCasesVisible.value = false;
}
const outSubmitCases = () => {
  let tempCases = thematicItem.value.relatedCases;
  tempCases.push(editingCases.value);
  thematicItem.value.relatedCases = tempCases;
  let successMessage = "添加成功";
  saveToServer(JSON.parse(JSON.stringify(thematicItem.value)),successMessage);
  newCasesVisible.value = false;
}

const editingCases = ref({});
const relatedCases = ref([]);
const editOrNew = ref('');
const isSaved = ref(true)

const handleEditCases = (item,key) => {
  tempKey.value = key;
  editOrNew.value = 'edit';
  isSaved.value = false;
  editingCases.value = JSON.parse(JSON.stringify(item));
}
const saveEditCases = () => {
  relatedCases.value[tempKey.value] = editingCases.value;
  editOrNew.value ='none'
  ElMessage({
    message: '已保存！',
    type: 'success',
  })
  isSaved.value = true ;
  editOrNew.value ='none';
  editingCases.value = {};
}
const cancelEdit = () => {
  editingCases.value = {};
  editOrNew.value ='none';
  isSaved.value = true;
  ElMessage({
    message: '取消编辑!',
    type: 'warning',
  })
}
const deleteCases = (key) => {
  ElMessageBox.confirm("确认删除此案例吗？").then(()=>{
    relatedCases.value.splice(key,1)
    ElMessage({
      type:'success',
      message:'案例已删除！'
    })
  })
      .catch(()=>{
        ElMessage({
          type:'info',
          message:'取消删除！'
        })
      })
}
const newCases = () => {
  if(isSaved.value == false){
    ElMessageBox.alert("请先保存！！！","提示",{
      confirmButtonText: 'OK',
    })
  }else {
    editOrNew.value = 'new';
    editingCases.value = {};
  }
}

const submitNewCases = () => {
  isSaved.value = true;
  relatedCases.value.push(editingCases.value);
  editOrNew.value ='none'
  ElMessage({
    message: '已保存！',
    type: 'success',
  })
  editingCases.value = {};
}

const description = ref([]);
const newDescription = (type) => {
  if(type == 'text'){
    description.value.push({
      type: "text",
      value:""
    })
  }else {
    description.value.push({
      type: "image",
      value:""
    })
  }
}

const uploadDescImg = (res,uploadFile) => {
  let descriptionTemp = description.value;
  let key = tempKey.value;
  descriptionTemp[key].value = res.data.imgWebPath;
  descriptionTemp[key].imageName = uploadFile.name;
  description.value = descriptionTemp;
}
const deleteDescription = (type,key) => {
  if(type == 'text'){
    description.value.splice(key,1)
  }else {
    description.value.splice(key,1)
  }
}
//用于标识当前案例或者描述的索引
const tempKey = ref('')
const handleSuccess = (res,uploadFile) => {
  let editingCase = editingCases.value;
  editingCase.thumbnail = res.data.imgWebPath;
  editingCase.imageName = uploadFile.name;
  editingCases.value = editingCase;
  console.log("上传图片成功",res.data.imgWebPath)
}
const addImage = (key) => {
  tempKey.value = key;
}
const editOK = () => {
  let bodyData = {
    name:thematicName.value,
    introduction:editThemeItem.value.introduction,
    relatedCases:relatedCases.value,
    relatedData:[],
    description:description.value
  }
  let successMessage = "完成编辑";
  saveToServer(bodyData,successMessage);
  editDialogVisible.value = false;
}
const saveToServer = (bodyData,successMessage) => {
  axios.post("/back/saveTheme",bodyData).then((res)=>{
    if(res.data.msg == "Success"){
      ElNotification({
        title: 'Success',
        message: successMessage,
        type: 'success',
        duration: 10000,
      });
      thematicItem.value = bodyData;
    }
  })
}

const editCancel = () => {
  ElMessage({
    type:'info',
    message:'取消编辑！'
  })
  editDialogVisible.value = false;
}

const modelTreeData = ref([]);
modelTreeData.value = [
  {
    label:"流域水循环及其驱动机制",
    type:"problem",
    children:[
      {
        label:"流域生态环境演变",
        type:"subProblem",
      }, {
        label:"流域碳水耦合循环",
        type:"subProblem",
      },{
        label:"地表地下水耦合",
        type:"subProblem",
      },{
        label:"湖泊水环境监测",
        type:"subProblem",
      },
    ]
  },
  {
    label:"全球变化与区域环境演化",
    children:[
      {
        label:"海岸带变迁",
        type:"subProblem",
      }, {
        label:"河口海岸水动力",
        type:"subProblem",
      },{
        label:"湖泊碳循环",
        type:"subProblem",
      },{
        label:"土壤碳氮循环",
        type:"subProblem",
      },{
        label:"土壤氮转化过程及其环境效应",
        type:"subProblem",
      },
    ]
  },
  {
    label:"灾害响应与治理",
    children:[
      {
        label:"台风与风暴潮",
        type:"subProblem",
      }, {
        label:"洪涝水环境灾害",
        type:"subProblem",
      },{
        label:"地质灾害",
        type:"subProblem",
      },{
        label:"大气污染",
        type:"subProblem",
      },
    ],
  },
  {
    label: "城市化与人地关系协调发展",
    children:[
      {
        label:"城市扩张",
        type:"subProblem",
      }, {
        label:"湿地保护",
        type:"subProblem",
      },{
        label:"农业生态",
        type:"subProblem",
      },{
        label:"人地关系",
        type:"subProblem",
      },{
        label:"城市水问题",
        type:"subProblem",
      },{
        label:"自然遗产",
        type:"subProblem",
      },
    ]
  }
]

const getCurrentNode = (checked,data) => {
  // thematicName.value = data.label;
  //
  // console.log("currentNode",data)
  // getThemeInfo(thematicName.value);
}
const treeRef = ref()
const handleNodeClick = (node,node2) => {
  let tagName = "";
  if(node.type == 'subProblem'){
    console.log("subProblem",node)
    tagName = node2.parent.data.label;
    thematicName.value = node.label;
    getThemeInfo(node.label,tagName);

    console.log("node2",node2.parent.data.label);
  }else {
    console.log("problem",node)
  }
}


const allThematic = ref([])
allThematic.value = [
  {
    name: "流域生态环境演变",
    introduction: "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
        "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。",
    relatedCases:[
      {
        name:"SWMM",
        path:"SWMM",
        thumbnail:"/img/swmm.2f8c8c5d.png",
        description:"SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。"
      },{
        name:"长三角降雨预报专题",
        path:"rainForecast",
        thumbnail:"/img/rainForecast.d75c80f8.png",
        description:"长三角降雨预报专题"
      },
      {
        label: "土壤碳氮循环",
      },
      {
        label: "土壤氮转化过程及其环境效应",
      },
    ],
  },
  {
    label: "灾害响应与治理",
    children: [
      {
        type: "image",
        value: "/img/%E6%B5%81%E   5%9F%9F%E7%94%9F%E6%80%81%E7%8E%AF%E5%A2%83%E6%BC%94%E5%8F%98.ed4630ac.png"
      },
    ]
  }, {
    name: "流域碳水耦合循环",
    introduction: " 在气候变化背景下,人类和流域生态系统的水平衡及碳平衡已成为首要环境问题。气候变化深刻影响到碳水循环多过程及其多向反馈作用机制,进一步加剧水资源供需矛盾,导致生态系统的碳捕获能力降低。流域碳水循环的研究能够为水资源与生态环境保护规划提供直接支持,还能够为大型水利工程提供依据,具有较为显著的实践意义。",
    relatedCases:[
      {
        label: "地质灾害",
      },
      {
        label: "大气污染",
      },
    ],relatedData:[

    ],
  },

  {
    label: "城市化与人地关系协调发展",
    children: [
      {
        label: "湿地保护",
      },
      {
        label: "城市扩张",
      },
      {
        label: "农业生态",
      },
    ]
  }
]
// setTimeout(()=>{
//   const show_name=localStorage.getItem("show_themetic")
// thematicName.value = show_name.replace('\n','');
//   getThemeInfo(show_name);
// },600)


</script>

<style lang="less" scoped>
.about {
  top: 7.46vh;
  background-color: white;
  overflow: scroll;
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
  border-bottom: 1px solid lightgray;
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
.font-size-1{
  line-height: 1.5;
  font-size: 0.8rem;
}

.caseCard{
  margin-right: 20px;
  margin-bottom: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

.editDialogRow{
  align-items: center;
  margin-bottom: 15px;
  margin-top: 15px;
  justify-content: center;
}
.dataBlock {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.descriptionBlock {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.descriptionText {
  text-indent: 2em;
}
.imageBlock {
  width: 30vw;
  margin-bottom: 15px;
  animation: scale-in-center 1s both;
  box-shadow: 10px -8px 15px rgba(0, 0, 0, 0.2);
}
//.imageBlock :hover{
//  transform: scale(1.05);
//  transition: 0.6s;
//}
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

.thematicName {
  //margin-top: 5vh;
}
.typeName {
  animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;
  border-left: 8px solid #4ba0ff;
  padding: 0 15px;
  margin-top: 24px;
}

@keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
/* Grow */
.hvr-grow {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: transform;
  transition-property: transform;
  margin-left: 30px;
}
.hvr-grow:hover,
.hvr-grow:focus,
.hvr-grow:active {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
/deep/.el-card__header {
  text-align: center;
  font-size: 1.2em;
  padding: 10px 15px;
  background-color: lightgray;
}
.case-contain {
  position: relative;
  left: 0%;
  top: 4%;
  height: 85%;
  width: 100% - 2 * $left;
  padding-bottom: 50px;
  display: flex;
  //   flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  .scrollbar {
    height: 86%;
  }
  .onecase {
    height: 600px;
    margin: 1%;
    // margin-right: 0px;
    // float: left;
    // flex: 5;
    width: 30%;
    min-width: 260px;

    // position: relative;
  }
}
</style>
