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
            <template class="custom-tree-node" v-slot="{ node,data}" >
              <span @click="checked=>getCurrentNode(checked,data)">{{node.label}}</span>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :offset="1" :span="15">
        <el-card style="padding-bottom: 40px">
          <div>
            <h2 class="thematicName">{{thematicItem.name}}</h2>
          </div>
          <el-row>
            <p class="descriptionText">{{thematicItem.introduction}}</p>
          </el-row>
          <div>
            <h3 class="typeName">相关案例</h3>
            <el-divider ></el-divider>
            <div style="display: flex;align-items: center;">
              <template v-for="(item,key) in thematicItem.relatedCases" :key="key">
                <el-card :body-style="{ padding: '0px'}" class="caseCard hvr-grow" @click="toCase(item.path)">
                  <el-image class="caseImage"  :src="item.thumbnail"></el-image>
                  <div style="display: flex;justify-content: center;">
                    <span>{{item.name}}</span>
                  </div>
                </el-card>
              </template>
<!--              <el-tag-->
<!--                  v-for="tag in dynamicTags"-->
<!--                  :key="tag"-->
<!--                  class="mx-1"-->
<!--                  closable-->
<!--                  :disable-transitions="false"-->
<!--                  @close="handleClose(tag)"-->
<!--              >-->
<!--                {{ tag }}-->
<!--              </el-tag>-->
<!--              <el-input-->
<!--                  v-if="inputVisible"-->
<!--                  ref="InputRef"-->
<!--                  v-model="inputValue"-->
<!--                  class="input-new-tag"-->
<!--                  size="small"-->
<!--                  @keyup.enter="handleInputConfirm"-->
<!--                  @blur="handleInputConfirm"-->
<!--              />-->
<!--              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">-->
<!--                + New Case-->
<!--              </el-button>-->

            </div>
            <div class="dataBlock">
              请在此处创建与该专题相关的案例
              <el-button :icon="Plus" size="large"  class="hvr-grow" plain></el-button>
            </div>
          </div>
          <div>
            <h3 class="typeName">相关数据</h3>
            <el-divider ></el-divider>
            <div style="display: flex;align-items: center;">
              <template v-for="(item,key) in thematicItem.relatedData" :key="key">
                <el-card :body-style="{ padding: '0px'}" class="caseCard hvr-grow">
                  <el-image class="caseImage"  :src="item.thumbnail"></el-image>
                  <div style="display: flex;justify-content: center;">
                    <span>{{item.name}}</span>
                  </div>
                </el-card>
              </template>
            </div>
            <div class="dataBlock">
              请在此处上传与该专题相关的数据
              <el-button :icon="Plus" size="large"  class="hvr-grow" plain></el-button>
            </div>
          </div>
          <div>
            <h3 class="typeName">问题描述</h3>
            <el-divider></el-divider>
            <div class="descriptionBlock">
              <template v-for="(item,key) in thematicItem.description" :key="key">
                <p v-if="item.type == 'text'" class="descriptionText">{{item.value}}</p>
                <div class="imageBlock">
                  <el-image v-if="item.type == 'image'" :src="item.value"></el-image>
                </div>
              </template>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script  setup>
import {nextTick,ref} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
const router = useRouter();
const toCase = (path) => {
  router.push("/case/" + path + "/");
}
const getCurrentNode = (checked,data) => {
  console.log("checked,data",checked,data)
  thematic.value.map(item=>{
    if(item.name == data.label){
        thematicItem.value = item
    }
  })
}

