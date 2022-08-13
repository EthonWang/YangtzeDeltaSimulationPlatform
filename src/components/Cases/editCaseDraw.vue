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
    <el-row class="editDialogRow">
      <span>所属专题:</span>
      <el-col :span="20" :offset="1">
        <el-input
            v-model="editingCases.theme"
            placeholder="请输入案例所属专题"
        ></el-input>
      </el-col
      >
    </el-row>
    <el-row class="editDialogRow"
    ><span>问题简介:</span
    >
      <el-col :span="20" :offset="1"
      >
        <el-input
            v-model="editingCases.introduction"
            type="textarea"
            placeholder="请输入案例简介"
            :autosize="{ minRows: 2, maxRows: 4 }"
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
            v-model="editingCases.thumbnail"
            style="width: 100%"
        ></el-input>
        <el-upload
            ref="upload"
            class="upload-demo"
            style="width: 30%"
            :action="baseUrl+'/uploadThemeImg'"
            method="post"
            :on-success="handleSuccess"
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
      <el-button :icon="Plus" size="default" @click="newDescription('text')"  plain>添加文字描述</el-button>
      <el-button :icon="Plus" size="default" @click="newDescription('image')"  plain>添加图片描述</el-button>
    </el-row>
    <template v-for="(item,key) in editingCases.description" :key="key">
      <el-row v-if="item.type == 'text'" class="editDialogRow">
        <span>问题描述:</span>
        <el-col :span="20" :offset="1" style="align-items: center">
          <el-input
              style="width: 90%"
              v-model="item.value"
              type="textarea"
              placeholder="请输入问题描述"
              :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
          <el-icon
              style="cursor: pointer; margin-left: 2%"
              @click="deleteDescription('text', key)"
              :size="20"
          >
            <Delete
            />
          </el-icon>
        </el-col>
      </el-row>
      <el-row v-if="item.type == 'image'" class="editDialogRow">
        <span>相关图片:</span>
        <el-col
            style="display: flex; flex-direction: row"
            :span="20"
            :offset="1"
        >
          <el-input
              placeholder="请上传案例缩略图"
              v-model="item.imageName"
              style="width: 90%"
          ></el-input>
          <el-upload
              ref="upload"
              class="upload-demo"
              :action="baseUrl+'/uploadThemeImg'"
              :limit="1"
              method="post"
              :on-success="uploadDescImg"
              :auto-upload="true"
              :show-file-list="false"
          >
            <template #trigger>
              <el-button
                  :icon="Upload"
                  @click="addImage(key)"
                  type="success"
                  plain
              >上传图片
              </el-button
              >
            </template>
          </el-upload>
          <el-icon
              style="cursor: pointer; margin-left: 2%"
              @click="deleteDescription('image', key)"
              :size="20"
          >
            <Delete
            />
          </el-icon>
        </el-col>
      </el-row>
    </template>
    <el-divider>案例数据</el-divider>
    <el-row class="editDialogRow">
      <el-button :icon="Plus" @click="newCaseDataList"  plain>添加-移除数据条目</el-button>
    </el-row>
    <el-table v-show="dataListVisible" :data="tableData" table-layout="fixed" style="width: 100%" max-height="300" :row-key="Math.random()">
      <el-table-column prop="name" label="数据名称" />
      <el-table-column prop="imgWebAddress" label="缩略图"  width="80">
        <template #default="scope">
          <el-image style="width: 100%" :src="dataServer+scope.row.imgWebAddress" :preview-src-list="[dataServer+scope.row.imgWebAddress]"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template #default="scope">
          <el-button v-if="!scope.row.isAddToCase"   type="primary" size="small" @click="addToCase(scope.row)" >添加</el-button>
          <el-button v-else  type="warning" size="small" @click="removeCaseData(scope.$index,scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider>相关资料</el-divider>
    <el-row class="editDialogRow">
      <el-button :icon="Plus" @click="newRelatedResource"  plain>添加相关资料</el-button>
    </el-row>
    <template v-for="(item,key) in editingCases.relatedResource" :key="key">
      <el-row class="editDialogRow">
        <span>资源名称 :</span>
        <el-col :span="20" :offset="1">
          <el-input
              v-model="item.name"
              placeholder="请输入相关资料名称"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="editDialogRow">
        <span>资源链接 :</span>
        <el-col :span="20" :offset="1">
          <el-input
              v-model="item.url"
              placeholder="请输入资源链接"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="editDialogRow">
        <span>资源描述 :</span>
        <el-col :span="20" :offset="1">
          <el-input
              v-model="item.description"
              placeholder="请输入资源描述"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="editDialogRow">
        <el-button style="width: 100%" type="warning"  size="small" @click="deleteRelatedResource(key)"  round>删除</el-button>
      </el-row>
    </template>
    <el-divider>作者信息</el-divider>
    <el-row class="editDialogRow">
      <el-button :icon="Plus" @click="newCaseAuthor"  plain>添加作者信息</el-button>
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
import {useStore} from "vuex";
import {Plus,Upload} from '@element-plus/icons-vue'
import axios from "axios";
const store = useStore();
const dataServer = store.getters.devIpAddress;
const emit = defineEmits(["saveCase"]);
const newCasesVisible = ref(false);
const editingCases = ref({})
const props = defineProps({
  editingCaseInfo:{},
  title:{},
  theme: {},
})
const baseUrl = store.state.devBackIp;

