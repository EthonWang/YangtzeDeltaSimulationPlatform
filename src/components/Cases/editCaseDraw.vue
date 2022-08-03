<template>
  <el-drawer
      v-model="newCasesVisible"
      :title="title" width="35%"
      destroy-on-close="true"
      @open="showCase"
  >
    <el-row class="editDialogRow">
      <span>案例名称:</span>
      <el-col :span="20" :offset="1">
        <el-input
            v-model="editingCases.name"
            placeholder="请输入案例名称"
        ></el-input>
      </el-col
      >
    </el-row>
    <el-row class="editDialogRow"
    ><span>Path名称:</span
    >
      <el-col :span="20" :offset="1"
      >
        <el-input
            v-model="editingCases.path"
            placeholder="案例在系统对应的vue文件名"
        ></el-input>
      </el-col
      >
    </el-row>
    <el-row class="editDialogRow"
    ><span>缩略图片:</span>
      <el-col
          style="display: flex; flex-direction: row"
          :span="20"
          :offset="1"
      >
        <el-input
            placeholder="请上传案例缩略图"
            v-model="editingCases.imageName"
            style="width: 100%"
        ></el-input>
        <el-upload
            ref="upload"
            class="upload-demo"
            style="width: 30%"
            action="/back/uploadThemeImg"
            method="post"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :auto-upload="true"
            :show-file-list="false"
        >
          <template #trigger>
            <el-button :icon="Upload" type="success" plain
            >上传图片
            </el-button
            >
          </template>
        </el-upload>
      </el-col>
    </el-row>
    <el-divider>案例描述</el-divider>
    <el-row class="editDialogRow">
      <el-button :icon="Plus" size="large" @click="newCaseDescList"  plain>添加案例描述</el-button>
    </el-row>
    <template v-for="(item,key) in editingCases.description" :key="key">
      <el-row class="editDialogRow"
      ><span>案例描述:</span
      >
        <el-col :span="20" :offset="1"
        >
          <el-input
              v-model="item.value"
              placeholder="请输入案例描述"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-col
        >
      </el-row>
      <el-row class="editDialogRow">
        <el-button style="width: 100%" type="warning"  size="small" @click="deleteCaseDescList(key)"  round>删除</el-button>
      </el-row>
    </template>
    <el-divider>案例数据</el-divider>
    <el-row class="editDialogRow">
      <el-button :icon="Plus" size="large" @click="newCaseDataList"  plain>添加数据条目</el-button>
    </el-row>
    <template v-for="(item,key) in editingCases.dataList" :key="key">
      <el-row class="editDialogRow">
        <span>数据名称 :</span>
        <el-col :span="20" :offset="1">
          <el-input
              v-model="item.name"
              placeholder="数据名称"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="editDialogRow">
        <span>数据类型 :</span>
        <el-col :span="20" :offset="1">
          <el-input
              v-model="item.type"
              placeholder="数据类型"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="editDialogRow">
        <el-button style="width: 100%" type="warning"  size="small" @click="deleteCaseDataList(key)"  round>删除</el-button>
      </el-row>
    </template>
    <el-divider>作者信息</el-divider>
    <el-row class="editDialogRow">
      <el-button :icon="Plus" size="large" @click="newCaseAuthor"  plain>添加作者信息</el-button>
    </el-row>
    <template v-for="(item,key) in editingCases.caseAuthor" :key="key">
      <el-row class="editDialogRow">
        <span>作者名称 :</span>
        <el-col :span="20" :offset="1">
          <el-input
              v-model="item.name"
              placeholder="作者名称"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="editDialogRow">
        <span>作者单位 :</span>
        <el-col :span="20" :offset="1">
          <el-input
              v-model="item.workPlace"
              placeholder="作者单位"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="editDialogRow">
        <span>作者邮箱 :</span>
        <el-col :span="20" :offset="1">
          <el-input
              v-model="item.email"
              placeholder="作者邮箱"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="editDialogRow">
        <el-button style="width: 100%" type="warning"  size="small" @click="deleteCaseAuthor(key)"  round>删除</el-button>
      </el-row>
    </template>
    <el-row class="editDialogRow">
      <el-button
          type="warning"
          size="default"
          @click="cancelCase"
      >取消
      </el-button
      >
      <el-button
          type="success"
          size="default"
          @click="handleSave"
      >保存
      </el-button>
    </el-row>
  </el-drawer>
</template>
<script setup>
import {defineProps, defineEmits, defineExpose, ref, onMounted} from "vue";
import {Plus,Upload} from '@element-plus/icons-vue'

const emit = defineEmits(["saveCase"]);
const newCasesVisible = ref(false);
const editingCases = ref({})
const props = defineProps({
  editingCaseInfo:{},
  title:{},
})

//案例数据条目的增加与删除
const newCaseDataList = () => {
  editingCases.value.dataList.push({
    name:"",
    type:""
  })
}
const deleteCaseDataList = (key) => {
  editingCases.value.dataList.splice(key,1)
}
const newCaseAuthor = () => {
  editingCases.value.caseAuthor.push({
    name:"",
    workPlace:"",
    email:""
  })
}
const deleteCaseAuthor = (key) => {
  editingCases.value.caseAuthor.splice(key,1)
}
const newCaseDescList = () => {
  editingCases.value.description.push({
    value:""
  })
}
const deleteCaseDescList = (key) => {
  editingCases.value.description.splice(key,1)
}

//打开关闭组件显示
const showCase = () => {
  editingCases.value = props.editingCaseInfo;
  newCasesVisible.value = true;
}
const cancelCase = () => {
  newCasesVisible.value = false;
}

//负责提交创建或更新
const handleSave = () => {
  emit("saveCase",editingCases.value)
}

//上传图片
const handleSuccess = (res, uploadFile) => {
  let editingCase = editingCases.value;
  editingCase.thumbnail = res.data.imgWebPath;
  editingCase.imageName = uploadFile.name;
  editingCases.value = editingCase;
  console.log("上传图片成功", res.data.imgWebPath);
};
defineExpose({showCase,cancelCase})

</script>

<style scoped>
.editDialogRow {
  align-items: center;
  margin-bottom: 15px;
  margin-top: 15px;
  justify-content: center;
}
</style>