const modelTreeData = ref([]);
modelTreeData.value = [
  {
    label:"自然",
    children:[
      {
        label:"流域水循环及驱动机制",
        children:[
          {
            label:"流域生态环境演变",
          }, {
            label:"流域碳水耦合循环",
          },{
            label:"地表地下水耦合",
          },{
            label:"湖泊水环境监测",
          },
        ]
      },
      {
        label:"全球变化与区域环境演化",
        children:[
          {
            label:"海岸带变迁",
          }, {
            label:"河口海岸水动力",
          },{
            label:"湖泊碳循环",
          },{
            label:"土壤碳氮循环",
          },{
            label:"土壤氮转化过程及其环境效应",
          },
        ]
      },
      {
        label:"灾害响应与治理",
        children:[
          {
            label:"台风与风暴潮",
          }, {
            label:"洪涝水环境灾害",
          },{
            label:"湿地保护",
          },{
            label:"地质灾害",
          },{
            label:"大气污染",
          },
        ]
      },
    ]
  },
  {
    label:"人文",
    children: [
      {
        label: "城市化与人地关系协调发展",
        children:[
          {
            label:"城市扩张",
          }, {
            label:"农业生态",
          },{
            label:"人地关系",
          },{
            label:"城市水问题",
          },{
            label:"自然遗产",
          },
        ]
      }
    ]
  }
]
const handleNodeClick = () => {

}

