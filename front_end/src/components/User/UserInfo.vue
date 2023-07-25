<template>
  <div style="" class="user-span">
    <img
      class="img-ava"
      src="../../assets/img/icon/avator.png"
      alt=""
      v-if="userAvatar == null"
    />
    <img class="img-ava" :src="devServer + userAvatar" alt="" v-else />
    <el-upload
      v-model:file-list="fileList_ava"
      :show-file-list="false"
      class="upload-demo"
      action=""
      accept="image/jpg,image/jpeg,image/png"
      :limit="1"
      :before-upload="beforeUploadAvatar"
      :auto-upload="true"
    >
      <el-button
        round
        style="
          position: absolute;
          top: 15vw;
          right: 5%;
          display: flex;
          align-items: center;
          background: hsl(0, 0%, 90%);
        "
      >
        <el-icon><Camera /></el-icon>&nbsp;更换
      </el-button>
    </el-upload>

    <div class="infoSpan">
      <h4>{{ data.name }}</h4>
      <span style="color: gray">{{ data.email }}</span
      ><br />
      <span style="font-size: 19px">{{ data.introduction }} </span><br />
    </div>
    <el-button
      type="primary"
      @click="dialogFormVisible = true"
      style="width: 88%; margin: 0.8vh"
      >编辑信息</el-button
    >
    <div class="otherSpan">
      <span>机构：</span><span style="color: gray">{{ data.institution }}</span
      ><br />
      <span>地址：</span><span style="color: gray">{{ data.address }} </span><br />
      <span>联系方式：</span><span style="color: gray">{{ data.phone }} </span><br />
    </div>
    <el-button
      @click="logout()"
      type="danger"
      style="
        width: 88%;
        margin: 0.8vh;
      "
      >登出</el-button
    >
    <el-dialog v-model="dialogFormVisible" title="编辑信息">
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
          <el-input v-model="data.institution" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="data.address" autocomplete="off" />
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
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
import { userAvatar } from "@/assets/user/scienceChoose";
import { Encrypt, Decrypt } from "@/util/codeUtil";
import { ElLoading } from "element-plus";

const dataApi = new dataAPI();
const api = new userApi();
const userInfo = JSON.parse(Decrypt(localStorage.getItem("userInfo")));
console.log("userinfo is :",userInfo);
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const router = useRouter(); //路由直接用router.push(...)
const route = useRoute();
const store = useStore(); //vuex直接用store.commit
const devServer = ref(store.getters.devIpAddress_backup);
const user_info = JSON.parse(Decrypt(localStorage.getItem("userInfo")));
const fileList_ava = reactive([]);
const data = reactive({
  name: user_info.name,
  email: user_info.email,
  introduction: user_info.introduction,
  data_num: 5,
  institution: user_info.institution,
  model_num: 5,
  task_num: 50,
  phone: user_info.phone,
  address: user_info.address,
});

const beforeUploadAvatar = (rawFile) => {
  console.log(1);
  if (rawFile.type !== "image/jpg"&&rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("请使用jpg/jpeg或png格式");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("头像请控制在 5MB 以内");
    return false;
  }

  let form = new FormData();
  form.append("userPic", rawFile);
  api.uploadAvatar(user_info.id, form).then((res) => {
    api.getUserInfo(user_info.email).then((res) => {
      ElMessage({
        type: "success",
        message: "成功",
      });
      localStorage.setItem("userInfo", Encrypt(JSON.stringify(res.data.data)));
      user_info.avatar = res.data.data.avatar;
      userAvatar.value = res.data.data.avatar;
      return true;
    });
  });
};
const logout = () => {
  //清理本地缓存，保留原始relation（与topbar/relationjs配合）
  // 保留webpack
  let relationCrypt=localStorage.getItem("relation")
  let webServer=localStorage.getItem("loglevel:webpack-dev-server")
  localStorage.clear();
  localStorage.setItem("relation",relationCrypt)
  localStorage.setItem("loglevel:webpack-dev-server",webServer)
  

  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  setTimeout(() => {
    router.push("/login");
    setTimeout(() => {
      loading.close();
    }, 400);
  }, 200);
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
  userNewInfo.institution = data.institution;
  userNewInfo.phone = data.phone;
  userNewInfo.address = data.address;
  api.editUserInfo(userNewInfo).then((res) => {
    dialogFormVisible.value = false;
    console.log(res.data);
    localStorage.setItem("userInfo", Encrypt(JSON.stringify(res.data)));
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
  transition: all 1s;
  &:hover {
    filter: brightness(1.75);
  }
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