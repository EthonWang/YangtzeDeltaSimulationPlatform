<template>
  <div class="about">
    <el-row>
      <el-col :offset="4" :span="16">
        <div>
          <h2 class="thematicName">{{thematic.name}}</h2>
        </div>
        <el-row>
          <p>{{thematic.introduction}}</p>
        </el-row>
        <div>
          <h3 class="typeName">问题分类</h3>
          <el-divider ></el-divider>
          <div>
            <el-tag
                v-for="tag in dynamicTags"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
              + New Tag
            </el-button>
          </div>
        </div>
        <div>
          <h3 class="typeName">数据上传</h3>
          <el-divider ></el-divider>
          <div class="dataBlock">
            请在此处上传与该专题相关的数据
            <el-button :icon="Plus" size="large"  class="hvr-grow" plain></el-button>
          </div>
        </div>
        <div>
          <h3 class="typeName">问题描述</h3>
          <el-divider></el-divider>
          <div class="descriptionBlock">
            <template v-for="(item,key) in thematic.description" :key="key">
              <p v-if="item.type == 'text'">{{item.value}}</p>
            </template>
            <div class="imageBlock">
              <el-image fit="fill"  :src="image1" ></el-image>
            </div>
            <div class="imageBlock">
              <el-image fit="fill" :src="image1" ></el-image>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script  setup>
import {nextTick,ref} from 'vue'
import {Plus} from '@element-plus/icons-vue'

const image1 = require("@/assets/problem/流域生态环境演变.png")

const thematic = ref({})
thematic.value = {
  name:"流域生态环境演变",
  introduction:"随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
      "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。",
  classification:"自然",
  description:[
    {
      type:"image",
      value:"@/assets/problem/流域生态环境演变.png"
    },
    {
      type: "text",
      value:"随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
          "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。"+"随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
          "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。"
    },
    {
      type: "text",
      value:"随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
          "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。"
    },

  ]
}

const inputValue = ref('')
const dynamicTags = ref(['自然', '自然', '自然'])
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
}
.descriptionBlock{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
    margin-top: 5vh;
}
.typeName {
  animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
  border-left: 8px solid #4ba0ff;
  padding: 0 15px;
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
</style>