const thematicItem = ref({});
const thematic = ref([])
thematic.value = [
  {
    name: "流域生态环境演变",
    introduction: "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
        "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。",
    classification: "自然",
    relatedCases:[
      {
        name:"SWMM",
        path:"SWMM",
        thumbnail:"http://localhost:3030/img/swmm.2f8c8c5d.png",
        description:"SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。"
      },{
        name:"长三角降雨预报专题",
        path:"rainForecast",
        thumbnail:"http://localhost:3030/img/rainForecast.d75c80f8.png",
        description:"长三角降雨预报专题"
      },{
        name:"SAGA1",
        path:"saga",
        thumbnail:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        description:"SAGA1"
      },
      {
        name:"SAGA2",
        path:"saga",
        thumbnail:"http://nnu.geodata.cn:8008/res/images/180131/1-1.jpg",
        description:"SAGA2"
      },{
        name:"SAGA3",
        path:"saga",
        thumbnail:"http://nnu.geodata.cn:8008/res/images/180131/2-4.jpg",
        description:"SAGA3"
      },
    ],
    relatedData:[
      {
        name:"shanghai DEM",
        thumbnail:"http://localhost:3030/img/map_1_3697_8171.ca8e9f30.jpg"
      },{
        name:"nanjing DEM",
        thumbnail:"http://localhost:3030/img/land1_2855_3514.fadfdab8.jpg"
      },{
        name:"shanghai landuse",
        thumbnail:"http://localhost:3030/img/v2-cd0df2d77622805c422b8c2fbdb02823_720w_7778.4a5e44c9.jpg"
      },{
        name:"shanghai Soil",
        thumbnail:"http://localhost:3030/img/v2-d36ccca3213e09091d17ec71e902cecc_720w_654.acd158a0.jpg"
      },{
        name:"shanghai DEM",
        thumbnail:"http://localhost:3030/img/map_1_3697_8171.ca8e9f30.jpg"
      },
    ],
    description: [
      {
        type: "text",
        value: "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
            "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。" + "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
            "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。"
      },
      {
        type: "image",
        value: "http://localhost:3030/img/%E6%B5%81%E5%9F%9F%E7%94%9F%E6%80%81%E7%8E%AF%E5%A2%83%E6%BC%94%E5%8F%98.ed4630ac.png"
      },
      {
        type: "text",
        value: "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
            "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
            "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。" + "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
            "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。"
      },
    ]
  }, {
    name: "流域碳水耦合循环",
    introduction: " 在气候变化背景下,人类和流域生态系统的水平衡及碳平衡已成为首要环境问题。气候变化深刻影响到碳水循环多过程及其多向反馈作用机制,进一步加剧水资源供需矛盾,导致生态系统的碳捕获能力降低。流域碳水循环的研究能够为水资源与生态环境保护规划提供直接支持,还能够为大型水利工程提供依据,具有较为显著的实践意义。",
    classification: "自然",
    relatedCases:[
      {
        name:"SWMM",
        thumbnail:"https://thumbs.dreamstime.com/b/%E7%A1%AB%E5%BE%AA%E7%8E%AF-%E7%94%9F%E7%89%A9%E5%9C%B0%E7%90%83%E5%8C%96%E5%AD%A6%E5%BE%AA%E7%8E%AF-%E6%95%99%E8%82%B2%E5%9B%BE%E8%A1%A8-%E7%9F%A2%E9%87%8F%E5%9B%BE%E6%8F%92%E5%9B%BE-%E5%9B%BE%E8%A1%A8%EF%BC%8C%E8%AF%B4%E6%98%8E-204195020.jpg",
        description:"SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。"
      },{
        name:"长三角降雨预报专题",
        thumbnail:"https://pic.weblogographic.com/img/news/759/why-are-biogeochemical-cycles-important_1.jpg",
        description:"长三角降雨预报专题"
      },{
        name:"SAGA1",
        thumbnail:"https://thumbs.dreamstime.com/b/%E7%A3%B7%E5%BE%AA%E7%8E%AF%E7%9F%A2%E9%87%8F%E5%9B%BE%E6%8F%92%E5%9B%BE-%E6%A0%87%E8%AE%B0%E7%9A%84%E5%9C%9F%E5%8C%96%E5%AD%A6%E5%85%83%E7%B4%A0%E6%96%B9%E6%A1%88-162944433.jpg",
        description:"SAGA1"
      },
      {
        name:"SAGA2",
        thumbnail:"https://useruploads.socratic.org/TP6jvxZRTcanaOxmORfu_phosphor.jpg",
        description:"SAGA2"
      },{
        name:"SAGA3",
        thumbnail:"http://www.encyclopedie-environnement.org/app/uploads/2017/08/Phosphore-eutrophisation_fig1_cycle-phosphore.jpg",
        description:"SAGA3"
      },
    ],relatedData:[

    ],
    description: [
      {
        type: "text",
        value: " 在气候变化背景下,人类和流域生态系统的水平衡及碳平衡已成为首要环境问题。气候变化深刻影响到碳水循环多过程及其多向反馈作用机制,进一步加剧水资源供需矛盾,导致生态系统的碳捕获能力降低。流域碳水循环的研究能够为水资源与生态环境保护规划提供直接支持,还能够为大型水利工程提供依据,具有较为显著的实践意义。"
      },
      {
        type: "image",
        value: "http://localhost:3030/img/%E6%B5%81%E5%9F%9F%E7%A2%B3%E6%B0%B4%E8%80%A6%E5%90%88%E5%BE%AA%E7%8E%AF.790c405b.png"
      },
      {
        type: "text",
        value: " 在气候变化背景下,人类和流域生态系统的水平衡及碳平衡已成为首要环境问题。气候变化深刻影响到碳水循环多过程及其多向反馈作用机制,进一步加剧水资源供需矛盾,导致生态系统的碳捕获能力降低。流域碳水循环的研究能够为水资源与生态环境保护规划提供直接支持,还能够为大型水利工程提供依据,具有较为显著的实践意义。"
      },
    ]
  }
]
thematicItem.value = thematic.value[0]

const inputValue = ref('')
const dynamicTags = ref(['SWMM', 'SWMM', 'SWMM'])
const inputVisible = ref(false)
const InputRef = ("")

const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    // InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>

<style lang="less" scoped>
.about{
  top: 7.46vh;
  background-color: white;
  overflow: scroll;
}
.caseImage{
  height: 10vh;
  width: 16vh;
}
.caseCard{
  margin-right: 20px;
  width: 16vh;
  cursor: pointer;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  //height: 32px;
  //line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.dataBlock{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.descriptionBlock{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.descriptionText{
  text-indent: 2em;
}
.imageBlock{
  width: 30vw;
  margin-bottom: 15px;
  animation: scale-in-center 1s  both;
  box-shadow:10px -8px 15px rgba(0, 0, 0, 0.2);
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

.thematicName{
    //margin-top: 5vh;
}
.typeName {
  animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
  border-left: 8px solid #4ba0ff;
  padding: 0 15px;
  //color:#525C8E ;
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
.hvr-grow:hover, .hvr-grow:focus, .hvr-grow:active {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
/deep/.el-card__header{
  text-align: center;
  font-size: 1.2em;
  padding: 10px 15px;
  background-color: lightgray;
}
</style>
