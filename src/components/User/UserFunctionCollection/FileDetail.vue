<template>
  <div class="about">
    <div class="file-detail">
      <h3 style="width: 50%">数据详情</h3>
      <span style="width: 50%; position: absolute; top: 22px; right: 0%"
        >已选中{{ props.num }}个数据</span
      >

      <h4>{{ props.file.name }}</h4>
      <el-tag
        v-for="tag in props.file.problemTags"
        :key="tag"
        effect="plain"
        style="margin-bottom: 5px; margin-right: 5px"
        >{{ tag }}
      </el-tag>
      <el-tag
        v-if="props.file.problemTags.length==0"
        effect="plain"
        style="margin-bottom: 5px; margin-right: 5px"
        >未分类
      </el-tag>
      <br /><br />
      <el-switch
        disabled
        v-model="value1"
        class="mb-2"
        active-text="公有"
        inactive-text="私有"
      />
      <p v-if="!re_des">
        <el-button
          disabled
          circle
          style="height: 25px; width: 25px; cursor: default"
          ><el-icon><EditPen /></el-icon></el-button
        ><span style="color: black;">{{ props.file.description }}</span>
        <span v-if="props.file.description==''" style="color: black;">暂无描述</span>
      </p>
      <span
        style="
          position: relative;
          font-size: 16px;
          width: 100%;
          display: flex;
          margin: 15px 0 22px 0;
        "
        v-if="re_des"
        ><el-input
          autosize
          v-model="new_des"
          maxlength="100"
          placeholder="请命名"
          type="textarea"
          @keyup.enter="changeDes"
          show-word-limit
          style="text-align: center"
        /><el-button
          style="
            width: 10px;
            border: 0;
            position: absolute;
            background: transparent;
            right: 5px;
            bottom: -30px;
            color: hsl(220, 100%, 50%);
          "
          @click="changeDes"
          ><el-icon><FolderChecked /></el-icon
        ></el-button>
      </span>

      <span>创建时间：{{ props.file.time }}</span
      ><br />
      <span>数据类型：{{ props.file.name.split('.')[1] }}</span
      ><br />
      <span>数据作者：{{ props.file.author }}</span
      ><br />
      <el-button
        style="margin-top: 10%; width: 100%"
        @click="dialogFormVisible = true"
        ><el-icon><EditPen /></el-icon>&nbsp;描述数据</el-button
      ><br />
      <el-button
        text
        @click="dialogVisible1 = !dialogVisible1"
        style="margin-top: 2%; width: 100%"
        ><el-icon><Share /></el-icon>&nbsp;知识图谱</el-button
      ><br>
      <el-button style="margin-top: 2%; width: 100%" type="success" @click="addToTask()"
        ><el-icon><CirclePlusFilled /></el-icon>&nbsp;加入实验室({{props.num}})</el-button
      ><br />
      <el-button style="margin-top: 2%; width: 100%" type="primary" @click="downloadData"
        ><el-icon><Download /></el-icon>&nbsp;下载数据({{props.num}})</el-button
      ><br />
      <el-button style="margin-top: 2%; width: 100%" type="danger" @click="deleteData"
        ><el-icon><Delete /></el-icon>&nbsp;删除数据({{props.num}})</el-button
      ><br />
      
    </div>
    <el-dialog v-model="dialogFormVisible" title="数据描述" draggable>
      <el-form :model="form">
        <el-form-item label="数据名称" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            placeholder=""
            clearable
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="数据归属" :label-width="formLabelWidth">
          <el-tag
            v-for="tag in form.problemTags"
            :key="tag"
            class="mx-1"
            style="margin-right: 5px"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新增归属" :label-width="formLabelWidth">
          <el-tree-select :popper-append-to-body="false" v-model="add_tags" :data="options" multiple show-checkbox />
        </el-form-item>
        <el-form-item label="开放情况" :label-width="formLabelWidth">
          <el-switch
            v-model="form.publicBoolean"
            class="mb-2"
            active-text="公有"
            inactive-text="私有"
          />
        </el-form-item>
        <el-form-item label="数据简介" :label-width="formLabelWidth">
          <el-input
            autosize
            type="textarea"
            v-model="form.description"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="changeData">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible1" title="关系图谱" width="85%" draggable>
      <dataRelation class="relation" v-if="dialogVisible1"></dataRelation>
    </el-dialog>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps, defineEmits, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Api from "@/api/user/data";
import dataRelation from "./dataRelation.vue";
import { sciencePro } from "@/assets/data/home/sciencePro";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit

const show_relation = ref(false);
const api = new Api();
const props = defineProps({
  file: Object,
  num: Number,
});
const emit = defineEmits(["update:file","deleteData","downloadData1","addToTask"]);
const deleteData=()=>{
  emit("deleteData",)
}
const downloadData=()=>{
  emit("downloadData1",)
}
const addToTask=()=>{

  emit("addToTask",)
}
watch(form, (newValue, oldValue) => {
  emit("update:file", newValue);
});
watch(
  () => props.file,
  (newValue, oldValue) => {
    form.value = newValue;
  }
);

const add_tags = ref([]);

const options = Array.from({ length: sciencePro.length }).map((_, idx) => {
  const label = idx;
  return {
    value: sciencePro[label].name,
    label: sciencePro[label].name,
    children: Array.from({ length: sciencePro[label].children.length }).map(
      (_, idx1) => ({
        value: sciencePro[label].children[idx1].name,
        label: sciencePro[label].children[idx1].name,
      })
    ),
  };
});

const form = ref(props.file);
const dialogFormVisible = ref(false);
const dialogVisible1 = ref(false);
const formLabelWidth = "140px";

const value1 = computed(() => {
  return props.file.publicBoolean;
});
const new_des = ref(props.file.description);
const re_des = ref(false);
const changeDes = () => {
  re_des.value = !re_des.value;
};
const handleClose = (tag) => {
  form.value.problemTags.splice(form.value.problemTags.indexOf(tag), 1);
};

const changeData = () => {
  
  for (let it in add_tags.value) {
    let ii = 0;
    for (let j in form.value.tags) {
      if (add_tags.value[it] == form.value.problemTags[j]) {
        ii = 1;
        break;
      }
    }
    if (ii == 1) {
      continue;
    }
    form.value.problemTags.push(add_tags.value[it]);
  }
  dialogFormVisible.value = false;
  add_tags.value=[]
  // api.editFile();
};
</script>

<style lang="less" scoped>
// 兼容css
/deep/.el-select__popper.el-popper{
  z-index:20000 !important
}
.file-detail {
  padding: 0 5% 0 5%;
  text-align: left;
  height: 100%;
}
p {
  font-size: 16px;
  // text-indent: 2 * $font-size;
  line-height: 150%;
}
span {
  color: rgb(160, 160, 160);
}
.tag {
  position: relative;
  border: 0.5px solid rgb(197, 197, 197);
  padding: 2%;
  margin: 2% 2% 2% 0;
  font-size: 10px;
}
.relation {
  position: relative;
  // background: rgb(187, 102, 102);
  // left: 30vw;
  // top: 30vh;
  width: 80vw;
  height: 80vh;
  // box-shadow: 0 1px 12px rgba(35, 120, 247, 0.4);
}
</style>

