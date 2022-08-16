<template>
  <div style="" class="user-span">
    <img
      class="img-ava"
      src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.ntimg.cn%2F20140727%2F6608733_095451721000_2.jpg&refer=http%3A%2F%2Fpic.ntimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662540904&t=bf172540a1b26f7eb55b539080c3b0a1"
      alt=""
      v-if="userAvatar==null"
    />
    <img
      class="img-ava"
      :src="devServer+userAvatar"
      alt=""
      v-else
    />
    <el-upload
    v-model:file-list="fileList_ava"
    class="upload-demo"
    action=""
    :limit="1"
    :before-upload="beforeUploadAvatar"
    :auto-upload="true"
  >
   <el-button round style="position: absolute; top: 15vw;right: 5%;display: flex;align-items: center;background: hsl(0, 0%, 90%);">
      <el-icon><Camera /></el-icon>&nbsp;更换
    </el-button>

  </el-upload>
    
    <div class="infoSpan">
      <h4>{{ data.name }}</h4>
      <span style="color: gray">{{ data.email }}</span
      ><br />
      <span style="font-size: 19px;">{{ data.introduction }} </span><br />
    </div>
    <el-button
      type="primary"
      @click="dialogFormVisible = true"
      style="width: 88%; margin: 0.8vh"
      >编辑信息</el-button
    >
    <div class="otherSpan">
      <span>机构：</span><span>{{ data.instruction }}</span
      ><br />
      <span>地址：</span><span>{{ data.adress }} </span><br />
      <span>手机号：</span><span>{{ data.phone }} </span><br />
    </div>
    <el-button
      @click="logout()"
      style="
        width: 88%;
        color: white;
        margin: 0.8vh;
        background-color: hsl(0, 100%, 70%);
      "
      >登出</el-button
    >
    <el-dialog v-model="dialogFormVisible" title="Shipping address">
      <el-form :model="data">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="data.name" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="data.email" autocomplete="off" />
        </el-form-item> -->
        <el-form-item label="自我介绍" :label-width="formLabelWidth">
          <el-input v-model="data.introduction" autocomplete="off" />
        </el-form-item>
        <el-form-item label="机构" :label-width="formLabelWidth">
          <el-input v-model="data.instruction" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="data.adress" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="data.phone" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUserInfo()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import userApi from "@/api/user/user";
import { ElMessage } from "element-plus/lib/components";
import dataAPI from "@/api/user/data";
import {userAvatar} from "@/assets/user/scienceChoose"

const dataApi = new dataAPI();
const api = new userApi();
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const router = useRouter(); //路由直接用router.push(...)
const route = useRoute();
const store = useStore(); //vuex直接用store.commit
const devServer=ref(store.getters.devIpAddress_backup)
const user_info = JSON.parse(localStorage.getItem("userInfo"));
const fileList_ava=reactive([])
const data = reactive({
  name: "ZZZ",
  email: "zzz@myzzz.zzz",
  introduction: "个人介绍是用来介绍自己的，所以要用个人介绍来介绍自己。",
  data_num: 5,
  instruction: "",
  model_num: 5,
  task_num: 50,
  phone: "",
  adress: "",
});
data.name = user_info.name;
data.email = user_info.email;
data.introduction = user_info.introduction;
data.instruction = user_info.instruction;

const beforeUploadAvatar=(rawFile)=>{
  console.log(1);
   if (rawFile.type !== 'image/jpeg'&&rawFile.type !== 'image/png') {
    ElMessage.error('请使用jpg或png格式')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('头像请控制在 5MB 以内')
    return false
  }
 
  let form=new FormData()
  form.append("userPic", rawFile)
  api.uploadAvatar(user_info.id,form).then((res)=>{
    api.getUserInfo(user_info.email).then((res)=>{
      ElMessage({
        type:'success',
        message:'成功'
      })
      localStorage.setItem("userInfo", JSON.stringify(res.data.data));
      user_info.avatar=res.data.data.avatar
      userAvatar.value=res.data.data.avatar
       return true
    })
  })
}
const logout = () => {
  localStorage.clear();
  router.push("/login");
  setTimeout(()=>{
    location.reload();
  },200)
  
};
const init = () => {
  if (route.path != "/user/data") {
    document.getElementsByClassName("user-info")[0].style.opacity = 1;
  }
};
const updateUserInfo = () => {
  let userNewInfo = user_info;
  userNewInfo.name = data.name;
  userNewInfo.introduction = data.introduction;
  userNewInfo.instruction = data.instruction;
  userNewInfo.phone = data.phone;
  userNewInfo.adress = data.adress;
  api.editUserInfo(userNewInfo).then((res) => {
    dialogFormVisible.value = false;
    localStorage.setItem("userInfo", JSON.stringify(userNewInfo));
    ElMessage({
      type: "success",
      message: "用户信息更新成功",
    });
  });
};


setTimeout(init, 109);
</script>

<style lang="less" scoped>
.user-span {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
}
// 兼容css
.img-ava {
  color: aliceblue;
  width: 16vw;
  height: 16vw;
  // height: calc( $width + 0px);
  // height: $width;
  margin-right: 8px;
  margin-top: 2%;
  margin-bottom: 4%;
  border-radius: 50%;
  background-color: rgb(20, 20, 20);
}

.infoSpan {
  text-align: left;
  margin-left: 5%;
  margin-right: 2.5%;
  line-height: 150%;
  font-size: 20px;
  width: 90%;
  h4 {
    margin: 0;
    font-size: 28px;
  }
}
.otherSpan {
  width: 90%;
  text-align: left;
  margin-left: 5%;
  margin-right: 2.5%;
  line-height: 150%;
  font-size: 18px;
}
</style>