const tableData = ref([])
//案例数据条目的增加与删除
const dataListVisible = ref(false)
const newCaseDataList = () => {
  dataListVisible.value = true;
  getResourceData();
}
const addToCase = (row) => {
  row.isAddToCase = true;
  if(editingCases.value.resourceDataList == null){
    editingCases.value.resourceDataList = [];
    //存入案例中的数据信息
    editingCases.value.resourceDataList.push({
      name:row.id,
      id:row.id
    })
  }else {
    editingCases.value.resourceDataList.push({
      name:row.name,
      id:row.id
    })
  }
}
const removeCaseData = (index,row) => {
  row.isAddToCase = false;
  let newDataList = editingCases.value.resourceDataList.filter(item=>{
    if (item.id != row.id){
      return true;
    }
  });
  editingCases.value.resourceDataList = newDataList;
}
//根据专题查询所有数据列表
const getResourceData = () => {
  tableData.value = [];
  let DTO = {
    asc: false,
    page: 1,
    pageSize: 16,
    searchText: "",
    sortField: "createTime",
    tagClass: "problemTags",
    tagName: props.theme,
  };
  axios({
    url: dataServer + "/getResourceDataList",
    method: "post",
    //忽略contentType
    contentType: false,
    //取消序列换 formData本来就是序列化好的
    processData: false,
    dataType: "json",
    data: DTO,
  }).then(
      (res) => {
        let resourceData = res.data.data.content;
        for(let i in resourceData){
          let item = resourceData[i];
          tableData.value.push({
            name:item.name,
            id:item.id,
            imgWebAddress:item.imgWebAddress,
            isAddToCase:false,
          })
        }
        for(let i in editingCases.value.resourceDataList){
          let caseData = editingCases.value.resourceDataList[i];
          for(let j in tableData.value){
            let row = tableData.value[j];
            if(row.id == caseData.id){
              row.isAddToCase = true;
            }
          }
        }
      },
      (err) => {
        console.log(err);
      }
  );
}
const deleteCaseDataList = (key) => {
  editingCases.value.dataList.splice(key,1)
}
//作者信息的创建与删除
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
//相关资料的上传与删除
const newRelatedResource = () => {
  if(editingCases.value.relatedResource != null){
    editingCases.value.relatedResource.push({
      name:"",
      url:"",
      description:""
    })
  }else {
    editingCases.value.relatedResource = []
    editingCases.value.relatedResource.push({
      name:"",
      url:"",
      description:""
    })
  }

}
const deleteRelatedResource = (key) => {
  editingCases.value.relatedResource.splice(key,1)
}

//案例描述的上传与删除
const newDescription = (type) => {
  if (type == "text") {
    editingCases.value.description.push({
      type: "text",
      value: "",
    });
  } else {
    editingCases.value.description.push({
      type: "image",
      value: "",
    });
  }
};
const deleteDescription = (type, key) => {
  if (type == "text") {
    editingCases.value.description.splice(key, 1);
  } else {
    editingCases.value.description.splice(key, 1);
  }
};
//用于标识当前案例或者描述的索引
const tempKey = ref("");
const addImage = (key) => {
  tempKey.value = key;
};
const uploadDescImg = (res, uploadFile) => {
  let descriptionTemp = editingCases.value.description;
  let key = tempKey.value;
  descriptionTemp[key].value = res.data.imgWebPath;
  descriptionTemp[key].imageName = uploadFile.name;
  editingCases.value.description = descriptionTemp;
};
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
  dataListVisible.value = false;
}

//负责提交创建或更新
const handleSave = () => {
  emit("saveCase",editingCases.value)
}

//上传图片
const handleSuccess = (res, uploadFile) => {
  let editingCase = editingCases.value;
  editingCase.thumbnail = res.data.imgWebPath;
  // editingCase.imageName = uploadFile.name;
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
